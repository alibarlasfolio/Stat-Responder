'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Search, Stethoscope, AlertTriangle } from 'lucide-react';

// Mock data for symptom checking
const mockGuidance: Record<string, { title: string; advice: string[] }> = {
  'chest pain': {
    title: 'Guidance for Chest Pain',
    advice: [
      'Call emergency services immediately.',
      'Rest in a comfortable position, often half-sitting.',
      'If prescribed, take nitroglycerin.',
      'Chew and swallow aspirin if not allergic and no contraindications.',
      'Stay calm and await assistance.'
    ],
  },
  'shortness of breath': {
    title: 'Guidance for Shortness of Breath',
    advice: [
      'Call emergency services if severe or sudden.',
      'Sit upright to ease breathing.',
      'Use any prescribed inhalers (e.g., for asthma).',
      'Try pursed-lip breathing.',
      'Ensure good ventilation in the room.'
    ],
  },
  'severe bleeding': {
    title: 'Guidance for Severe Bleeding',
    advice: [
      'Call emergency services immediately.',
      'Apply direct pressure to the wound using a clean cloth or bandage.',
      'Elevate the injured part above the heart if possible.',
      'Do not remove any objects impaled in the wound.',
      'Maintain pressure until help arrives.'
    ],
  },
  'fever cough': {
    title: 'Guidance for Fever and Cough',
    advice: [
      'Rest and drink plenty of fluids.',
      'Use over-the-counter medications for fever (e.g., acetaminophen, ibuprofen) if appropriate.',
      'Monitor symptoms. If they worsen or include difficulty breathing, seek medical attention.',
      'Consider COVID-19 or flu testing if symptoms are new.',
      'Isolate to prevent spread if infectious illness is suspected.'
    ],
  }
};

export default function SymptomChecker() {
  const [symptoms, setSymptoms] = useState('');
  const [guidance, setGuidance] = useState<{ title: string; advice: string[] } | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = () => {
    const searchKey = symptoms.toLowerCase().trim();
    let foundGuidance = null;

    for (const key in mockGuidance) {
      if (searchKey.includes(key)) {
        foundGuidance = mockGuidance[key];
        break;
      }
    }
    
    if (foundGuidance) {
      setGuidance(foundGuidance);
      setNotFound(false);
    } else if (searchKey) {
      setGuidance(null);
      setNotFound(true);
    } else {
      setGuidance(null);
      setNotFound(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline text-primary">
          <Stethoscope className="h-6 w-6" />
          Symptom-Based Guidance
        </CardTitle>
        <CardDescription>
          Enter symptoms to get general first-aid advice. This is not a substitute for professional medical diagnosis.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="text"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="e.g., chest pain, fever, cough"
            className="flex-grow"
          />
          <Button onClick={handleSearch} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Search className="mr-2 h-4 w-4" /> Search
          </Button>
        </div>

        {guidance && (
          <Card className="bg-secondary/30">
            <CardHeader>
              <CardTitle className="text-lg text-primary">{guidance.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {guidance.advice.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-destructive flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                This is general advice. Always consult a medical professional or call emergency services for serious conditions.
              </p>
            </CardContent>
          </Card>
        )}
        {notFound && (
           <Card className="bg-amber-50 border border-amber-200 p-4">
            <CardContent className="text-center text-amber-700">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-amber-500" />
                <p className="font-semibold">No specific guidance found for "{symptoms}".</p>
                <p className="text-sm">Try using more general terms or consult a medical professional.</p>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
