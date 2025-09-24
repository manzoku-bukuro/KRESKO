import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from 'firebase/auth';
import {
  onAuthStateChange,
  createEmailAccount,
  signInWithEmail,
  signInWithGoogle,
  signOutUser
} from '../utils/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInWithEmailHandler: (email: string, password: string) => Promise<void>;
  signInWithGoogleHandler: () => Promise<void>;
  signOutHandler: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      await createEmailAccount(email, password);
    } catch (error) {
      console.error('メール登録エラー:', error);
      throw error;
    }
  };

  const signInWithEmailHandler = async (email: string, password: string) => {
    try {
      await signInWithEmail(email, password);
    } catch (error) {
      console.error('メールログインエラー:', error);
      throw error;
    }
  };

  const signInWithGoogleHandler = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Googleログインエラー:', error);
      throw error;
    }
  };

  const signOutHandler = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error('ログアウトエラー:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signUpWithEmail,
    signInWithEmailHandler,
    signInWithGoogleHandler,
    signOutHandler
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};