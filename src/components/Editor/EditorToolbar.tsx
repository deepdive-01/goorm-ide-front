import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Play, Send, Save } from 'lucide-react'
import Button from '@/components/common/Button/Button'

const LANGUAGES = ['Python', 'Java', 'JavaScript', 'C++'] as const

function EditorToolbar() {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('Python')
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
            ariaLabel="select-lan"
            bgColor="bg-transparent"
            textClassName="text-body2"
            textColor="text-neon-green"
            className="border-neon-green border"
            size="md"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {selectedLanguage}
            <ChevronDown size={18} />
          </Button>

          {isOpen && (
            <ul className="border-neon-green absolute top-full left-0 z-10 w-full overflow-hidden rounded-lg border bg-black">
              {LANGUAGES.map((lang) => (
                <li key={lang}>
                  <button
                    className={`text-body2 w-full px-4 py-2 text-left hover:bg-gray-900 ${lang === selectedLanguage ? 'text-neon-green' : 'hover:text-neon-green text-gray-300'}`}
                    onClick={() => {
                      setSelectedLanguage(lang)
                      setIsOpen(false)
                    }}
                  >
                    {lang}
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
        >
          <Play size={15} />
          실행
        </Button>

        <Button
          ariaLabel="run"
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
          ariaLabel="run"
          bgColor="bg-neon-green"
          textClassName="text-body2"
          textColor="text-background "
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
