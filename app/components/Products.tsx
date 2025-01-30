import { products } from "~/data/products";
import { useIntersectionObserver } from "~/hooks/useIntersectionObserver";
import { useOutletContext } from "@remix-run/react";
import type { OutletContext } from "~/root";
import { useLines } from "~/contexts/LinesContext";
import { useEffect, useState, useCallback } from "react";
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

const ProductPopup = ({ product, onClose }: {
  product: typeof products[0];
  onClose: () => void;
}) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300); // フェードアウトの時間に合わせて遅延
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "/images/products/product-none.jpg";
  };

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
      onClick={handleClose}
    >
      <div
        className="relative w-[90vw] max-w-[1600px] bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl animate-clip-from-top"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 z-10"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col md:flex-row h-[80vh] overflow-y-auto">
          <div className="w-full md:w-3/5 h-[40vh] md:h-full relative">
            <div className="absolute inset-0">
              <img
                src={product.image || "/images/products/product-none.jpg"}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            </div>
          </div>

          <div className="w-full md:w-2/5 p-6 md:p-8 flex flex-col">
            <div className="flex-grow overflow-y-auto pr-4 space-y-6">
              <div className="opacity-0 animate-text-appear" style={{ animationDelay: '0.4s' }}>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                  {product.name}
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  制作: {product.description}
                </p>
              </div>

              {product.details && (
                <div className="opacity-0 animate-text-appear" style={{ animationDelay: '0.6s' }}>
                  <h4 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">概要</h4>
                  <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                    {product.details}
                  </p>
                </div>
              )}

              {product.features && (
                <div className="opacity-0 animate-text-appear" style={{ animationDelay: '0.8s' }}>
                  <h4 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">特徴</h4>
                  <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                    {product.features}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6 opacity-0 animate-text-appear" style={{ animationDelay: '1.0s' }}>
                {product.genre && (
                  <div>
                    <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">ジャンル</h4>
                    <p className="text-lg text-gray-600 dark:text-gray-300">{product.genre}</p>
                  </div>
                )}

                {product.platform && (
                  <div>
                    <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">プラットフォーム</h4>
                    <p className="text-lg text-gray-600 dark:text-gray-300">{product.platform}</p>
                  </div>
                )}

                {product.releaseDate && (
                  <div>
                    <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">リリース日</h4>
                    <p className="text-lg text-gray-600 dark:text-gray-300">{product.releaseDate}</p>
                  </div>
                )}
              </div>
            </div>

            {(product.link || product.storeLink) && (
              <div className="flex flex-col sm:flex-row gap-4 mt-6 sticky bottom-0 bg-white dark:bg-gray-800 pt-4 opacity-0 animate-text-appear" style={{ animationDelay: '1.2s' }}>
                {product.link && (
                  <a
                    href={product.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center px-8 py-4 
                      bg-cyan-500 dark:bg-cyan-600 hover:bg-cyan-600 dark:hover:bg-cyan-700
                      text-white text-lg font-medium rounded-lg transition-colors duration-200
                      shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]"
                  >
                    <span>プレイする</span>
                    <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </a>
                )}

                {product.storeLink && (
                  <a
                    href={product.storeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center px-8 py-4 
                      bg-fuchsia-500 dark:bg-fuchsia-600 hover:bg-fuchsia-600 dark:hover:bg-fuchsia-700
                      text-white text-lg font-medium rounded-lg transition-colors duration-200
                      shadow-[0_0_15px_rgba(219,39,119,0.3)] hover:shadow-[0_0_20px_rgba(219,39,119,0.5)]"
                  >
                    <span>購入する</span>
                    <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export function Products() {
  const [sectionRef, isVisible] = useIntersectionObserver();
  const { theme } = useOutletContext<OutletContext>();
  const isDark = theme === 'dark';
  const lines = useLines('cyan');
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const [parallaxOffset, setParallaxOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY * 0.05;
      setParallaxOffset(offset);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const parallaxTransform = {
    text: `translateY(calc(-65% + ${parallaxOffset * 1.4}px))`
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "/images/products/product-none.jpg";
  };

  const handleProductClick = (product: typeof products[0]) => {
    if (product.name === "And more...") return;
    setSelectedProduct(product);
  };

  return (
    <section
      id="products"
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
              <Hexagon x={10} y={20} size={3} color={isDark ? '#0891b2' : '#06b6d4'} opacity={0.2} delay={200} parallaxSpeed={0.02} isVisible={isVisible} />
              <Hexagon x={50} y={30} size={4} color={isDark ? '#0891b2' : '#06b6d4'} opacity={0.15} delay={400} parallaxSpeed={-0.03} isVisible={isVisible} />
              <Hexagon x={80} y={15} size={2.5} color={isDark ? '#0891b2' : '#06b6d4'} opacity={0.25} delay={600} parallaxSpeed={0.04} isVisible={isVisible} />
              <Hexagon x={30} y={50} size={3.5} color={isDark ? '#0891b2' : '#06b6d4'} opacity={0.1} delay={800} parallaxSpeed={-0.02} isVisible={isVisible} />
              <Hexagon x={90} y={40} size={4.5} color={isDark ? '#0891b2' : '#06b6d4'} opacity={0.2} delay={1000} parallaxSpeed={0.03} isVisible={isVisible} />
              <Hexagon x={20} y={60} size={3} color={isDark ? '#0891b2' : '#06b6d4'} opacity={0.15} delay={1200} parallaxSpeed={-0.04} isVisible={isVisible} />
              <Hexagon x={70} y={70} size={3.5} color={isDark ? '#0891b2' : '#06b6d4'} opacity={0.2} delay={1400} parallaxSpeed={0.025} isVisible={isVisible} />
              <Hexagon x={40} y={80} size={4} color={isDark ? '#0891b2' : '#06b6d4'} opacity={0.15} delay={1600} parallaxSpeed={-0.035} isVisible={isVisible} />
              <Hexagon x={60} y={25} size={3} color={isDark ? '#0891b2' : '#06b6d4'} opacity={0.1} delay={1800} parallaxSpeed={0.045} isVisible={isVisible} />
            </>
          )}
        </svg>
      </div>

      <div
        className="absolute right-14 top-1/2 transform pointer-events-none"
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
            {Array.from("Products").map((letter, index) => (
              <tspan
                key={index}
                className="animate-draw-path"
                style={{
                  animationDelay: `${index * 0.2}s`,
                  textShadow: '0 0 10px rgba(6, 182, 212, 0.8)',
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

      <div className={`container mx-auto px-4 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
        <h1 className="text-4xl md:text-6xl font-bold text-center text-gray-900 dark:text-white mb-16 drop-shadow-[0_0_8px_rgba(0,192,192,0.5)] dark:drop-shadow-[0_0_8px_rgba(0,255,255,0.5)]">
          Products
          <div className="absolute top-24 fixed-left">
            <svg width="100vw" height="80" viewBox="0 0 1000 20" preserveAspectRatio="none" style={{ marginLeft: 'calc(-50vw + 75%)' }}>
              <path
                d="M220 0 L930 0 950 20 L1000 20"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                className={`text-cyan-400 dark:text-cyan-100 ${isVisible ? 'animate-draw-line-from-right' : ''}`}
                strokeDasharray="1000"
              />
            </svg>
          </div>
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div
              key={product.id}
              onClick={() => handleProductClick(product)}
              className={`group bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden 
                transition-all duration-500 transform cursor-pointer
                hover:shadow-[0_0_20px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{
                transitionDelay: `${index * 200}ms`,
                transitionProperty: 'opacity, transform'
              }}
            >
              <div className="relative pt-[56.25%] overflow-hidden">
                <img
                  src={product.image || "/images/products/product-none.jpg"}
                  alt={product.name}
                  onError={handleImageError}
                  className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="p-6 relative">
                <div className="absolute bottom-0 right-0 w-full h-full bg-gray-50 dark:bg-gray-900"
                  style={{
                    clipPath: 'polygon(100% 50%, 100% 100%, 87% 100%)'
                  }}
                />
                <div className="relative z-10">
                  <h3
                    className={`text-xl font-semibold mb-2 text-gray-900 dark:text-white transition-all duration-500 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                    style={{
                      transitionDelay: `${(products.length * 200) + 200}ms`,
                      transitionProperty: 'opacity, transform'
                    }}
                  >
                    {product.name}
                  </h3>
                  <p
                    className={`text-gray-600 dark:text-gray-300 transition-all duration-500 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                    style={{
                      transitionDelay: `${(products.length * 200) + 400}ms`,
                      transitionProperty: 'opacity, transform'
                    }}
                  >
                    {product.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedProduct && (
        <ProductPopup
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
}