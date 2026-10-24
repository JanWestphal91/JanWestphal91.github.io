---
published: true
title: Audio Dingo Synth
title_de: ''
slug: audio-dingo-synth
category: '[Electronic] 2026'
order: 2
cover_image: Images/Audiodingo/audiodingostanding.webp
cover_image_alt: The finished Audio Dingo synthesizer standing upright
cover_image_alt_de: Der fertige Audio-Dingo-Synthesizer, aufrecht stehend
summary_card: Arduino Uno R4 Minima based synthesizer with buttons, encoders, OLED display and joystick.
summary_card_de: Auf dem Arduino Uno R4 Minima basierender Synthesizer mit Tasten, Encodern, OLED-Display und Joystick.
summary: |-
  A small, battery-powered synthesizer built with an Arduino Uno R4 Minima and the audio library Mozzi. Seven keys play notes or chords, two rotary encoders set the envelope, volume and presets, and the joystick adds vibrato, a wah filter, bit crush and glide. The built-in speaker is enough to play on its own; the jack connects it to other synths.

  I wrote about the [development process in a blog post](/blog/development-process-of-a-diy-synthesizer/); firmware and case files are in the public [GitHub repository](https://github.com/JanWestphal91/Audio-Dingo-Synth).
summary_de: |-
  Ein kleiner Synthesizer mit Akku, gebaut mit einem Arduino Uno R4 Minima und der Audio-Bibliothek Mozzi. Sieben Tasten spielen Töne oder Akkorde, zwei Drehencoder stellen Hüllkurve, Lautstärke und Presets ein, und der Joystick bringt Vibrato, Wah-Filter, Bitcrush und Glide ins Spiel. Der eingebaute Lautsprecher reicht zum Spielen allein, über die Klinkenbuchse lässt er sich mit anderen Synths verbinden.

  Über den Entwicklungsprozess habe ich in einem [Blogbeitrag](/blog/development-process-of-a-diy-synthesizer/) geschrieben; Firmware und Gehäusedateien liegen im öffentlichen [GitHub-Repository](https://github.com/JanWestphal91/Audio-Dingo-Synth).
meta:
  - Prototype
  - Audio
meta_de:
  - Prototyp
  - Audio
flipbooks: []
models_intro: null
models: []
case:
  role:
    de: 'Soloprojekt im Kurs Become a Maker (opencampus.sh, FabLab Kiel): Konzept, Schaltung, Firmware, Sounddesign und Gehäuse'
    en: 'Solo project in the course Become a Maker (opencampus.sh, FabLab Kiel): concept, circuit, firmware, sound design and enclosure'
  duration:
    de: April bis September 2026 (Sommersemester)
    en: April to September 2026 (summer semester)
  tools:
    - C++ (Arduino IDE)
    - Mozzi 2.0
    - Adafruit SSD1306 / GFX
    - Wokwi
    - Fusion 360
    - Claude (Ai assistant) Teilesuche und Code Unterstützung
  hardware:
    - de: Arduino Uno R4 Minima, Ton über den eingebauten 12-Bit-DAC
      en: Arduino Uno R4 Minima, audio via the on-board 12-bit DAC
    - de: 7 Tontasten und 3 Funktionstasten (MODE, WAVE, CHORD)
      en: 7 note keys and 3 function buttons (MODE, WAVE, CHORD)
    - de: 2 Drehencoder und ein analoger Joystick
      en: 2 rotary encoders and an analog joystick
    - de: SSD1306-OLED-Display, 128 × 32 px
      en: SSD1306 OLED display, 128 × 32 px
    - de: Kleiner Class-D-Verstärker, Lautsprecher und Kopfhörer-/Line-Buchse
      en: Small class-D amplifier, speaker and headphone/line jack
    - de: Akku mit 1800 mAh, 3D-gedrucktes Gehäuse
      en: 1800 mAh battery, 3D-printed enclosure
  links:
    - label:
        de: 'GitHub-Repository: Firmware, Gehäusedateien, Pinbelegung'
        en: 'GitHub repository: firmware, case files, pinout'
      url: https://github.com/JanWestphal91/Audio-Dingo-Synth
    - label:
        de: 'Devlog: der Entwicklungsprozess'
        en: 'Devlog: development process'
      url: /blog/development-process-of-a-diy-synthesizer/
  sections:
    - heading:
        de: Anforderungen
        en: Requirements
      body:
        de: |-
          Ziel war ein kleiner Synthesizer, der eigene Klänge erzeugt und sich in mein bestehendes Setup aus anderen Synths einfügt. Er sollte auch allein funktionieren und läuft deshalb mit Akku und eingebautem Lautsprecher, außerdem sollte man das Gerät ohne großen Aufwand mal eben kurz nutzen können.

          - **Spielen:** 7 Tontasten, weil eine Tonleiter aus 7 Tönen besteht, dazu 3 Funktionstasten.
          - **Klang formen:** 2 Drehencoder und ein Joystick, damit sich der Klang beim Spielen verändern lässt.
          - **Rückmeldung:** ein kleines Display, das die aktuellen Einstellungen und den gerade bearbeiteten Wert zeigt.
          - **Ausgang:** ein Lautsprecher zum Spielen allein und eine Buchse, um ihn mit anderen Synths zu verbinden.
        en: |-
          The goal was a small synthesizer that generates its own sounds and fits into my existing setup of other synths. It had to work on its own as well, so it runs on a battery and has a built-in speaker.

          - **Playing:** 7 note keys, because a scale has 7 notes, plus 3 function buttons.
          - **Shaping the sound:** 2 rotary encoders and a joystick, so the sound can be changed while playing.
          - **Feedback:** a small display showing the current settings and the value being edited.
          - **Output:** a speaker for playing alone and a jack to connect it to other synths.
      image: ''
      image_en: ''
      image_wide: false
      image_alt: null
      image_caption: null
    - heading:
        de: Von der Simulation zum Breadboard
        en: From simulation to breadboard
      body:
        de: |-
          Bevor ich etwas bestellt habe, habe ich eine erste Schaltung auf Wokwi simuliert und getestet. Ich wollte mir erstmal einen Überblick verschaffen weil das Projekt mein erster Kontakt mit Mikrocontrollern war. Danach kam die Recherche: Welche Bauteile eignen sich, welche arbeiten zuverlässig zusammen, und wo bekomme ich sie her?

          Als alles angekommen war, habe ich den ersten Hardware-Prototyp auf einem Breadboard aufgebaut und eine erste Grundversion des Codes geschrieben. Alle Tasten liegen zwischen Pin und Masse; die Firmware schaltet die internen Pull-up-Widerstände ein, zusätzliche Widerstände braucht es deshalb nicht.
        en: |-
          Before buying anything, I simulated and tested a first circuit on Wokwi. Then came the research: which parts are suitable, which work reliably together, and where to get them.

          Once everything had arrived, I built the first hardware prototype on a breadboard and wrote a first basic version of the code. All buttons connect between the pin and ground; the firmware switches on the internal pull-up resistors, so no extra resistors are needed.
      image: /Images/Audiodingo/DingoFirstBreadboard.webp
      image_en: ''
      image_wide: false
      image_alt:
        de: 'Erster Breadboard-Prototyp: Arduino, OLED-Display, Joystick und Drehencoder, verbunden mit vielen Steckkabeln'
        en: 'First breadboard prototype: Arduino, OLED display, joystick and rotary encoders connected with many jumper wires'
      image_caption:
        de: Der erste Prototyp auf dem Breadboard
        en: The first prototype on the breadboard
    - heading:
        de: So entsteht der Klang
        en: How the sound is made
      body:
        de: |-
          Jede Note läuft durch dieselbe Kette: Oszillatoren, etwas Rauschen, ein Tiefpassfilter mit Resonanz, die Lautstärke-Hüllkurve, die Gesamtlautstärke und zuletzt der Bitcrusher. Danach geht das Sample an den DAC an Pin A0 und von dort zum Verstärker.

          - **Oszillatoren:** Jede Stimme hat zwei. Bei Sägezahn, Puls und Dreieck ist der zweite leicht verstimmt, ausgegeben wird die Differenz beider. Weil sie dabei gegeneinander wandern, verändert sich die Wellenform ständig. Bei FM moduliert der zweite Oszillator die Phase des ersten, das ergibt glockige und metallische Klänge.
          - **Zwei Geschwindigkeiten:** Mozzi ruft `updateControl()` 128-mal pro Sekunde für alles Langsame auf – Tasten, Encoder, Hüllkurven, Display. `updateAudio()` läuft 32.768-mal pro Sekunde und berechnet bei jedem Aufruf genau ein Sample. Dort hat deshalb nur schnelle Ganzzahl-Rechnung Platz.
          - **Presets als Daten:** Wellenform, Filter, Hüllkurven, LFO und Bitcrush der 5 Presets sind Felder einer Struktur in `presets.h`. Ein neuer Klang ist eine neue Tabellenzeile, kein neuer Code.
        en: |-
          Every note runs through the same chain: oscillators, a bit of noise, a resonant low-pass filter, the volume envelope, the master volume and finally the bit crusher, before the sample goes to the DAC on pin A0 and from there to the amplifier.

          - **Oscillators:** each voice has two. For saw, pulse and triangle the second one is slightly detuned and the output is the difference of both, so the waveform keeps moving as they drift in and out of phase. For FM the second oscillator modulates the phase of the first, which gives bell-like and metallic sounds.
          - **Two speeds:** Mozzi calls `updateControl()` 128 times a second for everything slow – buttons, encoders, envelopes, the display. `updateAudio()` runs 32,768 times a second and computes exactly one sample per call, so only fast integer maths belongs there.
          - **Presets as data:** waveform, filter, envelopes, LFO and bit crush of the 5 presets are fields of a struct in `presets.h`. A new sound is a new table row, not new code.
      image: /Images/Audiodingo/signalweg-de.webp
      image_en: /Images/Audiodingo/signalweg-en.webp
      image_wide: true
      image_alt:
        de: 'Diagramm des Signalwegs: Oszillatoren, plus Rauschen, Tiefpass, mal Hüllkurve, mal Lautstärke, Bitcrusher, DAC an A0 zum Verstärker. Cutoff, Filter-Hüllkurve, LFO und Joystick wirken auf den Filter, Encoder 1 stellt die Hüllkurve. Darunter: updateControl läuft 128-mal pro Sekunde, updateAudio 32.768-mal pro Sekunde.'
        en: 'Diagram of the signal path: oscillators, plus noise, low-pass, times envelope, times volume, bit crusher, DAC on A0 to the amplifier. Cutoff, filter envelope, LFO and joystick act on the filter; encoder 1 sets the envelope. Below: updateControl runs 128 times a second, updateAudio 32,768 times a second.'
      image_caption:
        de: Signalweg einer Note in der Firmware
        en: Signal path of one note in the firmware
    - heading:
        de: Herausforderungen
        en: Challenges
      body:
        de: |-
          - **Knacken durch das Display:** Ein Bild über I²C zum OLED zu schicken dauert einige Millisekunden. In dieser Zeit wird der Audiopuffer nicht nachgefüllt, und gehaltene Töne knacken. Die Firmware fasst deshalb alle angezeigten Werte zu einer Prüfsumme zusammen und zeichnet nur neu, wenn sie sich ändert.
          - **Fester Audio-Pin:** Auf dem Uno R4 gibt Mozzi den Ton immer über den internen DAC an A0 aus. Die Pinbelegung musste darum herum geplant werden.
          - **Geteilte Pins:** Beim R4 Minima sind A4 und A5 dieselben Pins wie SDA und SCL des Displays. In diesem Aufbau teilen sich die Tasten WAVE und CHORD diese Leitungen mit dem Display. In einer zweiten Version würde ich beide Tasten auf freie Pins legen.
        en: |-
          - **Clicks from the display:** sending a frame to the OLED over I²C takes a few milliseconds. During that time the audio buffer isn’t refilled, which is audible as clicks on held notes. The firmware therefore combines all displayed values into one checksum and only redraws when it changes.
          - **Fixed audio pin:** on the Uno R4, Mozzi always outputs sound through the internal DAC on A0. The pin layout had to be planned around it.
          - **Shared pins:** on the R4 Minima, A4 and A5 are the same pins as SDA and SCL of the display. In this build the WAVE and CHORD buttons share these lines with the display. In a second version I would move both buttons to free pins.
      image: ''
      image_en: ''
      image_wide: false
      image_alt: null
      image_caption: null
    - heading:
        de: Gehäuse in zwei Iterationen
        en: Enclosure in two iterations
      body:
        de: |-
          Mit einem groben Plan der Schaltung im Kopf habe ich das Gehäuse in Fusion 360 entworfen. Der erste Druck war nur der schwarze Grundkörper um alle Bauteile einzusetzen und ein Gefühl für Form und Anordnung zu bekommen.

          In der zweiten Iteration wurde das Gehäuse deutlich breiter und tiefer weil die kabel mehr Platz brauchten und ich habe die Aussparungen für Tasten und Anschlüsse angepasst. Dieser Druck passte. Das fertige Gehäuse ist aus mehreren Teilen gedruckt: grauer Körper, orange Akzente und schwarze Kappen. Die Druckdateien liegen im Repository.
        en: |-
          With a rough circuit layout in mind, I designed the enclosure in Fusion 360. The first print was only the black main body – enough to fit all components and get a feel for the form and layout.

          For the second iteration the case became noticeably wider and deeper, and I adjusted the cut-outs for buttons and connectors. This print fit. The finished case is printed in several colours: a grey body, orange accents and black caps. The print files are in the repository.
      image: /Images/Audiodingo/DingofirstCase.webp
      image_en: ''
      image_wide: false
      image_alt:
        de: Erstes 3D-gedrucktes Gehäuse in Schwarz mit Aussparungen für Tasten, Drehknöpfe und Display
        en: First 3D-printed case in black, with cut-outs for keys, knobs and the display
      image_caption:
        de: 'Der erste Druck: nur der Grundkörper'
        en: 'The first print: only the main body'
    - heading:
        de: Ergebnis
        en: Result
      body:
        de: |-
          Audio Dingo ist ein spielbares Instrument mit rund 1.100 Zeilen Firmware, aufgeteilt in Hauptprogramm, Pinbelegung, Presets und einen Encoder-Decoder.

          - **6 Wellenformen:** Sägezahn, Puls, Dreieck, Sinus, 2-Operator-FM und Rauschen
          - **Akkordmodus:** Jede Taste spielt drei Stimmen – Dur, Moll, sus4 oder Oktaven
          - **5 Presets** – Lead, Bass, FM-Glocke, Sub und eine Kickdrum – dazu eine Taste, die einen Zufallsklang würfelt
          - **Tiefpassfilter mit Resonanz** und eigener Hüllkurve, ADSR live mit dem Encoder einstellbar
          - **Joystick:** Vibrato, Wah-Filter, Bitcrush und Glide
          - **OLED:** Statusanzeige und ein animierter Visualizer

          Firmware, Gehäusedateien und Dokumentation sind unter MIT-Lizenz offen.
        en: |-
          Audio Dingo is a playable instrument with about 1,100 lines of firmware, split into the main program, pin configuration, presets and an encoder decoder.

          - **6 waveforms:** saw, pulse, triangle, sine, 2-operator FM and noise
          - **Chord mode:** every key plays three voices – major, minor, sus4 or octaves
          - **5 presets** – lead, bass, FM bell, sub and a kick drum – plus a button that rolls a random patch
          - **Resonant low-pass filter** with its own envelope, ADSR editable live with the encoder
          - **Joystick:** vibrato, wah filter, bit crush and glide
          - **OLED:** status screen and an animated visualizer

          Firmware, case files and documentation are open source under the MIT license.
      image: ''
      image_en: ''
      image_wide: false
      image_alt: null
      image_caption: null
    - heading:
        de: Was ich gelernt habe und ändern würde
        en: What I learned and would change
      body:
        de: |-
          - **Funktionen streichen:** Aufnahme und Wiedergabe waren geplant. Mit den wenigen Eingabemöglichkeiten des Geräts ließen sie sich nicht gut synchronisieren, und das Projekt wäre zu umfangreich geworden. Deshalb habe ich sie herausgenommen.
          - **Das Gehäuse hat am längsten gedauert:** Von allen Teilen des Projekts hat das Gehäusedesign die meiste Zeit gekostet.
          - **Ein stärkeres Board:** Beim nächsten Mal würde ich ein leistungsfähigeres Board als den Arduino Uno nehmen und darauf achten, dass es einen digitalen Audioausgang hat statt des DAC an A0.
        en: |-
          - **Cutting features:** recording and playback were planned. They couldn’t be synchronised well with the few inputs the device has, and they would have made the project too big, so I took them out.
          - **The enclosure took longest:** of all parts of the project, the case design took the most time.
          - **A stronger board:** next time I would use a more powerful board than the Arduino Uno and make sure it has a digital audio output instead of the DAC on A0.
      image: ''
      image_en: ''
      image_wide: false
      image_alt: null
      image_caption: null
images:
  - src: Images/Audiodingo/standingdingo.webp
    alt: 'Audio Dingo from the front: grey case with an orange speaker grille, two orange knobs, black keys and a small OLED display'
    alt_de: 'Audio Dingo von vorn: graues Gehäuse mit orangem Lautsprechergitter, zwei orangen Drehknöpfen, schwarzen Tasten und kleinem OLED-Display'
    caption: The finished enclosure, front view.
    caption_de: Das fertige Gehäuse, Frontalansicht.
  - src: /Images/Audiodingo/DingoinFusion.webp
    alt: Screenshot of the case design in Fusion 360
    alt_de: Screenshot des Gehäuseentwurfs in Fusion 360
    caption: The case design in Fusion 360
    caption_de: Der Gehäuseentwurf in Fusion 360
embed: <iframe width="560" height="315" src="https://www.youtube.com/embed/iitkykF2S_k?si=r0XPnJhy53a7T4wm" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
video_poster: /Images/Audiodingo/standingdingo.webp
date: 2026-01-02
---
