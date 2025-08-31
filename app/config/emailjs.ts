// EmailJS設定
export const EMAILJS_CONFIG = {
    // EmailJSのパブリックキー
    PUBLIC_KEY: typeof window !== 'undefined' ? (window as any).ENV?.EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY' : 'YOUR_PUBLIC_KEY',

    // EmailJSのサービスID
    SERVICE_ID: typeof window !== 'undefined' ? (window as any).ENV?.EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID' : 'YOUR_SERVICE_ID',

    // EmailJSのテンプレートID
    TEMPLATE_ID: typeof window !== 'undefined' ? (window as any).ENV?.EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID' : 'YOUR_TEMPLATE_ID',
};

// 環境変数の設定例（.env.localファイルに追加）
/*
EMAILJS_PUBLIC_KEY=your_public_key_here
EMAILJS_SERVICE_ID=your_service_id_here
EMAILJS_TEMPLATE_ID=your_template_id_here
*/
