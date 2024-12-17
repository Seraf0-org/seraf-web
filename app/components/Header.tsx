import { useState, useEffect } from "react";

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const smoothScroll = (targetPosition: number, duration: number = 1000) => {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime: number | null = null;

        function animation(currentTime: number) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function ease(t: number, b: number, c: number, d: number) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    };

    const handleClick = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const headerHeight = 120;
            const elementPosition = element.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = elementPosition - headerHeight;

            smoothScroll(offsetPosition, 500);
            setTimeout(() => {
                setIsMenuOpen(false);
            }, 100);
        }
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 px-4 md:px-8 lg:px-20 xl:px-40 mt-5 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={`relative transition-colors duration-300 rounded-full ${isHovered
                ? 'bg-white shadow-[0_0_25px_rgba(0,0,0,0.1)]'
                : 'bg-white/60 dark:bg-gray-800/60 backdrop-blur-md shadow-[0_0_25px_rgba(255,255,255,0.5)] dark:shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                }`}>
                <nav className="container mx-auto px-4 py-3 overflow-x-hidden">
                    <div className="flex items-center justify-between">
                        <a
                            href="#"
                            onClick={(e) => {
                                smoothScroll(0, 500);
                            }}
                            className="flex items-center text-xl font-bold text-gray-800 dark:text-white"
                        >
                            <img
                                src={isHovered ? "/images/logo-dark.png" : "/images/logo-dark.png"}
                                alt="Logo"
                                className={`w-16 md:w-24 h-auto mr-2 ${isHovered ? 'block' : 'dark:hidden'}`}
                            />
                            <img
                                src={isHovered ? "/images/logo-dark.png" : "/images/logo-light.png"}
                                alt="Logo"
                                className={`w-16 md:w-24 h-auto mr-2 ${isHovered ? 'hidden' : 'hidden dark:block'}`}
                            />
                        </a>

                        {/* デスクトップメニュー */}
                        <ul className="hidden md:flex space-x-6 lg:space-x-12">
                            {['about', 'news', 'products', 'members', 'contact'].map((item) => (
                                <li key={item}>
                                    <button
                                        onClick={() => handleClick(item)}
                                        className={`text-lg xl:text-xl 2xl:text-2xl font-bold transition-colors duration-300 ${isHovered
                                            ? 'text-gray-800 hover:text-gray-600'
                                            : 'text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white'
                                            }`}
                                    >
                                        {item.charAt(0).toUpperCase() + item.slice(1)}
                                    </button>
                                </li>
                            ))}
                        </ul>

                        {/* モバイルメニューボタン */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2"
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