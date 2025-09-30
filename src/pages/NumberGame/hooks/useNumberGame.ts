import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { updatePageMeta, seoData } from '../../../utils/seo'
import { numberToEsperanto, esperantoNumbers, generateRandomNumber } from '../utils/esperanto'
import type { Card, GameResult } from '../NumberGame.types'

export const useNumberGame = () => {
  const navigate = useNavigate()
  const [targetNumber, setTargetNumber] = useState(2521)
  const [selectedCards, setSelectedCards] = useState<Card[]>([])
  const [cards, setCards] = useState<Card[]>([])
  const [result, setResult] = useState<GameResult>({
    show: false,
    correct: false,
    message: '',
  })

  // SEO meta tags
  useEffect(() => {
    updatePageMeta(seoData.numberGame.title, seoData.numberGame.description)
  }, [])

  // Create and shuffle cards
  const createCards = useCallback(() => {
    const cardData: Card[] = [
      { value: 1, word: 'unu' },
      { value: 2, word: 'du' },
      { value: 3, word: 'tri' },
      { value: 4, word: 'kvar' },
      { value: 5, word: 'kvin' },
      { value: 6, word: 'ses' },
      { value: 7, word: 'sep' },
      { value: 8, word: 'ok' },
      { value: 9, word: 'naŭ' },
      { value: 10, word: 'dek' },
      { value: 100, word: 'cent' },
      { value: 1000, word: 'mil' },
    ]

    const shuffledCards = [...cardData].sort(() => Math.random() - 0.5)
    setCards(shuffledCards)
  }, [])

  // Initialize cards on mount
  useEffect(() => {
    createCards()
  }, [createCards])

  const selectCard = useCallback((value: number, word: string) => {
    setSelectedCards(prev => [...prev, { value, word }])
    if (result.show) {
      setResult({ show: false, correct: false, message: '' })
    }
  }, [result.show])

  const removeCard = useCallback((index: number) => {
    setSelectedCards(prev => prev.filter((_, i) => i !== index))
    if (result.show) {
      setResult({ show: false, correct: false, message: '' })
    }
  }, [result.show])

  const clearSelection = useCallback(() => {
    setSelectedCards([])
    setResult({ show: false, correct: false, message: '' })
  }, [])

  const checkAnswer = useCallback(() => {
    const correctAnswer = numberToEsperanto(targetNumber)
    const userAnswer = selectedCards.map(card => card.value)

    const isCorrect = JSON.stringify(correctAnswer) === JSON.stringify(userAnswer)

    if (isCorrect) {
      setResult({
        show: true,
        correct: true,
        message: '🎉 正解です！素晴らしい！',
      })
    } else {
      const correctWords = correctAnswer.map(val => esperantoNumbers[val])
      setResult({
        show: true,
        correct: false,
        message: `正解は: ${correctWords.join(' ')}`,
      })
    }
  }, [targetNumber, selectedCards])

  const newGame = useCallback(() => {
    const newNumber = generateRandomNumber()
    setTargetNumber(newNumber)
    clearSelection()
    createCards()
  }, [clearSelection, createCards])

  const navigateToTop = useCallback(() => {
    navigate('/')
  }, [navigate])

  return useMemo(() => ({
    targetNumber,
    selectedCards,
    cards,
    result,
    onSelectCard: selectCard,
    onRemoveCard: removeCard,
    onClearSelection: clearSelection,
    onCheckAnswer: checkAnswer,
    onNewGame: newGame,
    onNavigateToTop: navigateToTop,
  }), [
    targetNumber,
    selectedCards,
    cards,
    result,
    selectCard,
    removeCard,
    clearSelection,
    checkAnswer,
    newGame,
    navigateToTop,
  ])
}