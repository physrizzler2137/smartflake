#!/usr/bin/env python3
"""
SMaRT-Lab Image Optimizer for Web
==================================
Batch-optimizes images for web viewing by:
  - Resizing to sensible max dimensions (preserving aspect ratio)
  - Converting to WebP (best compression) or optimized JPEG
  - Generating multiple sizes for responsive <picture> / srcset usage
  - Reporting before/after sizes

Usage:
  python optimize-images.py <input_dir_or_file> [options]

Examples:
  # Optimize all images in a folder, output WebP at max 2400px wide
  python optimize-images.py ./raw-photos

  # Optimize a single panorama, output both JPEG and WebP
  python optimize-images.py ./pano.jpg --formats webp,jpeg

  # Generate responsive variants (small, medium, large)
  python optimize-images.py ./raw-photos --responsive

  # Custom max width for panoramas
  python optimize-images.py ./raw-photos --max-width 3200 --quality 80

Requirements:
  pip install Pillow
"""

import argparse
import sys
from pathlib import Path
from dataclasses import dataclass

try:
    from PIL import Image, ImageOps
except ImportError:
    print("❌ Pillow is required. Install it with:")
    print("   pip install Pillow")
    sys.exit(1)


# ── Configuration ────────────────────────────────────────────────────────────

@dataclass
class OptimizeConfig:
    max_width: int = 2400          # Max width in pixels
    max_height: int = 1600         # Max height in pixels
    jpeg_quality: int = 82         # JPEG quality (1-100)
    webp_quality: int = 80         # WebP quality (1-100)
    formats: list = None           # Output formats: ['webp'], ['jpeg'], or ['webp', 'jpeg']
    responsive: bool = False       # Generate multiple sizes
    responsive_widths: list = None # Widths for responsive variants
    strip_metadata: bool = True    # Remove EXIF data
    output_dir: str = None         # Output directory (default: <input>_optimized)

    def __post_init__(self):
        if self.formats is None:
            self.formats = ['webp']
        if self.responsive_widths is None:
            self.responsive_widths = [480, 960, 1440, 2400]


# ── Supported formats ───────────────────────────────────────────────────────

SUPPORTED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.tif', '.webp', '.gif'}


# ── Core optimization ───────────────────────────────────────────────────────

def optimize_image(input_path: Path, output_dir: Path, config: OptimizeConfig) -> list:
    """Optimize a single image. Returns list of (output_path, original_size, new_size)."""
    results = []

    try:
        img = Image.open(input_path)
    except Exception as e:
        print(f"  ⚠️  Skipping {input_path.name}: {e}")
        return results

    # Convert palette/RGBA images appropriately
    if img.mode == 'P':
        img = img.convert('RGBA')
    if img.mode == 'RGBA' and 'jpeg' in config.formats:
        # JPEG doesn't support alpha — composite onto white
        background = Image.new('RGB', img.size, (255, 255, 255))
        background.paste(img, mask=img.split()[3])
        img = background
    elif img.mode not in ('RGB', 'RGBA'):
        img = img.convert('RGB')

    # Strip EXIF but preserve orientation
    if config.strip_metadata:
        img = ImageOps.exif_transpose(img)

    original_size = input_path.stat().st_size
    stem = input_path.stem

    if config.responsive:
        # Generate multiple sizes
        for target_w in config.responsive_widths:
            if img.width <= target_w:
                # Don't upscale — use original size for this and all larger targets
                resized = img.copy()
                suffix = f"_{img.width}w"
            else:
                ratio = target_w / img.width
                target_h = int(img.height * ratio)
                resized = img.resize((target_w, target_h), Image.LANCZOS)
                suffix = f"_{target_w}w"

            for fmt in config.formats:
                out_path = output_dir / f"{stem}{suffix}.{fmt}"
                _save_image(resized, out_path, fmt, config)
                new_size = out_path.stat().st_size
                results.append((out_path, original_size, new_size))

            if img.width <= target_w:
                break  # No point generating larger variants
    else:
        # Single optimized output
        resized = img.copy()
        if img.width > config.max_width or img.height > config.max_height:
            resized.thumbnail((config.max_width, config.max_height), Image.LANCZOS)

        for fmt in config.formats:
            out_path = output_dir / f"{stem}.{fmt}"
            _save_image(resized, out_path, fmt, config)
            new_size = out_path.stat().st_size
            results.append((out_path, original_size, new_size))

    return results


def _save_image(img: Image.Image, path: Path, fmt: str, config: OptimizeConfig):
    """Save image in the specified format with optimal settings."""
    path.parent.mkdir(parents=True, exist_ok=True)

    if fmt == 'webp':
        # For WebP: use quality setting, enable alpha if present
        save_kwargs = {
            'format': 'WebP',
            'quality': config.webp_quality,
            'method': 6,  # Slowest but best compression
        }
        if img.mode == 'RGBA':
            save_kwargs['lossless'] = False
        img.save(path, **save_kwargs)

    elif fmt in ('jpg', 'jpeg'):
        rgb_img = img.convert('RGB') if img.mode == 'RGBA' else img
        rgb_img.save(path, format='JPEG', quality=config.jpeg_quality,
                     optimize=True, progressive=True)

    elif fmt == 'png':
        img.save(path, format='PNG', optimize=True)

    else:
        img.save(path)


# ── CLI & reporting ──────────────────────────────────────────────────────────

