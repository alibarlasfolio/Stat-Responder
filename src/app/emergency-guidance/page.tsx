import SymptomChecker from '@/components/guidance/SymptomChecker';
import VoiceGuidance from '@/components/guidance/VoiceGuidance';
import { Stethoscope, Zap } from 'lucide-react';

export default function EmergencyGuidancePage() {
  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-3xl font-bold mb-6 font-headline text-primary flex items-center gap-2">
          <Stethoscope className="h-8 w-8" />
          Medical Emergency Guidance
        </h2>
        <SymptomChecker />
      </div>

      <hr className="my-12 border-border"/>

      <div>
         <h2 className="text-3xl font-bold mb-6 font-headline text-primary flex items-center gap-2">
          <Zap className="h-8 w-8" />
          AI Voice-Powered Assistance
        </h2>
        <VoiceGuidance />
      </div>
    </div>
  );
}
