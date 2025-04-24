package com.sudoers.elvitrinabackend.service.ReviewAnalysis;

import com.sudoers.elvitrinabackend.service.sentiment.MultilingualSentimentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.regex.Pattern;
import java.util.regex.Matcher;

/**
 * Service for analyzing reviews using local implementations without Google Cloud dependencies.
 */
@Service
@Slf4j
public class ReviewAnalysisService {

    @Autowired
    private MultilingualSentimentService multilingualSentimentService;

    /**
     * Analyzes the sentiment of the given text using local keyword-based analysis.
     * @param text The text to analyze
     * @return A SentimentResult containing the score and magnitude of the sentiment
     */
    public SentimentResult analyzeSentiment(String text) {
        if (text == null || text.isEmpty()) {
            return new SentimentResult(0, 0);
        }
        
        try {
            // Use MultilingualSentimentService to get the sentiment
            MultilingualSentimentService.SentimentResult mlResult = 
                    multilingualSentimentService.analyzeSentiment(text);
            
            // Convert the result to our format
            float score = mlResult.getSentimentScore();
            float magnitude = Math.abs(score) * mlResult.getConfidence();
            
            return new SentimentResult(score, magnitude);
        } catch (Exception e) {
            log.error("Error analyzing sentiment: {}", e.getMessage());
            return fallbackSentimentAnalysis(text);
        }
    }

    /**
     * Fallback sentiment analysis method for when the primary method fails.
     */
    private SentimentResult fallbackSentimentAnalysis(String text) {
        if (text == null || text.isEmpty()) {
            return new SentimentResult(0, 0);
        }
        
        String lowerCase = text.toLowerCase();
        float score = 0.0f;
        float magnitude = 0.5f; // Base magnitude
        
        // Very positive words
        List<String> veryPositiveWords = List.of(
            "love", "excellent", "amazing", "outstanding", "perfect", "fantastic",
            "wonderful", "superb", "incredible", "fabulous"
        );
        
        // Positive words
        List<String> positiveWords = List.of(
            "good", "nice", "happy", "satisfied", "great", "recommend", "pleased",
            "helpful", "quality", "reliable", "friendly"
        );
        
        // Negative words
        List<String> negativeWords = List.of(
            "bad", "poor", "disappointed", "disappointing", "mediocre", "frustrating",
            "slow", "difficult", "unhappy", "issues", "problem"
        );
        
        // Very negative words
        List<String> veryNegativeWords = List.of(
            "terrible", "awful", "horrible", "worst", "hate", "disaster",
            "disgusting", "unacceptable", "furious", "never again", "rude"
        );
        
        // Count word occurrences
        int veryPositiveCount = countWordOccurrences(lowerCase, veryPositiveWords);
        int positiveCount = countWordOccurrences(lowerCase, positiveWords);
        int negativeCount = countWordOccurrences(lowerCase, negativeWords);
        int veryNegativeCount = countWordOccurrences(lowerCase, veryNegativeWords);
        
        // Calculate scores
        float positiveScore = (veryPositiveCount * 0.2f) + (positiveCount * 0.1f);
        float negativeScore = (veryNegativeCount * -0.2f) + (negativeCount * -0.1f);
        
        // Final score and magnitude
        score = positiveScore + negativeScore;
        magnitude = Math.abs(score) + 0.5f; // Magnitude based on score strength
        
        // Clamp score between -1 and 1
        score = Math.max(-1.0f, Math.min(1.0f, score));
        
        return new SentimentResult(score, magnitude);
    }
    
    /**
     * Helper method to count word occurrences
     */
    private int countWordOccurrences(String text, List<String> words) {
        int count = 0;
        for (String word : words) {
            if (word.contains(" ")) {
                // Check for phrases
                if (text.contains(word)) {
                    count += 2; // Phrases get extra weight
                }
            } else {
                // Check for whole words
                String regex = "\\b" + word + "\\b";
                Pattern pattern = Pattern.compile(regex);
                Matcher matcher = pattern.matcher(text);
                while (matcher.find()) {
                    count++;
                }
            }
        }
        return count;
    }

    /**
     * Summarizes a single review by extracting the most significant sentences.
     * @param review The review text to summarize
     * @return A summary of the review
     */
    public String summarizeReview(String review) {
        if (review == null || review.isEmpty()) {
            return "";
        }
        
        try {
            return extractSignificantSentences(review);
        } catch (Exception e) {
            log.error("Error summarizing review: {}", e.getMessage());
            return fallbackSummarizeReview(review);
        }
    }
    
    /**
     * Extracts the most significant sentences from a review based on sentiment words.
     */
    private String extractSignificantSentences(String review) {
        // Split into sentences
        String[] sentences = review.split("[.!?]+\\s*");
        
        // If it's already short, return as is
        if (sentences.length <= 2) {
            return review;
        }
        
        // Score each sentence based on sentiment keywords
        List<ScoredSentence> scoredSentences = new ArrayList<>();
        for (String sentence : sentences) {
            if (sentence.trim().length() < 5) continue;
            
            SentimentResult sentiment = fallbackSentimentAnalysis(sentence);
            float significance = Math.abs(sentiment.getScore()) * sentiment.getMagnitude();
            scoredSentences.add(new ScoredSentence(sentence, significance));
        }
        
        // Sort by significance
        scoredSentences.sort((s1, s2) -> Float.compare(s2.score, s1.score));
        
        // Take top 2 sentences
        StringBuilder summary = new StringBuilder();
        int count = 0;
        for (ScoredSentence sentence : scoredSentences) {
            if (count++ >= 2) break;
            summary.append(sentence.text).append(". ");
        }
        
        return summary.toString().trim();
    }
    
    /**
     * Helper class to store a sentence with its significance score.
     */
    private static class ScoredSentence {
        String text;
        float score;
        
        ScoredSentence(String text, float score) {
            this.text = text;
            this.score = score;
        }
    }
    
    /**
     * Simple fallback review summarization when the primary method fails.
     */
    private String fallbackSummarizeReview(String review) {
        if (review == null || review.isEmpty()) {
            return "";
        }
        
        // Split into sentences
        String[] sentences = review.split("[.!?]+\\s*");
        
        // If it's already short, return as is
        if (sentences.length <= 2) {
            return review;
        }
        
        // For longer reviews, take first and last meaningful sentence
        StringBuilder summary = new StringBuilder();
        
        // Add first sentence if it's long enough to be meaningful
        if (sentences[0].length() > 10) {
            summary.append(sentences[0]).append(". ");
        }
        
        // Find a meaningful sentence from the latter half
        for (int i = sentences.length - 1; i >= sentences.length / 2; i--) {
            if (sentences[i].length() > 15) {
                summary.append(sentences[i]).append(".");
                break;
            }
        }
        
        // If we couldn't extract anything meaningful, return a truncated version
        if (summary.length() == 0) {
            return review.length() > 120 ? review.substring(0, 120) + "..." : review;
        }
        
        return summary.toString();
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