---
published: true
title: Audio Dingo Synth
slug: Audio-Dingo-Synth
category: '[Electronic] 2026'
order: 2
cover_image: Images/Audiodingo/audiodingostanding.webp
cover_image_alt: "The finished Audio Dingo synthesizer standing upright"
cover_image_alt_de: "Der fertige Audio-Dingo-Synthesizer, aufrecht stehend"
summary_card: Arduino Uno R4 Minima based synthesizer with buttons, encoders, OLED display and joystick.
summary_card_de: Auf dem Arduino Uno R4 Minima basierender Synthesizer mit Tasten, Encodern, OLED-Display und Joystick.
summary: |-
  Made with an Arduino Uno R4 Minima. It has 10 Buttons, 2 Rotary Encoder, a small OLED Display and a Joystick. The 7 buttons at the bottom are for playing notes or chords, with both rotary knobs the sound can be modulated, one changes the octave the other changes the waveform. With the joystick you can control the tone of the sound and the 3 control buttons are for recording, playback and magic functions.

  I wrote a bit more about the [development process in a blog post](https://janwestphal.dev/blog/hello-blog/), and there’s also a public [GitHub repository](https://github.com/JanWestphal91/Audio-Dingo-Synth).
summary_de: |-
  Entwickelt mit einem Arduino Uno R4 Minima. Er hat 10 Tasten, 2 Drehencoder, ein kleines OLED-Display und einen Joystick. Die 7 Tasten unten dienen zum Spielen von Noten oder Akkorden; mit den Encodern lässt sich der Sound modulieren – einer wechselt die Oktave, der andere die Wellenform. Mit dem Joystick steuert man die Tonhöhe, die 3 Steuertasten übernehmen Aufnahme, Wiedergabe und Sonderfunktionen.

  In meinem [Blogbeitrag](https://janwestphal.dev/blog/hello-blog/) habe ich noch etwas mehr über den Entwicklungsprozess geschrieben, und das [GitHub-Repository](https://github.com/JanWestphal91/Audio-Dingo-Synth) ist auch öffentlich.
meta:
  - Electronic
  - Prototype
  - Audio
meta_de:
  - Elektronik
  - Prototyp
  - Audio
images:
  - src: Images/Audiodingo/standingdingo.webp
    alt: "Audio Dingo from the front: grey case with an orange speaker grille, two orange knobs, black keys and a small OLED display"
    alt_de: "Audio Dingo von vorn: graues Gehäuse mit orangem Lautsprechergitter, zwei orangen Drehknöpfen, schwarzen Tasten und kleinem OLED-Display"
    caption: The finished enclosure, front view.
    caption_de: Das fertige Gehäuse, Frontalansicht.
embed: <iframe width="560" height="315" src="https://www.youtube.com/embed/iitkykF2S_k?si=r0XPnJhy53a7T4wm" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
case:
  role:
    en: 'Solo project in the course Become a Maker (opencampus.sh, FabLab Kiel): concept, circuit, firmware, sound design and enclosure'
    de: 'Soloprojekt im Kurs Become a Maker (opencampus.sh, FabLab Kiel): Konzept, Schaltung, Firmware, Sounddesign und Gehäuse'
  duration:
    en: April to September 2026 (summer semester)
    de: April bis September 2026 (Sommersemester)
  tools:
  - Arduino
  - Mozzi
  - Wokwi
  - Fusion
  hardware:
  - en: Arduino Uno R4 Minima
    de: Arduino Uno R4 Minima
  - en: 7 note keys and 3 function buttons
    de: 7 Tontasten und 3 Funktionstasten
  - en: 2 rotary encoders and a joystick
    de: 2 Drehencoder und ein Joystick
  - en: Small OLED display
    de: Kleines OLED-Display
  - en: Built-in speaker and headphone jack
    de: Eingebauter Lautsprecher und Kopfhörerbuchse
  - en: Battery power
    de: Akkubetrieb
  links:
  - label:
      en: GitHub repository
      de: GitHub-Repository
    url: https://github.com/JanWestphal91/Audio-Dingo-Synth
  - label:
      en: 'Devlog: development process'
      de: 'Devlog: der Entwicklungsprozess'
    url: /blog/hello-blog/
  sections:
  - heading:
      en: Requirements
      de: Anforderungen
    body:
      en: 'The goal was a small synthesizer that generates its own tones and fits into my existing setup of other synths. It had to be portable, so it runs on battery power.


        - **Playing:** 7 note keys, because a scale has 7 notes, plus 3 function buttons for recording, playback and special functions.

        - **Shaping the sound:** 2 rotary encoders – one changes the octave, the other the waveform – and a joystick for the pitch.

        - **Feedback:** a display showing the current settings and the parameter being edited.

        - **Output:** a built-in speaker for standalone use and a headphone jack to connect it to other synths.'
      de: 'Ziel war ein kleiner Synthesizer, der eigene Töne erzeugt und sich in mein bestehendes Setup aus anderen Synths einfügt. Er sollte mobil sein und läuft deshalb mit Akku.


        - **Spielen:** 7 Tontasten, weil eine Tonleiter aus 7 Tönen besteht, dazu 3 Funktionstasten für Aufnahme, Wiedergabe und Sonderfunktionen.

        - **Klang formen:** 2 Drehencoder – einer wechselt die Oktave, der andere die Wellenform – und ein Joystick für die Tonhöhe.

        - **Rückmeldung:** ein Display, das die aktuellen Einstellungen und den gerade bearbeiteten Parameter zeigt.

        - **Ausgang:** ein eingebauter Lautsprecher für den Einsatz allein und eine Kopfhörerbuchse, um ihn mit anderen Synths zu verbinden.'
  - heading:
      en: From simulation to breadboard
      de: Von der Simulation zum Breadboard
    body:
      en: 'Before buying anything, I simulated and tested a first circuit on Wokwi. Then came the research: which parts are suitable, which work reliably together, and where to get them.


        Once everything had arrived, I built the first hardware prototype on a breadboard and wrote a first basic version of the code.'
      de: 'Bevor ich etwas bestellt habe, habe ich eine erste Schaltung auf Wokwi simuliert und getestet. Danach kam die Recherche: Welche Bauteile eignen sich, welche arbeiten zuverlässig zusammen, und wo bekomme ich sie her?


        Als alles angekommen war, habe ich den ersten Hardware-Prototyp auf einem Breadboard aufgebaut und eine erste Grundversion des Codes geschrieben.'
    image: /Images/Audiodingo/DingoFirstBreadboard.webp
    image_alt:
      en: 'First breadboard prototype: Arduino, OLED display, joystick and rotary encoders connected with many jumper wires'
      de: 'Erster Breadboard-Prototyp: Arduino, OLED-Display, Joystick und Drehencoder, verbunden mit vielen Steckkabeln'
    image_caption:
      en: The first prototype on the breadboard
      de: Der erste Prototyp auf dem Breadboard
  - heading:
      en: Enclosure in two iterations
      de: Gehäuse in zwei Iterationen
    body:
      en: 'With a rough circuit layout in mind, I designed the enclosure in Fusion. The first print was only the black main body – enough to fit all components and get a feel for the form and layout.


        For the second iteration the case became noticeably wider and deeper, and I adjusted the cut-outs for buttons and connectors. This print fit properly – a very satisfying milestone.'
      de: 'Mit einem groben Plan der Schaltung im Kopf habe ich das Gehäuse in Fusion entworfen. Der erste Druck war nur der schwarze Grundkörper – genug, um alle Bauteile einzusetzen und ein Gefühl für Form und Anordnung zu bekommen.


        In der zweiten Iteration wurde das Gehäuse deutlich breiter und tiefer, und ich habe die Aussparungen für Tasten und Anschlüsse angepasst. Dieser Druck passte – ein sehr befriedigender Meilenstein.'
    image: /Images/Audiodingo/DingofirstCase.webp
    image_alt:
      en: First 3D-printed case in black, with cut-outs for keys, knobs and the display
      de: Erstes 3D-gedrucktes Gehäuse in Schwarz mit Aussparungen für Tasten, Drehknöpfe und Display
    image_caption:
      en: 'The first print: only the main body'
      de: 'Der erste Druck: nur der Grundkörper'
  - heading:
      en: Sound and firmware
      de: Klang und Firmware
    body:
      en: 'In parallel to the enclosure, I soldered the components, refined the code and improved the sound generation. For the audio synthesis I used the Mozzi library, which proved very useful for this kind of Arduino project.


        The code is open source on GitHub.'
      de: 'Parallel zum Gehäuse habe ich die Bauteile verlötet, den Code verfeinert und die Klangerzeugung verbessert. Für die Audiosynthese habe ich die Bibliothek Mozzi genutzt, die sich für diese Art von Arduino-Projekt als sehr nützlich erwiesen hat.


        Der Code ist offen auf GitHub.'
    image: /Images/Audiodingo/DingoinFusion.webp
    image_alt:
      en: Screenshot of the case design in Fusion
      de: Screenshot des Gehäuseentwurfs in Fusion
    image_caption:
      en: The case design in Fusion
      de: Der Gehäuseentwurf in Fusion
date: 2026-01-02
---
