'use client';

import { useState, FormEvent } from 'react';
import { useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Search } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

export default function BreachChecker() {
  const { user } = useUser();
  const [email, setEmail] = useState(user?.email || '');

  const handleCheck = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email) {
      // We are not passing the email to haveibeenpwned directly in the URL
      // to encourage the user to type it themselves for better security practice.
      const hibpUrl = `https://haveibeenpwned.com/`;
      window.open(hibpUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="space-y-8">
        <Card>
            <form onSubmit={handleCheck}>
                <CardHeader>
                    <CardTitle>Check for Breaches with "Have I Been Pwned?"</CardTitle>
                    <CardDescription>
                        To ensure your privacy and provide the most accurate results, CyberWise integrates with the official "Have I Been Pwned?" website—the most trusted service for breach tracking.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                            id="email" 
                            name="email"
                            type="email" 
                            placeholder="Enter the email you want to check"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                     <Alert>
                        <Search className="h-4 w-4" />
                        <AlertTitle>How this works</AlertTitle>
                        <AlertDescription>
                            When you click the button below, you will be taken to the official "Have I Been Pwned?" website in a new tab. For your security, you will need to enter your email address on their site yourself. CyberWise does not handle or see the email you check.
                        </AlertDescription>
                    </Alert>
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full sm:w-auto">
                        <Search className="mr-2 h-4 w-4" />
                        Continue to HaveIBeenPwned.com
                    </Button>
                </CardFooter>
            </form>
        </Card>
    </div>
  );
}
