#!/usr/bin/env python3
"""
SMaRT-Lab Mega.nz Downloader & Optimizer Pipeline
===================================================
Downloads all mega.nz images referenced in the website's data files,
organizes them by category, and optionally optimizes them for web.

Usage:
  python download-mega-images.py                    # Download all
  python download-mega-images.py --optimize          # Download + optimize
  python download-mega-images.py --category team     # Download only team photos
  python download-mega-images.py --list              # Just list URLs without downloading

Requirements:
  pip install mega.py Pillow
"""

import argparse
import json
import re
import sys
import time
from pathlib import Path
from dataclasses import dataclass, field

try:
    from mega import Mega
except ImportError:
    print("❌ mega.py is required. Install it with:")
    print("   pip install mega.py")
    sys.exit(1)


# ── Configuration ────────────────────────────────────────────────────────────

SCRIPT_DIR = Path(__file__).parent.resolve()
PROJECT_ROOT = SCRIPT_DIR.parent
DATA_FILE = PROJECT_ROOT / "src" / "lib" / "data.ts"
REACT_DATA_FILE = PROJECT_ROOT / "src-react" / "lib" / "data.ts"
DEFAULT_OUTPUT = PROJECT_ROOT / "pictoolkit" / "mega_downloads"


@dataclass
class MegaImage:
    """Represents a single mega.nz hosted image."""
    url: str
    category: str       # facilities, equipment, team, group-photos
    name: str           # human-readable name
    variant: str = ""   # light, dark, hover, etc.
    filename: str = ""  # will be set after download


# ── URL Extraction ───────────────────────────────────────────────────────────

def extract_mega_urls_from_data() -> list[MegaImage]:
    """Extract all mega.nz URLs from the project's data files."""
    images: list[MegaImage] = []

    # Try Svelte data first, fall back to React data
    data_file = DATA_FILE if DATA_FILE.exists() else REACT_DATA_FILE
    if not data_file.exists():
        print(f"❌ No data file found at {DATA_FILE} or {REACT_DATA_FILE}")
        sys.exit(1)

    content = data_file.read_text(encoding="utf-8")

    # ── Facilities: header images ──
    # Match facility blocks with their names and mega URLs
    facility_pattern = re.compile(
        r"name:\s*['\"](.+?)['\"].*?"
        r"code:\s*['\"](.+?)['\"].*?"
        r"(?:lightImageUrl:\s*['\"](.+?)['\"])?.*?"
        r"(?:darkImageUrl:\s*['\"](.+?)['\"])?",
        re.DOTALL
    )
    for match in facility_pattern.finditer(content):
        name, code, light_url, dark_url = match.groups()
        slug = _slugify(f"{code}_{name[:40]}")
        if light_url and "mega.nz" in light_url:
            images.append(MegaImage(url=light_url, category="facilities", name=name, variant="light"))
        if dark_url and "mega.nz" in dark_url:
            images.append(MegaImage(url=dark_url, category="facilities", name=name, variant="dark"))

    # ── Equipment images ──
    equip_pattern = re.compile(
        r"\{\s*name:\s*['\"](.+?)['\"].*?megaUrl:\s*['\"](.+?)['\"]",
        re.DOTALL
    )
    for match in equip_pattern.finditer(content):
        eq_name, mega_url = match.groups()
        if "mega.nz" in mega_url:
            clean_name = re.sub(r"<br\s*/?>", " ", eq_name).strip()
            images.append(MegaImage(url=mega_url, category="equipment", name=clean_name))

    # ── Team member photos (from React data) ──
    react_content = ""
    if REACT_DATA_FILE.exists():
        react_content = REACT_DATA_FILE.read_text(encoding="utf-8")
    
    # Also check the bundled JS for team data
    team_pattern = re.compile(
        r"name:\s*['\\\"](.+?)['\\\"].*?"
        r"megaUrl:\s*['\\\"](.+?)['\\\"]"
        r"(?:.*?megaUrlHover:\s*['\\\"](.+?)['\\\"])?",
        re.DOTALL
    )
    
    search_content = react_content if react_content else content
    # Find team member blocks more precisely
    team_sections = re.findall(
        r"\{[^{}]*?name:\s*['\"]([^'\"]+)['\"][^{}]*?megaUrl:\s*['\"]([^'\"]+)['\"][^{}]*?"
        r"(?:megaUrlHover:\s*['\"]([^'\"]+)['\"])?[^{}]*?\}",
        search_content
    )
    for match in team_sections:
        member_name, mega_url, hover_url = match
        if mega_url and "mega.nz" in mega_url:
            images.append(MegaImage(url=mega_url, category="team", name=member_name, variant="default"))
        if hover_url and "mega.nz" in hover_url:
            images.append(MegaImage(url=hover_url, category="team", name=member_name, variant="hover"))

    # ── Group photos ──
    group_pattern = re.compile(
        r"year:\s*(\d{4}).*?megaUrl:\s*['\\\"](.+?)['\\\"]",
        re.DOTALL
    )
    group_sections = re.findall(r"groupPhotos:\s*\[(.+?)\]", search_content, re.DOTALL)
    for section in group_sections:
        for match in group_pattern.finditer(section):
            year, mega_url = match.groups()
            if "mega.nz" in mega_url:
                images.append(MegaImage(url=mega_url, category="group-photos", name=f"Group Photo {year}"))

    # Deduplicate by URL
    seen = set()
    unique = []
    for img in images:
        if img.url not in seen:
            seen.add(img.url)
            unique.append(img)

    return unique


