import { useIntersectionObserver } from "~/hooks/useIntersectionObserver";

export function About() {
  const [sectionRef, isVisible] = useIntersectionObserver();

  return (
    <section ref={sectionRef} className="bg-gray-50 dark:bg-gray-900 py-20">
      <div className={`container mx-auto px-4 transition-all duration-1000 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-16 drop-shadow-[0_0_8px_rgba(0,0,0,0.25)] dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
            About
            <div className="absolute fixed-left">
              <svg width="100vw" height="40" viewBox="0 0 1000 10" preserveAspectRatio="none" style={{ marginLeft: 'calc(-50vw + 75%)' }}>
                <path
                  d="M0 0 L100 0 120 10 L500 10"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  className="text-gray-900 dark:text-white"
                />
              </svg>
            </div>
          </h1>
          <p className={`text-xl text-gray-600 dark:text-gray-300 mb-8 transition-all duration-1000 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`} style={{ transitionDelay: '0.2s' }}>
            <span className="text-3xl font-semibold">Seraf()</span>は、代表のKTNが作りたいゲームをメンバー協力のもと作り上げていくチームです。<br></br>
            メンバーそれぞれの得意分野や「好き」を活かして、様々なゲームを作り上げていきます。
          </p>
          <button className={`bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all duration-1000 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`} style={{ transitionDelay: '0.4s' }}>
            詳しく見る
          </button>
        </div>
      </div>
    </section>
  );
}
