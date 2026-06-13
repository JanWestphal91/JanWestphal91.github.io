---
title: Development process of a DIY synthesizer
title_de: Entwicklung eines DIY Synthesizers
date: 2026-06-13
description: From circuit to working prototype.
description_de: Von einer Schaltung zum funktionierenden Prototyp.
cover_image: /Images/1000015078.jpg
cover_image_alt: Arduino Prototype
tags:
  - Devlog, Electronic
images:
  - src: /Images/ArduinoSynthWip.webp
    alt: Breadboard Schaltung
    caption: Breadboard Schaltung Prototyping
body_de: |-
  Hallo! Das hier ist der erste Eintrag im Blog. :)

  In diesem Beitrag dokumentiere ich die Schritte und Entwicklungen rund um das Projekt eines DIY-Synthesizers mit einem Arduino R4 Minima,  von den ersten Breadboard-Schaltungen über den ersten Gehäusedruck bis hin zur Konzeption des gesamten Prozesses.

  Nachdem die Idee entstanden war, ging es zuerst ins Anforderungsmanagement. Dafür habe ich grob umrissen, was das Gerät können soll. Ich wollte ein Gerät bauen, das Töne abspielen kann und sich nahtlos in mein Setup aus anderen Synthesizern integrieren lässt. Außerdem ist mir Mobilität wichtig, daher stand schon früh fest, dass es einen Akkubetrieb braucht.

  Zum Spielen habe ich mich für 7 Tontasten entschieden, weil eine Tonleiter aus 7 Tönen besteht. Dazu kommen noch 3 Funktionstasten sowie 2 Rotary Encoder, um den ausgegebenen Ton modulieren zu können. Außerdem sollte ein Display anzeigen, wie die Einstellungen aktuell stehen und welchen Wert ich gerade bearbeite. Hinzu kommt ein Lautsprecher, damit das Gerät auch standalone genutzt werden kann, sowie ein Klinkenausgang, um es mit anderen Synths in Reihe schalten zu können.

  Nachdem ich alle Anforderungen ermittelt hatte, habe ich eine Testschaltung auf Wokwi.com simuliert. Im nächsten Schritt musste ich erst einmal herausfinden, welche Komponenten ich nutzen kann und welche miteinander kompatibel sind. Nach einer aufwendigen Recherche in diversen Onlineshops und nachdem schließlich alle Teile angekommen waren, ging es los mit dem Zusammenstecken.

  Sobald ich dann einen groben Überblick über meine Schaltung hatte und den ersten grundlegenden Code geschrieben hatte, habe ich angefangen, das Gehäuse in Fusion zu designen. Beim ersten Druck habe ich lediglich den Grundkörper des Gehäuses in Schwarz gedruckt und alle Teile eingebaut, um einen ersten Eindruck vom Gerät zu bekommen.

  Danach ging es mit den Optimierungen weiter: Ich habe angefangen, die Komponenten zu verlöten und den Code zu überarbeiten. Zur Klangerzeugung habe ich die Mozzi-Bibliothek genutzt, und auch das Gehäuse wurde noch einmal angepasst.

  Bei der nächsten Iteration ist das Gehäuse deutlich breiter und tiefer geworden. Außerdem wurden die Maße für alle Knöpfe, Aussparungen und Anschlüsse überarbeitet. Tatsächlich war das Gehäuse beim zweiten Druck dann auch passend. Im nun letzten Arbeitsschritt wird noch der Code weiter überarbeitet und alle Kleinteile werden gedruckt und ergänzt.

  Et voilà, ein neuer Synthesizer ist geboren :)

  (Update folgt bald)
---

Hello, and welcome to the first post on my blog. :)

In this article, I want to document the development process behind my DIY synthesizer project based on the Arduino R4 Minima, from the first breadboard prototypes and early case prints to the overall concept and design process.

Once the initial idea was in place, the first step was to define the project requirements. I wanted to build a device capable of generating tones while integrating smoothly into my existing setup of other synthesizers. Portability was also an important factor, so it became clear early on that the device would need to run on battery power.

For the playing interface, I chose 7 note keys, since a standard scale consists of 7 notes. In addition, the device includes 3 function buttons and 2 rotary encoders for modifying and shaping the generated sound. I also wanted to include a display to provide visual feedback for the current settings and the parameter being edited. To make the synthesizer usable as a standalone device, I added a built-in speaker. At the same time, a headphone jack was included so it could also be connected to other synths as part of a larger setup.

After defining the requirements, I created and tested an initial circuit simulation on Wokwi. The next step was to determine which components would be suitable for the project and which ones would work together reliably. This involved a fair amount of research, comparing parts, checking compatibility, and sourcing everything from different online shops. Once all the components had arrived, I could finally begin assembling the first hardware prototype.

As soon as I had a rough understanding of the circuit layout and had written the first basic version of the code, I moved on to designing the enclosure in Fusion. For the first 3D print, I only produced the main body of the case in black and installed all the components to get a first impression of the overall form and layout of the device.

From there, the project moved into the next iteration phase. I began soldering the components, refining the code, and improving the sound generation. For audio synthesis, I used the Mozzi library, which proved to be a very useful tool for this type of Arduino-based project. At the same time, the enclosure design was revised as well.

In the following iteration, the case became noticeably wider and deeper. I also adjusted the dimensions for the buttons, cutouts, and connectors to improve the overall fit. This time, the second print turned out to fit properly, which was a very satisfying milestone in the process.

At the moment, the project is in its final stages. The code is still being refined, and the remaining small parts are being printed and added step by step.

Et voilà, a new synthesizer is born. :)

(update coming soon)
