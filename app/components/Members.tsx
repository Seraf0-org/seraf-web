import { useState, useCallback, useEffect } from "react";
import { members } from "~/data/members";
import { useIntersectionObserver } from "~/hooks/useIntersectionObserver";
import { useOutletContext } from "@remix-run/react";
import type { OutletContext } from "~/root";
import { useLines } from "~/contexts/LinesContext";
import { createPortal } from 'react-dom';

const Hexagon = ({ x, y, size, color, opacity, delay, parallaxSpeed, isVisible }: {
    x: number;
    y: number;
    size: number;
    color: string;
    opacity: number;
    delay: number;
    parallaxSpeed: number;
    isVisible: boolean;
}) => {
    const [offsetY, setOffsetY] = useState(0);
    const [startScrollY, setStartScrollY] = useState(0);

    const handleScroll = useCallback(() => {
        if (!isVisible) return;

        requestAnimationFrame(() => {
            const currentScrollY = window.scrollY;
            const relativeScroll = currentScrollY - startScrollY;
            setOffsetY(relativeScroll * parallaxSpeed);
        });
    }, [parallaxSpeed, isVisible, startScrollY]);

    useEffect(() => {
        if (isVisible) {
            setStartScrollY(window.scrollY);
            window.addEventListener("scroll", handleScroll, { passive: true });
            return () => window.removeEventListener("scroll", handleScroll);
        }
    }, [handleScroll, isVisible]);

    const points = Array.from({ length: 6 }).map((_, i) => {
        const angle = (i * 60 * Math.PI) / 180;
        return `${x + size * Math.cos(angle)},${(y + offsetY / 50) + size * Math.sin(angle)}`;
    }).join(' ');

    return (
        <polygon
            points={points}
            fill="none"
            stroke={color}
            strokeWidth="1"
            opacity={opacity}
            className={`transition-opacity duration-1000`}
            style={{
                transitionDelay: `${delay}ms`,
                transform: `translateY(${offsetY}px)`,
            }}
        />
    );
};

