import { X, ZoomIn } from 'lucide-react'
import { useEffect, useState } from 'react'

interface ImagePopupProps {
  src: string
  alt: string
  open: boolean
  onClose: () => void
}

export function ImagePopup({ src, alt, open, onClose }: ImagePopupProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="image-popup-overlay" onClick={onClose}>
      <button className="image-popup-close" onClick={onClose} aria-label="Close">
        <X data-icon="inline-end" />
      </button>
      <div className="image-popup-inner" onClick={(e) => e.stopPropagation()}>
        <img src={src} alt={alt} />
      </div>
    </div>
  )
}

interface ZoomableImageProps {
  src: string
  alt: string
}

export function ZoomableImage({ src, alt }: ZoomableImageProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="zoomable-image" onClick={() => setOpen(true)}>
        <img src={src} alt={alt} />
        <div className="zoom-badge">
          <ZoomIn data-icon="inline-end" /> Click to zoom
        </div>
      </div>
      <ImagePopup src={src} alt={alt} open={open} onClose={() => setOpen(false)} />
    </>
  )
}