"use client"

import { useEffect, type RefObject } from 'react'

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

export function useFocusTrap<T extends HTMLElement>(
  ref: RefObject<T>,
  isActive: boolean
): void {
  useEffect(() => {
    if (!isActive || !ref.current) return

    const element = ref.current
    const previouslyFocused = document.activeElement as HTMLElement | null

    const focusableElements = element.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
    const firstFocusable = focusableElements[0]
    const lastFocusable = focusableElements[focusableElements.length - 1]

    if (firstFocusable) {
      firstFocusable.focus()
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault()
          lastFocusable?.focus()
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault()
          firstFocusable?.focus()
        }
      }
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        element.dispatchEvent(new CustomEvent('focus-trap-escape'))
      }
    }

    element.addEventListener('keydown', handleKeyDown)
    element.addEventListener('keydown', handleEscape)

    return () => {
      element.removeEventListener('keydown', handleKeyDown)
      element.removeEventListener('keydown', handleEscape)
      previouslyFocused?.focus()
    }
  }, [ref, isActive])
}
