var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// .wrangler/tmp/bundle-7KM2z3/checked-fetch.js
function checkURL(request, init2) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init2) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
var urls;
var init_checked_fetch = __esm({
  ".wrangler/tmp/bundle-7KM2z3/checked-fetch.js"() {
    urls = /* @__PURE__ */ new Set();
    __name(checkURL, "checkURL");
    globalThis.fetch = new Proxy(globalThis.fetch, {
      apply(target, thisArg, argArray) {
        const [request, init2] = argArray;
        checkURL(request, init2);
        return Reflect.apply(target, thisArg, argArray);
      }
    });
  }
});

// .wrangler/tmp/bundle-7KM2z3/strip-cf-connecting-ip-header.js
function stripCfConnectingIPHeader(input, init2) {
  const request = new Request(input, init2);
  request.headers.delete("CF-Connecting-IP");
  return request;
}
var init_strip_cf_connecting_ip_header = __esm({
  ".wrangler/tmp/bundle-7KM2z3/strip-cf-connecting-ip-header.js"() {
    __name(stripCfConnectingIPHeader, "stripCfConnectingIPHeader");
    globalThis.fetch = new Proxy(globalThis.fetch, {
      apply(target, thisArg, argArray) {
        return Reflect.apply(target, thisArg, [
          stripCfConnectingIPHeader.apply(null, argArray)
        ]);
      }
    });
  }
});

// wrangler-modules-watch:wrangler:modules-watch
var init_wrangler_modules_watch = __esm({
  "wrangler-modules-watch:wrangler:modules-watch"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
  }
});

// node_modules/wrangler/templates/modules-watch-stub.js
var init_modules_watch_stub = __esm({
  "node_modules/wrangler/templates/modules-watch-stub.js"() {
    init_wrangler_modules_watch();
  }
});

// node_modules/@sentry/core/build/esm/debug-build.js
var DEBUG_BUILD;
var init_debug_build = __esm({
  "node_modules/@sentry/core/build/esm/debug-build.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    DEBUG_BUILD = typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__;
  }
});

// node_modules/@sentry/core/build/esm/utils/worldwide.js
var GLOBAL_OBJ;
var init_worldwide = __esm({
  "node_modules/@sentry/core/build/esm/utils/worldwide.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    GLOBAL_OBJ = globalThis;
  }
});

// node_modules/@sentry/core/build/esm/utils/version.js
var SDK_VERSION;
var init_version = __esm({
  "node_modules/@sentry/core/build/esm/utils/version.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    SDK_VERSION = "10.67.0";
  }
});

// node_modules/@sentry/core/build/esm/carrier.js
function getMainCarrier() {
  getSentryCarrier(GLOBAL_OBJ);
  return GLOBAL_OBJ;
}
function getSentryCarrier(carrier) {
  const __SENTRY__ = carrier.__SENTRY__ = carrier.__SENTRY__ || {};
  __SENTRY__.version = __SENTRY__.version || SDK_VERSION;
  return __SENTRY__[SDK_VERSION] = __SENTRY__[SDK_VERSION] || {};
}
function getGlobalSingleton(name, creator, obj = GLOBAL_OBJ) {
  const __SENTRY__ = obj.__SENTRY__ = obj.__SENTRY__ || {};
  const carrier = __SENTRY__[SDK_VERSION] = __SENTRY__[SDK_VERSION] || {};
  return carrier[name] || (carrier[name] = creator());
}
var init_carrier = __esm({
  "node_modules/@sentry/core/build/esm/carrier.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_version();
    init_worldwide();
    __name(getMainCarrier, "getMainCarrier");
    __name(getSentryCarrier, "getSentryCarrier");
    __name(getGlobalSingleton, "getGlobalSingleton");
  }
});

// node_modules/@sentry/core/build/esm/utils/debug-logger.js
function consoleSandbox(callback) {
  if (!("console" in GLOBAL_OBJ)) {
    return callback();
  }
  const console2 = GLOBAL_OBJ.console;
  const wrappedFuncs = {};
  const wrappedLevels = Object.keys(originalConsoleMethods);
  wrappedLevels.forEach((level) => {
    const originalConsoleMethod = originalConsoleMethods[level];
    wrappedFuncs[level] = console2[level];
    console2[level] = originalConsoleMethod;
  });
  try {
    return callback();
  } finally {
    wrappedLevels.forEach((level) => {
      console2[level] = wrappedFuncs[level];
    });
  }
}
function enable() {
  _getLoggerSettings().enabled = true;
}
function disable() {
  _getLoggerSettings().enabled = false;
}
function isEnabled() {
  return _getLoggerSettings().enabled;
}
function log(...args) {
  _maybeLog("log", ...args);
}
function warn(...args) {
  _maybeLog("warn", ...args);
}
function error(...args) {
  _maybeLog("error", ...args);
}
function _maybeLog(level, ...args) {
  if (!DEBUG_BUILD) {
    return;
  }
  if (isEnabled()) {
    consoleSandbox(() => {
      GLOBAL_OBJ.console[level](`${PREFIX}[${level}]:`, ...args);
    });
  }
}
function _getLoggerSettings() {
  if (!DEBUG_BUILD) {
    return { enabled: false };
  }
  return getGlobalSingleton("loggerSettings", () => ({ enabled: false }));
}
var CONSOLE_LEVELS, PREFIX, originalConsoleMethods, debug;
var init_debug_logger = __esm({
  "node_modules/@sentry/core/build/esm/utils/debug-logger.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_carrier();
    init_debug_build();
    init_worldwide();
    CONSOLE_LEVELS = [
      "debug",
      "info",
      "warn",
      "error",
      "log",
      "assert",
      "trace"
    ];
    PREFIX = "Sentry Logger ";
    originalConsoleMethods = {};
    __name(consoleSandbox, "consoleSandbox");
    __name(enable, "enable");
    __name(disable, "disable");
    __name(isEnabled, "isEnabled");
    __name(log, "log");
    __name(warn, "warn");
    __name(error, "error");
    __name(_maybeLog, "_maybeLog");
    __name(_getLoggerSettings, "_getLoggerSettings");
    debug = {
      /** Enable logging. */
      enable,
      /** Disable logging. */
      disable,
      /** Check if logging is enabled. */
      isEnabled,
      /** Log a message. */
      log,
      /** Log a warning. */
      warn,
      /** Log an error. */
      error
    };
  }
});

// node_modules/@sentry/core/build/esm/utils/stacktrace.js
function createStackParser(...parsers) {
  const sortedParsers = parsers.sort((a, b) => a[0] - b[0]).map((p) => p[1]);
  return (stack, skipFirstLines = 0, framesToPop = 0) => {
    const frames = [];
    const lines = stack.split("\n");
    for (let i = skipFirstLines; i < lines.length; i++) {
      let line = lines[i];
      if (line.length > 1024) {
        line = line.slice(0, 1024);
      }
      const cleanedLine = WEBPACK_ERROR_REGEXP.test(line) ? line.replace(WEBPACK_ERROR_REGEXP, "$1") : line;
      if (cleanedLine.includes("Error: ")) {
        continue;
      }
      for (const parser of sortedParsers) {
        const frame = parser(cleanedLine);
        if (frame) {
          frames.push(frame);
          break;
        }
      }
      if (frames.length >= STACKTRACE_FRAME_LIMIT + framesToPop) {
        break;
      }
    }
    return stripSentryFramesAndReverse(frames.slice(framesToPop));
  };
}
function stackParserFromStackParserOptions(stackParser) {
  if (Array.isArray(stackParser)) {
    return createStackParser(...stackParser);
  }
  return stackParser;
}
function stripSentryFramesAndReverse(stack) {
  if (!stack.length) {
    return [];
  }
  const localStack = Array.from(stack);
  if (/sentryWrapped/.test(getLastStackFrame(localStack).function || "")) {
    localStack.pop();
  }
  localStack.reverse();
  if (STRIP_FRAME_REGEXP.test(getLastStackFrame(localStack).function || "")) {
    localStack.pop();
    if (STRIP_FRAME_REGEXP.test(getLastStackFrame(localStack).function || "")) {
      localStack.pop();
    }
  }
  return localStack.slice(0, STACKTRACE_FRAME_LIMIT).map((frame) => ({
    ...frame,
    filename: frame.filename || getLastStackFrame(localStack).filename,
    function: frame.function || UNKNOWN_FUNCTION
  }));
}
function getLastStackFrame(arr) {
  return arr[arr.length - 1] || {};
}
function getFunctionName(fn) {
  try {
    if (!fn || typeof fn !== "function") {
      return defaultFunctionName;
    }
    return fn.name || defaultFunctionName;
  } catch {
    return defaultFunctionName;
  }
}
function getFramesFromEvent(event) {
  const exception = event.exception;
  if (exception) {
    const frames = [];
    try {
      exception.values.forEach((value) => {
        if (value.stacktrace.frames) {
          frames.push(...value.stacktrace.frames);
        }
      });
      return frames;
    } catch {
      return void 0;
    }
  }
  return void 0;
}
function normalizeStackTracePath(path) {
  let filename = path?.startsWith("file://") ? path.slice(7) : path;
  if (filename?.match(/\/[A-Z]:/)) {
    filename = filename.slice(1);
  }
  return filename;
}
var STACKTRACE_FRAME_LIMIT, UNKNOWN_FUNCTION, WEBPACK_ERROR_REGEXP, STRIP_FRAME_REGEXP, defaultFunctionName;
var init_stacktrace = __esm({
  "node_modules/@sentry/core/build/esm/utils/stacktrace.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    STACKTRACE_FRAME_LIMIT = 50;
    UNKNOWN_FUNCTION = "?";
    WEBPACK_ERROR_REGEXP = /\(error: (.*)\)/;
    STRIP_FRAME_REGEXP = /captureMessage|captureException/;
    __name(createStackParser, "createStackParser");
    __name(stackParserFromStackParserOptions, "stackParserFromStackParserOptions");
    __name(stripSentryFramesAndReverse, "stripSentryFramesAndReverse");
    __name(getLastStackFrame, "getLastStackFrame");
    defaultFunctionName = "<anonymous>";
    __name(getFunctionName, "getFunctionName");
    __name(getFramesFromEvent, "getFramesFromEvent");
    __name(normalizeStackTracePath, "normalizeStackTracePath");
  }
});

// node_modules/@sentry/core/build/esm/instrument/handlers.js
function addHandler(type, handler) {
  handlers[type] = handlers[type] || [];
  handlers[type].push(handler);
  return () => {
    const typeHandlers = handlers[type];
    if (typeHandlers) {
      const index = typeHandlers.indexOf(handler);
      if (index !== -1) {
        typeHandlers.splice(index, 1);
      }
    }
  };
}
function maybeInstrument(type, instrumentFn) {
  if (!instrumented[type]) {
    instrumented[type] = true;
    try {
      instrumentFn();
    } catch (e) {
      DEBUG_BUILD && debug.error(`Error while instrumenting ${type}`, e);
    }
  }
}
function triggerHandlers(type, data) {
  const typeHandlers = type && handlers[type];
  if (!typeHandlers) {
    return;
  }
  for (const handler of typeHandlers) {
    try {
      handler(data);
    } catch (e) {
      DEBUG_BUILD && debug.error(
        `Error while triggering instrumentation handler.
Type: ${type}
Name: ${getFunctionName(handler)}
Error:`,
        e
      );
    }
  }
}
var handlers, instrumented;
var init_handlers = __esm({
  "node_modules/@sentry/core/build/esm/instrument/handlers.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_debug_build();
    init_debug_logger();
    init_stacktrace();
    handlers = {};
    instrumented = {};
    __name(addHandler, "addHandler");
    __name(maybeInstrument, "maybeInstrument");
    __name(triggerHandlers, "triggerHandlers");
  }
});

// node_modules/@sentry/core/build/esm/utils/is.js
function isError(wat) {
  switch (objectToString.call(wat)) {
    case "[object Error]":
    case "[object Exception]":
    case "[object DOMException]":
    case "[object WebAssembly.Exception]":
      return true;
    default:
      return isInstanceOf(wat, Error);
  }
}
function isBuiltin(wat, className) {
  return objectToString.call(wat) === `[object ${className}]`;
}
function isErrorEvent(wat) {
  return isBuiltin(wat, "ErrorEvent");
}
function isString(wat) {
  return isBuiltin(wat, "String");
}
function isParameterizedString(wat) {
  return typeof wat === "object" && wat !== null && "__sentry_template_string__" in wat && "__sentry_template_values__" in wat;
}
function isPrimitive(wat) {
  return wat === null || isParameterizedString(wat) || typeof wat !== "object" && typeof wat !== "function";
}
function isPlainObject(wat) {
  return isBuiltin(wat, "Object");
}
function isObjectLike(wat) {
  return typeof wat === "object" && wat !== null;
}
function isEvent(wat) {
  return typeof Event !== "undefined" && isInstanceOf(wat, Event);
}
function isRegExp(wat) {
  return isBuiltin(wat, "RegExp");
}
function isThenable(wat) {
  return Boolean(wat?.then && typeof wat.then === "function");
}
function isInstanceOf(wat, base) {
  try {
    return wat instanceof base;
  } catch {
    return false;
  }
}
function isRequest(request) {
  return typeof Request !== "undefined" && isInstanceOf(request, Request);
}
var objectToString;
var init_is = __esm({
  "node_modules/@sentry/core/build/esm/utils/is.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    objectToString = Object.prototype.toString;
    __name(isError, "isError");
    __name(isBuiltin, "isBuiltin");
    __name(isErrorEvent, "isErrorEvent");
    __name(isString, "isString");
    __name(isParameterizedString, "isParameterizedString");
    __name(isPrimitive, "isPrimitive");
    __name(isPlainObject, "isPlainObject");
    __name(isObjectLike, "isObjectLike");
    __name(isEvent, "isEvent");
    __name(isRegExp, "isRegExp");
    __name(isThenable, "isThenable");
    __name(isInstanceOf, "isInstanceOf");
    __name(isRequest, "isRequest");
  }
});

// node_modules/@sentry/core/build/esm/utils/object.js
function fill(source, name, replacementFactory) {
  if (!(name in source)) {
    return;
  }
  const original = source[name];
  if (typeof original !== "function") {
    return;
  }
  const wrapped = replacementFactory(original);
  if (typeof wrapped === "function") {
    markFunctionWrapped(wrapped, original);
  }
  try {
    source[name] = wrapped;
  } catch {
    DEBUG_BUILD && debug.log(`Failed to replace method "${name}" in object`, source);
  }
}
function addNonEnumerableProperty(obj, name, value) {
  try {
    Object.defineProperty(obj, name, {
      // enumerable: false, // the default, so we can save on bundle size by not explicitly setting it
      value,
      writable: true,
      configurable: true
    });
  } catch {
    DEBUG_BUILD && debug.log(`Failed to add non-enumerable property "${String(name)}" to object`, obj);
  }
}
function markFunctionWrapped(wrapped, original) {
  try {
    const proto = original.prototype || {};
    wrapped.prototype = original.prototype = proto;
    addNonEnumerableProperty(wrapped, "__sentry_original__", original);
  } catch {
  }
}
function getOriginalFunction(func) {
  return func.__sentry_original__;
}
function convertToPlainObject(value) {
  if (isError(value)) {
    return {
      message: value.message,
      name: value.name,
      stack: value.stack,
      ...getOwnProperties(value)
    };
  }
  if (isEvent(value)) {
    const { type, target, currentTarget, detail } = value;
    return {
      type,
      target,
      currentTarget,
      ...detail ? { detail } : {},
      ...getOwnProperties(value)
    };
  }
  return value;
}
function getOwnProperties(obj) {
  if (isObjectLike(obj)) {
    return Object.fromEntries(Object.entries(obj));
  }
  return {};
}
function extractExceptionKeysForMessage(exception) {
  const keys = Object.keys(convertToPlainObject(exception));
  keys.sort();
  return !keys[0] ? "[object has no keys]" : keys.join(", ");
}
var init_object = __esm({
  "node_modules/@sentry/core/build/esm/utils/object.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_debug_build();
    init_debug_logger();
    init_is();
    __name(fill, "fill");
    __name(addNonEnumerableProperty, "addNonEnumerableProperty");
    __name(markFunctionWrapped, "markFunctionWrapped");
    __name(getOriginalFunction, "getOriginalFunction");
    __name(convertToPlainObject, "convertToPlainObject");
    __name(getOwnProperties, "getOwnProperties");
    __name(extractExceptionKeysForMessage, "extractExceptionKeysForMessage");
  }
});

// node_modules/@sentry/core/build/esm/utils/randomSafeContext.js
function withRandomSafeContext(cb) {
  if (RESOLVED_RUNNER !== void 0) {
    return RESOLVED_RUNNER ? RESOLVED_RUNNER(cb) : cb();
  }
  const sym = /* @__PURE__ */ Symbol.for("__SENTRY_SAFE_RANDOM_ID_WRAPPER__");
  const globalWithSymbol = GLOBAL_OBJ;
  if (sym in globalWithSymbol && typeof globalWithSymbol[sym] === "function") {
    RESOLVED_RUNNER = globalWithSymbol[sym];
    return RESOLVED_RUNNER(cb);
  }
  RESOLVED_RUNNER = null;
  return cb();
}
function safeMathRandom() {
  return withRandomSafeContext(() => Math.random());
}
function safeDateNow() {
  return withRandomSafeContext(() => Date.now());
}
var RESOLVED_RUNNER;
var init_randomSafeContext = __esm({
  "node_modules/@sentry/core/build/esm/utils/randomSafeContext.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_worldwide();
    __name(withRandomSafeContext, "withRandomSafeContext");
    __name(safeMathRandom, "safeMathRandom");
    __name(safeDateNow, "safeDateNow");
  }
});

// node_modules/@sentry/core/build/esm/utils/normalizationHints.js
function hasSkipNormalizationHint(value) {
  return Boolean(value[SENTRY_SKIP_NORMALIZATION]);
}
function getNormalizationDepthOverrideHint(value) {
  const v = value[SENTRY_OVERRIDE_NORMALIZATION_DEPTH];
  return typeof v === "number" ? v : void 0;
}
var SENTRY_SKIP_NORMALIZATION, SENTRY_OVERRIDE_NORMALIZATION_DEPTH;
var init_normalizationHints = __esm({
  "node_modules/@sentry/core/build/esm/utils/normalizationHints.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    SENTRY_SKIP_NORMALIZATION = /* @__PURE__ */ Symbol.for("sentry.skipNormalization");
    SENTRY_OVERRIDE_NORMALIZATION_DEPTH = /* @__PURE__ */ Symbol.for("sentry.overrideNormalizationDepth");
    __name(hasSkipNormalizationHint, "hasSkipNormalizationHint");
    __name(getNormalizationDepthOverrideHint, "getNormalizationDepthOverrideHint");
  }
});

// node_modules/@sentry/core/build/esm/utils/normalize.js
function normalize(input, depth = 100, maxProperties = Infinity) {
  try {
    return visit("", input, depth, maxProperties);
  } catch (err) {
    return { ERROR: `**non-serializable** (${err})` };
  }
}
function normalizeToSize(object, depth = 3, maxSize = 100 * 1024) {
  const normalized = normalize(object, depth);
  if (jsonSize(normalized) > maxSize) {
    return normalizeToSize(object, depth - 1, maxSize);
  }
  return normalized;
}
function visit(key, value, depth = Infinity, maxProperties = Infinity, memo = memoBuilder()) {
  const [memoize, unmemoize] = memo;
  if (value == null || // this matches null and undefined -> eqeq not eqeqeq
  ["boolean", "string"].includes(typeof value) || typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  const stringified = stringifyValue(key, value);
  if (!stringified.startsWith("[object ")) {
    return stringified;
  }
  if (hasSkipNormalizationHint(value)) {
    return value;
  }
  const overrideDepth = getNormalizationDepthOverrideHint(value);
  const remainingDepth = overrideDepth !== void 0 ? overrideDepth : depth;
  if (remainingDepth === 0) {
    return stringified.replace("object ", "");
  }
  if (memoize(value)) {
    return "[Circular ~]";
  }
  const valueWithToJSON = value;
  if (valueWithToJSON && typeof valueWithToJSON.toJSON === "function") {
    try {
      const jsonValue = valueWithToJSON.toJSON();
      return visit("", jsonValue, remainingDepth - 1, maxProperties, memo);
    } catch {
    }
  }
  const normalized = Array.isArray(value) ? [] : {};
  let numAdded = 0;
  const visitable = convertToPlainObject(value);
  for (const visitKey in visitable) {
    if (!Object.prototype.hasOwnProperty.call(visitable, visitKey)) {
      continue;
    }
    if (numAdded >= maxProperties) {
      normalized[visitKey] = "[MaxProperties ~]";
      break;
    }
    const visitValue = visitable[visitKey];
    normalized[visitKey] = visit(visitKey, visitValue, remainingDepth - 1, maxProperties, memo);
    numAdded++;
  }
  unmemoize(value);
  return normalized;
}
function stringifyValue(key, value) {
  try {
    if (stringifier) {
      const stringified = stringifier(value);
      if (stringified) {
        return stringified;
      }
    }
    if (typeof global !== "undefined" && value === global) {
      return "[Global]";
    }
    if (typeof value === "number" && !Number.isFinite(value)) {
      return `[${value}]`;
    }
    if (typeof value === "function") {
      return `[Function: ${getFunctionName(value)}]`;
    }
    if (typeof value === "symbol") {
      return `[${String(value)}]`;
    }
    if (typeof value === "bigint") {
      return `[BigInt: ${String(value)}]`;
    }
    const objName = getConstructorName(value);
    return `[object ${objName}]`;
  } catch (err) {
    return `**non-serializable** (${err})`;
  }
}
function getConstructorName(value) {
  const prototype = Object.getPrototypeOf(value);
  return prototype?.constructor ? prototype.constructor.name : "null prototype";
}
function utf8Length(value) {
  return ~-encodeURI(value).split(/%..|./).length;
}
function jsonSize(value) {
  return utf8Length(JSON.stringify(value));
}
function memoBuilder() {
  const inner = /* @__PURE__ */ new WeakSet();
  function memoize(obj) {
    if (inner.has(obj)) {
      return true;
    }
    inner.add(obj);
    return false;
  }
  __name(memoize, "memoize");
  function unmemoize(obj) {
    inner.delete(obj);
  }
  __name(unmemoize, "unmemoize");
  return [memoize, unmemoize];
}
var stringifier;
var init_normalize = __esm({
  "node_modules/@sentry/core/build/esm/utils/normalize.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_normalizationHints();
    init_object();
    init_stacktrace();
    __name(normalize, "normalize");
    __name(normalizeToSize, "normalizeToSize");
    __name(visit, "visit");
    __name(stringifyValue, "stringifyValue");
    __name(getConstructorName, "getConstructorName");
    __name(utf8Length, "utf8Length");
    __name(jsonSize, "jsonSize");
    __name(memoBuilder, "memoBuilder");
  }
});

// node_modules/@sentry/core/build/esm/utils/string.js
function stringify(value, fallback = "[unserializable]") {
  if (typeof value === "string") {
    return value;
  }
  try {
    return JSON.stringify(value);
  } catch {
    return typeof fallback === "function" ? fallback(value) : fallback;
  }
}
function truncate(str, max = 0) {
  if (typeof str !== "string" || max === 0) {
    return str;
  }
  return str.length <= max ? str : `${str.slice(0, max)}...`;
}
function safeJoin(input, delimiter) {
  if (!Array.isArray(input)) {
    return "";
  }
  const output = [];
  for (let i = 0; i < input.length; i++) {
    const value = input[i];
    if (isPrimitive(value)) {
      output.push(String(value));
    } else if (value instanceof Error) {
      output.push(value.message ? `${value.name}: ${value.message}` : value.name);
    } else {
      output.push(stringifyValue(void 0, value));
    }
  }
  return output.join(delimiter);
}
function isMatchingPattern(value, pattern, requireExactStringMatch = false) {
  if (!isString(value)) {
    return false;
  }
  if (isRegExp(pattern)) {
    return pattern.test(value);
  }
  if (isString(pattern)) {
    return requireExactStringMatch ? value === pattern : value.includes(pattern);
  }
  if (typeof pattern === "function") {
    return pattern(value);
  }
  return false;
}
function stringMatchesSomePattern(testString, patterns = [], requireExactStringMatch = false) {
  for (const pattern of patterns) {
    if (isMatchingPattern(testString, pattern, requireExactStringMatch)) {
      return true;
    }
  }
  return false;
}
var init_string = __esm({
  "node_modules/@sentry/core/build/esm/utils/string.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_is();
    init_normalize();
    __name(stringify, "stringify");
    __name(truncate, "truncate");
    __name(safeJoin, "safeJoin");
    __name(isMatchingPattern, "isMatchingPattern");
    __name(stringMatchesSomePattern, "stringMatchesSomePattern");
  }
});

// node_modules/@sentry/core/build/esm/utils/misc.js
function getCrypto() {
  const gbl = GLOBAL_OBJ;
  return gbl.crypto || gbl.msCrypto;
}
function getRandomByte() {
  return safeMathRandom() * 16;
}
function uuid4(crypto2 = getCrypto()) {
  try {
    if (crypto2?.randomUUID) {
      return withRandomSafeContext(() => crypto2.randomUUID()).replace(/-/g, "");
    }
  } catch {
  }
  if (!emptyUuid) {
    emptyUuid = "10000000100040008000" + 1e11;
  }
  return emptyUuid.replace(
    /[018]/g,
    (c) => (
      // eslint-disable-next-line no-bitwise
      (c ^ (getRandomByte() & 15) >> c / 4).toString(16)
    )
  );
}
function getFirstException(event) {
  return event.exception?.values?.[0];
}
function getEventDescription(event) {
  const { message, event_id: eventId } = event;
  if (message) {
    return message;
  }
  const firstException = getFirstException(event);
  if (firstException) {
    if (firstException.type && firstException.value) {
      return `${firstException.type}: ${firstException.value}`;
    }
    return firstException.type || firstException.value || eventId || "<unknown>";
  }
  return eventId || "<unknown>";
}
function addExceptionTypeValue(event, value, type) {
  const exception = event.exception = event.exception || {};
  const values = exception.values = exception.values || [];
  const firstException = values[0] = values[0] || {};
  if (!firstException.value) {
    firstException.value = value || "";
  }
  if (!firstException.type) {
    firstException.type = type || "Error";
  }
}
function addExceptionMechanism(event, newMechanism) {
  const firstException = getFirstException(event);
  if (!firstException) {
    return;
  }
  const defaultMechanism = { type: "generic", handled: true };
  const currentMechanism = firstException.mechanism;
  firstException.mechanism = { ...defaultMechanism, ...currentMechanism, ...newMechanism };
  if (newMechanism && "data" in newMechanism) {
    const mergedData = { ...currentMechanism?.data, ...newMechanism.data };
    firstException.mechanism.data = mergedData;
  }
}
function checkOrSetAlreadyCaught(exception) {
  if (isAlreadyCaptured(exception)) {
    return true;
  }
  try {
    addNonEnumerableProperty(exception, "__sentry_captured__", true);
  } catch {
  }
  return false;
}
function isAlreadyCaptured(exception) {
  try {
    return exception.__sentry_captured__;
  } catch {
  }
}
var emptyUuid;
var init_misc = __esm({
  "node_modules/@sentry/core/build/esm/utils/misc.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_object();
    init_randomSafeContext();
    init_worldwide();
    __name(getCrypto, "getCrypto");
    __name(getRandomByte, "getRandomByte");
    __name(uuid4, "uuid4");
    __name(getFirstException, "getFirstException");
    __name(getEventDescription, "getEventDescription");
    __name(addExceptionTypeValue, "addExceptionTypeValue");
    __name(addExceptionMechanism, "addExceptionMechanism");
    __name(checkOrSetAlreadyCaught, "checkOrSetAlreadyCaught");
    __name(isAlreadyCaptured, "isAlreadyCaptured");
  }
});

// node_modules/@sentry/core/build/esm/utils/time.js
function dateTimestampInSeconds() {
  return safeDateNow() / ONE_SECOND_IN_MS;
}
function createUnixTimestampInSecondsFunc() {
  const { performance } = GLOBAL_OBJ;
  if (!performance?.now || !performance.timeOrigin) {
    return dateTimestampInSeconds;
  }
  const timeOrigin = performance.timeOrigin;
  return () => {
    return (timeOrigin + withRandomSafeContext(() => performance.now())) / ONE_SECOND_IN_MS;
  };
}
function timestampInSeconds() {
  const func = _cachedTimestampInSeconds ?? (_cachedTimestampInSeconds = createUnixTimestampInSecondsFunc());
  return func();
}
var ONE_SECOND_IN_MS, _cachedTimestampInSeconds;
var init_time = __esm({
  "node_modules/@sentry/core/build/esm/utils/time.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_randomSafeContext();
    init_worldwide();
    ONE_SECOND_IN_MS = 1e3;
    __name(dateTimestampInSeconds, "dateTimestampInSeconds");
    __name(createUnixTimestampInSecondsFunc, "createUnixTimestampInSecondsFunc");
    __name(timestampInSeconds, "timestampInSeconds");
  }
});

// node_modules/@sentry/core/build/esm/session.js
function updateSession(session, context = {}) {
  if (context.user) {
    if (!session.ipAddress && context.user.ip_address) {
      session.ipAddress = context.user.ip_address;
    }
    if (!session.did && !context.did) {
      session.did = context.user.id || context.user.email || context.user.username;
    }
  }
  session.timestamp = context.timestamp || timestampInSeconds();
  if (context.abnormal_mechanism) {
    session.abnormal_mechanism = context.abnormal_mechanism;
  }
  if (context.ignoreDuration) {
    session.ignoreDuration = context.ignoreDuration;
  }
  if (context.sid) {
    session.sid = context.sid.length === 32 ? context.sid : uuid4();
  }
  if (context.init !== void 0) {
    session.init = context.init;
  }
  if (!session.did && context.did) {
    session.did = `${context.did}`;
  }
  if (typeof context.started === "number") {
    session.started = context.started;
  }
  if (session.ignoreDuration) {
    session.duration = void 0;
  } else if (typeof context.duration === "number") {
    session.duration = context.duration;
  } else {
    const duration = session.timestamp - session.started;
    session.duration = duration >= 0 ? duration : 0;
  }
  if (context.release) {
    session.release = context.release;
  }
  if (context.environment) {
    session.environment = context.environment;
  }
  if (!session.ipAddress && context.ipAddress) {
    session.ipAddress = context.ipAddress;
  }
  if (!session.userAgent && context.userAgent) {
    session.userAgent = context.userAgent;
  }
  if (typeof context.errors === "number") {
    session.errors = context.errors;
  }
  if (context.status) {
    session.status = context.status;
  }
}
var init_session = __esm({
  "node_modules/@sentry/core/build/esm/session.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_misc();
    init_time();
    __name(updateSession, "updateSession");
  }
});

// node_modules/@sentry/core/build/esm/utils/merge.js
function merge(initialObj, mergeObj, levels = 2) {
  if (!mergeObj || typeof mergeObj !== "object" || levels <= 0) {
    return mergeObj;
  }
  if (initialObj && Object.keys(mergeObj).length === 0) {
    return initialObj;
  }
  const output = { ...initialObj };
  for (const key in mergeObj) {
    if (Object.prototype.hasOwnProperty.call(mergeObj, key)) {
      output[key] = merge(output[key], mergeObj[key], levels - 1);
    }
  }
  return output;
}
var init_merge = __esm({
  "node_modules/@sentry/core/build/esm/utils/merge.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    __name(merge, "merge");
  }
});

// node_modules/@sentry/core/build/esm/utils/propagationContext.js
function generateTraceId() {
  return uuid4();
}
function generateSpanId() {
  return uuid4().substring(16);
}
var init_propagationContext = __esm({
  "node_modules/@sentry/core/build/esm/utils/propagationContext.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_misc();
    __name(generateTraceId, "generateTraceId");
    __name(generateSpanId, "generateSpanId");
  }
});

// node_modules/@sentry/core/build/esm/utils/weakRef.js
function makeWeakRef(value) {
  try {
    const WeakRefImpl = GLOBAL_OBJ.WeakRef;
    if (typeof WeakRefImpl === "function") {
      return new WeakRefImpl(value);
    }
  } catch {
  }
  return value;
}
function derefWeakRef(ref) {
  if (!ref) {
    return void 0;
  }
  if (typeof ref === "object" && "deref" in ref && typeof ref.deref === "function") {
    try {
      return ref.deref();
    } catch {
      return void 0;
    }
  }
  return ref;
}
var init_weakRef = __esm({
  "node_modules/@sentry/core/build/esm/utils/weakRef.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_worldwide();
    __name(makeWeakRef, "makeWeakRef");
    __name(derefWeakRef, "derefWeakRef");
  }
});

// node_modules/@sentry/core/build/esm/utils/spanOnScope.js
function _setSpanForScope(scope, span) {
  if (span) {
    addNonEnumerableProperty(scope, SCOPE_SPAN_FIELD, makeWeakRef(span));
  } else {
    delete scope[SCOPE_SPAN_FIELD];
  }
}
function _getSpanForScope(scope) {
  return derefWeakRef(scope[SCOPE_SPAN_FIELD]);
}
var SCOPE_SPAN_FIELD;
var init_spanOnScope = __esm({
  "node_modules/@sentry/core/build/esm/utils/spanOnScope.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_object();
    init_weakRef();
    SCOPE_SPAN_FIELD = "_sentrySpan";
    __name(_setSpanForScope, "_setSpanForScope");
    __name(_getSpanForScope, "_getSpanForScope");
  }
});

// node_modules/@sentry/core/build/esm/scope.js
var DEFAULT_MAX_BREADCRUMBS, Scope;
var init_scope = __esm({
  "node_modules/@sentry/core/build/esm/scope.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_debug_build();
    init_session();
    init_debug_logger();
    init_is();
    init_merge();
    init_misc();
    init_propagationContext();
    init_randomSafeContext();
    init_spanOnScope();
    init_string();
    init_time();
    DEFAULT_MAX_BREADCRUMBS = 100;
    Scope = class {
      // NOTE: Any field which gets added here should get added not only to the constructor but also to the `clone` method.
      constructor() {
        this._notifyingListeners = false;
        this._scopeListeners = [];
        this._eventProcessors = [];
        this._breadcrumbs = [];
        this._attachments = [];
        this._user = {};
        this._tags = {};
        this._attributes = {};
        this._extra = {};
        this._contexts = {};
        this._sdkProcessingMetadata = {};
        this._propagationContext = {
          traceId: generateTraceId(),
          sampleRand: safeMathRandom()
        };
      }
      /**
       * Clone all data from this scope into a new scope.
       */
      clone() {
        const newScope = new Scope();
        newScope._breadcrumbs = [...this._breadcrumbs];
        newScope._tags = { ...this._tags };
        newScope._attributes = { ...this._attributes };
        newScope._extra = { ...this._extra };
        newScope._contexts = { ...this._contexts };
        if (this._contexts.flags) {
          newScope._contexts.flags = {
            values: [...this._contexts.flags.values]
          };
        }
        newScope._user = this._user;
        newScope._level = this._level;
        newScope._session = this._session;
        newScope._transactionName = this._transactionName;
        newScope._fingerprint = this._fingerprint;
        newScope._eventProcessors = [...this._eventProcessors];
        newScope._attachments = [...this._attachments];
        newScope._sdkProcessingMetadata = { ...this._sdkProcessingMetadata };
        newScope._propagationContext = { ...this._propagationContext };
        newScope._client = this._client;
        newScope._lastEventId = this._lastEventId;
        newScope._conversationId = this._conversationId;
        _setSpanForScope(newScope, _getSpanForScope(this));
        return newScope;
      }
      /**
       * Update the client assigned to this scope.
       * Note that not every scope will have a client assigned - isolation scopes & the global scope will generally not have a client,
       * as well as manually created scopes.
       */
      setClient(client) {
        this._client = client;
      }
      /**
       * Set the ID of the last captured error event.
       * This is generally only captured on the isolation scope.
       */
      setLastEventId(lastEventId2) {
        this._lastEventId = lastEventId2;
      }
      /**
       * Get the client assigned to this scope.
       */
      getClient() {
        return this._client;
      }
      /**
       * Get the ID of the last captured error event.
       * This is generally only available on the isolation scope.
       */
      lastEventId() {
        return this._lastEventId;
      }
      /**
       * @inheritDoc
       */
      addScopeListener(callback) {
        this._scopeListeners.push(callback);
      }
      /**
       * Add an event processor that will be called before an event is sent.
       */
      addEventProcessor(callback) {
        this._eventProcessors.push(callback);
        return this;
      }
      /**
       * Set the user for this scope.
       * Set to `null` to unset the user.
       */
      setUser(user) {
        this._user = user || {
          email: void 0,
          id: void 0,
          ip_address: void 0,
          username: void 0
        };
        if (this._session) {
          updateSession(this._session, { user });
        }
        this._notifyScopeListeners();
        return this;
      }
      /**
       * Get the user from this scope.
       */
      getUser() {
        return this._user;
      }
      /**
       * Set the conversation ID for this scope.
       * Set to `null` to unset the conversation ID.
       */
      setConversationId(conversationId) {
        this._conversationId = conversationId || void 0;
        this._notifyScopeListeners();
        return this;
      }
      /**
       * Set an object that will be merged into existing tags on the scope,
       * and will be sent as tags data with the event.
       */
      setTags(tags) {
        this._tags = {
          ...this._tags,
          ...tags
        };
        this._notifyScopeListeners();
        return this;
      }
      /**
       * Set a single tag that will be sent as tags data with the event.
       */
      setTag(key, value) {
        return this.setTags({ [key]: value });
      }
      /**
       * Sets attributes onto the scope.
       *
       * These attributes are applied to logs, metrics and streamed spans.
       *
       * Supported attribute value types are `string`, `number`, `boolean`, `string[]`, `number[]` and `boolean[]`.
       *
       * @param newAttributes - The attributes to set on the scope, as key-value pairs.
       *
       * @example
       * ```typescript
       * scope.setAttributes({
       *   is_admin: true,
       *   payment_selection: 'credit_card',
       *   render_duration: 150,
       * });
       * ```
       */
      setAttributes(newAttributes) {
        this._attributes = {
          ...this._attributes,
          ...newAttributes
        };
        this._notifyScopeListeners();
        return this;
      }
      /**
       * Sets an attribute onto the scope.
       *
       * These attributes are applied to logs, metrics and streamed spans.
       *
       * Supported attribute value types are `string`, `number`, `boolean`, `string[]`, `number[]` and `boolean[]`.
       *
       * @param key - The attribute key.
       * @param value - The attribute value.
       *
       * @example
       * ```typescript
       * scope.setAttribute('is_admin', true);
       * scope.setAttribute('render_duration', 150);
       * ```
       */
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setAttribute(key, value) {
        return this.setAttributes({ [key]: value });
      }
      /**
       * Removes the attribute with the given key from the scope.
       *
       * @param key - The attribute key.
       *
       * @example
       * ```typescript
       * scope.removeAttribute('is_admin');
       * ```
       */
      removeAttribute(key) {
        if (key in this._attributes) {
          delete this._attributes[key];
          this._notifyScopeListeners();
        }
        return this;
      }
      /**
       * Set an object that will be merged into existing extra on the scope,
       * and will be sent as extra data with the event.
       */
      setExtras(extras) {
        this._extra = {
          ...this._extra,
          ...extras
        };
        this._notifyScopeListeners();
        return this;
      }
      /**
       * Set a single key:value extra entry that will be sent as extra data with the event.
       */
      setExtra(key, extra) {
        this._extra = { ...this._extra, [key]: extra };
        this._notifyScopeListeners();
        return this;
      }
      /**
       * Sets the fingerprint on the scope to send with the events.
       * @param {string[]} fingerprint Fingerprint to group events in Sentry.
       */
      setFingerprint(fingerprint) {
        this._fingerprint = fingerprint;
        this._notifyScopeListeners();
        return this;
      }
      /**
       * Sets the level on the scope for future events.
       */
      setLevel(level) {
        this._level = level;
        this._notifyScopeListeners();
        return this;
      }
      /**
       * Sets the transaction name on the scope so that the name of e.g. taken server route or
       * the page location is attached to future events.
       *
       * IMPORTANT: Calling this function does NOT change the name of the currently active
       * root span. If you want to change the name of the active root span, use
       * `Sentry.updateSpanName(rootSpan, 'new name')` instead.
       *
       * By default, the SDK updates the scope's transaction name automatically on sensible
       * occasions, such as a page navigation or when handling a new request on the server.
       */
      setTransactionName(name) {
        this._transactionName = name;
        this._notifyScopeListeners();
        return this;
      }
      /**
       * Sets context data with the given name.
       * Data passed as context will be normalized. You can also pass `null` to unset the context.
       * Note that context data will not be merged - calling `setContext` will overwrite an existing context with the same key.
       */
      setContext(key, context) {
        if (context === null) {
          delete this._contexts[key];
        } else {
          this._contexts[key] = context;
        }
        this._notifyScopeListeners();
        return this;
      }
      /**
       * Set the session for the scope.
       */
      setSession(session) {
        if (!session) {
          delete this._session;
        } else {
          this._session = session;
        }
        this._notifyScopeListeners();
        return this;
      }
      /**
       * Get the session from the scope.
       */
      getSession() {
        return this._session;
      }
      /**
       * Updates the scope with provided data. Can work in three variations:
       * - plain object containing updatable attributes
       * - Scope instance that'll extract the attributes from
       * - callback function that'll receive the current scope as an argument and allow for modifications
       */
      update(captureContext) {
        if (!captureContext) {
          return this;
        }
        const scopeToMerge = typeof captureContext === "function" ? captureContext(this) : captureContext;
        const scopeInstance = scopeToMerge instanceof Scope ? scopeToMerge.getScopeData() : isPlainObject(scopeToMerge) ? captureContext : void 0;
        const {
          tags,
          attributes,
          extra,
          user,
          contexts,
          level,
          fingerprint = [],
          propagationContext,
          conversationId
        } = scopeInstance || {};
        this._tags = { ...this._tags, ...tags };
        this._attributes = { ...this._attributes, ...attributes };
        this._extra = { ...this._extra, ...extra };
        this._contexts = { ...this._contexts, ...contexts };
        if (user && Object.keys(user).length) {
          this._user = user;
        }
        if (level) {
          this._level = level;
        }
        if (fingerprint.length) {
          this._fingerprint = fingerprint;
        }
        if (propagationContext) {
          this._propagationContext = propagationContext;
        }
        if (conversationId) {
          this._conversationId = conversationId;
        }
        return this;
      }
      /**
       * Clears the current scope and resets its properties.
       * Note: The client will not be cleared.
       */
      clear() {
        this._breadcrumbs = [];
        this._tags = {};
        this._attributes = {};
        this._extra = {};
        this._user = {};
        this._contexts = {};
        this._level = void 0;
        this._transactionName = void 0;
        this._fingerprint = void 0;
        this._session = void 0;
        this._conversationId = void 0;
        _setSpanForScope(this, void 0);
        this._attachments = [];
        this.setPropagationContext({
          traceId: generateTraceId(),
          sampleRand: safeMathRandom()
        });
        this._notifyScopeListeners();
        return this;
      }
      /**
       * Adds a breadcrumb to the scope.
       * By default, the last 100 breadcrumbs are kept.
       */
      addBreadcrumb(breadcrumb, maxBreadcrumbs) {
        const maxCrumbs = typeof maxBreadcrumbs === "number" ? maxBreadcrumbs : DEFAULT_MAX_BREADCRUMBS;
        if (maxCrumbs <= 0) {
          return this;
        }
        const mergedBreadcrumb = {
          timestamp: dateTimestampInSeconds(),
          ...breadcrumb,
          // Breadcrumb messages can theoretically be infinitely large and they're held in memory so we truncate them not to leak (too much) memory
          message: breadcrumb.message ? truncate(breadcrumb.message, 2048) : breadcrumb.message
        };
        this._breadcrumbs.push(mergedBreadcrumb);
        if (this._breadcrumbs.length > maxCrumbs) {
          this._breadcrumbs = this._breadcrumbs.slice(-maxCrumbs);
          this._client?.recordDroppedEvent("buffer_overflow", "log_item");
        }
        this._notifyScopeListeners();
        return this;
      }
      /**
       * Get the last breadcrumb of the scope.
       */
      getLastBreadcrumb() {
        return this._breadcrumbs[this._breadcrumbs.length - 1];
      }
      /**
       * Clear all breadcrumbs from the scope.
       */
      clearBreadcrumbs() {
        this._breadcrumbs = [];
        this._notifyScopeListeners();
        return this;
      }
      /**
       * Add an attachment to the scope.
       */
      addAttachment(attachment) {
        this._attachments.push(attachment);
        return this;
      }
      /**
       * Clear all attachments from the scope.
       */
      clearAttachments() {
        this._attachments = [];
        return this;
      }
      /**
       * Get the data of this scope, which should be applied to an event during processing.
       */
      getScopeData() {
        return {
          breadcrumbs: this._breadcrumbs,
          attachments: this._attachments,
          contexts: this._contexts,
          tags: this._tags,
          attributes: this._attributes,
          extra: this._extra,
          user: this._user,
          level: this._level,
          fingerprint: this._fingerprint || [],
          eventProcessors: this._eventProcessors,
          propagationContext: this._propagationContext,
          sdkProcessingMetadata: this._sdkProcessingMetadata,
          transactionName: this._transactionName,
          span: _getSpanForScope(this),
          conversationId: this._conversationId
        };
      }
      /**
       * Add data which will be accessible during event processing but won't get sent to Sentry.
       */
      setSDKProcessingMetadata(newData) {
        this._sdkProcessingMetadata = merge(this._sdkProcessingMetadata, newData, 2);
        return this;
      }
      /**
       * Add propagation context to the scope, used for distributed tracing
       */
      setPropagationContext(context) {
        this._propagationContext = context;
        return this;
      }
      /**
       * Get propagation context from the scope, used for distributed tracing
       */
      getPropagationContext() {
        return this._propagationContext;
      }
      /**
       * Capture an exception for this scope.
       *
       * @returns {string} The id of the captured Sentry event.
       */
      captureException(exception, hint) {
        const eventId = hint?.event_id || uuid4();
        if (!this._client) {
          DEBUG_BUILD && debug.warn("No client configured on scope - will not capture exception!");
          return eventId;
        }
        const syntheticException = new Error("Sentry syntheticException");
        this._client.captureException(
          exception,
          {
            originalException: exception,
            syntheticException,
            ...hint,
            event_id: eventId
          },
          this
        );
        return eventId;
      }
      /**
       * Capture a message for this scope.
       *
       * @returns {string} The id of the captured message.
       */
      captureMessage(message, level, hint) {
        const eventId = hint?.event_id || uuid4();
        if (!this._client) {
          DEBUG_BUILD && debug.warn("No client configured on scope - will not capture message!");
          return eventId;
        }
        const syntheticException = hint?.syntheticException ?? new Error(message);
        this._client.captureMessage(
          message,
          level,
          {
            originalException: message,
            syntheticException,
            ...hint,
            event_id: eventId
          },
          this
        );
        return eventId;
      }
      /**
       * Capture a Sentry event for this scope.
       *
       * @returns {string} The id of the captured event.
       */
      captureEvent(event, hint) {
        const eventId = event.event_id || hint?.event_id || uuid4();
        if (!this._client) {
          DEBUG_BUILD && debug.warn("No client configured on scope - will not capture event!");
          return eventId;
        }
        this._client.captureEvent(event, { ...hint, event_id: eventId }, this);
        return eventId;
      }
      /**
       * This will be called on every set call.
       */
      _notifyScopeListeners() {
        if (!this._notifyingListeners) {
          this._notifyingListeners = true;
          this._scopeListeners.forEach((callback) => {
            callback(this);
          });
          this._notifyingListeners = false;
        }
      }
    };
    __name(Scope, "Scope");
  }
});

// node_modules/@sentry/core/build/esm/defaultScopes.js
function getDefaultCurrentScope() {
  return getGlobalSingleton("defaultCurrentScope", () => new Scope());
}
function getDefaultIsolationScope() {
  return getGlobalSingleton("defaultIsolationScope", () => new Scope());
}
var init_defaultScopes = __esm({
  "node_modules/@sentry/core/build/esm/defaultScopes.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_carrier();
    init_scope();
    __name(getDefaultCurrentScope, "getDefaultCurrentScope");
    __name(getDefaultIsolationScope, "getDefaultIsolationScope");
  }
});

// node_modules/@sentry/core/build/esm/utils/chain-and-copy-promiselike.js
var isActualPromise, kChainedCopy, chainAndCopyPromiseLike, copyProps;
var init_chain_and_copy_promiselike = __esm({
  "node_modules/@sentry/core/build/esm/utils/chain-and-copy-promiselike.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    isActualPromise = /* @__PURE__ */ __name((p) => p instanceof Promise && !p[kChainedCopy], "isActualPromise");
    kChainedCopy = /* @__PURE__ */ Symbol("chained PromiseLike");
    chainAndCopyPromiseLike = /* @__PURE__ */ __name((original, onSuccess, onError) => {
      const chained = original.then(
        (value) => {
          onSuccess(value);
          return value;
        },
        (err) => {
          onError(err);
          throw err;
        }
      );
      return isActualPromise(chained) && isActualPromise(original) ? chained : copyProps(original, chained);
    }, "chainAndCopyPromiseLike");
    copyProps = /* @__PURE__ */ __name((original, chained) => {
      if (!chained)
        return original;
      let mutated = false;
      for (const key in original) {
        if (key in chained)
          continue;
        mutated = true;
        const value = original[key];
        if (typeof value === "function") {
          Object.defineProperty(chained, key, {
            value: (...args) => value.apply(original, args),
            enumerable: true,
            configurable: true,
            writable: true
          });
        } else {
          chained[key] = value;
        }
      }
      if (mutated)
        Object.assign(chained, { [kChainedCopy]: true });
      return chained;
    }, "copyProps");
  }
});

// node_modules/@sentry/core/build/esm/asyncContext/stackStrategy.js
function getAsyncContextStack() {
  const registry = getMainCarrier();
  const sentry = getSentryCarrier(registry);
  return sentry.stack = sentry.stack || new AsyncContextStack(getDefaultCurrentScope(), getDefaultIsolationScope());
}
function withScope(callback) {
  return getAsyncContextStack().withScope(callback);
}
function withSetScope(scope, callback) {
  const stack = getAsyncContextStack();
  return stack.withScope(() => {
    stack.getStackTop().scope = scope;
    return callback(scope);
  });
}
function withIsolationScope(callback) {
  return getAsyncContextStack().withScope(() => {
    return callback(getAsyncContextStack().getIsolationScope());
  });
}
function getStackAsyncContextStrategy() {
  return {
    withIsolationScope,
    withScope,
    withSetScope,
    withSetIsolationScope: (_isolationScope, callback) => {
      return withIsolationScope(callback);
    },
    getCurrentScope: () => getAsyncContextStack().getScope(),
    getIsolationScope: () => getAsyncContextStack().getIsolationScope()
  };
}
var AsyncContextStack;
var init_stackStrategy = __esm({
  "node_modules/@sentry/core/build/esm/asyncContext/stackStrategy.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_defaultScopes();
    init_scope();
    init_chain_and_copy_promiselike();
    init_is();
    init_carrier();
    AsyncContextStack = class {
      constructor(scope, isolationScope) {
        let assignedScope;
        if (!scope) {
          assignedScope = new Scope();
        } else {
          assignedScope = scope;
        }
        let assignedIsolationScope;
        if (!isolationScope) {
          assignedIsolationScope = new Scope();
        } else {
          assignedIsolationScope = isolationScope;
        }
        this._stack = [{ scope: assignedScope }];
        this._isolationScope = assignedIsolationScope;
      }
      /**
       * Fork a scope for the stack.
       */
      withScope(callback) {
        const scope = this._pushScope();
        let maybePromiseResult;
        try {
          maybePromiseResult = callback(scope);
        } catch (e) {
          this._popScope();
          throw e;
        }
        if (isThenable(maybePromiseResult)) {
          return chainAndCopyPromiseLike(
            maybePromiseResult,
            () => this._popScope(),
            () => this._popScope()
          );
        }
        this._popScope();
        return maybePromiseResult;
      }
      /**
       * Get the client of the stack.
       */
      getClient() {
        return this.getStackTop().client;
      }
      /**
       * Returns the scope of the top stack.
       */
      getScope() {
        return this.getStackTop().scope;
      }
      /**
       * Get the isolation scope for the stack.
       */
      getIsolationScope() {
        return this._isolationScope;
      }
      /**
       * Returns the topmost scope layer in the order domain > local > process.
       */
      getStackTop() {
        return this._stack[this._stack.length - 1];
      }
      /**
       * Push a scope to the stack.
       */
      _pushScope() {
        const scope = this.getScope().clone();
        this._stack.push({
          client: this.getClient(),
          scope
        });
        return scope;
      }
      /**
       * Pop a scope from the stack.
       */
      _popScope() {
        if (this._stack.length <= 1)
          return false;
        return !!this._stack.pop();
      }
    };
    __name(AsyncContextStack, "AsyncContextStack");
    __name(getAsyncContextStack, "getAsyncContextStack");
    __name(withScope, "withScope");
    __name(withSetScope, "withSetScope");
    __name(withIsolationScope, "withIsolationScope");
    __name(getStackAsyncContextStrategy, "getStackAsyncContextStrategy");
  }
});

// node_modules/@sentry/core/build/esm/asyncContext/index.js
function setAsyncContextStrategy(strategy) {
  const registry = getMainCarrier();
  const sentry = getSentryCarrier(registry);
  sentry.acs = strategy;
}
function getAsyncContextStrategy(carrier) {
  const sentry = getSentryCarrier(carrier);
  if (sentry.acs) {
    return sentry.acs;
  }
  return getStackAsyncContextStrategy();
}
var init_asyncContext = __esm({
  "node_modules/@sentry/core/build/esm/asyncContext/index.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_carrier();
    init_stackStrategy();
    __name(setAsyncContextStrategy, "setAsyncContextStrategy");
    __name(getAsyncContextStrategy, "getAsyncContextStrategy");
  }
});

// node_modules/@sentry/core/build/esm/attributes.js
function isAttributeObject(maybeObj) {
  return typeof maybeObj === "object" && maybeObj != null && !Array.isArray(maybeObj) && Object.keys(maybeObj).includes("value");
}
function attributeValueToTypedAttributeValue(rawValue, useFallback) {
  const { value, unit } = isAttributeObject(rawValue) ? rawValue : { value: rawValue, unit: void 0 };
  const attributeValue = getTypedAttributeValue(value);
  const checkedUnit = unit && typeof unit === "string" ? { unit } : {};
  if (attributeValue) {
    return { ...attributeValue, ...checkedUnit };
  }
  if (!useFallback || useFallback === "skip-undefined" && value === void 0) {
    return;
  }
  let stringValue = "";
  try {
    stringValue = JSON.stringify(value) ?? "";
  } catch {
  }
  return {
    value: stringValue,
    type: "string",
    ...checkedUnit
  };
}
function serializeAttributes(attributes, fallback = false) {
  const serializedAttributes = {};
  for (const [key, value] of Object.entries(attributes ?? {})) {
    const typedValue = attributeValueToTypedAttributeValue(value, fallback);
    if (typedValue) {
      serializedAttributes[key] = typedValue;
    }
  }
  return serializedAttributes;
}
function estimateTypedAttributesSizeInBytes(attributes) {
  if (!attributes) {
    return 0;
  }
  let weight = 0;
  for (const [key, attr] of Object.entries(attributes)) {
    weight += key.length * 2;
    weight += attr.type.length * 2;
    weight += (attr.unit?.length ?? 0) * 2;
    const val = attr.value;
    if (Array.isArray(val)) {
      weight += estimatePrimitiveSizeInBytes(val[0]) * val.length;
    } else if (isPrimitive(val)) {
      weight += estimatePrimitiveSizeInBytes(val);
    } else {
      weight += 100;
    }
  }
  return weight;
}
function estimatePrimitiveSizeInBytes(value) {
  if (typeof value === "string") {
    return value.length * 2;
  } else if (typeof value === "boolean") {
    return 4;
  } else if (typeof value === "number") {
    return 8;
  }
  return 0;
}
function getTypedAttributeValue(value) {
  if (Array.isArray(value)) {
    return { value, type: "array" };
  }
  const primitiveType = typeof value === "string" ? "string" : typeof value === "boolean" ? "boolean" : typeof value === "number" && !Number.isNaN(value) ? Number.isInteger(value) ? "integer" : "double" : null;
  if (primitiveType) {
    return { value, type: primitiveType };
  }
}
var init_attributes = __esm({
  "node_modules/@sentry/core/build/esm/attributes.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_is();
    __name(isAttributeObject, "isAttributeObject");
    __name(attributeValueToTypedAttributeValue, "attributeValueToTypedAttributeValue");
    __name(serializeAttributes, "serializeAttributes");
    __name(estimateTypedAttributesSizeInBytes, "estimateTypedAttributesSizeInBytes");
    __name(estimatePrimitiveSizeInBytes, "estimatePrimitiveSizeInBytes");
    __name(getTypedAttributeValue, "getTypedAttributeValue");
  }
});

// node_modules/@sentry/core/build/esm/currentScopes.js
function getExternalPropagationContext() {
  return _externalPropagationContextProvider?.();
}
function hasExternalPropagationContext() {
  return _externalPropagationContextProvider !== void 0;
}
function getCurrentScope() {
  const carrier = getMainCarrier();
  const acs = getAsyncContextStrategy(carrier);
  return acs.getCurrentScope();
}
function getIsolationScope() {
  const carrier = getMainCarrier();
  const acs = getAsyncContextStrategy(carrier);
  return acs.getIsolationScope();
}
function getGlobalScope() {
  return getGlobalSingleton("globalScope", () => new Scope());
}
function withScope2(...rest) {
  const carrier = getMainCarrier();
  const acs = getAsyncContextStrategy(carrier);
  if (rest.length === 2) {
    const [scope, callback] = rest;
    if (!scope) {
      return acs.withScope(callback);
    }
    return acs.withSetScope(scope, callback);
  }
  return acs.withScope(rest[0]);
}
function withIsolationScope2(...rest) {
  const carrier = getMainCarrier();
  const acs = getAsyncContextStrategy(carrier);
  if (rest.length === 2) {
    const [isolationScope, callback] = rest;
    if (!isolationScope) {
      return acs.withIsolationScope(callback);
    }
    return acs.withSetIsolationScope(isolationScope, callback);
  }
  return acs.withIsolationScope(rest[0]);
}
function getClient() {
  return getCurrentScope().getClient();
}
function getTraceContextFromScope(scope) {
  const externalContext = getExternalPropagationContext();
  if (externalContext) {
    return { trace_id: externalContext.traceId, span_id: externalContext.spanId };
  }
  const propagationContext = scope.getPropagationContext();
  const { traceId, parentSpanId, propagationSpanId } = propagationContext;
  const traceContext = {
    trace_id: traceId,
    span_id: propagationSpanId || generateSpanId()
  };
  if (parentSpanId) {
    traceContext.parent_span_id = parentSpanId;
  }
  return traceContext;
}
var _externalPropagationContextProvider;
var init_currentScopes = __esm({
  "node_modules/@sentry/core/build/esm/currentScopes.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_asyncContext();
    init_carrier();
    init_scope();
    init_propagationContext();
    __name(getExternalPropagationContext, "getExternalPropagationContext");
    __name(hasExternalPropagationContext, "hasExternalPropagationContext");
    __name(getCurrentScope, "getCurrentScope");
    __name(getIsolationScope, "getIsolationScope");
    __name(getGlobalScope, "getGlobalScope");
    __name(withScope2, "withScope");
    __name(withIsolationScope2, "withIsolationScope");
    __name(getClient, "getClient");
    __name(getTraceContextFromScope, "getTraceContextFromScope");
  }
});

// node_modules/@sentry/core/build/esm/semanticAttributes.js
var SEMANTIC_ATTRIBUTE_SENTRY_SOURCE, SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE, SEMANTIC_ATTRIBUTE_SENTRY_PREVIOUS_TRACE_SAMPLE_RATE, SEMANTIC_ATTRIBUTE_SENTRY_OP, SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN, SEMANTIC_ATTRIBUTE_SENTRY_STATUS_MESSAGE, SEMANTIC_ATTRIBUTE_SENTRY_MEASUREMENT_UNIT, SEMANTIC_ATTRIBUTE_SENTRY_MEASUREMENT_VALUE, SEMANTIC_ATTRIBUTE_SENTRY_RELEASE, SEMANTIC_ATTRIBUTE_SENTRY_ENVIRONMENT, SEMANTIC_ATTRIBUTE_SENTRY_SDK_INTEGRATIONS, SEMANTIC_ATTRIBUTE_USER_ID, SEMANTIC_ATTRIBUTE_USER_EMAIL, SEMANTIC_ATTRIBUTE_USER_IP_ADDRESS, SEMANTIC_ATTRIBUTE_USER_USERNAME, SEMANTIC_ATTRIBUTE_SENTRY_CUSTOM_SPAN_NAME, SEMANTIC_ATTRIBUTE_PROFILE_ID, SEMANTIC_ATTRIBUTE_EXCLUSIVE_TIME, SEMANTIC_ATTRIBUTE_HTTP_REQUEST_METHOD, SEMANTIC_ATTRIBUTE_URL_FULL, SEMANTIC_LINK_ATTRIBUTE_LINK_TYPE, GEN_AI_CONVERSATION_ID_ATTRIBUTE;
var init_semanticAttributes = __esm({
  "node_modules/@sentry/core/build/esm/semanticAttributes.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    SEMANTIC_ATTRIBUTE_SENTRY_SOURCE = "sentry.source";
    SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE = "sentry.sample_rate";
    SEMANTIC_ATTRIBUTE_SENTRY_PREVIOUS_TRACE_SAMPLE_RATE = "sentry.previous_trace_sample_rate";
    SEMANTIC_ATTRIBUTE_SENTRY_OP = "sentry.op";
    SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN = "sentry.origin";
    SEMANTIC_ATTRIBUTE_SENTRY_STATUS_MESSAGE = "sentry.status.message";
    SEMANTIC_ATTRIBUTE_SENTRY_MEASUREMENT_UNIT = "sentry.measurement_unit";
    SEMANTIC_ATTRIBUTE_SENTRY_MEASUREMENT_VALUE = "sentry.measurement_value";
    SEMANTIC_ATTRIBUTE_SENTRY_RELEASE = "sentry.release";
    SEMANTIC_ATTRIBUTE_SENTRY_ENVIRONMENT = "sentry.environment";
    SEMANTIC_ATTRIBUTE_SENTRY_SDK_INTEGRATIONS = "sentry.sdk.integrations";
    SEMANTIC_ATTRIBUTE_USER_ID = "user.id";
    SEMANTIC_ATTRIBUTE_USER_EMAIL = "user.email";
    SEMANTIC_ATTRIBUTE_USER_IP_ADDRESS = "user.ip_address";
    SEMANTIC_ATTRIBUTE_USER_USERNAME = "user.name";
    SEMANTIC_ATTRIBUTE_SENTRY_CUSTOM_SPAN_NAME = "sentry.custom_span_name";
    SEMANTIC_ATTRIBUTE_PROFILE_ID = "sentry.profile_id";
    SEMANTIC_ATTRIBUTE_EXCLUSIVE_TIME = "sentry.exclusive_time";
    SEMANTIC_ATTRIBUTE_HTTP_REQUEST_METHOD = "http.request.method";
    SEMANTIC_ATTRIBUTE_URL_FULL = "url.full";
    SEMANTIC_LINK_ATTRIBUTE_LINK_TYPE = "sentry.link.type";
    GEN_AI_CONVERSATION_ID_ATTRIBUTE = "gen_ai.conversation.id";
  }
});

// node_modules/@sentry/core/build/esm/tracing/spanstatus.js
function getSpanStatusFromHttpCode(httpStatus) {
  if (httpStatus < 400 && httpStatus >= 100) {
    return { code: SPAN_STATUS_OK };
  }
  if (httpStatus >= 400 && httpStatus < 500) {
    switch (httpStatus) {
      case 401:
        return { code: SPAN_STATUS_ERROR, message: "unauthenticated" };
      case 403:
        return { code: SPAN_STATUS_ERROR, message: "permission_denied" };
      case 404:
        return { code: SPAN_STATUS_ERROR, message: "not_found" };
      case 409:
        return { code: SPAN_STATUS_ERROR, message: "already_exists" };
      case 413:
        return { code: SPAN_STATUS_ERROR, message: "failed_precondition" };
      case 429:
        return { code: SPAN_STATUS_ERROR, message: "resource_exhausted" };
      case 499:
        return { code: SPAN_STATUS_ERROR, message: "cancelled" };
      default:
        return { code: SPAN_STATUS_ERROR, message: "invalid_argument" };
    }
  }
  if (httpStatus >= 500 && httpStatus < 600) {
    switch (httpStatus) {
      case 501:
        return { code: SPAN_STATUS_ERROR, message: "unimplemented" };
      case 503:
        return { code: SPAN_STATUS_ERROR, message: "unavailable" };
      case 504:
        return { code: SPAN_STATUS_ERROR, message: "deadline_exceeded" };
      default:
        return { code: SPAN_STATUS_ERROR, message: "internal_error" };
    }
  }
  return { code: SPAN_STATUS_ERROR, message: "internal_error" };
}
function setHttpStatus(span, httpStatus) {
  span.setAttribute("http.response.status_code", httpStatus);
  const spanStatus = getSpanStatusFromHttpCode(httpStatus);
  if (spanStatus.message !== "unknown_error") {
    span.setStatus(spanStatus);
  }
}
var SPAN_STATUS_UNSET, SPAN_STATUS_OK, SPAN_STATUS_ERROR;
var init_spanstatus = __esm({
  "node_modules/@sentry/core/build/esm/tracing/spanstatus.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    SPAN_STATUS_UNSET = 0;
    SPAN_STATUS_OK = 1;
    SPAN_STATUS_ERROR = 2;
    __name(getSpanStatusFromHttpCode, "getSpanStatusFromHttpCode");
    __name(setHttpStatus, "setHttpStatus");
  }
});

// node_modules/@sentry/core/build/esm/tracing/utils.js
function setCapturedScopesOnSpan(span, scope, isolationScope) {
  if (span) {
    addNonEnumerableProperty(span, ISOLATION_SCOPE_ON_START_SPAN_FIELD, makeWeakRef(isolationScope));
    addNonEnumerableProperty(span, SCOPE_ON_START_SPAN_FIELD, scope);
  }
}
function getCapturedScopesOnSpan(span) {
  const spanWithScopes = span;
  return {
    scope: spanWithScopes[SCOPE_ON_START_SPAN_FIELD],
    isolationScope: derefWeakRef(spanWithScopes[ISOLATION_SCOPE_ON_START_SPAN_FIELD])
  };
}
function spanShouldInferOtelSource(span) {
  return span[OTEL_SOURCE_INFERENCE_SPAN_FIELD] === true;
}
function markSpanSourceAsExplicit(span) {
  addNonEnumerableProperty(span, OTEL_SOURCE_EXPLICITLY_SET_SPAN_FIELD, true);
}
function spanIsTracerProviderSpan(span) {
  return span[TRACER_PROVIDER_SPAN_FIELD] === true;
}
var SCOPE_ON_START_SPAN_FIELD, ISOLATION_SCOPE_ON_START_SPAN_FIELD, OTEL_SOURCE_INFERENCE_SPAN_FIELD, OTEL_SOURCE_EXPLICITLY_SET_SPAN_FIELD, TRACER_PROVIDER_SPAN_FIELD;
var init_utils = __esm({
  "node_modules/@sentry/core/build/esm/tracing/utils.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_object();
    init_weakRef();
    SCOPE_ON_START_SPAN_FIELD = "_sentryScope";
    ISOLATION_SCOPE_ON_START_SPAN_FIELD = "_sentryIsolationScope";
    OTEL_SOURCE_INFERENCE_SPAN_FIELD = /* @__PURE__ */ Symbol.for("sentry.otelSourceInference");
    OTEL_SOURCE_EXPLICITLY_SET_SPAN_FIELD = /* @__PURE__ */ Symbol.for("sentry.otelSourceExplicitlySet");
    TRACER_PROVIDER_SPAN_FIELD = /* @__PURE__ */ Symbol.for("sentry.tracerProviderSpan");
    __name(setCapturedScopesOnSpan, "setCapturedScopesOnSpan");
    __name(getCapturedScopesOnSpan, "getCapturedScopesOnSpan");
    __name(spanShouldInferOtelSource, "spanShouldInferOtelSource");
    __name(markSpanSourceAsExplicit, "markSpanSourceAsExplicit");
    __name(spanIsTracerProviderSpan, "spanIsTracerProviderSpan");
  }
});

// node_modules/@sentry/core/build/esm/utils/baggage.js
function baggageHeaderToDynamicSamplingContext(baggageHeader) {
  const baggageObject = parseBaggageHeader(baggageHeader);
  if (!baggageObject) {
    return void 0;
  }
  const dynamicSamplingContext = Object.entries(baggageObject).reduce((acc, [key, value]) => {
    if (key.startsWith(SENTRY_BAGGAGE_KEY_PREFIX)) {
      const nonPrefixedKey = key.slice(SENTRY_BAGGAGE_KEY_PREFIX.length);
      acc[nonPrefixedKey] = value;
    }
    return acc;
  }, {});
  if (Object.keys(dynamicSamplingContext).length > 0) {
    return dynamicSamplingContext;
  } else {
    return void 0;
  }
}
function dynamicSamplingContextToSentryBaggageHeader(dynamicSamplingContext) {
  if (!dynamicSamplingContext) {
    return void 0;
  }
  const sentryPrefixedDSC = Object.entries(dynamicSamplingContext).reduce(
    (acc, [dscKey, dscValue]) => {
      if (dscValue) {
        acc[`${SENTRY_BAGGAGE_KEY_PREFIX}${dscKey}`] = dscValue;
      }
      return acc;
    },
    {}
  );
  return objectToBaggageHeader(sentryPrefixedDSC);
}
function parseBaggageHeader(baggageHeader) {
  if (!baggageHeader || !isString(baggageHeader) && !Array.isArray(baggageHeader)) {
    return void 0;
  }
  if (Array.isArray(baggageHeader)) {
    return baggageHeader.reduce((acc, curr) => {
      const currBaggageObject = baggageHeaderToObject(curr);
      Object.entries(currBaggageObject).forEach(([key, value]) => {
        acc[key] = value;
      });
      return acc;
    }, {});
  }
  return baggageHeaderToObject(baggageHeader);
}
function baggageHeaderToObject(baggageHeader) {
  return baggageHeader.split(",").map((baggageEntry) => {
    const eqIdx = baggageEntry.indexOf("=");
    if (eqIdx === -1) {
      return [];
    }
    const key = baggageEntry.slice(0, eqIdx);
    const value = baggageEntry.slice(eqIdx + 1);
    return [key, value].map((keyOrValue) => {
      try {
        return decodeURIComponent(keyOrValue.trim());
      } catch {
        return;
      }
    });
  }).reduce((acc, [key, value]) => {
    if (key && value) {
      acc[key] = value;
    }
    return acc;
  }, {});
}
function objectToBaggageHeader(object) {
  if (Object.keys(object).length === 0) {
    return void 0;
  }
  return Object.entries(object).reduce((baggageHeader, [objectKey, objectValue], currentIndex) => {
    const baggageEntry = `${encodeURIComponent(objectKey)}=${encodeURIComponent(objectValue)}`;
    const newBaggageHeader = currentIndex === 0 ? baggageEntry : `${baggageHeader},${baggageEntry}`;
    if (newBaggageHeader.length > MAX_BAGGAGE_STRING_LENGTH) {
      DEBUG_BUILD && debug.warn(
        `Not adding key: ${objectKey} with val: ${objectValue} to baggage header due to exceeding baggage size limits.`
      );
      return baggageHeader;
    } else {
      return newBaggageHeader;
    }
  }, "");
}
var SENTRY_BAGGAGE_KEY_PREFIX, MAX_BAGGAGE_STRING_LENGTH;
var init_baggage = __esm({
  "node_modules/@sentry/core/build/esm/utils/baggage.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_debug_build();
    init_debug_logger();
    init_is();
    SENTRY_BAGGAGE_KEY_PREFIX = "sentry-";
    MAX_BAGGAGE_STRING_LENGTH = 8192;
    __name(baggageHeaderToDynamicSamplingContext, "baggageHeaderToDynamicSamplingContext");
    __name(dynamicSamplingContextToSentryBaggageHeader, "dynamicSamplingContextToSentryBaggageHeader");
    __name(parseBaggageHeader, "parseBaggageHeader");
    __name(baggageHeaderToObject, "baggageHeaderToObject");
    __name(objectToBaggageHeader, "objectToBaggageHeader");
  }
});

// node_modules/@sentry/core/build/esm/utils/dsn.js
function isValidProtocol(protocol) {
  return protocol === "http" || protocol === "https";
}
function dsnToString(dsn, withPassword = false) {
  const { host, path, pass, port, projectId, protocol, publicKey } = dsn;
  return `${protocol}://${publicKey}${withPassword && pass ? `:${pass}` : ""}@${host}${port ? `:${port}` : ""}/${path ? `${path}/` : path}${projectId}`;
}
function dsnFromString(str) {
  const match = DSN_REGEX.exec(str);
  if (!match) {
    consoleSandbox(() => {
      console.error(`Invalid Sentry Dsn: ${str}`);
    });
    return void 0;
  }
  const [protocol, publicKey, pass = "", host = "", port = "", lastPath = ""] = match.slice(1);
  let path = "";
  let projectId = lastPath;
  const split = projectId.split("/");
  if (split.length > 1) {
    path = split.slice(0, -1).join("/");
    projectId = split.pop();
  }
  if (projectId) {
    const projectMatch = projectId.match(/^\d+/);
    if (projectMatch) {
      projectId = projectMatch[0];
    }
  }
  return dsnFromComponents({ host, pass, path, projectId, port, protocol, publicKey });
}
function dsnFromComponents(components) {
  return {
    protocol: components.protocol,
    publicKey: components.publicKey || "",
    pass: components.pass || "",
    host: components.host,
    port: components.port || "",
    path: components.path || "",
    projectId: components.projectId
  };
}
function validateDsn(dsn) {
  if (!DEBUG_BUILD) {
    return true;
  }
  const { port, projectId, protocol } = dsn;
  const requiredComponents = ["protocol", "publicKey", "host", "projectId"];
  const hasMissingRequiredComponent = requiredComponents.find((component) => {
    if (!dsn[component]) {
      debug.error(`Invalid Sentry Dsn: ${component} missing`);
      return true;
    }
    return false;
  });
  if (hasMissingRequiredComponent) {
    return false;
  }
  if (!projectId.match(/^\d+$/)) {
    debug.error(`Invalid Sentry Dsn: Invalid projectId ${projectId}`);
    return false;
  }
  if (!isValidProtocol(protocol)) {
    debug.error(`Invalid Sentry Dsn: Invalid protocol ${protocol}`);
    return false;
  }
  if (port && isNaN(parseInt(port, 10))) {
    debug.error(`Invalid Sentry Dsn: Invalid port ${port}`);
    return false;
  }
  return true;
}
function extractOrgIdFromDsnHost(host) {
  const match = host.match(ORG_ID_REGEX);
  return match?.[1];
}
function extractOrgIdFromClient(client) {
  const options = client.getOptions();
  const { host } = client.getDsn() || {};
  let org_id;
  if (options.orgId) {
    org_id = String(options.orgId);
  } else if (host) {
    org_id = extractOrgIdFromDsnHost(host);
  }
  return org_id;
}
function makeDsn(from) {
  const components = typeof from === "string" ? dsnFromString(from) : dsnFromComponents(from);
  if (!components || !validateDsn(components)) {
    return void 0;
  }
  return components;
}
var ORG_ID_REGEX, DSN_REGEX;
var init_dsn = __esm({
  "node_modules/@sentry/core/build/esm/utils/dsn.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_debug_build();
    init_debug_logger();
    ORG_ID_REGEX = /^o(\d+)\./;
    DSN_REGEX = /^(?:(\w+):)\/\/(?:(\w+)(?::(\w+)?)?@)((?:\[[:.%\w]+\]|[\w.-]+))(?::(\d+))?\/(.+)/;
    __name(isValidProtocol, "isValidProtocol");
    __name(dsnToString, "dsnToString");
    __name(dsnFromString, "dsnFromString");
    __name(dsnFromComponents, "dsnFromComponents");
    __name(validateDsn, "validateDsn");
    __name(extractOrgIdFromDsnHost, "extractOrgIdFromDsnHost");
    __name(extractOrgIdFromClient, "extractOrgIdFromClient");
    __name(makeDsn, "makeDsn");
  }
});

// node_modules/@sentry/core/build/esm/utils/parseSampleRate.js
function parseSampleRate(sampleRate) {
  if (typeof sampleRate === "boolean") {
    return Number(sampleRate);
  }
  const rate = typeof sampleRate === "string" ? parseFloat(sampleRate) : sampleRate;
  if (typeof rate !== "number" || isNaN(rate) || rate < 0 || rate > 1) {
    return void 0;
  }
  return rate;
}
var init_parseSampleRate = __esm({
  "node_modules/@sentry/core/build/esm/utils/parseSampleRate.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    __name(parseSampleRate, "parseSampleRate");
  }
});

// node_modules/@sentry/core/build/esm/utils/tracing.js
function extractTraceparentData(traceparent) {
  if (!traceparent) {
    return void 0;
  }
  const matches = traceparent.match(TRACEPARENT_REGEXP);
  if (!matches) {
    return void 0;
  }
  let parentSampled;
  if (matches[3] === "1") {
    parentSampled = true;
  } else if (matches[3] === "0") {
    parentSampled = false;
  }
  return {
    traceId: matches[1],
    parentSampled,
    parentSpanId: matches[2]
  };
}
function propagationContextFromHeaders(sentryTrace, baggage) {
  const traceparentData = extractTraceparentData(sentryTrace);
  const dynamicSamplingContext = baggageHeaderToDynamicSamplingContext(baggage);
  if (!traceparentData?.traceId) {
    return {
      traceId: generateTraceId(),
      sampleRand: safeMathRandom()
    };
  }
  const sampleRand = getSampleRandFromTraceparentAndDsc(traceparentData, dynamicSamplingContext);
  if (dynamicSamplingContext) {
    dynamicSamplingContext.sample_rand = sampleRand.toString();
  }
  const { traceId, parentSpanId, parentSampled } = traceparentData;
  return {
    traceId,
    parentSpanId,
    sampled: parentSampled,
    dsc: dynamicSamplingContext || {},
    // If we have traceparent data but no DSC it means we are not head of trace and we must freeze it
    sampleRand
  };
}
function generateSentryTraceHeader(traceId = generateTraceId(), spanId = generateSpanId(), sampled) {
  let sampledString = "";
  if (sampled !== void 0) {
    sampledString = sampled ? "-1" : "-0";
  }
  return `${traceId}-${spanId}${sampledString}`;
}
function generateTraceparentHeader(traceId = generateTraceId(), spanId = generateSpanId(), sampled) {
  return `00-${traceId}-${spanId}-${sampled ? "01" : "00"}`;
}
function getSampleRandFromTraceparentAndDsc(traceparentData, dsc) {
  const parsedSampleRand = parseSampleRate(dsc?.sample_rand);
  if (parsedSampleRand !== void 0) {
    return parsedSampleRand;
  }
  const parsedSampleRate = parseSampleRate(dsc?.sample_rate);
  if (parsedSampleRate && traceparentData?.parentSampled !== void 0) {
    return traceparentData.parentSampled ? (
      // Returns a sample rand with positive sampling decision [0, sampleRate)
      safeMathRandom() * parsedSampleRate
    ) : (
      // Returns a sample rand with negative sampling decision [sampleRate, 1)
      parsedSampleRate + safeMathRandom() * (1 - parsedSampleRate)
    );
  } else {
    return safeMathRandom();
  }
}
function shouldContinueTrace(client, baggageOrgId) {
  const clientOrgId = extractOrgIdFromClient(client);
  if (baggageOrgId && clientOrgId && baggageOrgId !== clientOrgId) {
    debug.log(
      `Won't continue trace because org IDs don't match (incoming baggage: ${baggageOrgId}, SDK options: ${clientOrgId})`
    );
    return false;
  }
  const strictTraceContinuation = client.getOptions().strictTraceContinuation || false;
  if (strictTraceContinuation) {
    if (baggageOrgId && !clientOrgId || !baggageOrgId && clientOrgId) {
      debug.log(
        `Starting a new trace because strict trace continuation is enabled but one org ID is missing (incoming baggage: ${baggageOrgId}, Sentry client: ${clientOrgId})`
      );
      return false;
    }
  }
  return true;
}
var TRACEPARENT_REGEXP;
var init_tracing = __esm({
  "node_modules/@sentry/core/build/esm/utils/tracing.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_debug_logger();
    init_baggage();
    init_dsn();
    init_parseSampleRate();
    init_propagationContext();
    init_randomSafeContext();
    TRACEPARENT_REGEXP = new RegExp(
      "^[ \\t]*([0-9a-f]{32})?-?([0-9a-f]{16})?-?([01])?[ \\t]*$"
      // whitespace
    );
    __name(extractTraceparentData, "extractTraceparentData");
    __name(propagationContextFromHeaders, "propagationContextFromHeaders");
    __name(generateSentryTraceHeader, "generateSentryTraceHeader");
    __name(generateTraceparentHeader, "generateTraceparentHeader");
    __name(getSampleRandFromTraceparentAndDsc, "getSampleRandFromTraceparentAndDsc");
    __name(shouldContinueTrace, "shouldContinueTrace");
  }
});

// node_modules/@sentry/core/build/esm/utils/spanUtils.js
function spanToTransactionTraceContext(span) {
  const { spanId: span_id, traceId: trace_id } = span.spanContext();
  const { data, op, parent_span_id, status, origin, links } = spanToJSON(span);
  return {
    parent_span_id,
    span_id,
    trace_id,
    data,
    op,
    status,
    origin,
    links
  };
}
function spanToTraceContext(span) {
  const { spanId, traceId: trace_id, isRemote } = span.spanContext();
  const parent_span_id = isRemote ? spanId : spanToJSON(span).parent_span_id;
  const scope = getCapturedScopesOnSpan(span).scope;
  const span_id = isRemote ? scope?.getPropagationContext().propagationSpanId || generateSpanId() : spanId;
  return {
    parent_span_id,
    span_id,
    trace_id
  };
}
function spanToTraceHeader(span) {
  const { traceId, spanId } = span.spanContext();
  const sampled = spanIsSampled(span);
  return generateSentryTraceHeader(traceId, spanId, sampled);
}
function spanToTraceparentHeader(span) {
  const { traceId, spanId } = span.spanContext();
  const sampled = spanIsSampled(span);
  return generateTraceparentHeader(traceId, spanId, sampled);
}
function convertSpanLinksForEnvelope(links) {
  if (links && links.length > 0) {
    return links.map(({ context: { spanId, traceId, traceFlags, ...restContext }, attributes }) => ({
      span_id: spanId,
      trace_id: traceId,
      sampled: traceFlags === TRACE_FLAG_SAMPLED,
      attributes,
      ...restContext
    }));
  } else {
    return void 0;
  }
}
function getStreamedSpanLinks(links) {
  if (links?.length) {
    return links.map(({ context: { spanId, traceId, traceFlags }, attributes }) => ({
      span_id: spanId,
      trace_id: traceId,
      sampled: traceFlags === TRACE_FLAG_SAMPLED,
      attributes
    }));
  } else {
    return void 0;
  }
}
function spanTimeInputToSeconds(input) {
  if (typeof input === "number") {
    return ensureTimestampInSeconds(input);
  }
  if (Array.isArray(input)) {
    return input[0] + input[1] / 1e9;
  }
  if (input instanceof Date) {
    return ensureTimestampInSeconds(input.getTime());
  }
  return timestampInSeconds();
}
function ensureTimestampInSeconds(timestamp) {
  const isMs = timestamp > 9999999999;
  return isMs ? timestamp / 1e3 : timestamp;
}
function spanToJSON(span) {
  if (spanIsSentrySpan(span)) {
    return span.getSpanJSON();
  }
  const { spanId: span_id, traceId: trace_id } = span.spanContext();
  if (spanIsOpenTelemetrySdkTraceBaseSpan(span)) {
    const { attributes, startTime, name, endTime, status, links } = span;
    return {
      span_id,
      trace_id,
      data: attributes,
      description: name,
      parent_span_id: getOtelParentSpanId(span),
      start_timestamp: spanTimeInputToSeconds(startTime),
      // This is [0,0] by default in OTEL, in which case we want to interpret this as no end time
      timestamp: spanTimeInputToSeconds(endTime) || void 0,
      status: getStatusMessage(status),
      op: attributes[SEMANTIC_ATTRIBUTE_SENTRY_OP],
      origin: attributes[SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN],
      links: convertSpanLinksForEnvelope(links)
    };
  }
  return {
    span_id,
    trace_id,
    start_timestamp: 0,
    data: {}
  };
}
function spanToStreamedSpanJSON(span) {
  if (spanIsSentrySpan(span)) {
    return span.getStreamedSpanJSON();
  }
  const { spanId: span_id, traceId: trace_id } = span.spanContext();
  if (spanIsOpenTelemetrySdkTraceBaseSpan(span)) {
    const { attributes, startTime, name, endTime, status, links } = span;
    return {
      name,
      span_id,
      trace_id,
      parent_span_id: getOtelParentSpanId(span),
      start_timestamp: spanTimeInputToSeconds(startTime),
      end_timestamp: spanTimeInputToSeconds(endTime),
      is_segment: span === INTERNAL_getSegmentSpan(span),
      status: getSimpleStatus(status),
      attributes: addStatusMessageAttribute(attributes, status),
      links: getStreamedSpanLinks(links)
    };
  }
  return {
    span_id,
    trace_id,
    start_timestamp: 0,
    name: "",
    end_timestamp: 0,
    status: "ok",
    is_segment: span === INTERNAL_getSegmentSpan(span)
  };
}
function getOtelParentSpanId(span) {
  return "parentSpanId" in span ? span.parentSpanId : "parentSpanContext" in span ? span.parentSpanContext?.spanId : void 0;
}
function streamedSpanJsonToSerializedSpan(spanJson) {
  return {
    ...spanJson,
    attributes: serializeAttributes(spanJson.attributes),
    links: spanJson.links?.map((link) => ({
      ...link,
      attributes: serializeAttributes(link.attributes)
    }))
  };
}
function spanIsOpenTelemetrySdkTraceBaseSpan(span) {
  const castSpan = span;
  return !!castSpan.attributes && !!castSpan.startTime && !!castSpan.name && !!castSpan.endTime && !!castSpan.status;
}
function spanIsSentrySpan(span) {
  return typeof span.getSpanJSON === "function";
}
function spanIsSampled(span) {
  const { traceFlags } = span.spanContext();
  return traceFlags === TRACE_FLAG_SAMPLED;
}
function getStatusMessage(status) {
  if (!status || status.code === SPAN_STATUS_UNSET) {
    return void 0;
  }
  if (status.code === SPAN_STATUS_OK) {
    return "ok";
  }
  return status.message || "internal_error";
}
function getSimpleStatus(status) {
  return !status || status.code === SPAN_STATUS_OK || status.code === SPAN_STATUS_UNSET || status.message === "cancelled" ? "ok" : "error";
}
function addStatusMessageAttribute(attributes, status) {
  const statusMessage = getSimpleStatus(status) === "error" ? status?.message : void 0;
  return {
    ...statusMessage && { [SEMANTIC_ATTRIBUTE_SENTRY_STATUS_MESSAGE]: statusMessage },
    ...attributes
  };
}
function addChildSpanToSpan(span, childSpan) {
  const rootSpan = span[ROOT_SPAN_FIELD] || span;
  addNonEnumerableProperty(childSpan, ROOT_SPAN_FIELD, rootSpan);
  if (span[CHILD_SPANS_FIELD]) {
    span[CHILD_SPANS_FIELD].add(childSpan);
  } else {
    addNonEnumerableProperty(span, CHILD_SPANS_FIELD, /* @__PURE__ */ new Set([childSpan]));
  }
}
function getSpanDescendants(span) {
  const resultSet = /* @__PURE__ */ new Set();
  function addSpanChildren(span2) {
    if (resultSet.has(span2)) {
      return;
    } else if (spanIsSampled(span2)) {
      resultSet.add(span2);
      const childSpans = span2[CHILD_SPANS_FIELD] ? Array.from(span2[CHILD_SPANS_FIELD]) : [];
      for (const childSpan of childSpans) {
        addSpanChildren(childSpan);
      }
    }
  }
  __name(addSpanChildren, "addSpanChildren");
  addSpanChildren(span);
  return Array.from(resultSet);
}
function INTERNAL_getSegmentSpan(span) {
  return span[ROOT_SPAN_FIELD] || span;
}
function getActiveSpan() {
  const carrier = getMainCarrier();
  const acs = getAsyncContextStrategy(carrier);
  if (acs.getActiveSpan) {
    return acs.getActiveSpan();
  }
  return _getSpanForScope(getCurrentScope());
}
function showSpanDropWarning() {
  if (!hasShownSpanDropWarning) {
    consoleSandbox(() => {
      console.warn(
        "[Sentry] Returning null from `beforeSendSpan` is disallowed. To drop certain spans, configure the respective integrations directly or use `ignoreSpans`."
      );
    });
    hasShownSpanDropWarning = true;
  }
}
function updateSpanName(span, name) {
  span.updateName(name);
  span.setAttributes({
    [SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: "custom",
    [SEMANTIC_ATTRIBUTE_SENTRY_CUSTOM_SPAN_NAME]: name
  });
}
var TRACE_FLAG_NONE, TRACE_FLAG_SAMPLED, hasShownSpanDropWarning, CHILD_SPANS_FIELD, ROOT_SPAN_FIELD, getRootSpan;
var init_spanUtils = __esm({
  "node_modules/@sentry/core/build/esm/utils/spanUtils.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_asyncContext();
    init_attributes();
    init_carrier();
    init_currentScopes();
    init_semanticAttributes();
    init_spanstatus();
    init_utils();
    init_object();
    init_propagationContext();
    init_time();
    init_tracing();
    init_debug_logger();
    init_spanOnScope();
    TRACE_FLAG_NONE = 0;
    TRACE_FLAG_SAMPLED = 1;
    hasShownSpanDropWarning = false;
    __name(spanToTransactionTraceContext, "spanToTransactionTraceContext");
    __name(spanToTraceContext, "spanToTraceContext");
    __name(spanToTraceHeader, "spanToTraceHeader");
    __name(spanToTraceparentHeader, "spanToTraceparentHeader");
    __name(convertSpanLinksForEnvelope, "convertSpanLinksForEnvelope");
    __name(getStreamedSpanLinks, "getStreamedSpanLinks");
    __name(spanTimeInputToSeconds, "spanTimeInputToSeconds");
    __name(ensureTimestampInSeconds, "ensureTimestampInSeconds");
    __name(spanToJSON, "spanToJSON");
    __name(spanToStreamedSpanJSON, "spanToStreamedSpanJSON");
    __name(getOtelParentSpanId, "getOtelParentSpanId");
    __name(streamedSpanJsonToSerializedSpan, "streamedSpanJsonToSerializedSpan");
    __name(spanIsOpenTelemetrySdkTraceBaseSpan, "spanIsOpenTelemetrySdkTraceBaseSpan");
    __name(spanIsSentrySpan, "spanIsSentrySpan");
    __name(spanIsSampled, "spanIsSampled");
    __name(getStatusMessage, "getStatusMessage");
    __name(getSimpleStatus, "getSimpleStatus");
    __name(addStatusMessageAttribute, "addStatusMessageAttribute");
    CHILD_SPANS_FIELD = "_sentryChildSpans";
    ROOT_SPAN_FIELD = "_sentryRootSpan";
    __name(addChildSpanToSpan, "addChildSpanToSpan");
    __name(getSpanDescendants, "getSpanDescendants");
    getRootSpan = INTERNAL_getSegmentSpan;
    __name(INTERNAL_getSegmentSpan, "INTERNAL_getSegmentSpan");
    __name(getActiveSpan, "getActiveSpan");
    __name(showSpanDropWarning, "showSpanDropWarning");
    __name(updateSpanName, "updateSpanName");
  }
});

// node_modules/@sentry/core/build/esm/utils/hasSpansEnabled.js
function hasSpansEnabled(maybeOptions) {
  if (typeof __SENTRY_TRACING__ === "boolean" && !__SENTRY_TRACING__) {
    return false;
  }
  const options = maybeOptions || getClient()?.getOptions();
  return !!options && // Note: This check is `!= null`, meaning "nullish". `0` is not "nullish", `undefined` and `null` are. (This comment was brought to you by 15 minutes of questioning life)
  (options.tracesSampleRate != null || !!options.tracesSampler);
}
var init_hasSpansEnabled = __esm({
  "node_modules/@sentry/core/build/esm/utils/hasSpansEnabled.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_currentScopes();
    __name(hasSpansEnabled, "hasSpansEnabled");
  }
});

// node_modules/@sentry/core/build/esm/utils/should-ignore-span.js
function logIgnoredSpan(droppedSpan) {
  debug.log(`Ignoring span ${droppedSpan.op} - ${droppedSpan.description} because it matches \`ignoreSpans\`.`);
}
function shouldIgnoreSpan(span, ignoreSpans) {
  if (!ignoreSpans?.length) {
    return false;
  }
  for (const pattern of ignoreSpans) {
    if (isStringOrRegExp(pattern)) {
      if (span.description && isMatchingPattern(span.description, pattern)) {
        DEBUG_BUILD && logIgnoredSpan(span);
        return true;
      }
      continue;
    }
    const hasAttributes = !!pattern.attributes && Object.keys(pattern.attributes).length > 0;
    if (!pattern.name && !pattern.op && !hasAttributes) {
      continue;
    }
    const nameMatches = pattern.name ? span.description && isMatchingPattern(span.description, pattern.name) : true;
    const opMatches = pattern.op ? span.op && isMatchingPattern(span.op, pattern.op) : true;
    const attrsMatch = pattern.attributes ? Object.entries(pattern.attributes).every(
      ([key, valuePattern]) => _matchesAttributeValue(span.attributes?.[key], valuePattern)
    ) : true;
    if (nameMatches && opMatches && attrsMatch) {
      DEBUG_BUILD && logIgnoredSpan(span);
      return true;
    }
  }
  return false;
}
function _matchesAttributeValue(actual, pat) {
  if (typeof actual === "string" && (typeof pat === "string" || pat instanceof RegExp)) {
    return isMatchingPattern(actual, pat);
  }
  if (Array.isArray(actual) && Array.isArray(pat)) {
    return actual.length === pat.length && actual.every((v, i) => v === pat[i]);
  }
  return actual === pat;
}
function reparentChildSpans(spans, dropSpan) {
  const droppedSpanParentId = dropSpan.parent_span_id;
  const droppedSpanId = dropSpan.span_id;
  if (!droppedSpanParentId) {
    return;
  }
  for (const span of spans) {
    if (span.parent_span_id === droppedSpanId) {
      span.parent_span_id = droppedSpanParentId;
    }
  }
}
function isStringOrRegExp(value) {
  return typeof value === "string" || value instanceof RegExp;
}
var init_should_ignore_span = __esm({
  "node_modules/@sentry/core/build/esm/utils/should-ignore-span.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_debug_build();
    init_debug_logger();
    init_string();
    __name(logIgnoredSpan, "logIgnoredSpan");
    __name(shouldIgnoreSpan, "shouldIgnoreSpan");
    __name(_matchesAttributeValue, "_matchesAttributeValue");
    __name(reparentChildSpans, "reparentChildSpans");
    __name(isStringOrRegExp, "isStringOrRegExp");
  }
});

// node_modules/@sentry/core/build/esm/tracing/sentryNonRecordingSpan.js
function spanIsNonRecordingSpan(span) {
  return !!span && span[NON_RECORDING_SPAN_FIELD] === true;
}
var NON_RECORDING_SPAN_FIELD, SentryNonRecordingSpan;
var init_sentryNonRecordingSpan = __esm({
  "node_modules/@sentry/core/build/esm/tracing/sentryNonRecordingSpan.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_object();
    init_propagationContext();
    init_spanUtils();
    NON_RECORDING_SPAN_FIELD = /* @__PURE__ */ Symbol.for("sentry.nonRecordingSpan");
    SentryNonRecordingSpan = class {
      constructor(spanContext = {}) {
        this._traceId = spanContext.traceId || generateTraceId();
        this._spanId = spanContext.spanId || generateSpanId();
        this.dropReason = spanContext.dropReason;
        addNonEnumerableProperty(this, NON_RECORDING_SPAN_FIELD, true);
      }
      /** @inheritdoc */
      spanContext() {
        return {
          spanId: this._spanId,
          traceId: this._traceId,
          traceFlags: TRACE_FLAG_NONE
        };
      }
      /** @inheritdoc */
      end(_timestamp) {
      }
      /** @inheritdoc */
      setAttribute(_key, _value) {
        return this;
      }
      /** @inheritdoc */
      setAttributes(_values) {
        return this;
      }
      /** @inheritdoc */
      setStatus(_status) {
        return this;
      }
      /** @inheritdoc */
      updateName(_name) {
        return this;
      }
      /** @inheritdoc */
      isRecording() {
        return false;
      }
      /** @inheritdoc */
      addEvent(_name, _attributesOrStartTime, _startTime) {
        return this;
      }
      /** @inheritDoc */
      addLink(_link) {
        return this;
      }
      /** @inheritDoc */
      addLinks(_links) {
        return this;
      }
      /**
       * This should generally not be used,
       * but we need it for being compliant with the OTEL Span interface.
       *
       * @hidden
       * @internal
       */
      recordException(_exception, _time) {
      }
    };
    __name(SentryNonRecordingSpan, "SentryNonRecordingSpan");
    __name(spanIsNonRecordingSpan, "spanIsNonRecordingSpan");
  }
});

// node_modules/@sentry/core/build/esm/constants.js
var DEFAULT_ENVIRONMENT;
var init_constants = __esm({
  "node_modules/@sentry/core/build/esm/constants.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    DEFAULT_ENVIRONMENT = "production";
  }
});

// node_modules/@sentry/core/build/esm/tracing/dynamicSamplingContext.js
function freezeDscOnSpan(span, dsc) {
  const spanWithMaybeDsc = span;
  addNonEnumerableProperty(spanWithMaybeDsc, FROZEN_DSC_FIELD, dsc);
}
function getDynamicSamplingContextFromClient(trace_id, client) {
  const options = client.getOptions();
  const { publicKey: public_key } = client.getDsn() || {};
  const dsc = {
    environment: options.environment || DEFAULT_ENVIRONMENT,
    release: options.release,
    public_key,
    trace_id,
    org_id: extractOrgIdFromClient(client)
  };
  client.emit("createDsc", dsc);
  return dsc;
}
function getDynamicSamplingContextFromScope(client, scope) {
  const propagationContext = scope.getPropagationContext();
  return propagationContext.dsc || getDynamicSamplingContextFromClient(propagationContext.traceId, client);
}
function getDynamicSamplingContextFromSpan(span) {
  const client = getClient();
  if (!client) {
    return {};
  }
  const rootSpan = getRootSpan(span);
  const rootSpanJson = spanToJSON(rootSpan);
  const rootSpanAttributes = rootSpanJson.data;
  const traceState = rootSpan.spanContext().traceState;
  const rootSpanSampleRate = traceState?.get("sentry.sample_rate") ?? rootSpanAttributes[SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE] ?? rootSpanAttributes[SEMANTIC_ATTRIBUTE_SENTRY_PREVIOUS_TRACE_SAMPLE_RATE];
  function applyLocalSampleRateToDsc(dsc2) {
    if (typeof rootSpanSampleRate === "number" || typeof rootSpanSampleRate === "string") {
      dsc2.sample_rate = `${rootSpanSampleRate}`;
    }
    return dsc2;
  }
  __name(applyLocalSampleRateToDsc, "applyLocalSampleRateToDsc");
  const frozenDsc = rootSpan[FROZEN_DSC_FIELD];
  if (frozenDsc) {
    return applyLocalSampleRateToDsc(frozenDsc);
  }
  const isNonRecordingRoot = spanIsNonRecordingSpan(rootSpan);
  const isIgnoredRoot = isNonRecordingRoot && rootSpan.dropReason === "ignored";
  if (isNonRecordingRoot && (!hasSpansEnabled(client.getOptions()) || isIgnoredRoot)) {
    const capturedScope = getCapturedScopesOnSpan(rootSpan).scope;
    if (capturedScope) {
      const dsc2 = { ...getDynamicSamplingContextFromScope(client, capturedScope) };
      if (isIgnoredRoot) {
        dsc2.sampled = "false";
      }
      return applyLocalSampleRateToDsc(dsc2);
    }
  }
  const traceStateDsc = traceState?.get("sentry.dsc");
  const dscOnTraceState = traceStateDsc && baggageHeaderToDynamicSamplingContext(traceStateDsc);
  if (dscOnTraceState) {
    return applyLocalSampleRateToDsc(dscOnTraceState);
  }
  const dsc = getDynamicSamplingContextFromClient(span.spanContext().traceId, client);
  const source = rootSpanAttributes[SEMANTIC_ATTRIBUTE_SENTRY_SOURCE] ?? rootSpanAttributes["sentry.segment.name.source"];
  const name = rootSpanJson.description;
  if (source !== "url" && name) {
    dsc.transaction = name;
  }
  if (hasSpansEnabled()) {
    dsc.sampled = String(spanIsSampled(rootSpan));
    dsc.sample_rand = // In OTEL we store the sample rand on the trace state because we cannot access scopes for NonRecordingSpans
    // The Sentry OTEL SpanSampler takes care of writing the sample rand on the root span
    traceState?.get("sentry.sample_rand") ?? // On all other platforms we can actually get the scopes from a root span (we use this as a fallback)
    getCapturedScopesOnSpan(rootSpan).scope?.getPropagationContext().sampleRand.toString();
  }
  applyLocalSampleRateToDsc(dsc);
  client.emit("createDsc", dsc, rootSpan);
  return dsc;
}
var FROZEN_DSC_FIELD;
var init_dynamicSamplingContext = __esm({
  "node_modules/@sentry/core/build/esm/tracing/dynamicSamplingContext.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_constants();
    init_currentScopes();
    init_semanticAttributes();
    init_baggage();
    init_dsn();
    init_hasSpansEnabled();
    init_object();
    init_spanUtils();
    init_sentryNonRecordingSpan();
    init_utils();
    FROZEN_DSC_FIELD = "_frozenDsc";
    __name(freezeDscOnSpan, "freezeDscOnSpan");
    __name(getDynamicSamplingContextFromClient, "getDynamicSamplingContextFromClient");
    __name(getDynamicSamplingContextFromScope, "getDynamicSamplingContextFromScope");
    __name(getDynamicSamplingContextFromSpan, "getDynamicSamplingContextFromSpan");
  }
});

// node_modules/@sentry/core/build/esm/tracing/spans/beforeSendSpan.js
function isStreamedBeforeSendSpanCallback(callback) {
  return !!callback && typeof callback === "function" && "_streamed" in callback && !!callback._streamed;
}
var init_beforeSendSpan = __esm({
  "node_modules/@sentry/core/build/esm/tracing/spans/beforeSendSpan.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    __name(isStreamedBeforeSendSpanCallback, "isStreamedBeforeSendSpanCallback");
  }
});

// node_modules/@sentry/core/build/esm/utils/envelope.js
function createEnvelope(headers, items = []) {
  return [headers, items];
}
function addItemToEnvelope(envelope, newItem) {
  const [headers, items] = envelope;
  return [headers, [...items, newItem]];
}
function forEachEnvelopeItem(envelope, callback) {
  const envelopeItems = envelope[1];
  for (const envelopeItem of envelopeItems) {
    const envelopeItemType = envelopeItem[0].type;
    const result = callback(envelopeItem, envelopeItemType);
    if (result) {
      return true;
    }
  }
  return false;
}
function envelopeContainsItemType(envelope, types) {
  return forEachEnvelopeItem(envelope, (_, type) => types.includes(type));
}
function encodeUTF8(input) {
  const carrier = getSentryCarrier(GLOBAL_OBJ);
  return carrier.encodePolyfill ? carrier.encodePolyfill(input) : new TextEncoder().encode(input);
}
function serializeEnvelope(envelope) {
  const [envHeaders, items] = envelope;
  let parts = JSON.stringify(envHeaders);
  function append(next) {
    if (typeof parts === "string") {
      parts = typeof next === "string" ? parts + next : [encodeUTF8(parts), next];
    } else {
      parts.push(typeof next === "string" ? encodeUTF8(next) : next);
    }
  }
  __name(append, "append");
  for (const item of items) {
    const [itemHeaders, payload] = item;
    append(`
${JSON.stringify(itemHeaders)}
`);
    if (typeof payload === "string" || payload instanceof Uint8Array) {
      append(payload);
    } else {
      let stringifiedPayload;
      try {
        stringifiedPayload = JSON.stringify(payload);
      } catch {
        stringifiedPayload = JSON.stringify(normalize(payload));
      }
      append(stringifiedPayload);
    }
  }
  return typeof parts === "string" ? parts : concatBuffers(parts);
}
function concatBuffers(buffers) {
  const totalLength = buffers.reduce((acc, buf) => acc + buf.length, 0);
  const merged = new Uint8Array(totalLength);
  let offset = 0;
  for (const buffer of buffers) {
    merged.set(buffer, offset);
    offset += buffer.length;
  }
  return merged;
}
function createSpanEnvelopeItem(spanJson) {
  const spanHeaders = {
    type: "span"
  };
  return [spanHeaders, spanJson];
}
function createAttachmentEnvelopeItem(attachment) {
  const buffer = typeof attachment.data === "string" ? encodeUTF8(attachment.data) : attachment.data;
  return [
    {
      type: "attachment",
      length: buffer.length,
      filename: attachment.filename,
      content_type: attachment.contentType,
      attachment_type: attachment.attachmentType
    },
    buffer
  ];
}
function _isOverriddenType(type) {
  return type in DATA_CATEGORY_OVERRIDES;
}
function envelopeItemTypeToDataCategory(type) {
  return _isOverriddenType(type) ? DATA_CATEGORY_OVERRIDES[type] : type;
}
function getSdkMetadataForEnvelopeHeader(metadataOrEvent) {
  if (!metadataOrEvent?.sdk) {
    return;
  }
  const { name, version } = metadataOrEvent.sdk;
  return { name, version };
}
function createEventEnvelopeHeaders(event, sdkInfo, tunnel, dsn) {
  const dynamicSamplingContext = event.sdkProcessingMetadata?.dynamicSamplingContext;
  return {
    event_id: event.event_id,
    sent_at: new Date(safeDateNow()).toISOString(),
    ...sdkInfo && { sdk: sdkInfo },
    ...!!tunnel && dsn && { dsn: dsnToString(dsn) },
    ...dynamicSamplingContext && {
      trace: dynamicSamplingContext
    }
  };
}
var DATA_CATEGORY_OVERRIDES;
var init_envelope = __esm({
  "node_modules/@sentry/core/build/esm/utils/envelope.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_carrier();
    init_dsn();
    init_normalize();
    init_randomSafeContext();
    init_worldwide();
    __name(createEnvelope, "createEnvelope");
    __name(addItemToEnvelope, "addItemToEnvelope");
    __name(forEachEnvelopeItem, "forEachEnvelopeItem");
    __name(envelopeContainsItemType, "envelopeContainsItemType");
    __name(encodeUTF8, "encodeUTF8");
    __name(serializeEnvelope, "serializeEnvelope");
    __name(concatBuffers, "concatBuffers");
    __name(createSpanEnvelopeItem, "createSpanEnvelopeItem");
    __name(createAttachmentEnvelopeItem, "createAttachmentEnvelopeItem");
    DATA_CATEGORY_OVERRIDES = {
      sessions: "session",
      event: "error",
      client_report: "internal",
      user_report: "default",
      profile_chunk: "profile",
      replay_event: "replay",
      replay_recording: "replay",
      check_in: "monitor",
      raw_security: "security",
      log: "log_item",
      trace_metric: "metric"
    };
    __name(_isOverriddenType, "_isOverriddenType");
    __name(envelopeItemTypeToDataCategory, "envelopeItemTypeToDataCategory");
    __name(getSdkMetadataForEnvelopeHeader, "getSdkMetadataForEnvelopeHeader");
    __name(createEventEnvelopeHeaders, "createEventEnvelopeHeaders");
  }
});

// node_modules/@sentry/core/build/esm/envelope.js
function _enhanceEventWithSdkInfo(event, newSdkInfo) {
  if (!newSdkInfo) {
    return event;
  }
  const eventSdkInfo = event.sdk || {};
  event.sdk = {
    ...eventSdkInfo,
    name: eventSdkInfo.name || newSdkInfo.name,
    version: eventSdkInfo.version || newSdkInfo.version,
    integrations: [...event.sdk?.integrations || [], ...newSdkInfo.integrations || []],
    packages: [...event.sdk?.packages || [], ...newSdkInfo.packages || []],
    settings: event.sdk?.settings || newSdkInfo.settings ? {
      ...event.sdk?.settings,
      ...newSdkInfo.settings
    } : void 0
  };
  return event;
}
function createSessionEnvelope(session, dsn, metadata, tunnel) {
  const sdkInfo = getSdkMetadataForEnvelopeHeader(metadata);
  const envelopeHeaders = {
    sent_at: new Date(safeDateNow()).toISOString(),
    ...sdkInfo && { sdk: sdkInfo },
    ...!!tunnel && dsn && { dsn: dsnToString(dsn) }
  };
  const envelopeItem = "aggregates" in session ? [{ type: "sessions" }, session] : [{ type: "session" }, session.toJSON()];
  return createEnvelope(envelopeHeaders, [envelopeItem]);
}
function createEventEnvelope(event, dsn, metadata, tunnel) {
  const sdkInfo = getSdkMetadataForEnvelopeHeader(metadata);
  const eventType = event.type && event.type !== "replay_event" ? event.type : "event";
  _enhanceEventWithSdkInfo(event, metadata?.sdk);
  const envelopeHeaders = createEventEnvelopeHeaders(event, sdkInfo, tunnel, dsn);
  delete event.sdkProcessingMetadata;
  const eventItem = [{ type: eventType }, event];
  return createEnvelope(envelopeHeaders, [eventItem]);
}
function createSpanEnvelope(spans, client) {
  function dscHasRequiredProps2(dsc2) {
    return !!dsc2.trace_id && !!dsc2.public_key;
  }
  __name(dscHasRequiredProps2, "dscHasRequiredProps");
  const dsc = getDynamicSamplingContextFromSpan(spans[0]);
  const dsn = client?.getDsn();
  const tunnel = client?.getOptions().tunnel;
  const headers = {
    sent_at: new Date(safeDateNow()).toISOString(),
    ...dscHasRequiredProps2(dsc) && { trace: dsc },
    ...!!tunnel && dsn && { dsn: dsnToString(dsn) }
  };
  const { beforeSendSpan, ignoreSpans } = client?.getOptions() || {};
  const filteredSpans = ignoreSpans?.length ? spans.filter((span) => {
    const json = spanToJSON(span);
    return !shouldIgnoreSpan({ description: json.description, op: json.op, attributes: json.data }, ignoreSpans);
  }) : spans;
  const droppedSpans = spans.length - filteredSpans.length;
  if (droppedSpans) {
    client?.recordDroppedEvent("before_send", "span", droppedSpans);
  }
  const convertToSpanJSON = beforeSendSpan ? (span) => {
    const spanJson = spanToJSON(span);
    const processedSpan = !isStreamedBeforeSendSpanCallback(beforeSendSpan) ? beforeSendSpan(spanJson) : spanJson;
    if (!processedSpan) {
      showSpanDropWarning();
      return spanJson;
    }
    return processedSpan;
  } : spanToJSON;
  const items = [];
  for (const span of filteredSpans) {
    const spanJson = convertToSpanJSON(span);
    if (spanJson) {
      items.push(createSpanEnvelopeItem(spanJson));
    }
  }
  return createEnvelope(headers, items);
}
var init_envelope2 = __esm({
  "node_modules/@sentry/core/build/esm/envelope.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_dynamicSamplingContext();
    init_beforeSendSpan();
    init_dsn();
    init_envelope();
    init_randomSafeContext();
    init_should_ignore_span();
    init_spanUtils();
    __name(_enhanceEventWithSdkInfo, "_enhanceEventWithSdkInfo");
    __name(createSessionEnvelope, "createSessionEnvelope");
    __name(createEventEnvelope, "createEventEnvelope");
    __name(createSpanEnvelope, "createSpanEnvelope");
  }
});

// node_modules/@sentry/core/build/esm/tracing/logSpans.js
function logSpanStart(span) {
  if (!DEBUG_BUILD)
    return;
  const { description = "< unknown name >", op = "< unknown op >", parent_span_id: parentSpanId } = spanToJSON(span);
  const { spanId } = span.spanContext();
  const sampled = spanIsSampled(span);
  const rootSpan = getRootSpan(span);
  const isRootSpan = rootSpan === span;
  const header = `[Tracing] Starting ${sampled ? "sampled" : "unsampled"} ${isRootSpan ? "root " : ""}span`;
  const infoParts = [`op: ${op}`, `name: ${description}`, `ID: ${spanId}`];
  if (parentSpanId) {
    infoParts.push(`parent ID: ${parentSpanId}`);
  }
  if (!isRootSpan) {
    const { op: op2, description: description2 } = spanToJSON(rootSpan);
    infoParts.push(`root ID: ${rootSpan.spanContext().spanId}`);
    if (op2) {
      infoParts.push(`root op: ${op2}`);
    }
    if (description2) {
      infoParts.push(`root description: ${description2}`);
    }
  }
  debug.log(`${header}
  ${infoParts.join("\n  ")}`);
}
function logSpanEnd(span) {
  if (!DEBUG_BUILD)
    return;
  const { description = "< unknown name >", op = "< unknown op >" } = spanToJSON(span);
  const { spanId } = span.spanContext();
  const rootSpan = getRootSpan(span);
  const isRootSpan = rootSpan === span;
  const msg = `[Tracing] Finishing "${op}" ${isRootSpan ? "root " : ""}span "${description}" with ID ${spanId}`;
  debug.log(msg);
}
var init_logSpans = __esm({
  "node_modules/@sentry/core/build/esm/tracing/logSpans.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_debug_build();
    init_debug_logger();
    init_spanUtils();
    __name(logSpanStart, "logSpanStart");
    __name(logSpanEnd, "logSpanEnd");
  }
});

// node_modules/@sentry/core/build/esm/tracing/measurement.js
function timedEventsToMeasurements(events) {
  if (!events || events.length === 0) {
    return void 0;
  }
  const measurements = {};
  events.forEach((event) => {
    const attributes = event.attributes || {};
    const unit = attributes[SEMANTIC_ATTRIBUTE_SENTRY_MEASUREMENT_UNIT];
    const value = attributes[SEMANTIC_ATTRIBUTE_SENTRY_MEASUREMENT_VALUE];
    if (typeof unit === "string" && typeof value === "number") {
      measurements[event.name] = { value, unit };
    }
  });
  return measurements;
}
var init_measurement = __esm({
  "node_modules/@sentry/core/build/esm/tracing/measurement.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_semanticAttributes();
    __name(timedEventsToMeasurements, "timedEventsToMeasurements");
  }
});

// node_modules/@sentry/core/build/esm/tracing/segmentSpanCaptureStrategy.js
function getSegmentSpanCaptureStrategy() {
  return getSentryCarrier(getMainCarrier()).segmentSpanCaptureStrategy;
}
var init_segmentSpanCaptureStrategy = __esm({
  "node_modules/@sentry/core/build/esm/tracing/segmentSpanCaptureStrategy.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_carrier();
    __name(getSegmentSpanCaptureStrategy, "getSegmentSpanCaptureStrategy");
  }
});

// node_modules/@sentry/core/build/esm/tracing/spans/hasSpanStreamingEnabled.js
function hasSpanStreamingEnabled(client) {
  return client.getOptions().traceLifecycle === "stream";
}
var init_hasSpanStreamingEnabled = __esm({
  "node_modules/@sentry/core/build/esm/tracing/spans/hasSpanStreamingEnabled.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    __name(hasSpanStreamingEnabled, "hasSpanStreamingEnabled");
  }
});

// node_modules/@sentry/core/build/esm/tracing/sentrySpan.js
function isSpanTimeInput(value) {
  return value && typeof value === "number" || value instanceof Date || Array.isArray(value);
}
function isFullFinishedSpan(input) {
  return !!input.start_timestamp && !!input.timestamp && !!input.span_id && !!input.trace_id;
}
function isStandaloneSpan(span) {
  return span instanceof SentrySpan && span.isStandaloneSpan();
}
function sendSpanEnvelope(envelope) {
  const client = getClient();
  if (!client) {
    return;
  }
  const spanItems = envelope[1];
  if (!spanItems || spanItems.length === 0) {
    client.recordDroppedEvent("before_send", "span");
    return;
  }
  client.sendEnvelope(envelope);
}
var MAX_SPAN_COUNT, SentrySpan;
var init_sentrySpan = __esm({
  "node_modules/@sentry/core/build/esm/tracing/sentrySpan.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_currentScopes();
    init_debug_build();
    init_envelope2();
    init_semanticAttributes();
    init_debug_logger();
    init_propagationContext();
    init_spanUtils();
    init_time();
    init_dynamicSamplingContext();
    init_logSpans();
    init_measurement();
    init_segmentSpanCaptureStrategy();
    init_hasSpanStreamingEnabled();
    init_utils();
    MAX_SPAN_COUNT = 1e3;
    SentrySpan = class {
      /**
       * You should never call the constructor manually, always use `Sentry.startSpan()`
       * or other span methods.
       * @internal
       * @hideconstructor
       * @hidden
       */
      constructor(spanContext = {}) {
        this._traceId = spanContext.traceId || generateTraceId();
        this._spanId = spanContext.spanId || generateSpanId();
        this._startTime = spanContext.startTimestamp || timestampInSeconds();
        this._links = spanContext.links;
        this._attributes = {};
        this.setAttributes({
          [SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: "manual",
          [SEMANTIC_ATTRIBUTE_SENTRY_OP]: spanContext.op,
          ...spanContext.attributes
        });
        this._name = spanContext.name;
        if (spanContext.parentSpanId) {
          this._parentSpanId = spanContext.parentSpanId;
        }
        if ("sampled" in spanContext) {
          this._sampled = spanContext.sampled;
        }
        if (spanContext.endTimestamp) {
          this._endTime = spanContext.endTimestamp;
        }
        this._events = [];
        this._isStandaloneSpan = spanContext.isStandalone;
        if (this._endTime) {
          this._onSpanEnded();
        }
      }
      /** @inheritDoc */
      addLink(link) {
        if (this._frozen) {
          return this;
        }
        if (this._links) {
          this._links.push(link);
        } else {
          this._links = [link];
        }
        return this;
      }
      /** @inheritDoc */
      addLinks(links) {
        if (this._frozen) {
          return this;
        }
        if (this._links) {
          this._links.push(...links);
        } else {
          this._links = links;
        }
        return this;
      }
      /**
       * This should generally not be used,
       * but it is needed for being compliant with the OTEL Span interface.
       *
       * @hidden
       * @internal
       */
      recordException(_exception, _time) {
      }
      /** @inheritdoc */
      spanContext() {
        const { _spanId: spanId, _traceId: traceId, _sampled: sampled } = this;
        return {
          spanId,
          traceId,
          traceFlags: sampled ? TRACE_FLAG_SAMPLED : TRACE_FLAG_NONE
        };
      }
      /** @inheritdoc */
      setAttribute(key, value) {
        if (this._frozen) {
          return this;
        }
        if (value === void 0) {
          delete this._attributes[key];
        } else {
          this._attributes[key] = value;
        }
        if (key === SEMANTIC_ATTRIBUTE_SENTRY_SOURCE && value !== void 0 && spanShouldInferOtelSource(this)) {
          markSpanSourceAsExplicit(this);
        }
        return this;
      }
      /** @inheritdoc */
      setAttributes(attributes) {
        Object.keys(attributes).forEach((key) => this.setAttribute(key, attributes[key]));
        return this;
      }
      /**
       * This should generally not be used,
       * but we need it for browser tracing where we want to adjust the start time afterwards.
       * USE THIS WITH CAUTION!
       *
       * @hidden
       * @internal
       */
      updateStartTime(timeInput) {
        if (this._frozen) {
          return;
        }
        this._startTime = spanTimeInputToSeconds(timeInput);
      }
      /**
       * @inheritDoc
       */
      setStatus(value) {
        if (this._frozen) {
          return this;
        }
        this._status = value;
        return this;
      }
      /**
       * @inheritDoc
       */
      updateName(name) {
        if (this._frozen) {
          return this;
        }
        this._name = name;
        if (!spanShouldInferOtelSource(this)) {
          this.setAttribute(SEMANTIC_ATTRIBUTE_SENTRY_SOURCE, "custom");
        }
        return this;
      }
      /** @inheritdoc */
      end(endTimestamp) {
        if (this._endTime) {
          this._frozen = spanIsTracerProviderSpan(this);
          return;
        }
        this._endTime = spanTimeInputToSeconds(endTimestamp);
        logSpanEnd(this);
        this._onSpanEnded();
        this._frozen = spanIsTracerProviderSpan(this);
      }
      /**
       * Get JSON representation of this span.
       *
       * @hidden
       * @internal This method is purely for internal purposes and should not be used outside
       * of SDK code. If you need to get a JSON representation of a span,
       * use `spanToJSON(span)` instead.
       */
      getSpanJSON() {
        return {
          data: this._attributes,
          description: this._name,
          op: this._attributes[SEMANTIC_ATTRIBUTE_SENTRY_OP],
          parent_span_id: this._parentSpanId,
          span_id: this._spanId,
          start_timestamp: this._startTime,
          status: getStatusMessage(this._status),
          timestamp: this._endTime,
          trace_id: this._traceId,
          origin: this._attributes[SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN],
          profile_id: this._attributes[SEMANTIC_ATTRIBUTE_PROFILE_ID],
          exclusive_time: this._attributes[SEMANTIC_ATTRIBUTE_EXCLUSIVE_TIME],
          measurements: timedEventsToMeasurements(this._events),
          is_segment: this._isStandaloneSpan && getRootSpan(this) === this || void 0,
          segment_id: this._isStandaloneSpan ? getRootSpan(this).spanContext().spanId : void 0,
          links: convertSpanLinksForEnvelope(this._links)
        };
      }
      /**
       * Get {@link StreamedSpanJSON} representation of this span.
       *
       * @hidden
       * @internal This method is purely for internal purposes and should not be used outside
       * of SDK code. If you need to get a JSON representation of a span,
       * use `spanToStreamedSpanJSON(span)` instead.
       */
      getStreamedSpanJSON() {
        return {
          name: this._name ?? "",
          span_id: this._spanId,
          trace_id: this._traceId,
          parent_span_id: this._parentSpanId,
          start_timestamp: this._startTime,
          // just in case _endTime is not set, we use the start time (i.e. duration 0)
          end_timestamp: this._endTime ?? this._startTime,
          is_segment: this._isStandaloneSpan || this === getRootSpan(this),
          status: getSimpleStatus(this._status),
          attributes: addStatusMessageAttribute(this._attributes, this._status),
          links: getStreamedSpanLinks(this._links)
        };
      }
      /** @inheritdoc */
      isRecording() {
        return !this._endTime && !!this._sampled;
      }
      /**
       * @inheritdoc
       */
      addEvent(name, attributesOrStartTime, startTime) {
        if (this._frozen) {
          return this;
        }
        DEBUG_BUILD && debug.log("[Tracing] Adding an event to span:", name);
        const time = isSpanTimeInput(attributesOrStartTime) ? attributesOrStartTime : startTime || timestampInSeconds();
        const attributes = isSpanTimeInput(attributesOrStartTime) ? {} : attributesOrStartTime || {};
        const event = {
          name,
          time: spanTimeInputToSeconds(time),
          attributes
        };
        this._events.push(event);
        return this;
      }
      /**
       * This method should generally not be used,
       * but for now we need a way to publicly check if the `_isStandaloneSpan` flag is set.
       * USE THIS WITH CAUTION!
       * @internal
       * @hidden
       * @experimental
       */
      isStandaloneSpan() {
        return !!this._isStandaloneSpan;
      }
      /** Emit `spanEnd` when the span is ended. */
      _onSpanEnded() {
        const client = getClient();
        if (client) {
          client.emit("spanEnd", this);
          if (!this._isStandaloneSpan) {
            client.emit("afterSpanEnd", this);
          }
        }
        const rootSpan = getRootSpan(this);
        const isSegmentSpan = this._isStandaloneSpan || this === rootSpan;
        if (this._isStandaloneSpan) {
          if (this._sampled) {
            sendSpanEnvelope(createSpanEnvelope([this], client));
          } else {
            DEBUG_BUILD && debug.log("[Tracing] Discarding standalone span because its trace was not chosen to be sampled.");
            if (client) {
              client.recordDroppedEvent("sample_rate", "span");
            }
          }
          return;
        }
        if (!isSegmentSpan) {
          const strategy2 = getSegmentSpanCaptureStrategy();
          if (strategy2) {
            const scope2 = getCapturedScopesOnSpan(this).scope || getCurrentScope();
            strategy2.onChildSpanEnded(this, rootSpan, (options) => this._convertSpanToTransaction(options), scope2);
          }
          return;
        }
        if (client && hasSpanStreamingEnabled(client)) {
          client.emit("afterSegmentSpanEnd", this);
          return;
        }
        const scope = getCapturedScopesOnSpan(this).scope || getCurrentScope();
        const strategy = getSegmentSpanCaptureStrategy();
        if (strategy) {
          strategy.onSegmentSpanEnded((options) => this._convertSpanToTransaction(options), scope);
        } else {
          const transactionEvent = this._convertSpanToTransaction();
          if (transactionEvent) {
            scope.captureEvent(transactionEvent);
          }
        }
      }
      /**
       * Finish the transaction & prepare the event to send to Sentry.
       */
      _convertSpanToTransaction(options = {}) {
        if (!isFullFinishedSpan(spanToJSON(this))) {
          return void 0;
        }
        if (!this._name) {
          DEBUG_BUILD && debug.warn("Transaction has no name, falling back to `<unlabeled transaction>`.");
          this._name = "<unlabeled transaction>";
        }
        const { scope: capturedSpanScope, isolationScope: capturedSpanIsolationScope } = getCapturedScopesOnSpan(this);
        const normalizedRequest = capturedSpanScope?.getScopeData().sdkProcessingMetadata?.normalizedRequest;
        if (this._sampled !== true) {
          return void 0;
        }
        options.onSpanCaptured?.(this);
        const spans = [];
        for (const descendant of getSpanDescendants(this)) {
          if (descendant === this || isStandaloneSpan(descendant) || options.isSpanAlreadyCaptured?.(descendant)) {
            continue;
          }
          const spanJSON = spanToJSON(descendant);
          if (!isFullFinishedSpan(spanJSON)) {
            continue;
          }
          options.onSpanCaptured?.(descendant);
          spans.push(spanJSON);
        }
        const source = this._attributes[SEMANTIC_ATTRIBUTE_SENTRY_SOURCE];
        delete this._attributes[SEMANTIC_ATTRIBUTE_SENTRY_CUSTOM_SPAN_NAME];
        let hasGenAiSpans = false;
        spans.forEach((span) => {
          delete span.data[SEMANTIC_ATTRIBUTE_SENTRY_CUSTOM_SPAN_NAME];
          if (span.op?.startsWith("gen_ai.")) {
            hasGenAiSpans = true;
          }
        });
        const transaction = {
          contexts: {
            trace: spanToTransactionTraceContext(this)
          },
          spans: (
            // spans.sort() mutates the array, but `spans` is already a copy so we can safely do this here
            // we do not use spans anymore after this point
            spans.length > MAX_SPAN_COUNT ? spans.sort((a, b) => a.start_timestamp - b.start_timestamp).slice(0, MAX_SPAN_COUNT) : spans
          ),
          start_timestamp: this._startTime,
          timestamp: this._endTime,
          transaction: this._name,
          type: "transaction",
          sdkProcessingMetadata: {
            capturedSpanScope,
            capturedSpanIsolationScope,
            dynamicSamplingContext: getDynamicSamplingContextFromSpan(this),
            hasGenAiSpans
          },
          request: normalizedRequest,
          ...source && {
            transaction_info: {
              source
            }
          }
        };
        const measurements = timedEventsToMeasurements(this._events);
        const hasMeasurements = measurements && Object.keys(measurements).length;
        if (hasMeasurements) {
          DEBUG_BUILD && debug.log(
            "[Measurements] Adding measurements to transaction event",
            JSON.stringify(measurements, void 0, 2)
          );
          transaction.measurements = measurements;
        }
        return transaction;
      }
    };
    __name(SentrySpan, "SentrySpan");
    __name(isSpanTimeInput, "isSpanTimeInput");
    __name(isFullFinishedSpan, "isFullFinishedSpan");
    __name(isStandaloneSpan, "isStandaloneSpan");
    __name(sendSpanEnvelope, "sendSpanEnvelope");
  }
});

// node_modules/@sentry/core/build/esm/utils/handleCallbackErrors.js
function handleCallbackErrors(fn, onError, onFinally = () => {
}, onSuccess = () => {
}) {
  let maybePromiseResult;
  try {
    maybePromiseResult = fn();
  } catch (e) {
    onError(e);
    onFinally();
    throw e;
  }
  return maybeHandlePromiseRejection(maybePromiseResult, onError, onFinally, onSuccess);
}
function maybeHandlePromiseRejection(value, onError, onFinally, onSuccess) {
  if (isThenable(value)) {
    return chainAndCopyPromiseLike(
      value,
      (result) => {
        onFinally();
        onSuccess(result);
      },
      (err) => {
        onError(err);
        onFinally();
      }
    );
  }
  onFinally();
  onSuccess(value);
  return value;
}
var init_handleCallbackErrors = __esm({
  "node_modules/@sentry/core/build/esm/utils/handleCallbackErrors.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_chain_and_copy_promiselike();
    init_is();
    __name(handleCallbackErrors, "handleCallbackErrors");
    __name(maybeHandlePromiseRejection, "maybeHandlePromiseRejection");
  }
});

// node_modules/@sentry/core/build/esm/tracing/sampling.js
function sampleSpan(options, samplingContext, sampleRand) {
  if (!hasSpansEnabled(options)) {
    return [false];
  }
  let localSampleRateWasApplied = void 0;
  let sampleRate;
  if (typeof options.tracesSampler === "function") {
    sampleRate = options.tracesSampler({
      ...samplingContext,
      inheritOrSampleWith: (fallbackSampleRate) => {
        if (typeof samplingContext.parentSampleRate === "number") {
          return samplingContext.parentSampleRate;
        }
        if (typeof samplingContext.parentSampled === "boolean") {
          return Number(samplingContext.parentSampled);
        }
        return fallbackSampleRate;
      }
    });
    localSampleRateWasApplied = true;
  } else if (samplingContext.parentSampled !== void 0) {
    sampleRate = samplingContext.parentSampled;
  } else if (typeof options.tracesSampleRate !== "undefined") {
    sampleRate = options.tracesSampleRate;
    localSampleRateWasApplied = true;
  }
  const parsedSampleRate = parseSampleRate(sampleRate);
  if (parsedSampleRate === void 0) {
    DEBUG_BUILD && debug.warn(
      `[Tracing] Discarding root span because of invalid sample rate. Sample rate must be a boolean or a number between 0 and 1. Got ${JSON.stringify(
        sampleRate
      )} of type ${JSON.stringify(typeof sampleRate)}.`
    );
    return [false];
  }
  if (!parsedSampleRate) {
    DEBUG_BUILD && debug.log(
      `[Tracing] Discarding transaction because ${typeof options.tracesSampler === "function" ? "tracesSampler returned 0 or false" : "a negative sampling decision was inherited or tracesSampleRate is set to 0"}`
    );
    return [false, parsedSampleRate, localSampleRateWasApplied];
  }
  const shouldSample = sampleRand < parsedSampleRate;
  if (!shouldSample) {
    DEBUG_BUILD && debug.log(
      `[Tracing] Discarding transaction because it's not included in the random sample (sampling rate = ${Number(
        sampleRate
      )})`
    );
  }
  return [shouldSample, parsedSampleRate, localSampleRateWasApplied];
}
var init_sampling = __esm({
  "node_modules/@sentry/core/build/esm/tracing/sampling.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_debug_build();
    init_debug_logger();
    init_hasSpansEnabled();
    init_parseSampleRate();
    __name(sampleSpan, "sampleSpan");
  }
});

// node_modules/@sentry/core/build/esm/tracing/trace.js
function startSpan(options, callback) {
  const acs = getAcs();
  if (acs.startSpan) {
    return acs.startSpan(options, callback);
  }
  const spanArguments = parseSentrySpanArguments(options);
  const { forceTransaction, parentSpan: customParentSpan, scope: customScope } = options;
  const customForkedScope = customScope?.clone();
  return withScope2(customForkedScope, () => {
    const wrapper = getActiveSpanWrapper(customParentSpan);
    return wrapper(() => {
      const scope = getCurrentScope();
      const parentSpan = getParentSpan(scope, customParentSpan);
      const client = getClient();
      const missingRequiredParent = options.onlyIfParent && !parentSpan;
      const activeSpan = missingRequiredParent ? startMissingRequiredParentSpan(scope, client) : createChildOrRootSpan({
        parentSpan,
        spanArguments,
        forceTransaction,
        scope
      });
      if (!spanIsIgnored(activeSpan) || !parentSpan) {
        _setSpanForScope(scope, activeSpan);
      }
      return handleCallbackErrors(
        () => callback(activeSpan),
        () => {
          const { status } = spanToJSON(activeSpan);
          if (activeSpan.isRecording() && (!status || status === "ok")) {
            activeSpan.setStatus({ code: SPAN_STATUS_ERROR, message: "internal_error" });
          }
        },
        () => {
          activeSpan.end();
        }
      );
    });
  });
}
function startSpanManual(options, callback) {
  const acs = getAcs();
  if (acs.startSpanManual) {
    return acs.startSpanManual(options, callback);
  }
  const spanArguments = parseSentrySpanArguments(options);
  const { forceTransaction, parentSpan: customParentSpan, scope: customScope } = options;
  const customForkedScope = customScope?.clone();
  return withScope2(customForkedScope, () => {
    const wrapper = getActiveSpanWrapper(customParentSpan);
    return wrapper(() => {
      const scope = getCurrentScope();
      const parentSpan = getParentSpan(scope, customParentSpan);
      const missingRequiredParent = options.onlyIfParent && !parentSpan;
      const activeSpan = missingRequiredParent ? startMissingRequiredParentSpan(scope, getClient()) : createChildOrRootSpan({
        parentSpan,
        spanArguments,
        forceTransaction,
        scope
      });
      if (!spanIsIgnored(activeSpan) || !parentSpan) {
        _setSpanForScope(scope, activeSpan);
      }
      return handleCallbackErrors(
        // We pass the `finish` function to the callback, so the user can finish the span manually
        // this is mainly here for historic purposes because previously, we instructed users to call
        // `finish` instead of `span.end()` to also clean up the scope. Nowadays, calling `span.end()`
        // or `finish` has the same effect and we simply leave it here to avoid breaking user code.
        () => callback(activeSpan, () => activeSpan.end()),
        () => {
          const { status } = spanToJSON(activeSpan);
          if (activeSpan.isRecording() && (!status || status === "ok")) {
            activeSpan.setStatus({ code: SPAN_STATUS_ERROR, message: "internal_error" });
          }
        }
      );
    });
  });
}
function startInactiveSpan(options) {
  const acs = getAcs();
  if (acs.startInactiveSpan) {
    return acs.startInactiveSpan(options);
  }
  return _startInactiveSpanImpl(options);
}
function _startInactiveSpanImpl(options) {
  const spanArguments = parseSentrySpanArguments(options);
  const { forceTransaction, parentSpan: customParentSpan } = options;
  const wrapper = options.scope ? (callback) => withScope2(options.scope, callback) : customParentSpan !== void 0 ? (callback) => withActiveSpan(customParentSpan, callback) : (callback) => callback();
  return wrapper(() => {
    const scope = getCurrentScope();
    const parentSpan = getParentSpan(scope, customParentSpan);
    const client = getClient();
    const missingRequiredParent = options.onlyIfParent && !parentSpan;
    if (missingRequiredParent) {
      return startMissingRequiredParentSpan(scope, client);
    }
    return createChildOrRootSpan({
      parentSpan,
      spanArguments,
      forceTransaction,
      scope
    });
  });
}
function withActiveSpan(span, callback) {
  const acs = getAcs();
  if (acs.withActiveSpan) {
    return acs.withActiveSpan(span, callback);
  }
  return withScope2((scope) => {
    _setSpanForScope(scope, span || void 0);
    return callback(scope);
  });
}
function suppressTracing(callback) {
  const acs = getAcs();
  if (acs.suppressTracing) {
    return acs.suppressTracing(callback);
  }
  return withScope2((scope) => {
    scope.setSDKProcessingMetadata({ [SUPPRESS_TRACING_KEY]: true });
    const res = callback();
    scope.setSDKProcessingMetadata({ [SUPPRESS_TRACING_KEY]: void 0 });
    return res;
  });
}
function isTracingSuppressed(scope = getCurrentScope()) {
  const acs = getAcs();
  if (acs.isTracingSuppressed) {
    return acs.isTracingSuppressed(scope);
  }
  return scope.getScopeData().sdkProcessingMetadata[SUPPRESS_TRACING_KEY] === true;
}
function startNewTrace(callback) {
  const acs = getAcs();
  if (acs.startNewTrace) {
    return acs.startNewTrace(callback);
  }
  return withScope2((scope) => {
    scope.setPropagationContext({
      traceId: generateTraceId(),
      sampleRand: safeMathRandom()
    });
    DEBUG_BUILD && debug.log(`Starting a new trace with id ${scope.getPropagationContext().traceId}`);
    return withActiveSpan(null, callback);
  });
}
function startMissingRequiredParentSpan(scope, client) {
  client?.recordDroppedEvent("no_parent_span", "span");
  const span = new SentryNonRecordingSpan({ traceId: scope.getPropagationContext().traceId });
  setCapturedScopesOnSpan(span, scope, getIsolationScope());
  return span;
}
function createChildOrRootSpan({
  parentSpan,
  spanArguments,
  forceTransaction,
  scope
}) {
  const isolationScope = getIsolationScope();
  if (!hasSpansEnabled()) {
    const scopePropagationContext = { ...isolationScope.getPropagationContext(), ...scope.getPropagationContext() };
    const traceId = parentSpan ? parentSpan.spanContext().traceId : scopePropagationContext.traceId;
    const span2 = new SentryNonRecordingSpan({ traceId });
    if (parentSpan && !forceTransaction) {
      addChildSpanToSpan(parentSpan, span2);
    }
    setCapturedScopesOnSpan(span2, scope, isolationScope);
    return span2;
  }
  const client = getClient();
  if (_shouldIgnoreStreamedSpan(client, spanArguments)) {
    if (!isTracingSuppressed(scope)) {
      client?.recordDroppedEvent("ignored", "span");
    }
    const ignoredSpan = new SentryNonRecordingSpan({
      dropReason: "ignored",
      traceId: parentSpan?.spanContext().traceId ?? scope.getPropagationContext().traceId
    });
    if (parentSpan && !forceTransaction) {
      addChildSpanToSpan(parentSpan, ignoredSpan);
    }
    setCapturedScopesOnSpan(ignoredSpan, scope, isolationScope);
    return ignoredSpan;
  }
  let span;
  if (parentSpan && !forceTransaction) {
    span = _startChildSpan(parentSpan, scope, spanArguments, isolationScope);
    addChildSpanToSpan(parentSpan, span);
  } else if (parentSpan) {
    const dsc = getDynamicSamplingContextFromSpan(parentSpan);
    const { traceId, spanId: parentSpanId } = parentSpan.spanContext();
    const parentSampled = spanIsSampled(parentSpan);
    span = _startRootSpan(
      {
        traceId,
        parentSpanId,
        ...spanArguments
      },
      scope,
      isolationScope,
      parentSampled
    );
    freezeDscOnSpan(span, dsc);
  } else {
    const {
      traceId,
      dsc,
      parentSpanId,
      sampled: parentSampled
    } = {
      ...isolationScope.getPropagationContext(),
      ...scope.getPropagationContext()
    };
    span = _startRootSpan(
      {
        traceId,
        parentSpanId,
        ...spanArguments
      },
      scope,
      isolationScope,
      parentSampled
    );
    if (dsc) {
      freezeDscOnSpan(span, dsc);
    }
  }
  logSpanStart(span);
  return span;
}
function parseSentrySpanArguments(options) {
  const exp = options.experimental || {};
  const initialCtx = {
    isStandalone: exp.standalone,
    ...options
  };
  if (options.startTime) {
    const ctx = { ...initialCtx };
    ctx.startTimestamp = spanTimeInputToSeconds(options.startTime);
    delete ctx.startTime;
    return ctx;
  }
  return initialCtx;
}
function getAcs() {
  const carrier = getMainCarrier();
  return getAsyncContextStrategy(carrier);
}
function _startRootSpan(spanArguments, scope, isolationScope, parentSampled) {
  const client = getClient();
  const options = client?.getOptions() || {};
  const { name = "" } = spanArguments;
  const mutableSpanSamplingData = { spanAttributes: { ...spanArguments.attributes }, spanName: name, parentSampled };
  client?.emit("beforeSampling", mutableSpanSamplingData, { decision: false });
  const finalParentSampled = mutableSpanSamplingData.parentSampled ?? parentSampled;
  const finalAttributes = mutableSpanSamplingData.spanAttributes;
  const currentPropagationContext = scope.getPropagationContext();
  const _isTracingSuppressed = isTracingSuppressed(scope);
  const [sampled, sampleRate, localSampleRateWasApplied] = _isTracingSuppressed ? [false] : sampleSpan(
    options,
    {
      name,
      parentSampled: finalParentSampled,
      attributes: finalAttributes,
      normalizedRequest: isolationScope.getScopeData().sdkProcessingMetadata.normalizedRequest,
      parentSampleRate: parseSampleRate(currentPropagationContext.dsc?.sample_rate)
    },
    currentPropagationContext.sampleRand
  );
  const rootSpan = new SentrySpan({
    ...spanArguments,
    attributes: {
      [SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: "custom",
      [SEMANTIC_ATTRIBUTE_SENTRY_SAMPLE_RATE]: sampleRate !== void 0 && localSampleRateWasApplied ? sampleRate : void 0,
      ...finalAttributes
    },
    sampled
  });
  if (!sampled && client && !_isTracingSuppressed) {
    DEBUG_BUILD && debug.log("[Tracing] Discarding root span because its trace was not chosen to be sampled.");
    client.recordDroppedEvent("sample_rate", hasSpanStreamingEnabled(client) ? "span" : "transaction");
  }
  setCapturedScopesOnSpan(rootSpan, scope, isolationScope);
  if (client) {
    client.emit("spanStart", rootSpan);
  }
  return rootSpan;
}
function _startChildSpan(parentSpan, scope, spanArguments, isolationScope) {
  const { spanId, traceId } = parentSpan.spanContext();
  const _isTracingSuppressed = isTracingSuppressed(scope);
  const sampled = _isTracingSuppressed ? false : spanIsSampled(parentSpan);
  const childSpan = sampled ? new SentrySpan({
    ...spanArguments,
    parentSpanId: spanId,
    traceId,
    sampled
  }) : new SentryNonRecordingSpan({ traceId });
  addChildSpanToSpan(parentSpan, childSpan);
  setCapturedScopesOnSpan(childSpan, scope, isolationScope);
  const client = getClient();
  if (!client) {
    return childSpan;
  }
  if (hasSpanStreamingEnabled(client) && spanIsNonRecordingSpan(childSpan)) {
    if (spanIsNonRecordingSpan(parentSpan) && parentSpan.dropReason) {
      childSpan.dropReason = parentSpan.dropReason;
      client.recordDroppedEvent(parentSpan.dropReason, "span");
    } else if (!_isTracingSuppressed) {
      childSpan.dropReason = "sample_rate";
      client.recordDroppedEvent("sample_rate", "span");
    }
  }
  client.emit("spanStart", childSpan);
  if (spanArguments.endTimestamp) {
    client.emit("spanEnd", childSpan);
    client.emit("afterSpanEnd", childSpan);
  }
  return childSpan;
}
function getParentSpan(scope, customParentSpan) {
  if (customParentSpan) {
    return customParentSpan;
  }
  if (customParentSpan === null) {
    return void 0;
  }
  const span = _getSpanForScope(scope);
  if (!span) {
    return void 0;
  }
  const client = getClient();
  const options = client ? client.getOptions() : {};
  if (options.parentSpanIsAlwaysRootSpan) {
    return getRootSpan(span);
  }
  return span;
}
function getActiveSpanWrapper(parentSpan) {
  return parentSpan !== void 0 ? (callback) => {
    return withActiveSpan(parentSpan, callback);
  } : (callback) => callback();
}
function _shouldIgnoreStreamedSpan(client, spanArguments) {
  const ignoreSpans = client?.getOptions().ignoreSpans;
  if (!client || !hasSpanStreamingEnabled(client) || !ignoreSpans?.length) {
    return false;
  }
  return shouldIgnoreSpan(
    {
      description: spanArguments.name || "",
      op: spanArguments.attributes?.[SEMANTIC_ATTRIBUTE_SENTRY_OP] || spanArguments.op,
      attributes: spanArguments.attributes
    },
    ignoreSpans
  );
}
function spanIsIgnored(span) {
  return spanIsNonRecordingSpan(span) && span.dropReason === "ignored";
}
var SUPPRESS_TRACING_KEY, continueTrace;
var init_trace = __esm({
  "node_modules/@sentry/core/build/esm/tracing/trace.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_asyncContext();
    init_carrier();
    init_currentScopes();
    init_debug_build();
    init_semanticAttributes();
    init_baggage();
    init_debug_logger();
    init_handleCallbackErrors();
    init_hasSpansEnabled();
    init_should_ignore_span();
    init_hasSpanStreamingEnabled();
    init_parseSampleRate();
    init_propagationContext();
    init_randomSafeContext();
    init_spanOnScope();
    init_spanUtils();
    init_tracing();
    init_dynamicSamplingContext();
    init_logSpans();
    init_sampling();
    init_sentryNonRecordingSpan();
    init_sentrySpan();
    init_spanstatus();
    init_utils();
    SUPPRESS_TRACING_KEY = "__SENTRY_SUPPRESS_TRACING__";
    __name(startSpan, "startSpan");
    __name(startSpanManual, "startSpanManual");
    __name(startInactiveSpan, "startInactiveSpan");
    __name(_startInactiveSpanImpl, "_startInactiveSpanImpl");
    continueTrace = /* @__PURE__ */ __name((options, callback) => {
      const carrier = getMainCarrier();
      const acs = getAsyncContextStrategy(carrier);
      if (acs.continueTrace) {
        return acs.continueTrace(options, callback);
      }
      const { sentryTrace, baggage } = options;
      const client = getClient();
      const incomingDsc = baggageHeaderToDynamicSamplingContext(baggage);
      if (client && !shouldContinueTrace(client, incomingDsc?.org_id)) {
        return startNewTrace(callback);
      }
      return withScope2((scope) => {
        const propagationContext = propagationContextFromHeaders(sentryTrace, baggage);
        scope.setPropagationContext(propagationContext);
        _setSpanForScope(scope, void 0);
        return callback();
      });
    }, "continueTrace");
    __name(withActiveSpan, "withActiveSpan");
    __name(suppressTracing, "suppressTracing");
    __name(isTracingSuppressed, "isTracingSuppressed");
    __name(startNewTrace, "startNewTrace");
    __name(startMissingRequiredParentSpan, "startMissingRequiredParentSpan");
    __name(createChildOrRootSpan, "createChildOrRootSpan");
    __name(parseSentrySpanArguments, "parseSentrySpanArguments");
    __name(getAcs, "getAcs");
    __name(_startRootSpan, "_startRootSpan");
    __name(_startChildSpan, "_startChildSpan");
    __name(getParentSpan, "getParentSpan");
    __name(getActiveSpanWrapper, "getActiveSpanWrapper");
    __name(_shouldIgnoreStreamedSpan, "_shouldIgnoreStreamedSpan");
    __name(spanIsIgnored, "spanIsIgnored");
  }
});

// node_modules/@sentry/core/build/esm/utils/scopeData.js
function applyScopeDataToEvent(event, data) {
  const { fingerprint, span, breadcrumbs, sdkProcessingMetadata } = data;
  applyDataToEvent(event, data);
  if (span) {
    applySpanToEvent(event, span);
  }
  applyFingerprintToEvent(event, fingerprint);
  applyBreadcrumbsToEvent(event, breadcrumbs);
  applySdkMetadataToEvent(event, sdkProcessingMetadata);
}
function mergeScopeData(data, mergeData) {
  const {
    extra,
    tags,
    attributes,
    user,
    contexts,
    level,
    sdkProcessingMetadata,
    breadcrumbs,
    fingerprint,
    eventProcessors,
    attachments,
    propagationContext,
    transactionName,
    span
  } = mergeData;
  mergeAndOverwriteScopeData(data, "extra", extra);
  mergeAndOverwriteScopeData(data, "tags", tags);
  mergeAndOverwriteScopeData(data, "attributes", attributes);
  mergeAndOverwriteScopeData(data, "user", user);
  mergeAndOverwriteScopeData(data, "contexts", contexts);
  data.sdkProcessingMetadata = merge(data.sdkProcessingMetadata, sdkProcessingMetadata, 2);
  if (level) {
    data.level = level;
  }
  if (transactionName) {
    data.transactionName = transactionName;
  }
  if (span) {
    data.span = span;
  }
  if (breadcrumbs.length) {
    data.breadcrumbs = [...data.breadcrumbs, ...breadcrumbs];
  }
  if (fingerprint.length) {
    data.fingerprint = [...data.fingerprint, ...fingerprint];
  }
  if (eventProcessors.length) {
    data.eventProcessors = [...data.eventProcessors, ...eventProcessors];
  }
  if (attachments.length) {
    data.attachments = [...data.attachments, ...attachments];
  }
  data.propagationContext = { ...data.propagationContext, ...propagationContext };
}
function mergeAndOverwriteScopeData(data, prop, mergeVal) {
  data[prop] = merge(data[prop], mergeVal, 1);
}
function getCombinedScopeData(isolationScope, currentScope) {
  const scopeData = getGlobalScope().getScopeData();
  isolationScope && mergeScopeData(scopeData, isolationScope.getScopeData());
  currentScope && mergeScopeData(scopeData, currentScope.getScopeData());
  return scopeData;
}
function applyDataToEvent(event, data) {
  const { extra, tags, user, contexts, level, transactionName } = data;
  if (Object.keys(extra).length) {
    event.extra = { ...extra, ...event.extra };
  }
  if (Object.keys(tags).length) {
    event.tags = { ...tags, ...event.tags };
  }
  if (Object.keys(user).length) {
    event.user = { ...user, ...event.user };
  }
  if (Object.keys(contexts).length) {
    event.contexts = { ...contexts, ...event.contexts };
  }
  if (level) {
    event.level = level;
  }
  if (transactionName && event.type !== "transaction") {
    event.transaction = transactionName;
  }
}
function applyBreadcrumbsToEvent(event, breadcrumbs) {
  const mergedBreadcrumbs = [...event.breadcrumbs || [], ...breadcrumbs];
  event.breadcrumbs = mergedBreadcrumbs.length ? mergedBreadcrumbs : void 0;
}
function applySdkMetadataToEvent(event, sdkProcessingMetadata) {
  event.sdkProcessingMetadata = {
    ...event.sdkProcessingMetadata,
    ...sdkProcessingMetadata
  };
}
function applySpanToEvent(event, span) {
  event.contexts = {
    trace: spanToTraceContext(span),
    ...event.contexts
  };
  event.sdkProcessingMetadata = {
    dynamicSamplingContext: getDynamicSamplingContextFromSpan(span),
    ...event.sdkProcessingMetadata
  };
  const rootSpan = getRootSpan(span);
  const transactionName = spanToJSON(rootSpan).description;
  if (transactionName && !event.transaction && event.type === "transaction") {
    event.transaction = transactionName;
  }
}
function applyFingerprintToEvent(event, fingerprint) {
  event.fingerprint = event.fingerprint ? Array.isArray(event.fingerprint) ? event.fingerprint : [event.fingerprint] : [];
  if (fingerprint) {
    event.fingerprint = event.fingerprint.concat(fingerprint);
  }
  if (!event.fingerprint.length) {
    delete event.fingerprint;
  }
}
var init_scopeData = __esm({
  "node_modules/@sentry/core/build/esm/utils/scopeData.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_currentScopes();
    init_dynamicSamplingContext();
    init_merge();
    init_spanUtils();
    __name(applyScopeDataToEvent, "applyScopeDataToEvent");
    __name(mergeScopeData, "mergeScopeData");
    __name(mergeAndOverwriteScopeData, "mergeAndOverwriteScopeData");
    __name(getCombinedScopeData, "getCombinedScopeData");
    __name(applyDataToEvent, "applyDataToEvent");
    __name(applyBreadcrumbsToEvent, "applyBreadcrumbsToEvent");
    __name(applySdkMetadataToEvent, "applySdkMetadataToEvent");
    __name(applySpanToEvent, "applySpanToEvent");
    __name(applyFingerprintToEvent, "applyFingerprintToEvent");
  }
});

// node_modules/@sentry/core/build/esm/tracing/spans/scopeContextAttributes.js
function scopeContextsToSpanAttributes(contexts) {
  const attrs = {};
  const { response, profile, cloud_resource, culture, state } = contexts;
  if (response) {
    if (response.status_code != null) {
      attrs["http.response.status_code"] = response.status_code;
    }
    if (response.body_size != null) {
      attrs["http.response.body.size"] = response.body_size;
    }
  }
  if (profile) {
    if (profile.profile_id) {
      attrs["sentry.profile_id"] = profile.profile_id;
    }
    if (profile.profiler_id) {
      attrs["sentry.profiler_id"] = profile.profiler_id;
    }
  }
  if (cloud_resource) {
    for (const [key, value] of Object.entries(cloud_resource)) {
      if (value != null) {
        attrs[key] = value;
      }
    }
  }
  if (culture) {
    if (culture.locale) {
      attrs["culture.locale"] = culture.locale;
    }
    if (culture.timezone) {
      attrs["culture.timezone"] = culture.timezone;
    }
  }
  if (state?.state && typeof state.state.type === "string") {
    attrs["state.type"] = state.state.type;
  }
  const angular = contexts["angular"];
  if (angular) {
    const version = angular["version"];
    if (typeof version === "string" || typeof version === "number") {
      attrs["angular.version"] = version;
    }
  }
  const react = contexts["react"];
  if (react) {
    const version = react["version"];
    if (typeof version === "string" || typeof version === "number") {
      attrs["react.version"] = version;
    }
  }
  return attrs;
}
var init_scopeContextAttributes = __esm({
  "node_modules/@sentry/core/build/esm/tracing/spans/scopeContextAttributes.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    __name(scopeContextsToSpanAttributes, "scopeContextsToSpanAttributes");
  }
});

// node_modules/@sentry/conventions/dist/attributes.mjs
var qr, Yr, Vr, Kr, Qr, Xr, Zr, $r, na, ra, aa, ya, Nc, Cc, Pc, Lc, Kc;
var init_attributes2 = __esm({
  "node_modules/@sentry/conventions/dist/attributes.mjs"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    qr = "gen_ai.embeddings.input";
    Yr = "gen_ai.input.messages";
    Vr = "gen_ai.operation.name";
    Kr = "gen_ai.provider.name";
    Qr = "gen_ai.request.frequency_penalty";
    Xr = "gen_ai.request.max_tokens";
    Zr = "gen_ai.request.model";
    $r = "gen_ai.request.presence_penalty";
    na = "gen_ai.request.temperature";
    ra = "gen_ai.request.top_k";
    aa = "gen_ai.request.top_p";
    ya = "gen_ai.system_instructions";
    Nc = "sentry.sdk.name";
    Cc = "sentry.sdk.version";
    Pc = "sentry.segment.id";
    Lc = "sentry.segment.name";
    Kc = "sentry.trace_lifecycle";
  }
});

// node_modules/@sentry/core/build/esm/tracing/spans/captureSpan.js
function captureSpan(span, client) {
  const spanJSON = spanToStreamedSpanJSON(span);
  const segmentSpan = INTERNAL_getSegmentSpan(span);
  const serializedSegmentSpan = spanToStreamedSpanJSON(segmentSpan);
  const { isolationScope: spanIsolationScope, scope: spanScope } = getCapturedScopesOnSpan(span);
  const finalScopeData = getCombinedScopeData(spanIsolationScope, spanScope);
  applyCommonSpanAttributes(spanJSON, serializedSegmentSpan, client, finalScopeData);
  const spanKind = span.kind;
  client.emit("preprocessSpan", spanJSON, { spanKind });
  if (spanJSON.is_segment) {
    applyScopeToSegmentSpan(spanJSON, finalScopeData);
    applySdkMetadataToSegmentSpan(spanJSON, client);
    client.emit("processSegmentSpan", spanJSON);
  }
  client.emit("processSpan", spanJSON);
  const { beforeSendSpan } = client.getOptions();
  const processedSpan = beforeSendSpan && isStreamedBeforeSendSpanCallback(beforeSendSpan) ? applyBeforeSendSpanCallback(spanJSON, beforeSendSpan) : spanJSON;
  const spanNameSource = processedSpan.attributes?.[SEMANTIC_ATTRIBUTE_SENTRY_SOURCE];
  if (spanJSON.is_segment && spanNameSource) {
    safeSetSpanJSONAttributes(processedSpan, {
      ["sentry.segment.name.source"]: spanNameSource
    });
  }
  return {
    ...streamedSpanJsonToSerializedSpan(processedSpan),
    _segmentSpan: segmentSpan
  };
}
function applyScopeToSegmentSpan(segmentSpanJSON, scopeData) {
  const contextAttributes = scopeContextsToSpanAttributes(scopeData.contexts);
  safeSetSpanJSONAttributes(segmentSpanJSON, contextAttributes);
}
function safeSetSpanJSONAttributes(spanJSON, newAttributes) {
  const originalAttributes = spanJSON.attributes ?? (spanJSON.attributes = {});
  Object.entries(newAttributes).forEach(([key, value]) => {
    if (value != null && !(key in originalAttributes)) {
      originalAttributes[key] = value;
    }
  });
}
function applySdkMetadataToSegmentSpan(segmentSpanJSON, client) {
  const integrationNames = client.getIntegrationNames();
  if (!integrationNames.length)
    return;
  safeSetSpanJSONAttributes(segmentSpanJSON, {
    [SEMANTIC_ATTRIBUTE_SENTRY_SDK_INTEGRATIONS]: integrationNames
  });
}
function applyCommonSpanAttributes(spanJSON, serializedSegmentSpan, client, scopeData) {
  const sdk = client.getSdkMetadata();
  const { release, environment } = client.getOptions();
  safeSetSpanJSONAttributes(spanJSON, {
    [Kc]: "stream",
    [Lc]: serializedSegmentSpan.name,
    [Pc]: serializedSegmentSpan.span_id,
    [Nc]: sdk?.sdk?.name,
    [Cc]: sdk?.sdk?.version,
    [SEMANTIC_ATTRIBUTE_SENTRY_RELEASE]: release,
    [SEMANTIC_ATTRIBUTE_SENTRY_ENVIRONMENT]: environment || DEFAULT_ENVIRONMENT,
    [SEMANTIC_ATTRIBUTE_USER_ID]: scopeData.user?.id,
    [SEMANTIC_ATTRIBUTE_USER_EMAIL]: scopeData.user?.email,
    [SEMANTIC_ATTRIBUTE_USER_IP_ADDRESS]: scopeData.user?.ip_address,
    [SEMANTIC_ATTRIBUTE_USER_USERNAME]: scopeData.user?.username,
    ...scopeData.attributes
  });
}
function applyBeforeSendSpanCallback(span, beforeSendSpan) {
  const modifedSpan = beforeSendSpan(span);
  if (!modifedSpan) {
    showSpanDropWarning();
    return span;
  }
  return modifedSpan;
}
var init_captureSpan = __esm({
  "node_modules/@sentry/core/build/esm/tracing/spans/captureSpan.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_semanticAttributes();
    init_scopeData();
    init_spanUtils();
    init_utils();
    init_beforeSendSpan();
    init_scopeContextAttributes();
    init_constants();
    init_attributes2();
    __name(captureSpan, "captureSpan");
    __name(applyScopeToSegmentSpan, "applyScopeToSegmentSpan");
    __name(safeSetSpanJSONAttributes, "safeSetSpanJSONAttributes");
    __name(applySdkMetadataToSegmentSpan, "applySdkMetadataToSegmentSpan");
    __name(applyCommonSpanAttributes, "applyCommonSpanAttributes");
    __name(applyBeforeSendSpanCallback, "applyBeforeSendSpanCallback");
  }
});

// node_modules/@sentry/core/build/esm/utils/syncpromise.js
function resolvedSyncPromise(value) {
  return new SyncPromise((resolve2) => {
    resolve2(value);
  });
}
function rejectedSyncPromise(reason) {
  return new SyncPromise((_, reject) => {
    reject(reason);
  });
}
var STATE_PENDING, STATE_RESOLVED, STATE_REJECTED, SyncPromise;
var init_syncpromise = __esm({
  "node_modules/@sentry/core/build/esm/utils/syncpromise.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_is();
    STATE_PENDING = 0;
    STATE_RESOLVED = 1;
    STATE_REJECTED = 2;
    __name(resolvedSyncPromise, "resolvedSyncPromise");
    __name(rejectedSyncPromise, "rejectedSyncPromise");
    SyncPromise = class {
      constructor(executor) {
        this._state = STATE_PENDING;
        this._handlers = [];
        this._runExecutor(executor);
      }
      /** @inheritdoc */
      then(onfulfilled, onrejected) {
        return new SyncPromise((resolve2, reject) => {
          this._handlers.push([
            false,
            (result) => {
              if (!onfulfilled) {
                resolve2(result);
              } else {
                try {
                  resolve2(onfulfilled(result));
                } catch (e) {
                  reject(e);
                }
              }
            },
            (reason) => {
              if (!onrejected) {
                reject(reason);
              } else {
                try {
                  resolve2(onrejected(reason));
                } catch (e) {
                  reject(e);
                }
              }
            }
          ]);
          this._executeHandlers();
        });
      }
      /** @inheritdoc */
      catch(onrejected) {
        return this.then((val) => val, onrejected);
      }
      /** @inheritdoc */
      finally(onfinally) {
        return new SyncPromise((resolve2, reject) => {
          let val;
          let isRejected;
          return this.then(
            (value) => {
              isRejected = false;
              val = value;
              if (onfinally) {
                onfinally();
              }
            },
            (reason) => {
              isRejected = true;
              val = reason;
              if (onfinally) {
                onfinally();
              }
            }
          ).then(() => {
            if (isRejected) {
              reject(val);
              return;
            }
            resolve2(val);
          });
        });
      }
      /** Excute the resolve/reject handlers. */
      _executeHandlers() {
        if (this._state === STATE_PENDING) {
          return;
        }
        const cachedHandlers = this._handlers.slice();
        this._handlers = [];
        cachedHandlers.forEach((handler) => {
          if (handler[0]) {
            return;
          }
          if (this._state === STATE_RESOLVED) {
            handler[1](this._value);
          }
          if (this._state === STATE_REJECTED) {
            handler[2](this._value);
          }
          handler[0] = true;
        });
      }
      /** Run the executor for the SyncPromise. */
      _runExecutor(executor) {
        const setResult = /* @__PURE__ */ __name((state, value) => {
          if (this._state !== STATE_PENDING) {
            return;
          }
          if (isThenable(value)) {
            void value.then(resolve2, reject);
            return;
          }
          this._state = state;
          this._value = value;
          this._executeHandlers();
        }, "setResult");
        const resolve2 = /* @__PURE__ */ __name((value) => {
          setResult(STATE_RESOLVED, value);
        }, "resolve");
        const reject = /* @__PURE__ */ __name((reason) => {
          setResult(STATE_REJECTED, reason);
        }, "reject");
        try {
          executor(resolve2, reject);
        } catch (e) {
          reject(e);
        }
      }
    };
    __name(SyncPromise, "SyncPromise");
  }
});

// node_modules/@sentry/core/build/esm/eventProcessors.js
function notifyEventProcessors(processors, event, hint, index = 0) {
  try {
    const result = _notifyEventProcessors(event, hint, processors, index);
    return isThenable(result) ? result : resolvedSyncPromise(result);
  } catch (error2) {
    return rejectedSyncPromise(error2);
  }
}
function _notifyEventProcessors(event, hint, processors, index) {
  const processor = processors[index];
  if (!event || !processor) {
    return event;
  }
  const result = processor({ ...event }, hint);
  DEBUG_BUILD && result === null && debug.log(`Event processor "${processor.id || "?"}" dropped event`);
  if (isThenable(result)) {
    return result.then((final) => _notifyEventProcessors(final, hint, processors, index + 1));
  }
  return _notifyEventProcessors(result, hint, processors, index + 1);
}
var init_eventProcessors = __esm({
  "node_modules/@sentry/core/build/esm/eventProcessors.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_debug_build();
    init_debug_logger();
    init_is();
    init_syncpromise();
    __name(notifyEventProcessors, "notifyEventProcessors");
    __name(_notifyEventProcessors, "_notifyEventProcessors");
  }
});

// node_modules/@sentry/core/build/esm/utils/debug-ids.js
function getFilenameToDebugIdMap(stackParser) {
  const sentryDebugIdMap = GLOBAL_OBJ._sentryDebugIds;
  const nativeDebugIdMap = GLOBAL_OBJ._debugIds;
  if (!sentryDebugIdMap && !nativeDebugIdMap) {
    return {};
  }
  const sentryDebugIdKeys = sentryDebugIdMap ? Object.keys(sentryDebugIdMap) : [];
  const nativeDebugIdKeys = nativeDebugIdMap ? Object.keys(nativeDebugIdMap) : [];
  if (cachedFilenameDebugIds && sentryDebugIdKeys.length === lastSentryKeysCount && nativeDebugIdKeys.length === lastNativeKeysCount) {
    return cachedFilenameDebugIds;
  }
  lastSentryKeysCount = sentryDebugIdKeys.length;
  lastNativeKeysCount = nativeDebugIdKeys.length;
  cachedFilenameDebugIds = {};
  if (!parsedStackResults) {
    parsedStackResults = {};
  }
  const processDebugIds = /* @__PURE__ */ __name((debugIdKeys, debugIdMap) => {
    for (const key of debugIdKeys) {
      const debugId = debugIdMap[key];
      const result = parsedStackResults?.[key];
      if (result && cachedFilenameDebugIds && debugId) {
        cachedFilenameDebugIds[result[0]] = debugId;
        if (parsedStackResults) {
          parsedStackResults[key] = [result[0], debugId];
        }
      } else if (debugId) {
        const parsedStack = stackParser(key);
        for (let i = parsedStack.length - 1; i >= 0; i--) {
          const stackFrame = parsedStack[i];
          const filename = stackFrame?.filename;
          if (filename && cachedFilenameDebugIds && parsedStackResults) {
            cachedFilenameDebugIds[filename] = debugId;
            parsedStackResults[key] = [filename, debugId];
            break;
          }
        }
      }
    }
  }, "processDebugIds");
  if (sentryDebugIdMap) {
    processDebugIds(sentryDebugIdKeys, sentryDebugIdMap);
  }
  if (nativeDebugIdMap) {
    processDebugIds(nativeDebugIdKeys, nativeDebugIdMap);
  }
  return cachedFilenameDebugIds;
}
var parsedStackResults, lastSentryKeysCount, lastNativeKeysCount, cachedFilenameDebugIds;
var init_debug_ids = __esm({
  "node_modules/@sentry/core/build/esm/utils/debug-ids.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_worldwide();
    __name(getFilenameToDebugIdMap, "getFilenameToDebugIdMap");
  }
});

// node_modules/@sentry/core/build/esm/utils/prepareEvent.js
function prepareEvent(options, event, hint, scope, client, isolationScope) {
  const { normalizeDepth = 3, normalizeMaxBreadth = 1e3 } = options;
  const prepared = {
    ...event,
    event_id: event.event_id || hint.event_id || uuid4(),
    timestamp: event.timestamp || dateTimestampInSeconds()
  };
  const integrations = hint.integrations || options.integrations.map((i) => i.name);
  applyClientOptions(prepared, options);
  applyIntegrationsMetadata(prepared, integrations);
  if (client) {
    client.emit("applyFrameMetadata", event);
  }
  if (event.type === void 0) {
    applyDebugIds(prepared, options.stackParser);
  }
  const finalScope = getFinalScope(scope, hint.captureContext);
  if (hint.mechanism) {
    addExceptionMechanism(prepared, hint.mechanism);
  }
  const clientEventProcessors = client ? client.getEventProcessors() : [];
  const data = getCombinedScopeData(isolationScope, finalScope);
  const attachments = [...hint.attachments || [], ...data.attachments];
  if (attachments.length) {
    hint.attachments = attachments;
  }
  applyScopeDataToEvent(prepared, data);
  const eventProcessors = [
    ...clientEventProcessors,
    // Run scope event processors _after_ all other processors
    ...data.eventProcessors
  ];
  const isInternalException = hint.data && hint.data.__sentry__ === true;
  const result = isInternalException ? resolvedSyncPromise(prepared) : notifyEventProcessors(eventProcessors, prepared, hint);
  return result.then((evt) => {
    if (evt) {
      applyDebugMeta(evt);
    }
    if (typeof normalizeDepth === "number" && normalizeDepth > 0) {
      return normalizeEvent(evt, normalizeDepth, normalizeMaxBreadth);
    }
    return evt;
  });
}
function applyClientOptions(event, options) {
  const { environment, release, dist, maxValueLength } = options;
  event.environment = event.environment || environment || DEFAULT_ENVIRONMENT;
  if (!event.release && release) {
    event.release = release;
  }
  if (!event.dist && dist) {
    event.dist = dist;
  }
  const request = event.request;
  if (request?.url && maxValueLength) {
    request.url = truncate(request.url, maxValueLength);
  }
  if (maxValueLength) {
    event.exception?.values?.forEach((exception) => {
      if (exception.value) {
        exception.value = truncate(exception.value, maxValueLength);
      }
    });
  }
}
function applyDebugIds(event, stackParser) {
  const filenameDebugIdMap = getFilenameToDebugIdMap(stackParser);
  event.exception?.values?.forEach((exception) => {
    exception.stacktrace?.frames?.forEach((frame) => {
      if (frame.filename) {
        frame.debug_id = filenameDebugIdMap[frame.filename];
      }
    });
  });
}
function applyDebugMeta(event) {
  const filenameDebugIdMap = {};
  event.exception?.values?.forEach((exception) => {
    exception.stacktrace?.frames?.forEach((frame) => {
      if (frame.debug_id) {
        if (frame.abs_path) {
          filenameDebugIdMap[frame.abs_path] = frame.debug_id;
        } else if (frame.filename) {
          filenameDebugIdMap[frame.filename] = frame.debug_id;
        }
        delete frame.debug_id;
      }
    });
  });
  if (Object.keys(filenameDebugIdMap).length === 0) {
    return;
  }
  event.debug_meta = event.debug_meta || {};
  event.debug_meta.images = event.debug_meta.images || [];
  const images = event.debug_meta.images;
  Object.entries(filenameDebugIdMap).forEach(([filename, debug_id]) => {
    images.push({
      type: "sourcemap",
      code_file: filename,
      debug_id
    });
  });
}
function applyIntegrationsMetadata(event, integrationNames) {
  if (integrationNames.length > 0) {
    event.sdk = event.sdk || {};
    event.sdk.integrations = [...event.sdk.integrations || [], ...integrationNames];
  }
}
function normalizeEvent(event, depth, maxBreadth) {
  if (!event) {
    return null;
  }
  const normalized = {
    ...event,
    ...event.breadcrumbs && {
      breadcrumbs: event.breadcrumbs.map((b) => ({
        ...b,
        ...b.data && {
          data: normalize(b.data, depth, maxBreadth)
        }
      }))
    },
    ...event.user && {
      user: normalize(event.user, depth, maxBreadth)
    },
    ...event.contexts && {
      contexts: normalize(event.contexts, depth, maxBreadth)
    },
    ...event.extra && {
      extra: normalize(event.extra, depth, maxBreadth)
    }
  };
  if (event.contexts?.trace && normalized.contexts) {
    normalized.contexts.trace = event.contexts.trace;
    if (event.contexts.trace.data) {
      normalized.contexts.trace.data = normalize(event.contexts.trace.data, depth, maxBreadth);
    }
  }
  if (event.spans) {
    normalized.spans = event.spans.map((span) => {
      return {
        ...span,
        ...span.data && {
          data: normalize(span.data, depth, maxBreadth)
        }
      };
    });
  }
  if (event.contexts?.flags && normalized.contexts) {
    normalized.contexts.flags = normalize(event.contexts.flags, 3, maxBreadth);
  }
  return normalized;
}
function getFinalScope(scope, captureContext) {
  if (!captureContext) {
    return scope;
  }
  const finalScope = scope ? scope.clone() : new Scope();
  finalScope.update(captureContext);
  return finalScope;
}
function parseEventHintOrCaptureContext(hint) {
  if (!hint) {
    return void 0;
  }
  if (hintIsScopeOrFunction(hint)) {
    return { captureContext: hint };
  }
  if (hintIsScopeContext(hint)) {
    return {
      captureContext: hint
    };
  }
  return hint;
}
function hintIsScopeOrFunction(hint) {
  return hint instanceof Scope || typeof hint === "function";
}
function hintIsScopeContext(hint) {
  return Object.keys(hint).some((key) => captureContextKeys.includes(key));
}
var captureContextKeys;
var init_prepareEvent = __esm({
  "node_modules/@sentry/core/build/esm/utils/prepareEvent.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_constants();
    init_eventProcessors();
    init_scope();
    init_debug_ids();
    init_misc();
    init_normalize();
    init_scopeData();
    init_string();
    init_syncpromise();
    init_time();
    __name(prepareEvent, "prepareEvent");
    __name(applyClientOptions, "applyClientOptions");
    __name(applyDebugIds, "applyDebugIds");
    __name(applyDebugMeta, "applyDebugMeta");
    __name(applyIntegrationsMetadata, "applyIntegrationsMetadata");
    __name(normalizeEvent, "normalizeEvent");
    __name(getFinalScope, "getFinalScope");
    __name(parseEventHintOrCaptureContext, "parseEventHintOrCaptureContext");
    __name(hintIsScopeOrFunction, "hintIsScopeOrFunction");
    captureContextKeys = [
      "user",
      "level",
      "extra",
      "contexts",
      "tags",
      "fingerprint",
      "propagationContext"
    ];
    __name(hintIsScopeContext, "hintIsScopeContext");
  }
});

// node_modules/@sentry/core/build/esm/exports.js
function captureException(exception, hint) {
  return getCurrentScope().captureException(exception, parseEventHintOrCaptureContext(hint));
}
async function flush(timeout) {
  const client = getClient();
  if (client) {
    return client.flush(timeout);
  }
  DEBUG_BUILD && debug.warn("Cannot flush events. No client defined.");
  return Promise.resolve(false);
}
function isEnabled2() {
  const client = getClient();
  return client?.getOptions().enabled !== false && !!client?.getTransport();
}
var init_exports = __esm({
  "node_modules/@sentry/core/build/esm/exports.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_currentScopes();
    init_debug_build();
    init_debug_logger();
    init_prepareEvent();
    __name(captureException, "captureException");
    __name(flush, "flush");
    __name(isEnabled2, "isEnabled");
  }
});

// node_modules/@sentry/core/build/esm/utils/timer.js
function safeUnref(timer) {
  if (typeof timer === "object" && typeof timer.unref === "function") {
    timer.unref();
  }
  return timer;
}
var init_timer = __esm({
  "node_modules/@sentry/core/build/esm/utils/timer.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    __name(safeUnref, "safeUnref");
  }
});

// node_modules/@sentry/core/build/esm/asyncContext/tracing-channel-binding.js
function _INTERNAL_createTracingChannelBinding(asyncLocalStorage, getScopes) {
  return {
    asyncLocalStorage,
    getStoreWithActiveSpan: (span) => {
      const { scope, isolationScope } = getScopes();
      const activeScope = scope.clone();
      _setSpanForScope(activeScope, span);
      return { scope: activeScope, isolationScope };
    }
  };
}
var init_tracing_channel_binding = __esm({
  "node_modules/@sentry/core/build/esm/asyncContext/tracing-channel-binding.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_spanOnScope();
    __name(_INTERNAL_createTracingChannelBinding, "_INTERNAL_createTracingChannelBinding");
  }
});

// node_modules/@sentry/core/build/esm/api.js
function getBaseApiEndpoint(dsn) {
  const protocol = dsn.protocol ? `${dsn.protocol}:` : "";
  const port = dsn.port ? `:${dsn.port}` : "";
  return `${protocol}//${dsn.host}${port}${dsn.path ? `/${dsn.path}` : ""}/api/`;
}
function _getIngestEndpoint(dsn) {
  return `${getBaseApiEndpoint(dsn)}${dsn.projectId}/envelope/`;
}
function _encodedAuth(dsn, sdkInfo) {
  const params = {
    sentry_version: SENTRY_API_VERSION
  };
  if (dsn.publicKey) {
    params.sentry_key = dsn.publicKey;
  }
  if (sdkInfo) {
    params.sentry_client = `${sdkInfo.name}/${sdkInfo.version}`;
  }
  return new URLSearchParams(params).toString();
}
function getEnvelopeEndpointWithUrlEncodedAuth(dsn, tunnel, sdkInfo) {
  return tunnel ? tunnel : `${_getIngestEndpoint(dsn)}?${_encodedAuth(dsn, sdkInfo)}`;
}
var SENTRY_API_VERSION;
var init_api = __esm({
  "node_modules/@sentry/core/build/esm/api.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    SENTRY_API_VERSION = "7";
    __name(getBaseApiEndpoint, "getBaseApiEndpoint");
    __name(_getIngestEndpoint, "_getIngestEndpoint");
    __name(_encodedAuth, "_encodedAuth");
    __name(getEnvelopeEndpointWithUrlEncodedAuth, "getEnvelopeEndpointWithUrlEncodedAuth");
  }
});

// node_modules/@sentry/core/build/esm/integration.js
function filterDuplicates(integrations) {
  const integrationsByName = {};
  integrations.forEach((currentInstance) => {
    const { name } = currentInstance;
    const existingInstance = integrationsByName[name];
    if (existingInstance && !existingInstance.isDefaultInstance && currentInstance.isDefaultInstance) {
      return;
    }
    integrationsByName[name] = currentInstance;
  });
  return Object.values(integrationsByName);
}
function getIntegrationsToSetup(options) {
  const defaultIntegrations = options.defaultIntegrations || [];
  const userIntegrations = options.integrations;
  defaultIntegrations.forEach((integration) => {
    integration.isDefaultInstance = true;
  });
  let integrations;
  if (Array.isArray(userIntegrations)) {
    integrations = [...defaultIntegrations, ...userIntegrations];
  } else if (typeof userIntegrations === "function") {
    const resolvedUserIntegrations = userIntegrations(defaultIntegrations);
    integrations = Array.isArray(resolvedUserIntegrations) ? resolvedUserIntegrations : [resolvedUserIntegrations];
  } else {
    integrations = defaultIntegrations;
  }
  return filterDuplicates(integrations);
}
function setupIntegrations(client, integrations) {
  const integrationIndex = {};
  integrations.forEach((integration) => {
    if (integration?.beforeSetup) {
      integration.beforeSetup(client);
    }
  });
  integrations.forEach((integration) => {
    if (integration) {
      setupIntegration(client, integration, integrationIndex);
    }
  });
  return integrationIndex;
}
function afterSetupIntegrations(client, integrations) {
  for (const integration of integrations) {
    if (integration?.afterAllSetup) {
      integration.afterAllSetup(client);
    }
  }
}
function setupIntegration(client, integration, integrationIndex) {
  if (integrationIndex[integration.name]) {
    DEBUG_BUILD && debug.log(`Integration skipped because it was already installed: ${integration.name}`);
    return;
  }
  integrationIndex[integration.name] = integration;
  if (!installedIntegrations.includes(integration.name) && typeof integration.setupOnce === "function") {
    integration.setupOnce();
    installedIntegrations.push(integration.name);
  }
  if (integration.setup && typeof integration.setup === "function") {
    integration.setup(client);
  }
  if (typeof integration.preprocessEvent === "function") {
    const callback = integration.preprocessEvent.bind(integration);
    client.on("preprocessEvent", (event, hint) => callback(event, hint, client));
  }
  if (typeof integration.processEvent === "function") {
    const callback = integration.processEvent.bind(integration);
    const processor = Object.assign((event, hint) => callback(event, hint, client), {
      id: integration.name
    });
    client.addEventProcessor(processor);
  }
  ["processSpan", "processSegmentSpan"].forEach((hook) => {
    const callback = integration[hook];
    if (typeof callback === "function") {
      client.on(hook, (span) => callback.call(integration, span, client));
    }
  });
  DEBUG_BUILD && debug.log(`Integration installed: ${integration.name}`);
}
function defineIntegration(fn) {
  return fn;
}
var installedIntegrations;
var init_integration = __esm({
  "node_modules/@sentry/core/build/esm/integration.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_debug_build();
    init_debug_logger();
    installedIntegrations = [];
    __name(filterDuplicates, "filterDuplicates");
    __name(getIntegrationsToSetup, "getIntegrationsToSetup");
    __name(setupIntegrations, "setupIntegrations");
    __name(afterSetupIntegrations, "afterSetupIntegrations");
    __name(setupIntegration, "setupIntegration");
    __name(defineIntegration, "defineIntegration");
  }
});

// node_modules/@sentry/core/build/esm/utils/trace-info.js
function _getTraceInfoFromScope(client, scope) {
  if (!scope) {
    return [void 0, void 0];
  }
  return withScope2(scope, () => {
    const span = getActiveSpan();
    const traceContext = span ? spanToTraceContext(span) : getTraceContextFromScope(scope);
    const dynamicSamplingContext = span ? getDynamicSamplingContextFromSpan(span) : getDynamicSamplingContextFromScope(client, scope);
    return [dynamicSamplingContext, traceContext];
  });
}
var init_trace_info = __esm({
  "node_modules/@sentry/core/build/esm/utils/trace-info.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_currentScopes();
    init_dynamicSamplingContext();
    init_spanUtils();
    __name(_getTraceInfoFromScope, "_getTraceInfoFromScope");
  }
});

// node_modules/@sentry/core/build/esm/utils/env.js
function isBrowserBundle() {
  return typeof __SENTRY_BROWSER_BUNDLE__ !== "undefined" && !!__SENTRY_BROWSER_BUNDLE__;
}
var init_env = __esm({
  "node_modules/@sentry/core/build/esm/utils/env.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    __name(isBrowserBundle, "isBrowserBundle");
  }
});

// node_modules/@sentry/core/build/esm/utils/node.js
function isNodeEnv() {
  return !isBrowserBundle() && Object.prototype.toString.call(typeof process !== "undefined" ? process : 0) === "[object process]";
}
var init_node = __esm({
  "node_modules/@sentry/core/build/esm/utils/node.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_env();
    __name(isNodeEnv, "isNodeEnv");
  }
});

// node_modules/@sentry/core/build/esm/utils/isBrowser.js
function isBrowser() {
  return typeof window !== "undefined" && (!isNodeEnv() || isElectronNodeRenderer());
}
function isElectronNodeRenderer() {
  const process2 = GLOBAL_OBJ.process;
  return process2?.type === "renderer";
}
var init_isBrowser = __esm({
  "node_modules/@sentry/core/build/esm/utils/isBrowser.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_node();
    init_worldwide();
    __name(isBrowser, "isBrowser");
    __name(isElectronNodeRenderer, "isElectronNodeRenderer");
  }
});

// node_modules/@sentry/core/build/esm/logs/envelope.js
function createLogContainerEnvelopeItem(items, inferUserData) {
  const inferSetting = inferUserData ? "auto" : "never";
  return [
    {
      type: "log",
      item_count: items.length,
      content_type: "application/vnd.sentry.items.log+json"
    },
    {
      version: 2,
      ...isBrowser() && {
        ingest_settings: { infer_ip: inferSetting, infer_user_agent: inferSetting }
      },
      items
    }
  ];
}
function createLogEnvelope(logs, metadata, tunnel, dsn, inferUserData) {
  const headers = {};
  if (metadata?.sdk) {
    headers.sdk = {
      name: metadata.sdk.name,
      version: metadata.sdk.version
    };
  }
  if (!!tunnel && !!dsn) {
    headers.dsn = dsnToString(dsn);
  }
  return createEnvelope(headers, [createLogContainerEnvelopeItem(logs, inferUserData)]);
}
var init_envelope3 = __esm({
  "node_modules/@sentry/core/build/esm/logs/envelope.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_dsn();
    init_envelope();
    init_isBrowser();
    __name(createLogContainerEnvelopeItem, "createLogContainerEnvelopeItem");
    __name(createLogEnvelope, "createLogEnvelope");
  }
});

// node_modules/@sentry/core/build/esm/logs/internal.js
function _INTERNAL_flushLogsBuffer(client, maybeLogBuffer) {
  const logBuffer = maybeLogBuffer ?? _INTERNAL_getLogBuffer(client) ?? [];
  if (logBuffer.length === 0) {
    return;
  }
  const clientOptions = client.getOptions();
  const envelope = createLogEnvelope(
    logBuffer,
    clientOptions._metadata,
    clientOptions.tunnel,
    client.getDsn(),
    client.getDataCollectionOptions().userInfo
  );
  _getBufferMap().set(client, []);
  client.emit("flushLogs");
  client.sendEnvelope(envelope);
}
function _INTERNAL_getLogBuffer(client) {
  return _getBufferMap().get(client);
}
function _getBufferMap() {
  return getGlobalSingleton("clientToLogBufferMap", () => /* @__PURE__ */ new WeakMap());
}
var init_internal = __esm({
  "node_modules/@sentry/core/build/esm/logs/internal.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_carrier();
    init_envelope3();
    __name(_INTERNAL_flushLogsBuffer, "_INTERNAL_flushLogsBuffer");
    __name(_INTERNAL_getLogBuffer, "_INTERNAL_getLogBuffer");
    __name(_getBufferMap, "_getBufferMap");
  }
});

// node_modules/@sentry/core/build/esm/metrics/envelope.js
function createMetricContainerEnvelopeItem(items, inferUserData) {
  const inferSetting = inferUserData ? "auto" : "never";
  return [
    {
      type: "trace_metric",
      item_count: items.length,
      content_type: "application/vnd.sentry.items.trace-metric+json"
    },
    {
      version: 2,
      ...isBrowser() && {
        ingest_settings: { infer_ip: inferSetting, infer_user_agent: inferSetting }
      },
      items
    }
  ];
}
function createMetricEnvelope(metrics, metadata, tunnel, dsn, inferUserData) {
  const headers = {};
  if (metadata?.sdk) {
    headers.sdk = {
      name: metadata.sdk.name,
      version: metadata.sdk.version
    };
  }
  if (!!tunnel && !!dsn) {
    headers.dsn = dsnToString(dsn);
  }
  return createEnvelope(headers, [createMetricContainerEnvelopeItem(metrics, inferUserData)]);
}
var init_envelope4 = __esm({
  "node_modules/@sentry/core/build/esm/metrics/envelope.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_dsn();
    init_envelope();
    init_isBrowser();
    __name(createMetricContainerEnvelopeItem, "createMetricContainerEnvelopeItem");
    __name(createMetricEnvelope, "createMetricEnvelope");
  }
});

// node_modules/@sentry/core/build/esm/metrics/internal.js
function _INTERNAL_flushMetricsBuffer(client, maybeMetricBuffer) {
  const metricBuffer = maybeMetricBuffer ?? _INTERNAL_getMetricBuffer(client) ?? [];
  if (metricBuffer.length === 0) {
    return;
  }
  const clientOptions = client.getOptions();
  const envelope = createMetricEnvelope(
    metricBuffer,
    clientOptions._metadata,
    clientOptions.tunnel,
    client.getDsn(),
    client.getDataCollectionOptions().userInfo
  );
  _getBufferMap2().set(client, []);
  client.emit("flushMetrics");
  client.sendEnvelope(envelope);
}
function _INTERNAL_getMetricBuffer(client) {
  return _getBufferMap2().get(client);
}
function _getBufferMap2() {
  return getGlobalSingleton("clientToMetricBufferMap", () => /* @__PURE__ */ new WeakMap());
}
var init_internal2 = __esm({
  "node_modules/@sentry/core/build/esm/metrics/internal.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_carrier();
    init_envelope4();
    __name(_INTERNAL_flushMetricsBuffer, "_INTERNAL_flushMetricsBuffer");
    __name(_INTERNAL_getMetricBuffer, "_INTERNAL_getMetricBuffer");
    __name(_getBufferMap2, "_getBufferMap");
  }
});

// node_modules/@sentry/core/build/esm/tracing/spans/spanJsonToStreamedSpan.js
function spanJsonToSerializedStreamedSpan(span) {
  const streamedSpan = {
    trace_id: span.trace_id,
    span_id: span.span_id,
    parent_span_id: span.parent_span_id,
    name: span.description || "",
    start_timestamp: span.start_timestamp,
    end_timestamp: span.timestamp || span.start_timestamp,
    status: !span.status || span.status === "ok" || span.status === "cancelled" ? "ok" : "error",
    is_segment: false,
    attributes: { ...span.data },
    links: span.links
  };
  return streamedSpanJsonToSerializedSpan(streamedSpan);
}
var init_spanJsonToStreamedSpan = __esm({
  "node_modules/@sentry/core/build/esm/tracing/spans/spanJsonToStreamedSpan.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_spanUtils();
    __name(spanJsonToSerializedStreamedSpan, "spanJsonToSerializedStreamedSpan");
  }
});

// node_modules/@sentry/core/build/esm/tracing/spans/extractGenAiSpans.js
function extractGenAiSpansFromEvent(event, client) {
  if (event.type !== "transaction" || !event.spans?.length || !event.sdkProcessingMetadata?.hasGenAiSpans || client.getOptions().streamGenAiSpans === false || hasSpanStreamingEnabled(client)) {
    return void 0;
  }
  const genAiSpans = [];
  const remainingSpans = [];
  for (const span of event.spans) {
    if (span.op?.startsWith("gen_ai.")) {
      genAiSpans.push(spanJsonToSerializedStreamedSpan(span));
    } else {
      remainingSpans.push(span);
    }
  }
  if (genAiSpans.length === 0) {
    return void 0;
  }
  event.spans = remainingSpans;
  const inferSetting = client.getDataCollectionOptions().userInfo ? "auto" : "never";
  return [
    { type: "span", item_count: genAiSpans.length, content_type: "application/vnd.sentry.items.span.v2+json" },
    {
      version: 2,
      ...isBrowser() && {
        ingest_settings: { infer_ip: inferSetting, infer_user_agent: inferSetting }
      },
      items: genAiSpans
    }
  ];
}
var init_extractGenAiSpans = __esm({
  "node_modules/@sentry/core/build/esm/tracing/spans/extractGenAiSpans.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_isBrowser();
    init_hasSpanStreamingEnabled();
    init_spanJsonToStreamedSpan();
    __name(extractGenAiSpansFromEvent, "extractGenAiSpansFromEvent");
  }
});

// node_modules/@sentry/core/build/esm/utils/promisebuffer.js
function makePromiseBuffer(limit = 100) {
  const buffer = /* @__PURE__ */ new Set();
  function isReady() {
    return buffer.size < limit;
  }
  __name(isReady, "isReady");
  function remove(task) {
    buffer.delete(task);
  }
  __name(remove, "remove");
  function add(taskProducer) {
    if (!isReady()) {
      return rejectedSyncPromise(SENTRY_BUFFER_FULL_ERROR);
    }
    const task = taskProducer();
    buffer.add(task);
    void task.then(
      () => remove(task),
      () => remove(task)
    );
    return task;
  }
  __name(add, "add");
  function drain(timeout) {
    if (!buffer.size) {
      return resolvedSyncPromise(true);
    }
    const drainPromise = Promise.allSettled(Array.from(buffer)).then(() => true);
    if (!timeout) {
      return drainPromise;
    }
    const promises = [
      drainPromise,
      new Promise((resolve2) => safeUnref(setTimeout(() => resolve2(false), timeout)))
    ];
    return Promise.race(promises);
  }
  __name(drain, "drain");
  return {
    get $() {
      return Array.from(buffer);
    },
    add,
    drain
  };
}
var SENTRY_BUFFER_FULL_ERROR;
var init_promisebuffer = __esm({
  "node_modules/@sentry/core/build/esm/utils/promisebuffer.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_syncpromise();
    init_timer();
    SENTRY_BUFFER_FULL_ERROR = /* @__PURE__ */ Symbol.for("SentryBufferFullError");
    __name(makePromiseBuffer, "makePromiseBuffer");
  }
});

// node_modules/@sentry/core/build/esm/utils/ratelimit.js
function parseRetryAfterHeader(header, now = safeDateNow()) {
  const headerDelay = parseInt(`${header}`, 10);
  if (!isNaN(headerDelay)) {
    return headerDelay * 1e3;
  }
  const headerDate = Date.parse(`${header}`);
  if (!isNaN(headerDate)) {
    return headerDate - now;
  }
  return DEFAULT_RETRY_AFTER;
}
function disabledUntil(limits, dataCategory) {
  return limits[dataCategory] || limits.all || 0;
}
function isRateLimited(limits, dataCategory, now = safeDateNow()) {
  return disabledUntil(limits, dataCategory) > now;
}
function updateRateLimits(limits, { statusCode, headers }, now = safeDateNow()) {
  const updatedRateLimits = {
    ...limits
  };
  const rateLimitHeader = headers?.["x-sentry-rate-limits"];
  const retryAfterHeader = headers?.["retry-after"];
  if (rateLimitHeader) {
    for (const limit of rateLimitHeader.trim().split(",")) {
      const [retryAfter, categories, , , namespaces] = limit.split(":", 5);
      const headerDelay = parseInt(retryAfter, 10);
      const delay2 = (!isNaN(headerDelay) ? headerDelay : 60) * 1e3;
      if (!categories) {
        updatedRateLimits.all = now + delay2;
      } else {
        for (const category of categories.split(";")) {
          if (category === "metric_bucket") {
            if (!namespaces || namespaces.split(";").includes("custom")) {
              updatedRateLimits[category] = now + delay2;
            }
          } else {
            updatedRateLimits[category] = now + delay2;
          }
        }
      }
    }
  } else if (retryAfterHeader) {
    updatedRateLimits.all = now + parseRetryAfterHeader(retryAfterHeader, now);
  } else if (statusCode === 429) {
    updatedRateLimits.all = now + 60 * 1e3;
  }
  return updatedRateLimits;
}
var DEFAULT_RETRY_AFTER;
var init_ratelimit = __esm({
  "node_modules/@sentry/core/build/esm/utils/ratelimit.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_randomSafeContext();
    DEFAULT_RETRY_AFTER = 60 * 1e3;
    __name(parseRetryAfterHeader, "parseRetryAfterHeader");
    __name(disabledUntil, "disabledUntil");
    __name(isRateLimited, "isRateLimited");
    __name(updateRateLimits, "updateRateLimits");
  }
});

// node_modules/@sentry/core/build/esm/transports/base.js
function createTransport(options, makeRequest, buffer = makePromiseBuffer(
  options.bufferSize || DEFAULT_TRANSPORT_BUFFER_SIZE
)) {
  let rateLimits = {};
  const flush2 = /* @__PURE__ */ __name((timeout) => buffer.drain(timeout), "flush");
  function send(envelope) {
    const filteredEnvelopeItems = [];
    forEachEnvelopeItem(envelope, (item, type) => {
      const dataCategory = envelopeItemTypeToDataCategory(type);
      if (isRateLimited(rateLimits, dataCategory)) {
        options.recordDroppedEvent("ratelimit_backoff", dataCategory);
      } else {
        filteredEnvelopeItems.push(item);
      }
    });
    if (filteredEnvelopeItems.length === 0) {
      return Promise.resolve({});
    }
    const filteredEnvelope = createEnvelope(envelope[0], filteredEnvelopeItems);
    const recordEnvelopeLoss = /* @__PURE__ */ __name((reason) => {
      if (envelopeContainsItemType(filteredEnvelope, ["client_report"])) {
        DEBUG_BUILD && debug.warn(`Dropping client report. Will not send outcomes (reason: ${reason}).`);
        return;
      }
      forEachEnvelopeItem(filteredEnvelope, (item, type) => {
        options.recordDroppedEvent(reason, envelopeItemTypeToDataCategory(type));
      });
    }, "recordEnvelopeLoss");
    const requestTask = /* @__PURE__ */ __name(() => makeRequest({ body: serializeEnvelope(filteredEnvelope) }).then(
      (response) => {
        if (response.statusCode === 413) {
          DEBUG_BUILD && debug.error(
            "Sentry responded with status code 413. Envelope was discarded due to exceeding size limits."
          );
          recordEnvelopeLoss("send_error");
          return response;
        }
        if (DEBUG_BUILD && response.statusCode !== void 0 && (response.statusCode < 200 || response.statusCode >= 300)) {
          debug.warn(`Sentry responded with status code ${response.statusCode} to sent event.`);
        }
        rateLimits = updateRateLimits(rateLimits, response);
        return response;
      },
      (error2) => {
        recordEnvelopeLoss("network_error");
        DEBUG_BUILD && debug.error("Encountered error running transport request:", error2);
        throw error2;
      }
    ), "requestTask");
    return buffer.add(requestTask).then(
      (result) => result,
      (error2) => {
        if (error2 === SENTRY_BUFFER_FULL_ERROR) {
          DEBUG_BUILD && debug.error("Skipped sending event because buffer is full.");
          recordEnvelopeLoss("queue_overflow");
          return Promise.resolve({});
        } else {
          throw error2;
        }
      }
    );
  }
  __name(send, "send");
  return {
    send,
    flush: flush2
  };
}
var DEFAULT_TRANSPORT_BUFFER_SIZE;
var init_base = __esm({
  "node_modules/@sentry/core/build/esm/transports/base.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_debug_build();
    init_debug_logger();
    init_envelope();
    init_promisebuffer();
    init_ratelimit();
    DEFAULT_TRANSPORT_BUFFER_SIZE = 64;
    __name(createTransport, "createTransport");
  }
});

// node_modules/@sentry/core/build/esm/utils/clientreport.js
function createClientReportEnvelope(discarded_events, dsn, timestamp) {
  const clientReportItem = [
    { type: "client_report" },
    {
      timestamp: timestamp || dateTimestampInSeconds(),
      discarded_events
    }
  ];
  return createEnvelope(dsn ? { dsn } : {}, [clientReportItem]);
}
var init_clientreport = __esm({
  "node_modules/@sentry/core/build/esm/utils/clientreport.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_envelope();
    init_time();
    __name(createClientReportEnvelope, "createClientReportEnvelope");
  }
});

// node_modules/@sentry/core/build/esm/utils/eventUtils.js
function getPossibleEventMessages(event) {
  const possibleMessages = [];
  if (event.message) {
    possibleMessages.push(event.message);
  }
  try {
    const lastException = event.exception.values[event.exception.values.length - 1];
    if (lastException?.value) {
      possibleMessages.push(lastException.value);
      if (lastException.type) {
        possibleMessages.push(`${lastException.type}: ${lastException.value}`);
      }
    }
  } catch {
  }
  return possibleMessages;
}
var init_eventUtils = __esm({
  "node_modules/@sentry/core/build/esm/utils/eventUtils.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    __name(getPossibleEventMessages, "getPossibleEventMessages");
  }
});

// node_modules/@sentry/core/build/esm/utils/transactionEvent.js
function convertTransactionEventToSpanJson(event) {
  const { trace_id, parent_span_id, span_id, status, origin, data, op } = event.contexts?.trace ?? {};
  return {
    data: data ?? {},
    description: event.transaction,
    op,
    parent_span_id,
    span_id: span_id ?? "",
    start_timestamp: event.start_timestamp ?? 0,
    status,
    timestamp: event.timestamp,
    trace_id: trace_id ?? "",
    origin,
    profile_id: data?.[SEMANTIC_ATTRIBUTE_PROFILE_ID],
    exclusive_time: data?.[SEMANTIC_ATTRIBUTE_EXCLUSIVE_TIME],
    measurements: event.measurements,
    is_segment: true
  };
}
function convertSpanJsonToTransactionEvent(span) {
  return {
    type: "transaction",
    timestamp: span.timestamp,
    start_timestamp: span.start_timestamp,
    transaction: span.description,
    contexts: {
      trace: {
        trace_id: span.trace_id,
        span_id: span.span_id,
        parent_span_id: span.parent_span_id,
        op: span.op,
        status: span.status,
        origin: span.origin,
        data: {
          ...span.data,
          ...span.profile_id && { [SEMANTIC_ATTRIBUTE_PROFILE_ID]: span.profile_id },
          ...span.exclusive_time && { [SEMANTIC_ATTRIBUTE_EXCLUSIVE_TIME]: span.exclusive_time }
        }
      }
    },
    measurements: span.measurements
  };
}
var init_transactionEvent = __esm({
  "node_modules/@sentry/core/build/esm/utils/transactionEvent.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_semanticAttributes();
    __name(convertTransactionEventToSpanJson, "convertTransactionEventToSpanJson");
    __name(convertSpanJsonToTransactionEvent, "convertSpanJsonToTransactionEvent");
  }
});

// node_modules/@sentry/core/build/esm/utils/data-collection/filtering-snippets.js
var FILTERED_VALUE, PII_HEADER_SNIPPETS, SENSITIVE_KEY_SNIPPETS, SENSITIVE_COOKIE_NAME_SNIPPETS;
var init_filtering_snippets = __esm({
  "node_modules/@sentry/core/build/esm/utils/data-collection/filtering-snippets.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    FILTERED_VALUE = "[Filtered]";
    PII_HEADER_SNIPPETS = ["forwarded", "-ip", "remote-", "via", "-user"];
    SENSITIVE_KEY_SNIPPETS = [
      "auth",
      "token",
      "secret",
      "session",
      // for the user_session cookie
      "password",
      "passwd",
      "pwd",
      "key",
      "jwt",
      "bearer",
      "sso",
      "saml",
      "csrf",
      "xsrf",
      "credentials",
      "sid",
      "identity",
      // Always treat cookie headers as sensitive in case individual key-value cookie pairs cannot properly be extracted
      "set-cookie",
      "cookie"
    ];
    SENSITIVE_COOKIE_NAME_SNIPPETS = [
      // Express / Connect default session cookie
      ".sid",
      // Opaque session ids (PHPSESSID, ASPSESSIONID*, BIGipServer*, *sessid*, …)
      "sessid",
      // Laravel etc. "remember me" tokens
      "remember",
      // OIDC / OAuth auxiliary (`oauth*` covered by header snippet `auth`)
      "oidc",
      "pkce",
      "nonce",
      // RFC 6265bis high-security cookie name prefixes
      "__secure-",
      "__host-",
      // Load balancer / CDN sticky-session cookies (opaque routing tokens)
      "awsalb",
      "awselb",
      "akamai",
      // BaaS / IdP session cookies (names often omit "session")
      "__stripe",
      "cognito",
      "firebase",
      "supabase",
      "sb-",
      // Step-up / MFA cookies
      "mfa",
      "2fa"
    ];
  }
});

// node_modules/@sentry/core/build/esm/utils/data-collection/defaultPiiToCollectionOptions.js
function defaultPiiToCollectionOptions(sendDefaultPii) {
  return sendDefaultPii === true ? {
    userInfo: true,
    cookies: true,
    httpHeaders: { request: true, response: true },
    httpBodies: ["incomingRequest", "outgoingRequest", "incomingResponse", "outgoingResponse"],
    urlQueryParams: true,
    graphQL: { document: true, variables: true },
    genAI: { inputs: true, outputs: true },
    databaseQueryData: true,
    stackFrameVariables: true,
    frameContextLines: 7
    // default should be 5, but ContextLines integration uses 7
  } : {
    userInfo: false,
    cookies: { deny: PII_HEADER_SNIPPETS },
    httpHeaders: { request: { deny: PII_HEADER_SNIPPETS }, response: { deny: PII_HEADER_SNIPPETS } },
    httpBodies: [],
    urlQueryParams: { deny: PII_HEADER_SNIPPETS },
    // The GraphQL document has literal values redacted at collection time, so it was historically
    // always attached regardless of `sendDefaultPii`; keep it on to preserve that behavior.
    graphQL: { document: true, variables: true },
    genAI: { inputs: false, outputs: false },
    // Database query values were only sent with `sendDefaultPii: true` (e.g. Supabase gated on it),
    // so map the legacy "off" state to `false`.
    databaseQueryData: false,
    stackFrameVariables: true,
    frameContextLines: 7
    // default should be 5, but ContextLines integration uses 7
  };
}
var init_defaultPiiToCollectionOptions = __esm({
  "node_modules/@sentry/core/build/esm/utils/data-collection/defaultPiiToCollectionOptions.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_filtering_snippets();
    __name(defaultPiiToCollectionOptions, "defaultPiiToCollectionOptions");
  }
});

// node_modules/@sentry/core/build/esm/utils/data-collection/resolveDataCollectionOptions.js
function resolveDataCollectionOptions(options) {
  const base = options.dataCollection != null ? DEFAULTS : defaultPiiToCollectionOptions(options.sendDefaultPii);
  const dc = options.dataCollection ?? {};
  return {
    userInfo: dc.userInfo ?? base.userInfo,
    cookies: dc.cookies ?? base.cookies,
    httpHeaders: {
      request: dc.httpHeaders?.request ?? base.httpHeaders.request,
      response: dc.httpHeaders?.response ?? base.httpHeaders.response
    },
    httpBodies: dc.httpBodies ?? base.httpBodies,
    // oxlint-disable-next-line typescript/no-deprecated
    urlQueryParams: dc.urlQueryParams ?? dc.queryParams ?? base.urlQueryParams,
    graphQL: {
      document: dc.graphQL?.document ?? base.graphQL.document,
      variables: dc.graphQL?.variables ?? base.graphQL.variables
    },
    genAI: {
      inputs: dc.genAI?.inputs ?? base.genAI.inputs,
      outputs: dc.genAI?.outputs ?? base.genAI.outputs
    },
    databaseQueryData: dc.databaseQueryData ?? base.databaseQueryData,
    stackFrameVariables: dc.stackFrameVariables ?? base.stackFrameVariables,
    frameContextLines: dc.frameContextLines ?? base.frameContextLines
  };
}
var DEFAULTS;
var init_resolveDataCollectionOptions = __esm({
  "node_modules/@sentry/core/build/esm/utils/data-collection/resolveDataCollectionOptions.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_defaultPiiToCollectionOptions();
    DEFAULTS = {
      userInfo: true,
      cookies: true,
      httpHeaders: { request: true, response: true },
      httpBodies: ["incomingRequest", "outgoingRequest", "incomingResponse", "outgoingResponse"],
      urlQueryParams: true,
      graphQL: { document: true, variables: true },
      genAI: { inputs: true, outputs: true },
      databaseQueryData: true,
      stackFrameVariables: true,
      frameContextLines: 5
    };
    __name(resolveDataCollectionOptions, "resolveDataCollectionOptions");
  }
});

// node_modules/@sentry/core/build/esm/client.js
function _makeInternalError(message) {
  return {
    message,
    [INTERNAL_ERROR_SYMBOL]: true
  };
}
function _makeDoNotSendEventError(message) {
  return {
    message,
    [DO_NOT_SEND_EVENT_SYMBOL]: true
  };
}
function _isInternalError(error2) {
  return isObjectLike(error2) && INTERNAL_ERROR_SYMBOL in error2;
}
function _isDoNotSendEventError(error2) {
  return isObjectLike(error2) && DO_NOT_SEND_EVENT_SYMBOL in error2;
}
function setupWeightBasedFlushing(client, afterCaptureHook, flushHook, estimateSizeFn, flushFn) {
  let weight = 0;
  let flushTimeout;
  let isTimerActive = false;
  client.on(flushHook, () => {
    weight = 0;
    clearTimeout(flushTimeout);
    isTimerActive = false;
  });
  client.on(afterCaptureHook, (item) => {
    weight += estimateSizeFn(item);
    if (weight >= 8e5) {
      flushFn(client);
    } else if (!isTimerActive) {
      const flushInterval = client.getOptions()._flushInterval ?? DEFAULT_FLUSH_INTERVAL;
      if (flushInterval > 0) {
        isTimerActive = true;
        flushTimeout = safeUnref(
          setTimeout(() => {
            flushFn(client);
          }, flushInterval)
        );
      }
    }
  });
  client.on("flush", () => {
    flushFn(client);
  });
}
function getDataCategoryByType(type) {
  return type === "replay_event" ? "replay" : type || "error";
}
function _validateBeforeSendResult(beforeSendResult, beforeSendLabel) {
  const invalidValueError = `${beforeSendLabel} must return \`null\` or a valid event.`;
  if (isThenable(beforeSendResult)) {
    return beforeSendResult.then(
      (event) => {
        if (!isPlainObject(event) && event !== null) {
          throw _makeInternalError(invalidValueError);
        }
        return event;
      },
      (e) => {
        throw _makeInternalError(`${beforeSendLabel} rejected with ${e}`);
      }
    );
  } else if (!isPlainObject(beforeSendResult) && beforeSendResult !== null) {
    throw _makeInternalError(invalidValueError);
  }
  return beforeSendResult;
}
function processBeforeSend(client, options, event, hint) {
  const { beforeSend, beforeSendTransaction, ignoreSpans } = options;
  const beforeSendSpan = !isStreamedBeforeSendSpanCallback(options.beforeSendSpan) && options.beforeSendSpan;
  let processedEvent = event;
  if (isErrorEvent2(processedEvent) && beforeSend) {
    return beforeSend(processedEvent, hint);
  }
  if (isTransactionEvent(processedEvent)) {
    if (beforeSendSpan || ignoreSpans) {
      const rootSpanJson = convertTransactionEventToSpanJson(processedEvent);
      if (ignoreSpans?.length && shouldIgnoreSpan(
        { description: rootSpanJson.description, op: rootSpanJson.op, attributes: rootSpanJson.data },
        ignoreSpans
      )) {
        return null;
      }
      if (beforeSendSpan) {
        const processedRootSpanJson = beforeSendSpan(rootSpanJson);
        if (!processedRootSpanJson) {
          showSpanDropWarning();
        } else {
          processedEvent = merge(event, convertSpanJsonToTransactionEvent(processedRootSpanJson));
        }
      }
      if (processedEvent.spans) {
        const processedSpans = [];
        const initialSpans = processedEvent.spans;
        for (const span of initialSpans) {
          if (ignoreSpans?.length && shouldIgnoreSpan({ description: span.description, op: span.op, attributes: span.data }, ignoreSpans)) {
            reparentChildSpans(initialSpans, span);
            continue;
          }
          if (beforeSendSpan) {
            const processedSpan = beforeSendSpan(span);
            if (!processedSpan) {
              showSpanDropWarning();
              processedSpans.push(span);
            } else {
              processedSpans.push(processedSpan);
            }
          } else {
            processedSpans.push(span);
          }
        }
        const droppedSpans = processedEvent.spans.length - processedSpans.length;
        if (droppedSpans) {
          client.recordDroppedEvent("before_send", "span", droppedSpans);
        }
        processedEvent.spans = processedSpans;
      }
    }
    if (beforeSendTransaction) {
      if (processedEvent.spans) {
        const spanCountBefore = processedEvent.spans.length;
        processedEvent.sdkProcessingMetadata = {
          ...event.sdkProcessingMetadata,
          spanCountBeforeProcessing: spanCountBefore
        };
      }
      return beforeSendTransaction(processedEvent, hint);
    }
  }
  return processedEvent;
}
function isErrorEvent2(event) {
  return event.type === void 0;
}
function isTransactionEvent(event) {
  return event.type === "transaction";
}
function estimateMetricSizeInBytes(metric) {
  let weight = 0;
  if (metric.name) {
    weight += metric.name.length * 2;
  }
  weight += 8;
  return weight + estimateAttributesSizeInBytes(metric.attributes);
}
function estimateLogSizeInBytes(log2) {
  let weight = 0;
  if (log2.message) {
    weight += log2.message.length * 2;
  }
  return weight + estimateAttributesSizeInBytes(log2.attributes);
}
function estimateAttributesSizeInBytes(attributes) {
  if (!attributes) {
    return 0;
  }
  let weight = 0;
  Object.values(attributes).forEach((value) => {
    if (Array.isArray(value)) {
      weight += value.length * estimatePrimitiveSizeInBytes2(value[0]);
    } else if (isPrimitive(value)) {
      weight += estimatePrimitiveSizeInBytes2(value);
    } else {
      weight += 100;
    }
  });
  return weight;
}
function estimatePrimitiveSizeInBytes2(value) {
  if (typeof value === "string") {
    return value.length * 2;
  } else if (typeof value === "number") {
    return 8;
  } else if (typeof value === "boolean") {
    return 4;
  }
  return 0;
}
var ALREADY_SEEN_ERROR, MISSING_RELEASE_FOR_SESSION_ERROR, INTERNAL_ERROR_SYMBOL, DO_NOT_SEND_EVENT_SYMBOL, DEFAULT_FLUSH_INTERVAL, Client;
var init_client = __esm({
  "node_modules/@sentry/core/build/esm/client.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_api();
    init_constants();
    init_currentScopes();
    init_debug_build();
    init_envelope2();
    init_integration();
    init_internal();
    init_internal2();
    init_session();
    init_dynamicSamplingContext();
    init_beforeSendSpan();
    init_extractGenAiSpans();
    init_base();
    init_clientreport();
    init_debug_logger();
    init_dsn();
    init_envelope();
    init_eventUtils();
    init_is();
    init_merge();
    init_misc();
    init_parseSampleRate();
    init_prepareEvent();
    init_promisebuffer();
    init_randomSafeContext();
    init_should_ignore_span();
    init_spanUtils();
    init_syncpromise();
    init_timer();
    init_transactionEvent();
    init_resolveDataCollectionOptions();
    ALREADY_SEEN_ERROR = "Not capturing exception because it's already been captured.";
    MISSING_RELEASE_FOR_SESSION_ERROR = "Discarded session because of missing or non-string release";
    INTERNAL_ERROR_SYMBOL = /* @__PURE__ */ Symbol.for("SentryInternalError");
    DO_NOT_SEND_EVENT_SYMBOL = /* @__PURE__ */ Symbol.for("SentryDoNotSendEventError");
    DEFAULT_FLUSH_INTERVAL = 5e3;
    __name(_makeInternalError, "_makeInternalError");
    __name(_makeDoNotSendEventError, "_makeDoNotSendEventError");
    __name(_isInternalError, "_isInternalError");
    __name(_isDoNotSendEventError, "_isDoNotSendEventError");
    __name(setupWeightBasedFlushing, "setupWeightBasedFlushing");
    Client = class {
      /**
       * Initializes this client instance.
       *
       * @param options Options for the client.
       */
      constructor(options) {
        this._options = options;
        this._integrations = {};
        this._numProcessing = 0;
        this._outcomes = {};
        this._hooks = {};
        this._eventProcessors = [];
        this._promiseBuffer = makePromiseBuffer(options.transportOptions?.bufferSize ?? DEFAULT_TRANSPORT_BUFFER_SIZE);
        this._dataCollection = resolveDataCollectionOptions(options);
        if (options.dsn) {
          this._dsn = makeDsn(options.dsn);
        } else {
          DEBUG_BUILD && debug.warn("No DSN provided, client will not send events.");
        }
        if (this._dsn) {
          const url = getEnvelopeEndpointWithUrlEncodedAuth(
            this._dsn,
            options.tunnel,
            options._metadata ? options._metadata.sdk : void 0
          );
          this._transport = options.transport({
            tunnel: this._options.tunnel,
            recordDroppedEvent: this.recordDroppedEvent.bind(this),
            ...options.transportOptions,
            url
          });
        }
        this._options.enableLogs = this._options.enableLogs ?? this._options._experiments?.enableLogs;
        if (this._options.enableLogs) {
          setupWeightBasedFlushing(this, "afterCaptureLog", "flushLogs", estimateLogSizeInBytes, _INTERNAL_flushLogsBuffer);
        }
        const enableMetrics = this._options.enableMetrics ?? this._options._experiments?.enableMetrics ?? true;
        if (enableMetrics) {
          setupWeightBasedFlushing(
            this,
            "afterCaptureMetric",
            "flushMetrics",
            estimateMetricSizeInBytes,
            _INTERNAL_flushMetricsBuffer
          );
        }
      }
      /**
       * Captures an exception event and sends it to Sentry.
       *
       * Unlike `captureException` exported from every SDK, this method requires that you pass it the current scope.
       */
      captureException(exception, hint, scope) {
        const eventId = uuid4();
        if (checkOrSetAlreadyCaught(exception)) {
          DEBUG_BUILD && debug.log(ALREADY_SEEN_ERROR);
          return eventId;
        }
        const hintWithEventId = {
          event_id: eventId,
          ...hint
        };
        this._process(
          () => this.eventFromException(exception, hintWithEventId).then((event) => this._captureEvent(event, hintWithEventId, scope)).then((res) => res),
          "error"
        );
        return hintWithEventId.event_id;
      }
      /**
       * Captures a message event and sends it to Sentry.
       *
       * Unlike `captureMessage` exported from every SDK, this method requires that you pass it the current scope.
       */
      captureMessage(message, level, hint, currentScope) {
        const hintWithEventId = {
          event_id: uuid4(),
          ...hint
        };
        const eventMessage = isParameterizedString(message) ? message : String(message);
        const isMessage = isPrimitive(message);
        const promisedEvent = isMessage ? this.eventFromMessage(eventMessage, level, hintWithEventId) : this.eventFromException(message, hintWithEventId);
        this._process(
          () => promisedEvent.then((event) => this._captureEvent(event, hintWithEventId, currentScope)),
          isMessage ? "unknown" : "error"
        );
        return hintWithEventId.event_id;
      }
      /**
       * Captures a manually created event and sends it to Sentry.
       *
       * Unlike `captureEvent` exported from every SDK, this method requires that you pass it the current scope.
       */
      captureEvent(event, hint, currentScope) {
        const eventId = uuid4();
        if (hint?.originalException && checkOrSetAlreadyCaught(hint.originalException)) {
          DEBUG_BUILD && debug.log(ALREADY_SEEN_ERROR);
          return eventId;
        }
        const hintWithEventId = {
          event_id: eventId,
          ...hint
        };
        const sdkProcessingMetadata = event.sdkProcessingMetadata || {};
        const capturedSpanScope = sdkProcessingMetadata.capturedSpanScope;
        const capturedSpanIsolationScope = sdkProcessingMetadata.capturedSpanIsolationScope;
        const dataCategory = getDataCategoryByType(event.type);
        this._process(
          () => this._captureEvent(event, hintWithEventId, capturedSpanScope || currentScope, capturedSpanIsolationScope),
          dataCategory
        );
        return hintWithEventId.event_id;
      }
      /**
       * Captures a session.
       */
      captureSession(session) {
        this.sendSession(session);
        updateSession(session, { init: false });
      }
      /**
       * Get the current Dsn.
       */
      getDsn() {
        return this._dsn;
      }
      /**
       * Get the current options.
       */
      getOptions() {
        return this._options;
      }
      /**
       * Get the resolved data collection configuration.
       */
      getDataCollectionOptions() {
        return this._dataCollection;
      }
      /**
       * Get the SDK metadata.
       * @see SdkMetadata
       */
      getSdkMetadata() {
        return this._options._metadata;
      }
      /**
       * Returns the transport that is used by the client.
       * Please note that the transport gets lazy initialized so it will only be there once the first event has been sent.
       */
      getTransport() {
        return this._transport;
      }
      /**
       * Wait for all events to be sent or the timeout to expire, whichever comes first.
       *
       * @param timeout Maximum time in ms the client should wait for events to be flushed. Omitting this parameter will
       *   cause the client to wait until all events are sent before resolving the promise.
       * @returns A promise that will resolve with `true` if all events are sent before the timeout, or `false` if there are
       * still events in the queue when the timeout is reached.
       */
      // @ts-expect-error - PromiseLike is a subset of Promise
      async flush(timeout) {
        const transport = this._transport;
        this.emit("flush");
        if (!transport) {
          return true;
        }
        const clientFinished = await this._isClientDoneProcessing(timeout);
        const transportFlushed = await transport.flush(timeout);
        return clientFinished && transportFlushed;
      }
      /**
       * Flush the event queue and set the client to `enabled = false`. See {@link Client.flush}.
       *
       * @param {number} timeout Maximum time in ms the client should wait before shutting down. Omitting this parameter will cause
       *   the client to wait until all events are sent before disabling itself.
       * @returns {Promise<boolean>} A promise which resolves to `true` if the flush completes successfully before the timeout, or `false` if
       * it doesn't.
       */
      // @ts-expect-error - PromiseLike is a subset of Promise
      async close(timeout) {
        const result = await this.flush(timeout);
        this.getOptions().enabled = false;
        this.emit("close");
        return result;
      }
      /**
       * Get all installed event processors.
       */
      getEventProcessors() {
        return this._eventProcessors;
      }
      /**
       * Adds an event processor that applies to any event processed by this client.
       */
      addEventProcessor(eventProcessor) {
        this._eventProcessors.push(eventProcessor);
      }
      /**
       * Initialize this client.
       * Call this after the client was set on a scope.
       */
      init() {
        if (this._isEnabled() || // Force integrations to be setup even if no DSN was set when we have
        // Spotlight enabled. This is particularly important for browser as we
        // don't support the `spotlight` option there and rely on the users
        // adding the `spotlightBrowserIntegration()` to their integrations which
        // wouldn't get initialized with the check below when there's no DSN set.
        this._options.integrations.some(({ name }) => name.startsWith("Spotlight"))) {
          this._setupIntegrations();
        }
      }
      /**
       * Gets an installed integration by its name.
       *
       * @returns {Integration|undefined} The installed integration or `undefined` if no integration with that `name` was installed.
       */
      getIntegrationByName(integrationName) {
        return this._integrations[integrationName];
      }
      /**
       * Returns the names of all installed integrations.
       */
      getIntegrationNames() {
        return Object.keys(this._integrations);
      }
      /**
       * Add an integration to the client.
       * This can be used to e.g. lazy load integrations.
       * In most cases, this should not be necessary,
       * and you're better off just passing the integrations via `integrations: []` at initialization time.
       * However, if you find the need to conditionally load & add an integration, you can use `addIntegration` to do so.
       */
      addIntegration(integration) {
        const isAlreadyInstalled = this._integrations[integration.name];
        if (!isAlreadyInstalled && integration.beforeSetup) {
          integration.beforeSetup(this);
        }
        setupIntegration(this, integration, this._integrations);
        if (!isAlreadyInstalled) {
          afterSetupIntegrations(this, [integration]);
        }
      }
      /**
       * Send a fully prepared event to Sentry.
       */
      sendEvent(event, hint = {}) {
        this.emit("beforeSendEvent", event, hint);
        const genAiSpanItem = extractGenAiSpansFromEvent(event, this);
        let env = createEventEnvelope(event, this._dsn, this._options._metadata, this._options.tunnel);
        for (const attachment of hint.attachments || []) {
          env = addItemToEnvelope(env, createAttachmentEnvelopeItem(attachment));
        }
        if (genAiSpanItem) {
          env = addItemToEnvelope(env, genAiSpanItem);
        }
        this.sendEnvelope(env).then((sendResponse) => this.emit("afterSendEvent", event, sendResponse));
      }
      /**
       * Send a session or session aggregrates to Sentry.
       */
      sendSession(session) {
        const { release: clientReleaseOption, environment: clientEnvironmentOption = DEFAULT_ENVIRONMENT } = this._options;
        if ("aggregates" in session) {
          const sessionAttrs = session.attrs || {};
          if (!sessionAttrs.release && !clientReleaseOption) {
            DEBUG_BUILD && debug.warn(MISSING_RELEASE_FOR_SESSION_ERROR);
            return;
          }
          sessionAttrs.release = sessionAttrs.release || clientReleaseOption;
          sessionAttrs.environment = sessionAttrs.environment || clientEnvironmentOption;
          session.attrs = sessionAttrs;
        } else {
          if (!session.release && !clientReleaseOption) {
            DEBUG_BUILD && debug.warn(MISSING_RELEASE_FOR_SESSION_ERROR);
            return;
          }
          session.release = session.release || clientReleaseOption;
          session.environment = session.environment || clientEnvironmentOption;
        }
        this.emit("beforeSendSession", session);
        const env = createSessionEnvelope(session, this._dsn, this._options._metadata, this._options.tunnel);
        this.sendEnvelope(env);
      }
      /**
       * Record on the client that an event got dropped (ie, an event that will not be sent to Sentry).
       */
      recordDroppedEvent(reason, category, count = 1) {
        if (this._options.sendClientReports) {
          const key = `${reason}:${category}`;
          DEBUG_BUILD && debug.log(`Recording outcome: "${key}"${count > 1 ? ` (${count} times)` : ""}`);
          this._outcomes[key] = (this._outcomes[key] || 0) + count;
        }
      }
      /**
       * Register a hook on this client.
       */
      on(hook, callback) {
        const hookCallbacks = this._hooks[hook] = this._hooks[hook] || /* @__PURE__ */ new Set();
        const uniqueCallback = /* @__PURE__ */ __name((...args) => callback(...args), "uniqueCallback");
        hookCallbacks.add(uniqueCallback);
        return () => {
          hookCallbacks.delete(uniqueCallback);
        };
      }
      /**
       * Emit a hook that was previously registered via `on()`.
       */
      emit(hook, ...rest) {
        const callbacks = this._hooks[hook];
        if (callbacks) {
          callbacks.forEach((callback) => callback(...rest));
        }
      }
      /**
       * Send an envelope to Sentry.
       */
      // @ts-expect-error - PromiseLike is a subset of Promise
      async sendEnvelope(envelope) {
        this.emit("beforeEnvelope", envelope);
        if (this._isEnabled() && this._transport) {
          try {
            return await this._transport.send(envelope);
          } catch (reason) {
            DEBUG_BUILD && debug.error("Error while sending envelope:", reason);
            return {};
          }
        }
        DEBUG_BUILD && debug.error("Transport disabled");
        return {};
      }
      /**
       * Register a cleanup function to be called when the client is disposed.
       * This is useful for integrations that need to clean up global state.
       *
       * NOTE: This is a no-op in the base `Client` class. Subclasses like `ServerRuntimeClient`
       * override this method to actually register and execute cleanup callbacks.
       */
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      registerCleanup(callback) {
      }
      /**
       * Disposes of the client and releases all resources.
       *
       * Subclasses should override this method to clean up their own resources, including invoking
       * any callbacks registered via {@link Client.registerCleanup}. The base implementation is a
       * no-op and does NOT execute registered cleanup callbacks.
       *
       * After calling dispose(), the client should not be used anymore.
       */
      dispose() {
      }
      /* eslint-enable @typescript-eslint/unified-signatures */
      /** Setup integrations for this client. */
      _setupIntegrations() {
        const { integrations } = this._options;
        this._integrations = setupIntegrations(this, integrations);
        afterSetupIntegrations(this, integrations);
      }
      /** Updates existing session based on the provided event */
      _updateSessionFromEvent(session, event) {
        let crashed = event.level === "fatal";
        let errored = false;
        const exceptions = event.exception?.values;
        if (exceptions) {
          errored = true;
          crashed = false;
          for (const ex of exceptions) {
            if (ex.mechanism?.handled === false) {
              crashed = true;
              break;
            }
          }
        }
        const sessionNonTerminal = session.status === "ok";
        const shouldUpdateAndSend = sessionNonTerminal && session.errors === 0 || sessionNonTerminal && crashed;
        if (shouldUpdateAndSend) {
          updateSession(session, {
            ...crashed && { status: "crashed" },
            errors: session.errors || Number(errored || crashed)
          });
          this.captureSession(session);
        }
      }
      /**
       * Determine if the client is finished processing. Returns a promise because it will wait `timeout` ms before saying
       * "no" (resolving to `false`) in order to give the client a chance to potentially finish first.
       *
       * @param timeout The time, in ms, after which to resolve to `false` if the client is still busy. Passing `0` (or not
       * passing anything) will make the promise wait as long as it takes for processing to finish before resolving to
       * `true`.
       * @returns A promise which will resolve to `true` if processing is already done or finishes before the timeout, and
       * `false` otherwise
       */
      async _isClientDoneProcessing(timeout) {
        let ticked = 0;
        while (!timeout || ticked < timeout) {
          await new Promise((resolve2) => setTimeout(resolve2, 1));
          if (!this._numProcessing) {
            return true;
          }
          ticked++;
        }
        return false;
      }
      /** Determines whether this SDK is enabled and a transport is present. */
      _isEnabled() {
        return this.getOptions().enabled !== false && this._transport !== void 0;
      }
      /**
       * Adds common information to events.
       *
       * The information includes release and environment from `options`,
       * breadcrumbs and context (extra, tags and user) from the scope.
       *
       * Information that is already present in the event is never overwritten. For
       * nested objects, such as the context, keys are merged.
       *
       * @param event The original event.
       * @param hint May contain additional information about the original exception.
       * @param currentScope A scope containing event metadata.
       * @returns A new event with more information.
       */
      _prepareEvent(event, hint, currentScope, isolationScope) {
        const options = this.getOptions();
        const integrations = this.getIntegrationNames();
        if (!hint.integrations && integrations.length) {
          hint.integrations = integrations;
        }
        this.emit("preprocessEvent", event, hint);
        if (!event.type) {
          isolationScope.setLastEventId(event.event_id || hint.event_id);
        }
        return prepareEvent(options, event, hint, currentScope, this, isolationScope).then((evt) => {
          if (evt === null) {
            return evt;
          }
          this.emit("postprocessEvent", evt, hint);
          evt.contexts = {
            trace: { ...evt.contexts?.trace, ...getTraceContextFromScope(currentScope) },
            ...evt.contexts
          };
          const dynamicSamplingContext = getDynamicSamplingContextFromScope(this, currentScope);
          evt.sdkProcessingMetadata = {
            dynamicSamplingContext,
            ...evt.sdkProcessingMetadata
          };
          return evt;
        });
      }
      /**
       * Processes the event and logs an error in case of rejection
       * @param event
       * @param hint
       * @param scope
       */
      _captureEvent(event, hint = {}, currentScope = getCurrentScope(), isolationScope = getIsolationScope()) {
        if (DEBUG_BUILD && isErrorEvent2(event)) {
          debug.log(`Captured error event \`${getPossibleEventMessages(event)[0] || "<unknown>"}\``);
        }
        return this._processEvent(event, hint, currentScope, isolationScope).then(
          (finalEvent) => {
            return finalEvent.event_id;
          },
          (reason) => {
            if (DEBUG_BUILD) {
              if (_isDoNotSendEventError(reason)) {
                debug.log(reason.message);
              } else if (_isInternalError(reason)) {
                debug.warn(reason.message);
              } else {
                debug.warn(reason);
              }
            }
            return void 0;
          }
        );
      }
      /**
       * Processes an event (either error or message) and sends it to Sentry.
       *
       * This also adds breadcrumbs and context information to the event. However,
       * platform specific meta data (such as the User's IP address) must be added
       * by the SDK implementor.
       *
       *
       * @param event The event to send to Sentry.
       * @param hint May contain additional information about the original exception.
       * @param currentScope A scope containing event metadata.
       * @returns A SyncPromise that resolves with the event or rejects in case event was/will not be send.
       */
      _processEvent(event, hint, currentScope, isolationScope) {
        const options = this.getOptions();
        const { sampleRate } = options;
        const isTransaction = isTransactionEvent(event);
        const isError2 = isErrorEvent2(event);
        const eventType = event.type || "error";
        const beforeSendLabel = `before send for type \`${eventType}\``;
        const parsedSampleRate = typeof sampleRate === "undefined" ? void 0 : parseSampleRate(sampleRate);
        if (isError2 && typeof parsedSampleRate === "number" && safeMathRandom() > parsedSampleRate) {
          this.recordDroppedEvent("sample_rate", "error");
          return rejectedSyncPromise(
            _makeDoNotSendEventError(
              `Discarding event because it's not included in the random sample (sampling rate = ${sampleRate})`
            )
          );
        }
        const dataCategory = getDataCategoryByType(event.type);
        return this._prepareEvent(event, hint, currentScope, isolationScope).then((prepared) => {
          if (prepared === null) {
            this.recordDroppedEvent("event_processor", dataCategory);
            throw _makeDoNotSendEventError("An event processor returned `null`, will not send event.");
          }
          const isInternalException = hint.data?.__sentry__ === true;
          if (isInternalException) {
            return prepared;
          }
          const result = processBeforeSend(this, options, prepared, hint);
          return _validateBeforeSendResult(result, beforeSendLabel);
        }).then((processedEvent) => {
          if (processedEvent === null) {
            this.recordDroppedEvent("before_send", dataCategory);
            if (isTransaction) {
              const spans = event.spans || [];
              const spanCount = 1 + spans.length;
              this.recordDroppedEvent("before_send", "span", spanCount);
            }
            throw _makeDoNotSendEventError(`${beforeSendLabel} returned \`null\`, will not send event.`);
          }
          const session = currentScope.getSession() || isolationScope.getSession();
          if (isError2 && session) {
            this._updateSessionFromEvent(session, processedEvent);
          }
          if (isTransaction) {
            const spanCountBefore = processedEvent.sdkProcessingMetadata?.spanCountBeforeProcessing || 0;
            const spanCountAfter = processedEvent.spans ? processedEvent.spans.length : 0;
            const droppedSpanCount = spanCountBefore - spanCountAfter;
            if (droppedSpanCount > 0) {
              this.recordDroppedEvent("before_send", "span", droppedSpanCount);
            }
          }
          const transactionInfo = processedEvent.transaction_info;
          if (isTransaction && transactionInfo && processedEvent.transaction !== event.transaction) {
            const source = "custom";
            processedEvent.transaction_info = {
              ...transactionInfo,
              source
            };
          }
          this.sendEvent(processedEvent, hint);
          return processedEvent;
        }).then(null, (reason) => {
          if (_isDoNotSendEventError(reason) || _isInternalError(reason)) {
            throw reason;
          }
          this.captureException(reason, {
            mechanism: {
              handled: false,
              type: "internal"
            },
            data: {
              __sentry__: true
            },
            originalException: reason
          });
          throw _makeInternalError(
            `Event processing pipeline threw an error, original event will not be sent. Details have been sent as a new event.
Reason: ${reason}`
          );
        });
      }
      /**
       * Occupies the client with processing and event
       */
      _process(taskProducer, dataCategory) {
        this._numProcessing++;
        void this._promiseBuffer.add(taskProducer).then(
          (value) => {
            this._numProcessing--;
            return value;
          },
          (reason) => {
            this._numProcessing--;
            if (reason === SENTRY_BUFFER_FULL_ERROR) {
              this.recordDroppedEvent("queue_overflow", dataCategory);
            }
            return reason;
          }
        );
      }
      /**
       * Clears outcomes on this client and returns them.
       */
      _clearOutcomes() {
        const outcomes = this._outcomes;
        this._outcomes = {};
        return Object.entries(outcomes).map(([key, quantity]) => {
          const [reason, category] = key.split(":");
          return {
            reason,
            category,
            quantity
          };
        });
      }
      /**
       * Sends client reports as an envelope.
       */
      _flushOutcomes() {
        DEBUG_BUILD && debug.log("Flushing outcomes...");
        const outcomes = this._clearOutcomes();
        if (outcomes.length === 0) {
          DEBUG_BUILD && debug.log("No outcomes to send");
          return;
        }
        if (!this._dsn) {
          DEBUG_BUILD && debug.log("No dsn provided, will not send outcomes");
          return;
        }
        DEBUG_BUILD && debug.log("Sending outcomes:", outcomes);
        const envelope = createClientReportEnvelope(outcomes, this._options.tunnel && dsnToString(this._dsn));
        this.sendEnvelope(envelope);
      }
    };
    __name(Client, "Client");
    __name(getDataCategoryByType, "getDataCategoryByType");
    __name(_validateBeforeSendResult, "_validateBeforeSendResult");
    __name(processBeforeSend, "processBeforeSend");
    __name(isErrorEvent2, "isErrorEvent");
    __name(isTransactionEvent, "isTransactionEvent");
    __name(estimateMetricSizeInBytes, "estimateMetricSizeInBytes");
    __name(estimateLogSizeInBytes, "estimateLogSizeInBytes");
    __name(estimateAttributesSizeInBytes, "estimateAttributesSizeInBytes");
    __name(estimatePrimitiveSizeInBytes2, "estimatePrimitiveSizeInBytes");
  }
});

// node_modules/@sentry/core/build/esm/sdk.js
function initAndBind(clientClass, options) {
  if (options.debug === true) {
    if (DEBUG_BUILD) {
      debug.enable();
    } else {
      consoleSandbox(() => {
        console.warn("[Sentry] Cannot initialize SDK with `debug` option using a non-debug bundle.");
      });
    }
  }
  const scope = getCurrentScope();
  scope.update(options.initialScope);
  const client = new clientClass(options);
  setCurrentClient(client);
  client.init();
  return client;
}
function setCurrentClient(client) {
  getCurrentScope().setClient(client);
}
var init_sdk = __esm({
  "node_modules/@sentry/core/build/esm/sdk.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_currentScopes();
    init_debug_build();
    init_debug_logger();
    __name(initAndBind, "initAndBind");
    __name(setCurrentClient, "setCurrentClient");
  }
});

// node_modules/@sentry/core/build/esm/utils/data-collection/filterKeyValueData.js
function isSensitiveKey(lower, denySnippets) {
  return denySnippets.some((snippet) => lower.includes(snippet));
}
function filterKeyValueData(data, behavior, additionalDenyTerms) {
  if (behavior === false) {
    return {};
  }
  const denySnippets = additionalDenyTerms != null ? [...SENSITIVE_KEY_SNIPPETS, ...additionalDenyTerms] : SENSITIVE_KEY_SNIPPETS;
  const result = {};
  if (behavior === true) {
    for (const key of Object.keys(data)) {
      result[key] = isSensitiveKey(key.toLowerCase(), denySnippets) ? FILTERED_VALUE : data[key];
    }
    return result;
  }
  if ("deny" in behavior) {
    const lowerTerms2 = behavior.deny.map((t) => t.toLowerCase());
    for (const key of Object.keys(data)) {
      const lower = key.toLowerCase();
      const isDenied = isSensitiveKey(lower, denySnippets) || lowerTerms2.some((term) => lower.includes(term));
      result[key] = isDenied ? FILTERED_VALUE : data[key];
    }
    return result;
  }
  const lowerTerms = behavior.allow.map((t) => t.toLowerCase());
  for (const key of Object.keys(data)) {
    const lower = key.toLowerCase();
    if (isSensitiveKey(lower, denySnippets)) {
      result[key] = FILTERED_VALUE;
    } else {
      const isAllowed = lowerTerms.some((term) => lower.includes(term));
      result[key] = isAllowed ? data[key] : FILTERED_VALUE;
    }
  }
  return result;
}
var init_filterKeyValueData = __esm({
  "node_modules/@sentry/core/build/esm/utils/data-collection/filterKeyValueData.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_filtering_snippets();
    __name(isSensitiveKey, "isSensitiveKey");
    __name(filterKeyValueData, "filterKeyValueData");
  }
});

// node_modules/@sentry/core/build/esm/utils/cookie.js
function parseCookie(str) {
  const obj = {};
  let index = 0;
  while (index < str.length) {
    const eqIdx = str.indexOf("=", index);
    if (eqIdx === -1) {
      break;
    }
    let endIdx = str.indexOf(";", index);
    if (endIdx === -1) {
      endIdx = str.length;
    } else if (endIdx < eqIdx) {
      index = str.lastIndexOf(";", eqIdx - 1) + 1;
      continue;
    }
    const key = str.slice(index, eqIdx).trim();
    if (void 0 === obj[key]) {
      let val = str.slice(eqIdx + 1, endIdx).trim();
      if (val.charCodeAt(0) === 34) {
        val = val.slice(1, -1);
      }
      try {
        obj[key] = val.indexOf("%") !== -1 ? decodeURIComponent(val) : val;
      } catch {
        obj[key] = val;
      }
    }
    index = endIdx + 1;
  }
  return obj;
}
var init_cookie = __esm({
  "node_modules/@sentry/core/build/esm/utils/cookie.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    __name(parseCookie, "parseCookie");
  }
});

// node_modules/@sentry/core/build/esm/utils/envToBool.js
function envToBool(value, options) {
  const normalized = String(value).toLowerCase();
  if (FALSY_ENV_VALUES.has(normalized)) {
    return false;
  }
  if (TRUTHY_ENV_VALUES.has(normalized)) {
    return true;
  }
  return options?.strict ? null : Boolean(value);
}
var FALSY_ENV_VALUES, TRUTHY_ENV_VALUES;
var init_envToBool = __esm({
  "node_modules/@sentry/core/build/esm/utils/envToBool.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    FALSY_ENV_VALUES = /* @__PURE__ */ new Set(["false", "f", "n", "no", "off", "0"]);
    TRUTHY_ENV_VALUES = /* @__PURE__ */ new Set(["true", "t", "y", "yes", "on", "1"]);
    __name(envToBool, "envToBool");
  }
});

// node_modules/@sentry/core/build/esm/checkin.js
function createCheckInEnvelope(checkIn, dynamicSamplingContext, metadata, tunnel, dsn) {
  const headers = {
    sent_at: new Date(safeDateNow()).toISOString()
  };
  if (metadata?.sdk) {
    headers.sdk = {
      name: metadata.sdk.name,
      version: metadata.sdk.version
    };
  }
  if (!!tunnel && !!dsn) {
    headers.dsn = dsnToString(dsn);
  }
  if (dynamicSamplingContext) {
    headers.trace = dynamicSamplingContext;
  }
  const item = createCheckInEnvelopeItem(checkIn);
  return createEnvelope(headers, [item]);
}
function createCheckInEnvelopeItem(checkIn) {
  const checkInHeaders = {
    type: "check_in"
  };
  return [checkInHeaders, checkIn];
}
var init_checkin = __esm({
  "node_modules/@sentry/core/build/esm/checkin.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_dsn();
    init_envelope();
    init_randomSafeContext();
    __name(createCheckInEnvelope, "createCheckInEnvelope");
    __name(createCheckInEnvelopeItem, "createCheckInEnvelopeItem");
  }
});

// node_modules/@sentry/core/build/esm/utils/url.js
function isURLObjectRelative(url) {
  return "isRelative" in url;
}
function parseStringToURLObject(url, urlBase) {
  const isRelative = url.indexOf("://") <= 0 && url.indexOf("//") !== 0;
  const base = urlBase ?? (isRelative ? DEFAULT_BASE_URL : void 0);
  try {
    if ("canParse" in URL && !URL.canParse(url, base)) {
      return void 0;
    }
    const fullUrlObject = new URL(url, base);
    if (isRelative) {
      return {
        isRelative,
        pathname: fullUrlObject.pathname,
        search: fullUrlObject.search,
        hash: fullUrlObject.hash
      };
    }
    return fullUrlObject;
  } catch {
  }
  return void 0;
}
function getSanitizedUrlStringFromUrlObject(url) {
  if (isURLObjectRelative(url)) {
    return url.pathname;
  }
  const newUrl = new URL(url);
  newUrl.search = "";
  newUrl.hash = "";
  if (["80", "443"].includes(newUrl.port)) {
    newUrl.port = "";
  }
  if (newUrl.password) {
    newUrl.password = "%filtered%";
  }
  if (newUrl.username) {
    newUrl.username = "%filtered%";
  }
  return newUrl.toString();
}
function getHttpSpanNameFromUrlObject(urlObject, kind, request, routeName) {
  const method = request?.method?.toUpperCase() ?? "GET";
  const route = routeName ? routeName : urlObject ? kind === "client" ? getSanitizedUrlStringFromUrlObject(urlObject) : urlObject.pathname : "/";
  return `${method} ${route}`;
}
function getHttpSpanDetailsFromUrlObject(urlObject, kind, spanOrigin, request, routeName) {
  const attributes = {
    [SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: spanOrigin,
    [SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: "url"
  };
  if (routeName) {
    attributes[kind === "server" ? "http.route" : "url.template"] = routeName;
    attributes[SEMANTIC_ATTRIBUTE_SENTRY_SOURCE] = "route";
  }
  if (request?.method) {
    attributes[SEMANTIC_ATTRIBUTE_HTTP_REQUEST_METHOD] = request.method.toUpperCase();
  }
  if (urlObject) {
    if (urlObject.search) {
      attributes["url.query"] = urlObject.search;
    }
    if (urlObject.hash) {
      attributes["url.fragment"] = urlObject.hash;
    }
    if (urlObject.pathname) {
      attributes["url.path"] = urlObject.pathname;
      if (urlObject.pathname === "/") {
        attributes[SEMANTIC_ATTRIBUTE_SENTRY_SOURCE] = "route";
      }
    }
    if (!isURLObjectRelative(urlObject)) {
      attributes[SEMANTIC_ATTRIBUTE_URL_FULL] = urlObject.href;
      if (urlObject.port) {
        attributes["url.port"] = urlObject.port;
      }
      if (urlObject.protocol) {
        attributes["url.scheme"] = urlObject.protocol;
      }
      if (urlObject.hostname) {
        attributes[kind === "server" ? "server.address" : "url.domain"] = urlObject.hostname;
      }
    }
  }
  return [getHttpSpanNameFromUrlObject(urlObject, kind, request, routeName), attributes];
}
function stripDataUrlContent(url, includeDataPrefix = true) {
  if (url.startsWith("data:")) {
    const match = url.match(/^data:([^;,]+)/);
    const mimeType = match ? match[1] : "text/plain";
    const isBase64 = url.includes(";base64,");
    const dataStart = url.indexOf(",");
    let dataPrefix = "";
    if (includeDataPrefix && dataStart !== -1) {
      const data = url.slice(dataStart + 1);
      dataPrefix = data.length > 10 ? `${data.slice(0, 10)}... [truncated]` : data;
    }
    return `data:${mimeType}${isBase64 ? ",base64" : ""}${dataPrefix ? `,${dataPrefix}` : ""}`;
  }
  return url;
}
var DEFAULT_BASE_URL;
var init_url = __esm({
  "node_modules/@sentry/core/build/esm/utils/url.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_semanticAttributes();
    DEFAULT_BASE_URL = "thismessage:/";
    __name(isURLObjectRelative, "isURLObjectRelative");
    __name(parseStringToURLObject, "parseStringToURLObject");
    __name(getSanitizedUrlStringFromUrlObject, "getSanitizedUrlStringFromUrlObject");
    __name(getHttpSpanNameFromUrlObject, "getHttpSpanNameFromUrlObject");
    __name(getHttpSpanDetailsFromUrlObject, "getHttpSpanDetailsFromUrlObject");
    __name(stripDataUrlContent, "stripDataUrlContent");
  }
});

// node_modules/@sentry/core/build/esm/utils/isSentryRequestUrl.js
function isSentryRequestUrl(url, client) {
  const dsn = client?.getDsn();
  const tunnel = client?.getOptions().tunnel;
  return checkDsn(url, dsn) || checkTunnel(url, tunnel);
}
function checkTunnel(url, tunnel) {
  if (!tunnel) {
    return false;
  }
  return removeTrailingSlash(url) === removeTrailingSlash(tunnel);
}
function checkDsn(url, dsn) {
  const urlParts = parseStringToURLObject(url);
  if (!urlParts || isURLObjectRelative(urlParts)) {
    return false;
  }
  if (!dsn) {
    return false;
  }
  return hostnameMatchesDsnHost(urlParts.hostname, dsn.host) && /(^|&|\?)sentry_key=/.test(urlParts.search);
}
function hostnameMatchesDsnHost(hostname, dsnHost) {
  return hostname === dsnHost || dsnHost.length > 0 && hostname.endsWith(`.${dsnHost}`);
}
function removeTrailingSlash(str) {
  return str[str.length - 1] === "/" ? str.slice(0, -1) : str;
}
var init_isSentryRequestUrl = __esm({
  "node_modules/@sentry/core/build/esm/utils/isSentryRequestUrl.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_url();
    __name(isSentryRequestUrl, "isSentryRequestUrl");
    __name(checkTunnel, "checkTunnel");
    __name(checkDsn, "checkDsn");
    __name(hostnameMatchesDsnHost, "hostnameMatchesDsnHost");
    __name(removeTrailingSlash, "removeTrailingSlash");
  }
});

// node_modules/@sentry/core/build/esm/utils/sdkMetadata.js
function applySdkMetadata(options, name, names = [name], source = "npm") {
  const sdk = (options._metadata = options._metadata || {}).sdk = options._metadata.sdk || {};
  if (!sdk.name) {
    sdk.name = `sentry.javascript.${name}`;
    sdk.packages = names.map((name2) => ({
      name: `${source}:@sentry/${name2}`,
      version: SDK_VERSION
    }));
    sdk.version = SDK_VERSION;
  }
}
var init_sdkMetadata = __esm({
  "node_modules/@sentry/core/build/esm/utils/sdkMetadata.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_version();
    __name(applySdkMetadata, "applySdkMetadata");
  }
});

// node_modules/@sentry/core/build/esm/utils/traceData.js
function getTraceData(options = {}) {
  const client = options.client || getClient();
  if (!isEnabled2() || !client) {
    return {};
  }
  const carrier = getMainCarrier();
  const acs = getAsyncContextStrategy(carrier);
  if (acs.getTraceData) {
    return acs.getTraceData(options);
  }
  const scope = options.scope || getCurrentScope();
  const span = options.span || getActiveSpan();
  const isTwpPlaceholder = spanIsNonRecordingSpan(span) && !hasSpansEnabled(client.getOptions());
  if (!span && hasExternalPropagationContext()) {
    return {};
  }
  const sentryTrace = span && !isTwpPlaceholder ? spanToTraceHeader(span) : scopeToTraceHeader(scope);
  const dsc = span ? getDynamicSamplingContextFromSpan(span) : getDynamicSamplingContextFromScope(client, scope);
  const baggage = dynamicSamplingContextToSentryBaggageHeader(dsc);
  const isValidSentryTraceHeader = TRACEPARENT_REGEXP.test(sentryTrace);
  if (!isValidSentryTraceHeader) {
    debug.warn("Invalid sentry-trace data. Cannot generate trace data");
    return {};
  }
  const traceData = {
    "sentry-trace": sentryTrace,
    baggage
  };
  if (options.propagateTraceparent) {
    traceData.traceparent = span && !isTwpPlaceholder ? spanToTraceparentHeader(span) : scopeToTraceparentHeader(scope);
  }
  return traceData;
}
function scopeToTraceHeader(scope) {
  const { traceId, sampled, propagationSpanId } = scope.getPropagationContext();
  return generateSentryTraceHeader(traceId, propagationSpanId, sampled);
}
function scopeToTraceparentHeader(scope) {
  const { traceId, sampled, propagationSpanId } = scope.getPropagationContext();
  return generateTraceparentHeader(traceId, propagationSpanId, sampled);
}
var init_traceData = __esm({
  "node_modules/@sentry/core/build/esm/utils/traceData.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_asyncContext();
    init_carrier();
    init_currentScopes();
    init_exports();
    init_debug_logger();
    init_spanUtils();
    init_hasSpansEnabled();
    init_sentryNonRecordingSpan();
    init_dynamicSamplingContext();
    init_baggage();
    init_tracing();
    __name(getTraceData, "getTraceData");
    __name(scopeToTraceHeader, "scopeToTraceHeader");
    __name(scopeToTraceparentHeader, "scopeToTraceparentHeader");
  }
});

// node_modules/@sentry/core/build/esm/utils/request.js
function getMaxBodyByteLength(maxRequestBodySize) {
  if (maxRequestBodySize === "small")
    return 1e3;
  if (maxRequestBodySize === "medium")
    return 1e4;
  return MAX_BODY_BYTE_LENGTH;
}
function winterCGHeadersToDict(winterCGHeaders) {
  const headers = {};
  try {
    winterCGHeaders.forEach((value, key) => {
      if (typeof value === "string") {
        headers[key] = value;
      }
    });
  } catch {
  }
  return headers;
}
function winterCGRequestToRequestData(req) {
  const headers = winterCGHeadersToDict(req.headers);
  return {
    method: req.method,
    url: req.url,
    query_string: extractQueryParamsFromUrl(req.url),
    headers
    // TODO: Can we extract body data from the request?
  };
}
function isTextualContentType(contentType) {
  if (!contentType) {
    return false;
  }
  const lowerContentType = contentType.toLowerCase();
  return TEXT_CONTENT_TYPES.some((type) => lowerContentType.includes(type));
}
async function captureBodyFromWinterCGRequest(request, isolationScope, maxRequestBodySize) {
  try {
    const contentType = request.headers.get("content-type");
    if (!isTextualContentType(contentType)) {
      DEBUG_BUILD && debug.log("Skipping body capture for non-textual content type:", contentType);
      return;
    }
    if (!request.body) {
      return;
    }
    const contentLength = request.headers.get("content-length");
    const maxBodySize = getMaxBodyByteLength(maxRequestBodySize);
    if (contentLength) {
      const length = parseInt(contentLength, 10);
      if (!isNaN(length) && length > MAX_BODY_BYTE_LENGTH) {
        DEBUG_BUILD && debug.log("Skipping body capture: body too large", length);
        return;
      }
    }
    const clonedRequest = request.clone();
    const bodyPromise = clonedRequest.text();
    const timeoutPromise = new Promise((resolve2) => {
      safeUnref(setTimeout(() => resolve2(null), 2e3));
    });
    const body = await Promise.race([bodyPromise, timeoutPromise]);
    if (body === null) {
      DEBUG_BUILD && debug.log("Timeout reading request body");
      return;
    }
    if (!body) {
      return;
    }
    const encoder = new TextEncoder();
    const bytes = encoder.encode(body);
    const bodyByteLength = bytes.length;
    let truncatedBody;
    if (bodyByteLength > maxBodySize) {
      const decoder = new TextDecoder();
      truncatedBody = `${decoder.decode(bytes.slice(0, maxBodySize - 3))}...`;
    } else {
      truncatedBody = body;
    }
    isolationScope.setSDKProcessingMetadata({ normalizedRequest: { data: truncatedBody } });
    DEBUG_BUILD && debug.log("Captured request body:", bodyByteLength, "bytes");
  } catch (error2) {
    DEBUG_BUILD && debug.error("Error capturing request body:", error2);
  }
}
function httpHeadersToSpanAttributes(headers, dataCollection = false, lifecycle = "request") {
  const resolvedDataCollection = typeof dataCollection === "boolean" ? defaultPiiToCollectionOptions(dataCollection) : dataCollection;
  const headerBehavior = lifecycle === "request" ? resolvedDataCollection.httpHeaders.request : resolvedDataCollection.httpHeaders.response;
  const cookieBehavior = resolvedDataCollection.cookies;
  const prefix = `http.${lifecycle}.header.`;
  const spanAttributes = {};
  try {
    const regularHeaders = {};
    for (const [key, value] of Object.entries(headers)) {
      if (value == null) {
        continue;
      }
      const lowerKey = key.toLowerCase();
      const isCookieHeader = lowerKey === "cookie" || lowerKey === "set-cookie";
      if (isCookieHeader) {
        if (cookieBehavior === false) {
          continue;
        }
        if (typeof value === "string" && value !== "") {
          const parsed = parseCookieHeader(value, lowerKey === "set-cookie");
          const filtered = filterKeyValueData(parsed, cookieBehavior, SENSITIVE_COOKIE_NAME_SNIPPETS);
          for (const [cookieKey, cookieValue] of Object.entries(filtered)) {
            spanAttributes[`${prefix}${normalizeAttributeKey(lowerKey)}.${normalizeAttributeKey(cookieKey)}`] = cookieValue;
          }
        } else {
          spanAttributes[`${prefix}${normalizeAttributeKey(lowerKey)}`] = FILTERED_VALUE;
        }
      } else {
        if (headerBehavior === false) {
          continue;
        }
        if (Array.isArray(value)) {
          regularHeaders[lowerKey] = value.map((v) => v != null ? String(v) : v).join(";");
        } else if (typeof value === "string") {
          regularHeaders[lowerKey] = value;
        }
      }
    }
    if (headerBehavior !== false) {
      const filtered = filterKeyValueData(regularHeaders, headerBehavior);
      for (const [headerKey, headerValue] of Object.entries(filtered)) {
        spanAttributes[`${prefix}${normalizeAttributeKey(headerKey)}`] = headerValue;
      }
    }
  } catch {
  }
  return spanAttributes;
}
function normalizeAttributeKey(key) {
  return key.replace(/-/g, "_");
}
function parseCookieHeader(value, isSetCookie) {
  const semicolonIndex = value.indexOf(";");
  const cookieString = isSetCookie && semicolonIndex !== -1 ? value.substring(0, semicolonIndex) : value;
  const cookies = isSetCookie ? [cookieString] : cookieString.split("; ");
  const result = {};
  for (const cookie of cookies) {
    const equalSignIndex = cookie.indexOf("=");
    const cookieKey = (equalSignIndex !== -1 ? cookie.substring(0, equalSignIndex) : cookie).toLowerCase();
    const cookieValue = equalSignIndex !== -1 ? cookie.substring(equalSignIndex + 1) : "";
    result[cookieKey] = cookieValue;
  }
  return result;
}
function extractQueryParamsFromUrl(url) {
  if (!url) {
    return;
  }
  try {
    const queryParams = new URL(url, "http://s.io").search.slice(1);
    return queryParams.length ? queryParams : void 0;
  } catch {
    return void 0;
  }
}
var MAX_BODY_BYTE_LENGTH, TEXT_CONTENT_TYPES;
var init_request = __esm({
  "node_modules/@sentry/core/build/esm/utils/request.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_debug_build();
    init_debug_logger();
    init_defaultPiiToCollectionOptions();
    init_filtering_snippets();
    init_filterKeyValueData();
    init_timer();
    MAX_BODY_BYTE_LENGTH = 1024 * 1024;
    TEXT_CONTENT_TYPES = [
      "text/",
      "application/json",
      "application/x-www-form-urlencoded",
      "application/xml",
      "application/graphql"
    ];
    __name(getMaxBodyByteLength, "getMaxBodyByteLength");
    __name(winterCGHeadersToDict, "winterCGHeadersToDict");
    __name(winterCGRequestToRequestData, "winterCGRequestToRequestData");
    __name(isTextualContentType, "isTextualContentType");
    __name(captureBodyFromWinterCGRequest, "captureBodyFromWinterCGRequest");
    __name(httpHeadersToSpanAttributes, "httpHeadersToSpanAttributes");
    __name(normalizeAttributeKey, "normalizeAttributeKey");
    __name(parseCookieHeader, "parseCookieHeader");
    __name(extractQueryParamsFromUrl, "extractQueryParamsFromUrl");
  }
});

// node_modules/@sentry/core/build/esm/breadcrumbs.js
function addBreadcrumb(breadcrumb, hint) {
  const client = getClient();
  const isolationScope = getIsolationScope();
  if (!client)
    return;
  const { beforeBreadcrumb = null, maxBreadcrumbs = DEFAULT_BREADCRUMBS } = client.getOptions();
  if (maxBreadcrumbs <= 0)
    return;
  const timestamp = dateTimestampInSeconds();
  const mergedBreadcrumb = { timestamp, ...breadcrumb };
  const finalBreadcrumb = beforeBreadcrumb ? consoleSandbox(() => beforeBreadcrumb(mergedBreadcrumb, hint)) : mergedBreadcrumb;
  if (finalBreadcrumb === null)
    return;
  if (client.emit) {
    client.emit("beforeAddBreadcrumb", finalBreadcrumb, hint);
  }
  isolationScope.addBreadcrumb(finalBreadcrumb, maxBreadcrumbs);
}
var DEFAULT_BREADCRUMBS;
var init_breadcrumbs = __esm({
  "node_modules/@sentry/core/build/esm/breadcrumbs.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_currentScopes();
    init_debug_logger();
    init_time();
    DEFAULT_BREADCRUMBS = 100;
    __name(addBreadcrumb, "addBreadcrumb");
  }
});

// node_modules/@sentry/core/build/esm/integrations/functiontostring.js
var INTEGRATION_NAME, SETUP_CLIENTS, _functionToStringIntegration, functionToStringIntegration;
var init_functiontostring = __esm({
  "node_modules/@sentry/core/build/esm/integrations/functiontostring.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_currentScopes();
    init_integration();
    init_object();
    INTEGRATION_NAME = "FunctionToString";
    SETUP_CLIENTS = /* @__PURE__ */ new WeakMap();
    _functionToStringIntegration = /* @__PURE__ */ __name(() => {
      return {
        name: INTEGRATION_NAME,
        setupOnce() {
          const originalFunctionToString = Function.prototype.toString;
          try {
            Function.prototype.toString = new Proxy(originalFunctionToString, {
              apply(target, thisArg, args) {
                const originalFunction = getOriginalFunction(thisArg);
                let context = thisArg;
                try {
                  if (SETUP_CLIENTS.has(getClient()) && originalFunction) {
                    context = originalFunction;
                  }
                } catch {
                }
                return Reflect.apply(target, context, args);
              }
            });
          } catch {
          }
        },
        setup(client) {
          SETUP_CLIENTS.set(client, true);
        }
      };
    }, "_functionToStringIntegration");
    functionToStringIntegration = defineIntegration(_functionToStringIntegration);
  }
});

// node_modules/@sentry/core/build/esm/integrations/eventFilters.js
function _mergeOptions(internalOptions = {}, clientOptions = {}) {
  return {
    allowUrls: [...internalOptions.allowUrls || [], ...clientOptions.allowUrls || []],
    denyUrls: [...internalOptions.denyUrls || [], ...clientOptions.denyUrls || []],
    ignoreErrors: [
      ...internalOptions.ignoreErrors || [],
      ...clientOptions.ignoreErrors || [],
      ...internalOptions.disableErrorDefaults ? [] : DEFAULT_IGNORE_ERRORS
    ],
    ignoreTransactions: [...internalOptions.ignoreTransactions || [], ...clientOptions.ignoreTransactions || []]
  };
}
function _shouldDropEvent(event, options) {
  if (!event.type) {
    if (_isIgnoredError(event, options.ignoreErrors)) {
      DEBUG_BUILD && debug.warn(
        `Event dropped due to being matched by \`ignoreErrors\` option.
Event: ${getEventDescription(event)}`
      );
      return true;
    }
    if (_isUselessError(event)) {
      DEBUG_BUILD && debug.warn(
        `Event dropped due to not having an error message, error type or stacktrace.
Event: ${getEventDescription(
          event
        )}`
      );
      return true;
    }
    if (_isDeniedUrl(event, options.denyUrls)) {
      DEBUG_BUILD && debug.warn(
        `Event dropped due to being matched by \`denyUrls\` option.
Event: ${getEventDescription(
          event
        )}.
Url: ${_getEventFilterUrl(event)}`
      );
      return true;
    }
    if (!_isAllowedUrl(event, options.allowUrls)) {
      DEBUG_BUILD && debug.warn(
        `Event dropped due to not being matched by \`allowUrls\` option.
Event: ${getEventDescription(
          event
        )}.
Url: ${_getEventFilterUrl(event)}`
      );
      return true;
    }
  } else if (event.type === "transaction") {
    if (_isIgnoredTransaction(event, options.ignoreTransactions)) {
      DEBUG_BUILD && debug.warn(
        `Event dropped due to being matched by \`ignoreTransactions\` option.
Event: ${getEventDescription(event)}`
      );
      return true;
    }
  }
  return false;
}
function _isIgnoredError(event, ignoreErrors) {
  if (!ignoreErrors?.length) {
    return false;
  }
  return getPossibleEventMessages(event).some((message) => stringMatchesSomePattern(message, ignoreErrors));
}
function _isIgnoredTransaction(event, ignoreTransactions) {
  if (!ignoreTransactions?.length) {
    return false;
  }
  const name = event.transaction;
  return name ? stringMatchesSomePattern(name, ignoreTransactions) : false;
}
function _isDeniedUrl(event, denyUrls) {
  if (!denyUrls?.length) {
    return false;
  }
  const url = _getEventFilterUrl(event);
  return !url ? false : stringMatchesSomePattern(url, denyUrls);
}
function _isAllowedUrl(event, allowUrls) {
  if (!allowUrls?.length) {
    return true;
  }
  const url = _getEventFilterUrl(event);
  return !url ? true : stringMatchesSomePattern(url, allowUrls);
}
function _getLastValidUrl(frames = []) {
  for (let i = frames.length - 1; i >= 0; i--) {
    const frame = frames[i];
    if (frame && frame.filename !== "<anonymous>" && frame.filename !== "[native code]") {
      return frame.filename || null;
    }
  }
  return null;
}
function _getEventFilterUrl(event) {
  try {
    const rootException = [...event.exception?.values ?? []].reverse().find((value) => value.mechanism?.parent_id === void 0 && value.stacktrace?.frames?.length);
    const frames = rootException?.stacktrace?.frames;
    return frames ? _getLastValidUrl(frames) : null;
  } catch {
    DEBUG_BUILD && debug.error(`Cannot extract url for event ${getEventDescription(event)}`);
    return null;
  }
}
function _isUselessError(event) {
  if (!event.exception?.values?.length) {
    return false;
  }
  return (
    // No top-level message
    !event.message && // There are no exception values that have a stacktrace, a non-generic-Error type or value
    !event.exception.values.some((value) => value.stacktrace || value.type && value.type !== "Error" || value.value)
  );
}
var DEFAULT_IGNORE_ERRORS, INTEGRATION_NAME2, eventFiltersIntegration, inboundFiltersIntegration;
var init_eventFilters = __esm({
  "node_modules/@sentry/core/build/esm/integrations/eventFilters.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_debug_build();
    init_integration();
    init_debug_logger();
    init_eventUtils();
    init_misc();
    init_string();
    DEFAULT_IGNORE_ERRORS = [
      /^Script error\.?$/,
      /^Javascript error: Script error\.? on line 0$/,
      /^ResizeObserver loop completed with undelivered notifications.$/,
      // The browser logs this when a ResizeObserver handler takes a bit longer. Usually this is not an actual issue though. It indicates slowness.
      /^Cannot redefine property: googletag$/,
      // This is thrown when google tag manager is used in combination with an ad blocker
      /^Can't find variable: gmo$/,
      // Error from Google Search App https://issuetracker.google.com/issues/396043331
      /^undefined is not an object \(evaluating 'a\.[A-Z]'\)$/,
      // Random error that happens but not actionable or noticeable to end-users.
      /can't redefine non-configurable property "solana"/,
      // Probably a browser extension or custom browser (Brave) throwing this error
      /vv\(\)\.getRestrictions is not a function/,
      // Error thrown by GTM, seemingly not affecting end-users
      /Can't find variable: _AutofillCallbackHandler/,
      // Unactionable error in instagram webview https://developers.facebook.com/community/threads/320013549791141/
      /Object Not Found Matching Id:\d+, MethodName:simulateEvent/,
      // unactionable error from CEFSharp, a .NET library that embeds chromium in .NET apps
      /^Java exception was raised during method invocation$/
      // error from Facebook Mobile browser (https://github.com/getsentry/sentry-javascript/issues/15065)
    ];
    INTEGRATION_NAME2 = "EventFilters";
    eventFiltersIntegration = defineIntegration((options = {}) => {
      let mergedOptions;
      return {
        name: INTEGRATION_NAME2,
        setup(client) {
          const clientOptions = client.getOptions();
          mergedOptions = _mergeOptions(options, clientOptions);
        },
        processEvent(event, _hint, client) {
          if (!mergedOptions) {
            const clientOptions = client.getOptions();
            mergedOptions = _mergeOptions(options, clientOptions);
          }
          return _shouldDropEvent(event, mergedOptions) ? null : event;
        }
      };
    });
    inboundFiltersIntegration = defineIntegration((options = {}) => {
      return {
        ...eventFiltersIntegration(options),
        name: "InboundFilters"
      };
    });
    __name(_mergeOptions, "_mergeOptions");
    __name(_shouldDropEvent, "_shouldDropEvent");
    __name(_isIgnoredError, "_isIgnoredError");
    __name(_isIgnoredTransaction, "_isIgnoredTransaction");
    __name(_isDeniedUrl, "_isDeniedUrl");
    __name(_isAllowedUrl, "_isAllowedUrl");
    __name(_getLastValidUrl, "_getLastValidUrl");
    __name(_getEventFilterUrl, "_getEventFilterUrl");
    __name(_isUselessError, "_isUselessError");
  }
});

// node_modules/@sentry/core/build/esm/utils/aggregate-errors.js
function applyAggregateErrorsToEvent(exceptionFromErrorImplementation, parser, key, limit, event, hint) {
  if (!event.exception?.values || !hint || !isInstanceOf(hint.originalException, Error)) {
    return;
  }
  const originalException = event.exception.values.length > 0 ? event.exception.values[event.exception.values.length - 1] : void 0;
  if (originalException) {
    event.exception.values = aggregateExceptionsFromError(
      exceptionFromErrorImplementation,
      parser,
      limit,
      hint.originalException,
      key,
      event.exception.values,
      originalException,
      0
    );
  }
}
function aggregateExceptionsFromError(exceptionFromErrorImplementation, parser, limit, error2, key, prevExceptions, exception, exceptionId) {
  if (prevExceptions.length >= limit + 1) {
    return prevExceptions;
  }
  let newExceptions = [...prevExceptions];
  if (isInstanceOf(error2[key], Error)) {
    applyExceptionGroupFieldsForParentException(exception, exceptionId, error2);
    const newException = exceptionFromErrorImplementation(parser, error2[key]);
    const newExceptionId = newExceptions.length;
    applyExceptionGroupFieldsForChildException(newException, key, newExceptionId, exceptionId);
    newExceptions = aggregateExceptionsFromError(
      exceptionFromErrorImplementation,
      parser,
      limit,
      error2[key],
      key,
      [newException, ...newExceptions],
      newException,
      newExceptionId
    );
  }
  if (isExceptionGroup(error2)) {
    error2.errors.forEach((childError, i) => {
      if (isInstanceOf(childError, Error)) {
        applyExceptionGroupFieldsForParentException(exception, exceptionId, error2);
        const newException = exceptionFromErrorImplementation(parser, childError);
        const newExceptionId = newExceptions.length;
        applyExceptionGroupFieldsForChildException(newException, `errors[${i}]`, newExceptionId, exceptionId);
        newExceptions = aggregateExceptionsFromError(
          exceptionFromErrorImplementation,
          parser,
          limit,
          childError,
          key,
          [newException, ...newExceptions],
          newException,
          newExceptionId
        );
      }
    });
  }
  return newExceptions;
}
function isExceptionGroup(error2) {
  return Array.isArray(error2.errors);
}
function applyExceptionGroupFieldsForParentException(exception, exceptionId, error2) {
  exception.mechanism = {
    handled: true,
    type: "auto.core.linked_errors",
    ...isExceptionGroup(error2) && { is_exception_group: true },
    ...exception.mechanism,
    exception_id: exceptionId
  };
}
function applyExceptionGroupFieldsForChildException(exception, source, exceptionId, parentId) {
  exception.mechanism = {
    handled: true,
    ...exception.mechanism,
    type: "chained",
    source,
    exception_id: exceptionId,
    parent_id: parentId
  };
}
var init_aggregate_errors = __esm({
  "node_modules/@sentry/core/build/esm/utils/aggregate-errors.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_is();
    __name(applyAggregateErrorsToEvent, "applyAggregateErrorsToEvent");
    __name(aggregateExceptionsFromError, "aggregateExceptionsFromError");
    __name(isExceptionGroup, "isExceptionGroup");
    __name(applyExceptionGroupFieldsForParentException, "applyExceptionGroupFieldsForParentException");
    __name(applyExceptionGroupFieldsForChildException, "applyExceptionGroupFieldsForChildException");
  }
});

// node_modules/@sentry/core/build/esm/utils/eventbuilder.js
function parseStackFrames(stackParser, error2) {
  return stackParser(error2.stack || "", 1);
}
function hasSentryFetchUrlHost(error2) {
  return isError(error2) && "__sentry_fetch_url_host__" in error2 && typeof error2.__sentry_fetch_url_host__ === "string";
}
function _enhanceErrorWithSentryInfo(error2) {
  if (hasSentryFetchUrlHost(error2)) {
    return `${error2.message} (${error2.__sentry_fetch_url_host__})`;
  }
  return error2.message;
}
function exceptionFromError(stackParser, error2) {
  const exception = {
    type: error2.name || error2.constructor.name,
    value: _enhanceErrorWithSentryInfo(error2)
  };
  const frames = parseStackFrames(stackParser, error2);
  if (frames.length) {
    exception.stacktrace = { frames };
  }
  return exception;
}
function getErrorPropertyFromObject(obj) {
  for (const prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      const value = obj[prop];
      if (value instanceof Error) {
        return value;
      }
    }
  }
  return void 0;
}
function getMessageForObject(exception) {
  if ("name" in exception && typeof exception.name === "string") {
    let message = `'${exception.name}' captured as exception`;
    if ("message" in exception && typeof exception.message === "string") {
      message += ` with message '${exception.message}'`;
    }
    return message;
  } else if ("message" in exception && typeof exception.message === "string") {
    return exception.message;
  }
  const keys = extractExceptionKeysForMessage(exception);
  if (isErrorEvent(exception)) {
    return `Event \`ErrorEvent\` captured as exception with message \`${exception.message}\``;
  }
  const className = getObjectClassName(exception);
  return `${className && className !== "Object" ? `'${className}'` : "Object"} captured as exception with keys: ${keys}`;
}
function getObjectClassName(obj) {
  try {
    const prototype = Object.getPrototypeOf(obj);
    return prototype ? prototype.constructor.name : void 0;
  } catch {
  }
}
function getException(client, mechanism, exception, hint) {
  if (isError(exception)) {
    return [exception, void 0];
  }
  mechanism.synthetic = true;
  if (isPlainObject(exception)) {
    const normalizeDepth = client?.getOptions().normalizeDepth;
    const extras = { ["__serialized__"]: normalizeToSize(exception, normalizeDepth) };
    const errorFromProp = getErrorPropertyFromObject(exception);
    if (errorFromProp) {
      return [errorFromProp, extras];
    }
    const message = getMessageForObject(exception);
    const ex2 = hint?.syntheticException || new Error(message);
    ex2.message = message;
    return [ex2, extras];
  }
  const ex = hint?.syntheticException || new Error(exception);
  ex.message = `${exception}`;
  return [ex, void 0];
}
function eventFromUnknownInput(client, stackParser, exception, hint) {
  const providedMechanism = hint?.data && hint.data.mechanism;
  const mechanism = providedMechanism || {
    handled: true,
    type: "generic"
  };
  const [ex, extras] = getException(client, mechanism, exception, hint);
  const event = {
    exception: {
      values: [exceptionFromError(stackParser, ex)]
    }
  };
  if (extras) {
    event.extra = extras;
  }
  addExceptionTypeValue(event, void 0, void 0);
  addExceptionMechanism(event, mechanism);
  return {
    ...event,
    event_id: hint?.event_id
  };
}
function eventFromMessage(stackParser, message, level = "info", hint, attachStacktrace) {
  const event = {
    event_id: hint?.event_id,
    level
  };
  if (attachStacktrace && hint?.syntheticException) {
    const frames = parseStackFrames(stackParser, hint.syntheticException);
    if (frames.length) {
      event.exception = {
        values: [
          {
            value: message,
            stacktrace: { frames }
          }
        ]
      };
      addExceptionMechanism(event, { synthetic: true });
    }
  }
  if (isParameterizedString(message)) {
    const { __sentry_template_string__, __sentry_template_values__ } = message;
    event.logentry = {
      message: __sentry_template_string__,
      params: __sentry_template_values__
    };
    return event;
  }
  event.message = message;
  return event;
}
var init_eventbuilder = __esm({
  "node_modules/@sentry/core/build/esm/utils/eventbuilder.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_is();
    init_misc();
    init_normalize();
    init_object();
    __name(parseStackFrames, "parseStackFrames");
    __name(hasSentryFetchUrlHost, "hasSentryFetchUrlHost");
    __name(_enhanceErrorWithSentryInfo, "_enhanceErrorWithSentryInfo");
    __name(exceptionFromError, "exceptionFromError");
    __name(getErrorPropertyFromObject, "getErrorPropertyFromObject");
    __name(getMessageForObject, "getMessageForObject");
    __name(getObjectClassName, "getObjectClassName");
    __name(getException, "getException");
    __name(eventFromUnknownInput, "eventFromUnknownInput");
    __name(eventFromMessage, "eventFromMessage");
  }
});

// node_modules/@sentry/core/build/esm/integrations/linkederrors.js
var DEFAULT_KEY, DEFAULT_LIMIT, INTEGRATION_NAME3, _linkedErrorsIntegration, linkedErrorsIntegration;
var init_linkederrors = __esm({
  "node_modules/@sentry/core/build/esm/integrations/linkederrors.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_integration();
    init_aggregate_errors();
    init_eventbuilder();
    DEFAULT_KEY = "cause";
    DEFAULT_LIMIT = 5;
    INTEGRATION_NAME3 = "LinkedErrors";
    _linkedErrorsIntegration = /* @__PURE__ */ __name((options = {}) => {
      const limit = options.limit || DEFAULT_LIMIT;
      const key = options.key || DEFAULT_KEY;
      return {
        name: INTEGRATION_NAME3,
        preprocessEvent(event, hint, client) {
          const options2 = client.getOptions();
          applyAggregateErrorsToEvent(exceptionFromError, options2.stackParser, key, limit, event, hint);
        }
      };
    }, "_linkedErrorsIntegration");
    linkedErrorsIntegration = defineIntegration(_linkedErrorsIntegration);
  }
});

// node_modules/@sentry/core/build/esm/vendor/getIpAddress.js
function getClientIPAddress(headers) {
  const lowerCaseHeaders = {};
  for (const key of Object.keys(headers)) {
    lowerCaseHeaders[key.toLowerCase()] = headers[key];
  }
  const headerValues = ipHeaderNames.map((headerName) => {
    const rawValue = lowerCaseHeaders[headerName.toLowerCase()];
    const value = Array.isArray(rawValue) ? rawValue.join(";") : rawValue;
    if (headerName === "Forwarded") {
      return parseForwardedHeader(value);
    }
    return value?.split(",").map((v) => v.trim());
  });
  const flattenedHeaderValues = headerValues.reduce((acc, val) => {
    if (!val) {
      return acc;
    }
    return acc.concat(val);
  }, []);
  const ipAddress = flattenedHeaderValues.find((ip) => ip !== null && isIP(ip));
  return ipAddress || null;
}
function parseForwardedHeader(value) {
  if (!value) {
    return null;
  }
  for (const part of value.split(";")) {
    if (part.startsWith("for=")) {
      return part.slice(4);
    }
  }
  return null;
}
function isIP(str) {
  const regex = /(?:^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$)|(?:^(?:(?:[a-fA-F\d]{1,4}:){7}(?:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){6}(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){5}(?::(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,2}|:)|(?:[a-fA-F\d]{1,4}:){4}(?:(?::[a-fA-F\d]{1,4}){0,1}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,3}|:)|(?:[a-fA-F\d]{1,4}:){3}(?:(?::[a-fA-F\d]{1,4}){0,2}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,4}|:)|(?:[a-fA-F\d]{1,4}:){2}(?:(?::[a-fA-F\d]{1,4}){0,3}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,5}|:)|(?:[a-fA-F\d]{1,4}:){1}(?:(?::[a-fA-F\d]{1,4}){0,4}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,6}|:)|(?::(?:(?::[a-fA-F\d]{1,4}){0,5}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,7}|:)))(?:%[0-9a-zA-Z]{1,})?$)/;
  return regex.test(str);
}
var ipHeaderNames;
var init_getIpAddress = __esm({
  "node_modules/@sentry/core/build/esm/vendor/getIpAddress.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    ipHeaderNames = [
      "X-Client-IP",
      "X-Forwarded-For",
      "Fly-Client-IP",
      "CF-Connecting-IP",
      "Fastly-Client-Ip",
      "True-Client-Ip",
      "X-Real-IP",
      "X-Cluster-Client-IP",
      "X-Forwarded",
      "Forwarded-For",
      "Forwarded",
      "X-Vercel-Forwarded-For"
    ];
    __name(getClientIPAddress, "getClientIPAddress");
    __name(parseForwardedHeader, "parseForwardedHeader");
    __name(isIP, "isIP");
  }
});

// node_modules/@sentry/core/build/esm/integrations/requestdata.js
function addNormalizedRequestDataToEvent(event, req, additionalData, include) {
  event.request = {
    ...event.request,
    ...extractNormalizedRequestData(req, include)
  };
  if (include.ip) {
    const ip = req.headers && getClientIPAddress(req.headers) || additionalData.ipAddress;
    if (ip) {
      event.user = {
        ...event.user,
        ip_address: ip
      };
    }
  }
}
function addNormalizedRequestDataToSpan(span, normalizedRequest, ipAddress, include, dataCollection) {
  const requestData = extractNormalizedRequestData(normalizedRequest, include);
  const attributes = {};
  if (requestData.url) {
    attributes["url.full"] = requestData.url;
  }
  if (requestData.method) {
    attributes["http.request.method"] = requestData.method;
  }
  if (requestData.query_string) {
    attributes["url.query"] = normalizeQueryString(requestData.query_string);
  }
  safeSetSpanJSONAttributes(span, attributes);
  if (requestData.cookies && Object.keys(requestData.cookies).length > 0) {
    const cookieString = Object.entries(requestData.cookies).map(([name, value]) => `${name}=${value}`).join("; ");
    const cookieAttributes = httpHeadersToSpanAttributes({ cookie: cookieString }, dataCollection, "request");
    safeSetSpanJSONAttributes(span, cookieAttributes);
  }
  if (requestData.headers) {
    const headerAttributes = httpHeadersToSpanAttributes(requestData.headers, dataCollection, "request");
    safeSetSpanJSONAttributes(span, headerAttributes);
  }
  if (requestData.data != null) {
    const serialized = typeof requestData.data === "string" ? requestData.data : JSON.stringify(requestData.data);
    if (serialized) {
      safeSetSpanJSONAttributes(span, { "http.request.body.data": serialized });
    }
  }
  if (include.ip) {
    const ip = normalizedRequest.headers && getClientIPAddress(normalizedRequest.headers) || ipAddress || void 0;
    if (ip) {
      safeSetSpanJSONAttributes(span, { [SEMANTIC_ATTRIBUTE_USER_IP_ADDRESS]: ip });
    }
  }
}
function extractNormalizedRequestData(normalizedRequest, include) {
  const requestData = {};
  const headers = { ...normalizedRequest.headers };
  if (include.headers) {
    requestData.headers = headers;
    if (!include.cookies) {
      delete headers.cookie;
    }
    if (!include.ip) {
      const ipHeaderNamesLower = new Set(ipHeaderNames.map((name) => name.toLowerCase()));
      for (const key of Object.keys(headers)) {
        if (ipHeaderNamesLower.has(key.toLowerCase())) {
          delete headers[key];
        }
      }
    }
  }
  requestData.method = normalizedRequest.method;
  if (include.url) {
    requestData.url = normalizedRequest.url;
  }
  if (include.cookies) {
    const cookies = normalizedRequest.cookies || (headers?.cookie ? parseCookie(headers.cookie) : void 0);
    requestData.cookies = cookies || {};
  }
  if (include.query_string) {
    requestData.query_string = normalizedRequest.query_string;
  }
  if (include.data) {
    requestData.data = normalizedRequest.data;
  }
  return requestData;
}
function normalizeQueryString(queryString) {
  if (typeof queryString === "string") {
    return queryString || void 0;
  }
  const pairs = Array.isArray(queryString) ? queryString : Object.entries(queryString);
  const result = pairs.map(([key, value]) => `${key}=${value}`).join("&");
  return result || void 0;
}
var INTEGRATION_NAME4, _requestDataIntegration, requestDataIntegration;
var init_requestdata = __esm({
  "node_modules/@sentry/core/build/esm/integrations/requestdata.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_currentScopes();
    init_integration();
    init_semanticAttributes();
    init_cookie();
    init_request();
    init_getIpAddress();
    init_captureSpan();
    INTEGRATION_NAME4 = "RequestData";
    _requestDataIntegration = /* @__PURE__ */ __name((options = {}) => {
      function resolveIncludeAndDataCollection(client) {
        const dc = client.getDataCollectionOptions();
        const dataCollection = {
          ...dc,
          ...options.include?.cookies === true && dc.cookies === false && { cookies: true },
          ...options.include?.headers === true && dc.httpHeaders.request === false && {
            httpHeaders: { ...dc.httpHeaders, request: true }
          }
        };
        return {
          dataCollection,
          include: {
            cookies: dataCollection.cookies !== false,
            // Always attach body data that's already on the scope — dataCollection.httpBodies gates write-time, not read-time
            data: true,
            headers: dataCollection.httpHeaders.request !== false,
            ip: dataCollection.userInfo,
            query_string: dataCollection.urlQueryParams !== false,
            // No dataCollection equivalent — URL is always included
            url: true,
            ...options.include
          }
        };
      }
      __name(resolveIncludeAndDataCollection, "resolveIncludeAndDataCollection");
      return {
        name: INTEGRATION_NAME4,
        processEvent(event, _hint, client) {
          const { sdkProcessingMetadata = {} } = event;
          const { normalizedRequest, ipAddress } = sdkProcessingMetadata;
          const { include } = resolveIncludeAndDataCollection(client);
          if (normalizedRequest) {
            addNormalizedRequestDataToEvent(event, normalizedRequest, { ipAddress }, include);
          }
          return event;
        },
        processSegmentSpan(span, client) {
          const { sdkProcessingMetadata = {} } = getIsolationScope().getScopeData();
          const { normalizedRequest, ipAddress } = sdkProcessingMetadata;
          if (!normalizedRequest) {
            return;
          }
          const { include, dataCollection } = resolveIncludeAndDataCollection(client);
          addNormalizedRequestDataToSpan(span, normalizedRequest, ipAddress, include, dataCollection);
        }
      };
    }, "_requestDataIntegration");
    requestDataIntegration = defineIntegration(_requestDataIntegration);
    __name(addNormalizedRequestDataToEvent, "addNormalizedRequestDataToEvent");
    __name(addNormalizedRequestDataToSpan, "addNormalizedRequestDataToSpan");
    __name(extractNormalizedRequestData, "extractNormalizedRequestData");
    __name(normalizeQueryString, "normalizeQueryString");
  }
});

// node_modules/@sentry/core/build/esm/instrument/console.js
function addConsoleInstrumentationHandler(handler) {
  const type = "console";
  const removeHandler = addHandler(type, handler);
  maybeInstrument(type, instrumentConsole);
  return removeHandler;
}
function addConsoleInstrumentationFilter(filter) {
  for (const f of filter) {
    _filter.add(f);
  }
  return () => {
    for (const f of filter) {
      _filter.delete(f);
    }
  };
}
function instrumentConsole() {
  if (!("console" in GLOBAL_OBJ)) {
    return;
  }
  CONSOLE_LEVELS.forEach(function(level) {
    if (instrumentedLevels.has(level) || !(level in GLOBAL_OBJ.console)) {
      return;
    }
    instrumentedLevels.add(level);
    fill(GLOBAL_OBJ.console, level, function(originalConsoleMethod) {
      originalConsoleMethods[level] = originalConsoleMethod;
      return function(...args) {
        const firstArg = args[0];
        const log2 = originalConsoleMethods[level];
        const isFiltered = _filter.size && typeof firstArg === "string" && stringMatchesSomePattern(firstArg, _filter);
        if (!isFiltered) {
          triggerHandlers("console", { args, level });
        }
        if (!isFiltered || DEBUG_BUILD && debug.isEnabled()) {
          log2?.apply(GLOBAL_OBJ.console, args);
        }
      };
    });
  });
}
var _filter, instrumentedLevels;
var init_console = __esm({
  "node_modules/@sentry/core/build/esm/instrument/console.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_debug_build();
    init_debug_logger();
    init_object();
    init_string();
    init_worldwide();
    init_handlers();
    _filter = /* @__PURE__ */ new Set([]);
    __name(addConsoleInstrumentationHandler, "addConsoleInstrumentationHandler");
    __name(addConsoleInstrumentationFilter, "addConsoleInstrumentationFilter");
    instrumentedLevels = /* @__PURE__ */ new Set();
    __name(instrumentConsole, "instrumentConsole");
  }
});

// node_modules/@sentry/core/build/esm/utils/severity.js
function severityLevelFromString(level) {
  return level === "warn" ? "warning" : ["fatal", "error", "warning", "log", "info", "debug"].includes(level) ? level : "log";
}
var init_severity = __esm({
  "node_modules/@sentry/core/build/esm/utils/severity.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    __name(severityLevelFromString, "severityLevelFromString");
  }
});

// node_modules/@sentry/core/build/esm/integrations/dedupe.js
function _shouldDropEvent2(currentEvent, previousEvent) {
  if (!previousEvent) {
    return false;
  }
  if (_isSameMessageEvent(currentEvent, previousEvent)) {
    return true;
  }
  if (_isSameExceptionEvent(currentEvent, previousEvent)) {
    return true;
  }
  return false;
}
function _isSameMessageEvent(currentEvent, previousEvent) {
  const currentMessage = currentEvent.message;
  const previousMessage = previousEvent.message;
  if (!currentMessage && !previousMessage) {
    return false;
  }
  if (currentMessage && !previousMessage || !currentMessage && previousMessage) {
    return false;
  }
  if (currentMessage !== previousMessage) {
    return false;
  }
  if (!_isSameFingerprint(currentEvent, previousEvent)) {
    return false;
  }
  if (!_isSameStacktrace(currentEvent, previousEvent)) {
    return false;
  }
  return true;
}
function _isSameExceptionEvent(currentEvent, previousEvent) {
  const previousException = _getExceptionFromEvent(previousEvent);
  const currentException = _getExceptionFromEvent(currentEvent);
  if (!previousException || !currentException) {
    return false;
  }
  if (previousException.type !== currentException.type || previousException.value !== currentException.value) {
    return false;
  }
  if (!_isSameFingerprint(currentEvent, previousEvent)) {
    return false;
  }
  if (!_isSameStacktrace(currentEvent, previousEvent)) {
    return false;
  }
  return true;
}
function _isSameStacktrace(currentEvent, previousEvent) {
  let currentFrames = getFramesFromEvent(currentEvent);
  let previousFrames = getFramesFromEvent(previousEvent);
  if (!currentFrames && !previousFrames) {
    return true;
  }
  if (currentFrames && !previousFrames || !currentFrames && previousFrames) {
    return false;
  }
  currentFrames = currentFrames;
  previousFrames = previousFrames;
  if (previousFrames.length !== currentFrames.length) {
    return false;
  }
  for (let i = 0; i < previousFrames.length; i++) {
    const frameA = previousFrames[i];
    const frameB = currentFrames[i];
    if (frameA.filename !== frameB.filename || frameA.lineno !== frameB.lineno || frameA.colno !== frameB.colno || frameA.function !== frameB.function) {
      return false;
    }
  }
  return true;
}
function _isSameFingerprint(currentEvent, previousEvent) {
  let currentFingerprint = currentEvent.fingerprint;
  let previousFingerprint = previousEvent.fingerprint;
  if (!currentFingerprint && !previousFingerprint) {
    return true;
  }
  if (currentFingerprint && !previousFingerprint || !currentFingerprint && previousFingerprint) {
    return false;
  }
  currentFingerprint = currentFingerprint;
  previousFingerprint = previousFingerprint;
  try {
    return !!(currentFingerprint.join("") === previousFingerprint.join(""));
  } catch {
    return false;
  }
}
function _getExceptionFromEvent(event) {
  return event.exception?.values?.[0];
}
var INTEGRATION_NAME5, _dedupeIntegration, dedupeIntegration;
var init_dedupe = __esm({
  "node_modules/@sentry/core/build/esm/integrations/dedupe.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_debug_build();
    init_integration();
    init_debug_logger();
    init_stacktrace();
    INTEGRATION_NAME5 = "Dedupe";
    _dedupeIntegration = /* @__PURE__ */ __name(() => {
      let previousEvent;
      return {
        name: INTEGRATION_NAME5,
        processEvent(currentEvent) {
          if (currentEvent.type) {
            return currentEvent;
          }
          try {
            if (_shouldDropEvent2(currentEvent, previousEvent)) {
              DEBUG_BUILD && debug.warn("Event dropped due to being a duplicate of previously captured event.");
              return null;
            }
          } catch {
          }
          return previousEvent = currentEvent;
        }
      };
    }, "_dedupeIntegration");
    dedupeIntegration = defineIntegration(_dedupeIntegration);
    __name(_shouldDropEvent2, "_shouldDropEvent");
    __name(_isSameMessageEvent, "_isSameMessageEvent");
    __name(_isSameExceptionEvent, "_isSameExceptionEvent");
    __name(_isSameStacktrace, "_isSameStacktrace");
    __name(_isSameFingerprint, "_isSameFingerprint");
    __name(_getExceptionFromEvent, "_getExceptionFromEvent");
  }
});

// node_modules/@sentry/core/build/esm/utils/path.js
function splitPath(filename) {
  const truncated = filename.length > 1024 ? `<truncated>${filename.slice(-1024)}` : filename;
  const parts = splitPathRe.exec(truncated);
  return parts ? parts.slice(1) : [];
}
function basename(path, ext) {
  let f = splitPath(path)[2] || "";
  if (ext && f.slice(ext.length * -1) === ext) {
    f = f.slice(0, f.length - ext.length);
  }
  return f;
}
var splitPathRe;
var init_path = __esm({
  "node_modules/@sentry/core/build/esm/utils/path.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    splitPathRe = /^(\S+:\\|\/?)([\s\S]*?)((?:\.{1,2}|[^/\\]+?|)(\.[^./\\]*|))(?:[/\\]*)$/;
    __name(splitPath, "splitPath");
    __name(basename, "basename");
  }
});

// node_modules/@sentry/core/build/esm/integrations/console.js
function addConsoleBreadcrumb(level, args) {
  const breadcrumb = {
    category: "console",
    data: {
      arguments: args,
      logger: "console"
    },
    level: severityLevelFromString(level),
    message: formatConsoleArgs(args)
  };
  if (level === "assert") {
    if (args[0] === false) {
      const assertionArgs = args.slice(1);
      breadcrumb.message = assertionArgs.length > 0 ? `Assertion failed: ${formatConsoleArgs(assertionArgs)}` : "Assertion failed";
      breadcrumb.data.arguments = assertionArgs;
    } else {
      return;
    }
  }
  addBreadcrumb(breadcrumb, {
    input: args,
    level
  });
}
function formatConsoleArgs(values) {
  return "util" in GLOBAL_OBJ && typeof GLOBAL_OBJ.util.format === "function" ? GLOBAL_OBJ.util.format(...values) : safeJoin(values, " ");
}
var INTEGRATION_NAME6, consoleIntegration;
var init_console2 = __esm({
  "node_modules/@sentry/core/build/esm/integrations/console.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_breadcrumbs();
    init_currentScopes();
    init_console();
    init_integration();
    init_debug_logger();
    init_severity();
    init_string();
    init_worldwide();
    INTEGRATION_NAME6 = "Console";
    consoleIntegration = defineIntegration((options = {}) => {
      const levels = new Set(options.levels || CONSOLE_LEVELS);
      return {
        name: INTEGRATION_NAME6,
        setup(client) {
          const unsubscribe = addConsoleInstrumentationHandler(({ args, level }) => {
            if (getClient() !== client || !levels.has(level)) {
              return;
            }
            addConsoleBreadcrumb(level, args);
          });
          client.registerCleanup(unsubscribe);
          if (options.filter) {
            const unsubscribe2 = addConsoleInstrumentationFilter(options.filter);
            client.registerCleanup(unsubscribe2);
          }
        }
      };
    });
    __name(addConsoleBreadcrumb, "addConsoleBreadcrumb");
    __name(formatConsoleArgs, "formatConsoleArgs");
  }
});

// node_modules/@sentry/core/build/esm/integrations/conversationId.js
var INTEGRATION_NAME7, _conversationIdIntegration, conversationIdIntegration;
var init_conversationId = __esm({
  "node_modules/@sentry/core/build/esm/integrations/conversationId.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_currentScopes();
    init_integration();
    init_semanticAttributes();
    init_spanUtils();
    INTEGRATION_NAME7 = "ConversationId";
    _conversationIdIntegration = /* @__PURE__ */ __name(() => {
      return {
        name: INTEGRATION_NAME7,
        setup(client) {
          client.on("spanStart", (span) => {
            const scopeData = getCurrentScope().getScopeData();
            const isolationScopeData = getIsolationScope().getScopeData();
            const conversationId = scopeData.conversationId || isolationScopeData.conversationId;
            if (conversationId) {
              const { op, data: attributes, description: name } = spanToJSON(span);
              if (!op?.startsWith("gen_ai.") && !attributes["ai.operationId"] && !name?.startsWith("ai.")) {
                return;
              }
              span.setAttribute(GEN_AI_CONVERSATION_ID_ATTRIBUTE, conversationId);
            }
          });
        }
      };
    }, "_conversationIdIntegration");
    conversationIdIntegration = defineIntegration(_conversationIdIntegration);
  }
});

// node_modules/@sentry/core/build/esm/fetch.js
function instrumentFetchRequest(handlerData, shouldCreateSpan, shouldAttachHeaders, spans, spanOriginOrOptions) {
  if (!handlerData.fetchData) {
    return void 0;
  }
  const { method, url } = handlerData.fetchData;
  const shouldCreateSpanResult = hasSpansEnabled() && shouldCreateSpan(url);
  if (handlerData.endTimestamp) {
    const spanId = handlerData.fetchData.__span;
    if (!spanId)
      return;
    const span2 = spans[spanId];
    if (span2) {
      if (shouldCreateSpanResult) {
        endSpan(span2, handlerData);
        _callOnRequestSpanEnd(span2, handlerData, spanOriginOrOptions);
      }
      delete spans[spanId];
    }
    return void 0;
  }
  const { spanOrigin = "auto.http.browser", propagateTraceparent = false } = typeof spanOriginOrOptions === "object" ? spanOriginOrOptions : { spanOrigin: spanOriginOrOptions };
  const client = getClient();
  const hasParent = !!getActiveSpan();
  const shouldEmitSpan = hasParent || !!client && hasSpanStreamingEnabled(client);
  const span = shouldCreateSpanResult && shouldEmitSpan ? startInactiveSpan(getSpanStartOptions(url, method, spanOrigin)) : new SentryNonRecordingSpan();
  const spanForTraceHeaders = spanIsIgnored(span) && hasParent ? void 0 : span;
  if (shouldCreateSpanResult && !shouldEmitSpan) {
    client?.recordDroppedEvent("no_parent_span", "span");
  }
  handlerData.fetchData.__span = span.spanContext().spanId;
  spans[span.spanContext().spanId] = span;
  if (shouldAttachHeaders(handlerData.fetchData.url)) {
    const request = handlerData.args[0];
    const options = { ...handlerData.args[1] || {} };
    const headers = _INTERNAL_getTracingHeadersForFetchRequest(
      request,
      options,
      // If performance is disabled (TWP) or there's no active root span (pageload/navigation/interaction),
      // we do not want to use the span as base for the trace headers,
      // which means that the headers will be generated from the scope and the sampling decision is deferred
      hasSpansEnabled() && shouldEmitSpan ? spanForTraceHeaders : void 0,
      propagateTraceparent
    );
    if (headers) {
      handlerData.args[1] = options;
      options.headers = headers;
    }
  }
  if (client) {
    const fetchHint = {
      input: handlerData.args,
      response: handlerData.response,
      startTimestamp: handlerData.startTimestamp,
      endTimestamp: handlerData.endTimestamp
    };
    client.emit("beforeOutgoingRequestSpan", span, fetchHint);
  }
  return span;
}
function _callOnRequestSpanEnd(span, handlerData, spanOriginOrOptions) {
  const onRequestSpanEnd = typeof spanOriginOrOptions === "object" && spanOriginOrOptions !== null ? spanOriginOrOptions.onRequestSpanEnd : void 0;
  onRequestSpanEnd?.(span, {
    headers: handlerData.response?.headers,
    error: handlerData.error
  });
}
function _INTERNAL_getTracingHeadersForFetchRequest(request, fetchOptionsObj, span, propagateTraceparent) {
  const traceHeaders = getTraceData({ span, propagateTraceparent });
  const sentryTrace = traceHeaders["sentry-trace"];
  const baggage = traceHeaders.baggage;
  const traceparent = traceHeaders.traceparent;
  if (!sentryTrace) {
    return void 0;
  }
  const originalHeaders = fetchOptionsObj.headers || (isRequest(request) ? request.headers : void 0);
  if (!originalHeaders) {
    return { ...traceHeaders };
  } else if (isHeaders(originalHeaders)) {
    const newHeaders = new Headers(originalHeaders);
    if (!newHeaders.get("sentry-trace")) {
      newHeaders.set("sentry-trace", sentryTrace);
    }
    if (propagateTraceparent && traceparent && !newHeaders.get("traceparent")) {
      newHeaders.set("traceparent", traceparent);
    }
    if (baggage) {
      const prevBaggageHeader = newHeaders.get("baggage");
      if (!prevBaggageHeader) {
        newHeaders.set("baggage", baggage);
      } else if (!baggageHeaderHasSentryBaggageValues(prevBaggageHeader)) {
        newHeaders.set("baggage", `${prevBaggageHeader},${baggage}`);
      }
    }
    return newHeaders;
  } else if (isHeadersInitTupleArray(originalHeaders)) {
    const newHeaders = [...originalHeaders];
    if (!newHeaders.find((header) => header[0] === "sentry-trace")) {
      newHeaders.push(["sentry-trace", sentryTrace]);
    }
    if (propagateTraceparent && traceparent && !newHeaders.find((header) => header[0] === "traceparent")) {
      newHeaders.push(["traceparent", traceparent]);
    }
    const prevBaggageHeaderWithSentryValues = originalHeaders.find(
      (header) => header[0] === "baggage" && typeof header[1] === "string" && baggageHeaderHasSentryBaggageValues(header[1])
    );
    if (baggage && !prevBaggageHeaderWithSentryValues) {
      newHeaders.push(["baggage", baggage]);
    }
    return newHeaders;
  } else {
    const existingSentryTraceHeader = "sentry-trace" in originalHeaders ? originalHeaders["sentry-trace"] : void 0;
    const existingTraceparentHeader = "traceparent" in originalHeaders ? originalHeaders.traceparent : void 0;
    const existingBaggageHeader = "baggage" in originalHeaders ? originalHeaders.baggage : void 0;
    const newBaggageHeaders = existingBaggageHeader ? Array.isArray(existingBaggageHeader) ? [...existingBaggageHeader] : [existingBaggageHeader] : [];
    const prevBaggageHeaderWithSentryValues = existingBaggageHeader && (Array.isArray(existingBaggageHeader) ? existingBaggageHeader.find((headerItem) => baggageHeaderHasSentryBaggageValues(headerItem)) : baggageHeaderHasSentryBaggageValues(existingBaggageHeader));
    if (baggage && !prevBaggageHeaderWithSentryValues) {
      newBaggageHeaders.push(baggage);
    }
    const newHeaders = Object.assign({}, originalHeaders, {
      "sentry-trace": existingSentryTraceHeader ?? sentryTrace,
      baggage: newBaggageHeaders.length > 0 ? newBaggageHeaders.join(",") : void 0
    });
    if (propagateTraceparent && traceparent && !existingTraceparentHeader) {
      newHeaders.traceparent = traceparent;
    }
    return newHeaders;
  }
}
function endSpan(span, handlerData) {
  if (handlerData.response) {
    setHttpStatus(span, handlerData.response.status);
    const contentLength = handlerData.response?.headers?.get("content-length");
    if (contentLength) {
      const contentLengthNum = parseInt(contentLength);
      if (contentLengthNum > 0) {
        span.setAttribute("http.response_content_length", contentLengthNum);
      }
    }
  } else if (handlerData.error) {
    span.setStatus({ code: SPAN_STATUS_ERROR, message: "internal_error" });
  }
  span.end();
}
function baggageHeaderHasSentryBaggageValues(baggageHeader) {
  if (typeof baggageHeader !== "string") {
    return false;
  }
  return baggageHeader.split(",").some((baggageEntry) => baggageEntry.trim().startsWith(SENTRY_BAGGAGE_KEY_PREFIX));
}
function isHeaders(headers) {
  return typeof Headers !== "undefined" && isInstanceOf(headers, Headers);
}
function isHeadersInitTupleArray(headers) {
  if (!Array.isArray(headers)) {
    return false;
  }
  return headers.every(
    (item) => Array.isArray(item) && item.length === 2 && typeof item[0] === "string"
  );
}
function getSpanStartOptions(url, method, spanOrigin) {
  if (url.startsWith("data:")) {
    const sanitizedUrl2 = stripDataUrlContent(url);
    return {
      name: `${method} ${sanitizedUrl2}`,
      attributes: getFetchSpanAttributes(url, void 0, method, spanOrigin)
    };
  }
  const parsedUrl = parseStringToURLObject(url);
  const sanitizedUrl = parsedUrl ? getSanitizedUrlStringFromUrlObject(parsedUrl) : url;
  return {
    name: `${method} ${sanitizedUrl}`,
    attributes: getFetchSpanAttributes(url, parsedUrl, method, spanOrigin)
  };
}
function getFetchSpanAttributes(url, parsedUrl, method, spanOrigin) {
  const attributes = {
    url: stripDataUrlContent(url),
    type: "fetch",
    "http.method": method,
    [SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: spanOrigin,
    [SEMANTIC_ATTRIBUTE_SENTRY_OP]: "http.client"
  };
  if (parsedUrl) {
    if (!isURLObjectRelative(parsedUrl)) {
      attributes["http.url"] = stripDataUrlContent(parsedUrl.href);
      attributes["server.address"] = parsedUrl.host;
    }
    if (parsedUrl.search) {
      attributes["http.query"] = parsedUrl.search;
    }
    if (parsedUrl.hash) {
      attributes["http.fragment"] = parsedUrl.hash;
    }
  }
  return attributes;
}
var init_fetch = __esm({
  "node_modules/@sentry/core/build/esm/fetch.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_currentScopes();
    init_semanticAttributes();
    init_spanUtils();
    init_spanstatus();
    init_is();
    init_hasSpansEnabled();
    init_sentryNonRecordingSpan();
    init_baggage();
    init_hasSpanStreamingEnabled();
    init_trace();
    init_traceData();
    init_url();
    __name(instrumentFetchRequest, "instrumentFetchRequest");
    __name(_callOnRequestSpanEnd, "_callOnRequestSpanEnd");
    __name(_INTERNAL_getTracingHeadersForFetchRequest, "_INTERNAL_getTracingHeadersForFetchRequest");
    __name(endSpan, "endSpan");
    __name(baggageHeaderHasSentryBaggageValues, "baggageHeaderHasSentryBaggageValues");
    __name(isHeaders, "isHeaders");
    __name(isHeadersInitTupleArray, "isHeadersInitTupleArray");
    __name(getSpanStartOptions, "getSpanStartOptions");
    __name(getFetchSpanAttributes, "getFetchSpanAttributes");
  }
});

// node_modules/@sentry/core/build/esm/tracing/ai/gen-ai-attributes.js
var GEN_AI_REQUEST_STREAM_ATTRIBUTE, GEN_AI_RESPONSE_FINISH_REASONS_ATTRIBUTE, GEN_AI_RESPONSE_MODEL_ATTRIBUTE, GEN_AI_RESPONSE_ID_ATTRIBUTE, GEN_AI_USAGE_INPUT_TOKENS_ATTRIBUTE, GEN_AI_USAGE_OUTPUT_TOKENS_ATTRIBUTE, GEN_AI_USAGE_TOTAL_TOKENS_ATTRIBUTE, GEN_AI_INPUT_MESSAGES_ORIGINAL_LENGTH_ATTRIBUTE, GEN_AI_OUTPUT_MESSAGES_ATTRIBUTE, GEN_AI_RESPONSE_TEXT_ATTRIBUTE, GEN_AI_RESPONSE_STREAMING_ATTRIBUTE, GEN_AI_RESPONSE_TOOL_CALLS_ATTRIBUTE;
var init_gen_ai_attributes = __esm({
  "node_modules/@sentry/core/build/esm/tracing/ai/gen-ai-attributes.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    GEN_AI_REQUEST_STREAM_ATTRIBUTE = "gen_ai.request.stream";
    GEN_AI_RESPONSE_FINISH_REASONS_ATTRIBUTE = "gen_ai.response.finish_reasons";
    GEN_AI_RESPONSE_MODEL_ATTRIBUTE = "gen_ai.response.model";
    GEN_AI_RESPONSE_ID_ATTRIBUTE = "gen_ai.response.id";
    GEN_AI_USAGE_INPUT_TOKENS_ATTRIBUTE = "gen_ai.usage.input_tokens";
    GEN_AI_USAGE_OUTPUT_TOKENS_ATTRIBUTE = "gen_ai.usage.output_tokens";
    GEN_AI_USAGE_TOTAL_TOKENS_ATTRIBUTE = "gen_ai.usage.total_tokens";
    GEN_AI_INPUT_MESSAGES_ORIGINAL_LENGTH_ATTRIBUTE = "sentry.sdk_meta.gen_ai.input.messages.original_length";
    GEN_AI_OUTPUT_MESSAGES_ATTRIBUTE = "gen_ai.output.messages";
    GEN_AI_RESPONSE_TEXT_ATTRIBUTE = "gen_ai.response.text";
    GEN_AI_RESPONSE_STREAMING_ATTRIBUTE = "gen_ai.response.streaming";
    GEN_AI_RESPONSE_TOOL_CALLS_ATTRIBUTE = "gen_ai.response.tool_calls";
  }
});

// node_modules/@sentry/core/build/esm/tracing/ai/mediaStripping.js
function isContentMedia(part) {
  if (!part || typeof part !== "object")
    return false;
  return isContentMediaSource(part) || hasInlineData(part) || hasImageUrl(part) || hasInputAudio(part) || hasFileData(part) || hasMediaTypeData(part) || hasVercelFileData(part) || hasVercelImageData(part) || hasBlobOrBase64Type(part) || hasB64Json(part) || hasImageGenerationResult(part) || hasDataUri(part);
}
function hasImageUrl(part) {
  if (!("image_url" in part))
    return false;
  if (typeof part.image_url === "string")
    return part.image_url.startsWith("data:");
  return hasNestedImageUrl(part);
}
function hasNestedImageUrl(part) {
  return "image_url" in part && !!part.image_url && typeof part.image_url === "object" && "url" in part.image_url && typeof part.image_url.url === "string" && part.image_url.url.startsWith("data:");
}
function isContentMediaSource(part) {
  return "type" in part && typeof part.type === "string" && "source" in part && isContentMedia(part.source);
}
function hasInlineData(part) {
  return "inlineData" in part && !!part.inlineData && typeof part.inlineData === "object" && "data" in part.inlineData && typeof part.inlineData.data === "string";
}
function hasInputAudio(part) {
  return "type" in part && part.type === "input_audio" && "input_audio" in part && !!part.input_audio && typeof part.input_audio === "object" && "data" in part.input_audio && typeof part.input_audio.data === "string";
}
function hasFileData(part) {
  return "type" in part && part.type === "file" && "file" in part && !!part.file && typeof part.file === "object" && "file_data" in part.file && typeof part.file.file_data === "string";
}
function hasMediaTypeData(part) {
  return "media_type" in part && typeof part.media_type === "string" && "data" in part;
}
function hasVercelFileData(part) {
  return "type" in part && part.type === "file" && "mediaType" in part && typeof part.mediaType === "string" && "data" in part && typeof part.data === "string" && // Only strip base64/binary data, not HTTP/HTTPS URLs which should be preserved as references
  !part.data.startsWith("http://") && !part.data.startsWith("https://");
}
function hasVercelImageData(part) {
  return "type" in part && part.type === "image" && "image" in part && typeof part.image === "string" && // Only strip base64/data URIs, not HTTP/HTTPS URLs which should be preserved as references
  !part.image.startsWith("http://") && !part.image.startsWith("https://");
}
function hasBlobOrBase64Type(part) {
  return "type" in part && (part.type === "blob" || part.type === "base64");
}
function hasB64Json(part) {
  return "b64_json" in part;
}
function hasImageGenerationResult(part) {
  return "type" in part && "result" in part && part.type === "image_generation";
}
function hasDataUri(part) {
  return "uri" in part && typeof part.uri === "string" && part.uri.startsWith("data:");
}
function stripInlineMediaFromSingleMessage(part) {
  const strip = { ...part };
  if (isContentMedia(strip.source)) {
    strip.source = stripInlineMediaFromSingleMessage(strip.source);
  }
  if (hasInlineData(part)) {
    strip.inlineData = { ...part.inlineData, data: REMOVED_STRING };
  }
  if (hasNestedImageUrl(part)) {
    strip.image_url = { ...part.image_url, url: REMOVED_STRING };
  }
  if (hasInputAudio(part)) {
    strip.input_audio = { ...part.input_audio, data: REMOVED_STRING };
  }
  if (hasFileData(part)) {
    strip.file = { ...part.file, file_data: REMOVED_STRING };
  }
  for (const field of MEDIA_FIELDS) {
    if (typeof strip[field] === "string")
      strip[field] = REMOVED_STRING;
  }
  return strip;
}
var REMOVED_STRING, MEDIA_FIELDS;
var init_mediaStripping = __esm({
  "node_modules/@sentry/core/build/esm/tracing/ai/mediaStripping.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    __name(isContentMedia, "isContentMedia");
    __name(hasImageUrl, "hasImageUrl");
    __name(hasNestedImageUrl, "hasNestedImageUrl");
    __name(isContentMediaSource, "isContentMediaSource");
    __name(hasInlineData, "hasInlineData");
    __name(hasInputAudio, "hasInputAudio");
    __name(hasFileData, "hasFileData");
    __name(hasMediaTypeData, "hasMediaTypeData");
    __name(hasVercelFileData, "hasVercelFileData");
    __name(hasVercelImageData, "hasVercelImageData");
    __name(hasBlobOrBase64Type, "hasBlobOrBase64Type");
    __name(hasB64Json, "hasB64Json");
    __name(hasImageGenerationResult, "hasImageGenerationResult");
    __name(hasDataUri, "hasDataUri");
    REMOVED_STRING = "[Blob substitute]";
    MEDIA_FIELDS = ["image_url", "data", "content", "b64_json", "result", "uri", "image"];
    __name(stripInlineMediaFromSingleMessage, "stripInlineMediaFromSingleMessage");
  }
});

// node_modules/@sentry/core/build/esm/tracing/ai/messageTruncation.js
function truncateTextByBytes(text, maxBytes) {
  if (utf8Bytes(text) <= maxBytes) {
    return text;
  }
  let low = 0;
  let high = text.length;
  let bestFit = "";
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const candidate = text.slice(0, mid);
    const byteSize = utf8Bytes(candidate);
    if (byteSize <= maxBytes) {
      bestFit = candidate;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return bestFit;
}
function getItemText(item) {
  if (typeof item === "string") {
    return item;
  }
  if ("text" in item && typeof item.text === "string") {
    return item.text;
  }
  return "";
}
function withItemText(item, text) {
  if (typeof item === "string") {
    return text;
  }
  return { ...item, text };
}
function isContentMessage(message) {
  return message !== null && typeof message === "object" && "content" in message && typeof message.content === "string";
}
function isContentArrayMessage(message) {
  return message !== null && typeof message === "object" && "content" in message && Array.isArray(message.content);
}
function isPartsMessage(message) {
  return message !== null && typeof message === "object" && "parts" in message && Array.isArray(message.parts) && message.parts.length > 0;
}
function truncateContentMessage(message, maxBytes) {
  const emptyMessage = { ...message, content: "" };
  const overhead = jsonBytes(emptyMessage);
  const availableForContent = maxBytes - overhead;
  if (availableForContent <= 0) {
    return [];
  }
  const truncatedContent = truncateTextByBytes(message.content, availableForContent);
  return [{ ...message, content: truncatedContent }];
}
function getArrayItems(message) {
  if ("parts" in message && Array.isArray(message.parts)) {
    return { key: "parts", items: message.parts };
  }
  if ("content" in message && Array.isArray(message.content)) {
    return { key: "content", items: message.content };
  }
  return { key: null, items: [] };
}
function truncateArrayMessage(message, maxBytes) {
  const { key, items } = getArrayItems(message);
  if (key === null || items.length === 0) {
    return [];
  }
  const emptyItems = items.map((item) => withItemText(item, ""));
  const overhead = jsonBytes({ ...message, [key]: emptyItems });
  let remainingBytes = maxBytes - overhead;
  if (remainingBytes <= 0) {
    return [];
  }
  const includedItems = [];
  for (const item of items) {
    const text = getItemText(item);
    const textSize = utf8Bytes(text);
    if (textSize <= remainingBytes) {
      includedItems.push(item);
      remainingBytes -= textSize;
    } else if (includedItems.length === 0) {
      const truncated = truncateTextByBytes(text, remainingBytes);
      if (truncated) {
        includedItems.push(withItemText(item, truncated));
      }
      break;
    } else {
      break;
    }
  }
  if (includedItems.length <= 0) {
    return [];
  } else {
    return [{ ...message, [key]: includedItems }];
  }
}
function truncateSingleMessage(message, maxBytes) {
  if (!message)
    return [];
  if (typeof message === "string") {
    const truncated = truncateTextByBytes(message, maxBytes);
    return truncated ? [truncated] : [];
  }
  if (typeof message !== "object") {
    return [];
  }
  if (isContentMessage(message)) {
    return truncateContentMessage(message, maxBytes);
  }
  if (isContentArrayMessage(message) || isPartsMessage(message)) {
    return truncateArrayMessage(message, maxBytes);
  }
  return [];
}
function stripInlineMediaFromMessages(messages) {
  const stripped = messages.map((message) => {
    let newMessage = void 0;
    if (!!message && typeof message === "object") {
      if (isContentArrayMessage(message)) {
        newMessage = {
          ...message,
          content: stripInlineMediaFromMessages(message.content)
        };
      } else if ("content" in message && isContentMedia(message.content)) {
        newMessage = {
          ...message,
          content: stripInlineMediaFromSingleMessage(message.content)
        };
      }
      if (isPartsMessage(message)) {
        newMessage = {
          // might have to strip content AND parts
          ...newMessage ?? message,
          parts: stripInlineMediaFromMessages(message.parts)
        };
      }
      if (isContentMedia(newMessage)) {
        newMessage = stripInlineMediaFromSingleMessage(newMessage);
      } else if (isContentMedia(message)) {
        newMessage = stripInlineMediaFromSingleMessage(message);
      }
    }
    return newMessage ?? message;
  });
  return stripped;
}
function truncateMessagesByBytes(messages, maxBytes) {
  if (!Array.isArray(messages) || messages.length === 0) {
    return messages;
  }
  const effectiveMaxBytes = maxBytes - 2;
  const lastMessage = messages[messages.length - 1];
  const stripped = stripInlineMediaFromMessages([lastMessage]);
  const strippedMessage = stripped[0];
  const messageBytes = jsonBytes(strippedMessage);
  if (messageBytes <= effectiveMaxBytes) {
    return stripped;
  }
  return truncateSingleMessage(strippedMessage, effectiveMaxBytes);
}
function truncateGenAiMessages(messages) {
  return truncateMessagesByBytes(messages, DEFAULT_GEN_AI_MESSAGES_BYTE_LIMIT);
}
function truncateGenAiStringInput(input) {
  return truncateTextByBytes(input, DEFAULT_GEN_AI_MESSAGES_BYTE_LIMIT);
}
var DEFAULT_GEN_AI_MESSAGES_BYTE_LIMIT, utf8Bytes, jsonBytes;
var init_messageTruncation = __esm({
  "node_modules/@sentry/core/build/esm/tracing/ai/messageTruncation.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_mediaStripping();
    DEFAULT_GEN_AI_MESSAGES_BYTE_LIMIT = 2e4;
    utf8Bytes = /* @__PURE__ */ __name((text) => {
      return new TextEncoder().encode(text).length;
    }, "utf8Bytes");
    jsonBytes = /* @__PURE__ */ __name((value) => {
      return utf8Bytes(JSON.stringify(value));
    }, "jsonBytes");
    __name(truncateTextByBytes, "truncateTextByBytes");
    __name(getItemText, "getItemText");
    __name(withItemText, "withItemText");
    __name(isContentMessage, "isContentMessage");
    __name(isContentArrayMessage, "isContentArrayMessage");
    __name(isPartsMessage, "isPartsMessage");
    __name(truncateContentMessage, "truncateContentMessage");
    __name(getArrayItems, "getArrayItems");
    __name(truncateArrayMessage, "truncateArrayMessage");
    __name(truncateSingleMessage, "truncateSingleMessage");
    __name(stripInlineMediaFromMessages, "stripInlineMediaFromMessages");
    __name(truncateMessagesByBytes, "truncateMessagesByBytes");
    __name(truncateGenAiMessages, "truncateGenAiMessages");
    __name(truncateGenAiStringInput, "truncateGenAiStringInput");
  }
});

// node_modules/@sentry/core/build/esm/tracing/ai/utils.js
function resolveAIRecordingOptions(options) {
  const genAI = getClient()?.getDataCollectionOptions().genAI;
  return {
    ...options,
    recordInputs: options?.recordInputs ?? genAI?.inputs ?? false,
    recordOutputs: options?.recordOutputs ?? genAI?.outputs ?? false
  };
}
function shouldEnableTruncation(enableTruncation) {
  if (enableTruncation !== void 0) {
    return enableTruncation;
  }
  const client = getClient();
  if (!client) {
    return true;
  }
  return !hasSpanStreamingEnabled(client) && client.getOptions().streamGenAiSpans === false;
}
function setTokenUsageAttributes(span, promptTokens, completionTokens, cachedInputTokens, cachedOutputTokens) {
  if (promptTokens !== void 0) {
    span.setAttributes({
      [GEN_AI_USAGE_INPUT_TOKENS_ATTRIBUTE]: promptTokens
    });
  }
  if (completionTokens !== void 0) {
    span.setAttributes({
      [GEN_AI_USAGE_OUTPUT_TOKENS_ATTRIBUTE]: completionTokens
    });
  }
  if (promptTokens !== void 0 || completionTokens !== void 0 || cachedInputTokens !== void 0 || cachedOutputTokens !== void 0) {
    const totalTokens = (promptTokens ?? 0) + (completionTokens ?? 0) + (cachedInputTokens ?? 0) + (cachedOutputTokens ?? 0);
    span.setAttributes({
      [GEN_AI_USAGE_TOTAL_TOKENS_ATTRIBUTE]: totalTokens
    });
  }
}
function endStreamSpan(span, state, recordOutputs) {
  if (!span.isRecording()) {
    return;
  }
  const attrs = {
    [GEN_AI_RESPONSE_STREAMING_ATTRIBUTE]: true
  };
  if (state.responseId)
    attrs[GEN_AI_RESPONSE_ID_ATTRIBUTE] = state.responseId;
  if (state.responseModel)
    attrs[GEN_AI_RESPONSE_MODEL_ATTRIBUTE] = state.responseModel;
  if (state.promptTokens !== void 0)
    attrs[GEN_AI_USAGE_INPUT_TOKENS_ATTRIBUTE] = state.promptTokens;
  if (state.completionTokens !== void 0)
    attrs[GEN_AI_USAGE_OUTPUT_TOKENS_ATTRIBUTE] = state.completionTokens;
  if (state.totalTokens !== void 0) {
    attrs[GEN_AI_USAGE_TOTAL_TOKENS_ATTRIBUTE] = state.totalTokens;
  } else if (state.promptTokens !== void 0 || state.completionTokens !== void 0 || state.cacheCreationInputTokens !== void 0 || state.cacheReadInputTokens !== void 0) {
    attrs[GEN_AI_USAGE_TOTAL_TOKENS_ATTRIBUTE] = (state.promptTokens ?? 0) + (state.completionTokens ?? 0) + (state.cacheCreationInputTokens ?? 0) + (state.cacheReadInputTokens ?? 0);
  }
  if (state.finishReasons.length) {
    attrs[GEN_AI_RESPONSE_FINISH_REASONS_ATTRIBUTE] = JSON.stringify(state.finishReasons);
  }
  if (recordOutputs && state.responseTexts.length) {
    attrs[GEN_AI_RESPONSE_TEXT_ATTRIBUTE] = state.responseTexts.join("");
  }
  if (recordOutputs && state.toolCalls.length) {
    attrs[GEN_AI_RESPONSE_TOOL_CALLS_ATTRIBUTE] = JSON.stringify(state.toolCalls);
  }
  span.setAttributes(attrs);
  span.end();
}
function getTruncatedJsonString(value) {
  if (typeof value === "string") {
    return truncateGenAiStringInput(value);
  }
  try {
    return JSON.stringify(Array.isArray(value) ? truncateGenAiMessages(value) : value);
  } catch {
    return "[unserializable]";
  }
}
function extractSystemInstructions(messages) {
  if (!Array.isArray(messages)) {
    return { systemInstructions: void 0, filteredMessages: messages };
  }
  const systemMessageIndex = messages.findIndex(
    (msg) => msg && typeof msg === "object" && "role" in msg && msg.role === "system"
  );
  if (systemMessageIndex === -1) {
    return { systemInstructions: void 0, filteredMessages: messages };
  }
  const systemMessage = messages[systemMessageIndex];
  const systemContent = typeof systemMessage.content === "string" ? systemMessage.content : systemMessage.content !== void 0 ? JSON.stringify(systemMessage.content) : void 0;
  if (!systemContent) {
    return { systemInstructions: void 0, filteredMessages: messages };
  }
  const systemInstructions = JSON.stringify([{ type: "text", content: systemContent }]);
  const filteredMessages = [...messages.slice(0, systemMessageIndex), ...messages.slice(systemMessageIndex + 1)];
  return { systemInstructions, filteredMessages };
}
var init_utils2 = __esm({
  "node_modules/@sentry/core/build/esm/tracing/ai/utils.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_currentScopes();
    init_hasSpanStreamingEnabled();
    init_gen_ai_attributes();
    init_messageTruncation();
    __name(resolveAIRecordingOptions, "resolveAIRecordingOptions");
    __name(shouldEnableTruncation, "shouldEnableTruncation");
    __name(setTokenUsageAttributes, "setTokenUsageAttributes");
    __name(endStreamSpan, "endStreamSpan");
    __name(getTruncatedJsonString, "getTruncatedJsonString");
    __name(extractSystemInstructions, "extractSystemInstructions");
  }
});

// node_modules/@sentry/core/build/esm/tracing/workers-ai/constants.js
var WORKERS_AI_PROVIDER_NAME, WORKERS_AI_ORIGIN;
var init_constants2 = __esm({
  "node_modules/@sentry/core/build/esm/tracing/workers-ai/constants.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    WORKERS_AI_PROVIDER_NAME = "cloudflare.workers_ai";
    WORKERS_AI_ORIGIN = "auto.ai.cloudflare.workers_ai";
  }
});

// node_modules/@sentry/core/build/esm/tracing/workers-ai/utils.js
function getOperationName(inputs) {
  if (inputs && typeof inputs === "object") {
    if ("messages" in inputs || "prompt" in inputs) {
      return "chat";
    }
    if ("text" in inputs) {
      return "embeddings";
    }
  }
  return "chat";
}
function extractRequestAttributes(model, inputs, operationName) {
  const attributes = {
    [Kr]: WORKERS_AI_PROVIDER_NAME,
    [Vr]: operationName,
    [SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: WORKERS_AI_ORIGIN,
    [Zr]: typeof model === "string" ? model : "unknown"
  };
  if (inputs && typeof inputs === "object") {
    const params = inputs;
    if (typeof params.temperature === "number") {
      attributes[na] = params.temperature;
    }
    if (typeof params.max_tokens === "number") {
      attributes[Xr] = params.max_tokens;
    }
    if (typeof params.top_p === "number") {
      attributes[aa] = params.top_p;
    }
    if (typeof params.top_k === "number") {
      attributes[ra] = params.top_k;
    }
    if (typeof params.frequency_penalty === "number") {
      attributes[Qr] = params.frequency_penalty;
    }
    if (typeof params.presence_penalty === "number") {
      attributes[$r] = params.presence_penalty;
    }
    if (params.stream === true) {
      attributes[GEN_AI_REQUEST_STREAM_ATTRIBUTE] = true;
    }
  }
  return attributes;
}
function addRequestAttributes(span, inputs, operationName, enableTruncation) {
  if (!inputs || typeof inputs !== "object") {
    return;
  }
  const params = inputs;
  if (operationName === "embeddings") {
    const text = params.text;
    if (text == null || typeof text === "string" && text.length === 0 || Array.isArray(text) && text.length === 0) {
      return;
    }
    span.setAttribute(qr, typeof text === "string" ? text : JSON.stringify(text));
    return;
  }
  const src = params.messages ?? params.prompt;
  if (src == null || Array.isArray(src) && src.length === 0) {
    return;
  }
  const { systemInstructions, filteredMessages } = extractSystemInstructions(src);
  if (systemInstructions) {
    span.setAttribute(ya, systemInstructions);
  }
  span.setAttribute(
    Yr,
    enableTruncation ? getTruncatedJsonString(filteredMessages) : stringify(filteredMessages)
  );
  span.setAttribute(
    GEN_AI_INPUT_MESSAGES_ORIGINAL_LENGTH_ATTRIBUTE,
    Array.isArray(filteredMessages) ? filteredMessages.length : 1
  );
}
function setOutputMessagesAttribute(span, { responseText, toolCalls }) {
  const parts = [];
  if (typeof responseText === "string" && responseText.length > 0) {
    parts.push({ type: "text", content: responseText });
  }
  if (Array.isArray(toolCalls)) {
    for (const toolCall of toolCalls) {
      if (!toolCall || typeof toolCall !== "object") {
        continue;
      }
      const call = toolCall;
      const name = call.function?.name ?? call.name;
      const args = call.function?.arguments ?? call.arguments;
      parts.push({
        type: "tool_call",
        id: call.id,
        name,
        arguments: typeof args === "string" ? args : JSON.stringify(args ?? {})
      });
    }
  }
  if (parts.length > 0) {
    span.setAttribute(GEN_AI_OUTPUT_MESSAGES_ATTRIBUTE, JSON.stringify([{ role: "assistant", parts }]));
  }
}
function addResponseAttributes(span, result, recordOutputs) {
  if (!result || typeof result !== "object" || // Raw `Response` objects (from `returnRawResponse`/`websocket`) cannot be introspected without consuming them.
  typeof Response !== "undefined" && result instanceof Response) {
    return;
  }
  const response = result;
  if (response.usage) {
    setTokenUsageAttributes(span, response.usage.prompt_tokens, response.usage.completion_tokens);
  }
  if (recordOutputs) {
    let responseText;
    if (typeof response.response === "string") {
      responseText = response.response;
      span.setAttribute(GEN_AI_RESPONSE_TEXT_ATTRIBUTE, response.response);
    } else if (response.response != null) {
      responseText = JSON.stringify(response.response);
      span.setAttribute(GEN_AI_RESPONSE_TEXT_ATTRIBUTE, responseText);
    }
    const toolCalls = Array.isArray(response.tool_calls) && response.tool_calls.length > 0 ? response.tool_calls : void 0;
    if (toolCalls) {
      span.setAttribute(GEN_AI_RESPONSE_TOOL_CALLS_ATTRIBUTE, JSON.stringify(toolCalls));
    }
    setOutputMessagesAttribute(span, { responseText, toolCalls });
  }
}
var init_utils3 = __esm({
  "node_modules/@sentry/core/build/esm/tracing/workers-ai/utils.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_attributes2();
    init_semanticAttributes();
    init_gen_ai_attributes();
    init_utils2();
    init_string();
    init_constants2();
    __name(getOperationName, "getOperationName");
    __name(extractRequestAttributes, "extractRequestAttributes");
    __name(addRequestAttributes, "addRequestAttributes");
    __name(setOutputMessagesAttribute, "setOutputMessagesAttribute");
    __name(addResponseAttributes, "addResponseAttributes");
  }
});

// node_modules/@sentry/core/build/esm/tracing/workers-ai/streaming.js
function accumulateStreamingToolCalls(toolCalls, accumulator) {
  for (const toolCall of toolCalls) {
    const name = toolCall.function?.name ?? toolCall.name;
    const args = toolCall.function?.arguments ?? toolCall.arguments;
    if (name == null && args == null) {
      continue;
    }
    const index = toolCall.index ?? 0;
    const existing = accumulator[index];
    if (!existing) {
      accumulator[index] = {
        index,
        id: toolCall.id,
        type: toolCall.type,
        function: {
          name,
          arguments: args ?? ""
        }
      };
    } else if (existing.function) {
      if (name && !existing.function.name) {
        existing.function.name = name;
      }
      if (args) {
        existing.function.arguments = `${existing.function.arguments ?? ""}${args}`;
      }
    }
  }
}
function processLine(line, state, recordOutputs, toolCallAccumulator) {
  const trimmed = line.trim();
  if (!trimmed.startsWith("data:")) {
    return;
  }
  const data = trimmed.slice("data:".length).trim();
  if (!data || data === "[DONE]") {
    return;
  }
  let parsed;
  try {
    parsed = JSON.parse(data);
  } catch {
    return;
  }
  if (parsed.usage) {
    if (typeof parsed.usage.prompt_tokens === "number") {
      state.promptTokens = parsed.usage.prompt_tokens;
    }
    if (typeof parsed.usage.completion_tokens === "number") {
      state.completionTokens = parsed.usage.completion_tokens;
    }
    if (typeof parsed.usage.total_tokens === "number") {
      state.totalTokens = parsed.usage.total_tokens;
    }
  }
  if (recordOutputs && typeof parsed.response === "string") {
    state.responseTexts.push(parsed.response);
  }
  if (recordOutputs && Array.isArray(parsed.tool_calls) && parsed.tool_calls.length > 0) {
    state.toolCalls.push(...parsed.tool_calls);
  }
  if (Array.isArray(parsed.choices)) {
    for (const choice of parsed.choices) {
      if (recordOutputs && typeof choice.delta?.content === "string" && choice.delta.content) {
        state.responseTexts.push(choice.delta.content);
      }
      if (recordOutputs && Array.isArray(choice.delta?.tool_calls)) {
        accumulateStreamingToolCalls(choice.delta.tool_calls, toolCallAccumulator);
      }
      if (typeof choice.finish_reason === "string") {
        state.finishReasons.push(choice.finish_reason);
      }
    }
  }
}
function instrumentWorkersAiStream(stream, span, recordOutputs) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  const state = {
    responseId: "",
    responseModel: "",
    finishReasons: [],
    responseTexts: [],
    toolCalls: [],
    promptTokens: void 0,
    completionTokens: void 0,
    totalTokens: void 0
  };
  const toolCallAccumulator = {};
  let buffer = "";
  let spanEnded = false;
  const finish = /* @__PURE__ */ __name(() => {
    if (spanEnded) {
      return;
    }
    spanEnded = true;
    if (recordOutputs) {
      const accumulatedToolCalls = Object.values(toolCallAccumulator);
      if (accumulatedToolCalls.length > 0) {
        state.toolCalls.push(...accumulatedToolCalls);
      }
      setOutputMessagesAttribute(span, {
        responseText: state.responseTexts.join(""),
        toolCalls: state.toolCalls
      });
    }
    endStreamSpan(span, state, recordOutputs);
  }, "finish");
  const flushBuffer = /* @__PURE__ */ __name((isDone) => {
    const lines = buffer.split("\n");
    buffer = isDone ? "" : lines.pop() ?? "";
    for (const line of lines) {
      processLine(line, state, recordOutputs, toolCallAccumulator);
    }
  }, "flushBuffer");
  return new ReadableStream({
    async pull(controller) {
      try {
        const { done, value } = await reader.read();
        if (done) {
          buffer += decoder.decode();
          flushBuffer(true);
          finish();
          controller.close();
          return;
        }
        buffer += decoder.decode(value, { stream: true });
        flushBuffer(false);
        controller.enqueue(value);
      } catch (error2) {
        span.setStatus({ code: SPAN_STATUS_ERROR, message: "internal_error" });
        finish();
        controller.error(error2);
      }
    },
    async cancel(reason) {
      finish();
      await reader.cancel(reason);
    }
  });
}
var init_streaming = __esm({
  "node_modules/@sentry/core/build/esm/tracing/workers-ai/streaming.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_spanstatus();
    init_utils2();
    init_utils3();
    __name(accumulateStreamingToolCalls, "accumulateStreamingToolCalls");
    __name(processLine, "processLine");
    __name(instrumentWorkersAiStream, "instrumentWorkersAiStream");
  }
});

// node_modules/@sentry/core/build/esm/tracing/workers-ai/index.js
function isReadableStream(value) {
  return isObjectLike(value) && typeof value.pipeThrough === "function" && typeof value.getReader === "function";
}
function instrumentRun(originalRun, context, options) {
  return /* @__PURE__ */ __name(function instrumentedRun(...args) {
    const [model, inputs, runOptions] = args;
    const operationName = getOperationName(inputs);
    const requestAttributes = extractRequestAttributes(model, inputs, operationName);
    const modelName = typeof model === "string" ? model : "unknown";
    const isStreamRequested = !!inputs && typeof inputs === "object" && inputs.stream === true;
    const returnsRawResponse = !!runOptions && typeof runOptions === "object" && (runOptions.returnRawResponse === true || runOptions.websocket === true);
    const spanConfig = {
      name: `${operationName} ${modelName}`,
      op: `gen_ai.${operationName}`,
      attributes: requestAttributes
    };
    if (isStreamRequested && !returnsRawResponse) {
      return startSpanManual(spanConfig, (span) => {
        const handleError = /* @__PURE__ */ __name((error2) => {
          span.setStatus({ code: SPAN_STATUS_ERROR, message: "internal_error" });
          span.end();
          throw error2;
        }, "handleError");
        let originalResult;
        try {
          originalResult = originalRun.apply(context, args);
        } catch (error2) {
          return handleError(error2);
        }
        if (options.recordInputs) {
          addRequestAttributes(span, inputs, operationName, shouldEnableTruncation(options.enableTruncation));
        }
        return originalResult.then((result) => {
          if (isReadableStream(result)) {
            return instrumentWorkersAiStream(result, span, options.recordOutputs);
          }
          addResponseAttributes(span, result, options.recordOutputs);
          span.end();
          return result;
        }, handleError);
      });
    }
    return startSpan(spanConfig, (span) => {
      const originalResult = originalRun.apply(context, args);
      if (options.recordInputs) {
        addRequestAttributes(span, inputs, operationName, shouldEnableTruncation(options.enableTruncation));
      }
      return originalResult.then((result) => {
        if (!returnsRawResponse) {
          addResponseAttributes(span, result, options.recordOutputs);
        }
        return result;
      });
    });
  }, "instrumentedRun");
}
function instrumentWorkersAiClient(client, options) {
  const resolvedOptions = resolveAIRecordingOptions(options);
  const instrumented2 = new Proxy(client, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);
      if (prop === "run" && typeof value === "function") {
        return instrumentRun(value, target, resolvedOptions);
      }
      return typeof value === "function" ? value.bind(target) : value;
    }
  });
  return instrumented2;
}
var init_workers_ai = __esm({
  "node_modules/@sentry/core/build/esm/tracing/workers-ai/index.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_is();
    init_spanstatus();
    init_trace();
    init_utils2();
    init_streaming();
    init_utils3();
    __name(isReadableStream, "isReadableStream");
    __name(instrumentRun, "instrumentRun");
    __name(instrumentWorkersAiClient, "instrumentWorkersAiClient");
  }
});

// node_modules/@sentry/core/build/esm/tracing/spans/envelope.js
function createStreamedSpanEnvelope(serializedSpans, dsc, client) {
  const options = client.getOptions();
  const dsn = client.getDsn();
  const tunnel = options.tunnel;
  const sdk = getSdkMetadataForEnvelopeHeader(options._metadata);
  const headers = {
    sent_at: new Date(safeDateNow()).toISOString(),
    ...dscHasRequiredProps(dsc) && { trace: dsc },
    ...sdk && { sdk },
    ...!!tunnel && dsn && { dsn: dsnToString(dsn) }
  };
  const inferSetting = client.getDataCollectionOptions().userInfo ? "auto" : "never";
  const spanContainer = [
    { type: "span", item_count: serializedSpans.length, content_type: "application/vnd.sentry.items.span.v2+json" },
    {
      version: 2,
      ...isBrowser() && {
        ingest_settings: { infer_ip: inferSetting, infer_user_agent: inferSetting }
      },
      items: serializedSpans
    }
  ];
  return createEnvelope(headers, [spanContainer]);
}
function dscHasRequiredProps(dsc) {
  return !!dsc.trace_id && !!dsc.public_key;
}
var init_envelope5 = __esm({
  "node_modules/@sentry/core/build/esm/tracing/spans/envelope.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_dsn();
    init_envelope();
    init_isBrowser();
    init_randomSafeContext();
    __name(createStreamedSpanEnvelope, "createStreamedSpanEnvelope");
    __name(dscHasRequiredProps, "dscHasRequiredProps");
  }
});

// node_modules/@sentry/core/build/esm/tracing/spans/estimateSize.js
function estimateSerializedSpanSizeInBytes(span) {
  let weight = 156;
  weight += span.name.length * 2;
  weight += estimateTypedAttributesSizeInBytes(span.attributes);
  if (span.links && span.links.length > 0) {
    const firstLink = span.links[0];
    const attributes = firstLink?.attributes;
    const linkWeight = 100 + (attributes ? estimateTypedAttributesSizeInBytes(attributes) : 0);
    weight += linkWeight * span.links.length;
  }
  return weight;
}
var init_estimateSize = __esm({
  "node_modules/@sentry/core/build/esm/tracing/spans/estimateSize.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_attributes();
    __name(estimateSerializedSpanSizeInBytes, "estimateSerializedSpanSizeInBytes");
  }
});

// node_modules/@sentry/core/build/esm/tracing/spans/spanBuffer.js
var MAX_SPANS_PER_ENVELOPE, MAX_TRACE_WEIGHT_IN_BYTES, SpanBuffer;
var init_spanBuffer = __esm({
  "node_modules/@sentry/core/build/esm/tracing/spans/spanBuffer.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_debug_build();
    init_debug_logger();
    init_timer();
    init_dynamicSamplingContext();
    init_envelope5();
    init_estimateSize();
    MAX_SPANS_PER_ENVELOPE = 1e3;
    MAX_TRACE_WEIGHT_IN_BYTES = 5e6;
    SpanBuffer = class {
      constructor(client, options) {
        this._traceBuckets = /* @__PURE__ */ new Map();
        this._client = client;
        const { maxSpanLimit, flushInterval, maxTraceWeightInBytes } = options ?? {};
        this._maxSpanLimit = maxSpanLimit && maxSpanLimit > 0 && maxSpanLimit <= MAX_SPANS_PER_ENVELOPE ? maxSpanLimit : MAX_SPANS_PER_ENVELOPE;
        this._flushInterval = flushInterval && flushInterval > 0 ? flushInterval : 5e3;
        this._maxTraceWeight = maxTraceWeightInBytes && maxTraceWeightInBytes > 0 ? maxTraceWeightInBytes : MAX_TRACE_WEIGHT_IN_BYTES;
        this._client.on("flush", () => {
          this.drain();
        });
        this._client.on("close", () => {
          this._traceBuckets.forEach((bucket) => {
            clearTimeout(bucket.timeout);
          });
          this._traceBuckets.clear();
        });
      }
      /**
       * Add a span to the buffer.
       */
      add(spanJSON) {
        const traceId = spanJSON.trace_id;
        let bucket = this._traceBuckets.get(traceId);
        if (!bucket) {
          bucket = {
            spans: /* @__PURE__ */ new Set(),
            size: 0,
            timeout: safeUnref(
              setTimeout(() => {
                this.flush(traceId);
              }, this._flushInterval)
            )
          };
          this._traceBuckets.set(traceId, bucket);
        }
        bucket.spans.add(spanJSON);
        bucket.size += estimateSerializedSpanSizeInBytes(spanJSON);
        if (bucket.spans.size >= this._maxSpanLimit || bucket.size >= this._maxTraceWeight) {
          this.flush(traceId);
        }
      }
      /**
       * Drain and flush all buffered traces.
       */
      drain() {
        if (!this._traceBuckets.size) {
          return;
        }
        DEBUG_BUILD && debug.log(`Flushing span tree map with ${this._traceBuckets.size} traces`);
        this._traceBuckets.forEach((_, traceId) => {
          this.flush(traceId);
        });
      }
      /**
       * Flush spans of a specific trace.
       * In contrast to {@link SpanBuffer.drain}, this method does not flush all traces, but only the one with the given traceId.
       */
      flush(traceId) {
        const bucket = this._traceBuckets.get(traceId);
        if (!bucket) {
          return;
        }
        if (!bucket.spans.size) {
          this._removeTrace(traceId);
          return;
        }
        const spans = Array.from(bucket.spans);
        const segmentSpan = spans[0]?._segmentSpan;
        if (!segmentSpan) {
          DEBUG_BUILD && debug.warn("No segment span reference found on span JSON, cannot compute DSC");
          this._removeTrace(traceId);
          return;
        }
        const dsc = getDynamicSamplingContextFromSpan(segmentSpan);
        const cleanedSpans = spans.map((spanJSON) => {
          const { _segmentSpan, ...cleanSpanJSON } = spanJSON;
          return cleanSpanJSON;
        });
        const envelope = createStreamedSpanEnvelope(cleanedSpans, dsc, this._client);
        DEBUG_BUILD && debug.log(`Sending span envelope for trace ${traceId} with ${cleanedSpans.length} spans`);
        this._client.sendEnvelope(envelope).then(null, (reason) => {
          DEBUG_BUILD && debug.error("Error while sending streamed span envelope:", reason);
        });
        this._removeTrace(traceId);
      }
      _removeTrace(traceId) {
        const bucket = this._traceBuckets.get(traceId);
        if (bucket) {
          clearTimeout(bucket.timeout);
        }
        this._traceBuckets.delete(traceId);
      }
    };
    __name(SpanBuffer, "SpanBuffer");
  }
});

// node_modules/@sentry/core/build/esm/integrations/spanStreaming.js
var spanStreamingIntegration;
var init_spanStreaming = __esm({
  "node_modules/@sentry/core/build/esm/integrations/spanStreaming.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_debug_build();
    init_integration();
    init_beforeSendSpan();
    init_captureSpan();
    init_hasSpanStreamingEnabled();
    init_spanBuffer();
    init_debug_logger();
    init_spanUtils();
    spanStreamingIntegration = defineIntegration(() => {
      return {
        name: "SpanStreaming",
        setup(client) {
          const initialMessage = "SpanStreaming integration requires";
          const fallbackMsg = "Falling back to static trace lifecycle.";
          const clientOptions = client.getOptions();
          if (!hasSpanStreamingEnabled(client)) {
            clientOptions.traceLifecycle = "static";
            DEBUG_BUILD && debug.warn(`${initialMessage} \`traceLifecycle\` to be set to "stream"! ${fallbackMsg}`);
            return;
          }
          const beforeSendSpan = clientOptions.beforeSendSpan;
          if (beforeSendSpan && !isStreamedBeforeSendSpanCallback(beforeSendSpan)) {
            clientOptions.traceLifecycle = "static";
            DEBUG_BUILD && debug.warn(`${initialMessage} a beforeSendSpan callback using \`withStreamedSpan\`! ${fallbackMsg}`);
            return;
          }
          const buffer = new SpanBuffer(client);
          client.on("afterSpanEnd", (span) => {
            if (!spanIsSampled(span)) {
              return;
            }
            buffer.add(captureSpan(span, client));
          });
        }
      };
    });
  }
});

// node_modules/@sentry/core/build/esm/utils/breadcrumb-log-level.js
function getBreadcrumbLogLevelFromHttpStatusCode(statusCode) {
  if (statusCode === void 0) {
    return void 0;
  } else if (statusCode >= 400 && statusCode < 500) {
    return "warning";
  } else if (statusCode >= 500) {
    return "error";
  } else {
    return void 0;
  }
}
var init_breadcrumb_log_level = __esm({
  "node_modules/@sentry/core/build/esm/utils/breadcrumb-log-level.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    __name(getBreadcrumbLogLevelFromHttpStatusCode, "getBreadcrumbLogLevelFromHttpStatusCode");
  }
});

// node_modules/@sentry/core/build/esm/utils/supports.js
function _isFetchSupported() {
  if (!("fetch" in WINDOW)) {
    return false;
  }
  try {
    new Headers();
    new Request("data:,");
    new Response();
    return true;
  } catch {
    return false;
  }
}
function isNativeFunction(func) {
  return func && /^function\s+\w+\(\)\s+\{\s+\[native code\]\s+\}$/.test(func.toString());
}
function supportsNativeFetch() {
  if (typeof EdgeRuntime === "string") {
    return true;
  }
  if (!_isFetchSupported()) {
    return false;
  }
  if (isNativeFunction(WINDOW.fetch)) {
    return true;
  }
  let result = false;
  const doc = WINDOW.document;
  if (doc && typeof doc.createElement === "function") {
    try {
      const sandbox = doc.createElement("iframe");
      sandbox.hidden = true;
      doc.head.appendChild(sandbox);
      if (sandbox.contentWindow?.fetch) {
        result = isNativeFunction(sandbox.contentWindow.fetch);
      }
      doc.head.removeChild(sandbox);
    } catch (err) {
      DEBUG_BUILD && debug.warn("Could not create sandbox iframe for pure fetch check, bailing to window.fetch: ", err);
    }
  }
  return result;
}
var WINDOW;
var init_supports = __esm({
  "node_modules/@sentry/core/build/esm/utils/supports.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_debug_build();
    init_debug_logger();
    init_worldwide();
    WINDOW = GLOBAL_OBJ;
    __name(_isFetchSupported, "_isFetchSupported");
    __name(isNativeFunction, "isNativeFunction");
    __name(supportsNativeFetch, "supportsNativeFetch");
  }
});

// node_modules/@sentry/core/build/esm/instrument/fetch.js
function addFetchInstrumentationHandler(handler, skipNativeFetchCheck) {
  const type = "fetch";
  const removeHandler = addHandler(type, handler);
  maybeInstrument(type, () => instrumentFetch(void 0, skipNativeFetchCheck));
  return removeHandler;
}
function instrumentFetch(onFetchResolved, skipNativeFetchCheck = false) {
  if (skipNativeFetchCheck && !supportsNativeFetch()) {
    return;
  }
  fill(GLOBAL_OBJ, "fetch", function(originalFetch) {
    return function(...args) {
      const virtualError = new Error();
      const { method, url } = parseFetchArgs(args);
      const handlerData = {
        args,
        fetchData: {
          method,
          url
        },
        startTimestamp: timestampInSeconds() * 1e3,
        // // Adding the error to be able to fingerprint the failed fetch event in HttpClient instrumentation
        virtualError,
        headers: getHeadersFromFetchArgs(args)
      };
      if (!onFetchResolved) {
        triggerHandlers("fetch", {
          ...handlerData
        });
      }
      return originalFetch.apply(GLOBAL_OBJ, args).then(
        async (response) => {
          if (onFetchResolved) {
            onFetchResolved(response);
          } else {
            triggerHandlers("fetch", {
              ...handlerData,
              endTimestamp: timestampInSeconds() * 1e3,
              response
            });
          }
          return response;
        },
        (error2) => {
          triggerHandlers("fetch", {
            ...handlerData,
            endTimestamp: timestampInSeconds() * 1e3,
            error: error2
          });
          if (isError(error2) && error2.stack === void 0) {
            error2.stack = virtualError.stack;
            addNonEnumerableProperty(error2, "framesToPop", 1);
          }
          const client = getClient();
          const enhanceOption = client?.getOptions().enhanceFetchErrorMessages ?? "always";
          const shouldEnhance = enhanceOption !== false;
          if (shouldEnhance && error2 instanceof TypeError && (error2.message === "Failed to fetch" || error2.message === "Load failed" || error2.message === "NetworkError when attempting to fetch resource.")) {
            try {
              const url2 = new URL(handlerData.fetchData.url);
              const hostname = url2.host;
              if (enhanceOption === "always") {
                error2.message = `${error2.message} (${hostname})`;
              } else {
                addNonEnumerableProperty(error2, "__sentry_fetch_url_host__", hostname);
              }
            } catch {
            }
          }
          throw error2;
        }
      );
    };
  });
}
function hasProp(obj, prop) {
  return isObjectLike(obj) && !!obj[prop];
}
function getUrlFromResource(resource) {
  if (typeof resource === "string") {
    return resource;
  }
  if (!resource) {
    return "";
  }
  if (hasProp(resource, "url")) {
    return resource.url;
  }
  if (resource.toString) {
    return resource.toString();
  }
  return "";
}
function parseFetchArgs(fetchArgs) {
  if (fetchArgs.length === 0) {
    return { method: "GET", url: "" };
  }
  if (fetchArgs.length === 2) {
    const [resource, options] = fetchArgs;
    return {
      url: getUrlFromResource(resource),
      method: hasProp(options, "method") ? String(options.method).toUpperCase() : (
        // Request object as first argument
        isRequest(resource) && hasProp(resource, "method") ? String(resource.method).toUpperCase() : "GET"
      )
    };
  }
  const arg = fetchArgs[0];
  return {
    url: getUrlFromResource(arg),
    method: hasProp(arg, "method") ? String(arg.method).toUpperCase() : "GET"
  };
}
function getHeadersFromFetchArgs(fetchArgs) {
  const [requestArgument, optionsArgument] = fetchArgs;
  try {
    if (typeof optionsArgument === "object" && optionsArgument !== null && "headers" in optionsArgument && optionsArgument.headers) {
      return new Headers(optionsArgument.headers);
    }
    if (isRequest(requestArgument)) {
      return new Headers(requestArgument.headers);
    }
  } catch {
  }
  return;
}
var init_fetch2 = __esm({
  "node_modules/@sentry/core/build/esm/instrument/fetch.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_currentScopes();
    init_is();
    init_object();
    init_supports();
    init_time();
    init_worldwide();
    init_handlers();
    __name(addFetchInstrumentationHandler, "addFetchInstrumentationHandler");
    __name(instrumentFetch, "instrumentFetch");
    __name(hasProp, "hasProp");
    __name(getUrlFromResource, "getUrlFromResource");
    __name(parseFetchArgs, "parseFetchArgs");
    __name(getHeadersFromFetchArgs, "getHeadersFromFetchArgs");
  }
});

// node_modules/@sentry/core/build/esm/utils/lru.js
var LRUMap;
var init_lru = __esm({
  "node_modules/@sentry/core/build/esm/utils/lru.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    LRUMap = class {
      constructor(_maxSize) {
        this._maxSize = _maxSize;
        this._cache = /* @__PURE__ */ new Map();
      }
      /** Get the current size of the cache */
      get size() {
        return this._cache.size;
      }
      /** Get an entry or undefined if it was not in the cache. Re-inserts to update the recently used order */
      get(key) {
        const value = this._cache.get(key);
        if (value === void 0) {
          return void 0;
        }
        this._cache.delete(key);
        this._cache.set(key, value);
        return value;
      }
      /** Insert an entry and evict an older entry if we've reached maxSize */
      set(key, value) {
        if (this._cache.size >= this._maxSize) {
          const nextKey = this._cache.keys().next().value;
          this._cache.delete(nextKey);
        }
        this._cache.set(key, value);
      }
      /** Remove an entry and return the entry if it was in the cache */
      remove(key) {
        const value = this._cache.get(key);
        if (value) {
          this._cache.delete(key);
        }
        return value;
      }
      /** Clear all entries */
      clear() {
        this._cache.clear();
      }
      /** Get all the keys */
      keys() {
        return Array.from(this._cache.keys());
      }
      /** Get all the values */
      values() {
        const values = [];
        this._cache.forEach((value) => values.push(value));
        return values;
      }
    };
    __name(LRUMap, "LRUMap");
  }
});

// node_modules/@sentry/core/build/esm/transports/userAgent.js
function addUserAgentToTransportHeaders(options) {
  const sdkMetadata = options._metadata?.sdk;
  const sdkUserAgent = sdkMetadata?.name && sdkMetadata?.version ? `${sdkMetadata?.name}/${sdkMetadata?.version}` : void 0;
  options.transportOptions = {
    ...options.transportOptions,
    headers: {
      ...sdkUserAgent && { "user-agent": sdkUserAgent },
      ...options.transportOptions?.headers
    }
  };
}
var init_userAgent = __esm({
  "node_modules/@sentry/core/build/esm/transports/userAgent.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    __name(addUserAgentToTransportHeaders, "addUserAgentToTransportHeaders");
  }
});

// node_modules/@sentry/core/build/esm/server-runtime-client.js
function setCurrentRequestSessionErroredOrCrashed(eventHint) {
  const requestSession = getIsolationScope().getScopeData().sdkProcessingMetadata.requestSession;
  if (requestSession) {
    const isHandledException = eventHint?.mechanism?.handled ?? true;
    if (isHandledException && requestSession.status !== "crashed") {
      requestSession.status = "errored";
    } else if (!isHandledException) {
      requestSession.status = "crashed";
    }
  }
}
var ServerRuntimeClient;
var init_server_runtime_client = __esm({
  "node_modules/@sentry/core/build/esm/server-runtime-client.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_checkin();
    init_client();
    init_currentScopes();
    init_debug_build();
    init_spanStreaming();
    init_base();
    init_userAgent();
    init_debug_logger();
    init_eventbuilder();
    init_misc();
    init_promisebuffer();
    init_syncpromise();
    init_trace_info();
    ServerRuntimeClient = class extends Client {
      /**
       * Creates a new Edge SDK instance.
       * @param options Configuration options for this SDK.
       */
      constructor(options) {
        addUserAgentToTransportHeaders(options);
        if (options.traceLifecycle === "stream" && !options.integrations.some((i) => i.name === "SpanStreaming")) {
          options.integrations.push(spanStreamingIntegration());
        }
        super(options);
        this._disposeCallbacks = [];
        this._setUpMetricsProcessing();
      }
      /**
       * @inheritDoc
       */
      eventFromException(exception, hint) {
        const event = eventFromUnknownInput(this, this._options.stackParser, exception, hint);
        event.level = "error";
        return resolvedSyncPromise(event);
      }
      /**
       * @inheritDoc
       */
      eventFromMessage(message, level = "info", hint) {
        return resolvedSyncPromise(
          eventFromMessage(this._options.stackParser, message, level, hint, this._options.attachStacktrace)
        );
      }
      /**
       * @inheritDoc
       */
      captureException(exception, hint, scope) {
        setCurrentRequestSessionErroredOrCrashed(hint);
        return super.captureException(exception, hint, scope);
      }
      /**
       * @inheritDoc
       */
      captureEvent(event, hint, scope) {
        const isException = !event.type && event.exception?.values && event.exception.values.length > 0;
        if (isException) {
          setCurrentRequestSessionErroredOrCrashed(hint);
        }
        return super.captureEvent(event, hint, scope);
      }
      /**
       * Create a cron monitor check in and send it to Sentry.
       *
       * @param checkIn An object that describes a check in.
       * @param upsertMonitorConfig An optional object that describes a monitor config. Use this if you want
       * to create a monitor automatically when sending a check in.
       */
      captureCheckIn(checkIn, monitorConfig, scope) {
        const id = "checkInId" in checkIn && checkIn.checkInId ? checkIn.checkInId : uuid4();
        if (!this._isEnabled()) {
          DEBUG_BUILD && debug.warn("SDK not enabled, will not capture check-in.");
          return id;
        }
        const options = this.getOptions();
        const { release, environment, tunnel } = options;
        const serializedCheckIn = {
          check_in_id: id,
          monitor_slug: checkIn.monitorSlug,
          status: checkIn.status,
          release,
          environment
        };
        if ("duration" in checkIn) {
          serializedCheckIn.duration = checkIn.duration;
        }
        if (monitorConfig) {
          serializedCheckIn.monitor_config = {
            schedule: monitorConfig.schedule,
            checkin_margin: monitorConfig.checkinMargin,
            max_runtime: monitorConfig.maxRuntime,
            timezone: monitorConfig.timezone,
            failure_issue_threshold: monitorConfig.failureIssueThreshold,
            recovery_threshold: monitorConfig.recoveryThreshold
          };
        }
        const [dynamicSamplingContext, traceContext] = _getTraceInfoFromScope(this, scope);
        if (traceContext) {
          serializedCheckIn.contexts = {
            trace: traceContext
          };
        }
        const envelope = createCheckInEnvelope(
          serializedCheckIn,
          dynamicSamplingContext,
          this.getSdkMetadata(),
          tunnel,
          this.getDsn()
        );
        DEBUG_BUILD && debug.log("Sending checkin:", checkIn.monitorSlug, checkIn.status);
        this.sendEnvelope(envelope);
        return id;
      }
      /**
       * @inheritDoc
       */
      registerCleanup(callback) {
        this._disposeCallbacks.push(callback);
      }
      /**
       * Disposes of the client and releases all resources.
       *
       * This method clears all internal state to allow the client to be garbage collected.
       * It clears hooks, event processors, integrations, transport, and other internal references.
       *
       * Call this method after flushing to allow the client to be garbage collected.
       * After calling dispose(), the client should not be used anymore.
       *
       * Subclasses should override this method to clean up their own resources and call `super.dispose()`.
       */
      dispose() {
        DEBUG_BUILD && debug.log("Disposing client...");
        for (const callback of this._disposeCallbacks) {
          try {
            callback();
          } catch {
          }
        }
        this._disposeCallbacks.length = 0;
        for (const hookName of Object.keys(this._hooks)) {
          this._hooks[hookName]?.clear();
        }
        this._hooks = {};
        this._eventProcessors.length = 0;
        this._integrations = {};
        this._outcomes = {};
        this._transport = void 0;
        this._promiseBuffer = makePromiseBuffer(DEFAULT_TRANSPORT_BUFFER_SIZE);
      }
      /**
       * @inheritDoc
       */
      _prepareEvent(event, hint, currentScope, isolationScope) {
        if (this._options.platform) {
          event.platform = event.platform || this._options.platform;
        }
        if (this._options.runtime) {
          event.contexts = {
            ...event.contexts,
            runtime: event.contexts?.runtime || this._options.runtime
          };
        }
        if (this._options.serverName) {
          event.server_name = event.server_name || this._options.serverName;
        }
        return super._prepareEvent(event, hint, currentScope, isolationScope);
      }
      /**
       * Process a server-side metric before it is captured.
       */
      _setUpMetricsProcessing() {
        this.on("processMetric", (metric) => {
          if (this._options.serverName) {
            metric.attributes = {
              "server.address": this._options.serverName,
              ...metric.attributes
            };
          }
        });
      }
    };
    __name(ServerRuntimeClient, "ServerRuntimeClient");
    __name(setCurrentRequestSessionErroredOrCrashed, "setCurrentRequestSessionErroredOrCrashed");
  }
});

// node_modules/@sentry/core/build/esm/utils/node-stack-trace.js
function filenameIsInApp(filename, isNative = false) {
  const isInternal = isNative || filename && // It's not internal if it's an absolute linux path
  !filename.startsWith("/") && // It's not internal if it's an absolute windows path
  !filename.match(/^[A-Z]:/) && // It's not internal if the path is starting with a dot
  !filename.startsWith(".") && // It's not internal if the frame has a protocol. In node, this is usually the case if the file got pre-processed with a bundler like webpack
  !filename.match(/^[a-zA-Z]([a-zA-Z0-9.\-+])*:\/\//);
  return !isInternal && filename !== void 0 && !filename.includes("node_modules/");
}
function node(getModule2) {
  const FILENAME_MATCH = /^\s*[-]{4,}$/;
  const FULL_MATCH = /at (?:async )?(?:(.+?)\s+\()?(?:(.+):(\d+):(\d+)?|([^)]+))\)?/;
  const DATA_URI_MATCH = /at (?:async )?(.+?) \(data:(.*?),/;
  return (line) => {
    const dataUriMatch = line.match(DATA_URI_MATCH);
    if (dataUriMatch) {
      return {
        filename: `<data:${dataUriMatch[2]}>`,
        function: dataUriMatch[1]
      };
    }
    const lineMatch = line.match(FULL_MATCH);
    if (lineMatch) {
      let object;
      let method;
      let functionName;
      let typeName;
      let methodName;
      if (lineMatch[1]) {
        functionName = lineMatch[1];
        let methodStart = functionName.lastIndexOf(".");
        if (functionName[methodStart - 1] === ".") {
          methodStart--;
        }
        if (methodStart > 0) {
          object = functionName.slice(0, methodStart);
          method = functionName.slice(methodStart + 1);
          const objectEnd = object.indexOf(".Module");
          if (objectEnd > 0) {
            functionName = functionName.slice(objectEnd + 1);
            object = object.slice(0, objectEnd);
          }
        }
        typeName = void 0;
      }
      if (method) {
        typeName = object;
        methodName = method;
      }
      if (method === "<anonymous>") {
        methodName = void 0;
        functionName = void 0;
      }
      if (functionName === void 0) {
        methodName = methodName || UNKNOWN_FUNCTION;
        functionName = typeName ? `${typeName}.${methodName}` : methodName;
      }
      let filename = normalizeStackTracePath(lineMatch[2]);
      const isNative = lineMatch[5] === "native";
      if (!filename && lineMatch[5] && !isNative) {
        filename = lineMatch[5];
      }
      const maybeDecodedFilename = filename ? _safeDecodeURI(filename) : void 0;
      return {
        filename: maybeDecodedFilename ?? filename,
        module: maybeDecodedFilename && getModule2?.(maybeDecodedFilename),
        function: functionName,
        lineno: _parseIntOrUndefined(lineMatch[3]),
        colno: _parseIntOrUndefined(lineMatch[4]),
        in_app: filenameIsInApp(filename || "", isNative)
      };
    }
    if (line.match(FILENAME_MATCH)) {
      return {
        filename: line
      };
    }
    return void 0;
  };
}
function nodeStackLineParser(getModule2) {
  return [90, node(getModule2)];
}
function _parseIntOrUndefined(input) {
  return parseInt(input || "", 10) || void 0;
}
function _safeDecodeURI(filename) {
  try {
    return decodeURI(filename);
  } catch {
    return void 0;
  }
}
var init_node_stack_trace = __esm({
  "node_modules/@sentry/core/build/esm/utils/node-stack-trace.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_stacktrace();
    __name(filenameIsInApp, "filenameIsInApp");
    __name(node, "node");
    __name(nodeStackLineParser, "nodeStackLineParser");
    __name(_parseIntOrUndefined, "_parseIntOrUndefined");
    __name(_safeDecodeURI, "_safeDecodeURI");
  }
});

// node_modules/@sentry/core/build/esm/integrations/postgresjs.js
function _sanitizeSqlQuery(sqlQuery) {
  if (!sqlQuery) {
    return "Unknown SQL Query";
  }
  if (!integerLiteralRE) {
    integerLiteralRE = new RegExp("(?<!\\$)-?\\b\\d+\\b", "g");
  }
  return sqlQuery.replace(/--.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "").replace(/;\s*$/, "").replace(/\s+/g, " ").trim().replace(/\bX'[0-9A-Fa-f]*'/gi, "?").replace(/\bB'[01]*'/gi, "?").replace(/'(?:[^']|'')*'/g, "?").replace(/\b0x[0-9A-Fa-f]+/gi, "?").replace(/\b(?:TRUE|FALSE)\b/gi, "?").replace(/-?\b\d+\.?\d*[eE][+-]?\d+\b/g, "?").replace(/-?\b\d+\.\d+\b/g, "?").replace(/-?\.\d+\b/g, "?").replace(integerLiteralRE, "?").replace(/\bIN\b\s*\(\s*\?(?:\s*,\s*\?)*\s*\)/gi, "IN (?)").replace(/\bIN\b\s*\(\s*\$\d+(?:\s*,\s*\$\d+)*\s*\)/gi, "IN ($?)");
}
var integerLiteralRE;
var init_postgresjs = __esm({
  "node_modules/@sentry/core/build/esm/integrations/postgresjs.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    __name(_sanitizeSqlQuery, "_sanitizeSqlQuery");
  }
});

// node_modules/@sentry/core/build/esm/utils/sql.js
function getSqlQuerySummary(query) {
  if (!query) {
    return void 0;
  }
  const pragmaMatch = PRAGMA_RE.exec(query);
  if (pragmaMatch?.groups?.["operation"] && pragmaMatch.groups["command"]) {
    const operation = pragmaMatch.groups["operation"];
    const command = pragmaMatch.groups["command"];
    const parenIdx = command.indexOf("(");
    return truncate2(`${operation} ${parenIdx >= 0 ? command.substring(0, parenIdx) : command}`);
  }
  const ddlMatch = DDL_RE.exec(query);
  if (ddlMatch?.groups?.["operation"] && ddlMatch.groups["table"]) {
    return truncate2(`${ddlMatch.groups["operation"]} ${ddlMatch.groups["table"]}`);
  }
  const insertMatch = INSERT_RE.exec(query);
  if (insertMatch?.groups?.["operation"] && insertMatch.groups["table"]) {
    const parts = [insertMatch.groups["operation"], insertMatch.groups["table"]];
    const rest = query.slice(insertMatch[0].length);
    const subSelect = /\b(SELECT)\b/i.exec(rest);
    if (subSelect?.[1]) {
      parts.push(subSelect[1]);
      const selectTables = extractTableNames(rest.slice(subSelect.index));
      parts.push(...selectTables);
    }
    return truncate2(parts.join(" "));
  }
  const updateMatch = UPDATE_RE.exec(query);
  if (updateMatch?.groups?.["operation"] && updateMatch.groups["table"]) {
    return truncate2(`${updateMatch.groups["operation"]} ${updateMatch.groups["table"]}`);
  }
  const deleteMatch = DELETE_RE.exec(query);
  if (deleteMatch?.groups?.["operation"] && deleteMatch.groups["table"]) {
    return truncate2(`${deleteMatch.groups["operation"]} ${deleteMatch.groups["table"]}`);
  }
  const selectMatch = SELECT_RE.exec(query);
  if (selectMatch?.groups?.["operation"]) {
    const tables = extractTableNames(query.slice(selectMatch[0].length));
    if (tables.length > 0) {
      return truncate2(`${selectMatch.groups["operation"]} ${tables.join(" ")}`);
    }
    return selectMatch.groups["operation"];
  }
  return truncate2(query.trim().split(/\s+/)[0] ?? query);
}
function extractTableNames(sql) {
  const tables = [];
  TOKEN_RE.lastIndex = 0;
  let match;
  while ((match = TOKEN_RE.exec(sql)) !== null) {
    if (match[1] || match[2]) {
      tables.push(match[1] || match[2]);
      continue;
    }
    const rest = sql.slice(match.index + match[0].length);
    const subqueryMatch = SUBQUERY_SELECT_RE.exec(rest);
    if (subqueryMatch?.[1]) {
      tables.push(subqueryMatch[1]);
      TOKEN_RE.lastIndex = match.index + match[0].length + subqueryMatch[0].length;
      continue;
    }
    const tableMatch = QUOTED_OR_PLAIN_TABLE_RE.exec(rest);
    if (!tableMatch)
      continue;
    tables.push(tableMatch[0]);
    let afterTable = rest.slice(tableMatch[0].length);
    let commaMatch;
    while ((commaMatch = COMMA_TABLE_RE.exec(afterTable)) !== null) {
      if (!commaMatch[1])
        break;
      tables.push(commaMatch[1]);
      afterTable = afterTable.slice(commaMatch[0].length);
    }
  }
  return tables;
}
function truncate2(summary) {
  if (summary.length <= MAX_SUMMARY_LENGTH) {
    return summary;
  }
  const truncated = summary.substring(0, MAX_SUMMARY_LENGTH);
  const lastSpace = truncated.lastIndexOf(" ");
  return lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated;
}
var MAX_SUMMARY_LENGTH, TABLE_NAME_CHARS, TABLE_NAME, DDL_RE, INSERT_RE, UPDATE_RE, DELETE_RE, SELECT_RE, PRAGMA_RE, TOKEN_RE, QUOTED_OR_PLAIN_TABLE_RE, COMMA_TABLE_RE, SUBQUERY_SELECT_RE;
var init_sql = __esm({
  "node_modules/@sentry/core/build/esm/utils/sql.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    MAX_SUMMARY_LENGTH = 255;
    TABLE_NAME_CHARS = /[^\s(,;)]+/;
    TABLE_NAME = TABLE_NAME_CHARS.source;
    DDL_RE = new RegExp(
      `^\\s*(?<operation>(?:CREATE|DROP)\\s+(?:TABLE|INDEX)|ALTER\\s+TABLE)(?:\\s+IF\\s+(?:NOT\\s+)?EXISTS)?\\s+(?<table>${TABLE_NAME})`,
      "i"
    );
    INSERT_RE = new RegExp(`^\\s*(?<operation>INSERT)\\s+INTO\\s+(?<table>${TABLE_NAME})`, "i");
    UPDATE_RE = new RegExp(`^\\s*(?<operation>UPDATE)\\s+(?<table>${TABLE_NAME})`, "i");
    DELETE_RE = new RegExp(`^\\s*(?<operation>DELETE)\\s+FROM\\s+(?<table>${TABLE_NAME})`, "i");
    SELECT_RE = /^\s*\(?\s*(?<operation>SELECT)\b/i;
    PRAGMA_RE = /^\s*(?<operation>PRAGMA)\s+(?<command>\S+)/i;
    TOKEN_RE = /\b(?:FROM|JOIN)\s+|\(\s*(SELECT)\b|\b(?:UNION|INTERSECT|EXCEPT|MINUS)\s+(?:ALL\s+)?(SELECT)\b/gi;
    QUOTED_OR_PLAIN_TABLE_RE = /^(?:"[^"]*"|'[^']*'|[^\s(,;)]+)/;
    COMMA_TABLE_RE = /^\s*,\s*((?:"[^"]*"|'[^']*'|[^\s(,;)]+))/;
    SUBQUERY_SELECT_RE = /^\(\s*(SELECT)\b/i;
    __name(getSqlQuerySummary, "getSqlQuerySummary");
    __name(extractTableNames, "extractTableNames");
    __name(truncate2, "truncate");
  }
});

// node_modules/@sentry/core/build/esm/index.js
var init_esm = __esm({
  "node_modules/@sentry/core/build/esm/index.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_spanstatus();
    init_trace();
    init_semanticAttributes();
    init_exports();
    init_currentScopes();
    init_defaultScopes();
    init_asyncContext();
    init_tracing_channel_binding();
    init_sdk();
    init_base();
    init_integration();
    init_envToBool();
    init_isSentryRequestUrl();
    init_spanUtils();
    init_sdkMetadata();
    init_traceData();
    init_request();
    init_breadcrumbs();
    init_functiontostring();
    init_eventFilters();
    init_linkederrors();
    init_requestdata();
    init_dedupe();
    init_console2();
    init_conversationId();
    init_fetch();
    init_workers_ai();
    init_breadcrumb_log_level();
    init_fetch2();
    init_is();
    init_debug_logger();
    init_path();
    init_promisebuffer();
    init_stacktrace();
    init_string();
    init_url();
    init_lru();
    init_server_runtime_client();
    init_node_stack_trace();
    init_postgresjs();
    init_sql();
  }
});

// node_modules/@sentry/cloudflare/build/esm/async.js
import { AsyncLocalStorage } from "node:async_hooks";
function setAsyncLocalStorageAsyncContextStrategy() {
  const asyncStorage = new AsyncLocalStorage();
  function getScopes() {
    const scopes = asyncStorage.getStore();
    if (scopes) {
      return scopes;
    }
    return {
      scope: getDefaultCurrentScope(),
      isolationScope: getDefaultIsolationScope()
    };
  }
  __name(getScopes, "getScopes");
  function withScope3(callback) {
    const scope = getScopes().scope.clone();
    const isolationScope = getScopes().isolationScope;
    return asyncStorage.run({ scope, isolationScope }, () => {
      return callback(scope);
    });
  }
  __name(withScope3, "withScope");
  function withSetScope2(scope, callback) {
    const isolationScope = getScopes().isolationScope.clone();
    return asyncStorage.run({ scope, isolationScope }, () => {
      return callback(scope);
    });
  }
  __name(withSetScope2, "withSetScope");
  function withIsolationScope3(callback) {
    const scope = getScopes().scope;
    const isolationScope = getScopes().isolationScope.clone();
    return asyncStorage.run({ scope, isolationScope }, () => {
      return callback(isolationScope);
    });
  }
  __name(withIsolationScope3, "withIsolationScope");
  function withSetIsolationScope(isolationScope, callback) {
    const scope = getScopes().scope;
    return asyncStorage.run({ scope, isolationScope }, () => {
      return callback(isolationScope);
    });
  }
  __name(withSetIsolationScope, "withSetIsolationScope");
  function suppressTracing2(callback) {
    return withScope3((scope) => {
      scope.setSDKProcessingMetadata({ __SENTRY_SUPPRESS_TRACING__: true });
      return callback();
    });
  }
  __name(suppressTracing2, "suppressTracing");
  setAsyncContextStrategy({
    suppressTracing: suppressTracing2,
    withScope: withScope3,
    withSetScope: withSetScope2,
    withIsolationScope: withIsolationScope3,
    withSetIsolationScope,
    getCurrentScope: () => getScopes().scope,
    getIsolationScope: () => getScopes().isolationScope,
    getTracingChannelBinding: () => _INTERNAL_createTracingChannelBinding(asyncStorage, getScopes)
  });
}
var init_async = __esm({
  "node_modules/@sentry/cloudflare/build/esm/async.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_esm();
    __name(setAsyncLocalStorageAsyncContextStrategy, "setAsyncLocalStorageAsyncContextStrategy");
  }
});

// node_modules/@sentry/cloudflare/build/esm/instrument.js
function getInstrumentedMap() {
  const globalObj = globalThis;
  if (!globalObj[GLOBAL_KEY]) {
    globalObj[GLOBAL_KEY] = /* @__PURE__ */ new WeakMap();
  }
  return globalObj[GLOBAL_KEY];
}
function isWeakMapKey(value) {
  return isObjectLike(value) || typeof value === "function";
}
function markAsInstrumented(original, instrumented2) {
  try {
    if (isWeakMapKey(original)) {
      getInstrumentedMap().set(original, instrumented2 ?? original);
    }
    if (isWeakMapKey(instrumented2) && instrumented2 !== original) {
      getInstrumentedMap().set(instrumented2, instrumented2);
    }
  } catch {
  }
}
function getInstrumented(obj) {
  try {
    if (isWeakMapKey(obj)) {
      return getInstrumentedMap().get(obj);
    }
    return void 0;
  } catch {
    return void 0;
  }
}
function ensureInstrumented(original, instrumentFn, noMark) {
  const existing = getInstrumented(original);
  if (existing) {
    return existing;
  }
  const instrumented2 = instrumentFn(original);
  if (!noMark) {
    markAsInstrumented(original, instrumented2);
  }
  return instrumented2;
}
var GLOBAL_KEY;
var init_instrument = __esm({
  "node_modules/@sentry/cloudflare/build/esm/instrument.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_esm();
    GLOBAL_KEY = "__SENTRY_INSTRUMENTED_MAP__";
    __name(getInstrumentedMap, "getInstrumentedMap");
    __name(isWeakMapKey, "isWeakMapKey");
    __name(markAsInstrumented, "markAsInstrumented");
    __name(getInstrumented, "getInstrumented");
    __name(ensureInstrumented, "ensureInstrumented");
  }
});

// node_modules/@sentry/cloudflare/build/esm/debug-build.js
var DEBUG_BUILD2;
var init_debug_build2 = __esm({
  "node_modules/@sentry/cloudflare/build/esm/debug-build.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    DEBUG_BUILD2 = typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__;
  }
});

// node_modules/@sentry/cloudflare/build/esm/flush.js
function getOriginalWaitUntil(context) {
  const currentWaitUntil = context.waitUntil;
  const original = flushLockRegistries.get(currentWaitUntil)?.originalWaitUntil;
  return original ?? currentWaitUntil;
}
function makeFlushLock(context) {
  const registry = getOrCreateFlushLockRegistry(context);
  let resolveAllDone = /* @__PURE__ */ __name(() => void 0, "resolveAllDone");
  const allDone = new Promise((res) => {
    resolveAllDone = res;
  });
  let pending = 0;
  const lock = {
    ready: allDone,
    acquire: () => {
      pending++;
    },
    release: () => {
      if (--pending === 0) {
        registry.locks.delete(lock);
        resolveAllDone();
      }
    },
    finalize: () => {
      if (pending === 0) {
        registry.locks.delete(lock);
        resolveAllDone();
      }
      return allDone;
    }
  };
  registry.locks.add(lock);
  return Object.freeze(lock);
}
function getOrCreateFlushLockRegistry(context) {
  const waitUntil = context.waitUntil;
  const existingRegistry = flushLockRegistries.get(waitUntil);
  if (existingRegistry) {
    return existingRegistry;
  }
  const originalWaitUntil = context.waitUntil.bind(context);
  const registry = { locks: /* @__PURE__ */ new Set(), originalWaitUntil };
  const instrumentedWaitUntil = /* @__PURE__ */ __name((promise) => {
    const locks = [...registry.locks];
    for (const lock of locks) {
      lock.acquire();
    }
    return originalWaitUntil(
      promise.finally(() => {
        for (const lock of locks) {
          lock.release();
        }
      })
    );
  }, "instrumentedWaitUntil");
  flushLockRegistries.set(instrumentedWaitUntil, registry);
  context.waitUntil = instrumentedWaitUntil;
  return registry;
}
async function flushAndDispose(client, timeout = 2e3) {
  try {
    if (!client) {
      await flush(timeout);
      return;
    }
    await client.flush(timeout);
  } catch (e) {
    DEBUG_BUILD2 && debug.warn("Failed to flush client", e);
  } finally {
    try {
      client?.dispose();
    } catch (e) {
      DEBUG_BUILD2 && debug.warn("Failed to dispose client", e);
    }
  }
}
var flushLockRegistries;
var init_flush = __esm({
  "node_modules/@sentry/cloudflare/build/esm/flush.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_esm();
    init_debug_build2();
    flushLockRegistries = /* @__PURE__ */ new WeakMap();
    __name(getOriginalWaitUntil, "getOriginalWaitUntil");
    __name(makeFlushLock, "makeFlushLock");
    __name(getOrCreateFlushLockRegistry, "getOrCreateFlushLockRegistry");
    __name(flushAndDispose, "flushAndDispose");
  }
});

// node_modules/@sentry/cloudflare/build/esm/options.js
function isVersionMetadata(value) {
  return isObjectLike(value) && "id" in value && typeof value.id === "string";
}
function getEnvVar(env, varName) {
  return isObjectLike(env) && varName in env && typeof env[varName] === "string" ? env[varName] : void 0;
}
function getFinalOptions(userOptions = {}, env) {
  if (typeof env !== "object" || env === null) {
    return userOptions;
  }
  const release = "SENTRY_RELEASE" in env && typeof env.SENTRY_RELEASE === "string" ? env.SENTRY_RELEASE : "CF_VERSION_METADATA" in env && isVersionMetadata(env.CF_VERSION_METADATA) ? env.CF_VERSION_METADATA.id : void 0;
  const tracesSampleRate = userOptions.tracesSampleRate ?? parseFloat(getEnvVar(env, "SENTRY_TRACES_SAMPLE_RATE") ?? "");
  return {
    release,
    ...userOptions,
    dsn: userOptions.dsn ?? getEnvVar(env, "SENTRY_DSN"),
    environment: userOptions.environment ?? getEnvVar(env, "SENTRY_ENVIRONMENT"),
    tracesSampleRate: isFinite(tracesSampleRate) ? tracesSampleRate : void 0,
    debug: userOptions.debug ?? envToBool(getEnvVar(env, "SENTRY_DEBUG")),
    tunnel: userOptions.tunnel ?? getEnvVar(env, "SENTRY_TUNNEL")
  };
}
var init_options = __esm({
  "node_modules/@sentry/cloudflare/build/esm/options.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_esm();
    __name(isVersionMetadata, "isVersionMetadata");
    __name(getEnvVar, "getEnvVar");
    __name(getFinalOptions, "getFinalOptions");
  }
});

// node_modules/@sentry/cloudflare/build/esm/scope-utils.js
function addCloudResourceContext(scope) {
  scope.setContext("cloud_resource", {
    "cloud.provider": "cloudflare"
  });
}
function addCultureContext(scope, cf) {
  scope.setContext("culture", {
    timezone: cf.timezone
  });
}
function addRequest(scope, request) {
  scope.setSDKProcessingMetadata({ normalizedRequest: winterCGRequestToRequestData(request) });
}
var init_scope_utils = __esm({
  "node_modules/@sentry/cloudflare/build/esm/scope-utils.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_esm();
    __name(addCloudResourceContext, "addCloudResourceContext");
    __name(addCultureContext, "addCultureContext");
    __name(addRequest, "addRequest");
  }
});

// node_modules/@sentry/cloudflare/build/esm/client.js
var CloudflareClient;
var init_client2 = __esm({
  "node_modules/@sentry/cloudflare/build/esm/client.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_esm();
    init_debug_build2();
    CloudflareClient = class extends ServerRuntimeClient {
      /**
       * Creates a new Cloudflare SDK instance.
       * @param options Configuration options for this SDK.
       */
      constructor(options) {
        applySdkMetadata(options, "cloudflare");
        options._metadata = options._metadata || {};
        const { flushLock, ...serverOptions } = options;
        const clientOptions = {
          ...serverOptions,
          platform: "javascript",
          // TODO: Grab version information
          runtime: { name: "cloudflare" },
          // TODO: Add server name
          _flushInterval: 0
        };
        super(clientOptions);
        this._pendingSpans = /* @__PURE__ */ new Set();
        this._spanCompletionPromise = null;
        this._resolveSpanCompletion = null;
        this._unsubscribeSpanStart = null;
        this._unsubscribeSpanEnd = null;
        this._flushLock = flushLock;
        this._unsubscribeSpanStart = this.on("spanStart", (span) => {
          const spanId = span.spanContext().spanId;
          DEBUG_BUILD2 && debug.log("[CloudflareClient] Span started:", spanId);
          if (!spanIsSampled(span)) {
            return;
          }
          this._pendingSpans.add(spanId);
          if (!this._spanCompletionPromise) {
            this._spanCompletionPromise = new Promise((resolve2) => {
              this._resolveSpanCompletion = resolve2;
            });
          }
        });
        this._unsubscribeSpanEnd = this.on("spanEnd", (span) => {
          const spanId = span.spanContext().spanId;
          DEBUG_BUILD2 && debug.log("[CloudflareClient] Span ended:", spanId);
          this._pendingSpans.delete(spanId);
          if (this._pendingSpans.size === 0 && this._resolveSpanCompletion) {
            DEBUG_BUILD2 && debug.log("[CloudflareClient] All spans completed, resolving promise");
            this._resolveSpanCompletion();
            this._resetSpanCompletionPromise();
          }
        });
      }
      /**
       * Flushes pending operations and ensures all data is processed.
       * If a timeout is provided, the operation will be completed within the specified time limit.
       *
       * It will wait for all pending spans to complete before flushing.
       *
       * @param {number} [timeout] - Optional timeout in milliseconds to force the completion of the flush operation.
       * @return {Promise<boolean>} A promise that resolves to a boolean indicating whether the flush operation was successful.
       */
      async flush(timeout) {
        if (this._flushLock) {
          await this._flushLock.finalize();
        }
        if (this._pendingSpans.size > 0 && this._spanCompletionPromise) {
          DEBUG_BUILD2 && debug.log("[CloudflareClient] Waiting for", this._pendingSpans.size, "pending spans to complete...");
          const timeoutMs = timeout ?? 5e3;
          const spanCompletionRace = Promise.race([
            this._spanCompletionPromise,
            new Promise(
              (resolve2) => setTimeout(() => {
                DEBUG_BUILD2 && debug.log("[CloudflareClient] Span completion timeout after", timeoutMs, "ms, flushing anyway");
                resolve2(void 0);
              }, timeoutMs)
            )
          ]);
          await spanCompletionRace;
        }
        return super.flush(timeout);
      }
      /**
       * Disposes of the client and releases all resources.
       *
       * This method clears all Cloudflare-specific state in addition to the base client cleanup.
       * It unsubscribes from span lifecycle events and clears pending span tracking.
       *
       * Call this method after flushing to allow the client to be garbage collected.
       * After calling dispose(), the client should not be used anymore.
       */
      dispose() {
        DEBUG_BUILD2 && debug.log("[CloudflareClient] Disposing client...");
        super.dispose();
        if (this._unsubscribeSpanStart) {
          this._unsubscribeSpanStart();
          this._unsubscribeSpanStart = null;
        }
        if (this._unsubscribeSpanEnd) {
          this._unsubscribeSpanEnd();
          this._unsubscribeSpanEnd = null;
        }
        this._resetSpanCompletionPromise();
        this._flushLock = void 0;
      }
      /**
       * Resets the span completion promise and resolve function.
       */
      _resetSpanCompletionPromise() {
        this._pendingSpans.clear();
        this._spanCompletionPromise = null;
        this._resolveSpanCompletion = null;
      }
    };
    __name(CloudflareClient, "CloudflareClient");
  }
});

// node_modules/@sentry/cloudflare/build/esm/integrations/httpServer.js
async function captureIncomingRequestBody(client, request) {
  const integration = client.getIntegrationByName(INTEGRATION_NAME8);
  if (!integration) {
    return;
  }
  const maxRequestBodySize = integration.maxRequestBodySize;
  if (maxRequestBodySize === "none") {
    return;
  }
  if (request.method === "GET" || request.method === "HEAD" || request.method === "OPTIONS") {
    return;
  }
  if (integration.ignoreRequestBody?.(request.url, request)) {
    return;
  }
  const isolationScope = getIsolationScope();
  await captureBodyFromWinterCGRequest(request, isolationScope, maxRequestBodySize);
}
var INTEGRATION_NAME8, _httpServerIntegration, httpServerIntegration;
var init_httpServer = __esm({
  "node_modules/@sentry/cloudflare/build/esm/integrations/httpServer.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_esm();
    INTEGRATION_NAME8 = "HttpServer";
    _httpServerIntegration = /* @__PURE__ */ __name((options = {}) => {
      return {
        name: INTEGRATION_NAME8,
        maxRequestBodySize: options.maxRequestBodySize ?? "medium",
        ignoreRequestBody: options.ignoreRequestBody
      };
    }, "_httpServerIntegration");
    httpServerIntegration = defineIntegration(_httpServerIntegration);
    __name(captureIncomingRequestBody, "captureIncomingRequestBody");
  }
});

// node_modules/@sentry/cloudflare/build/esm/integrations/fetch.js
function createBreadcrumb(handlerData) {
  const { startTimestamp, endTimestamp } = handlerData;
  if (!endTimestamp) {
    return;
  }
  const breadcrumbData = {
    method: handlerData.fetchData.method,
    url: handlerData.fetchData.url
  };
  if (handlerData.error) {
    const hint = {
      data: handlerData.error,
      input: handlerData.args,
      startTimestamp,
      endTimestamp
    };
    addBreadcrumb(
      {
        category: "fetch",
        data: breadcrumbData,
        level: "error",
        type: "http"
      },
      hint
    );
  } else {
    const response = handlerData.response;
    breadcrumbData.request_body_size = handlerData.fetchData.request_body_size;
    breadcrumbData.response_body_size = handlerData.fetchData.response_body_size;
    breadcrumbData.status_code = response?.status;
    const hint = {
      input: handlerData.args,
      response,
      startTimestamp,
      endTimestamp
    };
    const level = getBreadcrumbLogLevelFromHttpStatusCode(breadcrumbData.status_code);
    addBreadcrumb(
      {
        category: "fetch",
        data: breadcrumbData,
        type: "http",
        level
      },
      hint
    );
  }
}
var INTEGRATION_NAME9, HAS_CLIENT_MAP, _fetchIntegration, fetchIntegration;
var init_fetch3 = __esm({
  "node_modules/@sentry/cloudflare/build/esm/integrations/fetch.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_esm();
    INTEGRATION_NAME9 = "Fetch";
    HAS_CLIENT_MAP = /* @__PURE__ */ new WeakMap();
    _fetchIntegration = /* @__PURE__ */ __name((options = {}) => {
      const breadcrumbs = options.breadcrumbs === void 0 ? true : options.breadcrumbs;
      const shouldCreateSpanForRequest = options.shouldCreateSpanForRequest;
      const _createSpanUrlMap = new LRUMap(100);
      const _headersUrlMap = new LRUMap(100);
      const spans = {};
      function _shouldAttachTraceData(url) {
        const client = getClient();
        if (!client) {
          return false;
        }
        const clientOptions = client.getOptions();
        if (clientOptions.tracePropagationTargets === void 0) {
          return true;
        }
        const cachedDecision = _headersUrlMap.get(url);
        if (cachedDecision !== void 0) {
          return cachedDecision;
        }
        const decision = stringMatchesSomePattern(url, clientOptions.tracePropagationTargets);
        _headersUrlMap.set(url, decision);
        return decision;
      }
      __name(_shouldAttachTraceData, "_shouldAttachTraceData");
      function _shouldCreateSpan(url) {
        if (shouldCreateSpanForRequest === void 0) {
          return true;
        }
        const cachedDecision = _createSpanUrlMap.get(url);
        if (cachedDecision !== void 0) {
          return cachedDecision;
        }
        const decision = shouldCreateSpanForRequest(url);
        _createSpanUrlMap.set(url, decision);
        return decision;
      }
      __name(_shouldCreateSpan, "_shouldCreateSpan");
      return {
        name: INTEGRATION_NAME9,
        setupOnce() {
          addFetchInstrumentationHandler((handlerData) => {
            const client = getClient();
            const { propagateTraceparent } = client?.getOptions() || {};
            if (!client || !HAS_CLIENT_MAP.get(client)) {
              return;
            }
            if (isSentryRequestUrl(handlerData.fetchData.url, client)) {
              return;
            }
            instrumentFetchRequest(handlerData, _shouldCreateSpan, _shouldAttachTraceData, spans, {
              spanOrigin: "auto.http.fetch",
              propagateTraceparent
            });
            if (breadcrumbs) {
              createBreadcrumb(handlerData);
            }
          }, true);
        },
        setup(client) {
          HAS_CLIENT_MAP.set(client, true);
        }
      };
    }, "_fetchIntegration");
    fetchIntegration = defineIntegration(_fetchIntegration);
    __name(createBreadcrumb, "createBreadcrumb");
  }
});

// node_modules/@sentry/cloudflare/build/esm/integrations/hono.js
function getHonoIntegration() {
  return getClient()?.getIntegrationByName(INTEGRATION_NAME10);
}
function isHonoError(err) {
  if (err instanceof Error) {
    return true;
  }
  return isObjectLike(err) && "status" in err;
}
function defaultShouldHandleError(error2) {
  const statusCode = error2?.status;
  return statusCode ? statusCode >= 500 || statusCode <= 299 : true;
}
var INTEGRATION_NAME10, routePath, _honoIntegration, honoIntegration;
var init_hono = __esm({
  "node_modules/@sentry/cloudflare/build/esm/integrations/hono.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_esm();
    init_debug_build2();
    INTEGRATION_NAME10 = "Hono";
    __name(getHonoIntegration, "getHonoIntegration");
    __name(isHonoError, "isHonoError");
    routePath = /* @__PURE__ */ __name((c) => c.req?.path ?? "", "routePath");
    _honoIntegration = /* @__PURE__ */ __name((options = {}) => {
      return {
        name: INTEGRATION_NAME10,
        // Hono error handler: https://github.com/honojs/hono/blob/d3abeb1f801aaa1b334285c73da5f5f022dbcadb/src/hono-base.ts#L35
        handleHonoException(err, context) {
          const shouldHandleError = options.shouldHandleError || defaultShouldHandleError;
          if (!isHonoError(err)) {
            DEBUG_BUILD2 && debug.log("[Hono] Won't capture exception in `onError` because it's not a Hono error.", err);
            return;
          }
          if (shouldHandleError(err)) {
            if (context) {
              const activeSpan = getActiveSpan();
              const spanName = `${context.req.method} ${routePath(context)}`;
              if (activeSpan) {
                activeSpan.updateName(spanName);
                updateSpanName(getRootSpan(activeSpan), spanName);
              }
              getIsolationScope().setTransactionName(spanName);
            }
            captureException(err, { mechanism: { handled: false, type: "auto.faas.hono.error_handler" } });
          } else {
            DEBUG_BUILD2 && debug.log("[Hono] Not capturing exception because `shouldHandleError` returned `false`.", err);
          }
        }
      };
    }, "_honoIntegration");
    honoIntegration = defineIntegration(_honoIntegration);
    __name(defaultShouldHandleError, "defaultShouldHandleError");
  }
});

// node_modules/@opentelemetry/api/build/src/version.js
var require_version = __commonJS({
  "node_modules/@opentelemetry/api/build/src/version.js"(exports) {
    "use strict";
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.VERSION = void 0;
    exports.VERSION = "1.9.1";
  }
});

// node_modules/@opentelemetry/api/build/src/internal/semver.js
var require_semver = __commonJS({
  "node_modules/@opentelemetry/api/build/src/internal/semver.js"(exports) {
    "use strict";
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isCompatible = exports._makeCompatibilityCheck = void 0;
    var version_1 = require_version();
    var re = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/;
    function _makeCompatibilityCheck(ownVersion) {
      const acceptedVersions = /* @__PURE__ */ new Set([ownVersion]);
      const rejectedVersions = /* @__PURE__ */ new Set();
      const myVersionMatch = ownVersion.match(re);
      if (!myVersionMatch) {
        return () => false;
      }
      const ownVersionParsed = {
        major: +myVersionMatch[1],
        minor: +myVersionMatch[2],
        patch: +myVersionMatch[3],
        prerelease: myVersionMatch[4]
      };
      if (ownVersionParsed.prerelease != null) {
        return /* @__PURE__ */ __name(function isExactmatch(globalVersion) {
          return globalVersion === ownVersion;
        }, "isExactmatch");
      }
      function _reject(v) {
        rejectedVersions.add(v);
        return false;
      }
      __name(_reject, "_reject");
      function _accept(v) {
        acceptedVersions.add(v);
        return true;
      }
      __name(_accept, "_accept");
      return /* @__PURE__ */ __name(function isCompatible(globalVersion) {
        if (acceptedVersions.has(globalVersion)) {
          return true;
        }
        if (rejectedVersions.has(globalVersion)) {
          return false;
        }
        const globalVersionMatch = globalVersion.match(re);
        if (!globalVersionMatch) {
          return _reject(globalVersion);
        }
        const globalVersionParsed = {
          major: +globalVersionMatch[1],
          minor: +globalVersionMatch[2],
          patch: +globalVersionMatch[3],
          prerelease: globalVersionMatch[4]
        };
        if (globalVersionParsed.prerelease != null) {
          return _reject(globalVersion);
        }
        if (ownVersionParsed.major !== globalVersionParsed.major) {
          return _reject(globalVersion);
        }
        if (ownVersionParsed.major === 0) {
          if (ownVersionParsed.minor === globalVersionParsed.minor && ownVersionParsed.patch <= globalVersionParsed.patch) {
            return _accept(globalVersion);
          }
          return _reject(globalVersion);
        }
        if (ownVersionParsed.minor <= globalVersionParsed.minor) {
          return _accept(globalVersion);
        }
        return _reject(globalVersion);
      }, "isCompatible");
    }
    __name(_makeCompatibilityCheck, "_makeCompatibilityCheck");
    exports._makeCompatibilityCheck = _makeCompatibilityCheck;
    exports.isCompatible = _makeCompatibilityCheck(version_1.VERSION);
  }
});

// node_modules/@opentelemetry/api/build/src/internal/global-utils.js
var require_global_utils = __commonJS({
  "node_modules/@opentelemetry/api/build/src/internal/global-utils.js"(exports) {
    "use strict";
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.unregisterGlobal = exports.getGlobal = exports.registerGlobal = void 0;
    var version_1 = require_version();
    var semver_1 = require_semver();
    var major = version_1.VERSION.split(".")[0];
    var GLOBAL_OPENTELEMETRY_API_KEY = Symbol.for(`opentelemetry.js.api.${major}`);
    var _global = typeof globalThis === "object" ? globalThis : typeof self === "object" ? self : typeof window === "object" ? window : typeof global === "object" ? global : {};
    function registerGlobal(type, instance, diag, allowOverride = false) {
      var _a;
      const api = _global[GLOBAL_OPENTELEMETRY_API_KEY] = (_a = _global[GLOBAL_OPENTELEMETRY_API_KEY]) !== null && _a !== void 0 ? _a : {
        version: version_1.VERSION
      };
      if (!allowOverride && api[type]) {
        const err = new Error(`@opentelemetry/api: Attempted duplicate registration of API: ${type}`);
        diag.error(err.stack || err.message);
        return false;
      }
      if (api.version !== version_1.VERSION) {
        const err = new Error(`@opentelemetry/api: Registration of version v${api.version} for ${type} does not match previously registered API v${version_1.VERSION}`);
        diag.error(err.stack || err.message);
        return false;
      }
      api[type] = instance;
      diag.debug(`@opentelemetry/api: Registered a global for ${type} v${version_1.VERSION}.`);
      return true;
    }
    __name(registerGlobal, "registerGlobal");
    exports.registerGlobal = registerGlobal;
    function getGlobal(type) {
      var _a, _b;
      const globalVersion = (_a = _global[GLOBAL_OPENTELEMETRY_API_KEY]) === null || _a === void 0 ? void 0 : _a.version;
      if (!globalVersion || !(0, semver_1.isCompatible)(globalVersion)) {
        return;
      }
      return (_b = _global[GLOBAL_OPENTELEMETRY_API_KEY]) === null || _b === void 0 ? void 0 : _b[type];
    }
    __name(getGlobal, "getGlobal");
    exports.getGlobal = getGlobal;
    function unregisterGlobal(type, diag) {
      diag.debug(`@opentelemetry/api: Unregistering a global for ${type} v${version_1.VERSION}.`);
      const api = _global[GLOBAL_OPENTELEMETRY_API_KEY];
      if (api) {
        delete api[type];
      }
    }
    __name(unregisterGlobal, "unregisterGlobal");
    exports.unregisterGlobal = unregisterGlobal;
  }
});

// node_modules/@opentelemetry/api/build/src/diag/ComponentLogger.js
var require_ComponentLogger = __commonJS({
  "node_modules/@opentelemetry/api/build/src/diag/ComponentLogger.js"(exports) {
    "use strict";
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DiagComponentLogger = void 0;
    var global_utils_1 = require_global_utils();
    var DiagComponentLogger = class {
      constructor(props) {
        this._namespace = props.namespace || "DiagComponentLogger";
      }
      debug(...args) {
        return logProxy("debug", this._namespace, args);
      }
      error(...args) {
        return logProxy("error", this._namespace, args);
      }
      info(...args) {
        return logProxy("info", this._namespace, args);
      }
      warn(...args) {
        return logProxy("warn", this._namespace, args);
      }
      verbose(...args) {
        return logProxy("verbose", this._namespace, args);
      }
    };
    __name(DiagComponentLogger, "DiagComponentLogger");
    exports.DiagComponentLogger = DiagComponentLogger;
    function logProxy(funcName, namespace, args) {
      const logger = (0, global_utils_1.getGlobal)("diag");
      if (!logger) {
        return;
      }
      return logger[funcName](namespace, ...args);
    }
    __name(logProxy, "logProxy");
  }
});

// node_modules/@opentelemetry/api/build/src/diag/types.js
var require_types = __commonJS({
  "node_modules/@opentelemetry/api/build/src/diag/types.js"(exports) {
    "use strict";
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DiagLogLevel = void 0;
    var DiagLogLevel;
    (function(DiagLogLevel2) {
      DiagLogLevel2[DiagLogLevel2["NONE"] = 0] = "NONE";
      DiagLogLevel2[DiagLogLevel2["ERROR"] = 30] = "ERROR";
      DiagLogLevel2[DiagLogLevel2["WARN"] = 50] = "WARN";
      DiagLogLevel2[DiagLogLevel2["INFO"] = 60] = "INFO";
      DiagLogLevel2[DiagLogLevel2["DEBUG"] = 70] = "DEBUG";
      DiagLogLevel2[DiagLogLevel2["VERBOSE"] = 80] = "VERBOSE";
      DiagLogLevel2[DiagLogLevel2["ALL"] = 9999] = "ALL";
    })(DiagLogLevel = exports.DiagLogLevel || (exports.DiagLogLevel = {}));
  }
});

// node_modules/@opentelemetry/api/build/src/diag/internal/logLevelLogger.js
var require_logLevelLogger = __commonJS({
  "node_modules/@opentelemetry/api/build/src/diag/internal/logLevelLogger.js"(exports) {
    "use strict";
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createLogLevelDiagLogger = void 0;
    var types_1 = require_types();
    function createLogLevelDiagLogger(maxLevel, logger) {
      if (maxLevel < types_1.DiagLogLevel.NONE) {
        maxLevel = types_1.DiagLogLevel.NONE;
      } else if (maxLevel > types_1.DiagLogLevel.ALL) {
        maxLevel = types_1.DiagLogLevel.ALL;
      }
      logger = logger || {};
      function _filterFunc(funcName, theLevel) {
        const theFunc = logger[funcName];
        if (typeof theFunc === "function" && maxLevel >= theLevel) {
          return theFunc.bind(logger);
        }
        return function() {
        };
      }
      __name(_filterFunc, "_filterFunc");
      return {
        error: _filterFunc("error", types_1.DiagLogLevel.ERROR),
        warn: _filterFunc("warn", types_1.DiagLogLevel.WARN),
        info: _filterFunc("info", types_1.DiagLogLevel.INFO),
        debug: _filterFunc("debug", types_1.DiagLogLevel.DEBUG),
        verbose: _filterFunc("verbose", types_1.DiagLogLevel.VERBOSE)
      };
    }
    __name(createLogLevelDiagLogger, "createLogLevelDiagLogger");
    exports.createLogLevelDiagLogger = createLogLevelDiagLogger;
  }
});

// node_modules/@opentelemetry/api/build/src/api/diag.js
var require_diag = __commonJS({
  "node_modules/@opentelemetry/api/build/src/api/diag.js"(exports) {
    "use strict";
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DiagAPI = void 0;
    var ComponentLogger_1 = require_ComponentLogger();
    var logLevelLogger_1 = require_logLevelLogger();
    var types_1 = require_types();
    var global_utils_1 = require_global_utils();
    var API_NAME = "diag";
    var DiagAPI = class {
      /** Get the singleton instance of the DiagAPI API */
      static instance() {
        if (!this._instance) {
          this._instance = new DiagAPI();
        }
        return this._instance;
      }
      /**
       * Private internal constructor
       * @private
       */
      constructor() {
        function _logProxy(funcName) {
          return function(...args) {
            const logger = (0, global_utils_1.getGlobal)("diag");
            if (!logger)
              return;
            return logger[funcName](...args);
          };
        }
        __name(_logProxy, "_logProxy");
        const self2 = this;
        const setLogger = /* @__PURE__ */ __name((logger, optionsOrLogLevel = { logLevel: types_1.DiagLogLevel.INFO }) => {
          var _a, _b, _c;
          if (logger === self2) {
            const err = new Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");
            self2.error((_a = err.stack) !== null && _a !== void 0 ? _a : err.message);
            return false;
          }
          if (typeof optionsOrLogLevel === "number") {
            optionsOrLogLevel = {
              logLevel: optionsOrLogLevel
            };
          }
          const oldLogger = (0, global_utils_1.getGlobal)("diag");
          const newLogger = (0, logLevelLogger_1.createLogLevelDiagLogger)((_b = optionsOrLogLevel.logLevel) !== null && _b !== void 0 ? _b : types_1.DiagLogLevel.INFO, logger);
          if (oldLogger && !optionsOrLogLevel.suppressOverrideMessage) {
            const stack = (_c = new Error().stack) !== null && _c !== void 0 ? _c : "<failed to generate stacktrace>";
            oldLogger.warn(`Current logger will be overwritten from ${stack}`);
            newLogger.warn(`Current logger will overwrite one already registered from ${stack}`);
          }
          return (0, global_utils_1.registerGlobal)("diag", newLogger, self2, true);
        }, "setLogger");
        self2.setLogger = setLogger;
        self2.disable = () => {
          (0, global_utils_1.unregisterGlobal)(API_NAME, self2);
        };
        self2.createComponentLogger = (options) => {
          return new ComponentLogger_1.DiagComponentLogger(options);
        };
        self2.verbose = _logProxy("verbose");
        self2.debug = _logProxy("debug");
        self2.info = _logProxy("info");
        self2.warn = _logProxy("warn");
        self2.error = _logProxy("error");
      }
    };
    __name(DiagAPI, "DiagAPI");
    exports.DiagAPI = DiagAPI;
  }
});

// node_modules/@opentelemetry/api/build/src/baggage/internal/baggage-impl.js
var require_baggage_impl = __commonJS({
  "node_modules/@opentelemetry/api/build/src/baggage/internal/baggage-impl.js"(exports) {
    "use strict";
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BaggageImpl = void 0;
    var BaggageImpl = class {
      constructor(entries) {
        this._entries = entries ? new Map(entries) : /* @__PURE__ */ new Map();
      }
      getEntry(key) {
        const entry = this._entries.get(key);
        if (!entry) {
          return void 0;
        }
        return Object.assign({}, entry);
      }
      getAllEntries() {
        return Array.from(this._entries.entries());
      }
      setEntry(key, entry) {
        const newBaggage = new BaggageImpl(this._entries);
        newBaggage._entries.set(key, entry);
        return newBaggage;
      }
      removeEntry(key) {
        const newBaggage = new BaggageImpl(this._entries);
        newBaggage._entries.delete(key);
        return newBaggage;
      }
      removeEntries(...keys) {
        const newBaggage = new BaggageImpl(this._entries);
        for (const key of keys) {
          newBaggage._entries.delete(key);
        }
        return newBaggage;
      }
      clear() {
        return new BaggageImpl();
      }
    };
    __name(BaggageImpl, "BaggageImpl");
    exports.BaggageImpl = BaggageImpl;
  }
});

// node_modules/@opentelemetry/api/build/src/baggage/internal/symbol.js
var require_symbol = __commonJS({
  "node_modules/@opentelemetry/api/build/src/baggage/internal/symbol.js"(exports) {
    "use strict";
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.baggageEntryMetadataSymbol = void 0;
    exports.baggageEntryMetadataSymbol = Symbol("BaggageEntryMetadata");
  }
});

// node_modules/@opentelemetry/api/build/src/baggage/utils.js
var require_utils = __commonJS({
  "node_modules/@opentelemetry/api/build/src/baggage/utils.js"(exports) {
    "use strict";
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.baggageEntryMetadataFromString = exports.createBaggage = void 0;
    var diag_1 = require_diag();
    var baggage_impl_1 = require_baggage_impl();
    var symbol_1 = require_symbol();
    var diag = diag_1.DiagAPI.instance();
    function createBaggage(entries = {}) {
      return new baggage_impl_1.BaggageImpl(new Map(Object.entries(entries)));
    }
    __name(createBaggage, "createBaggage");
    exports.createBaggage = createBaggage;
    function baggageEntryMetadataFromString(str) {
      if (typeof str !== "string") {
        diag.error(`Cannot create baggage metadata from unknown type: ${typeof str}`);
        str = "";
      }
      return {
        __TYPE__: symbol_1.baggageEntryMetadataSymbol,
        toString() {
          return str;
        }
      };
    }
    __name(baggageEntryMetadataFromString, "baggageEntryMetadataFromString");
    exports.baggageEntryMetadataFromString = baggageEntryMetadataFromString;
  }
});

// node_modules/@opentelemetry/api/build/src/context/context.js
var require_context = __commonJS({
  "node_modules/@opentelemetry/api/build/src/context/context.js"(exports) {
    "use strict";
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ROOT_CONTEXT = exports.createContextKey = void 0;
    function createContextKey(description) {
      return Symbol.for(description);
    }
    __name(createContextKey, "createContextKey");
    exports.createContextKey = createContextKey;
    var BaseContext = class {
      /**
       * Construct a new context which inherits values from an optional parent context.
       *
       * @param parentContext a context from which to inherit values
       */
      constructor(parentContext) {
        const self2 = this;
        self2._currentContext = parentContext ? new Map(parentContext) : /* @__PURE__ */ new Map();
        self2.getValue = (key) => self2._currentContext.get(key);
        self2.setValue = (key, value) => {
          const context = new BaseContext(self2._currentContext);
          context._currentContext.set(key, value);
          return context;
        };
        self2.deleteValue = (key) => {
          const context = new BaseContext(self2._currentContext);
          context._currentContext.delete(key);
          return context;
        };
      }
    };
    __name(BaseContext, "BaseContext");
    exports.ROOT_CONTEXT = new BaseContext();
  }
});

// node_modules/@opentelemetry/api/build/src/diag/consoleLogger.js
var require_consoleLogger = __commonJS({
  "node_modules/@opentelemetry/api/build/src/diag/consoleLogger.js"(exports) {
    "use strict";
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DiagConsoleLogger = exports._originalConsoleMethods = void 0;
    var consoleMap = [
      { n: "error", c: "error" },
      { n: "warn", c: "warn" },
      { n: "info", c: "info" },
      { n: "debug", c: "debug" },
      { n: "verbose", c: "trace" }
    ];
    exports._originalConsoleMethods = {};
    if (typeof console !== "undefined") {
      const keys = [
        "error",
        "warn",
        "info",
        "debug",
        "trace",
        "log"
      ];
      for (const key of keys) {
        if (typeof console[key] === "function") {
          exports._originalConsoleMethods[key] = console[key];
        }
      }
    }
    var DiagConsoleLogger = class {
      constructor() {
        function _consoleFunc(funcName) {
          return function(...args) {
            let theFunc = exports._originalConsoleMethods[funcName];
            if (typeof theFunc !== "function") {
              theFunc = exports._originalConsoleMethods["log"];
            }
            if (typeof theFunc !== "function" && console) {
              theFunc = console[funcName];
              if (typeof theFunc !== "function") {
                theFunc = console.log;
              }
            }
            if (typeof theFunc === "function") {
              return theFunc.apply(console, args);
            }
          };
        }
        __name(_consoleFunc, "_consoleFunc");
        for (let i = 0; i < consoleMap.length; i++) {
          this[consoleMap[i].n] = _consoleFunc(consoleMap[i].c);
        }
      }
    };
    __name(DiagConsoleLogger, "DiagConsoleLogger");
    exports.DiagConsoleLogger = DiagConsoleLogger;
  }
});

// node_modules/@opentelemetry/api/build/src/metrics/NoopMeter.js
var require_NoopMeter = __commonJS({
  "node_modules/@opentelemetry/api/build/src/metrics/NoopMeter.js"(exports) {
    "use strict";
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createNoopMeter = exports.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = exports.NOOP_OBSERVABLE_GAUGE_METRIC = exports.NOOP_OBSERVABLE_COUNTER_METRIC = exports.NOOP_UP_DOWN_COUNTER_METRIC = exports.NOOP_HISTOGRAM_METRIC = exports.NOOP_GAUGE_METRIC = exports.NOOP_COUNTER_METRIC = exports.NOOP_METER = exports.NoopObservableUpDownCounterMetric = exports.NoopObservableGaugeMetric = exports.NoopObservableCounterMetric = exports.NoopObservableMetric = exports.NoopHistogramMetric = exports.NoopGaugeMetric = exports.NoopUpDownCounterMetric = exports.NoopCounterMetric = exports.NoopMetric = exports.NoopMeter = void 0;
    var NoopMeter = class {
      constructor() {
      }
      /**
       * @see {@link Meter.createGauge}
       */
      createGauge(_name, _options) {
        return exports.NOOP_GAUGE_METRIC;
      }
      /**
       * @see {@link Meter.createHistogram}
       */
      createHistogram(_name, _options) {
        return exports.NOOP_HISTOGRAM_METRIC;
      }
      /**
       * @see {@link Meter.createCounter}
       */
      createCounter(_name, _options) {
        return exports.NOOP_COUNTER_METRIC;
      }
      /**
       * @see {@link Meter.createUpDownCounter}
       */
      createUpDownCounter(_name, _options) {
        return exports.NOOP_UP_DOWN_COUNTER_METRIC;
      }
      /**
       * @see {@link Meter.createObservableGauge}
       */
      createObservableGauge(_name, _options) {
        return exports.NOOP_OBSERVABLE_GAUGE_METRIC;
      }
      /**
       * @see {@link Meter.createObservableCounter}
       */
      createObservableCounter(_name, _options) {
        return exports.NOOP_OBSERVABLE_COUNTER_METRIC;
      }
      /**
       * @see {@link Meter.createObservableUpDownCounter}
       */
      createObservableUpDownCounter(_name, _options) {
        return exports.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC;
      }
      /**
       * @see {@link Meter.addBatchObservableCallback}
       */
      addBatchObservableCallback(_callback, _observables) {
      }
      /**
       * @see {@link Meter.removeBatchObservableCallback}
       */
      removeBatchObservableCallback(_callback) {
      }
    };
    __name(NoopMeter, "NoopMeter");
    exports.NoopMeter = NoopMeter;
    var NoopMetric = class {
    };
    __name(NoopMetric, "NoopMetric");
    exports.NoopMetric = NoopMetric;
    var NoopCounterMetric = class extends NoopMetric {
      add(_value, _attributes) {
      }
    };
    __name(NoopCounterMetric, "NoopCounterMetric");
    exports.NoopCounterMetric = NoopCounterMetric;
    var NoopUpDownCounterMetric = class extends NoopMetric {
      add(_value, _attributes) {
      }
    };
    __name(NoopUpDownCounterMetric, "NoopUpDownCounterMetric");
    exports.NoopUpDownCounterMetric = NoopUpDownCounterMetric;
    var NoopGaugeMetric = class extends NoopMetric {
      record(_value, _attributes) {
      }
    };
    __name(NoopGaugeMetric, "NoopGaugeMetric");
    exports.NoopGaugeMetric = NoopGaugeMetric;
    var NoopHistogramMetric = class extends NoopMetric {
      record(_value, _attributes) {
      }
    };
    __name(NoopHistogramMetric, "NoopHistogramMetric");
    exports.NoopHistogramMetric = NoopHistogramMetric;
    var NoopObservableMetric = class {
      addCallback(_callback) {
      }
      removeCallback(_callback) {
      }
    };
    __name(NoopObservableMetric, "NoopObservableMetric");
    exports.NoopObservableMetric = NoopObservableMetric;
    var NoopObservableCounterMetric = class extends NoopObservableMetric {
    };
    __name(NoopObservableCounterMetric, "NoopObservableCounterMetric");
    exports.NoopObservableCounterMetric = NoopObservableCounterMetric;
    var NoopObservableGaugeMetric = class extends NoopObservableMetric {
    };
    __name(NoopObservableGaugeMetric, "NoopObservableGaugeMetric");
    exports.NoopObservableGaugeMetric = NoopObservableGaugeMetric;
    var NoopObservableUpDownCounterMetric = class extends NoopObservableMetric {
    };
    __name(NoopObservableUpDownCounterMetric, "NoopObservableUpDownCounterMetric");
    exports.NoopObservableUpDownCounterMetric = NoopObservableUpDownCounterMetric;
    exports.NOOP_METER = new NoopMeter();
    exports.NOOP_COUNTER_METRIC = new NoopCounterMetric();
    exports.NOOP_GAUGE_METRIC = new NoopGaugeMetric();
    exports.NOOP_HISTOGRAM_METRIC = new NoopHistogramMetric();
    exports.NOOP_UP_DOWN_COUNTER_METRIC = new NoopUpDownCounterMetric();
    exports.NOOP_OBSERVABLE_COUNTER_METRIC = new NoopObservableCounterMetric();
    exports.NOOP_OBSERVABLE_GAUGE_METRIC = new NoopObservableGaugeMetric();
    exports.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = new NoopObservableUpDownCounterMetric();
    function createNoopMeter() {
      return exports.NOOP_METER;
    }
    __name(createNoopMeter, "createNoopMeter");
    exports.createNoopMeter = createNoopMeter;
  }
});

// node_modules/@opentelemetry/api/build/src/metrics/Metric.js
var require_Metric = __commonJS({
  "node_modules/@opentelemetry/api/build/src/metrics/Metric.js"(exports) {
    "use strict";
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ValueType = void 0;
    var ValueType;
    (function(ValueType2) {
      ValueType2[ValueType2["INT"] = 0] = "INT";
      ValueType2[ValueType2["DOUBLE"] = 1] = "DOUBLE";
    })(ValueType = exports.ValueType || (exports.ValueType = {}));
  }
});

// node_modules/@opentelemetry/api/build/src/propagation/TextMapPropagator.js
var require_TextMapPropagator = __commonJS({
  "node_modules/@opentelemetry/api/build/src/propagation/TextMapPropagator.js"(exports) {
    "use strict";
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.defaultTextMapSetter = exports.defaultTextMapGetter = void 0;
    exports.defaultTextMapGetter = {
      get(carrier, key) {
        if (carrier == null) {
          return void 0;
        }
        return carrier[key];
      },
      keys(carrier) {
        if (carrier == null) {
          return [];
        }
        return Object.keys(carrier);
      }
    };
    exports.defaultTextMapSetter = {
      set(carrier, key, value) {
        if (carrier == null) {
          return;
        }
        carrier[key] = value;
      }
    };
  }
});

// node_modules/@opentelemetry/api/build/src/context/NoopContextManager.js
var require_NoopContextManager = __commonJS({
  "node_modules/@opentelemetry/api/build/src/context/NoopContextManager.js"(exports) {
    "use strict";
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NoopContextManager = void 0;
    var context_1 = require_context();
    var NoopContextManager = class {
      active() {
        return context_1.ROOT_CONTEXT;
      }
      with(_context, fn, thisArg, ...args) {
        return fn.call(thisArg, ...args);
      }
      bind(_context, target) {
        return target;
      }
      enable() {
        return this;
      }
      disable() {
        return this;
      }
    };
    __name(NoopContextManager, "NoopContextManager");
    exports.NoopContextManager = NoopContextManager;
  }
});

// node_modules/@opentelemetry/api/build/src/api/context.js
var require_context2 = __commonJS({
  "node_modules/@opentelemetry/api/build/src/api/context.js"(exports) {
    "use strict";
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ContextAPI = void 0;
    var NoopContextManager_1 = require_NoopContextManager();
    var global_utils_1 = require_global_utils();
    var diag_1 = require_diag();
    var API_NAME = "context";
    var NOOP_CONTEXT_MANAGER = new NoopContextManager_1.NoopContextManager();
    var ContextAPI = class {
      /** Empty private constructor prevents end users from constructing a new instance of the API */
      constructor() {
      }
      /** Get the singleton instance of the Context API */
      static getInstance() {
        if (!this._instance) {
          this._instance = new ContextAPI();
        }
        return this._instance;
      }
      /**
       * Set the current context manager.
       *
       * @returns true if the context manager was successfully registered, else false
       */
      setGlobalContextManager(contextManager) {
        return (0, global_utils_1.registerGlobal)(API_NAME, contextManager, diag_1.DiagAPI.instance());
      }
      /**
       * Get the currently active context
       */
      active() {
        return this._getContextManager().active();
      }
      /**
       * Execute a function with an active context
       *
       * @param context context to be active during function execution
       * @param fn function to execute in a context
       * @param thisArg optional receiver to be used for calling fn
       * @param args optional arguments forwarded to fn
       */
      with(context, fn, thisArg, ...args) {
        return this._getContextManager().with(context, fn, thisArg, ...args);
      }
      /**
       * Bind a context to a target function or event emitter
       *
       * @param context context to bind to the event emitter or function. Defaults to the currently active context
       * @param target function or event emitter to bind
       */
      bind(context, target) {
        return this._getContextManager().bind(context, target);
      }
      _getContextManager() {
        return (0, global_utils_1.getGlobal)(API_NAME) || NOOP_CONTEXT_MANAGER;
      }
      /** Disable and remove the global context manager */
      disable() {
        this._getContextManager().disable();
        (0, global_utils_1.unregisterGlobal)(API_NAME, diag_1.DiagAPI.instance());
      }
    };
    __name(ContextAPI, "ContextAPI");
    exports.ContextAPI = ContextAPI;
  }
});

// node_modules/@opentelemetry/api/build/src/trace/trace_flags.js
var require_trace_flags = __commonJS({
  "node_modules/@opentelemetry/api/build/src/trace/trace_flags.js"(exports) {
    "use strict";
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TraceFlags = void 0;
    var TraceFlags2;
    (function(TraceFlags3) {
      TraceFlags3[TraceFlags3["NONE"] = 0] = "NONE";
      TraceFlags3[TraceFlags3["SAMPLED"] = 1] = "SAMPLED";
    })(TraceFlags2 = exports.TraceFlags || (exports.TraceFlags = {}));
  }
});

// node_modules/@opentelemetry/api/build/src/trace/invalid-span-constants.js
var require_invalid_span_constants = __commonJS({
  "node_modules/@opentelemetry/api/build/src/trace/invalid-span-constants.js"(exports) {
    "use strict";
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.INVALID_SPAN_CONTEXT = exports.INVALID_TRACEID = exports.INVALID_SPANID = void 0;
    var trace_flags_1 = require_trace_flags();
    exports.INVALID_SPANID = "0000000000000000";
    exports.INVALID_TRACEID = "00000000000000000000000000000000";
    exports.INVALID_SPAN_CONTEXT = {
      traceId: exports.INVALID_TRACEID,
      spanId: exports.INVALID_SPANID,
      traceFlags: trace_flags_1.TraceFlags.NONE
    };
  }
});

// node_modules/@opentelemetry/api/build/src/trace/NonRecordingSpan.js
var require_NonRecordingSpan = __commonJS({
  "node_modules/@opentelemetry/api/build/src/trace/NonRecordingSpan.js"(exports) {
    "use strict";
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NonRecordingSpan = void 0;
    var invalid_span_constants_1 = require_invalid_span_constants();
    var NonRecordingSpan = class {
      constructor(spanContext = invalid_span_constants_1.INVALID_SPAN_CONTEXT) {
        this._spanContext = spanContext;
      }
      // Returns a SpanContext.
      spanContext() {
        return this._spanContext;
      }
      // By default does nothing
      setAttribute(_key, _value) {
        return this;
      }
      // By default does nothing
      setAttributes(_attributes) {
        return this;
      }
      // By default does nothing
      addEvent(_name, _attributes) {
        return this;
      }
      addLink(_link) {
        return this;
      }
      addLinks(_links) {
        return this;
      }
      // By default does nothing
      setStatus(_status) {
        return this;
      }
      // By default does nothing
      updateName(_name) {
        return this;
      }
      // By default does nothing
      end(_endTime) {
      }
      // isRecording always returns false for NonRecordingSpan.
      isRecording() {
        return false;
      }
      // By default does nothing
      recordException(_exception, _time) {
      }
    };
    __name(NonRecordingSpan, "NonRecordingSpan");
    exports.NonRecordingSpan = NonRecordingSpan;
  }
});

// node_modules/@opentelemetry/api/build/src/trace/context-utils.js
var require_context_utils = __commonJS({
  "node_modules/@opentelemetry/api/build/src/trace/context-utils.js"(exports) {
    "use strict";
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getSpanContext = exports.setSpanContext = exports.deleteSpan = exports.setSpan = exports.getActiveSpan = exports.getSpan = void 0;
    var context_1 = require_context();
    var NonRecordingSpan_1 = require_NonRecordingSpan();
    var context_2 = require_context2();
    var SPAN_KEY = (0, context_1.createContextKey)("OpenTelemetry Context Key SPAN");
    function getSpan(context) {
      return context.getValue(SPAN_KEY) || void 0;
    }
    __name(getSpan, "getSpan");
    exports.getSpan = getSpan;
    function getActiveSpan2() {
      return getSpan(context_2.ContextAPI.getInstance().active());
    }
    __name(getActiveSpan2, "getActiveSpan");
    exports.getActiveSpan = getActiveSpan2;
    function setSpan(context, span) {
      return context.setValue(SPAN_KEY, span);
    }
    __name(setSpan, "setSpan");
    exports.setSpan = setSpan;
    function deleteSpan(context) {
      return context.deleteValue(SPAN_KEY);
    }
    __name(deleteSpan, "deleteSpan");
    exports.deleteSpan = deleteSpan;
    function setSpanContext(context, spanContext) {
      return setSpan(context, new NonRecordingSpan_1.NonRecordingSpan(spanContext));
    }
    __name(setSpanContext, "setSpanContext");
    exports.setSpanContext = setSpanContext;
    function getSpanContext(context) {
      var _a;
      return (_a = getSpan(context)) === null || _a === void 0 ? void 0 : _a.spanContext();
    }
    __name(getSpanContext, "getSpanContext");
    exports.getSpanContext = getSpanContext;
  }
});

// node_modules/@opentelemetry/api/build/src/trace/spancontext-utils.js
var require_spancontext_utils = __commonJS({
  "node_modules/@opentelemetry/api/build/src/trace/spancontext-utils.js"(exports) {
    "use strict";
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.wrapSpanContext = exports.isSpanContextValid = exports.isValidSpanId = exports.isValidTraceId = void 0;
    var invalid_span_constants_1 = require_invalid_span_constants();
    var NonRecordingSpan_1 = require_NonRecordingSpan();
    var isHex = new Uint8Array([
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      1,
      1,
      1,
      1,
      1
    ]);
    function isValidHex(id, length) {
      if (typeof id !== "string" || id.length !== length)
        return false;
      let r = 0;
      for (let i = 0; i < id.length; i += 4) {
        r += (isHex[id.charCodeAt(i)] | 0) + (isHex[id.charCodeAt(i + 1)] | 0) + (isHex[id.charCodeAt(i + 2)] | 0) + (isHex[id.charCodeAt(i + 3)] | 0);
      }
      return r === length;
    }
    __name(isValidHex, "isValidHex");
    function isValidTraceId(traceId) {
      return isValidHex(traceId, 32) && traceId !== invalid_span_constants_1.INVALID_TRACEID;
    }
    __name(isValidTraceId, "isValidTraceId");
    exports.isValidTraceId = isValidTraceId;
    function isValidSpanId(spanId) {
      return isValidHex(spanId, 16) && spanId !== invalid_span_constants_1.INVALID_SPANID;
    }
    __name(isValidSpanId, "isValidSpanId");
    exports.isValidSpanId = isValidSpanId;
    function isSpanContextValid(spanContext) {
      return isValidTraceId(spanContext.traceId) && isValidSpanId(spanContext.spanId);
    }
    __name(isSpanContextValid, "isSpanContextValid");
    exports.isSpanContextValid = isSpanContextValid;
    function wrapSpanContext(spanContext) {
      return new NonRecordingSpan_1.NonRecordingSpan(spanContext);
    }
    __name(wrapSpanContext, "wrapSpanContext");
    exports.wrapSpanContext = wrapSpanContext;
  }
});

// node_modules/@opentelemetry/api/build/src/trace/NoopTracer.js
var require_NoopTracer = __commonJS({
  "node_modules/@opentelemetry/api/build/src/trace/NoopTracer.js"(exports) {
    "use strict";
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NoopTracer = void 0;
    var context_1 = require_context2();
    var context_utils_1 = require_context_utils();
    var NonRecordingSpan_1 = require_NonRecordingSpan();
    var spancontext_utils_1 = require_spancontext_utils();
    var contextApi = context_1.ContextAPI.getInstance();
    var NoopTracer = class {
      // startSpan starts a noop span.
      startSpan(name, options, context = contextApi.active()) {
        const root = Boolean(options === null || options === void 0 ? void 0 : options.root);
        if (root) {
          return new NonRecordingSpan_1.NonRecordingSpan();
        }
        const parentFromContext = context && (0, context_utils_1.getSpanContext)(context);
        if (isSpanContext(parentFromContext) && (0, spancontext_utils_1.isSpanContextValid)(parentFromContext)) {
          return new NonRecordingSpan_1.NonRecordingSpan(parentFromContext);
        } else {
          return new NonRecordingSpan_1.NonRecordingSpan();
        }
      }
      startActiveSpan(name, arg2, arg3, arg4) {
        let opts;
        let ctx;
        let fn;
        if (arguments.length < 2) {
          return;
        } else if (arguments.length === 2) {
          fn = arg2;
        } else if (arguments.length === 3) {
          opts = arg2;
          fn = arg3;
        } else {
          opts = arg2;
          ctx = arg3;
          fn = arg4;
        }
        const parentContext = ctx !== null && ctx !== void 0 ? ctx : contextApi.active();
        const span = this.startSpan(name, opts, parentContext);
        const contextWithSpanSet = (0, context_utils_1.setSpan)(parentContext, span);
        return contextApi.with(contextWithSpanSet, fn, void 0, span);
      }
    };
    __name(NoopTracer, "NoopTracer");
    exports.NoopTracer = NoopTracer;
    function isSpanContext(spanContext) {
      return spanContext !== null && typeof spanContext === "object" && "spanId" in spanContext && typeof spanContext["spanId"] === "string" && "traceId" in spanContext && typeof spanContext["traceId"] === "string" && "traceFlags" in spanContext && typeof spanContext["traceFlags"] === "number";
    }
    __name(isSpanContext, "isSpanContext");
  }
});

// node_modules/@opentelemetry/api/build/src/trace/ProxyTracer.js
var require_ProxyTracer = __commonJS({
  "node_modules/@opentelemetry/api/build/src/trace/ProxyTracer.js"(exports) {
    "use strict";
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProxyTracer = void 0;
    var NoopTracer_1 = require_NoopTracer();
    var NOOP_TRACER = new NoopTracer_1.NoopTracer();
    var ProxyTracer = class {
      constructor(provider, name, version, options) {
        this._provider = provider;
        this.name = name;
        this.version = version;
        this.options = options;
      }
      startSpan(name, options, context) {
        return this._getTracer().startSpan(name, options, context);
      }
      startActiveSpan(_name, _options, _context, _fn) {
        const tracer = this._getTracer();
        return Reflect.apply(tracer.startActiveSpan, tracer, arguments);
      }
      /**
       * Try to get a tracer from the proxy tracer provider.
       * If the proxy tracer provider has no delegate, return a noop tracer.
       */
      _getTracer() {
        if (this._delegate) {
          return this._delegate;
        }
        const tracer = this._provider.getDelegateTracer(this.name, this.version, this.options);
        if (!tracer) {
          return NOOP_TRACER;
        }
        this._delegate = tracer;
        return this._delegate;
      }
    };
    __name(ProxyTracer, "ProxyTracer");
    exports.ProxyTracer = ProxyTracer;
  }
});

// node_modules/@opentelemetry/api/build/src/trace/NoopTracerProvider.js
var require_NoopTracerProvider = __commonJS({
  "node_modules/@opentelemetry/api/build/src/trace/NoopTracerProvider.js"(exports) {
    "use strict";
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NoopTracerProvider = void 0;
    var NoopTracer_1 = require_NoopTracer();
    var NoopTracerProvider = class {
      getTracer(_name, _version, _options) {
        return new NoopTracer_1.NoopTracer();
      }
    };
    __name(NoopTracerProvider, "NoopTracerProvider");
    exports.NoopTracerProvider = NoopTracerProvider;
  }
});

// node_modules/@opentelemetry/api/build/src/trace/ProxyTracerProvider.js
var require_ProxyTracerProvider = __commonJS({
  "node_modules/@opentelemetry/api/build/src/trace/ProxyTracerProvider.js"(exports) {
    "use strict";
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProxyTracerProvider = void 0;
    var ProxyTracer_1 = require_ProxyTracer();
    var NoopTracerProvider_1 = require_NoopTracerProvider();
    var NOOP_TRACER_PROVIDER = new NoopTracerProvider_1.NoopTracerProvider();
    var ProxyTracerProvider = class {
      /**
       * Get a {@link ProxyTracer}
       */
      getTracer(name, version, options) {
        var _a;
        return (_a = this.getDelegateTracer(name, version, options)) !== null && _a !== void 0 ? _a : new ProxyTracer_1.ProxyTracer(this, name, version, options);
      }
      getDelegate() {
        var _a;
        return (_a = this._delegate) !== null && _a !== void 0 ? _a : NOOP_TRACER_PROVIDER;
      }
      /**
       * Set the delegate tracer provider
       */
      setDelegate(delegate) {
        this._delegate = delegate;
      }
      getDelegateTracer(name, version, options) {
        var _a;
        return (_a = this._delegate) === null || _a === void 0 ? void 0 : _a.getTracer(name, version, options);
      }
    };
    __name(ProxyTracerProvider, "ProxyTracerProvider");
    exports.ProxyTracerProvider = ProxyTracerProvider;
  }
});

// node_modules/@opentelemetry/api/build/src/trace/SamplingResult.js
var require_SamplingResult = __commonJS({
  "node_modules/@opentelemetry/api/build/src/trace/SamplingResult.js"(exports) {
    "use strict";
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SamplingDecision = void 0;
    var SamplingDecision;
    (function(SamplingDecision2) {
      SamplingDecision2[SamplingDecision2["NOT_RECORD"] = 0] = "NOT_RECORD";
      SamplingDecision2[SamplingDecision2["RECORD"] = 1] = "RECORD";
      SamplingDecision2[SamplingDecision2["RECORD_AND_SAMPLED"] = 2] = "RECORD_AND_SAMPLED";
    })(SamplingDecision = exports.SamplingDecision || (exports.SamplingDecision = {}));
  }
});

// node_modules/@opentelemetry/api/build/src/trace/span_kind.js
var require_span_kind = __commonJS({
  "node_modules/@opentelemetry/api/build/src/trace/span_kind.js"(exports) {
    "use strict";
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SpanKind = void 0;
    var SpanKind;
    (function(SpanKind2) {
      SpanKind2[SpanKind2["INTERNAL"] = 0] = "INTERNAL";
      SpanKind2[SpanKind2["SERVER"] = 1] = "SERVER";
      SpanKind2[SpanKind2["CLIENT"] = 2] = "CLIENT";
      SpanKind2[SpanKind2["PRODUCER"] = 3] = "PRODUCER";
      SpanKind2[SpanKind2["CONSUMER"] = 4] = "CONSUMER";
    })(SpanKind = exports.SpanKind || (exports.SpanKind = {}));
  }
});

// node_modules/@opentelemetry/api/build/src/trace/status.js
var require_status = __commonJS({
  "node_modules/@opentelemetry/api/build/src/trace/status.js"(exports) {
    "use strict";
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SpanStatusCode = void 0;
    var SpanStatusCode;
    (function(SpanStatusCode2) {
      SpanStatusCode2[SpanStatusCode2["UNSET"] = 0] = "UNSET";
      SpanStatusCode2[SpanStatusCode2["OK"] = 1] = "OK";
      SpanStatusCode2[SpanStatusCode2["ERROR"] = 2] = "ERROR";
    })(SpanStatusCode = exports.SpanStatusCode || (exports.SpanStatusCode = {}));
  }
});

// node_modules/@opentelemetry/api/build/src/trace/internal/tracestate-validators.js
var require_tracestate_validators = __commonJS({
  "node_modules/@opentelemetry/api/build/src/trace/internal/tracestate-validators.js"(exports) {
    "use strict";
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateValue = exports.validateKey = void 0;
    var VALID_KEY_CHAR_RANGE = "[_0-9a-z-*/]";
    var VALID_KEY = `[a-z]${VALID_KEY_CHAR_RANGE}{0,255}`;
    var VALID_VENDOR_KEY = `[a-z0-9]${VALID_KEY_CHAR_RANGE}{0,240}@[a-z]${VALID_KEY_CHAR_RANGE}{0,13}`;
    var VALID_KEY_REGEX = new RegExp(`^(?:${VALID_KEY}|${VALID_VENDOR_KEY})$`);
    var VALID_VALUE_BASE_REGEX = /^[ -~]{0,255}[!-~]$/;
    var INVALID_VALUE_COMMA_EQUAL_REGEX = /,|=/;
    function validateKey(key) {
      return VALID_KEY_REGEX.test(key);
    }
    __name(validateKey, "validateKey");
    exports.validateKey = validateKey;
    function validateValue(value) {
      return VALID_VALUE_BASE_REGEX.test(value) && !INVALID_VALUE_COMMA_EQUAL_REGEX.test(value);
    }
    __name(validateValue, "validateValue");
    exports.validateValue = validateValue;
  }
});

// node_modules/@opentelemetry/api/build/src/trace/internal/tracestate-impl.js
var require_tracestate_impl = __commonJS({
  "node_modules/@opentelemetry/api/build/src/trace/internal/tracestate-impl.js"(exports) {
    "use strict";
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TraceStateImpl = void 0;
    var tracestate_validators_1 = require_tracestate_validators();
    var MAX_TRACE_STATE_ITEMS = 32;
    var MAX_TRACE_STATE_LEN = 512;
    var LIST_MEMBERS_SEPARATOR = ",";
    var LIST_MEMBER_KEY_VALUE_SPLITTER = "=";
    var TraceStateImpl = class {
      constructor(rawTraceState) {
        this._internalState = /* @__PURE__ */ new Map();
        if (rawTraceState)
          this._parse(rawTraceState);
      }
      set(key, value) {
        const traceState = this._clone();
        if (traceState._internalState.has(key)) {
          traceState._internalState.delete(key);
        }
        traceState._internalState.set(key, value);
        return traceState;
      }
      unset(key) {
        const traceState = this._clone();
        traceState._internalState.delete(key);
        return traceState;
      }
      get(key) {
        return this._internalState.get(key);
      }
      serialize() {
        return Array.from(this._internalState.keys()).reduceRight((agg, key) => {
          agg.push(key + LIST_MEMBER_KEY_VALUE_SPLITTER + this.get(key));
          return agg;
        }, []).join(LIST_MEMBERS_SEPARATOR);
      }
      _parse(rawTraceState) {
        if (rawTraceState.length > MAX_TRACE_STATE_LEN)
          return;
        this._internalState = rawTraceState.split(LIST_MEMBERS_SEPARATOR).reduceRight((agg, part) => {
          const listMember = part.trim();
          const i = listMember.indexOf(LIST_MEMBER_KEY_VALUE_SPLITTER);
          if (i !== -1) {
            const key = listMember.slice(0, i);
            const value = listMember.slice(i + 1, part.length);
            if ((0, tracestate_validators_1.validateKey)(key) && (0, tracestate_validators_1.validateValue)(value)) {
              agg.set(key, value);
            } else {
            }
          }
          return agg;
        }, /* @__PURE__ */ new Map());
        if (this._internalState.size > MAX_TRACE_STATE_ITEMS) {
          this._internalState = new Map(Array.from(this._internalState.entries()).reverse().slice(0, MAX_TRACE_STATE_ITEMS));
        }
      }
      // @ts-expect-error TS6133 Accessed in tests only.
      _keys() {
        return Array.from(this._internalState.keys()).reverse();
      }
      _clone() {
        const traceState = new TraceStateImpl();
        traceState._internalState = new Map(this._internalState);
        return traceState;
      }
    };
    __name(TraceStateImpl, "TraceStateImpl");
    exports.TraceStateImpl = TraceStateImpl;
  }
});

// node_modules/@opentelemetry/api/build/src/trace/internal/utils.js
var require_utils2 = __commonJS({
  "node_modules/@opentelemetry/api/build/src/trace/internal/utils.js"(exports) {
    "use strict";
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createTraceState = void 0;
    var tracestate_impl_1 = require_tracestate_impl();
    function createTraceState(rawTraceState) {
      return new tracestate_impl_1.TraceStateImpl(rawTraceState);
    }
    __name(createTraceState, "createTraceState");
    exports.createTraceState = createTraceState;
  }
});

// node_modules/@opentelemetry/api/build/src/context-api.js
var require_context_api = __commonJS({
  "node_modules/@opentelemetry/api/build/src/context-api.js"(exports) {
    "use strict";
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.context = void 0;
    var context_1 = require_context2();
    exports.context = context_1.ContextAPI.getInstance();
  }
});

// node_modules/@opentelemetry/api/build/src/diag-api.js
var require_diag_api = __commonJS({
  "node_modules/@opentelemetry/api/build/src/diag-api.js"(exports) {
    "use strict";
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.diag = void 0;
    var diag_1 = require_diag();
    exports.diag = diag_1.DiagAPI.instance();
  }
});

// node_modules/@opentelemetry/api/build/src/metrics/NoopMeterProvider.js
var require_NoopMeterProvider = __commonJS({
  "node_modules/@opentelemetry/api/build/src/metrics/NoopMeterProvider.js"(exports) {
    "use strict";
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NOOP_METER_PROVIDER = exports.NoopMeterProvider = void 0;
    var NoopMeter_1 = require_NoopMeter();
    var NoopMeterProvider = class {
      getMeter(_name, _version, _options) {
        return NoopMeter_1.NOOP_METER;
      }
    };
    __name(NoopMeterProvider, "NoopMeterProvider");
    exports.NoopMeterProvider = NoopMeterProvider;
    exports.NOOP_METER_PROVIDER = new NoopMeterProvider();
  }
});

// node_modules/@opentelemetry/api/build/src/api/metrics.js
var require_metrics = __commonJS({
  "node_modules/@opentelemetry/api/build/src/api/metrics.js"(exports) {
    "use strict";
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MetricsAPI = void 0;
    var NoopMeterProvider_1 = require_NoopMeterProvider();
    var global_utils_1 = require_global_utils();
    var diag_1 = require_diag();
    var API_NAME = "metrics";
    var MetricsAPI = class {
      /** Empty private constructor prevents end users from constructing a new instance of the API */
      constructor() {
      }
      /** Get the singleton instance of the Metrics API */
      static getInstance() {
        if (!this._instance) {
          this._instance = new MetricsAPI();
        }
        return this._instance;
      }
      /**
       * Set the current global meter provider.
       * Returns true if the meter provider was successfully registered, else false.
       */
      setGlobalMeterProvider(provider) {
        return (0, global_utils_1.registerGlobal)(API_NAME, provider, diag_1.DiagAPI.instance());
      }
      /**
       * Returns the global meter provider.
       */
      getMeterProvider() {
        return (0, global_utils_1.getGlobal)(API_NAME) || NoopMeterProvider_1.NOOP_METER_PROVIDER;
      }
      /**
       * Returns a meter from the global meter provider.
       */
      getMeter(name, version, options) {
        return this.getMeterProvider().getMeter(name, version, options);
      }
      /** Remove the global meter provider */
      disable() {
        (0, global_utils_1.unregisterGlobal)(API_NAME, diag_1.DiagAPI.instance());
      }
    };
    __name(MetricsAPI, "MetricsAPI");
    exports.MetricsAPI = MetricsAPI;
  }
});

// node_modules/@opentelemetry/api/build/src/metrics-api.js
var require_metrics_api = __commonJS({
  "node_modules/@opentelemetry/api/build/src/metrics-api.js"(exports) {
    "use strict";
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.metrics = void 0;
    var metrics_1 = require_metrics();
    exports.metrics = metrics_1.MetricsAPI.getInstance();
  }
});

// node_modules/@opentelemetry/api/build/src/propagation/NoopTextMapPropagator.js
var require_NoopTextMapPropagator = __commonJS({
  "node_modules/@opentelemetry/api/build/src/propagation/NoopTextMapPropagator.js"(exports) {
    "use strict";
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NoopTextMapPropagator = void 0;
    var NoopTextMapPropagator = class {
      /** Noop inject function does nothing */
      inject(_context, _carrier) {
      }
      /** Noop extract function does nothing and returns the input context */
      extract(context, _carrier) {
        return context;
      }
      fields() {
        return [];
      }
    };
    __name(NoopTextMapPropagator, "NoopTextMapPropagator");
    exports.NoopTextMapPropagator = NoopTextMapPropagator;
  }
});

// node_modules/@opentelemetry/api/build/src/baggage/context-helpers.js
var require_context_helpers = __commonJS({
  "node_modules/@opentelemetry/api/build/src/baggage/context-helpers.js"(exports) {
    "use strict";
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.deleteBaggage = exports.setBaggage = exports.getActiveBaggage = exports.getBaggage = void 0;
    var context_1 = require_context2();
    var context_2 = require_context();
    var BAGGAGE_KEY = (0, context_2.createContextKey)("OpenTelemetry Baggage Key");
    function getBaggage(context) {
      return context.getValue(BAGGAGE_KEY) || void 0;
    }
    __name(getBaggage, "getBaggage");
    exports.getBaggage = getBaggage;
    function getActiveBaggage() {
      return getBaggage(context_1.ContextAPI.getInstance().active());
    }
    __name(getActiveBaggage, "getActiveBaggage");
    exports.getActiveBaggage = getActiveBaggage;
    function setBaggage(context, baggage) {
      return context.setValue(BAGGAGE_KEY, baggage);
    }
    __name(setBaggage, "setBaggage");
    exports.setBaggage = setBaggage;
    function deleteBaggage(context) {
      return context.deleteValue(BAGGAGE_KEY);
    }
    __name(deleteBaggage, "deleteBaggage");
    exports.deleteBaggage = deleteBaggage;
  }
});

// node_modules/@opentelemetry/api/build/src/api/propagation.js
var require_propagation = __commonJS({
  "node_modules/@opentelemetry/api/build/src/api/propagation.js"(exports) {
    "use strict";
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PropagationAPI = void 0;
    var global_utils_1 = require_global_utils();
    var NoopTextMapPropagator_1 = require_NoopTextMapPropagator();
    var TextMapPropagator_1 = require_TextMapPropagator();
    var context_helpers_1 = require_context_helpers();
    var utils_1 = require_utils();
    var diag_1 = require_diag();
    var API_NAME = "propagation";
    var NOOP_TEXT_MAP_PROPAGATOR = new NoopTextMapPropagator_1.NoopTextMapPropagator();
    var PropagationAPI = class {
      /** Empty private constructor prevents end users from constructing a new instance of the API */
      constructor() {
        this.createBaggage = utils_1.createBaggage;
        this.getBaggage = context_helpers_1.getBaggage;
        this.getActiveBaggage = context_helpers_1.getActiveBaggage;
        this.setBaggage = context_helpers_1.setBaggage;
        this.deleteBaggage = context_helpers_1.deleteBaggage;
      }
      /** Get the singleton instance of the Propagator API */
      static getInstance() {
        if (!this._instance) {
          this._instance = new PropagationAPI();
        }
        return this._instance;
      }
      /**
       * Set the current propagator.
       *
       * @returns true if the propagator was successfully registered, else false
       */
      setGlobalPropagator(propagator) {
        return (0, global_utils_1.registerGlobal)(API_NAME, propagator, diag_1.DiagAPI.instance());
      }
      /**
       * Inject context into a carrier to be propagated inter-process
       *
       * @param context Context carrying tracing data to inject
       * @param carrier carrier to inject context into
       * @param setter Function used to set values on the carrier
       */
      inject(context, carrier, setter = TextMapPropagator_1.defaultTextMapSetter) {
        return this._getGlobalPropagator().inject(context, carrier, setter);
      }
      /**
       * Extract context from a carrier
       *
       * @param context Context which the newly created context will inherit from
       * @param carrier Carrier to extract context from
       * @param getter Function used to extract keys from a carrier
       */
      extract(context, carrier, getter = TextMapPropagator_1.defaultTextMapGetter) {
        return this._getGlobalPropagator().extract(context, carrier, getter);
      }
      /**
       * Return a list of all fields which may be used by the propagator.
       */
      fields() {
        return this._getGlobalPropagator().fields();
      }
      /** Remove the global propagator */
      disable() {
        (0, global_utils_1.unregisterGlobal)(API_NAME, diag_1.DiagAPI.instance());
      }
      _getGlobalPropagator() {
        return (0, global_utils_1.getGlobal)(API_NAME) || NOOP_TEXT_MAP_PROPAGATOR;
      }
    };
    __name(PropagationAPI, "PropagationAPI");
    exports.PropagationAPI = PropagationAPI;
  }
});

// node_modules/@opentelemetry/api/build/src/propagation-api.js
var require_propagation_api = __commonJS({
  "node_modules/@opentelemetry/api/build/src/propagation-api.js"(exports) {
    "use strict";
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.propagation = void 0;
    var propagation_1 = require_propagation();
    exports.propagation = propagation_1.PropagationAPI.getInstance();
  }
});

// node_modules/@opentelemetry/api/build/src/api/trace.js
var require_trace = __commonJS({
  "node_modules/@opentelemetry/api/build/src/api/trace.js"(exports) {
    "use strict";
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TraceAPI = void 0;
    var global_utils_1 = require_global_utils();
    var ProxyTracerProvider_1 = require_ProxyTracerProvider();
    var spancontext_utils_1 = require_spancontext_utils();
    var context_utils_1 = require_context_utils();
    var diag_1 = require_diag();
    var API_NAME = "trace";
    var TraceAPI = class {
      /** Empty private constructor prevents end users from constructing a new instance of the API */
      constructor() {
        this._proxyTracerProvider = new ProxyTracerProvider_1.ProxyTracerProvider();
        this.wrapSpanContext = spancontext_utils_1.wrapSpanContext;
        this.isSpanContextValid = spancontext_utils_1.isSpanContextValid;
        this.deleteSpan = context_utils_1.deleteSpan;
        this.getSpan = context_utils_1.getSpan;
        this.getActiveSpan = context_utils_1.getActiveSpan;
        this.getSpanContext = context_utils_1.getSpanContext;
        this.setSpan = context_utils_1.setSpan;
        this.setSpanContext = context_utils_1.setSpanContext;
      }
      /** Get the singleton instance of the Trace API */
      static getInstance() {
        if (!this._instance) {
          this._instance = new TraceAPI();
        }
        return this._instance;
      }
      /**
       * Set the current global tracer.
       *
       * @returns true if the tracer provider was successfully registered, else false
       */
      setGlobalTracerProvider(provider) {
        const success = (0, global_utils_1.registerGlobal)(API_NAME, this._proxyTracerProvider, diag_1.DiagAPI.instance());
        if (success) {
          this._proxyTracerProvider.setDelegate(provider);
        }
        return success;
      }
      /**
       * Returns the global tracer provider.
       */
      getTracerProvider() {
        return (0, global_utils_1.getGlobal)(API_NAME) || this._proxyTracerProvider;
      }
      /**
       * Returns a tracer from the global tracer provider.
       */
      getTracer(name, version) {
        return this.getTracerProvider().getTracer(name, version);
      }
      /** Remove the global tracer provider */
      disable() {
        (0, global_utils_1.unregisterGlobal)(API_NAME, diag_1.DiagAPI.instance());
        this._proxyTracerProvider = new ProxyTracerProvider_1.ProxyTracerProvider();
      }
    };
    __name(TraceAPI, "TraceAPI");
    exports.TraceAPI = TraceAPI;
  }
});

// node_modules/@opentelemetry/api/build/src/trace-api.js
var require_trace_api = __commonJS({
  "node_modules/@opentelemetry/api/build/src/trace-api.js"(exports) {
    "use strict";
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.trace = void 0;
    var trace_1 = require_trace();
    exports.trace = trace_1.TraceAPI.getInstance();
  }
});

// node_modules/@opentelemetry/api/build/src/index.js
var require_src = __commonJS({
  "node_modules/@opentelemetry/api/build/src/index.js"(exports) {
    "use strict";
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.trace = exports.propagation = exports.metrics = exports.diag = exports.context = exports.INVALID_SPAN_CONTEXT = exports.INVALID_TRACEID = exports.INVALID_SPANID = exports.isValidSpanId = exports.isValidTraceId = exports.isSpanContextValid = exports.createTraceState = exports.TraceFlags = exports.SpanStatusCode = exports.SpanKind = exports.SamplingDecision = exports.ProxyTracerProvider = exports.ProxyTracer = exports.defaultTextMapSetter = exports.defaultTextMapGetter = exports.ValueType = exports.createNoopMeter = exports.DiagLogLevel = exports.DiagConsoleLogger = exports.ROOT_CONTEXT = exports.createContextKey = exports.baggageEntryMetadataFromString = void 0;
    var utils_1 = require_utils();
    Object.defineProperty(exports, "baggageEntryMetadataFromString", { enumerable: true, get: function() {
      return utils_1.baggageEntryMetadataFromString;
    } });
    var context_1 = require_context();
    Object.defineProperty(exports, "createContextKey", { enumerable: true, get: function() {
      return context_1.createContextKey;
    } });
    Object.defineProperty(exports, "ROOT_CONTEXT", { enumerable: true, get: function() {
      return context_1.ROOT_CONTEXT;
    } });
    var consoleLogger_1 = require_consoleLogger();
    Object.defineProperty(exports, "DiagConsoleLogger", { enumerable: true, get: function() {
      return consoleLogger_1.DiagConsoleLogger;
    } });
    var types_1 = require_types();
    Object.defineProperty(exports, "DiagLogLevel", { enumerable: true, get: function() {
      return types_1.DiagLogLevel;
    } });
    var NoopMeter_1 = require_NoopMeter();
    Object.defineProperty(exports, "createNoopMeter", { enumerable: true, get: function() {
      return NoopMeter_1.createNoopMeter;
    } });
    var Metric_1 = require_Metric();
    Object.defineProperty(exports, "ValueType", { enumerable: true, get: function() {
      return Metric_1.ValueType;
    } });
    var TextMapPropagator_1 = require_TextMapPropagator();
    Object.defineProperty(exports, "defaultTextMapGetter", { enumerable: true, get: function() {
      return TextMapPropagator_1.defaultTextMapGetter;
    } });
    Object.defineProperty(exports, "defaultTextMapSetter", { enumerable: true, get: function() {
      return TextMapPropagator_1.defaultTextMapSetter;
    } });
    var ProxyTracer_1 = require_ProxyTracer();
    Object.defineProperty(exports, "ProxyTracer", { enumerable: true, get: function() {
      return ProxyTracer_1.ProxyTracer;
    } });
    var ProxyTracerProvider_1 = require_ProxyTracerProvider();
    Object.defineProperty(exports, "ProxyTracerProvider", { enumerable: true, get: function() {
      return ProxyTracerProvider_1.ProxyTracerProvider;
    } });
    var SamplingResult_1 = require_SamplingResult();
    Object.defineProperty(exports, "SamplingDecision", { enumerable: true, get: function() {
      return SamplingResult_1.SamplingDecision;
    } });
    var span_kind_1 = require_span_kind();
    Object.defineProperty(exports, "SpanKind", { enumerable: true, get: function() {
      return span_kind_1.SpanKind;
    } });
    var status_1 = require_status();
    Object.defineProperty(exports, "SpanStatusCode", { enumerable: true, get: function() {
      return status_1.SpanStatusCode;
    } });
    var trace_flags_1 = require_trace_flags();
    Object.defineProperty(exports, "TraceFlags", { enumerable: true, get: function() {
      return trace_flags_1.TraceFlags;
    } });
    var utils_2 = require_utils2();
    Object.defineProperty(exports, "createTraceState", { enumerable: true, get: function() {
      return utils_2.createTraceState;
    } });
    var spancontext_utils_1 = require_spancontext_utils();
    Object.defineProperty(exports, "isSpanContextValid", { enumerable: true, get: function() {
      return spancontext_utils_1.isSpanContextValid;
    } });
    Object.defineProperty(exports, "isValidTraceId", { enumerable: true, get: function() {
      return spancontext_utils_1.isValidTraceId;
    } });
    Object.defineProperty(exports, "isValidSpanId", { enumerable: true, get: function() {
      return spancontext_utils_1.isValidSpanId;
    } });
    var invalid_span_constants_1 = require_invalid_span_constants();
    Object.defineProperty(exports, "INVALID_SPANID", { enumerable: true, get: function() {
      return invalid_span_constants_1.INVALID_SPANID;
    } });
    Object.defineProperty(exports, "INVALID_TRACEID", { enumerable: true, get: function() {
      return invalid_span_constants_1.INVALID_TRACEID;
    } });
    Object.defineProperty(exports, "INVALID_SPAN_CONTEXT", { enumerable: true, get: function() {
      return invalid_span_constants_1.INVALID_SPAN_CONTEXT;
    } });
    var context_api_1 = require_context_api();
    Object.defineProperty(exports, "context", { enumerable: true, get: function() {
      return context_api_1.context;
    } });
    var diag_api_1 = require_diag_api();
    Object.defineProperty(exports, "diag", { enumerable: true, get: function() {
      return diag_api_1.diag;
    } });
    var metrics_api_1 = require_metrics_api();
    Object.defineProperty(exports, "metrics", { enumerable: true, get: function() {
      return metrics_api_1.metrics;
    } });
    var propagation_api_1 = require_propagation_api();
    Object.defineProperty(exports, "propagation", { enumerable: true, get: function() {
      return propagation_api_1.propagation;
    } });
    var trace_api_1 = require_trace_api();
    Object.defineProperty(exports, "trace", { enumerable: true, get: function() {
      return trace_api_1.trace;
    } });
    exports.default = {
      context: context_api_1.context,
      diag: diag_api_1.diag,
      metrics: metrics_api_1.metrics,
      propagation: propagation_api_1.propagation,
      trace: trace_api_1.trace
    };
  }
});

// node_modules/@sentry/cloudflare/build/esm/opentelemetry/tracer.js
function setupOpenTelemetryTracer() {
  import_api2.trace.setGlobalTracerProvider(new SentryCloudflareTraceProvider());
}
var import_api2, SentryCloudflareTraceProvider, SentryCloudflareTracer;
var init_tracer = __esm({
  "node_modules/@sentry/cloudflare/build/esm/opentelemetry/tracer.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    import_api2 = __toESM(require_src(), 1);
    init_esm();
    __name(setupOpenTelemetryTracer, "setupOpenTelemetryTracer");
    SentryCloudflareTraceProvider = class {
      constructor() {
        this._tracers = /* @__PURE__ */ new Map();
      }
      getTracer(name, version, options) {
        const key = `${name}@${version || ""}:${options?.schemaUrl || ""}`;
        if (!this._tracers.has(key)) {
          this._tracers.set(key, new SentryCloudflareTracer());
        }
        return this._tracers.get(key);
      }
    };
    __name(SentryCloudflareTraceProvider, "SentryCloudflareTraceProvider");
    SentryCloudflareTracer = class {
      startSpan(name, options) {
        return startInactiveSpan({
          ...options,
          name,
          attributes: {
            ...options?.attributes,
            "sentry.cloudflare_tracer": true
          }
        });
      }
      startActiveSpan(name, options, context, fn) {
        const opts = typeof options === "object" && options !== null ? options : {};
        const spanOpts = {
          ...opts,
          name,
          attributes: {
            ...opts.attributes,
            "sentry.cloudflare_tracer": true
          }
        };
        const callback = typeof options === "function" ? options : typeof context === "function" ? context : typeof fn === "function" ? fn : () => {
        };
        return startSpanManual(spanOpts, callback);
      }
    };
    __name(SentryCloudflareTracer, "SentryCloudflareTracer");
  }
});

// node_modules/@sentry/cloudflare/build/esm/transport.js
function makeCloudflareTransport(options) {
  function makeRequest(request) {
    const requestOptions = {
      body: request.body,
      method: "POST",
      headers: options.headers,
      ...options.fetchOptions
    };
    return suppressTracing(() => {
      return (options.fetch ?? fetch)(options.url, requestOptions).then(async (response) => {
        try {
          await response.text();
        } catch {
        }
        return {
          statusCode: response.status,
          headers: {
            "x-sentry-rate-limits": response.headers.get("X-Sentry-Rate-Limits"),
            "retry-after": response.headers.get("Retry-After")
          }
        };
      });
    });
  }
  __name(makeRequest, "makeRequest");
  return createTransport(options, makeRequest, new IsolatedPromiseBuffer(options.bufferSize));
}
var DEFAULT_TRANSPORT_BUFFER_SIZE2, IsolatedPromiseBuffer;
var init_transport = __esm({
  "node_modules/@sentry/cloudflare/build/esm/transport.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_esm();
    DEFAULT_TRANSPORT_BUFFER_SIZE2 = 30;
    IsolatedPromiseBuffer = class {
      constructor(_bufferSize = DEFAULT_TRANSPORT_BUFFER_SIZE2) {
        this.$ = [];
        this._taskProducers = [];
        this._bufferSize = _bufferSize;
      }
      /**
       * @inheritdoc
       */
      add(taskProducer) {
        if (this._taskProducers.length >= this._bufferSize) {
          return Promise.reject(SENTRY_BUFFER_FULL_ERROR);
        }
        this._taskProducers.push(taskProducer);
        return Promise.resolve({});
      }
      /**
       * @inheritdoc
       */
      drain(timeout) {
        const oldTaskProducers = [...this._taskProducers];
        this._taskProducers = [];
        return new Promise((resolve2) => {
          const timer = setTimeout(() => {
            if (timeout && timeout > 0) {
              resolve2(false);
            }
          }, timeout);
          Promise.all(
            oldTaskProducers.map(
              (taskProducer) => taskProducer().then(null, () => {
              })
            )
          ).then(() => {
            clearTimeout(timer);
            resolve2(true);
          });
        });
      }
    };
    __name(IsolatedPromiseBuffer, "IsolatedPromiseBuffer");
    __name(makeCloudflareTransport, "makeCloudflareTransport");
  }
});

// node_modules/@sentry/cloudflare/build/esm/vendor/stacktrace.js
function workersStackLineParser(getModule2) {
  const [arg1, arg2] = nodeStackLineParser(getModule2);
  const fn = /* @__PURE__ */ __name((line) => {
    const result = arg2(line);
    if (result) {
      const filename = result.filename;
      result.abs_path = filename !== void 0 && !filename.startsWith("/") ? `/${filename}` : filename;
      result.in_app = filename !== void 0;
    }
    return result;
  }, "fn");
  return [arg1, fn];
}
function getModule(filename) {
  if (!filename) {
    return;
  }
  return basename(filename, ".js");
}
var defaultStackParser;
var init_stacktrace2 = __esm({
  "node_modules/@sentry/cloudflare/build/esm/vendor/stacktrace.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_esm();
    __name(workersStackLineParser, "workersStackLineParser");
    __name(getModule, "getModule");
    defaultStackParser = createStackParser(workersStackLineParser(getModule));
  }
});

// node_modules/@sentry/cloudflare/build/esm/sdk.js
function getDefaultIntegrations(options) {
  const cookiesEnabled = options.sendDefaultPii || options.dataCollection?.cookies != null;
  return [
    // The Dedupe integration should not be used in workflows because we want to
    // capture all step failures, even if they are the same error.
    ...options.enableDedupe === false ? [] : [dedupeIntegration()],
    // TODO(v11): Replace with `eventFiltersIntegration` once we remove the deprecated `inboundFiltersIntegration`
    // eslint-disable-next-line typescript/no-deprecated
    inboundFiltersIntegration(),
    functionToStringIntegration(),
    conversationIdIntegration(),
    linkedErrorsIntegration(),
    fetchIntegration(),
    // eslint-disable-next-line typescript/no-deprecated
    honoIntegration(),
    httpServerIntegration(),
    requestDataIntegration(cookiesEnabled ? void 0 : { include: { cookies: false } }),
    consoleIntegration()
  ];
}
function init(options) {
  if (options.defaultIntegrations === void 0) {
    options.defaultIntegrations = getDefaultIntegrations(options);
  }
  const flushLock = options.ctx ? makeFlushLock(options.ctx) : void 0;
  delete options.ctx;
  const clientOptions = {
    ...options,
    stackParser: stackParserFromStackParserOptions(options.stackParser || defaultStackParser),
    integrations: getIntegrationsToSetup(options),
    transport: options.transport || makeCloudflareTransport,
    flushLock
  };
  if (!options.skipOpenTelemetrySetup) {
    setupOpenTelemetryTracer();
  }
  return initAndBind(CloudflareClient, clientOptions);
}
var init_sdk2 = __esm({
  "node_modules/@sentry/cloudflare/build/esm/sdk.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_esm();
    init_client2();
    init_flush();
    init_httpServer();
    init_fetch3();
    init_hono();
    init_tracer();
    init_transport();
    init_stacktrace2();
    __name(getDefaultIntegrations, "getDefaultIntegrations");
    __name(init, "init");
  }
});

// node_modules/@sentry/cloudflare/build/esm/utils/traceLinks.js
function getTraceLinkKey(methodName) {
  return `${SENTRY_TRACE_LINK_KEY_PREFIX}${methodName}`;
}
function storeSpanContext(originalStorage, methodName) {
  try {
    const activeSpan = getActiveSpan();
    if (activeSpan) {
      const spanContext = activeSpan.spanContext();
      const storedContext = {
        traceId: spanContext.traceId,
        spanId: spanContext.spanId,
        sampled: spanIsSampled(activeSpan)
      };
      originalStorage.kv.put(getTraceLinkKey(methodName), storedContext);
    }
  } catch (error2) {
    DEBUG_BUILD2 && debug.log(`[CloudflareClient] Error storing span context for method ${methodName}`, error2);
  }
}
function getStoredSpanContext(originalStorage, methodName) {
  try {
    return originalStorage.kv.get(getTraceLinkKey(methodName));
  } catch (error2) {
    DEBUG_BUILD2 && debug.log(`[CloudflareClient] Error retrieving span context for method ${methodName}`, error2);
    return void 0;
  }
}
function buildSpanLinks(storedContext) {
  return [
    {
      context: {
        traceId: storedContext.traceId,
        spanId: storedContext.spanId,
        traceFlags: storedContext.sampled ? import_api3.TraceFlags.SAMPLED : import_api3.TraceFlags.NONE
      },
      attributes: {
        [SEMANTIC_LINK_ATTRIBUTE_LINK_TYPE]: "previous_trace"
      }
    }
  ];
}
var import_api3, SENTRY_TRACE_LINK_KEY_PREFIX;
var init_traceLinks = __esm({
  "node_modules/@sentry/cloudflare/build/esm/utils/traceLinks.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    import_api3 = __toESM(require_src(), 1);
    init_esm();
    init_debug_build2();
    SENTRY_TRACE_LINK_KEY_PREFIX = "__SENTRY_TRACE_LINK__";
    __name(getTraceLinkKey, "getTraceLinkKey");
    __name(storeSpanContext, "storeSpanContext");
    __name(getStoredSpanContext, "getStoredSpanContext");
    __name(buildSpanLinks, "buildSpanLinks");
  }
});

// node_modules/@sentry/cloudflare/build/esm/instrumentations/instrumentDurableObjectSyncKvStorage.js
function instrumentDurableObjectSyncKvStorage(syncKv) {
  return new Proxy(syncKv, {
    get(target, prop, _receiver) {
      const original = Reflect.get(target, prop, target);
      if (typeof original !== "function") {
        return original;
      }
      const methodName = prop;
      if (!SYNC_KV_METHODS_TO_INSTRUMENT.includes(methodName)) {
        return original.bind(target);
      }
      return function(...args) {
        return startSpan(
          {
            name: `durable_object_storage_kv_${methodName}`,
            op: "db",
            attributes: {
              [SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: "auto.db.cloudflare.durable_object",
              // keeping the value as close as possible to the Cloudflare Worker KV instrumentation
              // https://github.com/cloudflare/workerd/blob/6b8b11787e2b2a800ab0edd0690bfab3857b0529/src/workerd/api/sync-kv.c%2B%2B#L19
              "db.system.name": "cloudflare-durable-object-sql",
              "db.operation.name": methodName
            }
          },
          () => {
            return original.apply(target, args);
          }
        );
      };
    }
  });
}
var SYNC_KV_METHODS_TO_INSTRUMENT;
var init_instrumentDurableObjectSyncKvStorage = __esm({
  "node_modules/@sentry/cloudflare/build/esm/instrumentations/instrumentDurableObjectSyncKvStorage.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_esm();
    SYNC_KV_METHODS_TO_INSTRUMENT = ["get", "put", "delete", "list"];
    __name(instrumentDurableObjectSyncKvStorage, "instrumentDurableObjectSyncKvStorage");
  }
});

// node_modules/@sentry/cloudflare/build/esm/utils/internalSqlQuery.js
function targetsCloudflareInternalTable(querySummary, allowlist) {
  if (!querySummary) {
    return false;
  }
  const [, ...tables] = querySummary.split(" ");
  return tables.some((table) => {
    if (!table.toLowerCase().startsWith("cf_")) {
      return false;
    }
    return !allowlist?.length || !stringMatchesSomePattern(table, allowlist, true);
  });
}
var init_internalSqlQuery = __esm({
  "node_modules/@sentry/cloudflare/build/esm/utils/internalSqlQuery.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_esm();
    __name(targetsCloudflareInternalTable, "targetsCloudflareInternalTable");
  }
});

// node_modules/@sentry/cloudflare/build/esm/instrumentations/instrumentSqlStorage.js
function instrumentSqlStorage(sql) {
  return new Proxy(sql, {
    get(target, prop, _receiver) {
      const original = Reflect.get(target, prop, target);
      if (prop !== "exec" || typeof original !== "function") {
        return original;
      }
      return function(...args) {
        const [query, ...bindings] = args;
        const sanitizedQuery = _sanitizeSqlQuery(query);
        const querySummary = getSqlQuerySummary(sanitizedQuery);
        const allowlist = getClient()?.getOptions()?.durableObjectSqlSpanAllowlist;
        if (targetsCloudflareInternalTable(querySummary, allowlist)) {
          return original.apply(target, args);
        }
        return startSpan(
          {
            op: "db.query",
            name: querySummary || sanitizedQuery,
            attributes: {
              [SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: "auto.db.cloudflare.durable_object.sql",
              "db.system.name": "cloudflare-durable-object-sql",
              "db.operation.name": "exec",
              "db.query.text": sanitizedQuery,
              "db.query.summary": querySummary,
              "cloudflare.durable_object.query.bindings": bindings.length
            }
          },
          () => original.apply(target, args)
        );
      };
    }
  });
}
var init_instrumentSqlStorage = __esm({
  "node_modules/@sentry/cloudflare/build/esm/instrumentations/instrumentSqlStorage.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_esm();
    init_internalSqlQuery();
    __name(instrumentSqlStorage, "instrumentSqlStorage");
  }
});

// node_modules/@sentry/cloudflare/build/esm/instrumentations/instrumentDurableObjectStorage.js
function instrumentDurableObjectStorage(storage, waitUntil) {
  return new Proxy(storage, {
    get(target, prop, _receiver) {
      const original = Reflect.get(target, prop, target);
      if (prop === "kv" && original != null && "get" in original && "put" in original) {
        return instrumentDurableObjectSyncKvStorage(original);
      }
      if (prop === "sql" && original != null && "databaseSize" in original && "exec" in original) {
        return instrumentSqlStorage(original);
      }
      if (typeof original !== "function") {
        return original;
      }
      const methodName = prop;
      if (!STORAGE_METHODS_TO_INSTRUMENT.includes(methodName)) {
        return original.bind(target);
      }
      return function(...args) {
        return startSpan(
          {
            // Use underscore naming to match Cloudflare's native instrumentation (e.g., "durable_object_storage_get")
            name: `durable_object_storage_${methodName}`,
            op: "db",
            attributes: {
              [SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: "auto.db.cloudflare.durable_object",
              "db.system.name": "cloudflare.durable_object.storage",
              "db.operation.name": methodName
            }
          },
          () => {
            const teardown = /* @__PURE__ */ __name(async () => {
              if (methodName === "setAlarm") {
                storeSpanContext(target, "alarm");
              }
            }, "teardown");
            const result = original.apply(target, args);
            if (!isThenable(result)) {
              waitUntil?.(teardown());
              return result;
            }
            return result.then(
              (res) => {
                waitUntil?.(teardown());
                return res;
              },
              (e) => {
                throw e;
              }
            );
          }
        );
      };
    }
  });
}
var STORAGE_METHODS_TO_INSTRUMENT;
var init_instrumentDurableObjectStorage = __esm({
  "node_modules/@sentry/cloudflare/build/esm/instrumentations/instrumentDurableObjectStorage.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_esm();
    init_traceLinks();
    init_instrumentDurableObjectSyncKvStorage();
    init_instrumentSqlStorage();
    STORAGE_METHODS_TO_INSTRUMENT = ["get", "put", "delete", "list", "setAlarm", "getAlarm", "deleteAlarm"];
    __name(instrumentDurableObjectStorage, "instrumentDurableObjectStorage");
  }
});

// node_modules/@sentry/cloudflare/build/esm/utils/instrumentContext.js
function instrumentContext(ctx) {
  if (!ctx)
    return ctx;
  const overrides = /* @__PURE__ */ new Map();
  const contextPrototype = Object.getPrototypeOf(ctx);
  const prototypeMethodNames = Object.getOwnPropertyNames(contextPrototype);
  const ownPropertyNames = Object.getOwnPropertyNames(ctx);
  const instrumented2 = /* @__PURE__ */ new Set(["constructor"]);
  const descriptors = [...ownPropertyNames, ...prototypeMethodNames].reduce(
    (prevDescriptors, methodName) => {
      if (instrumented2.has(methodName))
        return prevDescriptors;
      if (typeof ctx[methodName] !== "function")
        return prevDescriptors;
      instrumented2.add(methodName);
      const overridableDescriptor = makeOverridableDescriptor(overrides, ctx, methodName);
      return {
        ...prevDescriptors,
        [methodName]: overridableDescriptor
      };
    },
    {}
  );
  if ("storage" in ctx && ctx.storage) {
    const originalStorage = ctx.storage;
    const waitUntil = "waitUntil" in ctx && typeof ctx.waitUntil === "function" ? ctx.waitUntil.bind(ctx) : void 0;
    let instrumentedStorage;
    descriptors.storage = {
      configurable: true,
      enumerable: true,
      get: () => {
        if (!instrumentedStorage) {
          instrumentedStorage = instrumentDurableObjectStorage(originalStorage, waitUntil);
        }
        return instrumentedStorage;
      }
    };
    descriptors.originalStorage = {
      configurable: true,
      enumerable: false,
      get: () => originalStorage
    };
  }
  return Object.create(ctx, descriptors);
}
function makeOverridableDescriptor(store, ctx, method) {
  return {
    configurable: true,
    enumerable: true,
    set: (newValue) => {
      if (typeof newValue == "function") {
        store.set(method, newValue);
        return;
      }
      Reflect.set(ctx, method, newValue);
    },
    get: () => {
      if (store.has(method))
        return store.get(method);
      const methodFunction = Reflect.get(ctx, method);
      if (typeof methodFunction !== "function")
        return methodFunction;
      return methodFunction.bind(ctx);
    }
  };
}
var init_instrumentContext = __esm({
  "node_modules/@sentry/cloudflare/build/esm/utils/instrumentContext.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_instrumentDurableObjectStorage();
    __name(instrumentContext, "instrumentContext");
    __name(makeOverridableDescriptor, "makeOverridableDescriptor");
  }
});

// node_modules/@sentry/cloudflare/build/esm/utils/isBinding.js
function isJSRPC(item) {
  try {
    return !!item[`__some_property_that_will_never_exist__${Math.random()}`];
  } catch {
    return false;
  }
}
function isDurableObjectNamespace(item) {
  return item != null && isNotJSRPC(item) && typeof item.idFromName === "function";
}
function isQueue(item) {
  return item != null && isNotJSRPC(item) && typeof item.send === "function" && typeof item.sendBatch === "function";
}
function isD1Database(item) {
  return item != null && isNotJSRPC(item) && typeof item.prepare === "function" && typeof item.batch === "function" && typeof item.exec === "function";
}
function isAiBinding(item) {
  return item != null && isNotJSRPC(item) && typeof item.run === "function" && typeof item.gateway === "function" && typeof item.toMarkdown === "function";
}
function isR2Bucket(item) {
  return item != null && isNotJSRPC(item) && typeof item.head === "function" && typeof item.put === "function" && typeof item.createMultipartUpload === "function";
}
function isRateLimit(item) {
  return item != null && isNotJSRPC(item) && typeof item.limit === "function";
}
var isNotJSRPC;
var init_isBinding = __esm({
  "node_modules/@sentry/cloudflare/build/esm/utils/isBinding.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    __name(isJSRPC, "isJSRPC");
    isNotJSRPC = /* @__PURE__ */ __name((item) => !isJSRPC(item), "isNotJSRPC");
    __name(isDurableObjectNamespace, "isDurableObjectNamespace");
    __name(isQueue, "isQueue");
    __name(isD1Database, "isD1Database");
    __name(isAiBinding, "isAiBinding");
    __name(isR2Bucket, "isR2Bucket");
    __name(isRateLimit, "isRateLimit");
  }
});

// node_modules/@sentry/cloudflare/build/esm/instrumentations/worker/instrumentD1.js
function instrumentD1PreparedStatementQueries(statement, query) {
  if (patchedStatement.has(statement)) {
    return statement;
  }
  statement.first = new Proxy(statement.first, {
    apply(target, thisArg, args) {
      return startSpan(createStartSpanOptions(query, "first"), async () => {
        const res = await Reflect.apply(target, thisArg, args);
        createD1Breadcrumb(query, "first");
        return res;
      });
    }
  });
  statement.run = new Proxy(statement.run, {
    apply(target, thisArg, args) {
      return startSpan(createStartSpanOptions(query, "run"), async (span) => {
        const d1Response = await Reflect.apply(target, thisArg, args);
        applyD1ReturnObjectToSpan(span, d1Response);
        createD1Breadcrumb(query, "run", d1Response);
        return d1Response;
      });
    }
  });
  statement.all = new Proxy(statement.all, {
    apply(target, thisArg, args) {
      return startSpan(createStartSpanOptions(query, "all"), async (span) => {
        const d1Result = await Reflect.apply(target, thisArg, args);
        applyD1ReturnObjectToSpan(span, d1Result);
        createD1Breadcrumb(query, "all", d1Result);
        return d1Result;
      });
    }
  });
  statement.raw = new Proxy(statement.raw, {
    apply(target, thisArg, args) {
      return startSpan(createStartSpanOptions(query, "raw"), async () => {
        const res = await Reflect.apply(target, thisArg, args);
        createD1Breadcrumb(query, "raw");
        return res;
      });
    }
  });
  patchedStatement.add(statement);
  return statement;
}
function instrumentD1PreparedStatement(statement, query) {
  statement.bind = new Proxy(statement.bind, {
    apply(target, thisArg, args) {
      return instrumentD1PreparedStatementQueries(Reflect.apply(target, thisArg, args), query);
    }
  });
  return instrumentD1PreparedStatementQueries(statement, query);
}
function applyD1ReturnObjectToSpan(span, d1Result) {
  if (!d1Result.success) {
    span.setStatus({ code: SPAN_STATUS_ERROR });
  }
  span.setAttributes(getAttributesFromD1Response(d1Result));
}
function getAttributesFromD1Response(d1Result) {
  return {
    "cloudflare.d1.duration": d1Result.meta.duration,
    "cloudflare.d1.rows_read": d1Result.meta.rows_read,
    "cloudflare.d1.rows_written": d1Result.meta.rows_written
  };
}
function createD1Breadcrumb(query, type, d1Result) {
  addBreadcrumb({
    category: "query",
    message: query,
    data: {
      ...d1Result ? getAttributesFromD1Response(d1Result) : {},
      "db.operation.name": type
    }
  });
}
function createStartSpanOptions(query, type) {
  return {
    op: "db.query",
    name: query,
    attributes: {
      "db.system.name": "cloudflare-d1",
      "db.operation.name": type,
      "db.query.text": query,
      [SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: "auto.db.cloudflare.d1"
    }
  };
}
function instrumentPrepare(prepare) {
  return new Proxy(prepare, {
    apply(target, thisArg, args) {
      const [query] = args;
      return instrumentD1PreparedStatement(Reflect.apply(target, thisArg, args), query);
    }
  });
}
function instrumentBatch(batch) {
  return new Proxy(batch, {
    apply(target, thisArg, args) {
      const statements = args[0];
      const queryText = statements.map((statement) => statement.statement ?? "").filter(Boolean).join("\n");
      return startSpan(
        {
          op: "db.query",
          name: "D1 batch",
          attributes: {
            "db.system.name": "cloudflare-d1",
            "db.operation.name": "batch",
            "db.query.text": queryText || void 0,
            "db.operation.batch.size": statements.length,
            [SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: "auto.db.cloudflare.d1"
          }
        },
        async () => {
          const res = await Reflect.apply(target, thisArg, args);
          createD1Breadcrumb("D1 batch", "batch");
          return res;
        }
      );
    }
  });
}
function instrumentD1Session(session) {
  session.prepare = instrumentPrepare(session.prepare);
  session.batch = instrumentBatch(session.batch);
  return session;
}
function _instrumentD1(db) {
  db.prepare = instrumentPrepare(db.prepare);
  db.batch = instrumentBatch(db.batch);
  db.exec = new Proxy(db.exec, {
    apply(target, thisArg, args) {
      const [query] = args;
      return startSpan(createStartSpanOptions(query, "exec"), async () => {
        const res = await Reflect.apply(target, thisArg, args);
        createD1Breadcrumb(query, "exec");
        return res;
      });
    }
  });
  if ("withSession" in db && typeof db.withSession === "function") {
    db.withSession = new Proxy(db.withSession, {
      apply(target, thisArg, args) {
        return instrumentD1Session(Reflect.apply(target, thisArg, args));
      }
    });
  }
  return db;
}
function instrumentD1(db) {
  return ensureInstrumented(db, _instrumentD1);
}
var patchedStatement;
var init_instrumentD1 = __esm({
  "node_modules/@sentry/cloudflare/build/esm/instrumentations/worker/instrumentD1.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_esm();
    init_instrument();
    patchedStatement = /* @__PURE__ */ new WeakSet();
    __name(instrumentD1PreparedStatementQueries, "instrumentD1PreparedStatementQueries");
    __name(instrumentD1PreparedStatement, "instrumentD1PreparedStatement");
    __name(applyD1ReturnObjectToSpan, "applyD1ReturnObjectToSpan");
    __name(getAttributesFromD1Response, "getAttributesFromD1Response");
    __name(createD1Breadcrumb, "createD1Breadcrumb");
    __name(createStartSpanOptions, "createStartSpanOptions");
    __name(instrumentPrepare, "instrumentPrepare");
    __name(instrumentBatch, "instrumentBatch");
    __name(instrumentD1Session, "instrumentD1Session");
    __name(_instrumentD1, "_instrumentD1");
    __name(instrumentD1, "instrumentD1");
  }
});

// node_modules/@sentry/cloudflare/build/esm/utils/rpcMeta.js
function isSentryRpcMeta(value) {
  if (!isObjectLike(value) || !(SENTRY_RPC_META_KEY in value)) {
    return false;
  }
  return isObjectLike(value[SENTRY_RPC_META_KEY]);
}
function appendRpcMeta(args) {
  const traceData = getTraceData();
  if (!traceData["sentry-trace"]) {
    return args;
  }
  return [...args, { [SENTRY_RPC_META_KEY]: traceData }];
}
function extractRpcMeta(args) {
  if (args.length === 0) {
    return { args };
  }
  const last = args[args.length - 1];
  if (isSentryRpcMeta(last)) {
    return {
      args: args.slice(0, -1),
      rpcMeta: last.__sentry_rpc_meta__
    };
  }
  return { args };
}
var SENTRY_RPC_META_KEY;
var init_rpcMeta = __esm({
  "node_modules/@sentry/cloudflare/build/esm/utils/rpcMeta.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_esm();
    SENTRY_RPC_META_KEY = "__sentry_rpc_meta__";
    __name(isSentryRpcMeta, "isSentryRpcMeta");
    __name(appendRpcMeta, "appendRpcMeta");
    __name(extractRpcMeta, "extractRpcMeta");
  }
});

// node_modules/@sentry/cloudflare/build/esm/utils/rpcOptions.js
function getEffectiveRpcPropagation(options) {
  const { enableRpcTracePropagation, instrumentPrototypeMethods } = options;
  if (enableRpcTracePropagation !== void 0) {
    if (instrumentPrototypeMethods !== void 0) {
      DEBUG_BUILD2 && debug.warn(
        "[Sentry] Both `enableRpcTracePropagation` and `instrumentPrototypeMethods` are set. Using `enableRpcTracePropagation` and ignoring `instrumentPrototypeMethods`."
      );
    }
    return enableRpcTracePropagation;
  }
  if (instrumentPrototypeMethods !== void 0) {
    DEBUG_BUILD2 && debug.warn(
      "[Sentry] `instrumentPrototypeMethods` is deprecated and will be removed in a future major version. Please use `enableRpcTracePropagation` instead."
    );
    return instrumentPrototypeMethods === true || Array.isArray(instrumentPrototypeMethods) && instrumentPrototypeMethods.length > 0;
  }
  return false;
}
var init_rpcOptions = __esm({
  "node_modules/@sentry/cloudflare/build/esm/utils/rpcOptions.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_esm();
    init_debug_build2();
    __name(getEffectiveRpcPropagation, "getEffectiveRpcPropagation");
  }
});

// node_modules/@sentry/cloudflare/build/esm/instrumentations/worker/instrumentFetcher.js
function instrumentFetcher(fetchFn) {
  return function(input, init2) {
    const headers = _INTERNAL_getTracingHeadersForFetchRequest(input, { headers: init2?.headers });
    if (input instanceof Request && init2 === void 0) {
      if (!headers) {
        return fetchFn(input);
      }
      const requestWithTracing = new Request(input, { headers });
      return fetchFn(requestWithTracing);
    }
    const mergedInit = {
      ...init2,
      ...headers ? { headers } : {}
    };
    return fetchFn(input, mergedInit);
  };
}
var init_instrumentFetcher = __esm({
  "node_modules/@sentry/cloudflare/build/esm/instrumentations/worker/instrumentFetcher.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_esm();
    __name(instrumentFetcher, "instrumentFetcher");
  }
});

// node_modules/@sentry/cloudflare/build/esm/instrumentations/instrumentDurableObjectNamespace.js
function instrumentDurableObjectNamespace(namespace) {
  return new Proxy(namespace, {
    get(target, prop, _receiver) {
      const value = Reflect.get(target, prop);
      if (typeof value !== "function") {
        return value;
      }
      if (prop === "get" || prop === "getByName") {
        return function(...args) {
          const stub = Reflect.apply(value, target, args);
          return instrumentDurableObjectStub(stub);
        };
      }
      return value.bind(target);
    }
  });
}
function instrumentDurableObjectStub(stub) {
  return new Proxy(stub, {
    get(target, prop) {
      const value = Reflect.get(target, prop);
      if (prop === "fetch" && typeof value === "function") {
        return instrumentFetcher((...args) => Reflect.apply(value, target, args));
      }
      if (typeof value === "function" && typeof prop === "string" && !STUB_NON_RPC_METHODS.has(prop)) {
        return (...args) => Reflect.apply(value, target, appendRpcMeta(args));
      }
      return value;
    }
  });
}
var STUB_NON_RPC_METHODS;
var init_instrumentDurableObjectNamespace = __esm({
  "node_modules/@sentry/cloudflare/build/esm/instrumentations/instrumentDurableObjectNamespace.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_rpcMeta();
    init_instrumentFetcher();
    STUB_NON_RPC_METHODS = /* @__PURE__ */ new Set(["fetch", "connect", "dup"]);
    __name(instrumentDurableObjectNamespace, "instrumentDurableObjectNamespace");
    __name(instrumentDurableObjectStub, "instrumentDurableObjectStub");
  }
});

// node_modules/@sentry/cloudflare/build/esm/instrumentations/worker/instrumentQueueProducer.js
function startPublishSpan(options, callback) {
  const { bindingName, bodySize, messageCount } = options;
  return startSpan(
    {
      op: "queue.publish",
      name: `send ${bindingName}`,
      attributes: {
        "messaging.system": "cloudflare",
        "messaging.destination.name": bindingName,
        "messaging.operation.type": "send",
        "messaging.operation.name": "send",
        ...messageCount !== void 0 && { "messaging.batch.message_count": messageCount },
        "messaging.message.body.size": bodySize,
        [SEMANTIC_ATTRIBUTE_SENTRY_OP]: "queue.publish",
        [SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: ORIGIN
      }
    },
    callback
  );
}
function getBodySize(body) {
  if (body == null) {
    return void 0;
  }
  if (typeof body === "string") {
    return new TextEncoder().encode(body).byteLength;
  }
  if (body instanceof ArrayBuffer) {
    return body.byteLength;
  }
  if (ArrayBuffer.isView(body)) {
    return body.byteLength;
  }
  try {
    return new TextEncoder().encode(JSON.stringify(body)).byteLength;
  } catch {
    return void 0;
  }
}
function instrumentQueueProducer(queue, bindingName) {
  return new Proxy(queue, {
    get(target, prop, receiver) {
      if (prop === "send") {
        const original = Reflect.get(target, prop, receiver);
        return function(message, options) {
          return startPublishSpan(
            { bindingName, bodySize: getBodySize(message) },
            () => Reflect.apply(original, target, [message, options])
          );
        };
      }
      if (prop === "sendBatch") {
        const original = Reflect.get(target, prop, receiver);
        return function(messages, options) {
          const messageArray = Array.from(messages);
          const totalBodySize = messageArray.reduce((acc, m) => {
            const size = getBodySize(m.body);
            if (size === void 0) {
              return acc;
            }
            return (acc ?? 0) + size;
          }, void 0);
          return startPublishSpan(
            { bindingName, bodySize: totalBodySize, messageCount: messageArray.length },
            () => Reflect.apply(original, target, [messageArray, options])
          );
        };
      }
      return Reflect.get(target, prop, receiver);
    }
  });
}
var ORIGIN;
var init_instrumentQueueProducer = __esm({
  "node_modules/@sentry/cloudflare/build/esm/instrumentations/worker/instrumentQueueProducer.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_esm();
    ORIGIN = "auto.faas.cloudflare.queue";
    __name(startPublishSpan, "startPublishSpan");
    __name(getBodySize, "getBodySize");
    __name(instrumentQueueProducer, "instrumentQueueProducer");
  }
});

// node_modules/@sentry/cloudflare/build/esm/instrumentations/worker/instrumentR2.js
function isR2ListOptions(key) {
  return isObjectLike(key) && !Array.isArray(key);
}
function createSpanOptions(bindingName, r2Op, key) {
  const { spanName, op, operation } = R2_OPERATIONS[r2Op];
  const requestKey = Array.isArray(key) ? key.join(", ") : typeof key === "string" ? key : void 0;
  return {
    op,
    name: spanName,
    attributes: {
      "cloudflare.r2.operation": operation,
      "cloudflare.r2.bucket": bindingName,
      ...requestKey !== void 0 && { "cloudflare.r2.request.key": requestKey },
      ...isR2ListOptions(key) && key.prefix !== void 0 && { "cloudflare.r2.request.prefix": key.prefix },
      ...isR2ListOptions(key) && key.delimiter !== void 0 && { "cloudflare.r2.request.delimiter": key.delimiter },
      [SEMANTIC_ATTRIBUTE_SENTRY_OP]: op,
      [SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: ORIGIN2
    }
  };
}
function instrumentR2MultipartUpload(upload, bindingName) {
  const { key } = upload;
  return new Proxy(upload, {
    get(target, prop, receiver) {
      if (prop === "uploadPart") {
        const original = Reflect.get(target, prop, receiver);
        return function(...args) {
          const [partNumber] = args;
          return startSpan(
            {
              ...createSpanOptions(bindingName, "uploadPart", key),
              attributes: {
                ...createSpanOptions(bindingName, "uploadPart", key).attributes,
                "cloudflare.r2.request.part_number": partNumber
              }
            },
            () => Reflect.apply(original, target, args)
          );
        };
      }
      if (prop === "abort") {
        const original = Reflect.get(target, prop, receiver);
        return function() {
          return startSpan(
            createSpanOptions(bindingName, "abortMultipartUpload", key),
            () => Reflect.apply(original, target, [])
          );
        };
      }
      if (prop === "complete") {
        const original = Reflect.get(target, prop, receiver);
        return function(...args) {
          return startSpan(
            createSpanOptions(bindingName, "completeMultipartUpload", key),
            () => Reflect.apply(original, target, args)
          );
        };
      }
      return Reflect.get(target, prop, receiver);
    }
  });
}
function instrumentR2Bucket(bucket, bindingName) {
  return new Proxy(bucket, {
    get(target, prop, receiver) {
      if (prop === "get" || prop === "head" || prop === "put" || prop === "delete" || prop === "list") {
        const original = Reflect.get(target, prop, receiver);
        return function(...args) {
          const [key] = args;
          return startSpan(createSpanOptions(bindingName, prop, key), () => Reflect.apply(original, target, args));
        };
      }
      if (prop === "createMultipartUpload") {
        const original = Reflect.get(target, prop, receiver);
        return function(...args) {
          const [key] = args;
          return startSpan(createSpanOptions(bindingName, "createMultipartUpload", key), async () => {
            const upload = await Reflect.apply(original, target, args);
            return instrumentR2MultipartUpload(upload, bindingName);
          });
        };
      }
      if (prop === "resumeMultipartUpload") {
        const original = Reflect.get(target, prop, receiver);
        return function(...args) {
          const upload = Reflect.apply(original, target, args);
          return instrumentR2MultipartUpload(upload, bindingName);
        };
      }
      return Reflect.get(target, prop, receiver);
    }
  });
}
var ORIGIN2, R2_OPERATIONS;
var init_instrumentR2 = __esm({
  "node_modules/@sentry/cloudflare/build/esm/instrumentations/worker/instrumentR2.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_esm();
    ORIGIN2 = "auto.faas.cloudflare.r2";
    R2_OPERATIONS = {
      get: { spanName: "r2_get", op: "object.get", operation: "GetObject" },
      head: { spanName: "r2_head", op: "object.head", operation: "HeadObject" },
      put: { spanName: "r2_put", op: "object.put", operation: "PutObject" },
      delete: { spanName: "r2_delete", op: "object.delete", operation: "DeleteObject" },
      list: { spanName: "r2_list", op: "object.list", operation: "ListObjects" },
      uploadPart: { spanName: "r2_uploadPart", op: "object.upload_part", operation: "UploadPart" },
      abortMultipartUpload: {
        spanName: "r2_abortMultipartUpload",
        op: "object.multipart_upload.abort",
        operation: "AbortMultipartUpload"
      },
      createMultipartUpload: {
        spanName: "r2_createMultipartUpload",
        op: "object.multipart_upload.create",
        operation: "CreateMultipartUpload"
      },
      completeMultipartUpload: {
        spanName: "r2_completeMultipartUpload",
        op: "object.multipart_upload.complete",
        operation: "CompleteMultipartUpload"
      }
    };
    __name(isR2ListOptions, "isR2ListOptions");
    __name(createSpanOptions, "createSpanOptions");
    __name(instrumentR2MultipartUpload, "instrumentR2MultipartUpload");
    __name(instrumentR2Bucket, "instrumentR2Bucket");
  }
});

// node_modules/@sentry/cloudflare/build/esm/instrumentations/worker/instrumentRateLimit.js
function instrumentRateLimit(rateLimit, bindingName) {
  return new Proxy(rateLimit, {
    get(target, prop, receiver) {
      if (prop !== "limit") {
        return Reflect.get(target, prop, receiver);
      }
      const original = Reflect.get(target, prop, receiver);
      return function(options) {
        return startSpan(
          {
            name: `rate_limit ${bindingName}`,
            attributes: {
              [SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: ORIGIN3
            }
          },
          () => Reflect.apply(original, target, [options])
        );
      };
    }
  });
}
var ORIGIN3;
var init_instrumentRateLimit = __esm({
  "node_modules/@sentry/cloudflare/build/esm/instrumentations/worker/instrumentRateLimit.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_esm();
    ORIGIN3 = "auto.faas.cloudflare.rate_limit";
    __name(instrumentRateLimit, "instrumentRateLimit");
  }
});

// node_modules/@sentry/cloudflare/build/esm/instrumentations/worker/instrumentEnv.js
function isProxyable(item) {
  return isObjectLike(item) || typeof item === "function";
}
function instrumentEnv(env, options) {
  if (!env || typeof env !== "object") {
    return env;
  }
  const rpcPropagation = options ? getEffectiveRpcPropagation(options) : false;
  return new Proxy(env, {
    get(target, prop, receiver) {
      const item = Reflect.get(target, prop, receiver);
      if (!isProxyable(item)) {
        return item;
      }
      const cached = instrumentedBindings.get(item);
      if (cached) {
        return cached;
      }
      if (isD1Database(item)) {
        const instrumented2 = instrumentD1(item);
        instrumentedBindings.set(item, instrumented2);
        return instrumented2;
      }
      if (isQueue(item)) {
        const bindingName = typeof prop === "string" ? prop : String(prop);
        const instrumented2 = instrumentQueueProducer(item, bindingName);
        instrumentedBindings.set(item, instrumented2);
        return instrumented2;
      }
      if (isR2Bucket(item)) {
        const bindingName = typeof prop === "string" ? prop : String(prop);
        const instrumented2 = instrumentR2Bucket(item, bindingName);
        instrumentedBindings.set(item, instrumented2);
        return instrumented2;
      }
      if (isRateLimit(item)) {
        const bindingName = typeof prop === "string" ? prop : String(prop);
        const instrumented2 = instrumentRateLimit(item, bindingName);
        instrumentedBindings.set(item, instrumented2);
        return instrumented2;
      }
      if (isAiBinding(item)) {
        const instrumented2 = instrumentWorkersAiClient(item);
        instrumentedBindings.set(item, instrumented2);
        return instrumented2;
      }
      if (!rpcPropagation) {
        return item;
      }
      if (isDurableObjectNamespace(item)) {
        const instrumented2 = instrumentDurableObjectNamespace(item);
        instrumentedBindings.set(item, instrumented2);
        return instrumented2;
      }
      if (isJSRPC(item)) {
        const instrumented2 = new Proxy(item, {
          get(target2, p) {
            const value = Reflect.get(target2, p);
            if (p === "fetch" && typeof value === "function") {
              return instrumentFetcher((...args) => Reflect.apply(value, target2, args));
            }
            if (typeof value === "function" && typeof p === "string" && !STUB_NON_RPC_METHODS.has(p)) {
              return (...args) => Reflect.apply(value, target2, appendRpcMeta(args));
            }
            return value;
          }
        });
        instrumentedBindings.set(item, instrumented2);
        return instrumented2;
      }
      return item;
    }
  });
}
var instrumentedBindings;
var init_instrumentEnv = __esm({
  "node_modules/@sentry/cloudflare/build/esm/instrumentations/worker/instrumentEnv.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_esm();
    init_isBinding();
    init_instrumentD1();
    init_rpcMeta();
    init_rpcOptions();
    init_instrumentDurableObjectNamespace();
    init_instrumentFetcher();
    init_instrumentQueueProducer();
    init_instrumentR2();
    init_instrumentRateLimit();
    __name(isProxyable, "isProxyable");
    instrumentedBindings = /* @__PURE__ */ new WeakMap();
    __name(instrumentEnv, "instrumentEnv");
  }
});

// node_modules/@sentry/cloudflare/build/esm/instrumentations/worker/instrumentEmail.js
function wrapEmailHandler(emailMessage, options, context, fn) {
  return withIsolationScope2((isolationScope) => {
    const waitUntil = context.waitUntil.bind(context);
    const client = init({ ...options, ctx: context });
    isolationScope.setClient(client);
    addCloudResourceContext(isolationScope);
    return startSpan(
      {
        op: "faas.email",
        name: `Handle Email ${emailMessage.to}`,
        attributes: {
          "faas.trigger": "email",
          [SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: "auto.faas.cloudflare.email",
          [SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: "task"
        }
      },
      async () => {
        try {
          return await fn();
        } catch (e) {
          captureException(e, { mechanism: { handled: false, type: "auto.faas.cloudflare.email" } });
          throw e;
        } finally {
          waitUntil(flushAndDispose(client));
        }
      }
    );
  });
}
function instrumentExportedHandlerEmail(handler, optionsCallback) {
  if (!("email" in handler) || typeof handler.email !== "function") {
    return;
  }
  handler.email = ensureInstrumented(
    handler.email,
    (original) => new Proxy(original, {
      apply(target, thisArg, args) {
        const [emailMessage, env, ctx] = args;
        const context = instrumentContext(ctx);
        const options = getFinalOptions(optionsCallback(env), env);
        args[1] = instrumentEnv(env, options);
        args[2] = context;
        return wrapEmailHandler(emailMessage, options, context, () => target.apply(thisArg, args));
      }
    })
  );
}
var init_instrumentEmail = __esm({
  "node_modules/@sentry/cloudflare/build/esm/instrumentations/worker/instrumentEmail.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_esm();
    init_flush();
    init_instrument();
    init_options();
    init_scope_utils();
    init_sdk2();
    init_instrumentContext();
    init_instrumentEnv();
    __name(wrapEmailHandler, "wrapEmailHandler");
    __name(instrumentExportedHandlerEmail, "instrumentExportedHandlerEmail");
  }
});

// node_modules/@sentry/cloudflare/build/esm/utils/streaming.js
function classifyResponseStreaming(res) {
  if (!res.body) {
    return { isStreaming: false };
  }
  const contentType = res.headers.get("content-type") ?? "";
  const contentLength = res.headers.get("content-length");
  if (/^text\/event-stream\b/i.test(contentType) || /^application\/(x-)?ndjson\b/i.test(contentType) || /^application\/stream\+json\b/i.test(contentType) || /^text\/plain\b/i.test(contentType) && !contentLength) {
    return { isStreaming: true };
  }
  return { isStreaming: false };
}
var init_streaming2 = __esm({
  "node_modules/@sentry/cloudflare/build/esm/utils/streaming.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    __name(classifyResponseStreaming, "classifyResponseStreaming");
  }
});

// node_modules/@sentry/cloudflare/build/esm/request.js
function getRequestErrorMechanismType(context) {
  return context && "storage" in context ? "auto.faas.cloudflare.durable_object" : "auto.http.cloudflare";
}
function wrapRequestHandler(wrapperOptions, handler) {
  return withIsolationScope2(async (isolationScope) => {
    const { options, request, captureErrors = true } = wrapperOptions;
    const context = wrapperOptions.context;
    const waitUntil = context ? getOriginalWaitUntil(context)?.bind(context) : void 0;
    const errorMechanismType = getRequestErrorMechanismType(context);
    const client = init({ ...options, ctx: context });
    isolationScope.setClient(client);
    const urlObject = parseStringToURLObject(request.url);
    const [name, attributes] = getHttpSpanDetailsFromUrlObject(urlObject, "server", "auto.http.cloudflare", request);
    const contentLength = request.headers.get("content-length");
    if (contentLength) {
      attributes["http.request.body.size"] = parseInt(contentLength, 10);
    }
    const userAgentHeader = request.headers.get("user-agent");
    if (userAgentHeader) {
      attributes["user_agent.original"] = userAgentHeader;
    }
    Object.assign(
      attributes,
      httpHeadersToSpanAttributes(
        winterCGHeadersToDict(request.headers),
        getClient()?.getDataCollectionOptions() ?? false
      )
    );
    attributes[SEMANTIC_ATTRIBUTE_SENTRY_OP] = "http.server";
    addCloudResourceContext(isolationScope);
    addRequest(isolationScope, request);
    if (request.cf) {
      addCultureContext(isolationScope, request.cf);
      if (typeof request.cf.httpProtocol === "string") {
        attributes["network.protocol.name"] = request.cf.httpProtocol;
      }
    }
    if (request.method === "OPTIONS" || request.method === "HEAD") {
      try {
        return await handler();
      } catch (e) {
        if (captureErrors) {
          captureException(e, { mechanism: { handled: false, type: errorMechanismType } });
        }
        throw e;
      } finally {
        waitUntil?.(flushAndDispose(client));
      }
    }
    if (client) {
      await captureIncomingRequestBody(client, request);
    }
    return continueTrace(
      { sentryTrace: request.headers.get("sentry-trace") || "", baggage: request.headers.get("baggage") },
      () => {
        return startSpanManual({ name, attributes }, async (span) => {
          let res;
          try {
            res = await handler();
            setHttpStatus(span, res.status);
          } catch (e) {
            span.end();
            if (captureErrors) {
              captureException(e, { mechanism: { handled: false, type: errorMechanismType } });
            }
            waitUntil?.(flushAndDispose(client));
            throw e;
          }
          const classification = classifyResponseStreaming(res);
          if (classification.isStreaming && res.body) {
            try {
              let ended = false;
              const endSpanOnce = /* @__PURE__ */ __name(() => {
                if (ended)
                  return;
                ended = true;
                span.end();
                waitUntil?.(flushAndDispose(client));
              }, "endSpanOnce");
              const transform = new TransformStream({
                flush() {
                  endSpanOnce();
                },
                cancel() {
                  endSpanOnce();
                }
              });
              return new Response(res.body.pipeThrough(transform), {
                status: res.status,
                statusText: res.statusText,
                headers: res.headers
              });
            } catch {
              span.end();
              waitUntil?.(flushAndDispose(client));
              return res;
            }
          }
          span.end();
          if (res.status === 101) {
            waitUntil?.(client?.flush(2e3));
          } else {
            waitUntil?.(flushAndDispose(client));
          }
          return res;
        });
      }
    );
  });
}
var init_request2 = __esm({
  "node_modules/@sentry/cloudflare/build/esm/request.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_esm();
    init_httpServer();
    init_flush();
    init_scope_utils();
    init_sdk2();
    init_streaming2();
    __name(getRequestErrorMechanismType, "getRequestErrorMechanismType");
    __name(wrapRequestHandler, "wrapRequestHandler");
  }
});

// node_modules/@sentry/cloudflare/build/esm/instrumentations/worker/instrumentFetch.js
function instrumentExportedHandlerFetch(handler, optionsCallback) {
  if (!("fetch" in handler) || typeof handler.fetch !== "function") {
    return;
  }
  handler.fetch = ensureInstrumented(
    handler.fetch,
    (original) => new Proxy(original, {
      apply(target, thisArg, args) {
        const [request, env, ctx] = args;
        if (request.method === "OPTIONS" || request.method === "HEAD") {
          return target.apply(thisArg, args);
        }
        const context = instrumentContext(ctx);
        const options = getFinalOptions(optionsCallback(env), env);
        args[1] = instrumentEnv(env, options);
        args[2] = context;
        return wrapRequestHandler({ options, request, context }, () => target.apply(thisArg, args));
      }
    })
  );
}
function instrumentWorkerEntrypointFetch(instance, options, context) {
  if (!instance.fetch) {
    return;
  }
  const original = instance.fetch.bind(instance);
  instance.fetch = new Proxy(original, {
    apply(target, thisArg, args) {
      const [request] = args;
      if (request.method === "OPTIONS" || request.method === "HEAD") {
        return Reflect.apply(target, thisArg, args);
      }
      return wrapRequestHandler({ options, request, context }, () => Reflect.apply(target, thisArg, args));
    }
  });
}
var init_instrumentFetch = __esm({
  "node_modules/@sentry/cloudflare/build/esm/instrumentations/worker/instrumentFetch.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_instrument();
    init_options();
    init_request2();
    init_instrumentContext();
    init_instrumentEnv();
    __name(instrumentExportedHandlerFetch, "instrumentExportedHandlerFetch");
    __name(instrumentWorkerEntrypointFetch, "instrumentWorkerEntrypointFetch");
  }
});

// node_modules/@sentry/cloudflare/build/esm/instrumentations/worker/instrumentQueue.js
function wrapQueueHandler(batch, options, context, fn) {
  return withIsolationScope2((isolationScope) => {
    const waitUntil = context.waitUntil.bind(context);
    const client = init({ ...options, ctx: context });
    isolationScope.setClient(client);
    addCloudResourceContext(isolationScope);
    return startSpan(
      {
        op: "faas.queue",
        name: `process ${batch.queue}`,
        attributes: {
          "faas.trigger": "pubsub",
          "messaging.destination.name": batch.queue,
          "messaging.system": "cloudflare",
          "messaging.operation.type": "process",
          "messaging.operation.name": "process",
          "messaging.batch.message_count": batch.messages.length,
          "messaging.message.retry.count": batch.messages.reduce((acc, message) => acc + message.attempts - 1, 0),
          [SEMANTIC_ATTRIBUTE_SENTRY_OP]: "queue.process",
          [SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: "auto.faas.cloudflare.queue",
          [SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: "task"
        }
      },
      async () => {
        try {
          return await fn();
        } catch (e) {
          captureException(e, { mechanism: { handled: false, type: "auto.faas.cloudflare.queue" } });
          throw e;
        } finally {
          waitUntil(flushAndDispose(client));
        }
      }
    );
  });
}
function instrumentExportedHandlerQueue(handler, optionsCallback) {
  if (!("queue" in handler) || typeof handler.queue !== "function") {
    return;
  }
  handler.queue = ensureInstrumented(
    handler.queue,
    (original) => new Proxy(original, {
      apply(target, thisArg, args) {
        const [batch, env, ctx] = args;
        const context = instrumentContext(ctx);
        const options = getFinalOptions(optionsCallback(env), env);
        args[1] = instrumentEnv(env, options);
        args[2] = context;
        return wrapQueueHandler(batch, options, context, () => target.apply(thisArg, args));
      }
    })
  );
}
function instrumentWorkerEntrypointQueue(instance, options, context) {
  if (!instance.queue) {
    return;
  }
  const original = instance.queue.bind(instance);
  instance.queue = new Proxy(original, {
    apply(target, thisArg, args) {
      const [batch] = args;
      return wrapQueueHandler(batch, options, context, () => Reflect.apply(target, thisArg, args));
    }
  });
}
var init_instrumentQueue = __esm({
  "node_modules/@sentry/cloudflare/build/esm/instrumentations/worker/instrumentQueue.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_esm();
    init_flush();
    init_instrument();
    init_options();
    init_scope_utils();
    init_sdk2();
    init_instrumentContext();
    init_instrumentEnv();
    __name(wrapQueueHandler, "wrapQueueHandler");
    __name(instrumentExportedHandlerQueue, "instrumentExportedHandlerQueue");
    __name(instrumentWorkerEntrypointQueue, "instrumentWorkerEntrypointQueue");
  }
});

// node_modules/@sentry/cloudflare/build/esm/instrumentations/worker/instrumentScheduled.js
function wrapScheduledHandler(controller, options, context, fn) {
  return withIsolationScope2((isolationScope) => {
    const waitUntil = context.waitUntil.bind(context);
    const client = init({ ...options, ctx: context });
    isolationScope.setClient(client);
    addCloudResourceContext(isolationScope);
    return startSpan(
      {
        op: "faas.cron",
        name: `Scheduled Cron ${controller.cron}`,
        attributes: {
          "faas.cron": controller.cron,
          "faas.time": new Date(controller.scheduledTime).toISOString(),
          "faas.trigger": "timer",
          [SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: "auto.faas.cloudflare.scheduled",
          [SEMANTIC_ATTRIBUTE_SENTRY_SOURCE]: "task"
        }
      },
      async () => {
        try {
          return await fn();
        } catch (e) {
          captureException(e, { mechanism: { handled: false, type: "auto.faas.cloudflare.scheduled" } });
          throw e;
        } finally {
          waitUntil(flushAndDispose(client));
        }
      }
    );
  });
}
function instrumentExportedHandlerScheduled(handler, optionsCallback) {
  if (!("scheduled" in handler) || typeof handler.scheduled !== "function") {
    return;
  }
  handler.scheduled = ensureInstrumented(
    handler.scheduled,
    (original) => new Proxy(original, {
      apply(target, thisArg, args) {
        const [controller, env, ctx] = args;
        const context = instrumentContext(ctx);
        const options = getFinalOptions(optionsCallback(env), env);
        args[1] = instrumentEnv(env, options);
        args[2] = context;
        return wrapScheduledHandler(controller, options, context, () => target.apply(thisArg, args));
      }
    })
  );
}
function instrumentWorkerEntrypointScheduled(instance, options, context) {
  if (!instance.scheduled) {
    return;
  }
  const original = instance.scheduled.bind(instance);
  instance.scheduled = new Proxy(original, {
    apply(target, thisArg, args) {
      const [controller] = args;
      return wrapScheduledHandler(controller, options, context, () => Reflect.apply(target, thisArg, args));
    }
  });
}
var init_instrumentScheduled = __esm({
  "node_modules/@sentry/cloudflare/build/esm/instrumentations/worker/instrumentScheduled.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_esm();
    init_flush();
    init_instrument();
    init_options();
    init_scope_utils();
    init_sdk2();
    init_instrumentContext();
    init_instrumentEnv();
    __name(wrapScheduledHandler, "wrapScheduledHandler");
    __name(instrumentExportedHandlerScheduled, "instrumentExportedHandlerScheduled");
    __name(instrumentWorkerEntrypointScheduled, "instrumentWorkerEntrypointScheduled");
  }
});

// node_modules/@sentry/cloudflare/build/esm/instrumentations/worker/instrumentTail.js
function wrapTailHandler(options, context, fn) {
  return withIsolationScope2(async (isolationScope) => {
    const waitUntil = context.waitUntil.bind(context);
    const client = init({ ...options, ctx: context });
    isolationScope.setClient(client);
    addCloudResourceContext(isolationScope);
    try {
      return await fn();
    } catch (e) {
      captureException(e, { mechanism: { handled: false, type: "auto.faas.cloudflare.tail" } });
      throw e;
    } finally {
      waitUntil(flushAndDispose(client));
    }
  });
}
function instrumentExportedHandlerTail(handler, optionsCallback) {
  if (!("tail" in handler) || typeof handler.tail !== "function") {
    return;
  }
  handler.tail = ensureInstrumented(
    handler.tail,
    (original) => new Proxy(original, {
      apply(target, thisArg, args) {
        const [, env, ctx] = args;
        const context = instrumentContext(ctx);
        const options = getFinalOptions(optionsCallback(env), env);
        args[1] = instrumentEnv(env, options);
        args[2] = context;
        return wrapTailHandler(options, context, () => target.apply(thisArg, args));
      }
    })
  );
}
function instrumentWorkerEntrypointTail(instance, options, context) {
  if (!instance.tail) {
    return;
  }
  const original = instance.tail.bind(instance);
  instance.tail = new Proxy(original, {
    apply(target, thisArg, args) {
      return wrapTailHandler(options, context, () => Reflect.apply(target, thisArg, args));
    }
  });
}
var init_instrumentTail = __esm({
  "node_modules/@sentry/cloudflare/build/esm/instrumentations/worker/instrumentTail.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_esm();
    init_flush();
    init_instrument();
    init_options();
    init_scope_utils();
    init_sdk2();
    init_instrumentContext();
    init_instrumentEnv();
    __name(wrapTailHandler, "wrapTailHandler");
    __name(instrumentExportedHandlerTail, "instrumentExportedHandlerTail");
    __name(instrumentWorkerEntrypointTail, "instrumentWorkerEntrypointTail");
  }
});

// node_modules/@sentry/cloudflare/build/esm/utils/isCloudflareClass.js
function isCloudflareClass(value, className) {
  if (!value || typeof value !== "function") {
    return false;
  }
  if (value.name === className) {
    return false;
  }
  let proto = value.prototype;
  while (proto) {
    const ctor = proto.constructor;
    const constructorName = ctor?.name;
    if (constructorName === className) {
      return true;
    }
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}
var init_isCloudflareClass = __esm({
  "node_modules/@sentry/cloudflare/build/esm/utils/isCloudflareClass.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    __name(isCloudflareClass, "isCloudflareClass");
  }
});

// node_modules/@sentry/cloudflare/build/esm/wrapMethodWithSentry.js
function resolveOriginalStorage(context, thisArg) {
  if (isObjectLike(thisArg) && "ctx" in thisArg) {
    const doCtx = thisArg.ctx;
    if (doCtx?.originalStorage) {
      return doCtx.originalStorage;
    }
  }
  if (context && "originalStorage" in context && context.originalStorage) {
    return context.originalStorage;
  }
  return void 0;
}
function wrapMethodWithSentry(wrapperOptions, handler, callback, noMark) {
  return ensureInstrumented(
    handler,
    (original) => new Proxy(original, {
      apply(target, thisArg, rawArgs) {
        const { startNewTrace: startNewTrace$1, origin } = wrapperOptions;
        let args = rawArgs;
        let rpcMeta;
        if (wrapperOptions.spanOp === "rpc") {
          const extracted = extractRpcMeta(rawArgs);
          args = extracted.args;
          rpcMeta = extracted.rpcMeta;
        }
        const currentClient = getClient();
        const sentryWithScope = startNewTrace$1 ? withIsolationScope2 : currentClient ? withScope2 : withIsolationScope2;
        const wrappedFunction = /* @__PURE__ */ __name((scope) => {
          const context = wrapperOptions.context;
          const waitUntil = context ? getOriginalWaitUntil(context)?.bind(context) : void 0;
          const storage = resolveOriginalStorage(context, thisArg);
          let scopeClient = scope.getClient();
          if (startNewTrace$1 || !scopeClient?.getTransport()) {
            const client = init({
              ...wrapperOptions.options,
              ctx: context
            });
            scope.setClient(client);
            scopeClient = client;
          }
          const clientToDispose = scopeClient;
          const methodName = wrapperOptions.spanName || "unknown";
          const teardown = /* @__PURE__ */ __name(async () => {
            if (startNewTrace$1 && storage) {
              storeSpanContext(storage, methodName);
            }
            await flushAndDispose(clientToDispose);
          }, "teardown");
          const onFulfilled = /* @__PURE__ */ __name((res) => {
            waitUntil?.(teardown());
            return res;
          }, "onFulfilled");
          const onRejected = /* @__PURE__ */ __name((e) => {
            captureException(e, {
              mechanism: {
                type: origin,
                handled: false
              }
            });
            waitUntil?.(teardown());
            throw e;
          }, "onRejected");
          if (!wrapperOptions.spanName) {
            try {
              if (callback) {
                callback(...args);
              }
              const result = Reflect.apply(target, thisArg, args);
              if (isThenable(result)) {
                return result.then(onFulfilled, onRejected);
              } else {
                return onFulfilled(result);
              }
            } catch (e) {
              return onRejected(e);
            }
          }
          const attributes = wrapperOptions.spanOp ? {
            [SEMANTIC_ATTRIBUTE_SENTRY_OP]: wrapperOptions.spanOp,
            [SEMANTIC_ATTRIBUTE_SENTRY_ORIGIN]: origin
          } : {};
          const executeSpan = /* @__PURE__ */ __name(() => {
            return startSpan({ name: methodName, attributes }, (span) => {
              if (startNewTrace$1 && storage) {
                const storedContext = getStoredSpanContext(storage, methodName);
                if (storedContext) {
                  span.addLinks(buildSpanLinks(storedContext));
                  const sampledFlag = storedContext.sampled ? "1" : "0";
                  span.setAttribute(
                    "sentry.previous_trace",
                    `${storedContext.traceId}-${storedContext.spanId}-${sampledFlag}`
                  );
                }
              }
              try {
                const result = Reflect.apply(target, thisArg, args);
                if (isThenable(result)) {
                  return result.then(onFulfilled, onRejected);
                } else {
                  return onFulfilled(result);
                }
              } catch (e) {
                return onRejected(e);
              }
            });
          }, "executeSpan");
          if (rpcMeta) {
            return continueTrace(
              { sentryTrace: rpcMeta["sentry-trace"] || "", baggage: rpcMeta.baggage || "" },
              executeSpan
            );
          }
          if (startNewTrace$1) {
            return startNewTrace(() => executeSpan());
          }
          return executeSpan();
        }, "wrappedFunction");
        return sentryWithScope(wrappedFunction);
      }
    }),
    noMark
  );
}
var init_wrapMethodWithSentry = __esm({
  "node_modules/@sentry/cloudflare/build/esm/wrapMethodWithSentry.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_esm();
    init_flush();
    init_instrument();
    init_sdk2();
    init_rpcMeta();
    init_traceLinks();
    __name(resolveOriginalStorage, "resolveOriginalStorage");
    __name(wrapMethodWithSentry, "wrapMethodWithSentry");
  }
});

// node_modules/@sentry/cloudflare/build/esm/instrumentations/instrumentWorkerEntrypoint.js
function isPrototypeMethod(instance, prop, method) {
  let prototype = Object.getPrototypeOf(instance);
  while (prototype && prototype !== Object.prototype) {
    const descriptor = Object.getOwnPropertyDescriptor(prototype, prop);
    if (descriptor) {
      return descriptor.value === method;
    }
    prototype = Object.getPrototypeOf(prototype);
  }
  return false;
}
function bindToInstance(instance, proxy, method) {
  return new Proxy(method, {
    apply(target, thisArg, args) {
      return Reflect.apply(target, thisArg === proxy ? instance : thisArg, args);
    }
  });
}
function instrumentMethod(instance, proxy, prop, method, options, context) {
  const ownDescriptor = Object.getOwnPropertyDescriptor(instance, prop);
  if (ownDescriptor && "value" in ownDescriptor && !ownDescriptor.configurable && !ownDescriptor.writable) {
    return method;
  }
  const boundMethod = bindToInstance(instance, proxy, method);
  if (typeof prop !== "string" || RESERVED_METHODS.has(prop) || !isPrototypeMethod(instance, prop, method)) {
    return boundMethod;
  }
  const captureMethod = wrapMethodWithSentry(
    { options, context, spanOp: "rpc", origin: WORKER_ENTRYPOINT_ORIGIN },
    boundMethod,
    void 0,
    true
  );
  if (!options.enableRpcTracePropagation) {
    return captureMethod;
  }
  const tracedMethod = wrapMethodWithSentry(
    { options, context, spanName: prop, spanOp: "rpc", origin: WORKER_ENTRYPOINT_ORIGIN },
    boundMethod,
    void 0,
    true
  );
  return (...args) => {
    const { rpcMeta } = extractRpcMeta(args);
    return rpcMeta ? tracedMethod.call(proxy, ...args) : captureMethod.call(proxy, ...args);
  };
}
function instrumentWorkerEntrypoint(optionsCallback, WorkerEntrypointClass) {
  setAsyncLocalStorageAsyncContextStrategy();
  return new Proxy(WorkerEntrypointClass, {
    construct(target, [ctx, env]) {
      const context = instrumentContext(ctx);
      const options = getFinalOptions(optionsCallback(env), env);
      const instrumentedEnv = instrumentEnv(env, options);
      const obj = new target(context, instrumentedEnv);
      if ("ctx" in obj) {
        Object.defineProperty(obj, "ctx", {
          value: context,
          writable: true,
          enumerable: true,
          configurable: true
        });
      }
      if ("env" in obj) {
        Object.defineProperty(obj, "env", {
          value: instrumentedEnv,
          writable: true,
          enumerable: true,
          configurable: true
        });
      }
      Object.defineProperty(obj, "__SENTRY_CONTEXT__", {
        value: context,
        enumerable: false,
        writable: false,
        configurable: false
      });
      Object.defineProperty(obj, "__SENTRY_OPTIONS__", {
        value: options,
        enumerable: false,
        writable: false,
        configurable: false
      });
      const entrypoint = obj;
      instrumentWorkerEntrypointFetch(entrypoint, options, context);
      instrumentWorkerEntrypointScheduled(entrypoint, options, context);
      instrumentWorkerEntrypointQueue(entrypoint, options, context);
      instrumentWorkerEntrypointTail(entrypoint, options, context);
      const methodCache = /* @__PURE__ */ new Map();
      const proxy = new Proxy(obj, {
        get(instance, prop) {
          const value = Reflect.get(instance, prop, instance);
          if (typeof value !== "function") {
            return value;
          }
          const method = value;
          const cached = methodCache.get(prop);
          if (cached?.source === method) {
            return cached.wrapped;
          }
          const wrapped = instrumentMethod(instance, proxy, prop, method, options, context);
          methodCache.set(prop, { source: method, wrapped });
          return wrapped;
        }
      });
      return proxy;
    }
  });
}
var WORKER_ENTRYPOINT_ORIGIN, RESERVED_METHODS;
var init_instrumentWorkerEntrypoint = __esm({
  "node_modules/@sentry/cloudflare/build/esm/instrumentations/instrumentWorkerEntrypoint.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_async();
    init_options();
    init_instrumentContext();
    init_rpcMeta();
    init_wrapMethodWithSentry();
    init_instrumentEnv();
    init_instrumentFetch();
    init_instrumentQueue();
    init_instrumentScheduled();
    init_instrumentTail();
    WORKER_ENTRYPOINT_ORIGIN = "auto.faas.cloudflare.worker_entrypoint";
    RESERVED_METHODS = /* @__PURE__ */ new Set([
      "connect",
      "constructor",
      "dup",
      "email",
      "fetch",
      "queue",
      "scheduled",
      "tail",
      "tailStream",
      "test",
      "trace"
    ]);
    __name(isPrototypeMethod, "isPrototypeMethod");
    __name(bindToInstance, "bindToInstance");
    __name(instrumentMethod, "instrumentMethod");
    __name(instrumentWorkerEntrypoint, "instrumentWorkerEntrypoint");
  }
});

// node_modules/@sentry/cloudflare/build/esm/withSentry.js
function withSentry(optionsCallback, handler) {
  if (isCloudflareClass(handler, "WorkerEntrypoint")) {
    return instrumentWorkerEntrypoint(optionsCallback, handler);
  }
  setAsyncLocalStorageAsyncContextStrategy();
  try {
    instrumentExportedHandlerFetch(handler, optionsCallback);
    instrumentHonoErrorHandler(handler);
    instrumentExportedHandlerScheduled(handler, optionsCallback);
    instrumentExportedHandlerEmail(handler, optionsCallback);
    instrumentExportedHandlerQueue(handler, optionsCallback);
    instrumentExportedHandlerTail(handler, optionsCallback);
  } catch {
  }
  return handler;
}
function instrumentHonoErrorHandler(handler) {
  if ("onError" in handler && "errorHandler" in handler && typeof handler.errorHandler === "function") {
    handler.errorHandler = ensureInstrumented(
      handler.errorHandler,
      (original) => new Proxy(original, {
        apply(target, thisArg, args) {
          const [err, context] = args;
          getHonoIntegration()?.handleHonoException(err, context);
          return Reflect.apply(target, thisArg, args);
        }
      })
    );
  }
}
var init_withSentry = __esm({
  "node_modules/@sentry/cloudflare/build/esm/withSentry.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_async();
    init_instrument();
    init_instrumentEmail();
    init_instrumentFetch();
    init_instrumentQueue();
    init_instrumentScheduled();
    init_instrumentTail();
    init_hono();
    init_isCloudflareClass();
    init_instrumentWorkerEntrypoint();
    __name(withSentry, "withSentry");
    __name(instrumentHonoErrorHandler, "instrumentHonoErrorHandler");
  }
});

// node_modules/@sentry/cloudflare/build/esm/index.js
var init_esm2 = __esm({
  "node_modules/@sentry/cloudflare/build/esm/index.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_esm();
    init_withSentry();
  }
});

// src/firebaseAdmin.js
var firebaseAdmin_exports = {};
__export(firebaseAdmin_exports, {
  FirebaseAdmin: () => FirebaseAdmin
});
var FirebaseAdmin;
var init_firebaseAdmin = __esm({
  "src/firebaseAdmin.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    FirebaseAdmin = class {
      constructor(serviceAccountJson) {
        this.sa = JSON.parse(serviceAccountJson);
        this.projectId = this.sa.project_id;
        this.accessToken = null;
        this.tokenExp = 0;
      }
      async getAccessToken() {
        const now = Math.floor(Date.now() / 1e3);
        if (this.accessToken && now < this.tokenExp - 60) {
          return this.accessToken;
        }
        const header = { alg: "RS256", typ: "JWT" };
        const claim = {
          iss: this.sa.client_email,
          scope: "https://www.googleapis.com/auth/cloud-platform",
          aud: "https://oauth2.googleapis.com/token",
          exp: now + 3600,
          iat: now
        };
        const encodeB64Url = /* @__PURE__ */ __name((obj) => btoa(JSON.stringify(obj)).replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_"), "encodeB64Url");
        const signatureInput = `${encodeB64Url(header)}.${encodeB64Url(claim)}`;
        const pemHeader = "-----BEGIN PRIVATE KEY-----";
        const pemFooter = "-----END PRIVATE KEY-----";
        const pemContents = this.sa.private_key.substring(
          this.sa.private_key.indexOf(pemHeader) + pemHeader.length,
          this.sa.private_key.indexOf(pemFooter)
        ).replace(/\s/g, "");
        const binaryDerString = atob(pemContents);
        const binaryDer = new Uint8Array(binaryDerString.length);
        for (let i = 0; i < binaryDerString.length; i++) {
          binaryDer[i] = binaryDerString.charCodeAt(i);
        }
        const key = await crypto.subtle.importKey(
          "pkcs8",
          binaryDer.buffer,
          { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
          false,
          ["sign"]
        );
        const signature = await crypto.subtle.sign(
          "RSASSA-PKCS1-v1_5",
          key,
          new TextEncoder().encode(signatureInput)
        );
        const signatureB64Url = btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
        const jwt = `${signatureInput}.${signatureB64Url}`;
        const res = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`
        });
        const data = await res.json();
        if (!data.access_token) {
          throw new Error("Failed to get access token: " + JSON.stringify(data));
        }
        this.accessToken = data.access_token;
        this.tokenExp = now + data.expires_in;
        return this.accessToken;
      }
      async verifyIdToken(idToken) {
        const token = await this.getAccessToken();
        const res = await fetch(`https://identitytoolkit.googleapis.com/v1/projects/${this.projectId}/accounts:lookup`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ idToken })
        });
        const data = await res.json();
        if (data.error)
          throw new Error(data.error.message);
        if (!data.users || data.users.length === 0)
          throw new Error("User not found");
        return data.users[0].localId;
      }
      async writeSubscription(uid, subscriptionData) {
        const token = await this.getAccessToken();
        const fields = {};
        for (const [key, value] of Object.entries(subscriptionData)) {
          if (typeof value === "string")
            fields[key] = { stringValue: value };
          else if (typeof value === "number")
            fields[key] = { integerValue: value.toString() };
          else if (typeof value === "boolean")
            fields[key] = { booleanValue: value };
        }
        const firestoreDoc = {
          fields: {
            subscription: {
              mapValue: {
                fields
              }
            }
          }
        };
        const res = await fetch(`https://firestore.googleapis.com/v1/projects/${this.projectId}/databases/(default)/documents/users/${uid}?updateMask.fieldPaths=subscription`, {
          method: "PATCH",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(firestoreDoc)
        });
        const data = await res.json();
        if (data.error)
          throw new Error(data.error.message);
        return data;
      }
      async getUserDoc(uid) {
        const token = await this.getAccessToken();
        const res = await fetch(`https://firestore.googleapis.com/v1/projects/${this.projectId}/databases/(default)/documents/users/${uid}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.status === 404)
          return null;
        const data = await res.json();
        if (data.error)
          throw new Error(data.error.message);
        const flat = {};
        for (const [key, val] of Object.entries(data.fields || {})) {
          if ("stringValue" in val)
            flat[key] = val.stringValue;
          else if ("integerValue" in val)
            flat[key] = parseInt(val.integerValue, 10);
          else if ("booleanValue" in val)
            flat[key] = val.booleanValue;
          else if ("mapValue" in val) {
            flat[key] = {};
            for (const [k2, v2] of Object.entries(val.mapValue.fields || {})) {
              if ("stringValue" in v2)
                flat[key][k2] = v2.stringValue;
              else if ("integerValue" in v2)
                flat[key][k2] = parseInt(v2.integerValue, 10);
              else if ("booleanValue" in v2)
                flat[key][k2] = v2.booleanValue;
            }
          }
        }
        return flat;
      }
      async updateDevAccess(uid, expiresAt) {
        const token = await this.getAccessToken();
        const firestoreDoc = {
          fields: {
            devAccessExpiresAt: {
              integerValue: expiresAt.toString()
            }
          }
        };
        const res = await fetch(`https://firestore.googleapis.com/v1/projects/${this.projectId}/databases/(default)/documents/users/${uid}?updateMask.fieldPaths=devAccessExpiresAt`, {
          method: "PATCH",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(firestoreDoc)
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(`updateDevAccess failed: ${JSON.stringify(data)}`);
        }
        return data;
      }
      async getDocument(documentPath) {
        const token = await this.getAccessToken();
        const res = await fetch(`https://firestore.googleapis.com/v1/projects/${this.projectId}/databases/(default)/documents/${documentPath}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (!res.ok) {
          if (res.status === 404)
            return null;
          const data = await res.json();
          throw new Error(`getDocument failed: ${JSON.stringify(data)}`);
        }
        return await res.json();
      }
      async updateDocument(documentPath, firestoreDoc) {
        const token = await this.getAccessToken();
        const res = await fetch(`https://firestore.googleapis.com/v1/projects/${this.projectId}/databases/(default)/documents/${documentPath}`, {
          method: "PATCH",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(firestoreDoc)
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(`updateDocument failed: ${JSON.stringify(data)}`);
        }
        return data;
      }
      async runQuery(query) {
        const token = await this.getAccessToken();
        const res = await fetch(`https://firestore.googleapis.com/v1/projects/${this.projectId}/databases/(default)/documents:runQuery`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(query)
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(`runQuery failed: ${JSON.stringify(data)}`);
        }
        return data;
      }
    };
    __name(FirebaseAdmin, "FirebaseAdmin");
  }
});

// src/modelAccess.js
function rankOf(tier) {
  const ranks = { "free": 0, "monthly": 1, "6month": 2, "yearly": 3 };
  return ranks[tier] || 0;
}
var MODEL_CATALOG_TIERS, ENDPOINTS;
var init_modelAccess = __esm({
  "src/modelAccess.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    MODEL_CATALOG_TIERS = {
      "llama-3.3-70b-versatile": "free",
      "llama-3.1-8b-instant": "free",
      // Used for internal intent classification — must be free-tier
      "gpt-4o-mini": "6month",
      "groq/compound": "yearly",
      "groq/compound-mini": "yearly"
    };
    __name(rankOf, "rankOf");
    ENDPOINTS = {
      GITHUB_MODELS: "https://models.github.ai/inference/chat/completions",
      GROQ: "https://api.groq.com/openai/v1/chat/completions"
    };
  }
});

// src/modelFallback.js
async function callCloudflareAI(payload, env) {
  const response = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
    messages: payload.messages,
    stream: payload.stream
  });
  if (payload.stream) {
    return new Response(response, {
      status: 200,
      headers: { "content-type": "text/event-stream" }
    });
  } else {
    const jsonBody = JSON.stringify({
      choices: [{ message: { content: response.response || "" } }]
    });
    return new Response(jsonBody, {
      status: 200,
      headers: { "content-type": "application/json" }
    });
  }
}
async function callGitHubModels(modelId, payload, env) {
  const ghPayload = {
    max_tokens: 4096,
    top_p: 1,
    ...payload,
    model: modelId
  };
  const ghResponse = await fetch(ENDPOINTS.GITHUB_MODELS, {
    method: "POST",
    headers: {
      "Accept": "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${env.GITHUB_MODELS_TOKEN}`,
      "Accept-Encoding": "identity"
    },
    body: JSON.stringify(ghPayload)
  });
  return ghResponse;
}
async function callGroq(modelId, payload, env) {
  const apiKey = env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY secret is not set.");
  }
  const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
      "Accept-Encoding": "identity"
    },
    body: JSON.stringify({ ...payload, model: modelId })
  });
  return groqResponse;
}
async function callProvider(modelId, payload, env) {
  if (modelId === "gpt-4o-mini") {
    if (!env.GITHUB_MODELS_TOKEN)
      throw new Error("GitHub Models token missing.");
    return await callGitHubModels("openai/gpt-4o-mini", payload, env);
  }
  return await callGroq(modelId, payload, env);
}
async function callWithRetry(modelId, payload, env) {
  const MAX_RETRIES = 2;
  const RETRY_DELAY_MS = 1e3;
  let lastResponse = null;
  let lastError = null;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await callProvider(modelId, payload, env);
      if (response.ok) {
        return { ok: true, response };
      }
      lastResponse = response;
    } catch (e) {
      lastError = e;
    }
    if (attempt < MAX_RETRIES) {
      await delay(RETRY_DELAY_MS);
    }
  }
  return { ok: false, response: lastResponse, error: lastError };
}
async function callModelWithFallback(requestedModelId, payload, env, userPlanId) {
  const orderedModels = Object.keys(MODEL_CATALOG_TIERS).sort((a, b) => {
    return rankOf(MODEL_CATALOG_TIERS[b]) - rankOf(MODEL_CATALOG_TIERS[a]);
  });
  const startIndex = orderedModels.indexOf(requestedModelId);
  const userRank = rankOf(userPlanId);
  let lastResult = null;
  for (let i = startIndex; i < orderedModels.length; i++) {
    const currentModelId = orderedModels[i];
    const currentTier = MODEL_CATALOG_TIERS[currentModelId];
    if (rankOf(currentTier) > userRank) {
      continue;
    }
    const result = await callWithRetry(currentModelId, payload, env);
    if (result.ok) {
      if (currentModelId !== requestedModelId) {
        if (env.SENTRY_DSN) {
          addBreadcrumb({
            category: "model-fallback",
            message: `Model fallback triggered: ${requestedModelId} failed, served by ${currentModelId}`,
            level: "warning"
          });
        } else {
          console.warn(`Model fallback triggered: ${requestedModelId} failed, served by ${currentModelId}`);
        }
      }
      return { ok: true, response: result.response, servedByModel: currentModelId };
    }
    lastResult = result;
    if (env.SENTRY_DSN) {
      addBreadcrumb({
        category: "model-fallback-failure",
        message: `Model ${currentModelId} failed during fallback chain.`,
        level: "warning"
      });
    }
  }
  try {
    if (env.SENTRY_DSN) {
      addBreadcrumb({
        category: "model-fallback-agent5",
        message: `All external APIs exhausted. Engaging Agent 5 (Cloudflare Native AI) for ${requestedModelId}.`,
        level: "warning"
      });
    }
    const cfResponse = await callCloudflareAI(payload, env);
    return { ok: true, response: cfResponse, servedByModel: "@cf/meta/llama-3.1-8b-instruct" };
  } catch (agent5Error) {
    if (env.SENTRY_DSN) {
      addBreadcrumb({
        category: "model-fallback-exhausted",
        message: `Agent 5 completely failed. System is down.`,
        level: "error"
      });
    }
    return { ok: false, response: lastResult?.response, error: agent5Error, servedByModel: null };
  }
}
var delay;
var init_modelFallback = __esm({
  "src/modelFallback.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_modelAccess();
    init_esm2();
    delay = /* @__PURE__ */ __name((ms) => new Promise((res) => setTimeout(res, ms)), "delay");
    __name(callCloudflareAI, "callCloudflareAI");
    __name(callGitHubModels, "callGitHubModels");
    __name(callGroq, "callGroq");
    __name(callProvider, "callProvider");
    __name(callWithRetry, "callWithRetry");
    __name(callModelWithFallback, "callModelWithFallback");
  }
});

// src/adminStats.js
var adminStats_exports = {};
__export(adminStats_exports, {
  handleAdminUsageStats: () => handleAdminUsageStats
});
async function handleAdminUsageStats(request, env, corsHeaders2) {
  const url = new URL(request.url);
  const callerUid = url.searchParams.get("uid");
  if (!env.ADMIN_UID || callerUid !== env.ADMIN_UID) {
    return new Response("Unauthorized: Not an admin or ADMIN_UID not configured.", { status: 401, headers: corsHeaders2 });
  }
  try {
    const fbAdmin = new FirebaseAdmin(env.FIREBASE_SERVICE_ACCOUNT);
    const queryPayload = {
      structuredQuery: {
        from: [{ collectionId: "dailyUsageStats", allDescendants: false }],
        orderBy: [{ field: { fieldPath: "date" }, direction: "DESCENDING" }],
        limit: 30
      }
    };
    const token = await fbAdmin.getAccessToken();
    const res = await fetch(`https://firestore.googleapis.com/v1/projects/${fbAdmin.projectId}/databases/(default)/documents:runQuery`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(queryPayload)
    });
    if (!res.ok) {
      const err = await res.text();
      return new Response("Failed to query usage stats: " + err, { status: 500 });
    }
    const data = await res.json();
    const records = [];
    for (const item of data) {
      if (item.document && item.document.fields) {
        const fields = item.document.fields;
        records.push({
          date: fields.date?.stringValue || "Unknown",
          totalRequests: parseInt(fields.totalRequests?.integerValue || "0", 10),
          modelUsage: parseMap(fields.modelUsage),
          toolUsage: parseMap(fields.toolUsage)
        });
      }
    }
    const html = generateAdminHtml(records);
    return new Response(html, {
      status: 200,
      headers: { ...corsHeaders2, "Content-Type": "text/html; charset=utf-8" }
    });
  } catch (error2) {
    return new Response("Error: " + error2.message, { status: 500, headers: corsHeaders2 });
  }
}
function parseMap(mapValueObj) {
  const result = {};
  if (mapValueObj && mapValueObj.mapValue && mapValueObj.mapValue.fields) {
    for (const [k, v] of Object.entries(mapValueObj.mapValue.fields)) {
      result[k] = parseInt(v.integerValue || "0", 10);
    }
  }
  return result;
}
function generateAdminHtml(records) {
  let rowsHtml = records.map((r) => `
    <tr style="border-bottom: 1px solid #333;">
      <td style="padding: 12px; font-weight: 500;">${r.date}</td>
      <td style="padding: 12px; color: #10b981;">${r.totalRequests}</td>
      <td style="padding: 12px;">
        ${Object.entries(r.modelUsage).map(([m, c]) => `<div style="font-size: 0.9em"><span style="color:#a1a1aa">${m}:</span> ${c}</div>`).join("")}
      </td>
      <td style="padding: 12px;">
        ${Object.entries(r.toolUsage).map(([t, c]) => `<div style="font-size: 0.9em"><span style="color:#a1a1aa">${t}:</span> ${c}</div>`).join("")}
      </td>
    </tr>
  `).join("");
  if (records.length === 0) {
    rowsHtml = `<tr><td colspan="4" style="padding: 20px; text-align: center; color: #a1a1aa;">No data available yet.</td></tr>`;
  }
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>ToolsHub Internal Analytics</title>
  <style>
    body {
      background-color: #09090b;
      color: #fafafa;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      margin: 0; padding: 40px;
    }
    .container {
      max-width: 1000px;
      margin: 0 auto;
      background: #18181b;
      border: 1px solid #27272a;
      border-radius: 12px;
      overflow: hidden;
    }
    .header {
      padding: 24px;
      border-bottom: 1px solid #27272a;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    h1 { margin: 0; font-size: 20px; font-weight: 600; letter-spacing: -0.02em; }
    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }
    th {
      padding: 16px 12px;
      background: #09090b;
      color: #a1a1aa;
      font-weight: 500;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid #27272a;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Internal Usage Stats (Last 30 Days)</h1>
      <div style="color: #a1a1aa; font-size: 14px;">Aggregate Data Only</div>
    </div>
    <table>
      <thead>
        <tr>
          <th style="width: 15%">Date</th>
          <th style="width: 15%">Total Requests</th>
          <th style="width: 35%">By Model</th>
          <th style="width: 35%">By Tool Category</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>
  </div>
</body>
</html>
  `;
}
var init_adminStats = __esm({
  "src/adminStats.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_firebaseAdmin();
    __name(handleAdminUsageStats, "handleAdminUsageStats");
    __name(parseMap, "parseMap");
    __name(generateAdminHtml, "generateAdminHtml");
  }
});

// src/agents/ops.js
var ops_exports = {};
__export(ops_exports, {
  runOpsAgent: () => runOpsAgent
});
async function runOpsAgent(env) {
  const model = "llama-3.1-8b-instant";
  let statsText = "Usage Stats:\n";
  try {
    if (env.FIREBASE_SERVICE_ACCOUNT) {
      const fbAdmin = new FirebaseAdmin(env.FIREBASE_SERVICE_ACCOUNT);
      const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      const statsDoc = await fbAdmin.getDocument(`dailyUsageStats/${today}`);
      if (statsDoc) {
        statsText += JSON.stringify(statsDoc, null, 2);
      } else {
        statsText += "No stats for today yet.";
      }
    }
  } catch (e) {
    statsText += `Failed to fetch stats: ${e.message}`;
  }
  const systemPrompt = `You are Agent 2 (The Ops Maintainer) of the MAS.
Your role is to analyze the daily system metrics and provide a brief, actionable health report for the engineering team.
Look for any anomalies like unusually high rate limits hit, heavy usage of fallback models, or missing metrics.
Keep the report concise, use bullet points, and highlight critical warnings if any.`;
  const userMessage = `Here is the current system data:

${statsText}

Please generate the health report.`;
  const payload = {
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage }
    ],
    temperature: 0.1,
    max_tokens: 500,
    stream: false
  };
  const result = await callModelWithFallback(model, payload, env, "yearly");
  if (result.ok) {
    const data = await result.response.json();
    return data.choices?.[0]?.message?.content || "No report generated.";
  } else {
    return "Ops Agent failed to generate report. Reason: " + (result.error?.message || "Unknown error");
  }
}
var init_ops = __esm({
  "src/agents/ops.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    init_modelFallback();
    init_firebaseAdmin();
    __name(runOpsAgent, "runOpsAgent");
  }
});

// src/devAccess.js
var devAccess_exports = {};
__export(devAccess_exports, {
  handleDevAccessRedeem: () => handleDevAccessRedeem
});
async function handleDevAccessRedeem(request, env, corsHeaders2) {
  try {
    const body = await request.json();
    if (!body || !body.uid || !body.code) {
      return new Response(JSON.stringify({ error: "Missing uid or code" }), { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders2 } });
    }
    if (body.code !== "BUILD2026") {
      return new Response(JSON.stringify({ error: "Invalid developer code" }), { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders2 } });
    }
    const { FirebaseAdmin: FirebaseAdmin2 } = await Promise.resolve().then(() => (init_firebaseAdmin(), firebaseAdmin_exports));
    const fbAdmin = new FirebaseAdmin2(env.FIREBASE_SERVICE_ACCOUNT);
    const authHeader = request.headers.get("Authorization") || "";
    if (!authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Missing token" }), { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders2 } });
    }
    const token = authHeader.split(" ")[1];
    let tokenUid;
    try {
      tokenUid = await fbAdmin.verifyIdToken(token);
    } catch (e) {
      return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders2 } });
    }
    if (tokenUid !== body.uid) {
      return new Response(JSON.stringify({ error: "Token UID mismatch" }), { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders2 } });
    }
    const userDoc = await fbAdmin.getUserDoc(tokenUid);
    const ALLOWED_DEVELOPERS = ["satyamk82476@gmail.com", "styamk82476@gmail.com"];
    if (!userDoc || !userDoc.email || !ALLOWED_DEVELOPERS.includes(userDoc.email.toLowerCase())) {
      return new Response(JSON.stringify({ error: "Not an authorized developer account" }), { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders2 } });
    }
    const expiresAt = Date.now() + 24 * 60 * 60 * 1e3;
    await fbAdmin.updateDevAccess(body.uid, expiresAt);
    return new Response(JSON.stringify({ success: true, devAccessExpiresAt: expiresAt }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders2 }
    });
  } catch (error2) {
    console.error("Error redeeming dev access:", error2);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders2 } });
  }
}
var init_devAccess = __esm({
  "src/devAccess.js"() {
    init_checked_fetch();
    init_strip_cf_connecting_ip_header();
    init_modules_watch_stub();
    __name(handleDevAccessRedeem, "handleDevAccessRedeem");
  }
});

// .wrangler/tmp/bundle-7KM2z3/middleware-loader.entry.ts
init_checked_fetch();
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();

// .wrangler/tmp/bundle-7KM2z3/middleware-insertion-facade.js
init_checked_fetch();
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();

// src/index.js
init_checked_fetch();
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_esm2();
init_esm2();

// src/payments.js
init_checked_fetch();
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_firebaseAdmin();
var PRICES = {
  "monthly": 9900,
  // ₹99 in paise
  "6month": 34900,
  // ₹349 in paise
  "yearly": 99900
  // ₹999 in paise
};
var PLAN_DURATIONS = {
  "monthly": 30 * 24 * 60 * 60 * 1e3,
  "6month": 180 * 24 * 60 * 60 * 1e3,
  "yearly": 365 * 24 * 60 * 60 * 1e3
};
async function hmacSha256(secret, data) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return Array.from(new Uint8Array(signature)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(hmacSha256, "hmacSha256");
async function handlePaymentRequest(request, env, corsHeaders2) {
  const url = new URL(request.url);
  const path = url.pathname;
  let rawBody = "";
  let body = {};
  try {
    rawBody = await request.text();
    body = JSON.parse(rawBody);
  } catch (e) {
    if (request.method === "POST") {
      return new Response("Invalid JSON body", { status: 400, headers: corsHeaders2 });
    }
  }
  if (path === "/api/payment/create-order") {
    const authHeader = request.headers.get("Authorization") || "";
    const idToken = authHeader.replace("Bearer ", "");
    if (!idToken)
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders2 });
    const { planId } = body;
    const amount = PRICES[planId];
    if (!amount)
      return new Response(JSON.stringify({ error: "Invalid planId" }), { status: 400, headers: corsHeaders2 });
    try {
      const fbAdmin = new FirebaseAdmin(env.FIREBASE_SERVICE_ACCOUNT);
      const uid = await fbAdmin.verifyIdToken(idToken);
      const rzpRes = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Basic " + btoa(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`)
        },
        body: JSON.stringify({
          amount,
          currency: "INR",
          receipt: `receipt_${uid}_${Date.now()}`,
          notes: { uid, planId }
        })
      });
      const rzpData = await rzpRes.json();
      if (rzpData.error)
        throw new Error(rzpData.error.description);
      return new Response(JSON.stringify({
        orderId: rzpData.id,
        amount: rzpData.amount,
        currency: rzpData.currency,
        keyId: env.RAZORPAY_KEY_ID
      }), { headers: { ...corsHeaders2, "Content-Type": "application/json" } });
    } catch (e) {
      console.error("Create Order Error:", e);
      return new Response(JSON.stringify({ error: "Failed to create order", details: e.message }), { status: 500, headers: corsHeaders2 });
    }
  }
  if (path === "/api/payment/verify") {
    const authHeader = request.headers.get("Authorization") || "";
    const idToken = authHeader.replace("Bearer ", "");
    if (!idToken)
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders2 });
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId } = body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !planId) {
      return new Response(JSON.stringify({ error: "Missing payment details" }), { status: 400, headers: corsHeaders2 });
    }
    try {
      const fbAdmin = new FirebaseAdmin(env.FIREBASE_SERVICE_ACCOUNT);
      const uid = await fbAdmin.verifyIdToken(idToken);
      const generatedSignature = await hmacSha256(env.RAZORPAY_KEY_SECRET, `${razorpay_order_id}|${razorpay_payment_id}`);
      if (generatedSignature !== razorpay_signature) {
        return new Response(JSON.stringify({ error: "Invalid signature" }), { status: 400, headers: corsHeaders2 });
      }
      const now = Date.now();
      const duration = PLAN_DURATIONS[planId];
      const expiresAt = now + duration;
      const subscriptionData = {
        planId,
        status: "active",
        startedAt: now,
        expiresAt,
        lastPaymentId: razorpay_payment_id,
        lastOrderId: razorpay_order_id
      };
      await fbAdmin.writeSubscription(uid, subscriptionData);
      return new Response(JSON.stringify({ success: true, planId, expiresAt }), { headers: { ...corsHeaders2, "Content-Type": "application/json" } });
    } catch (e) {
      console.error("Verify Payment Error:", e);
      return new Response(JSON.stringify({ error: "Failed to verify payment", details: e.message }), { status: 500, headers: corsHeaders2 });
    }
  }
  if (path === "/api/payment/webhook") {
    const signature = request.headers.get("X-Razorpay-Signature");
    if (!signature)
      return new Response("Missing signature", { status: 400 });
    try {
      const generatedSignature = await hmacSha256(env.RAZORPAY_WEBHOOK_SECRET, rawBody);
      if (generatedSignature !== signature) {
        return new Response("Invalid signature", { status: 400 });
      }
      const event = body.event;
      if (event === "payment.captured") {
        const paymentEntity = body.payload.payment.entity;
        const notes = paymentEntity.notes || {};
        const { uid, planId } = notes;
        if (uid && planId) {
          const fbAdmin = new FirebaseAdmin(env.FIREBASE_SERVICE_ACCOUNT);
          const now = Date.now();
          const duration = PLAN_DURATIONS[planId];
          const expiresAt = now + duration;
          const subscriptionData = {
            planId,
            status: "active",
            startedAt: now,
            expiresAt,
            lastPaymentId: paymentEntity.id,
            lastOrderId: paymentEntity.order_id
          };
          await fbAdmin.writeSubscription(uid, subscriptionData);
        }
      }
      return new Response("OK", { status: 200 });
    } catch (e) {
      console.error("Webhook Error:", e);
      return new Response("Webhook handling failed", { status: 500 });
    }
  }
  return null;
}
__name(handlePaymentRequest, "handlePaymentRequest");

// src/planResolver.js
init_checked_fetch();
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_firebaseAdmin();
var PLAN_MAX_STEPS = { free: 8, monthly: 12, "6month": 12, yearly: 12 };
var PLAN_DAILY_MESSAGE_LIMIT = { free: 15, monthly: Infinity, "6month": Infinity, yearly: Infinity };
async function resolvePlan(request, env) {
  const authHeader = request.headers.get("Authorization") || "";
  const idToken = authHeader.replace("Bearer ", "").trim();
  if (!idToken) {
    return { uid: null, planId: "free", maxSteps: PLAN_MAX_STEPS.free, dailyLimit: PLAN_DAILY_MESSAGE_LIMIT.free };
  }
  const fbAdmin = new FirebaseAdmin(env.FIREBASE_SERVICE_ACCOUNT);
  const uid = await fbAdmin.verifyIdToken(idToken);
  const userDoc = await fbAdmin.getUserDoc(uid);
  const subscription = userDoc?.subscription;
  const now = Date.now();
  let planId = "free";
  if (subscription && subscription.status === "active" && subscription.expiresAt > now) {
    planId = subscription.planId || "free";
  } else if (userDoc?.plan) {
    planId = userDoc.plan;
  }
  if (userDoc?.devAccessExpiresAt && userDoc.devAccessExpiresAt > now) {
    planId = "yearly";
  }
  if (!PLAN_MAX_STEPS.hasOwnProperty(planId))
    planId = "free";
  return {
    uid,
    planId,
    maxSteps: PLAN_MAX_STEPS[planId],
    dailyLimit: PLAN_DAILY_MESSAGE_LIMIT[planId]
  };
}
__name(resolvePlan, "resolvePlan");

// src/usageTracker.js
init_checked_fetch();
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
async function checkAndIncrementDailyUsage(fbAdmin, uid, dailyLimit, env) {
  if (!uid || dailyLimit === Infinity)
    return { allowed: true };
  const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const token = await fbAdmin.getAccessToken();
  const docPath = `users/${uid}/usage/${today}`;
  const url = `https://firestore.googleapis.com/v1/projects/${fbAdmin.projectId}/databases/(default)/documents/${docPath}`;
  const getRes = await fetch(url, { headers: { "Authorization": `Bearer ${token}` } });
  let count = 0;
  if (getRes.status === 200) {
    const data = await getRes.json();
    count = parseInt(data.fields?.count?.integerValue || "0", 10);
  }
  if (count >= dailyLimit) {
    return { allowed: false, count };
  }
  await fetch(`${url}?updateMask.fieldPaths=count&updateMask.fieldPaths=updatedAt`, {
    method: "PATCH",
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ fields: { count: { integerValue: String(count + 1) }, updatedAt: { integerValue: String(Date.now()) } } })
  });
  return { allowed: true, count: count + 1 };
}
__name(checkAndIncrementDailyUsage, "checkAndIncrementDailyUsage");

// src/usageStats.js
init_checked_fetch();
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
async function recordUsageStat(fbAdmin, modelId, toolCategory, env) {
  try {
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const docPath = `projects/${fbAdmin.projectId}/databases/(default)/documents/dailyUsageStats/${today}`;
    const fieldTransforms = [
      { fieldPath: "totalRequests", increment: { integerValue: "1" } },
      { fieldPath: "updatedAt", setToServerValue: "REQUEST_TIME" }
    ];
    if (modelId) {
      const safeModelId = "`" + modelId.replace(/`/g, "") + "`";
      fieldTransforms.push({ fieldPath: `modelUsage.${safeModelId}`, increment: { integerValue: "1" } });
    }
    if (toolCategory) {
      const safeCategory = "`" + toolCategory.replace(/`/g, "") + "`";
      fieldTransforms.push({ fieldPath: `toolUsage.${safeCategory}`, increment: { integerValue: "1" } });
    }
    const token = await fbAdmin.getAccessToken();
    const payload = {
      writes: [
        {
          update: {
            name: docPath,
            fields: {
              date: { stringValue: today }
            }
          },
          updateTransforms: fieldTransforms
        }
      ]
    };
    const res = await fetch(`https://firestore.googleapis.com/v1/projects/${fbAdmin.projectId}/databases/(default)/documents:commit`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const errorText = await res.text();
      console.error("Failed to commit usage stat:", errorText);
    }
  } catch (err) {
    console.error("Error in recordUsageStat:", err);
  }
}
__name(recordUsageStat, "recordUsageStat");

// src/index.js
init_firebaseAdmin();
init_modelAccess();
init_modelFallback();

// src/statusMonitor.js
init_checked_fetch();
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_firebaseAdmin();
init_modelAccess();
async function probeModel(modelId, env) {
  const isGithubModel = modelId === "gpt-4o-mini";
  const url = isGithubModel ? ENDPOINTS.GITHUB_MODELS : ENDPOINTS.GROQ;
  const token = isGithubModel ? env.GITHUB_MODELS_TOKEN : env.GROQ_API_KEY;
  if (!token)
    return { success: false, reason: "missing_token" };
  const payload = {
    model: isGithubModel ? "openai/gpt-4o-mini" : modelId,
    messages: [{ role: "user", content: "hello" }],
    max_tokens: 5
  };
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8e3);
    const start = Date.now();
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (response.ok) {
      return { success: true, latency: Date.now() - start };
    } else {
      return { success: false, reason: `http_${response.status}` };
    }
  } catch (e) {
    return { success: false, reason: e.name === "AbortError" ? "timeout" : "network_error" };
  }
}
__name(probeModel, "probeModel");
async function scheduled(event, env, ctx) {
  const admin = new FirebaseAdmin(env.FIREBASE_SERVICE_ACCOUNT);
  const now = /* @__PURE__ */ new Date();
  const today = now.toISOString().split("T")[0];
  for (const modelId of Object.keys(MODEL_CATALOG_TIERS)) {
    const result = await probeModel(modelId, env);
    const newState = result.success ? "operational" : "outage";
    const statusRef = `systemStatus/${modelId}`;
    let currentStatus = null;
    try {
      currentStatus = await admin.getDocument(statusRef);
    } catch (e) {
    }
    const prevUptimeDay = currentStatus?.fields?.uptimeDay?.mapValue?.fields || {};
    const oldState = currentStatus?.fields?.state?.stringValue || "nodata";
    const todayStateStr = prevUptimeDay[today]?.stringValue;
    let newTodayState = todayStateStr;
    if (!todayStateStr) {
      newTodayState = newState;
    } else if (newState === "outage") {
      newTodayState = "outage";
    } else if (newState === "operational" && todayStateStr === "nodata") {
      newTodayState = "operational";
    }
    const allDays = Object.keys(prevUptimeDay).concat(today);
    const sortedDays = Array.from(new Set(allDays)).sort();
    const daysToKeep = sortedDays.slice(-60);
    const newUptimeDayFields = {};
    for (const d of daysToKeep) {
      newUptimeDayFields[d] = { stringValue: d === today ? newTodayState : prevUptimeDay[d]?.stringValue };
    }
    const updatedDoc = {
      fields: {
        modelId: { stringValue: modelId },
        state: { stringValue: newState },
        uptimeDay: { mapValue: { fields: newUptimeDayFields } },
        lastCheckedAt: { timestampValue: now.toISOString() },
        updatedAt: { timestampValue: now.toISOString() }
      }
    };
    await admin.updateDocument(statusRef, updatedDoc);
    if (newState === "outage" && (oldState === "operational" || oldState === "nodata")) {
      const incidentId = `${modelId.replace(/[^a-zA-Z0-9]/g, "_")}_${Date.now()}`;
      await admin.updateDocument(`statusIncidents/${incidentId}`, {
        fields: {
          modelId: { stringValue: modelId },
          title: { stringValue: `Outage detected for ${modelId}` },
          severity: { stringValue: "investigating" },
          createdAt: { timestampValue: now.toISOString() },
          resolvedAt: { nullValue: null },
          updates: {
            arrayValue: {
              values: [
                {
                  mapValue: {
                    fields: {
                      status: { stringValue: "investigating" },
                      message: { stringValue: "We are currently investigating an issue affecting this model." },
                      timestamp: { timestampValue: now.toISOString() }
                    }
                  }
                }
              ]
            }
          }
        }
      });
    } else if (newState === "operational" && (oldState === "outage" || oldState === "degraded")) {
      try {
        const query = {
          structuredQuery: {
            from: [{ collectionId: "statusIncidents" }],
            where: {
              compositeFilter: {
                op: "AND",
                filters: [
                  { fieldFilter: { field: { fieldPath: "modelId" }, op: "EQUAL", value: { stringValue: modelId } } },
                  { unaryFilter: { field: { fieldPath: "resolvedAt" }, op: "IS_NULL" } }
                ]
              }
            },
            orderBy: [{ field: { fieldPath: "createdAt" }, direction: "DESCENDING" }],
            limit: 1
          }
        };
        const results = await admin.runQuery(query);
        if (results && results.length > 0 && results[0].document) {
          const doc = results[0].document;
          const incidentId = doc.name.split("/").pop();
          const updates = doc.fields.updates?.arrayValue?.values || [];
          updates.push({
            mapValue: {
              fields: {
                status: { stringValue: "resolved" },
                message: { stringValue: "The issue has been resolved and the service is fully operational." },
                timestamp: { timestampValue: now.toISOString() }
              }
            }
          });
          doc.fields.severity = { stringValue: "resolved" };
          doc.fields.resolvedAt = { timestampValue: now.toISOString() };
          doc.fields.updates = { arrayValue: { values: updates } };
          await admin.updateDocument(`statusIncidents/${incidentId}`, { fields: doc.fields });
        }
      } catch (e) {
        console.error("Error resolving incident:", e);
      }
    }
  }
}
__name(scheduled, "scheduled");

// src/agents/orchestrator.js
init_checked_fetch();
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_modelFallback();
async function routeRequest(messages, env, userPlanId) {
  const userMessage = messages.filter((m) => m.role === "user").pop()?.content || "";
  const orchestratorModel = "llama-3.1-8b-instant";
  const systemPrompt = `You are Agent 1 (The Orchestrator) of a Multi-Agent System.
Your job is to analyze the user's latest input and route it to the appropriate specialist agent.
You must return a raw JSON object and nothing else.

Available Agents:
- "chat": For general conversation, questions, standard coding help, or greetings.
- "coder": For extremely complex architecture, deep reasoning, or math problems.
- "creator": For generating visual content, images, UI mockups, or pictures.

Evaluate the following user message and return:
{"target": "<agent_name>", "reason": "<brief_reason>"}
`;
  const payload = {
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage }
    ],
    temperature: 0.1,
    max_tokens: 100,
    response_format: { type: "json_object" }
  };
  try {
    const result = await callModelWithFallback(orchestratorModel, payload, env, userPlanId);
    if (!result.ok) {
      throw new Error("Orchestrator failed to decide.");
    }
    const bodyText = await result.response.text();
    const body = JSON.parse(bodyText);
    const orchestratorDecision = JSON.parse(body.choices[0].message.content);
    return orchestratorDecision.target || "chat";
  } catch (e) {
    console.warn("Orchestration failed, defaulting to 'chat':", e.message);
    return "chat";
  }
}
__name(routeRequest, "routeRequest");

// src/agents/coder.js
init_checked_fetch();
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
init_modelFallback();
async function runCoderAgent(messages, env, userPlanId, payloadOpts) {
  const model = "gpt-4o-mini";
  const systemPrompt = `You are Agent 3 (The Deep Coder) of the MAS.
Your role is to solve complex software engineering, architectural, and mathematical problems.
Before providing the final code or answer, you MUST think step-by-step.
Output your thought process inside <thought> ... </thought> tags, and then provide the final, highly optimized code block or solution.
Always consider edge cases, performance (Big O), and security vulnerabilities.`;
  const newMessages = [
    { role: "system", content: systemPrompt },
    ...messages.filter((m) => m.role !== "system")
  ];
  const payload = {
    ...payloadOpts,
    messages: newMessages,
    model
  };
  return await callModelWithFallback(model, payload, env, userPlanId);
}
__name(runCoderAgent, "runCoderAgent");

// src/agents/creator.js
init_checked_fetch();
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
function uint8ArrayToBase64(uint8Array) {
  let binary = "";
  let len = uint8Array.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(uint8Array[i]);
  }
  return btoa(binary);
}
__name(uint8ArrayToBase64, "uint8ArrayToBase64");
async function runCreatorAgent(messages, env) {
  const userMessage = messages.filter((m) => m.role === "user").pop()?.content || "";
  const modelId = "@cf/stabilityai/stable-diffusion-xl-base-1.0";
  try {
    const response = await env.AI.run(modelId, {
      prompt: userMessage
    });
    const base64String = uint8ArrayToBase64(new Uint8Array(response));
    const markdownImage = `Here is your generated image:

![Generated Image](data:image/png;base64,${base64String})`;
    const chunk = JSON.stringify({
      choices: [{ delta: { content: markdownImage } }]
    });
    const sseBody = `data: ${chunk}

data: [DONE]

`;
    return new Response(sseBody, {
      status: 200,
      headers: { "content-type": "text/event-stream" }
    });
  } catch (e) {
    console.error("Creator Agent Failed:", e);
    const chunk = JSON.stringify({
      choices: [{ delta: { content: "> \u26A0\uFE0F **Agent 4 Failed:** Unable to generate image. " + e.message } }]
    });
    const sseBody = `data: ${chunk}

data: [DONE]

`;
    return new Response(sseBody, {
      status: 200,
      headers: { "content-type": "text/event-stream" }
    });
  }
}
__name(runCreatorAgent, "runCreatorAgent");

// src/rateLimiter.js
init_checked_fetch();
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var ipRateLimits = /* @__PURE__ */ new Map();
var RATE_LIMIT_WINDOW_MS = 6e4;
var MAX_REQUESTS_PER_WINDOW = 30;
function checkRateLimitMap(ip) {
  const now = Date.now();
  if (!ipRateLimits.has(ip)) {
    ipRateLimits.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  const record = ipRateLimits.get(ip);
  if (now > record.resetTime) {
    ipRateLimits.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  record.count++;
  return true;
}
__name(checkRateLimitMap, "checkRateLimitMap");
var paymentRateLimits = /* @__PURE__ */ new Map();
var PAYMENT_RATE_LIMIT_WINDOW_MS = 6e4;
var PAYMENT_MAX_REQUESTS_PER_WINDOW = 100;
function checkPaymentRateLimitMap(ip) {
  const now = Date.now();
  if (!paymentRateLimits.has(ip)) {
    paymentRateLimits.set(ip, { count: 1, resetTime: now + PAYMENT_RATE_LIMIT_WINDOW_MS });
    return true;
  }
  const record = paymentRateLimits.get(ip);
  if (now > record.resetTime) {
    paymentRateLimits.set(ip, { count: 1, resetTime: now + PAYMENT_RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (record.count >= PAYMENT_MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  record.count++;
  return true;
}
__name(checkPaymentRateLimitMap, "checkPaymentRateLimitMap");
async function checkRateLimit(ip, env) {
  if (!env.RATE_LIMIT_KV) {
    console.warn("RATE_LIMIT_KV is not bound. Falling back to in-memory Map rate limiter.");
    return checkRateLimitMap(ip);
  }
  const key = `ratelimit:${ip}`;
  const currentCountStr = await env.RATE_LIMIT_KV.get(key);
  const currentCount = currentCountStr ? parseInt(currentCountStr, 10) : 0;
  if (currentCount >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  await env.RATE_LIMIT_KV.put(key, (currentCount + 1).toString(), { expirationTtl: 60 });
  return true;
}
__name(checkRateLimit, "checkRateLimit");
async function checkPaymentRateLimit(ip, env) {
  if (!env.RATE_LIMIT_KV) {
    console.warn("RATE_LIMIT_KV is not bound. Falling back to in-memory Map payment rate limiter.");
    return checkPaymentRateLimitMap(ip);
  }
  const key = `ratelimit:payment:${ip}`;
  const currentCountStr = await env.RATE_LIMIT_KV.get(key);
  const currentCount = currentCountStr ? parseInt(currentCountStr, 10) : 0;
  if (currentCount >= PAYMENT_MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  await env.RATE_LIMIT_KV.put(key, (currentCount + 1).toString(), { expirationTtl: 60 });
  return true;
}
__name(checkPaymentRateLimit, "checkPaymentRateLimit");

// src/index.js
var corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  // Fixed: wildcard to prevent CORS blocks
  "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400"
};
var src_default = withSentry((env) => {
  if (!env.SENTRY_DSN) {
    console.warn("SENTRY_DSN is not set. Sentry error tracking is disabled.");
  }
  return {
    dsn: env.SENTRY_DSN,
    beforeSend(event) {
      if (event.request && event.request.data) {
        event.request.data = "[REDACTED FOR PRIVACY]";
      }
      return event;
    }
  };
}, {
  async fetch(request, env, ctx) {
    if (request.method === "OPTIONS") {
      return new Response("OK", {
        status: 200,
        headers: corsHeaders
      });
    }
    const url = new URL(request.url);
    if (request.method === "GET" && (url.pathname === "/health" || url.pathname === "/api/health")) {
      return new Response("OK", { status: 200, headers: corsHeaders });
    }
    if (request.method === "GET" && url.pathname === "/api/admin/usage-stats") {
      const { handleAdminUsageStats: handleAdminUsageStats2 } = await Promise.resolve().then(() => (init_adminStats(), adminStats_exports));
      return await handleAdminUsageStats2(request, env, corsHeaders);
    }
    if (request.method === "GET" && url.pathname === "/api/admin/agent-health") {
      if (env.ADMIN_UID && request.headers.get("Authorization") !== `Bearer ${env.ADMIN_UID}`) {
        return new Response("Unauthorized", { status: 401, headers: corsHeaders });
      }
      const { runOpsAgent: runOpsAgent2 } = await Promise.resolve().then(() => (init_ops(), ops_exports));
      const report = await runOpsAgent2(env);
      return new Response(report, { status: 200, headers: { ...corsHeaders, "Content-Type": "text/plain" } });
    }
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
    }
    const clientIp = request.headers.get("cf-connecting-ip") || "unknown";
    if (url.pathname.startsWith("/api/payment/")) {
      addBreadcrumb({ category: "payment", message: "Processing payment webhook", level: "info" });
      if (!await checkPaymentRateLimit(clientIp, env)) {
        return new Response("Too Many Requests. Please slow down.", { status: 429, headers: corsHeaders });
      }
      return await handlePaymentRequest(request, env, corsHeaders);
    }
    if (!await checkRateLimit(clientIp, env)) {
      return new Response("Too Many Requests. Please slow down.", { status: 429, headers: corsHeaders });
    }
    if (url.pathname === "/api/dev-access/redeem") {
      const { handleDevAccessRedeem: handleDevAccessRedeem2 } = await Promise.resolve().then(() => (init_devAccess(), devAccess_exports));
      return await handleDevAccessRedeem2(request, env, corsHeaders);
    }
    let callerPlan;
    try {
      callerPlan = await resolvePlan(request, env);
    } catch (e) {
      return new Response(JSON.stringify({ error: "Invalid or expired authentication token." }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return new Response("Bad Request: Invalid JSON", { status: 400, headers: corsHeaders });
    }
    if (body.type === "search") {
      const tavilyKey = env.TAVILY_API_KEY;
      if (!tavilyKey) {
        return new Response(JSON.stringify({ error: "Search is not configured." }), { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      try {
        const tavilyResponse = await fetch("https://api.tavily.com/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            api_key: tavilyKey,
            query: body.query,
            search_depth: "basic",
            include_answer: true,
            max_results: 5
          })
        });
        const tavilyData = await tavilyResponse.text();
        return new Response(tavilyData, { status: tavilyResponse.status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      } catch (e) {
        return new Response(JSON.stringify({ error: "Search service unavailable." }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }
    if (body.type === "rag_ingest") {
      try {
        if (!body.text) {
          return new Response(JSON.stringify({ error: "Text is required for ingestion." }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
        const aiResponse = await env.AI.run("@cf/baai/bge-base-en-v1.5", {
          text: [body.text]
        });
        const vector = aiResponse.data[0];
        const recordId = body.metadata?.id || crypto.randomUUID();
        const record = {
          id: recordId,
          values: vector,
          metadata: { text: body.text, ...body.metadata }
        };
        const insertResponse = await env.VECTORIZE.insert([record]);
        return new Response(JSON.stringify({ success: true, insertResponse, id: recordId }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      } catch (e) {
        return new Response(JSON.stringify({ error: "RAG ingestion failed.", details: e.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }
    if (body.type === "rag_query") {
      try {
        if (!body.query) {
          return new Response(JSON.stringify({ error: "Query is required." }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
        const aiResponse = await env.AI.run("@cf/baai/bge-base-en-v1.5", {
          text: [body.query]
        });
        const queryVector = aiResponse.data[0];
        const searchResults = await env.VECTORIZE.query(queryVector, {
          topK: 5,
          returnMetadata: "all"
        });
        const matches = searchResults.matches.map((m) => ({
          score: m.score,
          text: m.metadata?.text,
          ...m.metadata
        }));
        return new Response(JSON.stringify({ results: matches }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      } catch (e) {
        return new Response(JSON.stringify({ error: "RAG query failed.", details: e.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }
    let fbAdmin = null;
    if (env.FIREBASE_SERVICE_ACCOUNT) {
      try {
        fbAdmin = new FirebaseAdmin(env.FIREBASE_SERVICE_ACCOUNT);
        const usageCheck = await checkAndIncrementDailyUsage(fbAdmin, callerPlan.uid, callerPlan.dailyLimit, env);
        if (!usageCheck.allowed) {
          return new Response(JSON.stringify({ error: "daily_limit_reached", limit: callerPlan.dailyLimit }), {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
      } catch (e) {
        console.warn("Firebase usage check failed:", e);
      }
    } else {
      console.warn("FIREBASE_SERVICE_ACCOUNT not set. Skipping daily usage enforcement.");
    }
    const { messages, model, temperature, stream, response_format, mode, tools } = body;
    if (!messages || !Array.isArray(messages)) {
      return new Response('Bad Request: Missing or invalid "messages" array.', { status: 400, headers: corsHeaders });
    }
    let targetModel = model;
    if (targetModel === "llama3-70b-8192" || targetModel === "llama-3.1-70b-versatile" || targetModel === "llama-3.3-70b-versatile" || !targetModel) {
      targetModel = "llama-3.3-70b-versatile";
    }
    if (targetModel === "llama3-8b-8192" || targetModel === "llama-3.1-8b-instant") {
      targetModel = "llama-3.1-8b-instant";
    }
    let targetAgent = "chat";
    if (mode !== "agent" && mode !== "classify") {
      targetAgent = await routeRequest(messages, env, callerPlan.planId);
      addBreadcrumb({ category: "orchestrator", message: `Orchestrator routed request to: ${targetAgent}`, level: "info" });
      if (targetAgent === "creator") {
        const creatorResponse = await runCreatorAgent(messages, env);
        const newHeaders = new Headers(creatorResponse.headers);
        for (const [key, value] of Object.entries(corsHeaders)) {
          newHeaders.set(key, value);
        }
        return new Response(creatorResponse.body, { status: creatorResponse.status, headers: newHeaders });
      }
      if (targetAgent === "coder") {
        const payloadOpts = { temperature: 0.2, stream: !!stream };
        const coderResult = await runCoderAgent(messages, env, callerPlan.planId, payloadOpts);
        if (!coderResult.ok) {
          return new Response("Internal Server Error: Coder Agent Failed.", { status: 500, headers: corsHeaders });
        }
        targetModel = "gpt-4o-mini";
        const responseHeaders = new Headers(coderResult.response.headers);
        responseHeaders.delete("content-encoding");
        responseHeaders.delete("content-length");
        responseHeaders.delete("transfer-encoding");
        for (const [key, value] of Object.entries(corsHeaders)) {
          responseHeaders.set(key, value);
        }
        if (!stream) {
          const data = await coderResult.response.json();
          return new Response(JSON.stringify(data), { status: 200, headers: responseHeaders });
        }
        return new Response(coderResult.response.body, { status: 200, headers: responseHeaders });
      }
    }
    const requiredTier = MODEL_CATALOG_TIERS[targetModel] || "free";
    if (rankOf(requiredTier) > rankOf(callerPlan.planId)) {
      return new Response(JSON.stringify({
        error: "model_tier_required",
        requiredTier,
        yourTier: callerPlan.planId
      }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    const toolCategory = body.toolCategory || (mode === "agent" ? "agent" : "chat");
    if (fbAdmin) {
      env.ctx.waitUntil(recordUsageStat(fbAdmin, targetModel, toolCategory, env));
    }
    addBreadcrumb({ category: "model", message: `Routing request for model ${targetModel}`, level: "info" });
    const isCompoundModel = targetModel === "groq/compound" || targetModel === "groq/compound-mini";
    const payload = {
      model: targetModel,
      messages,
      temperature: typeof temperature === "number" ? temperature : 0.7,
      stream: isCompoundModel ? false : !!stream
    };
    if (response_format) {
      payload.response_format = response_format;
    }
    if (mode === "agent" && tools) {
      payload.tools = tools;
    }
    const apiKey = env.GROQ_API_KEY;
    if (!apiKey) {
      return new Response("Internal Server Error: GROQ_API_KEY secret is not set.", { status: 500, headers: corsHeaders });
    }
    const fallbackResult = await callModelWithFallback(targetModel, payload, env, callerPlan.planId);
    if (!fallbackResult.ok) {
      if (fallbackResult.response) {
        const responseHeaders = new Headers(fallbackResult.response.headers);
        responseHeaders.delete("content-encoding");
        responseHeaders.delete("content-length");
        responseHeaders.delete("transfer-encoding");
        for (const [key, value] of Object.entries(corsHeaders)) {
          responseHeaders.set(key, value);
        }
        return new Response(fallbackResult.response.body, {
          status: fallbackResult.response.status,
          headers: responseHeaders
        });
      } else {
        return new Response("Internal Server Error: All eligible AI providers are unreachable.", { status: 500, headers: corsHeaders });
      }
    }
    const groqResponse = fallbackResult.response;
    const servedByModel = fallbackResult.servedByModel;
    console.log(`Served by: ${servedByModel}`);
    try {
      if (isCompoundModel && !!stream) {
        const data = await groqResponse.json();
        const content = data.choices && data.choices[0] && data.choices[0].message ? data.choices[0].message.content || "" : "";
        const fakeChunk = JSON.stringify({ choices: [{ delta: { content } }] });
        const sseBody = `data: ${fakeChunk}

data: [DONE]

`;
        const responseHeaders2 = new Headers();
        for (const [key, value] of Object.entries(corsHeaders)) {
          responseHeaders2.set(key, value);
        }
        responseHeaders2.set("Content-Type", "text/event-stream");
        return new Response(sseBody, {
          status: 200,
          headers: responseHeaders2
        });
      }
      const responseHeaders = new Headers(groqResponse.headers);
      responseHeaders.delete("content-encoding");
      responseHeaders.delete("content-length");
      responseHeaders.delete("transfer-encoding");
      for (const [key, value] of Object.entries(corsHeaders)) {
        responseHeaders.set(key, value);
      }
      if (!stream && !isCompoundModel) {
        const data = await groqResponse.json();
        if (mode === "agent") {
          data.meta = { planId: callerPlan.planId, maxSteps: callerPlan.maxSteps };
        }
        return new Response(JSON.stringify(data), {
          status: groqResponse.status,
          headers: responseHeaders
        });
      }
      return new Response(groqResponse.body, {
        status: groqResponse.status,
        headers: responseHeaders
      });
    } catch (e) {
      console.error("Error processing successful Groq response:", e);
      return new Response("Internal Server Error: Error processing AI response.", { status: 500, headers: corsHeaders });
    }
  },
  async scheduled(event, env, ctx) {
    addBreadcrumb({ category: "cron", message: "Running statusMonitor cron", level: "info" });
    await scheduled(event, env, ctx);
  }
});

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
init_checked_fetch();
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
init_checked_fetch();
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error2 = reduceError(e);
    return Response.json(error2, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-7KM2z3/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// node_modules/wrangler/templates/middleware/common.ts
init_checked_fetch();
init_strip_cf_connecting_ip_header();
init_modules_watch_stub();
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-7KM2z3/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
__name(__Facade_ScheduledController__, "__Facade_ScheduledController__");
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init2) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init2.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = (request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    };
    #dispatcher = (type, init2) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init2.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    };
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
