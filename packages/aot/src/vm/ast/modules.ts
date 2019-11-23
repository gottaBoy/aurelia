/* eslint-disable */
import {
  ExportAssignment,
  ExportDeclaration,
  ExportSpecifier,
  ExternalModuleReference,
  ImportClause,
  ImportDeclaration,
  ImportEqualsDeclaration,
  ImportSpecifier,
  ModifierFlags,
  ModuleBlock,
  ModuleDeclaration,
  NamedExports,
  NamedImports,
  NamespaceExportDeclaration,
  NamespaceImport,
  Node,
  QualifiedName,
  SourceFile,
  StringLiteral,
  SyntaxKind,
} from 'typescript';
import {
  PLATFORM,
  ILogger,
} from '@aurelia/kernel';
import {
  IFile,
  $CompilerOptions,
} from '../../system/interfaces';
import {
  NPMPackage,
} from '../../system/npm-package-loader';
import {
  IModule,
  ResolveSet,
  ResolvedBindingRecord,
  Realm,
  ExecutionContext,
} from '../realm';
import {
  $ModuleEnvRec,
  $EnvRec,
  $FunctionEnvRec,
} from '../types/environment-record';
import {
  $NamespaceExoticObject,
} from '../exotics/namespace';
import {
  $String,
} from '../types/string';
import {
  $Undefined,
} from '../types/undefined';
import {
  $Any,
  CompletionType,
} from '../types/_shared';
import {
  $Number,
} from '../types/number';
import {
  $Null,
} from '../types/null';
import {
  $Empty,
} from '../types/empty';
import {
  IModuleResolver,
} from '../../service-host';
import {
  $Error,
  $SyntaxError,
} from '../types/error';
import {
  $List,
} from '../types/list';
import {
  I$Node,
  Context,
  $$ESDeclaration,
  modifiersToModifierFlags,
  hasBit,
  $identifier,
  $$AssignmentExpressionOrHigher,
  $assignmentExpression,
  $AssignmentExpressionNode,
  $$TSDeclaration,
  getBoundNames,
  $StatementNode,
  $$ESStatementListItem,
  GetDirectivePrologue,
  getLocalName,
  getImportEntriesForModule,
  getExportedNames,
  getExportEntriesForModule,
  getReferencedBindings,
  $$ModuleDeclarationParent,
} from './_shared';
import {
  $Identifier,
} from './expressions';
import {
  $ClassDeclaration,
} from './classes';
import {
  DirectivePrologue,
  $VariableStatement,
  $Block,
  $EmptyStatement,
  $ExpressionStatement,
  $IfStatement,
  $DoStatement,
  $WhileStatement,
  $ForStatement,
  $ForInStatement,
  $ForOfStatement,
  $ContinueStatement,
  $BreakStatement,
  $ReturnStatement,
  $WithStatement,
  $SwitchStatement,
  $LabeledStatement,
  $ThrowStatement,
  $TryStatement,
  $DebuggerStatement,
} from './statements';
import {
  $FunctionDeclaration,
} from './functions';
import {
  $InterfaceDeclaration,
  $TypeAliasDeclaration,
  $EnumDeclaration,
} from './types';
import {
  $StringLiteral,
} from './literals';

const {
  emptyArray,
} = PLATFORM;

export type $$ESModuleItem = (
  $$ESStatementListItem |
  $ImportDeclaration |
  $ExportDeclaration
);

export type $$TSModuleItem = (
  $$ESModuleItem |
  $$TSDeclaration |
  $ExportAssignment |
  $ImportEqualsDeclaration |
  $ModuleDeclaration |
  $NamespaceExportDeclaration
);

export type ModuleStatus = 'uninstantiated' | 'instantiating' | 'instantiated' | 'evaluating' | 'evaluated';

// http://www.ecma-international.org/ecma-262/#sec-abstract-module-records
// http://www.ecma-international.org/ecma-262/#sec-cyclic-module-records
// http://www.ecma-international.org/ecma-262/#sec-source-text-module-records
export class $SourceFile implements I$Node, IModule {
  public readonly '<IModule>': unknown;

  public '[[Environment]]': $ModuleEnvRec | $Undefined;
  public '[[Namespace]]': $NamespaceExoticObject | $Undefined;
  public '[[HostDefined]]': any;

  public get isAbrupt(): false { return false; }

  public readonly $kind = SyntaxKind.SourceFile;
  public readonly id: number;

  public readonly sourceFile: $SourceFile = this;
  public readonly parent: $SourceFile = this;
  public readonly ctx: Context = Context.None;
  public readonly depth: number = 0;

  public readonly $statements: readonly $$TSModuleItem[];

  public readonly DirectivePrologue: DirectivePrologue;

  public ExecutionResult: $Any; // Temporary property for testing purposes

  // http://www.ecma-international.org/ecma-262/#sec-module-semantics-static-semantics-exportedbindings
  public readonly ExportedBindings: readonly $String[];
  // http://www.ecma-international.org/ecma-262/#sec-module-semantics-static-semantics-exportednames
  public readonly ExportedNames: readonly $String[];
  // http://www.ecma-international.org/ecma-262/#sec-module-semantics-static-semantics-exportentries
  public readonly ExportEntries: readonly ExportEntryRecord[];
  // http://www.ecma-international.org/ecma-262/#sec-module-semantics-static-semantics-importentries
  public readonly ImportEntries: readonly ImportEntryRecord[];
  // http://www.ecma-international.org/ecma-262/#sec-importedlocalnames
  public readonly ImportedLocalNames: readonly $String[];
  // http://www.ecma-international.org/ecma-262/#sec-module-semantics-static-semantics-modulerequests
  public readonly ModuleRequests: readonly $String[];
  // http://www.ecma-international.org/ecma-262/#sec-module-semantics-static-semantics-lexicallyscopeddeclarations
  public readonly LexicallyScopedDeclarations: readonly $$ESDeclaration[];
  // http://www.ecma-international.org/ecma-262/#sec-module-semantics-static-semantics-varscopeddeclarations
  public readonly VarScopedDeclarations: readonly $$ESDeclaration[];

  public readonly TypeDeclarations: readonly $$TSDeclaration[] = emptyArray;
  public readonly IsType: false = false;

  public Status: ModuleStatus;
  public DFSIndex: number | undefined;
  public DFSAncestorIndex: number | undefined;
  public RequestedModules: $String[];

  public readonly LocalExportEntries: readonly ExportEntryRecord[];
  public readonly IndirectExportEntries: readonly ExportEntryRecord[];
  public readonly StarExportEntries: readonly ExportEntryRecord[];

  public get isNull(): false { return false; }

