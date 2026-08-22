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
  - src: /Images/PocketKnight/handheldactive.webp
    alt: Finalizing electronics
    caption: finalizing electronics layout
    caption_de: ''
  - src: /Images/pocketknightposter3.webp
    alt: HolyGrail poster
    caption: silly holy grail poster
    caption_de: leicht albernes heiliger Gral Poster
  - src: /Images/blog/development-process-of-pocket-knight/pocketknight2.webp
    alt: silly knight giving
    caption: giving the grace.
    caption_de: die Gnade wird gegeben.
body_de: |-
  Hallo! Ich hatte schon länger  den Wunsch ein Gerät zu bauen das an die Digimon Digivice Spielzeuge erinnert, ich fand die Teile richtig cool als Kind obwohl ich selbst nie eins hatte, aber das hab ich ja nun auf eine andere Art und Weise nachgeholt :) 

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

  ![3dPrinter-printing](/Images/blog/development-process-of-pocket-knight/Printfablab.webp "Druckvorgang vom Deckel")
---

WIP!
