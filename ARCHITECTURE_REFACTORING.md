# アーキテクチャリファクタリング計画

**最終更新日**: 2025-10-01

## リファクタリング進捗状況

### 完了済み ✅
1. **Top** - トップページ (/, 2025-10-01完了)
2. **PrivacyPolicy** - プライバシーポリシー (/privacy-policy, 2025-10-01完了)
3. **NumberGame** - 数字当てゲーム (/number-game, 2025-10-01完了)
4. **SavedQuestions/List** - 苦手問題一覧 (/weak-questions, 2025-10-01完了)
5. **SavedQuestions/Review** - 苦手問題復習 (/weak-questions-review, 2025-10-01完了)
6. **Exam/RangeSelect** - 範囲選択 (/range/:category, 2025-10-01完了)
7. **Exam/Quiz** - クイズ実行 (/quiz/:category/:rangeStart/:rangeSize, 2025-10-01完了)
8. **Topics/Interrogative/Menu** - 疑問詞メニュー (/interrogative-menu, 2025-10-01完了)
9. **Topics/Interrogative/Explanation** - 疑問詞説明 (/interrogative-explanation, 2025-10-01完了)

### 完了済み（続き） ✅
10. **Topics/Interrogative/Basic** - 疑問詞基本学習 (/interrogative-basic, 2025-10-01完了)
11. **Topics/Interrogative/Advanced** - 疑問詞応用問題 (/interrogative-advanced, 2025-10-01完了)

### 全体進捗
- **完了**: 11/11 ページ (100%) 🎉
- **残り**: 0 ページ

### 検証結果
- ✅ TypeScript: エラーなし
- ⚠️ ESLint: 既存の components/ 内の問題のみ（新規コードにエラーなし）

---

## 目的

現在のフラットなディレクトリ構造を、機能ごとにグループ化された階層構造にリファクタリングする。
将来的な拡張性を考慮し、新しい学習コンテンツやゲームモードを追加しやすい設計にする。

## 現状の問題点

1. **フラットなルーティング**: 11個のルートが平坦に並んでおり、関連性が見えにくい
2. **スケーラビリティの欠如**: 新しいカテゴリ（エス検3級、発音、時制など）を追加する際の構造が不明確
3. **ディレクトリ構造の不一致**: ルーティングとファイル配置の関係性が弱い

## 新しいディレクトリ構造

### 概要

