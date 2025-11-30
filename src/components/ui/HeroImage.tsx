import React from 'react'

type Source = { src: string; type?: string }

type Props = {
  alt: string
  placeholder?: string
  sources: { mobile: Source; desktop: Source; fallback?: Source }
  sizes?: string
  className?: string
}

export default function HeroImage({ alt, placeholder, sources, sizes = '(max-width: 768px) 100vw, 1200px', className }: Props) {
  const [loaded, setLoaded] = React.useState(false)
  return (
    <picture>
      <source srcSet={sources.mobile.src} media="(max-width: 768px)" type={sources.mobile.type || 'image/webp'} />
      <source srcSet={sources.desktop.src} media="(min-width: 769px)" type={sources.desktop.type || 'image/webp'} />
      <img
        alt={alt}
        loading="lazy"
        sizes={sizes}
        src={sources.fallback?.src || sources.desktop.src}
        className={className || 'w-full h-auto object-cover rounded-md border border-border'}
        style={placeholder && !loaded ? { backgroundImage: `url(${placeholder})`, backgroundSize: 'cover', filter: 'blur(8px)' } : undefined}
        onLoad={() => setLoaded(true)}
      />
    </picture>
  )
}
