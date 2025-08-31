import { useState, useEffect } from "react";
import { useIntersectionObserver } from "~/hooks/useIntersectionObserver";
import { useOutletContext } from "@remix-run/react";
import type { OutletContext } from "~/root";
import { useLines } from "~/contexts/LinesContext";
import { animate } from "motion";
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from "~/config/emailjs";

export function Contact() {
    const [sectionRef, isVisible] = useIntersectionObserver();
    const { theme } = useOutletContext<OutletContext>();
    const isDark = theme === 'dark';
    const lines = useLines('fuchsia');
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        company: "",
        message: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    // Motionアニメーションを初期化
    useEffect(() => {
        if (isVisible) {
            // タイトルのアニメーション
            (animate as any)(
                ".contact-title",
                { opacity: [0, 1], y: [30, 0] },
                { duration: 1, easing: [0.25, 0.46, 0.45, 0.94] }
            );

            // コンテンツのフェードインアニメーション
            (animate as any)(
                ".contact-content",
                { opacity: [0, 1], y: [40, 0] },
                { duration: 1.2, delay: 0.5, easing: [0.25, 0.46, 0.45, 0.94] }
            );

            // 装飾線のアニメーション
            (animate as any)(
                ".contact-decorative-line",
                { strokeDashoffset: [600, 0] },
                { duration: 1.5, delay: 0.5, easing: [0.25, 0.46, 0.45, 0.94] }
            );
        }
    }, [isVisible]);

    // EmailJSの初期化
    useEffect(() => {
        console.log('EmailJS設定値:', {
            PUBLIC_KEY: EMAILJS_CONFIG.PUBLIC_KEY,
            SERVICE_ID: EMAILJS_CONFIG.SERVICE_ID,
            TEMPLATE_ID: EMAILJS_CONFIG.TEMPLATE_ID
        });
        emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {

            // 送信データの確認
            const templateParams = {
                name: formData.name,
                email: formData.email,
                company: formData.company,
                message: formData.message,
            };

            console.log('送信データ:', templateParams);

            // EmailJSを使用してメール送信
            const result = await emailjs.send(
                EMAILJS_CONFIG.SERVICE_ID,
                EMAILJS_CONFIG.TEMPLATE_ID,
                templateParams,
                EMAILJS_CONFIG.PUBLIC_KEY
            );

            console.log('EmailJS送信結果:', result);

            if (result.status === 200) {
                setSubmitStatus('success');
                setFormData({ name: "", email: "", company: "", message: "" });
            } else {
                console.error('EmailJS送信失敗:', result);
                setSubmitStatus('error');
            }
        } catch (error) {
            console.error('EmailJS送信エラー詳細:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <section
            id="contact"
            ref={sectionRef}
            className="relative min-h-screen py-20 transition-colors duration-500 overflow-hidden"
            style={{
                backgroundColor: isDark ? 'rgb(17 24 39)' : 'rgb(249 250 251)'
            }}
        >
            {/* 横書きの「Contact」 */}
            <div className="absolute left-14 top-[90%] transform pointer-events-none">
                <svg width="100%" height="200" viewBox="0 0 900 200" preserveAspectRatio="xMidYMid meet">
                    <text
                        x="50%"
                        y="100"
                        fill="none"
                        stroke={isDark ? '#ffffff' : '#000000'}
                        strokeWidth="1"
                        strokeOpacity="0.4"
                        fontSize="100"
                        fontWeight="bold"
                        textAnchor="middle"
                        style={{ letterSpacing: '0.3em' }}
                    >
                        {Array.from("Contact").map((letter, index) => (
                            <tspan
                                key={index}
                                className="animate-draw-path"
                                style={{
                                    animationDelay: `${index * 0.2}s`,
                                    textShadow: '0 0 10px rgba(255, 0, 255, 0.8)',
                                }}
                            >
                                {letter}
                            </tspan>
                        ))}
                    </text>
                </svg>
            </div>

            {/* 背景の線 */}
            {lines.map((line: any) => (
                <svg
                    key={line.id}
                    className="absolute will-change-transform pointer-events-none"
                    style={{
                        left: `${line.left}%`,
                        top: '-20vh',
                        width: '200px',
                        height: '140vh',
                        overflow: 'visible',
                    }}
                >
                    <path
                        d={`M ${line.points.map((p: any) => `${p.x},${p.y}`).join(' L ')}`}
                        stroke={line.color}
                        strokeWidth={line.width}
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {line.branches.map((branch: any, i: number) => (
                        <path
                            key={`${line.id}-${i}`}
                            d={`M ${branch.points.map((p: any) => `${p.x},${p.y}`).join(' L ')}`}
                            stroke={branch.color}
                            strokeWidth={branch.width}
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    ))}
                </svg>
            ))}

            <div className="contact-content container mx-auto px-6 md:px-4 py-10">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="contact-title text-4xl md:text-6xl font-bold text-gray-700 dark:text-white mb-16 drop-shadow-[0_0_8px_rgba(255,0,255,0.5)] dark:drop-shadow-[0_0_8px_rgba(255,0,255,0.7)] md:leading-loose">
                        Contact
                        <div className="absolute fixed-left">
                            <svg width="100vw" height="40" viewBox="0 0 1000 10" preserveAspectRatio="none" style={{ marginLeft: 'calc(-50vw + 75%)' }}>
                                <path
                                    d="M0 0 L100 0 L120 10 L500 10"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    fill="none"
                                    className="contact-decorative-line text-fuchsia-400 dark:text-fuchsia-500 origin-left"
                                    strokeDasharray="600"
                                    strokeDashoffset="600"
                                />
                            </svg>
                        </div>
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
                        制作のご相談やご質問がございましたら、お気軽にお問い合わせください。
                    </p>

                    <div className="max-w-2xl mx-auto">
                        {/* お問い合わせフォーム */}
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                                        お名前 <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-300/50 dark:border-gray-600/50 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all duration-200"
                                        placeholder="山田太郎"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                                        メールアドレス <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-300/50 dark:border-gray-600/50 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all duration-200"
                                        placeholder="example@email.com"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                                        会社名・組織名
                                    </label>
                                    <input
                                        type="text"
                                        id="company"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-300/50 dark:border-gray-600/50 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all duration-200"
                                        placeholder="株式会社サンプル"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                                        お問い合わせ内容 <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        required
                                        rows={5}
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-300/50 dark:border-gray-600/50 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all duration-200 resize-none"
                                        placeholder="プロジェクトの詳細やご質問内容をご記入ください"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {isSubmitting ? '送信中...' : '送信する'}
                                </button>

                                {/* 送信状態のフィードバック */}
                                {submitStatus === 'success' && (
                                    <div className="mt-4 p-4 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg">
                                        <p className="text-green-800 dark:text-green-200 text-center">
                                            ✅ お問い合わせを送信しました。ありがとうございます！
                                        </p>
                                    </div>
                                )}

                                {submitStatus === 'error' && (
                                    <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
                                        <p className="text-red-800 dark:text-red-200 text-center">
                                            ❌ 送信に失敗しました。
                                        </p>
                                        <p className="text-red-700 dark:text-red-300 text-sm text-center mt-2">
                                            EmailJSの設定を確認してください。コンソールで詳細なエラー情報を確認できます。
                                        </p>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
