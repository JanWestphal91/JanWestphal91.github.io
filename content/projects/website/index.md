---
published: true
title: This website
title_de: Diese Website
slug: website
category: '[Web] 2026'
order: 4
cover_image: /Images/projects/website/startseite.webp
cover_image_alt: "Home page of janwestphal.dev: the headline “Hardware, games & graphics from Kiel” next to a fan of four project cards"
cover_image_alt_de: "Startseite von janwestphal.dev: die Überschrift „Hardware, Games & Grafik aus Kiel“ neben einem Fächer aus vier Projektkarten"
summary_card: My portfolio as a project – static, bilingual, fast and editable without code.
summary_card_de: Mein Portfolio als Projekt – statisch, zweisprachig, schnell und ohne Code pflegbar.
summary: |-
  janwestphal.dev is my portfolio, and building it was a project of its own. The goal: a site that shows my work properly, loads fast, works without tracking or cookies, is available in German and English, and that I can maintain through a CMS without touching code.

  The guiding principle for the design: usability and accessibility come before effects. The layout follows established HCI principles and design standards; animations are there to support orientation, never as an end in themselves.

  The site is generated with Eleventy and hosted on GitHub Pages. Every push builds it from scratch: both language versions, all images in several sizes and the redirects for old addresses. The source code is public on GitHub.
summary_de: |-
  janwestphal.dev ist mein Portfolio – und ihr Aufbau ein eigenes Projekt. Das Ziel: eine Seite, die meine Arbeit gut zeigt, schnell lädt, ohne Tracking und Cookies auskommt, auf Deutsch und Englisch erreichbar ist und die ich über ein CMS pflegen kann, ohne Code anzufassen.

  Leitlinie für die Gestaltung: Usability und Barrierefreiheit gehen vor Effekten. Das Layout folgt etablierten HCI-Prinzipien und Designnormen; Animationen sollen Orientierung geben und sind nie Selbstzweck.

  Die Seite wird mit Eleventy erzeugt und liegt auf GitHub Pages. Jeder Push baut sie komplett neu: beide Sprachfassungen, alle Bilder in mehreren Größen und die Weiterleitungen für alte Adressen. Der Quellcode ist öffentlich auf GitHub.
meta:
  - Website, solo project
  - 'Status: live, continuously developed'
meta_de:
  - Website, Soloprojekt
  - 'Status: online, wird laufend weiterentwickelt'
