'use client';

import { useEffect, useState } from 'react';
import { useAuth, useFirestore } from '@/firebase';
import { 
  GoogleAuthProvider, 
  signInWithRedirect, 
  getRedirectResult,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const signUpSchema = z.object({
  displayName: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

const signInSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

type SignUpForm = z.infer<typeof signUpSchema>;
type SignInForm = z.infer<typeof signInSchema>;

export default function LoginPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isSignUp, setIsSignUp] = useState(false);

  const { register: registerSignUp, handleSubmit: handleSignUpSubmit, formState: { errors: signUpErrors } } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
  });

  const { register: registerSignIn, handleSubmit: handleSignInSubmit, formState: { errors: signInErrors } } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
  });

  // Google Sign-In
  const handleGoogleSignIn = async () => {
    if (!auth) return;
    setLoading(true);
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(auth, provider).catch(error => {
      setLoading(false);
      toast({
        variant: 'destructive',
        title: 'Sign-in Error',
        description: error.message,
      });
    });
  };

  // Email/Password Sign-Up
  const onSignUp = async (data: SignUpForm) => {
    if (!auth || !firestore) return;
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;
      
      await updateProfile(user, { displayName: data.displayName });

      const userDocRef = doc(firestore, 'users', user.uid);
      await setDoc(userDocRef, {
        displayName: data.displayName,
        email: user.email,
        photoURL: user.photoURL, // Will be null initially
      });

      router.push('/');
      toast({
        title: 'Account Created!',
        description: 'You have been successfully signed in.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Sign-up Error',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Email/Password Sign-In
  const onSignIn = async (data: SignInForm) => {
    if (!auth) return;
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      router.push('/');
      toast({
        title: 'Success!',
        description: 'You have been signed in.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Sign-in Error',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (!auth || !firestore) return;

    getRedirectResult(auth)
      .then(async (result) => {
        if (result && result.user) {
          const user = result.user;
          const userDocRef = doc(firestore, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);

          if (!userDoc.exists()) {
            await setDoc(userDocRef, {
              displayName: user.displayName,
              email: user.email,
              photoURL: user.photoURL,
            });
          }
          router.push('/');
          toast({
            title: 'Success!',
            description: 'You have been signed in.',
          });
        } else {
          setLoading(false);
        }
      })
      .catch((error) => {
        if (error.code !== 'auth/no-redirect-operation') {
          console.error('Sign-in redirect error', error);
          toast({
            variant: 'destructive',
            title: 'Uh oh! Something went wrong.',
            description: error.code === 'auth/unauthorized-domain'
              ? "This app's domain is not authorized for Google Sign-in. Please contact the administrator or use Email/Password sign-in."
              : error.message,
          });
        }
        setLoading(false);
      });
  }, [auth, firestore, router, toast]);

  return (
    <main className="flex flex-1 flex-col items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <ShieldCheck className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl">{isSignUp ? 'Create an Account' : 'Welcome Back'}</CardTitle>
          <CardDescription>
            {isSignUp ? 'Enter your details to get started.' : 'Sign in to access your dashboard and tools.'}
          </CardDescription>
        </CardHeader>
        
        {isSignUp ? (
          <form onSubmit={handleSignUpSubmit(onSignUp)}>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="displayName">Name</Label>
                <Input id="displayName" {...registerSignUp('displayName')} />
                {signUpErrors.displayName && <p className="text-sm text-destructive">{signUpErrors.displayName.message}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="email-signup">Email</Label>
                <Input id="email-signup" type="email" {...registerSignUp('email')} />
                {signUpErrors.email && <p className="text-sm text-destructive">{signUpErrors.email.message}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="password-signup">Password</Label>
                <Input id="password-signup" type="password" {...registerSignUp('password')} />
                {signUpErrors.password && <p className="text-sm text-destructive">{signUpErrors.password.message}</p>}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create Account'}
              </Button>
            </CardFooter>
          </form>
        ) : (
          <form onSubmit={handleSignInSubmit(onSignIn)}>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="email-signin">Email</Label>
                <Input id="email-signin" type="email" {...registerSignIn('email')} />
                {signInErrors.email && <p className="text-sm text-destructive">{signInErrors.email.message}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="password-signin">Password</Label>
                <Input id="password-signin" type="password" {...registerSignIn('password')} />
                {signInErrors.password && <p className="text-sm text-destructive">{signInErrors.password.message}</p>}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
               <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Sign In'}
              </Button>
            </CardFooter>
          </form>
        )}
        
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <div className="p-6 pt-0">
           <Button onClick={handleGoogleSignIn} variant="outline" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Sign in with Google'}
          </Button>
        </div>

        <CardFooter>
          <div className="text-center text-sm text-muted-foreground w-full">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{' '}
            <button onClick={() => setIsSignUp(!isSignUp)} className="text-primary hover:underline">
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
        </CardFooter>

      </Card>
    </main>
  );
}
