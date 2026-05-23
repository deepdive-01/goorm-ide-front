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
      <div className="bg-background flex min-h-[50vh] items-center justify-center">
        <Spinner size="md" color="text-neon-green" />
      </div>
    )
  }

  if (user) {
    return <Navigate to={getRoleSpacesPath(user)} replace />
  }

  return (
    <main className="bg-background text-white min-h-screen">
      <HeroSection />
      <FeatureSection />
      <ShowcaseSection />
    </main>
  )
}

export default LandingPage