  public constructor(
    public readonly logger: ILogger,
    public readonly $file: IFile,
    public readonly node: SourceFile,
    public readonly realm: Realm,
    public readonly pkg: NPMPackage | null,
    public readonly moduleResolver: IModuleResolver,
    public readonly compilerOptions: $CompilerOptions,
  ) {
    this.id = realm.registerNode(this);

    const intrinsics = realm['[[Intrinsics]]'];

    this.ExecutionResult = intrinsics.empty;

    this['[[Environment]]'] = intrinsics.undefined;
    this['[[Namespace]]'] = intrinsics.undefined;

    this.logger = logger.root.scopeTo(`SourceFile<(...)${$file.rootlessPath}>`);

    let ctx = Context.InTopLevel;
    this.DirectivePrologue = GetDirectivePrologue(node.statements);
    if (this.DirectivePrologue.ContainsUseStrict) {
      ctx |= Context.InStrictMode;
    }

    const ExportedBindings = this.ExportedBindings = [] as $String[];
    const ExportedNames = this.ExportedNames = [] as $String[];
    const ExportEntries = this.ExportEntries = [] as ExportEntryRecord[];
    const ImportEntries = this.ImportEntries = [] as ImportEntryRecord[];
    const ImportedLocalNames = this.ImportedLocalNames = [] as $String[];
    const ModuleRequests = this.ModuleRequests = [] as $String[];
    const LexicallyScopedDeclarations = this.LexicallyScopedDeclarations = [] as $$ESDeclaration[];
    const VarScopedDeclarations = this.VarScopedDeclarations = [] as $$ESDeclaration[];

    const $statements = this.$statements = [] as $$TSModuleItem[];
    const statements = node.statements as readonly $StatementNode[];
    let stmt: $StatementNode;
    let $stmt: $$TSModuleItem;
    let s = 0;
    for (let i = 0, ii = statements.length; i < ii; ++i) {
      stmt = statements[i];

      switch (stmt.kind) {
        case SyntaxKind.ModuleDeclaration:
          $stmt = $statements[s++] = new $ModuleDeclaration(stmt, this, ctx);
          break;
        case SyntaxKind.NamespaceExportDeclaration:
          $stmt = $statements[s++] = new $NamespaceExportDeclaration(stmt, this, ctx);
          break;
        case SyntaxKind.ImportEqualsDeclaration:
          $stmt = $statements[s++] = new $ImportEqualsDeclaration(stmt, this, ctx);
          break;
        case SyntaxKind.ImportDeclaration:
          $stmt = $statements[s++] = new $ImportDeclaration(stmt, this, ctx);

          ImportEntries.push(...$stmt.ImportEntries);
          ImportedLocalNames.push(...$stmt.ImportEntries.map(getLocalName));

          ModuleRequests.push(...$stmt.ModuleRequests);
          break;
        case SyntaxKind.ExportAssignment:
          $stmt = $statements[s++] = new $ExportAssignment(stmt, this, ctx);
          break;
        case SyntaxKind.ExportDeclaration:
          $stmt = $statements[s++] = new $ExportDeclaration(stmt, this, ctx);

          ExportedBindings.push(...$stmt.ExportedBindings);
          ExportedNames.push(...$stmt.ExportedNames);
          ExportEntries.push(...$stmt.ExportEntries);

          ModuleRequests.push(...$stmt.ModuleRequests);

          LexicallyScopedDeclarations.push(...$stmt.LexicallyScopedDeclarations);
          break;
        case SyntaxKind.VariableStatement:
          $stmt = $statements[s++] = new $VariableStatement(stmt, this, ctx);

          if ($stmt.isLexical) {
            LexicallyScopedDeclarations.push($stmt);
          } else {
            VarScopedDeclarations.push($stmt);
          }

          if (hasBit($stmt.modifierFlags, ModifierFlags.Export)) {
            ExportedBindings.push(...$stmt.ExportedBindings);
            ExportedNames.push(...$stmt.ExportedNames);
            ExportEntries.push(...$stmt.ExportEntries);
          }

          break;
        case SyntaxKind.FunctionDeclaration:
          // Skip overload signature
          if (stmt.body === void 0) {
            continue;
          }
          $stmt = $statements[s++] = new $FunctionDeclaration(stmt, this, ctx);

          if (hasBit($stmt.modifierFlags, ModifierFlags.Export)) {
            ExportedBindings.push(...$stmt.ExportedBindings);
            ExportedNames.push(...$stmt.ExportedNames);
            ExportEntries.push(...$stmt.ExportEntries);
          }

          LexicallyScopedDeclarations.push($stmt);
          break;
        case SyntaxKind.ClassDeclaration:
          $stmt = $statements[s++] = new $ClassDeclaration(stmt, this, ctx);

          if (hasBit($stmt.modifierFlags, ModifierFlags.Export)) {
            ExportedBindings.push(...$stmt.ExportedBindings);
            ExportedNames.push(...$stmt.ExportedNames);
            ExportEntries.push(...$stmt.ExportEntries);
          }

          LexicallyScopedDeclarations.push($stmt);
          break;
        case SyntaxKind.InterfaceDeclaration:
          $stmt = $statements[s++] = new $InterfaceDeclaration(stmt, this, ctx);

          if (hasBit($stmt.modifierFlags, ModifierFlags.Export)) {
            ExportedBindings.push(...$stmt.ExportedBindings);
            ExportedNames.push(...$stmt.ExportedNames);
            ExportEntries.push(...$stmt.ExportEntries);
          }
          break;
        case SyntaxKind.TypeAliasDeclaration:
          $stmt = $statements[s++] = new $TypeAliasDeclaration(stmt, this, ctx);

          if (hasBit($stmt.modifierFlags, ModifierFlags.Export)) {
            ExportedBindings.push(...$stmt.ExportedBindings);
            ExportedNames.push(...$stmt.ExportedNames);
            ExportEntries.push(...$stmt.ExportEntries);
          }
          break;
        case SyntaxKind.EnumDeclaration:
          $stmt = $statements[s++] = new $EnumDeclaration(stmt, this, ctx);

          if (hasBit($stmt.modifierFlags, ModifierFlags.Export)) {
            ExportedBindings.push(...$stmt.ExportedBindings);
            ExportedNames.push(...$stmt.ExportedNames);
            ExportEntries.push(...$stmt.ExportEntries);
          }
          break;
        case SyntaxKind.Block:
          $stmt = $statements[s++] = new $Block(stmt, this, ctx);

          VarScopedDeclarations.push(...$stmt.VarScopedDeclarations);
          break;
        case SyntaxKind.EmptyStatement:
          $stmt = $statements[s++] = new $EmptyStatement(stmt, this, ctx);
          break;
        case SyntaxKind.ExpressionStatement:
          $stmt = $statements[s++] = new $ExpressionStatement(stmt, this, ctx);
          break;
        case SyntaxKind.IfStatement:
          $stmt = $statements[s++] = new $IfStatement(stmt, this, ctx);

          VarScopedDeclarations.push(...$stmt.VarScopedDeclarations);
          break;
        case SyntaxKind.DoStatement:
          $stmt = $statements[s++] = new $DoStatement(stmt, this, ctx);

          VarScopedDeclarations.push(...$stmt.VarScopedDeclarations);
          break;
        case SyntaxKind.WhileStatement:
          $stmt = $statements[s++] = new $WhileStatement(stmt, this, ctx);

          VarScopedDeclarations.push(...$stmt.VarScopedDeclarations);
          break;
        case SyntaxKind.ForStatement:
          $stmt = $statements[s++] = new $ForStatement(stmt, this, ctx);

          VarScopedDeclarations.push(...$stmt.VarScopedDeclarations);
          break;
        case SyntaxKind.ForInStatement:
          $stmt = $statements[s++] = new $ForInStatement(stmt, this, ctx);

          VarScopedDeclarations.push(...$stmt.VarScopedDeclarations);
          break;
        case SyntaxKind.ForOfStatement:
          $stmt = $statements[s++] = new $ForOfStatement(stmt, this, ctx);

          VarScopedDeclarations.push(...$stmt.VarScopedDeclarations);
          break;
        case SyntaxKind.ContinueStatement:
          $stmt = $statements[s++] = new $ContinueStatement(stmt, this, ctx);
          break;
        case SyntaxKind.BreakStatement:
          $stmt = $statements[s++] = new $BreakStatement(stmt, this, ctx);
          break;
        case SyntaxKind.ReturnStatement:
          $stmt = $statements[s++] = new $ReturnStatement(stmt, this, ctx);
          break;
        case SyntaxKind.WithStatement:
          $stmt = $statements[s++] = new $WithStatement(stmt, this, ctx);

          VarScopedDeclarations.push(...$stmt.VarScopedDeclarations);
          break;
        case SyntaxKind.SwitchStatement:
          $stmt = $statements[s++] = new $SwitchStatement(stmt, this, ctx);

          VarScopedDeclarations.push(...$stmt.VarScopedDeclarations);
          break;
        case SyntaxKind.LabeledStatement:
          $stmt = $statements[s++] = new $LabeledStatement(stmt, this, ctx);

          VarScopedDeclarations.push(...$stmt.VarScopedDeclarations);
          break;
        case SyntaxKind.ThrowStatement:
          $stmt = $statements[s++] = new $ThrowStatement(stmt, this, ctx);
          break;
        case SyntaxKind.TryStatement:
          $stmt = $statements[s++] = new $TryStatement(stmt, this, ctx);

          VarScopedDeclarations.push(...$stmt.VarScopedDeclarations);
          break;
        case SyntaxKind.DebuggerStatement:
          $stmt = $statements[s++] = new $DebuggerStatement(stmt, this, ctx);
          break;
        default:
          throw new Error(`Unexpected syntax node: ${SyntaxKind[(node as Node).kind]}.`);
      }
    }

    // http://www.ecma-international.org/ecma-262/#sec-parsemodule

    // 1. Assert: sourceText is an ECMAScript source text (see clause 10).
    // 2. Parse sourceText using Module as the goal symbol and analyse the parse result for any Early Error conditions. If the parse was successful and no early errors were found, let body be the resulting parse tree. Otherwise, let body be a List of one or more SyntaxError or ReferenceError objects representing the parsing errors and/or early errors. Parsing and early error detection may be interweaved in an implementation-dependent manner. If more than one parsing error or early error is present, the number and ordering of error objects in the list is implementation-dependent, but at least one must be present.
    // 3. If body is a List of errors, return body.
    // 4. Let requestedModules be the ModuleRequests of body.
    const requestedModules = ModuleRequests;

    // 5. Let importEntries be ImportEntries of body.
    const importEntries = ImportEntries;

    // 6. Let importedBoundNames be ImportedLocalNames(importEntries).
    const importedBoundNames = ImportedLocalNames;

    // 7. Let indirectExportEntries be a new empty List.
    const indirectExportEntries: ExportEntryRecord[] = [];

    // 8. Let localExportEntries be a new empty List.
    const localExportEntries: ExportEntryRecord[] = [];

    // 9. Let starExportEntries be a new empty List.
    const starExportEntries: ExportEntryRecord[] = [];

    // 10. Let exportEntries be ExportEntries of body.
    const exportEntries = ExportEntries;
    let ee: ExportEntryRecord;

    // 11. For each ExportEntry Record ee in exportEntries, do
    for (let i = 0, ii = exportEntries.length; i < ii; ++i) {
      ee = exportEntries[i];

      // 11. a. If ee.[[ModuleRequest]] is null, then
      if (ee.ModuleRequest.isNull) {
        // 11. a. i. If ee.[[LocalName]] is not an element of importedBoundNames, then
        if (!importedBoundNames.some(x => x.is(ee.LocalName))) {
          // 11. a. i. 1. Append ee to localExportEntries.
          localExportEntries.push(ee);
        }
        // 11. a. ii. Else,
        else {
          // 11. a. ii. 1. Let ie be the element of importEntries whose [[LocalName]] is the same as ee.[[LocalName]].
          const ie = importEntries.find(x => x.LocalName.is(ee.LocalName))!;
          // 11. a. ii. 2. If ie.[[ImportName]] is "*", then
          if (ie.ImportName['[[Value]]'] === '*') {
            // 11. a. ii. 2. a. Assert: This is a re-export of an imported module namespace object.
            // 11. a. ii. 2. b. Append ee to localExportEntries.
            localExportEntries.push(ee);
          }
          // 11. a. ii. 3. Else this is a re-export of a single name,
          else {
            // 11. a. ii. 3. a. Append the ExportEntry Record { [[ModuleRequest]]: ie.[[ModuleRequest]], [[ImportName]]: ie.[[ImportName]], [[LocalName]]: null, [[ExportName]]: ee.[[ExportName]] } to indirectExportEntries.
            indirectExportEntries.push(new ExportEntryRecord(
              /* source */this,
              /* ExportName */ee.ExportName,
              /* ModuleRequest */ie.ModuleRequest,
              /* ImportName */ie.ImportName,
              /* LocalName */intrinsics.null,
            ));
          }
        }
      }
      // 11. b. Else if ee.[[ImportName]] is "*", then
      else if (ee.ImportName['[[Value]]'] === '*') {
        // 11. b. i. Append ee to starExportEntries.
        starExportEntries.push(ee);
      }
      // 11. c. Else,
      else {
        // 11. c. i. Append ee to indirectExportEntries.
        indirectExportEntries.push(ee);
      }
    }

    // 12. Return Source Text Module Record { [[Realm]]: Realm, [[Environment]]: undefined, [[Namespace]]: undefined, [[Status]]: "uninstantiated", [[EvaluationError]]: undefined, [[HostDefined]]: hostDefined, [[ECMAScriptCode]]: body, [[RequestedModules]]: requestedModules, [[ImportEntries]]: importEntries, [[LocalExportEntries]]: localExportEntries, [[IndirectExportEntries]]: indirectExportEntries, [[StarExportEntries]]: starExportEntries, [[DFSIndex]]: undefined, [[DFSAncestorIndex]]: undefined }.
    this.Status = 'uninstantiated';
    this.DFSIndex = void 0;
    this.DFSAncestorIndex = void 0;

    this.RequestedModules = requestedModules;

    this.IndirectExportEntries = indirectExportEntries;
    this.LocalExportEntries = localExportEntries;
    this.StarExportEntries = starExportEntries;


    this.logger.trace(`RequestedModules: `, requestedModules);

    this.logger.trace(`ImportEntries: `, importEntries);

    this.logger.trace(`IndirectExportEntries: `, indirectExportEntries);
    this.logger.trace(`LocalExportEntries: `, localExportEntries);
    this.logger.trace(`StarExportEntries: `, starExportEntries);
  }

