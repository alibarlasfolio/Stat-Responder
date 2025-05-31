'use client';

import type { EmergencyContact } from '@/types';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Users, Phone, ShieldCheck } from 'lucide-react';

const emergencyContactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  relationship: z.string().min(1, 'Relationship is required'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits').regex(/^\+?[0-9\s-]+$/, 'Invalid phone number format'),
});

type EmergencyContactFormData = z.infer<typeof emergencyContactSchema>;

interface EmergencyContactFormProps {
  onSubmit: (data: EmergencyContactFormData, id?: string) => void;
  initialData?: EmergencyContact;
  isEditMode?: boolean;
}

export default function EmergencyContactForm({ onSubmit, initialData, isEditMode = false }: EmergencyContactFormProps) {
  const { toast } = useToast();
  const form = useForm<EmergencyContactFormData>({
    resolver: zodResolver(emergencyContactSchema),
    defaultValues: initialData || {
      name: '',
      relationship: '',
      phoneNumber: '',
    },
  });

  const handleFormSubmit: SubmitHandler<EmergencyContactFormData> = (data) => {
    onSubmit(data, initialData?.id);
    toast({
      title: `Contact ${isEditMode ? 'Updated' : 'Added'}`,
      description: `${data.name} has been successfully ${isEditMode ? 'updated' : 'added'}.`,
    });
    if (!isEditMode) {
      form.reset();
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Users className="h-6 w-6 text-primary" />
          {isEditMode ? 'Edit Emergency Contact' : 'Add Emergency Contact'}
        </CardTitle>
        <CardDescription>
          Keep your emergency contact information up to date.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="name" className="flex items-center gap-1"><Users className="h-4 w-4"/>Name</FormLabel>
                  <FormControl>
                    <Input id="name" placeholder="e.g., Jane Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="relationship"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="relationship" className="flex items-center gap-1"><ShieldCheck className="h-4 w-4"/>Relationship</FormLabel>
                  <FormControl>
                    <Input id="relationship" placeholder="e.g., Spouse, Parent" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="phoneNumber" className="flex items-center gap-1"><Phone className="h-4 w-4"/>Phone Number</FormLabel>
                  <FormControl>
                    <Input id="phoneNumber" type="tel" placeholder="e.g., +1234567890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              {isEditMode ? 'Save Changes' : 'Add Contact'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
