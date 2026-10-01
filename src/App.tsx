import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import Why from './components/Why'
import How from './components/How'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero tagline="Deratizare · Dezinsecție · Dezinfecție" />
        <Services />
        <Why />
        <How />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
