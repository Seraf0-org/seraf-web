import { members } from "~/data/members";
import { useIntersectionObserver } from "~/hooks/useIntersectionObserver";

export function Members() {
    const [sectionRef, isVisible] = useIntersectionObserver();

    return (
        <section ref={sectionRef} className="py-12 bg-white dark:bg-gray-800">
            <div className={`container mx-auto transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}>
                <h2 className="text-6xl font-bold text-center mb-20 text-gray-900 dark:text-white relative drop-shadow-[0_0_8px_rgba(0,0,0,0.6)] dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
                    Members
                    <div className="absolute top-24 fixed-left">
                        <svg width="100vw" height="80" viewBox="0 0 1000 20" preserveAspectRatio="none" style={{ marginLeft: 'calc(-50vw + 75%)' }}>
                            <path
                                d="M0 20 L190 20 L220 0 L550 0 L1000 0"
                                stroke="currentColor"
                                strokeWidth="3"
                                fill="none"
                                className="text-gray-900 dark:text-white"
                            />
                        </svg>
                    </div>
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto px-4 md:px-8">
                    {members.map((member, index) => (
                        <a
                            key={member.id}
                            href={member.sns}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`group text-center cursor-pointer transition-all duration-300 
                                bg-white dark:bg-gray-900 rounded-xl p-4 
                                shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_15px_rgba(255,255,255,0.1)]
                                hover:shadow-[0_0_20px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]
                                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                            style={{ transitionDelay: `${index * 0.1}s` }}
                        >
                            <div className="relative w-full aspect-square mx-auto mb-3 overflow-hidden rounded-lg">
                                <div className="w-full h-full bg-gray-200 dark:bg-gray-700 transition-transform duration-300 group-hover:scale-110">
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
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {member.name}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 w-11/12 md:w-4/5 mx-auto">
                                {member.position}
                            </p>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}