from PIL import Image


def compress_image(img_path, output_path):
    Image.open(img_path).convert('RGB').save(output_path)
