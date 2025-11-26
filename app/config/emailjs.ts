// EmailJS設定
export const EMAILJS_CONFIG = {
    // EmailJSのパブリックキー
    PUBLIC_KEY: typeof window !== 'undefined' ? (window as any).ENV?.EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY' : 'YOUR_PUBLIC_KEY',

    // EmailJSのサービスID
    SERVICE_ID: typeof window !== 'undefined' ? (window as any).ENV?.EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID' : 'YOUR_SERVICE_ID',

    // EmailJSのテンプレートID
    TEMPLATE_ID: typeof window !== 'undefined' ? (window as any).ENV?.EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID' : 'YOUR_TEMPLATE_ID',
};