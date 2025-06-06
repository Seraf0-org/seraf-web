import { useState, useEffect } from "react";
import { useOutletContext } from "@remix-run/react";
import type { Theme } from "~/root";
import type { OutletContext } from "~/root";
import { useBackgroundLines } from "~/hooks/useBackgroundLines";

export function Header() {
    const { theme, setTheme, smoothScrollTo } = useOutletContext<OutletContext>();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const isDark = theme === 'dark';
    const invertedTheme = isDark ? 'light' : 'dark';
    const currentTheme = isHovered ? invertedTheme : theme;
    const isCurrentDark = currentTheme === 'dark';
    const [isInitialRender, setIsInitialRender] = useState(true);
    const [isAnimating, setIsAnimating] = useState(true);
    const [isFirstSlideComplete, setIsFirstSlideComplete] = useState(false);
    const [isAnimationComplete, setIsAnimationComplete] = useState(false);
    const cyanLines = useBackgroundLines('cyan', 'horizontal', isCurrentDark, isHovered);

    useEffect(() => {
        setIsInitialRender(false);

        const timer1 = setTimeout(() => {
            setIsAnimating(false);
        }, 100);

        const timer2 = setTimeout(() => {
            setIsFirstSlideComplete(true);
        }, 700);

        const timer3 = setTimeout(() => {
            setIsVisible(true);
        }, 1100);

        const timer4 = setTimeout(() => {
            setIsAnimationComplete(true);
        }, 2000);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
            clearTimeout(timer4);
        };
    }, []);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const handleClick = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const headerHeight = 120;
            const elementPosition = element.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = elementPosition - headerHeight;

            smoothScrollTo(offsetPosition);
            setIsMenuOpen(false);
        }
    };

    const handleLogoClick = (e: React.MouseEvent) => {
        e.preventDefault();
        smoothScrollTo(0);
    };

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
                {/* 逆色の背景レイヤー - アニメーション完了後は非表示 */}
                {!isAnimationComplete && (
                    <div
                        className="absolute top-0 left-0 w-full h-28 md:h-40 origin-left"
                        style={{
                            clipPath: 'polygon(0 0, 95% 0, 90% 60%, 16% 60%, 13% 100%, 0 100%)',
                            transform: `translateX(${isAnimating ? '-100%' : '0'})`,
                            opacity: isAnimating ? 0 : isVisible ? 0 : 1,
                            transition: 'transform 600ms ease-out, opacity 800ms ease-in-out',
                            transitionDelay: isAnimating ? '0ms' : isVisible ? '600ms' : '0ms',
                            backgroundColor: !isCurrentDark ? 'rgb(31 41 55 / 0.5)' : 'rgb(255 255 255 / 0.5)',
                            backdropFilter: 'blur(8px)'
                        }}
                    />
                )}

                {/* ナビゲーションコンテンツ - クリップパスの影響を受けない */}
                <div
                    className="relative h-28 md:h-40 pointer-events-auto"
                    style={{
                        clipPath: 'polygon(0 0, 95% 0, 90% 60%, 16% 60%, 13% 100%, 0 100%)',
                        transform: `translateX(${isAnimating ? '-100%' : isFirstSlideComplete ? '0' : '-100%'})`,
                        opacity: isVisible ? 1 : 0,
                        transformOrigin: 'left',
                        transition: isAnimationComplete
                            ? 'background-color 200ms ease-out'
                            : `
                                transform 600ms ease-out,
                                opacity 400ms ease-in-out,
                                background-color 200ms ease-out
                            `,
                        transitionDelay: isFirstSlideComplete ? '400ms' : '0ms',
                        backgroundColor: isCurrentDark ? 'rgb(31 41 55 / 0.5)' : 'rgb(210 210 210 / 0.5)',
                        backdropFilter: 'blur(8px)'
                    }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {/* 装飾的なライン - 上部 */}
                    <div className="absolute top-[10%] left-0 w-full pointer-events-none">
                        {cyanLines.map((line, index) => (
                            <svg
                                key={line.id}
                                className="absolute will-change-transform"
                                style={{
                                    top: `${line.points[0].y}%`,
                                    left: 0,
                                    width: '100%',
                                    height: '40px',
                                    overflow: 'visible',
                                }}
                            >
                                <path
                                    d={`M ${line.points.map(p => `${p.x},${p.y}`).join(' L ')}`}
                                    stroke={line.color}
                                    strokeWidth={line.width}
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    opacity="0.3"
                                />
                            </svg>
                        ))}
                    </div>

                    {/* ヘッダーのアウトライン - ホバー時のみ表示 */}
                    <div className="absolute inset-0 pointer-events-none">
                        <svg
                            className="absolute inset-0 w-full h-full"
                            viewBox="0 0 1000 160"
                            preserveAspectRatio="none"
                        >
                            <path
                                d="M0 0 L950 0 L900 96 L160 96 L130 160 L0 160"
                                stroke={isCurrentDark
                                    ? 'rgb(6 182 212 / 0.7)' // ダークテーマ時は cyan のまま
                                    : 'rgb(236 72 153 / 0.9)' // ライトテーマ時は fuchsia-500 に変更
                                }
                                strokeWidth={5}
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                pathLength="100"
                                style={{
                                    strokeDasharray: 100,
                                    strokeDashoffset: isHovered ? 0 : 100,
                                    transition: 'stroke-dashoffset 0.6s ease-in-out',
                                    opacity: 1,
                                    filter: isCurrentDark
                                        ? 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.3)) drop-shadow(0 0 8px rgba(6, 182, 212, 0.7))' // 白 + cyan
                                        : 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.3)) drop-shadow(0 0 8px rgba(255, 0, 255, 0.7))' // 黒 + fuchsia
                                }}
                            />
                        </svg>
                    </div>

                    <nav className="w-full overflow-x-hidden h-full">
                        <div className="flex items-start h-full pt-1 md:pt-2 max-w-[1920px] mx-auto px-4 md:px-6 lg:px-8">
                            <div className="flex items-start w-full pt-1 md:pt-2">
                                <a
                                    href="#"
                                    onClick={handleLogoClick}
                                    className="flex items-center text-xl font-bold text-gray-800 dark:text-white ml-2"
                                >
                                    <img
                                        src={isCurrentDark ? "/images/logo-light.png" : "/images/logo-dark.png"}
                                        alt="Logo"
                                        className="w-16 md:w-28 lg:w-44 h-auto"
                                    />
                                </a>

                                <div className="hidden md:flex items-start flex-1 pt-3">
                                    {/* デスクトップメニュー */}
                                    <ul className="flex space-x-4 lg:space-x-10 ml-auto mr-40 items-center">
                                        {['about', 'news', 'products', 'members', 'partners', 'contact'].map((item) => (
                                            <li key={item}>
                                                <button
                                                    onClick={() => handleClick(item)}
                                                    className={`text-base xl:text-lg 2xl:text-xl font-bold transition-colors duration-300 ${isCurrentDark
                                                        ? 'text-gray-300 hover:text-white'
                                                        : 'text-gray-700 hover:text-gray-900'
                                                        }`}
                                                >
                                                    {item.charAt(0).toUpperCase() + item.slice(1)}
                                                </button>
                                            </li>
                                        ))}
                                        <li>
                                            <button
                                                onClick={toggleTheme}
                                                className={`p-2 rounded-full transition-colors duration-300 ${isHovered
                                                    ? 'text-gray-300 dark:text-gray-700 hover:text-white dark:hover:text-gray-900'
                                                    : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                                                    }`}
                                                aria-label="テーマ切り替え"
                                            >
                                                {isDark ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                                    </svg>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                                    </svg>
                                                )}
                                            </button>
                                        </li>
                                    </ul>
                                </div>

                                {/* モバイルメニュータン */}
                                <div className="md:hidden flex items-center space-x-4 ml-auto mr-8 mt-2">
                                    {/* テーマ切り替えボタン（モバイル） */}
                                    <button
                                        onClick={toggleTheme}
                                        className={`p-2 rounded-full transition-colors duration-300 ${isHovered
                                            ? 'text-gray-800 hover:text-gray-600'
                                            : 'text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white'
                                            }`}
                                        aria-label="テーマ切り替え"
                                    >
                                        {isDark ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                        )}
                                    </button>

                                    {/* ハンバーガーメニューアイコン */}
                                    <button
                                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                                        className="p-2"
                                        aria-label="メニュー"
                                    >
                                        <div className="relative w-6 h-6">
                                            <div className={`absolute w-full h-0.5 bg-gray-800 dark:bg-white transition-transform duration-300 ${isMenuOpen ? 'rotate-45 top-1.5' : 'top-0'}`}></div>
                                            <div className={`absolute w-full h-0.5 bg-gray-800 dark:bg-white transition-transform duration-300 ${isMenuOpen ? '-rotate-45 top-1.5' : 'bottom-1.5'}`}></div>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>
            </header>

            {/* モバイルメニューをヘッダーの外に完全に移動 */}
            {isMenuOpen && (
                <div className="md:hidden fixed top-[70px] left-0 right-0 mt-2 mx-4 z-50 overflow-visible pointer-events-auto">
                    <div className={`${isHovered
                        ? 'bg-white/95'
                        : 'bg-white/95 dark:bg-gray-800/95'
                        } backdrop-blur-md rounded-2xl shadow-lg p-4 animate-clip-from-top`}
                    >
                        <ul className="space-y-4">
                            {['about', 'news', 'products', 'members', 'partners', 'contact'].map((item) => (
                                <li key={item}>
                                    <button
                                        onClick={() => handleClick(item)}
                                        className={`w-full text-left text-xl font-bold transition-colors duration-300 ${isHovered
                                            ? 'text-gray-800 hover:text-gray-600'
                                            : 'text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white'
                                            }`}
                                    >
                                        {item.charAt(0).toUpperCase() + item.slice(1)}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </>
    );
}