  // http://www.ecma-international.org/ecma-262/#sec-moduledeclarationinstantiation
  public Instantiate(): $Undefined | $Error {
    const realm = this.realm;
    const intrinsics = realm['[[Intrinsics]]'];
    const ctx = realm.stack.top;

    const start = PLATFORM.now();
    this.logger.debug(`[Instantiate] starting`);

    // TODO: this is temporary. Should be done by RunJobs
    if (realm.stack.top.ScriptOrModule.isNull) {
      realm.stack.top.ScriptOrModule = this;
    }

    // 1. Let module be this Cyclic Module Record.
    // 2. Assert: module.[[Status]] is not "instantiating" or "evaluating".
    // 3. Let stack be a new empty List.
    const stack = [] as $SourceFile[];

    // 4. Let result be InnerModuleInstantiation(module, stack, 0).
    const result = this._InnerModuleInstantiation(ctx, stack, new $Number(realm, 0));

    // 5. If result is an abrupt completion, then
    if (result.isAbrupt) {
      // 5. a. For each module m in stack, do
      for (const m of stack) {
        // 5. a. i. Assert: m.[[Status]] is "instantiating".
        // 5. a. ii. Set m.[[Status]] to "uninstantiated".
        m.Status = 'uninstantiated';

        // 5. a. iii. Set m.[[Environment]] to undefined.
        m['[[Environment]]'] = intrinsics.undefined;

        // 5. a. iv. Set m.[[DFSIndex]] to undefined.
        m.DFSIndex = void 0;

        // 5. a. v. Set m.[[DFSAncestorIndex]] to undefined.
        m.DFSAncestorIndex = void 0;
      }

      // 5. b. Assert: module.[[Status]] is "uninstantiated".
      // 5. c. Return result.
      return result;
    }

    // 6. Assert: module.[[Status]] is "instantiated" or "evaluated".
    // 7. Assert: stack is empty.
    // 8. Return undefined.

    const end = PLATFORM.now();
    this.logger.debug(`[Instantiate] done in ${Math.round(end - start)}ms`);

    return new $Undefined(realm);
  }

  // http://www.ecma-international.org/ecma-262/#sec-innermoduleinstantiation
  /** @internal */
  public _InnerModuleInstantiation(
    ctx: ExecutionContext,
    stack: $SourceFile[],
    index: $Number,
  ): $Number | $Error {
    this.logger.debug(`_InnerModuleInstantiation(#${ctx.id})`);

    const realm = ctx.Realm;
    const intrinsics = realm['[[Intrinsics]]'];

    // 1. If module is not a Cyclic Module Record, then
      // 1. a. Perform ? module.Evaluate(ctx).
      // 1. b. Return index.

    // We only deal with cyclic module records for now

    // 2. If module.[[Status]] is "instantiating", "instantiated", or "evaluated", then
    if (this.Status === 'instantiating' || this.Status === 'instantiated' || this.Status === 'evaluated') {
      // 2. Return index.
      return index;
    }

    // 3. Assert: module.[[Status]] is "uninstantiated".
    // 4. Set module.[[Status]] to "instantiating".
    this.Status = 'instantiating';

    // 5. Set module.[[DFSIndex]] to index.
    this.DFSIndex = index['[[Value]]'];

    // 6. Set module.[[DFSAncestorIndex]] to index.
    this.DFSAncestorIndex = index['[[Value]]'];

    // 7. Increase index by 1.
    index = new $Number(realm, index['[[Value]]'] + 1);

    // 8. Append module to stack.
    stack.push(this);

    // 9. For each String required that is an element of module.[[RequestedModules]], do
    for (const required of this.RequestedModules) {
      // 9. a. Let requiredModule be ? HostResolveImportedModule(module, required).
      const requiredModule = this.moduleResolver.ResolveImportedModule(ctx, this, required);
      if (requiredModule.isAbrupt) { return requiredModule; }

      // 9. b. Set index to ? InnerModuleInstantiation(requiredModule, stack, index).
      const $index = requiredModule._InnerModuleInstantiation(ctx, stack, index);
      if ($index.isAbrupt) { return $index; }
      index = $index;

      // 9. c. Assert: requiredModule.[[Status]] is either "instantiating", "instantiated", or "evaluated".
      // 9. d. Assert: requiredModule.[[Status]] is "instantiating" if and only if requiredModule is in stack.
      // 9. e. If requiredModule.[[Status]] is "instantiating", then
      if (requiredModule instanceof $SourceFile && requiredModule.Status === 'instantiating') {
        // 9. e. i. Assert: requiredModule is a Cyclic Module Record.
        this.logger.warn(`[_InnerModuleInstantiation] ${requiredModule.$file.name} is a cyclic module record`);

        // 9. e. ii. Set module.[[DFSAncestorIndex]] to min(module.[[DFSAncestorIndex]], requiredModule.[[DFSAncestorIndex]]).
        this.DFSAncestorIndex = Math.min(this.DFSAncestorIndex, requiredModule.DFSAncestorIndex!);
      }
    }

    // 10. Perform ? module.InitializeEnvironment().
    this.InitializeEnvironment(ctx);

    // 11. Assert: module occurs exactly once in stack.
    // 12. Assert: module.[[DFSAncestorIndex]] is less than or equal to module.[[DFSIndex]].
    // 13. If module.[[DFSAncestorIndex]] equals module.[[DFSIndex]], then
    if (this.DFSAncestorIndex === this.DFSIndex) {
      // 13. a. Let done be false.
      let done = false;

      // 13. b. Repeat, while done is false,
      while (!done) {
        // 13. b. i. Let requiredModule be the last element in stack.
        // 13. b. ii. Remove the last element of stack.
        const requiredModule = stack.pop()!;

        // 13. b. iii. Set requiredModule.[[Status]] to "instantiated".
        requiredModule.Status = 'instantiated';
        // 13. b. iv. If requiredModule and module are the same Module Record, set done to true.
        if (requiredModule === this) {
          done = true;
        }
      }
    }

    // 14. Return index.
    return index;
  }

  // http://www.ecma-international.org/ecma-262/#sec-source-text-module-record-initialize-environment
  public InitializeEnvironment(
    ctx: ExecutionContext,
  ): $Any {
    this.logger.debug(`InitializeEnvironment(#${ctx.id})`);

    const realm = ctx.Realm;
    const intrinsics = realm['[[Intrinsics]]'];

    // 1. Let module be this Source Text Module Record.
    // 2. For each ExportEntry Record e in module.[[IndirectExportEntries]], do
    for (const e of this.IndirectExportEntries) {
      // 2. a. Let resolution be ? module.ResolveExport(e.[[ExportName]], « »).
      const resolution = this.ResolveExport(ctx, e.ExportName as $String, new ResolveSet());
      if (resolution.isAbrupt) { return resolution; }

      // 2. b. If resolution is null or "ambiguous", throw a SyntaxError exception.
      if (resolution.isNull || resolution.isAmbiguous) {
        return new $SyntaxError(realm, `ResolveExport(${e.ExportName}) returned ${resolution}`);
      }

      // 2. c. Assert: resolution is a ResolvedBinding Record.
    }

    // 3. Assert: All named exports from module are resolvable.
    // 4. Let realm be module.[[Realm]].

    // 5. Assert: Realm is not undefined.
    // 6. Let env be NewModuleEnvironment(realm.[[GlobalEnv]]).
    const envRec = new $ModuleEnvRec(this.logger, realm, realm['[[GlobalEnv]]']);

    // 7. Set module.[[Environment]] to env.
    this['[[Environment]]'] = envRec;

    // 8. Let envRec be env's EnvironmentRecord.
    // 9. For each ImportEntry Record in in module.[[ImportEntries]], do
    for (const ie of this.ImportEntries) {
      // 9. a. Let importedModule be ! HostResolveImportedModule(module, in.[[ModuleRequest]]).
      const importedModule = this.moduleResolver.ResolveImportedModule(ctx, this, ie.ModuleRequest) as IModule;

      // 9. b. NOTE: The above call cannot fail because imported module requests are a subset of module.[[RequestedModules]], and these have been resolved earlier in this algorithm.
      // 9. c. If in.[[ImportName]] is "*", then
      if (ie.ImportName['[[Value]]'] === '*') {
        // 9. c. i. Let namespace be ? GetModuleNamespace(importedModule).
        const namespace = (function (mod) {
          // http://www.ecma-international.org/ecma-262/#sec-getmodulenamespace

          // 1. Assert: module is an instance of a concrete subclass of Module Record.
          // 2. Assert: module.[[Status]] is not "uninstantiated".
          // 3. Let namespace be module.[[Namespace]].
          let namespace = mod['[[Namespace]]'];

          // 4. If namespace is undefined, then
          if (namespace.isUndefined) {
            // 4. a. Let exportedNames be ? module.GetExportedNames(« »).
            const exportedNames = mod.GetExportedNames(ctx, new Set());
            if (exportedNames.isAbrupt) { return exportedNames; }

            // 4. b. Let unambiguousNames be a new empty List.
            const unambiguousNames = new $List<$String>();

            // 4. c. For each name that is an element of exportedNames, do
            for (const name of exportedNames) {
              // 4. c. i. Let resolution be ? module.ResolveExport(name, « »).
              const resolution = mod.ResolveExport(ctx, name, new ResolveSet());
              if (resolution.isAbrupt) { return resolution; }

              // 4. c. ii. If resolution is a ResolvedBinding Record, append name to unambiguousNames.
              if (resolution instanceof ResolvedBindingRecord) {
                unambiguousNames.push(name);
              }
            }

            // 4. d. Set namespace to ModuleNamespaceCreate(module, unambiguousNames).
            namespace = new $NamespaceExoticObject(realm, mod, unambiguousNames);
          }

          // 5. Return namespace.
          return namespace;
        })(importedModule);

        // 9. c. ii. Perform ! envRec.CreateImmutableBinding(in.[[LocalName]], true).
        envRec.CreateImmutableBinding(ctx, ie.LocalName, intrinsics.true);

        // 9. c. iii. Call envRec.InitializeBinding(in.[[LocalName]], namespace).
        if (namespace.isAbrupt) { return namespace; } // TODO: sure about this? Spec doesn't say it
        envRec.InitializeBinding(ctx, ie.LocalName, namespace);
      }
      // 9. d. Else,
      else {
        // 9. d. i. Let resolution be ? importedModule.ResolveExport(in.[[ImportName]], « »).
        const resolution = importedModule.ResolveExport(ctx, ie.ImportName, new ResolveSet());
        if (resolution.isAbrupt) { return resolution; }

        // 9. d. ii. If resolution is null or "ambiguous", throw a SyntaxError exception.
        if (resolution.isNull || resolution.isAmbiguous) {
          return new $SyntaxError(realm, `ResolveExport(${ie.ImportName}) returned ${resolution}`);
        }

        // 9. d. iii. Call envRec.CreateImportBinding(in.[[LocalName]], resolution.[[Module]], resolution.[[BindingName]]).
        envRec.CreateImportBinding(ctx, ie.LocalName, resolution.Module, resolution.BindingName);
      }
    }

    // 10. Let code be module.[[ECMAScriptCode]].
    // 11. Let varDeclarations be the VarScopedDeclarations of code.
    const varDeclarations = this.VarScopedDeclarations;

    // 12. Let declaredVarNames be a new empty List.
    const declaredVarNames = new $List<$String>();

    // 13. For each element d in varDeclarations, do
    for (const d of varDeclarations) {
      // 13. a. For each element dn of the BoundNames of d, do
      for (const dn of d.BoundNames) {
        // 13. a. i. If dn is not an element of declaredVarNames, then
        if (!declaredVarNames.$contains(dn)) {
          // 13. a. i. 1. Perform ! envRec.CreateMutableBinding(dn, false).
          envRec.CreateMutableBinding(ctx, dn, intrinsics.false);

          // 13. a. i. 2. Call envRec.InitializeBinding(dn, undefined).
          envRec.InitializeBinding(ctx, dn, intrinsics.undefined);

          // 13. a. i. 3. Append dn to declaredVarNames.
          declaredVarNames.push(dn);
        }
      }
    }

    // 14. Let lexDeclarations be the LexicallyScopedDeclarations of code.
    const lexDeclarations = this.LexicallyScopedDeclarations;

    // 15. For each element d in lexDeclarations, do
    for (const d of lexDeclarations) {
      // 15. a. For each element dn of the BoundNames of d, do
      for (const dn of d.BoundNames) {
        // 15. a. i. If IsConstantDeclaration of d is true, then
        if (d.IsConstantDeclaration) {
          // 15. a. i. 1. Perform ! envRec.CreateImmutableBinding(dn, true).
          envRec.CreateImmutableBinding(ctx, dn, intrinsics.true);
        }
        // 15. a. ii. Else,
        else {
          // 15. a. ii. 1. Perform ! envRec.CreateMutableBinding(dn, false).
          envRec.CreateMutableBinding(ctx, dn, intrinsics.false);

          // 15. a. iii. If d is a FunctionDeclaration, a GeneratorDeclaration, an AsyncFunctionDeclaration, or an AsyncGeneratorDeclaration, then
          if (d.$kind === SyntaxKind.FunctionDeclaration) {
            // 15. a. iii. 1. Let fo be the result of performing InstantiateFunctionObject for d with argument env.
            const fo = d.InstantiateFunctionObject(ctx, envRec);

            // 15. a. iii. 2. Call envRec.InitializeBinding(dn, fo).
            envRec.InitializeBinding(ctx, dn, fo);
          }
        }
      }
    }

    // 16. Return NormalCompletion(empty).
    return new $Empty(realm);
  }

