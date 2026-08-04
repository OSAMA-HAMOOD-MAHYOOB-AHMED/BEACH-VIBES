import { SceneMedia } from '../components/Media'
import Newsletter from '../components/Newsletter'
import { useLanguage } from '../context/LanguageContext'

const POST_TONES = ['beach', 'interior', 'coastal']

export default function Journal() {
  const { t } = useLanguage()
  const posts = t('journal.posts')

  return (
    <div>
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 pt-16 pb-10 text-center">
        <p className="section-eyebrow justify-center flex">{t('journal.eyebrow')}</p>
        <h1 className="font-serif text-4xl sm:text-5xl text-navy-900">{t('journal.title')}</h1>
      </div>

      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 pb-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map((post, i) => (
          <article key={post.title} className="group cursor-pointer">
            <div className="aspect-[4/5] mb-5 overflow-hidden">
              <SceneMedia
                tone={POST_TONES[i]}
                className="w-full h-full transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <p className="text-[10px] font-medium uppercase tracking-widest text-navy-400 mb-2">{post.tag}</p>
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
