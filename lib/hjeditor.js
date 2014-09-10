(function () {
    var rules = {
        'strong': /^\[b\]([\s\S]+?)\[\/b\]/,
        'italic': /^\[i\]([\s\S]+?)\[\/i\]/,
        'underline': /^\[u\]([\s\S]+?)\[\/u\]/,
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

    Renderer.prototype.strong = function(text) {
        return '<b>' + text + '</b>';
    }

    Renderer.prototype.italic = function(text) {
        return '<i>' + text + '</i>';
    }

    Renderer.prototype.underline = function(text) {
        return '<u>' + text + '</u>';
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
