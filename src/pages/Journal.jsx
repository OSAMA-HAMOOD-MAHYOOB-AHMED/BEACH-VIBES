import { SceneMedia } from '../components/Media'
import Newsletter from '../components/Newsletter'

const POSTS = [
  {
    tone: 'beach',
    tag: 'Craftsmanship',
    title: 'Elegance in Simplicity',
    excerpt:
      'Discover the philosophy behind our Summer Collections, inspired by the raw textures of the Mediterranean coast.',
  },
  {
    tone: 'interior',
    tag: 'The Atelier',
    title: 'Where Water Meets The Shore',
    excerpt:
      'Our founder spent three summers on the Amalfi Coast documenting the changing scent of the sea.',
  },
  {
    tone: 'coastal',
    tag: 'Materials',
    title: 'The Case for Slow Leather',
    excerpt:
      'Why vegetable tanning takes six weeks longer — and why that patience shows in the patina.',
  },
]

export default function Journal() {
  return (
    <div>
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 pt-16 pb-10 text-center">
        <p className="section-eyebrow justify-center flex">The Coastal Journal</p>
        <h1 className="font-serif text-4xl sm:text-5xl text-navy-900">Stories from the Atelier</h1>
      </div>

      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 pb-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        {POSTS.map((post) => (
          <article key={post.title} className="group cursor-pointer">
            <div className="aspect-[4/5] mb-5 overflow-hidden">
              <SceneMedia
                tone={post.tone}
                className="w-full h-full transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <p className="text-[10px] font-medium uppercase tracking-widest text-navy-400 mb-2">
              {post.tag}
            </p>
            <h3 className="font-serif text-xl text-navy-900 mb-2 group-hover:text-navy-600 transition-colors">
              {post.title}
            </h3>
            <p className="text-sm text-navy-500 leading-relaxed">{post.excerpt}</p>
          </article>
        ))}
      </div>

      <Newsletter />
    </div>
  )
}
