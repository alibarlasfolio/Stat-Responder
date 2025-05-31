'use client';

import type { MedicalInfo } from '@/types';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { HeartPulse, Pill, AlertTriangle, ListChecks } from 'lucide-react';

const medicalInfoSchema = z.object({
  allergies: z.string().optional(),
  medications: z.string().optional(),
  conditions: z.string().optional(),
});

export type MedicalInfoFormData = z.infer<typeof medicalInfoSchema>;

interface MedicalInfoFormProps {
  onSubmit: (data: MedicalInfoFormData) => void;
  initialData?: MedicalInfo | null;
}

export default function MedicalInfoForm({ onSubmit, initialData }: MedicalInfoFormProps) {
  const { toast } = useToast();
  const form = useForm<MedicalInfoFormData>({
    resolver: zodResolver(medicalInfoSchema),
    defaultValues: initialData || {
      allergies: '',
      medications: '',
      conditions: '',
    },
  });

  const handleFormSubmit: SubmitHandler<MedicalInfoFormData> = (data) => {
    onSubmit(data);
    toast({
      title: 'Medical Information Updated',
      description: 'Your medical information has been successfully saved.',
    });
  };

  return (
    <Card className="w-full max-w-lg mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <HeartPulse className="h-6 w-6 text-primary" />
          Update Medical Information
        </CardTitle>
        <CardDescription>
          Provide critical medical details. This information can be vital in an emergency.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="allergies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="allergies" className="flex items-center gap-1"><AlertTriangle className="h-4 w-4"/>Allergies</FormLabel>
                  <FormControl>
                    <Textarea
                      id="allergies"
                      placeholder="e.g., Penicillin, Peanuts, Bee stings (one per line or comma-separated)"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="medications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="medications" className="flex items-center gap-1"><Pill className="h-4 w-4"/>Current Medications</FormLabel>
                  <FormControl>
                    <Textarea
                      id="medications"
                      placeholder="e.g., Lisinopril 10mg, Metformin 500mg (one per line or comma-separated)"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="conditions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="conditions" className="flex items-center gap-1"><ListChecks className="h-4 w-4"/>Existing Medical Conditions</FormLabel>
                  <FormControl>
                    <Textarea
                      id="conditions"
                      placeholder="e.g., Diabetes Type 2, Asthma, Hypertension (one per line or comma-separated)"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              Save Medical Information
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
