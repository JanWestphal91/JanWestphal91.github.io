---
published: true
title: Development process of Pocket Knight
title_de: Entwicklungsprozess des Mini Spielgeräts Pocket Knight
date: 2026-08-20
description: Detailed Development process of a handheld device.
description_de: Dokumentation des Entwicklungsprozess für ein Handheld Gerät.
cover_image: /Images/blog/development-process-of-pocket-knight/closeshotpocketknight.png
cover_image_alt: Photo of the finished device
tags:
  - Game Dev, Prototyping, Electronics
images:
  - src: /Images/blog/development-process-of-pocket-knight/pocketknightcloth.webp
    alt: pocketKnightDevice
    caption: Pocket Knight finished device
    caption_de: Pocket Knight fertiges Gerät
  - src: /Images/blog/development-process-of-pocket-knight/pocketknightspriteposter.webp
    alt: PocketknightSprites
    caption: Pocket Knight Sprites
    caption_de: Pocket Knight Sprites
  - src: /Images/pocketknightposter3.webp
    alt: HolyGrail poster
    caption: silly holy grail poster
    caption_de: leicht albernes heiliger Gral Poster
  - src: /Images/blog/development-process-of-pocket-knight/pocketknight2.webp
    alt: silly knight giving
    caption: giving the grace.
    caption_de: die Gnade wird gegeben.
