export function processImports(toProcess, relativeTo) {
    return toProcess.map(x => {
        if (x.extension === '.html' && !x.plugin) {
            return `component!${relativeToFile(x.path, relativeTo) + x.extension}`;
        }
        const relativePath = relativeToFile(x.path, relativeTo);
        return x.plugin ? `${x.plugin}!${relativePath}` : relativePath;
    });
}
const capitalMatcher = /([A-Z])/g;
/** @internal */
export function addHyphenAndLower(char) {
    return `-${char.toLowerCase()}`;
}
export function kebabCase(name) {
    return (name.charAt(0).toLowerCase() + name.slice(1)).replace(capitalMatcher, addHyphenAndLower);
}
export function escape(content) {
    return content.replace(/(['\\])/g, '\\$1')
        .replace(/[\f]/g, '\\f')
        .replace(/[\b]/g, '\\b')
        .replace(/[\n]/g, '\\n')
        .replace(/[\t]/g, '\\t')
        .replace(/[\r]/g, '\\r')
        .replace(/[\u2028]/g, '\\u2028')
        .replace(/[\u2029]/g, '\\u2029');
}
export function createTemplateDescription(template) {
    const imports = [];
    const cleanedTemplate = template.replace(/^@import\s+\'([a-zA-z\/.\-_!%&\?=0-9]*)\'\s*;/gm, (match, url) => {
        imports.push(parseImport(url));
        return '';
    });
    return {
        template: cleanedTemplate.trim(),
        imports
    };
}
export function parseImport(value) {
    const result = {
        path: value
    };
    const pluginIndex = result.path.lastIndexOf('!');
    if (pluginIndex !== -1) {
        result.plugin = result.path.slice(pluginIndex + 1);
        result.path = result.path.slice(0, pluginIndex);
    }
    else {
        result.plugin = null;
    }
    const extensionIndex = result.path.lastIndexOf('.');
    if (extensionIndex !== -1) {
        result.extension = result.path.slice(extensionIndex).toLowerCase();
        result.path = result.path.slice(0, extensionIndex);
    }
    else {
        result.extension = null;
    }
    const slashIndex = result.path.lastIndexOf('/');
    if (slashIndex !== -1) {
        result.basename = result.path.slice(slashIndex + 1);
    }
    else {
        result.basename = result.path;
    }
    return result;
}
export function relativeToFile(name, file) {
    const fileParts = file ? file.split('/') : undefined;
    const nameParts = name.trim().split('/');
    if (nameParts[0].charAt(0) === '.' && fileParts !== undefined) {
        //Convert file to array, and lop off the last part,
        //so that . matches that 'directory' and not name of the file's
        //module. For instance, file of 'one/two/three', maps to
        //'one/two/three.js', but we want the directory, 'one/two' for
        //this normalization.
        const normalizedBaseParts = fileParts.slice(0, fileParts.length - 1);
        nameParts.unshift(...normalizedBaseParts);
    }
    trimDots(nameParts);
    return nameParts.join('/');
}
export function loadFromFile(url, callback, errback) {
    const fs = require.nodeRequire('fs');
    try {
        // tslint:disable-next-line:non-literal-fs-path
        let file = fs.readFileSync(url, 'utf8');
        //Remove BOM (Byte Mark Order) from utf8 files if it is there.
        if (file[0] === '\uFEFF') {
            file = file.substring(1);
        }
        callback(file);
    }
    catch (e) {
        if (errback !== undefined) {
            errback(e);
        }
    }
}
/** @internal */
export function trimDots(ary) {
    for (let i = 0; i < ary.length; ++i) {
        const part = ary[i];
        if (part === '.') {
            ary.splice(i, 1);
            i -= 1;
        }
        else if (part === '..') {
            // If at the start, or previous value is still ..,
            // keep them so that when converted to a path it may
            // still work when converted to a path, even though
            // as an ID it is less than ideal. In larger point
            // releases, may be better to just kick out an error.
            if (i === 0 || (i === 1 && ary[2] === '..') || ary[i - 1] === '..') {
                // tslint:disable-next-line:no-redundant-jump
                continue;
            }
            else if (i > 0) {
                ary.splice(i - 1, 2);
                i -= 2;
            }
        }
    }
}
//# sourceMappingURL=processing.js.map