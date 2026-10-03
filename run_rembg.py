from rembg import remove
from PIL import Image

input_path = '/Users/apple/.gemini/antigravity-ide/brain/d420bba7-72b5-4319-9557-0069817f2f49/diamond_chain_1788724934565.jpg'
output_path = './public/chain.png'

print(f"Processing {input_path}...")
input_img = Image.open(input_path)
output_img = remove(input_img)
output_img.save(output_path)
print(f"Saved to {output_path}!")
