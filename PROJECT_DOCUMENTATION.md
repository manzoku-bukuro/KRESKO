# MEMORU プロジェクト設計書

**最終更新日**: 2025-10-04

## プロジェクト概要

MEMORUは、エスペラント語学習を支援するReactベースのWebアプリケーションです。単語学習、疑問詞学習、数字学習など複数の学習モードを提供し、ユーザーの理解度に応じた苦手問題管理機能も備えています。

## アーキテクチャ概要

### 技術スタック
- **フロントエンド**: React 19.1.1 + TypeScript ~5.8.3 + Vite 6.3.5
- **ルーティング**: React Router DOM 7.9.1
- **認証**: Firebase Authentication 12.3.0
- **データベース**: Firebase Firestore 12.3.0
- **スタイリング**: CSS Variables + Tailwind CSS v4
- **テスト**: Vitest 3.2.4 + React Testing Library 16.1.0
- **コンポーネント開発**: Storybook 9.1.8
- **デプロイ**: Netlify

### アプリケーション構成

```
MEMORU/
├── src/
│   ├── components/          # 共通UIコンポーネント
│   │   ├── UnifiedQuiz/     # 統合クイズコンポーネント
│   │   ├── AnswerResult/    # 解答結果表示
│   │   ├── ChoiceButtons/   # 4択選択ボタン
│   │   ├── QuizHeader/      # クイズヘッダー
│   │   ├── WordList/        # 単語一覧表示
│   │   ├── ModeToggle/      # モード切り替え
│   │   ├── AuthModal/       # 認証モーダル
│   │   ├── LoginForm/       # ログインフォーム
│   │   ├── SignupForm/      # サインアップフォーム
│   │   ├── Header/          # ヘッダー
│   │   ├── Footer/          # フッター
│   │   ├── AuthButton/      # 認証ボタン
│   │   └── AdBanner/        # 広告バナー
│   ├── pages/               # ルーティング専用（薄いラッパー）
│   │   ├── Exam/            # 検定試験ルート
│   │   ├── Topics/          # 学習トピックルート
│   │   ├── Games/           # ゲームルート
│   │   ├── SavedQuestions/  # 保存した問題ルート
│   │   ├── Top.tsx          # トップページ
│   │   └── PrivacyPolicy.tsx # プライバシーポリシー
│   ├── services/            # データアクセス層
│   │   ├── data/            # DataService実装
│   │   └── firebase/        # Firebase関連サービス
│   ├── hooks/               # グローバルカスタムフック
│   │   ├── useQuizEngine.ts # クイズエンジン
│   │   └── useAuth.ts       # 認証管理
│   ├── utils/               # ユーティリティ
│   ├── types/               # 型定義
│   │   ├── domain/          # ドメインモデル型
│   │   └── ui/              # UIコンポーネント型
│   └── routes/              # ルーティング設定
│       ├── staticRoutes.tsx # 静的ページルート
│       ├── examRoutes.tsx   # 検定試験ルート
│       ├── topicsRoutes.tsx # 学習トピックルート
│       └── userRoutes.tsx   # ユーザー機能ルート
└── [Config files]
```

## コンポーネント設計パターン

### 1. Container/View/Hook パターン
責任分離とメンテナンス性向上のため、以下の構造を採用：

```
src/components/ComponentName/
├── index.tsx                   # 外部公開インターフェース
├── ComponentName.tsx           # Container（ロジック統合）
├── ComponentName.view.tsx      # View（プレゼンテーション層）
├── ComponentName.types.ts      # 型定義
├── ComponentName.test.tsx      # Containerのテスト（必須）
├── ComponentName.stories.tsx   # Storybook（必須）
└── hooks/
    ├── useComponentName.ts     # カスタムフック
    └── useComponentName.test.ts # フックのテスト（必須）
```

**完全適用済みコンポーネント**:
- UnifiedQuiz, AnswerResult, ChoiceButtons, QuizHeader, WordList, ModeToggle
- Header, Footer, AuthButton, AdBanner, LoginForm, SignupForm, AuthModal

### 2. データアクセス層（DataService パターン）
データ取得を統一インターフェースで抽象化：

```typescript
interface IDataSource<T> {
  getData(): Promise<T[]>
}

class DataService<T> {
  constructor(private source: IDataSource<T>)
  async load(): Promise<T[]>
}
```

**実装済みデータソース**:
- `JsonDataSource` - ローカルJSONファイル読み込み
- `DataServiceFactory` - Singletonパターンでインスタンス管理

### 3. 共通化コンポーネント
重複するUI要素を抽出し、再利用可能なコンポーネントとして実装：

