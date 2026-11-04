import os
import subprocess
from PIL import Image

def generate_favicons():
    public_dir = r"D:\drone_pilots_project\public"
    app_dir = r"D:\drone_pilots_project\app"
    os.makedirs(public_dir, exist_ok=True)
    os.makedirs(app_dir, exist_ok=True)

    # 1. Official SVG content using the AeroLink mark
    svg_content = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" rx="120" fill="#09090b"/>
  <g transform="translate(136, 136) scale(10)">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.93V18h-2v-1.07A6.002 6.002 0 0 1 6.07 13H5v-2h1.07A6.002 6.002 0 0 1 11 6.07V5h2v1.07A6.002 6.002 0 0 1 17.93 11H19v2h-1.07A6.002 6.002 0 0 1 13 16.93zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" fill="#fabf28"/>
  </g>
</svg>"""

    svg_public_path = os.path.join(public_dir, "favicon.svg")
    with open(svg_public_path, "w", encoding="utf-8") as f:
        f.write(svg_content)
    print("Saved public/favicon.svg")

    # App router icon.svg
    svg_app_path = os.path.join(app_dir, "icon.svg")
    with open(svg_app_path, "w", encoding="utf-8") as f:
        f.write(svg_content)
    print("Saved app/icon.svg")

    # 2. Render SVG at 512x512 via headless Edge
    html_content = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * {{ margin: 0; padding: 0; box-sizing: border-box; }}
  html, body {{ width: 512px; height: 512px; background: transparent; overflow: hidden; }}
  svg {{ display: block; width: 512px; height: 512px; }}
</style>
</head>
<body>
{svg_content}
</body>
</html>"""

    html_path = os.path.join(public_dir, "temp_render.html")
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(html_content)

    edge_exe = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
    raw_512_png = os.path.join(public_dir, "raw-512.png")

    cmd = [
        edge_exe,
        "--headless",
        "--disable-gpu",
        "--default-background-color=00000000",
        "--window-size=512,512",
        "--force-device-scale-factor=1",
        f"--screenshot={raw_512_png}",
        f"file:///{html_path.replace(os.sep, '/')}"
    ]

    print("Rendering SVG via headless Edge...")
    res = subprocess.run(cmd, capture_output=True, text=True)
    
    if not os.path.exists(raw_512_png):
        print("Edge render failed:", res.stderr)
        return

    base_img = Image.open(raw_512_png).convert("RGBA")
    # Crop to exact 512x512 if window padding occurred
    if base_img.size != (512, 512):
        base_img = base_img.crop((0, 0, 512, 512))

    print(f"Rendered base image: {base_img.size}, mode: {base_img.mode}")

    # 3. Generate all favicon formats
    sizes = {
        "apple-touch-icon.png": (180, 180),
        "favicon-48x48.png": (48, 48),
        "favicon-32x32.png": (32, 32),
        "favicon-16x16.png": (16, 16),
    }

    for filename, size in sizes.items():
        out_img = base_img.resize(size, Image.Resampling.LANCZOS)
        out_path = os.path.join(public_dir, filename)
        out_img.save(out_path, "PNG")
        print(f"Saved public/{filename}")

    # 4. Generate multi-resolution ICO file (16x16, 32x32, 48x48)
    ico_img16 = base_img.resize((16, 16), Image.Resampling.LANCZOS)
    ico_img32 = base_img.resize((32, 32), Image.Resampling.LANCZOS)
    ico_img48 = base_img.resize((48, 48), Image.Resampling.LANCZOS)
    
    public_ico = os.path.join(public_dir, "favicon.ico")
    ico_img32.save(public_ico, format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
    print("Saved public/favicon.ico")

    # 5. Place in app/ for Next.js 14 App Router
    app_ico = os.path.join(app_dir, "favicon.ico")
    ico_img32.save(app_ico, format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
    
    app_icon_png = os.path.join(app_dir, "icon.png")
    base_img.resize((32, 32), Image.Resampling.LANCZOS).save(app_icon_png, "PNG")

    app_apple_icon = os.path.join(app_dir, "apple-icon.png")
    base_img.resize((180, 180), Image.Resampling.LANCZOS).save(app_apple_icon, "PNG")
    print("Saved Next.js app/ route icons (favicon.ico, icon.png, apple-icon.png)")

    # 6. Cleanup temporary files
    if os.path.exists(html_path):
        os.remove(html_path)
    if os.path.exists(raw_512_png):
        os.remove(raw_512_png)
    print("All favicon assets generated successfully!")

if __name__ == "__main__":
    generate_favicons()

