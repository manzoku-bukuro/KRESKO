import type { InterrogativeInfo } from '../Explanation.types'

export const interrogatives: InterrogativeInfo[] = [
  {
    word: 'kio',
    meaning: '何',
    description: '物事や事柄を尋ねる時に使います。英語のwhatに相当します。',
    examples: [
      { esperanto: 'Kio estas tio?', japanese: 'それは何ですか？' },
      { esperanto: 'Kion vi faras?', japanese: '何をしていますか？（対格）' },
    ],
  },
  {
    word: 'kiu',
    meaning: 'だれ・どれ',
    description: '人や物を特定する時に使います。英語のwho/whichに相当します。',
    examples: [
      { esperanto: 'Kiu vi estas?', japanese: 'あなたはだれですか？' },
      { esperanto: 'Kiu libro estas via?', japanese: 'どの本があなたのですか？' },
    ],
  },
  {
    word: 'kia',
    meaning: 'どんな',
    description: '性質や状態を尋ねる時に使います。形容詞的な疑問詞です。',
    examples: [
      { esperanto: 'Kia estas via kato?', japanese: 'あなたの猫はどんなですか？' },
      { esperanto: 'Kia koloro?', japanese: 'どんな色ですか？' },
    ],
  },
  {
    word: 'kies',
    meaning: 'だれの',
    description: '所有を尋ねる時に使います。英語のwhoseに相当します。',
    examples: [
      { esperanto: 'Kies estas tiu libro?', japanese: 'この本はだれのですか？' },
      { esperanto: 'Kies domo tio estas?', japanese: 'それはだれの家ですか？' },
    ],
  },
  {
    word: 'kie',
    meaning: 'どこで・どこに',
    description: '場所を尋ねる時に使います。英語のwhereに相当します。',
    examples: [
      { esperanto: 'Kie vi loĝas?', japanese: 'どこに住んでいますか？' },
      { esperanto: 'Kie estas la libro?', japanese: '本はどこにありますか？' },
    ],
  },
  {
    word: 'kiel',
    meaning: 'どのように・どうやって',
    description: '方法や手段、状態を尋ねる時に使います。英語のhowに相当します。',
    examples: [
      { esperanto: 'Kiel vi fartas?', japanese: 'お元気ですか？' },
      { esperanto: 'Kiel vi venis?', japanese: 'どうやって来ましたか？' },
    ],
  },
  {
    word: 'kial',
    meaning: 'なぜ',
    description: '理由を尋ねる時に使います。英語のwhyに相当します。',
    examples: [
      { esperanto: 'Kial vi ploras?', japanese: 'なぜ泣いているのですか？' },
      { esperanto: 'Kial vi ne venis?', japanese: 'なぜ来なかったのですか？' },
    ],
  },
  {
    word: 'kiam',
    meaning: 'いつ',
    description: '時間を尋ねる時に使います。英語のwhenに相当します。',
    examples: [
      { esperanto: 'Kiam vi venos?', japanese: 'いつ来ますか？' },
      { esperanto: 'Kiam vi naskiĝis?', japanese: 'いつ生まれましたか？' },
    ],
  },
  {
    word: 'kiom',
    meaning: 'どれくらい・いくら',
    description: '数量や値段を尋ねる時に使います。英語のhow much/how manyに相当します。',
    examples: [
      { esperanto: 'Kiom kostas tio?', japanese: 'それはいくらしますか？' },
      { esperanto: 'Kiom da tempo?', japanese: 'どれくらいの時間？' },
    ],
  },
]