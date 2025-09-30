# 2025-10-01: コンポーネントのリファクタリングと命名統一

## 変更内容

### 1. Quiz.tsxのContainer/View分離
- **問題**: Quiz.tsxがロジックとUIが混在（115行）
- **解決**: Container/View分離
  - `Quiz.tsx` (40行) - Container
  - `Quiz.view.tsx` (117行) - View
  - `Quiz.types.ts` - 型定義追加
  - `Quiz.view.test.tsx` - View層テスト（後に削除）

### 2. AuthModalのディレクトリ化
- **問題**: `AuthModal.tsx`が単独ファイル（ディレクトリなし）
- **解決**: 標準ディレクトリ構造に移行

**新構造**:
```
AuthModal/
├── AuthModal.tsx           # Container
├── AuthModal.view.tsx      # View
├── AuthModal.types.ts      # 型定義
├── AuthModal.test.tsx      # Containerテスト
├── AuthModal.stories.tsx   # Storybook
├── hooks/
│   ├── useAuthModal.ts     # カスタムフック
│   └── useAuthModal.test.ts
└── index.tsx
```

### 3. 命名規則の統一
- **問題**: `src/components/`内で`.View.tsx`（大文字V）が使われていた
- **解決**: `.view.tsx`（小文字v）に統一

**変更したファイル（10個）**:
- AdBanner, AnswerResult, AuthButton, ChoiceButtons, Footer
- LoginForm, ModeToggle, QuizHeader, SignupForm, WordList

**自動更新**: import文もsedコマンドで一括変換

### 4. テスト方針の明確化
- **決定**: View層のテストは不要
- **理由**: Storybookで視覚確認、Containerテストで統合テスト

**新しいテスト方針**:
| ファイル | テスト | 理由 |
|---------|--------|------|
| Container | ✅ 必須 | ロジック・統合 |
| View | ❌ 不要 | Storybook確認 |
| Hooks | ✅ 必須 | ビジネスロジック |
| Utils | ✅ 必須 | 純粋関数 |

## 理由

### アーキテクチャの一貫性
- 全コンポーネントで同じ構造・命名規則
- 将来のメンテナンスが容易
- Next.js移行への準備

### 品質向上
- テストカバレッジの向上
- Storybookによる視覚的ドキュメント
- 型安全性の強化

## 検証結果

- ✅ TypeScript: エラーなし
- ✅ 開発サーバー: 起動確認済み
- ✅ 後方互換性: 維持

## 今後の方針

### Next.js移行計画
**ビジネス戦略**:
- SEO強化（無料コンテンツで集客）
- マネタイゼーション（有料コンテンツ）
- コンテンツマーケティング

**移行タイミング**:
1. **Phase 1（現在）**: アーキテクチャ整理 ✅
   - Container/View分離完了
   - ディレクトリ構造整理完了
   - 命名規則統一完了

2. **Phase 2（次）**: コンテンツ拡充
   - テストカバレッジ向上
   - 学習コンテンツ追加
   - ユーザーフィードバック収集

3. **Phase 3（その後）**: Next.js移行
   - アーキテクチャ準備完了後
   - コンテンツ戦略明確化後
   - ユーザー獲得後

**Next.js移行時の構成案**:
```
app/
├── (marketing)/      # 無料（SSG/SSR）
│   ├── blog/
│   └── tutorials/
├── (app)/           # 有料（CSR）
│   ├── quiz/
│   └── dashboard/
└── api/
    ├── checkout/    # Stripe
    └── subscription/
```

## 参考

- 詳細設計書: `/ARCHITECTURE.md`
- リファクタリング計画: 完了（統合済み）