const markdownIt = require("markdown-it");
const md = markdownIt({ html: true, breaks: false, linkify: true });

module.exports = function(eleventyConfig) {
    eleventyConfig.addFilter("md", content => content ? md.render(content) : '');
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
    eleventyConfig.addPassthroughCopy("sitemap.xml");
    eleventyConfig.addPassthroughCopy("robots.txt");
    eleventyConfig.addPassthroughCopy("BingSiteAuth.xml");
    eleventyConfig.addPassthroughCopy("page-flip.browser.js");
    eleventyConfig.addPassthroughCopy("flipbook.js");

    eleventyConfig.addCollection("projects", function(collectionApi) {
        return collectionApi.getFilteredByGlob("content/projects/*/index.md")
            .sort((a, b) => (a.data.order || 999) - (b.data.order || 999));
    });

    eleventyConfig.addCollection("blog", function(collectionApi) {
        return collectionApi.getFilteredByGlob("content/blog/*/index.md")
            .sort((a, b) => b.date - a.date);
    });

    eleventyConfig.addFilter("postDate", function(date, locale) {
        return new Date(date).toLocaleDateString(locale || "en-US", {
            year: "numeric", month: "long", day: "numeric"
        });
    });

    eleventyConfig.addFilter("limit", function(arr, n) {
        return arr.slice(0, n);
    });

    eleventyConfig.addFilter("imgPath", function(path) {
        if (!path) return path;
        return path.startsWith('/') ? path : '/' + path;
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