// Firestore utilities for managing user data
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { getCurrentUser } from './auth';

export interface WeakQuestion {
  category: string;
  esperanto: string;
  japanese: string;
  extra?: string;
  addedAt: Date;
  incorrectCount: number;
}

export interface UserProgress {
  userId: string;
  weakQuestions: WeakQuestion[];
  lastUpdated: Date;
  totalQuizzesTaken: number;
  categoriesStudied: string[];
}

// ユーザーの苦手問題を保存
export const saveWeakQuestion = async (question: Omit<WeakQuestion, 'addedAt' | 'incorrectCount'>) => {
  const user = getCurrentUser();
  if (!user) {
    console.error('saveWeakQuestion: ユーザーがログインしていません');
    throw new Error('ログインが必要です');
  }

  console.log('saveWeakQuestion: 苦手問題を保存中...', question);
  const userDocRef = doc(db, 'userProgress', user.uid);

  try {
    const userDoc = await getDoc(userDocRef);
    const weakQuestion: WeakQuestion = {
      ...question,
      addedAt: new Date(),
      incorrectCount: 1
    };

    console.log('saveWeakQuestion: ユーザードキュメント存在確認:', userDoc.exists());

    if (userDoc.exists()) {
      const userData = userDoc.data() as UserProgress;
      const existingIndex = userData.weakQuestions?.findIndex(
        wq => wq.esperanto === question.esperanto && wq.category === question.category
      );

      console.log('saveWeakQuestion: 既存問題チェック, インデックス:', existingIndex);

      if (existingIndex >= 0) {
        // 既存の問題の間違い回数を増やす
        const updatedWeakQuestions = [...(userData.weakQuestions || [])];
        updatedWeakQuestions[existingIndex] = {
          ...updatedWeakQuestions[existingIndex],
          incorrectCount: updatedWeakQuestions[existingIndex].incorrectCount + 1,
          addedAt: new Date()
        };

        console.log('saveWeakQuestion: 既存問題の更新中...');
        await updateDoc(userDocRef, {
          weakQuestions: updatedWeakQuestions,
          lastUpdated: serverTimestamp()
        });
        console.log('saveWeakQuestion: 既存問題の更新完了');
      } else {
        // 新しい苦手問題を追加
        console.log('saveWeakQuestion: 新しい苦手問題を追加中...');
        await updateDoc(userDocRef, {
          weakQuestions: arrayUnion(weakQuestion),
          lastUpdated: serverTimestamp(),
          categoriesStudied: arrayUnion(question.category)
        });
        console.log('saveWeakQuestion: 新しい苦手問題の追加完了');
      }
    } else {
      // 新しいユーザードキュメントを作成
      console.log('saveWeakQuestion: 新しいユーザードキュメントを作成中...');
      const newUserProgress: Omit<UserProgress, 'lastUpdated'> = {
        userId: user.uid,
        weakQuestions: [weakQuestion],
        totalQuizzesTaken: 0,
        categoriesStudied: [question.category]
      };

      await setDoc(userDocRef, {
        ...newUserProgress,
        lastUpdated: serverTimestamp()
      });
      console.log('saveWeakQuestion: 新しいユーザードキュメントの作成完了');
    }

    console.log('saveWeakQuestion: 保存処理完了');
  } catch (error) {
    console.error('saveWeakQuestion: 苦手問題の保存に失敗:', error);
    throw error;
  }
};

// ユーザーの苦手問題を取得
export const getWeakQuestions = async (category?: string): Promise<WeakQuestion[]> => {
  const user = getCurrentUser();
  if (!user) return [];

  const userDocRef = doc(db, 'userProgress', user.uid);

  try {
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) return [];

    const userData = userDoc.data() as UserProgress;
    const weakQuestions = userData.weakQuestions || [];

    if (category) {
      return weakQuestions.filter(wq => wq.category === category);
    }

    return weakQuestions;
  } catch (error) {
    console.error('苦手問題の取得に失敗:', error);
    return [];
  }
};

// 苦手問題を削除（理解できた時）
export const removeWeakQuestion = async (esperanto: string, category: string) => {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('ログインが必要です');
  }

  const userDocRef = doc(db, 'userProgress', user.uid);

  try {
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) return;

    const userData = userDoc.data() as UserProgress;
    const updatedWeakQuestions = (userData.weakQuestions || []).filter(
      wq => !(wq.esperanto === esperanto && wq.category === category)
    );

    await updateDoc(userDocRef, {
      weakQuestions: updatedWeakQuestions,
      lastUpdated: serverTimestamp()
    });
  } catch (error) {
    console.error('苦手問題の削除に失敗:', error);
    throw error;
  }
};

// クイズ完了時の統計更新
export const updateQuizStats = async (category: string) => {
  const user = getCurrentUser();
  if (!user) return;

  const userDocRef = doc(db, 'userProgress', user.uid);

  try {
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data() as UserProgress;
      await updateDoc(userDocRef, {
        totalQuizzesTaken: (userData.totalQuizzesTaken || 0) + 1,
        categoriesStudied: arrayUnion(category),
        lastUpdated: serverTimestamp()
      });
    } else {
      await setDoc(userDocRef, {
        userId: user.uid,
        weakQuestions: [],
        totalQuizzesTaken: 1,
        categoriesStudied: [category],
        lastUpdated: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('統計の更新に失敗:', error);
  }
};

// ユーザーの学習進捗を取得
export const getUserProgress = async (): Promise<UserProgress | null> => {
  const user = getCurrentUser();
  if (!user) return null;

  const userDocRef = doc(db, 'userProgress', user.uid);

  try {
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) return null;

    return userDoc.data() as UserProgress;
  } catch (error) {
    console.error('学習進捗の取得に失敗:', error);
    return null;
  }
};