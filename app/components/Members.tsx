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
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl"
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 z-10"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-1/2 relative">
                        <div className="relative pt-[100%]">
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

                    <div className="w-full md:w-1/2 p-6 md:p-8">
                        <div className="mb-6">
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                {member.name}
                            </h3>
                            <p className="text-xl text-gray-600 dark:text-gray-300">
                                {member.position}
                            </p>
                        </div>

                        <div className="prose dark:prose-invert max-w-none">
                            <h4 className="text-xl font-semibold mb-3">自己紹介</h4>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">
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

                        {member.sns && (
                            <a
                                href={member.sns}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center mt-8 px-6 py-3 
                  bg-cyan-500 dark:bg-cyan-600 hover:bg-cyan-600 dark:hover:bg-cyan-700
                  text-white font-medium rounded-lg transition-colors duration-200
                  shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]"
                            >
                                <span>SNSを見る</span>
                                <svg
                                    className="w-5 h-5 ml-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                    />
                                </svg>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export function Members() {
    const [sectionRef, isVisible] = useIntersectionObserver();
    const [hoveredId, setHoveredId] = useState<number | null>(null);
    const { theme } = useOutletContext<OutletContext>();
    const isDark = theme === 'dark';
    const lines = useLines('fuchsia');
    const [selectedMember, setSelectedMember] = useState<typeof members[0] | null>(null);

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
                <h2 className="text-6xl font-bold text-center mb-20 text-gray-900 dark:text-white relative drop-shadow-[0_0_8px_rgba(255,0,255,0.5)] dark:drop-shadow-[0_0_8px_rgba(255,0,255,0.7)]">
                    Members
                    <div className="absolute top-24 fixed-left">
                        <svg width="100vw" height="80" viewBox="0 0 1000 20" preserveAspectRatio="none" style={{ marginLeft: 'calc(-50vw + 75%)' }}>
                            <path
                                d="M0 20 L190 20 L220 0 L800 0"
                                stroke="currentColor"
                                strokeWidth="3"
                                fill="none"
                                className={`text-fuchsia-500 dark:text-fuchsia-400 ${isVisible ? 'animate-draw-line-from-left' : ''}`}
                                strokeDasharray="800"
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
                                bg-gray-100 dark:bg-gray-800 rounded-xl p-4 
                                shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_15px_rgba(255,255,255,0.1)]
                                hover:shadow-[0_0_20px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]
                                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                            style={{
                                transitionDelay: `${index * 200}ms`,
                                transitionProperty: 'opacity, transform'
                            }}
                        >
                            <div className="relative w-full aspect-square mx-auto mb-3 overflow-hidden rounded-lg">
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
                                className={`text-gray-600 dark:text-gray-300 w-11/12 md:w-5/6 mx-auto transition-all duration-500 transform
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