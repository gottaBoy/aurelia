(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@aurelia/jit", "@aurelia/kernel", "@aurelia/runtime-html", "./attribute-pattern", "./binding-command", "./template-compiler", "./template-element-factory"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const jit_1 = require("@aurelia/jit");
    const kernel_1 = require("@aurelia/kernel");
    const runtime_html_1 = require("@aurelia/runtime-html");
    const attribute_pattern_1 = require("./attribute-pattern");
    const binding_command_1 = require("./binding-command");
    const template_compiler_1 = require("./template-compiler");
    const template_element_factory_1 = require("./template-element-factory");
    exports.ITemplateCompilerRegistration = template_compiler_1.TemplateCompiler;
    exports.ITemplateElementFactoryRegistration = template_element_factory_1.HTMLTemplateElementFactory;
    /**
     * Default HTML-specific (but environment-agnostic) implementations for the following interfaces:
     * - `ITemplateCompiler`
     * - `ITemplateElementFactory`
     */
    exports.DefaultComponents = [
        exports.ITemplateCompilerRegistration,
        exports.ITemplateElementFactoryRegistration
    ];
    /**
     * Default HTML-specific (but environment-agnostic) implementations for style binding
     */
    exports.JitAttrBindingSyntax = [
        attribute_pattern_1.StyleAttributePattern,
        attribute_pattern_1.ClassAttributePattern,
        attribute_pattern_1.AttrAttributePattern
    ];
    exports.TriggerBindingCommandRegistration = binding_command_1.TriggerBindingCommand;
    exports.DelegateBindingCommandRegistration = binding_command_1.DelegateBindingCommand;
    exports.CaptureBindingCommandRegistration = binding_command_1.CaptureBindingCommand;
    exports.AttrBindingCommandRegistration = binding_command_1.AttrBindingCommand;
    exports.ClassBindingCommandRegistration = binding_command_1.ClassBindingCommand;
    exports.StyleBindingCommandRegistration = binding_command_1.StyleBindingCommand;
    /**
     * Default HTML-specific (but environment-agnostic) binding commands:
     * - Event listeners: `.trigger`, `.delegate`, `.capture`
     */
    exports.DefaultBindingLanguage = [
        exports.TriggerBindingCommandRegistration,
        exports.DelegateBindingCommandRegistration,
        exports.CaptureBindingCommandRegistration,
        exports.ClassBindingCommandRegistration,
        exports.StyleBindingCommandRegistration,
        exports.AttrBindingCommandRegistration
    ];
    /**
     * A DI configuration object containing html-specific (but environment-agnostic) registrations:
     * - `BasicConfiguration` from `@aurelia/runtime-html`
     * - `DefaultComponents` from `@aurelia/jit`
     * - `DefaultBindingSyntax` from `@aurelia/jit`
     * - `DefaultBindingLanguage` from `@aurelia/jit`
     * - `DefaultComponents`
     * - `DefaultBindingLanguage`
     */
    exports.BasicConfiguration = {
        /**
         * Apply this configuration to the provided container.
         */
        register(container) {
            return runtime_html_1.BasicConfiguration
                .register(container)
                .register(...jit_1.DefaultComponents, ...jit_1.DefaultBindingSyntax, ...exports.JitAttrBindingSyntax, ...jit_1.DefaultBindingLanguage, ...exports.DefaultComponents, ...exports.DefaultBindingLanguage);
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