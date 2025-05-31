'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Hospital, Ambulance, PhoneCall } from 'lucide-react';

const hospitals = [
  { name: 'City General Hospital', number: '555-0101' },
  { name: 'County Medical Center', number: '555-0102' },
  { name: 'St. Luke\'s Emergency', number: '555-0103' },
  { name: 'Community Health Clinic (24h)', number: '555-0104' },
];

const ambulanceServices = [
  { name: 'Citywide Ambulance', number: '555-0201' },
  { name: 'Rapid Response EMS', number: '555-0202' },
  { name: 'County Paramedics', number: '555-0203' },
];

export default function EmergencyLists() {
  const [selectedHospital, setSelectedHospital] = useState<string | null>(null);
  const [selectedAmbulance, setSelectedAmbulance] = useState<string | null>(null);

  const handleCall = (number: string | null) => {
    if (number) {
      window.location.href = `tel:${number}`;
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline text-primary">
            <Hospital className="h-6 w-6" />
            Nearby Hospitals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Select onValueChange={setSelectedHospital}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a hospital..." />
            </SelectTrigger>
            <SelectContent>
              {hospitals.map(hospital => (
                <SelectItem key={hospital.name} value={hospital.number}>
                  {hospital.name} ({hospital.number})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedHospital && (
            <Button onClick={() => handleCall(selectedHospital)} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              <PhoneCall className="mr-2 h-4 w-4" /> Call Selected Hospital
            </Button>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline text-primary">
            <Ambulance className="h-6 w-6" />
            Ambulance Services
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Select onValueChange={setSelectedAmbulance}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an ambulance service..." />
            </SelectTrigger>
            <SelectContent>
              {ambulanceServices.map(service => (
                <SelectItem key={service.name} value={service.number}>
                  {service.name} ({service.number})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedAmbulance && (
            <Button onClick={() => handleCall(selectedAmbulance)} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              <PhoneCall className="mr-2 h-4 w-4" /> Call Selected Ambulance
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
