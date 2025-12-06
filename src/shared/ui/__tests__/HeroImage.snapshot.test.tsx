/** @vitest-environment jsdom */
import { describe, it, expect } from 'vitest'
import React from 'react'
import { render } from '@testing-library/react'
import HeroImage from '../HeroImage'

describe('HeroImage', () => {
  it('renders picture with sources and lazy image', () => {
    const { container } = render(
      <HeroImage
        alt="Hero"
        sources={{ mobile: { src: '/assets/hero/hero-mobile.webp' }, desktop: { src: '/assets/hero/hero-desktop.webp' }, fallback: { src: '/assets/hero/hero.jpg' } }}
        placeholder="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTAwJScgaGVpZ2h0PSc1MCUnIGZpbGw9JyNkZGQnIC8+"
      />
    )
    expect(container.querySelector('picture')).toBeTruthy()
    expect(container.querySelector('img')?.getAttribute('loading')).toBe('lazy')
  })
})
