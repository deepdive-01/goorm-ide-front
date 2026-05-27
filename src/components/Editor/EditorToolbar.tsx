import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Play, Send, Save } from 'lucide-react'
import Button from '@/components/common/Button/Button'
import type { Language, EditorToolbarProps } from '@/types/editor.type'

const LANGUAGE_DISPLAY: Record<Language, string> = {
  python: 'Python',
  java: 'Java',
  javascript: 'JavaScript',
  cpp: 'C++',
}

const LANGUAGES = Object.keys(LANGUAGE_DISPLAY) as Language[]

function EditorToolbar({ language, onLanguageChange, onRun }: EditorToolbarProps) {
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
          textClassName="text-body2"
          textColor="text-light-background"
          className="border border-gray-800"
          size="md"
          onClick={onRun}
        >
          <Play size={15} />
          실행
        </Button>

        <Button
          ariaLabel="save"
          bgColor="bg-transparent"
          textClassName="text-body2"
          textColor="text-light-background"
          className="border border-gray-800"
          size="md"
        >
          <Save size={15} />
          저장
        </Button>

        <Button
          ariaLabel="submit"
          bgColor="bg-neon-green"
          textClassName="text-body2"
          textColor="text-background"
          size="md"
        >
          <Send size={15} />
          제출
        </Button>
      </div>
    </div>
  )
}

export default EditorToolbar
