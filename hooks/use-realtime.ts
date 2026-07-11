"use client"

import { useEffect, useState, useCallback } from 'react'

interface SSEEvent {
  event: string
  data: unknown
  timestamp: number
}

interface UseRealtimeOptions {
  onEvent?: (event: SSEEvent) => void
  onError?: (error: Event) => void
}

export function useRealtime(options?: UseRealtimeOptions) {
  const [isConnected, setIsConnected] = useState(false)
  const [lastEvent, setLastEvent] = useState<SSEEvent | null>(null)
  const [eventSource, setEventSource] = useState<EventSource | null>(null)

  useEffect(() => {
    const token = typeof window !== 'undefined'
      ? localStorage.getItem('auth_token')
      : null

    if (!token) return

    const es = new EventSource(`/api/events/stream`)

    es.onopen = () => setIsConnected(true)
    es.onerror = (e) => {
      setIsConnected(false)
      options?.onError?.(e)
    }

    es.onmessage = (message) => {
      try {
        const parsed: SSEEvent = JSON.parse(message.data)
        setLastEvent(parsed)
        options?.onEvent?.(parsed)
      } catch {
        // ignore parse errors (heartbeats)
      }
    }

    setEventSource(es)

    return () => {
      es.close()
      setIsConnected(false)
    }
  }, [])

  const subscribe = useCallback(
    (eventName: string, handler: (data: unknown) => void) => {
      if (!eventSource) return () => {}
      const listener = (message: MessageEvent) => {
        try {
          const parsed = JSON.parse(message.data)
          if (parsed.event === eventName) {
            handler(parsed.data)
          }
        } catch {
          // ignore
        }
      }
      eventSource.addEventListener('message', listener as EventListener)
      return () => eventSource.removeEventListener('message', listener as EventListener)
    },
    [eventSource]
  )

  return {
    isConnected,
    lastEvent,
    subscribe,
  }
}
