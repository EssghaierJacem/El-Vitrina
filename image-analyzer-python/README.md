# El-Vitrina Image Analyzer

This Python module provides AI-powered image analysis for El-Vitrina product images. It uses Google's Gemini Pro Vision model to extract useful information from product images.

## Features

- Extracts product category from predefined list
- Generates relevant tags/keywords in English
- Creates product descriptions in English
- Seamlessly integrates with El-Vitrina's Java Spring Boot backend
- Automatically maps categories to existing system enums

## Setup

1. Make sure Python 3.8+ is installed
2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Configure the API key in the `image_analyzer.py` file or as an environment variable

## Integration with El-Vitrina Backend

The image analyzer is integrated with the backend through the following APIs:

- `POST /api/products/{id}/analyze-image`: Analyze an existing product image
- `POST /api/products/analyze-image-file`: Analyze an uploaded image file
- `POST /api/products/{id}/apply-analysis`: Apply analysis results to a product

### How It Works

1. When a product image is uploaded, the Java backend saves it to disk
2. The image analyzer Python script is invoked to analyze the image
3. Results are returned as JSON with category, keywords, and description
4. The analyzer maps results to the predefined product categories
5. These can be applied to the product automatically or reviewed by the user

## Predefined Categories

The analyzer automatically maps detected categories to these predefined system values:

- HANDMADE_JEWELRY
- POTTERY_CERAMICS
- TEXTILES_FABRICS
- ART_PAINTINGS
- HOME_DECOR
- CLOTHING_ACCESSORIES
- ECO_FRIENDLY
- LOCAL_FOODS
- HEALTH_WELLNESS
- BOOKS_STATIONERY
- TOYS_GAMES
- VINTAGE_ANTIQUES
- DIGITAL_PRODUCTS
- CRAFTS_DIY
- PET_SUPPLIES

## Usage as a Standalone Tool

You can also use the analyzer as a standalone tool:

```bash
python image_analyzer.py --image path/to/image.jpg --output results.json
```

This will analyze the image and save the results to the specified JSON file.

## Requirements

See `requirements.txt` for the list of required Python packages. 