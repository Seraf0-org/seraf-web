import { useState, useCallback, useEffect, useRef, useLayoutEffect } from "react";
import { members } from "~/data/members";
import { useIntersectionObserver } from "~/hooks/useIntersectionObserver";
import { useOutletContext } from "@remix-run/react";
import type { OutletContext } from "~/root";
import { useLines } from "~/contexts/LinesContext";
import { createPortal } from 'react-dom';
import { animate, stagger } from "motion";
import { AnimatePresence, motion } from "framer-motion";

import { works } from "~/data/works";

const MemberPopup = ({ member, onClose }: {
    member: typeof members[0];
    onClose: () => void;
}) => {

    const portfolioAchevements = works
        .filter(work => work.memberIds?.includes(member.id))
        .map(work => ({
            ...work,
            image: work.image || "/images/products/product-none.jpg",
            period: work.period
        }));

    const privateAchievements = member.achievements?.map(a => ({
        ...a,
        summary: a.summary || "",
        contribution: a.contribution || "",
        tech: a.tech || [],
        tag: "",
        period: ""
    })) || [];

    const allAchievements = [...portfolioAchevements, ...privateAchievements].sort((a, b) => {
        if (a.period && !b.period) return -1;
        if (!a.period && b.period) return 1;
        if (!a.period && !b.period) return 0;
        return b.period!.localeCompare(a.period!);
    });

    const [isClosing, setIsClosing] = useState(false);
    const [selectedWork, setSelectedWork] = useState<typeof allAchievements[0] | null>(null);
    const [direction, setDirection] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const listRef = useRef<HTMLDivElement>(null);
    const scrollPosRef = useRef({ mobile: 0, desktop: 0 });

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        (animate as any)(
            ".popup-overlay",
            { opacity: [0, 1] },
            { duration: 0.2, easing: [0.25, 0.46, 0.45, 0.94] }
        );

        (animate as any)(
            ".popup-content",
            { opacity: [0, 1], scale: [0.95, 1], y: [100, 0] },
            { duration: 0.4, delay: 0, easing: [0.25, 0.46, 0.45, 0.94] }
        );

        (animate as any)(
            ".popup-left-content",
            { opacity: [0, 1], x: [-30, 0] },
            { duration: 0.5, delay: 0.1, easing: [0.25, 0.46, 0.45, 0.94] }
        );

        (animate as any)(
            ".popup-right-content",
            { opacity: [0, 1], x: [30, 0] },
            { duration: 0.5, delay: 0.15, easing: [0.25, 0.46, 0.45, 0.94] }
        );

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handleClose = () => {
        setIsClosing(true);

        (animate as any)(
            ".popup-content",
            { opacity: [1, 0] },
            { duration: 0.4, easing: [0.25, 0.46, 0.45, 0.94] }
        );

        (animate as any)(
            ".popup-overlay",
            { opacity: [1, 0] },
            { duration: 0.3, delay: 0.2, easing: [0.25, 0.46, 0.45, 0.94] }
        );

        setTimeout(onClose, 550);
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction === 0 ? 0 : (direction > 0 ? "100%" : "-100%"),
            opacity: direction === 0 ? 1 : 0,
            zIndex: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            position: "relative" as const
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? "100%" : "-100%",
            opacity: 0,
            position: "absolute" as const
        })
    };

    const handleSelectWork = (work: typeof allAchievements[0]) => {
        if (window.innerWidth < 768) {
            if (containerRef.current) {
                scrollPosRef.current.mobile = containerRef.current.scrollTop;
                containerRef.current.scrollTop = 0;
            }
        } else {
            if (listRef.current) {
                scrollPosRef.current.desktop = listRef.current.scrollTop;
            }
        }
        setDirection(1);
        setSelectedWork(work);
    };

    const handleBackToList = () => {
        setDirection(-1);
        setSelectedWork(null);
    };

    useLayoutEffect(() => {
        if (!selectedWork) {
            setTimeout(() => {
                if (window.innerWidth < 768) {
                    if (containerRef.current) {
                        containerRef.current.scrollTop = scrollPosRef.current.mobile;
                    }
                } else {
                    if (listRef.current) {
                        listRef.current.scrollTop = scrollPosRef.current.desktop;
                    }
                }
            }, 0);
        }
    }, [selectedWork]);

    const gridContainerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.1
            }
        }
    };

    const gridItemVariants = {
        hidden: {
            clipPath: "inset(0 100% 0 0)",
            opacity: 0
        },
        visible: {
            clipPath: "inset(0 0% 0 0)",
            opacity: 1,
            transition: {
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94] as const
            }
        }
    };

    return createPortal(
        <div
            className={`popup-overlay fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
            onClick={handleClose}
        >
            <div
                className="popup-content relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl overflow-hidden shadow-xl
                    w-[90vw] h-[90vh]
                    md:w-[min(90vw,calc(90vh*16/9))] md:h-[min(90vh,calc(90vw*9/16))]
                    md:max-w-[1800px] md:max-h-[1012px]"
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={handleClose}
                    className="popup-close absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 z-10 bg-white/50 dark:bg-black/50 rounded-full p-1"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div
                    ref={containerRef}
                    className="flex flex-col md:flex-row h-full overflow-y-auto md:overflow-hidden overflow-x-hidden overscroll-contain"
                >
                    {/* 左側: プロフィール情報 */}
                    <div className={`popup-left-content w-full md:w-2/5 p-6 md:p-10 shrink-0 h-auto md:h-full md:overflow-y-auto border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 opacity-0 bg-gray-50/50 dark:bg-gray-800/50 overscroll-contain ${selectedWork ? 'hidden md:block' : ''}`}>
                        <div className="flex flex-col items-center md:items-start space-y-6">
                            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden shadow-lg border-4 border-white dark:border-gray-700">
                                <img
                                    src={member.mainImage}
                                    alt={member.name}
                                    className="w-full h-full object-cover"
                                />
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-opacity duration-300 opacity-0 hover:opacity-100 cursor-pointer"
                                    style={{ backgroundImage: `url(${member.subImage})` }}
                                />
                            </div>

                            <div className="text-center md:text-left w-full">
                                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                                    {member.name}
                                </h3>
                                <p className="text-base md:text-lg text-fuchsia-600 dark:text-fuchsia-400 font-medium mb-6">
                                    {member.position}
                                </p>

                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">ABOUT</h4>
                                        <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                                            {member.description || "準備中..."}
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">SKILLS</h4>
                                        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                            {member.skills?.map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full text-sm text-gray-700 dark:text-gray-300"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">SOCIAL</h4>
                                        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                            {member.sns.map((sns, index) => {
                                                const defaultColor = { base: "6, 182, 212", hover: "8, 145, 178" };
                                                const color = sns.color || defaultColor;

                                                const getSnsDisplay = (url: string, label: string) => {
                                                    const iconClass = "w-5 h-5";
                                                    const lowerUrl = url.toLowerCase();
                                                    const lowerLabel = label.toLowerCase();

                                                    const isX = lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com') || lowerLabel.includes('twitter') || lowerLabel.includes('x(');
                                                    const isGithub = lowerUrl.includes('github.com') || lowerLabel.includes('github');

                                                    if (isX || isGithub) {
                                                        let icon;
                                                        if (isX) {
                                                            icon = (
                                                                <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
                                                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                                                </svg>
                                                            );
                                                        } else {
                                                            icon = (
                                                                <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
                                                                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                                                                </svg>
                                                            );
                                                        }

                                                        return (
                                                            <a
                                                                key={index}
                                                                href={sns.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center justify-center w-10 h-10 rounded-full text-white transition-transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
                                                                style={{ backgroundColor: `rgb(${color.base})` }}
                                                                title={sns.label}
                                                            >
                                                                {icon}
                                                            </a>
                                                        );
                                                    }

                                                    return (
                                                        <a
                                                            key={index}
                                                            href={sns.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-transform hover:-translate-y-0.5 shadow-sm"
                                                            style={{ backgroundColor: `rgb(${color.base})` }}
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                            </svg>
                                                            <span>{sns.label}</span>
                                                        </a>
                                                    );
                                                };

                                                return getSnsDisplay(sns.url, sns.label);
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="popup-right-content w-full md:w-3/5 p-6 md:p-10 bg-gray-100 dark:bg-gray-900 opacity-0 relative overflow-hidden shrink-0 h-auto md:h-full">
                        <AnimatePresence custom={direction} mode="popLayout">
                            {selectedWork ? (
                                <motion.div
                                    key="detail"
                                    custom={direction}
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{
                                        x: { type: "spring", stiffness: 300, damping: 30 },
                                        opacity: { duration: 0.2 }
                                    }}
                                    className="h-auto md:h-full md:overflow-y-auto pr-2 overscroll-contain"
                                >
                                    <div className="space-y-6 pb-10">
                                        <div className="sticky top-0 z-10 py-2 mb-4">
                                            <button
                                                onClick={handleBackToList}
                                                className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors bg-gray-100/80 dark:bg-gray-900/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm"
                                            >
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                </svg>
                                                一覧に戻る
                                            </button>
                                        </div>

                                        <div className="aspect-video w-full rounded-xl overflow-hidden shadow-md bg-gray-200 dark:bg-gray-800">
                                            <img
                                                src={selectedWork.image}
                                                alt={selectedWork.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        <div>
                                            <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                                {selectedWork.title}
                                            </h4>
                                            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                                {selectedWork.period && (
                                                    <span className="bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded">
                                                        {selectedWork.period}
                                                    </span>
                                                )}
                                                {selectedWork.tag && (
                                                    <span className="text-fuchsia-500 font-medium">
                                                        #{selectedWork.tag}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {selectedWork.summary && (
                                            <div>
                                                <h5 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">概要</h5>
                                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                                    {selectedWork.summary}
                                                </p>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {selectedWork.contribution && (
                                                <div>
                                                    <h5 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">担当</h5>
                                                    <p className="text-gray-700 dark:text-gray-300">
                                                        {selectedWork.contribution}
                                                    </p>
                                                </div>
                                            )}
                                            {selectedWork.tech && selectedWork.tech.length > 0 && (
                                                <div>
                                                    <h5 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">使用技術</h5>
                                                    <div className="flex flex-wrap gap-2">
                                                        {selectedWork.tech.map((t: string) => (
                                                            <span key={t} className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs text-gray-700 dark:text-gray-300">
                                                                {t}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* リンク */}
                                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                            {selectedWork.link ? (
                                                <a
                                                    href={selectedWork.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center px-6 py-3 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold rounded-lg transition-colors shadow-lg hover:shadow-xl"
                                                >
                                                    作品を見る / 詳しく見る
                                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                    </svg>
                                                </a>
                                            ) : (
                                                <button
                                                    disabled
                                                    className="inline-flex items-center px-6 py-3 bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-bold rounded-lg cursor-not-allowed"
                                                >
                                                    準備中...
                                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="list"
                                    custom={direction}
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{
                                        x: { type: "spring", stiffness: 300, damping: 30 },
                                        opacity: { duration: 0.2 }
                                    }}
                                    ref={listRef}
                                    className="h-auto md:h-full md:overflow-y-auto pr-2 overscroll-contain"
                                >
                                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6 border-l-4 border-fuchsia-500 pl-3">
                                        制作実績
                                    </h4>

                                    {allAchievements.length > 0 ? (
                                        <motion.div
                                            className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-10"
                                            variants={gridContainerVariants}
                                            initial="hidden"
                                            animate="visible"
                                        >
                                            {allAchievements.map((item, index) => (
                                                <motion.button
                                                    key={index}
                                                    variants={gridItemVariants}
                                                    onClick={() => handleSelectWork(item)}
                                                    className="group relative aspect-video rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-300 text-left w-full"
                                                >
                                                    <img
                                                        src={item.image}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                                        <div>
                                                            <h5 className="text-white font-bold text-sm md:text-base line-clamp-2">
                                                                {item.title}
                                                            </h5>
                                                            <span className="text-xs text-gray-300 mt-1 inline-flex items-center">
                                                                Quick View
                                                                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </motion.button>
                                            ))}
                                        </motion.div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-64 text-gray-400 dark:text-gray-600">
                                            <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <p>制作実績はまだありません</p>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div >
        </div >,
        document.body
    );
};

const adjustColorForDarkMode = (color: string) => {
    const [r, g, b] = color.split(',').map(n => parseInt(n.trim()));

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
    const [sectionRef, isVisible] = useIntersectionObserver({
        threshold: 0,
        rootMargin: "-20% 0px -30% 0px"
    });
    const [hoveredId, setHoveredId] = useState<number | null>(null);
    const { theme } = useOutletContext<OutletContext>();
    const isDark = theme === 'dark';
    const lines = useLines('fuchsia');
    const [selectedMember, setSelectedMember] = useState<typeof members[0] | null>(null);
    const [parallaxOffset, setParallaxOffset] = useState(0);
    const [outlineHoverId, setOutlineHoverId] = useState<number | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY * 0.05;
            setParallaxOffset(offset);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (isVisible) {
            (animate as any)(
                ".members-title",
                { opacity: [0, 1], y: [30, 0] },
                { duration: 1, easing: [0.25, 0.46, 0.45, 0.94] }
            );

            (animate as any)(
                ".member-card",
                { opacity: [0, 1], y: [60, 0], scale: [0.8, 1] },
                {
                    delay: stagger(0.2),
                    duration: 1,
                    easing: [0.25, 0.46, 0.45, 0.94]
                }
            );

            (animate as any)(
                ".member-info",
                { opacity: [0, 1], y: [30, 0] },
                {
                    delay: stagger(0.15, { startDelay: 1 }),
                    duration: 0.8,
                    easing: [0.25, 0.46, 0.45, 0.94]
                }
            );

            (animate as any)(
                ".decorative-line",
                { strokeDashoffset: [1000, 0] },
                { duration: 1.5, delay: 0.5, easing: [0.25, 0.46, 0.45, 0.94] }
            );
        } else {
            (animate as any)(".members-title", { opacity: 0, y: 30 }, { duration: 0.5 });
            (animate as any)(".member-card", { opacity: 0, y: 60, scale: 0.8 }, { duration: 0.5 });
            (animate as any)(".member-info", { opacity: 0, y: 30 }, { duration: 0.5 });
            (animate as any)(".decorative-line", { strokeDashoffset: 1000 }, { duration: 0.5 });
        }
    }, [isVisible]);

    useEffect(() => {
        const memberCards = document.querySelectorAll('.member-card');

        memberCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                (animate as any)(
                    card,
                    {
                        y: [0, -15],
                        scale: [1, 1.05],
                        boxShadow: ['0 10px 25px rgba(0,0,0,0.1)', '0 25px 50px rgba(0,0,0,0.25)']
                    },
                    { duration: 0.4, easing: [0.25, 0.46, 0.45, 0.94] }
                );
            });

            card.addEventListener('mouseleave', () => {
                (animate as any)(
                    card,
                    {
                        y: [-15, 0],
                        scale: [1.05, 1],
                        boxShadow: ['0 25px 50px rgba(0,0,0,0.25)', '0 10px 25px rgba(0,0,0,0.1)']
                    },
                    { duration: 0.4, easing: [0.25, 0.46, 0.45, 0.94] }
                );
            });
        });
    }, [isVisible]);

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
            style={{}}
        >

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
                        d={`M ${line.points.map((p: any) => `${p.x},${p.y}`).join(' L ')}`}
                        stroke={line.color}
                        strokeWidth={line.width}
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {line.branches.map((branch: any, i: number) => (
                        <path
                            key={`${line.id}-${i}`}
                            d={`M ${branch.points.map((p: any) => `${p.x},${p.y}`).join(' L ')}`}
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
                <h2 className="members-title text-6xl font-bold text-center mb-20 text-gray-700 dark:text-white relative drop-shadow-[0_0_8px_rgba(255,0,255,0.5)] dark:drop-shadow-[0_0_8px_rgba(255,0,255,0.7)] opacity-0">
                    Members
                    <div className="absolute top-24 fixed-left">
                        <svg width="100vw" height="80" viewBox="0 0 1000 20" preserveAspectRatio="none" style={{ marginLeft: 'calc(-50vw + 75%)' }}>
                            <path
                                d="M0 20 L190 20 L220 0 L800 0"
                                stroke="currentColor"
                                strokeWidth="3"
                                fill="none"
                                className="decorative-line text-fuchsia-500 dark:text-fuchsia-400 origin-left"
                                strokeDasharray="1000"
                                strokeDashoffset="1000"
                            />
                        </svg>
                    </div>
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-12 max-w-7xl mx-auto px-4 md:px-8">
                    {members.map((member, index) => (
                        <a
                            key={member.id}
                            onClick={(e) => handleMemberClick(e, member)}
                            className="member-card group text-center cursor-pointer 
                                bg-gray-100 dark:bg-gray-800 rounded-xl p-4 pt-10 
                                shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_15px_rgba(255,255,255,0.1)]
                                hover:shadow-[0_0_20px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]
                                relative opacity-0"
                            onMouseEnter={() => setOutlineHoverId(member.id)}
                            onMouseLeave={() => setOutlineHoverId(null)}
                        >
                            {/* 名札の穴部分 */}
                            <div className="absolute top-4 md:top-4 left-1/2 transform -translate-x-1/2 w-4 h-4 md:w-6 md:h-6 rounded-full bg-gray-300 dark:bg-gray-600 shadow-inner border border-fuchsia-500/50 dark:border-fuchsia-400/50" style={{ boxShadow: '0 0 5px rgba(219, 39, 119, 0.5), inset 0 2px 4px rgba(0, 0, 0, 0.2)' }}></div>

                            <div className="relative w-full aspect-square mx-auto mb-3 overflow-hidden rounded-lg mt-2 md:mt-6">
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
                                className="member-info text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-1 opacity-0"
                            >
                                {member.name}
                            </h3>
                            <p
                                className="member-info text-xs md:text-base text-gray-600 dark:text-gray-300 w-12/13 md:w-11/12 mx-auto opacity-0"
                            >
                                {member.position.length > 20 ? `${member.position.slice(0, 17)}...` : member.position}
                            </p>
                            {/* SVGアウトラインアニメーション */}
                            <div className="absolute inset-0 pointer-events-none">
                                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="block">
                                    <rect
                                        x="1" y="1" width="98" height="98" rx="10" ry="10"
                                        fill="none"
                                        stroke="#ec4899"
                                        strokeWidth="1"
                                        strokeLinejoin="round"
                                        strokeLinecap="round"
                                        strokeDasharray="400"
                                        strokeDashoffset={outlineHoverId === member.id ? 0 : 400}
                                        style={{
                                            transition: 'stroke-dashoffset 1.2s'
                                        }}
                                    />
                                </svg>
                            </div>
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