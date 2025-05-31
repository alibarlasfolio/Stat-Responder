'use client';

import { useState } from 'react';
import EmergencyContactForm from '@/components/forms/EmergencyContactForm';
import { useUserData } from '@/context/UserDataContext';
import type { EmergencyContact } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, Edit3, Trash2, Phone, ShieldCheck, PlusCircle } from 'lucide-react';
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
import { Skeleton } from "@/components/ui/skeleton";

type EmergencyContactFormData = Omit<EmergencyContact, 'id'>;

export default function ContactsPage() {
  const { emergencyContacts, addEmergencyContact, updateEmergencyContact, deleteEmergencyContact, isLoading } = useUserData();
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (data: EmergencyContactFormData, id?: string) => {
    if (id && editingContact) {
      updateEmergencyContact({ ...data, id });
    } else {
      addEmergencyContact(data);
    }
    setEditingContact(null);
    setShowForm(false);
  };

  const handleEdit = (contact: EmergencyContact) => {
    setEditingContact(contact);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingContact(null);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    deleteEmergencyContact(id);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold font-headline text-primary flex items-center gap-2">
          <Users className="h-8 w-8" />
          Emergency Contacts
        </h2>
        {!showForm && (
           <Button onClick={handleAddNew} className="bg-accent text-accent-foreground hover:bg-accent/90">
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Contact
          </Button>
        )}
      </div>

      {showForm && (
        <EmergencyContactForm
          onSubmit={handleSubmit}
          initialData={editingContact || undefined}
          isEditMode={!!editingContact}
        />
      )}

      {!showForm && emergencyContacts.length === 0 && (
        <Card className="text-center py-8 shadow">
          <CardHeader>
            <CardTitle className="text-xl text-muted-foreground">No Emergency Contacts Added Yet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Click "Add New Contact" to get started.</p>
            <Users className="h-16 w-16 text-muted-foreground mx-auto" />
          </CardContent>
        </Card>
      )}

      {!showForm && emergencyContacts.length > 0 && (
        <div className="space-y-4">
          {emergencyContacts.map(contact => (
            <Card key={contact.id} className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-semibold flex items-center gap-2 text-primary">
                  <Users className="h-5 w-5"/> {contact.name}
                </CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(contact)} aria-label={`Edit ${contact.name}`}>
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon" aria-label={`Delete ${contact.name}`}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete {contact.name} from your emergency contacts.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(contact.id)} className="bg-destructive hover:bg-destructive/90">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-gray-500"/> Relationship: {contact.relationship}</p>
                <p className="text-muted-foreground flex items-center gap-2"><Phone className="h-4 w-4 text-gray-500"/> Phone: {contact.phoneNumber}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
