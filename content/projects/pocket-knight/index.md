---
published: true
title: Pocket Knight
slug: pocket-knight
category: '[Electronic, Game] 2026'
order: 0
cover_image: /Images/projects/pocket-knight/pocketknightcloth.webp
cover_image_alt: "Pocket Knight: a grey 3D-printed handheld with a small screen, lying on a cloth"
cover_image_alt_de: "Pocket Knight: ein graues, 3D-gedrucktes Handheld mit kleinem Display, auf einem Tuch"
summary_card: A mini game device that uses a pedometer as its core mechanic.
summary_card_de: Ein Mini-Spielgerät mit einem Schrittzähler als Kernmechanik.
summary: |-
  A small, pocket-sized device. It is a mini roguelike designed for on the go, where players make progress by walking. The steps collected throughout the day unlock events, which lead to different encounters and battles. With every battle, the player gains experience, improves their equipment, and grows stronger.

  The events are stored so that players can go through them one by one in the evening at their own pace, while only needing to carry the device with them during the day.
  I’m writing a bit more in depth about the development process in this [blog article](https://janwestphal.dev/blog/development-process-of-pocket-knight/).
summary_de: |-
  Ein kleines Gerät im Hosentaschenformat. Es ist ein Mini-Roguelike für unterwegs, bei dem man durch Schritte Fortschritt macht. Die Schritte, die man über den Tag sammelt, schalten Events frei, wodurch man auf unterschiedliche Ereignisse und Kämpfe trifft. Mit jedem Kampf sammelt der Spieler Erfahrung, verbessert seine Ausrüstung und wird stärker.

  Die Ereignisse werden gesammelt, sodass man sie abends in Ruhe nacheinander spielen kann und das Gerät nur tagsüber bei sich tragen muss.
  Etwas ausführlicher schreibe ich über den Entwicklungsprozess in diesem [Blogbeitrag](https://janwestphal.dev/blog/development-process-of-pocket-knight/).
meta:
  - Electronic
  - Prototype
  - Game
  - 'Status: released'
meta_de:
  - Elektronik
  - Prototyp
  - Game
  - 'Status: veröffentlicht'
images:
  - src: /Images/projects/pocket-knight/pocketknightcloth.webp
    alt: "Close-up of the Pocket Knight device: grey case, blue-framed OLED screen, blue fleur-de-lis buttons and a keychain charm"
    alt_de: "Nahaufnahme des Pocket-Knight-Geräts: graues Gehäuse, blau umrandetes OLED-Display, blaue Lilien-Tasten und ein Schlüsselanhänger"
    caption: Photo of the device
    caption_de: Foto von dem Gerät
  - src: /Images/projects/pocket-knight/pocketknightspriteposter.webp
    alt: "Poster of all Pocket Knight pixel sprites – the knight, events, enemies and bosses – drawn white on black"
    alt_de: "Poster mit allen Pixel-Sprites von Pocket Knight – Ritter, Ereignisse, Gegner und Bosse – weiß auf schwarz"
    caption: Pocket Knight - spriteposter
    caption_de: Pocket Knight - Spriteposter
  - src: /Images/projects/pocket-knight/pocketknightposter3.webp
    alt: "Pocket Knight poster: knights in a classical painting reach for the device, which floats above them like a holy grail"
    alt_de: "Pocket-Knight-Poster: Ritter in einem klassischen Gemälde greifen nach dem Gerät, das wie ein heiliger Gral über ihnen schwebt"
    caption: Pocket Knight - a holy grail
    caption_de: Pocket Knight - Der heilige Gral
embed: <iframe width="560" height="315" src="https://www.youtube.com/embed/YMT1BVRyX4g?si=-3MBMNdEbFsba26u" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
case:
  role:
    en: 'Solo project: concept, electronics, firmware, game design, pixel art and enclosure'
    de: 'Soloprojekt: Konzept, Elektronik, Firmware, Game Design, Pixelart und Gehäuse'
  duration:
    en: About 3 months in my free time, 2026
    de: Rund 3 Monate in meiner Freizeit, 2026
  tools:
  - Fusion
  - Prusa Mini (FabLab Kiel)
  hardware:
  - en: DFRobot FireBeetle 2 ESP32
    de: DFRobot FireBeetle 2 ESP32
  - en: OLED display, 128 × 64 px
    de: OLED-Display, 128 × 64 px
  - en: Seeed Grove pedometer (BMA456)
    de: Seeed-Grove-Schrittzähler (BMA456)
  - en: Piezo buzzer and mini vibration motor
    de: Piezo-Summer und Mini-Vibrationsmotor
  - en: 3 push buttons
    de: 3 Taster
  - en: 1800 mAh Li-ion battery
    de: Li-Ionen-Akku mit 1800 mAh
  - en: Perfboard, PLA enclosure
    de: Lochrasterplatine, Gehäuse aus PLA
  links:
  - label:
      en: 'Devlog: the whole development process'
      de: 'Devlog: der ganze Entwicklungsprozess'
    url: /blog/development-process-of-pocket-knight/
  sections:
  - heading:
      en: Idea
      de: Idee
    body:
      en: 'I wanted to build a device that brings to mind the Digimon Digivice toys from my childhood: small enough for a trouser pocket, and with a game that moves forward while you walk.


        The goal was a complete, playable roguelike on a 128 × 64 px screen – with as few parts as possible, so the device stays light and the battery lasts a long time.'
      de: 'Ich wollte ein Gerät bauen, das an die Digivice-Spielzeuge aus meiner Kindheit erinnert: klein genug für die Hosentasche und mit einem Spiel, das beim Gehen vorankommt.


        Ziel war ein vollständiges, spielbares Roguelike auf einem Display mit 128 × 64 px – mit so wenigen Bauteilen wie möglich, damit das Gerät leicht bleibt und der Akku lange hält.'
  - heading:
      en: Approach
      de: Vorgehen
    body:
      en: 'I picked an ESP32 FireBeetle because the board already handles the battery, so I only had to connect a Li-ion cell. Everything was first wired up on a breadboard, and I wrote the firmware against that setup.


        Once the circuit and code were stable, I soldered all parts onto a piece of perfboard as compactly as possible. In parallel I designed the enclosure in Fusion and printed it on a Prusa Mini at the FabLab Kiel.'
      de: 'Ich habe einen ESP32 FireBeetle gewählt, weil das Board den Akku schon selbst versorgt und ich nur noch eine Li-Ionen-Zelle anschließen musste. Zuerst lief alles auf einem Breadboard, und darauf habe ich die Firmware geschrieben.


        Als Schaltung und Code stabil waren, habe ich alle Teile möglichst kompakt auf eine Lochrasterplatine gelötet. Parallel dazu habe ich das Gehäuse in Fusion entworfen und im FabLab Kiel auf einem Prusa Mini gedruckt.'
    image: /Images/PocketKnight/handheldbreadboard.webp
    image_alt:
      en: 'Breadboard prototype: the OLED display shows a battle screen, wired to the ESP32, three buttons and the pedometer'
      de: 'Breadboard-Prototyp: Das OLED-Display zeigt einen Kampfbildschirm, verkabelt mit dem ESP32, drei Tastern und dem Schrittzähler'
    image_caption:
      en: The first prototype on the breadboard
      de: Der erste Prototyp auf dem Breadboard
  - heading:
      en: Challenges
      de: Herausforderungen
    body:
      en: '- **Counting steps while asleep:** the device has to sleep to save power but must not lose a single step.

        - **Pixel graphics:** loading sprites and playing animations on a small OLED took several attempts.

        - **Very little space:** 128 px of width is not much for text, items and battle information. Some texts are still cut off today.'
      de: '- **Schritte zählen im Schlafmodus:** Das Gerät muss schlafen, um Strom zu sparen, darf dabei aber keinen Schritt verlieren.

        - **Pixelgrafik:** Sprites laden und Animationen auf dem kleinen OLED abspielen hat mehrere Anläufe gebraucht.

        - **Sehr wenig Platz:** 128 px Breite sind wenig für Text, Gegenstände und Kampfinfos. Manche Texte werden bis heute abgeschnitten.'
    image: /Images/PocketKnight/handheldactive.webp
    image_alt:
      en: The soldered perfboard with the OLED display showing a battle between the knight and two enemies
      de: Die gelötete Lochrasterplatine, das OLED-Display zeigt einen Kampf zwischen dem Ritter und zwei Gegnern
    image_caption:
      en: Soldered onto perfboard, the game already running
      de: Auf Lochraster gelötet, das Spiel läuft schon
  - heading:
      en: Game design
      de: Spielmechanik
    body:
      en: 'Every 250 steps an event is triggered, and the device beeps and vibrates. Up to 20 events are stored, so you can play them all in one go in the evening.


        Battles are turn-based: the enemy shows its next move in advance, and the player has 3 skill points per fight for attacks, blocks and special skills. After every 10 events there is a boss; a full run is 50 events and a final boss. When a run ends, meta currency unlocks new items, equipment and starting bonuses.'
      de: 'Alle 250 Schritte wird ein Event ausgelöst, das Gerät piept und vibriert. Bis zu 20 Events werden gespeichert, sodass man sie abends am Stück spielen kann.


        Die Kämpfe sind rundenbasiert: Der Gegner zeigt seinen nächsten Zug vorher an, und der Spieler hat pro Kampf 3 Skillpunkte für Angriffe, Blocks und Spezialfähigkeiten. Nach jeweils 10 Events wartet ein Boss, ein ganzer Durchlauf umfasst 50 Events und einen Endboss. Endet ein Durchlauf, schaltet eine Meta-Währung neue Gegenstände, Ausrüstung und Startboni frei.'
  - heading:
      en: Result and next steps
      de: Ergebnis und Ausblick
    body:
      en: 'The device works and has been in daily use for weeks. Based on the measured consumption, one charge lasts about 3–4 months – the battery is clearly oversized and makes up much of the weight, so next time I''d use a much smaller one.


        Cut for now: co-op and versus multiplayer over ESP-NOW, an online leaderboard, more starting classes and an English version of the game texts.'
      de: 'Das Gerät funktioniert und ist seit Wochen im Alltag im Einsatz. Nach dem gemessenen Verbrauch hält eine Akkuladung etwa 3–4 Monate – der Akku ist deutlich überdimensioniert und macht einen Großteil des Gewichts aus, beim nächsten Mal würde ich einen viel kleineren nehmen.


        Vorerst gestrichen: Koop- und Versus-Multiplayer über ESP-NOW, eine Online-Bestenliste, weitere Startklassen und eine englische Fassung der Spieltexte.'
    image: /Images/blog/development-process-of-pocket-knight/Printfablab.webp
    image_alt:
      en: A Prusa Mini 3D printer at the FabLab Kiel printing the grey enclosure
      de: Ein 3D-Drucker Prusa Mini im FabLab Kiel druckt das graue Gehäuse
    image_caption:
      en: Printing the enclosure at the FabLab Kiel
      de: Das Gehäuse entsteht im FabLab Kiel
date: 2026-08-20
---
