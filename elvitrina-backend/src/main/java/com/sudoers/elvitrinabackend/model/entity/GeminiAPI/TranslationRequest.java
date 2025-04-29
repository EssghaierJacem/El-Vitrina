package com.sudoers.elvitrinabackend.model.entity.GeminiAPI;

public class TranslationRequest {
    private String text;

    // Default constructor (required for Jackson)
    public TranslationRequest() {
    }

    public TranslationRequest(String text) {
        this.text = text;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    @Override
    public String toString() {
        return "TranslationRequest{" +
                "text='" + text + '\'' +
                '}';
    }
}
