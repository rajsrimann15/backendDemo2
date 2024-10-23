from PIL import Image
import torch
from transformers import BlipProcessor, BlipForConditionalGeneration

def generate_image_description(image_path):
    # Load the pre-trained image captioning model and processor
    processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
    model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

    # Open and process the image
    image = Image.open(image_path).convert("RGB")
    inputs = processor(images=image, return_tensors="pt")

    # Generate caption
    with torch.no_grad():
        out = model.generate(**inputs)
    
    # Decode the generated caption
    description = processor.decode(out[0], skip_special_tokens=True)
    
    return description

# Example usage
image_path = 'cat.jpg'  # Update this to the path of your image
description = generate_image_description(image_path)
print("Description:", description)
