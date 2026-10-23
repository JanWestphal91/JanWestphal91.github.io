---
published: true
title: Chirping on Trust
slug: chirping-on-trust
category: '[Game] 2026'
order: 1
cover_image: /Images/projects/chirping-on-trust/webshot.webp
cover_image_alt: "Chirping on Trust running on a Game Boy Advance SP"
cover_image_alt_de: "Chirping on Trust läuft auf einem Game Boy Advance SP"
summary_card: A group project made at an in-person game jam over one weekend.
summary_card_de: Ein Gruppenprojekt, entstanden an einem Wochenende im Rahmen eines Game Jams.
summary: |-
  A game for the Game Boy Advance, made in a team of three over one weekend at the MEKO Jam on media literacy by IF(game)SH e.V. in Leck. Our goal was a ROM that runs on the real handheld – and it does. I made the pixel art, set up the web emulator and designed the [itch.io page](https://jan-west.itch.io/chirping-on-trust), where the game can be played in the browser.

  Team: [Gracl](https://gracl.itch.io/) & [Zoltankost](https://zoltankost.itch.io/).
summary_de: |-
  Ein Spiel für den Game Boy Advance, entstanden an einem Wochenende im Dreierteam auf der MEKO Jam zum Thema Medienkompetenz des IF(game)SH e.V. in Leck. Unser Ziel war eine ROM, die auf dem echten Handheld läuft – das hat geklappt. Ich habe die Pixelart gezeichnet, den Web-Emulator eingerichtet und die [itch.io-Seite](https://jan-west.itch.io/chirping-on-trust) gestaltet, auf der man das Spiel im Browser spielen kann.

  Team: [Gracl](https://gracl.itch.io/) & [Zoltankost](https://zoltankost.itch.io/).
meta:
  - Game jam, group project, released
meta_de:
  - Game Jam, Gruppenprojekt, veröffentlicht
images:
  - src: /Images/projects/chirping-on-trust/titlescreenshott.png
    alt: "Pixel-art title screen of Chirping on Trust with birds and the menu items “Select Players” and “Start Game”"
    alt_de: "Pixelart-Titelbildschirm von Chirping on Trust mit Vögeln und den Menüpunkten „Select Players“ und „Start Game“"
    caption: Title screen from the game
    caption_de: Titelbildschirm des Spiels
  - src: /Images/projects/chirping-on-trust/webshot.webp
    alt: "Chirping on Trust running on a Game Boy Advance SP"
    alt_de: "Chirping on Trust läuft auf einem Game Boy Advance SP"
    caption: Game running on GBA SP
    caption_de: Das Spiel läuft auf einem GBA SP
embed: <iframe frameborder="0" src="https://itch.io/embed/4878195?border_width=0&amp;bg_color=9badb7&amp;fg_color=3f3f74&amp;link_color=5b6ee1&amp;border_color=798b95" width="206" height="165"><a href="https://jan-west.itch.io/chirping-on-trust">Chirping on trust by Netro, Gracl, zoltankost</a></iframe>
case:
  role:
    en: 'Team of three: pixel art, web emulator and the itch.io page'
    de: 'Dreierteam: Pixelart, Web-Emulator und die itch.io-Seite'
  duration:
    en: One weekend, 2026
    de: Ein Wochenende, 2026
  tools:
  - Rust
  - agb
  - Aseprite
  - mGBA (web version)
  hardware:
  - en: Game Boy Advance SP
    de: Game Boy Advance SP
  - en: Flash cartridge with microSD card
    de: Flash-Modul mit microSD-Karte
  links:
  - label:
      en: Play on itch.io
      de: Auf itch.io spielen
    url: https://jan-west.itch.io/chirping-on-trust
  - label:
      en: All games of the jam
      de: Alle Spiele des Jams
    url: https://itch.io/c/7976774/meko-jam-2026-between-the-lines
  - label:
      en: 'Devlog: the game jam weekend'
      de: 'Devlog: das Game-Jam-Wochenende'
    url: /blog/experiences-and-impressions-from-the-media-literacy-gamejam-in-leck/
  sections:
  - heading:
      en: Setting
      de: Rahmen
    body:
      en: 'The MEKO Jam on media literacy, organised by IF(game)SH e.V. in Leck – this year it replaced the Summer Game Jam: around 30–40 participants, together with Danish developers. Friday started with a workshop on topics of media literacy, effects of media, and gender and identity, plus three short talks.


        After the team-building, my two teammates and I had one shared goal: a game for the Game Boy Advance that actually runs as a ROM on the real handheld.'
      de: 'Die MEKO Jam zum Thema Medienkompetenz, organisiert vom IF(game)SH e.V. in Leck – in diesem Jahr hat sie die Summer Game Jam ersetzt: rund 30–40 Teilnehmende, gemeinsam mit dänischen Entwicklerinnen und Entwicklern. Am Freitag gab es einen Workshop zu Medienkompetenz, Medienwirkung sowie Gender und Identität, dazu drei kurze Vorträge.


        Nach der Teamfindung hatten meine beiden Teampartner und ich ein gemeinsames Ziel: ein Spiel für den Game Boy Advance, das als ROM tatsächlich auf dem echten Handheld läuft.'
    image: /Images/blog/experiences-and-impressions-from-the-media-literacy-gamejam-in-leck/gamejamwork.webp
    image_alt:
      en: Work table at the game jam with laptops, snacks and paper prototypes
      de: Arbeitstisch beim Game Jam mit Laptops, Snacks und Papierprototypen
    image_caption:
      en: Work table at the jam
      de: Arbeitstisch beim Jam
  - heading:
      en: Concept
      de: Konzept
    body:
      en: 'The tech was settled quickly, but the game design wasn’t clicking on the first evening. On Saturday we decided to recreate the game Temple of Terror – not the most creative choice, but we needed something to work on.


        Only on the home stretch did we notice: none of us had ever played the original. We had built it the way we imagined it, so our game turned out quite different from the source – a happy accident.'
      de: 'Die Technik stand schnell fest, aber das Spieldesign wollte am ersten Abend nicht zünden. Am Samstag haben wir uns entschieden, das Spiel Temple of Terror nachzubauen – nicht die kreativste Wahl, aber wir brauchten etwas, woran wir arbeiten konnten.


        Erst auf der Zielgeraden fiel uns auf: Keiner von uns hatte das Original je gespielt. Wir hatten es so gebaut, wie wir es uns vorgestellt hatten, und so wurde unser Spiel ziemlich anders als die Vorlage – ein glücklicher Zufall.'
  - heading:
      en: Implementation
      de: Umsetzung
    body:
      en: |-
        We wrote the game in Rust with the agb library. It let us load Aseprite files directly, without exporting them first – a big help for my pixel art under time pressure. The game logic and the hardware side were in my teammates’ hands.

        - **Pixel art:** roughly 30 sprites with a rough, shared colour palette. Every sprite had to use one of the sizes the hardware supports – 16 × 16, 32 × 32, 64 × 64 px and so on.
        - **Web emulator:** so the game can be played in the browser without a Game Boy, the itch.io page runs the ROM in the web version of the emulator mGBA.
      de: |-
        Geschrieben haben wir das Spiel in Rust mit der Bibliothek agb. Damit konnten wir Aseprite-Dateien direkt laden, ohne sie vorher zu exportieren – eine große Hilfe für meine Pixelart unter Zeitdruck. Spiellogik und Hardware-Anbindung lagen bei meinen Teampartnern.

        - **Pixelart:** rund 30 Sprites mit einer groben gemeinsamen Farbpalette. Jedes Sprite musste eine der Größen haben, die die Hardware unterstützt – 16 × 16, 32 × 32, 64 × 64 px und so weiter.
        - **Web-Emulator:** Damit man das Spiel auch ohne Game Boy spielen kann, läuft die ROM auf der itch.io-Seite in der Webversion des Emulators mGBA.
    image: /Images/projects/chirping-on-trust/titlescreenshott.png
    image_alt:
      en: Pixel-art title screen of Chirping on Trust with birds and the menu items “Select Players” and “Start Game”
      de: Pixelart-Titelbildschirm von Chirping on Trust mit Vögeln und den Menüpunkten „Select Players“ und „Start Game“
    image_caption:
      en: The title screen
      de: Der Titelbildschirm
  - heading:
      en: Result
      de: Ergebnis
    body:
      en: At the end we compiled a ROM, loaded it onto a flash cartridge via microSD card and tested it on an actual Game Boy Advance SP. All teams finished with a playable version. Chirping on Trust can be played in the browser on itch.io, and the ROM can be downloaded there.
      de: Am Ende haben wir eine ROM kompiliert, über eine microSD-Karte in ein Flash-Modul geladen und auf einem echten Game Boy Advance SP getestet. Alle Teams sind mit einer spielbaren Version fertig geworden. Chirping on Trust lässt sich auf itch.io im Browser spielen, die ROM kann dort heruntergeladen werden.
    image: /Images/projects/chirping-on-trust/webshot.webp
    image_alt:
      en: Chirping on Trust running on a Game Boy Advance SP
      de: Chirping on Trust läuft auf einem Game Boy Advance SP
    image_caption:
      en: Running on real hardware
      de: Läuft auf echter Hardware
  - heading:
      en: What I learned and would do differently
      de: Was ich gelernt habe und anders machen würde
    body:
      en: |-
        - **Clarify hardware limits before drawing:** the Game Boy Advance only accepts sprites in fixed sizes (16 × 16, 32 × 32, 64 × 64 px …). Knowing that before the first sketch saves redrawing.
        - **Settle on an idea early:** the first evening went by without a game design. Once we had a fixed starting point on Saturday, the work moved fast. At the next jam I would commit to a simple idea on Friday and adjust it later.
        - **Feedback for interactions:** next time I would put more time into how the game reacts to input – sounds, small animations, visible hits – so every action feels clear.
      de: |-
        - **Hardware-Grenzen vor dem Zeichnen klären:** Der Game Boy Advance nimmt Sprites nur in festen Größen an (16 × 16, 32 × 32, 64 × 64 px …). Wer das vor der ersten Skizze weiß, muss nichts neu zeichnen.
        - **Früh auf eine Idee festlegen:** Der erste Abend verging ohne Spieldesign. Sobald wir am Samstag einen festen Ausgangspunkt hatten, ging die Arbeit schnell voran. Beim nächsten Jam würde ich mich am Freitag auf eine einfache Idee festlegen und sie später anpassen.
        - **Feedback bei Interaktionen:** Beim nächsten Mal würde ich mehr Zeit darauf verwenden, wie das Spiel auf Eingaben reagiert – Töne, kleine Animationen, sichtbare Treffer –, damit jede Aktion eindeutig wirkt.
date: 2026-08-15
---
