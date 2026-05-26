import { useCallback, useEffect, useId, useState } from 'react'
import type { FormEvent } from 'react'
import { Plus, X } from 'lucide-react'
import Button from '@/components/common/Button/Button'
import { TEACHER_SPACES_COPY } from '@/content/teacherSpaces'
import { createWorkspace } from '@/services/workspace'

const INPUT_CLASS =
  'text-body1 mt-3 block h-10 w-full rounded-lg border border-gray-800 bg-[#0d0d0d] px-3 font-normal text-light-background placeholder:text-body2 placeholder:font-normal placeholder:text-gray-400 focus:border-neon-green focus:outline-none'

const SUBMIT_BTN = {
  width: 'w-full',
  size: 'xl' as const,
  textClassName: 'text-body1 font-medium',
  className: 'mt-2 h-10 rounded-lg py-0',
}

const CREATE_BTN = {
  size: 'lg' as const,
  textClassName: 'text-body1',
  className: 'self-start px-5',
}

type CreateSpaceDialogProps = {
  onCreated: () => Promise<void> | void
}

function CreateSpaceDialog({ onCreated }: CreateSpaceDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const titleId = useId()

  const resetForm = useCallback(() => {
    setName('')
    setDescription('')
    setError(null)
    setIsLoading(false)
  }, [])

  const handleClose = useCallback(() => {
    setOpen(false)
    resetForm()
  }, [resetForm])

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleClose()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleClose, open])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const trimmedName = name.trim()
    const trimmedDescription = description.trim()

    if (!trimmedName) return

    setIsLoading(true)
    setError(null)

    try {
      await createWorkspace({
        name: trimmedName,
        description: trimmedDescription || undefined,
      })
      await onCreated()
      handleClose()
    } catch {
      setError(TEACHER_SPACES_COPY.createError)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        ariaLabel={TEACHER_SPACES_COPY.createButtonLabel}
        {...CREATE_BTN}
      >
        <Plus className="size-5 shrink-0" aria-hidden />
        {TEACHER_SPACES_COPY.createButtonLabel}
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          role="presentation"
          onClick={handleClose}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="border-gray-800 bg-[#0d0d0d] relative w-full max-w-[28rem] rounded-xl border px-7 py-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleClose}
              className="text-gray-500 hover:text-light-background absolute top-4 right-4 cursor-pointer p-1"
              aria-label={TEACHER_SPACES_COPY.createClose}
            >
              <X className="size-5" />
            </button>

            <div className="mb-5">
              <h2
                id={titleId}
                className="text-center text-[26px] leading-normal font-semibold text-white"
              >
                {TEACHER_SPACES_COPY.createDialogTitle}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <label className="text-body1 font-medium text-white">
                {TEACHER_SPACES_COPY.createNameLabel}
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={TEACHER_SPACES_COPY.createNamePlaceholder}
                  className={INPUT_CLASS}
                  autoComplete="off"
                  autoFocus
                />
              </label>

              <label className="text-body1 font-medium text-white">
                {TEACHER_SPACES_COPY.createDescriptionLabel}
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={TEACHER_SPACES_COPY.createDescriptionPlaceholder}
                  className={INPUT_CLASS}
                />
              </label>

              {error && (
                <p className="text-body3 text-red-400" role="alert">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                isLoading={isLoading}
                disabled={!name.trim()}
                ariaLabel={TEACHER_SPACES_COPY.createSubmit}
                {...SUBMIT_BTN}
              >
                {TEACHER_SPACES_COPY.createSubmit}
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default CreateSpaceDialog
