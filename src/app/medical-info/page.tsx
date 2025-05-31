'use client';

import MedicalInfoForm from '@/components/forms/MedicalInfoForm';
import type { MedicalInfoFormData } from '@/components/forms/MedicalInfoForm';
import { useUserData } from '@/context/UserDataContext';
import { HeartPulse } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

export default function MedicalInfoPage() {
  const { medicalInfo, updateMedicalInfo, isLoading } = useUserData();

  const handleSubmit = (data: MedicalInfoFormData) => {
    updateMedicalInfo(data as Required<MedicalInfoFormData>); // Assuming all fields are strings
  };
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-1/2" />
        <Skeleton className="h-96 w-full max-w-lg mx-auto" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold font-headline text-primary flex items-center gap-2">
        <HeartPulse className="h-8 w-8" />
        My Medical Information
      </h2>
      <MedicalInfoForm onSubmit={handleSubmit} initialData={medicalInfo} />
    </div>
  );
}