  // http://www.ecma-international.org/ecma-262/#sec-getexportednames
  public GetExportedNames(
    ctx: ExecutionContext,
    exportStarSet: Set<IModule>,
  ): $List<$String> | $Error {
    const realm = ctx.Realm;
    const intrinsics = realm['[[Intrinsics]]'];

    // 1. Let module be this Source Text Module Record.
    const mod = this;

    // 2. If exportStarSet contains module, then
    if (exportStarSet.has(mod)) {
      // 2. a. Assert: We've reached the starting point of an import * circularity.
      // 2. b. Return a new empty List.
      return new $List();
    }

    // 3. Append module to exportStarSet.
    exportStarSet.add(mod);

    // 4. Let exportedNames be a new empty List.
    const exportedNames = new $List<$String>();

    // 5. For each ExportEntry Record e in module.[[LocalExportEntries]], do
    for (const e of mod.LocalExportEntries) {
      // 5. a. Assert: module provides the direct binding for this export.
      // 5. b. Append e.[[ExportName]] to exportedNames.
      exportedNames.push(e.ExportName as $String);
    }

    // 6. For each ExportEntry Record e in module.[[IndirectExportEntries]], do
    for (const e of mod.IndirectExportEntries) {
      // 6. a. Assert: module imports a specific binding for this export.
      // 6. b. Append e.[[ExportName]] to exportedNames.
      exportedNames.push(e.ExportName as $String);
    }


    // 7. For each ExportEntry Record e in module.[[StarExportEntries]], do
    for (const e of mod.StarExportEntries) {
      // 7. a. Let requestedModule be ? HostResolveImportedModule(module, e.[[ModuleRequest]]).
      const requestedModule = this.moduleResolver.ResolveImportedModule(ctx, mod, e.ModuleRequest as $String);
      if (requestedModule.isAbrupt) { return requestedModule; }

      // 7. b. Let starNames be ? requestedModule.GetExportedNames(exportStarSet).
      const starNames = requestedModule.GetExportedNames(ctx, exportStarSet);
      if (starNames.isAbrupt) { return starNames; }

      // 7. c. For each element n of starNames, do
      for (const n of starNames) {
        // 7. c. i. If SameValue(n, "default") is false, then
        if (n['[[Value]]'] !== 'default') {
          // 7. c. i. 1. If n is not an element of exportedNames, then
          if (!exportedNames.$contains(n)) {
            // 7. c. i. 1. a. Append n to exportedNames.
            exportedNames.push(n);
          }
        }
      }
    }

    // 8. Return exportedNames.
    return exportedNames;
  }

  // http://www.ecma-international.org/ecma-262/#sec-resolveexport
  public ResolveExport(
    ctx: ExecutionContext,
    exportName: $String,
    resolveSet: ResolveSet,
  ): ResolvedBindingRecord | $Null | $String<'ambiguous'> | $Error {
    const realm = ctx.Realm;
    const intrinsics = realm['[[Intrinsics]]'];

    // 1. Let module be this Source Text Module Record.
    // 2. For each Record { [[Module]], [[ExportName]] } r in resolveSet, do
    // 2. a. If module and r.[[Module]] are the same Module Record and SameValue(exportName, r.[[ExportName]]) is true, then
    if (resolveSet.has(this, exportName)) {
      // 2. a. i. Assert: This is a circular import request.
      // 2. a. ii. Return null.
      this.logger.warn(`[ResolveExport] Circular import: ${exportName}`);
      return new $Null(realm);
    }

    // 3. Append the Record { [[Module]]: module, [[ExportName]]: exportName } to resolveSet.
    resolveSet.add(this, exportName);

    // 4. For each ExportEntry Record e in module.[[LocalExportEntries]], do
    for (const e of this.LocalExportEntries) {
      // 4. a. If SameValue(exportName, e.[[ExportName]]) is true, then
      if (exportName.is(e.ExportName)) {
        // 4. a. i. Assert: module provides the direct binding for this export.
        this.logger.debug(`[ResolveExport] found direct binding for ${exportName['[[Value]]']}`);

        // 4. a. ii. Return ResolvedBinding Record { [[Module]]: module, [[BindingName]]: e.[[LocalName]] }.
        return new ResolvedBindingRecord(this, e.LocalName as $String);
      }
    }


    // 5. For each ExportEntry Record e in module.[[IndirectExportEntries]], do
    for (const e of this.IndirectExportEntries) {
      // 5. a. If SameValue(exportName, e.[[ExportName]]) is true, then
      if (exportName.is(e.ExportName)) {
        // 5. a. i. Assert: module imports a specific binding for this export.
        this.logger.debug(`[ResolveExport] found specific imported binding for ${exportName['[[Value]]']}`);

        // 5. a. ii. Let importedModule be ? HostResolveImportedModule(module, e.[[ModuleRequest]]).
        const importedModule = this.moduleResolver.ResolveImportedModule(ctx, this, e.ModuleRequest as $String);
        if (importedModule.isAbrupt) { return importedModule; }

        // 5. a. iii. Return importedModule.ResolveExport(e.[[ImportName]], resolveSet).
        return importedModule.ResolveExport(ctx, e.ImportName as $String, resolveSet);
      }
    }

    // 6. If SameValue(exportName, "default") is true, then
    if (exportName['[[Value]]'] === 'default') {
      // 6. a. Assert: A default export was not explicitly defined by this module.
      // 6. b. Return null.
      this.logger.warn(`[ResolveExport] No default export defined`);

      return new $Null(realm);
      // 6. c. NOTE: A default export cannot be provided by an export *.
    }

    // 7. Let starResolution be null.
    let starResolution: ResolvedBindingRecord | $Null = new $Null(realm);

    // 8. For each ExportEntry Record e in module.[[StarExportEntries]], do
    for (const e of this.StarExportEntries) {
      // 8. a. Let importedModule be ? HostResolveImportedModule(module, e.[[ModuleRequest]]).
      const importedModule = this.moduleResolver.ResolveImportedModule(ctx, this, e.ModuleRequest as $String);
      if (importedModule.isAbrupt) { return importedModule; }

      // 8. b. Let resolution be ? importedModule.ResolveExport(exportName, resolveSet).
      const resolution = importedModule.ResolveExport(ctx, exportName, resolveSet);
      if (resolution.isAbrupt) { return resolution; }

      // 8. c. If resolution is "ambiguous", return "ambiguous".
      if (resolution.isAmbiguous) {
        this.logger.warn(`[ResolveExport] ambiguous resolution for ${exportName['[[Value]]']}`);

        return resolution;
      }

      // 8. d. If resolution is not null, then
      if (!resolution.isNull) {
        // 8. d. i. Assert: resolution is a ResolvedBinding Record.
        // 8. d. ii. If starResolution is null, set starResolution to resolution.
        if (starResolution.isNull) {
          starResolution = resolution;
        }
        // 8. d. iii. Else,
        else {
          // 8. d. iii. 1. Assert: There is more than one * import that includes the requested name.
          // 8. d. iii. 2. If resolution.[[Module]] and starResolution.[[Module]] are not the same Module Record or SameValue(resolution.[[BindingName]], starResolution.[[BindingName]]) is false, return "ambiguous".
          if (!(resolution.Module === starResolution.Module && resolution.BindingName.is(starResolution.BindingName))) {
            this.logger.warn(`[ResolveExport] ambiguous resolution for ${exportName['[[Value]]']}`);

            return new $String(realm, 'ambiguous');
          }
        }
      }
    }

    if (starResolution.isNull) {
      this.logger.warn(`[ResolveExport] starResolution is null for ${exportName['[[Value]]']}`);
    }

    // 9. Return starResolution.
    return starResolution;
  }

