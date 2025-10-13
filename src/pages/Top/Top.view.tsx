import { Trophy, BookOpen, Gamepad2, BookmarkCheck } from 'lucide-react'
import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'
import { StarLogo } from '../../components/StarLogo'
import { LearningModeCard } from '../../components/LearningModeCard'
import type { TopViewProps } from './Top.types'

export const TopView = ({
  weakQuestionsCount,
  onNavigateToExam,
  onNavigateToInterrogative,
  onNavigateToNumberGame,
  onNavigateToWeakQuestions,
}: TopViewProps) => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="mx-auto w-full max-w-[375px] flex-1 px-4 py-8">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center">
            <StarLogo className="h-20 w-20 text-primary drop-shadow-lg" />
          </div>
          <h1 className="mb-3 font-sans text-3xl font-bold tracking-tight text-foreground">
            MEMORU
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground">
            エスペラント語を楽しく学ぼう
          </p>
        </div>

        <div className="space-y-4">
          <LearningModeCard
            title="エス検対策"
            description="検定試験の対策学習"
            icon={Trophy}
            onClick={onNavigateToExam}
            color="primary"
          />

          <LearningModeCard
            title="トピック学習"
            description="疑問詞や文法の学習"
            icon={BookOpen}
            onClick={onNavigateToInterrogative}
            color="secondary"
          />

          <LearningModeCard
            title="ゲーム"
            description="楽しく学べるゲーム"
            icon={Gamepad2}
            onClick={onNavigateToNumberGame}
            color="accent"
          />
        </div>

        <div className="mt-8">
          <h2 className="mb-4 font-sans text-lg font-bold text-foreground">学習管理</h2>
          <LearningModeCard
            title="苦手問題"
            description={`保存した問題を復習 (${weakQuestionsCount}問)`}
            icon={BookmarkCheck}
            onClick={onNavigateToWeakQuestions}
            color="primary"
            badge={weakQuestionsCount}
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}
