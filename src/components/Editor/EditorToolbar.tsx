import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Play, Save, Send } from 'lucide-react'
import Button from '@/components/common/Button/Button'
import type { Language, EditorToolbarProps } from '@/types/editor.type'

const LANGUAGE_DISPLAY: Record<Language, string> = {
  PYTHON: 'Python',
  JAVA: 'Java',
  JAVASCRIPT: 'JavaScript',
  CPP: 'C++',
}

const LANGUAGES = Object.keys(LANGUAGE_DISPLAY) as Language[]

function EditorToolbar({
  language,
  onLanguageChange,
  onRun,
  onSave,
  onSubmit,
  onCancelSubmit,
  canCancelSubmit = false,
  cancelSubmitLabel = '제출 취소',
  isRunning = false,
  isSaving = false,
  isSubmitting = false,
  isCancelling = false,
  disabled = false,
}: EditorToolbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="flex items-center justify-between rounded-t-xl bg-black px-7 py-6">
      <div className="text-light-background text-head3 whitespace-nowrap">
        코드 에디터
      </div>

      <div className="flex items-center gap-5">
        <div ref={dropdownRef} className="relative">
          <Button
            ariaLabel="select-language"
            bgColor="bg-transparent"
            textClassName="text-body2"
            textColor="text-neon-green"
            className="border-neon-green border"
            size="md"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {LANGUAGE_DISPLAY[language]}
            <ChevronDown size={18} />
          </Button>

          {isOpen && (
            <ul className="border-neon-green absolute top-full left-0 z-10 w-full overflow-hidden rounded-lg border bg-black">
              {LANGUAGES.map((lang) => (
                <li key={lang}>
                  <button
                    className={`text-body2 w-full px-4 py-2 text-left hover:bg-gray-900 ${lang === language ? 'text-neon-green' : 'hover:text-neon-green text-gray-300'}`}
                    onClick={() => {
                      onLanguageChange(lang)
                      setIsOpen(false)
                    }}
                  >
                    {LANGUAGE_DISPLAY[lang]}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <Button
          ariaLabel="run"
          bgColor="bg-transparent"
          textColor="text-light-background"
          className="border border-gray-800 px-2!"
          size="lg"
          isLoading={isRunning}
          onClick={onRun}
        >
          <Play size={16} />
        </Button>

        <Button
          ariaLabel="save"
          bgColor="bg-transparent"
          textClassName="text-body2"
          textColor="text-light-background"
          className="border border-gray-800 px-2!"
          size="lg"
          isLoading={isSaving}
          disabled={disabled}
          onClick={onSave}
        >
          <Save size={16} />
        </Button>

        {canCancelSubmit && (
          <Button
            ariaLabel="cancel-submit"
            bgColor="bg-transparent"
            textClassName="text-body2 whitespace-nowrap"
            textColor="text-gray-300"
            className="border-gray-800 border"
            size="md"
            isLoading={isCancelling}
            disabled={disabled || isSubmitting || isCancelling}
            onClick={onCancelSubmit}
          >
            {cancelSubmitLabel}
          </Button>
        )}

        <Button
          ariaLabel="submit"
          bgColor="bg-neon-green"
          textClassName="text-body2"
          textColor="text-background"
          size="md"
          isLoading={isSubmitting}
          disabled={disabled}
          onClick={onSubmit}
        >
          <Send size={15} />
          제출
        </Button>
      </div>
    </div>
  )
}

export default EditorToolbar
