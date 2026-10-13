"""Create delivery copies; keep the supplied hero artwork untouched.

Run with Python and Pillow: python scripts/optimize-hero-assets.py
"""
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
MEDIA = ROOT / "media"
OUTPUT = MEDIA / "gaze"


def optimize(source):
    target = OUTPUT / source.name
    with Image.open(source) as image:
        # Retain every frame, its dimensions, and its lossless alpha channel.
        image.convert("RGBA").save(target, "WEBP", quality=88, method=6, exact=True)
    return source.stat().st_size, target.stat().st_size


def main():
    OUTPUT.mkdir(exist_ok=True)
    sources = sorted(MEDIA.glob("cat-*-sheet*.webp"))
    with ThreadPoolExecutor(max_workers=2) as pool:
        sizes = list(pool.map(optimize, sources))
    original, optimized = map(sum, zip(*sizes))
    print(f"{len(sources)} sheets: {original / 1e6:.2f} MB -> {optimized / 1e6:.2f} MB")
    social = MEDIA / "social"
    social.mkdir(exist_ok=True)
    with Image.open(MEDIA / "gatito-codeup-poster.webp") as image:
        image.convert("RGB").resize((1200, 675), Image.Resampling.LANCZOS).save(
            social / "codeup.jpg", "JPEG", quality=90, optimize=True
        )


if __name__ == "__main__":
    main()
