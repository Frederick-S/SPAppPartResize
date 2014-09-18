(function () {
    var rules = {
        'color': /^\[color=(#(?:[0-9a-fA-F]{3}){1,2})\]([\s\S]+?)\[\/color\]/,
        'strong': /^\[b\]([\s\S]+?)\[\/b\]/,
        'italic': /^\[i\]([\s\S]+?)\[\/i\]/,
        'underline': /^\[u\]([\s\S]+?)\[\/u\]/,
        'url': /^\[url=(\s*<?(?:[\s\S]*?)>?(?:\s+['"](?:[\s\S]*?)['"])?\s*)\]([\s\S]+?)\[\/url\]/,
        'img': /^\[img\](\s*<?(?:[\s\S]*?)>?(?:\s+['"](?:[\s\S]*?)['"])?\s*)\[\/img\]/,
        'text': /^[\s\S]+?(?=[\\\[]|$)/
    };

    function Lexer() {
        this.rules = rules;
        this.renderer = new Renderer();
    }

    Lexer.prototype.output = function (src) {
        var out = '',
            link,
            text,
            href,
            cap;

        while (src) {
            // Color
            if (cap = this.rules.color.exec(src)) {
                src = src.substring(cap[0].length);
                out += this.renderer.color(cap[1], this.output(cap[2]));
                continue;
            }

            // Strong
            if (cap = this.rules.strong.exec(src)) {
                src = src.substring(cap[0].length);
                out += this.renderer.strong(this.output(cap[1]));
                continue;
            }

            // Italic
            if (cap = this.rules.italic.exec(src)) {
                src = src.substring(cap[0].length);
                out += this.renderer.italic(this.output(cap[1]));
                continue;
            }

            // Underline
            if (cap = this.rules.underline.exec(src)) {
                src = src.substring(cap[0].length);
                out += this.renderer.underline(this.output(cap[1]));
                continue;
            }

            // Url
            if (cap = this.rules.url.exec(src)) {
                src = src.substring(cap[0].length);
                out += this.renderer.url(cap[1], this.output(cap[2]));
                continue;
            }

            // Image
            if (cap = this.rules.img.exec(src)) {
                src = src.substring(cap[0].length);
                out += this.renderer.img(this.output(cap[1]));
                continue;
            }

            // Text
            if (cap = this.rules.text.exec(src)) {
                src = src.substring(cap[0].length);
                out += cap[0];
                continue;
            }

            if (src) {
                throw new Error('Infinite loop on byte: ' + src.charCodeAt(0));
            }
        }

        return out;
    }

    function Renderer() {

    }

    Renderer.prototype.color = function(colorCode, text) {
        return '<font color="' + colorCode + '">' + text + '</font>';
    }

    Renderer.prototype.strong = function(text) {
        return '<b>' + text + '</b>';
    }

    Renderer.prototype.italic = function(text) {
        return '<i>' + text + '</i>';
    }

    Renderer.prototype.underline = function(text) {
        return '<u>' + text + '</u>';
    }

    Renderer.prototype.url = function(url, text) {
        return '<a href="' + url + '" target="_blank" rel="nofollow">' + text + '</a>';
    }

    Renderer.prototype.img = function(url) {
        return '<img src="' + url + '" border="0" />';
    }

    function Parser() {

    }

    Parser.parse = function (src) {
        var parser = new Parser();
        return parser.parse(src);
    }

    Parser.prototype.parse = function (src) {
        var lexer = new Lexer();
        src = src
            .replace(/\r\n|\r/g, '\n')
            .replace(/\t/g, '    ')
            .replace(/\u00a0/g, ' ')
            .replace(/\u2424/g, '\n');

        return lexer.output(src);
    }

    function HJEditor(src) {
        try {
            return Parser.parse(src);
        } catch (e) {
            throw e;
        }
    }

    if (typeof module !== 'undefined' && typeof exports === 'object') {
        module.exports = HJEditor;
    } else if (typeof define === 'function' && define.amd) {
        define(function () {
            return HJEditor;
        });
    } else {
        this.HJEditor = HJEditor;
    }
}).call(function () {
    return this || (typeof window !== 'undefined' ? window : global);
}());