body_de: |-
  Hallo! Ich hatte schon länger den Wunsch ein Gerät zu bauen das an die Digimon Digivice Spielzeuge erinnert, ich fand die Teile richtig cool als Kind obwohl ich selbst nie eins hatte, aber das hab ich ja nun auf eine andere Art und Weise nachgeholt :) 

  [![digivice device](/Images/blog/development-process-of-pocket-knight/Digivice_ver1_1.webp "Das besagte Spielzeug, Bildquelle: https://wikimon.net/images/9/99/Digivice_ver1_1.jpg")](https://wikimon.net/images/9/99/Digivice_ver1_1.jpg)

  Also habe ich angefangen erstmal ein Konzept auszuarbeiten und mir überlegt welche Teile ich denn nehmen könnte, diesmal habe ich mich für einen DFRobot Firebeetle v2 ESP32 entschieden weil er bereits die Stromversorgung auf dem Board hat und ich nur noch einen Akku anklemmen musste.

  Dadurch dass das Gerät eben auch hosentaschentauglich sein sollte, habe ich versucht das ganze möglichst minimalistisch zu halten. 

  Weitere Komponenten die ich genutzt habe sind:

  - 128 x 64 Pixel Oled Display
  - seeed Grove - Pedometer (BMA456) (Schrittzähler) 
  - Piezo Buzzer (Soundausgabe)
  - Mini Vibrationsmotor (fürs haptische Feedback)
  - 3 kleine Schalter (Inputs)
  - 1800 mAh Li-ion Akku (deutlich kleiner hätte es auch getan)
  - PLA Filament für das Gehäuse
  - eine Lochrasterplatine, Litze und Lötzinn 
  - Sekundenkleber und Heißklebe :)

  Nachdem ich ungefähr einen Plan hatte und alle Teile zusammengesucht habe, habe ich angefangen auf einem Breadboard erstmal alles zusammenzustecken und mich erstmal dem Code gewidmet.

  Dabei gab es mehrere Hürden die mich mehrfach zum verzweifeln gebracht haben, die Integration des Schrittzählers, die Sleep Funktion während trotzdem Schritte gezählt werden, das Laden und Darstellen von Pixelgrafiken und die Animationen. Alles andere war auch schwer, was hab ich mir nur gedacht?!

  ![BreadboardPocketknight](/Images/pcoketknightbreadboard.webp "Breadboard Prototyping")

  Nachdem ich dann irgendwann einen halbwegs brauchbaren Code hatte und die Breadboard Schaltung soweit finalisiert war gings ans Löten. Ich habe dabei versucht alle Komponenten so kompakt wie möglich zusammenzukriegen, was auch soweit ganz gut geklappt hat.

  ![finished Electronic](/Images/PocketKnight/handheldactive.webp "fertig gelötetes Teil")

  Im nächsten Schritt habe ich dann noch weiter am Gameloop, am Content und den Sprites gearbeitet um daraus ein "rundes" Spiel zu bekommen. Nebenbei habe ich angefangen das gehäuse in Fusion zu entwerfen und es dann anschließend im [Kieler FabLab](https://fablab.sh/) gedruckt.

  ![3dPrinter-printing](/Images/blog/development-process-of-pocket-knight/Printfablab.webp "Druckvorgang vom Deckel  am Prusa Mini")

  Und dann war es endlich soweit und das Gerät näherte sich der Fertigstellung, insgesamt hat das ganze wieder deutlich länger gedauert als geplant und ich habe bummelig 3 Monate Freizeit in das Projekt reingesteckt. 

  Ich hatte noch einige Ideen die ich gerne noch implementiert hätte, die ich aber aus Zeit- und Lustmangel erstmal gestrichen habe. 

  Hier die gestrichenen Features:

  - Multiplayer: Coop und Kompetitiv über ESP-NOW
  - Online Leaderboard über Wlanverbindung 
  - Coolere Animationen und Effektübergänge zwischen Screens
  - Unterschiedliche Starklassen (ich wollte zuerst zwei Geräte bauen, eins mit Ritter und eins mit Zauberer für den Coopmodus)
  - Lokalisierung auf englisch, ich habe erstmal alle Strings auf deutsch geschrieben und bin aus Bequemlichkeit nun dabei geblieben.

  Fehler die noch angegangen werden müssten:

  - Texte sind manchmal abgeschnitten weil sie zu lang sind, 128 px sind einfach echt nicht viel für Informationen.
  - Manche Elemente, Mechaniken und Items sind untererklärt.
  - Nicht alle Gegner haben eine Animation

  Beim nächsten mal würde ich auch einen viel kleineren Akku nehmen, der macht ein Großteil des Gewichts aus, ich hab das Gerät nun einige Wochen getestet und wenn ich die Akkunutzung hochrechne komme ich auf eine Laufzeit von ungefähr 3-4 Monaten mit einer Akkuladung das ist zwar recht komfortabel aber schon eher überdimensioniert. 

  Und jetzt erstmal zu dem eigentlich interessanten Teil, dem Spiel!

  Der Gameloop läuft so:

  Der Spieler startet mit einem Ritter auf LVL 1, alle 250 Schritte wird ein Event getriggert, es vibriert und piept wenn das gerät nicht im Schlafmodus ist. 

  So können insgesamt 20 Events gesammelt werden die dann nacheinander am Stück gespielt werden können sobald man Zeit dafür findet. 

  Im Kampf ist der Spieler zu erst dran und hat 3 Skillpunkte für den ganzen Kampf, er kann Angreifen, Blocken und Skills (die jeweils einen Punkt kosten) einsetzen. Die Intention des Gegners wird bereits angezeigt, danach ist der gegner dran und führt eine Akiton aus, (Angreifen, Blocken, Aufladen für starken Angriff) das geht dann so hin und her bis einer besiegt ist.

  Die Events laufen so ab dass man eine Auswahl zwischen zwei zufälligen Begegnungen bekommt, nach 10 Events gibt es einen Boss Kampf. Für jedes Event gibt es eine Belohnung die aus Erfahrung, Gold, einem Gegenstand oder einer Statuserhöhung besteht. Beim Level up des Spielers gibt es ebenfalls Statuserhöhungen und einen Gegenstand, dabei hat der Spieler immer die Wahl aus einem von 3 Gegenständen. Insgesamt gilt es somit 50 Events abzuschließen und den Endgegner zu besiegen. Sobald der Spieler einen Kampf verliert oder auf andere Weise die Lebenspunkte auf 0 gehen wird ein neuer Run gestartet. Am Ende eines Runs gibt es noch eine bestimmte Anzahl an Metawährung womit neue Items und Gegenstände oder Startboni freigeschaltet werden können die dann verfügbar werden. 

  Abschließend ist hier noch eine Übersicht mit allen Eventsprites und Gegnern und ein paar weniger ernste Poster. :) 

  Danke fürs lesen!

  <figure class="post-embed post-embed--16-9"><div class="post-embed__frame"><iframe width="560" height="315" src="https://www.youtube.com/embed/YMT1BVRyX4g?si=meBRJPO7GS6B1Fek" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div></figure>
---

Hi! For quite a while now I'd wanted to build a device that brings to mind the Digimon Digivice toys. I thought those things were really cool as a kid, even though I never owned one, but I've made up for that now in my own way :)

