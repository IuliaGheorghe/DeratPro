import type { ReactNode } from 'react'
import { BugIcon, MicrobeIcon, RodentIcon } from './Icons'
import '../css/services.css'

type Service = { icon: ReactNode; title: string; text: string; items: string[]; tone: 'green' | 'blue' }

const services: Service[] = [
  {
    icon: <RodentIcon />,
    title: 'Deratizare profesională',
    text: 'Montăm stații de momeală sigilate exact pe traseele pe care circulă șoarecii și șobolanii. Copiii și animalele de companie nu au acces la ele.',
    items: ['Stații securizate, închise cu cheie', 'Momeli rezistente la umezeală și frig', 'Vizite de control până la eliminarea completă'],
    tone: 'green',
  },
  {
    icon: <BugIcon />,
    title: 'Dezinsecție eficientă',
    text: 'Gândaci, ploșnițe, purici sau furnici: gel aplicat punctual în ascunzători și nebulizare rece pentru fisuri. La majoritatea tratamentelor nu trebuie să pleci de acasă.',
    items: ['Fără miros persistent', 'Efect remanent de până la 90 de zile', 'Al doilea tratament inclus pentru ouăle de ploșnițe'],
    tone: 'blue',
  },
  {
    icon: <MicrobeIcon />,
    title: 'Dezinfecție și sterilizare',
    text: 'Nebulizare cu biocide avizate împotriva bacteriilor, virusurilor și mucegaiului. Suprafețele rămân curate, fără pete, coroziune sau miros.',
    items: ['Acțiune bactericidă, virucidă și fungicidă', 'Potrivită pentru spații cu alimente', 'Documente valabile la control DSP'],
    tone: 'green',
  },
]

export default function Services() {
  return (
    <section id="servicii" className="services section">
      <div className="container services-inner">
        <div className="services-head">
          <div className="section-head" data-aos="fade-up">
            <span className="eyebrow">Ce rezolvăm?</span>
            <h2 className="h2">
              Fiecare dăunător are un punct slab. <em>Noi știm unde e.</em>
            </h2>
          </div>
          <p className="lead services-lead" data-aos="fade-up" data-aos-delay="100">
            Nu pulverizăm la întâmplare. Identificăm specia, sursa și traseele, apoi alegem tratamentul care o oprește
            definitiv, nu doar o sperie pentru câteva zile.
          </p>
        </div>

        <div className="services-grid">
          {services.map((s, i) => (
            <article key={s.title} className={`service-card tone-${s.tone}`} data-aos="fade-up" data-aos-delay={i * 100}>
              <span className="service-icon">{s.icon}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <ul>
                {s.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
