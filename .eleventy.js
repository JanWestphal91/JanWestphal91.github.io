module.exports = function(eleventyConfig) {
    // Bestehende Dateien durchreichen
    eleventyConfig.addPassthroughCopy("css");
    eleventyConfig.addPassthroughCopy("assets");
    eleventyConfig.addPassthroughCopy("admin");

    return {
        dir: {
            input: ".",
            output: "_site",
            includes: "_includes"
        }
    };
};