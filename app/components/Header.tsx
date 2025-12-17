import { useState, useEffect } from "react";
import { useOutletContext, useLocation } from "@remix-run/react";
import type { Theme } from "~/root";
import type { OutletContext } from "~/root";
import { useBackgroundLines } from "~/hooks/useBackgroundLines";
import { animate, stagger } from "motion";

export function Header({ startAnimation }: { startAnimation: boolean }) {
    const { theme, setTheme, smoothScrollTo } = useOutletContext<OutletContext>();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const isDark = theme === 'dark';
    const invertedTheme = isDark ? 'light' : 'dark';
    const currentTheme = isHovered ? invertedTheme : theme;
    // const currentTheme = (isDark && isHovered) ? 'light' : theme;
    const isCurrentDark = currentTheme === 'dark';
    const [isInitialRender, setIsInitialRender] = useState(true);
    const [isAnimating, setIsAnimating] = useState(true);
    const [isFirstSlideComplete, setIsFirstSlideComplete] = useState(false);
    const [isAnimationComplete, setIsAnimationComplete] = useState(false);
    const cyanLines = useBackgroundLines('cyan', 'horizontal', isCurrentDark, isHovered);
    const location = useLocation();
    const isPortfolio = location.pathname.startsWith("/portfolio");

    useEffect(() => {
        if (!startAnimation) return;
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
    }, [startAnimation]);

    // Motionアニメーションを初期化
    useEffect(() => {
        if (isVisible && startAnimation) {
            // ロゴのアニメーション
            (animate as any)(
                ".header-logo",
                { opacity: [0, 1], scale: [0.8, 1], x: [-20, 0] },
                { duration: 0.8, delay: 0.2, easing: [0.25, 0.46, 0.45, 0.94] }
            );

            // ナビゲーションメニューのアニメーション
            (animate as any)(
                ".nav-item",
                { opacity: [0, 1], y: [-10, 0], scale: [0.9, 1] },
                {
                    delay: stagger(0.1, { startDelay: 0.4 }),
                    duration: 0.6,
                    easing: [0.25, 0.46, 0.45, 0.94]
                }
            );

            // テーマ切り替えボタンのアニメーション
            (animate as any)(
                ".theme-toggle",
                { opacity: [0, 1], scale: [0.8, 1], rotate: [180, 0] },
                { duration: 0.8, delay: 0.8, easing: [0.25, 0.46, 0.45, 0.94] }
            );



            // 背景ラインのアニメーション
            (animate as any)(
                ".background-line",
                { opacity: [0, 0.3], scaleX: [0, 1] },
                {
                    delay: stagger(0.15, { startDelay: 0.6 }),
                    duration: 0.8,
                    easing: [0.25, 0.46, 0.45, 0.94]
                }
            );
        }
    }, [isVisible]);

    // ホバー時の追加アニメーション
    useEffect(() => {
        const headerLogo = document.querySelector('.header-logo');
        const navItems = document.querySelectorAll('.nav-item');
        const themeToggle = document.querySelector('.theme-toggle');

        // ロゴのホバーアニメーション
        if (headerLogo) {
            headerLogo.addEventListener('mouseenter', () => {
                (animate as any)(
                    headerLogo,
                    { scale: [1, 1.05], y: [0, -2] },
                    { duration: 0.3, easing: [0.25, 0.46, 0.45, 0.94] }
                );
            });

            headerLogo.addEventListener('mouseleave', () => {
                (animate as any)(
                    headerLogo,
                    { scale: [1.05, 1], y: [-2, 0] },
                    { duration: 0.3, easing: [0.25, 0.46, 0.45, 0.94] }
                );
            });
        }

        // ナビゲーションアイテムのホバーアニメーション
        navItems.forEach((item, index) => {
            const underline = item.parentElement?.querySelector('.nav-underline');

            item.addEventListener('mouseenter', () => {
                (animate as any)(
                    item,
                    { scale: [1, 1.1], y: [0, -3] },
                    { duration: 0.3, easing: [0.25, 0.46, 0.45, 0.94] }
                );

                // 下線アニメーション
                if (underline) {
                    (animate as any)(
                        underline,
                        { width: [0, '100%'] },
                        { duration: 0.3, easing: [0.25, 0.46, 0.45, 0.94] }
                    );
                }
            });

            item.addEventListener('mouseleave', () => {
                (animate as any)(
                    item,
                    { scale: [1.1, 1], y: [-3, 0] },
                    { duration: 0.3, easing: [0.25, 0.46, 0.45, 0.94] }
                );

                // 下線アニメーション
                if (underline) {
                    (animate as any)(
                        underline,
                        { width: ['100%', 0] },
                        { duration: 0.3, easing: [0.25, 0.46, 0.45, 0.94] }
                    );
                }
            });
        });

        // テーマ切り替えボタンのホバーアニメーション
        if (themeToggle) {
            themeToggle.addEventListener('mouseenter', () => {
                (animate as any)(
                    themeToggle,
                    { scale: [1, 1.1], rotate: [0, 15] },
                    { duration: 0.3, easing: [0.25, 0.46, 0.45, 0.94] }
                );
            });

            themeToggle.addEventListener('mouseleave', () => {
                (animate as any)(
                    themeToggle,
                    { scale: [1.1, 1], rotate: [15, 0] },
                    { duration: 0.3, easing: [0.25, 0.46, 0.45, 0.94] }
                );
            });
        }

        return () => {
            // クリーンアップ
            if (headerLogo) {
                headerLogo.removeEventListener('mouseenter', () => { });
                headerLogo.removeEventListener('mouseleave', () => { });
            }
            navItems.forEach(item => {
                item.removeEventListener('mouseenter', () => { });
                item.removeEventListener('mouseleave', () => { });
            });
            if (themeToggle) {
                themeToggle.removeEventListener('mouseenter', () => { });
                themeToggle.removeEventListener('mouseleave', () => { });
            }
        };
    }, []);

    // モバイルメニューのアニメーション
    useEffect(() => {
        if (isMenuOpen) {
            // モバイルメニューアイテムのアニメーション
            (animate as any)(
                ".mobile-nav-item",
                { opacity: [0, 1], x: [-20, 0] },
                {
                    delay: stagger(0.1),
                    duration: 0.5,
                    easing: [0.25, 0.46, 0.45, 0.94]
                }
            );
        }
    }, [isMenuOpen]);

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

    const navItems: { id: string; label: string }[] = isPortfolio
        ? [
            { id: "about", label: "About" },
            { id: "products", label: "Projects" },
            { id: "members", label: "Capabilities" },
            { id: "contact", label: "Contact" },
        ]
        : ['about', 'news', 'products', 'members', 'partners', 'contact'].map((id) => ({
            id,
            label: id.charAt(0).toUpperCase() + id.slice(1),
        }));

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none" style={{ zIndex: 9999 }}>

                {/* Centering Wrapper - Wide Pill */}
                <div className="relative mt-6 md:mt-8 mx-4 pointer-events-auto w-[95%] md:w-[90%] max-w-7xl">

                    {/* 逆色の背景レイヤー */}
                    {!isAnimationComplete && (
                        <div
                            className="absolute inset-0 w-full h-full rounded-full"
                            style={{
                                transform: `translateX(${isAnimating ? '-100%' : '0'})`,
                                opacity: isAnimating ? 0 : isVisible ? 0 : 1,
                                transition: 'transform 600ms ease-out, opacity 800ms ease-in-out',
                                transitionDelay: isAnimating ? '0ms' : isVisible ? '600ms' : '0ms',
                                backgroundColor: !isCurrentDark ? 'rgb(31 41 55 / 0.5)' : 'rgb(255 255 255 / 0.5)',
                                backdropFilter: 'blur(8px)',
                                boxShadow: !isCurrentDark ? '0 12px 40px rgba(0, 0, 0, 0.6), 0 8px 24px rgba(6, 182, 212, 0.3), 0 4px 12px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)' : '0 12px 40px rgba(0, 0, 0, 0.3), 0 8px 24px rgba(236, 72, 153, 0.3), 0 4px 12px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                            }}
                        />
                    )}

                    {/* ナビゲーションコンテンツ */}
                    <div
                        className="relative h-20 md:h-28 rounded-full w-full"
                        style={{
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
                            // Liquid Glass: Almost transparent background, heavy blur, high saturation. Opaque on hover for readability.
                            backgroundColor: isCurrentDark
                                ? `rgba(30, 40, 50, ${isHovered ? 0.9 : 0.1})`
                                : `rgba(255, 255, 255, ${isHovered ? 0.9 : 0.15})`, // Slightly increased base opacity for presence
                            backdropFilter: 'blur(24px) saturate(180%)',
                            // Glass shadows: Strong Bevel (Top highlight, side highlight, bottom shadow, inner glow)
                            boxShadow: isCurrentDark
                                ? 'inset 0 1px 0 0 rgba(255,255,255,0.4), inset 1px 0 0 0 rgba(255,255,255,0.2), inset 0 -2px 5px 0 rgba(0,0,0,0.4), inset 0 0 30px rgba(6,182,212,0.15), 0 10px 40px -10px rgba(0,0,0,0.5)'
                                : 'inset 0 0 0 1px rgba(255,255,255,0.4), inset 0 1px 0 0 rgba(255,255,255,0.4), 0 0 0 1px rgba(0,0,0,0.03), 0 4px 20px -5px rgba(0,0,0,0.1)', // Reduced glare, added subtle ring
                            borderRadius: '100px', // Pill shape
                            overflow: 'hidden' // Clip background lines
                        }}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        {/* 装飾的なライン - 上部 (Clipped by overflow:hidden) */}
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
                                        className="background-line"
                                        style={{
                                            transformOrigin: 'left',
                                            transform: 'scaleX(0)'
                                        }}
                                    />
                                </svg>
                            ))}
                        </div>

                        <nav className="w-full overflow-x-hidden h-full">
                            <div className="flex items-center h-full px-6 md:px-12 w-full">
                                <div className="flex items-center justify-between w-full">
                                    <a
                                        href="#"
                                        onClick={handleLogoClick}
                                        className="header-logo flex items-center shrink-0 text-xl font-bold text-gray-800 dark:text-white"
                                    >
                                        <img
                                            src={isCurrentDark ? "/images/logo-light.png" : "/images/logo-dark.png"}
                                            alt="Logo"
                                            className="h-12 md:h-16 lg:h-20 w-auto max-w-none"
                                        />
                                    </a>

                                    <div className="hidden md:flex items-center">
                                        {/* デスクトップメニュー */}
                                        <ul className="flex space-x-6 lg:space-x-12 items-center text-nowrap">
                                            {navItems.map((item) => (
                                                <li key={item.id} className="relative">
                                                    <button
                                                        onClick={() => handleClick(item.id)}
                                                        className={`nav-item text-base md:text-lg xl:text-xl font-bold transition-colors duration-300 ${isCurrentDark
                                                            ? 'text-gray-300 hover:text-white'
                                                            : 'text-gray-700 hover:text-gray-900'
                                                            }`}
                                                    >
                                                        {item.label}
                                                    </button>
                                                    <div className="nav-underline absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 ease-out" style={{
                                                        backgroundColor: isCurrentDark ? 'rgb(6 182 212)' : 'rgb(236 72 153)'
                                                    }}></div>
                                                </li>
                                            ))}
                                            <li>
                                                <button
                                                    onClick={toggleTheme}
                                                    className={`theme-toggle p-2 rounded-full transition-colors duration-300 ${isHovered
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
                                            className={`theme-toggle p-2 rounded-full transition-colors duration-300 ${isHovered
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
                                            className="mobile-menu-toggle p-2"
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
                            {navItems.map((item) => (
                                <li key={item.id}>
                                    <button
                                        onClick={() => handleClick(item.id)}
                                        className={`mobile-nav-item w-full text-left text-xl font-bold transition-colors duration-300 ${isHovered
                                            ? 'text-gray-800 hover:text-gray-600'
                                            : 'text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white'
                                            }`}
                                    >
                                        {item.label}
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