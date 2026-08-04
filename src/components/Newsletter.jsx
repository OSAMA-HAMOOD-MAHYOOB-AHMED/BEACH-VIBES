import { useState } from 'react'
import { Mail } from 'lucide-react'
import { SceneMedia } from './Media'
import { supabase } from '../lib/supabaseClient'

export default function Newsletter({
  eyebrow = 'The Inner Circle',
  title = 'A Private Invitation',
  subtitle = 'Join our collective for first access to artisanal drops, limited series, and coastal discoveries.',
}) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!email) return

    if (!supabase) {
      setSubmitted(true)
      return
    }

    setSubmitting(true)
    setError(false)
    const { error: insertError } = await supabase
      .from('newsletter_subscribers')
      .insert({ email })

    setSubmitting(false)
    // A duplicate email (already subscribed) should still read as success.
    if (insertError && insertError.code !== '23505') {
      setError(true)
      return
    }
    setSubmitted(true)
  }

  return (
    <section className="relative">
      <SceneMedia tone="invite" overlay="dark-full" className="w-full py-20 sm:py-24 px-5">
        <div className="relative max-w-xl mx-auto text-center">
          <p className="text-[11px] font-medium uppercase tracking-widest2 text-white/80 mb-3">
            {eyebrow}
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-white mb-3">{title}</h2>
          <p className="text-sm text-white/85 mb-8 leading-relaxed">{subtitle}</p>

          {submitted ? (
            <p className="text-sm text-white">You&apos;re on the list — welcome to the circle.</p>
          ) : (
            <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 text-navy-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full bg-white pl-10 pr-4 py-3.5 text-sm text-ink placeholder:text-navy-300 focus:outline-none"
                />
              </div>
              <button type="submit" disabled={submitting} className="btn-primary whitespace-nowrap disabled:opacity-60">
                {submitting ? 'Joining…' : 'Join'}
              </button>
            </form>
          )}
          {error && (
            <p className="text-xs text-white/80 mt-3">
              Something went wrong — please try again in a moment.
            </p>
          )}
        </div>
      </SceneMedia>
    </section>
  )
}
