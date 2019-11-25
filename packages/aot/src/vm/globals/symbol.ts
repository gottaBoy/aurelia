import {
  $BuiltinFunction,
  $Function,
} from '../types/function';
import {
  Realm,
  ExecutionContext,
} from '../realm';
import {
  $AnyNonEmpty,
  CompletionType,
} from '../types/_shared';
import {
  $Error,
  $TypeError,
} from '../types/error';
import {
  $Symbol,
} from '../types/symbol';
import {
  $Undefined,
} from '../types/undefined';
import {
  $FunctionPrototype,
} from './function';
import {
  $Object,
} from '../types/object';
import {
  $ObjectPrototype,
} from './object';

// http://www.ecma-international.org/ecma-262/#sec-symbol-constructor
export class $SymbolConstructor extends $BuiltinFunction<'%Symbol%'> {
  public get $prototype(): $SymbolPrototype {
    return this.getProperty(this.realm['[[Intrinsics]]'].$prototype)['[[Value]]'] as $SymbolPrototype;
  }
  public set $prototype(value: $SymbolPrototype) {
    this.setDataProperty(this.realm['[[Intrinsics]]'].$prototype, value, false, false, false);
  }

  public constructor(
    realm: Realm,
    functionPrototype: $FunctionPrototype,
  ) {
    super(realm, '%Symbol%', functionPrototype);
  }

  // http://www.ecma-international.org/ecma-262/#sec-symbol-description
  // 19.4.1.1 Symbol ( [ description ] )
  public performSteps(
    ctx: ExecutionContext,
    thisArgument: $AnyNonEmpty,
    [description]: readonly $AnyNonEmpty[],
    NewTarget: $Function | $Undefined,
  ): $AnyNonEmpty | $Error {
    const realm = ctx.Realm;
    const intrinsics = realm['[[Intrinsics]]'];

    // 1. If NewTarget is not undefined, throw a TypeError exception.
    if (!NewTarget.isUndefined) {
      return new $TypeError(realm);
    }

    // 2. If description is undefined, let descString be undefined.
    if (description.isUndefined) {
      // 4. Return a new unique Symbol value whose [[Description]] value is descString.
      return new $Symbol(realm, new $Undefined(realm));
    }
    // 3. Else, let descString be ? ToString(description).
    else {
      const descString = description.ToString(ctx);
      if (descString.isAbrupt) { return descString; }

      // 4. Return a new unique Symbol value whose [[Description]] value is descString.
      return new $Symbol(realm, descString);
    }
  }
}

// http://www.ecma-international.org/ecma-262/#sec-properties-of-the-symbol-prototype-object
export class $SymbolPrototype extends $Object<'%SymbolPrototype%'> {
  public get $constructor(): $SymbolConstructor {
    return this.getProperty(this.realm['[[Intrinsics]]'].$constructor)['[[Value]]'] as $SymbolConstructor;
  }
  public set $constructor(value: $SymbolConstructor) {
    this.setDataProperty(this.realm['[[Intrinsics]]'].$constructor, value);
  }

  public constructor(
    realm: Realm,
    objectPrototype: $ObjectPrototype,
  ) {
    const intrinsics = realm['[[Intrinsics]]'];
    super(realm, '%SymbolPrototype%', objectPrototype, CompletionType.normal, intrinsics.empty);
  }
}