'use client';
import * as React from 'react';
import { SignInPage } from '@toolpad/core/SignInPage';
import type { Session } from '@toolpad/core/AppProvider';
import { useNavigate } from 'react-router';
import { useSession } from '../SessionContext';
import { Password } from '@mui/icons-material';
import { signInWithEmailPassword } from '../services/authService';

export default function SignIn() {
  const { setSession } = useSession();
  const navigate = useNavigate();
  return (
    <SignInPage
      providers={[{ id: 'credentials', name: 'Credentials' }]}
      signIn={async (provider, formData, callbackUrl) => {
        
        try {
          const email = String(formData.get('email') || '');
          const password = String(formData.get('password') || '');
          const session = await signInWithEmailPassword(email, password);
          if (session) {
            setSession(session);
            navigate(callbackUrl || '/', { replace: true });
            
          }
        } catch (error) {
          return { error: error instanceof Error ? error.message : 'An error occurred' };
        }
        return {};
      }}
    />
  );
}
