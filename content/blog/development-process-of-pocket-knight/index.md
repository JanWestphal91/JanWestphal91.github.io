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

  #

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

  Breadboard Prototyp

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
---

WIP!
