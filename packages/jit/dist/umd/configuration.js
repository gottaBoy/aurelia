(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@aurelia/kernel", "@aurelia/runtime", "./attribute-pattern", "./binding-command", "./expression-parser"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const kernel_1 = require("@aurelia/kernel");
    const runtime_1 = require("@aurelia/runtime");
    const attribute_pattern_1 = require("./attribute-pattern");
    const binding_command_1 = require("./binding-command");
    const expression_parser_1 = require("./expression-parser");
    exports.IExpressionParserRegistration = {
        register(container) {
            container.registerTransformer(runtime_1.IExpressionParser, parser => {
                Reflect.set(parser, 'parseCore', expression_parser_1.parseExpression);
                return parser;
            });
        }
    };
    /**
     * Default runtime/environment-agnostic implementations for the following interfaces:
     * - `IExpressionParser`
     */
    exports.DefaultComponents = [
        exports.IExpressionParserRegistration
    ];
    exports.AtPrefixedTriggerAttributePatternRegistration = attribute_pattern_1.AtPrefixedTriggerAttributePattern;
    exports.ColonPrefixedBindAttributePatternRegistration = attribute_pattern_1.ColonPrefixedBindAttributePattern;
    exports.RefAttributePatternRegistration = attribute_pattern_1.RefAttributePattern;
    exports.DotSeparatedAttributePatternRegistration = attribute_pattern_1.DotSeparatedAttributePattern;
    /**
     * Default binding syntax for the following attribute name patterns:
     * - `ref`
     * - `target.command` (dot-separated)
     */
    exports.DefaultBindingSyntax = [
        exports.RefAttributePatternRegistration,
        exports.DotSeparatedAttributePatternRegistration
    ];
    /**
     * Binding syntax for short-hand attribute name patterns:
     * - `@target` (short-hand for `target.trigger`)
     * - `:target` (short-hand for `target.bind`)
     */
    exports.ShortHandBindingSyntax = [
        exports.AtPrefixedTriggerAttributePatternRegistration,
        exports.ColonPrefixedBindAttributePatternRegistration
    ];
    exports.CallBindingCommandRegistration = binding_command_1.CallBindingCommand;
    exports.DefaultBindingCommandRegistration = binding_command_1.DefaultBindingCommand;
    exports.ForBindingCommandRegistration = binding_command_1.ForBindingCommand;
    exports.FromViewBindingCommandRegistration = binding_command_1.FromViewBindingCommand;
    exports.OneTimeBindingCommandRegistration = binding_command_1.OneTimeBindingCommand;
    exports.ToViewBindingCommandRegistration = binding_command_1.ToViewBindingCommand;
    exports.TwoWayBindingCommandRegistration = binding_command_1.TwoWayBindingCommand;
    /**
     * Default runtime/environment-agnostic binding commands:
     * - Property observation: `.bind`, `.one-time`, `.from-view`, `.to-view`, `.two-way`
     * - Function call: `.call`
     * - Collection observation: `.for`
     */
    exports.DefaultBindingLanguage = [
        exports.DefaultBindingCommandRegistration,
        exports.OneTimeBindingCommandRegistration,
        exports.FromViewBindingCommandRegistration,
        exports.ToViewBindingCommandRegistration,
        exports.TwoWayBindingCommandRegistration,
        exports.CallBindingCommandRegistration,
        exports.ForBindingCommandRegistration
    ];
    /**
     * A DI configuration object containing runtime/environment-agnostic registrations:
     * - `BasicConfiguration` from `@aurelia/runtime`
     * - `DefaultComponents`
     * - `DefaultBindingSyntax`
     * - `DefaultBindingLanguage`
     */
    exports.BasicConfiguration = {
        /**
         * Apply this configuration to the provided container.
         */
        register(container) {
            return runtime_1.RuntimeBasicConfiguration
                .register(container)
                .register(...exports.DefaultComponents, ...exports.DefaultBindingSyntax, ...exports.DefaultBindingLanguage);
        },
        /**
         * Create a new container with this configuration applied to it.
         */
        createContainer() {
            return this.register(kernel_1.DI.createContainer());
        }
    };
});
//# sourceMappingURL=configuration.js.map