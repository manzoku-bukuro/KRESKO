import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../../contexts/AuthContext'
import { saveWeakQuestion } from '../../../../utils/firestore'
import type { QuizQuestion } from '../../../../hooks'
import { normalizeWords, getCategoryEmoji, getCategoryName } from '../utils/normalizeWords'

export const useQuiz = () => {
  const { category, rangeStart, rangeSize } = useParams<{
    category: string
    rangeStart: string
    rangeSize: string
  }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [dataError, setDataError] = useState<string | null>(null)

  // ドリル式へのアクセスをブロック
  useEffect(() => {
    if (category === 'drill') {
      navigate('/', { replace: true })
      return
    }
  }, [category, navigate])

  const words = useMemo(() => normalizeWords(category!), [category])
  const start = useMemo(() => Number(rangeStart) - 1, [rangeStart])
  const size = useMemo(() => Number(rangeSize), [rangeSize])

  // データの整合性チェック
  useEffect(() => {
    if (!category || !rangeStart || !rangeSize) {
      setDataError('クイズパラメータが正しくありません')
      return
    }

    if (words.length === 0) {
      setDataError('単語データの読み込みに失敗しました')
      return
    }

    if (start < 0 || start >= words.length) {
      setDataError('指定された範囲が無効です')
      return
    }

    setDataError(null)
  }, [category, rangeStart, rangeSize, words, start])

  const slice = useMemo(() => words.slice(start, start + size), [words, start, size])

  // クイズの質問データを準備
  const quizQuestions: QuizQuestion[] = useMemo(
    () =>
      slice.map(word => ({
        esperanto: word.esperanto,
        japanese: word.japanese,
        extra: word.extra,
      })),
    [slice]
  )

  // 苦手問題をマーク
  const markAsWeak = async (currentQuestion: QuizQuestion) => {
    if (user) {
      try {
        await saveWeakQuestion({
          esperanto: currentQuestion.esperanto,
          japanese: currentQuestion.japanese,
          extra: currentQuestion.extra,
        })
      } catch (error) {
        console.error('苦手問題の保存に失敗:', error)
      }
    }
  }

  // 次の範囲へ進む処理
  const handleNextRange = () => {
    const nextStart = start + size + 1
    if (nextStart <= words.length) {
      navigate(`/quiz/${category}/${nextStart}/${size}`)
    } else {
      // 末尾を超えたら範囲選択に戻る
      navigate(`/range/${category}`)
    }
  }

  const handleNavigateToRange = () => {
    navigate(`/range/${category}`)
  }

  const handleNavigateToTop = () => {
    navigate('/')
  }

  // 選択肢生成関数
  const generateCustomChoices = (currentQuestion: QuizQuestion): string[] => {
    const otherWords = words.filter(word => word.japanese !== currentQuestion.japanese)
    const wrongChoices = [...otherWords]
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(word => word.japanese)

    return [currentQuestion.japanese, ...wrongChoices].sort(() => 0.5 - Math.random())
  }

  return {
    category: category!,
    rangeStart: rangeStart!,
    rangeSize: rangeSize!,
    words,
    dataError,
    quizQuestions,
    user,
    categoryEmoji: getCategoryEmoji(category!),
    categoryName: getCategoryName(category!),
    markAsWeak,
    handleNextRange,
    handleNavigateToRange,
    handleNavigateToTop,
    generateCustomChoices,
  }
}