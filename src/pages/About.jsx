import { Link } from 'react-router-dom'
import { Leaf, Sparkles, Users } from 'lucide-react'
import { SceneMedia } from '../components/Media'
import Newsletter from '../components/Newsletter'

const VALUES = [
  {
    icon: Leaf,
    title: 'Sustainable Sourcing',
    body: 'Every material is traced to certified, low-impact origins before it reaches an atelier.',
  },
  {
    icon: Sparkles,
    title: 'Uncompromising Craft',
    body: 'Small-batch production by independent artisans who preserve techniques passed down for generations.',
  },
  {
    icon: Users,
    title: 'A Considered Circle',
    body: 'We grow slowly and deliberately, favoring lasting relationships over rapid scale.',
  },
]

export default function About() {
  return (
    <div>
      <SceneMedia tone="hero" overlay="dark-left" className="w-full min-h-[420px] flex items-center px-5 sm:px-8">
        <div className="relative max-w-[1400px] mx-auto w-full">
          <p className="text-[11px] font-medium uppercase tracking-widest2 text-white/80 mb-4">
            Our Story
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl text-white max-w-xl leading-tight">
            Quiet luxury, built by hand.
          </h1>
        </div>
      </SceneMedia>

      <section className="max-w-[1400px] mx-auto px-5 sm:px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        <SceneMedia tone="interior" className="w-full aspect-[4/5] sm:aspect-[5/4]" />
        <div>
          <p className="section-eyebrow">Founded 2024</p>
          <h2 className="font-serif text-3xl sm:text-4xl text-navy-900 mb-5 leading-tight">
            Objects with a soul and a story.
          </h2>
          <p className="text-sm text-navy-500 leading-relaxed mb-4 max-w-md">
            Aqua Atelier began with a single question: what would a home look like if every
            object in it was chosen with the same care as a piece of art? The answer became a
            collective of artisans across the Mediterranean coast, each preserving a craft that
            modern manufacturing left behind.
          </p>
          <p className="text-sm text-navy-500 leading-relaxed max-w-md">
            Today we work with a small, rotating roster of makers — glassblowers, tanners,
            weavers, and ceramicists — to bring their work to a wider audience without
            compromising the patience their craft demands.
          </p>
        </div>
      </section>

      <section className="bg-navy-900">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-20 grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
          {VALUES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex flex-col items-center">
              <Icon className="w-6 h-6 text-white/80 mb-4" strokeWidth={1.25} />
              <h3 className="text-sm font-semibold uppercase tracking-widest text-white mb-2.5">
                {title}
              </h3>
              <p className="text-sm text-white/60 max-w-[240px] leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-5 sm:px-8 py-20 text-center">
        <p className="font-serif italic text-xl sm:text-2xl text-navy-800 leading-relaxed mb-8">
          &ldquo;We don&apos;t chase trends. We chase the feeling of a well-made thing, held for
          the first time.&rdquo;
        </p>
        <Link to="/shop" className="btn-secondary">
          Explore the Collection
        </Link>
      </section>

      <Newsletter />
    </div>
  )
}
