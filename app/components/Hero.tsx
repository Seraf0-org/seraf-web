export function Hero() {
  const japaneseText = "何者にもなれる。何者でもないから。";
  const englishText1 = "Become anything,";
  const englishText2 = "　from being nothing.";

  const createLetterSpans = (text: string, baseDelay: number, className: string = "") => {
    return text.split('').map((letter, index) => (
      <span
        key={index}
        className={`inline-block animate-fade-in-down opacity-0 ${className}`}
        style={{ animationDelay: `${baseDelay + (index * 0.1)}s` }}
      >
        {letter}
      </span>
    ));
  };

  return (
    <section className="relative h-screen">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/images/hero-bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center">
          <h1
            className="text-4xl md:text-6xl font-bold text-white tracking-[.25em]"
            style={{ lineHeight: '2em' }}
          >
            <div className="block">
              {createLetterSpans(japaneseText, 0)}
            </div>
            <div className="text-5xl block">
              <span
                className="inline-block animate-fade-in-down opacity-0"
                style={{ animationDelay: '2s' }}
              >
                {englishText1}
              </span>
              <span
                className="inline-block animate-fade-in-down opacity-0"
                style={{ animationDelay: '2.5s' }}
              >
                {englishText2}
              </span>
            </div>
          </h1>
        </div>
      </div>
    </section>
  );
}
