import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useOutletContext } from "@remix-run/react";
import type { OutletContext } from "~/root";
import { useBackgroundLines } from "~/hooks/useBackgroundLines";

export function Footer() {
    const [sectionRef, isVisible] = useIntersectionObserver();
    const { theme } = useOutletContext<OutletContext>();
    // isFooter を true に設定
    const lines = useBackgroundLines(theme !== 'dark', 'fuchsia', true);

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
                    <div>
                        <h3 className="text-xl font-bold mb-4">Seraf()</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Become anything, from being nothing.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-4">リンク</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">About</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">News</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Products</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Members</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-4">お問い合わせ</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            KTN44295080@Seraf0.com
                        </p>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-4">SNS</h3>
                        <div className="flex space-x-4">
                            <a
                                href="https://twitter.com/seraf_dev"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
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
                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-600 dark:text-gray-400">
                    <p>&copy; 2025 Seraf(). All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}