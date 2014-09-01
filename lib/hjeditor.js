(function () {
var rules = {
};

function Lexer() {
    this.rules = rules;
}

Lexer.lex = function (src) {
    var lexer = new Lexer();
    return lexer.lex(src);
}

Lexer.prototype.lex = function (src) {
    src = src
        .replace(/\r\n|\r/g, '\n')
        .replace(/\t/g, '    ')
        .replace(/\u00a0/g, ' ')
        .replace(/\u2424/g, '\n');
    
    return this.token(src);
}

Lexer.prototype.token = function (src) {
    var src = src.replace(/^ +$/gm, '');
}

function Renderer() {
}

function Parser() {
}

Parser.parse = function (src) {
    var parser = new Parser();
    return parser.parse(src);
}

Parser.prototype.next = function () {
    return this.token = this.tokens.pop();
};

Parser.prototype.tok = function () {
};

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
