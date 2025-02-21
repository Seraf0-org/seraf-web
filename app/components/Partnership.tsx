import { useIntersectionObserver } from "~/hooks/useIntersectionObserver";
import { useOutletContext } from "@remix-run/react";
import type { OutletContext } from "~/root";

export function Partnership() {
    const [sectionRef, isVisible] = useIntersectionObserver();
    const { theme } = useOutletContext<OutletContext>();
    const isDark = theme === 'dark';

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
                    {/* 背景の装飾を追加 */}
                    <line
                        x1="0"
                        y1="50"
                        x2="100"
                        y2="50"
                        stroke="#99ff99"  // 彩度を上げたライトグリーン
                        strokeWidth="0.2"
                    />
                </svg>
            </div>

            <div className="container mx-auto px-4">
                <h2
                    className="text-4xl md:text-6xl font-bold text-center mb-16 text-white drop-shadow-[0_0_8px_rgba(22,172,32,0.5)] dark:drop-shadow-[0_0_8px_rgba(34,210,54,0.5)]"
                >
                    Partnership
                </h2>
                <div className="relative">

                    <svg width="100vw" height="80" viewBox="0 0 1000 20" preserveAspectRatio="none" style={{ marginTop: '20px' }}>
                        <path
                            d="M0 20 L190 20 L220 0 L800 0"
                            stroke="#99ff99"  // 彩度を上げたライトグリーン
                            strokeWidth="3"
                            fill="none"
                            className={`text-green-500 dark:text-green-400 ${isVisible ? 'animate-draw-line-from-left' : ''}`}
                            strokeDasharray="800"
                            style={{
                                filter: 'drop-shadow(0 0 5px rgba(153, 255, 153, 0.5))'  // グローの色を調整
                            }}
                        />
                    </svg>
                </div>
                <p className={`text-lg md:text-xl text-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    パートナーシップの詳細情報をここに記載します。
                </p>
            </div>
        </section>
    );
}
