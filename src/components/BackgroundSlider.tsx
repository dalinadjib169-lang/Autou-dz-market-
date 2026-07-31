import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const IMAGES = [
  'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=2000&auto=format&fit=crop', // سيارة رياضية في الليل
  'https://images.unsplash.com/photo-1584347719602-09439617d95f?q=80&w=2000&auto=format&fit=crop', // مقام الشهيد، الجزائر
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2000&auto=format&fit=crop', // سيارة فخمة في طريق جبلي
  'https://images.unsplash.com/photo-1533681404118-2e06c7479ba9?q=80&w=2000&auto=format&fit=crop', // الصحراء الجزائرية، الهقار
  'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=2000&auto=format&fit=crop', // لامبورغيني
  'https://images.unsplash.com/photo-1627806509618-cb15199677b1?q=80&w=2000&auto=format&fit=crop', // جسور قسنطينة
  'https://images.unsplash.com/photo-1558229983-4a1795db2f4a?q=80&w=2000&auto=format&fit=crop', // سيارة قرب البحر
  'https://images.unsplash.com/photo-1563386762-b9e38d999086?q=80&w=2000&auto=format&fit=crop', // آثار وطبيعة (مثل تيمقاد/جميلة)
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2000&auto=format&fit=crop', // سيارة فخمة ليلية
  'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?q=80&w=2000&auto=format&fit=crop'  // مرسيدس
];

export function BackgroundSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Preload next image
    const preloadImage = new Image();
    preloadImage.src = IMAGES[(currentIndex + 1) % IMAGES.length];

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
    }, 10000); // 10 seconds

    return () => clearInterval(timer);
  }, [currentIndex]);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-black pointer-events-none">
      <AnimatePresence mode="popLayout">
        <motion.img
          key={currentIndex}
          src={IMAGES[currentIndex]}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1, transition: { opacity: { duration: 2 }, scale: { duration: 10, ease: "linear" } } }}
          exit={{ opacity: 0, transition: { duration: 2 } }}
          
          className="absolute inset-0 w-full h-full object-cover"
          alt="Luxury Car Background"
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-[#0a0a0a]/85 backdrop-blur-sm"></div>
    </div>
  );
}
