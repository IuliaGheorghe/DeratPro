import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { site } from '../data/site'
import '../css/contact.css'

type Fields = { name: string; phone: string; email: string; message: string }
type Errors = Partial<Record<keyof Fields, string>>

const empty: Fields = { name: '', phone: '', email: '', message: '' }

function validate(v: Fields): Errors {
  const e: Errors = {}
  const name = v.name.trim()
  if (!name) e.name = 'Spune-ne cum te numești.'
  else if (name.length < 3) e.name = 'Numele trebuie să aibă cel puțin 3 caractere.'
  else if (!/^[\p{L}\s'-]+$/u.test(name)) e.name = 'Folosește doar litere, spații sau cratimă.'

  if (!v.phone) e.phone = 'Avem nevoie de un număr ca să te sunăm.'
  else if (!/^\d+$/.test(v.phone)) e.phone = 'Numărul poate conține doar cifre.'
  else if (v.phone.length < 10) e.phone = 'Numărul trebuie să aibă 10 cifre.'

  const email = v.email.trim()
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) e.email = 'Adresa de email nu pare validă.'

  const msg = v.message.trim()
  if (!msg) e.message = 'Descrie pe scurt problema.'
  else if (msg.length < 20) e.message = `Mai adaugă câteva detalii (minimum 20 de caractere, ai ${msg.length}).`

  return e
}

export default function Contact() {
  const [values, setValues] = useState<Fields>(empty)
  const [errors, setErrors] = useState<Errors>({})
  const [tried, setTried] = useState(false)
  const [sentTo, setSentTo] = useState<string | null>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)

  const update = (key: keyof Fields) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const raw = e.target.value
    const value = key === 'phone' ? raw.replace(/\D/g, '').slice(0, 14) : raw
    const next = { ...values, [key]: value }
    setValues(next)
    if (tried) setErrors(validate(next))
  }

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setTried(true)
    const found = validate(values)
    setErrors(found)
    const first = Object.keys(found)[0]
    if (first) {
      document.getElementById(`form-${first}`)?.focus()
      return
    }
    setSentTo(values.name.trim().split(/\s+/)[0])
    setValues(empty)
    setTried(false)
  }

  useEffect(() => {
    if (!sentTo) return
    closeBtn.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSentTo(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [sentTo])

  const field = (key: keyof Fields) => ({
    id: `form-${key}`,
    value: values[key],
    onChange: update(key),
    'aria-invalid': !!errors[key],
    'aria-describedby': errors[key] ? `err-${key}` : undefined,
  })

  const error = (key: keyof Fields) =>
    errors[key] && (
      <span className="field-error" id={`err-${key}`}>
        {errors[key]}
      </span>
    )

  return (
    <section id="contact" className="contact section">
      <div className="container contact-inner">
        <div className="contact-info" data-aos="fade-right">
          <div className="section-head">
            <span className="eyebrow">Programează-te</span>
            <h2 className="h2">
              Spune-ne ce ai găsit. <em>Apoi ne ocupăm noi.</em>
            </h2>
            <p className="lead">
              Completează formularul și te sunăm rapid pentru o estimare de preț și o oră de intervenție.
            </p>
          </div>

          <div className="contact-call">
            <img src="/contact.jpg" alt="Echipa DeratPro" />
            <div className="contact-call-body">
              <span>Ai o urgență? Sună-ne direct</span>
              <a href={site.phoneHref}>{site.phone}</a>
              <p>Dispeceratul răspunde 24/7, inclusiv în weekend și de sărbători.</p>
            </div>
          </div>

          <ul className="contact-points">
            <li>Afli prețul înainte de intervenție</li>
            <li>Fără taxă de deplasare în zona de acoperire</li>
            <li>Factură și documente pentru firme și asociații</li>
          </ul>
        </div>

        <div className="contact-card" data-aos="fade-left" data-aos-delay="100">
          <div className="contact-card-head">
            <h3>Cere o inspecție gratuită</h3>
            <p>Durează sub un minut. Câmpurile marcate cu * sunt obligatorii.</p>
          </div>

          <form className="contact-form" onSubmit={submit} noValidate>
            <label className={errors.name ? 'has-error' : ''}>
              <span>Nume*</span>
              <input {...field('name')} type="text" autoComplete="name" maxLength={60} placeholder="ex. Alexandru Popescu" />
              {error('name')}
            </label>

            <div className="contact-row">
              <label className={errors.phone ? 'has-error' : ''}>
                <span>Telefon*</span>
                <input {...field('phone')} type="tel" inputMode="numeric" autoComplete="tel" maxLength={14} placeholder="07xxxxxxxx" />
                {error('phone')}
              </label>
              <label className={errors.email ? 'has-error' : ''}>
                <span>Email</span>
                <input {...field('email')} type="email" autoComplete="email" maxLength={120} placeholder="optional@exemplu.ro" />
                {error('email')}
              </label>
            </div>

            <label className={errors.message ? 'has-error' : ''}>
              <span>Ce ai observat?*</span>
              <textarea
                {...field('message')}
                rows={4}
                maxLength={1000}
                placeholder="De o săptămâna, în fiecare dimineață găsesc gândaci în bucătărie dimineața. Am un apartament cu 2 camere, la etajul 3."
              />
              {error('message')}
            </label>

            <button className="btn btn-primary contact-submit" type="submit">
              Trimite cererea<span className="arrow">→</span>
            </button>
            <p className="contact-note">Folosim datele doar ca să te contactăm pentru această cerere.</p>
          </form>
        </div>
      </div>

      {sentTo && (
        <div className="modal" onClick={() => setSentTo(null)}>
          <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={(e) => e.stopPropagation()}>
            <div className="modal-check" />
            <h3 id="modal-title">Mulțumim, {sentTo}!</h3>
            <p>
              Cererea ta a ajuns la noi. Te sunăm curând. Dacă ai o urgență, poți suna oricând la{' '}
              <a href={site.phoneHref}>{site.phone}</a>.
            </p>
            <button className="btn btn-primary" ref={closeBtn} onClick={() => setSentTo(null)}>
              Am înțeles
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
