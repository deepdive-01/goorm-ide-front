import { useCallback, useId, useState, type ReactNode } from 'react'
import type { FormEvent } from 'react'
import { Check, Copy, KeyRound, Send, X } from 'lucide-react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import Button from '@/components/common/Button/Button'
import Card from '@/components/common/Card/Card'
import PageHeader from '@/components/common/PageHeader/PageHeader'
import Spinner from '@/components/common/Spinner/Spinner'
import { TEACHER_INVITE_STUDENTS_COPY } from '@/content/teacherInviteStudents'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useWorkspace } from '@/hooks/useWorkspace'
import { getRoleSpacesPath } from '@/lib/authRoutes'
import {
  getInviteByEmailErrorMessage,
  validateInviteEmailInput,
} from '@/lib/inviteForm'
import { inviteByEmail } from '@/services/workspace'

const INPUT_CLASS =
  'text-body1 min-w-0 flex-1 bg-transparent font-normal text-gray-400 placeholder:text-gray-400 focus:text-light-background focus:outline-none'

const ACTION_ROW_CLASS =
  'flex h-10 items-center justify-between gap-3 rounded-lg bg-[#151515] px-3'

const INLINE_ACTION_BTN =
  'text-body3 inline-flex h-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-gray-800 bg-background px-3 font-bold text-light-background transition-colors hover:border-gray-600 disabled:cursor-not-allowed disabled:opacity-50'

const SEND_BTN = {
  width: 'w-full' as const,
  size: 'lg' as const,
  textClassName: 'text-body1 font-semibold',
  className: 'h-10 gap-2.5 py-0',
  hoverClassName: 'hover:bg-[#8ef48c] active:brightness-95',
}

type InviteFieldRowProps = {
  children: ReactNode
  action: ReactNode
}

function InviteFieldRow({ children, action }: InviteFieldRowProps) {
  return (
    <div className={ACTION_ROW_CLASS}>
      <div className="min-w-0 flex-1">{children}</div>
      {action}
    </div>
  )
}

function InviteStudentsPage() {
  const { spaceId: spaceIdParam } = useParams()
  const spaceId = Number(spaceIdParam)

  if (!Number.isFinite(spaceId) || spaceId <= 0) {
    return <Navigate to="/teacher/spaces" replace />
  }

  return <InviteStudentsContent spaceId={spaceId} />
}

