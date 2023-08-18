"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XRegExBlock = exports.XRegEx = exports.xRegEx = void 0;
const xRegEx = () => new XRegEx();
exports.xRegEx = xRegEx;
class XRegEx {
    /** .global	Does the RegExp object test against all matches in a string, or only the first? */
    static globalFlag = "g";
    /** .ignoreCase	Does the RegExp object ignore case when performing a match? */
    static ignoreCaseFlag = "i";
    /** .multiline	Does the RegExp object perform matches across multiple lines? */
    static multilineFlag = "m";
    /** .sticky	Is the search sticky? (Does the next match have to occur at lastIndex, or can we match the next occurrence after lastIndex?) */
    static stickyFlag = "y";
    /** .unicode	Are Unicode features enabled? */
    static unicodeFlag = "u";
    /** .dotAll	Does . (dot) match newlines or not? */
    static dotAllFlag = "s";
    // Other instance properties_
    // .hasIndices	Does the Regular Expression result expose the start and end indices of captured substrings?
    // .source	The text of the pattern used by the RegExp object.
    // .lastIndex	The index at which to start the next match.
    // standard regex parts
    static dot = "."; // . any char (include \n depends on flag 's')
    static anyChar = "[\\s\\S]"; // nomatter flag 's'
    static whitespaceOnly = "[^\\S\\n]"; // awoide new line
    static whitespaceOrNewLine = "[\\s\\n]"; // nomatter flag 's'
    static tab = "\\t";
    static verticalTab = "\\v";
    static returnfeed = "\\r";
    static newLine = "\\n";
    static nonNewLine = "\\N";
    static wordChar = "\\w";
    static nonWordChar = "\\W";
    static wordBoundary = "\\b";
    static nonWordBoundary = "\\B";
    static word = "\\w+";
    static start = "^";
    static end = "$";
    static digit = "\\d";
    static nonDigit = "\\D";
    // Other Character Classes
    //   [\b]	Matches a backspace.
    //   \0	Matches a NUL character (when not followed by another digit).
    //   \xnn	Matches the character code nn (two hexadecimal digits).
    //   \unnnn	Matches a UTF-16 code unit with the value nnnn (four hexadecimal digits).
    //   \
    // standard regex parts (with properties)
    static escapedChar = (char) => "\\" + char + ")";
    static nonMatchGroup = (content) => "(!=" + content + ")";
    static lookAHead = (content) => "(?=" + content + ")";
    static negativLookAHead = (content) => "(?!" + content + ")";
    static lookBefore = (content) => "(?<=" + content + ")";
    static negativLookBefore = (content) => "(?<!" + content + ")";
    static namedGroupBackReference = (name) => "\\k<" + name + ">";
    static range = (...chars) => "[" + chars.join("") + "]";
    // standard regex parts (with properties - groupping)
    static namedGroup = (name, content) => "(?<" + name + ">" + content + ")";
    // Quantifiers
    static zeroOrMOre = "*";
    static zeroOrMOreLazy = "*?";
    static oneOrMore = "+";
    static oneOrMoreLazy = "+?";
    static zeroOrOne = "?";
    static zeroOrOneLazy = "??";
    static precise = (n) => "{" + n + "}";
    static min = (min) => "{" + min + ",}";
    static minLazy = (min) => "{" + min + ",}?";
    static minMax = (min, max) => "{" + min + "," + max + "}";
    static minMaxLazy = (min, max) => "{" + min + "," + max + "}?";
    static repeat = (body, opt) => {
        let { lazy } = opt;
        if (opt.zeroOrMore) {
            return body + (lazy ? XRegEx.zeroOrMOreLazy : XRegEx.zeroOrMOre);
        }
        if (opt.oneOrMore) {
            return body + (lazy ? XRegEx.oneOrMoreLazy : XRegEx.oneOrMore);
        }
        if (opt.precise) {
            return body + XRegEx.precise(opt.precise);
        }
        if (opt.min && opt.max) {
            return body + (lazy ? XRegEx.minMaxLazy(opt.min, opt.max) : XRegEx.minMax(opt.min, opt.max));
        }
        if (opt.min) {
            return body + (lazy ? XRegEx.minLazy(opt.min) : XRegEx.min(opt.min));
        }
        throw new Error("xRegEx: no repeate option set!");
    };
    // builder instance:
    flags = ["is"];
    //
    blocks = [];
    // block stack
    blockStack = [];
    currentBlock = new XRegExBlock();
    // blocks
    start() {
        this.blockStack.push(new XRegExBlock());
        this.currentBlock = this.blockStack[this.blockStack.length - 1];
        return this;
    }
    add(content) {
        this.currentBlock.add(content);
        return this;
    }
    // Add standard regex
    addAnyChar() {
        return this.add(XRegEx.anyChar);
    }
    addWhitespaceOnly() {
        return this.add(XRegEx.whitespaceOnly);
    }
    addWhitespaceOrNewLine() {
        return this.add(XRegEx.whitespaceOrNewLine);
    }
    addTab() {
        return this.add(XRegEx.tab);
    }
    addVerticalTab() {
        return this.add(XRegEx.verticalTab);
    }
    addReturnfeed() {
        return this.add(XRegEx.returnfeed);
    }
    addNewLine() {
        return this.add(XRegEx.newLine);
    }
    addNonNewLine() {
        return this.add(XRegEx.nonNewLine);
    }
    addWordChar() {
        return this.add(XRegEx.wordChar);
    }
    addNonWordChar() {
        return this.add(XRegEx.nonWordChar);
    }
    addWordBoundary() {
        return this.add(XRegEx.wordBoundary);
    }
    addNonWordBoundary() {
        return this.add(XRegEx.nonWordBoundary);
    }
    addWord() {
        return this.add(XRegEx.word);
    }
    addStart() {
        return this.add(XRegEx.start);
    }
    addEnd() {
        return this.add(XRegEx.end);
    }
    addDigit() {
        return this.add(XRegEx.digit);
    }
    addNonDigit() {
        return this.add(XRegEx.nonDigit);
    }
    // Add with options
    addEscapedChar(char) {
        this.add(XRegEx.escapedChar(char));
    }
    addNonMatchGroup(content) {
        this.add(XRegEx.nonMatchGroup(content));
    }
    addLookAHead(content) {
        this.add(XRegEx.lookAHead(content));
    }
    addNegativLookAHead(content) {
        this.add(XRegEx.negativLookAHead(content));
    }
    addLookBefore(content) {
        this.add(XRegEx.lookBefore(content));
    }
    addNegativLookBefore(content) {
        this.add(XRegEx.negativLookBefore(content));
    }
    addNamedGroupBackReference(name) {
        this.add(XRegEx.namedGroupBackReference(name));
    }
    addRange(chars) {
        this.add(XRegEx.range(chars + "]"));
    }
    match(opt) {
        let block = this.blockStack.pop(); // pop current block
        if (!block)
            throw new Error("xRegEx: no block to end!");
        // set block options
        block.groupName = opt?.groupName;
        block.repeat = opt?.repeat;
        this.currentBlock.add(block.toString());
        // set next current block
        this.currentBlock = this.blockStack[this.blockStack.length - 1];
        if (!this.currentBlock)
            throw new Error("xRegEx: no current block!");
        return this;
    }
    // settings:
    addFlag(flag) {
        this.flags.push(flag);
        return this;
    }
    removeFlag(flag) {
        this.flags = this.flags.filter((f) => f !== flag);
        return this;
    }
    // getters
    get regExp() {
        var regExpContent = this.blocks.map((b) => b.toString()).join("");
        return new RegExp(regExpContent, this.flags.join(""));
    }
    // regex methods
    exec(content) {
        return this.regExp.exec(content);
    }
    test(content) {
        return this.regExp.test(content);
    }
    split(content) {
        return content.split(this.regExp);
    }
    replace(content, replace, replaceCount = 1) {
        let reegExp = this.regExp;
        let newContent = content;
        let match = reegExp.exec(content);
        while (match) {
            let placeContent = typeof replace === "string" ? replace : replace(match);
            newContent =
                newContent.substring(0, match.index) + placeContent + newContent.substring(match.index + match[0].length);
            if (replaceCount > 0) {
                replaceCount--;
                if (replaceCount === 0)
                    break;
            }
            match = reegExp.exec(content);
        }
        return newContent;
    }
    replaceAll(content, replace) {
        return this.replace(content, replace, -1);
    }
}
exports.XRegEx = XRegEx;
class XRegExBlock {
    content = [];
    groupName;
    repeat;
    add(content) {
        this.content.push(content);
        return this;
    }
    addEscapedChar(char) {
        this.add("\\" + char + ")");
    }
    addNonMatchGroup(content) {
        this.add("(!=" + content + ")");
    }
    addLookAHead(content) {
        this.add("(?=" + content + ")");
    }
    addNegativLookAHead(content) {
        this.add("(?!" + content + ")");
    }
    addLookBefore(content) {
        this.add("(?<=" + content + ")");
    }
    addNegativLookBefore(content) {
        this.add("(?<!" + content + ")");
    }
    addNamedGroupBackReference(name) {
        this.add("\\k<" + name + ">");
    }
    addRange(chars) {
        this.add("[" + chars + "]");
    }
    toString() {
        let str = this.content.join("");
        if (this.repeat) {
            str = XRegEx.repeat(str, this.repeat);
        }
        if (this.groupName) {
            str = XRegEx.namedGroup(this.groupName, str);
        }
        return str;
    }
}
exports.XRegExBlock = XRegExBlock;
