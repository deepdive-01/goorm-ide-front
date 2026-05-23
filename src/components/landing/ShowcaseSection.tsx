import { Check } from 'lucide-react'
import IdePreviewMock from '@/components/landing/IdePreviewMock'
import { LANDING_COPY } from '@/content/landing'

const { showcase } = LANDING_COPY

function ShowcaseSection() {
  return (
    <section className="px-4 pb-24 sm:px-16" aria-labelledby="showcase-heading">
      <div className="border-gray-800 bg-gray-900 mx-auto max-w-[1152px] overflow-hidden rounded-xl border">
        <div className="grid lg:grid-cols-2">
          <div className="flex flex-col justify-center gap-6 p-8 sm:p-12">
            <h2
              id="showcase-heading"
              className="text-head1 text-white leading-tight"
            >
              {showcase.title}
            </h2>
            <p className="text-body1 text-gray-400">{showcase.description}</p>
            <ul className="flex flex-col gap-4">
              {showcase.highlights.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <Check
                    className="text-neon-green size-5 shrink-0"
                    aria-hidden
                  />
                  <span className="text-body1 text-white">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-gray-800 flex items-center justify-center border-t p-4 sm:border-t-0 sm:border-l lg:p-6">
            <IdePreviewMock />
          </div>
        </div>
      </div>
    </section>
  )
}

export default ShowcaseSection
