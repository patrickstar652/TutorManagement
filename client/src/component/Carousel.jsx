import { useEffect, useRef, useState } from 'react';

function Carousel() {
  const slides = [
    '/教室展示1.jpg',  
    '/教室展示2.jpg',
  ];

  const [index, setIndex] = useState(0);
  const slidesLenRef = useRef(slides.length);
  const autoRef = useRef(null);

  useEffect(() => {
    autoRef.current = next;
  });

  useEffect(() => {
    const play = () => autoRef.current();
    const id = setInterval(play, 4000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + slidesLenRef.current) % slidesLenRef.current);
      if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % slidesLenRef.current);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setIndex((i) => (i + 1) % slides.length);

  return (
    <div className="relative w-full h-96 mx-auto my-8 overflow-hidden rounded-xl shadow-lg">
      {slides.map((src, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${i === index ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          style={{
            backgroundImage: `url('${src}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      ))}

      <div className="absolute inset-0 bg-black/20" />

      {/* <div className="relative z-20 h-full flex items-center justify-center">
        <div className="text-center px-6 text-white">
          <h3 className="text-2xl md:text-3xl font-bold mb-2">圖片輪播展示</h3>
          <p className="text-sm md:text-base">使用左右鍵或按鈕切換圖片</p>
        </div>
      </div> */}

      {/* controls */}
      <button 
        onClick={prev} 
        aria-label="上一張圖片" 
        className="absolute left-4 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white/30 hover:bg-white/60 p-2 transition-all"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button 
        onClick={next} 
        aria-label="下一張圖片" 
        className="absolute right-4 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white/30 hover:bg-white/60 p-2 transition-all"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {slides.map((_, i) => (
          <button 
            key={i} 
            onClick={() => setIndex(i)} 
            className={`h-2 rounded-full transition-all ${i === index ? 'w-6 bg-white' : 'w-2 bg-white/60'}`} 
            aria-label={`切換到第 ${i+1} 張圖片`} 
          />
        ))}
      </div>
    </div>
  );
}

export default Carousel;