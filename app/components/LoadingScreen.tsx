import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface LoadingScreenProps {
    onComplete: () => void;
    isDark: boolean;
}

export function LoadingScreen({ onComplete, isDark }: LoadingScreenProps) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Simulate loading progress - Faster for localized feel
        const timer = setInterval(() => {
            setProgress((prev) => {
                const next = prev + Math.random() * 15;
                if (next >= 100) {
                    clearInterval(timer);
                    setTimeout(onComplete, 800);
                    return 100;
                }
                return next;
            });
        }, 150);

        return () => clearInterval(timer);
    }, [onComplete]);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{
                y: "-100%",
                transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } // Custom bezier for "Curtain" feel
            }}
            className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center font-sans ${isDark ? "bg-[#050505] text-white" : "bg-[#f8fafc] text-gray-900"
                }`}
        >
            {/* Center Content Wrapper */}
            <motion.div
                initial={{ opacity: 0, filter: "blur(20px)", scale: 0.9 }}
                animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="relative z-10 flex flex-col items-center"
            >
                <h1 className="text-4xl md:text-6xl lg:text-8xl font-thin tracking-[0.2em] flex items-center gap-1">
                    {/* Bouncing Text Logic */}
                    {"NOW LOADING".split("").map((char, index) => (
                        <motion.span
                            key={index}
                            animate={{
                                y: [0, -20, 0],
                            }}
                            transition={{
                                duration: 1.2,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: index * 0.1, // Stagger effect
                            }}
                            className="inline-block"
                        >
                            {char === " " ? "\u00A0" : char}
                        </motion.span>
                    ))}
                    {/* Bouncing Dots */}
                    {[".", ".", "."].map((char, index) => (
                        <motion.span
                            key={`dot-${index}`}
                            animate={{
                                y: [0, -20, 0],
                            }}
                            transition={{
                                duration: 1.2,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: (11 + index) * 0.1, // Continue delay from "NOW LOADING" (11 chars)
                            }}
                            className="text-cyan-400 inline-block ml-1"
                        >
                            {char}
                        </motion.span>
                    ))}
                </h1>

                {/* Center Counter - Small & Minimal below text */}
                <div className="mt-4 md:mt-6">
                    <span className="font-mono text-xl md:text-2xl lg:text-3xl opacity-50 tracking-widest">
                        {Math.min(100, Math.floor(progress)).toString().padStart(3, '0')}%
                    </span>
                </div>
            </motion.div>

            {/* Subtle Progress Line at bottom */}
            <div className="fixed bottom-0 left-0 w-full h-[2px] bg-gray-200/10">
                <motion.div
                    className="h-full bg-cyan-400"
                    initial={{ width: "0%" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "linear", duration: 0.1 }}
                />
            </div>
        </motion.div>
    );
}
