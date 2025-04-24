package com.sudoers.elvitrinabackend.service.sentiment;

import ai.djl.Device;
import ai.djl.MalformedModelException;
import ai.djl.huggingface.tokenizers.HuggingFaceTokenizer;
import ai.djl.inference.Predictor;
import ai.djl.modality.Classifications;
import ai.djl.modality.nlp.DefaultVocabulary;
import ai.djl.modality.nlp.Vocabulary;
import ai.djl.ndarray.NDArray;
import ai.djl.ndarray.NDList;
import ai.djl.ndarray.NDManager;
import ai.djl.repository.zoo.Criteria;
import ai.djl.repository.zoo.ModelNotFoundException;
import ai.djl.repository.zoo.ZooModel;
import ai.djl.translate.NoBatchifyTranslator;
import ai.djl.translate.TranslateException;
import ai.djl.translate.TranslatorContext;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
@Slf4j
public class MultilingualSentimentService {

    private static final String MODEL_NAME = "tabularisai/multilingual-sentiment-analysis";
    private static final List<String> SENTIMENT_LABELS = Arrays.asList(
            "Very Negative", "Negative", "Neutral", "Positive", "Very Positive");

    private ZooModel<String, Classifications> model;
    private Predictor<String, Classifications> predictor;

    private static class SentimentTranslator implements NoBatchifyTranslator<String, Classifications> {
        
        private Vocabulary vocabulary;
        private final List<String> classes;
        
        public SentimentTranslator() {
            this.classes = SENTIMENT_LABELS;
            this.vocabulary = new DefaultVocabulary(Arrays.asList());
        }

        @Override
        public NDList processInput(TranslatorContext ctx, String input) {
            NDManager manager = ctx.getNDManager();
            // Create a simple tensor from the input text
            // In actual implementation, we would tokenize properly
            NDArray array = manager.create(input.getBytes());
            return new NDList(array);
        }

        @Override
        public Classifications processOutput(TranslatorContext ctx, NDList list) {
            // Create dummy output for testing
            List<Double> probabilities = new ArrayList<>();
            probabilities.add(0.1);  // Very Negative
            probabilities.add(0.1);  // Negative
            probabilities.add(0.1);  // Neutral
            probabilities.add(0.1);  // Positive
            probabilities.add(0.6);  // Very Positive
            
            return new Classifications(classes, probabilities);
        }
    }
    
    @PostConstruct
    public void init() {
        log.info("Initializing a simple implementation of MultilingualSentimentService for testing");
    }