  // http://www.ecma-international.org/ecma-262/#sec-moduleevaluation
  public EvaluateModule(): $Any {
    this.logger.debug(`EvaluateModule()`);

    const realm = this.realm;
    const ctx = realm.stack.top;
    const intrinsics = realm['[[Intrinsics]]'];

    // 1. Let module be this Cyclic Module Record.
    // 2. Assert: module.[[Status]] is "instantiated" or "evaluated".
    // 3. Let stack be a new empty List.
    const stack: $SourceFile[] = [];

    // 4. Let result be InnerModuleEvaluation(module, stack, 0).
    const result = this.EvaluateModuleInner(ctx, stack, 0);

    // 5. If result is an abrupt completion, then
    if (result.isAbrupt) {
      // 5. a. For each module m in stack, do
      for (const m of stack) {
        // 5. a. i. Assert: m.[[Status]] is "evaluating".
        // 5. a. ii. Set m.[[Status]] to "evaluated".
        m.Status = 'evaluated';

        // 5. a. iii. Set m.[[EvaluationError]] to result.
        // TODO
      }

      // 5. b. Assert: module.[[Status]] is "evaluated" and module.[[EvaluationError]] is result.
      // 5. c. Return result.
      return result;
    }

    // 6. Assert: module.[[Status]] is "evaluated" and module.[[EvaluationError]] is undefined.
    // 7. Assert: stack is empty.
    // 8. Return undefined.
    return new $Undefined(realm, CompletionType.normal, intrinsics.empty, this);
  }

  // http://www.ecma-international.org/ecma-262/#sec-innermoduleevaluation
  public EvaluateModuleInner(
    ctx: ExecutionContext,
    stack: $SourceFile[],
    index: number,
  ): $Number {
    this.logger.debug(`EvaluateModuleInner(#${ctx.id})`);

    const realm = ctx.Realm;
    const intrinsics = realm['[[Intrinsics]]'];

    // 1. If module is not a Cyclic Module Record, then
    // 1. a. Perform ? module.Evaluate(ctx).
    // 1. b. Return index.
    // 2. If module.[[Status]] is "evaluated", then
    if (this.Status === 'evaluated') {
      // 2. a. If module.[[EvaluationError]] is undefined, return index.
      return new $Number(realm, index); // TODO

      // 2. b. Otherwise return module.[[EvaluationError]].
    }

    // 3. If module.[[Status]] is "evaluating", return index.
    if (this.Status === 'evaluating') {
      return new $Number(realm, index);
    }

    // 4. Assert: module.[[Status]] is "instantiated".
    // 5. Set module.[[Status]] to "evaluating".
    this.Status = 'evaluating';

    // 6. Set module.[[DFSIndex]] to index.
    this.DFSIndex = index;

    // 7. Set module.[[DFSAncestorIndex]] to index.
    this.DFSAncestorIndex = index;

    // 8. Increase index by 1.
    ++index;

    // 9. Append module to stack.
    stack.push(this);

    // 10. For each String required that is an element of module.[[RequestedModules]], do
    for (const required of this.RequestedModules) {
      // 10. a. Let requiredModule be ! HostResolveImportedModule(module, required).
      const requiredModule = this.moduleResolver.ResolveImportedModule(ctx, this, required) as $SourceFile; // TODO

      // 10. b. NOTE: Instantiate must be completed successfully prior to invoking this method, so every requested module is guaranteed to resolve successfully.
      // 10. c. Set index to ? InnerModuleEvaluation(requiredModule, stack, index).
      index = requiredModule.EvaluateModuleInner(ctx, stack, index)['[[Value]]'];

      // 10. d. Assert: requiredModule.[[Status]] is either "evaluating" or "evaluated".
      // 10. e. Assert: requiredModule.[[Status]] is "evaluating" if and only if requiredModule is in stack.
      // 10. f. If requiredModule.[[Status]] is "evaluating", then
      if (requiredModule.Status === 'evaluating') {
        // 10. f. i. Assert: requiredModule is a Cyclic Module Record.
        // 10. f. ii. Set module.[[DFSAncestorIndex]] to min(module.[[DFSAncestorIndex]], requiredModule.[[DFSAncestorIndex]]).
        this.DFSAncestorIndex = Math.min(this.DFSAncestorIndex, requiredModule.DFSAncestorIndex!);
      }
    }

    // 11. Perform ? module.ExecuteModule().
    this.ExecutionResult = this.ExecuteModule(ctx);

    // 12. Assert: module occurs exactly once in stack.
    // 13. Assert: module.[[DFSAncestorIndex]] is less than or equal to module.[[DFSIndex]].
    // 14. If module.[[DFSAncestorIndex]] equals module.[[DFSIndex]], then
    if (this.DFSAncestorIndex === this.DFSIndex) {
      // 14. a. Let done be false.
      let done = false;
      // 14. b. Repeat, while done is false,
      while (!done) {
        // 14. b. i. Let requiredModule be the last element in stack.
        // 14. b. ii. Remove the last element of stack.
        const requiredModule = stack.pop()!;

        // 14. b. iii. Set requiredModule.[[Status]] to "evaluated".
        requiredModule.Status = 'evaluated';

        // 14. b. iv. If requiredModule and module are the same Module Record, set done to true.
        if (requiredModule === this) {
          done = true;
        }
      }
    }

    // 15. Return index.
    return new $Number(realm, index);
  }

  // http://www.ecma-international.org/ecma-262/#sec-source-text-module-record-execute-module
  public ExecuteModule(
    ctx: ExecutionContext,
  ): $Any {
    this.logger.debug(`ExecuteModule(#${ctx.id})`);

    const realm = ctx.Realm;
    const intrinsics = realm['[[Intrinsics]]'];

    // 1. Let module be this Source Text Module Record.
    // 2. Let moduleCxt be a new ECMAScript code execution context.
    const moduleCxt = new ExecutionContext(realm);

    // 3. Set the Function of moduleCxt to null.
    moduleCxt.Function = intrinsics.null;

    // 4. Assert: module.[[Realm]] is not undefined.

    // 5. Set the Realm of moduleCxt to module.[[Realm]].

    // 6. Set the ScriptOrModule of moduleCxt to module.
    moduleCxt.ScriptOrModule = this;

    // 7. Assert: module has been linked and declarations in its module environment have been instantiated.
    // 8. Set the VariableEnvironment of moduleCxt to module.[[Environment]].
    moduleCxt.VariableEnvironment = this['[[Environment]]'] as ($ModuleEnvRec | $FunctionEnvRec);

    // 9. Set the LexicalEnvironment of moduleCxt to module.[[Environment]].
    moduleCxt.LexicalEnvironment = this['[[Environment]]'] as $EnvRec;

    // 10. Suspend the currently running execution context.
    const stack = realm.stack;
    ctx.suspend();

    // 11. Push moduleCxt on to the execution context stack; moduleCxt is now the running execution context.
    stack.push(moduleCxt);

    // 12. Let result be the result of evaluating module.[[ECMAScriptCode]].
    const result = this.Evaluate(moduleCxt);

    // 13. Suspend moduleCxt and remove it from the execution context stack.
    moduleCxt.suspend();
    stack.pop();

    // 14. Resume the context that is now on the top of the execution context stack as the running execution context.
    ctx.resume();

    // 15. Return Completion(result).
    return result;
  }

  // http://www.ecma-international.org/ecma-262/#sec-module-semantics-runtime-semantics-evaluation
  public Evaluate(
    ctx: ExecutionContext,
  ): $Any {
    const realm = ctx.Realm;
    const intrinsics = realm['[[Intrinsics]]'];

    this.logger.debug(`Evaluate(#${ctx.id})`);
    const $statements = this.$statements;

    // Module : [empty]

    // 1. Return NormalCompletion(undefined).

    // ModuleBody : ModuleItemList

    // 1. Let result be the result of evaluating ModuleItemList.
    // 2. If result.[[Type]] is normal and result.[[Value]] is empty, then
    // 2. a. Return NormalCompletion(undefined).
    // 3. Return Completion(result).

    // ModuleItemList : ModuleItemList ModuleItem

    // 1. Let sl be the result of evaluating ModuleItemList.
    // 2. ReturnIfAbrufpt(sl).
    // 3. Let s be the result of evaluating ModuleItem.
    // 4. Return Completion(UpdateEmpty(s, sl)).

    // ModuleItem : ImportDeclaration

    // 1. Return NormalCompletion(empty).

    let $statement: $$TSModuleItem;
    let sl: $Any = (void 0)!;
    for (let i = 0, ii = $statements.length; i < ii; ++i) {
      $statement = $statements[i];

      switch ($statement.$kind) {
        case SyntaxKind.ModuleDeclaration:
          // sl = $statement.Evaluate(ctx);
          break;
        case SyntaxKind.NamespaceExportDeclaration:
          // sl = $statement.Evaluate(ctx);
          break;
        case SyntaxKind.ImportEqualsDeclaration:
          // sl = $statement.Evaluate(ctx);
          break;
        case SyntaxKind.ImportDeclaration:
          // sl = $statement.Evaluate(ctx);
          break;
        case SyntaxKind.ExportAssignment:
          // sl = $statement.Evaluate(ctx);
          break;
        case SyntaxKind.ExportDeclaration:
          // sl = $statement.Evaluate(ctx);
          break;
        case SyntaxKind.VariableStatement:
          sl = $statement.Evaluate(ctx);
          break;
        case SyntaxKind.FunctionDeclaration:
          sl = $statement.Evaluate(ctx);
          break;
        case SyntaxKind.ClassDeclaration:
          sl = $statement.Evaluate(ctx);
          break;
        case SyntaxKind.InterfaceDeclaration:
          // sl = $statement.Evaluate(ctx);
          break;
        case SyntaxKind.TypeAliasDeclaration:
          // sl = $statement.Evaluate(ctx);
          break;
        case SyntaxKind.EnumDeclaration:
          // sl = $statement.Evaluate(ctx);
          break;
        case SyntaxKind.Block:
          sl = $statement.Evaluate(ctx);
          break;
        case SyntaxKind.EmptyStatement:
          sl = $statement.Evaluate(ctx);
          break;
        case SyntaxKind.ExpressionStatement:
          sl = $statement.Evaluate(ctx);
          break;
        case SyntaxKind.IfStatement:
          sl = $statement.Evaluate(ctx);
          break;
        case SyntaxKind.DoStatement:
          sl = $statement.EvaluateLabelled(ctx);
          break;
        case SyntaxKind.WhileStatement:
          sl = $statement.EvaluateLabelled(ctx);
          break;
        case SyntaxKind.ForStatement:
          sl = $statement.EvaluateLabelled(ctx);
          break;
        case SyntaxKind.ForInStatement:
          sl = $statement.EvaluateLabelled(ctx);
          break;
        case SyntaxKind.ForOfStatement:
          sl = $statement.EvaluateLabelled(ctx);
          break;
        case SyntaxKind.ContinueStatement:
          sl = $statement.Evaluate(ctx);
          break;
        case SyntaxKind.BreakStatement:
          sl = $statement.Evaluate(ctx);
          break;
        case SyntaxKind.ReturnStatement:
          sl = $statement.Evaluate(ctx);
          break;
        case SyntaxKind.WithStatement:
          sl = $statement.Evaluate(ctx);
          break;
        case SyntaxKind.SwitchStatement:
          sl = $statement.Evaluate(ctx);
          break;
        case SyntaxKind.LabeledStatement:
          sl = $statement.EvaluateLabelled(ctx);
          break;
        case SyntaxKind.ThrowStatement:
          sl = $statement.Evaluate(ctx);
          break;
        case SyntaxKind.TryStatement:
          sl = $statement.Evaluate(ctx);
          break;
        case SyntaxKind.DebuggerStatement:
          sl = $statement.Evaluate(ctx);
          break;
        default:
          throw new Error(`Unexpected syntax node: ${SyntaxKind[$statement.$kind]}.`);
      }
    }

    return sl;
  }
}

