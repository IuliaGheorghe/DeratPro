import '../css/why.css'

type Card = { kicker: string; title: string; text: string; foot: string }

const left: Card[] = [
  {
    kicker: 'Viteză',
    title: 'Ajungem în aceeași zi',
    text: 'Echipe mobile în teren și programări inclusiv în weekend. Cu cât intervenim mai devreme, cu atât tratamentul e mai scurt și costă mai puțin.',
    foot: 'Timp mediu de răspuns: sub 90 de minute',
  },
  {
    kicker: 'Siguranță',
    title: 'Sigur pentru copii și animale',
    text: 'Lucrăm doar cu biocide avizate, în doze calculate pentru spațiul tău. Îți spunem exact când te poți întoarce în cameră.',
    foot: 'Fișa tehnică a fiecărei substanțe, inclusă',
  },
]

const right: Card[] = [
  {
    kicker: 'Experiență',
    title: 'Tehnicieni, nu doar aplicatori',
    text: 'Recunoaștem specia și sursa, nu doar urmele. De aici vine tratamentul care ține, nu cel pe care îl repeți peste o lună.',
    foot: 'Certificare profesională reînnoită periodic',
  },
  {
    kicker: 'Garanție',
    title: 'Dacă revin ei, revenim și noi',
    text: 'Garanția o primești în scris. Dacă dăunătorii reapar în perioada acoperită, refacem tratamentul fără niciun cost.',
    foot: 'Garanție trecută direct pe procesul-verbal',
  },
]

function WhyCard({ c, tone, delay }: { c: Card; tone: 'a' | 'b'; delay: number }) {
  return (
    <div className={`why-card why-${tone}`} data-aos="fade-up" data-aos-delay={delay}>
      <div className="why-body">
        <span className="why-kicker">{c.kicker}</span>
        <h3>{c.title}</h3>
        <p>{c.text}</p>
      </div>
      <div className="why-foot">{c.foot}</div>
    </div>
  )
}

export default function Why() {
  return (
    <section id="avantaje" className="why section">
      <div className="container why-inner">
        <div className="section-head center" data-aos="fade-up">
          <span className="eyebrow">De ce DeratPro?</span>
          <h2 className="h2">
            Contează ce se întâmplă <em>după ce plecăm.</em>
          </h2>
          <p className="lead">
            Orice firmă poate interveni. Diferența o fac viteza, siguranța și ce faci dacă problema revine.
          </p>
        </div>

        <div className="why-grid">
          <div className="why-col">
            <WhyCard c={left[0]} tone="a" delay={0} />
            <WhyCard c={left[1]} tone="b" delay={100} />
          </div>

          <figure className="why-photo" data-aos="zoom-in" data-aos-delay="150">
            <img src="/why.jpg" alt="Tehnician DeratPro la intervenție" />
          </figure>

          <div className="why-col">
            <WhyCard c={right[0]} tone="b" delay={200} />
            <WhyCard c={right[1]} tone="a" delay={300} />
          </div>
        </div>
      </div>
    </section>
  )
}
