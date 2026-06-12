module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("css");
    eleventyConfig.addPassthroughCopy("assets");
    eleventyConfig.addPassthroughCopy("admin");

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