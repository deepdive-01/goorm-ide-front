import { FormEvent, useEffect, useId, useState } from 'react'
import { Key, X } from 'lucide-react'
import Button from '@/components/common/Button/Button'
import { joinWorkspace } from '@/services/workspace'
import { STUDENT_SPACES_COPY } from '@/content/studentSpaces'

const INPUT_CLASS =
  'text-body1 mt-3 block h-10 w-full rounded-lg border border-gray-800 bg-[#151515] px-3 font-normal text-light-background placeholder:text-body2 placeholder:font-normal placeholder:text-gray-400 focus:border-neon-green focus:outline-none'

const SUBMIT_BTN = {
  width: 'w-full',
  size: 'lg' as const,
  textClassName: 'text-body2 font-medium',
  className: 'h-10 py-0',
}

const JOIN_CODE_BTN = {
  size: 'lg' as const,
  textClassName: 'text-body2',
  className: 'border-neon-green h-10 gap-2 border px-4 py-0',
  bgColor: 'bg-transparent',
  textColor: 'text-neon-green',
  hoverClassName: 'hover:bg-neon-green/10',
}

type JoinSpaceDialogProps = {
  onJoined: () => void
}

function JoinSpaceDialog({ onJoined }: JoinSpaceDialogProps) {
  const [open, setOpen] = useState(false)
  const [inviteCode, setInviteCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const titleId = useId()

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const code = inviteCode.trim()
    if (!code) return

    setIsLoading(true)
    setError(null)

    try {
      await joinWorkspace({ invite_code: code })
      setInviteCode('')
      setOpen(false)
      onJoined()
    } catch {
      setError(STUDENT_SPACES_COPY.joinError)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        ariaLabel={STUDENT_SPACES_COPY.joinCodeButton}
        {...JOIN_CODE_BTN}
      >
        <Key className="size-4 shrink-0" aria-hidden />
        {STUDENT_SPACES_COPY.joinCodeButton}
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          role="presentation"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="border-gray-800 bg-background w-full max-w-md rounded-xl border px-7 py-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <h2 id={titleId} className="text-head3 text-white">
                {STUDENT_SPACES_COPY.joinDialogTitle}
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-light-background cursor-pointer p-1"
                aria-label={STUDENT_SPACES_COPY.joinCancel}
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label className="text-body2 font-normal text-gray-400">
                {STUDENT_SPACES_COPY.joinLabel}
                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  placeholder={STUDENT_SPACES_COPY.joinPlaceholder}
                  className={INPUT_CLASS}
                  autoComplete="off"
                />
              </label>

              {error && (
                <p className="text-body3 text-red-400" role="alert">
                  {error}
                </p>
              )}

              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  type="button"
                  bgColor="bg-gray-900"
                  textColor="text-light-background"
                  hoverClassName="hover:bg-gray-800"
                  width="w-full"
                  onClick={() => setOpen(false)}
                >
                  {STUDENT_SPACES_COPY.joinCancel}
                </Button>
                <Button
                  type="submit"
                  isLoading={isLoading}
                  disabled={!inviteCode.trim()}
                  ariaLabel={STUDENT_SPACES_COPY.joinSubmit}
                  {...SUBMIT_BTN}
                >
                  {STUDENT_SPACES_COPY.joinSubmit}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default JoinSpaceDialog
