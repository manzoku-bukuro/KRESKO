import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { saveWeakQuestion } from '@/utils/firestore'
import { getDataService } from '@/services'
import type { QuizQuestion, CategoryId } from '@/types/domain'

export const useQuiz = () => {
  const { category } = useParams<{
    category: string
  }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  // クエリパラメータから開始位置を取得（デフォルト: 1）
  const rangeStart = searchParams.get('start') || '1'
  // 固定で10問出題
  const rangeSize = '10'

  const [dataError, setDataError] = useState<string | null>(null)

  // ドリル式へのアクセスをブロック
  useEffect(() => {
    if (category === 'drill') {
      navigate('/', { replace: true })
      return
    }
  }, [category, navigate])

  // DataServiceを使用して単語データを取得
  const dataService = useMemo(() => getDataService(), [])

  const words = useMemo(() => {
    try {
      return dataService.getAllWords(category as CategoryId)
    } catch (error) {
      console.error('データ取得エラー:', error)
      return []
    }
  }, [dataService, category])

  const metadata = useMemo(() => {
    try {
      return dataService.getDataSource(category as CategoryId).getMetadata()
    } catch {
      return null
    }
  }, [dataService, category])

  const start = useMemo(() => Number(rangeStart) - 1, [rangeStart])
  const size = useMemo(() => Number(rangeSize), [rangeSize])

  // データの整合性チェック
  useEffect(() => {
    if (!category) {
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
  }, [category, words, start])

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
      navigate(`/quiz/${category}?start=${nextStart}`)
    } else {
      // 末尾を超えたら単語リストに戻る
      navigate(`/wordlist/${category}`)
    }
  }

  const handleNavigateToRange = () => {
    navigate(`/wordlist/${category}`)
  }

  const handleNavigateToTop = () => {
    navigate('/')
  }

  // 選択肢生成関数
  const generateCustomChoices = (currentQuestion: QuizQuestion, allQuestions: QuizQuestion[]): string[] => {
    const otherWords = allQuestions.filter(word => word.japanese !== currentQuestion.japanese)
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
    categoryEmoji: metadata?.emoji || '📖',
    categoryName: metadata?.name || category!,
    markAsWeak,
    handleNextRange,
    handleNavigateToRange,
    handleNavigateToTop,
    generateCustomChoices,
  }
}