function InviteStudentsContent({ spaceId }: { spaceId: number }) {
  const navigate = useNavigate()
  const emailFieldId = useId()
  const { user, isLoading: isUserLoading } = useCurrentUser()
  const { workspace, isLoading: isWorkspaceLoading } = useWorkspace(spaceId)

  const [emailInput, setEmailInput] = useState('')
  const [emails, setEmails] = useState<string[]>([])
  const [isSending, setIsSending] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const inviteCode = workspace?.invite_code ?? ''

  const copyInviteCode = useCallback(async () => {
    if (!inviteCode || !navigator.clipboard) return

    try {
      await navigator.clipboard.writeText(inviteCode)
      setIsCopied(true)
      window.setTimeout(() => setIsCopied(false), 2000)
    } catch {
      setError(TEACHER_INVITE_STUDENTS_COPY.copyError)
    }
  }, [inviteCode])

  const addEmail = () => {
    const validationError = validateInviteEmailInput(emailInput)
    if (validationError) {
      setError(validationError)
      setSuccess(null)
      return
    }

    const trimmed = emailInput.trim()

    if (emails.includes(trimmed)) {
      setError(TEACHER_INVITE_STUDENTS_COPY.duplicateEmail)
      setSuccess(null)
      return
    }

    setEmails((prev) => [...prev, trimmed])
    setEmailInput('')
    setError(null)
  }

  const removeEmail = (email: string) => {
    setEmails((prev) => prev.filter((item) => item !== email))
  }

  const handleSendInvite = async (event: FormEvent) => {
    event.preventDefault()
    if (isSending) return

    if (emails.length === 0) {
      setError(TEACHER_INVITE_STUDENTS_COPY.emailsRequiredForSend)
      setSuccess(null)
      return
    }

    setIsSending(true)
    setError(null)
    setSuccess(null)

    try {
      const { data } = await inviteByEmail(spaceId, { emails })
      setSuccess(TEACHER_INVITE_STUDENTS_COPY.sendSuccess(data.data.sent_count))
      setEmails([])
    } catch (submitError) {
      setError(getInviteByEmailErrorMessage(submitError))
    } finally {
      setIsSending(false)
    }
  }

  if (isUserLoading || isWorkspaceLoading) {
    return (
      <main className="bg-background flex flex-1 items-center justify-center">
        <Spinner size="md" color="text-neon-green" />
      </main>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.role !== 'MENTOR') {
    return <Navigate to={getRoleSpacesPath(user)} replace />
  }

  if (!workspace) {
    return (
      <main className="bg-background text-light-background flex flex-1 px-4 py-10 sm:px-16 lg:px-22">
        <div className="mx-auto w-full max-w-[1104px]">
          <p className="text-body1 text-center text-gray-400">
            {TEACHER_INVITE_STUDENTS_COPY.invalidSpace}
          </p>
        </div>
      </main>
    )
  }

  return (
    <div className="bg-background text-light-background flex flex-1 flex-col">
      <div className="border-b border-gray-800 bg-[#0d0d0d] px-4 py-5 sm:px-16 lg:px-22">
        <div className="mx-auto flex w-full max-w-[1104px] flex-wrap items-center gap-6 sm:gap-8">
          <PageHeader
            onClick={() => navigate(`/teacher/spaces/${spaceId}`)}
            className="text-white hover:text-light-background"
          >
            {workspace.name}
          </PageHeader>
          <h1 className="text-head3 text-white">{TEACHER_INVITE_STUDENTS_COPY.pageTitle}</h1>
        </div>
      </div>

      <main className="flex flex-1 px-4 py-8 sm:px-16 lg:px-22">
        <div className="mx-auto flex w-full max-w-[539px] flex-col gap-5">
          <Card width="w-full" className="bg-[#0d0d0d] px-5 py-6 sm:px-7">
            <section className="flex flex-col gap-5">
              <header className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5">
                  <KeyRound className="size-5 shrink-0 text-white" aria-hidden />
                  <h2 className="text-head3 text-white">
                    {TEACHER_INVITE_STUDENTS_COPY.inviteCodeTitle}
                  </h2>
                </div>
                <p className="text-body2 text-gray-400">
                  {TEACHER_INVITE_STUDENTS_COPY.inviteCodeDescription}
                </p>
              </header>

              <InviteFieldRow
                action={
                  <button
                    type="button"
                    onClick={() => void copyInviteCode()}
                    aria-label={
                      isCopied
                        ? TEACHER_INVITE_STUDENTS_COPY.copied
                        : TEACHER_INVITE_STUDENTS_COPY.copyCode
                    }
                    className={INLINE_ACTION_BTN}
                  >
                    {isCopied ? (
                      <Check className="size-3 shrink-0 text-neon-green" aria-hidden />
                    ) : (
                      <Copy className="size-3 shrink-0" aria-hidden />
                    )}
                  </button>
                }
              >
                <p
                  className="text-body1 truncate text-gray-400"
                  aria-label={TEACHER_INVITE_STUDENTS_COPY.inviteCodeLabel}
                >
                  {inviteCode || '—'}
                </p>
              </InviteFieldRow>
            </section>
          </Card>

          <Card width="w-full" className="bg-[#0d0d0d] px-5 py-6 sm:px-7">
            <form onSubmit={handleSendInvite} className="flex flex-col gap-5">
              <header className="flex flex-col gap-1.5">
                <h2 className="text-head3 text-white">
                  {TEACHER_INVITE_STUDENTS_COPY.emailTitle}
                </h2>
                <p className="text-body2 text-gray-400">
                  {TEACHER_INVITE_STUDENTS_COPY.emailDescription}
                </p>
              </header>

              <div className="flex flex-col gap-4">
                <InviteFieldRow
                  action={
                    <button
                      type="button"
                      onClick={addEmail}
                      aria-label={TEACHER_INVITE_STUDENTS_COPY.addEmail}
                      className={INLINE_ACTION_BTN}
                    >
                      {TEACHER_INVITE_STUDENTS_COPY.addEmail}
                    </button>
                  }
                >
                  <label htmlFor={emailFieldId} className="sr-only">
                    {TEACHER_INVITE_STUDENTS_COPY.emailLabel}
                  </label>
                  <input
                    id={emailFieldId}
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addEmail()
                      }
                    }}
                    placeholder={TEACHER_INVITE_STUDENTS_COPY.emailPlaceholder}
                    className={INPUT_CLASS}
                    autoComplete="email"
                  />
                </InviteFieldRow>

                {emails.length > 0 && (
                  <ul className="flex flex-wrap gap-2">
                    {emails.map((email) => (
                      <li
                        key={email}
                        className="text-body3 flex items-center gap-1.5 rounded-lg border border-gray-800 bg-[#151515] py-1 pr-1 pl-3 text-light-background"
                      >
                        {email}
                        <button
                          type="button"
                          onClick={() => removeEmail(email)}
                          aria-label={TEACHER_INVITE_STUDENTS_COPY.removeEmail(email)}
                          className="cursor-pointer rounded p-1 text-gray-400 hover:text-light-background"
                        >
                          <X className="size-3 shrink-0" aria-hidden />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                <Button
                  type="submit"
                  isLoading={isSending}
                  disabled={emails.length === 0}
                  ariaLabel={TEACHER_INVITE_STUDENTS_COPY.sendInvite}
                  {...SEND_BTN}
                >
                  <Send className="size-4 shrink-0" aria-hidden />
                  {isSending
                    ? TEACHER_INVITE_STUDENTS_COPY.sending
                    : TEACHER_INVITE_STUDENTS_COPY.sendInvite}
                </Button>
              </div>

              {error && (
                <p className="text-body3 text-red-400" role="alert">
                  {error}
                </p>
              )}
              {success && (
                <p className="text-body3 text-neon-green" role="status">
                  {success}
                </p>
              )}
            </form>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default InviteStudentsPage
