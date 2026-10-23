// Weiterleitungen für redirects.njk – aus _data/redirects.json (CMS).
//
// Eine alte Adresse, die sich von einer bestehenden nur in Groß- und
// Kleinschreibung unterscheidet (/projects/Audio-Dingo-Synth/ neben
// /projects/audio-dingo-synth/), wäre auf Windows und macOS derselbe Ordner:
// Die Weiterleitung würde die echte Seite im lokalen Build überschreiben.
// Solche Einträge entstehen deshalb nur beim Build auf Linux (GitHub Actions),
// wo Groß- und Kleinschreibung zwei verschiedene Ordner sind.
const redirects = require("./redirects.json");

module.exports = function () {
    const caseSensitive = process.platform === "linux";
    return redirects.filter(function (r) {
        if (caseSensitive) return true;
        return r.from === r.from.toLowerCase();
    });
};
