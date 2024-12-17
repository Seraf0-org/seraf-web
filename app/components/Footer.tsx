import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

export function Footer() {
    const [sectionRef, isVisible] = useIntersectionObserver();

    return (
        <footer ref={sectionRef} className="bg-gray-900 text-white py-12">
            <div className={`container mx-auto px-4 transition-all duration-1000 transform ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4">Seraf()</h3>
                        <p className="text-gray-400">
                            何者にもなれる。何者でもないから。
                        </p>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-4">リンク</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-400 hover:text-white">About</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">News</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Products</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Members</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-4">お問い合わせ</h3>
                        <p className="text-gray-400">
                            〒113-0034<br />
                            東京都文京区湯島<br />
                            TEL: 080-7881-6220
                        </p>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-4">SNS</h3>
                        <div className="flex space-x-4">
                            <a
                                href="https://twitter.com/seraf_dev"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white"
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
                <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
                    <p>&copy; 2024 Seraf(). All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}