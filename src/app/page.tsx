import EmergencyContactsSummary from '@/components/dashboard/EmergencyContactsSummary';
import MedicalInfoSummary from '@/components/dashboard/MedicalInfoSummary';
import SosButton from '@/components/dashboard/SosButton';
import EmergencyLists from '@/components/dashboard/EmergencyLists';
import SosPreparedness from '@/components/dashboard/SosPreparedness';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <Card className="bg-primary text-primary-foreground p-6 rounded-lg shadow-xl text-center">
        <CardHeader className="p-0 mb-2">
          <CardTitle className="text-3xl md:text-4xl font-bold font-headline">Welcome to Stat Responder</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <CardDescription className="text-lg text-primary-foreground/80">
            Your personal emergency assistant. Ready when you need it most.
          </CardDescription>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="md:col-span-1">
          <SosButton />
        </div>
        <div className="md:col-span-2">
          <Card className="border-destructive bg-destructive/10 p-4 shadow-md">
            <CardHeader className="p-0">
               <CardTitle className="text-destructive flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" /> Important
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 mt-2">             
              <p className="text-sm text-destructive/80">
                In a life-threatening emergency, always call your local emergency number first. This app provides supplementary assistance.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <EmergencyContactsSummary />
        <MedicalInfoSummary />
      </div>
      
      <SosPreparedness />

      <EmergencyLists />
      
    </div>
  );
}
