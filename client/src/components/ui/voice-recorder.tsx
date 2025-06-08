import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Mic, Square, Play, Pause, RotateCcw } from "lucide-react";
import { startRecording, stopRecording, transcribeAudio } from "@/lib/speechUtils";
import { apiRequest } from "@/lib/queryClient";

interface VoiceRecorderProps {
  onRecordingComplete: (result: { transcription: string; audioUrl?: string }) => void;
  maxDuration?: number; // in seconds
  className?: string;
}

export default function VoiceRecorder({ 
  onRecordingComplete, 
  maxDuration = 300, 
  className = "" 
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const startRecordingHandler = async () => {
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
      
      const chunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm;codecs=opus' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        setHasRecording(true);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      setRecordingDuration(0);
      
      // Start duration counter
      durationIntervalRef.current = setInterval(() => {
        setRecordingDuration(prev => {
          const newDuration = prev + 1;
          if (newDuration >= maxDuration) {
            stopRecordingHandler();
          }
          return newDuration;
        });
      }, 1000);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecordingHandler = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }
    }
  };

  const playRecording = () => {
    if (audioUrl && !isPlaying) {
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => setIsPlaying(false);
      
      audio.play();
      setIsPlaying(true);
    }
  };

  const pauseRecording = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resetRecording = () => {
    setHasRecording(false);
    setAudioBlob(null);
    setRecordingDuration(0);
    setIsPlaying(false);
    
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl("");
    }
  };

  const submitRecording = async () => {
    if (!audioBlob) return;

    setIsProcessing(true);
    
    try {
      // Create form data for upload
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      
      // Upload and transcribe
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to transcribe audio');
      }
      
      const { transcription } = await response.json();
      
      // Call completion handler
      onRecordingComplete({
        transcription,
        audioUrl: audioUrl
      });
      
    } catch (error) {
      console.error('Error processing recording:', error);
      alert('Failed to process recording. Please try again.');
      setIsProcessing(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = (recordingDuration / maxDuration) * 100;

  return (
    <Card className={`bg-muted/30 border-border ${className}`}>
      <CardContent className="pt-6">
        <div className="text-center">
          
          {/* Recording Button/Status */}
          <div className="mb-6">
            {!isRecording && !hasRecording && (
              <div>
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-primary/90 transition-colors cursor-pointer"
                     onClick={startRecordingHandler}>
                  <Mic className="h-8 w-8 text-primary-foreground" />
                </div>
                <Button 
                  onClick={startRecordingHandler}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  size="lg"
                >
                  <Mic className="h-4 w-4 mr-2" />
                  Start Recording
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  Click to start recording your answer
                </p>
              </div>
            )}

            {isRecording && (
              <div>
                <div className="w-20 h-20 bg-destructive rounded-full flex items-center justify-center mx-auto mb-4 recording-pulse relative">
                  <Mic className="h-8 w-8 text-white" />
                </div>
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <div className="w-3 h-3 bg-destructive rounded-full animate-pulse"></div>
                  <span className="text-destructive font-medium">Recording...</span>
                  <span className="text-muted-foreground font-mono">
                    {formatDuration(recordingDuration)}
                  </span>
                </div>
                <Button 
                  onClick={stopRecordingHandler}
                  variant="destructive"
                  size="lg"
                >
                  <Square className="h-4 w-4 mr-2" />
                  Stop Recording
                </Button>
                
                {/* Progress bar for max duration */}
                <div className="mt-4 max-w-md mx-auto">
                  <Progress value={progressPercentage} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {Math.max(0, maxDuration - recordingDuration)}s remaining
                  </p>
                </div>
              </div>
            )}

            {hasRecording && !isProcessing && (
              <div>
                <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mic className="h-8 w-8 text-white" />
                </div>
                <p className="font-medium text-foreground mb-4">
                  Recording Complete ({formatDuration(recordingDuration)})
                </p>
                
                {/* Playback controls */}
                <div className="flex items-center justify-center space-x-3 mb-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={isPlaying ? pauseRecording : playRecording}
                  >
                    {isPlaying ? (
                      <Pause className="h-4 w-4 mr-2" />
                    ) : (
                      <Play className="h-4 w-4 mr-2" />
                    )}
                    {isPlaying ? "Pause" : "Play"}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetRecording}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Re-record
                  </Button>
                </div>
                
                {/* Submit button */}
                <Button 
                  onClick={submitRecording}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  size="lg"
                >
                  Submit Voice Response
                </Button>
              </div>
            )}

            {isProcessing && (
              <div>
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
                <p className="font-medium text-foreground mb-2">Processing your response...</p>
                <p className="text-sm text-muted-foreground">
                  AI is transcribing and analyzing your answer
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
