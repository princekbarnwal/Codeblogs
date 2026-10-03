import sanitizeHtml from "sanitize-html";

const sanitizeBlogContent = (content) => {
    return sanitizeHtml(content, {
        allowedTags: [
            "p",
            "br",
            "strong",
            "b",
            "em",
            "i",
            "u",
            "h2",
            "h3",
            "ul",
            "ol",
            "li",
            "blockquote",
            "a"
        ],

        allowedAttributes: {
            a: ["href", "target", "rel"]
        },

        allowedSchemes: ["http", "https"]
    });
};

export default sanitizeBlogContent;