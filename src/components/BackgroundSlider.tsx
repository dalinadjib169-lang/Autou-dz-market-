import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const IMAGES = [
  'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=2000&auto=format&fit=crop', // سيارة رياضية أودي
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2000&auto=format&fit=crop', // سيارة بورش في طريق جبلي
  'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=2000&auto=format&fit=crop', // لامبورغيني صفراء
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2000&auto=format&fit=crop', // سيارة فخمة ليلية
  'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=2000&auto=format&fit=crop', // سيارة بي أم دبليو رياضية
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2000&auto=format&fit=crop', // سيارة رياضية كورفيت
  'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=2000&auto=format&fit=crop', // سيارة مرسيدس AMG
  'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=2000&auto=format&fit=crop', // سيارة فخمة أنيقة
  'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=2000&auto=format&fit=crop', // سيارة لامبورغيني حمراء
  'https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=2000&auto=format&fit=crop'  // سيارة رياضية عصرية
];

export function BackgroundSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Preload next image
    const preloadImage = new Image();
    preloadImage.src = IMAGES[(currentIndex + 1) % IMAGES.length];

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
    }, 5000); // 5 seconds

    return () => clearInterval(timer);
  }, [currentIndex]);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-black pointer-events-none">
      <AnimatePresence mode="popLayout">
        <motion.img
          key={currentIndex}
          src={IMAGES[currentIndex]}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1, transition: { opacity: { duration: 1 }, scale: { duration: 5, ease: "linear" } } }}
          exit={{ opacity: 0, transition: { duration: 1 } }}
          
          className="absolute inset-0 w-full h-full object-cover"
          alt="Luxury Car Background"
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-[#0a0a0a]/85 backdrop-blur-sm"></div>
    </div>
  );
}
