export interface TranslationRequest {
    text: string;
}

export interface TranslationResponse {
    translatedText: string;
    detectedSourceLanguage: 'en' | 'fr';
}
