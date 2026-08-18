import { useEffect, useRef, useState } from 'react'
import { Sparkles, X, Send } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import { api } from '../lib/api'

const SUGGESTION_KEYS = ['beachTrip', 'snorkeling', 'returns']

export default function AIAssistant() {
  const { t, language } = useLanguage()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, sending])

  const sendMessage = async (text) => {
    const content = text.trim()
    if (!content || sending) return
    setError('')
    const nextMessages = [...messages, { role: 'user', content }]
    setMessages(nextMessages)
    setInput('')
    setSending(true)
    try {
      const data = await api.post('/api/chat', { messages: nextMessages, language })
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }])
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  const onSubmit = (e) => {
    e.preventDefault()
    sendMessage(input)
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={t('assistant.toggleLabel')}
        className="fixed bottom-6 right-6 rtl:right-auto rtl:left-6 z-40 w-[52px] h-[52px] rounded-full bg-navy-800 text-white flex items-center justify-center shadow-lg hover:bg-navy-900 transition-colors"
      >
        {open ? <X className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 rtl:right-auto rtl:left-6 z-40 w-[340px] max-w-[calc(100vw-3rem)] bg-sand border border-navy-100 shadow-xl flex flex-col">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-navy-100">
            <Sparkles className="w-4 h-4 text-navy-700" strokeWidth={1.5} />
            <h3 className="font-serif text-base text-navy-900">{t('assistant.title')}</h3>
          </div>

          <div ref={scrollRef} className="p-5 h-[380px] overflow-y-auto space-y-3">
            {messages.length === 0 ? (
              <>
                <p className="text-sm text-navy-700 mb-3">{t('assistant.greeting')}</p>
                <div className="flex flex-col gap-2">
                  {SUGGESTION_KEYS.map((key) => (
                    <button
                      key={key}
                      onClick={() => sendMessage(t(`assistant.suggestions.${key}`))}
                      className="text-left rtl:text-right border border-navy-100 px-3.5 py-2.5 text-sm text-navy-700 hover:border-navy-400 hover:text-navy-900 transition-colors"
                    >
                      {t(`assistant.suggestions.${key}`)}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              messages.map((m, i) => (
                <div
                  key={i}
                  className={`text-sm px-3.5 py-2.5 max-w-[85%] whitespace-pre-wrap ${
                    m.role === 'user'
                      ? 'bg-navy-800 text-white ml-auto rtl:ml-0 rtl:mr-auto'
                      : 'bg-white text-navy-800 border border-navy-100'
                  }`}
                >
                  {m.content}
                </div>
              ))
            )}
            {sending && <p className="text-xs text-navy-400">{t('assistant.thinking')}</p>}
            {error && <p className="text-xs text-red-600">{error}</p>}
          </div>

          <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-navy-100 p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('assistant.placeholder')}
              disabled={sending}
              className="flex-1 border border-navy-100 px-3 py-2 text-sm focus:outline-none focus:border-navy-400 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              aria-label={t('assistant.send')}
              className="w-9 h-9 shrink-0 flex items-center justify-center bg-navy-800 text-white disabled:opacity-40 hover:bg-navy-900 transition-colors"
            >
              <Send className="w-3.5 h-3.5 rtl:-scale-x-100" />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