def format_size(size_bytes: int) -> str:
    """Human-readable file size."""
    if size_bytes < 1024:
        return f"{size_bytes} B"
    elif size_bytes < 1024 * 1024:
        return f"{size_bytes / 1024:.1f} KB"
    else:
        return f"{size_bytes / (1024 * 1024):.1f} MB"


def print_results(results: list):
    """Print a formatted summary table."""
    if not results:
        print("\n  No images processed.")
        return

    total_original = 0
    total_new = 0

    print("\n  ┌─────────────────────────────────────────────────────────────────────┐")
    print("  │  File                              Original    Optimized   Savings  │")
    print("  ├─────────────────────────────────────────────────────────────────────┤")

    for out_path, orig_size, new_size in results:
        name = out_path.name
        if len(name) > 34:
            name = name[:31] + "..."
        savings = (1 - new_size / orig_size) * 100 if orig_size > 0 else 0
        total_original += orig_size
        total_new += new_size

        print(f"  │  {name:<34} {format_size(orig_size):>8}  → {format_size(new_size):>8}   {savings:>5.1f}%  │")

    total_savings = (1 - total_new / total_original) * 100 if total_original > 0 else 0
    print("  ├─────────────────────────────────────────────────────────────────────┤")
    print(f"  │  {'TOTAL':<34} {format_size(total_original):>8}  → {format_size(total_new):>8}   {total_savings:>5.1f}%  │")
    print("  └─────────────────────────────────────────────────────────────────────┘")
    print()


def main():
    parser = argparse.ArgumentParser(
        description="🖼️  SMaRT-Lab Image Optimizer — compress images for blazing-fast web delivery",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s ./raw-photos                           # WebP at max 2400px
  %(prog)s ./raw-photos --formats webp,jpeg       # Both WebP and JPEG
  %(prog)s ./raw-photos --responsive              # Generate responsive sizes
  %(prog)s ./pano.jpg --max-width 3200 -q 85      # Custom width & quality
  %(prog)s ./raw-photos -o ./static/img/optimized  # Custom output directory
        """
    )
    parser.add_argument("input", help="Input file or directory containing images")
    parser.add_argument("-o", "--output", help="Output directory (default: <input>_optimized)")
    parser.add_argument("--max-width", type=int, default=2400, help="Maximum width in pixels (default: 2400)")
    parser.add_argument("--max-height", type=int, default=1600, help="Maximum height in pixels (default: 1600)")
    parser.add_argument("-q", "--quality", type=int, default=82, help="JPEG/WebP quality 1-100 (default: 82)")
    parser.add_argument("--formats", default="webp", help="Output formats, comma-separated: webp,jpeg,png (default: webp)")
    parser.add_argument("--responsive", action="store_true", help="Generate multiple responsive sizes (480, 960, 1440, 2400px)")
    parser.add_argument("--responsive-widths", help="Custom responsive widths, comma-separated (e.g. 320,640,1280)")
    parser.add_argument("--keep-metadata", action="store_true", help="Preserve EXIF metadata")

    args = parser.parse_args()

    input_path = Path(args.input).resolve()
    if not input_path.exists():
        print(f"❌ Input path does not exist: {input_path}")
        sys.exit(1)

    # Build config
    formats = [f.strip().lower() for f in args.formats.split(',')]
    config = OptimizeConfig(
        max_width=args.max_width,
        max_height=args.max_height,
        jpeg_quality=args.quality,
        webp_quality=args.quality,
        formats=formats,
        responsive=args.responsive,
        strip_metadata=not args.keep_metadata,
    )
    if args.responsive_widths:
        config.responsive_widths = [int(w.strip()) for w in args.responsive_widths.split(',')]

    # Determine output directory
    if args.output:
        output_dir = Path(args.output).resolve()
    elif input_path.is_dir():
        output_dir = input_path.parent / f"{input_path.name}_optimized"
    else:
        output_dir = input_path.parent / "optimized"
    output_dir.mkdir(parents=True, exist_ok=True)

    # Collect input files
    if input_path.is_file():
        files = [input_path]
    else:
        files = sorted([
            f for f in input_path.rglob('*')
            if f.suffix.lower() in SUPPORTED_EXTENSIONS and f.is_file()
        ])

    if not files:
        print(f"❌ No supported images found in: {input_path}")
        sys.exit(1)

    # Process
    print(f"\n🖼️  SMaRT-Lab Image Optimizer")
    print(f"   Input:    {input_path}")
    print(f"   Output:   {output_dir}")
    print(f"   Formats:  {', '.join(formats)}")
    print(f"   Max size: {config.max_width}×{config.max_height}px")
    print(f"   Quality:  {args.quality}")
    if config.responsive:
        print(f"   Responsive widths: {config.responsive_widths}")
    print(f"   Files:    {len(files)}")
    print()

    all_results = []
    for i, file_path in enumerate(files, 1):
        print(f"  [{i}/{len(files)}] Processing {file_path.name}...", end=" ", flush=True)
        results = optimize_image(file_path, output_dir, config)
        if results:
            best = min(results, key=lambda r: r[2])
            savings = (1 - best[2] / best[1]) * 100
            print(f"✅ {format_size(best[1])} → {format_size(best[2])} ({savings:.0f}% saved)")
        else:
            print("⏭️  skipped")
        all_results.extend(results)

    print_results(all_results)
    print(f"  📁 Optimized files saved to: {output_dir}\n")


if __name__ == "__main__":
    main()
