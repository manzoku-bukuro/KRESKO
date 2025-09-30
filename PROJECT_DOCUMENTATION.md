# MEMORU プロジェクト設計書

## プロジェクト概要

MEMORUは、エスペラント語学習を支援するReactベースのWebアプリケーションです。単語学習、疑問詞学習、数字学習など複数の学習モードを提供し、ユーザーの理解度に応じた苦手問題管理機能も備えています。

## アーキテクチャ概要

### 技術スタック
- **フロントエンド**: React 19 + TypeScript + Vite
- **ルーティング**: React Router DOM
- **認証**: Firebase Authentication
- **データベース**: Firebase Firestore
- **スタイリング**: CSS Variables + Tailwind CSS v4
- **テスト**: Vitest + React Testing Library
- **コンポーネント開発**: Storybook v9.1.8
- **デプロイ**: Netlify

### アプリケーション構成

```
MEMORU/
├── src/
│   ├── components/          # 共通UIコンポーネント
│   │   ├── AnswerResult/    # 解答結果表示
│   │   ├── ChoiceButtons/   # 4択選択ボタン
│   │   ├── QuizHeader/      # クイズヘッダー
│   │   ├── WordList/        # 単語一覧表示
│   │   ├── ModeToggle/      # モード切り替え
│   │   └── [Other Components]/
│   ├── pages/               # ページコンポーネント
│   │   ├── Top.tsx          # カテゴリ選択
│   │   ├── RangeSelect.tsx  # 範囲選択
│   │   ├── Quiz.tsx         # メインクイズ
│   │   ├── NumberGame.tsx   # 数字ゲーム
│   │   ├── InterrogativeBasic.tsx    # 疑問詞基本
│   │   ├── InterrogativeAdvanced.tsx # 疑問詞応用
│   │   └── WeakQuestionsReview.tsx   # 苦手問題復習
│   ├── data/                # 学習データ
│   └── utils/               # ユーティリティ
└── [Config files]
```

## コンポーネント設計パターン

### 1. Colocation パターン（一部コンポーネント）
責任分離とメンテナンス性向上のため、以下の構造を採用：

```
src/components/ComponentName/
├── index.tsx                # 外部公開インターフェース
├── ComponentName.tsx        # ビジネスロジック統合
├── ComponentName.View.tsx   # プレゼンテーション層
├── ComponentName.types.ts   # 型定義
└── hooks/
    └── useComponentNameData.ts  # カスタムフック
```

**適用済みコンポーネント**:
- Header, Footer, AuthButton, AdBanner, LoginForm, SignupForm

### 2. 共通化コンポーネント
重複するUI要素を抽出し、再利用可能なコンポーネントとして実装：

#### AnswerResult
- **目的**: 解答結果の統一表示
- **バリアント**: traditional（従来型）, choice（選択型）, game（ゲーム型）
- **使用箇所**: Quiz, InterrogativeBasic, InterrogativeAdvanced, NumberGame

#### WordList
- **目的**: 学習済み単語一覧の統一表示
- **特徴**: 間違い問題のマーキング機能
- **使用箇所**: Quiz, InterrogativeBasic, InterrogativeAdvanced, WeakQuestionsReview

#### QuizHeader
- **目的**: クイズタイトルと進捗表示の統一
- **機能**: プログレスバー、問題番号、モード切り替え統合
- **使用箇所**: Quiz, InterrogativeBasic, InterrogativeAdvanced, WeakQuestionsReview

#### ChoiceButtons
- **目的**: 4択選択UIの統一
- **特徴**: 正解/不正解の視覚フィードバック
- **使用箇所**: Quiz, InterrogativeBasic, InterrogativeAdvanced, WeakQuestionsReview

#### ModeToggle
- **目的**: 学習モード切り替えの統一
- **モード**: traditional（従来型）, multiple-choice（4択型）
- **使用箇所**: Quiz, InterrogativeAdvanced, WeakQuestionsReview

## データ構造と正規化

### 単語データ形式
異なるデータソースを統一インターフェースで扱う：

```typescript
interface Word {
  esperanto: string;
  japanese: string;
  extra?: string;
}
```

**データソース**:
- `vortaro.json`: ドリル式用データ
- `esuken4.json`: エス検4級用データ（意味続きフィールド付き）

### 正規化処理
`Quiz.tsx`の`normalizeWords()`関数で各形式を共通形式に変換。

## 学習機能アーキテクチャ

### クイズシステム
1. **問題選択**: 指定範囲からランダムに最大10問選出
2. **モード切り替え**: 従来型（フラッシュカード式）⇔ 4択型
3. **進捗管理**: リアルタイム進捗表示
4. **結果記録**: 間違い問題の自動記録

### 苦手問題管理
- Firebase Firestoreを使用
- 間違えた問題の自動保存
- 専用復習モードの提供
- 理解済み問題の削除機能

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

## 実装済みリファクタリング効果

### コード削減実績
- **AnswerResult共通化**: ~120行の重複コード削減
- **WordList共通化**: ~80行の重複コード削減
- **QuizHeader共通化**: ~40行の重複コード削減
- **合計**: 約240行のコード削減、メンテナンス性大幅向上

### 一貫性向上
- UI要素の統一により、ユーザー体験の一貫性確保
- スタイリング規則の統一
- 型安全性の強化

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

## 技術的負債・注意点

### 既知の課題
1. **ドリル式データの非使用**: 現在ブロック中、将来的な活用方法要検討
2. **CSS Variables vs Tailwind**: 統合方針の一層の明確化が必要
3. **コンポーネント責任**: 一部のページコンポーネントが肥大化

### メンテナンス推奨項目
1. 定期的な依存関係更新（セキュリティ対応）
2. Firebase料金・使用量監視
3. Netlifyビルド時間最適化
4. 未使用コード・コンポーネントの定期清掃

---

## まとめ

MEMORUプロジェクトは現在、堅実な技術基盤の上に構築されており、共通化によるコード品質向上も完了しています。今後は機能拡張と技術的深化の両面からの発展が期待されます。特に、学習効果の向上とユーザー体験の個人化が重要な方向性となるでしょう。