import { members } from "~/data/members";
import { useIntersectionObserver } from "~/hooks/useIntersectionObserver";

export function Members() {
    const [sectionRef, isVisible] = useIntersectionObserver();

    return (
        <section ref={sectionRef} className="py-12 bg-gray-900 dark:bg-white">
            <div className={`container mx-auto transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}>
                <h2 className="text-6xl font-bold text-center mb-20 text-white dark:text-gray-900 relative drop-shadow-[0_0_8px_rgba(255,0,255,0.7)] dark:drop-shadow-[0_0_8px_rgba(255,0,255,0.5)]">
                    Members
                    <div className="absolute top-24 fixed-left">
                        <svg width="100vw" height="80" viewBox="0 0 1000 20" preserveAspectRatio="none" style={{ marginLeft: 'calc(-50vw + 75%)' }}>
                            <path
                                d="M0 20 L190 20 L220 0 L800 0"
                                stroke="currentColor"
                                strokeWidth="3"
                                fill="none"
                                className={`text-fuchsia-400 dark:text-fuchsia-500 ${isVisible ? 'animate-draw-line-from-left' : ''}`}
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
                            className={`group text-center cursor-pointer transition-all duration-300 
                                bg-gray-800 dark:bg-gray-100 rounded-xl p-4 
                                shadow-[0_0_15px_rgba(255,255,255,0.1)] dark:shadow-[0_0_15px_rgba(0,0,0,0.1)]
                                hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] dark:hover:shadow-[0_0_20px_rgba(0,0,0,0.15)]
                                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                            style={{ transitionDelay: `${index * 0.1}s` }}
                        >
                            <div className="relative w-full aspect-square mx-auto mb-3 overflow-hidden rounded-lg">
                                <div className="w-full h-full bg-gray-700 dark:bg-gray-200 transition-transform duration-300 group-hover:scale-110">
                                    <img
                                        src={member.mainImage}
                                        alt={member.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div
                                    className="absolute bottom-0 right-0 w-full h-full overflow-hidden transition-all duration-300 ease-in-out"
                                    style={{
                                        clipPath: 'polygon(100% 70%, 100% 100%, 70% 100%)',
                                    }}
                                >
                                    <div
                                        className="w-full h-full group-hover:scale-110 transition-all duration-300 ease-in-out group-hover:clip-path-full"
                                        style={{
                                            backgroundImage: `url(${member.subImage})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                        }}
                                    />
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold text-white dark:text-gray-900">
                                {member.name}
                            </h3>
                            <p className="text-gray-300 dark:text-gray-600 w-11/12 md:w-5/6 mx-auto">
                                {member.position}
                            </p>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}