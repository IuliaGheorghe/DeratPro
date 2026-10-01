import '../css/how.css'

const steps = [
  {
    n: '01',
    title: 'Ne spui ce ai observat',
    text: 'Ne suni sau completezi formularul. Câteva întrebări simple ne ajută să estimăm costul și să-ți propunem o oră de intervenție, de obicei chiar în aceeași zi.',
    tone: 'green',
  },
  {
    n: '02',
    title: 'Inspectăm și alegem tratamentul',
    text: 'Tehnicianul identifică dăunătorul, sursa și căile de acces. Înainte să înceapă, îți explică ce aplică, unde și cât timp trebuie să eviți camera.',
    tone: 'blue',
  },
  {
    n: '03',
    title: 'Tratăm și îți lăsăm actele',
    text: 'La final primești procesul-verbal, fișele substanțelor și certificatul de garanție, valabile la orice control DSP sau DSVSA. Fără hârtii lipsă, fără drumuri în plus.',
    tone: 'navy',
  },
]

export default function How() {
  return (
    <section id="proces" className="how section">
      <div className="container how-inner">
        <div className="section-head center" data-aos="fade-up">
          <span className="eyebrow">Cum funcționează?</span>
          <h2 className="h2">
            De la primul telefon la <em>casă curată</em>, în trei pași
          </h2>
          <p className="lead">Fără vizite inutile și fără surprize la plată. Afli prețul înainte să începem.</p>
        </div>

        <ol className="how-steps">
          {steps.map((s, i) => (
            <li key={s.n} className={`how-step how-${s.tone}`} data-aos="fade-up" data-aos-delay={i * 120}>
              <span className="how-num">{s.n}</span>
              <div className="how-box">
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
