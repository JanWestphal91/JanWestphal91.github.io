---
published: true
title: Pocket Knight
title_de: ''
slug: pocket-knight
category: '[Electronic, Game] 2026'
order: 0
cover_image: /Images/projects/pocket-knight/pocketknightcloth.webp
cover_image_alt: 'Pocket Knight: a grey 3D-printed handheld with a small screen'
cover_image_alt_de: 'Pocket Knight: ein 3D-gedruckter Handheld mit kleinem Display'
summary_card: A mini game device that uses a pedometer as its core mechanic.
summary_card_de: Ein Mini Spielgerät mit einem Schrittzähler als Kernmechanik.
summary: |-
  A small, pocket-sized device. It is a mini roguelike designed for on the go, where players make progress by walking. The steps collected throughout the day unlock events, which lead to different encounters and battles. With every battle, the player gains experience, improves their equipment, and grows stronger.

  The events are stored so that players can go through them one by one in the evening at their own pace, while only needing to carry the device with them during the day.
  I’m writing a bit more in depth about the development process in this [blog article](https://janwestphal.dev/blog/development-process-of-pocket-knight/).
summary_de: |-
  Ein kleines Gerät im Hosentaschenformat. Es ist ein Mini Roguelike für unterwegs, bei dem man durch Schritte Fortschritt macht. Die Schritte, die man über den Tag sammelt schalten Events frei, wodurch man auf unterschiedliche Ereignisse und Kämpfe trifft. Mit jedem Kampf sammelt der Spieler Erfahrung, verbessert seine Ausrüstung und wird stärker.

  Die Ereignisse werden gesammelt, sodass man sie abends in Ruhe nacheinander spielen kann und das Gerät nur tagsüber bei sich tragen muss.
  Etwas ausführlicher schreibe ich über den Entwicklungsprozess in diesem [Blogbeitrag](https://janwestphal.dev/blog/development-process-of-pocket-knight/).
meta:
  - 'Status: playable prototype'
meta_de:
  - 'Status: spielbarer Prototyp'
flipbooks: []
models_intro: null
models: []
case:
  role:
    de: 'Soloprojekt: Konzept, Elektronik, Firmware, Game Design, Pixelart und Gehäuse'
    en: 'Solo project: concept, electronics, firmware, game design, pixel art and enclosure'
  duration:
    de: Rund 3 Monate in meiner Freizeit, 2026
    en: About 3 months in my free time, 2026
  tools:
    - C++ (Arduino IDE)
    - U8g2
    - Aseprite
    - Fusion 360
    - PrusaSlicer
    - Prusa MINI+ (FabLab Kiel)
  hardware:
    - de: DFRobot FireBeetle 2 ESP32-E
      en: DFRobot FireBeetle 2 ESP32-E
    - de: SSD1306-OLED-Display, 128 × 64 px
      en: SSD1306 OLED display, 128 × 64 px
    - de: Seeed-Grove-Schrittzähler (BMA456)
      en: Seeed Grove step counter (BMA456)
    - de: Passiver Piezo-Summer und Mini-Vibrationsmotor
      en: Passive piezo buzzer and mini vibration motor
    - de: 3 Taster
      en: 3 push buttons
    - de: Li-Ionen-Akku mit 1800 mAh
      en: 1800 mAh Li-ion battery
    - de: Lochrasterplatine, zweifarbiges Gehäuse aus PLA
      en: Perfboard, two-colour PLA enclosure
  links:
    - label:
        de: 'GitHub-Repository: Firmware, Gehäusedateien, Artwork'
        en: 'GitHub repository: firmware, case files, artwork'
      url: https://github.com/JanWestphal91/Pocket-Knight
    - label:
        de: 'Devlog: der ganze Entwicklungsprozess'
        en: 'Devlog: the whole development process'
      url: /blog/development-process-of-pocket-knight/
  sections:
    - heading:
        de: Idee
        en: Idea
      body:
        de: |-
          Ich wollte ein Gerät bauen, das an die Digivice-Spielzeuge aus meiner Kindheit erinnert: klein genug für die Hosentasche und mit einem Spiel, das beim Gehen vorankommt. Tagsüber bleibt das Gerät in der Tasche und zählt Schritte, abends spielt man die gesammelten Events in Ruhe durch.

          Drei Anforderungen haben fast jede Entscheidung bestimmt: Das Gerät muss in eine Hosentasche passen, es muss wochenlang ohne Laden auskommen, und es muss den ganzen Tag Schritte zählen, ohne dass jemand es bedient. Die letzten beiden widersprechen sich: Dauerhaftes Zählen kostet Strom, eine lange Laufzeit verlangt, dass der Prozessor fast immer schläft.
        en: |-
          I wanted to build a device that brings to mind the Digimon Digivice toys from my childhood: small enough for a trouser pocket, and with a game that moves forward while you walk. During the day the device stays in your pocket and counts steps; in the evening you play through the collected events at your own pace.

          Three requirements shaped almost every decision: the device has to fit in a trouser pocket, it has to last for weeks without charging, and it has to count steps all day without anyone touching it. The last two contradict each other: counting all the time costs power, while a long runtime needs the processor to be asleep almost all the time.
      image: ''
      image_en: ''
      image_wide: false
      image_alt: null
      image_caption: null
    - heading:
        de: Vorgehen
        en: Approach
      body:
        de: |-
          Ich habe einen FireBeetle 2 ESP32-E gewählt, weil das Laden des Akkus schon auf dem Board passiert und ich nur noch eine Li-Ionen-Zelle anschließen musste. Für die Schritte nutze ich einen BMA456, der Schritte selbstständig in der Hardware zählt. Zuerst lief alles auf einem Breadboard, darauf habe ich den Großteil der Firmware geschrieben.

          Als Schaltung und Code stabil waren, habe ich alle Teile möglichst kompakt auf eine Lochrasterplatine gelötet und danach Spielablauf, Inhalte und Sprites verfeinert, bis es sich wie ein vollständiges Spiel anfühlte.
        en: |-
          I picked a FireBeetle 2 ESP32-E because battery charging is already on the board, so I only had to connect a Li-ion cell. For the steps I use a BMA456, which counts steps by itself in hardware. Everything was first wired up on a breadboard, and I wrote most of the firmware against that setup.

          Once circuit and code were stable, I soldered all parts onto a piece of perfboard as compactly as possible, then refined the game loop, content and sprites until it felt like a complete game.
      image: /Images/PocketKnight/handheldbreadboard.webp
      image_en: ''
      image_wide: false
      image_alt:
        de: 'Breadboard-Prototyp: Das OLED-Display zeigt einen Kampfbildschirm, verkabelt mit dem ESP32, drei Tastern und dem Schrittzähler'
        en: 'Breadboard prototype: the OLED display shows a battle screen, wired to the ESP32, three buttons and the pedometer'
      image_caption:
        de: Der erste Prototyp auf dem Breadboard
        en: The first prototype on the breadboard
    - heading:
        de: Schritte zählen im Schlaf
        en: Counting steps while asleep
      body:
        de: |-
          Die Lösung für den Widerspruch oben ist, die Arbeit zu teilen. Der BMA456 zählt die Schritte durchgehend selbst, und der ESP32 geht nach 30 Sekunden ohne Eingabe in den Deep Sleep. Taste A weckt ihn wieder.

          **Was zuerst schiefging:** Der Schrittzähler hat aufgehört zu zählen und sich zurückgesetzt, sobald er keine Stromversorgung hatte. Sein Zählerstand lag danach unter dem Wert, den das Spiel zuletzt gespeichert hatte.

          **So funktioniert es jetzt:**

          - Beim Start prüft die Firmware, warum das Gerät startet. Nach einem Kaltstart richtet sie den Sensor ein und speichert 0 als neuen Bezugswert. Nach dem Aufwachen aus dem Deep Sleep richtet sie ihn bewusst nicht neu ein, weil das seinen Zähler zurücksetzen würde.
          - Ins Spiel geht nur die Differenz zum gespeicherten Zählerstand. Ist der neue Wert kleiner, erkennt die Firmware einen Reset und setzt nur den Bezugswert neu, statt Schritte abzuziehen.
          - Schlägt das Auslesen über I²C fehl, gibt die Funktion den letzten bekannten Wert zurück. Ein Lesefehler kommt so nie als Schrittsprung im Spiel an.

          Vereinfachter Ausschnitt aus `progress.ino`:

          ```cpp
          void syncSteps() {
            uint32_t cur = readSensorSteps();   // Zählerstand des BMA456
            if (cur > lastSensorSteps) {
              addSteps(cur - lastSensorSteps);  // nur die Differenz zählt
              lastSensorSteps = cur;
            } else if (cur < lastSensorSteps) {
              lastSensorSteps = cur;            // Sensor wurde zurückgesetzt
            }
          }
          ```
        en: |-
          The solution to the contradiction above is to split the work. The BMA456 counts steps on its own the whole time, and the ESP32 goes into deep sleep after 30 seconds without input. Pressing button A wakes it up again.

          **What went wrong first:** the step counter stopped counting and reset itself whenever it had no power. Its counter was then lower than the last value the game had saved.

          **How it works now:**

          - On start-up the firmware checks why the device is starting. After a cold start it sets up the sensor and stores 0 as the new baseline. After waking from deep sleep it deliberately does not set the sensor up again, because that would reset its counter.
          - Only the difference to the saved counter value goes into the game. If the new value is lower, the firmware treats it as a reset and only moves the baseline instead of subtracting steps.
          - If reading over I²C fails, the function returns the last known value, so a read error never shows up as a jump in steps.

          Simplified excerpt from `progress.ino`:

          ```cpp
          void syncSteps() {
            uint32_t cur = readSensorSteps();   // BMA456 counter
            if (cur > lastSensorSteps) {
              addSteps(cur - lastSensorSteps);  // only the difference counts
              lastSensorSteps = cur;
            } else if (cur < lastSensorSteps) {
              lastSensorSteps = cur;            // sensor was reset
            }
          }
          ```
      image: /Images/PocketKnight/schlaf-de.webp
      image_en: /Images/PocketKnight/schlaf-en.webp
      image_wide: true
      image_alt:
        de: 'Diagramm des Schlaf- und Wachzyklus: Nach 30 Sekunden ohne Eingabe speichert der ESP32 und geht in den Deep Sleep; Taste A weckt ihn, und die Differenz zum gespeicherten Zählerstand wird zu Spielschritten. Der BMA456 zählt die ganze Zeit. Eine gestrichelte Linie markiert den Interrupt des Schrittzählers als geplante zweite Weckquelle.'
        en: 'Diagram of the sleep and wake cycle: after 30 seconds without input the ESP32 saves and goes into deep sleep; button A wakes it, and the difference to the saved counter becomes game steps. The BMA456 counts steps the whole time. A dashed line marks the step counter interrupt as a planned second wake source.'
      image_caption:
        de: Schlaf- und Wachzyklus der Firmware
        en: Sleep and wake cycle of the firmware
    - heading:
        de: Pixelgrafik
        en: Pixel graphics
      body:
        de: |-
          Alle Sprites habe ich in Aseprite als 1-Bit-Pixelart gezeichnet. Schwierig war der Weg aufs Display: Jede Grafik musste ins XBM-Format umgewandelt werden, und die Animationen werden direkt im Code gesteuert, der Bild für Bild festlegt, was gezeichnet wird. Gezeichnet wird mit der Bibliothek U8g2, die Bitmaps liegen per `PROGMEM` im Flash statt im knappen Arbeitsspeicher.

          Rückblickend hätte eine Bibliothek oder ein kleines Werkzeug für Sprite-Animationen viel Handarbeit gespart.
        en: |-
          I drew all sprites in Aseprite as 1-bit pixel art. The hard part was getting them onto the display: every graphic had to be converted to the XBM format, and the animations are controlled directly in the code, which decides frame by frame what gets drawn. Drawing is done with the U8g2 library, and the bitmaps are stored in flash with `PROGMEM` instead of in the small working memory.

          Looking back, a library or a small tool for sprite animations would have saved a lot of manual work.
      image: /Images/projects/pocket-knight/pocketknightspriteposter.webp
      image_en: ''
      image_wide: false
      image_alt:
        de: Poster mit allen Pixel-Sprites von Pocket Knight – Ritter, Ereignisse, Gegner und Bosse – weiß auf schwarz
        en: Poster of all Pocket Knight pixel sprites – the knight, events, enemies and bosses – drawn white on black
      image_caption:
        de: Alle Sprites des Spiels
        en: All sprites of the game
    - heading:
        de: Firmware
        en: Firmware
      body:
        de: |-
          Die Firmware ist in C++ in der Arduino IDE geschrieben und in Module aufgeteilt: Kampf, Events, Fortschritt und Speichern, Darstellung und Audio.

          - **Zustandsautomat:** Jeder Bildschirm ist ein eigener Zustand. Die Hauptschleife ruft die passende Funktion für Eingabe und Darstellung auf; der Kampf hat eigene Phasen (wählen, auswerten, Ergebnis, Gegenstandswahl).
          - **Kein doppelter Tastendruck:** Taste A weckt das Gerät und bestätigt im Menü. Damit derselbe Druck nicht sofort eine Aktion auslöst, ignoriert die Firmware nach dem Aufwachen alle Eingaben, bis jede Taste einmal losgelassen wurde.
          - **Immer gespeichert:** Der Fortschritt wird an jedem Checkpoint und vor dem Einschlafen in den Flash-Speicher geschrieben, getrennt nach aktuellem Durchlauf und dauerhaftem Fortschritt. Jeder Spielstand trägt eine Versionsnummer; passt sie nicht zur Firmware, wird er verworfen statt falsch gelesen.
          - **Inhalte als Daten:** Gegner, Gegenstände, Freischaltungen und Event-Gewichte stehen als Tabellen oben im Code. Zum Balancing muss ich die Logik nicht anfassen.
        en: |-
          The firmware is written in C++ in the Arduino IDE and split into modules: combat, events, progress and saving, rendering and audio.

          - **State machine:** every screen is a state. The main loop calls the matching input and drawing function; combat has its own phases (choose, resolve, result, item choice).
          - **No double press:** button A wakes the device and also confirms in the menu. So the same press doesn’t trigger an action right away, the firmware ignores all input after waking until every button has been released once.
          - **Always saved:** progress is written to flash at every checkpoint and before sleeping, in two separate areas for the current run and the permanent progress. Every save carries a version number; if it doesn’t match the firmware, the save is discarded instead of being read wrongly.
          - **Data-driven content:** enemies, items, unlocks and event weights are tables at the top of the code, so balancing doesn’t require touching the logic.
      image: /Images/PocketKnight/handheldactive.webp
      image_en: ''
      image_wide: false
      image_alt:
        de: Die gelötete Lochrasterplatine, das OLED-Display zeigt einen Kampf zwischen dem Ritter und zwei Gegnern
        en: The soldered perfboard with the OLED display showing a battle between the knight and two enemies
      image_caption:
        de: Auf Lochraster gelötet, das Spiel läuft schon
        en: Soldered onto perfboard, the game already running
    - heading:
        de: Spielmechanik und Balancing
        en: Game design and balancing
      body:
        de: |-
          Im Schnitt alle 300 Schritte (zufällig zwischen 220 und 380) kommt ein neues Event dazu. Ist das Gerät in dem Moment wach, piept und vibriert es. Bis zu 10 Events werden gespeichert, sodass man sie später am Stück spielen kann. An jeder Weggabelung wählt man eins von zwei Events, von Kämpfen und Händlern bis zu Fallen, Schreinen und einem Wunschbrunnen.

          Die Kämpfe sind rundenbasiert: Der Gegner zeigt seinen nächsten Zug vorher an, und der Spieler antwortet mit Angriff, Block, einer von 5 Fähigkeiten oder einem Verbrauchsgegenstand. Nach jeweils 10 Events wartet ein Boss; wer den vierten besiegt, gewinnt den Durchlauf. Insgesamt gibt es 7 Gegnertypen mit eigenem Verhalten und 22 Gegenstände. Endet ein Durchlauf, schalten Meta-Punkte dauerhafte Startboni frei.

          **Balancing:** In der ersten Fassung kam alle 250 Schritte ein Event, und bis zu 20 konnten sich ansammeln. Das machte die Session am Abend mühsam. Mit etwas mehr Schritten pro Event und höchstens 10 gespeicherten Events bleibt der Abend kurz, und ein Durchlauf mit 40 Events dauert ungefähr eine Woche.
        en: |-
          On average every 300 steps (randomly between 220 and 380) a new event is queued; if the device is awake at that moment, it beeps and vibrates. Up to 10 events are stored, so you can play them in one go later. At every fork you choose one of two events – 11 types, from fights and traders to traps, shrines and a wishing well.

          Battles are turn-based: the enemy shows its next move in advance, and the player answers with attack, block, one of 5 skills or a consumable. After every 10 events a boss waits; defeating the fourth boss wins the run. In total there are 7 enemy types with their own behaviour and 22 items. When a run ends, meta points unlock permanent start bonuses.

          **Balancing:** in the first version an event came every 250 steps, and up to 20 could pile up. That made the evening session tedious. With a few more steps per event and at most 10 stored events, the evening stays short, and a run of 40 events takes roughly a week.
      image: ''
      image_en: ''
      image_wide: false
      image_alt: null
      image_caption: null
    - heading:
        de: Gehäuse
        en: Enclosure
      body:
        de: |-
          Das Gehäuse habe ich in Fusion 360 entworfen und im FabLab Kiel auf einem Prusa MINI+ zweifarbig gedruckt: grau für den Körper, blau für den Displayrahmen und die Lilien-Embleme. Eine kleine Münze mit dem Emblem dient als Schlüsselanhänger. Nach dem ersten Druck gab es eine Überarbeitung, in der ich nur die Tiefe des Gehäuses leicht angepasst habe.

          Druckdateien und Slicer-Einstellungen liegen im GitHub-Repository, sodass sich das Gerät nachbauen lässt.
        en: |-
          I designed the case in Fusion 360 and printed it in two colours on a Prusa MINI+ at the FabLab Kiel: grey for the body, blue for the display frame and the fleur-de-lis emblems. A small coin with the emblem doubles as a key-ring charm. After the first print there was one revision, in which I only adjusted the depth of the case slightly.

          The print files and slicer settings are in the GitHub repository, so the device can be rebuilt.
      image: /Images/PocketKnight/enclosure-fusion360.webp
      image_en: ''
      image_wide: false
      image_alt:
        de: Das Pocket-Knight-Gehäuse und die Schlüsselanhänger-Münze mit Lilien-Emblem in Fusion 360
        en: The Pocket Knight enclosure and the key-ring coin with fleur-de-lis emblem in Fusion 360
      image_caption:
        de: Gehäuse und Anhänger-Münze in Fusion 360
        en: Enclosure and key-ring coin in Fusion 360
    - heading:
        de: Ergebnis
        en: Result
      body:
        de: |-
          Pocket Knight ist ein spielbarer Prototyp: ein kompletter Durchlauf mit 11 Eventarten, 7 Gegnertypen, 4 Bossen, 22 Gegenständen und dauerhaftem Fortschritt über mehrere Durchläufe, in rund 3.700 Zeilen Firmware. Das Gerät ist seit Wochen im Alltag im Einsatz. Im Hauptmenü steckt noch ein Debug-Eintrag zum Testen; da es nur dieses eine Gerät gibt, bleibt der Status bei Prototyp.

          Die Laufzeit habe ich über die Akkuanzeige des Geräts abgeschätzt: Je eine Woche im normalen Betrieb und im Standby habe ich beobachtet, wie weit die Prozentanzeige sinkt, und das hochgerechnet. Daraus ergeben sich etwa 3–4 Monate pro Akkuladung. Firmware, Gehäusedateien und Artwork sind unter MIT-Lizenz offen.
        en: |-
          Pocket Knight is a playable prototype: a complete run with 11 event types, 7 enemy types, 4 bosses, 22 items and permanent progress across runs, in about 3,700 lines of firmware. The device has been in daily use for weeks. The main menu still contains a debug entry for testing; since there is only this one device, the status stays at prototype.

          I estimated the runtime from the device’s battery display: for one week each in normal use and in standby, I watched how far the percentage dropped and extrapolated from that. This gives roughly 3–4 months per charge. Firmware, case files and artwork are open source under the MIT license.
      image: /Images/PocketKnight/size-comparison.webp
      image_en: ''
      image_wide: false
      image_alt:
        de: Die gelötete Elektronik mit OLED-Display neben einer Banane als Größenvergleich
        en: The soldered electronics with the OLED display lying next to a banana for scale
      image_caption:
        de: Banane zum Größenvergleich
        en: Banana for scale
    - heading:
        de: Was ich gelernt habe und ändern würde
        en: What I learned and would change
      body:
        de: |-
          - **Energie gegen Spielgefühl:** Der Deep Sleep sichert die Laufzeit, kostet aber eine Funktion. Neue Events melden sich mit Piepen und Vibration nur, solange das Gerät wach ist. In der Tasche schläft es fast immer, deshalb sammeln sich die Events still an. Der nächste Schritt ist, den Interrupt des BMA456 als zweite Weckquelle zu nutzen.
          - **Kleinerer Akku:** 1800 mAh reichen für Monate, sind aber das schwerste Bauteil. Beim nächsten Mal würde ich zuerst die gewünschte Laufzeit festlegen und den Akku danach wählen.
          - **Genauere Akkuanzeige:** Die Prozentanzeige rechnet die Spannung linear um. Li-Ionen-Zellen entladen sich aber nicht linear, deshalb ist auch die Laufzeit-Schätzung nur grob. Eine Tabelle mit der echten Entladekurve wäre genauer.
          - **Inhalte für das Display entwerfen:** 128 px Breite reichen nicht für jeden Text. Manche Texte werden abgeschnitten, und einige Mechaniken erklärt das Spiel zu wenig.
          - **Werkzeuge für Grafiken:** Für Sprites und Animationen würde ich von Anfang an eine Bibliothek oder ein eigenes Export-Skript nutzen.

          Vorerst gestrichen: Koop- und Versus-Multiplayer über ESP-NOW, eine Online-Bestenliste, flüssigere Animationen, weitere Startklassen und eine englische Fassung der Spieltexte.
        en: |-
          - **Power versus game feel:** deep sleep secures the runtime but costs a feature. New events only announce themselves with a beep and vibration while the device is awake. In a pocket it is almost always asleep, so events pile up silently. The next step is to use the BMA456 interrupt as a second wake source.
          - **A smaller battery:** 1800 mAh lasts for months but is the heaviest part. Next time I’d set the runtime I want first and choose the battery to match.
          - **A more honest battery display:** the percentage is calculated linearly from the voltage, but Li-ion cells don’t discharge linearly, so the runtime estimate is rough too. A table with the real discharge curve would be more accurate.
          - **Designing content for the display:** 128 px of width is not enough for every text. Some texts are cut off, and a few mechanics are not explained well enough in the game.
          - **Tools for graphics:** for sprites and animations I would use a library or my own export script from the start.

          Cut for now: co-op and versus multiplayer over ESP-NOW, an online leaderboard, smoother animations, more starting classes and an English version of the game texts.
      image: ''
      image_en: ''
      image_wide: false
      image_alt: null
      image_caption: null
images:
  - src: /Images/projects/pocket-knight/pocketknightposter3.webp
    alt: 'Pocket Knight poster: knights in a classical painting reach for the device, which floats above them like a holy grail'
    alt_de: 'Pocket-Knight-Poster: Ritter in einem klassischen Gemälde greifen nach dem Gerät, das wie ein heiliger Gral über ihnen schwebt'
    caption: Pocket Knight - a holy grail
    caption_de: Pocket Knight - Der heilige Gral
embed: <iframe width="560" height="315" src="https://www.youtube.com/embed/YMT1BVRyX4g?si=-3MBMNdEbFsba26u" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
video_poster: /Images/projects/pocket-knight/closeshotpocketknight.webp
date: 2026-08-20
---
