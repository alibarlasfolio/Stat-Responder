'use client';

import { useUserData } from '@/context/UserDataContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { HeartPulse, AlertTriangle as AlertIcon, Pill, ListChecks, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from "@/components/ui/skeleton";

export default function MedicalInfoSummary() {
  const { medicalInfo, isLoading } = useUserData();

  const hasInfo = medicalInfo && (medicalInfo.allergies || medicalInfo.medications || medicalInfo.conditions);

  const renderInfoItem = (IconComponent: React.ElementType, label: string, value?: string) => {
    if (!value) return null;
    return (
      <div className="mb-1">
        <p className="text-sm font-medium text-secondary-foreground flex items-center gap-1">
          <IconComponent className="h-4 w-4 text-primary" /> {label}:
        </p>
        <p className="text-sm text-muted-foreground ml-5 whitespace-pre-wrap break-words">
          {value.split(/[\n,]+/).map(s => s.trim()).filter(Boolean).join(', ')}
        </p>
      </div>
    );
  };
  
  if (isLoading) {
    return (
       <Card className="shadow-lg">
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2 mt-1" />
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline text-primary">
          <HeartPulse className="h-6 w-6" />
          Medical Information
        </CardTitle>
        {!hasInfo && (
           <CardDescription className="flex items-center gap-1 text-destructive">
            <AlertCircle className="h-4 w-4" /> No medical info provided.
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {hasInfo ? (
          <div className="space-y-2">
            {renderInfoItem(AlertIcon, 'Allergies', medicalInfo?.allergies)}
            {renderInfoItem(Pill, 'Medications', medicalInfo?.medications)}
            {renderInfoItem(ListChecks, 'Conditions', medicalInfo?.conditions)}
          </div>
        ) : (
          <p className="text-muted-foreground">
            Critical medical details are missing. Please update them in the 'Medical Info' section.
          </p>
        )}
        <Link href="/medical-info" passHref>
          <Button variant="outline" className="mt-4 w-full border-primary text-primary hover:bg-primary/10">
            Manage Medical Info
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
