export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          プライバシーポリシー
        </h1>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. 基本方針</h2>
            <p className="text-gray-700 leading-relaxed">
              KRESKO（以下「当サイト」）は、ユーザーの個人情報保護を重要視し、個人情報の保護に関する法律、その他関係法令等を遵守し、適切に取り扱うことを約束いたします。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. 収集する情報</h2>
            <div className="text-gray-700 leading-relaxed">
              <h3 className="text-xl font-medium mb-2">2.1 アクセス情報</h3>
              <p className="mb-4">
                当サイトでは、Google Analyticsを使用してサイトの利用状況を分析しています。Google Analyticsは以下の情報を収集します：
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>IPアドレス（匿名化済み）</li>
                <li>ブラウザの種類とバージョン</li>
                <li>オペレーティングシステム</li>
                <li>アクセス日時</li>
                <li>閲覧ページ</li>
                <li>滞在時間</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Cookieの使用</h2>
            <div className="text-gray-700 leading-relaxed">
              <p className="mb-4">
                当サイトでは、以下の目的でCookieを使用しています：
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Google Analyticsによるアクセス解析</li>
                <li>Google AdSenseによる広告の最適化</li>
                <li>ユーザーエクスペリエンスの向上</li>
              </ul>
              <p>
                Cookieの設定は、ブラウザの設定により無効にすることが可能ですが、その場合サイトの機能が制限される場合があります。
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. 広告配信について</h2>
            <div className="text-gray-700 leading-relaxed">
              <p className="mb-4">
                当サイトでは、Google AdSenseを使用して広告を配信しています。Google AdSenseは以下を行います：
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Cookieを使用した興味関心に基づく広告の表示</li>
                <li>過去のサイト訪問に基づく広告の最適化</li>
                <li>広告の効果測定</li>
              </ul>
              <p className="mb-4">
                ユーザーは<a href="https://adssettings.google.com/" className="text-emerald-600 hover:text-emerald-800 underline" target="_blank" rel="noopener noreferrer">Google広告設定</a>にアクセスして、パーソナライズ広告を無効にすることができます。
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. 第三者への情報提供</h2>
            <p className="text-gray-700 leading-relaxed">
              当サイトは、法令に基づく場合を除き、ユーザーの同意なく第三者に個人情報を提供することはありません。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. 情報の管理</h2>
            <p className="text-gray-700 leading-relaxed">
              収集した情報は適切に管理し、不正アクセス、紛失、破壊、改ざん、漏洩などを防ぐため、必要かつ適切な安全管理措置を講じます。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. プライバシーポリシーの変更</h2>
            <p className="text-gray-700 leading-relaxed">
              当サイトは、必要に応じてプライバシーポリシーを変更することがあります。変更後のプライバシーポリシーは、当サイトに掲載した時点から効力を生じるものとします。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. お問い合わせ</h2>
            <p className="text-gray-700 leading-relaxed">
              プライバシーポリシーに関するお問い合わせは、GitHubの<a href="https://github.com/manzoku-bukuro/KRESKO" className="text-emerald-600 hover:text-emerald-800 underline" target="_blank" rel="noopener noreferrer">リポジトリ</a>までご連絡ください。
            </p>
          </section>

          <div className="text-right text-gray-600 mt-12">
            <p>制定日：2025年1月19日</p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => window.history.back()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            戻る
          </button>
        </div>
      </div>
    </div>
  )
}