import { useState } from 'react'
import { Mail, MapPin, Phone } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

export default function Contact() {
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(false)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', message: '' })

  const onChange = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()

    if (!supabase) {
      setSent(true)
      return
    }

    setSubmitting(true)
    setError(false)
    const { error: insertError } = await supabase.from('contact_messages').insert({
      first_name: form.firstName,
      last_name: form.lastName,
      email: form.email,
      message: form.message,
    })

    setSubmitting(false)
    if (insertError) {
      setError(true)
      return
    }
    setSent(true)
  }

  return (
    <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-16 sm:py-20 grid grid-cols-1 lg:grid-cols-2 gap-16">
      <div>
        <p className="section-eyebrow">Get In Touch</p>
        <h1 className="font-serif text-4xl sm:text-5xl text-navy-900 mb-6">
          We&apos;d Love to Hear From You
        </h1>
        <p className="text-sm text-navy-500 leading-relaxed max-w-md mb-10">
          For concierge styling, trade inquiries, or press requests, reach our team directly —
          we typically respond within one business day.
        </p>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <Mail className="w-4 h-4 text-navy-600 mt-1" strokeWidth={1.5} />
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-navy-800 mb-1">Email</p>
              <p className="text-sm text-navy-500">concierge@aquaatelier.com</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Phone className="w-4 h-4 text-navy-600 mt-1" strokeWidth={1.5} />
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-navy-800 mb-1">Phone</p>
              <p className="text-sm text-navy-500">+1 (415) 555-0148</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <MapPin className="w-4 h-4 text-navy-600 mt-1" strokeWidth={1.5} />
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-navy-800 mb-1">Atelier</p>
              <p className="text-sm text-navy-500">14 Rue des Ateliers, Antibes, France</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-sand-100 border border-navy-100 p-8 sm:p-10">
        {sent ? (
          <p className="text-sm text-navy-700">
            Thank you — your message has been received. Our concierge team will be in touch
            shortly.
          </p>
        ) : (
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <label className="block">
                <span className="block text-[10px] font-medium uppercase tracking-widest text-navy-400 mb-2">
                  First Name
                </span>
                <input
                  required
                  value={form.firstName}
                  onChange={onChange('firstName')}
                  className="input-field"
                />
              </label>
              <label className="block">
                <span className="block text-[10px] font-medium uppercase tracking-widest text-navy-400 mb-2">
                  Last Name
                </span>
                <input
                  required
                  value={form.lastName}
                  onChange={onChange('lastName')}
                  className="input-field"
                />
              </label>
            </div>
            <label className="block">
              <span className="block text-[10px] font-medium uppercase tracking-widest text-navy-400 mb-2">
                Email Address
              </span>
              <input
                required
                type="email"
                value={form.email}
                onChange={onChange('email')}
                className="input-field"
              />
            </label>
            <label className="block">
              <span className="block text-[10px] font-medium uppercase tracking-widest text-navy-400 mb-2">
                Message
              </span>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={onChange('message')}
                className="input-field resize-none"
              />
            </label>
            <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
              {submitting ? 'Sending…' : 'Send Message'}
            </button>
            {error && (
              <p className="text-xs text-navy-400">
                Something went wrong sending your message — please try again.
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  )
}
