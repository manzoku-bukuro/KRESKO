// Authentication utilities for Firebase
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../config/firebase';

// メールアドレスでアカウント作成
export const createEmailAccount = async (email: string, password: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    console.log('アカウント作成成功:', result.user.email);
    return result.user;
  } catch (error: unknown) {
    console.error('アカウント作成失敗:', (error as Error).message);
    throw error;
  }
};

// メールアドレスでログイン
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    console.log('ログイン成功:', result.user.email);
    return result.user;
  } catch (error: unknown) {
    console.error('ログイン失敗:', (error as Error).message);
    throw error;
  }
};


// Googleログイン
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    console.log('Googleログイン成功:', result.user.email);
    return result.user;
  } catch (error: unknown) {
    console.error('Googleログイン失敗:', (error as Error).message);
    throw error;
  }
};

// ログアウト
export const signOutUser = async () => {
  try {
    await signOut(auth);
    console.log('ログアウト成功');
  } catch (error: unknown) {
    console.error('ログアウト失敗:', (error as Error).message);
    throw error;
  }
};

// 認証状態の監視
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// 現在のユーザー情報を取得
export const getCurrentUser = () => {
  return auth.currentUser;
};


// ユーザーがログイン済みかどうかを確認
export const isUserLoggedIn = () => {
  return auth.currentUser !== null;
};