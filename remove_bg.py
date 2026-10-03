import os
from rembg import remove
from PIL import Image

def process_images():
    input_dir = './public'
    output_dir = './public'
    
    files = {
        'premium_red_pill.jpg': 'premium_red_pill.png',
        'premium_blue_pill.jpg': 'premium_blue_pill.png',
    }
    
    for in_file, out_file in files.items():
        in_path = os.path.join(input_dir, in_file)
        out_path = os.path.join(output_dir, out_file)
        
        if not os.path.exists(in_path):
            print(f"Skipping {in_file}: File not found in {input_dir}")
            continue
            
        print(f"Processing {in_file} -> {out_file}")
        try:
            input_image = Image.open(in_path)
            output_image = remove(input_image)
            output_image.save(out_path)
            print(f"Saved {out_file}")
        except Exception as e:
            print(f"Error processing {in_file}: {e}")

if __name__ == "__main__":
    process_images()
