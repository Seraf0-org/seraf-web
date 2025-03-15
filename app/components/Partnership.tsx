import { useIntersectionObserver } from "~/hooks/useIntersectionObserver";
import { useOutletContext } from "@remix-run/react";
import type { OutletContext } from "~/root";
import { useState, useEffect, useCallback } from "react";
import { partners, partnershipTypeColors, type Partner } from "~/data/partners";
import { createPortal } from 'react-dom';

// 以下のHexagonコンポーネントを追加
const Hexagon = ({ x, y, size, color, opacity, delay, parallaxSpeed, isVisible }: {
    x: number;
    y: number;
    size: number;
    color: string;
    opacity: number;
    delay: number;
    parallaxSpeed: number;
    isVisible: boolean;
}) => {
    const [offsetY, setOffsetY] = useState(0);
    const [startScrollY, setStartScrollY] = useState(0);

    const handleScroll = useCallback(() => {
        if (!isVisible) return;

        requestAnimationFrame(() => {
            const currentScrollY = window.scrollY;
            const relativeScroll = currentScrollY - startScrollY;
            setOffsetY(relativeScroll * parallaxSpeed);
        });
    }, [parallaxSpeed, isVisible, startScrollY]);

    useEffect(() => {
        if (isVisible) {
            setStartScrollY(window.scrollY);
            window.addEventListener("scroll", handleScroll, { passive: true });
            return () => window.removeEventListener("scroll", handleScroll);
        }
    }, [handleScroll, isVisible]);

    const points = Array.from({ length: 6 }).map((_, i) => {
        const angle = (i * 60 * Math.PI) / 180;
        return `${x + size * Math.cos(angle)},${(y + offsetY / 50) + size * Math.sin(angle)}`;
    }).join(' ');

    return (
        <polygon
            points={points}
            fill="none"
            stroke={color}
            strokeWidth="1"
            opacity={opacity}
            className={`transition-opacity duration-1000`}
            style={{
                transitionDelay: `${delay}ms`,
                transform: `translateY(${offsetY}px)`,
            }}
        />
    );
};

