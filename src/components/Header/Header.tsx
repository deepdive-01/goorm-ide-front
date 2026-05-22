import Logo from '../common/Logo'
import HeaderUserSection from './HeaderUserSection/HeaderUserSection'

function Header() {
  return (
    <div className="bg-background text-light-background flex justify-between border-b border-gray-800 px-22 py-4">
      <Logo />
      <HeaderUserSection />
    </div>
  )
}

export default Header
