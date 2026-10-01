import { navLinks, site } from '../data/site'
import '../css/footer.css'

const legal = [
  { href: '#', label: 'Termeni și condiții' },
  { href: '#', label: 'Politica de confidențialitate' },
  { href: '#', label: 'Politica de cookies' },
  { href: 'https://anpc.ro', label: 'ANPC', external: true },
  { href: 'https://consumer-redress.ec.europa.eu', label: 'SOL', external: true },
]

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-col footer-about">
          <a className="footer-brand" href="#hero">
            <span>Derat</span>Pro<i />
          </a>
          <p>
            Deratizare, dezinsecție și dezinfecție pentru locuințe, asociații de proprietari și afaceri. Biocide avizate,
            documente valabile la control și garanție scrisă la fiecare intervenție.
          </p>
        </div>

        <div className="footer-col">
          <h4>Link-uri rapide</h4>
          <ul>
            {navLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <h4>Dispecerat</h4>
          <ul>
            <li>
              <a href={site.phoneHref}>{site.phone}</a>
            </li>
            <li>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </li>
            <li>{site.hours}</li>
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <div className="footer-bottom-inner">
          <span>
            © {year} DeratPro SRL · CUI RO00000000 · J00/0000/0000
          </span>
          <nav>
            {legal.map((l) => (
              <a key={l.label} href={l.href} {...(l.external ? { target: '_blank', rel: 'noreferrer' } : {})}>
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}
