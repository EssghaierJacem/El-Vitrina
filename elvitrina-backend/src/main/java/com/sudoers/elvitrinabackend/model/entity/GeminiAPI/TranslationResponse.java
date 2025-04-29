package com.sudoers.elvitrinabackend.model.entity.GeminiAPI;

public class TranslationResponse {
    private String translatedText;
    private String detectedSourceLanguage; // "en" or "fr"

    // Default constructor (required for Jackson)
    public TranslationResponse() {
    }

    public TranslationResponse(String translatedText, String detectedSourceLanguage) {
        this.translatedText = translatedText;
        this.detectedSourceLanguage = detectedSourceLanguage;
    }

    public String getTranslatedText() {
        return translatedText;
    }

    public void setTranslatedText(String translatedText) {
        this.translatedText = translatedText;
    }

    public String getDetectedSourceLanguage() {
        return detectedSourceLanguage;
    }

    public void setDetectedSourceLanguage(String detectedSourceLanguage) {
        this.detectedSourceLanguage = detectedSourceLanguage;
    }

    @Override
    public String toString() {
        return "TranslationResponse{" +
                "translatedText='" + translatedText + '\'' +
                ", detectedSourceLanguage='" + detectedSourceLanguage + '\'' +
                '}';
    }

}
