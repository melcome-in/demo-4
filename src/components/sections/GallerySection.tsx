import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  MapPin,
} from 'lucide-react';
import { GALLERY_PHOTOS } from '../../data/weddingData';
import { GalleryPhoto } from '../../types/wedding';

export const GallerySection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | 'destination' | 'stage' | 'couple' | 'details'
  >('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const filteredPhotos =
    selectedCategory === 'all'
      ? GALLERY_PHOTOS
      : GALLERY_PHOTOS.filter((p) => p.category === selectedCategory);

  const activePhoto: GalleryPhoto | null =
    lightboxIndex !== null ? filteredPhotos[lightboxIndex] || null : null;

  const handleNext = () => {
    if (lightboxIndex === null) return;
    setIsZoomed(false);
    setLightboxIndex((lightboxIndex + 1) % filteredPhotos.length);
  };

  const handlePrev = () => {
    if (lightboxIndex === null) return;
    setIsZoomed(false);
    setLightboxIndex(
      (lightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length
    );
  };

  return (
    <section
      id="section-gallery"
      className="relative py-28 md:py-36 px-6 md:px-14 pointer-events-auto"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#071624]/80 border border-[#dab87b]/35 text-[10px] uppercase tracking-[0.34em] text-[#dab87b] mb-4">
            <Camera className="w-3.5 h-3.5" />
            <span>Chapter VII • Cinematic Gallery</span>
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-white mb-4">
            Portraits of{' '}
            <span className="italic text-[#f2e6cd]">Villa Azurea</span>
          </h2>
          <p className="text-sm md:text-base text-white/75 mb-8">
            Explore our destination sanctuary — from the weathered Aegean blue wooden doors and white flagstone aisle to the ocean-facing floral mandap and candlelit reception tables.
          </p>

          {/* Category Filter Pills */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-full bg-[#071624]/80 border border-white/15">
            {(
              [
                { id: 'all', label: 'All Frames' },
                { id: 'destination', label: 'Blue Door & Cove' },
                { id: 'stage', label: 'The Ocean Stage' },
                { id: 'couple', label: 'Couple Portraits' },
                { id: 'details', label: 'Florals & Tables' },
              ] as const
            ).map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setLightboxIndex(null);
                }}
                className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-[0.2em] transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#2d8ec8] text-white font-medium shadow-[0_0_18px_rgba(45,142,200,0.5)]'
                    : 'text-white/70 hover:bg-white/10'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Full-Width Cinema Feature Frame */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.9 }}
          onClick={() => setLightboxIndex(0)}
          className="relative mb-8 rounded-3xl overflow-hidden border border-[#dab87b]/40 shadow-[0_25px_85px_rgba(0,0,0,0.75)] aspect-[21/9] cursor-pointer group"
        >
          <img
            src="./assets/images/aerial-drone-coast.jpg"
            alt="Villa Azurea Aerial Panorama"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06131f]/85 via-transparent to-black/25" />
          <div className="absolute top-5 left-6 px-3.5 py-1 rounded-full bg-[#06131f]/75 backdrop-blur-md border border-[#dab87b]/40 text-[10px] uppercase tracking-[0.28em] text-[#dab87b]">
            Featured 8K Aerial Cinema Frame
          </div>
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h3 className="font-serif text-2xl sm:text-4xl text-white font-light">
                The Complete Destination — From The Blue Door to the Lagoon Stage
              </h3>
              <p className="text-xs text-white/75 mt-1">
                DJI Inspire 3 Aerial Study • White Mediterranean Villa, Palm Aisle &amp; Turquoise Cove
              </p>
            </div>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11px] uppercase tracking-[0.2em] text-white shrink-0">
              <Maximize2 className="w-3.5 h-3.5 text-[#dab87b]" />
              <span>Open Lightbox</span>
            </span>
          </div>
        </motion.div>

        {/* Responsive Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredPhotos.map((photo, index) => (
            <motion.div
              key={photo.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.65 }}
              onClick={() => {
                setIsZoomed(false);
                setLightboxIndex(index);
              }}
              className="break-inside-avoid relative rounded-3xl overflow-hidden border border-white/15 hover:border-[#dab87b]/60 bg-[#071624]/70 shadow-2xl cursor-pointer group"
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
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06131f]/90 via-transparent to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                <div className="absolute top-3.5 right-3.5 p-2 rounded-full bg-[#06131f]/70 backdrop-blur-md border border-white/15 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-3.5 h-3.5 text-[#dab87b]" />
                </div>

                <div className="absolute bottom-4 left-5 right-5">
                  <div className="text-[10px] uppercase tracking-[0.24em] text-[#8cc9ea] mb-1">
                    {photo.location}
                  </div>
                  <h4 className="font-serif text-xl text-white font-light">
                    {photo.title}
                  </h4>
                  <p className="text-[11px] text-white/70 line-clamp-2 mt-1">
                    {photo.caption}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Interactive Full-Screen Lightbox with Smooth Zoom */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[95] bg-[#040c14]/95 backdrop-blur-2xl flex flex-col justify-between p-4 md:p-8"
          >
            {/* Top Bar */}
            <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-[#dab87b]">
                  {activePhoto.cameraSpec}
                </div>
                <div className="font-serif text-xl md:text-2xl text-white">
                  {activePhoto.title}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsZoomed((z) => !z)}
                  className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white"
                  title="Toggle Zoom"
                >
                  {isZoomed ? (
                    <ZoomOut className="w-4 h-4" />
                  ) : (
                    <ZoomIn className="w-4 h-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setLightboxIndex(null)}
                  className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white"
                  title="Close Lightbox"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Center Image Stage */}
            <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-2 md:left-6 z-10 p-3 rounded-full bg-[#071624]/80 hover:bg-[#1e71aa] border border-white/15 text-white transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <motion.img
                key={activePhoto.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{
                  opacity: 1,
                  scale: isZoomed ? 1.35 : 1,
                }}
                transition={{ duration: 0.45 }}
                src={activePhoto.image}
                alt={activePhoto.title}
                onClick={() => setIsZoomed((z) => !z)}
                className="max-h-[72vh] max-w-[88vw] object-contain rounded-2xl border border-white/15 shadow-[0_25px_90px_rgba(0,0,0,0.85)] cursor-zoom-in"
              />

              <button
                type="button"
                onClick={handleNext}
                className="absolute right-2 md:right-6 z-10 p-3 rounded-full bg-[#071624]/80 hover:bg-[#1e71aa] border border-white/15 text-white transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Bottom Caption Bar */}
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-1.5 text-xs text-[#8cc9ea] mb-1">
                <MapPin className="w-3.5 h-3.5 text-[#dab87b]" />
                <span>{activePhoto.location}</span>
              </div>
              <p className="text-xs md:text-sm text-white/80">
                {activePhoto.caption}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
