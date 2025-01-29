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
        setTheme((prev: Theme) => (prev === 'light' ? 'dark' : 'light') as Theme);
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
        <header className="fixed top-0 left-0 right-0 z-50">
            {/* クリップパスを適用する背景レイヤー */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    clipPath: 'polygon(0 0, 95% 0, 90% 60%, 16% 60%, 13% 100%, 0 100%)',
                    backgroundColor: isCurrentDark ? 'rgb(31 41 55 / 0.5)' : 'rgb(210 210 210 / 0.5)',
                    backdropFilter: 'blur(8px)',
                    height: '160px'
                }}
            />

            {/* ナビゲーションコンテンツ - クリップパスの影響を受けない */}
            <div
                className="relative z-10 pointer-events-auto"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <nav className="w-full overflow-x-hidden h-40">
                    <div className="flex items-start h-full pt-2 max-w-[1920px] mx-auto px-4 md:px-6 lg:px-8">
                        <div className="flex items-start w-full pt-2">
                            <a
                                href="#"
                                onClick={handleLogoClick}
                                className="flex items-center text-xl font-bold text-gray-800 dark:text-white ml-2"
                            >
                                <img
                                    src={isCurrentDark ? "/images/logo-light.png" : "/images/logo-dark.png"}
                                    alt="Logo"
                                    className="w-28 md:w-44 h-auto"
                                />
                            </a>

                            <div className="hidden md:flex items-start flex-1 pt-3">
                                {/* デスクトップメニュー */}
                                <ul className="flex space-x-6 lg:space-x-12 ml-auto mr-40 items-center">
                                    {['about', 'news', 'products', 'members', 'contact'].map((item) => (
                                        <li key={item}>
                                            <button
                                                onClick={() => handleClick(item)}
                                                className={`text-lg xl:text-xl 2xl:text-2xl font-bold transition-colors duration-300 ${isCurrentDark
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
                            <div className="md:hidden flex items-center space-x-4 ml-auto">
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

                                {/* 既存のハンバーガーボタン */}
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="p-2"
                                    aria-label="メニュー"
                                >
                                    <div className={`w-6 h-0.5 mb-1.5 transition-colors duration-300 ${isHovered ? 'bg-gray-800' : 'bg-gray-800 dark:bg-white'
                                        }`}></div>
                                    <div className={`w-6 h-0.5 mb-1.5 transition-colors duration-300 ${isHovered ? 'bg-gray-800' : 'bg-gray-800 dark:bg-white'
                                        }`}></div>
                                    <div className={`w-6 h-0.5 transition-colors duration-300 ${isHovered ? 'bg-gray-800' : 'bg-gray-800 dark:bg-white'
                                        }`}></div>
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* モバイルメニュー */}
                {isMenuOpen && (
                    <div className="md:hidden fixed left-0 right-0 mt-2 mx-4 z-50">
                        <div className={`
                            backdrop-blur-md rounded-2xl shadow-lg p-4
                            ${isCurrentDark 
                                ? 'bg-gray-800/95 shadow-[0_0_15px_rgba(0,0,0,0.3)]' 
                                : 'bg-white/95 shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                            }
                            transition-colors duration-300
                        `}>
                            <ul className="space-y-4">
                                {['about', 'news', 'products', 'members', 'contact'].map((item) => (
                                    <li key={item}>
                                        <button
                                            onClick={() => handleClick(item)}
                                            className={`
                                                w-full text-left text-xl font-bold
                                                transition-colors duration-300
                                                ${isCurrentDark
                                                    ? 'text-gray-300 hover:text-white'
                                                    : 'text-gray-700 hover:text-gray-900'
                                                }
                                            `}
                                        >
                                            {item.charAt(0).toUpperCase() + item.slice(1)}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}