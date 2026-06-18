export const REVIEW_PANEL_ID = 'review-panel'
export const MOBILE_MAX_WIDTH_MEDIA = '(max-width: 63.9375rem)'

export function isMobileLayout(): boolean {
  return window.matchMedia(MOBILE_MAX_WIDTH_MEDIA).matches
}

export function scrollToReviewPanel(): void {
  requestAnimationFrame(() => {
    document.getElementById(REVIEW_PANEL_ID)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  })
}