export class $DocumentFragment implements I$Node, IModule {
  public readonly '<IModule>': unknown;

  public readonly id: number;

  public readonly documentFragment: $DocumentFragment = this;
  public readonly parent: $DocumentFragment = this;
  public readonly ctx: Context = Context.None;
  public readonly depth: number = 0;

  public '[[Environment]]': $ModuleEnvRec | $Undefined;
  public '[[Namespace]]': $NamespaceExoticObject | $Undefined;
  public '[[HostDefined]]': any;

  public get isNull(): false { return false; }
  public get isAbrupt(): false { return false; }

  public constructor(
    public readonly logger: ILogger,
    public readonly $file: IFile,
    public readonly node: DocumentFragment,
    public readonly realm: Realm,
    public readonly pkg: NPMPackage | null,
  ) {
    this.id = realm.registerNode(this);
    const intrinsics = realm['[[Intrinsics]]'];
    this['[[Environment]]'] = intrinsics.undefined;
    this['[[Namespace]]'] = intrinsics.undefined;

    this.logger = logger.root.scopeTo(`DocumentFragment<(...)${$file.rootlessPath}>`);
  }

  public ResolveExport(
    ctx: ExecutionContext,
    exportName: $String,
    resolveSet: ResolveSet,
  ): ResolvedBindingRecord | $Null | $String<'ambiguous'> {
    this.logger.debug(`[ResolveExport] returning content as '${exportName['[[Value]]']}'`);

    return new ResolvedBindingRecord(this, exportName);
  }

  public GetExportedNames(
    ctx: ExecutionContext,
    exportStarSet: Set<IModule>,
  ): $List<$String> | $Error {
    return new $List<$String>();
  }

  public Instantiate(
    ctx: ExecutionContext,
  ): $Undefined | $Error {
    return ctx.Realm['[[Intrinsics]]'].undefined;
  }

  /** @internal */
  public _InnerModuleInstantiation(
    ctx: ExecutionContext,
    stack: IModule[],
    index: $Number,
  ): $Number | $Error {
    return index;
  }
}

export type $$ModuleBody = (
  $ModuleBlock |
  $ModuleDeclaration
);

export type $$ModuleName = (
  $Identifier |
  $StringLiteral
);

export class $ModuleDeclaration implements I$Node {
  public readonly $kind = SyntaxKind.ModuleDeclaration;
  public readonly id: number;

  public readonly modifierFlags: ModifierFlags;

  public readonly $name: $$ModuleName;
  public readonly $body: $Identifier | $ModuleBlock | $ModuleDeclaration | undefined;

  public constructor(
    public readonly node: ModuleDeclaration,
    public readonly parent: $SourceFile | $$ModuleBody,
    public readonly ctx: Context,
    public readonly sourceFile: $SourceFile = parent.sourceFile,
    public readonly realm: Realm = parent.realm,
    public readonly depth: number = parent.depth + 1,
    public readonly logger: ILogger = parent.logger.scopeTo('ModuleDeclaration'),
  ) {
    this.id = realm.registerNode(this);

    this.modifierFlags = modifiersToModifierFlags(node.modifiers);

    if (node.name.kind === SyntaxKind.Identifier) {
      this.$name = new $Identifier(node.name, this, ctx);
    } else {
      this.$name = new $StringLiteral(node.name, this, ctx);
    }

    if (node.body === void 0) {
      this.$body = void 0;
    } else {
      switch (node.body.kind) {
        case SyntaxKind.Identifier:
          this.$body = new $Identifier(node.body, this, ctx)
          break;
        case SyntaxKind.ModuleBlock:
          this.$body = new $ModuleBlock(node.body, this, ctx)
          break;
        case SyntaxKind.ModuleDeclaration:
          this.$body = new $ModuleDeclaration(node.body, this, ctx)
          break;
        default:
          throw new Error(`Unexpected syntax node: ${SyntaxKind[(node as Node).kind]}.`);
      }
    }
  }
}

// http://www.ecma-international.org/ecma-262/#importentry-record
/**
 * | Import Statement Form          | MR        | IN          | LN        |
 * |:-------------------------------|:----------|:------------|:----------|
 * | `import v from "mod";`         | `"mod"`   | `"default"` | `"v"`     |
 * | `import * as ns from "mod";`   | `"mod"`   | `"*"`       | `"ns"`    |
 * | `import {x} from "mod";`       | `"mod"`   | `"x"`       | `"x"`     |
 * | `import {x as v} from "mod";`  | `"mod"`   | `"x"`       | `"v"`     |
 * | `import "mod";`                | N/A       | N/A         | N/A       |
 */
export class ImportEntryRecord {
  public constructor(
    public readonly source: $ImportClause | $NamespaceImport | $ImportSpecifier,
    public readonly ModuleRequest: $String,
    public readonly ImportName: $String,
    public readonly LocalName: $String,
  ) { }
}

export type $$ModuleReference = (
  $$EntityName |
  $ExternalModuleReference
);

/**
 * One of:
 * - import x = require("mod");
 * - import x = M.x;
 */
export class $ImportEqualsDeclaration implements I$Node {
  public readonly $kind = SyntaxKind.ImportEqualsDeclaration;
  public readonly id: number;

  public readonly modifierFlags: ModifierFlags;

  public readonly $name: $Identifier;
  public readonly $moduleReference: $$ModuleReference;

  public constructor(
    public readonly node: ImportEqualsDeclaration,
    public readonly parent: $SourceFile | $ModuleBlock,
    public readonly ctx: Context,
    public readonly sourceFile: $SourceFile = parent.sourceFile,
    public readonly realm: Realm = parent.realm,
    public readonly depth: number = parent.depth + 1,
    public readonly logger: ILogger = parent.logger.scopeTo('ImportEqualsDeclaration'),
  ) {
    this.id = realm.registerNode(this);

    this.modifierFlags = modifiersToModifierFlags(node.modifiers);

    this.$name = $identifier(node.name, this, ctx);
    switch (node.moduleReference.kind) {
      case SyntaxKind.Identifier:
        this.$moduleReference = new $Identifier(node.moduleReference, this, ctx)
        break;
      case SyntaxKind.QualifiedName:
        this.$moduleReference = new $QualifiedName(node.moduleReference, this, ctx)
        break;
      case SyntaxKind.ExternalModuleReference:
        this.$moduleReference = new $ExternalModuleReference(node.moduleReference, this, ctx)
        break;
      default:
        throw new Error(`Unexpected syntax node: ${SyntaxKind[(node as Node).kind]}.`);
    }
  }
}

// In case of:
// import "mod"  => importClause = undefined, moduleSpecifier = "mod"
// In rest of the cases, module specifier is string literal corresponding to module
// ImportClause information is shown at its declaration below.
export class $ImportDeclaration implements I$Node {
  public readonly $kind = SyntaxKind.ImportDeclaration;
  public readonly id: number;

  public readonly modifierFlags: ModifierFlags;

  public readonly $importClause: $ImportClause | $Undefined;
  public readonly $moduleSpecifier: $StringLiteral;

  public readonly moduleSpecifier: $String;

  // http://www.ecma-international.org/ecma-262/#sec-imports-static-semantics-boundnames
  public readonly BoundNames: readonly $String[];
  // http://www.ecma-international.org/ecma-262/#sec-imports-static-semantics-importentries
  public readonly ImportEntries: readonly ImportEntryRecord[];
  // http://www.ecma-international.org/ecma-262/#sec-imports-static-semantics-modulerequests
  public readonly ModuleRequests: readonly $String[];

  public constructor(
    public readonly node: ImportDeclaration,
    public readonly parent: $SourceFile | $ModuleBlock,
    public readonly ctx: Context,
    public readonly sourceFile: $SourceFile = parent.sourceFile,
    public readonly realm: Realm = parent.realm,
    public readonly depth: number = parent.depth + 1,
    public readonly logger: ILogger = parent.logger.scopeTo('ImportDeclaration'),
  ) {
    this.id = realm.registerNode(this);

    this.modifierFlags = modifiersToModifierFlags(node.modifiers);

    const $moduleSpecifier = this.$moduleSpecifier = new $StringLiteral(node.moduleSpecifier as StringLiteral, this, ctx);

    const moduleSpecifier = this.moduleSpecifier = $moduleSpecifier.StringValue;

    if (node.importClause === void 0) {
      this.$importClause = new $Undefined(realm, void 0, void 0, this);

      this.BoundNames = emptyArray;
      this.ImportEntries = emptyArray;
    } else {
      const $importClause = this.$importClause = new $ImportClause(node.importClause, this, ctx);

      this.BoundNames = $importClause.BoundNames;
      this.ImportEntries = $importClause.ImportEntriesForModule;
    }

    this.ModuleRequests = [moduleSpecifier];
  }
}

// In case of:
// import d from "mod" => name = d, namedBinding = undefined
// import * as ns from "mod" => name = undefined, namedBinding: NamespaceImport = { name: ns }
// import d, * as ns from "mod" => name = d, namedBinding: NamespaceImport = { name: ns }
// import { a, b as x } from "mod" => name = undefined, namedBinding: NamedImports = { elements: [{ name: a }, { name: x, propertyName: b}]}
// import d, { a, b as x } from "mod" => name = d, namedBinding: NamedImports = { elements: [{ name: a }, { name: x, propertyName: b}]}
export class $ImportClause implements I$Node {
  public readonly $kind = SyntaxKind.ImportClause;
  public readonly id: number;

  public readonly $name: $Identifier | $Undefined;
  public readonly $namedBindings: $NamespaceImport | $NamedImports | undefined;

  public readonly moduleSpecifier: $String;