# ── Download ─────────────────────────────────────────────────────────────────

def download_images(images: list[MegaImage], output_dir: Path, categories: list[str] | None = None):
    """Download all images from mega.nz."""
    mega = Mega()
    m = mega.login()  # Anonymous login

    filtered = images
    if categories:
        filtered = [img for img in images if img.category in categories]

    if not filtered:
        print("  No images to download.")
        return

    total = len(filtered)
    downloaded = 0
    skipped = 0
    failed = 0

    for i, img in enumerate(filtered, 1):
        cat_dir = output_dir / img.category
        cat_dir.mkdir(parents=True, exist_ok=True)

        # Generate filename
        slug = _slugify(img.name)
        if img.variant:
            slug = f"{slug}_{img.variant}"

        print(f"  [{i}/{total}] {img.category}/{slug}", end=" ", flush=True)

        # Check if already downloaded (any extension)
        existing = list(cat_dir.glob(f"{slug}.*"))
        if existing:
            print(f"⏭️  already exists ({existing[0].name})")
            skipped += 1
            continue

        try:
            # Download to temp, then rename
            result = m.download_url(img.url, dest_path=str(cat_dir))
            if result:
                dl_path = Path(result)
                # Rename to our slug
                ext = dl_path.suffix.lower() or ".jpg"
                final_path = cat_dir / f"{slug}{ext}"
                dl_path.rename(final_path)
                img.filename = str(final_path)
                size_kb = final_path.stat().st_size / 1024
                print(f"✅ ({size_kb:.0f} KB)")
                downloaded += 1
            else:
                print("❌ download returned None")
                failed += 1
        except Exception as e:
            print(f"❌ {e}")
            failed += 1

        # Brief pause to be nice to mega.nz
        if i < total:
            time.sleep(0.5)

    print(f"\n  📊 Summary: {downloaded} downloaded, {skipped} skipped, {failed} failed")


# ── Utilities ────────────────────────────────────────────────────────────────

def _slugify(text: str) -> str:
    """Convert text to a filesystem-safe slug."""
    text = re.sub(r"<[^>]+>", "", text)  # Strip HTML
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_]+", "_", text)
    text = re.sub(r"-+", "-", text)
    return text[:60].strip("_-")


def list_urls(images: list[MegaImage]):
    """Print a formatted list of all discovered URLs."""
    cats = {}
    for img in images:
        cats.setdefault(img.category, []).append(img)

    for cat, items in sorted(cats.items()):
        print(f"\n  📂 {cat.upper()} ({len(items)} images)")
        print(f"  {'─' * 60}")
        for img in items:
            variant = f" [{img.variant}]" if img.variant else ""
            name = img.name[:45]
            print(f"    {name}{variant}")
            print(f"      {img.url}")

    print(f"\n  Total: {len(images)} unique mega.nz images")


# ── CLI ──────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="📥 SMaRT-Lab Mega.nz Image Downloader — fetch all lab photos from mega.nz",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s                             # Download everything
  %(prog)s --list                      # List all URLs without downloading
  %(prog)s --category equipment        # Download only equipment photos
  %(prog)s --category team,facilities  # Download team + facilities
  %(prog)s --optimize                  # Download + optimize for web
  %(prog)s -o ./my-photos              # Custom output directory
        """
    )
    parser.add_argument("-o", "--output", help=f"Output directory (default: scripts/mega_downloads)")
    parser.add_argument("--list", action="store_true", help="List all discovered URLs without downloading")
    parser.add_argument("--category", help="Filter by category: facilities, equipment, team, group-photos (comma-separated)")
    parser.add_argument("--optimize", action="store_true", help="Run image optimizer after downloading")
    parser.add_argument("--optimize-quality", type=int, default=82, help="Quality for optimization (default: 82)")
    parser.add_argument("--optimize-max-width", type=int, default=2400, help="Max width for optimization (default: 2400)")

    args = parser.parse_args()

    print("\n📥 SMaRT-Lab Mega.nz Image Downloader")
    print("   Scanning data files for mega.nz URLs...\n")

    images = extract_mega_urls_from_data()

    if not images:
        print("  ❌ No mega.nz URLs found in data files.")
        sys.exit(1)

    if args.list:
        list_urls(images)
        return

    output_dir = Path(args.output).resolve() if args.output else DEFAULT_OUTPUT
    categories = [c.strip() for c in args.category.split(",")] if args.category else None

    print(f"   Found {len(images)} unique mega.nz images")
    if categories:
        count = sum(1 for img in images if img.category in categories)
        print(f"   Filtering to categories: {', '.join(categories)} ({count} images)")
    print(f"   Output: {output_dir}\n")

    download_images(images, output_dir, categories)

    if args.optimize:
        print("\n🖼️  Running image optimizer...")
        optimizer_script = SCRIPT_DIR / "optimize-images.py"
        if optimizer_script.exists():
            import subprocess
            cmd = [
                sys.executable, str(optimizer_script),
                str(output_dir),
                "--formats", "webp,jpeg",
                "-q", str(args.optimize_quality),
                "--max-width", str(args.optimize_max_width),
            ]
            subprocess.run(cmd)
        else:
            print(f"  ⚠️  Optimizer script not found at {optimizer_script}")

    print(f"\n  📁 Downloads saved to: {output_dir}\n")


if __name__ == "__main__":
    main()
