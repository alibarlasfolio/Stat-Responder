'use client';

import Link from 'next/link';
import { ShieldAlert, Users, Stethoscope, HeartPulse, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { useState } from 'react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: <ShieldAlert className="h-5 w-5" /> },
  { href: '/contacts', label: 'Contacts', icon: <Users className="h-5 w-5" /> },
  { href: '/medical-info', label: 'Medical Info', icon: <HeartPulse className="h-5 w-5" /> },
  { href: '/emergency-guidance', label: 'Guidance', icon: <Stethoscope className="h-5 w-5" /> },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavLinks = ({ isMobile = false }: { isMobile?: boolean }) => (
    navItems.map(item => (
      <Link
        key={item.href}
        href={item.href}
        passHref
        legacyBehavior
      >
        <Button
          variant="ghost"
          className={`justify-start text-sm font-medium ${isMobile ? 'w-full text-foreground hover:bg-secondary' : 'text-primary-foreground hover:bg-primary/80'}`}
          onClick={() => isMobile && setIsMobileMenuOpen(false)}
        >
          {item.icon}
          <span className="ml-2">{item.label}</span>
        </Button>
      </Link>
    ))
  );

  return (
    <header className="bg-primary text-primary-foreground shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2" passHref>
          <ShieldAlert className="h-8 w-8 text-accent" />
          <h1 className="text-xl font-bold font-headline">Stat Responder</h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-2">
          <NavLinks />
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] bg-background p-4">
              <div className="flex justify-between items-center mb-6">
                 <Link href="/" className="flex items-center gap-2" passHref onClick={() => setIsMobileMenuOpen(false)}>
                    <ShieldAlert className="h-7 w-7 text-primary" />
                    <h1 className="text-lg font-bold text-primary font-headline">Stat Responder</h1>
                  </Link>
                <SheetClose asChild>
                   <Button variant="ghost" size="icon">
                    <X className="h-6 w-6" />
                    <span className="sr-only">Close menu</span>
                  </Button>
                </SheetClose>
              </div>
              <nav className="flex flex-col space-y-2">
                <NavLinks isMobile />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
