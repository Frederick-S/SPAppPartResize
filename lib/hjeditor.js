(function () {
    var rules = {
        'strong': /^\[b\]([\s\S]+?)\[\/b\]/
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
                out += this.renderer.strong(this.output(cap[2] || cap[1]));
                continue;
            }
        }
    }

    function Renderer() {

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
    }

    function HJEditor(src) {
        try {
            return Parser.parse(Lexer.lex(src));
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