  // http://www.ecma-international.org/ecma-262/#sec-imports-static-semantics-boundnames
  public readonly BoundNames: readonly $String[];
  // http://www.ecma-international.org/ecma-262/#sec-static-semantics-importentriesformodule
  public readonly ImportEntriesForModule: readonly ImportEntryRecord[];

  public constructor(
    public readonly node: ImportClause,
    public readonly parent: $ImportDeclaration,
    public readonly ctx: Context,
    public readonly sourceFile: $SourceFile = parent.sourceFile,
    public readonly realm: Realm = parent.realm,
    public readonly depth: number = parent.depth + 1,
    public readonly logger: ILogger = parent.logger.scopeTo('ImportClause'),
  ) {
    this.id = realm.registerNode(this);
    const intrinsics = realm['[[Intrinsics]]'];

    const moduleSpecifier = this.moduleSpecifier = parent.moduleSpecifier;

    const BoundNames = this.BoundNames = [] as $String[];
    const ImportEntriesForModule = this.ImportEntriesForModule = [] as ImportEntryRecord[];

    if (node.name === void 0) {
      this.$name = new $Undefined(realm, void 0, void 0, this);
    } else {
      const $name = this.$name = new $Identifier(node.name, this, ctx);

      const [localName] = $name.BoundNames;
      BoundNames.push(localName);
      ImportEntriesForModule.push(
        new ImportEntryRecord(
          /* source */this,
          /* ModuleRequest */moduleSpecifier,
          /* ImportName */intrinsics.default,
          /* LocalName */localName,
        ),
      );
    }

    if (node.namedBindings === void 0) {
      this.$namedBindings = void 0;
    } else {
      if (node.namedBindings.kind === SyntaxKind.NamespaceImport) {
        const $namedBindings = this.$namedBindings = new $NamespaceImport(node.namedBindings, this, ctx);
        BoundNames.push(...$namedBindings.BoundNames);
        ImportEntriesForModule.push(...$namedBindings.ImportEntriesForModule);
      } else {
        const $namedBindings = this.$namedBindings = new $NamedImports(node.namedBindings, this, ctx);
        BoundNames.push(...$namedBindings.BoundNames);
        ImportEntriesForModule.push(...$namedBindings.ImportEntriesForModule);
      }
    }
  }
}

export class $NamedImports implements I$Node {
  public readonly $kind = SyntaxKind.NamedImports;
  public readonly id: number;

  public readonly $elements: readonly $ImportSpecifier[];

  public readonly moduleSpecifier: $String;

  // http://www.ecma-international.org/ecma-262/#sec-imports-static-semantics-boundnames
  public readonly BoundNames: readonly $String[];
  // http://www.ecma-international.org/ecma-262/#sec-static-semantics-importentriesformodule
  public readonly ImportEntriesForModule: readonly ImportEntryRecord[];

  public constructor(
    public readonly node: NamedImports,
    public readonly parent: $ImportClause,
    public readonly ctx: Context,
    public readonly sourceFile: $SourceFile = parent.sourceFile,
    public readonly realm: Realm = parent.realm,
    public readonly depth: number = parent.depth + 1,
    public readonly logger: ILogger = parent.logger.scopeTo('NamedImports'),
  ) {
    this.id = realm.registerNode(this);

    this.moduleSpecifier = parent.moduleSpecifier;

    const $elements = this.$elements = node.elements.map(x => new $ImportSpecifier(x, this, ctx));

    this.BoundNames = $elements.flatMap(getBoundNames);
    this.ImportEntriesForModule = $elements.flatMap(getImportEntriesForModule);
  }
}

export class $ImportSpecifier implements I$Node {
  public readonly $kind = SyntaxKind.ImportSpecifier;
  public readonly id: number;

  public readonly $propertyName: $Identifier | $Undefined;
  public readonly $name: $Identifier;

  // http://www.ecma-international.org/ecma-262/#sec-imports-static-semantics-boundnames
  public readonly BoundNames: readonly [$String];
  // http://www.ecma-international.org/ecma-262/#sec-static-semantics-importentriesformodule
  public readonly ImportEntriesForModule: readonly [ImportEntryRecord];

  public constructor(
    public readonly node: ImportSpecifier,
    public readonly parent: $NamedImports,
    public readonly ctx: Context,
    public readonly sourceFile: $SourceFile = parent.sourceFile,
    public readonly realm: Realm = parent.realm,
    public readonly depth: number = parent.depth + 1,
    public readonly logger: ILogger = parent.logger.scopeTo('ImportSpecifier'),
  ) {
    this.id = realm.registerNode(this);

    let $propertyName: $Identifier | $Undefined;
    if (node.propertyName === void 0) {
      $propertyName = this.$propertyName = new $Undefined(realm, void 0, void 0, this);
    } else {
      $propertyName = this.$propertyName = new $Identifier(node.propertyName, this, ctx);
    }
    const $name = this.$name = $identifier(node.name, this, ctx);

    const BoundNames = this.BoundNames = this.$name.BoundNames;

    const moduleSpecifier = parent.moduleSpecifier;

    if ($propertyName.isUndefined) {
      const [localName] = BoundNames;
      this.ImportEntriesForModule = [
        new ImportEntryRecord(
          /* source */this,
          /* ModuleRequest */moduleSpecifier,
          /* ImportName */localName,
          /* LocalName */localName,
        ),
      ];
    } else {
      const importName = $propertyName.StringValue;
      const localName = $name.StringValue;
      this.ImportEntriesForModule = [
        new ImportEntryRecord(
          /* source */this,
          /* ModuleRequest */moduleSpecifier,
          /* ImportName */importName,
          /* LocalName */localName,
        ),
      ];
    }
  }
}

export class $NamespaceImport implements I$Node {
  public readonly $kind = SyntaxKind.NamespaceImport;
  public readonly id: number;

  public readonly $name: $Identifier;

  // http://www.ecma-international.org/ecma-262/#sec-imports-static-semantics-boundnames
  public readonly BoundNames: readonly $String[];
  // http://www.ecma-international.org/ecma-262/#sec-static-semantics-importentriesformodule
  public readonly ImportEntriesForModule: readonly [ImportEntryRecord];

  public constructor(
    public readonly node: NamespaceImport,
    public readonly parent: $ImportClause,
    public readonly ctx: Context,
    public readonly sourceFile: $SourceFile = parent.sourceFile,
    public readonly realm: Realm = parent.realm,
    public readonly depth: number = parent.depth + 1,
    public readonly logger: ILogger = parent.logger.scopeTo('NamespaceImport'),
  ) {
    this.id = realm.registerNode(this);
    const intrinsics = realm['[[Intrinsics]]'];

    const $name = this.$name = new $Identifier(node.name, this, ctx);

    this.BoundNames = $name.BoundNames;

    const moduleSpecifier = parent.moduleSpecifier;

    const localName = $name.StringValue;
    this.ImportEntriesForModule = [
      new ImportEntryRecord(
        /* source */this,
        /* ModuleRequest */moduleSpecifier,
        /* ImportName */intrinsics['*'],
        /* LocalName */localName,
      ),
    ];
  }
}

/**
 * | Export Statement Form           | EN           | MR            | IN         | LN            |
 * |:--------------------------------|:-------------|:--------------|:-----------|:--------------|
 * | `export var v;`                 | `"v"`        | `null`        | `null`     | `"v"`         |
 * | `export default function f(){}` | `"default"`  | `null`        | `null`     | `"f"`         |
 * | `export default function(){}`   | `"default"`  | `null`        | `null`     | `"*default*"` |
 * | `export default 42;`            | `"default"`  | `null`        | `null`     | `"*default*"` |
 * | `export {x};`                   | `"x"`        | `null`        | `null`     | `"x"`         |
 * | `export {v as x};`              | `"x"`        | `null`        | `null`     | `"v"`         |
 * | `export {x} from "mod";`        | `"x"`        | `"mod"`       | `"x"`      | `null`        |
 * | `export {v as x} from "mod";`   | `"x"`        | `"mod"`       | `"v"`      | `null`        |
 * | `export * from "mod";`          | `null`       | `"mod"`       | `"*"`      | `null`        |
 */
export class ExportEntryRecord {
  public constructor(
    public readonly source: $FunctionDeclaration | $ClassDeclaration | $VariableStatement | $ExportDeclaration | $ExportSpecifier | $SourceFile | $TypeAliasDeclaration | $InterfaceDeclaration | $EnumDeclaration,
    public readonly ExportName: $String | $Null,
    public readonly ModuleRequest: $String | $Null,
    public readonly ImportName: $String | $Null,
    public readonly LocalName: $String | $Null,
  ) { }
}

export class $ExportAssignment implements I$Node {
  public readonly $kind = SyntaxKind.ExportAssignment;
  public readonly id: number;

  public readonly modifierFlags: ModifierFlags;

  public readonly $expression: $$AssignmentExpressionOrHigher;

  public readonly BoundNames: readonly [$String<'*default*'>];

  public constructor(
    public readonly node: ExportAssignment,
    public readonly parent: $SourceFile,
    public readonly ctx: Context,
    public readonly sourceFile: $SourceFile = parent.sourceFile,
    public readonly realm: Realm = parent.realm,
    public readonly depth: number = parent.depth + 1,
    public readonly logger: ILogger = parent.logger.scopeTo('ExportAssignment'),
  ) {
    this.id = realm.registerNode(this);
    const intrinsics = realm['[[Intrinsics]]'];

    this.modifierFlags = modifiersToModifierFlags(node.modifiers);

    this.$expression = $assignmentExpression(node.expression as $AssignmentExpressionNode, this, ctx);

    this.BoundNames = [intrinsics['*default*']];
  }
}

export class $ExportDeclaration implements I$Node {
  public readonly $kind = SyntaxKind.ExportDeclaration;
  public readonly id: number;

  public readonly modifierFlags: ModifierFlags;

  public readonly $exportClause: $NamedExports | undefined;
  public readonly $moduleSpecifier: $StringLiteral | undefined;

  public readonly moduleSpecifier: $String | $Null;

  // http://www.ecma-international.org/ecma-262/#sec-exports-static-semantics-boundnames
  public readonly BoundNames: readonly $String[] = emptyArray;
  // http://www.ecma-international.org/ecma-262/#sec-exports-static-semantics-exportedbindings
  public readonly ExportedBindings: readonly $String[] = emptyArray;
  // http://www.ecma-international.org/ecma-262/#sec-exports-static-semantics-exportednames
  public readonly ExportedNames: readonly $String[];
  // http://www.ecma-international.org/ecma-262/#sec-exports-static-semantics-exportentries
  public readonly ExportEntries: readonly ExportEntryRecord[];
  // http://www.ecma-international.org/ecma-262/#sec-exports-static-semantics-isconstantdeclaration
  public readonly IsConstantDeclaration: false = false;
  // http://www.ecma-international.org/ecma-262/#sec-exports-static-semantics-lexicallyscopeddeclarations
  public readonly LexicallyScopedDeclarations: readonly $$ESDeclaration[] = emptyArray;
  // http://www.ecma-international.org/ecma-262/#sec-exports-static-semantics-modulerequests
  public readonly ModuleRequests: readonly $String[];

