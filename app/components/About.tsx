import { useIntersectionObserver } from "~/hooks/useIntersectionObserver";

export function About() {
  const [sectionRef, isVisible] = useIntersectionObserver();

  return (
    <section ref={sectionRef} className="bg-gray-50 dark:bg-gray-900 py-40 relative overflow-hidden">
      <div className="container mx-auto relative">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-0">
          <img
            src="/images/namelogo-dark.png"
            alt="Seraf Logo"
            className={`w-auto h-[60vh] opacity-80 transition-all duration-1000 ${isVisible ? 'translate-x-0' : 'translate-x-20'
              } dark:hidden`}
          />
          <img
            src="/images/namelogo-light.png"
            alt="Seraf Logo"
            className={`w-auto h-[60vh] opacity-80 transition-all duration-1000 ${isVisible ? 'translate-x-0' : 'translate-x-20'
              } hidden dark:block`}
          />
        </div>
        <div className={`container mx-auto px-4 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
          <div className="max-w-3xl relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-16 drop-shadow-[0_0_8px_rgba(255,0,255,0.5)] dark:drop-shadow-[0_0_8px_rgba(255,0,255,0.7)]">
              About
              <div className="absolute fixed-left">
                <svg width="100vw" height="40" viewBox="0 0 1000 10" preserveAspectRatio="none" style={{ marginLeft: 'calc(-50vw + 75%)' }}>
                  <path
                    d="M0 0 L100 0 120 10 L500 10"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    className={`text-fuchsia-400 dark:text-fuchsia-500 ${isVisible ? 'animate-draw-line-from-left' : ''}`}
                    strokeDasharray="600"
                  />
                </svg>
              </div>
            </h1>
            <p className={`text-xl text-gray-600 dark:text-gray-300 mb-8 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`} style={{ transitionDelay: '0.2s' }}>
              <span className="text-3xl font-semibold">Seraf()</span>は、代表のKTNが作りたいゲームをメンバー協力のもと作り上げていくチームです。<br></br>
              メンバーそれぞれの得意分野や「好き」を活かして、様々なゲームを作り上げていきます。
            </p>
            <button className={`bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`} style={{ transitionDelay: '0.4s' }}>
              詳しく見る
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
