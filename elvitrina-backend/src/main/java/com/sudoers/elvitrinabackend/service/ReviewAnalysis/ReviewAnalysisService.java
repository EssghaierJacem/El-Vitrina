package com.sudoers.elvitrinabackend.service.ReviewAnalysis;

import com.google.cloud.language.v1.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ReviewAnalysisService {

    /**
     * Analyzes the sentiment of the given text using Google Cloud Natural Language API.
     * @param text The text to analyze
     * @return A SentimentResult containing the score and magnitude of the sentiment
     */
    public SentimentResult analyzeSentiment(String text) {
        try (LanguageServiceClient languageService = LanguageServiceClient.create()) {
            Document document = Document.newBuilder()
                    .setContent(text)
                    .setType(Document.Type.PLAIN_TEXT)
                    .build();
            
            Sentiment sentiment = languageService.analyzeSentiment(document).getDocumentSentiment();
            
            return new SentimentResult(sentiment.getScore(), sentiment.getMagnitude());
        } catch (IOException e) {
            log.error("Error analyzing sentiment: {}", e.getMessage());
            return new SentimentResult(0, 0);
        }
    }

    /**
     * Summarizes a single review by extracting the most significant sentences based on sentiment.
     * @param review The review text to summarize
     * @return A summary of the review
     */
    public String summarizeReview(String review) {
        if (review == null || review.isEmpty()) {
            return "";
        }
        
        try (LanguageServiceClient languageService = LanguageServiceClient.create()) {
            Document document = Document.newBuilder()
                    .setContent(review)
                    .setType(Document.Type.PLAIN_TEXT)
                    .build();
            
            // Analyze syntax to break text into sentences
            AnalyzeSyntaxResponse syntaxResponse = languageService.analyzeSyntax(document);
            List<Token> tokens = syntaxResponse.getTokensList();
            
            // Get sentiment for each sentence
            AnalyzeSentimentResponse sentimentResponse = languageService.analyzeSentiment(document);
            List<Sentence> sentences = sentimentResponse.getSentencesList();
            
            if (sentences.isEmpty()) {
                return review;
            }
            
            // If review is short (1-2 sentences), return as is
            if (sentences.size() <= 2) {
                return review;
            }
            
            // Find sentences with most significant sentiment (highest absolute value of score * magnitude)
            List<Sentence> significantSentences = sentences.stream()
                    .sorted((s1, s2) -> {
                        float s1Significance = Math.abs(s1.getSentiment().getScore() * s1.getSentiment().getMagnitude());
                        float s2Significance = Math.abs(s2.getSentiment().getScore() * s2.getSentiment().getMagnitude());
                        return Float.compare(s2Significance, s1Significance);
                    })
                    .limit(2)
                    .collect(Collectors.toList());
            
            // Order sentences by their appearance in the original text
            significantSentences.sort((s1, s2) -> {
                int beginOffset1 = s1.getText().getBeginOffset();
                int beginOffset2 = s2.getText().getBeginOffset();
                return Integer.compare(beginOffset1, beginOffset2);
            });
            
            // Build summary
            StringBuilder summary = new StringBuilder();
            for (Sentence sentence : significantSentences) {
                summary.append(sentence.getText().getContent()).append(" ");
            }
            
            return summary.toString().trim();
            
        } catch (IOException e) {
            log.error("Error summarizing review: {}", e.getMessage());
            return review.length() > 100 ? review.substring(0, 100) + "..." : review;
        }
    }

    /**
     * Summarizes a list of reviews.
     * @param reviews List of review texts to summarize
     * @return List of summarized reviews
     */
    public List<String> summarizeReviews(List<String> reviews) {
        if (reviews == null || reviews.isEmpty()) {
            return new ArrayList<>();
        }
        
        return reviews.stream()
                .map(this::summarizeReview)
                .collect(Collectors.toList());
    }
    
    /**
     * Class representing the result of sentiment analysis
     */
    public static class SentimentResult {
        private float score;
        private float magnitude;
        
        public SentimentResult(float score, float magnitude) {
            this.score = score;
            this.magnitude = magnitude;
        }
        
        public float getScore() {
            return score;
        }
        
        public void setScore(float score) {
            this.score = score;
        }
        
        public float getMagnitude() {
            return magnitude;
        }
        
        public void setMagnitude(float magnitude) {
            this.magnitude = magnitude;
        }
        
        @Override
        public String toString() {
            return "SentimentResult{" +
                    "score=" + score +
                    ", magnitude=" + magnitude +
                    '}';
        }
    }
} 