import { ArrowRight } from 'lucide-react'
import { ButtonLink } from '@/components/landing/ButtonLink'
import { SPACES_ENTRY_PATH } from '@/pages/SpacesEntryRedirect'
import { LANDING_COPY } from '@/content/landing'

const { hero } = LANDING_COPY

function HeroSection() {
  return (
    <section className="flex flex-col items-center px-4 pt-12 pb-16 text-center sm:px-6 lg:pt-16 lg:pb-24">
      <div className="flex max-w-[597px] flex-col items-center">
        <span className="border-gray-800 bg-gray-900 text-body3 text-gray-300 mb-10 inline-flex items-center gap-2 rounded-full border px-4 py-1.5">
          <span
            className="bg-neon-green size-2 shrink-0 rounded-full"
            aria-hidden
          />
          {hero.badge}
        </span>

        <h1 className="text-hero text-white mb-6">
          {hero.title}
          <br />
          <span className="text-neon-green">{hero.titleHighlight}</span>
        </h1>

        <p className="text-body1 text-gray-400 mb-10">
          {hero.descriptionLine1}
          <br />
          {hero.descriptionLine2}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <ButtonLink to={SPACES_ENTRY_PATH} variant="primary">
            {hero.ctaPrimary}
            <ArrowRight className="size-4" aria-hidden />
          </ButtonLink>
          <ButtonLink to="/login" variant="secondary">
            {hero.ctaSecondary}
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