- **src/pages/**: ルーティング専用の薄いラッパーコンポーネント
- **src/features/**: 各機能の実装本体（コンポーネント、hooks、utils、data）

```
src/
├── pages/                    # ルーティング専用（薄いラッパー）
│   ├── index.tsx             # / → features/Top
│   ├── privacy-policy.tsx    # /privacy-policy → features/PrivacyPolicy
│   ├── exam/
│   │   ├── [level]/
│   │   │   ├── select.tsx    # /exam/:level/select
│   │   │   └── [rangeStart]/[rangeSize].tsx  # /exam/:level/:rangeStart/:rangeSize
│   ├── topics/
│   │   └── [topic]/
│   │       ├── index.tsx     # /topics/:topic (Menu)
│   │       ├── explanation.tsx
│   │       ├── basic.tsx
│   │       └── advanced.tsx
│   ├── games/
│   │   └── number.tsx        # /games/number
│   └── saved-questions/
│       ├── index.tsx         # /saved-questions (List)
│       └── review.tsx        # /saved-questions/review
│
└── features/                 # 機能実装本体
    ├── Top/                  # トップページ機能
    │   ├── Top.tsx
    │   ├── Top.View.tsx
    │   └── index.tsx
    │
    ├── PrivacyPolicy/        # プライバシーポリシー機能
    │   ├── PrivacyPolicy.tsx
    │   └── index.tsx
    │
    ├── Exam/                 # 検定試験機能
    │   ├── RangeSelect/
    │   │   ├── RangeSelect.tsx
    │   │   ├── RangeSelect.View.tsx
    │   │   ├── RangeSelect.types.ts
    │   │   └── hooks/
    │   ├── Quiz/
    │   │   ├── Quiz.tsx
    │   │   ├── Quiz.View.tsx
    │   │   ├── Quiz.types.ts
    │   │   └── hooks/
    │   ├── shared/           # Exam機能内で共有
    │   │   ├── hooks/
    │   │   └── utils/
    │   └── data/             # エス検データ
    │
    ├── Topics/               # 学習トピック機能
    │   ├── Interrogative/
    │   │   ├── Menu/
    │   │   │   ├── Menu.tsx
    │   │   │   └── Menu.View.tsx
    │   │   ├── Explanation/
    │   │   │   ├── Explanation.tsx
    │   │   │   ├── Explanation.View.tsx
    │   │   │   └── components/
    │   │   ├── Basic/
    │   │   │   ├── Basic.tsx
    │   │   │   └── Basic.View.tsx
    │   │   ├── Advanced/
    │   │   │   ├── Advanced.tsx
    │   │   │   └── Advanced.View.tsx
    │   │   ├── shared/       # Interrogative内で共有
    │   │   │   ├── hooks/
    │   │   │   ├── utils/
    │   │   │   └── components/
    │   │   └── data/
    │   │
    │   ├── Pronouns/         # 人称代名詞 (将来)
    │   ├── Tense/            # 時制 (将来)
    │   └── Pronunciation/    # 発音 (将来)
    │
    ├── Games/                # ゲーム機能
    │   └── NumberGame/
    │       ├── NumberGame.tsx
    │       ├── NumberGame.View.tsx
    │       ├── NumberGame.types.ts
    │       ├── components/
    │       ├── hooks/
    │       └── utils/
    │
    └── SavedQuestions/       # 保存した問題機能
        ├── List/
        │   ├── List.tsx
        │   ├── List.View.tsx
        │   └── hooks/
        ├── Review/
        │   ├── Review.tsx
        │   ├── Review.View.tsx
        │   └── hooks/
        └── shared/           # SavedQuestions内で共有
            ├── hooks/
            └── utils/
```

## 新しいルーティング設計

### 1. トップページ
```
/ → Top.tsx
```

4つのメインナビゲーション:
- 🏆 エス検 → `/exam/level-4/select`
- ❓ 疑問詞 → `/topics/interrogative`
- 🔢 数字当てゲーム → `/games/number`
- 📚 保存した問題を復習 → `/saved-questions`

### 2. 検定試験 (Exam)
```
/exam/:level/select                        # 範囲選択
/exam/:level/:rangeStart/:rangeSize        # クイズ実行
/exam/:level/:rangeStart/:rangeSize?mode=arrange  # 並び替えモード (将来)
```

例:
- `/exam/level-4/select` - エス検4級の範囲選択
- `/exam/level-4/1/10` - エス検4級の1-10問目
- `/exam/level-3/select` - エス検3級の範囲選択 (将来追加)

### 3. 学習トピック (Topics)
```
/topics/:topic                             # トピックメニュー
/topics/:topic/explanation                 # 教材
/topics/:topic/basic                       # 基本問題
/topics/:topic/advanced                    # 発展問題
/topics/:topic/basic?mode=arrange          # 並び替えモード (将来)
```

例:
- `/topics/interrogative` - 疑問詞メニュー
- `/topics/interrogative/explanation` - 疑問詞の教材
- `/topics/interrogative/basic` - 疑問詞の基本問題
- `/topics/interrogative/advanced` - 疑問詞の発展問題
- `/topics/pronouns/basic` - 人称代名詞の基本問題 (将来追加)
- `/topics/pronunciation/explanation` - 発音の教材 (将来追加)

### 4. ゲーム (Games)
```
/games/number                              # 数字当てゲーム
/games/:gameType                           # 将来的な他のゲーム追加用
```

### 5. 保存した問題 (SavedQuestions)
```
/saved-questions                           # 保存した問題一覧
/saved-questions/review                    # 保存した問題復習
```

## クエリパラメータ vs ネストルート

### 採用方針: **クエリパラメータ**

並び替えモードなど、同じコンポーネントで表示モードだけ変える場合は `?mode=arrange` を使用。

**理由**:
1. **UIの一貫性**: 同じページ内でのモード切り替えであることが明確
2. **状態管理の簡潔さ**: コンポーネント内で `useSearchParams()` で簡単に取得可能
3. **URLの可読性**: `/topics/interrogative/basic?mode=arrange` の方が `/topics/interrogative/basic/arrange` より意図が明確

### 実装例
```typescript
// UnifiedQuiz内でのモード判定
const [searchParams] = useSearchParams()
const exerciseMode = searchParams.get('mode') // 'arrange' | null

// モード切り替えボタン
<button onClick={() => setSearchParams({ mode: 'arrange' })}>
  並び替えモード
</button>
```

## トピック設定の動的管理

将来的なトピック追加を容易にするため、設定ファイルで管理:

```typescript
// src/config/topics.ts
export interface TopicConfig {
  id: string
  name: string
  icon: string
  hasExplanation: boolean
  supportedModes: {
    traditional: boolean
    multipleChoice: boolean
    arrange: boolean
  }
  dataSource: string  // データファイルのパス
}

export const TOPICS: TopicConfig[] = [
  {
    id: 'interrogative',
    name: '疑問詞',
    icon: '❓',
    hasExplanation: true,
    supportedModes: {
      traditional: true,
      multipleChoice: true,
      arrange: false  // 将来true
    },
    dataSource: '/data/interrogative.json'
  },
  // 将来追加予定
  {
    id: 'pronouns',
    name: '人称代名詞',
    icon: '👤',
    hasExplanation: true,
    supportedModes: {
      traditional: true,
      multipleChoice: true,
      arrange: false
    },
    dataSource: '/data/pronouns.json'
  },
  {
    id: 'tense',
    name: '時制',
    icon: '⏰',
    hasExplanation: true,
    supportedModes: {
      traditional: true,
      multipleChoice: true,
      arrange: true
    },
    dataSource: '/data/tense.json'
  }
]
```

## 移行ステップ

### Phase 1: ディレクトリ構造の作成
1. `src/pages/` 配下に新しいディレクトリを作成
2. 既存ファイルを新しい場所に移動
3. import文を更新

### Phase 2: ルーティングの更新
1. `App.tsx` のルート定義を新しい構造に変更
2. 各コンポーネント内のナビゲーションリンクを更新
3. `Top.tsx` のナビゲーションボタンのリンク先を更新

### Phase 3: 後方互換性の確保
1. 古いURLから新しいURLへのリダイレクトを追加
2. テストの更新

### Phase 4: トピック設定の導入
1. `src/config/topics.ts` を作成
2. 動的ルーティングの実装
3. トピックメニューの汎用化

### Phase 5: テストとデプロイ
1. 全ページの動作確認
2. テストの実行
3. デプロイ

## 将来的な拡張

この構造により、以下の追加が容易になる:

1. **新しい検定レベル**: `/exam/level-3/`, `/exam/level-2/`
2. **新しい学習トピック**: `/topics/vocabulary/`, `/topics/expressions/`
3. **新しいゲーム**: `/games/sentence-builder/`, `/games/listening/`
4. **並び替えモード**: 各学習ページに `?mode=arrange` を追加
5. **その他の学習モード**: `?mode=listening`, `?mode=writing` など

## コンポーネントのコロケーション方針

### 原則: 関連ファイルを同じディレクトリに配置

各コンポーネントに関連するファイル（View、型定義、テスト、Storybook、カスタムフック）は、そのコンポーネントと同じディレクトリに配置する。

### 既存の標準ファイル構成パターン

```
ComponentName/
├── ComponentName.tsx           # メインコンポーネント (Container)
├── ComponentName.view.tsx      # View層 (プレゼンテーショナル)
├── ComponentName.types.ts      # 型定義
├── ComponentName.test.tsx      # テスト (必須)
├── ComponentName.stories.tsx   # Storybook (必須)
├── hooks/
│   ├── useComponentName.ts     # カスタムフック
│   └── useComponentName.test.ts # フックのテスト (必須)
└── index.tsx                   # エクスポート
```

この構成を全てのコンポーネントで統一する。

**重要**:
- `.stories.tsx` は全てのコンポーネントで必須
- 視覚的なパターン確認とデザインシステムの統一のため

### 例: UnifiedQuizコンポーネント（現状の構成を維持）

```
src/components/UnifiedQuiz/
├── UnifiedQuiz.tsx           # メインコンポーネント
├── UnifiedQuiz.types.ts      # 型定義
├── UnifiedQuiz.test.tsx      # テスト
└── index.ts                  # エクスポート
```

**サブコンポーネント（別ディレクトリ）**:
- `QuizHeader/` - クイズヘッダー（Container + View + types + hooks + stories）
- `ChoiceButtons/` - 選択肢ボタン（Container + View + types + hooks + stories）
- `AnswerResult/` - 回答結果（Container + View + types + hooks + stories）
- `WordList/` - 単語リスト（Container + View + types + hooks + stories）
- `ModeToggle/` - モード切替（Container + View + types + hooks + stories）

### 例: ページコンポーネント（pages/ - ルーティング専用）

```
src/pages/topics/[topic]/basic.tsx
```

```typescript
// pages/topics/[topic]/basic.tsx - 薄いラッパー
import { useParams } from 'react-router-dom'
import { Basic } from '@/features/Topics/Interrogative/Basic'

export default function BasicPage() {
  const { topic } = useParams()
  return <Basic topic={topic} />
}
```

### 例: 機能コンポーネント（features/ - 実装本体）

```
src/features/Topics/Interrogative/Basic/
├── Basic.tsx                 # メインコンポーネント (Container)
├── Basic.View.tsx            # View層
├── Basic.types.ts            # 型定義
├── Basic.test.tsx            # テスト
├── hooks/
│   └── useBasic.ts           # カスタムフック
├── components/               # このページ専用のコンポーネント
│   └── CustomComponent/
│       ├── CustomComponent.tsx
│       ├── CustomComponent.View.tsx
│       ├── CustomComponent.types.ts
│       └── hooks/
│           └── useCustomComponent.ts
└── index.tsx                 # エクスポート
```

### 共有コンポーネントの配置

複数のページで使用されるコンポーネントのみ `src/components/` に配置:

```
src/components/
├── UnifiedQuiz/              # 全カテゴリで使用
├── QuizHeader/               # UnifiedQuizで使用
├── ChoiceButtons/            # UnifiedQuizで使用
├── AnswerResult/             # UnifiedQuizで使用
├── WordList/                 # UnifiedQuizで使用
├── ModeToggle/               # 複数のクイズで使用
├── Footer/                   # アプリ全体で使用
├── AuthButton/               # 認証関連で使用
├── AuthModal/                # 認証関連で使用
├── LoginForm/                # 認証関連で使用
├── SignupForm/               # 認証関連で使用
└── AdBanner/                 # アプリ全体で使用
```

### 共有フックの配置

複数のページで使用されるフックのみ `src/hooks/` に配置:

```
src/hooks/
├── useQuizEngine.ts          # 全クイズで使用
├── useQuizEngine.types.ts
├── useQuizEngine.test.ts
└── index.ts
```

### ファイル命名規則

1. **Container**: `ComponentName.tsx` - ロジックとstate管理
2. **View**: `ComponentName.view.tsx` - UIレンダリングのみ（小文字推奨）
3. **Types**: `ComponentName.types.ts` - 型定義
4. **Test**: `ComponentName.test.tsx` - テストコード（**必須**）
5. **Stories**: `ComponentName.stories.tsx` - Storybook定義（**必須**）
6. **Hook**: `hooks/useComponentName.ts` - このコンポーネント専用フック
7. **Hook Test**: `hooks/useComponentName.test.ts` - フックのテスト（**必須**）
8. **Utils**: `utils/componentNameUtils.ts` - このコンポーネント専用ユーティリティ
9. **Utils Test**: `utils/componentNameUtils.test.ts` - ユーティリティのテスト（**必須**）
10. **Export**: `index.tsx` - モジュールエクスポート

**重要**:
- `.view.tsx` は小文字を推奨（他の拡張子と統一）
- 既存の `.View.tsx` は段階的に移行
- **テストファイルは必須**。コンポーネント作成時に同時に作成すること
- **Storybookファイルは必須**。視覚的パターン確認のため全コンポーネントに作成
- **hooks と utils にも必ずテストファイルを同じディレクトリに配置**

### コンポーネント内専用 vs 共有の判断基準

#### コンポーネント内に配置するもの

**hooks/** - このコンポーネント内でのみ使用されるフック
```
ComponentName/
└── hooks/
    ├── useComponentName.ts     # メインロジック
    ├── useComponentState.ts    # 状態管理
    └── useComponentEffects.ts  # 副作用処理
```

**utils/** - このコンポーネント内でのみ使用されるユーティリティ
```
ComponentName/
└── utils/
    ├── validators.ts           # バリデーション関数
    ├── formatters.ts           # フォーマット関数
    └── helpers.ts              # ヘルパー関数
```

**components/** - このコンポーネント内でのみ使用されるサブコンポーネント
```
ComponentName/
└── components/
    ├── SubComponent1/
    └── SubComponent2/
```

**constants/** - このコンポーネント内でのみ使用される定数
```
ComponentName/
└── constants/
    └── config.ts               # コンポーネント専用の設定値
```

#### 機能内で共有するもの

機能ディレクトリ配下で複数のコンポーネントが使用する場合:

```
src/features/Topics/Interrogative/
├── Menu/
├── Explanation/
├── Basic/
├── Advanced/
├── shared/                     # このトピック内で共有
│   ├── hooks/
│   │   └── useInterrogativeData.ts
│   ├── utils/
│   │   └── interrogativeHelpers.ts
│   └── components/
│       └── SharedComponent/
└── data/
```

#### アプリ全体で共有するもの

複数のページやカテゴリで使用する場合:

**グローバル hooks** - `src/hooks/`
```
src/hooks/
├── useQuizEngine.ts            # 全クイズで使用
├── useAuth.ts                  # 認証全般で使用
├── useLocalStorage.ts          # 複数機能で使用
└── index.ts
```

**グローバル utils** - `src/utils/`
```
src/utils/
├── dataFormatters.ts           # データ変換
├── validators.ts               # 汎用バリデーション
├── helpers.ts                  # 汎用ヘルパー
└── index.ts
```

**グローバル components** - `src/components/`
```
src/components/
├── UnifiedQuiz/                # 全カテゴリで使用
├── Footer/                     # アプリ全体で使用
└── AuthButton/                 # 認証関連で使用
```

### メリット

1. **関連性の可視化**: 関連ファイルが物理的に近い場所にある
2. **保守性の向上**: コンポーネントを削除する際、関連ファイルも一緒に削除しやすい
3. **依存関係の明確化**: 特定のコンポーネント専用か、共有コンポーネントかが一目瞭然
4. **import文の簡潔化**: 相対パスが短くなる
5. **Container/Viewパターン**: ロジックとUIが分離され、テストとStorybookが書きやすい

### pages/ と features/ の役割分担

#### pages/ (ルーティング専用)
- React Router のルート定義に対応する薄いラッパー
- URL パラメータの取得とfeaturesへの受け渡しのみ
- ビジネスロジックは含まない
- 5-10行程度のシンプルなコード

#### features/ (実装本体)
- 実際のコンポーネント実装
- ビジネスロジック、状態管理
- Container/View分離、hooks、utils、components
- テストとStorybookもここに配置

### 移行時の注意点

現在の構造:
- `src/pages/` → `src/features/` に移動
- `src/pages/` には新しくルーティング専用ファイルを作成
- `src/components/` 配下の共有コンポーネントは維持
- `src/data/` → 各 `features/*/data/` に移動

## コード品質ガイドライン

### 1. テストの必須化

**全てのコンポーネント、フック、ユーティリティにテストファイルを作成すること**

```
✅ Good:
ComponentName/
├── ComponentName.tsx
└── ComponentName.test.tsx    # 必ず作成

