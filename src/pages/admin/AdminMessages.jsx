import { useEffect, useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { api } from '../../lib/api'

export default function AdminMessages() {
  const { t } = useLanguage()
  const [messages, setMessages] = useState([])
  const [subscribers, setSubscribers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      api.get('/api/admin/contact-messages', { auth: true }),
      api.get('/api/admin/newsletter-subscribers', { auth: true }),
    ])
      .then(([messagesData, subscribersData]) => {
        setMessages(messagesData.messages)
        setSubscribers(subscribersData.subscribers)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-sm text-navy-400">{t('account.loading')}</p>
  if (error) return <p className="text-xs text-red-600">{error}</p>

  return (
    <div className="space-y-14">
      <section>
        <h2 className="text-lg font-serif text-navy-900 mb-6">{t('admin.messages.contactTitle')}</h2>
        {messages.length === 0 ? (
          <p className="text-sm text-navy-400">{t('admin.messages.empty')}</p>
        ) : (
          <div className="divide-y divide-navy-100">
            {messages.map((m) => (
              <div key={m.id} className="py-5">
                <div className="flex items-center justify-between gap-4 mb-1.5">
                  <p className="text-sm font-medium text-navy-900">
                    {m.first_name} {m.last_name}
                  </p>
                  <p className="text-xs text-navy-400">{new Date(m.created_at).toLocaleString()}</p>
                </div>
                <p className="text-xs text-navy-500 mb-2">{m.email}</p>
                <p className="text-sm text-navy-600 leading-relaxed">{m.message}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-serif text-navy-900 mb-6">
          {t('admin.messages.newsletterTitle')} ({subscribers.length})
        </h2>
        {subscribers.length === 0 ? (
          <p className="text-sm text-navy-400">{t('admin.messages.empty')}</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {subscribers.map((s) => (
              <span key={s.id} className="text-xs bg-navy-50 text-navy-700 px-3 py-1.5">
                {s.email}
              </span>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
