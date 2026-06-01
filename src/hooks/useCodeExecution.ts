import { useEffect, useRef, useState, useCallback } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import type { ExecutionResult } from '@/types/editor.type'
import type { Language } from '@/types/api.type'

const LANGUAGE_TO_API: Record<Language, string> = {
  PYTHON: 'python',
  JAVA: 'java',
  JAVASCRIPT: 'javascript',
  CPP: 'cpp',
}

const STOMP_URL = `${import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'}/ws`

interface RunParams {
  language: Language
  code: string
  stdin: string
}

export function useCodeExecution({ roomId }: { roomId: number }) {
  const [isRunning, setIsRunning] = useState(false)
  const [executionResult, setExecutionResult] =
    useState<ExecutionResult | null>(null)
  const clientRef = useRef<Client | null>(null)

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(STOMP_URL),
      reconnectDelay: 5000,
      connectHeaders: {
        Authorization: `Bearer ${localStorage.getItem('access_token') ?? ''}`,
      },
    })

    client.onConnect = () => {
      console.log('[WS] 연결 성공')
      client.subscribe(`/topic/code.${roomId}.result`, (message) => {
        const response = JSON.parse(message.body)
        console.log('[WS] 수신 응답:', response)
        if (response.status === 'RUNNING') return
        setExecutionResult(response)
        setIsRunning(false)
      })
    }

    client.onDisconnect = () => console.log('[WS] 연결 끊김')
    client.onStompError = (frame) => console.error('[WS] STOMP 오류', frame)

    client.activate()
    clientRef.current = client

    return () => {
      client.deactivate()
    }
  }, [roomId])

  const run = useCallback(
    ({ language, code, stdin }: RunParams) => {
      console.log('[WS] run 호출됨', { language, code, stdin })
      const client = clientRef.current
      if (!client?.connected) {
        console.warn('[WS] 연결 안 됨 — 실행 불가')
        return
      }

      console.log('[WS] publish 전송')
      setIsRunning(true)
      client.publish({
        destination: `/app/code.${roomId}.execute`,
        body: JSON.stringify({
          language: LANGUAGE_TO_API[language],
          code,
          stdin,
        }),
      })
    },
    [roomId],
  )

  return { run, isRunning, executionResult }
}
