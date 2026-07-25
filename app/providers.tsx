'use client';

import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';

export function Providers({ children }: { children: React.ReactNode }) {
  // Use a fallback or the environment variable for the client ID
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID_HERE";

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Toaster position="top-center" />
      {children}
    </GoogleOAuthProvider>
  );
}
