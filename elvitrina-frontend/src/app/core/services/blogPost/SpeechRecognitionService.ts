import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SpeechRecognitionService {
  private recognition: any;
  private speechSubject: Subject<string> | null = null;
  private isListening = false;

  constructor() {
    this.initSpeechRecognition();
  }

  private initSpeechRecognition() {
    const SpeechRecognition = (window as any).SpeechRecognition || 
                               (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'fr-FR';
      this.recognition.maxAlternatives = 1;

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (this.speechSubject) {
          this.speechSubject.next(transcript);
          this.speechSubject.complete(); // Fin de l'observable après un résultat
          this.speechSubject = null;
        }
        this.isListening = false;
      };

      this.recognition.onerror = (event: any) => {
        if (this.speechSubject) {
          this.speechSubject.error(event.error);
          this.speechSubject = null;
        }
        this.isListening = false;
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };
    }
  }

  startListening(): Observable<string> {
    if (!this.recognition) {
      throw new Error('Reconnaissance vocale non supportée');
    }

    if (this.isListening) {
      return this.speechSubject!.asObservable();
    }

    this.speechSubject = new Subject<string>();
    this.recognition.start();
    this.isListening = true;

    return this.speechSubject.asObservable();
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  isSupported(): boolean {
    return !!(window as any).SpeechRecognition || 
           !!(window as any).webkitSpeechRecognition;
  }
}
