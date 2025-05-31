'use client';

import { useUserData } from '@/context/UserDataContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, Phone, ShieldCheck, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from "@/components/ui/skeleton";

export default function EmergencyContactsSummary() {
  const { emergencyContacts, isLoading } = useUserData();

  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2 mt-1" />
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline text-primary">
          <Users className="h-6 w-6" />
          Emergency Contacts
        </CardTitle>
        {emergencyContacts.length === 0 && (
          <CardDescription className="flex items-center gap-1 text-destructive">
            <AlertCircle className="h-4 w-4" /> No contacts added.
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {emergencyContacts.length > 0 ? (
          <ul className="space-y-3">
            {emergencyContacts.slice(0, 2).map(contact => ( // Show first 2 contacts
              <li key={contact.id} className="p-3 bg-secondary/50 rounded-md">
                <p className="font-semibold text-secondary-foreground">{contact.name}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1"><ShieldCheck className="h-4 w-4"/>{contact.relationship}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1"><Phone className="h-4 w-4"/>{contact.phoneNumber}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">
            Please add emergency contacts in the 'Contacts' section. This information is crucial during an emergency.
          </p>
        )}
        <Link href="/contacts" passHref>
          <Button variant="outline" className="mt-4 w-full border-primary text-primary hover:bg-primary/10">
            Manage Contacts
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
