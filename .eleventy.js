module.exports = function(eleventyConfig) {
    // Static assets — must be explicit in Eleventy 3
    eleventyConfig.addPassthroughCopy("Images");
    eleventyConfig.addPassthroughCopy("style.css");
    eleventyConfig.addPassthroughCopy("script.js");
    eleventyConfig.addPassthroughCopy("translations.js");
    eleventyConfig.addPassthroughCopy("CNAME");
    eleventyConfig.addPassthroughCopy("admin");
    // Copy as-is so the URL stays /project.html (not /project/)
    eleventyConfig.addPassthroughCopy("project.html");
    eleventyConfig.addPassthroughCopy("google1fb37088e637c525.html");

    eleventyConfig.addCollection("projects", function(collectionApi) {
        return collectionApi.getFilteredByGlob("content/projects/*.md")
            .sort((a, b) => (a.data.order || 999) - (b.data.order || 999));
    });

    eleventyConfig.addFilter("projectsToJson", function(projects) {
        const data = {};
        projects.forEach(function(p) {
            const d = p.data;
            data[d.slug] = {
                title: d.title,
                category: d.category,
                summary: d.summary || "",
                meta: d.meta || [],
                images: (d.images || []).map(function(img) {
                    return { src: img.src, alt: img.alt, caption: img.caption };
                }),
                content: d.content || [],
                embed: d.embed ? d.embed.trim() : null,
                de: {
                    summary: d.summary_de || null,
                    meta: d.meta_de || null,
                    images: (d.images || []).map(function(img) {
                        return { caption: img.caption_de || img.caption };
                    }),
                    content: d.content_de || null
                }
            };
        });
        return JSON.stringify(data);
    });

    return {
        dir: {
            input: ".",
            output: "_site",
            includes: "_includes"
        }
    };
};