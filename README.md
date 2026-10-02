# DeratPro

Landing page pentru DeratPro, o firma (fictiva) de deratizare, dezinsectie si dezinfectie pentru clienti casnici si comerciali.

Live: [deratpro-iulia.netlify.app](https://deratpro-iulia.netlify.app/) 

## Rulare locala

Cerinte: Node.js 20.19+ sau 22.12+ (cerinta Vite 8) si npm.

```bash
git clone [repo]
cd deratpro
npm install
npm run dev
```

Alte comenzi:

```bash
npm run build     # verifica TypeScript si genereaza build-ul in dist/
npm run preview   # serveste local build-ul de productie
```

## Tehnologii

- React 19 + TypeScript, Vite 8
- Three.js (r186) pentru animatia din hero
- AOS pentru animatiile la scroll din restul paginii
- CSS, cate un fisier pentru fiecare componenta, cu variabile comune in `global.css`
- Fontul Plus Jakarta Sans (Google Fonts)

## Structura

```
src/
  components/    cate o componenta pentru fiecare sectiune (Navbar, Hero, Services, Why, How, Contact, Footer) + Icons
  css/           stilurile fiecarei componente + global.css
  data/site.ts   telefon, email, linkuri de meniu (folosite in mai multe locuri)
  hero/          animatia: scena, shadere, geometrii, logo 3D si fontul logo-ului
public/          imaginile (licentiate, descarcate de pe Freepik (Magnific))
```

## Design

Am pornit conceptul in Google Stitch ([stitch.withgoogle.com](https://stitch.withgoogle.com/)).

Primul prompt:

```
Avem un client numit DeratPro, o firma de servicii de deratizare, dezinsectie si dezinfectie
pentru clienti casnici si comerciali.
Trebuie sa realizam un LP al carui scop va fi generarea de leads.
Sectiunile pe care le vom avea sunt:

Hero: H1, Subtitlu, CTA

Servicii (deratizare, dezinsectie, dezinfectie), fiecare cu titlu, scurta descriere si iconita

De ce DeratPro: 3-4 avantaje (ex: interventie rapida, substante avizate, personal autorizat,
garantie); aici trebuie sa scoatem sectiunea in evidenta

Cum functioneaza: proces in 3 pasi (ex: Ne suni - Evaluare - Interventie)

Contact: formular simplu (nume, telefon, mesaj)

Avand in vedere ca vorbim de un LP, ma intereseaza sa existe diversitate intre sectiuni (contrast,
componente diferite, nu acelasi tip de box majoritar), structura relevanta pentru conversie. Paleta de
culori trebuie sa inspire profesionalism (as merge pe verde + albastru, dar clean, cu suficient white space)
```

Am continuat cu cateva iteratii:

```
Hero: scoatem imaginea din lateral, numerele, badge-urile (ex.: "grad medical"). Titlul sa fie mai scurt.
```

```
"De ce sa ne alegi pe noi" arata foarte similar cu primele box-uri, as pune o imagine pe centru si detaliile in jurul ei.
```

```
Pasii ar trebui sa arate diferit. I-as pune unul sub altul, fara icons, iar numerele sa iasa din box, fiind plasate deasupra.
```

```
La contact pastram doar nume, telefon si mesaj. As adauga de fapt si email-ul optional.
```

## Cum am lucrat

Varianta din Stitch era destul de aglomerata, asa ca am folosit-o doar ca baza. Animatia din hero am gandit-o si am construit-o impreuna cu Claude Opus 5.5 (High Effort), iterand pana am ajuns la o varianta apropiata de cea finala. Tot in aceasta etapa am rescris textele, ca sa vorbeasca mai mult despre ce castiga clientul si sa devina mai convingatoare.

Apoi am facut mai multe ajustari proprii:

- curatarea se face orizontal, de jos in sus, ca o laveta
- textul si butoanele din hero stau sub stratul de murdarie si se curata odata cu restul
- logo-ul 3D este usor aplecat in fata; sclipirea de la final trece peste "Derat"
- continutul de sub hero apare pe la jumatatea animatiei, ca scroll-ul sa nu para prea lung
- pentru servicii am scos etichetele si link-urile generate de Stitch, am aliniat bulinele cu primul rand de text si am trecut pe albastru in loc de maro
- la "De ce DeratPro" am ajustat card-urile pentru un efect mai clean, cu o bara bleumarin jos
- in cazul pasilor, am modificat stilizarea numerelor (le-am facut colorate si le-am repozitionat)
- am schimbat aliniamentul footer-ului, spatierile si containerele sectiunilor pentru o coerenta mai buna
- am adaugat un meniu burger sub 991px si am adaptat hero-ul pe ecrane cu height redus

## Animatia din hero

Ideea: cand apare DeratPro, haosul dispare.

La incarcare, camera din fundal e acoperita de praf, pete, scame si panze de paianjen in colturi. Pe masura ce dai scroll, logo-ul DeratPro urca, iar un front de curatare trece de jos in sus si lasa camera curata.

## Decizii

- **Conceptul.** Initial voiam un soricel fugarit de un aspirator. Avand timp limitat si neavand modele 3D, am ales o idee mai sigura, dar legata direct de activitatea firmei.
- **Lazy-load.** Codul animatiei se afla intr-un fisier separat, incarcat cu `import()` dinamic. Restul paginii se incarca imediat.
- **Fallback.** Daca WebGL nu poate porni, pagina afiseaza fotografia curata si logo-ul in HTML, iar restul site-ului merge normal.
- **Performanta.** Animatia se opreste cand hero-ul iese din ecran (IntersectionObserver), rezolutia este limitata la un device pixel ratio de 1.75, iar pe mobil sunt mai putine particule.
- **Accesibilitate.** Respect `prefers-reduced-motion`, focus vizibil, meniul si popup-ul se inchid cu Esc, iar formularul afiseaza erorile langa fiecare camp.
- **Formular.** Nume (minim 3 litere), telefon (cifre, 10 caractere), email optional (validat doar daca este completat) si mesaj (minim 20 de caractere). Nu se trimit date; dupa validare se afiseaza un mesaj de confirmare.
- **Datele companiei.** Telefonul, emailul si meniul sunt in `src/data/site.ts`, folosite in header, hero, contact si footer.

## Compromisuri

- **O mica latenta la load.** Pentru ca animatia se incarca separat, hero-ul are pentru o fractiune de secunda un fundal inchis, pana porneste animatia.
- **AOS**: o biblioteca mai veche, dar simpla si suficienta pentru animatiile de intrare.