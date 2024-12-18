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

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
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
        <header
            className={`fixed top-0 left-0 right-0 z-50 px-4 md:px-8 lg:px-20 xl:px-40 mt-5 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={`relative transition-colors duration-300 rounded-full ${isCurrentDark
                ? 'bg-gray-800/50 backdrop-blur-md shadow-[0_0_18px_rgba(255,255,255,0.1)]'
                : 'bg-white/50 backdrop-blur-md shadow-[0_0_18px_rgba(0,0,0,0.2)]'
                }`}>
                <nav className="container mx-auto px-4 py-2 overflow-x-hidden">
                    <div className="flex items-center justify-between">
                        <a
                            href="#"
                            onClick={handleLogoClick}
                            className="flex items-center text-xl font-bold text-gray-800 dark:text-white"
                        >
                            <img
                                src={isCurrentDark ? "/images/logo-light.png" : "/images/logo-dark.png"}
                                alt="Logo"
                                className="w-16 md:w-24 h-auto mr-2"
                            />
                        </a>

                        <div className="hidden md:flex items-center space-x-6 lg:space-x-12">
                            {/* デスクトップメニュー */}
                            <ul className="flex space-x-6 lg:space-x-12">
                                {['about', 'news', 'products', 'members', 'contact'].map((item) => (
                                    <li key={item}>
                                        <button
                                            onClick={() => handleClick(item)}
                                            className={`text-lg xl:text-xl 2xl:text-2xl font-bold transition-colors duration-300 ${isCurrentDark
                                                ? 'text-gray-200 hover:text-white'
                                                : 'text-gray-600 hover:text-gray-900'
                                                }`}
                                        >
                                            {item.charAt(0).toUpperCase() + item.slice(1)}
                                        </button>
                                    </li>
                                ))}
                            </ul>

                            {/* テーマ切り替えボタン */}
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
                        </div>

                        {/* モバイルメニューボタン */}
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

                            {/* 既存のハンバーガーメニューボタン */}
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