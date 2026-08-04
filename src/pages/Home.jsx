import { Link } from 'react-router-dom'
import { ArrowRight, Leaf, Sparkles, ShieldCheck, Globe2, Headset } from 'lucide-react'
import { SceneMedia } from '../components/Media'
import ProductCard from '../components/ProductCard'
import Newsletter from '../components/Newsletter'
import { useProducts } from '../context/ProductsContext'

const CURATION_IDS = [
  'essence-of-azure',
  'artisanal-ceramic-vase',
  'midnight-silk-scarf',
  'heritage-leather-tote',
]

const QUALITY_PILLARS = [
  {
    icon: ShieldCheck,
    title: 'Unrivaled Quality',
    body: 'Each object passes a rigorous multi-stage inspection by our master curators.',
  },
  {
    icon: Globe2,
    title: 'Global Logistics',
    body: 'Bespoke white-glove shipping to over 140 countries worldwide.',
  },
  {
    icon: Headset,
    title: 'Concierge Support',
    body: 'Personal styling and gifting consultations available 24/7.',
  },
]

export default function Home() {
  const { products } = useProducts()
  const curated = CURATION_IDS.map((id) => products.find((p) => p.id === id)).filter(Boolean)

  return (
    <div>
      {/* Hero */}
      <section className="relative">
        <SceneMedia
          tone="hero"
          overlay="dark-left"
          className="w-full min-h-[560px] sm:min-h-[640px] flex items-center px-5 sm:px-8"
        >
          <div className="relative max-w-[1400px] mx-auto w-full">
            <div className="max-w-xl">
              <p className="text-[11px] font-medium uppercase tracking-widest2 text-white/80 mb-4">
                Season Preview
              </p>
              <h1 className="font-serif text-4xl sm:text-6xl leading-[1.1] text-white mb-5">
                The Art of <span className="italic font-normal">Serene</span> Living
              </h1>
              <p className="text-sm sm:text-base text-white/85 max-w-md mb-9 leading-relaxed">
                Discover a curated sanctuary of artisanal objects designed for the discerning
                few. From our ateliers to your home.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/collections" className="btn-primary">
                  Shop Collection
                </Link>
                <Link to="/about" className="btn-outline-light">
                  Our Story
                </Link>
              </div>
            </div>
          </div>
        </SceneMedia>
      </section>

      {/* Summer Curations */}
      <section className="max-w-[1400px] mx-auto px-5 sm:px-8 py-20 sm:py-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="section-eyebrow">The Edit</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-navy-900">Summer Curations</h2>
          </div>
          <Link
            to="/collections"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-navy-700 hover:text-navy-900 transition-colors"
          >
            View All Objects <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {curated.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Craftsmanship */}
      <section className="bg-sand-100 border-y border-navy-100">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-20 sm:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <SceneMedia tone="beach" className="w-full aspect-[4/5] sm:aspect-[5/4]" />
          <div>
            <p className="section-eyebrow">Craftsmanship</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-navy-900 mb-5 leading-tight">
              Artisanal Roots, Global Elegance.
            </h2>
            <p className="text-sm text-navy-500 leading-relaxed mb-8 max-w-md">
              At Aqua Atelier, we believe in the luxury of patience. Every piece in our
              collection is sourced from artisans who preserve centuries-old techniques,
              blending them with a modern coastal sensibility.
            </p>
            <div className="flex gap-10 mb-9">
              <div className="flex items-center gap-2.5">
                <Leaf className="w-5 h-5 text-navy-600" strokeWidth={1.5} />
                <span className="text-xs font-medium uppercase tracking-wide text-navy-700">
                  Sustainable
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-navy-600" strokeWidth={1.5} />
                <span className="text-xs font-medium uppercase tracking-wide text-navy-700">
                  Unique
                </span>
              </div>
            </div>
            <Link to="/about" className="btn-secondary">
              Discover Our Process
            </Link>
          </div>
        </div>
      </section>

      {/* Explore Collections */}
      <section className="max-w-[1400px] mx-auto px-5 sm:px-8 py-20 sm:py-24 text-center">
        <p className="section-eyebrow justify-center flex">Explore Collections</p>
        <h2 className="font-serif text-3xl sm:text-4xl text-navy-900 mb-4">
          A Curated Way of Life
        </h2>
        <p className="text-sm text-navy-500 max-w-lg mx-auto mb-12 leading-relaxed">
          Each category is a chapter in our story of quiet luxury and refined taste.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <Link to="/shop?category=Fragrance" className="group relative block overflow-hidden">
            <SceneMedia tone="dark" overlay="dark-bottom" className="w-full h-full min-h-[420px]">
              <div className="relative h-full flex flex-col justify-end p-8">
                <h3 className="font-serif text-2xl text-white mb-4">The Fragrance Bar</h3>
                <span className="text-[11px] font-medium uppercase tracking-widest text-white border-b border-white/60 pb-1 w-fit group-hover:border-white transition-colors">
                  Explore Scents
                </span>
              </div>
            </SceneMedia>
          </Link>
          <div className="grid grid-rows-2 gap-6">
            <Link to="/shop?category=Footwear" className="group relative block overflow-hidden">
              <SceneMedia tone="coastal" overlay="dark-bottom" className="w-full h-full min-h-[192px]">
                <div className="relative h-full flex flex-col justify-end p-6">
                  <h3 className="font-serif text-xl text-white">Summer Footwear</h3>
                </div>
              </SceneMedia>
            </Link>
            <Link to="/shop?category=Home Goods" className="group relative block overflow-hidden">
              <SceneMedia tone="interior" overlay="dark-bottom" className="w-full h-full min-h-[192px]">
                <div className="relative h-full flex flex-col justify-end p-6">
                  <h3 className="font-serif text-xl text-white">Coastal Comfort</h3>
                </div>
              </SceneMedia>
            </Link>
          </div>
        </div>
      </section>

      {/* Quality pillars */}
      <section className="bg-navy-900">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-16 sm:py-20 grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
          {QUALITY_PILLARS.map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex flex-col items-center">
              <Icon className="w-6 h-6 text-white/80 mb-4" strokeWidth={1.25} />
              <h3 className="text-sm font-semibold uppercase tracking-widest text-white mb-2.5">
                {title}
              </h3>
              <p className="text-sm text-white/60 max-w-[220px] leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quote */}
      <section className="max-w-2xl mx-auto px-5 sm:px-8 py-20 sm:py-24 text-center">
        <p className="font-serif italic text-xl sm:text-2xl text-navy-800 leading-relaxed mb-6">
          &ldquo;Luxury is not defined by excess, but by the quiet confidence of objects that
          possess a soul and a story.&rdquo;
        </p>
        <p className="text-[11px] font-medium uppercase tracking-widest text-navy-400">
          Aqua Atelier — Est. 2024 · Coastal Living
        </p>
      </section>

      <Newsletter />
    </div>
  )
}
