import { useState, useEffect, useRef } from "react";
import { useOutletContext, useLocation } from "@remix-run/react";
import type { Theme } from "~/root";
import type { OutletContext } from "~/root";
import { useBackgroundLines } from "~/hooks/useBackgroundLines";
import { animate, stagger } from "motion";
import { motion, AnimatePresence } from "framer-motion";

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
        setIsMenuOpen(false);
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
        <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none" style={{ zIndex: 9999 }}>

            {/* Centering Wrapper */}
            <div className="relative mt-6 md:mt-8 mx-4 pointer-events-auto w-[95%] md:w-[90%] max-w-7xl">

                {/* 逆色の背景レイヤー (Initial Slide Logic) */}
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

                {/* Main Morphing Container */}
                <motion.div
                    layout
                    className="relative w-full overflow-hidden"
                    initial={{ borderRadius: 100, height: "auto" }}
                    animate={{
                        height: "auto",
                        borderRadius: isMenuOpen ? 24 : 100
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30
                    }}
                    style={{
                        // Note: borderRadius is handled by animate/initial to ensure Shape Consistency.
                        transform: `translateX(${isAnimating ? '-100%' : isFirstSlideComplete ? '0' : '-100%'})`,
                        opacity: isVisible ? 1 : 0,
                        transformOrigin: 'left',
                        transition: isAnimationComplete
                            ? 'background-color 200ms ease-out'
                            : `transform 600ms ease-out, opacity 400ms ease-in-out, background-color 200ms ease-out`,
                        transitionDelay: isFirstSlideComplete ? '400ms' : '0ms',
                        backgroundColor: isCurrentDark
                            ? `rgba(30, 40, 50, ${isHovered || isMenuOpen ? 0.95 : 0.6})`
                            : `rgba(255, 255, 255, ${isHovered || isMenuOpen ? 0.95 : 0.6})`,
                        backdropFilter: 'blur(24px) saturate(180%)',
                        boxShadow: isCurrentDark
                            ? 'inset 0 1px 0 0 rgba(255,255,255,0.4), inset 1px 0 0 0 rgba(255,255,255,0.2), inset 0 -2px 5px 0 rgba(0,0,0,0.4), inset 0 0 30px rgba(6,182,212,0.15), 0 10px 40px -10px rgba(0,0,0,0.5)'
                            : 'inset 0 0 0 1px rgba(255,255,255,0.4), inset 0 1px 0 0 rgba(255,255,255,0.4), 0 0 0 1px rgba(0,0,0,0.03), 0 4px 20px -5px rgba(0,0,0,0.1)',
                    }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {/* Background Lines (Only visible in closed state or top part) */}
                    <div className="absolute top-0 left-0 w-full h-20 md:h-28 pointer-events-none">
                        {cyanLines.map((line) => (
                            <svg key={line.id} className="absolute will-change-transform" style={{ top: `${line.points[0].y}%`, left: 0, width: '100%', height: '40px', overflow: 'visible' }}>
                                <path
                                    d={`M ${line.points.map(p => `${p.x},${p.y}`).join(' L ')}`}
                                    stroke={line.color} strokeWidth={line.width} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.3"
                                    className="background-line" style={{ transformOrigin: 'left', transform: 'scaleX(0)' }}
                                />
                            </svg>
                        ))}
                    </div>

                    <nav className="w-full">
                        {/* Header Bar Area */}
                        <div className="flex items-center h-20 md:h-28 px-6 md:px-12 w-full justify-between">

                            {/* Logo */}
                            <a href="#" onClick={handleLogoClick} className="header-logo flex items-center shrink-0 text-xl font-bold text-gray-800 dark:text-white z-20">
                                <img
                                    src={isCurrentDark ? "/images/logo-light.png" : "/images/logo-dark.png"}
                                    alt="Logo"
                                    className="h-12 md:h-16 lg:h-20 w-auto max-w-none"
                                />
                            </a>

                            {/* Desktop Menu (Hidden on Mobile) */}
                            <div className="hidden md:flex items-center">
                                <ul className="flex space-x-6 lg:space-x-12 items-center text-nowrap">
                                    {navItems.map((item) => (
                                        <li key={item.id} className="relative">
                                            <button
                                                onClick={() => handleClick(item.id)}
                                                className={`nav-item text-base md:text-lg xl:text-xl font-bold transition-colors duration-300 ${isCurrentDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}
                                            >
                                                {item.label}
                                            </button>
                                            <div className="nav-underline absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 ease-out" style={{ backgroundColor: isCurrentDark ? 'rgb(6 182 212)' : 'rgb(236 72 153)' }}></div>
                                        </li>
                                    ))}
                                    <li>
                                        <motion.button
                                            onClick={toggleTheme}
                                            className={`theme-toggle p-2 rounded-full transition-colors duration-300 ${isHovered ? 'text-gray-300 dark:text-gray-700 hover:text-white dark:hover:text-gray-900' : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}
                                            aria-label="テーマ切り替え"
                                            initial={{ opacity: 0, scale: 0.8, rotate: 180 }}
                                            animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.8, rotate: isVisible ? 0 : 180 }}
                                            transition={{ duration: 0.8, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                                            whileHover={{ scale: 1.1, rotate: 15, transition: { duration: 0.3 } }}
                                        >
                                            {isDark ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                            )}
                                        </motion.button>
                                    </li>
                                </ul>
                            </div>

                            {/* Mobile Controls (Theme + Hamburger) */}
                            <div className="md:hidden flex items-center space-x-4 z-20">
                                <motion.button
                                    onClick={toggleTheme}
                                    className={`theme-toggle p-2 rounded-full transition-colors duration-300 ${isHovered ? 'text-gray-800 hover:text-gray-600' : 'text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white'}`}
                                    initial={{ opacity: 0, scale: 0.8, rotate: 180 }}
                                    animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.8, rotate: isVisible ? 0 : 180 }}
                                    transition={{ duration: 0.8, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                                    whileHover={{ scale: 1.1, rotate: 15, transition: { duration: 0.3 } }}
                                >
                                    {isDark ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                    )}
                                </motion.button>

                                {/* Hamburger Icon */}
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="mobile-menu-toggle p-2"
                                    aria-label="メニュー"
                                >
                                    <div className="relative w-6 h-6">
                                        <div className={`absolute w-full h-0.5 bg-gray-800 dark:bg-white transition-transform duration-300 ${isMenuOpen ? 'rotate-45 top-3' : 'top-1'}`}></div>
                                        <div className={`absolute w-full h-0.5 bg-gray-800 dark:bg-white transition-transform duration-300 ${isMenuOpen ? '-rotate-45 top-3' : 'bottom-1'}`}></div>
                                    </div>
                                </button>
                            </div>

                        </div>

                        {/* Mobile Menu Content (Inside Morphing Container) */}
                        <AnimatePresence>
                            {isMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="md:hidden px-6 pb-6 overflow-hidden"
                                >
                                    <ul className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700/50">
                                        {navItems.map((item, i) => (
                                            <motion.li
                                                key={item.id}
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: i * 0.1 }}
                                            >
                                                <button
                                                    onClick={() => handleClick(item.id)}
                                                    className={`w-full text-left text-2xl font-bold py-2 transition-colors duration-300 ${isHovered ? 'text-gray-800' : 'text-gray-600 dark:text-gray-200'}`}
                                                >
                                                    {item.label}
                                                </button>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </motion.div>
                            )}
                        </AnimatePresence>

                    </nav>
                </motion.div>
            </div>
        </header>
    );
}