const MemberPopup = ({ member, onClose }: {
    member: typeof members[0];
    onClose: () => void;
}) => {
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(onClose, 300);
    };

    return createPortal(
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
            onClick={handleClose}
        >
            <div
                className="relative w-full max-w-6xl bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl h-[80vh] md:h-[65vh] overflow-y-auto animate-clip-from-top"
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 z-10"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="flex flex-col md:flex-row h-full">
                    <div className="w-full md:w-1/2 relative h-48 md:h-full">
                        <div className="relative h-full">
                            <img
                                src={member.mainImage}
                                alt={member.name}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-opacity duration-300"
                                style={{
                                    backgroundImage: `url(${member.subImage})`,
                                    opacity: 0,
                                }}
                                onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                                onMouseLeave={e => e.currentTarget.style.opacity = '0'}
                            />
                        </div>
                    </div>

                    <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between h-full overflow-y-auto">
                        <div>
                            <div className="mb-6 opacity-0 animate-text-appear" style={{ animationDelay: '0.4s' }}>
                                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                    {member.name}
                                </h3>
                                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
                                    {member.position}
                                </p>
                            </div>

                            <div className="prose dark:prose-invert max-w-none opacity-0 animate-text-appear" style={{ animationDelay: '0.6s' }}>
                                <h4 className="text-lg md:text-xl font-semibold mb-3">自己紹介</h4>
                                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-6" style={{ whiteSpace: 'pre-line' }}>
                                    {member.description || "準備中..."}
                                </p>

                                <h4 className="text-xl font-semibold mb-3">スキル</h4>
                                <div className="flex flex-wrap gap-2">
                                    {member.skills?.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {member.sns && member.sns.length > 0 && (
                            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mt-8 opacity-0 animate-text-appear" style={{ animationDelay: '0.8s' }}>
                                {member.sns.map((sns, index) => {
                                    // デフォルトのカラー
                                    const defaultColor = {
                                        base: "6, 182, 212",
                                        hover: "8, 145, 178"
                                    };

                                    const color = sns.color || defaultColor;

                                    return (
                                        <a
                                            key={index}
                                            href={sns.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center px-6 py-3 text-white font-medium rounded-lg transition-all duration-300"
                                            style={{
                                                backgroundColor: `rgb(${color.base})`,
                                                boxShadow: `0 0 15px rgba(${color.base}, 0.3), 0 0 30px rgba(${color.base}, 0.15), 0 0 45px rgba(${color.base}, 0.1)`,
                                                '--hover-color': `rgb(${color.hover})`,
                                                '--hover-shadow': `0 0 20px rgba(${color.base}, 0.4), 0 0 40px rgba(${color.base}, 0.2), 0 0 60px rgba(${color.base}, 0.15)`,
                                                filter: `brightness(1.05) contrast(1.05)`,
                                                textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
                                            }}
                                            onMouseEnter={e => {
                                                e.currentTarget.style.backgroundColor = `rgb(${color.hover})`;
                                                e.currentTarget.style.boxShadow = `0 0 20px rgba(${color.base}, 0.4), 0 0 40px rgba(${color.base}, 0.2), 0 0 60px rgba(${color.base}, 0.15)`;
                                                e.currentTarget.style.filter = `brightness(1.1) contrast(1.1)`;
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.backgroundColor = `rgb(${color.base})`;
                                                e.currentTarget.style.boxShadow = `0 0 15px rgba(${color.base}, 0.3), 0 0 30px rgba(${color.base}, 0.15), 0 0 45px rgba(${color.base}, 0.1)`;
                                                e.currentTarget.style.filter = `brightness(1.05) contrast(1.05)`;
                                            }}
                                        >
                                            <span>{sns.label}</span>
                                            <svg
                                                className="w-5 h-5 ml-2"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                style={{
                                                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
                                                }}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                                />
                                            </svg>
                                        </a>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

// ダークモード時は色を少し濃くする（彩度は維持）
const adjustColorForDarkMode = (color: string) => {
    const [r, g, b] = color.split(',').map(n => parseInt(n.trim()));

    // RGBからHSLに変換
    const toHSL = (r: number, g: number, b: number) => {
        r /= 255;
        g /= 255;
        b /= 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return [h * 360, s * 100, l * 100];
    };

    // HSLからRGBに変換
    const toRGB = (h: number, s: number, l: number) => {
        h /= 360;
        s /= 100;
        l /= 100;
        let r, g, b;

        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p: number, q: number, t: number) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return [
            Math.round(r * 255),
            Math.round(g * 255),
            Math.round(b * 255)
        ];
    };

    const [h, s, l] = toHSL(r, g, b);
    const newL = l * 0.75;
    const [newR, newG, newB] = toRGB(h, s, newL);

    return `${newR}, ${newG}, ${newB}`;
};

export function Members() {
    const [sectionRef, isVisible] = useIntersectionObserver();
    const [hoveredId, setHoveredId] = useState<number | null>(null);
    const { theme } = useOutletContext<OutletContext>();
    const isDark = theme === 'dark';
    const lines = useLines('fuchsia');
    const [selectedMember, setSelectedMember] = useState<typeof members[0] | null>(null);
    const [parallaxOffset, setParallaxOffset] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY * 0.05;
            setParallaxOffset(offset);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const parallaxTransform = {
        text: `translateY(calc(-70% + ${parallaxOffset * 1.5}px))`
    };

    const handleMemberClick = (e: React.MouseEvent, member: typeof members[0]) => {
        e.preventDefault();
        setSelectedMember(member);
    };

    return (
        <section
            id="members"
            ref={sectionRef}
            className="relative min-h-screen py-20 transition-colors duration-500 overflow-hidden"
            style={{
                backgroundColor: isDark ? 'rgb(17 24 39)' : 'rgb(249 250 251)'
            }}
        >
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <svg
                    className="w-full h-full"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="xMidYMid slice"
                >
                    {isVisible && (
                        <>
                            <Hexagon x={15} y={25} size={3} color={isDark ? '#db2777' : '#ec4899'} opacity={0.2} delay={200} parallaxSpeed={0.02} isVisible={isVisible} />
                            <Hexagon x={45} y={35} size={4} color={isDark ? '#db2777' : '#ec4899'} opacity={0.15} delay={400} parallaxSpeed={-0.03} isVisible={isVisible} />
                            <Hexagon x={75} y={20} size={2.5} color={isDark ? '#db2777' : '#ec4899'} opacity={0.25} delay={600} parallaxSpeed={0.04} isVisible={isVisible} />
                            <Hexagon x={25} y={55} size={3.5} color={isDark ? '#db2777' : '#ec4899'} opacity={0.1} delay={800} parallaxSpeed={-0.02} isVisible={isVisible} />
                            <Hexagon x={85} y={45} size={4.5} color={isDark ? '#db2777' : '#ec4899'} opacity={0.2} delay={1000} parallaxSpeed={0.03} isVisible={isVisible} />
                            <Hexagon x={35} y={65} size={3} color={isDark ? '#db2777' : '#ec4899'} opacity={0.15} delay={1200} parallaxSpeed={-0.04} isVisible={isVisible} />
                            <Hexagon x={65} y={75} size={3.5} color={isDark ? '#db2777' : '#ec4899'} opacity={0.2} delay={1400} parallaxSpeed={0.025} isVisible={isVisible} />
                            <Hexagon x={55} y={85} size={4} color={isDark ? '#db2777' : '#ec4899'} opacity={0.15} delay={1600} parallaxSpeed={-0.035} isVisible={isVisible} />
                            <Hexagon x={95} y={30} size={3} color={isDark ? '#db2777' : '#ec4899'} opacity={0.1} delay={1800} parallaxSpeed={0.045} isVisible={isVisible} />
                        </>
                    )}
                </svg>
            </div>

            {/* 縦書きの「Members」 */}
            <div
                className="absolute left-14 top-1/2 transform pointer-events-none"
                style={{ transform: parallaxTransform.text }}
            >
                <svg width="200" height="900" viewBox="0 0 200 900" preserveAspectRatio="xMidYMid meet">
                    <text
                        x="100"
                        y="450"
                        fill="none"
                        stroke={isDark ? '#ffffff' : '#000000'}
                        strokeWidth="1"
                        strokeOpacity="0.4"
                        fontSize="100"
                        fontWeight="bold"
                        textAnchor="middle"
                        transform="rotate(90, 100, 450)"
                        style={{ letterSpacing: '0.3em' }}
                    >
                        {Array.from("Members").map((letter, index) => (
                            <tspan
                                key={index}
                                className="animate-draw-path"
                                style={{
                                    animationDelay: `${index * 0.2}s`,
                                    textShadow: '0 0 10px rgba(219, 39, 119, 0.8)',
                                }}
                            >
                                {letter}
                            </tspan>
                        ))}
                    </text>
                </svg>
            </div>

            {lines.map((line, index) => (
                <svg
                    key={line.id}
                    className="absolute will-change-transform pointer-events-none"
                    style={{
                        left: `${line.left}%`,
                        top: '-20vh',
                        width: '200px',
                        height: '140vh',
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

            <div className={`container mx-auto transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}>
                <h2 className="text-6xl font-bold text-center mb-20 text-gray-700 dark:text-white relative drop-shadow-[0_0_8px_rgba(255,0,255,0.5)] dark:drop-shadow-[0_0_8px_rgba(255,0,255,0.7)]">
                    Members
                    <div className="absolute top-24 fixed-left">
                        <svg width="100vw" height="80" viewBox="0 0 1000 20" preserveAspectRatio="none" style={{ marginLeft: 'calc(-50vw + 75%)' }}>
                            <path
                                d="M0 20 L190 20 L220 0 L800 0"
                                stroke="currentColor"
                                strokeWidth="3"
                                fill="none"
                                className={`text-fuchsia-500 dark:text-fuchsia-400 ${isVisible ? 'animate-draw-line-from-left' : ''}`}
                                strokeDasharray="1000"
                            />
                        </svg>
                    </div>
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 max-w-7xl mx-auto px-4 md:px-8">
                    {members.map((member, index) => (
                        <a
                            key={member.id}
                            onClick={(e) => handleMemberClick(e, member)}
                            className={`group text-center cursor-pointer transition-all duration-500 
                                bg-gray-100 dark:bg-gray-800 rounded-xl p-4 pt-6
                                shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_15px_rgba(255,255,255,0.1)]
                                hover:shadow-[0_0_20px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]
                                relative
                                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                            style={{
                                transitionDelay: `${index * 200}ms`,
                                transitionProperty: 'opacity, transform'
                            }}
                        >
                            {/* 名札の穴部分 */}
                            <div className="absolute top-3.5 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 shadow-inner border border-fuchsia-500/50 dark:border-fuchsia-400/50" style={{ boxShadow: '0 0 5px rgba(219, 39, 119, 0.5), inset 0 2px 4px rgba(0, 0, 0, 0.2)' }}></div>

                            <div className="relative w-full aspect-square mx-auto mb-3 overflow-hidden rounded-lg mt-8">
                                <div className="w-full h-full bg-gray-200 dark:bg-gray-200 group-hover:scale-110 transition-transform duration-300">
                                    <img
                                        src={member.mainImage}
                                        alt={member.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div
                                    className="absolute bottom-0 right-0 w-full h-full overflow-hidden"
                                    style={{
                                        clipPath: hoveredId === member.id
                                            ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                                            : 'polygon(100% 70%, 100% 100%, 70% 100%)',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        WebkitTransition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        transitionProperty: 'clip-path, -webkit-clip-path',
                                    }}
                                >
                                    <div
                                        className="w-full h-full group-hover:scale-110 transition-all duration-300"
                                        style={{
                                            backgroundImage: `url(${member.subImage})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                        }}
                                        onMouseEnter={() => setHoveredId(member.id)}
                                        onMouseLeave={() => setHoveredId(null)}
                                    />
                                </div>
                            </div>
                            <h3
                                className={`text-lg font-semibold text-gray-900 dark:text-white transition-all duration-500 transform
                                    ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                                style={{
                                    transitionDelay: `${(index * 200) + 300}ms`,
                                    transitionProperty: 'opacity, transform'
                                }}
                            >
                                {member.name}
                            </h3>
                            <p
                                className={`text-sm md:text-base text-gray-600 dark:text-gray-300 w-11/12 md:w-5/6 mx-auto transition-all duration-500 transform
                                    ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                                style={{
                                    transitionDelay: `${(index * 200) + 400}ms`,
                                    transitionProperty: 'opacity, transform'
                                }}
                            >
                                {member.position}
                            </p>
                        </a>
                    ))}
                </div>
            </div>

            {selectedMember && (
                <MemberPopup
                    member={selectedMember}
                    onClose={() => setSelectedMember(null)}
                />
            )}
        </section>
    );
}