# TODO - 次回作業項目

**最終更新**: 2025-10-03

---

## 🔴 高優先度（次回すぐやる）

### 1. 動作確認
- [x] 開発サーバー起動確認 (`npm run dev`) ✅
- [ ] 全ページの動作確認（手動）
  - [ ] Top
  - [ ] NumberGame
  - [ ] Exam/RangeSelect
  - [ ] Exam/Quiz
  - [ ] Topics/Interrogative/Menu
  - [ ] Topics/Interrogative/Explanation
  - [ ] Topics/Interrogative/Basic
  - [ ] Topics/Interrogative/Advanced
  - [ ] SavedQuestions/List
  - [ ] SavedQuestions/Review
  - [ ] PrivacyPolicy

### 2. テスト実行
- [x] `npm test` で全テスト実行 ✅ (79テスト全てパス)
- [x] 新規テストの動作確認 ✅
  - [x] AuthModal関連テスト
  - [x] useAuthModalフックテスト

---

## 🟡 中優先度

### 3. Storybook確認
- [x] `npm run storybook` 起動 ✅
- [x] AuthModalのストーリー確認 ✅
  - [x] LoginMode
  - [x] SignupMode
  - [x] Closed

### 4. テストカバレッジ向上
**現状**: 12コンポーネント全てにテスト完備 ✅

**完了したコンポーネント**:
- [x] AdBanner ✅
- [x] AnswerResult ✅
- [x] AuthButton ✅
- [x] ChoiceButtons ✅
- [x] LoginForm ✅
- [x] ModeToggle ✅
- [x] QuizHeader ✅
- [x] SignupForm ✅
- [x] WordList ✅

---

## 🟢 低優先度（余裕があれば）

### 5. ESLintエラー修正
- [x] `any`型の置き換え ✅ (13箇所修正完了)
- [x] `require()`の置き換え ✅ (9ファイル修正完了)
- [x] 空のinterface修正 ✅ (5箇所修正完了)
- [ ] Storybook警告の対応 (機能に影響なし、保留)
- [ ] react-refresh警告の対応 (実用上問題なし、保留)

### 6. コンテンツ拡充準備
- [ ] 新しい学習トピックの企画
- [ ] SEOキーワード調査
- [ ] 無料コンテンツの企画（ブログ、チュートリアル）

---

## 📋 Phase 2: コンテンツ拡充（中期）

### ユーザー獲得
- [ ] 無料教材の執筆
- [ ] ブログコンテンツ作成
- [ ] SEO対策（メタタグ、構造化データ）
- [ ] アクセス解析導入

### マネタイゼーション準備
- [ ] 有料コンテンツの企画
- [ ] 価格設定の検討
- [ ] Stripe調査・導入準備

---

## 🚀 Phase 3: Next.js移行（長期）

### 移行前準備
- [ ] テストカバレッジ80%以上
- [ ] コンポーネント再利用性の向上
- [ ] ユーザーフィードバック収集
- [ ] コンテンツ戦略の明確化

### 移行実施
- [ ] Next.js App Routerの学習
- [ ] Firebase + Next.jsの調査
- [ ] 段階的移行計画の策定
- [ ] (marketing)ルート作成（SEO用）
- [ ] (app)ルート作成（クイズアプリ用）
- [ ] API Routes作成（Stripe連携）

---

## 📝 メモ

### 今日完了したこと（2025-10-03）
- ✅ 開発サーバー起動確認（http://localhost:5173/）
- ✅ 全テスト実行（79テスト全てパス）
- ✅ Storybook起動確認（http://localhost:6006/）
- ✅ テストカバレッジ向上（9コンポーネントのテスト作成）
  - AdBanner, AnswerResult, AuthButton, ChoiceButtons
  - LoginForm, ModeToggle, QuizHeader, SignupForm, WordList
- ✅ ESLintエラー修正（76個 → 39個に削減）
  - `any`型の置き換え（13箇所）
  - テストファイルの`require()`を`vi.mocked()`に変更（9ファイル）
  - 空のinterface修正（5箇所）
  - 未使用変数の削除（3箇所）

### 前回完了したこと（2025-10-01）
- ✅ Quiz.tsxのContainer/View分離
- ✅ AuthModalのディレクトリ化
- ✅ `.View.tsx` → `.view.tsx` 命名統一（10ファイル）
- ✅ View層テスト方針の明確化
- ✅ Next.js移行戦略の策定

### 技術的な決定事項
- View層のテストは不要（Storybookで視覚確認）
- Container層（ロジック層）のテストは必須
- Next.js移行は準備完了後（Phase 3）
- SEO重視の事業戦略に対応

### 参考ドキュメント
- `/ARCHITECTURE.md` - 設計書
- `/docs/changes/` - プロジェクト記録
- `/CLAUDE.md` - 開発ガイド