import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Instagram, Twitter, Facebook, Droplet, Mail, Check } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState('idle') // idle | submitting | done | error

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!email || state === 'submitting') return

    if (!supabase) {
      setState('done')
      return
    }

    setState('submitting')
    const { error } = await supabase.from('newsletter_subscribers').insert({ email })
    if (error && error.code !== '23505') {
      setState('error')
      return
    }
    setState('done')
  }

  return (
    <footer className="bg-sand-100 border-t border-navy-100">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-14 grid grid-cols-1 sm:grid-cols-3 gap-10">
        <div>
          <Link to="/" className="flex items-center gap-2 mb-4">
            <Droplet className="w-4 h-4 text-navy-800" strokeWidth={1.5} />
            <span className="font-serif text-sm tracking-widest2 uppercase text-navy-900">
              Aqua Atelier
            </span>
          </Link>
          <p className="text-sm text-navy-500 leading-relaxed max-w-xs">
            Curated collections of artisanal goods for the discerning individual. Elegance and
            quality in every detail.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-navy-800 mb-4">
            Explore
          </h4>
          <ul className="space-y-2.5 text-sm text-navy-500">
            <li><Link to="/collections" className="hover:text-navy-800 transition-colors">Collections</Link></li>
            <li><Link to="/about" className="hover:text-navy-800 transition-colors">About Us</Link></li>
            <li><Link to="/journal" className="hover:text-navy-800 transition-colors">Journal</Link></li>
            <li><Link to="/contact" className="hover:text-navy-800 transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-navy-800 mb-4">
            Join the Circle
          </h4>
          <p className="text-sm text-navy-500 mb-4">
            Subscribe for early access to new releases.
          </p>
          {state === 'done' ? (
            <p className="flex items-center gap-2 text-sm text-navy-700">
              <Check className="w-4 h-4" /> You&apos;re subscribed.
            </p>
          ) : (
            <form
              onSubmit={onSubmit}
              className="flex items-center border-b border-navy-200 focus-within:border-navy-600 transition-colors"
            >
              <Mail className="w-4 h-4 text-navy-400 shrink-0" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 bg-transparent px-3 py-2 text-sm placeholder:text-navy-300 focus:outline-none"
              />
              <button
                type="submit"
                disabled={state === 'submitting'}
                className="text-[10px] font-semibold uppercase tracking-widest text-navy-800 border border-navy-800 px-4 py-2 hover:bg-navy-800 hover:text-white transition-colors shrink-0 disabled:opacity-60"
              >
                {state === 'submitting' ? '...' : 'Subscribe'}
              </button>
            </form>
          )}
          {state === 'error' && (
            <p className="text-xs text-navy-400 mt-2">Something went wrong — please retry.</p>
          )}
        </div>
      </div>

      <div className="border-t border-navy-100">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-navy-400">© 2026 Aqua Atelier. All rights reserved.</p>
          <div className="flex items-center gap-4 text-navy-500">
            <a href="#" aria-label="Instagram" className="hover:text-navy-800 transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-navy-800 transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" aria-label="Facebook" className="hover:text-navy-800 transition-colors">
              <Facebook className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
