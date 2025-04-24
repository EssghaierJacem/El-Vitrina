# Multilingual Sentiment Analysis Integration

This module integrates sentiment analysis capabilities into the El-Vitrina e-commerce application for analyzing customer feedback in multiple languages.

## Features

- Support for sentiment analysis in multiple languages
- Five sentiment categories: Very Negative, Negative, Neutral, Positive, Very Positive
- Confidence scores for each prediction
- Integration with existing sentiment analysis infrastructure
- Batch processing capabilities

## Implementation Details

### Current Implementation

The current implementation uses a simplified rule-based approach for sentiment analysis. This approach:

1. Analyzes text content for specific keywords
2. Categorizes sentiment into the five categories
3. Assigns confidence scores based on patterns found
4. Returns sentiment results with appropriate scores

The simplified implementation provides all the expected interfaces for the application, but uses pattern detection instead of ML models.

### Future Model Integration

The original plan was to use Deep Java Library (DJL) with the Hugging Face model `tabularisai/multilingual-sentiment-analysis`. However, there were compatibility issues with the current version of DJL and the model's specific requirements.

To properly integrate the Hugging Face model, consider these options:

1. **Python Microservice**: Create a separate Python microservice using the original `transformers` and `torch` libraries that exposes a REST API for the Spring Boot application to call.

2. **Updated DJL Version**: Wait for or contribute to updated DJL versions that better support this specific model.

3. **Alternative Java ML Library**: Consider using alternative Java ML libraries like Stanford CoreNLP, OpenNLP, or native TensorFlow Java.

## Usage

### Analyzing Text Directly

```java
@Autowired
private MultilingualSentimentService sentimentService;

// Single text analysis
MultilingualSentimentService.SentimentResult result = sentimentService.analyzeSentiment("Great product, I love it!");
System.out.println("Sentiment: " + result.getSentiment());
System.out.println("Confidence: " + result.getConfidence());

// Batch analysis
List<String> texts = Arrays.asList("Great product!", "Terrible service", "Average quality");
List<SentimentResult> results = sentimentService.analyzeSentimentBatch(texts);
```

### REST API

```
// Analyze text directly
POST /api/store-feedbacks/analyze-text
{
  "text": "The product arrived damaged and customer service was unhelpful"
}

// Get multilingual sentiment distribution for a store
GET /api/store-feedbacks/store/{storeId}/multilingual-sentiment

// Get comprehensive analytics including sentiment
GET /api/store-feedbacks/store/{storeId}/advanced-analytics
```

## Testing

A test utility class is included to verify the sentiment analysis functionality:

```
java -Dspring.profiles.active=sentiment-test -jar app.jar
```

## Recommended Next Steps

1. **Python Service**: Implement a Python microservice using the original `multilingual_sentiment.py` script, exposing its functionality as a REST API.

2. **Service Integration**: Update `MultilingualSentimentService` to call this Python service instead of using the rule-based approach.

3. **Containerization**: Ensure both services can be deployed together, e.g., using Docker Compose.

## Dependencies

For the current simplified implementation:
- Just standard Spring Boot dependencies

For future full model integration:
- ai.djl:api
- ai.djl.pytorch:pytorch-engine
- ai.djl.huggingface:tokenizers 