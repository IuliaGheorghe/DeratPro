import { useEffect, useRef } from 'react'
import { site } from '../data/site'
import '../css/hero.css'

type Props = {
  tagline?: string
}

export default function Hero({ tagline = 'Deratizare · Dezinsecție · Dezinfecție' }: Props) {
  const track = useRef<HTMLElement>(null)
  const base = useRef<HTMLCanvasElement>(null)
  const over = useRef<HTMLCanvasElement>(null)
  const logo = useRef<HTMLDivElement>(null)
  const word = useRef<HTMLDivElement>(null)
  const cue = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    let dispose: (() => void) | undefined

    import('../hero/dirtScene')
      .then(({ createDirtScene }) => {
        if (cancelled || !track.current || !base.current || !over.current || !logo.current || !word.current || !cue.current) return
        try {
          dispose = createDirtScene({
            track: track.current,
            base: base.current,
            over: over.current,
            logo: logo.current,
            word: word.current,
            cue: cue.current,
            photo: '/hero.jpg',
            zoom: [1.1, 1],
          })
        } catch (err) {
          console.warn('Animația WebGL nu a putut porni, afișăm varianta statică.', err)
          track.current.classList.add('no-gl')
        }
      })
      .catch(() => track.current?.classList.add('no-gl'))

    return () => {
      cancelled = true
      dispose?.()
    }
  }, [])

  return (
    <section id="hero" className="hero" ref={track}>
      <div className="hero-stage">
        <canvas className="hero-base" ref={base} aria-hidden="true" />
        <div className="hero-scrim" />

        <div className="hero-content">
          <span className="hero-badge">
            <i />
            Autorizați DDD · Intervenții 24/7
          </span>
          <h1>
            Dăunătorii pleacă.
            <br />
            <em>Liniștea rămâne.</em>
          </h1>
          <p>
            Deratizare, dezinsecție și dezinfecție pentru case, blocuri și afaceri. Venim repede, tratăm cu biocide
            avizate și îți lăsăm în scris garanția și actele cerute la orice control.
          </p>
          <div className="hero-ctas">
            <a className="btn btn-primary" href="#contact">
              Programează o inspecție gratuită<span className="arrow">→</span>
            </a>
            <a className="btn hero-ghost" href={site.phoneHref}>
              Sună acum
            </a>
          </div>
        </div>

        <canvas className="hero-over" ref={over} aria-hidden="true" />

        <div className="hero-logo" ref={logo}>
          <div className="hero-word" ref={word} aria-label="DeratPro">
            <span className="hero-derat" data-text="Derat">
              Derat
            </span>
            <span>Pro</span>
            <i />
          </div>
          <div className="hero-tag">{tagline}</div>
        </div>

        <div className="hero-cue" ref={cue}>
          <span>Derulează pentru curățare</span>
          <b />
        </div>
      </div>
    </section>
  )
}
