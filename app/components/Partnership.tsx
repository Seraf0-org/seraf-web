import { useIntersectionObserver } from "~/hooks/useIntersectionObserver";
import { useOutletContext } from "@remix-run/react";
import type { OutletContext } from "~/root";
import { useState, useEffect, useCallback } from "react";
import { partners, type Partner } from "~/data/partners";
import { createPortal } from 'react-dom';
import { animate, stagger } from "motion";



export function Partnership() {
    const [sectionRef, isVisible] = useIntersectionObserver({ threshold: 0.4 });
    const { theme } = useOutletContext<OutletContext>();
    const isDark = theme === 'dark';
    const [parallaxOffset, setParallaxOffset] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY * 0.035;
            setParallaxOffset(offset);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (isVisible) {
            // タイトルのアニメーション
            (animate as any)(
                ".partnership-title",
                { opacity: [0, 1], y: [30, 0] },
                { duration: 1, easing: [0.25, 0.46, 0.45, 0.94] }
            );

            // パートナーカードの表示アニメーション
            (animate as any)(
                ".partner-card",
                { opacity: [0, 1], y: [60, 0], scale: [0.8, 1] },
                {
                    delay: stagger(0.2),
                    duration: 1,
                    easing: [0.25, 0.46, 0.45, 0.94]
                }
            );

            // カード内のテキストアニメーション
            (animate as any)(
                ".partner-text",
                { opacity: [0, 1], y: [30, 0] },
                {
                    delay: stagger(0.15, { startDelay: 1 }),
                    duration: 0.8,
                    easing: [0.25, 0.46, 0.45, 0.94]
                }
            );

            // 装飾線のアニメーション
            (animate as any)(
                ".partnership-decorative-line",
                { strokeDashoffset: [800, 0] },
                { duration: 1.2, delay: 0.8, easing: [0.25, 0.46, 0.45, 0.94] }
            );
        } else {
            // Smooth fade out when out of view
            (animate as any)(".partnership-title", { opacity: 0, y: 30 }, { duration: 0.5 });
            (animate as any)(".partnership-decorative-line", { strokeDashoffset: 800 }, { duration: 0.5 });
            (animate as any)(".partner-card", { opacity: 0, y: 60, scale: 0.8 }, { duration: 0.5 });
            (animate as any)(".partner-text", { opacity: 0, y: 30 }, { duration: 0.5 });
        }
    }, [isVisible]);

    // ホバーアニメーションの設定
    useEffect(() => {
        const partnerCards = document.querySelectorAll('.partner-card');

        partnerCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                (animate as any)(
                    card,
                    {
                        y: [0, -12],
                        scale: [1, 1.03],
                        boxShadow: ['0 10px 25px rgba(0,0,0,0.1)', '0 25px 50px rgba(0,0,0,0.25)']
                    },
                    { duration: 0.4, easing: [0.25, 0.46, 0.45, 0.94] }
                );
            });

            card.addEventListener('mouseleave', () => {
                (animate as any)(
                    card,
                    {
                        y: [-12, 0],
                        scale: [1.03, 1],
                        boxShadow: ['0 25px 50px rgba(0,0,0,0.25)', '0 10px 25px rgba(0,0,0,0.1)']
                    },
                    { duration: 0.4, easing: [0.25, 0.46, 0.45, 0.94] }
                );
            });
        });
    }, [isVisible]);

    const parallaxTransform = {
        text: `translateY(calc(-70% + ${parallaxOffset * 1.7}px))`,
    };

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = "/images/partners/partner-none.jpg";
    };

    // パートナーシップタイプ別にグループ化
    const partnersByType = partners.reduce((acc, partner) => {
        const type = partner.tag || 'general';
        if (!acc[type]) {
            acc[type] = [];
        }
        acc[type].push(partner);
        return acc;
    }, {} as Record<string, Partner[]>);

    // 各パートナーの固有タグを生成する関数
    const getPartnerTag = (partner: Partner) => {
        // パートナーのタグまたは名前の最初の単語を使用
        if (partner.tag) {
            return partner.tag;
        }
        const nameParts = partner.name.split(' ');
        if (nameParts.length > 1) {
            return nameParts[0];
        }
        return partner.name;  // 単語が1つの場合は名前全体
    };

    return (
        <section
            id="partners"
            ref={sectionRef}
            className="relative min-h-screen py-20 transition-colors duration-500 overflow-hidden"
        >


            {/* 縦書きのPartnership文字 */}
            <div
                className="absolute right-14 top-1/2 transform pointer-events-none"
                style={{ transform: parallaxTransform.text }}
            >
                <svg width="200" height="900" viewBox="0 0 200 1100" preserveAspectRatio="xMidYMid meet">
                    <text
                        x="100"
                        y="550"
                        fill="none"
                        stroke={isDark ? '#ffffff' : '#000000'}
                        strokeWidth="1"
                        strokeOpacity="0.4"
                        fontSize="100"
                        fontWeight="bold"
                        textAnchor="middle"
                        transform="rotate(90, 100, 550)"
                        style={{ letterSpacing: '0.3em' }}
                    >
                        {Array.from("Partners").map((letter, index) => (
                            <tspan
                                key={index}
                                className="animate-draw-path"
                                style={{
                                    animationDelay: `${index * 0.2}s`,
                                    textShadow: '0 0 10px rgba(34, 197, 94, 0.8)',
                                }}
                            >
                                {letter}
                            </tspan>
                        ))}
                    </text>
                </svg>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <h2 className="partnership-title text-4xl md:text-6xl font-bold text-center mb-16 text-gray-700 dark:text-white drop-shadow-[0_0_8px_rgba(22,172,32,0.5)] dark:drop-shadow-[0_0_8px_rgba(34,210,54,0.5)] opacity-0">
                    Partners
                    <div className="relative">
                        <svg width="100vw" height="40" viewBox="0 0 800 10" preserveAspectRatio="none" style={{ marginLeft: '-25vw', width: '150vw' }}>
                            <path
                                d="M0 0 L200 0 L210 10 L390 10 L400 0 L800 0"
                                stroke="#99ff99"
                                strokeWidth="3"
                                fill="none"
                                className="partnership-decorative-line"
                                strokeDasharray="800"
                                strokeDashoffset="800"
                                style={{
                                    transformOrigin: 'left'
                                }}
                            />
                        </svg>
                    </div>
                </h2>

                {/* パートナーシップタイプごとにセクション分け */}
                {Object.entries(partnersByType).map(([type, typedPartners]) => (
                    <div key={type} className="mb-20">
                        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-8 justify-items-center">
                            {typedPartners.map((partner, index) => {
                                // ウェブサイトがある場合はaタグ、ない場合はdivタグを使用
                                const CardComponent = partner.website ? 'a' : 'div';
                                return (
                                    <CardComponent
                                        key={partner.id}
                                        href={partner.website || undefined}
                                        target={partner.website ? "_blank" : undefined}
                                        rel={partner.website ? "noopener noreferrer" : undefined}
                                        className="partner-card group bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden 
                                        cursor-pointer w-full max-w-[32rem] opacity-0"
                                        style={{
                                            borderLeft: `4px solid ${partner.color.primary}`
                                        }}
                                    >
                                        <div className="relative overflow-hidden">
                                            <div className="h-40 bg-white dark:bg-gray-900 flex items-center justify-center">
                                                {/* ロゴを中央に表示 */}
                                                <div className="flex items-center justify-center w-full h-full px-3 pt-8 pb-4">
                                                    {(partner.logoLight || partner.logoDark) ? (
                                                        <img
                                                            src={isDark ? (partner.logoDark || partner.logoLight) : (partner.logoLight || partner.logoDark)}
                                                            alt={`${partner.name} ロゴ`}
                                                            className="w-auto h-auto max-w-[70%] max-h-24 object-contain transition-transform duration-300 group-hover:scale-125"
                                                            onError={handleImageError}
                                                        />
                                                    ) : (
                                                        <div className="text-2xl font-bold text-gray-400 dark:text-gray-600 transition-transform duration-300 group-hover:scale-125">
                                                            {partner.name}
                                                        </div>
                                                    )}
                                                </div>
                                                {/* パートナータイプのバッジ */}
                                                <div
                                                    className="absolute top-4 right-4 px-3 py-1 rounded-full text-white text-xs font-medium"
                                                    style={{ backgroundColor: partner.color.primary }}
                                                >
                                                    {partner.tag || 'パートナー'}
                                                </div>
                                                {/* パートナー固有のタグ */}
                                                {partner.tag && (
                                                    <div
                                                        className="absolute top-4 right-4 px-3 py-1 rounded-full text-white text-xs font-medium"
                                                        style={{ backgroundColor: partner.color.primary }}
                                                    >
                                                        {partner.tag}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="p-6 relative">
                                            {/* 右下の三角形部分 - 固定サイズの正三角形 */}
                                            <div
                                                className="absolute bottom-0 right-0 w-16 h-16"
                                                style={{
                                                    clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
                                                    backgroundColor: partner.color.bg
                                                }}
                                            />
                                            <div className="relative z-10">
                                                <h3
                                                    className="partner-text text-xl font-semibold mb-2 text-gray-900 dark:text-white opacity-0"
                                                >
                                                    {partner.name}
                                                </h3>
                                                <p
                                                    className="partner-text text-gray-600 dark:text-gray-300 opacity-0"
                                                    style={{
                                                        whiteSpace: 'pre-line'
                                                    }}
                                                >
                                                    {partner.description}
                                                </p>
                                                {partner.startDate && (
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                                                        提携開始: {partner.startDate}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        {partner.website && (
                                            <div className="absolute bottom-2 right-2 z-20">
                                                <svg className="w-6 h-6 text-gray-700 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            </div>
                                        )}
                                    </CardComponent>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
