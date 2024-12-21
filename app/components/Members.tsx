import { useState } from "react";
import { members } from "~/data/members";
import { useIntersectionObserver } from "~/hooks/useIntersectionObserver";
import { useOutletContext } from "@remix-run/react";
import type { OutletContext } from "~/root";
import { useLines } from "~/contexts/LinesContext";

export function Members() {
    const [sectionRef, isVisible] = useIntersectionObserver();
    const [hoveredId, setHoveredId] = useState<number | null>(null);
    const { theme } = useOutletContext<OutletContext>();
    const isDark = theme === 'dark';
    const lines = useLines('fuchsia');

    return (
        <section
            id="members"
            ref={sectionRef}
            className="relative min-h-screen py-20 transition-colors duration-500 overflow-hidden"
            style={{
                backgroundColor: isDark ? 'rgb(17 24 39)' : 'rgb(249 250 251)'
            }}
        >
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
                            href={member.sns}
                            target="_blank"
                            rel="noopener noreferrer"
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
                                <div className="w-full h-full bg-gray-200 dark:bg-gray-700 group-hover:scale-110 transition-transform duration-300">
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
        </section>
    );
}