export function Partnership() {
    const [sectionRef, isVisible] = useIntersectionObserver();
    const { theme } = useOutletContext<OutletContext>();
    const isDark = theme === 'dark';
    const [parallaxOffset, setParallaxOffset] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            // パララックス効果をほんの少し強く
            const offset = window.scrollY * 0.035;
            setParallaxOffset(offset);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const parallaxTransform = {
        text: `translateY(calc(-70% + ${parallaxOffset * 1.7}px))`,
    };

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = "/images/partners/partner-none.jpg";
    };

    // パートナーシップタイプ別にグループ化
    const partnersByType = partners.reduce((acc, partner) => {
        if (!acc[partner.partnershipType]) {
            acc[partner.partnershipType] = [];
        }
        acc[partner.partnershipType].push(partner);
        return acc;
    }, {} as Record<Partner['partnershipType'], Partner[]>);

    // 各パートナーの固有タグを生成する関数
    const getPartnerTag = (partner: Partner) => {
        // ここではパートナー名の最初の単語を使用する例
        // 実際の実装では、APIから取得するか、データに基づいて適切なタグを返す
        const nameParts = partner.name.split(' ');
        if (partner.partnershipType === 'creative') {
            return 'マルチクリエイション';
        } else if (partner.partnershipType === 'technology' && nameParts[0].length > 3) {
            return nameParts[0];
        } else if (partner.partnershipType === 'academic') {
            return '研究協力';
        } else if (nameParts.length > 1) {
            return nameParts[0];
        }
        return '';  // タグを表示しない
    };

    return (
        <section
            id="partnership"
            ref={sectionRef}
            className="relative min-h-screen py-20 transition-colors duration-500 overflow-hidden"
            style={{
                backgroundColor: isDark ? 'rgb(17 24 39)' : 'rgb(249 250 251)'
            }}
        >
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <svg
                    className="w-full h-full"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="xMidYMid slice"
                >
                    {isVisible && (
                        <>
                            <Hexagon x={15} y={25} size={3} color={isDark ? '#22c55e' : '#4ade80'} opacity={0.2} delay={200} parallaxSpeed={0.02} isVisible={isVisible} />
                            <Hexagon x={50} y={30} size={4} color={isDark ? '#22c55e' : '#4ade80'} opacity={0.15} delay={400} parallaxSpeed={-0.03} isVisible={isVisible} />
                            <Hexagon x={80} y={15} size={2.5} color={isDark ? '#22c55e' : '#4ade80'} opacity={0.25} delay={600} parallaxSpeed={0.04} isVisible={isVisible} />
                            <Hexagon x={30} y={50} size={3.5} color={isDark ? '#22c55e' : '#4ade80'} opacity={0.1} delay={800} parallaxSpeed={-0.02} isVisible={isVisible} />
                            <Hexagon x={90} y={40} size={4.5} color={isDark ? '#22c55e' : '#4ade80'} opacity={0.2} delay={1000} parallaxSpeed={0.03} isVisible={isVisible} />
                            <Hexagon x={20} y={65} size={3} color={isDark ? '#22c55e' : '#4ade80'} opacity={0.15} delay={1200} parallaxSpeed={-0.04} isVisible={isVisible} />
                            <Hexagon x={70} y={70} size={3.5} color={isDark ? '#22c55e' : '#4ade80'} opacity={0.2} delay={1400} parallaxSpeed={0.025} isVisible={isVisible} />
                            <Hexagon x={40} y={85} size={4} color={isDark ? '#22c55e' : '#4ade80'} opacity={0.15} delay={1600} parallaxSpeed={-0.035} isVisible={isVisible} />
                            <Hexagon x={60} y={25} size={3} color={isDark ? '#22c55e' : '#4ade80'} opacity={0.1} delay={1800} parallaxSpeed={0.045} isVisible={isVisible} />
                        </>
                    )}
                </svg>
            </div>

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
                <h2 className="text-4xl md:text-6xl font-bold text-center mb-16 text-gray-700 dark:text-white drop-shadow-[0_0_8px_rgba(22,172,32,0.5)] dark:drop-shadow-[0_0_8px_rgba(34,210,54,0.5)]">
                    Partners
                    <div className="relative">
                        <svg width="100vw" height="40" viewBox="0 0 3000 10" preserveAspectRatio="none" style={{ marginTop: '20px', marginLeft: '-25vw', width: '150vw' }}>
                            <path
                                d="M-500 0 L780 0 L800 10 L3000 10"
                                stroke="#99ff99"
                                strokeWidth="3"
                                fill="none"
                                className={`${isVisible ? 'animate-draw-line-from-left' : ''}`}
                                style={{
                                    filter: 'drop-shadow(0 0 5px rgba(153, 255, 153, 0.5))'
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
                                        className={`group bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden 
                                        transition-all duration-500 transform cursor-pointer w-full max-w-[32rem]
                                        hover:shadow-[0_0_20px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]
                                        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                                        style={{
                                            transitionDelay: `${index * 200}ms`,
                                            transitionProperty: 'opacity, transform',
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
                                                    {partner.partnershipType === 'creative' && 'マルチクリエイション'}
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
                                                    className={`text-xl font-semibold mb-2 text-gray-900 dark:text-white transition-all duration-500 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                                                    style={{
                                                        transitionDelay: `${index * 200 + 200}ms`,
                                                        transitionProperty: 'opacity, transform'
                                                    }}
                                                >
                                                    {partner.name}
                                                </h3>
                                                <p
                                                    className={`text-gray-600 dark:text-gray-300 transition-all duration-500 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                                                    style={{
                                                        transitionDelay: `${index * 200 + 400}ms`,
                                                        transitionProperty: 'opacity, transform',
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
