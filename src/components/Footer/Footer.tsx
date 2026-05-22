import { FaGithub } from 'react-icons/fa'
import Logo from '../common/Logo'

function Footer() {
  return (
    <div className="text-light-background flex items-center justify-between bg-gray-900 px-22 py-10">
      <Logo />
      <div className="text-body2 flex items-center gap-6 text-gray-400">
        <span>@ 2026 Code Run</span>
        <a
          href="https://github.com/orgs/deepdive-01/repositories"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-light-background flex items-center gap-1.5 transition-colors"
        >
          <FaGithub size={16} />
          <span>GitHub</span>
        </a>
      </div>
    </div>
  )
}

export default Footer
