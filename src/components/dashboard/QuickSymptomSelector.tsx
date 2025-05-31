
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClipboardList } from 'lucide-react';

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
];

export default function QuickSymptomSelector() {
  const [selectedSymptom, setSelectedSymptom] = useState<string | undefined>(undefined);

  const handleSymptomSelect = (symptom: string) => {
    setSelectedSymptom(symptom);
    // In a real app, you might want to use this selection,
    // e.g., pass it to the SOS function or log it.
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2 text-primary">
          <ClipboardList className="h-5 w-5" />
          Quick Symptom
        </CardTitle>
        <CardDescription className="text-xs pt-1">
          Optional: select main symptom.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Select onValueChange={handleSymptomSelect} value={selectedSymptom}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a symptom..." />
          </SelectTrigger>
          <SelectContent>
            {commonSymptoms.map((symptom) => (
              <SelectItem key={symptom} value={symptom}>
                {symptom}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedSymptom && (
          <p className="text-xs text-muted-foreground mt-2.5">
            Selected: {selectedSymptom}.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
