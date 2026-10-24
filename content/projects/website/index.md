---
published: true
title: This website
title_de: Diese Website
slug: website
category: '[Web] 2026'
order: 4
cover_image: /Images/projects/website/startseite.webp
cover_image_alt: 'Home page of janwestphal.dev: the headline “Hardware, games & graphics from Kiel” next to a fan of four project cards'
cover_image_alt_de: 'Startseite von janwestphal.dev: die Überschrift „Hardware, Games & Grafik aus Kiel“ neben einem Fächer aus vier Projektkarten'
summary_card: My portfolio as a project. Static, bilingual, fast and editable with a CMS.
summary_card_de: Mein Portfolio als Projekt. Statisch, zweisprachig, schnell und editierbar mit einem CMS.
summary: |-
  janwestphal.dev is my portfolio, and building it was a project of its own. The goal: a site that shows my work properly, loads fast, works without tracking or cookies, is available in German and English, and that I can maintain through a CMS without touching code.

  The guiding principle for the design: usability and accessibility come before effects. The layout follows established HCI principles and design standards; animations are there to support orientation, never as an end in themselves.

  The site is generated with Eleventy and hosted on GitHub Pages. Every push builds it from scratch: both language versions, all images in several sizes and the redirects for old addresses. The source code is public on GitHub.
summary_de: |-
  janwestphal.dev ist mein Portfolio und ihr Aufbau ein eigenes Projekt. Das Ziel: eine Seite, die meinen Arbeiten eine Platform gibt, schnell lädt, ohne Tracking und Cookies auskommt, auf Deutsch und Englisch erreichbar ist und die ich über ein CMS pflegen kann, ohne ständig Code anzufassen.

  Leitlinie für die Gestaltung: Usability und Barrierefreiheit gehen vor Effekten. Das Layout folgt etablierten HCI-Prinzipien und Designnormen, Animationen sollen Orientierung geben und sind (fast) nie Selbstzweck.

  Die Seite wird mit Eleventy erzeugt und liegt auf GitHub Pages. Der Quellcode ist öffentlich auf GitHub.

  In naher Zukunft soll die Site die WCAG 2.2 (_Web Content Accessibility Guidelines)_ erfüllen.
meta:
  - Website, solo project
  - 'Status: live, continuously developed'
meta_de:
  - Website, Soloprojekt
  - 'Status: online, wird laufend weiterentwickelt'
