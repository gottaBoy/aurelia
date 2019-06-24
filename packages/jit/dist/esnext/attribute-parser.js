import { all, DI, Profiler } from '@aurelia/kernel';
import { AttrSyntax } from './ast';
import { IAttributePattern, ISyntaxInterpreter } from './attribute-pattern';
export const IAttributeParser = DI.createInterface('IAttributeParser').withDefault(x => x.singleton(AttributeParser));
const { enter, leave } = Profiler.createTimer('AttributeParser');
/** @internal */
export class AttributeParser {
    constructor(interpreter, attrPatterns) {
        this.interpreter = interpreter;
        this.cache = {};
        const patterns = this.patterns = {};
        attrPatterns.forEach(attrPattern => {
            const defs = attrPattern.$patternDefs;
            interpreter.add(defs);
            defs.forEach(def => {
                patterns[def.pattern] = attrPattern;
            });
        });
    }
    parse(name, value) {
        if (Profiler.enabled) {
            enter();
        }
        let interpretation = this.cache[name];
        if (interpretation == null) {
            interpretation = this.cache[name] = this.interpreter.interpret(name);
        }
        const pattern = interpretation.pattern;
        if (pattern == null) {
            if (Profiler.enabled) {
                leave();
            }
            return new AttrSyntax(name, value, name, null);
        }
        else {
            if (Profiler.enabled) {
                leave();
            }
            return this.patterns[pattern][pattern](name, value, interpretation.parts);
        }
    }
}
// @ts-ignore
AttributeParser.inject = [ISyntaxInterpreter, all(IAttributePattern)];
//# sourceMappingURL=attribute-parser.js.map