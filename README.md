# Welcome to Remix!

- 📖 [Remix docs](https://remix.run/docs)

## Development

Run the dev server:

```shellscript
npm run dev
```

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying Node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `npm run build`

- `build/server`
- `build/client`

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever css framework you prefer. See the [Vite docs on css](https://vitejs.dev/guide/features.html#css) for more information.

## EmailJS設定

お問い合わせフォームのメール送信機能を使用するには、EmailJSの設定が必要です。

### 1. EmailJSアカウントの作成
1. [EmailJS](https://www.emailjs.com/)にアクセスしてアカウントを作成
2. メールサービス（Gmail、Outlook等）を設定
3. メールテンプレートを作成

### 2. 環境変数の設定

#### 開発環境（ローカル）
プロジェクトルートに`.env.local`ファイルを作成し、以下の値を設定してください：

```bash
# EmailJS設定
EMAILJS_PUBLIC_KEY=your_public_key_here
EMAILJS_SERVICE_ID=your_service_id_here
EMAILJS_TEMPLATE_ID=your_template_id_here
```

#### 本番環境（Cloudflare Pages）
`wrangler.toml`ファイルの`[vars]`セクションを編集してください：

```toml
[vars]
EMAILJS_PUBLIC_KEY = "your_actual_public_key"
EMAILJS_SERVICE_ID = "your_actual_service_id"
EMAILJS_TEMPLATE_ID = "your_actual_template_id"
```

または、Cloudflare Pagesのダッシュボードで環境変数を設定することもできます。

### 3. 設定値の取得方法
- **PUBLIC_KEY**: EmailJSダッシュボードの「Account」→「API Keys」から取得
- **SERVICE_ID**: EmailJSダッシュボードの「Email Services」から取得
- **TEMPLATE_ID**: EmailJSダッシュボードの「Email Templates」から取得

### 4. メールテンプレートの変数
以下の変数が利用可能です：
- `{{from_name}}` - お名前
- `{{from_email}}` - メールアドレス
- `{{company}}` - 会社名・組織名
- `{{message}}` - お問い合わせ内容