[![Digive Toy](/Images/blog/development-process-of-pocket-knight/Digivice_ver1_1.webp "The toy i talk about, Bildquelle: https://wikimon.net/images/9/99/Digivice_ver1_1.jpg")](https://wikimon.net/images/9/99/Digivice_ver1_1.jpg)

So I started by working out a concept and thinking about which parts I could use. This time I went with a DFRobot FireBeetle v2 ESP32, because it already has the power supply on the board and all I had to do was hook up a battery. Since the device was also meant to be pocket-friendly, I tried to keep the whole thing as minimal as possible.

Other components I used:

- 128 x 64 pixel OLED display
- Seeed Grove – Pedometer (BMA456) (step counter)
- Piezo buzzer (sound output)
- Mini vibration motor (for haptic feedback)
- 3 small switches (inputs)
- 1800 mAh Li-ion battery (something much smaller would have done the job)
- PLA filament for the enclosure
- a piece of perfboard, wire and solder
- superglue and hot glue :)

Once I had a rough plan and had gathered all the parts, I started by putting everything together on a breadboard and turned to the code first. There were several hurdles along the way that drove me to despair more than once: integrating the step counter, the sleep function while still counting steps, loading and displaying pixel graphics, and the animations. Everything else was hard too, what was I thinking?!

![BreadboardKnight](/Images/PocketKnight/handheldbreadboard.webp "Breadboard Prototyping")

Once I eventually had halfway usable code and the breadboard circuit was more or less finalised, it was time to solder. I tried to get all the components packed together as compactly as possible, which worked out pretty well.

![](/Images/PocketKnight/handheldactive.webp "The soldered and glued thing")

In the next step I kept working on the game loop, the content and the sprites to turn it into a "rounded" game. Alongside that I started designing the enclosure in Fusion and then printed it at the [Kiel FabLab](https://fablab.sh/).

![](/Images/blog/development-process-of-pocket-knight/Printfablab.webp "Printing the case on a Prusa Mini")

And then the time had finally come and the device was nearing completion. All in all it took considerably longer than planned again and I sank roughly 3 months of my free time into the project. I had a few more ideas I would have liked to implement, but I've cut them for now due to a lack of time and motivation.

Here are the cut features:

- Multiplayer: co-op and competitive over ESP-NOW
- Online leaderboard over a WiFi connection
- Cooler animations and transition effects between screens
- Different starting classes (originally I wanted to build two devices, one with a knight and one with a wizard, for the co-op mode)
- English localisation, I wrote all the strings in German to begin with and out of convenience I've stuck with it.

Bugs that still need dealing with:

- Text sometimes gets cut off because it's too long, 128 px really isn't much space for information.
- Some elements, mechanics and items are under explained.
- Not all enemies have an animation.

Next time I'd also go for a much smaller battery, it makes up a large part of the weight. I've been testing the device for a few weeks now, and extrapolating from the battery usage I end up with a runtime of roughly 3 – 4 months on a single charge. That's quite convenient, but definitely overkill.

And now for the actually interesting part: the game!

The game loop works like this: the player starts with a knight at level 1. Every 250 steps an event is triggered, the device vibrates and beeps if it isn't in sleep mode. Up to 20 events can be collected this way, which can then be played through one after another in one go whenever you find the time.

In combat the player goes first and has 3 skill points for the entire fight. They can attack, block, or use skills (each of which costs one point). The enemy's intention is shown in advance, then it's the enemy's turn and they carry out an action (attack, block, charge up for a strong attack). This goes back and forth until one of them is defeated.

Events work like this: you get a choice between two random encounters, and after 10 events there's a boss fight. Each event gives a reward consisting of experience, gold, an item or a stat increase. Levelling up also gives the player stat increases and an item, always with a choice of one out of 3 items. In total that means completing 50 events and defeating the final boss. As soon as the player loses a fight, or their health drops to 0 some other way, a new run starts. At the end of a run there's a certain amount of meta currency, which can be spent on unlocking new items and equipment or starting bonuses that then become available.

To finish off, here's an overview of all the event sprites and enemies, plus a few less serious posters. :) Thanks for reading!

<figure class="post-embed post-embed--16-9"><div class="post-embed__frame"><iframe width="560" height="315" src="https://www.youtube.com/embed/YMT1BVRyX4g?si=meBRJPO7GS6B1Fek" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div></figure>