❌ Bad:
ComponentName/
└── ComponentName.tsx          # テストなし
```

**テスト作成のタイミング**:
- コンポーネント作成時に同時にテストファイルを作成
- 実装前にテストケースを書く（TDD推奨）
- 最低限、レンダリングテストとプロップスのバリデーションを含める

### 2. 型安全性の徹底

**`any` 型の使用を原則禁止**

```typescript
❌ Bad:
const data: any = fetchData()
const item = (data as any).items[0]

✅ Good:
interface FetchResponse {
  items: Item[]
}
const data: FetchResponse = fetchData()
const item = data.items[0]
```

**unknown を使用する場合**:
```typescript
✅ Acceptable:
function processData(data: unknown) {
  if (isValidData(data)) {
    // Type guard後に使用
    return data.items
  }
}
```

### 3. ESLint ルールの遵守

**eslint-disable の安易な使用禁止**

```typescript
❌ Bad:
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const data: any = response

❌ Bad:
/* eslint-disable */
// 大量のコード
/* eslint-enable */

✅ Good:
// 型を正しく定義して解決
interface ResponseData {
  items: Item[]
}
const data: ResponseData = response
```

**許容されるケース**:
- 外部ライブラリの型定義が不完全な場合（コメントで理由を明記）
- useEffectの依存配列で、意図的に除外する場合（コメントで理由を明記）

```typescript
✅ Acceptable:
useEffect(() => {
  // actionsは安定した参照を持つため除外
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [questions])
```

### 4. useEffect の適切な使用

**useEffect の多用を避ける**

```typescript
❌ Bad: useEffect の過剰使用
function Component() {
  const [data, setData] = useState(null)
  const [filtered, setFiltered] = useState([])
  const [sorted, setSorted] = useState([])

  useEffect(() => {
    setFiltered(data?.filter(...))
  }, [data])

  useEffect(() => {
    setSorted(filtered?.sort(...))
  }, [filtered])

  // useEffect の連鎖
}

✅ Good: 派生状態は useMemo で計算
function Component() {
  const [data, setData] = useState(null)

  const filtered = useMemo(() =>
    data?.filter(...) ?? []
  , [data])

  const sorted = useMemo(() =>
    [...filtered].sort(...)
  , [filtered])
}
```

**useEffect が必要なケース**:
1. 外部システムとの同期（API呼び出し、localStorage、DOM操作）
2. サブスクリプションの登録・解除
3. タイマーやイベントリスナーの管理

**useEffect が不要なケース**:
1. 派生状態の計算 → `useMemo` を使用
2. イベントハンドラー内の処理 → 直接実装
3. propsの変換 → コンポーネント本体で計算

### 5. React ベストプラクティス

**状態管理**:
```typescript
✅ Good: 単一の情報源
const [items, setItems] = useState([])
const selectedItem = useMemo(() =>
  items.find(item => item.id === selectedId)
, [items, selectedId])

❌ Bad: 重複した状態
const [items, setItems] = useState([])
const [selectedItem, setSelectedItem] = useState(null)
// itemsとselectedItemの同期が必要
```

**パフォーマンス最適化**:
```typescript
✅ Good: 適切なメモ化
const expensiveValue = useMemo(() =>
  computeExpensiveValue(data)
, [data])

const handleClick = useCallback(() => {
  // 処理
}, [dependencies])

❌ Bad: 不要なメモ化
const simpleValue = useMemo(() => a + b, [a, b])  // 単純な計算
```

### 6. コードレビューチェックリスト

新しいコンポーネントを追加する際のチェック項目:

- [ ] テストファイル（.test.tsx）を作成したか
- [ ] Storybookファイル（.stories.tsx）を作成したか
- [ ] `any` 型を使用していないか
- [ ] eslint-disable を使用していないか（使用している場合は理由をコメント）
- [ ] useEffect は本当に必要か（useMemoで代替できないか）
- [ ] 派生状態を useState で管理していないか
- [ ] Container/View が適切に分離されているか
- [ ] 型定義が .types.ts に分離されているか
- [ ] 不要な依存関係がないか（import の整理）

## 注意事項

- UnifiedQuizコンポーネントは変更せず、使い回す
- useQuizEngineフックも現状のまま利用
- データファイル（JSON）の構造は維持
- 既存のテストは全て更新が必要
- コロケーション方針に従い、関連ファイルを同じディレクトリに移動
- **新規コンポーネントには必ずテストを追加**
- **型安全性を最優先し、anyの使用を避ける**
- **useEffectは最小限に抑え、適切な抽象化を使用する**