#### UnifiedQuiz
- **目的**: 全学習モードで使用する統合クイズコンポーネント
- **機能**: 問題表示、進捗管理、モード切り替え、結果表示
- **アーキテクチャ**: Container（23行）+ View（334行）+ Hook（115行）
- **使用箇所**: Exam/Quiz, Topics/Interrogative/Basic, Topics/Interrogative/Advanced

#### AnswerResult
- **目的**: 解答結果の統一表示
- **バリアント**: traditional（従来型）, choice（選択型）, game（ゲーム型）
- **使用箇所**: UnifiedQuiz, NumberGame

#### WordList
- **目的**: 学習済み単語一覧の統一表示
- **特徴**: 間違い問題のマーキング機能
- **使用箇所**: UnifiedQuiz

#### QuizHeader
- **目的**: クイズタイトルと進捗表示の統一
- **機能**: プログレスバー、問題番号、ModeToggle統合
- **使用箇所**: UnifiedQuiz

#### ChoiceButtons
- **目的**: 4択選択UIの統一
- **特徴**: 正解/不正解の視覚フィードバック
- **使用箇所**: UnifiedQuiz

#### ModeToggle
- **目的**: 学習モード切り替えの統一
- **モード**: traditional（従来型）, multiple-choice（4択型）
- **使用箇所**: QuizHeader（UnifiedQuiz経由）

## データ構造とアクセス層

### 型システム（src/types/）
アプリケーション全体で使用する型を一元管理：

#### ドメインモデル型（types/domain/）
```typescript
interface Word {
  esperanto: string
  japanese: string
  extra?: string
}

type QuizMode = 'traditional' | 'multiple-choice'
type ResultType = 'correct' | 'incorrect' | null
```

#### UIコンポーネント型（types/ui/）
```typescript
interface QuizMetadata {
  title: string
  subtitle?: string
}

interface CompletionConfig {
  title?: string
  message?: string
  showStats?: boolean
}
```

### データアクセス層（services/data/）
DataServiceパターンでデータ取得を抽象化：

```typescript
// データソース統一インターフェース
interface IDataSource<T> {
  getData(): Promise<T[]>
}

// JSONファイル読み込み実装
class JsonDataSource implements IDataSource<Word> {
  async getData(): Promise<Word[]> {
    const response = await fetch(this.filePath)
    return await response.json()
  }
}

// Singletonパターンでインスタンス管理
class DataServiceFactory {
  static getEsuken4Service(): DataService<Word>
  static getInterrogativeService(): DataService<Word>
}
```

**データソース**:
- `esuken4.json`: エス検4級用データ（vorto/意味/意味続きフィールド）
- `interrogative.json`: 疑問詞学習用データ

## 学習機能アーキテクチャ

### クイズシステム（useQuizEngine）
カスタムフック `useQuizEngine` で全クイズロジックを管理：

**主要機能**:
1. **問題選択**: 指定範囲からランダムに最大10問選出（シャッフル機能付き）
2. **モード切り替え**: traditional（フラッシュカード式）⇔ multiple-choice（4択型）
3. **進捗管理**: リアルタイム進捗表示、問題数カウント
4. **結果記録**: 間違い問題の自動記録とインデックス管理
5. **選択肢生成**: ランダムな誤答選択肢の生成

**状態管理**:
```typescript
interface QuizEngineState {
  questions: Word[]           // 現在の問題セット
  index: number               // 現在の問題インデックス
  quizMode: QuizMode          // 学習モード
  showResult: boolean         // 結果表示フラグ
  currentResult: ResultType   // 現在の解答結果
  incorrectQuestions: number[] // 間違えた問題のインデックス
  choices: string[]           // 4択の選択肢
}
```

### UnifiedQuizコンポーネント
全学習モードで使用する統合クイズコンポーネント：

**アーキテクチャ**:
- Container（23行）: Props受け取りと統合
- View（334行）: UI表示とユーザー操作
- Hook（115行）: ビジネスロジックとuseQuizEngine連携

**主要機能**:
- エラー/ローディング/完了状態の管理
- カスタムアクション挿入（before/after各UI要素）
- 完了時コールバック、終了時コールバック

### 苦手問題管理（Firebase Firestore）
- 間違えた問題の自動保存（ユーザー別）
- 専用復習モード（SavedQuestions/Review）
- 理解済み問題の削除機能（Firestore更新）

## スタイリングシステム

### CSS Variables + Tailwind CSS
既存のCSS変数システムを保持しながらTailwind CSS v4を導入：

```css
/* 既存のCSS変数 */
:root {
  --primary-color: #2563eb;
  --success-color: #16a34a;
  --danger-color: #dc2626;
}

/* Tailwind @theme設定で統合 */
@theme {
  colors: {
    primary: var(--primary-color);
    success: var(--success-color);
    danger: var(--danger-color);
  }
}
```

