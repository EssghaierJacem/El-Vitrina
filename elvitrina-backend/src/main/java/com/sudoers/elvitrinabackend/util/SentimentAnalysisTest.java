package com.sudoers.elvitrinabackend.util;

import com.sudoers.elvitrinabackend.service.sentiment.MultilingualSentimentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

/**
 * Test utility for multilingual sentiment analysis.
 * Only runs when the 'sentiment-test' profile is active.
 * Use: java -Dspring.profiles.active=sentiment-test -jar app.jar
 */
@Component
@Profile("sentiment-test")
public class SentimentAnalysisTest implements CommandLineRunner {

    @Autowired
    private MultilingualSentimentService sentimentService;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("======= Testing Multilingual Sentiment Analysis =======");
        
        List<String> testTexts = Arrays.asList(
            // Test cases for simplified implementation
            "I absolutely love this product, it's excellent!", // Very Positive
            "The service is good and I'm happy with it.", // Positive
            "The weather is fine, nothing special.", // Neutral
            "I'm disappointed with the poor quality.", // Negative
            "This was a terrible experience, absolutely horrible.", // Very Negative
            
            // Other languages (just for display; using basic implementation)
            "¡Me encanta cómo quedó la decoración!", // Spanish
            "El servicio fue terrible y muy lento.", // Spanish
            "J'adore ce restaurant, c'est excellent !", // French
            "L'attente était trop longue et frustrante.", // French
            "الخدمة في هذا الفندق رائعة جدًا!" // Arabic
        );
        
        System.out.println("\nSentiment Analysis Results:");
        System.out.println("-----------------------------");
        
        for (String text : testTexts) {
            MultilingualSentimentService.SentimentResult result = sentimentService.analyzeSentiment(text);
            System.out.printf("Text: %s%nSentiment: %s (Confidence: %.2f, Score: %.2f)%n%n", 
                    text, result.getSentiment(), result.getConfidence(), result.getSentimentScore());
        }
        
        System.out.println("======= Test Complete =======");
        System.out.println("\nNote: This is using a simplified rule-based implementation.");
        System.out.println("     The actual Hugging Face model integration requires");
        System.out.println("     more complex setup that's been simplified for testing.");
    }
} 