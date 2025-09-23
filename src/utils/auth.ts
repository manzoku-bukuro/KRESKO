// Authentication utilities for Firebase
import {
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  EmailAuthProvider,
  linkWithCredential,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../config/firebase';

// 匿名ログイン（ゲストモード）
export const signInAsGuest = async () => {
  try {
    const result = await signInAnonymously(auth);
    console.log('ゲストログイン成功:', result.user.uid);
    return result.user;
  } catch (error: any) {
    console.error('ゲストログイン失敗:', error.message);
    throw error;
  }
};

// メールアドレスでアカウント作成
export const createEmailAccount = async (email: string, password: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    console.log('アカウント作成成功:', result.user.email);
    return result.user;
  } catch (error: any) {
    console.error('アカウント作成失敗:', error.message);
    throw error;
  }
};

// メールアドレスでログイン
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    console.log('ログイン成功:', result.user.email);
    return result.user;
  } catch (error: any) {
    console.error('ログイン失敗:', error.message);
    throw error;
  }
};

// 匿名アカウントをメールアカウントに変換
export const convertAnonymousToEmail = async (email: string, password: string) => {
  const user = auth.currentUser;
  if (!user || !user.isAnonymous) {
    throw new Error('現在匿名ユーザーではありません');
  }

  try {
    const credential = EmailAuthProvider.credential(email, password);
    const result = await linkWithCredential(user, credential);
    console.log('アカウント変換成功:', result.user.email);
    return result.user;
  } catch (error: any) {
    console.error('アカウント変換失敗:', error.message);
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('このメールアドレスは既に使用されています');
    }
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
  } catch (error: any) {
    console.error('Googleログイン失敗:', error.message);
    throw error;
  }
};

// ログアウト
export const signOutUser = async () => {
  try {
    await signOut(auth);
    console.log('ログアウト成功');
  } catch (error: any) {
    console.error('ログアウト失敗:', error.message);
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

// ユーザーが匿名かどうかを確認
export const isAnonymousUser = () => {
  return auth.currentUser?.isAnonymous || false;
};

// ユーザーがログイン済みかどうかを確認
export const isUserLoggedIn = () => {
  return auth.currentUser !== null;
};