export const motion = {
  durations: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms'
  },
  easings: {
    standard: 'cubic-bezier(0.2, 0.0, 0.0, 1)',
    emphasized: 'cubic-bezier(0.2, 0.0, 0, 1)',
    subtle: 'cubic-bezier(0.4, 0.0, 0.2, 1)'
  }
}
export type Motion = typeof motion
