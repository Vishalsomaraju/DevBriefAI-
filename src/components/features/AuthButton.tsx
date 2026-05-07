import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { authService } from '@/services/authService';

interface AuthButtonProps {
  user: { displayName?: string | null; email?: string | null; photoURL?: string | null } | null;
}

export const AuthButton: React.FC<AuthButtonProps> = ({ user }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    await authService.signInWithGoogle();
    setIsLoading(false);
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    await authService.signOutUser();
    setIsLoading(false);
  };

  if (user) {
    return (
      <div className="flex items-center gap-3">
        {user.photoURL && (
          <img 
            src={user.photoURL} 
            alt={`${user.displayName || user.email}'s profile`} 
            className="w-8 h-8 rounded-full border border-gray-200"
          />
        )}
        <span className="text-sm font-medium text-gray-700 hidden md:block">
          {user.displayName || user.email}
        </span>
        <Button 
          variant="ghost" 
          onClick={handleSignOut} 
          isLoading={isLoading}
          aria-label="Sign out"
        >
          Sign out
        </Button>
      </div>
    );
  }

  return (
    <Button 
      variant="primary" 
      onClick={handleSignIn} 
      isLoading={isLoading}
      aria-label="Sign in with Google"
    >
      Sign in with Google
    </Button>
  );
};
