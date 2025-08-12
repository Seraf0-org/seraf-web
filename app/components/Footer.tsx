import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useOutletContext } from "@remix-run/react";
import type { OutletContext } from "~/root";
import { useBackgroundLines } from "~/hooks/useBackgroundLines";
import { animate, stagger } from "motion";
import { useEffect } from "react";

export function Footer() {
    const [sectionRef, isVisible] = useIntersectionObserver();
    const { theme, smoothScrollTo } = useOutletContext<OutletContext>();
    // isFooter を true に設定
    const lines = useBackgroundLines(theme !== 'dark', 'fuchsia', true);

    // Motionアニメーションを初期化
    useEffect(() => {
        if (isVisible) {
            // フッターセクションのアニメーション
            (animate as any)(
                ".footer-section",
                { opacity: [0, 1], y: [30, 0] },
                { 
                    delay: stagger(0.2),
                    duration: 0.8,
                    easing: [0.25, 0.46, 0.45, 0.94]
                }
            );

            // フッターリンクのアニメーション
            (animate as any)(
                ".footer-link",
                { opacity: [0, 1], x: [-15, 0] },
                { 
                    delay: stagger(0.1, { startDelay: 0.8 }),
                    duration: 0.6,
                    easing: [0.25, 0.46, 0.45, 0.94]
                }
            );

            // コピーライトのアニメーション
            (animate as any)(
                ".footer-copyright",
                { opacity: [0, 1], y: [20, 0] },
                { duration: 0.8, delay: 1.2, easing: [0.25, 0.46, 0.45, 0.94] }
            );
        }
    }, [isVisible]);

    // 下線アニメーションのホバー効果
    useEffect(() => {
        const footerLinks = document.querySelectorAll('.footer-link');
        
        footerLinks.forEach((link) => {
            const underline = link.parentElement?.querySelector('.footer-underline');
            
            link.addEventListener('mouseenter', () => {
                if (underline) {
                    // 全部左から右に出現
                    (animate as any)(
                        underline,
                        { width: [0, '60%'] }, // 長さを60%に短縮
                        { duration: 0.3, easing: [0.25, 0.46, 0.45, 0.94] }
                    );
                }
            });

            link.addEventListener('mouseleave', () => {
                if (underline) {
                    // 全部左から右に消去
                    (animate as any)(
                        underline,
                        { width: ['60%', 0] }, // 長さを60%に短縮
                        { duration: 0.3, easing: [0.25, 0.46, 0.45, 0.94] }
                    );
                }
            });
        });

        return () => {
            footerLinks.forEach(link => {
                link.removeEventListener('mouseenter', () => {});
                link.removeEventListener('mouseleave', () => {});
            });
        };
    }, []);

    // ナビゲーションリンクのクリックハンドラー
    const handleClick = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const headerHeight = 120;
            const elementPosition = element.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = elementPosition - headerHeight;

            smoothScrollTo(offsetPosition);
        }
    };

    return (
        <footer ref={sectionRef} className={`bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white py-12 relative overflow-hidden`}>
            {/* 背景の線 */}
            {lines.map((line, index) => (
                <svg
                    key={line.id}
                    className="absolute will-change-transform pointer-events-none"
                    style={{
                        left: `${line.left}%`,
                        top: 0,
                        width: '200px',
                        height: '100%',
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
                    />
                    {line.branches.map((branch, i) => (
                        <path
                            key={`${line.id}-${i}`}
                            d={`M ${branch.points.map(p => `${p.x},${p.y}`).join(' L ')}`}
                            stroke={branch.color}
                            strokeWidth={branch.width}
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    ))}
                </svg>
            ))}

            {/* 既存のコンテンツ */}
            <div className={`container mx-auto px-4 relative z-10 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="footer-section">
                        <h3 className="text-xl font-bold mb-4">Seraf()</h3>
                        <a href="#" onClick={() => smoothScrollTo(0)} className="footer-link text-gray-600 dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-white">
                            Become anything, from being nothing.
                        </a>
                    </div>
                    <div className="footer-section">
                        <h3 className="text-xl font-bold mb-4">リンク</h3>
                        <ul className="space-y-2">
                            <li className="relative">
                                <a href="#" onClick={() => handleClick('about')} className="footer-link text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white cursor-pointer">About</a>
                                <div className="footer-underline absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 ease-out" style={{
                                    backgroundColor: theme === 'dark' ? 'rgb(6 182 212)' : 'rgb(236 72 153)'
                                }}></div>
                            </li>
                            <li className="relative">
                                <a href="#" onClick={() => handleClick('news')} className="footer-link text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white cursor-pointer">News</a>
                                <div className="footer-underline absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 ease-out" style={{
                                    backgroundColor: theme === 'dark' ? 'rgb(6 182 212)' : 'rgb(236 72 153)'
                                }}></div>
                            </li>
                            <li className="relative">
                                <a href="#" onClick={() => handleClick('products')} className="footer-link text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white cursor-pointer">Products</a>
                                <div className="footer-underline absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 ease-out" style={{
                                    backgroundColor: theme === 'dark' ? 'rgb(6 182 212)' : 'rgb(236 72 153)'
                                }}></div>
                            </li>
                            <li className="relative">
                                <a href="#" onClick={() => handleClick('members')} className="footer-link text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white cursor-pointer">Members</a>
                                <div className="footer-underline absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 ease-out" style={{
                                    backgroundColor: theme === 'dark' ? 'rgb(6 182 212)' : 'rgb(236 72 153)'
                                }}></div>
                            </li>
                            <li className="relative">
                                <a href="#" onClick={() => handleClick('contact')} className="footer-link text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white cursor-pointer">Contact</a>
                                <div className="footer-underline absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 ease-out" style={{
                                    backgroundColor: theme === 'dark' ? 'rgb(6 182 212)' : 'rgb(236 72 153)'
                                }}></div>
                            </li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h3 className="text-xl font-bold mb-4">お問い合わせ</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            KTN44295080@Seraf0.com
                        </p>
                    </div>
                    <div className="footer-section">
                        <h3 className="text-xl font-bold mb-4">SNS</h3>
                        <div className="flex space-x-4">
                            <a
                                href="https://twitter.com/seraf_dev"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer-link text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                            >
                                <img
                                    src="/images/x-logo-black.png"
                                    alt="X (Twitter)"
                                    className="w-6 h-6 dark:hidden"
                                />
                                <img
                                    src="/images/x-logo-white.png"
                                    alt="X (Twitter)"
                                    className="w-6 h-6 hidden dark:block"
                                />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="footer-copyright mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-600 dark:text-gray-400">
                    <p>&copy; 2025 Seraf(). All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}