case:
  role:
    en: 'Solo project: concept, design, development and content'
    de: 'Soloprojekt: Konzept, Gestaltung, Entwicklung und Inhalte'
  duration:
    en: Since spring 2026, redesign in autumn 2026
    de: Seit Frühjahr 2026, Überarbeitung im Herbst 2026
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
  links:
  - label:
      en: Source code on GitHub
      de: Quellcode auf GitHub
    url: https://github.com/JanWestphal91/JanWestphal91.github.io
  sections:
  - heading:
      en: Goal
      de: Ziel
    body:
      en: |-
        The site has two audiences: employers in embedded development, media technology and game development, and people who are interested in my projects. Both should see quickly what I build and how I work. That led to a few fixed requirements:

        - **Fast and static:** no server, no database, just HTML files. That keeps the site fast, secure and cheap to run.
        - **Two languages:** German as the main language, English for everyone else – with its own addresses, so search engines find both versions.
        - **Editable without code:** new projects and blog posts are written in a CMS in the browser.
        - **Privacy:** no tracking, no cookies, fonts hosted on the site itself. Videos and embedded games only load after a click.
      de: |-
        Die Seite hat zwei Zielgruppen: Arbeitgeber aus Embedded-Entwicklung, Medientechnik und Game Development und alle, die sich für meine Projekte interessieren. Beide sollen schnell sehen, was ich baue und wie ich arbeite. Daraus ergaben sich ein paar feste Anforderungen:

        - **Schnell und statisch:** kein Server, keine Datenbank, nur HTML-Dateien. Das hält die Seite schnell, sicher und kostenlos im Betrieb.
        - **Zwei Sprachen:** Deutsch als Hauptsprache, Englisch für alle anderen – mit eigenen Adressen, damit Suchmaschinen beide Fassungen finden.
        - **Pflegbar ohne Code:** Neue Projekte und Blogbeiträge entstehen in einem CMS im Browser.
        - **Datenschutz:** kein Tracking, keine Cookies, Schriften liegen auf der eigenen Seite. Videos und eingebettete Spiele laden erst nach einem Klick.
  - heading:
      en: Structure
      de: Aufbau
    body:
      en: |-
        Every project and every blog post is a Markdown file with a header of structured data: title, category, images, the facts of the case study. Eleventy turns these files into HTML pages using Nunjucks templates. The CMS (Sveltia) writes into exactly these files and commits them to the repository – there is no second data store.

        On every push, GitHub Actions builds the site and publishes it on GitHub Pages. GitHub Pages cannot do server-side redirects, so old addresses get a small page that forwards immediately and points search engines to the new address via `canonical`.
      de: |-
        Jedes Projekt und jeder Blogbeitrag ist eine Markdown-Datei mit einem Kopf aus strukturierten Daten: Titel, Kategorie, Bilder, der Steckbrief der Case Study. Eleventy macht daraus mit Nunjucks-Vorlagen fertige HTML-Seiten. Das CMS (Sveltia) schreibt genau in diese Dateien und committet sie ins Repository – es gibt keinen zweiten Datenspeicher.

        Bei jedem Push baut GitHub Actions die Seite und veröffentlicht sie auf GitHub Pages. GitHub Pages kann keine Weiterleitungen auf dem Server, deshalb bekommt jede alte Adresse eine kleine Seite, die sofort weiterleitet und Suchmaschinen per `canonical` die neue Adresse nennt.
  - heading:
      en: Two languages without JavaScript
      de: Zwei Sprachen ohne JavaScript
    body:
      en: |-
        The templates write every page only once: English text in the HTML, both languages additionally as attributes (`data-en`, `data-de`). After the build, a small script of my own reads every page and writes two finished versions from it – German under `/`, English under `/en/`. Each version contains only its own language, the right `lang` attribute, its own title and description, cross-references for search engines (`hreflang`) and a shared sitemap.

        The advantage: each text is maintained in one place, and visitors and screen readers get the right language from the first byte – without a language switch in the browser.
      de: |-
        Die Vorlagen schreiben jede Seite nur einmal: englischer Text im HTML, beide Sprachen zusätzlich als Attribute (`data-en`, `data-de`). Nach dem Build liest ein kleines eigenes Skript jede Seite ein und schreibt daraus zwei fertige Fassungen – Deutsch unter `/`, Englisch unter `/en/`. Jede Fassung enthält nur ihre eigene Sprache, das richtige `lang`-Attribut, eigenen Titel und eigene Beschreibung, Querverweise für Suchmaschinen (`hreflang`) und eine gemeinsame Sitemap.

        Der Vorteil: Jeder Text wird an einer Stelle gepflegt, und Besucher wie Screenreader bekommen vom ersten Byte an die richtige Sprache – ohne Umschalten im Browser.
  - heading:
      en: Images
      de: Bilder
    body:
      en: |-
        Photos come straight from the camera and are often several megabytes. A plugin (eleventy-img) replaces every image during the build with a `<picture>` element: five widths, each as AVIF and WebP, plus the real dimensions so nothing jumps while loading. The browser picks the size it actually needs.

        Effect on the home page: the images now weigh 65 to 125 KB in total, depending on the screen – before, a single blog thumbnail was 4.4 MB.
      de: |-
        Fotos kommen direkt aus der Kamera und sind oft mehrere Megabyte groß. Ein Plugin (eleventy-img) ersetzt beim Build jedes Bild durch ein `<picture>`-Element: fünf Breiten, jeweils als AVIF und WebP, dazu die echten Maße, damit beim Laden nichts springt. Der Browser lädt nur die Größe, die er wirklich braucht.

        Wirkung auf der Startseite: Die Bilder wiegen dort jetzt je nach Bildschirm zusammen 65 bis 125 KB – vorher war allein ein Vorschaubild im Blog 4,4 MB groß.
    image: /Images/projects/website/blog.webp
    image_alt:
      en: Blog post layout with a text column on the left and the matching image on the right
      de: Layout eines Blogbeitrags mit Textspalte links und dem passenden Bild rechts daneben
    image_caption:
      en: Blog posts – text column with images next to the matching paragraph
      de: Blogbeiträge – Textspalte, Bilder neben dem passenden Absatz
  - heading:
      en: Interaction
      de: Interaktion
    body:
      en: |-
        The site should feel like my projects: a little playful, but not loud. Every movement has a job – it shows where something comes from, what is selected or what can be clicked. No content depends on an animation.

        - **Fan of cards:** on the home page, the current projects lie like playing cards in a hand. Hovering lifts a card with a slight spring; it tilts towards the pointer with a highlight.
        - **Variable font:** Bricolage Grotesque is a variable font. In the large headlines, each letter gets heavier the closer the pointer is.
        - **3D models:** models from Blender can be rotated in the browser (three.js). The “Topology” view shows the edges as I modelled them – the export script carries the original quads along.
        - **Images and galleries:** clicked images grow smoothly from their position into the lightbox; long galleries get an index on the left that follows the scroll position.
      de: |-
        Die Seite soll sich anfühlen wie meine Projekte: ein bisschen verspielt, aber nicht laut. Jede Bewegung hat eine Aufgabe – sie zeigt, woher etwas kommt, was ausgewählt ist oder was sich anklicken lässt. Kein Inhalt hängt von einer Animation ab.

        - **Fächer:** Auf der Startseite liegen die aktuellen Projekte wie Spielkarten in der Hand. Beim Überfahren hebt sich eine Karte mit leichtem Nachfedern heraus und neigt sich mit einem Glanzpunkt zum Zeiger.
        - **Variable Schrift:** Bricolage Grotesque ist eine variable Schrift. In den großen Überschriften wird jeder Buchstabe kräftiger, je näher der Zeiger ist.
        - **3D-Modelle:** Modelle aus Blender lassen sich im Browser drehen (three.js). Die Ansicht „Topologie“ zeigt die Kanten so, wie ich sie modelliert habe – das Export-Skript nimmt dafür die ursprünglichen Vierecke mit.
        - **Bilder und Galerien:** Angeklickte Bilder wachsen weich aus ihrer Position in die Großansicht; lange Galerien bekommen links einen Index, der der Scrollposition folgt.
    image: /Images/projects/website/topologie.webp
    image_alt:
      en: 3D viewer with a duck model in topology view, every edge drawn as a thin line
      de: 3D-Ansicht mit einem Entenmodell in der Topologie-Ansicht, jede Kante als dünne Linie
    image_caption:
      en: 3D viewer in topology view
      de: 3D-Ansicht in der Topologie-Darstellung
  - heading:
      en: 'Design principles: usability before effects'
      de: 'Gestaltungsprinzipien: Usability vor Effekt'
    body:
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
      de: |-
        Auffällige Effekte sind schnell gebaut – eine Seite, die man wirklich gut benutzen kann, braucht mehr Sorgfalt. Deshalb folgt die Gestaltung etablierten Prinzipien statt Trends:

        - **Interaktionsprinzipien (DIN EN ISO 9241-110):** Die Seite erklärt sich selbst (Beschriftungen statt reiner Symbole, die aktuelle Seite ist in der Navigation markiert), verhält sich erwartungskonform (Links sehen überall gleich aus und reagieren gleich) und bleibt steuerbar (Animationen lassen sich abschalten, Videos und Spiele laden erst auf Wunsch).
        - **Sichtbarer Zustand:** Was gerade aktiv ist, ist zu sehen – die unterstrichene Seite in der Navigation, die gehobene Karte mit „01 / 04“, das markierte Bild im Galerie-Index, der Zustand des Animationsschalters.
        - **Lesbarkeit:** rund 65 Zeichen pro Zeile, im Browser gemessen; eine Schriftskala mit sieben statt vierzehn Größen; klare Abstände, die Zusammengehöriges gruppieren.
        - **Gut zu treffen:** Klickflächen von mindestens 44 px, ganze Listenzeilen sind anklickbar statt nur der Titel.

        Barrierefreiheit gehört dazu und ist kein Zusatz. Ziel ist WCAG 2.2, Stufe AA:

        - **Bewegung ist freiwillig:** Der Schalter „Animationen“ stellt alle Bewegungen ab, und ohne eigene Wahl folgt die Seite der Einstellung des Betriebssystems (`prefers-reduced-motion`).
        - **Screenreader:** Animierte Überschriften enthalten ihren Text ein zweites Mal unsichtbar, damit das Wort vorgelesen wird und nicht einzelne Buchstaben; das Menü auf dem Handy meldet, ob es offen ist; jedes inhaltliche Bild hat eine Beschreibung in beiden Sprachen, rein dekorative werden für Screenreader ausgeblendet.
        - **Tastatur und Kontrast:** Alles ist mit der Tastatur und sichtbarem Fokus bedienbar, ein Sprunglink führt direkt zum Inhalt, und alle Texte erfüllen die AA-Kontrastwerte.
        - **Formular:** Fehler erscheinen direkt unter dem Feld, in der Sprache der Seite.
    image: /Images/projects/website/mobil.webp
    image_alt:
      en: Three phone screenshots – home page, open menu with the animation switch, project page
      de: Drei Handy-Screenshots – Startseite, geöffnetes Menü mit dem Animationsschalter, Projektseite
    image_caption:
      en: Mobile – home page, menu and project page
      de: Mobil – Startseite, Menü und Projektseite
  - heading:
      en: What I learned and would do differently
      de: Was ich gelernt habe und anders machen würde
    body:
      en: |-
        - **Rebuild instead of overriding:** the redesign grew as a layer on top of the old styles. It works, but two stylesheets with many overrides are harder to maintain than one clean one. Merging them is the next step.
        - **Measure instead of guessing:** line length, image sizes and loading weight only became really good once I measured them in the browser instead of estimating.
        - **Know the platform:** GitHub Pages cannot redirect on the server, and Windows does not distinguish between upper and lower case in folder names. Both shaped how the redirects work.
      de: |-
        - **Neu bauen statt überschreiben:** Die Überarbeitung ist als Schicht über den alten Stilen gewachsen. Das funktioniert, aber zwei Stylesheets mit vielen Überschreibungen sind schwerer zu pflegen als ein sauberes. Sie zusammenzuführen ist der nächste Schritt.
        - **Messen statt schätzen:** Zeilenlänge, Bildgrößen und Ladegewicht wurden erst richtig gut, als ich sie im Browser gemessen statt geschätzt habe.
        - **Die Plattform kennen:** GitHub Pages kann keine Weiterleitungen auf dem Server, und Windows unterscheidet in Ordnernamen nicht zwischen Groß- und Kleinschreibung. Beides hat bestimmt, wie die Weiterleitungen funktionieren.
date: 2026-10-24
---
