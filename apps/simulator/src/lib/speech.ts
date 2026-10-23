/**
 * Web Speech API Utilities for Alexa+ Voice Simulator
 * Provides Speech Recognition (Mic to Text) and Speech Synthesis (Alexa Voice Output)
 */

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function isSpeechRecognitionSupported(): boolean {
  return typeof window !== 'undefined' && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function createSpeechRecognizer(
  onResult: (text: string, isFinal: boolean) => void,
  onEnd: () => void,
  onError: (error: string) => void
) {
  if (!isSpeechRecognitionSupported()) {
    onError('Speech recognition is not supported in this browser. Try Chrome or Edge.');
    return null;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  recognition.onresult = (event: any) => {
    let interim = '';
    let final = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        final += transcript;
      } else {
        interim += transcript;
      }
    }

    if (final.trim()) {
      onResult(final.trim(), true);
    } else if (interim.trim()) {
      onResult(interim.trim(), false);
    }
  };

  recognition.onerror = (event: any) => {
    console.warn('[Speech] Recognition error:', event.error);
    if (event.error !== 'no-speech') {
      onError(event.error);
    }
  };

  recognition.onend = () => {
    onEnd();
  };

  return recognition;
}

// Clean markdown and symbols before vocalizing
function cleanTextForSpeech(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // remove **bold**
    .replace(/\*(.*?)\*/g, '$1') // remove *italic*
    .replace(/`([^`]+)`/g, '$1') // remove `code`
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // remove links
    .replace(/[#>\-]/g, '') // remove markdown bullets/headers
    .replace(/\s+/g, ' ')
    .trim();
}

export function stopSpeaking() {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
  }
}

export function speakText(
  text: string,
  onStart?: () => void,
  onEnd?: () => void
) {
  if (!isSpeechSynthesisSupported()) return;

  stopSpeaking();

  const clean = cleanTextForSpeech(text);
  if (!clean) return;

  const utterance = new SpeechSynthesisUtterance(clean);

  utterance.rate = 1.05; // Slightly conversational pacing
  utterance.pitch = 1.0;
  utterance.lang = 'en-US';

  // Attempt to select a clear natural voice if available
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(
    (v) => (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Jenny')) && v.lang.startsWith('en')
  ) || voices.find((v) => v.lang.startsWith('en'));

  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  utterance.onstart = () => {
    if (onStart) onStart();
  };

  utterance.onend = () => {
    if (onEnd) onEnd();
  };

  utterance.onerror = () => {
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
}