  public readonly TypeDeclarations: readonly $$TSDeclaration[] = emptyArray;
  public readonly IsType: false = false;

  public constructor(
    public readonly node: ExportDeclaration,
    public readonly parent: $SourceFile | $ModuleBlock,
    public readonly ctx: Context,
    public readonly sourceFile: $SourceFile = parent.sourceFile,
    public readonly realm: Realm = parent.realm,
    public readonly depth: number = parent.depth + 1,
    public readonly logger: ILogger = parent.logger.scopeTo('ExportDeclaration'),
  ) {
    this.id = realm.registerNode(this);
    const intrinsics = realm['[[Intrinsics]]'];

    this.modifierFlags = modifiersToModifierFlags(node.modifiers);

    let moduleSpecifier: $String | $Null;
    if (node.moduleSpecifier === void 0) {
      this.$moduleSpecifier = void 0;
      moduleSpecifier = this.moduleSpecifier = intrinsics.null;

      this.ModuleRequests = emptyArray;
    } else {
      const $moduleSpecifier = this.$moduleSpecifier = new $StringLiteral(node.moduleSpecifier as StringLiteral, this, ctx);
      moduleSpecifier = this.moduleSpecifier = $moduleSpecifier!.StringValue;

      this.ModuleRequests = [moduleSpecifier];
    }

    if (node.exportClause === void 0) {
      this.$exportClause = void 0;

      this.ExportedNames = emptyArray;
      this.ExportEntries = [
        new ExportEntryRecord(
          /* source */this,
          /* ExportName */intrinsics.null,
          /* ModuleRequest */moduleSpecifier,
          /* ImportName */intrinsics['*'],
          /* LocalName */intrinsics.null,
        ),
      ];
    } else {
      const $exportClause = this.$exportClause = new $NamedExports(node.exportClause, this, ctx);

      this.ExportedNames = $exportClause.ExportedNames;
      this.ExportEntries = $exportClause.ExportEntriesForModule;
    }
  }
}

export class $NamedExports implements I$Node {
  public readonly $kind = SyntaxKind.NamedExports;
  public readonly id: number;

  public readonly $elements: readonly $ExportSpecifier[];

  public readonly moduleSpecifier: $String | $Null;

  // http://www.ecma-international.org/ecma-262/#sec-exports-static-semantics-exportednames
  public readonly ExportedNames: readonly $String[];
  // http://www.ecma-international.org/ecma-262/#sec-static-semantics-exportentriesformodule
  public readonly ExportEntriesForModule: readonly ExportEntryRecord[];
  // http://www.ecma-international.org/ecma-262/#sec-static-semantics-referencedbindings
  public readonly ReferencedBindings: readonly $String[];

  public constructor(
    public readonly node: NamedExports,
    public readonly parent: $ExportDeclaration,
    public readonly ctx: Context,
    public readonly sourceFile: $SourceFile = parent.sourceFile,
    public readonly realm: Realm = parent.realm,
    public readonly depth: number = parent.depth + 1,
    public readonly logger: ILogger = parent.logger.scopeTo('NamedExports'),
  ) {
    this.id = realm.registerNode(this);

    this.moduleSpecifier = parent.moduleSpecifier;

    const $elements = this.$elements = node.elements.map(x => new $ExportSpecifier(x, this, ctx));

    this.ExportedNames = $elements.flatMap(getExportedNames);
    this.ExportEntriesForModule = $elements.flatMap(getExportEntriesForModule);
    this.ReferencedBindings = $elements.flatMap(getReferencedBindings);
  }
}

export class $ExportSpecifier implements I$Node {
  public readonly $kind = SyntaxKind.ExportSpecifier;
  public readonly id: number;

  public readonly $propertyName: $Identifier | $Undefined;
  public readonly $name: $Identifier;

  // http://www.ecma-international.org/ecma-262/#sec-exports-static-semantics-exportednames
  public readonly ExportedNames: readonly [$String];
  // http://www.ecma-international.org/ecma-262/#sec-static-semantics-exportentriesformodule
  public readonly ExportEntriesForModule: readonly [ExportEntryRecord];
  // http://www.ecma-international.org/ecma-262/#sec-static-semantics-referencedbindings
  public readonly ReferencedBindings: readonly [$String];

  public constructor(
    public readonly node: ExportSpecifier,
    public readonly parent: $NamedExports,
    public readonly ctx: Context,
    public readonly sourceFile: $SourceFile = parent.sourceFile,
    public readonly realm: Realm = parent.realm,
    public readonly depth: number = parent.depth + 1,
    public readonly logger: ILogger = parent.logger.scopeTo('ExportSpecifier'),
  ) {
    this.id = realm.registerNode(this);
    const intrinsics = realm['[[Intrinsics]]'];

    let $propertyName: $Identifier | $Undefined;
    if (node.propertyName === void 0) {
      $propertyName = this.$propertyName = new $Undefined(realm, void 0, void 0, this);
    } else {
      $propertyName = this.$propertyName = new $Identifier(node.propertyName, this, ctx);
    }
    const $name = this.$name = new $Identifier(node.name, this, ctx);

    const moduleSpecifier = parent.moduleSpecifier;

    if ($propertyName.isUndefined) {
      const sourceName = $name.StringValue;

      this.ReferencedBindings = [sourceName];
      this.ExportedNames = [sourceName];

      if (moduleSpecifier.isNull) {
        this.ExportEntriesForModule = [
          new ExportEntryRecord(
            /* source */this,
            /* ExportName */sourceName,
            /* ModuleRequest */moduleSpecifier,
            /* ImportName */intrinsics.null,
            /* LocalName */sourceName,
          ),
        ];
      } else {
        this.ExportEntriesForModule = [
          new ExportEntryRecord(
            /* source */this,
            /* ExportName */sourceName,
            /* ModuleRequest */moduleSpecifier,
            /* ImportName */sourceName,
            /* LocalName */intrinsics.null,
          ),
        ];
      }
    } else {
      const exportName = $name.StringValue;
      const sourceName = $propertyName.StringValue;
      this.ReferencedBindings = [sourceName];

      this.ExportedNames = [exportName];

      if (moduleSpecifier.isNull) {
        this.ExportEntriesForModule = [
          new ExportEntryRecord(
            /* source */this,
            /* ExportName */exportName,
            /* ModuleRequest */moduleSpecifier,
            /* ImportName */intrinsics.null,
            /* LocalName */sourceName,
          ),
        ];
      } else {
        this.ExportEntriesForModule = [
          new ExportEntryRecord(
            /* source */this,
            /* ExportName */exportName,
            /* ModuleRequest */moduleSpecifier,
            /* ImportName */sourceName,
            /* LocalName */intrinsics.null,
          ),
        ];
      }
    }
  }
}

export class $NamespaceExportDeclaration implements I$Node {
  public readonly $kind = SyntaxKind.NamespaceExportDeclaration;
  public readonly id: number;

  public readonly modifierFlags: ModifierFlags;

  public readonly $name: $Identifier;

  public constructor(
    public readonly node: NamespaceExportDeclaration,
    public readonly parent: $$ModuleDeclarationParent,
    public readonly ctx: Context,
    public readonly sourceFile: $SourceFile = parent.sourceFile,
    public readonly realm: Realm = parent.realm,
    public readonly depth: number = parent.depth + 1,
    public readonly logger: ILogger = parent.logger.scopeTo('NamespaceExportDeclaration'),
  ) {
    this.id = realm.registerNode(this);

    this.modifierFlags = modifiersToModifierFlags(node.modifiers);

    this.$name = $identifier(node.name, this, ctx);
  }
}

export class $ModuleBlock implements I$Node {
  public readonly $kind = SyntaxKind.ModuleBlock;
  public readonly id: number;

  // TODO: ModuleBlock shares a lot in common with SourceFile, so we implement this last to try to maximize code reuse / reduce refactoring overhead and/or see if the two can be consolidated.
  public readonly $statements: readonly $$TSModuleItem[] = emptyArray;

  public constructor(
    public readonly node: ModuleBlock,
    public readonly parent: $ModuleDeclaration,
    public readonly ctx: Context,
    public readonly sourceFile: $SourceFile = parent.sourceFile,
    public readonly realm: Realm = parent.realm,
    public readonly depth: number = parent.depth + 1,
    public readonly logger: ILogger = parent.logger.scopeTo('ModuleBlock'),
  ) {
    this.id = realm.registerNode(this);
  }
}

export class $ExternalModuleReference implements I$Node {
  public readonly $kind = SyntaxKind.ExternalModuleReference;
  public readonly id: number;

  public readonly $expression: $StringLiteral;

  public constructor(
    public readonly node: ExternalModuleReference,
    public readonly parent: $ImportEqualsDeclaration,
    public readonly ctx: Context,
    public readonly sourceFile: $SourceFile = parent.sourceFile,
    public readonly realm: Realm = parent.realm,
    public readonly depth: number = parent.depth + 1,
    public readonly logger: ILogger = parent.logger.scopeTo('ExternalModuleReference'),
  ) {
    this.id = realm.registerNode(this);

    this.$expression = new $StringLiteral(node.expression as StringLiteral, this, ctx);
  }
}

export type $$NodeWithQualifiedName = (
  $ImportEqualsDeclaration |
  $QualifiedName
);

export type $$EntityName = (
  $Identifier |
  $QualifiedName
);

export class $QualifiedName implements I$Node {
  public readonly $kind = SyntaxKind.QualifiedName;
  public readonly id: number;

  public readonly $left: $$EntityName;
  public readonly $right: $Identifier;

  public constructor(
    public readonly node: QualifiedName,
    public readonly parent: $$NodeWithQualifiedName,
    public readonly ctx: Context,
    public readonly sourceFile: $SourceFile = parent.sourceFile,
    public readonly realm: Realm = parent.realm,
    public readonly depth: number = parent.depth + 1,
    public readonly logger: ILogger = parent.logger.scopeTo('QualifiedName'),
  ) {
    this.id = realm.registerNode(this);

    if (node.left.kind === SyntaxKind.Identifier) {
      this.$left = new $Identifier(node.left, this, ctx);
    } else {
      this.$left = new $QualifiedName(node.left, this, ctx);
    }

    this.$right = new $Identifier(node.right, this, ctx);
  }
}