import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GALLERY_PHOTOS } from '../../data/weddingData';
import { GalleryPhoto } from '../../types/wedding';

export const GallerySection: React.FC = () => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const photos = GALLERY_PHOTOS.slice(0, 6);
  const activePhoto: GalleryPhoto | null =
    lightboxIndex !== null ? photos[lightboxIndex] || null : null;

  const handleNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % photos.length);
  };

  const handlePrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + photos.length) % photos.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartXRef.current;
    touchStartXRef.current = null;
    if (Math.abs(dx) > 45) {
      if (dx < 0) handleNext();
      else handlePrev();
    }
  };

  return (
    <section
      id="section-gallery"
      className="relative py-20 md:py-32 px-4 sm:px-6 md:px-14 pointer-events-auto"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto mb-10 md:mb-12"
        >
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-white mb-3">
            Wedding <span className="italic text-[#f2e6cd]">Gallery</span>
          </h2>
        </motion.div>

        <div className="columns-2 lg:columns-3 gap-3 sm:gap-5 md:gap-6 space-y-3 sm:space-y-5 md:space-y-6">
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.6 }}
              onClick={() => setLightboxIndex(index)}
              className="break-inside-avoid relative rounded-2xl md:rounded-3xl overflow-hidden border border-white/15 hover:border-[#dab87b]/60 bg-[#071624]/70 shadow-2xl cursor-pointer group active:scale-[0.98] transition-transform"
            >
              <div
                className={`relative overflow-hidden ${
                  photo.aspect === 'tall'
                    ? 'aspect-[4/5]'
                    : photo.aspect === 'wide'
                    ? 'aspect-[16/10]'
                    : 'aspect-square'
                }`}
              >
                <img
                  src={photo.image}
                  alt={photo.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-2.5 right-2.5 md:top-3.5 md:right-3.5 p-2 rounded-full bg-[#06131f]/70 backdrop-blur-md border border-white/15 text-white opacity-80 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-3.5 h-3.5 text-[#dab87b]" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="fixed inset-0 z-[95] bg-[#040c14]/95 backdrop-blur-2xl flex flex-col justify-between p-4 md:p-8 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]"
          >
            <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
              <div className="font-serif text-lg md:text-2xl text-white">
                {activePhoto.title}
              </div>
              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                aria-label="Close Lightbox"
                className="w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative flex-1 flex items-center justify-center my-4">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous Photo"
                className="absolute left-1 md:left-6 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-[#071624]/85 hover:bg-[#1e71aa] border border-white/15 text-white transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <motion.img
                key={activePhoto.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
                src={activePhoto.image}
                alt={activePhoto.title}
                className="max-h-[74dvh] max-w-[92vw] object-contain rounded-2xl border border-white/15 shadow-2xl"
              />

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next Photo"
                className="absolute right-1 md:right-6 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-[#071624]/85 hover:bg-[#1e71aa] border border-white/15 text-white transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center text-xs text-white/75 px-4">
              {activePhoto.caption}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
