import { site } from '../data/site'
import '../css/contact.css'

export default function Contact() {
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
          </div>

          <form className="contact-form" noValidate>
            <label>
              <span>Nume*</span>
              <input type="text" autoComplete="name" maxLength={60} placeholder="Alexandru Popescu" />
            </label>

            <div className="contact-row">
              <label>
                <span>Telefon *</span>
                <input  type="tel" inputMode="numeric" autoComplete="tel" maxLength={14} placeholder="0720000000" />
              </label>
              <label>
                <span>Email</span>
                <input type="email" autoComplete="email" maxLength={120} placeholder="email@exemplu.ro" />
              </label>
            </div>

            <label>
              <span>Ce ai observat? *</span>
              <textarea
                rows={4}
                maxLength={1000}
                placeholder="De o săptămâna, în fiecare dimineață găsesc gândaci în bucătărie dimineața. Am un apartament cu 2 camere, la etajul 3."
              />
            </label>

            <button className="btn btn-primary contact-submit" type="submit">
              Trimite cererea<span className="arrow">→</span>
            </button>
            <p className="contact-note">Folosim datele doar ca să te contactăm pentru această cerere.</p>
          </form>
        </div>
      </div>
    </section>
  )
}
