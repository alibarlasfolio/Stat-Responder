'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Mic, StopCircle, Loader2, Zap, MessageSquareWarning, ListChecks, AlertTriangle } from 'lucide-react';
import { voiceAnalysisForEmergencyGuidance, VoiceAnalysisForEmergencyGuidanceOutput } from '@/ai/flows/emergency-guidance';
import { useToast } from '@/hooks/use-toast';
import { Progress } from "@/components/ui/progress";

const RECORDING_DURATION_MS = 120000; // 2 minutes

export default function VoiceGuidance() {
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<VoiceAnalysisForEmergencyGuidanceOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();
  const [recordingTimeLeft, setRecordingTimeLeft] = useState(RECORDING_DURATION_MS / 1000);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const recordingStartTimeRef = useRef<number | null>(null);


  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecordingTimer = () => {
    recordingStartTimeRef.current = Date.now();
    setRecordingTimeLeft(RECORDING_DURATION_MS / 1000);
    recordingTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - (recordingStartTimeRef.current || Date.now());
      const timeLeft = Math.max(0, (RECORDING_DURATION_MS - elapsed) / 1000);
      setRecordingTimeLeft(timeLeft);
      if (timeLeft <= 0) {
        stopRecordingAndProcess();
      }
    }, 100);
  };

  const stopRecordingTimer = () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
  };

  const startRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError("Media devices API not available in this browser.");
      toast({ variant: "destructive", title: "Error", description: "Media devices API not available." });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' }); // Common format
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result as string;
          try {
            setIsLoading(true);
            setError(null);
            setAnalysisResult(null); // Clear previous results
            const result = await voiceAnalysisForEmergencyGuidance({ voiceRecordingDataUri: base64Audio });
            setAnalysisResult(result);
            toast({ title: "Analysis Complete", description: "Guidance generated based on your voice input." });
          } catch (e: any) {
            setError(`Analysis failed: ${e.message}`);
            toast({ variant: "destructive", title: "Analysis Error", description: e.message });
          } finally {
            setIsLoading(false);
          }
        };
        // Clean up stream tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setError(null);
      setAnalysisResult(null);
      startRecordingTimer();
      toast({ title: "Recording Started", description: "Recording for up to 2 minutes." });
    } catch (err) {
      setError("Could not start recording. Please ensure microphone access is allowed.");
      toast({ variant: "destructive", title: "Recording Error", description: "Microphone access denied or error." });
    }
  };

  const stopRecordingAndProcess = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      stopRecordingTimer();
      toast({ title: "Recording Stopped", description: "Processing audio..." });
    }
  };

  const recordingProgress = ((RECORDING_DURATION_MS / 1000 - recordingTimeLeft) / (RECORDING_DURATION_MS / 1000)) * 100;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline text-primary">
          <Zap className="h-6 w-6" />
          AI Emergency Guidance (Voice)
        </CardTitle>
        <CardDescription>
          Record your situation for up to 2 minutes. Our AI will analyze keywords and provide immediate general guidance.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isRecording ? (
          <Button onClick={startRecording} disabled={isLoading} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
            <Mic className="mr-2 h-5 w-5" /> Start Recording
          </Button>
        ) : (
          <Button onClick={stopRecordingAndProcess} variant="destructive" className="w-full">
            <StopCircle className="mr-2 h-5 w-5" /> Stop Recording ({Math.ceil(recordingTimeLeft)}s left)
          </Button>
        )}
        {isRecording && (
          <div className="space-y-1">
            <Progress value={recordingProgress} className="w-full h-2" />
            <p className="text-xs text-muted-foreground text-center">Recording... {Math.ceil(recordingTimeLeft)} seconds remaining</p>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center p-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-2 text-muted-foreground">Analyzing audio, please wait...</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive text-destructive rounded-md flex items-start gap-2">
            <MessageSquareWarning className="h-5 w-5 mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {analysisResult && !isLoading && (
          <Card className="bg-secondary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-primary">
                <ListChecks className="h-5 w-5" /> Analysis Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="font-semibold flex items-center gap-1"><AlertTriangle className="h-4 w-4 text-orange-500"/>Identified Keywords:</h4>
                {analysisResult.keywords.length > 0 ? (
                  <p className="text-sm text-muted-foreground pl-1">{analysisResult.keywords.join(', ')}</p>
                ) : (
                  <p className="text-sm text-muted-foreground pl-1">No specific keywords identified.</p>
                )}
              </div>
              <div>
                <h4 className="font-semibold flex items-center gap-1"><ShieldAlert className="h-4 w-4 text-green-600"/>First-Aid Guidance:</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap pl-1">{analysisResult.guidance}</p>
              </div>
            </CardContent>
             <CardFooter>
                <p className="text-xs text-muted-foreground">This guidance is for informational purposes only and not a substitute for professional medical advice. Always call emergency services in a critical situation.</p>
             </CardFooter>
          </Card>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Note: Voice recording is processed locally and then sent for analysis. Ensure you have a stable internet connection for AI guidance.
      </CardFooter>
    </Card>
  );
}

// Dummy icon for ShieldAlert, as it's also used in SosButton.
// Ensure actual lucide-react icons are used where possible, or provide SVGs if needed.
const ShieldAlert = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M12 8v4"></path><path d="M12 16h.01"></path></svg>;

