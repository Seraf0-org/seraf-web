import { useIntersectionObserver } from "~/hooks/useIntersectionObserver";

export function News() {
  const [sectionRef, isVisible] = useIntersectionObserver();
  const newsItems = [
    {
      id: 1,
      date: "2024.08.21",
      title: "Reflectone配信！",
      description: "UnityRoomにて、Reflectoneの配信を開始しました。",
      image: "/images/news/news1.jpg"
    },
    {
      id: 2,
      date: "2024.11.23",
      title: "デジハリ学園祭2024にて展示！",
      description: "デジタルハリウッド大学の学園祭にて、ゲームの展示を行いました。",
      image: "/images/news/news2.jpg"
    },
    {
      id: 3,
      date: "2024.11.24",
      title: "Seraf()設立！",
      description: "本チームが立ち上げられ、活動を開始しました。",
      image: "/images/news/news3.jpg"
    }
  ];

  return (
    <section ref={sectionRef} className="py-10 bg-gray-800 dark:bg-gray-100 relative overflow-hidden">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 z-0">
        <img
          src="/images/news/mertis.png"
          alt="News Background"
          className="w-auto h-auto opacity-80"
        />
      </div>
      <div className={`container mx-auto px-4 relative z-10 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
        <div className="ml-auto max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold text-right text-white dark:text-cyan-300 mb-16 relative drop-shadow-[0_0_8px_rgba(255,255,255,1)] dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]">
            News
            <div className="absolute fixed-right">
              <svg width="100vw" height="45" viewBox="0 0 1000 10" preserveAspectRatio="none" style={{ marginLeft: 'calc(-50vw' }}>
                <path
                  d="M600 10 L880 10 900 0 L1000 0"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  className="text-cyan-100 dark:text-cyan-300"
                />
              </svg>
            </div>
          </h1>
          <div className="flex flex-col space-y-6">
            {[...newsItems].reverse().map((item, index) => (
              <div
                key={item.id}
                className={`bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden flex transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div className="w-1/3 relative">
                  <div className="relative pt-[75%]">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="absolute top-0 left-0 w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="w-2/3 p-6">
                  <p className="text-gray-400 dark:text-gray-500">{item.date}</p>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 