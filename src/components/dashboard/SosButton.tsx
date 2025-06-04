'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Siren, PhoneCall, MapPin, ShieldAlert } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUserData } from '@/context/UserDataContext';
import type { UserLocation } from '@/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Placeholder emergency number
const EMERGENCY_PHONE_NUMBER = '911'; 

export default function SosButton() {
  const { toast } = useToast();
  const { emergencyContacts, medicalInfo } = useUserData();
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isSosActive, setIsSosActive] = useState(false);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationError(null);
        },
        (error) => {
          setLocationError(error.message);
          toast({
            variant: "destructive",
            title: "Location Error",
            description: "Could not fetch location. SOS alerts might not include your current position.",
          });
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser.');
       toast({
            variant: "destructive",
            title: "Location Not Supported",
            description: "Geolocation is not supported by your browser.",
          });
    }
  }, [toast]);

  const handleSos = () => {
    setIsSosActive(true);

    let alertMessage = "Emergency SOS initiated!\n";
    if (location) {
      alertMessage += `Current Location: Lat ${location.latitude.toFixed(4)}, Lon ${location.longitude.toFixed(4)}\n`;
    } else if (locationError) {
      alertMessage += `Location: Could not be determined (${locationError})\n`;
    } else {
      alertMessage += `Location: Fetching...\n`;
    }

    if (emergencyContacts.length > 0) {
      const primaryContact = emergencyContacts[0];
      alertMessage += `Primary emergency contact (${primaryContact.name}) will be notified.\n`;
    } else {
      alertMessage += "No emergency contacts configured to notify.\n";
    }

    if (medicalInfo && (medicalInfo.allergies || medicalInfo.medications || medicalInfo.conditions)) {
      alertMessage += "Medical information is available and will be shared with responders.\n";
    } else {
       alertMessage += "No critical medical information available to share.\n";
    }
    
    alertMessage += `Prompting call to emergency number: ${EMERGENCY_PHONE_NUMBER}.\n`;
    alertMessage += "Nearest hospital would be notified (simulated).\n";


    toast({
      title: "SOS Activated!",
      description: (
        <div className="text-sm space-y-1">
          {location && <p className="flex items-center gap-1"><MapPin className="h-4 w-4 text-green-500" /> Location: Lat {location.latitude.toFixed(2)}, Lon {location.longitude.toFixed(2)}</p>}
          {!location && locationError && <p className="flex items-center gap-1"><MapPin className="h-4 w-4 text-red-500" /> Location: Error ({locationError})</p>}
          {emergencyContacts.length > 0 && <p className="flex items-center gap-1"><Users className="h-4 w-4 text-blue-500" /> Notifying {emergencyContacts[0].name}.</p>}
          {medicalInfo && <p className="flex items-center gap-1"><HeartPulse className="h-4 w-4 text-red-500" /> Medical info available.</p>}
          <p className="flex items-center gap-1"><PhoneCall className="h-4 w-4 text-destructive" /> Calling {EMERGENCY_PHONE_NUMBER}...</p>
          <p className="flex items-center gap-1"><ShieldAlert className="h-4 w-4 text-orange-500" /> Hospital notification simulated.</p>
        </div>
      ),
      duration: 10000, 
    });

    // Simulate calling emergency number
    window.location.href = `tel:${EMERGENCY_PHONE_NUMBER}`;

    // Reset SOS active state after a delay, allowing toast to be read
    setTimeout(() => setIsSosActive(false), 10000);
  };


  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="lg"
          className="w-full h-20 text-2xl font-bold rounded-lg shadow-xl hover:bg-red-700 transition-all duration-300 ease-in-out transform hover:scale-105 animate-pulse"
          disabled={isSosActive}
          aria-label="Activate SOS Emergency Button"
        >
          <Siren className="mr-3 h-10 w-10" />
          SOS
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <Siren className="h-6 w-6"/> Confirm SOS Activation
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div>
              <p>This will initiate emergency procedures:</p>
              <ul className="list-disc list-inside mt-2 text-sm text-muted-foreground space-y-1">
                <li>Attempt to share your current location.</li>
                <li>Notify your primary emergency contact (if set).</li>
                <li>(Simulated) Alert nearest hospital.</li>
                <li>Prompt a call to emergency services ({EMERGENCY_PHONE_NUMBER}).</li>
              </ul>
              <p className="mt-2">Are you sure you want to proceed?</p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsSosActive(false)}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSos} className="bg-destructive hover:bg-destructive/90">
            Activate SOS
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Dummy icons for toast, replace with actual lucide-react if needed
const Users = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const HeartPulse = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/><path d="M12 14v6"/><path d="M12 4v2"/></svg>;