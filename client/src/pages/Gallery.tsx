import { useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

// Import all images
import ext1 from "@assets/exterior-1.jpg";
import ext2 from "@assets/exterior-2.jpg";
import ext3 from "@assets/exterior-3.jpg";
import ext4 from "@assets/exterior-4.jpg";
import ext5 from "@assets/exterior-5.jpg";
import g01 from "@assets/gallery-01.jpg";
import g02 from "@assets/gallery-02.jpg";
import g03 from "@assets/gallery-03.jpg";
import g04 from "@assets/gallery-04.jpg";
import g05 from "@assets/gallery-05.jpg";
import g06 from "@assets/gallery-06.jpg";
import g07 from "@assets/gallery-07.jpg";
import g08 from "@assets/gallery-08.jpg";
import g09 from "@assets/gallery-09.jpg";
import g10 from "@assets/gallery-10.jpg";
import g11 from "@assets/gallery-11.jpg";
import g12 from "@assets/gallery-12.jpg";
import g13 from "@assets/gallery-13.jpg";
import g14 from "@assets/gallery-14.jpg";
import g15 from "@assets/gallery-15.jpg";
import g16 from "@assets/gallery-16.jpg";
import g17 from "@assets/gallery-17.jpg";
import g18 from "@assets/gallery-18.jpg";
import g19 from "@assets/gallery-19.jpg";
import g20 from "@assets/gallery-20.jpg";
import g21 from "@assets/gallery-21.jpg";
import g22 from "@assets/gallery-22.jpg";
import g23 from "@assets/gallery-23.jpg";
import g24 from "@assets/gallery-24.jpg";
import g25 from "@assets/gallery-25.jpg";

const images = [
  { src: ext1, label: "Exterior 1" },
  { src: ext2, label: "Exterior 2" },
  { src: ext3, label: "Exterior 3" },
  { src: ext4, label: "Exterior 4" },
  { src: ext5, label: "Exterior 5" },
  { src: g01, label: "Gallery 1" },
  { src: g02, label: "Gallery 2" },
  { src: g03, label: "Gallery 3" },
  { src: g04, label: "Gallery 4" },
  { src: g05, label: "Gallery 5" },
  { src: g06, label: "Gallery 6" },
  { src: g07, label: "Gallery 7" },
  { src: g08, label: "Gallery 8" },
  { src: g09, label: "Gallery 9" },
  { src: g10, label: "Gallery 10" },
  { src: g11, label: "Gallery 11" },
  { src: g12, label: "Gallery 12" },
  { src: g13, label: "Gallery 13" },
  { src: g14, label: "Gallery 14" },
  { src: g15, label: "Gallery 15" },
  { src: g16, label: "Gallery 16" },
  { src: g17, label: "Gallery 17" },
  { src: g18, label: "Gallery 18" },
  { src: g19, label: "Gallery 19" },
  { src: g20, label: "Gallery 20" },
  { src: g21, label: "Gallery 21" },
  { src: g22, label: "Gallery 22" },
  { src: g23, label: "Gallery 23" },
  { src: g24, label: "Gallery 24" },
  { src: g25, label: "Gallery 25" },
];

export default function Gallery() {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const openLightbox = (idx: number) => setLightboxIdx(idx);
  const closeLightbox = () => setLightboxIdx(null);

  const goNext = useCallback(() => {
    if (lightboxIdx === null) return;
    setLightboxIdx((lightboxIdx + 1) % images.length);
  }, [lightboxIdx]);

  const goPrev = useCallback(() => {
    if (lightboxIdx === null) return;
    setLightboxIdx((lightboxIdx - 1 + images.length) % images.length);
  }, [lightboxIdx]);

  useEffect(() => {
    if (lightboxIdx === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIdx, goNext, goPrev]);

  useEffect(() => {
    if (lightboxIdx !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [lightboxIdx]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-foreground mb-2" data-testid="text-gallery-title">Photo Gallery</h1>
      <p className="text-sm text-muted-foreground mb-8">
        30 photos of S/V Colleen — exterior views and interior details.
      </p>

      <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3" data-testid="gallery-grid">
        {images.map((img, idx) => (
          <div
            key={idx}
            className="break-inside-avoid cursor-pointer group overflow-hidden rounded-lg border border-card-border"
            onClick={() => openLightbox(idx)}
            data-testid={`gallery-image-${idx}`}
          >
            <img
              src={img.src}
              alt={img.label}
              className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
          data-testid="lightbox-overlay"
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            data-testid="button-lightbox-close"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            data-testid="button-lightbox-prev"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="max-w-[90vw] max-h-[85vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={images[lightboxIdx].src}
              alt={images[lightboxIdx].label}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
              data-testid="img-lightbox-current"
            />
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            data-testid="button-lightbox-next"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm font-medium">
            {lightboxIdx + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
}