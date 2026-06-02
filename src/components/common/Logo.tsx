import { Link } from 'react-router-dom'
import { Code2 } from 'lucide-react'

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <Code2 className="text-neon-green" />
      <div className="text-light-background text-head3">Code Run</div>
    </Link>
  )
}

export default Logo
