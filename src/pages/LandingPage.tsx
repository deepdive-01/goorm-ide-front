import { Navigate } from 'react-router-dom'
import FeatureSection from '@/components/landing/FeatureSection'
import HeroSection from '@/components/landing/HeroSection'
import ShowcaseSection from '@/components/landing/ShowcaseSection'
import Spinner from '@/components/common/Spinner/Spinner'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { getRoleSpacesPath } from '@/lib/authRoutes'

function LandingPage() {
  const { user, isLoading } = useCurrentUser()

  if (isLoading) {
    return (
      <main className="bg-background flex flex-1 items-center justify-center">
        <Spinner size="md" color="text-neon-green" />
      </main>
    )
  }

  if (user) {
    return <Navigate to={getRoleSpacesPath(user)} replace />
  }

  return (
    <main className="bg-background text-white flex-1">
      <HeroSection />
      <FeatureSection />
      <ShowcaseSection />
    </main>
  )
}

export default LandingPage
