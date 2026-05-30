import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { MessageSquareCode } from 'lucide-react'
import { CODE_FEEDBACK_COPY } from '@/content/codeFeedback'
import { getCommentLabelLineRange } from '@/lib/codeFeedbackComment'
import CodeFeedbackPopover from './CodeFeedbackPopover'

type CodeFeedbackCommentMarkerProps = {
  lineNumber: number
  endLineNumber?: number
  labelLineNumber?: number
  message: string
  top: number
  lineHeight: number
}

type PopoverPosition = {
  top: number
  right: number
}

const POPOVER_GAP = 8

function CodeFeedbackCommentMarker({
  lineNumber,
  endLineNumber,
  labelLineNumber,
  message,
  top,
  lineHeight,
}: CodeFeedbackCommentMarkerProps) {
  const { start: displayStartLine, end: displayEndLine } = getCommentLabelLineRange({
    lineNumber,
    endLineNumber,
    labelLineNumber,
  })
  const anchorRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [popoverPosition, setPopoverPosition] = useState<PopoverPosition | null>(null)

  const updatePopoverPosition = useCallback(() => {
    const anchor = anchorRef.current
    if (!anchor) return

    const anchorRect = anchor.getBoundingClientRect()

    setPopoverPosition({
      top: anchorRect.top - POPOVER_GAP,
      right: window.innerWidth - anchorRect.right,
    })
  }, [])

  useLayoutEffect(() => {
    if (!isOpen) return

    const frame = requestAnimationFrame(updatePopoverPosition)

    window.addEventListener('scroll', updatePopoverPosition, true)
    window.addEventListener('resize', updatePopoverPosition)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', updatePopoverPosition, true)
      window.removeEventListener('resize', updatePopoverPosition)
    }
  }, [isOpen, top, updatePopoverPosition])

  const handleOpen = () => {
    updatePopoverPosition()
    setIsOpen(true)
  }

  const handleClose = () => setIsOpen(false)

  const popover =
    isOpen &&
    popoverPosition &&
    createPortal(
      <div
        className="fixed z-[9999] w-max -translate-y-full"
        style={{ top: popoverPosition.top, right: popoverPosition.right }}
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
      >
        <CodeFeedbackPopover
          startLine={displayStartLine}
          endLine={displayEndLine}
          message={message}
        />
      </div>,
      document.body,
    )

  return (
    <>
      <div
        className="pointer-events-none absolute inset-x-0 z-10 flex items-center justify-end pr-3"
        style={{ top, height: lineHeight }}
        onMouseEnter={handleOpen}
        onMouseLeave={handleClose}
      >
        <div
          ref={anchorRef}
          className="pointer-events-none absolute right-3 bottom-full size-0"
          aria-hidden
        />

        <button
          type="button"
          aria-label={CODE_FEEDBACK_COPY.commentIconLabel(
            displayStartLine,
            displayEndLine,
          )}
          aria-expanded={isOpen}
          className="pointer-events-auto flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full bg-neon-blue text-black shadow-sm transition-transform hover:scale-105"
        >
          <MessageSquareCode className="size-3 shrink-0" aria-hidden />
        </button>
      </div>
      {popover}
    </>
  )
}

export default CodeFeedbackCommentMarker
