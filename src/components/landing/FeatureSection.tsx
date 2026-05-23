import { MessageSquare, Monitor, Users, type LucideIcon } from 'lucide-react'
import Card from '@/components/common/Card/Card'
import { LANDING_COPY } from '@/content/landing'

const FEATURE_ICONS: LucideIcon[] = [Users, Monitor, MessageSquare]

function FeatureSection() {
  return (
    <section
      className="px-4 pb-20 sm:px-16"
      aria-labelledby="features-heading"
    >
      <h2 id="features-heading" className="sr-only">
        주요 기능
      </h2>
      <div className="mx-auto grid max-w-[1152px] gap-6 md:grid-cols-3">
        {LANDING_COPY.features.map((feature, index) => {
          const Icon = FEATURE_ICONS[index]
          return (
            <Card key={feature.title} width="w-full">
              <div className="flex flex-col gap-5">
                <div className="bg-gray-900 border-gray-800 flex size-12 items-center justify-center rounded-lg border">
                  <Icon className="text-neon-green size-6" aria-hidden />
                </div>
                <h3 className="text-head3 text-white">{feature.title}</h3>
                <p className="text-body2 text-gray-500">{feature.description}</p>
              </div>
            </Card>
          )
        })}
      </div>
    </section>
  )
}

export default FeatureSection
