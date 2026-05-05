#!/usr/bin/env bash
#
# SMaRT-Lab Image Pipeline
# ========================
# Downloads all mega.nz images and optimizes them for web delivery.
#
# Usage:
#   ./pictoolkit/pipeline.sh              # Full pipeline (download + optimize)
#   ./pictoolkit/pipeline.sh --optimize   # Optimize only (skip download, use cached)
#   ./pictoolkit/pipeline.sh --download   # Download only (skip optimize)
#   ./pictoolkit/pipeline.sh --clean      # Remove all downloaded + optimized images
#
# Output:
#   pictoolkit/mega_downloads/   Raw originals from mega.nz (~175 MB)
#   static/img/facilities/       Optimized panoramas (WebP + JPEG, ~2.8 MB)
#   static/img/equipment/        Optimized thumbnails (WebP + JPEG, ~1.7 MB)
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT"

# ── Colors ──────────────────────────────────────────────────────────────────

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# ── Parse args ──────────────────────────────────────────────────────────────

DO_DOWNLOAD=true
DO_OPTIMIZE=true
DO_CLEAN=false

for arg in "$@"; do
  case "$arg" in
    --download)  DO_OPTIMIZE=false ;;
    --optimize)  DO_DOWNLOAD=false ;;
    --clean)     DO_CLEAN=true; DO_DOWNLOAD=false; DO_OPTIMIZE=false ;;
    --help|-h)
      echo "Usage: ./pictoolkit/pipeline.sh [--download|--optimize|--clean|--help]"
      exit 0
      ;;
  esac
done

# ── Clean ───────────────────────────────────────────────────────────────────

if $DO_CLEAN; then
  echo -e "${YELLOW}🧹 Cleaning all image artifacts...${NC}"
  rm -rf pictoolkit/mega_downloads
  rm -rf static/img/facilities
  rm -rf static/img/equipment
  echo -e "${GREEN}✅ Clean complete.${NC}"
  exit 0
fi

# ── Download ────────────────────────────────────────────────────────────────

if $DO_DOWNLOAD; then
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${CYAN}  STEP 1: Download from Mega.nz${NC}"
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  node pictoolkit/download-mega.mjs
fi

# ── Optimize ────────────────────────────────────────────────────────────────

if $DO_OPTIMIZE; then
  echo ""
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${CYAN}  STEP 2: Optimize for web${NC}"
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

  # Check raw downloads exist
  if [ ! -d "pictoolkit/mega_downloads/facilities" ] || [ ! -d "pictoolkit/mega_downloads/equipment" ]; then
    echo -e "${RED}❌ Raw downloads not found. Run with --download first or without flags for full pipeline.${NC}"
    exit 1
  fi

  mkdir -p static/img/facilities static/img/equipment

  echo ""
  echo -e "${YELLOW}  📸 Optimizing facility panoramas (3200×1200, q82)...${NC}"
  python3 pictoolkit/optimize-images.py \
    pictoolkit/mega_downloads/facilities \
    --max-width 3200 --max-height 1200 \
    -q 82 --formats webp,jpeg \
    -o static/img/facilities

  echo ""
  echo -e "${YELLOW}  📸 Optimizing equipment thumbnails (800×800, q80)...${NC}"
  python3 pictoolkit/optimize-images.py \
    pictoolkit/mega_downloads/equipment \
    --max-width 800 --max-height 800 \
    -q 80 --formats webp,jpeg \
    -o static/img/equipment
fi

# ── Summary ─────────────────────────────────────────────────────────────────

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  ✅ Pipeline complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

if [ -d "static/img/facilities" ]; then
  FAC_SIZE=$(du -sh static/img/facilities 2>/dev/null | cut -f1)
  echo -e "  📂 Facilities:  ${CYAN}${FAC_SIZE}${NC}  → static/img/facilities/"
fi
if [ -d "static/img/equipment" ]; then
  EQ_SIZE=$(du -sh static/img/equipment 2>/dev/null | cut -f1)
  echo -e "  📂 Equipment:   ${CYAN}${EQ_SIZE}${NC}  → static/img/equipment/"
fi
if [ -d "pictoolkit/mega_downloads" ]; then
  RAW_SIZE=$(du -sh pictoolkit/mega_downloads 2>/dev/null | cut -f1)
  echo -e "  📦 Raw cache:   ${YELLOW}${RAW_SIZE}${NC}  → pictoolkit/mega_downloads/"
fi
echo ""
