import os
import sys
from PIL import Image, ImageDraw, ImageFilter, ImageOps
import numpy as np

def create_icons(source_path, dest_dir):
    # 1. Load image
    img = Image.open(source_path).convert('RGB')
    
    # 2. Convert to grayscale
    gray = img.convert('L')
    
    # 3. Threshold to find the black 'T'
    # The T is very dark, so pixels < 100 are probably the T
    np_gray = np.array(gray)
    mask = np_gray < 100
    
    # 4. Find bounding box of the black pixels
    rows = np.any(mask, axis=1)
    cols = np.any(mask, axis=0)
    
    if not np.any(rows) or not np.any(cols):
        print("Could not find the logo glyph in the image.")
        return
    
    ymin, ymax = np.where(rows)[0][[0, -1]]
    xmin, xmax = np.where(cols)[0][[0, -1]]
    
    # Extract the glyph
    glyph_box = img.crop((xmin, ymin, xmax, ymax))
    
    # 5. Upscale by a large factor to make edges crisp (e.g. 8x)
    large_w, large_h = glyph_box.width * 8, glyph_box.height * 8
    glyph_large = glyph_box.resize((large_w, large_h), Image.Resampling.LANCZOS)
    
    # Binarize to remove jpeg artifacts and blur
    gray_large = glyph_large.convert('L')
    # Threshold at 128
    binary_large = gray_large.point(lambda x: 0 if x < 128 else 255, '1')
    
    # Convert back to RGBA, making white transparent and black actual black
    # We want a black glyph.
    glyph_final = Image.new("RGBA", (large_w, large_h), (0,0,0,0))
    # Paste black where binary_large is 0 (black)
    black_color = Image.new("RGBA", (large_w, large_h), (20,20,20,255)) # slightly off-black for premium look, or pure black (0,0,0,255)
    glyph_final.paste(black_color, (0,0), ImageOps.invert(binary_large.convert('L')))
    
    # 6. Create the 1024x1024 master canvas
    canvas_size = 1024
    master = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    
    # Draw white rounded square
    draw = ImageDraw.Draw(master)
    radius = 230
    draw.rounded_rectangle((0, 0, canvas_size, canvas_size), radius=radius, fill=(255, 255, 255, 255))
    
    # 7. Scale glyph to fit within ~80% of the canvas (10% padding on each side)
    # The user wants "roughly 8-10% padding on each side".
    # So the glyph should take up 80% to 84% of the canvas.
    target_size = int(canvas_size * 0.82)
    
    # Calculate scaling factor to fit within target_size
    scale = min(target_size / large_w, target_size / large_h)
    new_w, new_h = int(large_w * scale), int(large_h * scale)
    
    glyph_resized = glyph_final.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    # Paste glyph onto master
    paste_x = (canvas_size - new_w) // 2
    paste_y = (canvas_size - new_h) // 2
    master.paste(glyph_resized, (paste_x, paste_y), glyph_resized)
    
    # Ensure dest dir exists
    os.makedirs(dest_dir, exist_ok=True)
    
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
    source_img = r"C:\Users\SATYAM KUMAR\.gemini\antigravity-ide\brain\65fc3bf9-28c4-438e-8dd7-78c52895ab7f\media__1784550049422.jpg"
    dest_folder = r"c:\toolshub\assets"
    create_icons(source_img, dest_folder)
