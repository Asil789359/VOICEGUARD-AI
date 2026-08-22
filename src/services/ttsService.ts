export class TTSService {
  private synth: SpeechSynthesis | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public speakWarning(text: string, lang: 'en' | 'ta' = 'en') {
    if (!this.synth) return;

    this.synth.cancel(); // Stop any active speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    if (lang === 'ta') {
      utterance.lang = 'ta-IN';
    } else {
      utterance.lang = 'en-US';
    }

    // Try to find matching voice
    const voices = this.synth.getVoices();
    const targetLang = lang === 'ta' ? 'ta' : 'en';
    const voice = voices.find(v => v.lang.toLowerCase().includes(targetLang));
    if (voice) {
      utterance.voice = voice;
    }

    this.synth.speak(utterance);
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}

export const ttsService = new TTSService();
