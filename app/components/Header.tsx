import { useState, useEffect } from "react";
import { useOutletContext } from "@remix-run/react";
import type { Theme } from "~/root";
import type { OutletContext } from "~/root";

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
        setTheme((prev: Theme) => prev === 'light' ? 'dark' : 'light');
    };

    const handleClick = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const headerHeight = 120;
            const elementPosition = element.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = elementPosition - headerHeight;

            window.stopSmoothScroll?.();
            smoothScrollTo(offsetPosition);
            setIsMenuOpen(false);
        }
    };

    const handleLogoClick = (e: React.MouseEvent) => {
        e.preventDefault();
        window.stopSmoothScroll?.();
        smoothScrollTo(0);
    };

    return (
        <header
            className="fixed top-0 left-0 right-0 z-50 overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* 逆色の背景レイヤー - アニメーション完了後は非表示 */}
            {!isAnimationComplete && (
                <div
                    className="absolute top-0 left-0 w-full h-40 origin-left"
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

            {/* メインの背景レイヤー */}
            <div
                className="relative h-40"
                style={{
                    clipPath: 'polygon(0 0, 95% 0, 90% 60%, 16% 60%, 13% 100%, 0 100%)',
                    transform: `translateX(${isAnimating ? '-100%' : isFirstSlideComplete ? '0' : '-100%'})`,
                    opacity: isVisible ? 1 : 0,
                    transformOrigin: 'left',
                    transition: isAnimationComplete
                        ? 'background-color 200ms ease-out'  // アニメーション完了後はホバーの変化だけを高速に
                        : `
                            transform 600ms ease-out,
                            opacity 400ms ease-in-out,
                            background-color 200ms ease-out
                        `,
                    transitionDelay: isFirstSlideComplete ? '400ms' : '0ms',
                    backgroundColor: isCurrentDark ? 'rgb(31 41 55 / 0.5)' : 'rgb(255 255 255 / 0.5)',
                    backdropFilter: 'blur(8px)'
                }}
            >
                {/* 装飾的なライン - 上部 */}
                <div className="absolute top-[10%] left-0 w-full pointer-events-none">
                    {/* シアン色のライン - 左側 */}
                    <svg height="20" width="100%" className="absolute top-0 left-0">
                        <path
                            d="M0 2 L150 2 L170 18 L250 18 M260 2 L300 2"
                            stroke="rgb(6 182 212 / 0.3)"
                            strokeWidth="3"
                            fill="none"
                        />
                        {/* 装飾的な図形 */}
                        <rect x="155" y="8" width="4" height="4" transform="rotate(45 157 10)" fill="rgb(6 182 212 / 0.3)" />
                        <rect x="255" y="14" width="3" height="3" fill="rgb(6 182 212 / 0.3)" />
                    </svg>

                    {/* フクシア色のライン - 左側 */}
                    <svg height="25" width="100%" className="absolute top-0 left-0">
                        <path
                            d="M400 2 L500 2 M520 18 L600 18 L620 2 L700 2"
                            stroke="rgb(192 38 211 / 0.3)"
                            strokeWidth="3"
                            fill="none"
                        />
                        {/* ジグザグライン */}
                        <path
                            d="M500 2 L510 18 L520 2 L530 18"
                            stroke="rgb(192 38 211 / 0.3)"
                            strokeWidth="2"
                            fill="none"
                        />
                        <circle cx="615" cy="18" r="2" fill="rgb(192 38 211 / 0.3)" />
                    </svg>

                    {/* シアン色のライン - 中央右（パターン変更） */}
                    <svg height="25" width="100%" className="absolute top-0 left-0">
                        <path
                            d="M750 2 L850 2 L870 10 L890 2 L950 2 M960 18 L1000 18"
                            stroke="rgb(6 182 212 / 0.3)"
                            strokeWidth="3"
                            fill="none"
                        />
                        {/* 小さな三角形の装飾 */}
                        <path
                            d="M955 2 L965 8 L975 2"
                            stroke="rgb(6 182 212 / 0.3)"
                            strokeWidth="2"
                            fill="none"
                        />
                    </svg>

                    {/* 追加の装飾要素 */}
                    <svg height="30" width="100%" className="absolute top-0 left-0">
                        <circle cx="350" cy="10" r="1.5" fill="rgb(6 182 212 / 0.3)" />
                        <circle cx="355" cy="10" r="1.5" fill="rgb(192 38 211 / 0.3)" />
                        <circle cx="360" cy="10" r="1.5" fill="rgb(6 182 212 / 0.3)" />

                        <rect x="720" y="8" width="4" height="4" transform="rotate(30 722 10)" fill="rgb(192 38 211 / 0.3)" />
                        <rect x="728" y="8" width="4" height="4" transform="rotate(-30 730 10)" fill="rgb(6 182 212 / 0.3)" />
                    </svg>

                    {/* フクシア色のライン - 右側 */}
                    <svg height="20" width="100%" className="absolute top-0 left-0">
                        <path
                            d="M1050 2 L1200 2 L1220 18 L1300 18"
                            stroke="rgb(192 38 211 / 0.3)"
                            strokeWidth="3"
                            fill="none"
                        />
                    </svg>

                    {/* シアン色のライン - 最右 */}
                    <svg height="20" width="100%" className="absolute top-0 left-0">
                        <path
                            d="M1350 2 L1500 2 L1520 18 L1600 18"
                            stroke="rgb(6 182 212 / 0.3)"
                            strokeWidth="3"
                            fill="none"
                        />
                    </svg>
                </div>

                {/* 装飾的なライン - 下部 */}
                <div className="absolute top-[40%] left-0 w-full pointer-events-none">
                    {/* シアン色のライン - 左側 */}
                    <svg height="20" width="100%" className="absolute bottom-0 right-0">
                        <path
                            d="M0 18 L150 18 L170 2 L250 2"
                            stroke="rgb(6 182 212 / 0.3)"
                            strokeWidth="3"
                            fill="none"
                        />
                    </svg>

                    {/* フクシア色のライン - 左側 */}
                    <svg height="20" width="100%" className="absolute bottom-0 right-0">
                        <path
                            d="M300 18 L450 18 L470 2 L550 2"
                            stroke="rgb(192 38 211 / 0.3)"
                            strokeWidth="3"
                            fill="none"
                        />
                    </svg>

                    {/* シアン色のライン - 右側 */}
                    <svg height="20" width="100%" className="absolute bottom-0 right-0">
                        <path
                            d="M600 18 L750 18 L770 2 L850 2"
                            stroke="rgb(6 182 212 / 0.3)"
                            strokeWidth="3"
                            fill="none"
                        />
                    </svg>

                    {/* フクシア色のライン - 右側 */}
                    <svg height="20" width="100%" className="absolute bottom-0 right-0">
                        <path
                            d="M900 18 L1050 18 L1070 2 L1150 2"
                            stroke="rgb(192 38 211 / 0.3)"
                            strokeWidth="3"
                            fill="none"
                        />
                    </svg>

                    {/* シアン色のライン - 最右 */}
                    <svg height="20" width="100%" className="absolute bottom-0 right-0">
                        <path
                            d="M1200 18 L1350 18 L1370 2 L1450 2"
                            stroke="rgb(6 182 212 / 0.3)"
                            strokeWidth="3"
                            fill="none"
                        />
                    </svg>

                    {/* フクシア色のライン - 最右 */}
                    <svg height="20" width="100%" className="absolute bottom-0 right-0">
                        <path
                            d="M1500 18 L1650 18 L1670 2 L1750 2"
                            stroke="rgb(192 38 211 / 0.3)"
                            strokeWidth="3"
                            fill="none"
                        />
                    </svg>
                </div>

                <nav className="w-full overflow-x-hidden h-full">
                    <div className="flex items-start h-full pt-2 max-w-[1920px] mx-auto px-4 md:px-8 lg:px-12">
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

                            <div className="hidden md:flex items-start flex-1 pt-5">
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
                            <div className="md:hidden flex items-center space-x-4">
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

                                {/* 既存のハンバーガニューボタン */}
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

                    {/* モバイルメニュー */}
                    {isMenuOpen && (
                        <div className="md:hidden fixed top-[80px] left-0 right-0 mt-2 mx-4 z-50">
                            <div className={`${isHovered
                                ? 'bg-white/95'
                                : 'bg-white/95 dark:bg-gray-800/95'
                                } backdrop-blur-md rounded-2xl shadow-lg p-4`}>
                                <ul className="space-y-4">
                                    {['about', 'news', 'products', 'members', 'contact'].map((item) => (
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
                </nav>
            </div>
        </header>
    );
}