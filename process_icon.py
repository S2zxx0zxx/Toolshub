import os
import sys
import glob
from PIL import Image, ImageDraw, ImageFilter, ImageOps
import numpy as np

def create_icons(source_path, dest_dir):
    # Clear old assets
    if os.path.exists(dest_dir):
        files = glob.glob(os.path.join(dest_dir, "*"))
        for f in files:
            try:
                os.remove(f)
            except Exception as e:
                print(f"Failed to delete {f}: {e}")
    else:
        os.makedirs(dest_dir, exist_ok=True)

    # 1. Load image
    img = Image.open(source_path).convert('RGB')
    np_img = np.array(img)
    
    # 2. Find non-white pixels (Background is white)
    # A pixel is considered background if its values are close to 255
    # sum(RGB) > 720 is very bright white/light gray
    mask = np.sum(np_img, axis=2) < 720
    
    # 3. Find the left-most icon by looking at column sums
    col_sums = np.sum(mask, axis=0)
    
    # Find where the icon starts (from the left)
    nonzero_cols = np.where(col_sums > 0)[0]
    if len(nonzero_cols) == 0:
        print("Could not find any non-white pixels.")
        return
        
    xmin = nonzero_cols[0]
    
    # Scan right from xmin to find the gap before the text
    xmax_icon = xmin
    for x in range(xmin, len(col_sums)):
        if col_sums[x] == 0:
            # We found a gap of fully white columns! This separates the icon from the text
            break
        xmax_icon = x
        
    # Now find ymin and ymax specifically for this x-range
    icon_mask = mask[:, xmin:xmax_icon+1]
    row_sums = np.sum(icon_mask, axis=1)
    nonzero_rows = np.where(row_sums > 0)[0]
    
    ymin = nonzero_rows[0]
    ymax = nonzero_rows[-1]
    
    # 4. Extract just the icon preserving its original colors
    # Add a tiny bit of safety margin (1-2 pixels) just in case
    margin = 2
    crop_xmin = max(0, xmin - margin)
    crop_ymin = max(0, ymin - margin)
    crop_xmax = min(img.width, xmax_icon + margin)
    crop_ymax = min(img.height, ymax + margin)
    
    glyph_box = img.crop((crop_xmin, crop_ymin, crop_xmax, crop_ymax))
    
    # 5. The glyph is already high quality and colored. Let's make it a high-res RGBA.
    # Convert white background to transparent within the glyph so it blends perfectly
    glyph_rgba = glyph_box.convert("RGBA")
    data = np.array(glyph_rgba)
    
    # Anything very white becomes transparent
    r, g, b, a = data.T
    white_areas = (r > 240) & (g > 240) & (b > 240)
    data[..., 3][white_areas.T] = 0
    glyph_final = Image.fromarray(data)
    
    # Upscale glyph for master (if it's small) to ensure crispness
    large_w, large_h = glyph_final.width * 4, glyph_final.height * 4
    glyph_final = glyph_final.resize((large_w, large_h), Image.Resampling.LANCZOS)
    
    # 6. Create the 1024x1024 master canvas
    canvas_size = 1024
    master = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    
    # Draw white rounded square
    draw = ImageDraw.Draw(master)
    radius = 230
    draw.rounded_rectangle((0, 0, canvas_size, canvas_size), radius=radius, fill=(255, 255, 255, 255))
    
    # 7. Scale glyph to fit within ~82% of the canvas (9% padding on each side)
    target_size = int(canvas_size * 0.82)
    
    scale = min(target_size / large_w, target_size / large_h)
    new_w, new_h = int(large_w * scale), int(large_h * scale)
    
    glyph_resized = glyph_final.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    # Paste glyph onto master
    paste_x = (canvas_size - new_w) // 2
    paste_y = (canvas_size - new_h) // 2
    master.paste(glyph_resized, (paste_x, paste_y), glyph_resized)
    
    master.save(os.path.join(dest_dir, "icon-master.png"))
    
    # 8. Generate all sizes
    sizes = [16, 32, 48, 72, 96, 128, 144, 152, 180, 192, 256, 384, 512]
    for size in sizes:
        resized = master.resize((size, size), Image.Resampling.LANCZOS)
        resized.save(os.path.join(dest_dir, f"icon-{size}x{size}.png"))
    
    # favicon.ico (multi-size)
    icon_sizes = [(16,16), (32,32), (48,48)]
    imgs = [master.resize(s, Image.Resampling.LANCZOS) for s in icon_sizes]
    imgs[0].save(os.path.join(dest_dir, "favicon.ico"), format="ICO", sizes=icon_sizes, append_images=imgs[1:])
    
    print("Icons successfully generated!")

if __name__ == "__main__":
    source_img = r"C:\Users\SATYAM KUMAR\.gemini\antigravity-ide\brain\65fc3bf9-28c4-438e-8dd7-78c52895ab7f\media__1784551428566.jpg"
    dest_folder = r"c:\toolshub\assets"
    create_icons(source_img, dest_folder)
