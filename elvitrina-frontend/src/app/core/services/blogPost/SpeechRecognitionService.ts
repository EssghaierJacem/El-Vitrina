import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SpeechRecognitionService {
  private recognition: any;
  private speechSubject = new Subject<string>();
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
      this.recognition.lang = 'fr-FR'; // Français par défaut
      this.recognition.maxAlternatives = 1; // Limite à 1 résultat
     


      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        this.speechSubject.next(transcript);
      };

      this.recognition.onerror = (event: any) => {
        this.speechSubject.error(event.error);
      };
    }
  }

  startListening(): Observable<string> {
    if (!this.recognition) {
      throw new Error('Reconnaissance vocale non supportée');
    }

    if (!this.isListening) {
      this.recognition.start();
      this.isListening = true;
    }

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

