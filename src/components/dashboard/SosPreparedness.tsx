'use client';

import { useUserData } from '@/context/UserDataContext';
import { UserLocation } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Users, HeartPulse, MapPin, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Skeleton } from "@/components/ui/skeleton";

export default function SosPreparedness() {
  const { emergencyContacts, medicalInfo, isLoading: userDataLoading } = useUserData();
  const { toast } = useToast();
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocationLoading, setIsLocationLoading] = useState(true);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationError(null);
          setIsLocationLoading(false);
        },
        (error) => {
          setLocationError(error.message);
          setIsLocationLoading(false);
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser.');
      setIsLocationLoading(false);
    }
  }, []);

  const formatInfoForCopy = () => {
    let text = "EMERGENCY INFO:\n";

    if (location) {
      text += `Location: Lat ${location.latitude.toFixed(4)}, Lon ${location.longitude.toFixed(4)}\n`;
    } else if (locationError) {
      text += `Location: Not available (${locationError})\n`;
    } else {
      text += `Location: Attempting to fetch...\n`
    }

    text += "\nMEDICAL INFO:\n";
    if (medicalInfo) {
      text += medicalInfo.allergies ? `Allergies: ${medicalInfo.allergies}\n` : "Allergies: None specified\n";
      text += medicalInfo.medications ? `Medications: ${medicalInfo.medications}\n` : "Medications: None specified\n";
      text += medicalInfo.conditions ? `Conditions: ${medicalInfo.conditions}\n` : "Conditions: None specified\n";
    } else {
      text += "No medical information provided.\n";
    }

    text += "\nEMERGENCY CONTACTS:\n";
    if (emergencyContacts.length > 0) {
      emergencyContacts.forEach(contact => {
        text += `${contact.name} (${contact.relationship}): ${contact.phoneNumber}\n`;
      });
    } else {
      text += "No emergency contacts provided.\n";
    }
    return text;
  };

  const handleCopyToClipboard = () => {
    const textToCopy = formatInfoForCopy();
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        toast({ title: "Copied to Clipboard", description: "Emergency information copied." });
      })
      .catch(err => {
        toast({ variant: "destructive", title: "Copy Failed", description: "Could not copy information." });
      });
  };
  
  const isLoading = userDataLoading || isLocationLoading;

  if (isLoading) {
    return (
       <Card className="shadow-lg">
        <CardHeader>
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-3/4 mt-1" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-10 w-1/3 mt-2" />
        </CardContent>
      </Card>
    )
  }


  return (
    <Card className="shadow-lg bg-secondary/30 border-primary/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline text-primary">
          <AlertCircle className="h-6 w-6" />
          SOS Preparedness
        </CardTitle>
        <CardDescription>
          Quick access to your critical information. Copy this to share during an emergency.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold flex items-center gap-1"><MapPin className="h-5 w-5 text-primary"/>Current Location:</h4>
          {location && <p className="text-sm text-muted-foreground">Lat: {location.latitude.toFixed(4)}, Lon: {location.longitude.toFixed(4)}</p>}
          {locationError && <p className="text-sm text-destructive">{locationError}</p>}
          {!location && !locationError && <p className="text-sm text-muted-foreground">Fetching location...</p>}
        </div>
        
        <div>
          <h4 className="font-semibold flex items-center gap-1"><HeartPulse className="h-5 w-5 text-primary"/>Medical Summary:</h4>
          {medicalInfo ? (
            <>
              <p className="text-sm text-muted-foreground"><strong>Allergies:</strong> {medicalInfo.allergies || 'N/A'}</p>
              <p className="text-sm text-muted-foreground"><strong>Medications:</strong> {medicalInfo.medications || 'N/A'}</p>
              <p className="text-sm text-muted-foreground"><strong>Conditions:</strong> {medicalInfo.conditions || 'N/A'}</p>
            </>
          ) : <p className="text-sm text-muted-foreground">No medical info.</p>}
        </div>

        <div>
          <h4 className="font-semibold flex items-center gap-1"><Users className="h-5 w-5 text-primary"/>Emergency Contacts:</h4>
          {emergencyContacts.length > 0 ? emergencyContacts.map(c => (
            <p key={c.id} className="text-sm text-muted-foreground">{c.name} ({c.relationship}): {c.phoneNumber}</p>
          )) : <p className="text-sm text-muted-foreground">No contacts.</p>}
        </div>
        
        <Button onClick={handleCopyToClipboard} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
          <Copy className="mr-2 h-4 w-4" /> Copy All Info
        </Button>
      </CardContent>
    </Card>
  );
}
