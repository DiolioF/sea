"""Create lightweight, uncropped responsive WebP copies of approved image assets."""
import argparse
from pathlib import Path
from PIL import Image, ImageOps

parser = argparse.ArgumentParser()
parser.add_argument('--hero', required=True)
parser.add_argument('--solar', required=True)
parser.add_argument('--industrial', required=True)
parser.add_argument('--portrait')
args = parser.parse_args()
destination = Path(__file__).resolve().parents[1] / 'assets' / 'images'

assets = [('team', args.hero), ('solar', args.solar), ('industrial', args.industrial)]
if args.portrait:
    assets.append(('portrait', args.portrait))
for name, source in assets:
    with Image.open(source) as original:
        original = ImageOps.exif_transpose(original).convert('RGB')
        for variant, width in [('desktop', 1280), ('mobile', 720)]:
            photo = original.copy()
            if photo.width > width:
                photo = photo.resize((width, round(photo.height * width / photo.width)), Image.Resampling.LANCZOS)
            output = destination / f'sea-{name}-{variant}.webp'
            photo.save(output, 'WEBP', quality=86, method=6)
            print(f'{output.name}: {photo.width}x{photo.height}, {output.stat().st_size:,} bytes')