flipbooks: []
models_intro: null
models: []
case:
  role:
    de: 'Soloprojekt: Konzept, Gestaltung, Entwicklung und Inhalte'
    en: 'Solo project: concept, design, development and content'
  duration:
    de: Seit Frühjahr 2026, Überarbeitung im Sommer 2026 und aktuell Herbst 2026
    en: Since spring 2026, redesign in autumn 2026
  tools:
    - Eleventy
    - Nunjucks
    - Markdown
    - Sveltia CMS
    - GitHub Actions
    - GitHub Pages
    - eleventy-img
    - three.js
    - Claude (AI assistant)
  hardware: []
  links:
    - label:
        de: Quellcode auf GitHub
        en: Source code on GitHub
      url: https://github.com/JanWestphal91/JanWestphal91.github.io
  sections:
    - heading:
        de: Ziel
        en: Goal
      body:
        de: |-
          Die Seite hat zwei Zielgruppen: Arbeitgeber aus Embedded-Entwicklung, Medientechnik und Game Development und alle, die sich für meine Projekte interessieren. Beide sollen schnell sehen, was ich baue und wie ich arbeite. Daraus ergaben sich ein paar feste Anforderungen:

          - **Schnell und statisch:** kein Server, keine Datenbank, nur HTML CSS und JS. Das hält die Seite schnell, sicher und kostenlos im Betrieb. Außerdem konnte ich so das Modul Webanwendungen im Sommersemester 2026 vertiefen.
          - **Zwei Sprachen:** Deutsch als Hauptsprache, Englisch für alle anderen, mit eigenen Adressen, damit Suchmaschinen beide Fassungen finden.
          - **Pflegbar ohne Code:** Neue Projekte und Blogbeiträge entstehen in einem CMS im Browser.
          - **Datenschutz:** kein Tracking, keine Cookies, Schriften liegen auf der eigenen Seite. Videos und eingebettete Spiele laden erst nach einem Klick.
        en: |-
          The site has two audiences: employers in embedded development, media technology and game development, and people who are interested in my projects. Both should see quickly what I build and how I work. That led to a few fixed requirements:

          - **Fast and static:** no server, no database, just HTML files. That keeps the site fast, secure and cheap to run.
          - **Two languages:** German as the main language, English for everyone else – with its own addresses, so search engines find both versions.
          - **Editable without code:** new projects and blog posts are written in a CMS in the browser.
          - **Privacy:** no tracking, no cookies, fonts hosted on the site itself. Videos and embedded games only load after a click.
      image: ''
      image_en: ''
      image_wide: false
      image_alt: null
      image_caption: null
    - heading:
        de: Aufbau
        en: Structure
      body:
        de: |-
          Jedes Projekt und jeder Blogbeitrag ist eine Markdown-Datei. Eleventy macht daraus fertige HTML-Seiten. Das CMS (Sveltia) schreibt genau in diese Dateien und committet sie ins Repository, es gibt keinen zweiten Datenspeicher.

          Bei jedem Push baut GitHub Actions die Seite und veröffentlicht sie auf GitHub Pages. GitHub Pages kann keine Weiterleitungen auf dem Server, deshalb bekommt jede alte Adresse eine kleine Seite, die sofort weiterleitet und Suchmaschinen per `canonical` die neue Adresse nennt.
        en: |-
          Every project and every blog post is a Markdown file with a header of structured data: title, category, images, the facts of the case study. Eleventy turns these files into HTML pages using Nunjucks templates. The CMS (Sveltia) writes into exactly these files and commits them to the repository – there is no second data store.

          On every push, GitHub Actions builds the site and publishes it on GitHub Pages. GitHub Pages cannot do server-side redirects, so old addresses get a small page that forwards immediately and points search engines to the new address via `canonical`.
      image: ''
      image_en: ''
      image_wide: false
      image_alt: null
      image_caption: null
    - heading:
        de: Zwei Sprachen ohne JavaScript
        en: Two languages without JavaScript
      body:
        de: 'Die Vorlagen schreiben jede Seite nur einmal: englischer Text im HTML, beide Sprachen zusätzlich als Attribute (`data-en`, `data-de`). Nach dem Build liest ein kleines eigenes Skript jede Seite ein und schreibt daraus zwei fertige Fassungen, Deutsch unter `/`, Englisch unter `/en/`. Jede Fassung enthält nur ihre eigene Sprache, das richtige `lang`-Attribut, eigenen Titel und eigene Beschreibung, Querverweise für Suchmaschinen (`hreflang`) und eine gemeinsame Sitemap. Jeder Text wird an einer Stelle gepflegt, und Besucher wie Screenreader bekommen die richtige Sprache durch die Browsereinstellung, ohne Umschalten im Browser.'
        en: |-
          The templates write every page only once: English text in the HTML, both languages additionally as attributes (`data-en`, `data-de`). After the build, a small script of my own reads every page and writes two finished versions from it – German under `/`, English under `/en/`. Each version contains only its own language, the right `lang` attribute, its own title and description, cross-references for search engines (`hreflang`) and a shared sitemap.

          The advantage: each text is maintained in one place, and visitors and screen readers get the right language from the first byte – without a language switch in the browser.
      image: ''
      image_en: ''
      image_wide: false
      image_alt: null
      image_caption: null
    - heading:
        de: Bilder
        en: Images
      body:
        de: |-
          Fotos kommen direkt aus der Kamera und sind oft mehrere Megabyte groß. Ein Plugin (eleventy-img) ersetzt beim Build jedes Bild durch ein `<picture>`-Element: fünf Breiten, jeweils als AVIF und WebP, dazu die echten Maße, damit beim Laden nichts springt. Der Browser lädt nur die Größe, die er wirklich braucht.

          Wirkung auf der Startseite: Die Bilder wiegen dort jetzt je nach Bildschirm zusammen 65 bis 125 KB, vorher musste ich alle Bilder über einen .webp Konverter erstmal umwandeln.
        en: |-
          Photos come straight from the camera and are often several megabytes. A plugin (eleventy-img) replaces every image during the build with a `<picture>` element: five widths, each as AVIF and WebP, plus the real dimensions so nothing jumps while loading. The browser picks the size it actually needs.

          Effect on the home page: the images now weigh 65 to 125 KB in total, depending on the screen – before, a single blog thumbnail was 4.4 MB.
      image: /Images/projects/website/blog.webp
      image_en: ''
      image_wide: false
      image_alt:
        de: Layout eines Blogbeitrags mit Textspalte links und dem passenden Bild rechts daneben
        en: Blog post layout with a text column on the left and the matching image on the right
      image_caption:
        de: Blogbeiträge – Textspalte, Bilder neben dem passenden Absatz
        en: Blog posts – text column with images next to the matching paragraph
    - heading:
        de: Interaktion
        en: Interaction
      body:
        de: |-
          Die Seite soll sich anfühlen wie meine Projekte, ein bisschen verspielt, aber nicht laut. Jede Bewegung hat eine Aufgabe, sie zeigt woher etwas kommt, was ausgewählt ist oder was sich anklicken lässt. Kein Inhalt hängt von einer Animation ab.

          - **Fächer:** Auf der Startseite liegen die aktuellen Projekte wie Spielkarten in der Hand. Beim Überfahren hebt sich eine Karte mit leichtem Nachfedern heraus und neigt sich zum Zeiger.
          - **Variable Schrift:** Bricolage Grotesque ist eine variable Schrift. In den großen Überschriften wird jeder Buchstabe kräftiger, je näher der Zeiger ist.
          - **3D-Modelle:** Modelle aus Blender lassen sich im Browser drehen (three.js). Die Ansicht „Wireframe“ zeigt die Kanten so, wie ich sie modelliert habe.
          - **Bilder und Galerien:** Angeklickte Bilder öffnen sich von ihrer Position mit einem Übergang zur Großansicht, lange Galerien bekommen links einen Index der der Scrollposition folgt sobald die Gallerie mehr als 4 Bilder hat.
        en: |-
          The site should feel like my projects: a little playful, but not loud. Every movement has a job – it shows where something comes from, what is selected or what can be clicked. No content depends on an animation.

          - **Fan of cards:** on the home page, the current projects lie like playing cards in a hand. Hovering lifts a card with a slight spring; it tilts towards the pointer with a highlight.
          - **Variable font:** Bricolage Grotesque is a variable font. In the large headlines, each letter gets heavier the closer the pointer is.
          - **3D models:** models from Blender can be rotated in the browser (three.js). The “Topology” view shows the edges as I modelled them – the export script carries the original quads along.
          - **Images and galleries:** clicked images grow smoothly from their position into the lightbox; long galleries get an index on the left that follows the scroll position.
      image: /Images/projects/website/topologie.webp
      image_en: ''
      image_wide: false
      image_alt:
        de: 3D-Ansicht mit einem Entenmodell in der Topologie-Ansicht, jede Kante als dünne Linie
        en: 3D viewer with a duck model in topology view, every edge drawn as a thin line
      image_caption:
        de: 3D-Ansicht in der Topologie-Darstellung
        en: 3D viewer in topology view
    - heading:
        de: 'Gestaltungsprinzipien: Usability vor Effekt'
        en: 'Design principles: usability before effects'
      body:
        de: |-
          Auffällige Effekte sind zwar eindrucksvoll, können aber schnell überfordern und sind oft nur Beiwerk der vom Inhalt ablenkt. Deshalb folgt die Gestaltung etablierten Prinzipien statt Trends:

          - **Interaktionsprinzipien (DIN EN ISO 9241-110):** Die Seite erklärt sich selbst (Beschriftungen statt reiner Symbole, die aktuelle Seite ist in der Navigation markiert), verhält sich erwartungskonform (Links sehen überall gleich aus und reagieren gleich) und bleibt steuerbar (Animationen lassen sich abschalten, Videos und Spiele laden erst auf Wunsch).
          - **Sichtbarer Zustand:** Was gerade aktiv ist, ist zu sehen, die unterstrichene Seite in der Navigation, die gehobene Karte mit „01 / 04“, das markierte Bild im Galerie Index und der Zustand des Animationsschalters.
          - **Lesbarkeit:** rund 65 Zeichen pro Zeile, im Browser gemessen, eine Schriftskala mit sieben Größen und klaren Abständen die Zusammengehöriges gruppieren.
          - **Gut zu treffen:** Klickflächen von mindestens 44 px, ganze Listenzeilen sind anklickbar statt nur der Titel.

          Barrierefreiheit gehört dazu und ist kein Zusatz. Ziel ist WCAG 2.2, Stufe AA:

          - **Bewegung ist freiwillig:** Der Schalter „Animationen“ stellt alle Bewegungen ab, und ohne eigene Wahl folgt die Seite der Einstellung des Betriebssystems (`prefers-reduced-motion`).
          - **Screenreader:** Animierte Überschriften enthalten ihren Text ein zweites Mal unsichtbar, damit das Wort vorgelesen wird und nicht einzelne Buchstaben; das Menü auf dem Handy meldet, ob es offen ist; jedes inhaltliche Bild hat eine Beschreibung in beiden Sprachen, rein dekorative werden für Screenreader ausgeblendet.
          - **Tastatur und Kontrast:** Alles ist mit der Tastatur und sichtbarem Fokus bedienbar, ein Sprunglink führt direkt zum Inhalt, und alle Texte erfüllen die AA-Kontrastwerte.
          - **Formular:** Fehler erscheinen direkt unter dem Feld, in der Sprache der Seite.
        en: |-
          Eye-catching effects are quickly built – a site that people can actually use takes more care. That is why the design follows established principles rather than trends:

          - **Interaction principles (ISO 9241-110):** the site describes itself (labels instead of icons alone, the current page is marked in the navigation), behaves as expected (links look and react the same everywhere) and stays under the visitor’s control (animations can be switched off, videos and games only load on request).
          - **Visible status:** whatever is currently active is shown – the underlined page in the navigation, the lifted card with “01 / 04”, the highlighted image in the gallery index, the state of the animation switch.
          - **Readability:** about 65 characters per line, measured in the browser; a type scale with seven sizes instead of fourteen; clear spacing that groups related content.
          - **Easy to hit:** click targets of at least 44 px, whole list rows are clickable instead of only the title.

          Accessibility is part of this, not an extra. The site aims at WCAG 2.2 level AA:

          - **Motion is optional:** the “Animations” switch turns off all movement, and without a choice the site follows the operating system (`prefers-reduced-motion`).
          - **Screen readers:** animated headlines contain their text a second time, invisibly, so the word is read and not single letters; the mobile menu reports whether it is open; every image with content has a description in both languages, purely decorative ones are hidden from screen readers.
          - **Keyboard and contrast:** everything works with the keyboard and a visible focus, a skip link leads straight to the content, and all text meets the AA contrast ratios.
          - **Forms:** errors appear directly below the field, in the language of the page.
      image: /Images/projects/website/mobil.webp
      image_en: ''
      image_wide: false
      image_alt:
        de: Drei Handy-Screenshots – Startseite, geöffnetes Menü mit dem Animationsschalter, Projektseite
        en: Three phone screenshots – home page, open menu with the animation switch, project page
      image_caption:
        de: Mobil Startseite, Menü und Projektseite
        en: Mobile home page, menu and project page
    - heading:
        de: Was ich gelernt habe und anders machen würde
        en: What I learned and would do differently
      body:
        de: |-
          - **Neu bauen statt überschreiben:** Die Überarbeitung ist als Schicht über den alten Stilen gewachsen. Das funktioniert, aber zwei Stylesheets mit vielen Überschreibungen sind schwerer zu pflegen als ein sauberes. Sie zusammenzuführen ist der nächste Schritt.
          - **Messen statt schätzen:** Zeilenlänge, Bildgrößen und Ladegewicht wurden erst richtig gut, als ich sie im Browser gemessen statt geschätzt habe.
          - **Die Plattform kennen:** GitHub Pages kann keine Weiterleitungen auf dem Server, und Windows unterscheidet in Ordnernamen nicht zwischen Groß- und Kleinschreibung. Beides hat bestimmt, wie die Weiterleitungen funktionieren.
          - **Techstack besser planen:** Im Laufe der Entwicklung sind einige komponenten wie Eleventy und Sveltia CMS erst später hinzu gekommen, nächstes mal würde ich mehr Zeit in die Planung investieren. Außerdem würde ich die Architektur besser durchplanen.
        en: |-
          - **Rebuild instead of overriding:** the redesign grew as a layer on top of the old styles. It works, but two stylesheets with many overrides are harder to maintain than one clean one. Merging them is the next step.
          - **Measure instead of guessing:** line length, image sizes and loading weight only became really good once I measured them in the browser instead of estimating.
          - **Know the platform:** GitHub Pages cannot redirect on the server, and Windows does not distinguish between upper and lower case in folder names. Both shaped how the redirects work.
      image: ''
      image_en: ''
      image_wide: false
      image_alt: null
      image_caption: null
images: []
embed: ''
video_poster: ''
date: 2026-10-24
---
