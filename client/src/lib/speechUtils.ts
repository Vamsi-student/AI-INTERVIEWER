// Speech synthesis and recognition utilities
let speechSynthesis: SpeechSynthesis;
let speechRecognition: any;

// Initialize speech synthesis
if (typeof window !== 'undefined') {
  speechSynthesis = window.speechSynthesis;
  
  // Initialize speech recognition
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (SpeechRecognition) {
    speechRecognition = new SpeechRecognition();
    speechRecognition.continuous = false;
    speechRecognition.interimResults = false;
    speechRecognition.lang = 'en-US';
  }
}

/**
 * Convert text to speech
 */
export const speakText = (text: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!speechSynthesis) {
      reject(new Error('Speech synthesis not supported'));
      return;
    }

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    utterance.onend = () => resolve();
    utterance.onerror = (error) => reject(error);

    speechSynthesis.speak(utterance);
  });
};

/**
 * Stop any ongoing speech
 */
export const stopSpeaking = () => {
  if (speechSynthesis) {
    speechSynthesis.cancel();
  }
};

/**
 * Check if speech synthesis is supported
 */
export const isSpeechSynthesisSupported = (): boolean => {
  return typeof speechSynthesis !== 'undefined';
};

/**
 * Start speech recognition
 */
export const startRecording = (): Promise<MediaRecorder> => {
  return new Promise(async (resolve, reject) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        }
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      resolve(mediaRecorder);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Stop recording and return audio blob
 */
export const stopRecording = (mediaRecorder: MediaRecorder): Promise<Blob> => {
  return new Promise((resolve) => {
    const chunks: BlobPart[] = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/webm;codecs=opus' });
      resolve(blob);
    };

    mediaRecorder.stop();
  });
};

/**
 * Transcribe audio using browser speech recognition (fallback)
 */
export const transcribeAudio = (audioBlob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!speechRecognition) {
      reject(new Error('Speech recognition not supported'));
      return;
    }

    // Convert blob to audio for recognition
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);

    speechRecognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      resolve(transcript);
      URL.revokeObjectURL(audioUrl);
    };

    speechRecognition.onerror = (error: any) => {
      reject(error);
      URL.revokeObjectURL(audioUrl);
    };

    speechRecognition.start();
  });
};

/**
 * Check if speech recognition is supported
 */
export const isSpeechRecognitionSupported = (): boolean => {
  return typeof speechRecognition !== 'undefined';
};

/**
 * Get available voices for speech synthesis
 */
export const getAvailableVoices = (): SpeechSynthesisVoice[] => {
  if (!speechSynthesis) return [];
  return speechSynthesis.getVoices();
};

/**
 * Check microphone permission
 */
export const checkMicrophonePermission = async (): Promise<boolean> => {
  try {
    const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
    return permission.state === 'granted';
  } catch (error) {
    // Fallback: try to access microphone
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch {
      return false;
    }
  }
};

/**
 * Request microphone permission
 */
export const requestMicrophonePermission = async (): Promise<boolean> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch (error) {
    console.error('Microphone permission denied:', error);
    return false;
  }
};

/**
 * Format audio duration
 */
export const formatAudioDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Convert audio blob to base64
 */
export const audioToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
