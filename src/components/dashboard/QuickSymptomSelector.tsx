
'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Progress } from "@/components/ui/progress";
import { ClipboardList, Lightbulb, AlertTriangle, Mic, StopCircle, Loader2, Send, MessageSquareWarning, MapPin, Users, HeartPulse as HeartPulseIcon } from 'lucide-react';
import { getSymptomGuidance, type SymptomGuidanceOutput } from '@/ai/flows/symptom-guidance-flow';
import { useToast } from '@/hooks/use-toast';
import { useUserData } from '@/context/UserDataContext';
import type { UserLocation } from '@/types';

const commonSymptoms = [
  "Chest Pain",
  "Shortness of Breath",
  "Fever",
  "Headache",
  "Dizziness",
  "Nausea / Vomiting",
  "Severe Bleeding",
  "Allergic Reaction",
  "Loss of Consciousness",
  "Seizure",
  "Stroke Symptoms (F.A.S.T.)",
  "Abdominal Pain",
  "Confusion",
  "Difficulty Speaking",
  "Weakness or Numbness",
  "Burns",
  "Choking",
  "Poisoning",
  "Head Injury",
  "Broken Bone / Fracture"
];

const RECORDING_DURATION_MS = 240000; // 4 minutes

export default function QuickSymptomSelector() {
  const [selectedSymptom, setSelectedSymptom] = useState<string | undefined>(undefined);
  const [aiGuidance, setAiGuidance] = useState<SymptomGuidanceOutput | null>(null);
  const [isFetchingGuidance, setIsFetchingGuidance] = useState(false);
  const [guidanceError, setGuidanceError] = useState<string | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [audioDataUri, setAudioDataUri] = useState<string | null>(null);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [recordingTimeLeft, setRecordingTimeLeft] = useState(RECORDING_DURATION_MS / 1000);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const recordingStartTimeRef = useRef<number | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<UserLocation | null>(null);
  const [locationErrorSubmit, setLocationErrorSubmit] = useState<string | null>(null);


  const { toast } = useToast();
  const { medicalInfo, emergencyContacts } = useUserData();

  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const handleSymptomSelect = async (symptom: string) => {
    setSelectedSymptom(symptom);
    setAiGuidance(null);
    setGuidanceError(null);
    if (symptom) {
      setIsFetchingGuidance(true);
      try {
        const guidanceResult = await getSymptomGuidance({ symptom });
        setAiGuidance(guidanceResult);
      } catch (e: any) {
        setGuidanceError(`Failed to get AI guidance: ${e.message}`);
        toast({ variant: "destructive", title: "AI Guidance Error", description: e.message });
      } finally {
        setIsFetchingGuidance(false);
      }
    }
  };

  const startRecordingTimer = () => {
    recordingStartTimeRef.current = Date.now();
    setRecordingTimeLeft(RECORDING_DURATION_MS / 1000);
    recordingTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - (recordingStartTimeRef.current || Date.now());
      const timeLeft = Math.max(0, (RECORDING_DURATION_MS - elapsed) / 1000);
      setRecordingTimeLeft(timeLeft);
      if (timeLeft <= 0) stopRecordingAndProcessAudio();
    }, 100);
  };

  const stopRecordingTimer = () => {
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    recordingTimerRef.current = null;
  };

  const startRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setRecordingError("Media devices API not available.");
      toast({ variant: "destructive", title: "Recording Error", description: "Media devices API not available." });
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      setAudioDataUri(null);

      mediaRecorderRef.current.ondataavailable = (event) => audioChunksRef.current.push(event.data);
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          setAudioDataUri(reader.result as string);
          toast({ title: "Recording Ready", description: "Voice message recorded." });
        };
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingError(null);
      startRecordingTimer();
      toast({ title: "Recording Started", description: "Recording for up to 4 minutes." });
    } catch (err) {
      setRecordingError("Could not start recording. Check microphone permissions.");
      toast({ variant: "destructive", title: "Recording Error", description: "Microphone access denied or error." });
    }
  };

  const stopRecordingAndProcessAudio = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      stopRecordingTimer();
    }
  };
  
  const recordingProgress = ((RECORDING_DURATION_MS / 1000 - recordingTimeLeft) / (RECORDING_DURATION_MS / 1000)) * 100;

  const fetchLocationForSubmit = (): Promise<UserLocation | null> => {
    return new Promise((resolve) => {
      if (!('geolocation' in navigator)) {
        setLocationErrorSubmit('Geolocation is not supported.');
        resolve(null);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = { latitude: position.coords.latitude, longitude: position.coords.longitude };
          setCurrentLocation(loc);
          setLocationErrorSubmit(null);
          resolve(loc);
        },
        (error) => {
          setLocationErrorSubmit(`Location error: ${error.message}`);
          setCurrentLocation(null);
          resolve(null);
        }
      );
    });
  };

  const handleSubmitToServices = async () => {
    if (!selectedSymptom) {
      toast({ variant: "destructive", title: "Symptom Required", description: "Please select a symptom first." });
      return;
    }
    setIsSubmitting(true);
    const location = await fetchLocationForSubmit();

    let submissionDetails = `SIMULATED EMERGENCY SUBMISSION:\n-----------------------------------\n`;
    submissionDetails += `Selected Symptom: ${selectedSymptom}\n`;

    if (location) {
      submissionDetails += `Location: Lat ${location.latitude.toFixed(4)}, Lon ${location.longitude.toFixed(4)}\n`;
    } else if (locationErrorSubmit) {
      submissionDetails += `Location: Could not be determined (${locationErrorSubmit})\n`;
    } else {
      submissionDetails += `Location: Not available.\n`;
    }

    submissionDetails += `\n--- Medical Information ---\n`;
    if (medicalInfo) {
      submissionDetails += `Allergies: ${medicalInfo.allergies || 'N/A'}\n`;
      submissionDetails += `Medications: ${medicalInfo.medications || 'N/A'}\n`;
      submissionDetails += `Conditions: ${medicalInfo.conditions || 'N/A'}\n`;
    } else {
      submissionDetails += `No medical information available.\n`;
    }
    
    submissionDetails += `\n--- Emergency Contacts ---\n`;
    if (emergencyContacts.length > 0) {
      emergencyContacts.forEach(contact => {
        submissionDetails += `${contact.name} (${contact.relationship}): ${contact.phoneNumber}\n`;
      });
    } else {
      submissionDetails += `No emergency contacts listed.\n`;
    }

    if (audioDataUri) {
      submissionDetails += `\nVoice Message: Attached (approx. ${Math.round(audioChunksRef.current.reduce((sum, blob) => sum + blob.size, 0) / 1024)} KB)\n`;
    } else {
      submissionDetails += `\nVoice Message: Not recorded.\n`;
    }
    
    submissionDetails += `\n--- AI First Aid Guidance Provided ---\n${aiGuidance?.guidance || 'N/A'}\n`;
    submissionDetails += `-----------------------------------\nThis information would be sent to hospital and ambulance services.`;

    toast({
      title: "Information Prepared (Simulated)",
      description: <pre className="whitespace-pre-wrap text-xs">{submissionDetails}</pre>,
      duration: 20000, 
    });

    setIsSubmitting(false);
  };


  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2 text-primary">
          <ClipboardList className="h-5 w-5" />
          Symptom Checker & Reporter
        </CardTitle>
        <CardDescription className="text-xs pt-1">
          Select symptom for AI advice, optionally record voice, and simulate sending info.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select onValueChange={handleSymptomSelect} value={selectedSymptom} disabled={isFetchingGuidance || isRecording || isSubmitting}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a primary symptom..." />
          </SelectTrigger>
          <SelectContent>
            {commonSymptoms.map((symptom) => (
              <SelectItem key={symptom} value={symptom}>
                {symptom}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {isFetchingGuidance && (
          <div className="flex items-center justify-center p-3 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mr-2" /> Fetching AI guidance...
          </div>
        )}

        {guidanceError && (
          <div className="p-3 bg-destructive/10 border border-destructive text-destructive rounded-md flex items-start gap-2 text-sm">
            <MessageSquareWarning className="h-4 w-4 mt-0.5 shrink-0" /> {guidanceError}
          </div>
        )}

        {aiGuidance && !isFetchingGuidance && (
          <Card className="bg-secondary/20">
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-md flex items-center gap-2 text-secondary-foreground">
                <Lightbulb className="h-5 w-5 text-accent" /> AI First-Aid Suggestion for "{selectedSymptom}"
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p className="whitespace-pre-wrap text-muted-foreground">{aiGuidance.guidance}</p>
              <p className="text-xs text-destructive/80 flex items-center gap-1 pt-2">
                <AlertTriangle className="h-3 w-3" /> This is AI-generated advice. Always prioritize calling emergency services for serious conditions.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Voice Recording Section */}
        <div className="space-y-3 pt-3 border-t border-border">
          <h4 className="text-md font-semibold text-primary flex items-center gap-2">
            <Mic className="h-5 w-5"/> Optional: Record Voice Message (4 min)
          </h4>
          {!isRecording ? (
            <Button onClick={startRecording} disabled={isFetchingGuidance || isSubmitting} className="w-full" variant="outline">
              <Mic className="mr-2 h-4 w-4" /> Start Recording
            </Button>
          ) : (
            <Button onClick={stopRecordingAndProcessAudio} variant="destructive" className="w-full">
              <StopCircle className="mr-2 h-4 w-4" /> Stop Recording ({Math.ceil(recordingTimeLeft)}s left)
            </Button>
          )}
          {isRecording && (
            <div className="space-y-1">
              <Progress value={recordingProgress} className="w-full h-2" />
              <p className="text-xs text-muted-foreground text-center">Recording... {Math.ceil(recordingTimeLeft)} seconds remaining</p>
            </div>
          )}
          {recordingError && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <MessageSquareWarning className="h-3 w-3" /> {recordingError}
            </p>
          )}
          {audioDataUri && !isRecording && (
            <p className="text-xs text-green-600">Voice message recorded and ready.</p>
          )}
        </div>

        {/* Submit Button Section */}
        <div className="pt-4 border-t border-border">
          <Button 
            onClick={handleSubmitToServices} 
            disabled={!selectedSymptom || isFetchingGuidance || isRecording || isSubmitting} 
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Send className="mr-2 h-5 w-5" />}
            {isSubmitting ? 'Submitting...' : 'Submit Information (Simulated)'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

