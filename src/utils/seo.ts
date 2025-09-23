// SEO utility functions for dynamic page titles and descriptions

export const updatePageTitle = (title: string) => {
  document.title = `${title} | MEMORU - エスペラント語学習アプリ`;
};

export const updatePageDescription = (description: string) => {
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', description);
  }
};

export const updatePageMeta = (title: string, description: string) => {
  updatePageTitle(title);
  updatePageDescription(description);
};

// SEO data for different pages
export const seoData = {
  home: {
    title: "エスペラント語学習",
    description: "MEMORUは無料でエスペラント語を効率的に学習できるWebアプリです。疑問詞の基本から応用まで、エス検4級対策、数字ゲームなど豊富なコンテンツで楽しく学べます。初心者から上級者まで対応。"
  },
  interrogativeMenu: {
    title: "疑問詞学習メニュー",
    description: "エスペラント疑問詞を効率的に学習。9つの疑問詞の意味から応用問題まで、段階的に学べます。初学者向けの説明から実践問題まで完備。"
  },
  interrogativeExplanation: {
    title: "疑問詞の基本説明",
    description: "エスペラント語の9つの疑問詞を詳しく解説。kio、kiu、kia、kies、kie、kiel、kial、kiam、kiomの意味と使い方を例文付きで学習。"
  },
  interrogativeBasic: {
    title: "疑問詞基本学習",
    description: "エスペラント疑問詞の意味を覚える練習問題。4択クイズ形式で9つの疑問詞を効率的に記憶。間違いを確認して復習も可能。"
  },
  interrogativeAdvanced: {
    title: "疑問詞応用問題",
    description: "エスペラント疑問詞の実践的な穴埋め問題。日本語文脈から適切な疑問詞を選択する応用力を養成。表示形式と4択形式を選択可能。"
  },
  esuken4: {
    title: "エス検4級対策",
    description: "エスペラント検定4級の語彙学習。範囲を選択して効率的に単語を記憶。表示形式と4択形式で学習スタイルを選択可能。"
  },
  numberGame: {
    title: "エスペラント数字ゲーム",
    description: "エスペラント語の数詞を楽しく学習。1000-9999の数字をエスペラント語で表現するゲーム形式の学習ツール。"
  },
  privacyPolicy: {
    title: "プライバシーポリシー",
    description: "MEMORUのプライバシーポリシー。個人情報の取り扱いとGoogleアナリティクスの使用について説明。"
  }
};