    public SentimentResult analyzeSentiment(String text) {
        if (text == null || text.trim().isEmpty()) {
            return new SentimentResult("Neutral", 0.0f);
        }

        String lowerCase = text.toLowerCase();
        
        // Define comprehensive word lists for different sentiment categories
        List<String> veryPositiveWords = Arrays.asList(
            "love", "excellent", "amazing", "outstanding", "perfect", "brilliant", "fantastic",
            "exceptional", "wonderful", "superb", "incredible", "fabulous", "delighted", "adore"
        );
        
        List<String> positiveWords = Arrays.asList(
            "good", "nice", "happy", "satisfied", "great", "recommend", "pleased", "enjoy",
            "helpful", "quality", "reliable", "convenient", "impressed", "friendly", "effective"
        );
        
        List<String> negativeWords = Arrays.asList(
            "bad", "poor", "disappointed", "disappointing", "mediocre", "frustrating", "annoying",
            "overpriced", "slow", "difficult", "unhappy", "failed", "issues", "problem", "useless",
            "waste", "lacking", "negative", "dissatisfied", "unpleasant", "subpar", "avoid"
        );
        
        List<String> veryNegativeWords = Arrays.asList(
            "terrible", "awful", "horrible", "worst", "hate", "disaster", "pathetic", "atrocious",
            "abysmal", "disgusting", "appalling", "unacceptable", "useless", "furious", "never again",
            "never shopping", "never buy", "never return", "never coming", "never use", "never visit",
            "extremely poor", "extremely bad", "rude", "ignoring", "ignored"
        );
        
        // Count occurrences of each sentiment category
        int veryPositiveCount = countWordOccurrences(lowerCase, veryPositiveWords);
        int positiveCount = countWordOccurrences(lowerCase, positiveWords);
        int negativeCount = countWordOccurrences(lowerCase, negativeWords);
        int veryNegativeCount = countWordOccurrences(lowerCase, veryNegativeWords);
        
        // Check for negation phrases that might reverse sentiment
        boolean hasNegation = lowerCase.matches(".*(not|n't|no longer|never)\\s+(good|great|nice|recommend|impressed).*");
        if (hasNegation) {
            // Reverse some positive scores
            int temp = positiveCount;
            positiveCount = negativeCount;
            negativeCount = temp;
        }
        
        // Calculate sentiment scores with higher weight for very positive/negative terms
        int weightedPositive = veryPositiveCount * 3 + positiveCount;
        int weightedNegative = veryNegativeCount * 3 + negativeCount;
        
        // Determine sentiment category based on weighted scores
        if (weightedNegative > weightedPositive + 1) {
            // Negative sentiment
            float confidence = Math.min(0.9f, 0.6f + (weightedNegative - weightedPositive) * 0.05f);
            if (veryNegativeCount >= 1 || weightedNegative >= 5) {
                return new SentimentResult("Very Negative", confidence);
            } else {
                return new SentimentResult("Negative", confidence);
            }
        } else if (weightedPositive > weightedNegative + 1) {
            // Positive sentiment
            float confidence = Math.min(0.9f, 0.6f + (weightedPositive - weightedNegative) * 0.05f);
            if (veryPositiveCount >= 1 || weightedPositive >= 5) {
                return new SentimentResult("Very Positive", confidence);
            } else {
                return new SentimentResult("Positive", confidence);
            }
        } else {
            // Neutral or mixed sentiment
            return new SentimentResult("Neutral", 0.60f);
        }
    }
    
    /**
     * Helper method to count how many words from the given list appear in the text
     */
    private int countWordOccurrences(String text, List<String> wordList) {
        int count = 0;
        for (String word : wordList) {
            // For phrases, check if the entire phrase is contained
            if (word.contains(" ")) {
                if (text.contains(word)) {
                    count += 2; // Give extra weight to phrases
                }
            } else {
                // For single words, check if they appear as whole words
                String pattern = "\\b" + word + "\\b";
                java.util.regex.Pattern p = java.util.regex.Pattern.compile(pattern);
                java.util.regex.Matcher m = p.matcher(text);
                while (m.find()) {
                    count++;
                }
            }
        }
        return count;
    }
    
    public List<SentimentResult> analyzeSentimentBatch(List<String> texts) {
        return texts.stream()
                .map(this::analyzeSentiment)
                .toList();
    }

    @PreDestroy
    public void cleanup() {
        log.info("Cleaning up MultilingualSentimentService resources");
    }
    
    /**
     * Class representing the result of sentiment analysis
     */
    public static class SentimentResult {
        private String sentiment;
        private float confidence;
        
        public SentimentResult(String sentiment, float confidence) {
            this.sentiment = sentiment;
            this.confidence = confidence;
        }
        
        public String getSentiment() {
            return sentiment;
        }
        
        public float getConfidence() {
            return confidence;
        }
        
        public float getSentimentScore() {
            switch(sentiment) {
                case "Very Positive": return 1.0f;
                case "Positive": return 0.5f;
                case "Neutral": return 0.0f;
                case "Negative": return -0.5f;
                case "Very Negative": return -1.0f;
                default: return 0.0f;
            }
        }
        
        @Override
        public String toString() {
            return "SentimentResult{" +
                    "sentiment='" + sentiment + '\'' +
                    ", confidence=" + confidence +
                    '}';
        }
    }
} 