### クラス設計方針
- 重要なUI要素は既存のCSS class使用（`btn`, `choice-btn`など）
- 新規コンポーネントはTailwindを活用
- 一貫性維持のため、既存システムとの競合を避ける

## テスト・開発環境

### テスト設定
- **フレームワーク**: Vitest + React Testing Library
- **設定**: `vitest.config.ts`でjsdom環境とグローバル関数を有効化
- **対象**: 基本コンポーネント、ユーティリティ関数

### Storybook環境
- **バージョン**: v9.1.8
- **アドオン**: A11y（アクセシビリティ）、Vitest統合
- **対象**: 共通化コンポーネントのストーリー作成済み

## デプロイ・運用

### Netlify設定
- **自動デプロイ**: Gitプッシュで自動ビルド・デプロイ
- **ビルドコマンド**: `npm run build`（Vite使用）
- **パブリックパス**: `/`（全環境共通）

### 開発コマンド
```bash
npm run dev      # 開発サーバー起動
npm run build    # 本番ビルド
npm run lint     # ESLint実行
npm run preview  # 本番ビルドプレビュー
npm run deploy   # Netlify直接デプロイ
```

## 実装済みリファクタリング効果（2025-10-04時点）

### コード削減実績
- **UnifiedQuiz統合**: Quiz.tsx 370行 → Container 23行（347行削減）
- **DataService導入**: データアクセス層の統一、normalizeWords関数削除
- **型システム統一**: src/types/への一元化、コンポーネント間の型再利用
- **ルーティングモジュール化**: App.tsx分割（4モジュール）
- **パスエイリアス導入**: 相対パス `../../` → `@/*` 統一
- **合計**: 約500行以上のコード削減、メンテナンス性大幅向上

### アーキテクチャ改善
1. **Container/View/Hook分離**: 全12コンポーネントで完全適用
2. **DataService層**: データ取得を統一インターフェースで抽象化
3. **型の一元管理**: domain/ui分離で型の再利用性向上
4. **テスト完備**: 79テスト全てパス、カバレッジ向上
5. **Storybook完備**: 全コンポーネントでストーリー作成

### 一貫性向上
- UI要素の統一により、ユーザー体験の一貫性確保
- スタイリング規則の統一（CSS Variables + Tailwind CSS v4）
- 型安全性の強化（`any`型の排除、strict mode対応）
- ファイル命名規則の統一（.view.tsx, .types.ts, .test.tsx, .stories.tsx）

## 今後の検討事項・改善案

### 1. アーキテクチャ強化
- **状態管理**: Zustand/Reduxの導入検討（アプリ成長時）
- **コンポーネント設計**: 全コンポーネントのColocation化
- **型安全性**: より厳密な型定義の追加

### 2. 機能拡張
- **学習分析**: 学習履歴・統計機能
- **AI機能**: 個人化された学習推薦
- **オフライン対応**: PWA化検討
- **多言語対応**: i18n導入

### 3. パフォーマンス最適化
- **コード分割**: React.lazy()での動的インポート
- **画像最適化**: 次世代フォーマット対応
- **バンドル最適化**: 使用していないコードの削除

### 4. 開発体験向上
- **自動テスト**: CI/CD統合、カバレッジ向上
- **ドキュメント**: コンポーネントAPI仕様書
- **開発ツール**: ESLint・Prettier設定強化

### 5. セキュリティ・保守性
- **依存関係**: 定期的な更新戦略
- **セキュリティ**: Firebase Security Rules見直し
- **エラーハンドリング**: エラー境界・ロギング強化

## 既知の技術的課題（2025-10-04時点）

### ESLint警告（実用上問題なし）
1. **react-refresh/only-export-components**: 12箇所（Storybook, Routing設定）
2. **Storybook imports**: `@storybook/react` → `@storybook/react-vite` 推奨

### パフォーマンス最適化の余地
1. **バンドルサイズ**: 906KB（コード分割で改善可能）
2. **useQuizEngine**: 298行（さらなる分割検討中）
3. **utils/firestore.ts**: 169行（モジュール化検討中）

### メンテナンス推奨項目
1. 定期的な依存関係更新（セキュリティ対応）
2. Firebase料金・使用量監視
3. Netlifyビルド時間最適化
4. 未使用コード・コンポーネントの定期清掃

---

## まとめ

MEMORUプロジェクトは現在、堅実な技術基盤の上に構築されており、共通化によるコード品質向上も完了しています。今後は機能拡張と技術的深化の両面からの発展が期待されます。特に、学習効果の向上とユーザー体験の個人化が重要な方向性となるでしょう。