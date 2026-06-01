import Card from '@/components/common/Card/Card'
import { CODE_FEEDBACK_COPY } from '@/content/codeFeedback'

type CodeFeedbackPopoverProps = {
  startLine: number
  endLine?: number
  message: string
}

function CodeFeedbackPopover({ startLine, endLine, message }: CodeFeedbackPopoverProps) {
  return (
    <Card
      width="w-max max-w-[min(20rem,calc(100vw-4rem))]"
      className="px-5 py-4 text-body2 font-normal shadow-lg"
    >
      <div className="flex flex-col gap-2">
        <p className="text-body3 font-bold text-neon-blue">
          {CODE_FEEDBACK_COPY.lineLabel(startLine, endLine)}
        </p>
        <p className="text-body2 font-normal leading-relaxed text-light-background whitespace-pre-wrap">
          {message}
        </p>
      </div>
    </Card>
  )
}

export default CodeFeedbackPopover
