(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ?  factory(exports, require('node:crypto')) :
  typeof define === 'function' && define.amd ? define(['exports', 'node:crypto'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.SignalWire = {}), global.node_crypto));
})(this, function(exports, node_crypto) {
//#region rolldown:runtime
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJSMin = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __copyProps = (to, from$7, except, desc) => {
	if (from$7 && typeof from$7 === "object" || typeof from$7 === "function") {
		for (var keys = __getOwnPropNames(from$7), i = 0, n = keys.length, key; i < n; i++) {
			key = keys[i];
			if (!__hasOwnProp.call(to, key) && key !== except) {
				__defProp(to, key, {
					get: ((k) => from$7[k]).bind(null, key),
					enumerable: !(desc = __getOwnPropDesc(from$7, key)) || desc.enumerable
				});
			}
		}
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));

//#endregion

//#region ../../node_modules/jwt-decode/build/esm/index.js
var InvalidTokenError = class extends Error {};
InvalidTokenError.prototype.name = "InvalidTokenError";
function b64DecodeUnicode(str) {
	return decodeURIComponent(atob(str).replace(/(.)/g, (m, p) => {
		let code = p.charCodeAt(0).toString(16).toUpperCase();
		if (code.length < 2) code = "0" + code;
		return "%" + code;
	}));
}
function base64UrlDecode(str) {
	let output = str.replace(/-/g, "+").replace(/_/g, "/");
	switch (output.length % 4) {
		case 0: break;
		case 2:
			output += "==";
			break;
		case 3:
			output += "=";
			break;
		default: throw new Error("base64 string is not of the correct length");
	}
	try {
		return b64DecodeUnicode(output);
	} catch (err) {
		return atob(output);
	}
}
function jwtDecode(token, options) {
	if (typeof token !== "string") throw new InvalidTokenError("Invalid token specified: must be a string");
	options || (options = {});
	const pos = options.header === true ? 0 : 1;
	const part = token.split(".")[pos];
	if (typeof part !== "string") throw new InvalidTokenError(`Invalid token specified: missing part #${pos + 1}`);
	let decoded;
	try {
		decoded = base64UrlDecode(part);
	} catch (e) {
		throw new InvalidTokenError(`Invalid token specified: invalid base64 for part #${pos + 1} (${e.message})`);
	}
	try {
		return JSON.parse(decoded);
	} catch (e) {
		throw new InvalidTokenError(`Invalid token specified: invalid json for part #${pos + 1} (${e.message})`);
	}
}

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/util/isFunction.js
var require_isFunction = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isFunction = void 0;
	function isFunction(value) {
		return typeof value === "function";
	}
	exports.isFunction = isFunction;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/util/createErrorClass.js
var require_createErrorClass = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.createErrorClass = void 0;
	function createErrorClass(createImpl) {
		var _super = function(instance) {
			Error.call(instance);
			instance.stack = (/* @__PURE__ */ new Error()).stack;
		};
		var ctorFunc = createImpl(_super);
		ctorFunc.prototype = Object.create(Error.prototype);
		ctorFunc.prototype.constructor = ctorFunc;
		return ctorFunc;
	}
	exports.createErrorClass = createErrorClass;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/util/UnsubscriptionError.js
var require_UnsubscriptionError = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.UnsubscriptionError = void 0;
	var createErrorClass_1$6 = require_createErrorClass();
	exports.UnsubscriptionError = createErrorClass_1$6.createErrorClass(function(_super) {
		return function UnsubscriptionErrorImpl(errors) {
			_super(this);
			this.message = errors ? errors.length + " errors occurred during unsubscription:\n" + errors.map(function(err, i) {
				return i + 1 + ") " + err.toString();
			}).join("\n  ") : "";
			this.name = "UnsubscriptionError";
			this.errors = errors;
		};
	});
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/util/arrRemove.js
var require_arrRemove = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.arrRemove = void 0;
	function arrRemove(arr, item) {
		if (arr) {
			var index = arr.indexOf(item);
			0 <= index && arr.splice(index, 1);
		}
	}
	exports.arrRemove = arrRemove;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/Subscription.js
var require_Subscription = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __values$8 = exports && exports.__values || function(o) {
		var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
		if (m) return m.call(o);
		if (o && typeof o.length === "number") return { next: function() {
			if (o && i >= o.length) o = void 0;
			return {
				value: o && o[i++],
				done: !o
			};
		} };
		throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
	};
	var __read$22 = exports && exports.__read || function(o, n) {
		var m = typeof Symbol === "function" && o[Symbol.iterator];
		if (!m) return o;
		var i = m.call(o), r, ar = [], e;
		try {
			while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
		} catch (error) {
			e = { error };
		} finally {
			try {
				if (r && !r.done && (m = i["return"])) m.call(i);
			} finally {
				if (e) throw e.error;
			}
		}
		return ar;
	};
	var __spreadArray$21 = exports && exports.__spreadArray || function(to, from$7) {
		for (var i = 0, il = from$7.length, j = to.length; i < il; i++, j++) to[j] = from$7[i];
		return to;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isSubscription = exports.EMPTY_SUBSCRIPTION = exports.Subscription = void 0;
	var isFunction_1$27 = require_isFunction();
	var UnsubscriptionError_1$1 = require_UnsubscriptionError();
	var arrRemove_1$7 = require_arrRemove();
	var Subscription = function() {
		function Subscription$1(initialTeardown) {
			this.initialTeardown = initialTeardown;
			this.closed = false;
			this._parentage = null;
			this._finalizers = null;
		}
		Subscription$1.prototype.unsubscribe = function() {
			var e_1, _a, e_2, _b;
			var errors;
			if (!this.closed) {
				this.closed = true;
				var _parentage = this._parentage;
				if (_parentage) {
					this._parentage = null;
					if (Array.isArray(_parentage)) try {
						for (var _parentage_1 = __values$8(_parentage), _parentage_1_1 = _parentage_1.next(); !_parentage_1_1.done; _parentage_1_1 = _parentage_1.next()) _parentage_1_1.value.remove(this);
					} catch (e_1_1) {
						e_1 = { error: e_1_1 };
					} finally {
						try {
							if (_parentage_1_1 && !_parentage_1_1.done && (_a = _parentage_1.return)) _a.call(_parentage_1);
						} finally {
							if (e_1) throw e_1.error;
						}
					}
					else _parentage.remove(this);
				}
				var initialFinalizer = this.initialTeardown;
				if (isFunction_1$27.isFunction(initialFinalizer)) try {
					initialFinalizer();
				} catch (e) {
					errors = e instanceof UnsubscriptionError_1$1.UnsubscriptionError ? e.errors : [e];
				}
				var _finalizers = this._finalizers;
				if (_finalizers) {
					this._finalizers = null;
					try {
						for (var _finalizers_1 = __values$8(_finalizers), _finalizers_1_1 = _finalizers_1.next(); !_finalizers_1_1.done; _finalizers_1_1 = _finalizers_1.next()) {
							var finalizer = _finalizers_1_1.value;
							try {
								execFinalizer(finalizer);
							} catch (err) {
								errors = errors !== null && errors !== void 0 ? errors : [];
								if (err instanceof UnsubscriptionError_1$1.UnsubscriptionError) errors = __spreadArray$21(__spreadArray$21([], __read$22(errors)), __read$22(err.errors));
								else errors.push(err);
							}
						}
					} catch (e_2_1) {
						e_2 = { error: e_2_1 };
					} finally {
						try {
							if (_finalizers_1_1 && !_finalizers_1_1.done && (_b = _finalizers_1.return)) _b.call(_finalizers_1);
						} finally {
							if (e_2) throw e_2.error;
						}
					}
				}
				if (errors) throw new UnsubscriptionError_1$1.UnsubscriptionError(errors);
			}
		};
		Subscription$1.prototype.add = function(teardown) {
			var _a;
			if (teardown && teardown !== this) if (this.closed) execFinalizer(teardown);
			else {
				if (teardown instanceof Subscription$1) {
					if (teardown.closed || teardown._hasParent(this)) return;
					teardown._addParent(this);
				}
				(this._finalizers = (_a = this._finalizers) !== null && _a !== void 0 ? _a : []).push(teardown);
			}
		};
		Subscription$1.prototype._hasParent = function(parent) {
			var _parentage = this._parentage;
			return _parentage === parent || Array.isArray(_parentage) && _parentage.includes(parent);
		};
		Subscription$1.prototype._addParent = function(parent) {
			var _parentage = this._parentage;
			this._parentage = Array.isArray(_parentage) ? (_parentage.push(parent), _parentage) : _parentage ? [_parentage, parent] : parent;
		};
		Subscription$1.prototype._removeParent = function(parent) {
			var _parentage = this._parentage;
			if (_parentage === parent) this._parentage = null;
			else if (Array.isArray(_parentage)) arrRemove_1$7.arrRemove(_parentage, parent);
		};
		Subscription$1.prototype.remove = function(teardown) {
			var _finalizers = this._finalizers;
			_finalizers && arrRemove_1$7.arrRemove(_finalizers, teardown);
			if (teardown instanceof Subscription$1) teardown._removeParent(this);
		};
		Subscription$1.EMPTY = (function() {
			var empty$1 = new Subscription$1();
			empty$1.closed = true;
			return empty$1;
		})();
		return Subscription$1;
	}();
	exports.Subscription = Subscription;
	exports.EMPTY_SUBSCRIPTION = Subscription.EMPTY;
	function isSubscription(value) {
		return value instanceof Subscription || value && "closed" in value && isFunction_1$27.isFunction(value.remove) && isFunction_1$27.isFunction(value.add) && isFunction_1$27.isFunction(value.unsubscribe);
	}
	exports.isSubscription = isSubscription;
	function execFinalizer(finalizer) {
		if (isFunction_1$27.isFunction(finalizer)) finalizer();
		else finalizer.unsubscribe();
	}
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/config.js
var require_config = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.config = void 0;
	exports.config = {
		onUnhandledError: null,
		onStoppedNotification: null,
		Promise: void 0,
		useDeprecatedSynchronousErrorHandling: false,
		useDeprecatedNextContext: false
	};
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/scheduler/timeoutProvider.js
var require_timeoutProvider = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __read$21 = exports && exports.__read || function(o, n) {
		var m = typeof Symbol === "function" && o[Symbol.iterator];
		if (!m) return o;
		var i = m.call(o), r, ar = [], e;
		try {
			while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
		} catch (error) {
			e = { error };
		} finally {
			try {
				if (r && !r.done && (m = i["return"])) m.call(i);
			} finally {
				if (e) throw e.error;
			}
		}
		return ar;
	};
	var __spreadArray$20 = exports && exports.__spreadArray || function(to, from$7) {
		for (var i = 0, il = from$7.length, j = to.length; i < il; i++, j++) to[j] = from$7[i];
		return to;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.timeoutProvider = void 0;
	exports.timeoutProvider = {
		setTimeout: function(handler, timeout$4) {
			var args = [];
			for (var _i = 2; _i < arguments.length; _i++) args[_i - 2] = arguments[_i];
			var delegate = exports.timeoutProvider.delegate;
			if (delegate === null || delegate === void 0 ? void 0 : delegate.setTimeout) return delegate.setTimeout.apply(delegate, __spreadArray$20([handler, timeout$4], __read$21(args)));
			return setTimeout.apply(void 0, __spreadArray$20([handler, timeout$4], __read$21(args)));
		},
		clearTimeout: function(handle) {
			var delegate = exports.timeoutProvider.delegate;
			return ((delegate === null || delegate === void 0 ? void 0 : delegate.clearTimeout) || clearTimeout)(handle);
		},
		delegate: void 0
	};
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/util/reportUnhandledError.js
var require_reportUnhandledError = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.reportUnhandledError = void 0;
	var config_1$4 = require_config();
	var timeoutProvider_1$1 = require_timeoutProvider();
	function reportUnhandledError(err) {
		timeoutProvider_1$1.timeoutProvider.setTimeout(function() {
			var onUnhandledError = config_1$4.config.onUnhandledError;
			if (onUnhandledError) onUnhandledError(err);
			else throw err;
		});
	}
	exports.reportUnhandledError = reportUnhandledError;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/util/noop.js
var require_noop = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.noop = void 0;
	function noop() {}
	exports.noop = noop;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/NotificationFactories.js
var require_NotificationFactories = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.createNotification = exports.nextNotification = exports.errorNotification = exports.COMPLETE_NOTIFICATION = void 0;
	exports.COMPLETE_NOTIFICATION = (function() {
		return createNotification("C", void 0, void 0);
	})();
	function errorNotification(error) {
		return createNotification("E", void 0, error);
	}
	exports.errorNotification = errorNotification;
	function nextNotification(value) {
		return createNotification("N", value, void 0);
	}
	exports.nextNotification = nextNotification;
	function createNotification(kind, value, error) {
		return {
			kind,
			value,
			error
		};
	}
	exports.createNotification = createNotification;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/util/errorContext.js
var require_errorContext = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.captureError = exports.errorContext = void 0;
	var config_1$3 = require_config();
	var context = null;
	function errorContext(cb) {
		if (config_1$3.config.useDeprecatedSynchronousErrorHandling) {
			var isRoot = !context;
			if (isRoot) context = {
				errorThrown: false,
				error: null
			};
			cb();
			if (isRoot) {
				var _a = context, errorThrown = _a.errorThrown, error = _a.error;
				context = null;
				if (errorThrown) throw error;
			}
		} else cb();
	}
	exports.errorContext = errorContext;
	function captureError(err) {
		if (config_1$3.config.useDeprecatedSynchronousErrorHandling && context) {
			context.errorThrown = true;
			context.error = err;
		}
	}
	exports.captureError = captureError;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/Subscriber.js
var require_Subscriber = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __extends$16 = exports && exports.__extends || (function() {
		var extendStatics = function(d, b) {
			extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d$1, b$1) {
				d$1.__proto__ = b$1;
			} || function(d$1, b$1) {
				for (var p in b$1) if (Object.prototype.hasOwnProperty.call(b$1, p)) d$1[p] = b$1[p];
			};
			return extendStatics(d, b);
		};
		return function(d, b) {
			if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
			extendStatics(d, b);
			function __() {
				this.constructor = d;
			}
			d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
		};
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.EMPTY_OBSERVER = exports.SafeSubscriber = exports.Subscriber = void 0;
	var isFunction_1$26 = require_isFunction();
	var Subscription_1$10 = require_Subscription();
	var config_1$2 = require_config();
	var reportUnhandledError_1$1 = require_reportUnhandledError();
	var noop_1$15 = require_noop();
	var NotificationFactories_1 = require_NotificationFactories();
	var timeoutProvider_1 = require_timeoutProvider();
	var errorContext_1$2 = require_errorContext();
	var Subscriber$1 = function(_super) {
		__extends$16(Subscriber$2, _super);
		function Subscriber$2(destination) {
			var _this = _super.call(this) || this;
			_this.isStopped = false;
			if (destination) {
				_this.destination = destination;
				if (Subscription_1$10.isSubscription(destination)) destination.add(_this);
			} else _this.destination = exports.EMPTY_OBSERVER;
			return _this;
		}
		Subscriber$2.create = function(next, error, complete) {
			return new SafeSubscriber(next, error, complete);
		};
		Subscriber$2.prototype.next = function(value) {
			if (this.isStopped) handleStoppedNotification(NotificationFactories_1.nextNotification(value), this);
			else this._next(value);
		};
		Subscriber$2.prototype.error = function(err) {
			if (this.isStopped) handleStoppedNotification(NotificationFactories_1.errorNotification(err), this);
			else {
				this.isStopped = true;
				this._error(err);
			}
		};
		Subscriber$2.prototype.complete = function() {
			if (this.isStopped) handleStoppedNotification(NotificationFactories_1.COMPLETE_NOTIFICATION, this);
			else {
				this.isStopped = true;
				this._complete();
			}
		};
		Subscriber$2.prototype.unsubscribe = function() {
			if (!this.closed) {
				this.isStopped = true;
				_super.prototype.unsubscribe.call(this);
				this.destination = null;
			}
		};
		Subscriber$2.prototype._next = function(value) {
			this.destination.next(value);
		};
		Subscriber$2.prototype._error = function(err) {
			try {
				this.destination.error(err);
			} finally {
				this.unsubscribe();
			}
		};
		Subscriber$2.prototype._complete = function() {
			try {
				this.destination.complete();
			} finally {
				this.unsubscribe();
			}
		};
		return Subscriber$2;
	}(Subscription_1$10.Subscription);
	exports.Subscriber = Subscriber$1;
	var _bind = Function.prototype.bind;
	function bind(fn, thisArg) {
		return _bind.call(fn, thisArg);
	}
	var ConsumerObserver = function() {
		function ConsumerObserver$1(partialObserver) {
			this.partialObserver = partialObserver;
		}
		ConsumerObserver$1.prototype.next = function(value) {
			var partialObserver = this.partialObserver;
			if (partialObserver.next) try {
				partialObserver.next(value);
			} catch (error) {
				handleUnhandledError(error);
			}
		};
		ConsumerObserver$1.prototype.error = function(err) {
			var partialObserver = this.partialObserver;
			if (partialObserver.error) try {
				partialObserver.error(err);
			} catch (error) {
				handleUnhandledError(error);
			}
			else handleUnhandledError(err);
		};
		ConsumerObserver$1.prototype.complete = function() {
			var partialObserver = this.partialObserver;
			if (partialObserver.complete) try {
				partialObserver.complete();
			} catch (error) {
				handleUnhandledError(error);
			}
		};
		return ConsumerObserver$1;
	}();
	var SafeSubscriber = function(_super) {
		__extends$16(SafeSubscriber$1, _super);
		function SafeSubscriber$1(observerOrNext, error, complete) {
			var _this = _super.call(this) || this;
			var partialObserver;
			if (isFunction_1$26.isFunction(observerOrNext) || !observerOrNext) partialObserver = {
				next: observerOrNext !== null && observerOrNext !== void 0 ? observerOrNext : void 0,
				error: error !== null && error !== void 0 ? error : void 0,
				complete: complete !== null && complete !== void 0 ? complete : void 0
			};
			else {
				var context_1;
				if (_this && config_1$2.config.useDeprecatedNextContext) {
					context_1 = Object.create(observerOrNext);
					context_1.unsubscribe = function() {
						return _this.unsubscribe();
					};
					partialObserver = {
						next: observerOrNext.next && bind(observerOrNext.next, context_1),
						error: observerOrNext.error && bind(observerOrNext.error, context_1),
						complete: observerOrNext.complete && bind(observerOrNext.complete, context_1)
					};
				} else partialObserver = observerOrNext;
			}
			_this.destination = new ConsumerObserver(partialObserver);
			return _this;
		}
		return SafeSubscriber$1;
	}(Subscriber$1);
	exports.SafeSubscriber = SafeSubscriber;
	function handleUnhandledError(error) {
		if (config_1$2.config.useDeprecatedSynchronousErrorHandling) errorContext_1$2.captureError(error);
		else reportUnhandledError_1$1.reportUnhandledError(error);
	}
	function defaultErrorHandler(err) {
		throw err;
	}
	function handleStoppedNotification(notification, subscriber) {
		var onStoppedNotification = config_1$2.config.onStoppedNotification;
		onStoppedNotification && timeoutProvider_1.timeoutProvider.setTimeout(function() {
			return onStoppedNotification(notification, subscriber);
		});
	}
	exports.EMPTY_OBSERVER = {
		closed: true,
		next: noop_1$15.noop,
		error: defaultErrorHandler,
		complete: noop_1$15.noop
	};
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/symbol/observable.js
var require_observable = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.observable = void 0;
	exports.observable = (function() {
		return typeof Symbol === "function" && Symbol.observable || "@@observable";
	})();
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/util/identity.js
var require_identity = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.identity = void 0;
	function identity(x) {
		return x;
	}
	exports.identity = identity;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/util/pipe.js
var require_pipe = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.pipeFromArray = exports.pipe = void 0;
	var identity_1$15 = require_identity();
	function pipe$2() {
		var fns = [];
		for (var _i = 0; _i < arguments.length; _i++) fns[_i] = arguments[_i];
		return pipeFromArray(fns);
	}
	exports.pipe = pipe$2;
	function pipeFromArray(fns) {
		if (fns.length === 0) return identity_1$15.identity;
		if (fns.length === 1) return fns[0];
		return function piped(input) {
			return fns.reduce(function(prev, fn) {
				return fn(prev);
			}, input);
		};
	}
	exports.pipeFromArray = pipeFromArray;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/Observable.js
var require_Observable = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Observable = void 0;
	var Subscriber_1$4 = require_Subscriber();
	var Subscription_1$9 = require_Subscription();
	var observable_1$3 = require_observable();
	var pipe_1$3 = require_pipe();
	var config_1$1 = require_config();
	var isFunction_1$25 = require_isFunction();
	var errorContext_1$1 = require_errorContext();
	var Observable$1 = function() {
		function Observable$2(subscribe) {
			if (subscribe) this._subscribe = subscribe;
		}
		Observable$2.prototype.lift = function(operator) {
			var observable = new Observable$2();
			observable.source = this;
			observable.operator = operator;
			return observable;
		};
		Observable$2.prototype.subscribe = function(observerOrNext, error, complete) {
			var _this = this;
			var subscriber = isSubscriber(observerOrNext) ? observerOrNext : new Subscriber_1$4.SafeSubscriber(observerOrNext, error, complete);
			errorContext_1$1.errorContext(function() {
				var _a = _this, operator = _a.operator, source = _a.source;
				subscriber.add(operator ? operator.call(subscriber, source) : source ? _this._subscribe(subscriber) : _this._trySubscribe(subscriber));
			});
			return subscriber;
		};
		Observable$2.prototype._trySubscribe = function(sink) {
			try {
				return this._subscribe(sink);
			} catch (err) {
				sink.error(err);
			}
		};
		Observable$2.prototype.forEach = function(next, promiseCtor) {
			var _this = this;
			promiseCtor = getPromiseCtor(promiseCtor);
			return new promiseCtor(function(resolve, reject) {
				var subscriber = new Subscriber_1$4.SafeSubscriber({
					next: function(value) {
						try {
							next(value);
						} catch (err) {
							reject(err);
							subscriber.unsubscribe();
						}
					},
					error: reject,
					complete: resolve
				});
				_this.subscribe(subscriber);
			});
		};
		Observable$2.prototype._subscribe = function(subscriber) {
			var _a;
			return (_a = this.source) === null || _a === void 0 ? void 0 : _a.subscribe(subscriber);
		};
		Observable$2.prototype[observable_1$3.observable] = function() {
			return this;
		};
		Observable$2.prototype.pipe = function() {
			var operations = [];
			for (var _i = 0; _i < arguments.length; _i++) operations[_i] = arguments[_i];
			return pipe_1$3.pipeFromArray(operations)(this);
		};
		Observable$2.prototype.toPromise = function(promiseCtor) {
			var _this = this;
			promiseCtor = getPromiseCtor(promiseCtor);
			return new promiseCtor(function(resolve, reject) {
				var value;
				_this.subscribe(function(x) {
					return value = x;
				}, function(err) {
					return reject(err);
				}, function() {
					return resolve(value);
				});
			});
		};
		Observable$2.create = function(subscribe) {
			return new Observable$2(subscribe);
		};
		return Observable$2;
	}();
	exports.Observable = Observable$1;
	function getPromiseCtor(promiseCtor) {
		var _a;
		return (_a = promiseCtor !== null && promiseCtor !== void 0 ? promiseCtor : config_1$1.config.Promise) !== null && _a !== void 0 ? _a : Promise;
	}
	function isObserver(value) {
		return value && isFunction_1$25.isFunction(value.next) && isFunction_1$25.isFunction(value.error) && isFunction_1$25.isFunction(value.complete);
	}
	function isSubscriber(value) {
		return value && value instanceof Subscriber_1$4.Subscriber || isObserver(value) && Subscription_1$9.isSubscription(value);
	}
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/util/lift.js
var require_lift = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.operate = exports.hasLift = void 0;
	var isFunction_1$24 = require_isFunction();
	function hasLift(source) {
		return isFunction_1$24.isFunction(source === null || source === void 0 ? void 0 : source.lift);
	}
	exports.hasLift = hasLift;
	function operate(init) {
		return function(source) {
			if (hasLift(source)) return source.lift(function(liftedSource) {
				try {
					return init(liftedSource, this);
				} catch (err) {
					this.error(err);
				}
			});
			throw new TypeError("Unable to lift unknown Observable type");
		};
	}
	exports.operate = operate;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/OperatorSubscriber.js
var require_OperatorSubscriber = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __extends$15 = exports && exports.__extends || (function() {
		var extendStatics = function(d, b) {
			extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d$1, b$1) {
				d$1.__proto__ = b$1;
			} || function(d$1, b$1) {
				for (var p in b$1) if (Object.prototype.hasOwnProperty.call(b$1, p)) d$1[p] = b$1[p];
			};
			return extendStatics(d, b);
		};
		return function(d, b) {
			if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
			extendStatics(d, b);
			function __() {
				this.constructor = d;
			}
			d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
		};
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.OperatorSubscriber = exports.createOperatorSubscriber = void 0;
	var Subscriber_1$3 = require_Subscriber();
	function createOperatorSubscriber(destination, onNext, onComplete, onError, onFinalize) {
		return new OperatorSubscriber(destination, onNext, onComplete, onError, onFinalize);
	}
	exports.createOperatorSubscriber = createOperatorSubscriber;
	var OperatorSubscriber = function(_super) {
		__extends$15(OperatorSubscriber$1, _super);
		function OperatorSubscriber$1(destination, onNext, onComplete, onError, onFinalize, shouldUnsubscribe) {
			var _this = _super.call(this, destination) || this;
			_this.onFinalize = onFinalize;
			_this.shouldUnsubscribe = shouldUnsubscribe;
			_this._next = onNext ? function(value) {
				try {
					onNext(value);
				} catch (err) {
					destination.error(err);
				}
			} : _super.prototype._next;
			_this._error = onError ? function(err) {
				try {
					onError(err);
				} catch (err$1) {
					destination.error(err$1);
				} finally {
					this.unsubscribe();
				}
			} : _super.prototype._error;
			_this._complete = onComplete ? function() {
				try {
					onComplete();
				} catch (err) {
					destination.error(err);
				} finally {
					this.unsubscribe();
				}
			} : _super.prototype._complete;
			return _this;
		}
		OperatorSubscriber$1.prototype.unsubscribe = function() {
			var _a;
			if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
				var closed_1 = this.closed;
				_super.prototype.unsubscribe.call(this);
				!closed_1 && ((_a = this.onFinalize) === null || _a === void 0 || _a.call(this));
			}
		};
		return OperatorSubscriber$1;
	}(Subscriber_1$3.Subscriber);
	exports.OperatorSubscriber = OperatorSubscriber;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/refCount.js
var require_refCount = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.refCount = void 0;
	var lift_1$69 = require_lift();
	var OperatorSubscriber_1$58 = require_OperatorSubscriber();
	function refCount() {
		return lift_1$69.operate(function(source, subscriber) {
			var connection = null;
			source._refCount++;
			var refCounter = OperatorSubscriber_1$58.createOperatorSubscriber(subscriber, void 0, void 0, void 0, function() {
				if (!source || source._refCount <= 0 || 0 < --source._refCount) {
					connection = null;
					return;
				}
				var sharedConnection = source._connection;
				var conn = connection;
				connection = null;
				if (sharedConnection && (!conn || sharedConnection === conn)) sharedConnection.unsubscribe();
				subscriber.unsubscribe();
			});
			source.subscribe(refCounter);
			if (!refCounter.closed) connection = source.connect();
		});
	}
	exports.refCount = refCount;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/observable/ConnectableObservable.js
var require_ConnectableObservable = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __extends$14 = exports && exports.__extends || (function() {
		var extendStatics = function(d, b) {
			extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d$1, b$1) {
				d$1.__proto__ = b$1;
			} || function(d$1, b$1) {
				for (var p in b$1) if (Object.prototype.hasOwnProperty.call(b$1, p)) d$1[p] = b$1[p];
			};
			return extendStatics(d, b);
		};
		return function(d, b) {
			if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
			extendStatics(d, b);
			function __() {
				this.constructor = d;
			}
			d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
		};
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ConnectableObservable = void 0;
	var Observable_1$26 = require_Observable();
	var Subscription_1$8 = require_Subscription();
	var refCount_1$2 = require_refCount();
	var OperatorSubscriber_1$57 = require_OperatorSubscriber();
	var lift_1$68 = require_lift();
	var ConnectableObservable = function(_super) {
		__extends$14(ConnectableObservable$1, _super);
		function ConnectableObservable$1(source, subjectFactory) {
			var _this = _super.call(this) || this;
			_this.source = source;
			_this.subjectFactory = subjectFactory;
			_this._subject = null;
			_this._refCount = 0;
			_this._connection = null;
			if (lift_1$68.hasLift(source)) _this.lift = source.lift;
			return _this;
		}
		ConnectableObservable$1.prototype._subscribe = function(subscriber) {
			return this.getSubject().subscribe(subscriber);
		};
		ConnectableObservable$1.prototype.getSubject = function() {
			var subject = this._subject;
			if (!subject || subject.isStopped) this._subject = this.subjectFactory();
			return this._subject;
		};
		ConnectableObservable$1.prototype._teardown = function() {
			this._refCount = 0;
			var _connection = this._connection;
			this._subject = this._connection = null;
			_connection === null || _connection === void 0 || _connection.unsubscribe();
		};
		ConnectableObservable$1.prototype.connect = function() {
			var _this = this;
			var connection = this._connection;
			if (!connection) {
				connection = this._connection = new Subscription_1$8.Subscription();
				var subject_1 = this.getSubject();
				connection.add(this.source.subscribe(OperatorSubscriber_1$57.createOperatorSubscriber(subject_1, void 0, function() {
					_this._teardown();
					subject_1.complete();
				}, function(err) {
					_this._teardown();
					subject_1.error(err);
				}, function() {
					return _this._teardown();
				})));
				if (connection.closed) {
					this._connection = null;
					connection = Subscription_1$8.Subscription.EMPTY;
				}
			}
			return connection;
		};
		ConnectableObservable$1.prototype.refCount = function() {
			return refCount_1$2.refCount()(this);
		};
		return ConnectableObservable$1;
	}(Observable_1$26.Observable);
	exports.ConnectableObservable = ConnectableObservable;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/scheduler/performanceTimestampProvider.js
var require_performanceTimestampProvider = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.performanceTimestampProvider = void 0;
	exports.performanceTimestampProvider = {
		now: function() {
			return (exports.performanceTimestampProvider.delegate || performance).now();
		},
		delegate: void 0
	};
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/scheduler/animationFrameProvider.js
var require_animationFrameProvider = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __read$20 = exports && exports.__read || function(o, n) {
		var m = typeof Symbol === "function" && o[Symbol.iterator];
		if (!m) return o;
		var i = m.call(o), r, ar = [], e;
		try {
			while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
		} catch (error) {
			e = { error };
		} finally {
			try {
				if (r && !r.done && (m = i["return"])) m.call(i);
			} finally {
				if (e) throw e.error;
			}
		}
		return ar;
	};
	var __spreadArray$19 = exports && exports.__spreadArray || function(to, from$7) {
		for (var i = 0, il = from$7.length, j = to.length; i < il; i++, j++) to[j] = from$7[i];
		return to;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.animationFrameProvider = void 0;
	var Subscription_1$7 = require_Subscription();
	exports.animationFrameProvider = {
		schedule: function(callback) {
			var request = requestAnimationFrame;
			var cancel = cancelAnimationFrame;
			var delegate = exports.animationFrameProvider.delegate;
			if (delegate) {
				request = delegate.requestAnimationFrame;
				cancel = delegate.cancelAnimationFrame;
			}
			var handle = request(function(timestamp$1) {
				cancel = void 0;
				callback(timestamp$1);
			});
			return new Subscription_1$7.Subscription(function() {
				return cancel === null || cancel === void 0 ? void 0 : cancel(handle);
			});
		},
		requestAnimationFrame: function() {
			var args = [];
			for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
			var delegate = exports.animationFrameProvider.delegate;
			return ((delegate === null || delegate === void 0 ? void 0 : delegate.requestAnimationFrame) || requestAnimationFrame).apply(void 0, __spreadArray$19([], __read$20(args)));
		},
		cancelAnimationFrame: function() {
			var args = [];
			for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
			var delegate = exports.animationFrameProvider.delegate;
			return ((delegate === null || delegate === void 0 ? void 0 : delegate.cancelAnimationFrame) || cancelAnimationFrame).apply(void 0, __spreadArray$19([], __read$20(args)));
		},
		delegate: void 0
	};
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/observable/dom/animationFrames.js
var require_animationFrames = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.animationFrames = void 0;
	var Observable_1$25 = require_Observable();
	var performanceTimestampProvider_1 = require_performanceTimestampProvider();
	var animationFrameProvider_1$1 = require_animationFrameProvider();
	function animationFrames(timestampProvider) {
		return timestampProvider ? animationFramesFactory(timestampProvider) : DEFAULT_ANIMATION_FRAMES;
	}
	exports.animationFrames = animationFrames;
	function animationFramesFactory(timestampProvider) {
		return new Observable_1$25.Observable(function(subscriber) {
			var provider = timestampProvider || performanceTimestampProvider_1.performanceTimestampProvider;
			var start = provider.now();
			var id = 0;
			var run = function() {
				if (!subscriber.closed) id = animationFrameProvider_1$1.animationFrameProvider.requestAnimationFrame(function(timestamp$1) {
					id = 0;
					var now = provider.now();
					subscriber.next({
						timestamp: timestampProvider ? now : timestamp$1,
						elapsed: now - start
					});
					run();
				});
			};
			run();
			return function() {
				if (id) animationFrameProvider_1$1.animationFrameProvider.cancelAnimationFrame(id);
			};
		});
	}
	var DEFAULT_ANIMATION_FRAMES = animationFramesFactory();
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/util/ObjectUnsubscribedError.js
var require_ObjectUnsubscribedError = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ObjectUnsubscribedError = void 0;
	var createErrorClass_1$5 = require_createErrorClass();
	exports.ObjectUnsubscribedError = createErrorClass_1$5.createErrorClass(function(_super) {
		return function ObjectUnsubscribedErrorImpl() {
			_super(this);
			this.name = "ObjectUnsubscribedError";
			this.message = "object unsubscribed";
		};
	});
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/Subject.js
var require_Subject = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __extends$13 = exports && exports.__extends || (function() {
		var extendStatics = function(d, b) {
			extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d$1, b$1) {
				d$1.__proto__ = b$1;
			} || function(d$1, b$1) {
				for (var p in b$1) if (Object.prototype.hasOwnProperty.call(b$1, p)) d$1[p] = b$1[p];
			};
			return extendStatics(d, b);
		};
		return function(d, b) {
			if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
			extendStatics(d, b);
			function __() {
				this.constructor = d;
			}
			d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
		};
	})();
	var __values$7 = exports && exports.__values || function(o) {
		var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
		if (m) return m.call(o);
		if (o && typeof o.length === "number") return { next: function() {
			if (o && i >= o.length) o = void 0;
			return {
				value: o && o[i++],
				done: !o
			};
		} };
		throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.AnonymousSubject = exports.Subject = void 0;
	var Observable_1$24 = require_Observable();
	var Subscription_1$6 = require_Subscription();
	var ObjectUnsubscribedError_1$1 = require_ObjectUnsubscribedError();
	var arrRemove_1$6 = require_arrRemove();
	var errorContext_1 = require_errorContext();
	var Subject$3 = function(_super) {
		__extends$13(Subject$4, _super);
		function Subject$4() {
			var _this = _super.call(this) || this;
			_this.closed = false;
			_this.currentObservers = null;
			_this.observers = [];
			_this.isStopped = false;
			_this.hasError = false;
			_this.thrownError = null;
			return _this;
		}
		Subject$4.prototype.lift = function(operator) {
			var subject = new AnonymousSubject(this, this);
			subject.operator = operator;
			return subject;
		};
		Subject$4.prototype._throwIfClosed = function() {
			if (this.closed) throw new ObjectUnsubscribedError_1$1.ObjectUnsubscribedError();
		};
		Subject$4.prototype.next = function(value) {
			var _this = this;
			errorContext_1.errorContext(function() {
				var e_1, _a;
				_this._throwIfClosed();
				if (!_this.isStopped) {
					if (!_this.currentObservers) _this.currentObservers = Array.from(_this.observers);
					try {
						for (var _b = __values$7(_this.currentObservers), _c = _b.next(); !_c.done; _c = _b.next()) _c.value.next(value);
					} catch (e_1_1) {
						e_1 = { error: e_1_1 };
					} finally {
						try {
							if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
						} finally {
							if (e_1) throw e_1.error;
						}
					}
				}
			});
		};
		Subject$4.prototype.error = function(err) {
			var _this = this;
			errorContext_1.errorContext(function() {
				_this._throwIfClosed();
				if (!_this.isStopped) {
					_this.hasError = _this.isStopped = true;
					_this.thrownError = err;
					var observers = _this.observers;
					while (observers.length) observers.shift().error(err);
				}
			});
		};
		Subject$4.prototype.complete = function() {
			var _this = this;
			errorContext_1.errorContext(function() {
				_this._throwIfClosed();
				if (!_this.isStopped) {
					_this.isStopped = true;
					var observers = _this.observers;
					while (observers.length) observers.shift().complete();
				}
			});
		};
		Subject$4.prototype.unsubscribe = function() {
			this.isStopped = this.closed = true;
			this.observers = this.currentObservers = null;
		};
		Object.defineProperty(Subject$4.prototype, "observed", {
			get: function() {
				var _a;
				return ((_a = this.observers) === null || _a === void 0 ? void 0 : _a.length) > 0;
			},
			enumerable: false,
			configurable: true
		});
		Subject$4.prototype._trySubscribe = function(subscriber) {
			this._throwIfClosed();
			return _super.prototype._trySubscribe.call(this, subscriber);
		};
		Subject$4.prototype._subscribe = function(subscriber) {
			this._throwIfClosed();
			this._checkFinalizedStatuses(subscriber);
			return this._innerSubscribe(subscriber);
		};
		Subject$4.prototype._innerSubscribe = function(subscriber) {
			var _this = this;
			var _a = this, hasError = _a.hasError, isStopped = _a.isStopped, observers = _a.observers;
			if (hasError || isStopped) return Subscription_1$6.EMPTY_SUBSCRIPTION;
			this.currentObservers = null;
			observers.push(subscriber);
			return new Subscription_1$6.Subscription(function() {
				_this.currentObservers = null;
				arrRemove_1$6.arrRemove(observers, subscriber);
			});
		};
		Subject$4.prototype._checkFinalizedStatuses = function(subscriber) {
			var _a = this, hasError = _a.hasError, thrownError = _a.thrownError, isStopped = _a.isStopped;
			if (hasError) subscriber.error(thrownError);
			else if (isStopped) subscriber.complete();
		};
		Subject$4.prototype.asObservable = function() {
			var observable = new Observable_1$24.Observable();
			observable.source = this;
			return observable;
		};
		Subject$4.create = function(destination, source) {
			return new AnonymousSubject(destination, source);
		};
		return Subject$4;
	}(Observable_1$24.Observable);
	exports.Subject = Subject$3;
	var AnonymousSubject = function(_super) {
		__extends$13(AnonymousSubject$1, _super);
		function AnonymousSubject$1(destination, source) {
			var _this = _super.call(this) || this;
			_this.destination = destination;
			_this.source = source;
			return _this;
		}
		AnonymousSubject$1.prototype.next = function(value) {
			var _a, _b;
			(_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.next) === null || _b === void 0 || _b.call(_a, value);
		};
		AnonymousSubject$1.prototype.error = function(err) {
			var _a, _b;
			(_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 || _b.call(_a, err);
		};
		AnonymousSubject$1.prototype.complete = function() {
			var _a, _b;
			(_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.complete) === null || _b === void 0 || _b.call(_a);
		};
		AnonymousSubject$1.prototype._subscribe = function(subscriber) {
			var _a, _b;
			return (_b = (_a = this.source) === null || _a === void 0 ? void 0 : _a.subscribe(subscriber)) !== null && _b !== void 0 ? _b : Subscription_1$6.EMPTY_SUBSCRIPTION;
		};
		return AnonymousSubject$1;
	}(Subject$3);
	exports.AnonymousSubject = AnonymousSubject;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/BehaviorSubject.js
var require_BehaviorSubject = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __extends$12 = exports && exports.__extends || (function() {
		var extendStatics = function(d, b) {
			extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d$1, b$1) {
				d$1.__proto__ = b$1;
			} || function(d$1, b$1) {
				for (var p in b$1) if (Object.prototype.hasOwnProperty.call(b$1, p)) d$1[p] = b$1[p];
			};
			return extendStatics(d, b);
		};
		return function(d, b) {
			if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
			extendStatics(d, b);
			function __() {
				this.constructor = d;
			}
			d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
		};
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.BehaviorSubject = void 0;
	var BehaviorSubject$2 = function(_super) {
		__extends$12(BehaviorSubject$3, _super);
		function BehaviorSubject$3(_value) {
			var _this = _super.call(this) || this;
			_this._value = _value;
			return _this;
		}
		Object.defineProperty(BehaviorSubject$3.prototype, "value", {
			get: function() {
				return this.getValue();
			},
			enumerable: false,
			configurable: true
		});
		BehaviorSubject$3.prototype._subscribe = function(subscriber) {
			var subscription = _super.prototype._subscribe.call(this, subscriber);
			!subscription.closed && subscriber.next(this._value);
			return subscription;
		};
		BehaviorSubject$3.prototype.getValue = function() {
			var _a = this, hasError = _a.hasError, thrownError = _a.thrownError, _value = _a._value;
			if (hasError) throw thrownError;
			this._throwIfClosed();
			return _value;
		};
		BehaviorSubject$3.prototype.next = function(value) {
			_super.prototype.next.call(this, this._value = value);
		};
		return BehaviorSubject$3;
	}(require_Subject().Subject);
	exports.BehaviorSubject = BehaviorSubject$2;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/scheduler/dateTimestampProvider.js
var require_dateTimestampProvider = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.dateTimestampProvider = void 0;
	exports.dateTimestampProvider = {
		now: function() {
			return (exports.dateTimestampProvider.delegate || Date).now();
		},
		delegate: void 0
	};
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/ReplaySubject.js
var require_ReplaySubject = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __extends$11 = exports && exports.__extends || (function() {
		var extendStatics = function(d, b) {
			extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d$1, b$1) {
				d$1.__proto__ = b$1;
			} || function(d$1, b$1) {
				for (var p in b$1) if (Object.prototype.hasOwnProperty.call(b$1, p)) d$1[p] = b$1[p];
			};
			return extendStatics(d, b);
		};
		return function(d, b) {
			if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
			extendStatics(d, b);
			function __() {
				this.constructor = d;
			}
			d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
		};
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ReplaySubject = void 0;
	var Subject_1$13 = require_Subject();
	var dateTimestampProvider_1$2 = require_dateTimestampProvider();
	var ReplaySubject$2 = function(_super) {
		__extends$11(ReplaySubject$3, _super);
		function ReplaySubject$3(_bufferSize, _windowTime, _timestampProvider) {
			if (_bufferSize === void 0) _bufferSize = Infinity;
			if (_windowTime === void 0) _windowTime = Infinity;
			if (_timestampProvider === void 0) _timestampProvider = dateTimestampProvider_1$2.dateTimestampProvider;
			var _this = _super.call(this) || this;
			_this._bufferSize = _bufferSize;
			_this._windowTime = _windowTime;
			_this._timestampProvider = _timestampProvider;
			_this._buffer = [];
			_this._infiniteTimeWindow = true;
			_this._infiniteTimeWindow = _windowTime === Infinity;
			_this._bufferSize = Math.max(1, _bufferSize);
			_this._windowTime = Math.max(1, _windowTime);
			return _this;
		}
		ReplaySubject$3.prototype.next = function(value) {
			var _a = this, isStopped = _a.isStopped, _buffer = _a._buffer, _infiniteTimeWindow = _a._infiniteTimeWindow, _timestampProvider = _a._timestampProvider, _windowTime = _a._windowTime;
			if (!isStopped) {
				_buffer.push(value);
				!_infiniteTimeWindow && _buffer.push(_timestampProvider.now() + _windowTime);
			}
			this._trimBuffer();
			_super.prototype.next.call(this, value);
		};
		ReplaySubject$3.prototype._subscribe = function(subscriber) {
			this._throwIfClosed();
			this._trimBuffer();
			var subscription = this._innerSubscribe(subscriber);
			var _a = this, _infiniteTimeWindow = _a._infiniteTimeWindow;
			var copy = _a._buffer.slice();
			for (var i = 0; i < copy.length && !subscriber.closed; i += _infiniteTimeWindow ? 1 : 2) subscriber.next(copy[i]);
			this._checkFinalizedStatuses(subscriber);
			return subscription;
		};
		ReplaySubject$3.prototype._trimBuffer = function() {
			var _a = this, _bufferSize = _a._bufferSize, _timestampProvider = _a._timestampProvider, _buffer = _a._buffer, _infiniteTimeWindow = _a._infiniteTimeWindow;
			var adjustedBufferSize = (_infiniteTimeWindow ? 1 : 2) * _bufferSize;
			_bufferSize < Infinity && adjustedBufferSize < _buffer.length && _buffer.splice(0, _buffer.length - adjustedBufferSize);
			if (!_infiniteTimeWindow) {
				var now = _timestampProvider.now();
				var last$2 = 0;
				for (var i = 1; i < _buffer.length && _buffer[i] <= now; i += 2) last$2 = i;
				last$2 && _buffer.splice(0, last$2 + 1);
			}
		};
		return ReplaySubject$3;
	}(Subject_1$13.Subject);
	exports.ReplaySubject = ReplaySubject$2;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/AsyncSubject.js
var require_AsyncSubject = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __extends$10 = exports && exports.__extends || (function() {
		var extendStatics = function(d, b) {
			extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d$1, b$1) {
				d$1.__proto__ = b$1;
			} || function(d$1, b$1) {
				for (var p in b$1) if (Object.prototype.hasOwnProperty.call(b$1, p)) d$1[p] = b$1[p];
			};
			return extendStatics(d, b);
		};
		return function(d, b) {
			if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
			extendStatics(d, b);
			function __() {
				this.constructor = d;
			}
			d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
		};
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.AsyncSubject = void 0;
	var AsyncSubject = function(_super) {
		__extends$10(AsyncSubject$1, _super);
		function AsyncSubject$1() {
			var _this = _super !== null && _super.apply(this, arguments) || this;
			_this._value = null;
			_this._hasValue = false;
			_this._isComplete = false;
			return _this;
		}
		AsyncSubject$1.prototype._checkFinalizedStatuses = function(subscriber) {
			var _a = this, hasError = _a.hasError, _hasValue = _a._hasValue, _value = _a._value, thrownError = _a.thrownError, isStopped = _a.isStopped, _isComplete = _a._isComplete;
			if (hasError) subscriber.error(thrownError);
			else if (isStopped || _isComplete) {
				_hasValue && subscriber.next(_value);
				subscriber.complete();
			}
		};
		AsyncSubject$1.prototype.next = function(value) {
			if (!this.isStopped) {
				this._value = value;
				this._hasValue = true;
			}
		};
		AsyncSubject$1.prototype.complete = function() {
			var _a = this, _hasValue = _a._hasValue, _value = _a._value;
			if (!_a._isComplete) {
				this._isComplete = true;
				_hasValue && _super.prototype.next.call(this, _value);
				_super.prototype.complete.call(this);
			}
		};
		return AsyncSubject$1;
	}(require_Subject().Subject);
	exports.AsyncSubject = AsyncSubject;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/scheduler/Action.js
var require_Action = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __extends$9 = exports && exports.__extends || (function() {
		var extendStatics = function(d, b) {
			extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d$1, b$1) {
				d$1.__proto__ = b$1;
			} || function(d$1, b$1) {
				for (var p in b$1) if (Object.prototype.hasOwnProperty.call(b$1, p)) d$1[p] = b$1[p];
			};
			return extendStatics(d, b);
		};
		return function(d, b) {
			if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
			extendStatics(d, b);
			function __() {
				this.constructor = d;
			}
			d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
		};
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Action = void 0;
	var Action = function(_super) {
		__extends$9(Action$1, _super);
		function Action$1(scheduler, work) {
			return _super.call(this) || this;
		}
		Action$1.prototype.schedule = function(state, delay$1) {
			if (delay$1 === void 0) delay$1 = 0;
			return this;
		};
		return Action$1;
	}(require_Subscription().Subscription);
	exports.Action = Action;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/scheduler/intervalProvider.js
var require_intervalProvider = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __read$19 = exports && exports.__read || function(o, n) {
		var m = typeof Symbol === "function" && o[Symbol.iterator];
		if (!m) return o;
		var i = m.call(o), r, ar = [], e;
		try {
			while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
		} catch (error) {
			e = { error };
		} finally {
			try {
				if (r && !r.done && (m = i["return"])) m.call(i);
			} finally {
				if (e) throw e.error;
			}
		}
		return ar;
	};
	var __spreadArray$18 = exports && exports.__spreadArray || function(to, from$7) {
		for (var i = 0, il = from$7.length, j = to.length; i < il; i++, j++) to[j] = from$7[i];
		return to;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.intervalProvider = void 0;
	exports.intervalProvider = {
		setInterval: function(handler, timeout$4) {
			var args = [];
			for (var _i = 2; _i < arguments.length; _i++) args[_i - 2] = arguments[_i];
			var delegate = exports.intervalProvider.delegate;
			if (delegate === null || delegate === void 0 ? void 0 : delegate.setInterval) return delegate.setInterval.apply(delegate, __spreadArray$18([handler, timeout$4], __read$19(args)));
			return setInterval.apply(void 0, __spreadArray$18([handler, timeout$4], __read$19(args)));
		},
		clearInterval: function(handle) {
			var delegate = exports.intervalProvider.delegate;
			return ((delegate === null || delegate === void 0 ? void 0 : delegate.clearInterval) || clearInterval)(handle);
		},
		delegate: void 0
	};
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/scheduler/AsyncAction.js
var require_AsyncAction = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __extends$8 = exports && exports.__extends || (function() {
		var extendStatics = function(d, b) {
			extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d$1, b$1) {
				d$1.__proto__ = b$1;
			} || function(d$1, b$1) {
				for (var p in b$1) if (Object.prototype.hasOwnProperty.call(b$1, p)) d$1[p] = b$1[p];
			};
			return extendStatics(d, b);
		};
		return function(d, b) {
			if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
			extendStatics(d, b);
			function __() {
				this.constructor = d;
			}
			d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
		};
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.AsyncAction = void 0;
	var Action_1 = require_Action();
	var intervalProvider_1 = require_intervalProvider();
	var arrRemove_1$5 = require_arrRemove();
	var AsyncAction = function(_super) {
		__extends$8(AsyncAction$1, _super);
		function AsyncAction$1(scheduler, work) {
			var _this = _super.call(this, scheduler, work) || this;
			_this.scheduler = scheduler;
			_this.work = work;
			_this.pending = false;
			return _this;
		}
		AsyncAction$1.prototype.schedule = function(state, delay$1) {
			var _a;
			if (delay$1 === void 0) delay$1 = 0;
			if (this.closed) return this;
			this.state = state;
			var id = this.id;
			var scheduler = this.scheduler;
			if (id != null) this.id = this.recycleAsyncId(scheduler, id, delay$1);
			this.pending = true;
			this.delay = delay$1;
			this.id = (_a = this.id) !== null && _a !== void 0 ? _a : this.requestAsyncId(scheduler, this.id, delay$1);
			return this;
		};
		AsyncAction$1.prototype.requestAsyncId = function(scheduler, _id, delay$1) {
			if (delay$1 === void 0) delay$1 = 0;
			return intervalProvider_1.intervalProvider.setInterval(scheduler.flush.bind(scheduler, this), delay$1);
		};
		AsyncAction$1.prototype.recycleAsyncId = function(_scheduler, id, delay$1) {
			if (delay$1 === void 0) delay$1 = 0;
			if (delay$1 != null && this.delay === delay$1 && this.pending === false) return id;
			if (id != null) intervalProvider_1.intervalProvider.clearInterval(id);
		};
		AsyncAction$1.prototype.execute = function(state, delay$1) {
			if (this.closed) return /* @__PURE__ */ new Error("executing a cancelled action");
			this.pending = false;
			var error = this._execute(state, delay$1);
			if (error) return error;
			else if (this.pending === false && this.id != null) this.id = this.recycleAsyncId(this.scheduler, this.id, null);
		};
		AsyncAction$1.prototype._execute = function(state, _delay) {
			var errored = false;
			var errorValue;
			try {
				this.work(state);
			} catch (e) {
				errored = true;
				errorValue = e ? e : /* @__PURE__ */ new Error("Scheduled action threw falsy error");
			}
			if (errored) {
				this.unsubscribe();
				return errorValue;
			}
		};
		AsyncAction$1.prototype.unsubscribe = function() {
			if (!this.closed) {
				var _a = this, id = _a.id, scheduler = _a.scheduler;
				var actions = scheduler.actions;
				this.work = this.state = this.scheduler = null;
				this.pending = false;
				arrRemove_1$5.arrRemove(actions, this);
				if (id != null) this.id = this.recycleAsyncId(scheduler, id, null);
				this.delay = null;
				_super.prototype.unsubscribe.call(this);
			}
		};
		return AsyncAction$1;
	}(Action_1.Action);
	exports.AsyncAction = AsyncAction;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/util/Immediate.js
var require_Immediate = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.TestTools = exports.Immediate = void 0;
	var nextHandle = 1;
	var resolved;
	var activeHandles = {};
	function findAndClearHandle(handle) {
		if (handle in activeHandles) {
			delete activeHandles[handle];
			return true;
		}
		return false;
	}
	exports.Immediate = {
		setImmediate: function(cb) {
			var handle = nextHandle++;
			activeHandles[handle] = true;
			if (!resolved) resolved = Promise.resolve();
			resolved.then(function() {
				return findAndClearHandle(handle) && cb();
			});
			return handle;
		},
		clearImmediate: function(handle) {
			findAndClearHandle(handle);
		}
	};
	exports.TestTools = { pending: function() {
		return Object.keys(activeHandles).length;
	} };
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/scheduler/immediateProvider.js
var require_immediateProvider = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __read$18 = exports && exports.__read || function(o, n) {
		var m = typeof Symbol === "function" && o[Symbol.iterator];
		if (!m) return o;
		var i = m.call(o), r, ar = [], e;
		try {
			while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
		} catch (error) {
			e = { error };
		} finally {
			try {
				if (r && !r.done && (m = i["return"])) m.call(i);
			} finally {
				if (e) throw e.error;
			}
		}
		return ar;
	};
	var __spreadArray$17 = exports && exports.__spreadArray || function(to, from$7) {
		for (var i = 0, il = from$7.length, j = to.length; i < il; i++, j++) to[j] = from$7[i];
		return to;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.immediateProvider = void 0;
	var Immediate_1 = require_Immediate();
	var setImmediate = Immediate_1.Immediate.setImmediate, clearImmediate = Immediate_1.Immediate.clearImmediate;
	exports.immediateProvider = {
		setImmediate: function() {
			var args = [];
			for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
			var delegate = exports.immediateProvider.delegate;
			return ((delegate === null || delegate === void 0 ? void 0 : delegate.setImmediate) || setImmediate).apply(void 0, __spreadArray$17([], __read$18(args)));
		},
		clearImmediate: function(handle) {
			var delegate = exports.immediateProvider.delegate;
			return ((delegate === null || delegate === void 0 ? void 0 : delegate.clearImmediate) || clearImmediate)(handle);
		},
		delegate: void 0
	};
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/scheduler/AsapAction.js
var require_AsapAction = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __extends$7 = exports && exports.__extends || (function() {
		var extendStatics = function(d, b) {
			extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d$1, b$1) {
				d$1.__proto__ = b$1;
			} || function(d$1, b$1) {
				for (var p in b$1) if (Object.prototype.hasOwnProperty.call(b$1, p)) d$1[p] = b$1[p];
			};
			return extendStatics(d, b);
		};
		return function(d, b) {
			if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
			extendStatics(d, b);
			function __() {
				this.constructor = d;
			}
			d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
		};
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.AsapAction = void 0;
	var AsyncAction_1$3 = require_AsyncAction();
	var immediateProvider_1 = require_immediateProvider();
	var AsapAction = function(_super) {
		__extends$7(AsapAction$1, _super);
		function AsapAction$1(scheduler, work) {
			var _this = _super.call(this, scheduler, work) || this;
			_this.scheduler = scheduler;
			_this.work = work;
			return _this;
		}
		AsapAction$1.prototype.requestAsyncId = function(scheduler, id, delay$1) {
			if (delay$1 === void 0) delay$1 = 0;
			if (delay$1 !== null && delay$1 > 0) return _super.prototype.requestAsyncId.call(this, scheduler, id, delay$1);
			scheduler.actions.push(this);
			return scheduler._scheduled || (scheduler._scheduled = immediateProvider_1.immediateProvider.setImmediate(scheduler.flush.bind(scheduler, void 0)));
		};
		AsapAction$1.prototype.recycleAsyncId = function(scheduler, id, delay$1) {
			var _a;
			if (delay$1 === void 0) delay$1 = 0;
			if (delay$1 != null ? delay$1 > 0 : this.delay > 0) return _super.prototype.recycleAsyncId.call(this, scheduler, id, delay$1);
			var actions = scheduler.actions;
			if (id != null && ((_a = actions[actions.length - 1]) === null || _a === void 0 ? void 0 : _a.id) !== id) {
				immediateProvider_1.immediateProvider.clearImmediate(id);
				if (scheduler._scheduled === id) scheduler._scheduled = void 0;
			}
		};
		return AsapAction$1;
	}(AsyncAction_1$3.AsyncAction);
	exports.AsapAction = AsapAction;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/Scheduler.js
var require_Scheduler = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Scheduler = void 0;
	var dateTimestampProvider_1$1 = require_dateTimestampProvider();
	var Scheduler = function() {
		function Scheduler$1(schedulerActionCtor, now) {
			if (now === void 0) now = Scheduler$1.now;
			this.schedulerActionCtor = schedulerActionCtor;
			this.now = now;
		}
		Scheduler$1.prototype.schedule = function(work, delay$1, state) {
			if (delay$1 === void 0) delay$1 = 0;
			return new this.schedulerActionCtor(this, work).schedule(state, delay$1);
		};
		Scheduler$1.now = dateTimestampProvider_1$1.dateTimestampProvider.now;
		return Scheduler$1;
	}();
	exports.Scheduler = Scheduler;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/scheduler/AsyncScheduler.js
var require_AsyncScheduler = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __extends$6 = exports && exports.__extends || (function() {
		var extendStatics = function(d, b) {
			extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d$1, b$1) {
				d$1.__proto__ = b$1;
			} || function(d$1, b$1) {
				for (var p in b$1) if (Object.prototype.hasOwnProperty.call(b$1, p)) d$1[p] = b$1[p];
			};
			return extendStatics(d, b);
		};
		return function(d, b) {
			if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
			extendStatics(d, b);
			function __() {
				this.constructor = d;
			}
			d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
		};
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.AsyncScheduler = void 0;
	var Scheduler_1$1 = require_Scheduler();
	var AsyncScheduler = function(_super) {
		__extends$6(AsyncScheduler$1, _super);
		function AsyncScheduler$1(SchedulerAction, now) {
			if (now === void 0) now = Scheduler_1$1.Scheduler.now;
			var _this = _super.call(this, SchedulerAction, now) || this;
			_this.actions = [];
			_this._active = false;
			return _this;
		}
		AsyncScheduler$1.prototype.flush = function(action) {
			var actions = this.actions;
			if (this._active) {
				actions.push(action);
				return;
			}
			var error;
			this._active = true;
			do
				if (error = action.execute(action.state, action.delay)) break;
			while (action = actions.shift());
			this._active = false;
			if (error) {
				while (action = actions.shift()) action.unsubscribe();
				throw error;
			}
		};
		return AsyncScheduler$1;
	}(Scheduler_1$1.Scheduler);
	exports.AsyncScheduler = AsyncScheduler;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/scheduler/AsapScheduler.js
var require_AsapScheduler = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __extends$5 = exports && exports.__extends || (function() {
		var extendStatics = function(d, b) {
			extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d$1, b$1) {
				d$1.__proto__ = b$1;
			} || function(d$1, b$1) {
				for (var p in b$1) if (Object.prototype.hasOwnProperty.call(b$1, p)) d$1[p] = b$1[p];
			};
			return extendStatics(d, b);
		};
		return function(d, b) {
			if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
			extendStatics(d, b);
			function __() {
				this.constructor = d;
			}
			d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
		};
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.AsapScheduler = void 0;
	var AsapScheduler = function(_super) {
		__extends$5(AsapScheduler$1, _super);
		function AsapScheduler$1() {
			return _super !== null && _super.apply(this, arguments) || this;
		}
		AsapScheduler$1.prototype.flush = function(action) {
			this._active = true;
			var flushId = this._scheduled;
			this._scheduled = void 0;
			var actions = this.actions;
			var error;
			action = action || actions.shift();
			do
				if (error = action.execute(action.state, action.delay)) break;
			while ((action = actions[0]) && action.id === flushId && actions.shift());
			this._active = false;
			if (error) {
				while ((action = actions[0]) && action.id === flushId && actions.shift()) action.unsubscribe();
				throw error;
			}
		};
		return AsapScheduler$1;
	}(require_AsyncScheduler().AsyncScheduler);
	exports.AsapScheduler = AsapScheduler;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/scheduler/asap.js
var require_asap = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.asap = exports.asapScheduler = void 0;
	var AsapAction_1 = require_AsapAction();
	var AsapScheduler_1 = require_AsapScheduler();
	exports.asapScheduler = new AsapScheduler_1.AsapScheduler(AsapAction_1.AsapAction);
	exports.asap = exports.asapScheduler;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/scheduler/async.js
var require_async = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.async = exports.asyncScheduler = void 0;
	var AsyncAction_1$2 = require_AsyncAction();
	var AsyncScheduler_1 = require_AsyncScheduler();
	exports.asyncScheduler = new AsyncScheduler_1.AsyncScheduler(AsyncAction_1$2.AsyncAction);
	exports.async = exports.asyncScheduler;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/scheduler/QueueAction.js
var require_QueueAction = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __extends$4 = exports && exports.__extends || (function() {
		var extendStatics = function(d, b) {
			extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d$1, b$1) {
				d$1.__proto__ = b$1;
			} || function(d$1, b$1) {
				for (var p in b$1) if (Object.prototype.hasOwnProperty.call(b$1, p)) d$1[p] = b$1[p];
			};
			return extendStatics(d, b);
		};
		return function(d, b) {
			if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
			extendStatics(d, b);
			function __() {
				this.constructor = d;
			}
			d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
		};
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.QueueAction = void 0;
	var QueueAction = function(_super) {
		__extends$4(QueueAction$1, _super);
		function QueueAction$1(scheduler, work) {
			var _this = _super.call(this, scheduler, work) || this;
			_this.scheduler = scheduler;
			_this.work = work;
			return _this;
		}
		QueueAction$1.prototype.schedule = function(state, delay$1) {
			if (delay$1 === void 0) delay$1 = 0;
			if (delay$1 > 0) return _super.prototype.schedule.call(this, state, delay$1);
			this.delay = delay$1;
			this.state = state;
			this.scheduler.flush(this);
			return this;
		};
		QueueAction$1.prototype.execute = function(state, delay$1) {
			return delay$1 > 0 || this.closed ? _super.prototype.execute.call(this, state, delay$1) : this._execute(state, delay$1);
		};
		QueueAction$1.prototype.requestAsyncId = function(scheduler, id, delay$1) {
			if (delay$1 === void 0) delay$1 = 0;
			if (delay$1 != null && delay$1 > 0 || delay$1 == null && this.delay > 0) return _super.prototype.requestAsyncId.call(this, scheduler, id, delay$1);
			scheduler.flush(this);
			return 0;
		};
		return QueueAction$1;
	}(require_AsyncAction().AsyncAction);
	exports.QueueAction = QueueAction;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/scheduler/QueueScheduler.js
var require_QueueScheduler = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __extends$3 = exports && exports.__extends || (function() {
		var extendStatics = function(d, b) {
			extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d$1, b$1) {
				d$1.__proto__ = b$1;
			} || function(d$1, b$1) {
				for (var p in b$1) if (Object.prototype.hasOwnProperty.call(b$1, p)) d$1[p] = b$1[p];
			};
			return extendStatics(d, b);
		};
		return function(d, b) {
			if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
			extendStatics(d, b);
			function __() {
				this.constructor = d;
			}
			d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
		};
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.QueueScheduler = void 0;
	var QueueScheduler = function(_super) {
		__extends$3(QueueScheduler$1, _super);
		function QueueScheduler$1() {
			return _super !== null && _super.apply(this, arguments) || this;
		}
		return QueueScheduler$1;
	}(require_AsyncScheduler().AsyncScheduler);
	exports.QueueScheduler = QueueScheduler;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/scheduler/queue.js
var require_queue = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.queue = exports.queueScheduler = void 0;
	var QueueAction_1 = require_QueueAction();
	var QueueScheduler_1 = require_QueueScheduler();
	exports.queueScheduler = new QueueScheduler_1.QueueScheduler(QueueAction_1.QueueAction);
	exports.queue = exports.queueScheduler;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/scheduler/AnimationFrameAction.js
var require_AnimationFrameAction = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __extends$2 = exports && exports.__extends || (function() {
		var extendStatics = function(d, b) {
			extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d$1, b$1) {
				d$1.__proto__ = b$1;
			} || function(d$1, b$1) {
				for (var p in b$1) if (Object.prototype.hasOwnProperty.call(b$1, p)) d$1[p] = b$1[p];
			};
			return extendStatics(d, b);
		};
		return function(d, b) {
			if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
			extendStatics(d, b);
			function __() {
				this.constructor = d;
			}
			d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
		};
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.AnimationFrameAction = void 0;
	var AsyncAction_1$1 = require_AsyncAction();
	var animationFrameProvider_1 = require_animationFrameProvider();
	var AnimationFrameAction = function(_super) {
		__extends$2(AnimationFrameAction$1, _super);
		function AnimationFrameAction$1(scheduler, work) {
			var _this = _super.call(this, scheduler, work) || this;
			_this.scheduler = scheduler;
			_this.work = work;
			return _this;
		}
		AnimationFrameAction$1.prototype.requestAsyncId = function(scheduler, id, delay$1) {
			if (delay$1 === void 0) delay$1 = 0;
			if (delay$1 !== null && delay$1 > 0) return _super.prototype.requestAsyncId.call(this, scheduler, id, delay$1);
			scheduler.actions.push(this);
			return scheduler._scheduled || (scheduler._scheduled = animationFrameProvider_1.animationFrameProvider.requestAnimationFrame(function() {
				return scheduler.flush(void 0);
			}));
		};
		AnimationFrameAction$1.prototype.recycleAsyncId = function(scheduler, id, delay$1) {
			var _a;
			if (delay$1 === void 0) delay$1 = 0;
			if (delay$1 != null ? delay$1 > 0 : this.delay > 0) return _super.prototype.recycleAsyncId.call(this, scheduler, id, delay$1);
			var actions = scheduler.actions;
			if (id != null && id === scheduler._scheduled && ((_a = actions[actions.length - 1]) === null || _a === void 0 ? void 0 : _a.id) !== id) {
				animationFrameProvider_1.animationFrameProvider.cancelAnimationFrame(id);
				scheduler._scheduled = void 0;
			}
		};
		return AnimationFrameAction$1;
	}(AsyncAction_1$1.AsyncAction);
	exports.AnimationFrameAction = AnimationFrameAction;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/scheduler/AnimationFrameScheduler.js
var require_AnimationFrameScheduler = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __extends$1 = exports && exports.__extends || (function() {
		var extendStatics = function(d, b) {
			extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d$1, b$1) {
				d$1.__proto__ = b$1;
			} || function(d$1, b$1) {
				for (var p in b$1) if (Object.prototype.hasOwnProperty.call(b$1, p)) d$1[p] = b$1[p];
			};
			return extendStatics(d, b);
		};
		return function(d, b) {
			if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
			extendStatics(d, b);
			function __() {
				this.constructor = d;
			}
			d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
		};
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.AnimationFrameScheduler = void 0;
	var AnimationFrameScheduler = function(_super) {
		__extends$1(AnimationFrameScheduler$1, _super);
		function AnimationFrameScheduler$1() {
			return _super !== null && _super.apply(this, arguments) || this;
		}
		AnimationFrameScheduler$1.prototype.flush = function(action) {
			this._active = true;
			var flushId;
			if (action) flushId = action.id;
			else {
				flushId = this._scheduled;
				this._scheduled = void 0;
			}
			var actions = this.actions;
			var error;
			action = action || actions.shift();
			do
				if (error = action.execute(action.state, action.delay)) break;
			while ((action = actions[0]) && action.id === flushId && actions.shift());
			this._active = false;
			if (error) {
				while ((action = actions[0]) && action.id === flushId && actions.shift()) action.unsubscribe();
				throw error;
			}
		};
		return AnimationFrameScheduler$1;
	}(require_AsyncScheduler().AsyncScheduler);
	exports.AnimationFrameScheduler = AnimationFrameScheduler;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/scheduler/animationFrame.js
var require_animationFrame = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.animationFrame = exports.animationFrameScheduler = void 0;
	var AnimationFrameAction_1 = require_AnimationFrameAction();
	var AnimationFrameScheduler_1 = require_AnimationFrameScheduler();
	exports.animationFrameScheduler = new AnimationFrameScheduler_1.AnimationFrameScheduler(AnimationFrameAction_1.AnimationFrameAction);
	exports.animationFrame = exports.animationFrameScheduler;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/scheduler/VirtualTimeScheduler.js
var require_VirtualTimeScheduler = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __extends = exports && exports.__extends || (function() {
		var extendStatics = function(d, b) {
			extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d$1, b$1) {
				d$1.__proto__ = b$1;
			} || function(d$1, b$1) {
				for (var p in b$1) if (Object.prototype.hasOwnProperty.call(b$1, p)) d$1[p] = b$1[p];
			};
			return extendStatics(d, b);
		};
		return function(d, b) {
			if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
			extendStatics(d, b);
			function __() {
				this.constructor = d;
			}
			d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
		};
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.VirtualAction = exports.VirtualTimeScheduler = void 0;
	var AsyncAction_1 = require_AsyncAction();
	var Subscription_1$5 = require_Subscription();
	var VirtualTimeScheduler = function(_super) {
		__extends(VirtualTimeScheduler$1, _super);
		function VirtualTimeScheduler$1(schedulerActionCtor, maxFrames) {
			if (schedulerActionCtor === void 0) schedulerActionCtor = VirtualAction;
			if (maxFrames === void 0) maxFrames = Infinity;
			var _this = _super.call(this, schedulerActionCtor, function() {
				return _this.frame;
			}) || this;
			_this.maxFrames = maxFrames;
			_this.frame = 0;
			_this.index = -1;
			return _this;
		}
		VirtualTimeScheduler$1.prototype.flush = function() {
			var _a = this, actions = _a.actions, maxFrames = _a.maxFrames;
			var error;
			var action;
			while ((action = actions[0]) && action.delay <= maxFrames) {
				actions.shift();
				this.frame = action.delay;
				if (error = action.execute(action.state, action.delay)) break;
			}
			if (error) {
				while (action = actions.shift()) action.unsubscribe();
				throw error;
			}
		};
		VirtualTimeScheduler$1.frameTimeFactor = 10;
		return VirtualTimeScheduler$1;
	}(require_AsyncScheduler().AsyncScheduler);
	exports.VirtualTimeScheduler = VirtualTimeScheduler;
	var VirtualAction = function(_super) {
		__extends(VirtualAction$1, _super);
		function VirtualAction$1(scheduler, work, index) {
			if (index === void 0) index = scheduler.index += 1;
			var _this = _super.call(this, scheduler, work) || this;
			_this.scheduler = scheduler;
			_this.work = work;
			_this.index = index;
			_this.active = true;
			_this.index = scheduler.index = index;
			return _this;
		}
		VirtualAction$1.prototype.schedule = function(state, delay$1) {
			if (delay$1 === void 0) delay$1 = 0;
			if (Number.isFinite(delay$1)) {
				if (!this.id) return _super.prototype.schedule.call(this, state, delay$1);
				this.active = false;
				var action = new VirtualAction$1(this.scheduler, this.work);
				this.add(action);
				return action.schedule(state, delay$1);
			} else return Subscription_1$5.Subscription.EMPTY;
		};
		VirtualAction$1.prototype.requestAsyncId = function(scheduler, id, delay$1) {
			if (delay$1 === void 0) delay$1 = 0;
			this.delay = scheduler.frame + delay$1;
			var actions = scheduler.actions;
			actions.push(this);
			actions.sort(VirtualAction$1.sortActions);
			return 1;
		};
		VirtualAction$1.prototype.recycleAsyncId = function(scheduler, id, delay$1) {
			if (delay$1 === void 0) delay$1 = 0;
		};
		VirtualAction$1.prototype._execute = function(state, delay$1) {
			if (this.active === true) return _super.prototype._execute.call(this, state, delay$1);
		};
		VirtualAction$1.sortActions = function(a, b) {
			if (a.delay === b.delay) if (a.index === b.index) return 0;
			else if (a.index > b.index) return 1;
			else return -1;
			else if (a.delay > b.delay) return 1;
			else return -1;
		};
		return VirtualAction$1;
	}(AsyncAction_1.AsyncAction);
	exports.VirtualAction = VirtualAction;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/observable/empty.js
var require_empty = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.empty = exports.EMPTY = void 0;
	var Observable_1$23 = require_Observable();
	exports.EMPTY = new Observable_1$23.Observable(function(subscriber) {
		return subscriber.complete();
	});
	function empty(scheduler) {
		return scheduler ? emptyScheduled(scheduler) : exports.EMPTY;
	}
	exports.empty = empty;
	function emptyScheduled(scheduler) {
		return new Observable_1$23.Observable(function(subscriber) {
			return scheduler.schedule(function() {
				return subscriber.complete();
			});
		});
	}
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/util/isScheduler.js
var require_isScheduler = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isScheduler = void 0;
	var isFunction_1$23 = require_isFunction();
	function isScheduler(value) {
		return value && isFunction_1$23.isFunction(value.schedule);
	}
	exports.isScheduler = isScheduler;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/util/args.js
var require_args = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.popNumber = exports.popScheduler = exports.popResultSelector = void 0;
	var isFunction_1$22 = require_isFunction();
	var isScheduler_1$3 = require_isScheduler();
	function last$1(arr) {
		return arr[arr.length - 1];
	}
	function popResultSelector(args) {
		return isFunction_1$22.isFunction(last$1(args)) ? args.pop() : void 0;
	}
	exports.popResultSelector = popResultSelector;
	function popScheduler(args) {
		return isScheduler_1$3.isScheduler(last$1(args)) ? args.pop() : void 0;
	}
	exports.popScheduler = popScheduler;
	function popNumber(args, defaultValue) {
		return typeof last$1(args) === "number" ? args.pop() : defaultValue;
	}
	exports.popNumber = popNumber;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/util/isArrayLike.js
var require_isArrayLike = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isArrayLike = void 0;
	exports.isArrayLike = (function(x) {
		return x && typeof x.length === "number" && typeof x !== "function";
	});
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/util/isPromise.js
var require_isPromise = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isPromise = void 0;
	var isFunction_1$21 = require_isFunction();
	function isPromise(value) {
		return isFunction_1$21.isFunction(value === null || value === void 0 ? void 0 : value.then);
	}
	exports.isPromise = isPromise;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/util/isInteropObservable.js
var require_isInteropObservable = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isInteropObservable = void 0;
	var observable_1$2 = require_observable();
	var isFunction_1$20 = require_isFunction();
	function isInteropObservable(input) {
		return isFunction_1$20.isFunction(input[observable_1$2.observable]);
	}
	exports.isInteropObservable = isInteropObservable;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/util/isAsyncIterable.js
var require_isAsyncIterable = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isAsyncIterable = void 0;
	var isFunction_1$19 = require_isFunction();
	function isAsyncIterable(obj) {
		return Symbol.asyncIterator && isFunction_1$19.isFunction(obj === null || obj === void 0 ? void 0 : obj[Symbol.asyncIterator]);
	}
	exports.isAsyncIterable = isAsyncIterable;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/util/throwUnobservableError.js
var require_throwUnobservableError = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.createInvalidObservableTypeError = void 0;
	function createInvalidObservableTypeError(input) {
		return /* @__PURE__ */ new TypeError("You provided " + (input !== null && typeof input === "object" ? "an invalid object" : "'" + input + "'") + " where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.");
	}
	exports.createInvalidObservableTypeError = createInvalidObservableTypeError;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/symbol/iterator.js
var require_iterator = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.iterator = exports.getSymbolIterator = void 0;
	function getSymbolIterator() {
		if (typeof Symbol !== "function" || !Symbol.iterator) return "@@iterator";
		return Symbol.iterator;
	}
	exports.getSymbolIterator = getSymbolIterator;
	exports.iterator = getSymbolIterator();
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/util/isIterable.js
var require_isIterable = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isIterable = void 0;
	var iterator_1$1 = require_iterator();
	var isFunction_1$18 = require_isFunction();
	function isIterable(input) {
		return isFunction_1$18.isFunction(input === null || input === void 0 ? void 0 : input[iterator_1$1.iterator]);
	}
	exports.isIterable = isIterable;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/util/isReadableStreamLike.js
var require_isReadableStreamLike = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __generator$2 = exports && exports.__generator || function(thisArg, body) {
		var _ = {
			label: 0,
			sent: function() {
				if (t[0] & 1) throw t[1];
				return t[1];
			},
			trys: [],
			ops: []
		}, f, y, t, g;
		return g = {
			next: verb(0),
			"throw": verb(1),
			"return": verb(2)
		}, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
			return this;
		}), g;
		function verb(n) {
			return function(v) {
				return step([n, v]);
			};
		}
		function step(op) {
			if (f) throw new TypeError("Generator is already executing.");
			while (_) try {
				if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
				if (y = 0, t) op = [op[0] & 2, t.value];
				switch (op[0]) {
					case 0:
					case 1:
						t = op;
						break;
					case 4:
						_.label++;
						return {
							value: op[1],
							done: false
						};
					case 5:
						_.label++;
						y = op[1];
						op = [0];
						continue;
					case 7:
						op = _.ops.pop();
						_.trys.pop();
						continue;
					default:
						if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
							_ = 0;
							continue;
						}
						if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
							_.label = op[1];
							break;
						}
						if (op[0] === 6 && _.label < t[1]) {
							_.label = t[1];
							t = op;
							break;
						}
						if (t && _.label < t[2]) {
							_.label = t[2];
							_.ops.push(op);
							break;
						}
						if (t[2]) _.ops.pop();
						_.trys.pop();
						continue;
				}
				op = body.call(thisArg, _);
			} catch (e) {
				op = [6, e];
				y = 0;
			} finally {
				f = t = 0;
			}
			if (op[0] & 5) throw op[1];
			return {
				value: op[0] ? op[1] : void 0,
				done: true
			};
		}
	};
	var __await = exports && exports.__await || function(v) {
		return this instanceof __await ? (this.v = v, this) : new __await(v);
	};
	var __asyncGenerator = exports && exports.__asyncGenerator || function(thisArg, _arguments, generator) {
		if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
		var g = generator.apply(thisArg, _arguments || []), i, q = [];
		return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
			return this;
		}, i;
		function verb(n) {
			if (g[n]) i[n] = function(v) {
				return new Promise(function(a, b) {
					q.push([
						n,
						v,
						a,
						b
					]) > 1 || resume(n, v);
				});
			};
		}
		function resume(n, v) {
			try {
				step(g[n](v));
			} catch (e) {
				settle(q[0][3], e);
			}
		}
		function step(r) {
			r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
		}
		function fulfill(value) {
			resume("next", value);
		}
		function reject(value) {
			resume("throw", value);
		}
		function settle(f, v) {
			if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
		}
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isReadableStreamLike = exports.readableStreamLikeToAsyncGenerator = void 0;
	var isFunction_1$17 = require_isFunction();
	function readableStreamLikeToAsyncGenerator(readableStream) {
		return __asyncGenerator(this, arguments, function readableStreamLikeToAsyncGenerator_1() {
			var reader, _a, value, done;
			return __generator$2(this, function(_b) {
				switch (_b.label) {
					case 0:
						reader = readableStream.getReader();
						_b.label = 1;
					case 1:
						_b.trys.push([
							1,
							,
							9,
							10
						]);
						_b.label = 2;
					case 2: return [4, __await(reader.read())];
					case 3:
						_a = _b.sent(), value = _a.value, done = _a.done;
						if (!done) return [3, 5];
						return [4, __await(void 0)];
					case 4: return [2, _b.sent()];
					case 5: return [4, __await(value)];
					case 6: return [4, _b.sent()];
					case 7:
						_b.sent();
						return [3, 2];
					case 8: return [3, 10];
					case 9:
						reader.releaseLock();
						return [7];
					case 10: return [2];
				}
			});
		});
	}
	exports.readableStreamLikeToAsyncGenerator = readableStreamLikeToAsyncGenerator;
	function isReadableStreamLike(obj) {
		return isFunction_1$17.isFunction(obj === null || obj === void 0 ? void 0 : obj.getReader);
	}
	exports.isReadableStreamLike = isReadableStreamLike;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/observable/innerFrom.js
var require_innerFrom = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P ? value : new P(function(resolve) {
				resolve(value);
			});
		}
		return new (P || (P = Promise))(function(resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
	var __generator$1 = exports && exports.__generator || function(thisArg, body) {
		var _ = {
			label: 0,
			sent: function() {
				if (t[0] & 1) throw t[1];
				return t[1];
			},
			trys: [],
			ops: []
		}, f, y, t, g;
		return g = {
			next: verb(0),
			"throw": verb(1),
			"return": verb(2)
		}, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
			return this;
		}), g;
		function verb(n) {
			return function(v) {
				return step([n, v]);
			};
		}
		function step(op) {
			if (f) throw new TypeError("Generator is already executing.");
			while (_) try {
				if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
				if (y = 0, t) op = [op[0] & 2, t.value];
				switch (op[0]) {
					case 0:
					case 1:
						t = op;
						break;
					case 4:
						_.label++;
						return {
							value: op[1],
							done: false
						};
					case 5:
						_.label++;
						y = op[1];
						op = [0];
						continue;
					case 7:
						op = _.ops.pop();
						_.trys.pop();
						continue;
					default:
						if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
							_ = 0;
							continue;
						}
						if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
							_.label = op[1];
							break;
						}
						if (op[0] === 6 && _.label < t[1]) {
							_.label = t[1];
							t = op;
							break;
						}
						if (t && _.label < t[2]) {
							_.label = t[2];
							_.ops.push(op);
							break;
						}
						if (t[2]) _.ops.pop();
						_.trys.pop();
						continue;
				}
				op = body.call(thisArg, _);
			} catch (e) {
				op = [6, e];
				y = 0;
			} finally {
				f = t = 0;
			}
			if (op[0] & 5) throw op[1];
			return {
				value: op[0] ? op[1] : void 0,
				done: true
			};
		}
	};
	var __asyncValues = exports && exports.__asyncValues || function(o) {
		if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
		var m = o[Symbol.asyncIterator], i;
		return m ? m.call(o) : (o = typeof __values$6 === "function" ? __values$6(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
			return this;
		}, i);
		function verb(n) {
			i[n] = o[n] && function(v) {
				return new Promise(function(resolve, reject) {
					v = o[n](v), settle(resolve, reject, v.done, v.value);
				});
			};
		}
		function settle(resolve, reject, d, v) {
			Promise.resolve(v).then(function(v$1) {
				resolve({
					value: v$1,
					done: d
				});
			}, reject);
		}
	};
	var __values$6 = exports && exports.__values || function(o) {
		var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
		if (m) return m.call(o);
		if (o && typeof o.length === "number") return { next: function() {
			if (o && i >= o.length) o = void 0;
			return {
				value: o && o[i++],
				done: !o
			};
		} };
		throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.fromReadableStreamLike = exports.fromAsyncIterable = exports.fromIterable = exports.fromPromise = exports.fromArrayLike = exports.fromInteropObservable = exports.innerFrom = void 0;
	var isArrayLike_1$2 = require_isArrayLike();
	var isPromise_1$1 = require_isPromise();
	var Observable_1$22 = require_Observable();
	var isInteropObservable_1$1 = require_isInteropObservable();
	var isAsyncIterable_1$1 = require_isAsyncIterable();
	var throwUnobservableError_1$1 = require_throwUnobservableError();
	var isIterable_1$1 = require_isIterable();
	var isReadableStreamLike_1$2 = require_isReadableStreamLike();
	var isFunction_1$16 = require_isFunction();
	var reportUnhandledError_1 = require_reportUnhandledError();
	var observable_1$1 = require_observable();
	function innerFrom(input) {
		if (input instanceof Observable_1$22.Observable) return input;
		if (input != null) {
			if (isInteropObservable_1$1.isInteropObservable(input)) return fromInteropObservable(input);
			if (isArrayLike_1$2.isArrayLike(input)) return fromArrayLike(input);
			if (isPromise_1$1.isPromise(input)) return fromPromise(input);
			if (isAsyncIterable_1$1.isAsyncIterable(input)) return fromAsyncIterable(input);
			if (isIterable_1$1.isIterable(input)) return fromIterable(input);
			if (isReadableStreamLike_1$2.isReadableStreamLike(input)) return fromReadableStreamLike(input);
		}
		throw throwUnobservableError_1$1.createInvalidObservableTypeError(input);
	}
	exports.innerFrom = innerFrom;
	function fromInteropObservable(obj) {
		return new Observable_1$22.Observable(function(subscriber) {
			var obs = obj[observable_1$1.observable]();
			if (isFunction_1$16.isFunction(obs.subscribe)) return obs.subscribe(subscriber);
			throw new TypeError("Provided object does not correctly implement Symbol.observable");
		});
	}
	exports.fromInteropObservable = fromInteropObservable;
	function fromArrayLike(array) {
		return new Observable_1$22.Observable(function(subscriber) {
			for (var i = 0; i < array.length && !subscriber.closed; i++) subscriber.next(array[i]);
			subscriber.complete();
		});
	}
	exports.fromArrayLike = fromArrayLike;
	function fromPromise(promise) {
		return new Observable_1$22.Observable(function(subscriber) {
			promise.then(function(value) {
				if (!subscriber.closed) {
					subscriber.next(value);
					subscriber.complete();
				}
			}, function(err) {
				return subscriber.error(err);
			}).then(null, reportUnhandledError_1.reportUnhandledError);
		});
	}
	exports.fromPromise = fromPromise;
	function fromIterable(iterable) {
		return new Observable_1$22.Observable(function(subscriber) {
			var e_1, _a;
			try {
				for (var iterable_1 = __values$6(iterable), iterable_1_1 = iterable_1.next(); !iterable_1_1.done; iterable_1_1 = iterable_1.next()) {
					var value = iterable_1_1.value;
					subscriber.next(value);
					if (subscriber.closed) return;
				}
			} catch (e_1_1) {
				e_1 = { error: e_1_1 };
			} finally {
				try {
					if (iterable_1_1 && !iterable_1_1.done && (_a = iterable_1.return)) _a.call(iterable_1);
				} finally {
					if (e_1) throw e_1.error;
				}
			}
			subscriber.complete();
		});
	}
	exports.fromIterable = fromIterable;
	function fromAsyncIterable(asyncIterable) {
		return new Observable_1$22.Observable(function(subscriber) {
			process$1(asyncIterable, subscriber).catch(function(err) {
				return subscriber.error(err);
			});
		});
	}
	exports.fromAsyncIterable = fromAsyncIterable;
	function fromReadableStreamLike(readableStream) {
		return fromAsyncIterable(isReadableStreamLike_1$2.readableStreamLikeToAsyncGenerator(readableStream));
	}
	exports.fromReadableStreamLike = fromReadableStreamLike;
	function process$1(asyncIterable, subscriber) {
		var asyncIterable_1, asyncIterable_1_1;
		var e_2, _a;
		return __awaiter(this, void 0, void 0, function() {
			var value, e_2_1;
			return __generator$1(this, function(_b) {
				switch (_b.label) {
					case 0:
						_b.trys.push([
							0,
							5,
							6,
							11
						]);
						asyncIterable_1 = __asyncValues(asyncIterable);
						_b.label = 1;
					case 1: return [4, asyncIterable_1.next()];
					case 2:
						if (!(asyncIterable_1_1 = _b.sent(), !asyncIterable_1_1.done)) return [3, 4];
						value = asyncIterable_1_1.value;
						subscriber.next(value);
						if (subscriber.closed) return [2];
						_b.label = 3;
					case 3: return [3, 1];
					case 4: return [3, 11];
					case 5:
						e_2_1 = _b.sent();
						e_2 = { error: e_2_1 };
						return [3, 11];
					case 6:
						_b.trys.push([
							6,
							,
							9,
							10
						]);
						if (!(asyncIterable_1_1 && !asyncIterable_1_1.done && (_a = asyncIterable_1.return))) return [3, 8];
						return [4, _a.call(asyncIterable_1)];
					case 7:
						_b.sent();
						_b.label = 8;
					case 8: return [3, 10];
					case 9:
						if (e_2) throw e_2.error;
						return [7];
					case 10: return [7];
					case 11:
						subscriber.complete();
						return [2];
				}
			});
		});
	}
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/util/executeSchedule.js
var require_executeSchedule = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.executeSchedule = void 0;
	function executeSchedule(parentSubscription, scheduler, work, delay$1, repeat$1) {
		if (delay$1 === void 0) delay$1 = 0;
		if (repeat$1 === void 0) repeat$1 = false;
		var scheduleSubscription = scheduler.schedule(function() {
			work();
			if (repeat$1) parentSubscription.add(this.schedule(null, delay$1));
			else this.unsubscribe();
		}, delay$1);
		parentSubscription.add(scheduleSubscription);
		if (!repeat$1) return scheduleSubscription;
	}
	exports.executeSchedule = executeSchedule;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/observeOn.js
var require_observeOn = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.observeOn = void 0;
	var executeSchedule_1$7 = require_executeSchedule();
	var lift_1$67 = require_lift();
	var OperatorSubscriber_1$56 = require_OperatorSubscriber();
	function observeOn(scheduler, delay$1) {
		if (delay$1 === void 0) delay$1 = 0;
		return lift_1$67.operate(function(source, subscriber) {
			source.subscribe(OperatorSubscriber_1$56.createOperatorSubscriber(subscriber, function(value) {
				return executeSchedule_1$7.executeSchedule(subscriber, scheduler, function() {
					return subscriber.next(value);
				}, delay$1);
			}, function() {
				return executeSchedule_1$7.executeSchedule(subscriber, scheduler, function() {
					return subscriber.complete();
				}, delay$1);
			}, function(err) {
				return executeSchedule_1$7.executeSchedule(subscriber, scheduler, function() {
					return subscriber.error(err);
				}, delay$1);
			}));
		});
	}
	exports.observeOn = observeOn;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/subscribeOn.js
var require_subscribeOn = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.subscribeOn = void 0;
	var lift_1$66 = require_lift();
	function subscribeOn(scheduler, delay$1) {
		if (delay$1 === void 0) delay$1 = 0;
		return lift_1$66.operate(function(source, subscriber) {
			subscriber.add(scheduler.schedule(function() {
				return source.subscribe(subscriber);
			}, delay$1));
		});
	}
	exports.subscribeOn = subscribeOn;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/scheduled/scheduleObservable.js
var require_scheduleObservable = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.scheduleObservable = void 0;
	var innerFrom_1$40 = require_innerFrom();
	var observeOn_1$4 = require_observeOn();
	var subscribeOn_1$4 = require_subscribeOn();
	function scheduleObservable(input, scheduler) {
		return innerFrom_1$40.innerFrom(input).pipe(subscribeOn_1$4.subscribeOn(scheduler), observeOn_1$4.observeOn(scheduler));
	}
	exports.scheduleObservable = scheduleObservable;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/scheduled/schedulePromise.js
var require_schedulePromise = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.schedulePromise = void 0;
	var innerFrom_1$39 = require_innerFrom();
	var observeOn_1$3 = require_observeOn();
	var subscribeOn_1$3 = require_subscribeOn();
	function schedulePromise(input, scheduler) {
		return innerFrom_1$39.innerFrom(input).pipe(subscribeOn_1$3.subscribeOn(scheduler), observeOn_1$3.observeOn(scheduler));
	}
	exports.schedulePromise = schedulePromise;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/scheduled/scheduleArray.js
var require_scheduleArray = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.scheduleArray = void 0;
	var Observable_1$21 = require_Observable();
	function scheduleArray(input, scheduler) {
		return new Observable_1$21.Observable(function(subscriber) {
			var i = 0;
			return scheduler.schedule(function() {
				if (i === input.length) subscriber.complete();
				else {
					subscriber.next(input[i++]);
					if (!subscriber.closed) this.schedule();
				}
			});
		});
	}
	exports.scheduleArray = scheduleArray;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/scheduled/scheduleIterable.js
var require_scheduleIterable = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.scheduleIterable = void 0;
	var Observable_1$20 = require_Observable();
	var iterator_1 = require_iterator();
	var isFunction_1$15 = require_isFunction();
	var executeSchedule_1$6 = require_executeSchedule();
	function scheduleIterable(input, scheduler) {
		return new Observable_1$20.Observable(function(subscriber) {
			var iterator;
			executeSchedule_1$6.executeSchedule(subscriber, scheduler, function() {
				iterator = input[iterator_1.iterator]();
				executeSchedule_1$6.executeSchedule(subscriber, scheduler, function() {
					var _a;
					var value;
					var done;
					try {
						_a = iterator.next(), value = _a.value, done = _a.done;
					} catch (err) {
						subscriber.error(err);
						return;
					}
					if (done) subscriber.complete();
					else subscriber.next(value);
				}, 0, true);
			});
			return function() {
				return isFunction_1$15.isFunction(iterator === null || iterator === void 0 ? void 0 : iterator.return) && iterator.return();
			};
		});
	}
	exports.scheduleIterable = scheduleIterable;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/scheduled/scheduleAsyncIterable.js
var require_scheduleAsyncIterable = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.scheduleAsyncIterable = void 0;
	var Observable_1$19 = require_Observable();
	var executeSchedule_1$5 = require_executeSchedule();
	function scheduleAsyncIterable(input, scheduler) {
		if (!input) throw new Error("Iterable cannot be null");
		return new Observable_1$19.Observable(function(subscriber) {
			executeSchedule_1$5.executeSchedule(subscriber, scheduler, function() {
				var iterator = input[Symbol.asyncIterator]();
				executeSchedule_1$5.executeSchedule(subscriber, scheduler, function() {
					iterator.next().then(function(result) {
						if (result.done) subscriber.complete();
						else subscriber.next(result.value);
					});
				}, 0, true);
			});
		});
	}
	exports.scheduleAsyncIterable = scheduleAsyncIterable;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/scheduled/scheduleReadableStreamLike.js
var require_scheduleReadableStreamLike = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.scheduleReadableStreamLike = void 0;
	var scheduleAsyncIterable_1$1 = require_scheduleAsyncIterable();
	var isReadableStreamLike_1$1 = require_isReadableStreamLike();
	function scheduleReadableStreamLike(input, scheduler) {
		return scheduleAsyncIterable_1$1.scheduleAsyncIterable(isReadableStreamLike_1$1.readableStreamLikeToAsyncGenerator(input), scheduler);
	}
	exports.scheduleReadableStreamLike = scheduleReadableStreamLike;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/scheduled/scheduled.js
var require_scheduled = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.scheduled = void 0;
	var scheduleObservable_1 = require_scheduleObservable();
	var schedulePromise_1 = require_schedulePromise();
	var scheduleArray_1 = require_scheduleArray();
	var scheduleIterable_1$1 = require_scheduleIterable();
	var scheduleAsyncIterable_1 = require_scheduleAsyncIterable();
	var isInteropObservable_1 = require_isInteropObservable();
	var isPromise_1 = require_isPromise();
	var isArrayLike_1$1 = require_isArrayLike();
	var isIterable_1 = require_isIterable();
	var isAsyncIterable_1 = require_isAsyncIterable();
	var throwUnobservableError_1 = require_throwUnobservableError();
	var isReadableStreamLike_1 = require_isReadableStreamLike();
	var scheduleReadableStreamLike_1 = require_scheduleReadableStreamLike();
	function scheduled(input, scheduler) {
		if (input != null) {
			if (isInteropObservable_1.isInteropObservable(input)) return scheduleObservable_1.scheduleObservable(input, scheduler);
			if (isArrayLike_1$1.isArrayLike(input)) return scheduleArray_1.scheduleArray(input, scheduler);
			if (isPromise_1.isPromise(input)) return schedulePromise_1.schedulePromise(input, scheduler);
			if (isAsyncIterable_1.isAsyncIterable(input)) return scheduleAsyncIterable_1.scheduleAsyncIterable(input, scheduler);
			if (isIterable_1.isIterable(input)) return scheduleIterable_1$1.scheduleIterable(input, scheduler);
			if (isReadableStreamLike_1.isReadableStreamLike(input)) return scheduleReadableStreamLike_1.scheduleReadableStreamLike(input, scheduler);
		}
		throw throwUnobservableError_1.createInvalidObservableTypeError(input);
	}
	exports.scheduled = scheduled;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/observable/from.js
var require_from = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.from = void 0;
	var scheduled_1$1 = require_scheduled();
	var innerFrom_1$38 = require_innerFrom();
	function from$6(input, scheduler) {
		return scheduler ? scheduled_1$1.scheduled(input, scheduler) : innerFrom_1$38.innerFrom(input);
	}
	exports.from = from$6;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/observable/of.js
var require_of = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.of = void 0;
	var args_1$12 = require_args();
	var from_1$7 = require_from();
	function of$1() {
		var args = [];
		for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
		var scheduler = args_1$12.popScheduler(args);
		return from_1$7.from(args, scheduler);
	}
	exports.of = of$1;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/observable/throwError.js
var require_throwError = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.throwError = void 0;
	var Observable_1$18 = require_Observable();
	var isFunction_1$14 = require_isFunction();
	function throwError(errorOrErrorFactory, scheduler) {
		var errorFactory = isFunction_1$14.isFunction(errorOrErrorFactory) ? errorOrErrorFactory : function() {
			return errorOrErrorFactory;
		};
		var init = function(subscriber) {
			return subscriber.error(errorFactory());
		};
		return new Observable_1$18.Observable(scheduler ? function(subscriber) {
			return scheduler.schedule(init, 0, subscriber);
		} : init);
	}
	exports.throwError = throwError;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/Notification.js
var require_Notification = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.observeNotification = exports.Notification = exports.NotificationKind = void 0;
	var empty_1$8 = require_empty();
	var of_1$2 = require_of();
	var throwError_1$1 = require_throwError();
	var isFunction_1$13 = require_isFunction();
	(function(NotificationKind) {
		NotificationKind["NEXT"] = "N";
		NotificationKind["ERROR"] = "E";
		NotificationKind["COMPLETE"] = "C";
	})(exports.NotificationKind || (exports.NotificationKind = {}));
	var Notification = function() {
		function Notification$1(kind, value, error) {
			this.kind = kind;
			this.value = value;
			this.error = error;
			this.hasValue = kind === "N";
		}
		Notification$1.prototype.observe = function(observer) {
			return observeNotification(this, observer);
		};
		Notification$1.prototype.do = function(nextHandler, errorHandler, completeHandler) {
			var _a = this, kind = _a.kind, value = _a.value, error = _a.error;
			return kind === "N" ? nextHandler === null || nextHandler === void 0 ? void 0 : nextHandler(value) : kind === "E" ? errorHandler === null || errorHandler === void 0 ? void 0 : errorHandler(error) : completeHandler === null || completeHandler === void 0 ? void 0 : completeHandler();
		};
		Notification$1.prototype.accept = function(nextOrObserver, error, complete) {
			var _a;
			return isFunction_1$13.isFunction((_a = nextOrObserver) === null || _a === void 0 ? void 0 : _a.next) ? this.observe(nextOrObserver) : this.do(nextOrObserver, error, complete);
		};
		Notification$1.prototype.toObservable = function() {
			var _a = this, kind = _a.kind, value = _a.value, error = _a.error;
			var result = kind === "N" ? of_1$2.of(value) : kind === "E" ? throwError_1$1.throwError(function() {
				return error;
			}) : kind === "C" ? empty_1$8.EMPTY : 0;
			if (!result) throw new TypeError("Unexpected notification kind " + kind);
			return result;
		};
		Notification$1.createNext = function(value) {
			return new Notification$1("N", value);
		};
		Notification$1.createError = function(err) {
			return new Notification$1("E", void 0, err);
		};
		Notification$1.createComplete = function() {
			return Notification$1.completeNotification;
		};
		Notification$1.completeNotification = new Notification$1("C");
		return Notification$1;
	}();
	exports.Notification = Notification;
	function observeNotification(notification, observer) {
		var _a, _b, _c;
		var _d = notification, kind = _d.kind, value = _d.value, error = _d.error;
		if (typeof kind !== "string") throw new TypeError("Invalid notification, missing \"kind\"");
		kind === "N" ? (_a = observer.next) === null || _a === void 0 || _a.call(observer, value) : kind === "E" ? (_b = observer.error) === null || _b === void 0 || _b.call(observer, error) : (_c = observer.complete) === null || _c === void 0 || _c.call(observer);
	}
	exports.observeNotification = observeNotification;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/util/isObservable.js
var require_isObservable = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isObservable = void 0;
	var Observable_1$17 = require_Observable();
	var isFunction_1$12 = require_isFunction();
	function isObservable(obj) {
		return !!obj && (obj instanceof Observable_1$17.Observable || isFunction_1$12.isFunction(obj.lift) && isFunction_1$12.isFunction(obj.subscribe));
	}
	exports.isObservable = isObservable;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/util/EmptyError.js
var require_EmptyError = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.EmptyError = void 0;
	var createErrorClass_1$4 = require_createErrorClass();
	exports.EmptyError = createErrorClass_1$4.createErrorClass(function(_super) {
		return function EmptyErrorImpl() {
			_super(this);
			this.name = "EmptyError";
			this.message = "no elements in sequence";
		};
	});
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/lastValueFrom.js
var require_lastValueFrom = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.lastValueFrom = void 0;
	var EmptyError_1$6 = require_EmptyError();
	function lastValueFrom$1(source, config) {
		var hasConfig = typeof config === "object";
		return new Promise(function(resolve, reject) {
			var _hasValue = false;
			var _value;
			source.subscribe({
				next: function(value) {
					_value = value;
					_hasValue = true;
				},
				error: reject,
				complete: function() {
					if (_hasValue) resolve(_value);
					else if (hasConfig) resolve(config.defaultValue);
					else reject(new EmptyError_1$6.EmptyError());
				}
			});
		});
	}
	exports.lastValueFrom = lastValueFrom$1;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/firstValueFrom.js
var require_firstValueFrom = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.firstValueFrom = void 0;
	var EmptyError_1$5 = require_EmptyError();
	var Subscriber_1$2 = require_Subscriber();
	function firstValueFrom$5(source, config) {
		var hasConfig = typeof config === "object";
		return new Promise(function(resolve, reject) {
			var subscriber = new Subscriber_1$2.SafeSubscriber({
				next: function(value) {
					resolve(value);
					subscriber.unsubscribe();
				},
				error: reject,
				complete: function() {
					if (hasConfig) resolve(config.defaultValue);
					else reject(new EmptyError_1$5.EmptyError());
				}
			});
			source.subscribe(subscriber);
		});
	}
	exports.firstValueFrom = firstValueFrom$5;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/util/ArgumentOutOfRangeError.js
var require_ArgumentOutOfRangeError = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ArgumentOutOfRangeError = void 0;
	var createErrorClass_1$3 = require_createErrorClass();
	exports.ArgumentOutOfRangeError = createErrorClass_1$3.createErrorClass(function(_super) {
		return function ArgumentOutOfRangeErrorImpl() {
			_super(this);
			this.name = "ArgumentOutOfRangeError";
			this.message = "argument out of range";
		};
	});
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/util/NotFoundError.js
var require_NotFoundError = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.NotFoundError = void 0;
	var createErrorClass_1$2 = require_createErrorClass();
	exports.NotFoundError = createErrorClass_1$2.createErrorClass(function(_super) {
		return function NotFoundErrorImpl(message) {
			_super(this);
			this.name = "NotFoundError";
			this.message = message;
		};
	});
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/util/SequenceError.js
var require_SequenceError = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SequenceError = void 0;
	var createErrorClass_1$1 = require_createErrorClass();
	exports.SequenceError = createErrorClass_1$1.createErrorClass(function(_super) {
		return function SequenceErrorImpl(message) {
			_super(this);
			this.name = "SequenceError";
			this.message = message;
		};
	});
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/util/isDate.js
var require_isDate = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isValidDate = void 0;
	function isValidDate(value) {
		return value instanceof Date && !isNaN(value);
	}
	exports.isValidDate = isValidDate;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/timeout.js
var require_timeout = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.timeout = exports.TimeoutError = void 0;
	var async_1$12 = require_async();
	var isDate_1$2 = require_isDate();
	var lift_1$65 = require_lift();
	var innerFrom_1$37 = require_innerFrom();
	var createErrorClass_1 = require_createErrorClass();
	var OperatorSubscriber_1$55 = require_OperatorSubscriber();
	var executeSchedule_1$4 = require_executeSchedule();
	exports.TimeoutError = createErrorClass_1.createErrorClass(function(_super) {
		return function TimeoutErrorImpl(info) {
			if (info === void 0) info = null;
			_super(this);
			this.message = "Timeout has occurred";
			this.name = "TimeoutError";
			this.info = info;
		};
	});
	function timeout$3(config, schedulerArg) {
		var _a = isDate_1$2.isValidDate(config) ? { first: config } : typeof config === "number" ? { each: config } : config, first$1 = _a.first, each = _a.each, _b = _a.with, _with = _b === void 0 ? timeoutErrorFactory : _b, _c = _a.scheduler, scheduler = _c === void 0 ? schedulerArg !== null && schedulerArg !== void 0 ? schedulerArg : async_1$12.asyncScheduler : _c, _d = _a.meta, meta = _d === void 0 ? null : _d;
		if (first$1 == null && each == null) throw new TypeError("No timeout provided.");
		return lift_1$65.operate(function(source, subscriber) {
			var originalSourceSubscription;
			var timerSubscription;
			var lastValue = null;
			var seen = 0;
			var startTimer = function(delay$1) {
				timerSubscription = executeSchedule_1$4.executeSchedule(subscriber, scheduler, function() {
					try {
						originalSourceSubscription.unsubscribe();
						innerFrom_1$37.innerFrom(_with({
							meta,
							lastValue,
							seen
						})).subscribe(subscriber);
					} catch (err) {
						subscriber.error(err);
					}
				}, delay$1);
			};
			originalSourceSubscription = source.subscribe(OperatorSubscriber_1$55.createOperatorSubscriber(subscriber, function(value) {
				timerSubscription === null || timerSubscription === void 0 || timerSubscription.unsubscribe();
				seen++;
				subscriber.next(lastValue = value);
				each > 0 && startTimer(each);
			}, void 0, void 0, function() {
				if (!(timerSubscription === null || timerSubscription === void 0 ? void 0 : timerSubscription.closed)) timerSubscription === null || timerSubscription === void 0 || timerSubscription.unsubscribe();
				lastValue = null;
			}));
			!seen && startTimer(first$1 != null ? typeof first$1 === "number" ? first$1 : +first$1 - scheduler.now() : each);
		});
	}
	exports.timeout = timeout$3;
	function timeoutErrorFactory(info) {
		throw new exports.TimeoutError(info);
	}
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/map.js
var require_map = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.map = void 0;
	var lift_1$64 = require_lift();
	var OperatorSubscriber_1$54 = require_OperatorSubscriber();
	function map$17(project, thisArg) {
		return lift_1$64.operate(function(source, subscriber) {
			var index = 0;
			source.subscribe(OperatorSubscriber_1$54.createOperatorSubscriber(subscriber, function(value) {
				subscriber.next(project.call(thisArg, value, index++));
			}));
		});
	}
	exports.map = map$17;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/util/mapOneOrManyArgs.js
var require_mapOneOrManyArgs = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __read$17 = exports && exports.__read || function(o, n) {
		var m = typeof Symbol === "function" && o[Symbol.iterator];
		if (!m) return o;
		var i = m.call(o), r, ar = [], e;
		try {
			while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
		} catch (error) {
			e = { error };
		} finally {
			try {
				if (r && !r.done && (m = i["return"])) m.call(i);
			} finally {
				if (e) throw e.error;
			}
		}
		return ar;
	};
	var __spreadArray$16 = exports && exports.__spreadArray || function(to, from$7) {
		for (var i = 0, il = from$7.length, j = to.length; i < il; i++, j++) to[j] = from$7[i];
		return to;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.mapOneOrManyArgs = void 0;
	var map_1$7 = require_map();
	var isArray$2 = Array.isArray;
	function callOrApply(fn, args) {
		return isArray$2(args) ? fn.apply(void 0, __spreadArray$16([], __read$17(args))) : fn(args);
	}
	function mapOneOrManyArgs(fn) {
		return map_1$7.map(function(args) {
			return callOrApply(fn, args);
		});
	}
	exports.mapOneOrManyArgs = mapOneOrManyArgs;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/observable/bindCallbackInternals.js
var require_bindCallbackInternals = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __read$16 = exports && exports.__read || function(o, n) {
		var m = typeof Symbol === "function" && o[Symbol.iterator];
		if (!m) return o;
		var i = m.call(o), r, ar = [], e;
		try {
			while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
		} catch (error) {
			e = { error };
		} finally {
			try {
				if (r && !r.done && (m = i["return"])) m.call(i);
			} finally {
				if (e) throw e.error;
			}
		}
		return ar;
	};
	var __spreadArray$15 = exports && exports.__spreadArray || function(to, from$7) {
		for (var i = 0, il = from$7.length, j = to.length; i < il; i++, j++) to[j] = from$7[i];
		return to;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.bindCallbackInternals = void 0;
	var isScheduler_1$2 = require_isScheduler();
	var Observable_1$16 = require_Observable();
	var subscribeOn_1$2 = require_subscribeOn();
	var mapOneOrManyArgs_1$6 = require_mapOneOrManyArgs();
	var observeOn_1$2 = require_observeOn();
	var AsyncSubject_1$2 = require_AsyncSubject();
	function bindCallbackInternals(isNodeStyle, callbackFunc, resultSelector, scheduler) {
		if (resultSelector) if (isScheduler_1$2.isScheduler(resultSelector)) scheduler = resultSelector;
		else return function() {
			var args = [];
			for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
			return bindCallbackInternals(isNodeStyle, callbackFunc, scheduler).apply(this, args).pipe(mapOneOrManyArgs_1$6.mapOneOrManyArgs(resultSelector));
		};
		if (scheduler) return function() {
			var args = [];
			for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
			return bindCallbackInternals(isNodeStyle, callbackFunc).apply(this, args).pipe(subscribeOn_1$2.subscribeOn(scheduler), observeOn_1$2.observeOn(scheduler));
		};
		return function() {
			var _this = this;
			var args = [];
			for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
			var subject = new AsyncSubject_1$2.AsyncSubject();
			var uninitialized = true;
			return new Observable_1$16.Observable(function(subscriber) {
				var subs = subject.subscribe(subscriber);
				if (uninitialized) {
					uninitialized = false;
					var isAsync_1 = false;
					var isComplete_1 = false;
					callbackFunc.apply(_this, __spreadArray$15(__spreadArray$15([], __read$16(args)), [function() {
						var results = [];
						for (var _i$1 = 0; _i$1 < arguments.length; _i$1++) results[_i$1] = arguments[_i$1];
						if (isNodeStyle) {
							var err = results.shift();
							if (err != null) {
								subject.error(err);
								return;
							}
						}
						subject.next(1 < results.length ? results : results[0]);
						isComplete_1 = true;
						if (isAsync_1) subject.complete();
					}]));
					if (isComplete_1) subject.complete();
					isAsync_1 = true;
				}
				return subs;
			});
		};
	}
	exports.bindCallbackInternals = bindCallbackInternals;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/observable/bindCallback.js
var require_bindCallback = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.bindCallback = void 0;
	var bindCallbackInternals_1$1 = require_bindCallbackInternals();
	function bindCallback(callbackFunc, resultSelector, scheduler) {
		return bindCallbackInternals_1$1.bindCallbackInternals(false, callbackFunc, resultSelector, scheduler);
	}
	exports.bindCallback = bindCallback;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/observable/bindNodeCallback.js
var require_bindNodeCallback = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.bindNodeCallback = void 0;
	var bindCallbackInternals_1 = require_bindCallbackInternals();
	function bindNodeCallback(callbackFunc, resultSelector, scheduler) {
		return bindCallbackInternals_1.bindCallbackInternals(true, callbackFunc, resultSelector, scheduler);
	}
	exports.bindNodeCallback = bindNodeCallback;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/util/argsArgArrayOrObject.js
var require_argsArgArrayOrObject = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.argsArgArrayOrObject = void 0;
	var isArray$1 = Array.isArray;
	var getPrototypeOf = Object.getPrototypeOf, objectProto = Object.prototype, getKeys = Object.keys;
	function argsArgArrayOrObject(args) {
		if (args.length === 1) {
			var first_1$2 = args[0];
			if (isArray$1(first_1$2)) return {
				args: first_1$2,
				keys: null
			};
			if (isPOJO(first_1$2)) {
				var keys = getKeys(first_1$2);
				return {
					args: keys.map(function(key) {
						return first_1$2[key];
					}),
					keys
				};
			}
		}
		return {
			args,
			keys: null
		};
	}
	exports.argsArgArrayOrObject = argsArgArrayOrObject;
	function isPOJO(obj) {
		return obj && typeof obj === "object" && getPrototypeOf(obj) === objectProto;
	}
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/util/createObject.js
var require_createObject = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.createObject = void 0;
	function createObject(keys, values) {
		return keys.reduce(function(result, key, i) {
			return result[key] = values[i], result;
		}, {});
	}
	exports.createObject = createObject;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/observable/combineLatest.js
var require_combineLatest$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.combineLatestInit = exports.combineLatest = void 0;
	var Observable_1$15 = require_Observable();
	var argsArgArrayOrObject_1$1 = require_argsArgArrayOrObject();
	var from_1$6 = require_from();
	var identity_1$14 = require_identity();
	var mapOneOrManyArgs_1$5 = require_mapOneOrManyArgs();
	var args_1$11 = require_args();
	var createObject_1$1 = require_createObject();
	var OperatorSubscriber_1$53 = require_OperatorSubscriber();
	var executeSchedule_1$3 = require_executeSchedule();
	function combineLatest$2() {
		var args = [];
		for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
		var scheduler = args_1$11.popScheduler(args);
		var resultSelector = args_1$11.popResultSelector(args);
		var _a = argsArgArrayOrObject_1$1.argsArgArrayOrObject(args), observables = _a.args, keys = _a.keys;
		if (observables.length === 0) return from_1$6.from([], scheduler);
		var result = new Observable_1$15.Observable(combineLatestInit(observables, scheduler, keys ? function(values) {
			return createObject_1$1.createObject(keys, values);
		} : identity_1$14.identity));
		return resultSelector ? result.pipe(mapOneOrManyArgs_1$5.mapOneOrManyArgs(resultSelector)) : result;
	}
	exports.combineLatest = combineLatest$2;
	function combineLatestInit(observables, scheduler, valueTransform) {
		if (valueTransform === void 0) valueTransform = identity_1$14.identity;
		return function(subscriber) {
			maybeSchedule(scheduler, function() {
				var length = observables.length;
				var values = new Array(length);
				var active = length;
				var remainingFirstValues = length;
				var _loop_1 = function(i$1) {
					maybeSchedule(scheduler, function() {
						var source = from_1$6.from(observables[i$1], scheduler);
						var hasFirstValue = false;
						source.subscribe(OperatorSubscriber_1$53.createOperatorSubscriber(subscriber, function(value) {
							values[i$1] = value;
							if (!hasFirstValue) {
								hasFirstValue = true;
								remainingFirstValues--;
							}
							if (!remainingFirstValues) subscriber.next(valueTransform(values.slice()));
						}, function() {
							if (!--active) subscriber.complete();
						}));
					}, subscriber);
				};
				for (var i = 0; i < length; i++) _loop_1(i);
			}, subscriber);
		};
	}
	exports.combineLatestInit = combineLatestInit;
	function maybeSchedule(scheduler, execute, subscription) {
		if (scheduler) executeSchedule_1$3.executeSchedule(subscription, scheduler, execute);
		else execute();
	}
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/mergeInternals.js
var require_mergeInternals = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.mergeInternals = void 0;
	var innerFrom_1$36 = require_innerFrom();
	var executeSchedule_1$2 = require_executeSchedule();
	var OperatorSubscriber_1$52 = require_OperatorSubscriber();
	function mergeInternals(source, subscriber, project, concurrent, onBeforeNext, expand$1, innerSubScheduler, additionalFinalizer) {
		var buffer$1 = [];
		var active = 0;
		var index = 0;
		var isComplete = false;
		var checkComplete = function() {
			if (isComplete && !buffer$1.length && !active) subscriber.complete();
		};
		var outerNext = function(value) {
			return active < concurrent ? doInnerSub(value) : buffer$1.push(value);
		};
		var doInnerSub = function(value) {
			expand$1 && subscriber.next(value);
			active++;
			var innerComplete = false;
			innerFrom_1$36.innerFrom(project(value, index++)).subscribe(OperatorSubscriber_1$52.createOperatorSubscriber(subscriber, function(innerValue) {
				onBeforeNext === null || onBeforeNext === void 0 || onBeforeNext(innerValue);
				if (expand$1) outerNext(innerValue);
				else subscriber.next(innerValue);
			}, function() {
				innerComplete = true;
			}, void 0, function() {
				if (innerComplete) try {
					active--;
					var _loop_1 = function() {
						var bufferedValue = buffer$1.shift();
						if (innerSubScheduler) executeSchedule_1$2.executeSchedule(subscriber, innerSubScheduler, function() {
							return doInnerSub(bufferedValue);
						});
						else doInnerSub(bufferedValue);
					};
					while (buffer$1.length && active < concurrent) _loop_1();
					checkComplete();
				} catch (err) {
					subscriber.error(err);
				}
			}));
		};
		source.subscribe(OperatorSubscriber_1$52.createOperatorSubscriber(subscriber, outerNext, function() {
			isComplete = true;
			checkComplete();
		}));
		return function() {
			additionalFinalizer === null || additionalFinalizer === void 0 || additionalFinalizer();
		};
	}
	exports.mergeInternals = mergeInternals;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/mergeMap.js
var require_mergeMap = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.mergeMap = void 0;
	var map_1$6 = require_map();
	var innerFrom_1$35 = require_innerFrom();
	var lift_1$63 = require_lift();
	var mergeInternals_1$2 = require_mergeInternals();
	var isFunction_1$11 = require_isFunction();
	function mergeMap(project, resultSelector, concurrent) {
		if (concurrent === void 0) concurrent = Infinity;
		if (isFunction_1$11.isFunction(resultSelector)) return mergeMap(function(a, i) {
			return map_1$6.map(function(b, ii) {
				return resultSelector(a, b, i, ii);
			})(innerFrom_1$35.innerFrom(project(a, i)));
		}, concurrent);
		else if (typeof resultSelector === "number") concurrent = resultSelector;
		return lift_1$63.operate(function(source, subscriber) {
			return mergeInternals_1$2.mergeInternals(source, subscriber, project, concurrent);
		});
	}
	exports.mergeMap = mergeMap;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/mergeAll.js
var require_mergeAll = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.mergeAll = void 0;
	var mergeMap_1$8 = require_mergeMap();
	var identity_1$13 = require_identity();
	function mergeAll(concurrent) {
		if (concurrent === void 0) concurrent = Infinity;
		return mergeMap_1$8.mergeMap(identity_1$13.identity, concurrent);
	}
	exports.mergeAll = mergeAll;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/concatAll.js
var require_concatAll = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.concatAll = void 0;
	var mergeAll_1$4 = require_mergeAll();
	function concatAll() {
		return mergeAll_1$4.mergeAll(1);
	}
	exports.concatAll = concatAll;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/observable/concat.js
var require_concat$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.concat = void 0;
	var concatAll_1$3 = require_concatAll();
	var args_1$10 = require_args();
	var from_1$5 = require_from();
	function concat$1() {
		var args = [];
		for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
		return concatAll_1$3.concatAll()(from_1$5.from(args, args_1$10.popScheduler(args)));
	}
	exports.concat = concat$1;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/observable/defer.js
var require_defer = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.defer = void 0;
	var Observable_1$14 = require_Observable();
	var innerFrom_1$34 = require_innerFrom();
	function defer$6(observableFactory) {
		return new Observable_1$14.Observable(function(subscriber) {
			innerFrom_1$34.innerFrom(observableFactory()).subscribe(subscriber);
		});
	}
	exports.defer = defer$6;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/observable/connectable.js
var require_connectable = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.connectable = void 0;
	var Subject_1$12 = require_Subject();
	var Observable_1$13 = require_Observable();
	var defer_1$3 = require_defer();
	var DEFAULT_CONFIG$1 = {
		connector: function() {
			return new Subject_1$12.Subject();
		},
		resetOnDisconnect: true
	};
	function connectable(source, config) {
		if (config === void 0) config = DEFAULT_CONFIG$1;
		var connection = null;
		var connector = config.connector, _a = config.resetOnDisconnect, resetOnDisconnect = _a === void 0 ? true : _a;
		var subject = connector();
		var result = new Observable_1$13.Observable(function(subscriber) {
			return subject.subscribe(subscriber);
		});
		result.connect = function() {
			if (!connection || connection.closed) {
				connection = defer_1$3.defer(function() {
					return source;
				}).subscribe(subject);
				if (resetOnDisconnect) connection.add(function() {
					return subject = connector();
				});
			}
			return connection;
		};
		return result;
	}
	exports.connectable = connectable;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/observable/forkJoin.js
var require_forkJoin = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.forkJoin = void 0;
	var Observable_1$12 = require_Observable();
	var argsArgArrayOrObject_1 = require_argsArgArrayOrObject();
	var innerFrom_1$33 = require_innerFrom();
	var args_1$9 = require_args();
	var OperatorSubscriber_1$51 = require_OperatorSubscriber();
	var mapOneOrManyArgs_1$4 = require_mapOneOrManyArgs();
	var createObject_1 = require_createObject();
	function forkJoin() {
		var args = [];
		for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
		var resultSelector = args_1$9.popResultSelector(args);
		var _a = argsArgArrayOrObject_1.argsArgArrayOrObject(args), sources = _a.args, keys = _a.keys;
		var result = new Observable_1$12.Observable(function(subscriber) {
			var length = sources.length;
			if (!length) {
				subscriber.complete();
				return;
			}
			var values = new Array(length);
			var remainingCompletions = length;
			var remainingEmissions = length;
			var _loop_1 = function(sourceIndex$1) {
				var hasValue = false;
				innerFrom_1$33.innerFrom(sources[sourceIndex$1]).subscribe(OperatorSubscriber_1$51.createOperatorSubscriber(subscriber, function(value) {
					if (!hasValue) {
						hasValue = true;
						remainingEmissions--;
					}
					values[sourceIndex$1] = value;
				}, function() {
					return remainingCompletions--;
				}, void 0, function() {
					if (!remainingCompletions || !hasValue) {
						if (!remainingEmissions) subscriber.next(keys ? createObject_1.createObject(keys, values) : values);
						subscriber.complete();
					}
				}));
			};
			for (var sourceIndex = 0; sourceIndex < length; sourceIndex++) _loop_1(sourceIndex);
		});
		return resultSelector ? result.pipe(mapOneOrManyArgs_1$4.mapOneOrManyArgs(resultSelector)) : result;
	}
	exports.forkJoin = forkJoin;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/observable/fromEvent.js
var require_fromEvent = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __read$15 = exports && exports.__read || function(o, n) {
		var m = typeof Symbol === "function" && o[Symbol.iterator];
		if (!m) return o;
		var i = m.call(o), r, ar = [], e;
		try {
			while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
		} catch (error) {
			e = { error };
		} finally {
			try {
				if (r && !r.done && (m = i["return"])) m.call(i);
			} finally {
				if (e) throw e.error;
			}
		}
		return ar;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.fromEvent = void 0;
	var innerFrom_1$32 = require_innerFrom();
	var Observable_1$11 = require_Observable();
	var mergeMap_1$7 = require_mergeMap();
	var isArrayLike_1 = require_isArrayLike();
	var isFunction_1$10 = require_isFunction();
	var mapOneOrManyArgs_1$3 = require_mapOneOrManyArgs();
	var nodeEventEmitterMethods = ["addListener", "removeListener"];
	var eventTargetMethods = ["addEventListener", "removeEventListener"];
	var jqueryMethods = ["on", "off"];
	function fromEvent(target, eventName, options, resultSelector) {
		if (isFunction_1$10.isFunction(options)) {
			resultSelector = options;
			options = void 0;
		}
		if (resultSelector) return fromEvent(target, eventName, options).pipe(mapOneOrManyArgs_1$3.mapOneOrManyArgs(resultSelector));
		var _a = __read$15(isEventTarget(target) ? eventTargetMethods.map(function(methodName) {
			return function(handler) {
				return target[methodName](eventName, handler, options);
			};
		}) : isNodeStyleEventEmitter(target) ? nodeEventEmitterMethods.map(toCommonHandlerRegistry(target, eventName)) : isJQueryStyleEventEmitter(target) ? jqueryMethods.map(toCommonHandlerRegistry(target, eventName)) : [], 2), add = _a[0], remove = _a[1];
		if (!add) {
			if (isArrayLike_1.isArrayLike(target)) return mergeMap_1$7.mergeMap(function(subTarget) {
				return fromEvent(subTarget, eventName, options);
			})(innerFrom_1$32.innerFrom(target));
		}
		if (!add) throw new TypeError("Invalid event target");
		return new Observable_1$11.Observable(function(subscriber) {
			var handler = function() {
				var args = [];
				for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
				return subscriber.next(1 < args.length ? args : args[0]);
			};
			add(handler);
			return function() {
				return remove(handler);
			};
		});
	}
	exports.fromEvent = fromEvent;
	function toCommonHandlerRegistry(target, eventName) {
		return function(methodName) {
			return function(handler) {
				return target[methodName](eventName, handler);
			};
		};
	}
	function isNodeStyleEventEmitter(target) {
		return isFunction_1$10.isFunction(target.addListener) && isFunction_1$10.isFunction(target.removeListener);
	}
	function isJQueryStyleEventEmitter(target) {
		return isFunction_1$10.isFunction(target.on) && isFunction_1$10.isFunction(target.off);
	}
	function isEventTarget(target) {
		return isFunction_1$10.isFunction(target.addEventListener) && isFunction_1$10.isFunction(target.removeEventListener);
	}
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/observable/fromEventPattern.js
var require_fromEventPattern = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.fromEventPattern = void 0;
	var Observable_1$10 = require_Observable();
	var isFunction_1$9 = require_isFunction();
	var mapOneOrManyArgs_1$2 = require_mapOneOrManyArgs();
	function fromEventPattern(addHandler, removeHandler, resultSelector) {
		if (resultSelector) return fromEventPattern(addHandler, removeHandler).pipe(mapOneOrManyArgs_1$2.mapOneOrManyArgs(resultSelector));
		return new Observable_1$10.Observable(function(subscriber) {
			var handler = function() {
				var e = [];
				for (var _i = 0; _i < arguments.length; _i++) e[_i] = arguments[_i];
				return subscriber.next(e.length === 1 ? e[0] : e);
			};
			var retValue = addHandler(handler);
			return isFunction_1$9.isFunction(removeHandler) ? function() {
				return removeHandler(handler, retValue);
			} : void 0;
		});
	}
	exports.fromEventPattern = fromEventPattern;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/observable/generate.js
var require_generate = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __generator = exports && exports.__generator || function(thisArg, body) {
		var _ = {
			label: 0,
			sent: function() {
				if (t[0] & 1) throw t[1];
				return t[1];
			},
			trys: [],
			ops: []
		}, f, y, t, g;
		return g = {
			next: verb(0),
			"throw": verb(1),
			"return": verb(2)
		}, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
			return this;
		}), g;
		function verb(n) {
			return function(v) {
				return step([n, v]);
			};
		}
		function step(op) {
			if (f) throw new TypeError("Generator is already executing.");
			while (_) try {
				if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
				if (y = 0, t) op = [op[0] & 2, t.value];
				switch (op[0]) {
					case 0:
					case 1:
						t = op;
						break;
					case 4:
						_.label++;
						return {
							value: op[1],
							done: false
						};
					case 5:
						_.label++;
						y = op[1];
						op = [0];
						continue;
					case 7:
						op = _.ops.pop();
						_.trys.pop();
						continue;
					default:
						if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
							_ = 0;
							continue;
						}
						if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
							_.label = op[1];
							break;
						}
						if (op[0] === 6 && _.label < t[1]) {
							_.label = t[1];
							t = op;
							break;
						}
						if (t && _.label < t[2]) {
							_.label = t[2];
							_.ops.push(op);
							break;
						}
						if (t[2]) _.ops.pop();
						_.trys.pop();
						continue;
				}
				op = body.call(thisArg, _);
			} catch (e) {
				op = [6, e];
				y = 0;
			} finally {
				f = t = 0;
			}
			if (op[0] & 5) throw op[1];
			return {
				value: op[0] ? op[1] : void 0,
				done: true
			};
		}
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.generate = void 0;
	var identity_1$12 = require_identity();
	var isScheduler_1$1 = require_isScheduler();
	var defer_1$2 = require_defer();
	var scheduleIterable_1 = require_scheduleIterable();
	function generate(initialStateOrOptions, condition, iterate, resultSelectorOrScheduler, scheduler) {
		var _a, _b;
		var resultSelector;
		var initialState$1;
		if (arguments.length === 1) _a = initialStateOrOptions, initialState$1 = _a.initialState, condition = _a.condition, iterate = _a.iterate, _b = _a.resultSelector, resultSelector = _b === void 0 ? identity_1$12.identity : _b, scheduler = _a.scheduler;
		else {
			initialState$1 = initialStateOrOptions;
			if (!resultSelectorOrScheduler || isScheduler_1$1.isScheduler(resultSelectorOrScheduler)) {
				resultSelector = identity_1$12.identity;
				scheduler = resultSelectorOrScheduler;
			} else resultSelector = resultSelectorOrScheduler;
		}
		function gen() {
			var state;
			return __generator(this, function(_a$1) {
				switch (_a$1.label) {
					case 0:
						state = initialState$1;
						_a$1.label = 1;
					case 1:
						if (!(!condition || condition(state))) return [3, 4];
						return [4, resultSelector(state)];
					case 2:
						_a$1.sent();
						_a$1.label = 3;
					case 3:
						state = iterate(state);
						return [3, 1];
					case 4: return [2];
				}
			});
		}
		return defer_1$2.defer(scheduler ? function() {
			return scheduleIterable_1.scheduleIterable(gen(), scheduler);
		} : gen);
	}
	exports.generate = generate;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/observable/iif.js
var require_iif = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.iif = void 0;
	var defer_1$1 = require_defer();
	function iif(condition, trueResult, falseResult) {
		return defer_1$1.defer(function() {
			return condition() ? trueResult : falseResult;
		});
	}
	exports.iif = iif;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/observable/timer.js
var require_timer = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.timer = void 0;
	var Observable_1$9 = require_Observable();
	var async_1$11 = require_async();
	var isScheduler_1 = require_isScheduler();
	var isDate_1$1 = require_isDate();
	function timer(dueTime, intervalOrScheduler, scheduler) {
		if (dueTime === void 0) dueTime = 0;
		if (scheduler === void 0) scheduler = async_1$11.async;
		var intervalDuration = -1;
		if (intervalOrScheduler != null) if (isScheduler_1.isScheduler(intervalOrScheduler)) scheduler = intervalOrScheduler;
		else intervalDuration = intervalOrScheduler;
		return new Observable_1$9.Observable(function(subscriber) {
			var due = isDate_1$1.isValidDate(dueTime) ? +dueTime - scheduler.now() : dueTime;
			if (due < 0) due = 0;
			var n = 0;
			return scheduler.schedule(function() {
				if (!subscriber.closed) {
					subscriber.next(n++);
					if (0 <= intervalDuration) this.schedule(void 0, intervalDuration);
					else subscriber.complete();
				}
			}, due);
		});
	}
	exports.timer = timer;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/observable/interval.js
var require_interval = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.interval = void 0;
	var async_1$10 = require_async();
	var timer_1$6 = require_timer();
	function interval$1(period, scheduler) {
		if (period === void 0) period = 0;
		if (scheduler === void 0) scheduler = async_1$10.asyncScheduler;
		if (period < 0) period = 0;
		return timer_1$6.timer(period, period, scheduler);
	}
	exports.interval = interval$1;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/observable/merge.js
var require_merge$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.merge = void 0;
	var mergeAll_1$3 = require_mergeAll();
	var innerFrom_1$31 = require_innerFrom();
	var empty_1$7 = require_empty();
	var args_1$8 = require_args();
	var from_1$4 = require_from();
	function merge$6() {
		var args = [];
		for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
		var scheduler = args_1$8.popScheduler(args);
		var concurrent = args_1$8.popNumber(args, Infinity);
		var sources = args;
		return !sources.length ? empty_1$7.EMPTY : sources.length === 1 ? innerFrom_1$31.innerFrom(sources[0]) : mergeAll_1$3.mergeAll(concurrent)(from_1$4.from(sources, scheduler));
	}
	exports.merge = merge$6;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/observable/never.js
var require_never = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.never = exports.NEVER = void 0;
	var Observable_1$8 = require_Observable();
	var noop_1$14 = require_noop();
	exports.NEVER = new Observable_1$8.Observable(noop_1$14.noop);
	function never() {
		return exports.NEVER;
	}
	exports.never = never;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/util/argsOrArgArray.js
var require_argsOrArgArray = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.argsOrArgArray = void 0;
	var isArray = Array.isArray;
	function argsOrArgArray(args) {
		return args.length === 1 && isArray(args[0]) ? args[0] : args;
	}
	exports.argsOrArgArray = argsOrArgArray;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/observable/onErrorResumeNext.js
var require_onErrorResumeNext = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.onErrorResumeNext = void 0;
	var Observable_1$7 = require_Observable();
	var argsOrArgArray_1$5 = require_argsOrArgArray();
	var OperatorSubscriber_1$50 = require_OperatorSubscriber();
	var noop_1$13 = require_noop();
	var innerFrom_1$30 = require_innerFrom();
	function onErrorResumeNext() {
		var sources = [];
		for (var _i = 0; _i < arguments.length; _i++) sources[_i] = arguments[_i];
		var nextSources = argsOrArgArray_1$5.argsOrArgArray(sources);
		return new Observable_1$7.Observable(function(subscriber) {
			var sourceIndex = 0;
			var subscribeNext = function() {
				if (sourceIndex < nextSources.length) {
					var nextSource = void 0;
					try {
						nextSource = innerFrom_1$30.innerFrom(nextSources[sourceIndex++]);
					} catch (err) {
						subscribeNext();
						return;
					}
					var innerSubscriber = new OperatorSubscriber_1$50.OperatorSubscriber(subscriber, void 0, noop_1$13.noop, noop_1$13.noop);
					nextSource.subscribe(innerSubscriber);
					innerSubscriber.add(subscribeNext);
				} else subscriber.complete();
			};
			subscribeNext();
		});
	}
	exports.onErrorResumeNext = onErrorResumeNext;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/observable/pairs.js
var require_pairs = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.pairs = void 0;
	var from_1$3 = require_from();
	function pairs(obj, scheduler) {
		return from_1$3.from(Object.entries(obj), scheduler);
	}
	exports.pairs = pairs;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/util/not.js
var require_not = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.not = void 0;
	function not(pred, thisArg) {
		return function(value, index) {
			return !pred.call(thisArg, value, index);
		};
	}
	exports.not = not;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/filter.js
var require_filter = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.filter = void 0;
	var lift_1$62 = require_lift();
	var OperatorSubscriber_1$49 = require_OperatorSubscriber();
	function filter$12(predicate, thisArg) {
		return lift_1$62.operate(function(source, subscriber) {
			var index = 0;
			source.subscribe(OperatorSubscriber_1$49.createOperatorSubscriber(subscriber, function(value) {
				return predicate.call(thisArg, value, index++) && subscriber.next(value);
			}));
		});
	}
	exports.filter = filter$12;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/observable/partition.js
var require_partition$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.partition = void 0;
	var not_1$1 = require_not();
	var filter_1$7 = require_filter();
	var innerFrom_1$29 = require_innerFrom();
	function partition$1(source, predicate, thisArg) {
		return [filter_1$7.filter(predicate, thisArg)(innerFrom_1$29.innerFrom(source)), filter_1$7.filter(not_1$1.not(predicate, thisArg))(innerFrom_1$29.innerFrom(source))];
	}
	exports.partition = partition$1;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/observable/race.js
var require_race$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.raceInit = exports.race = void 0;
	var Observable_1$6 = require_Observable();
	var innerFrom_1$28 = require_innerFrom();
	var argsOrArgArray_1$4 = require_argsOrArgArray();
	var OperatorSubscriber_1$48 = require_OperatorSubscriber();
	function race$3() {
		var sources = [];
		for (var _i = 0; _i < arguments.length; _i++) sources[_i] = arguments[_i];
		sources = argsOrArgArray_1$4.argsOrArgArray(sources);
		return sources.length === 1 ? innerFrom_1$28.innerFrom(sources[0]) : new Observable_1$6.Observable(raceInit(sources));
	}
	exports.race = race$3;
	function raceInit(sources) {
		return function(subscriber) {
			var subscriptions = [];
			var _loop_1 = function(i$1) {
				subscriptions.push(innerFrom_1$28.innerFrom(sources[i$1]).subscribe(OperatorSubscriber_1$48.createOperatorSubscriber(subscriber, function(value) {
					if (subscriptions) {
						for (var s = 0; s < subscriptions.length; s++) s !== i$1 && subscriptions[s].unsubscribe();
						subscriptions = null;
					}
					subscriber.next(value);
				})));
			};
			for (var i = 0; subscriptions && !subscriber.closed && i < sources.length; i++) _loop_1(i);
		};
	}
	exports.raceInit = raceInit;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/observable/range.js
var require_range = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.range = void 0;
	var Observable_1$5 = require_Observable();
	var empty_1$6 = require_empty();
	function range(start, count$1, scheduler) {
		if (count$1 == null) {
			count$1 = start;
			start = 0;
		}
		if (count$1 <= 0) return empty_1$6.EMPTY;
		var end = count$1 + start;
		return new Observable_1$5.Observable(scheduler ? function(subscriber) {
			var n = start;
			return scheduler.schedule(function() {
				if (n < end) {
					subscriber.next(n++);
					this.schedule();
				} else subscriber.complete();
			});
		} : function(subscriber) {
			var n = start;
			while (n < end && !subscriber.closed) subscriber.next(n++);
			subscriber.complete();
		});
	}
	exports.range = range;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/observable/using.js
var require_using = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.using = void 0;
	var Observable_1$4 = require_Observable();
	var innerFrom_1$27 = require_innerFrom();
	var empty_1$5 = require_empty();
	function using(resourceFactory, observableFactory) {
		return new Observable_1$4.Observable(function(subscriber) {
			var resource = resourceFactory();
			var result = observableFactory(resource);
			(result ? innerFrom_1$27.innerFrom(result) : empty_1$5.EMPTY).subscribe(subscriber);
			return function() {
				if (resource) resource.unsubscribe();
			};
		});
	}
	exports.using = using;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/observable/zip.js
var require_zip$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __read$14 = exports && exports.__read || function(o, n) {
		var m = typeof Symbol === "function" && o[Symbol.iterator];
		if (!m) return o;
		var i = m.call(o), r, ar = [], e;
		try {
			while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
		} catch (error) {
			e = { error };
		} finally {
			try {
				if (r && !r.done && (m = i["return"])) m.call(i);
			} finally {
				if (e) throw e.error;
			}
		}
		return ar;
	};
	var __spreadArray$14 = exports && exports.__spreadArray || function(to, from$7) {
		for (var i = 0, il = from$7.length, j = to.length; i < il; i++, j++) to[j] = from$7[i];
		return to;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.zip = void 0;
	var Observable_1$3 = require_Observable();
	var innerFrom_1$26 = require_innerFrom();
	var argsOrArgArray_1$3 = require_argsOrArgArray();
	var empty_1$4 = require_empty();
	var OperatorSubscriber_1$47 = require_OperatorSubscriber();
	var args_1$7 = require_args();
	function zip$1() {
		var args = [];
		for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
		var resultSelector = args_1$7.popResultSelector(args);
		var sources = argsOrArgArray_1$3.argsOrArgArray(args);
		return sources.length ? new Observable_1$3.Observable(function(subscriber) {
			var buffers = sources.map(function() {
				return [];
			});
			var completed = sources.map(function() {
				return false;
			});
			subscriber.add(function() {
				buffers = completed = null;
			});
			var _loop_1 = function(sourceIndex$1) {
				innerFrom_1$26.innerFrom(sources[sourceIndex$1]).subscribe(OperatorSubscriber_1$47.createOperatorSubscriber(subscriber, function(value) {
					buffers[sourceIndex$1].push(value);
					if (buffers.every(function(buffer$1) {
						return buffer$1.length;
					})) {
						var result = buffers.map(function(buffer$1) {
							return buffer$1.shift();
						});
						subscriber.next(resultSelector ? resultSelector.apply(void 0, __spreadArray$14([], __read$14(result))) : result);
						if (buffers.some(function(buffer$1, i) {
							return !buffer$1.length && completed[i];
						})) subscriber.complete();
					}
				}, function() {
					completed[sourceIndex$1] = true;
					!buffers[sourceIndex$1].length && subscriber.complete();
				}));
			};
			for (var sourceIndex = 0; !subscriber.closed && sourceIndex < sources.length; sourceIndex++) _loop_1(sourceIndex);
			return function() {
				buffers = completed = null;
			};
		}) : empty_1$4.EMPTY;
	}
	exports.zip = zip$1;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/types.js
var require_types = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/audit.js
var require_audit = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.audit = void 0;
	var lift_1$61 = require_lift();
	var innerFrom_1$25 = require_innerFrom();
	var OperatorSubscriber_1$46 = require_OperatorSubscriber();
	function audit(durationSelector) {
		return lift_1$61.operate(function(source, subscriber) {
			var hasValue = false;
			var lastValue = null;
			var durationSubscriber = null;
			var isComplete = false;
			var endDuration = function() {
				durationSubscriber === null || durationSubscriber === void 0 || durationSubscriber.unsubscribe();
				durationSubscriber = null;
				if (hasValue) {
					hasValue = false;
					var value = lastValue;
					lastValue = null;
					subscriber.next(value);
				}
				isComplete && subscriber.complete();
			};
			var cleanupDuration = function() {
				durationSubscriber = null;
				isComplete && subscriber.complete();
			};
			source.subscribe(OperatorSubscriber_1$46.createOperatorSubscriber(subscriber, function(value) {
				hasValue = true;
				lastValue = value;
				if (!durationSubscriber) innerFrom_1$25.innerFrom(durationSelector(value)).subscribe(durationSubscriber = OperatorSubscriber_1$46.createOperatorSubscriber(subscriber, endDuration, cleanupDuration));
			}, function() {
				isComplete = true;
				(!hasValue || !durationSubscriber || durationSubscriber.closed) && subscriber.complete();
			}));
		});
	}
	exports.audit = audit;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/auditTime.js
var require_auditTime = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.auditTime = void 0;
	var async_1$9 = require_async();
	var audit_1$2 = require_audit();
	var timer_1$5 = require_timer();
	function auditTime$1(duration, scheduler) {
		if (scheduler === void 0) scheduler = async_1$9.asyncScheduler;
		return audit_1$2.audit(function() {
			return timer_1$5.timer(duration, scheduler);
		});
	}
	exports.auditTime = auditTime$1;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/buffer.js
var require_buffer = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.buffer = void 0;
	var lift_1$60 = require_lift();
	var noop_1$12 = require_noop();
	var OperatorSubscriber_1$45 = require_OperatorSubscriber();
	var innerFrom_1$24 = require_innerFrom();
	function buffer(closingNotifier) {
		return lift_1$60.operate(function(source, subscriber) {
			var currentBuffer = [];
			source.subscribe(OperatorSubscriber_1$45.createOperatorSubscriber(subscriber, function(value) {
				return currentBuffer.push(value);
			}, function() {
				subscriber.next(currentBuffer);
				subscriber.complete();
			}));
			innerFrom_1$24.innerFrom(closingNotifier).subscribe(OperatorSubscriber_1$45.createOperatorSubscriber(subscriber, function() {
				var b = currentBuffer;
				currentBuffer = [];
				subscriber.next(b);
			}, noop_1$12.noop));
			return function() {
				currentBuffer = null;
			};
		});
	}
	exports.buffer = buffer;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/bufferCount.js
var require_bufferCount = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __values$5 = exports && exports.__values || function(o) {
		var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
		if (m) return m.call(o);
		if (o && typeof o.length === "number") return { next: function() {
			if (o && i >= o.length) o = void 0;
			return {
				value: o && o[i++],
				done: !o
			};
		} };
		throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.bufferCount = void 0;
	var lift_1$59 = require_lift();
	var OperatorSubscriber_1$44 = require_OperatorSubscriber();
	var arrRemove_1$4 = require_arrRemove();
	function bufferCount(bufferSize, startBufferEvery) {
		if (startBufferEvery === void 0) startBufferEvery = null;
		startBufferEvery = startBufferEvery !== null && startBufferEvery !== void 0 ? startBufferEvery : bufferSize;
		return lift_1$59.operate(function(source, subscriber) {
			var buffers = [];
			var count$1 = 0;
			source.subscribe(OperatorSubscriber_1$44.createOperatorSubscriber(subscriber, function(value) {
				var e_1, _a, e_2, _b;
				var toEmit = null;
				if (count$1++ % startBufferEvery === 0) buffers.push([]);
				try {
					for (var buffers_1 = __values$5(buffers), buffers_1_1 = buffers_1.next(); !buffers_1_1.done; buffers_1_1 = buffers_1.next()) {
						var buffer$1 = buffers_1_1.value;
						buffer$1.push(value);
						if (bufferSize <= buffer$1.length) {
							toEmit = toEmit !== null && toEmit !== void 0 ? toEmit : [];
							toEmit.push(buffer$1);
						}
					}
				} catch (e_1_1) {
					e_1 = { error: e_1_1 };
				} finally {
					try {
						if (buffers_1_1 && !buffers_1_1.done && (_a = buffers_1.return)) _a.call(buffers_1);
					} finally {
						if (e_1) throw e_1.error;
					}
				}
				if (toEmit) try {
					for (var toEmit_1 = __values$5(toEmit), toEmit_1_1 = toEmit_1.next(); !toEmit_1_1.done; toEmit_1_1 = toEmit_1.next()) {
						var buffer$1 = toEmit_1_1.value;
						arrRemove_1$4.arrRemove(buffers, buffer$1);
						subscriber.next(buffer$1);
					}
				} catch (e_2_1) {
					e_2 = { error: e_2_1 };
				} finally {
					try {
						if (toEmit_1_1 && !toEmit_1_1.done && (_b = toEmit_1.return)) _b.call(toEmit_1);
					} finally {
						if (e_2) throw e_2.error;
					}
				}
			}, function() {
				var e_3, _a;
				try {
					for (var buffers_2 = __values$5(buffers), buffers_2_1 = buffers_2.next(); !buffers_2_1.done; buffers_2_1 = buffers_2.next()) {
						var buffer$1 = buffers_2_1.value;
						subscriber.next(buffer$1);
					}
				} catch (e_3_1) {
					e_3 = { error: e_3_1 };
				} finally {
					try {
						if (buffers_2_1 && !buffers_2_1.done && (_a = buffers_2.return)) _a.call(buffers_2);
					} finally {
						if (e_3) throw e_3.error;
					}
				}
				subscriber.complete();
			}, void 0, function() {
				buffers = null;
			}));
		});
	}
	exports.bufferCount = bufferCount;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/bufferTime.js
var require_bufferTime = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __values$4 = exports && exports.__values || function(o) {
		var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
		if (m) return m.call(o);
		if (o && typeof o.length === "number") return { next: function() {
			if (o && i >= o.length) o = void 0;
			return {
				value: o && o[i++],
				done: !o
			};
		} };
		throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.bufferTime = void 0;
	var Subscription_1$4 = require_Subscription();
	var lift_1$58 = require_lift();
	var OperatorSubscriber_1$43 = require_OperatorSubscriber();
	var arrRemove_1$3 = require_arrRemove();
	var async_1$8 = require_async();
	var args_1$6 = require_args();
	var executeSchedule_1$1 = require_executeSchedule();
	function bufferTime(bufferTimeSpan) {
		var _a, _b;
		var otherArgs = [];
		for (var _i = 1; _i < arguments.length; _i++) otherArgs[_i - 1] = arguments[_i];
		var scheduler = (_a = args_1$6.popScheduler(otherArgs)) !== null && _a !== void 0 ? _a : async_1$8.asyncScheduler;
		var bufferCreationInterval = (_b = otherArgs[0]) !== null && _b !== void 0 ? _b : null;
		var maxBufferSize = otherArgs[1] || Infinity;
		return lift_1$58.operate(function(source, subscriber) {
			var bufferRecords = [];
			var restartOnEmit = false;
			var emit = function(record) {
				var buffer$1 = record.buffer;
				record.subs.unsubscribe();
				arrRemove_1$3.arrRemove(bufferRecords, record);
				subscriber.next(buffer$1);
				restartOnEmit && startBuffer();
			};
			var startBuffer = function() {
				if (bufferRecords) {
					var subs = new Subscription_1$4.Subscription();
					subscriber.add(subs);
					var record_1 = {
						buffer: [],
						subs
					};
					bufferRecords.push(record_1);
					executeSchedule_1$1.executeSchedule(subs, scheduler, function() {
						return emit(record_1);
					}, bufferTimeSpan);
				}
			};
			if (bufferCreationInterval !== null && bufferCreationInterval >= 0) executeSchedule_1$1.executeSchedule(subscriber, scheduler, startBuffer, bufferCreationInterval, true);
			else restartOnEmit = true;
			startBuffer();
			var bufferTimeSubscriber = OperatorSubscriber_1$43.createOperatorSubscriber(subscriber, function(value) {
				var e_1, _a$1;
				var recordsCopy = bufferRecords.slice();
				try {
					for (var recordsCopy_1 = __values$4(recordsCopy), recordsCopy_1_1 = recordsCopy_1.next(); !recordsCopy_1_1.done; recordsCopy_1_1 = recordsCopy_1.next()) {
						var record = recordsCopy_1_1.value;
						var buffer$1 = record.buffer;
						buffer$1.push(value);
						maxBufferSize <= buffer$1.length && emit(record);
					}
				} catch (e_1_1) {
					e_1 = { error: e_1_1 };
				} finally {
					try {
						if (recordsCopy_1_1 && !recordsCopy_1_1.done && (_a$1 = recordsCopy_1.return)) _a$1.call(recordsCopy_1);
					} finally {
						if (e_1) throw e_1.error;
					}
				}
			}, function() {
				while (bufferRecords === null || bufferRecords === void 0 ? void 0 : bufferRecords.length) subscriber.next(bufferRecords.shift().buffer);
				bufferTimeSubscriber === null || bufferTimeSubscriber === void 0 || bufferTimeSubscriber.unsubscribe();
				subscriber.complete();
				subscriber.unsubscribe();
			}, void 0, function() {
				return bufferRecords = null;
			});
			source.subscribe(bufferTimeSubscriber);
		});
	}
	exports.bufferTime = bufferTime;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/bufferToggle.js
var require_bufferToggle = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __values$3 = exports && exports.__values || function(o) {
		var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
		if (m) return m.call(o);
		if (o && typeof o.length === "number") return { next: function() {
			if (o && i >= o.length) o = void 0;
			return {
				value: o && o[i++],
				done: !o
			};
		} };
		throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.bufferToggle = void 0;
	var Subscription_1$3 = require_Subscription();
	var lift_1$57 = require_lift();
	var innerFrom_1$23 = require_innerFrom();
	var OperatorSubscriber_1$42 = require_OperatorSubscriber();
	var noop_1$11 = require_noop();
	var arrRemove_1$2 = require_arrRemove();
	function bufferToggle(openings, closingSelector) {
		return lift_1$57.operate(function(source, subscriber) {
			var buffers = [];
			innerFrom_1$23.innerFrom(openings).subscribe(OperatorSubscriber_1$42.createOperatorSubscriber(subscriber, function(openValue) {
				var buffer$1 = [];
				buffers.push(buffer$1);
				var closingSubscription = new Subscription_1$3.Subscription();
				var emitBuffer = function() {
					arrRemove_1$2.arrRemove(buffers, buffer$1);
					subscriber.next(buffer$1);
					closingSubscription.unsubscribe();
				};
				closingSubscription.add(innerFrom_1$23.innerFrom(closingSelector(openValue)).subscribe(OperatorSubscriber_1$42.createOperatorSubscriber(subscriber, emitBuffer, noop_1$11.noop)));
			}, noop_1$11.noop));
			source.subscribe(OperatorSubscriber_1$42.createOperatorSubscriber(subscriber, function(value) {
				var e_1, _a;
				try {
					for (var buffers_1 = __values$3(buffers), buffers_1_1 = buffers_1.next(); !buffers_1_1.done; buffers_1_1 = buffers_1.next()) buffers_1_1.value.push(value);
				} catch (e_1_1) {
					e_1 = { error: e_1_1 };
				} finally {
					try {
						if (buffers_1_1 && !buffers_1_1.done && (_a = buffers_1.return)) _a.call(buffers_1);
					} finally {
						if (e_1) throw e_1.error;
					}
				}
			}, function() {
				while (buffers.length > 0) subscriber.next(buffers.shift());
				subscriber.complete();
			}));
		});
	}
	exports.bufferToggle = bufferToggle;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/bufferWhen.js
var require_bufferWhen = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.bufferWhen = void 0;
	var lift_1$56 = require_lift();
	var noop_1$10 = require_noop();
	var OperatorSubscriber_1$41 = require_OperatorSubscriber();
	var innerFrom_1$22 = require_innerFrom();
	function bufferWhen(closingSelector) {
		return lift_1$56.operate(function(source, subscriber) {
			var buffer$1 = null;
			var closingSubscriber = null;
			var openBuffer = function() {
				closingSubscriber === null || closingSubscriber === void 0 || closingSubscriber.unsubscribe();
				var b = buffer$1;
				buffer$1 = [];
				b && subscriber.next(b);
				innerFrom_1$22.innerFrom(closingSelector()).subscribe(closingSubscriber = OperatorSubscriber_1$41.createOperatorSubscriber(subscriber, openBuffer, noop_1$10.noop));
			};
			openBuffer();
			source.subscribe(OperatorSubscriber_1$41.createOperatorSubscriber(subscriber, function(value) {
				return buffer$1 === null || buffer$1 === void 0 ? void 0 : buffer$1.push(value);
			}, function() {
				buffer$1 && subscriber.next(buffer$1);
				subscriber.complete();
			}, void 0, function() {
				return buffer$1 = closingSubscriber = null;
			}));
		});
	}
	exports.bufferWhen = bufferWhen;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/catchError.js
var require_catchError = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.catchError = void 0;
	var innerFrom_1$21 = require_innerFrom();
	var OperatorSubscriber_1$40 = require_OperatorSubscriber();
	var lift_1$55 = require_lift();
	function catchError$2(selector) {
		return lift_1$55.operate(function(source, subscriber) {
			var innerSub = null;
			var syncUnsub = false;
			var handledResult;
			innerSub = source.subscribe(OperatorSubscriber_1$40.createOperatorSubscriber(subscriber, void 0, void 0, function(err) {
				handledResult = innerFrom_1$21.innerFrom(selector(err, catchError$2(selector)(source)));
				if (innerSub) {
					innerSub.unsubscribe();
					innerSub = null;
					handledResult.subscribe(subscriber);
				} else syncUnsub = true;
			}));
			if (syncUnsub) {
				innerSub.unsubscribe();
				innerSub = null;
				handledResult.subscribe(subscriber);
			}
		});
	}
	exports.catchError = catchError$2;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/scanInternals.js
var require_scanInternals = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.scanInternals = void 0;
	var OperatorSubscriber_1$39 = require_OperatorSubscriber();
	function scanInternals(accumulator, seed, hasSeed, emitOnNext, emitBeforeComplete) {
		return function(source, subscriber) {
			var hasState = hasSeed;
			var state = seed;
			var index = 0;
			source.subscribe(OperatorSubscriber_1$39.createOperatorSubscriber(subscriber, function(value) {
				var i = index++;
				state = hasState ? accumulator(state, value, i) : (hasState = true, value);
				emitOnNext && subscriber.next(state);
			}, emitBeforeComplete && (function() {
				hasState && subscriber.next(state);
				subscriber.complete();
			})));
		};
	}
	exports.scanInternals = scanInternals;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/reduce.js
var require_reduce = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.reduce = void 0;
	var scanInternals_1$1 = require_scanInternals();
	var lift_1$54 = require_lift();
	function reduce(accumulator, seed) {
		return lift_1$54.operate(scanInternals_1$1.scanInternals(accumulator, seed, arguments.length >= 2, false, true));
	}
	exports.reduce = reduce;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/toArray.js
var require_toArray = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.toArray = void 0;
	var reduce_1$5 = require_reduce();
	var lift_1$53 = require_lift();
	var arrReducer = function(arr, value) {
		return arr.push(value), arr;
	};
	function toArray() {
		return lift_1$53.operate(function(source, subscriber) {
			reduce_1$5.reduce(arrReducer, [])(source).subscribe(subscriber);
		});
	}
	exports.toArray = toArray;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/joinAllInternals.js
var require_joinAllInternals = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.joinAllInternals = void 0;
	var identity_1$11 = require_identity();
	var mapOneOrManyArgs_1$1 = require_mapOneOrManyArgs();
	var pipe_1$2 = require_pipe();
	var mergeMap_1$6 = require_mergeMap();
	var toArray_1$2 = require_toArray();
	function joinAllInternals(joinFn, project) {
		return pipe_1$2.pipe(toArray_1$2.toArray(), mergeMap_1$6.mergeMap(function(sources) {
			return joinFn(sources);
		}), project ? mapOneOrManyArgs_1$1.mapOneOrManyArgs(project) : identity_1$11.identity);
	}
	exports.joinAllInternals = joinAllInternals;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/combineLatestAll.js
var require_combineLatestAll = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.combineLatestAll = void 0;
	var combineLatest_1$4 = require_combineLatest$1();
	var joinAllInternals_1$1 = require_joinAllInternals();
	function combineLatestAll(project) {
		return joinAllInternals_1$1.joinAllInternals(combineLatest_1$4.combineLatest, project);
	}
	exports.combineLatestAll = combineLatestAll;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/combineAll.js
var require_combineAll = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.combineAll = void 0;
	var combineLatestAll_1$2 = require_combineLatestAll();
	exports.combineAll = combineLatestAll_1$2.combineLatestAll;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/combineLatest.js
var require_combineLatest = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __read$13 = exports && exports.__read || function(o, n) {
		var m = typeof Symbol === "function" && o[Symbol.iterator];
		if (!m) return o;
		var i = m.call(o), r, ar = [], e;
		try {
			while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
		} catch (error) {
			e = { error };
		} finally {
			try {
				if (r && !r.done && (m = i["return"])) m.call(i);
			} finally {
				if (e) throw e.error;
			}
		}
		return ar;
	};
	var __spreadArray$13 = exports && exports.__spreadArray || function(to, from$7) {
		for (var i = 0, il = from$7.length, j = to.length; i < il; i++, j++) to[j] = from$7[i];
		return to;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.combineLatest = void 0;
	var combineLatest_1$3 = require_combineLatest$1();
	var lift_1$52 = require_lift();
	var argsOrArgArray_1$2 = require_argsOrArgArray();
	var mapOneOrManyArgs_1 = require_mapOneOrManyArgs();
	var pipe_1$1 = require_pipe();
	var args_1$5 = require_args();
	function combineLatest$1() {
		var args = [];
		for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
		var resultSelector = args_1$5.popResultSelector(args);
		return resultSelector ? pipe_1$1.pipe(combineLatest$1.apply(void 0, __spreadArray$13([], __read$13(args))), mapOneOrManyArgs_1.mapOneOrManyArgs(resultSelector)) : lift_1$52.operate(function(source, subscriber) {
			combineLatest_1$3.combineLatestInit(__spreadArray$13([source], __read$13(argsOrArgArray_1$2.argsOrArgArray(args))))(subscriber);
		});
	}
	exports.combineLatest = combineLatest$1;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/combineLatestWith.js
var require_combineLatestWith = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __read$12 = exports && exports.__read || function(o, n) {
		var m = typeof Symbol === "function" && o[Symbol.iterator];
		if (!m) return o;
		var i = m.call(o), r, ar = [], e;
		try {
			while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
		} catch (error) {
			e = { error };
		} finally {
			try {
				if (r && !r.done && (m = i["return"])) m.call(i);
			} finally {
				if (e) throw e.error;
			}
		}
		return ar;
	};
	var __spreadArray$12 = exports && exports.__spreadArray || function(to, from$7) {
		for (var i = 0, il = from$7.length, j = to.length; i < il; i++, j++) to[j] = from$7[i];
		return to;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.combineLatestWith = void 0;
	var combineLatest_1$2 = require_combineLatest();
	function combineLatestWith() {
		var otherSources = [];
		for (var _i = 0; _i < arguments.length; _i++) otherSources[_i] = arguments[_i];
		return combineLatest_1$2.combineLatest.apply(void 0, __spreadArray$12([], __read$12(otherSources)));
	}
	exports.combineLatestWith = combineLatestWith;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/concatMap.js
var require_concatMap = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.concatMap = void 0;
	var mergeMap_1$5 = require_mergeMap();
	var isFunction_1$8 = require_isFunction();
	function concatMap(project, resultSelector) {
		return isFunction_1$8.isFunction(resultSelector) ? mergeMap_1$5.mergeMap(project, resultSelector, 1) : mergeMap_1$5.mergeMap(project, 1);
	}
	exports.concatMap = concatMap;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/concatMapTo.js
var require_concatMapTo = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.concatMapTo = void 0;
	var concatMap_1$2 = require_concatMap();
	var isFunction_1$7 = require_isFunction();
	function concatMapTo(innerObservable, resultSelector) {
		return isFunction_1$7.isFunction(resultSelector) ? concatMap_1$2.concatMap(function() {
			return innerObservable;
		}, resultSelector) : concatMap_1$2.concatMap(function() {
			return innerObservable;
		});
	}
	exports.concatMapTo = concatMapTo;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/concat.js
var require_concat = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __read$11 = exports && exports.__read || function(o, n) {
		var m = typeof Symbol === "function" && o[Symbol.iterator];
		if (!m) return o;
		var i = m.call(o), r, ar = [], e;
		try {
			while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
		} catch (error) {
			e = { error };
		} finally {
			try {
				if (r && !r.done && (m = i["return"])) m.call(i);
			} finally {
				if (e) throw e.error;
			}
		}
		return ar;
	};
	var __spreadArray$11 = exports && exports.__spreadArray || function(to, from$7) {
		for (var i = 0, il = from$7.length, j = to.length; i < il; i++, j++) to[j] = from$7[i];
		return to;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.concat = void 0;
	var lift_1$51 = require_lift();
	var concatAll_1$2 = require_concatAll();
	var args_1$4 = require_args();
	var from_1$2 = require_from();
	function concat() {
		var args = [];
		for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
		var scheduler = args_1$4.popScheduler(args);
		return lift_1$51.operate(function(source, subscriber) {
			concatAll_1$2.concatAll()(from_1$2.from(__spreadArray$11([source], __read$11(args)), scheduler)).subscribe(subscriber);
		});
	}
	exports.concat = concat;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/concatWith.js
var require_concatWith = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __read$10 = exports && exports.__read || function(o, n) {
		var m = typeof Symbol === "function" && o[Symbol.iterator];
		if (!m) return o;
		var i = m.call(o), r, ar = [], e;
		try {
			while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
		} catch (error) {
			e = { error };
		} finally {
			try {
				if (r && !r.done && (m = i["return"])) m.call(i);
			} finally {
				if (e) throw e.error;
			}
		}
		return ar;
	};
	var __spreadArray$10 = exports && exports.__spreadArray || function(to, from$7) {
		for (var i = 0, il = from$7.length, j = to.length; i < il; i++, j++) to[j] = from$7[i];
		return to;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.concatWith = void 0;
	var concat_1$5 = require_concat();
	function concatWith() {
		var otherSources = [];
		for (var _i = 0; _i < arguments.length; _i++) otherSources[_i] = arguments[_i];
		return concat_1$5.concat.apply(void 0, __spreadArray$10([], __read$10(otherSources)));
	}
	exports.concatWith = concatWith;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/observable/fromSubscribable.js
var require_fromSubscribable = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.fromSubscribable = void 0;
	var Observable_1$2 = require_Observable();
	function fromSubscribable(subscribable) {
		return new Observable_1$2.Observable(function(subscriber) {
			return subscribable.subscribe(subscriber);
		});
	}
	exports.fromSubscribable = fromSubscribable;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/connect.js
var require_connect = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.connect = void 0;
	var Subject_1$11 = require_Subject();
	var innerFrom_1$20 = require_innerFrom();
	var lift_1$50 = require_lift();
	var fromSubscribable_1 = require_fromSubscribable();
	var DEFAULT_CONFIG = { connector: function() {
		return new Subject_1$11.Subject();
	} };
	function connect(selector, config) {
		if (config === void 0) config = DEFAULT_CONFIG;
		var connector = config.connector;
		return lift_1$50.operate(function(source, subscriber) {
			var subject = connector();
			innerFrom_1$20.innerFrom(selector(fromSubscribable_1.fromSubscribable(subject))).subscribe(subscriber);
			subscriber.add(source.subscribe(subject));
		});
	}
	exports.connect = connect;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/count.js
var require_count = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.count = void 0;
	var reduce_1$4 = require_reduce();
	function count(predicate) {
		return reduce_1$4.reduce(function(total, value, i) {
			return !predicate || predicate(value, i) ? total + 1 : total;
		}, 0);
	}
	exports.count = count;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/debounce.js
var require_debounce = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.debounce = void 0;
	var lift_1$49 = require_lift();
	var noop_1$9 = require_noop();
	var OperatorSubscriber_1$38 = require_OperatorSubscriber();
	var innerFrom_1$19 = require_innerFrom();
	function debounce(durationSelector) {
		return lift_1$49.operate(function(source, subscriber) {
			var hasValue = false;
			var lastValue = null;
			var durationSubscriber = null;
			var emit = function() {
				durationSubscriber === null || durationSubscriber === void 0 || durationSubscriber.unsubscribe();
				durationSubscriber = null;
				if (hasValue) {
					hasValue = false;
					var value = lastValue;
					lastValue = null;
					subscriber.next(value);
				}
			};
			source.subscribe(OperatorSubscriber_1$38.createOperatorSubscriber(subscriber, function(value) {
				durationSubscriber === null || durationSubscriber === void 0 || durationSubscriber.unsubscribe();
				hasValue = true;
				lastValue = value;
				durationSubscriber = OperatorSubscriber_1$38.createOperatorSubscriber(subscriber, emit, noop_1$9.noop);
				innerFrom_1$19.innerFrom(durationSelector(value)).subscribe(durationSubscriber);
			}, function() {
				emit();
				subscriber.complete();
			}, void 0, function() {
				lastValue = durationSubscriber = null;
			}));
		});
	}
	exports.debounce = debounce;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/debounceTime.js
var require_debounceTime = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.debounceTime = void 0;
	var async_1$7 = require_async();
	var lift_1$48 = require_lift();
	var OperatorSubscriber_1$37 = require_OperatorSubscriber();
	function debounceTime$1(dueTime, scheduler) {
		if (scheduler === void 0) scheduler = async_1$7.asyncScheduler;
		return lift_1$48.operate(function(source, subscriber) {
			var activeTask = null;
			var lastValue = null;
			var lastTime = null;
			var emit = function() {
				if (activeTask) {
					activeTask.unsubscribe();
					activeTask = null;
					var value = lastValue;
					lastValue = null;
					subscriber.next(value);
				}
			};
			function emitWhenIdle() {
				var targetTime = lastTime + dueTime;
				var now = scheduler.now();
				if (now < targetTime) {
					activeTask = this.schedule(void 0, targetTime - now);
					subscriber.add(activeTask);
					return;
				}
				emit();
			}
			source.subscribe(OperatorSubscriber_1$37.createOperatorSubscriber(subscriber, function(value) {
				lastValue = value;
				lastTime = scheduler.now();
				if (!activeTask) {
					activeTask = scheduler.schedule(emitWhenIdle, dueTime);
					subscriber.add(activeTask);
				}
			}, function() {
				emit();
				subscriber.complete();
			}, void 0, function() {
				lastValue = activeTask = null;
			}));
		});
	}
	exports.debounceTime = debounceTime$1;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/defaultIfEmpty.js
var require_defaultIfEmpty = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.defaultIfEmpty = void 0;
	var lift_1$47 = require_lift();
	var OperatorSubscriber_1$36 = require_OperatorSubscriber();
	function defaultIfEmpty(defaultValue) {
		return lift_1$47.operate(function(source, subscriber) {
			var hasValue = false;
			source.subscribe(OperatorSubscriber_1$36.createOperatorSubscriber(subscriber, function(value) {
				hasValue = true;
				subscriber.next(value);
			}, function() {
				if (!hasValue) subscriber.next(defaultValue);
				subscriber.complete();
			}));
		});
	}
	exports.defaultIfEmpty = defaultIfEmpty;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/take.js
var require_take = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.take = void 0;
	var empty_1$3 = require_empty();
	var lift_1$46 = require_lift();
	var OperatorSubscriber_1$35 = require_OperatorSubscriber();
	function take$5(count$1) {
		return count$1 <= 0 ? function() {
			return empty_1$3.EMPTY;
		} : lift_1$46.operate(function(source, subscriber) {
			var seen = 0;
			source.subscribe(OperatorSubscriber_1$35.createOperatorSubscriber(subscriber, function(value) {
				if (++seen <= count$1) {
					subscriber.next(value);
					if (count$1 <= seen) subscriber.complete();
				}
			}));
		});
	}
	exports.take = take$5;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/ignoreElements.js
var require_ignoreElements = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ignoreElements = void 0;
	var lift_1$45 = require_lift();
	var OperatorSubscriber_1$34 = require_OperatorSubscriber();
	var noop_1$8 = require_noop();
	function ignoreElements() {
		return lift_1$45.operate(function(source, subscriber) {
			source.subscribe(OperatorSubscriber_1$34.createOperatorSubscriber(subscriber, noop_1$8.noop));
		});
	}
	exports.ignoreElements = ignoreElements;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/mapTo.js
var require_mapTo = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.mapTo = void 0;
	var map_1$5 = require_map();
	function mapTo(value) {
		return map_1$5.map(function() {
			return value;
		});
	}
	exports.mapTo = mapTo;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/delayWhen.js
var require_delayWhen = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.delayWhen = void 0;
	var concat_1$4 = require_concat$1();
	var take_1$4 = require_take();
	var ignoreElements_1$2 = require_ignoreElements();
	var mapTo_1$2 = require_mapTo();
	var mergeMap_1$4 = require_mergeMap();
	var innerFrom_1$18 = require_innerFrom();
	function delayWhen(delayDurationSelector, subscriptionDelay) {
		if (subscriptionDelay) return function(source) {
			return concat_1$4.concat(subscriptionDelay.pipe(take_1$4.take(1), ignoreElements_1$2.ignoreElements()), source.pipe(delayWhen(delayDurationSelector)));
		};
		return mergeMap_1$4.mergeMap(function(value, index) {
			return innerFrom_1$18.innerFrom(delayDurationSelector(value, index)).pipe(take_1$4.take(1), mapTo_1$2.mapTo(value));
		});
	}
	exports.delayWhen = delayWhen;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/delay.js
var require_delay = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.delay = void 0;
	var async_1$6 = require_async();
	var delayWhen_1$2 = require_delayWhen();
	var timer_1$4 = require_timer();
	function delay(due, scheduler) {
		if (scheduler === void 0) scheduler = async_1$6.asyncScheduler;
		var duration = timer_1$4.timer(due, scheduler);
		return delayWhen_1$2.delayWhen(function() {
			return duration;
		});
	}
	exports.delay = delay;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/dematerialize.js
var require_dematerialize = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.dematerialize = void 0;
	var Notification_1$2 = require_Notification();
	var lift_1$44 = require_lift();
	var OperatorSubscriber_1$33 = require_OperatorSubscriber();
	function dematerialize() {
		return lift_1$44.operate(function(source, subscriber) {
			source.subscribe(OperatorSubscriber_1$33.createOperatorSubscriber(subscriber, function(notification) {
				return Notification_1$2.observeNotification(notification, subscriber);
			}));
		});
	}
	exports.dematerialize = dematerialize;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/distinct.js
var require_distinct = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.distinct = void 0;
	var lift_1$43 = require_lift();
	var OperatorSubscriber_1$32 = require_OperatorSubscriber();
	var noop_1$7 = require_noop();
	var innerFrom_1$17 = require_innerFrom();
	function distinct(keySelector, flushes) {
		return lift_1$43.operate(function(source, subscriber) {
			var distinctKeys = /* @__PURE__ */ new Set();
			source.subscribe(OperatorSubscriber_1$32.createOperatorSubscriber(subscriber, function(value) {
				var key = keySelector ? keySelector(value) : value;
				if (!distinctKeys.has(key)) {
					distinctKeys.add(key);
					subscriber.next(value);
				}
			}));
			flushes && innerFrom_1$17.innerFrom(flushes).subscribe(OperatorSubscriber_1$32.createOperatorSubscriber(subscriber, function() {
				return distinctKeys.clear();
			}, noop_1$7.noop));
		});
	}
	exports.distinct = distinct;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/distinctUntilChanged.js
var require_distinctUntilChanged = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.distinctUntilChanged = void 0;
	var identity_1$10 = require_identity();
	var lift_1$42 = require_lift();
	var OperatorSubscriber_1$31 = require_OperatorSubscriber();
	function distinctUntilChanged$5(comparator, keySelector) {
		if (keySelector === void 0) keySelector = identity_1$10.identity;
		comparator = comparator !== null && comparator !== void 0 ? comparator : defaultCompare;
		return lift_1$42.operate(function(source, subscriber) {
			var previousKey;
			var first$1 = true;
			source.subscribe(OperatorSubscriber_1$31.createOperatorSubscriber(subscriber, function(value) {
				var currentKey = keySelector(value);
				if (first$1 || !comparator(previousKey, currentKey)) {
					first$1 = false;
					previousKey = currentKey;
					subscriber.next(value);
				}
			}));
		});
	}
	exports.distinctUntilChanged = distinctUntilChanged$5;
	function defaultCompare(a, b) {
		return a === b;
	}
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/distinctUntilKeyChanged.js
var require_distinctUntilKeyChanged = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.distinctUntilKeyChanged = void 0;
	var distinctUntilChanged_1$2 = require_distinctUntilChanged();
	function distinctUntilKeyChanged(key, compare) {
		return distinctUntilChanged_1$2.distinctUntilChanged(function(x, y) {
			return compare ? compare(x[key], y[key]) : x[key] === y[key];
		});
	}
	exports.distinctUntilKeyChanged = distinctUntilKeyChanged;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/throwIfEmpty.js
var require_throwIfEmpty = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.throwIfEmpty = void 0;
	var EmptyError_1$4 = require_EmptyError();
	var lift_1$41 = require_lift();
	var OperatorSubscriber_1$30 = require_OperatorSubscriber();
	function throwIfEmpty(errorFactory) {
		if (errorFactory === void 0) errorFactory = defaultErrorFactory;
		return lift_1$41.operate(function(source, subscriber) {
			var hasValue = false;
			source.subscribe(OperatorSubscriber_1$30.createOperatorSubscriber(subscriber, function(value) {
				hasValue = true;
				subscriber.next(value);
			}, function() {
				return hasValue ? subscriber.complete() : subscriber.error(errorFactory());
			}));
		});
	}
	exports.throwIfEmpty = throwIfEmpty;
	function defaultErrorFactory() {
		return new EmptyError_1$4.EmptyError();
	}
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/elementAt.js
var require_elementAt = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.elementAt = void 0;
	var ArgumentOutOfRangeError_1$1 = require_ArgumentOutOfRangeError();
	var filter_1$6 = require_filter();
	var throwIfEmpty_1$4 = require_throwIfEmpty();
	var defaultIfEmpty_1$4 = require_defaultIfEmpty();
	var take_1$3 = require_take();
	function elementAt(index, defaultValue) {
		if (index < 0) throw new ArgumentOutOfRangeError_1$1.ArgumentOutOfRangeError();
		var hasDefaultValue = arguments.length >= 2;
		return function(source) {
			return source.pipe(filter_1$6.filter(function(v, i) {
				return i === index;
			}), take_1$3.take(1), hasDefaultValue ? defaultIfEmpty_1$4.defaultIfEmpty(defaultValue) : throwIfEmpty_1$4.throwIfEmpty(function() {
				return new ArgumentOutOfRangeError_1$1.ArgumentOutOfRangeError();
			}));
		};
	}
	exports.elementAt = elementAt;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/endWith.js
var require_endWith = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __read$9 = exports && exports.__read || function(o, n) {
		var m = typeof Symbol === "function" && o[Symbol.iterator];
		if (!m) return o;
		var i = m.call(o), r, ar = [], e;
		try {
			while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
		} catch (error) {
			e = { error };
		} finally {
			try {
				if (r && !r.done && (m = i["return"])) m.call(i);
			} finally {
				if (e) throw e.error;
			}
		}
		return ar;
	};
	var __spreadArray$9 = exports && exports.__spreadArray || function(to, from$7) {
		for (var i = 0, il = from$7.length, j = to.length; i < il; i++, j++) to[j] = from$7[i];
		return to;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.endWith = void 0;
	var concat_1$3 = require_concat$1();
	var of_1$1 = require_of();
	function endWith() {
		var values = [];
		for (var _i = 0; _i < arguments.length; _i++) values[_i] = arguments[_i];
		return function(source) {
			return concat_1$3.concat(source, of_1$1.of.apply(void 0, __spreadArray$9([], __read$9(values))));
		};
	}
	exports.endWith = endWith;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/every.js
var require_every = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.every = void 0;
	var lift_1$40 = require_lift();
	var OperatorSubscriber_1$29 = require_OperatorSubscriber();
	function every(predicate, thisArg) {
		return lift_1$40.operate(function(source, subscriber) {
			var index = 0;
			source.subscribe(OperatorSubscriber_1$29.createOperatorSubscriber(subscriber, function(value) {
				if (!predicate.call(thisArg, value, index++, source)) {
					subscriber.next(false);
					subscriber.complete();
				}
			}, function() {
				subscriber.next(true);
				subscriber.complete();
			}));
		});
	}
	exports.every = every;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/exhaustMap.js
var require_exhaustMap = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.exhaustMap = void 0;
	var map_1$4 = require_map();
	var innerFrom_1$16 = require_innerFrom();
	var lift_1$39 = require_lift();
	var OperatorSubscriber_1$28 = require_OperatorSubscriber();
	function exhaustMap$1(project, resultSelector) {
		if (resultSelector) return function(source) {
			return source.pipe(exhaustMap$1(function(a, i) {
				return innerFrom_1$16.innerFrom(project(a, i)).pipe(map_1$4.map(function(b, ii) {
					return resultSelector(a, b, i, ii);
				}));
			}));
		};
		return lift_1$39.operate(function(source, subscriber) {
			var index = 0;
			var innerSub = null;
			var isComplete = false;
			source.subscribe(OperatorSubscriber_1$28.createOperatorSubscriber(subscriber, function(outerValue) {
				if (!innerSub) {
					innerSub = OperatorSubscriber_1$28.createOperatorSubscriber(subscriber, void 0, function() {
						innerSub = null;
						isComplete && subscriber.complete();
					});
					innerFrom_1$16.innerFrom(project(outerValue, index++)).subscribe(innerSub);
				}
			}, function() {
				isComplete = true;
				!innerSub && subscriber.complete();
			}));
		});
	}
	exports.exhaustMap = exhaustMap$1;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/exhaustAll.js
var require_exhaustAll = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.exhaustAll = void 0;
	var exhaustMap_1$2 = require_exhaustMap();
	var identity_1$9 = require_identity();
	function exhaustAll() {
		return exhaustMap_1$2.exhaustMap(identity_1$9.identity);
	}
	exports.exhaustAll = exhaustAll;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/exhaust.js
var require_exhaust = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.exhaust = void 0;
	var exhaustAll_1$2 = require_exhaustAll();
	exports.exhaust = exhaustAll_1$2.exhaustAll;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/expand.js
var require_expand = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.expand = void 0;
	var lift_1$38 = require_lift();
	var mergeInternals_1$1 = require_mergeInternals();
	function expand(project, concurrent, scheduler) {
		if (concurrent === void 0) concurrent = Infinity;
		concurrent = (concurrent || 0) < 1 ? Infinity : concurrent;
		return lift_1$38.operate(function(source, subscriber) {
			return mergeInternals_1$1.mergeInternals(source, subscriber, project, concurrent, void 0, true, scheduler);
		});
	}
	exports.expand = expand;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/finalize.js
var require_finalize = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.finalize = void 0;
	var lift_1$37 = require_lift();
	function finalize(callback) {
		return lift_1$37.operate(function(source, subscriber) {
			try {
				source.subscribe(subscriber);
			} finally {
				subscriber.add(callback);
			}
		});
	}
	exports.finalize = finalize;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/find.js
var require_find = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.createFind = exports.find = void 0;
	var lift_1$36 = require_lift();
	var OperatorSubscriber_1$27 = require_OperatorSubscriber();
	function find(predicate, thisArg) {
		return lift_1$36.operate(createFind(predicate, thisArg, "value"));
	}
	exports.find = find;
	function createFind(predicate, thisArg, emit) {
		var findIndex$1 = emit === "index";
		return function(source, subscriber) {
			var index = 0;
			source.subscribe(OperatorSubscriber_1$27.createOperatorSubscriber(subscriber, function(value) {
				var i = index++;
				if (predicate.call(thisArg, value, i, source)) {
					subscriber.next(findIndex$1 ? i : value);
					subscriber.complete();
				}
			}, function() {
				subscriber.next(findIndex$1 ? -1 : void 0);
				subscriber.complete();
			}));
		};
	}
	exports.createFind = createFind;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/findIndex.js
var require_findIndex = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.findIndex = void 0;
	var lift_1$35 = require_lift();
	var find_1$2 = require_find();
	function findIndex(predicate, thisArg) {
		return lift_1$35.operate(find_1$2.createFind(predicate, thisArg, "index"));
	}
	exports.findIndex = findIndex;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/first.js
var require_first = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.first = void 0;
	var EmptyError_1$3 = require_EmptyError();
	var filter_1$5 = require_filter();
	var take_1$2 = require_take();
	var defaultIfEmpty_1$3 = require_defaultIfEmpty();
	var throwIfEmpty_1$3 = require_throwIfEmpty();
	var identity_1$8 = require_identity();
	function first(predicate, defaultValue) {
		var hasDefaultValue = arguments.length >= 2;
		return function(source) {
			return source.pipe(predicate ? filter_1$5.filter(function(v, i) {
				return predicate(v, i, source);
			}) : identity_1$8.identity, take_1$2.take(1), hasDefaultValue ? defaultIfEmpty_1$3.defaultIfEmpty(defaultValue) : throwIfEmpty_1$3.throwIfEmpty(function() {
				return new EmptyError_1$3.EmptyError();
			}));
		};
	}
	exports.first = first;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/groupBy.js
var require_groupBy = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.groupBy = void 0;
	var Observable_1$1 = require_Observable();
	var innerFrom_1$15 = require_innerFrom();
	var Subject_1$10 = require_Subject();
	var lift_1$34 = require_lift();
	var OperatorSubscriber_1$26 = require_OperatorSubscriber();
	function groupBy(keySelector, elementOrOptions, duration, connector) {
		return lift_1$34.operate(function(source, subscriber) {
			var element;
			if (!elementOrOptions || typeof elementOrOptions === "function") element = elementOrOptions;
			else duration = elementOrOptions.duration, element = elementOrOptions.element, connector = elementOrOptions.connector;
			var groups = /* @__PURE__ */ new Map();
			var notify = function(cb) {
				groups.forEach(cb);
				cb(subscriber);
			};
			var handleError = function(err) {
				return notify(function(consumer) {
					return consumer.error(err);
				});
			};
			var activeGroups = 0;
			var teardownAttempted = false;
			var groupBySourceSubscriber = new OperatorSubscriber_1$26.OperatorSubscriber(subscriber, function(value) {
				try {
					var key_1 = keySelector(value);
					var group_1 = groups.get(key_1);
					if (!group_1) {
						groups.set(key_1, group_1 = connector ? connector() : new Subject_1$10.Subject());
						var grouped = createGroupedObservable(key_1, group_1);
						subscriber.next(grouped);
						if (duration) {
							var durationSubscriber_1 = OperatorSubscriber_1$26.createOperatorSubscriber(group_1, function() {
								group_1.complete();
								durationSubscriber_1 === null || durationSubscriber_1 === void 0 || durationSubscriber_1.unsubscribe();
							}, void 0, void 0, function() {
								return groups.delete(key_1);
							});
							groupBySourceSubscriber.add(innerFrom_1$15.innerFrom(duration(grouped)).subscribe(durationSubscriber_1));
						}
					}
					group_1.next(element ? element(value) : value);
				} catch (err) {
					handleError(err);
				}
			}, function() {
				return notify(function(consumer) {
					return consumer.complete();
				});
			}, handleError, function() {
				return groups.clear();
			}, function() {
				teardownAttempted = true;
				return activeGroups === 0;
			});
			source.subscribe(groupBySourceSubscriber);
			function createGroupedObservable(key, groupSubject) {
				var result = new Observable_1$1.Observable(function(groupSubscriber) {
					activeGroups++;
					var innerSub = groupSubject.subscribe(groupSubscriber);
					return function() {
						innerSub.unsubscribe();
						--activeGroups === 0 && teardownAttempted && groupBySourceSubscriber.unsubscribe();
					};
				});
				result.key = key;
				return result;
			}
		});
	}
	exports.groupBy = groupBy;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/isEmpty.js
var require_isEmpty = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isEmpty = void 0;
	var lift_1$33 = require_lift();
	var OperatorSubscriber_1$25 = require_OperatorSubscriber();
	function isEmpty() {
		return lift_1$33.operate(function(source, subscriber) {
			source.subscribe(OperatorSubscriber_1$25.createOperatorSubscriber(subscriber, function() {
				subscriber.next(false);
				subscriber.complete();
			}, function() {
				subscriber.next(true);
				subscriber.complete();
			}));
		});
	}
	exports.isEmpty = isEmpty;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/takeLast.js
var require_takeLast = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __values$2 = exports && exports.__values || function(o) {
		var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
		if (m) return m.call(o);
		if (o && typeof o.length === "number") return { next: function() {
			if (o && i >= o.length) o = void 0;
			return {
				value: o && o[i++],
				done: !o
			};
		} };
		throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.takeLast = void 0;
	var empty_1$2 = require_empty();
	var lift_1$32 = require_lift();
	var OperatorSubscriber_1$24 = require_OperatorSubscriber();
	function takeLast(count$1) {
		return count$1 <= 0 ? function() {
			return empty_1$2.EMPTY;
		} : lift_1$32.operate(function(source, subscriber) {
			var buffer$1 = [];
			source.subscribe(OperatorSubscriber_1$24.createOperatorSubscriber(subscriber, function(value) {
				buffer$1.push(value);
				count$1 < buffer$1.length && buffer$1.shift();
			}, function() {
				var e_1, _a;
				try {
					for (var buffer_1$2 = __values$2(buffer$1), buffer_1_1 = buffer_1$2.next(); !buffer_1_1.done; buffer_1_1 = buffer_1$2.next()) {
						var value = buffer_1_1.value;
						subscriber.next(value);
					}
				} catch (e_1_1) {
					e_1 = { error: e_1_1 };
				} finally {
					try {
						if (buffer_1_1 && !buffer_1_1.done && (_a = buffer_1$2.return)) _a.call(buffer_1$2);
					} finally {
						if (e_1) throw e_1.error;
					}
				}
				subscriber.complete();
			}, void 0, function() {
				buffer$1 = null;
			}));
		});
	}
	exports.takeLast = takeLast;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/last.js
var require_last = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.last = void 0;
	var EmptyError_1$2 = require_EmptyError();
	var filter_1$4 = require_filter();
	var takeLast_1$2 = require_takeLast();
	var throwIfEmpty_1$2 = require_throwIfEmpty();
	var defaultIfEmpty_1$2 = require_defaultIfEmpty();
	var identity_1$7 = require_identity();
	function last(predicate, defaultValue) {
		var hasDefaultValue = arguments.length >= 2;
		return function(source) {
			return source.pipe(predicate ? filter_1$4.filter(function(v, i) {
				return predicate(v, i, source);
			}) : identity_1$7.identity, takeLast_1$2.takeLast(1), hasDefaultValue ? defaultIfEmpty_1$2.defaultIfEmpty(defaultValue) : throwIfEmpty_1$2.throwIfEmpty(function() {
				return new EmptyError_1$2.EmptyError();
			}));
		};
	}
	exports.last = last;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/materialize.js
var require_materialize = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.materialize = void 0;
	var Notification_1$1 = require_Notification();
	var lift_1$31 = require_lift();
	var OperatorSubscriber_1$23 = require_OperatorSubscriber();
	function materialize() {
		return lift_1$31.operate(function(source, subscriber) {
			source.subscribe(OperatorSubscriber_1$23.createOperatorSubscriber(subscriber, function(value) {
				subscriber.next(Notification_1$1.Notification.createNext(value));
			}, function() {
				subscriber.next(Notification_1$1.Notification.createComplete());
				subscriber.complete();
			}, function(err) {
				subscriber.next(Notification_1$1.Notification.createError(err));
				subscriber.complete();
			}));
		});
	}
	exports.materialize = materialize;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/max.js
var require_max = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.max = void 0;
	var reduce_1$3 = require_reduce();
	var isFunction_1$6 = require_isFunction();
	function max(comparer) {
		return reduce_1$3.reduce(isFunction_1$6.isFunction(comparer) ? function(x, y) {
			return comparer(x, y) > 0 ? x : y;
		} : function(x, y) {
			return x > y ? x : y;
		});
	}
	exports.max = max;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/flatMap.js
var require_flatMap = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.flatMap = void 0;
	var mergeMap_1$3 = require_mergeMap();
	exports.flatMap = mergeMap_1$3.mergeMap;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/mergeMapTo.js
var require_mergeMapTo = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.mergeMapTo = void 0;
	var mergeMap_1$2 = require_mergeMap();
	var isFunction_1$5 = require_isFunction();
	function mergeMapTo(innerObservable, resultSelector, concurrent) {
		if (concurrent === void 0) concurrent = Infinity;
		if (isFunction_1$5.isFunction(resultSelector)) return mergeMap_1$2.mergeMap(function() {
			return innerObservable;
		}, resultSelector, concurrent);
		if (typeof resultSelector === "number") concurrent = resultSelector;
		return mergeMap_1$2.mergeMap(function() {
			return innerObservable;
		}, concurrent);
	}
	exports.mergeMapTo = mergeMapTo;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/mergeScan.js
var require_mergeScan = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.mergeScan = void 0;
	var lift_1$30 = require_lift();
	var mergeInternals_1 = require_mergeInternals();
	function mergeScan(accumulator, seed, concurrent) {
		if (concurrent === void 0) concurrent = Infinity;
		return lift_1$30.operate(function(source, subscriber) {
			var state = seed;
			return mergeInternals_1.mergeInternals(source, subscriber, function(value, index) {
				return accumulator(state, value, index);
			}, concurrent, function(value) {
				state = value;
			}, false, void 0, function() {
				return state = null;
			});
		});
	}
	exports.mergeScan = mergeScan;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/merge.js
var require_merge = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __read$8 = exports && exports.__read || function(o, n) {
		var m = typeof Symbol === "function" && o[Symbol.iterator];
		if (!m) return o;
		var i = m.call(o), r, ar = [], e;
		try {
			while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
		} catch (error) {
			e = { error };
		} finally {
			try {
				if (r && !r.done && (m = i["return"])) m.call(i);
			} finally {
				if (e) throw e.error;
			}
		}
		return ar;
	};
	var __spreadArray$8 = exports && exports.__spreadArray || function(to, from$7) {
		for (var i = 0, il = from$7.length, j = to.length; i < il; i++, j++) to[j] = from$7[i];
		return to;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.merge = void 0;
	var lift_1$29 = require_lift();
	var mergeAll_1$2 = require_mergeAll();
	var args_1$3 = require_args();
	var from_1$1 = require_from();
	function merge$5() {
		var args = [];
		for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
		var scheduler = args_1$3.popScheduler(args);
		var concurrent = args_1$3.popNumber(args, Infinity);
		return lift_1$29.operate(function(source, subscriber) {
			mergeAll_1$2.mergeAll(concurrent)(from_1$1.from(__spreadArray$8([source], __read$8(args)), scheduler)).subscribe(subscriber);
		});
	}
	exports.merge = merge$5;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/mergeWith.js
var require_mergeWith = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __read$7 = exports && exports.__read || function(o, n) {
		var m = typeof Symbol === "function" && o[Symbol.iterator];
		if (!m) return o;
		var i = m.call(o), r, ar = [], e;
		try {
			while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
		} catch (error) {
			e = { error };
		} finally {
			try {
				if (r && !r.done && (m = i["return"])) m.call(i);
			} finally {
				if (e) throw e.error;
			}
		}
		return ar;
	};
	var __spreadArray$7 = exports && exports.__spreadArray || function(to, from$7) {
		for (var i = 0, il = from$7.length, j = to.length; i < il; i++, j++) to[j] = from$7[i];
		return to;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.mergeWith = void 0;
	var merge_1$2 = require_merge();
	function mergeWith() {
		var otherSources = [];
		for (var _i = 0; _i < arguments.length; _i++) otherSources[_i] = arguments[_i];
		return merge_1$2.merge.apply(void 0, __spreadArray$7([], __read$7(otherSources)));
	}
	exports.mergeWith = mergeWith;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/min.js
var require_min = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.min = void 0;
	var reduce_1$2 = require_reduce();
	var isFunction_1$4 = require_isFunction();
	function min(comparer) {
		return reduce_1$2.reduce(isFunction_1$4.isFunction(comparer) ? function(x, y) {
			return comparer(x, y) < 0 ? x : y;
		} : function(x, y) {
			return x < y ? x : y;
		});
	}
	exports.min = min;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/multicast.js
var require_multicast = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.multicast = void 0;
	var ConnectableObservable_1$3 = require_ConnectableObservable();
	var isFunction_1$3 = require_isFunction();
	var connect_1$3 = require_connect();
	function multicast(subjectOrSubjectFactory, selector) {
		var subjectFactory = isFunction_1$3.isFunction(subjectOrSubjectFactory) ? subjectOrSubjectFactory : function() {
			return subjectOrSubjectFactory;
		};
		if (isFunction_1$3.isFunction(selector)) return connect_1$3.connect(selector, { connector: subjectFactory });
		return function(source) {
			return new ConnectableObservable_1$3.ConnectableObservable(source, subjectFactory);
		};
	}
	exports.multicast = multicast;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/onErrorResumeNextWith.js
var require_onErrorResumeNextWith = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __read$6 = exports && exports.__read || function(o, n) {
		var m = typeof Symbol === "function" && o[Symbol.iterator];
		if (!m) return o;
		var i = m.call(o), r, ar = [], e;
		try {
			while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
		} catch (error) {
			e = { error };
		} finally {
			try {
				if (r && !r.done && (m = i["return"])) m.call(i);
			} finally {
				if (e) throw e.error;
			}
		}
		return ar;
	};
	var __spreadArray$6 = exports && exports.__spreadArray || function(to, from$7) {
		for (var i = 0, il = from$7.length, j = to.length; i < il; i++, j++) to[j] = from$7[i];
		return to;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.onErrorResumeNext = exports.onErrorResumeNextWith = void 0;
	var argsOrArgArray_1$1 = require_argsOrArgArray();
	var onErrorResumeNext_1$1 = require_onErrorResumeNext();
	function onErrorResumeNextWith() {
		var sources = [];
		for (var _i = 0; _i < arguments.length; _i++) sources[_i] = arguments[_i];
		var nextSources = argsOrArgArray_1$1.argsOrArgArray(sources);
		return function(source) {
			return onErrorResumeNext_1$1.onErrorResumeNext.apply(void 0, __spreadArray$6([source], __read$6(nextSources)));
		};
	}
	exports.onErrorResumeNextWith = onErrorResumeNextWith;
	exports.onErrorResumeNext = onErrorResumeNextWith;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/pairwise.js
var require_pairwise = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.pairwise = void 0;
	var lift_1$28 = require_lift();
	var OperatorSubscriber_1$22 = require_OperatorSubscriber();
	function pairwise() {
		return lift_1$28.operate(function(source, subscriber) {
			var prev;
			var hasPrev = false;
			source.subscribe(OperatorSubscriber_1$22.createOperatorSubscriber(subscriber, function(value) {
				var p = prev;
				prev = value;
				hasPrev && subscriber.next([p, value]);
				hasPrev = true;
			}));
		});
	}
	exports.pairwise = pairwise;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/pluck.js
var require_pluck = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.pluck = void 0;
	var map_1$3 = require_map();
	function pluck() {
		var properties = [];
		for (var _i = 0; _i < arguments.length; _i++) properties[_i] = arguments[_i];
		var length = properties.length;
		if (length === 0) throw new Error("list of properties cannot be empty.");
		return map_1$3.map(function(x) {
			var currentProp = x;
			for (var i = 0; i < length; i++) {
				var p = currentProp === null || currentProp === void 0 ? void 0 : currentProp[properties[i]];
				if (typeof p !== "undefined") currentProp = p;
				else return;
			}
			return currentProp;
		});
	}
	exports.pluck = pluck;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/publish.js
var require_publish = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.publish = void 0;
	var Subject_1$9 = require_Subject();
	var multicast_1$3 = require_multicast();
	var connect_1$2 = require_connect();
	function publish(selector) {
		return selector ? function(source) {
			return connect_1$2.connect(selector)(source);
		} : function(source) {
			return multicast_1$3.multicast(new Subject_1$9.Subject())(source);
		};
	}
	exports.publish = publish;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/publishBehavior.js
var require_publishBehavior = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.publishBehavior = void 0;
	var BehaviorSubject_1$1 = require_BehaviorSubject();
	var ConnectableObservable_1$2 = require_ConnectableObservable();
	function publishBehavior(initialValue) {
		return function(source) {
			var subject = new BehaviorSubject_1$1.BehaviorSubject(initialValue);
			return new ConnectableObservable_1$2.ConnectableObservable(source, function() {
				return subject;
			});
		};
	}
	exports.publishBehavior = publishBehavior;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/publishLast.js
var require_publishLast = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.publishLast = void 0;
	var AsyncSubject_1$1 = require_AsyncSubject();
	var ConnectableObservable_1$1 = require_ConnectableObservable();
	function publishLast() {
		return function(source) {
			var subject = new AsyncSubject_1$1.AsyncSubject();
			return new ConnectableObservable_1$1.ConnectableObservable(source, function() {
				return subject;
			});
		};
	}
	exports.publishLast = publishLast;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/publishReplay.js
var require_publishReplay = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.publishReplay = void 0;
	var ReplaySubject_1$2 = require_ReplaySubject();
	var multicast_1$2 = require_multicast();
	var isFunction_1$2 = require_isFunction();
	function publishReplay(bufferSize, windowTime$1, selectorOrScheduler, timestampProvider) {
		if (selectorOrScheduler && !isFunction_1$2.isFunction(selectorOrScheduler)) timestampProvider = selectorOrScheduler;
		var selector = isFunction_1$2.isFunction(selectorOrScheduler) ? selectorOrScheduler : void 0;
		return function(source) {
			return multicast_1$2.multicast(new ReplaySubject_1$2.ReplaySubject(bufferSize, windowTime$1, timestampProvider), selector)(source);
		};
	}
	exports.publishReplay = publishReplay;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/raceWith.js
var require_raceWith = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __read$5 = exports && exports.__read || function(o, n) {
		var m = typeof Symbol === "function" && o[Symbol.iterator];
		if (!m) return o;
		var i = m.call(o), r, ar = [], e;
		try {
			while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
		} catch (error) {
			e = { error };
		} finally {
			try {
				if (r && !r.done && (m = i["return"])) m.call(i);
			} finally {
				if (e) throw e.error;
			}
		}
		return ar;
	};
	var __spreadArray$5 = exports && exports.__spreadArray || function(to, from$7) {
		for (var i = 0, il = from$7.length, j = to.length; i < il; i++, j++) to[j] = from$7[i];
		return to;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.raceWith = void 0;
	var race_1$2 = require_race$1();
	var lift_1$27 = require_lift();
	var identity_1$6 = require_identity();
	function raceWith() {
		var otherSources = [];
		for (var _i = 0; _i < arguments.length; _i++) otherSources[_i] = arguments[_i];
		return !otherSources.length ? identity_1$6.identity : lift_1$27.operate(function(source, subscriber) {
			race_1$2.raceInit(__spreadArray$5([source], __read$5(otherSources)))(subscriber);
		});
	}
	exports.raceWith = raceWith;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/repeat.js
var require_repeat = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.repeat = void 0;
	var empty_1$1 = require_empty();
	var lift_1$26 = require_lift();
	var OperatorSubscriber_1$21 = require_OperatorSubscriber();
	var innerFrom_1$14 = require_innerFrom();
	var timer_1$3 = require_timer();
	function repeat(countOrConfig) {
		var _a;
		var count$1 = Infinity;
		var delay$1;
		if (countOrConfig != null) if (typeof countOrConfig === "object") _a = countOrConfig.count, count$1 = _a === void 0 ? Infinity : _a, delay$1 = countOrConfig.delay;
		else count$1 = countOrConfig;
		return count$1 <= 0 ? function() {
			return empty_1$1.EMPTY;
		} : lift_1$26.operate(function(source, subscriber) {
			var soFar = 0;
			var sourceSub;
			var resubscribe = function() {
				sourceSub === null || sourceSub === void 0 || sourceSub.unsubscribe();
				sourceSub = null;
				if (delay$1 != null) {
					var notifier = typeof delay$1 === "number" ? timer_1$3.timer(delay$1) : innerFrom_1$14.innerFrom(delay$1(soFar));
					var notifierSubscriber_1 = OperatorSubscriber_1$21.createOperatorSubscriber(subscriber, function() {
						notifierSubscriber_1.unsubscribe();
						subscribeToSource();
					});
					notifier.subscribe(notifierSubscriber_1);
				} else subscribeToSource();
			};
			var subscribeToSource = function() {
				var syncUnsub = false;
				sourceSub = source.subscribe(OperatorSubscriber_1$21.createOperatorSubscriber(subscriber, void 0, function() {
					if (++soFar < count$1) if (sourceSub) resubscribe();
					else syncUnsub = true;
					else subscriber.complete();
				}));
				if (syncUnsub) resubscribe();
			};
			subscribeToSource();
		});
	}
	exports.repeat = repeat;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/repeatWhen.js
var require_repeatWhen = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.repeatWhen = void 0;
	var innerFrom_1$13 = require_innerFrom();
	var Subject_1$8 = require_Subject();
	var lift_1$25 = require_lift();
	var OperatorSubscriber_1$20 = require_OperatorSubscriber();
	function repeatWhen(notifier) {
		return lift_1$25.operate(function(source, subscriber) {
			var innerSub;
			var syncResub = false;
			var completions$;
			var isNotifierComplete = false;
			var isMainComplete = false;
			var checkComplete = function() {
				return isMainComplete && isNotifierComplete && (subscriber.complete(), true);
			};
			var getCompletionSubject = function() {
				if (!completions$) {
					completions$ = new Subject_1$8.Subject();
					innerFrom_1$13.innerFrom(notifier(completions$)).subscribe(OperatorSubscriber_1$20.createOperatorSubscriber(subscriber, function() {
						if (innerSub) subscribeForRepeatWhen();
						else syncResub = true;
					}, function() {
						isNotifierComplete = true;
						checkComplete();
					}));
				}
				return completions$;
			};
			var subscribeForRepeatWhen = function() {
				isMainComplete = false;
				innerSub = source.subscribe(OperatorSubscriber_1$20.createOperatorSubscriber(subscriber, void 0, function() {
					isMainComplete = true;
					!checkComplete() && getCompletionSubject().next();
				}));
				if (syncResub) {
					innerSub.unsubscribe();
					innerSub = null;
					syncResub = false;
					subscribeForRepeatWhen();
				}
			};
			subscribeForRepeatWhen();
		});
	}
	exports.repeatWhen = repeatWhen;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/retry.js
var require_retry = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.retry = void 0;
	var lift_1$24 = require_lift();
	var OperatorSubscriber_1$19 = require_OperatorSubscriber();
	var identity_1$5 = require_identity();
	var timer_1$2 = require_timer();
	var innerFrom_1$12 = require_innerFrom();
	function retry(configOrCount) {
		if (configOrCount === void 0) configOrCount = Infinity;
		var config;
		if (configOrCount && typeof configOrCount === "object") config = configOrCount;
		else config = { count: configOrCount };
		var _a = config.count, count$1 = _a === void 0 ? Infinity : _a, delay$1 = config.delay, _b = config.resetOnSuccess, resetOnSuccess = _b === void 0 ? false : _b;
		return count$1 <= 0 ? identity_1$5.identity : lift_1$24.operate(function(source, subscriber) {
			var soFar = 0;
			var innerSub;
			var subscribeForRetry = function() {
				var syncUnsub = false;
				innerSub = source.subscribe(OperatorSubscriber_1$19.createOperatorSubscriber(subscriber, function(value) {
					if (resetOnSuccess) soFar = 0;
					subscriber.next(value);
				}, void 0, function(err) {
					if (soFar++ < count$1) {
						var resub_1 = function() {
							if (innerSub) {
								innerSub.unsubscribe();
								innerSub = null;
								subscribeForRetry();
							} else syncUnsub = true;
						};
						if (delay$1 != null) {
							var notifier = typeof delay$1 === "number" ? timer_1$2.timer(delay$1) : innerFrom_1$12.innerFrom(delay$1(err, soFar));
							var notifierSubscriber_1 = OperatorSubscriber_1$19.createOperatorSubscriber(subscriber, function() {
								notifierSubscriber_1.unsubscribe();
								resub_1();
							}, function() {
								subscriber.complete();
							});
							notifier.subscribe(notifierSubscriber_1);
						} else resub_1();
					} else subscriber.error(err);
				}));
				if (syncUnsub) {
					innerSub.unsubscribe();
					innerSub = null;
					subscribeForRetry();
				}
			};
			subscribeForRetry();
		});
	}
	exports.retry = retry;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/retryWhen.js
var require_retryWhen = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.retryWhen = void 0;
	var innerFrom_1$11 = require_innerFrom();
	var Subject_1$7 = require_Subject();
	var lift_1$23 = require_lift();
	var OperatorSubscriber_1$18 = require_OperatorSubscriber();
	function retryWhen(notifier) {
		return lift_1$23.operate(function(source, subscriber) {
			var innerSub;
			var syncResub = false;
			var errors$;
			var subscribeForRetryWhen = function() {
				innerSub = source.subscribe(OperatorSubscriber_1$18.createOperatorSubscriber(subscriber, void 0, void 0, function(err) {
					if (!errors$) {
						errors$ = new Subject_1$7.Subject();
						innerFrom_1$11.innerFrom(notifier(errors$)).subscribe(OperatorSubscriber_1$18.createOperatorSubscriber(subscriber, function() {
							return innerSub ? subscribeForRetryWhen() : syncResub = true;
						}));
					}
					if (errors$) errors$.next(err);
				}));
				if (syncResub) {
					innerSub.unsubscribe();
					innerSub = null;
					syncResub = false;
					subscribeForRetryWhen();
				}
			};
			subscribeForRetryWhen();
		});
	}
	exports.retryWhen = retryWhen;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/sample.js
var require_sample = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.sample = void 0;
	var innerFrom_1$10 = require_innerFrom();
	var lift_1$22 = require_lift();
	var noop_1$6 = require_noop();
	var OperatorSubscriber_1$17 = require_OperatorSubscriber();
	function sample(notifier) {
		return lift_1$22.operate(function(source, subscriber) {
			var hasValue = false;
			var lastValue = null;
			source.subscribe(OperatorSubscriber_1$17.createOperatorSubscriber(subscriber, function(value) {
				hasValue = true;
				lastValue = value;
			}));
			innerFrom_1$10.innerFrom(notifier).subscribe(OperatorSubscriber_1$17.createOperatorSubscriber(subscriber, function() {
				if (hasValue) {
					hasValue = false;
					var value = lastValue;
					lastValue = null;
					subscriber.next(value);
				}
			}, noop_1$6.noop));
		});
	}
	exports.sample = sample;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/sampleTime.js
var require_sampleTime = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.sampleTime = void 0;
	var async_1$5 = require_async();
	var sample_1$2 = require_sample();
	var interval_1$1 = require_interval();
	function sampleTime(period, scheduler) {
		if (scheduler === void 0) scheduler = async_1$5.asyncScheduler;
		return sample_1$2.sample(interval_1$1.interval(period, scheduler));
	}
	exports.sampleTime = sampleTime;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/scan.js
var require_scan = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.scan = void 0;
	var lift_1$21 = require_lift();
	var scanInternals_1 = require_scanInternals();
	function scan(accumulator, seed) {
		return lift_1$21.operate(scanInternals_1.scanInternals(accumulator, seed, arguments.length >= 2, true));
	}
	exports.scan = scan;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/sequenceEqual.js
var require_sequenceEqual = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.sequenceEqual = void 0;
	var lift_1$20 = require_lift();
	var OperatorSubscriber_1$16 = require_OperatorSubscriber();
	var innerFrom_1$9 = require_innerFrom();
	function sequenceEqual(compareTo, comparator) {
		if (comparator === void 0) comparator = function(a, b) {
			return a === b;
		};
		return lift_1$20.operate(function(source, subscriber) {
			var aState = createState();
			var bState = createState();
			var emit = function(isEqual) {
				subscriber.next(isEqual);
				subscriber.complete();
			};
			var createSubscriber = function(selfState, otherState) {
				var sequenceEqualSubscriber = OperatorSubscriber_1$16.createOperatorSubscriber(subscriber, function(a) {
					var buffer$1 = otherState.buffer, complete = otherState.complete;
					if (buffer$1.length === 0) complete ? emit(false) : selfState.buffer.push(a);
					else !comparator(a, buffer$1.shift()) && emit(false);
				}, function() {
					selfState.complete = true;
					var complete = otherState.complete, buffer$1 = otherState.buffer;
					complete && emit(buffer$1.length === 0);
					sequenceEqualSubscriber === null || sequenceEqualSubscriber === void 0 || sequenceEqualSubscriber.unsubscribe();
				});
				return sequenceEqualSubscriber;
			};
			source.subscribe(createSubscriber(aState, bState));
			innerFrom_1$9.innerFrom(compareTo).subscribe(createSubscriber(bState, aState));
		});
	}
	exports.sequenceEqual = sequenceEqual;
	function createState() {
		return {
			buffer: [],
			complete: false
		};
	}
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/share.js
var require_share = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __read$4 = exports && exports.__read || function(o, n) {
		var m = typeof Symbol === "function" && o[Symbol.iterator];
		if (!m) return o;
		var i = m.call(o), r, ar = [], e;
		try {
			while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
		} catch (error) {
			e = { error };
		} finally {
			try {
				if (r && !r.done && (m = i["return"])) m.call(i);
			} finally {
				if (e) throw e.error;
			}
		}
		return ar;
	};
	var __spreadArray$4 = exports && exports.__spreadArray || function(to, from$7) {
		for (var i = 0, il = from$7.length, j = to.length; i < il; i++, j++) to[j] = from$7[i];
		return to;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.share = void 0;
	var innerFrom_1$8 = require_innerFrom();
	var Subject_1$6 = require_Subject();
	var Subscriber_1$1 = require_Subscriber();
	var lift_1$19 = require_lift();
	function share$1(options) {
		if (options === void 0) options = {};
		var _a = options.connector, connector = _a === void 0 ? function() {
			return new Subject_1$6.Subject();
		} : _a, _b = options.resetOnError, resetOnError = _b === void 0 ? true : _b, _c = options.resetOnComplete, resetOnComplete = _c === void 0 ? true : _c, _d = options.resetOnRefCountZero, resetOnRefCountZero = _d === void 0 ? true : _d;
		return function(wrapperSource) {
			var connection;
			var resetConnection;
			var subject;
			var refCount$1 = 0;
			var hasCompleted = false;
			var hasErrored = false;
			var cancelReset = function() {
				resetConnection === null || resetConnection === void 0 || resetConnection.unsubscribe();
				resetConnection = void 0;
			};
			var reset = function() {
				cancelReset();
				connection = subject = void 0;
				hasCompleted = hasErrored = false;
			};
			var resetAndUnsubscribe = function() {
				var conn = connection;
				reset();
				conn === null || conn === void 0 || conn.unsubscribe();
			};
			return lift_1$19.operate(function(source, subscriber) {
				refCount$1++;
				if (!hasErrored && !hasCompleted) cancelReset();
				var dest = subject = subject !== null && subject !== void 0 ? subject : connector();
				subscriber.add(function() {
					refCount$1--;
					if (refCount$1 === 0 && !hasErrored && !hasCompleted) resetConnection = handleReset(resetAndUnsubscribe, resetOnRefCountZero);
				});
				dest.subscribe(subscriber);
				if (!connection && refCount$1 > 0) {
					connection = new Subscriber_1$1.SafeSubscriber({
						next: function(value) {
							return dest.next(value);
						},
						error: function(err) {
							hasErrored = true;
							cancelReset();
							resetConnection = handleReset(reset, resetOnError, err);
							dest.error(err);
						},
						complete: function() {
							hasCompleted = true;
							cancelReset();
							resetConnection = handleReset(reset, resetOnComplete);
							dest.complete();
						}
					});
					innerFrom_1$8.innerFrom(source).subscribe(connection);
				}
			})(wrapperSource);
		};
	}
	exports.share = share$1;
	function handleReset(reset, on) {
		var args = [];
		for (var _i = 2; _i < arguments.length; _i++) args[_i - 2] = arguments[_i];
		if (on === true) {
			reset();
			return;
		}
		if (on === false) return;
		var onSubscriber = new Subscriber_1$1.SafeSubscriber({ next: function() {
			onSubscriber.unsubscribe();
			reset();
		} });
		return innerFrom_1$8.innerFrom(on.apply(void 0, __spreadArray$4([], __read$4(args)))).subscribe(onSubscriber);
	}
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/shareReplay.js
var require_shareReplay = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.shareReplay = void 0;
	var ReplaySubject_1$1 = require_ReplaySubject();
	var share_1$2 = require_share();
	function shareReplay$6(configOrBufferSize, windowTime$1, scheduler) {
		var _a, _b, _c;
		var bufferSize;
		var refCount$1 = false;
		if (configOrBufferSize && typeof configOrBufferSize === "object") _a = configOrBufferSize.bufferSize, bufferSize = _a === void 0 ? Infinity : _a, _b = configOrBufferSize.windowTime, windowTime$1 = _b === void 0 ? Infinity : _b, _c = configOrBufferSize.refCount, refCount$1 = _c === void 0 ? false : _c, scheduler = configOrBufferSize.scheduler;
		else bufferSize = configOrBufferSize !== null && configOrBufferSize !== void 0 ? configOrBufferSize : Infinity;
		return share_1$2.share({
			connector: function() {
				return new ReplaySubject_1$1.ReplaySubject(bufferSize, windowTime$1, scheduler);
			},
			resetOnError: true,
			resetOnComplete: false,
			resetOnRefCountZero: refCount$1
		});
	}
	exports.shareReplay = shareReplay$6;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/single.js
var require_single = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.single = void 0;
	var EmptyError_1$1 = require_EmptyError();
	var SequenceError_1$1 = require_SequenceError();
	var NotFoundError_1$1 = require_NotFoundError();
	var lift_1$18 = require_lift();
	var OperatorSubscriber_1$15 = require_OperatorSubscriber();
	function single(predicate) {
		return lift_1$18.operate(function(source, subscriber) {
			var hasValue = false;
			var singleValue;
			var seenValue = false;
			var index = 0;
			source.subscribe(OperatorSubscriber_1$15.createOperatorSubscriber(subscriber, function(value) {
				seenValue = true;
				if (!predicate || predicate(value, index++, source)) {
					hasValue && subscriber.error(new SequenceError_1$1.SequenceError("Too many matching values"));
					hasValue = true;
					singleValue = value;
				}
			}, function() {
				if (hasValue) {
					subscriber.next(singleValue);
					subscriber.complete();
				} else subscriber.error(seenValue ? new NotFoundError_1$1.NotFoundError("No matching values") : new EmptyError_1$1.EmptyError());
			}));
		});
	}
	exports.single = single;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/skip.js
var require_skip = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.skip = void 0;
	var filter_1$3 = require_filter();
	function skip$2(count$1) {
		return filter_1$3.filter(function(_, index) {
			return count$1 <= index;
		});
	}
	exports.skip = skip$2;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/skipLast.js
var require_skipLast = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.skipLast = void 0;
	var identity_1$4 = require_identity();
	var lift_1$17 = require_lift();
	var OperatorSubscriber_1$14 = require_OperatorSubscriber();
	function skipLast(skipCount) {
		return skipCount <= 0 ? identity_1$4.identity : lift_1$17.operate(function(source, subscriber) {
			var ring = new Array(skipCount);
			var seen = 0;
			source.subscribe(OperatorSubscriber_1$14.createOperatorSubscriber(subscriber, function(value) {
				var valueIndex = seen++;
				if (valueIndex < skipCount) ring[valueIndex] = value;
				else {
					var index = valueIndex % skipCount;
					var oldValue = ring[index];
					ring[index] = value;
					subscriber.next(oldValue);
				}
			}));
			return function() {
				ring = null;
			};
		});
	}
	exports.skipLast = skipLast;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/skipUntil.js
var require_skipUntil = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.skipUntil = void 0;
	var lift_1$16 = require_lift();
	var OperatorSubscriber_1$13 = require_OperatorSubscriber();
	var innerFrom_1$7 = require_innerFrom();
	var noop_1$5 = require_noop();
	function skipUntil(notifier) {
		return lift_1$16.operate(function(source, subscriber) {
			var taking = false;
			var skipSubscriber = OperatorSubscriber_1$13.createOperatorSubscriber(subscriber, function() {
				skipSubscriber === null || skipSubscriber === void 0 || skipSubscriber.unsubscribe();
				taking = true;
			}, noop_1$5.noop);
			innerFrom_1$7.innerFrom(notifier).subscribe(skipSubscriber);
			source.subscribe(OperatorSubscriber_1$13.createOperatorSubscriber(subscriber, function(value) {
				return taking && subscriber.next(value);
			}));
		});
	}
	exports.skipUntil = skipUntil;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/skipWhile.js
var require_skipWhile = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.skipWhile = void 0;
	var lift_1$15 = require_lift();
	var OperatorSubscriber_1$12 = require_OperatorSubscriber();
	function skipWhile$1(predicate) {
		return lift_1$15.operate(function(source, subscriber) {
			var taking = false;
			var index = 0;
			source.subscribe(OperatorSubscriber_1$12.createOperatorSubscriber(subscriber, function(value) {
				return (taking || (taking = !predicate(value, index++))) && subscriber.next(value);
			}));
		});
	}
	exports.skipWhile = skipWhile$1;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/startWith.js
var require_startWith = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.startWith = void 0;
	var concat_1$2 = require_concat$1();
	var args_1$2 = require_args();
	var lift_1$14 = require_lift();
	function startWith() {
		var values = [];
		for (var _i = 0; _i < arguments.length; _i++) values[_i] = arguments[_i];
		var scheduler = args_1$2.popScheduler(values);
		return lift_1$14.operate(function(source, subscriber) {
			(scheduler ? concat_1$2.concat(values, source, scheduler) : concat_1$2.concat(values, source)).subscribe(subscriber);
		});
	}
	exports.startWith = startWith;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/switchMap.js
var require_switchMap = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.switchMap = void 0;
	var innerFrom_1$6 = require_innerFrom();
	var lift_1$13 = require_lift();
	var OperatorSubscriber_1$11 = require_OperatorSubscriber();
	function switchMap$2(project, resultSelector) {
		return lift_1$13.operate(function(source, subscriber) {
			var innerSubscriber = null;
			var index = 0;
			var isComplete = false;
			var checkComplete = function() {
				return isComplete && !innerSubscriber && subscriber.complete();
			};
			source.subscribe(OperatorSubscriber_1$11.createOperatorSubscriber(subscriber, function(value) {
				innerSubscriber === null || innerSubscriber === void 0 || innerSubscriber.unsubscribe();
				var innerIndex = 0;
				var outerIndex = index++;
				innerFrom_1$6.innerFrom(project(value, outerIndex)).subscribe(innerSubscriber = OperatorSubscriber_1$11.createOperatorSubscriber(subscriber, function(innerValue) {
					return subscriber.next(resultSelector ? resultSelector(value, innerValue, outerIndex, innerIndex++) : innerValue);
				}, function() {
					innerSubscriber = null;
					checkComplete();
				}));
			}, function() {
				isComplete = true;
				checkComplete();
			}));
		});
	}
	exports.switchMap = switchMap$2;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/switchAll.js
var require_switchAll = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.switchAll = void 0;
	var switchMap_1$4 = require_switchMap();
	var identity_1$3 = require_identity();
	function switchAll() {
		return switchMap_1$4.switchMap(identity_1$3.identity);
	}
	exports.switchAll = switchAll;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/switchMapTo.js
var require_switchMapTo = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.switchMapTo = void 0;
	var switchMap_1$3 = require_switchMap();
	var isFunction_1$1 = require_isFunction();
	function switchMapTo(innerObservable, resultSelector) {
		return isFunction_1$1.isFunction(resultSelector) ? switchMap_1$3.switchMap(function() {
			return innerObservable;
		}, resultSelector) : switchMap_1$3.switchMap(function() {
			return innerObservable;
		});
	}
	exports.switchMapTo = switchMapTo;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/switchScan.js
var require_switchScan = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.switchScan = void 0;
	var switchMap_1$2 = require_switchMap();
	var lift_1$12 = require_lift();
	function switchScan(accumulator, seed) {
		return lift_1$12.operate(function(source, subscriber) {
			var state = seed;
			switchMap_1$2.switchMap(function(value, index) {
				return accumulator(state, value, index);
			}, function(_, innerValue) {
				return state = innerValue, innerValue;
			})(source).subscribe(subscriber);
			return function() {
				state = null;
			};
		});
	}
	exports.switchScan = switchScan;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/takeUntil.js
var require_takeUntil = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.takeUntil = void 0;
	var lift_1$11 = require_lift();
	var OperatorSubscriber_1$10 = require_OperatorSubscriber();
	var innerFrom_1$5 = require_innerFrom();
	var noop_1$4 = require_noop();
	function takeUntil$10(notifier) {
		return lift_1$11.operate(function(source, subscriber) {
			innerFrom_1$5.innerFrom(notifier).subscribe(OperatorSubscriber_1$10.createOperatorSubscriber(subscriber, function() {
				return subscriber.complete();
			}, noop_1$4.noop));
			!subscriber.closed && source.subscribe(subscriber);
		});
	}
	exports.takeUntil = takeUntil$10;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/takeWhile.js
var require_takeWhile = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.takeWhile = void 0;
	var lift_1$10 = require_lift();
	var OperatorSubscriber_1$9 = require_OperatorSubscriber();
	function takeWhile(predicate, inclusive) {
		if (inclusive === void 0) inclusive = false;
		return lift_1$10.operate(function(source, subscriber) {
			var index = 0;
			source.subscribe(OperatorSubscriber_1$9.createOperatorSubscriber(subscriber, function(value) {
				var result = predicate(value, index++);
				(result || inclusive) && subscriber.next(value);
				!result && subscriber.complete();
			}));
		});
	}
	exports.takeWhile = takeWhile;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/tap.js
var require_tap = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.tap = void 0;
	var isFunction_1 = require_isFunction();
	var lift_1$9 = require_lift();
	var OperatorSubscriber_1$8 = require_OperatorSubscriber();
	var identity_1$2 = require_identity();
	function tap$7(observerOrNext, error, complete) {
		var tapObserver = isFunction_1.isFunction(observerOrNext) || error || complete ? {
			next: observerOrNext,
			error,
			complete
		} : observerOrNext;
		return tapObserver ? lift_1$9.operate(function(source, subscriber) {
			var _a;
			(_a = tapObserver.subscribe) === null || _a === void 0 || _a.call(tapObserver);
			var isUnsub = true;
			source.subscribe(OperatorSubscriber_1$8.createOperatorSubscriber(subscriber, function(value) {
				var _a$1;
				(_a$1 = tapObserver.next) === null || _a$1 === void 0 || _a$1.call(tapObserver, value);
				subscriber.next(value);
			}, function() {
				var _a$1;
				isUnsub = false;
				(_a$1 = tapObserver.complete) === null || _a$1 === void 0 || _a$1.call(tapObserver);
				subscriber.complete();
			}, function(err) {
				var _a$1;
				isUnsub = false;
				(_a$1 = tapObserver.error) === null || _a$1 === void 0 || _a$1.call(tapObserver, err);
				subscriber.error(err);
			}, function() {
				var _a$1, _b;
				if (isUnsub) (_a$1 = tapObserver.unsubscribe) === null || _a$1 === void 0 || _a$1.call(tapObserver);
				(_b = tapObserver.finalize) === null || _b === void 0 || _b.call(tapObserver);
			}));
		}) : identity_1$2.identity;
	}
	exports.tap = tap$7;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/throttle.js
var require_throttle = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.throttle = void 0;
	var lift_1$8 = require_lift();
	var OperatorSubscriber_1$7 = require_OperatorSubscriber();
	var innerFrom_1$4 = require_innerFrom();
	function throttle(durationSelector, config) {
		return lift_1$8.operate(function(source, subscriber) {
			var _a = config !== null && config !== void 0 ? config : {}, _b = _a.leading, leading = _b === void 0 ? true : _b, _c = _a.trailing, trailing = _c === void 0 ? false : _c;
			var hasValue = false;
			var sendValue = null;
			var throttled = null;
			var isComplete = false;
			var endThrottling = function() {
				throttled === null || throttled === void 0 || throttled.unsubscribe();
				throttled = null;
				if (trailing) {
					send();
					isComplete && subscriber.complete();
				}
			};
			var cleanupThrottling = function() {
				throttled = null;
				isComplete && subscriber.complete();
			};
			var startThrottle = function(value) {
				return throttled = innerFrom_1$4.innerFrom(durationSelector(value)).subscribe(OperatorSubscriber_1$7.createOperatorSubscriber(subscriber, endThrottling, cleanupThrottling));
			};
			var send = function() {
				if (hasValue) {
					hasValue = false;
					var value = sendValue;
					sendValue = null;
					subscriber.next(value);
					!isComplete && startThrottle(value);
				}
			};
			source.subscribe(OperatorSubscriber_1$7.createOperatorSubscriber(subscriber, function(value) {
				hasValue = true;
				sendValue = value;
				!(throttled && !throttled.closed) && (leading ? send() : startThrottle(value));
			}, function() {
				isComplete = true;
				!(trailing && hasValue && throttled && !throttled.closed) && subscriber.complete();
			}));
		});
	}
	exports.throttle = throttle;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/throttleTime.js
var require_throttleTime = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.throttleTime = void 0;
	var async_1$4 = require_async();
	var throttle_1$2 = require_throttle();
	var timer_1$1 = require_timer();
	function throttleTime(duration, scheduler, config) {
		if (scheduler === void 0) scheduler = async_1$4.asyncScheduler;
		var duration$ = timer_1$1.timer(duration, scheduler);
		return throttle_1$2.throttle(function() {
			return duration$;
		}, config);
	}
	exports.throttleTime = throttleTime;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/timeInterval.js
var require_timeInterval = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.TimeInterval = exports.timeInterval = void 0;
	var async_1$3 = require_async();
	var lift_1$7 = require_lift();
	var OperatorSubscriber_1$6 = require_OperatorSubscriber();
	function timeInterval(scheduler) {
		if (scheduler === void 0) scheduler = async_1$3.asyncScheduler;
		return lift_1$7.operate(function(source, subscriber) {
			var last$2 = scheduler.now();
			source.subscribe(OperatorSubscriber_1$6.createOperatorSubscriber(subscriber, function(value) {
				var now = scheduler.now();
				var interval$2 = now - last$2;
				last$2 = now;
				subscriber.next(new TimeInterval(value, interval$2));
			}));
		});
	}
	exports.timeInterval = timeInterval;
	var TimeInterval = function() {
		function TimeInterval$1(value, interval$2) {
			this.value = value;
			this.interval = interval$2;
		}
		return TimeInterval$1;
	}();
	exports.TimeInterval = TimeInterval;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/timeoutWith.js
var require_timeoutWith = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.timeoutWith = void 0;
	var async_1$2 = require_async();
	var isDate_1 = require_isDate();
	var timeout_1$2 = require_timeout();
	function timeoutWith(due, withObservable, scheduler) {
		var first$1;
		var each;
		var _with;
		scheduler = scheduler !== null && scheduler !== void 0 ? scheduler : async_1$2.async;
		if (isDate_1.isValidDate(due)) first$1 = due;
		else if (typeof due === "number") each = due;
		if (withObservable) _with = function() {
			return withObservable;
		};
		else throw new TypeError("No observable provided to switch to");
		if (first$1 == null && each == null) throw new TypeError("No timeout provided.");
		return timeout_1$2.timeout({
			first: first$1,
			each,
			scheduler,
			with: _with
		});
	}
	exports.timeoutWith = timeoutWith;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/timestamp.js
var require_timestamp = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.timestamp = void 0;
	var dateTimestampProvider_1 = require_dateTimestampProvider();
	var map_1$2 = require_map();
	function timestamp(timestampProvider) {
		if (timestampProvider === void 0) timestampProvider = dateTimestampProvider_1.dateTimestampProvider;
		return map_1$2.map(function(value) {
			return {
				value,
				timestamp: timestampProvider.now()
			};
		});
	}
	exports.timestamp = timestamp;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/window.js
var require_window = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.window = void 0;
	var Subject_1$5 = require_Subject();
	var lift_1$6 = require_lift();
	var OperatorSubscriber_1$5 = require_OperatorSubscriber();
	var noop_1$3 = require_noop();
	var innerFrom_1$3 = require_innerFrom();
	function window$1(windowBoundaries) {
		return lift_1$6.operate(function(source, subscriber) {
			var windowSubject = new Subject_1$5.Subject();
			subscriber.next(windowSubject.asObservable());
			var errorHandler = function(err) {
				windowSubject.error(err);
				subscriber.error(err);
			};
			source.subscribe(OperatorSubscriber_1$5.createOperatorSubscriber(subscriber, function(value) {
				return windowSubject === null || windowSubject === void 0 ? void 0 : windowSubject.next(value);
			}, function() {
				windowSubject.complete();
				subscriber.complete();
			}, errorHandler));
			innerFrom_1$3.innerFrom(windowBoundaries).subscribe(OperatorSubscriber_1$5.createOperatorSubscriber(subscriber, function() {
				windowSubject.complete();
				subscriber.next(windowSubject = new Subject_1$5.Subject());
			}, noop_1$3.noop, errorHandler));
			return function() {
				windowSubject === null || windowSubject === void 0 || windowSubject.unsubscribe();
				windowSubject = null;
			};
		});
	}
	exports.window = window$1;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/windowCount.js
var require_windowCount = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __values$1 = exports && exports.__values || function(o) {
		var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
		if (m) return m.call(o);
		if (o && typeof o.length === "number") return { next: function() {
			if (o && i >= o.length) o = void 0;
			return {
				value: o && o[i++],
				done: !o
			};
		} };
		throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.windowCount = void 0;
	var Subject_1$4 = require_Subject();
	var lift_1$5 = require_lift();
	var OperatorSubscriber_1$4 = require_OperatorSubscriber();
	function windowCount(windowSize, startWindowEvery) {
		if (startWindowEvery === void 0) startWindowEvery = 0;
		var startEvery = startWindowEvery > 0 ? startWindowEvery : windowSize;
		return lift_1$5.operate(function(source, subscriber) {
			var windows = [new Subject_1$4.Subject()];
			var count$1 = 0;
			subscriber.next(windows[0].asObservable());
			source.subscribe(OperatorSubscriber_1$4.createOperatorSubscriber(subscriber, function(value) {
				var e_1, _a;
				try {
					for (var windows_1 = __values$1(windows), windows_1_1 = windows_1.next(); !windows_1_1.done; windows_1_1 = windows_1.next()) windows_1_1.value.next(value);
				} catch (e_1_1) {
					e_1 = { error: e_1_1 };
				} finally {
					try {
						if (windows_1_1 && !windows_1_1.done && (_a = windows_1.return)) _a.call(windows_1);
					} finally {
						if (e_1) throw e_1.error;
					}
				}
				var c = count$1 - windowSize + 1;
				if (c >= 0 && c % startEvery === 0) windows.shift().complete();
				if (++count$1 % startEvery === 0) {
					var window_2 = new Subject_1$4.Subject();
					windows.push(window_2);
					subscriber.next(window_2.asObservable());
				}
			}, function() {
				while (windows.length > 0) windows.shift().complete();
				subscriber.complete();
			}, function(err) {
				while (windows.length > 0) windows.shift().error(err);
				subscriber.error(err);
			}, function() {
				windows = null;
			}));
		});
	}
	exports.windowCount = windowCount;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/windowTime.js
var require_windowTime = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.windowTime = void 0;
	var Subject_1$3 = require_Subject();
	var async_1$1 = require_async();
	var Subscription_1$2 = require_Subscription();
	var lift_1$4 = require_lift();
	var OperatorSubscriber_1$3 = require_OperatorSubscriber();
	var arrRemove_1$1 = require_arrRemove();
	var args_1$1 = require_args();
	var executeSchedule_1 = require_executeSchedule();
	function windowTime(windowTimeSpan) {
		var _a, _b;
		var otherArgs = [];
		for (var _i = 1; _i < arguments.length; _i++) otherArgs[_i - 1] = arguments[_i];
		var scheduler = (_a = args_1$1.popScheduler(otherArgs)) !== null && _a !== void 0 ? _a : async_1$1.asyncScheduler;
		var windowCreationInterval = (_b = otherArgs[0]) !== null && _b !== void 0 ? _b : null;
		var maxWindowSize = otherArgs[1] || Infinity;
		return lift_1$4.operate(function(source, subscriber) {
			var windowRecords = [];
			var restartOnClose = false;
			var closeWindow = function(record) {
				var window$2 = record.window, subs = record.subs;
				window$2.complete();
				subs.unsubscribe();
				arrRemove_1$1.arrRemove(windowRecords, record);
				restartOnClose && startWindow();
			};
			var startWindow = function() {
				if (windowRecords) {
					var subs = new Subscription_1$2.Subscription();
					subscriber.add(subs);
					var window_1$2 = new Subject_1$3.Subject();
					var record_1 = {
						window: window_1$2,
						subs,
						seen: 0
					};
					windowRecords.push(record_1);
					subscriber.next(window_1$2.asObservable());
					executeSchedule_1.executeSchedule(subs, scheduler, function() {
						return closeWindow(record_1);
					}, windowTimeSpan);
				}
			};
			if (windowCreationInterval !== null && windowCreationInterval >= 0) executeSchedule_1.executeSchedule(subscriber, scheduler, startWindow, windowCreationInterval, true);
			else restartOnClose = true;
			startWindow();
			var loop = function(cb) {
				return windowRecords.slice().forEach(cb);
			};
			var terminate = function(cb) {
				loop(function(_a$1) {
					var window$2 = _a$1.window;
					return cb(window$2);
				});
				cb(subscriber);
				subscriber.unsubscribe();
			};
			source.subscribe(OperatorSubscriber_1$3.createOperatorSubscriber(subscriber, function(value) {
				loop(function(record) {
					record.window.next(value);
					maxWindowSize <= ++record.seen && closeWindow(record);
				});
			}, function() {
				return terminate(function(consumer) {
					return consumer.complete();
				});
			}, function(err) {
				return terminate(function(consumer) {
					return consumer.error(err);
				});
			}));
			return function() {
				windowRecords = null;
			};
		});
	}
	exports.windowTime = windowTime;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/windowToggle.js
var require_windowToggle = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __values = exports && exports.__values || function(o) {
		var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
		if (m) return m.call(o);
		if (o && typeof o.length === "number") return { next: function() {
			if (o && i >= o.length) o = void 0;
			return {
				value: o && o[i++],
				done: !o
			};
		} };
		throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.windowToggle = void 0;
	var Subject_1$2 = require_Subject();
	var Subscription_1$1 = require_Subscription();
	var lift_1$3 = require_lift();
	var innerFrom_1$2 = require_innerFrom();
	var OperatorSubscriber_1$2 = require_OperatorSubscriber();
	var noop_1$2 = require_noop();
	var arrRemove_1 = require_arrRemove();
	function windowToggle(openings, closingSelector) {
		return lift_1$3.operate(function(source, subscriber) {
			var windows = [];
			var handleError = function(err) {
				while (0 < windows.length) windows.shift().error(err);
				subscriber.error(err);
			};
			innerFrom_1$2.innerFrom(openings).subscribe(OperatorSubscriber_1$2.createOperatorSubscriber(subscriber, function(openValue) {
				var window$2 = new Subject_1$2.Subject();
				windows.push(window$2);
				var closingSubscription = new Subscription_1$1.Subscription();
				var closeWindow = function() {
					arrRemove_1.arrRemove(windows, window$2);
					window$2.complete();
					closingSubscription.unsubscribe();
				};
				var closingNotifier;
				try {
					closingNotifier = innerFrom_1$2.innerFrom(closingSelector(openValue));
				} catch (err) {
					handleError(err);
					return;
				}
				subscriber.next(window$2.asObservable());
				closingSubscription.add(closingNotifier.subscribe(OperatorSubscriber_1$2.createOperatorSubscriber(subscriber, closeWindow, noop_1$2.noop, handleError)));
			}, noop_1$2.noop));
			source.subscribe(OperatorSubscriber_1$2.createOperatorSubscriber(subscriber, function(value) {
				var e_1, _a;
				var windowsCopy = windows.slice();
				try {
					for (var windowsCopy_1 = __values(windowsCopy), windowsCopy_1_1 = windowsCopy_1.next(); !windowsCopy_1_1.done; windowsCopy_1_1 = windowsCopy_1.next()) windowsCopy_1_1.value.next(value);
				} catch (e_1_1) {
					e_1 = { error: e_1_1 };
				} finally {
					try {
						if (windowsCopy_1_1 && !windowsCopy_1_1.done && (_a = windowsCopy_1.return)) _a.call(windowsCopy_1);
					} finally {
						if (e_1) throw e_1.error;
					}
				}
			}, function() {
				while (0 < windows.length) windows.shift().complete();
				subscriber.complete();
			}, handleError, function() {
				while (0 < windows.length) windows.shift().unsubscribe();
			}));
		});
	}
	exports.windowToggle = windowToggle;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/windowWhen.js
var require_windowWhen = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.windowWhen = void 0;
	var Subject_1$1 = require_Subject();
	var lift_1$2 = require_lift();
	var OperatorSubscriber_1$1 = require_OperatorSubscriber();
	var innerFrom_1$1 = require_innerFrom();
	function windowWhen(closingSelector) {
		return lift_1$2.operate(function(source, subscriber) {
			var window$2;
			var closingSubscriber;
			var handleError = function(err) {
				window$2.error(err);
				subscriber.error(err);
			};
			var openWindow = function() {
				closingSubscriber === null || closingSubscriber === void 0 || closingSubscriber.unsubscribe();
				window$2 === null || window$2 === void 0 || window$2.complete();
				window$2 = new Subject_1$1.Subject();
				subscriber.next(window$2.asObservable());
				var closingNotifier;
				try {
					closingNotifier = innerFrom_1$1.innerFrom(closingSelector());
				} catch (err) {
					handleError(err);
					return;
				}
				closingNotifier.subscribe(closingSubscriber = OperatorSubscriber_1$1.createOperatorSubscriber(subscriber, openWindow, openWindow, handleError));
			};
			openWindow();
			source.subscribe(OperatorSubscriber_1$1.createOperatorSubscriber(subscriber, function(value) {
				return window$2.next(value);
			}, function() {
				window$2.complete();
				subscriber.complete();
			}, handleError, function() {
				closingSubscriber === null || closingSubscriber === void 0 || closingSubscriber.unsubscribe();
				window$2 = null;
			}));
		});
	}
	exports.windowWhen = windowWhen;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/withLatestFrom.js
var require_withLatestFrom = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __read$3 = exports && exports.__read || function(o, n) {
		var m = typeof Symbol === "function" && o[Symbol.iterator];
		if (!m) return o;
		var i = m.call(o), r, ar = [], e;
		try {
			while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
		} catch (error) {
			e = { error };
		} finally {
			try {
				if (r && !r.done && (m = i["return"])) m.call(i);
			} finally {
				if (e) throw e.error;
			}
		}
		return ar;
	};
	var __spreadArray$3 = exports && exports.__spreadArray || function(to, from$7) {
		for (var i = 0, il = from$7.length, j = to.length; i < il; i++, j++) to[j] = from$7[i];
		return to;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.withLatestFrom = void 0;
	var lift_1$1 = require_lift();
	var OperatorSubscriber_1 = require_OperatorSubscriber();
	var innerFrom_1 = require_innerFrom();
	var identity_1$1 = require_identity();
	var noop_1$1 = require_noop();
	var args_1 = require_args();
	function withLatestFrom$1() {
		var inputs = [];
		for (var _i = 0; _i < arguments.length; _i++) inputs[_i] = arguments[_i];
		var project = args_1.popResultSelector(inputs);
		return lift_1$1.operate(function(source, subscriber) {
			var len = inputs.length;
			var otherValues = new Array(len);
			var hasValue = inputs.map(function() {
				return false;
			});
			var ready$1 = false;
			var _loop_1 = function(i$1) {
				innerFrom_1.innerFrom(inputs[i$1]).subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
					otherValues[i$1] = value;
					if (!ready$1 && !hasValue[i$1]) {
						hasValue[i$1] = true;
						(ready$1 = hasValue.every(identity_1$1.identity)) && (hasValue = null);
					}
				}, noop_1$1.noop));
			};
			for (var i = 0; i < len; i++) _loop_1(i);
			source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
				if (ready$1) {
					var values = __spreadArray$3([value], __read$3(otherValues));
					subscriber.next(project ? project.apply(void 0, __spreadArray$3([], __read$3(values))) : values);
				}
			}));
		});
	}
	exports.withLatestFrom = withLatestFrom$1;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/zipAll.js
var require_zipAll = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.zipAll = void 0;
	var zip_1$4 = require_zip$1();
	var joinAllInternals_1 = require_joinAllInternals();
	function zipAll(project) {
		return joinAllInternals_1.joinAllInternals(zip_1$4.zip, project);
	}
	exports.zipAll = zipAll;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/zip.js
var require_zip = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __read$2 = exports && exports.__read || function(o, n) {
		var m = typeof Symbol === "function" && o[Symbol.iterator];
		if (!m) return o;
		var i = m.call(o), r, ar = [], e;
		try {
			while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
		} catch (error) {
			e = { error };
		} finally {
			try {
				if (r && !r.done && (m = i["return"])) m.call(i);
			} finally {
				if (e) throw e.error;
			}
		}
		return ar;
	};
	var __spreadArray$2 = exports && exports.__spreadArray || function(to, from$7) {
		for (var i = 0, il = from$7.length, j = to.length; i < il; i++, j++) to[j] = from$7[i];
		return to;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.zip = void 0;
	var zip_1$3 = require_zip$1();
	var lift_1 = require_lift();
	function zip() {
		var sources = [];
		for (var _i = 0; _i < arguments.length; _i++) sources[_i] = arguments[_i];
		return lift_1.operate(function(source, subscriber) {
			zip_1$3.zip.apply(void 0, __spreadArray$2([source], __read$2(sources))).subscribe(subscriber);
		});
	}
	exports.zip = zip;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/zipWith.js
var require_zipWith = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __read$1 = exports && exports.__read || function(o, n) {
		var m = typeof Symbol === "function" && o[Symbol.iterator];
		if (!m) return o;
		var i = m.call(o), r, ar = [], e;
		try {
			while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
		} catch (error) {
			e = { error };
		} finally {
			try {
				if (r && !r.done && (m = i["return"])) m.call(i);
			} finally {
				if (e) throw e.error;
			}
		}
		return ar;
	};
	var __spreadArray$1 = exports && exports.__spreadArray || function(to, from$7) {
		for (var i = 0, il = from$7.length, j = to.length; i < il; i++, j++) to[j] = from$7[i];
		return to;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.zipWith = void 0;
	var zip_1$2 = require_zip();
	function zipWith() {
		var otherInputs = [];
		for (var _i = 0; _i < arguments.length; _i++) otherInputs[_i] = arguments[_i];
		return zip_1$2.zip.apply(void 0, __spreadArray$1([], __read$1(otherInputs)));
	}
	exports.zipWith = zipWith;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/index.js
var require_cjs = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		Object.defineProperty(o, k2, {
			enumerable: true,
			get: function() {
				return m[k];
			}
		});
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __exportStar = exports && exports.__exportStar || function(m, exports$1) {
		for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports$1, p)) __createBinding(exports$1, m, p);
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.interval = exports.iif = exports.generate = exports.fromEventPattern = exports.fromEvent = exports.from = exports.forkJoin = exports.empty = exports.defer = exports.connectable = exports.concat = exports.combineLatest = exports.bindNodeCallback = exports.bindCallback = exports.UnsubscriptionError = exports.TimeoutError = exports.SequenceError = exports.ObjectUnsubscribedError = exports.NotFoundError = exports.EmptyError = exports.ArgumentOutOfRangeError = exports.firstValueFrom = exports.lastValueFrom = exports.isObservable = exports.identity = exports.noop = exports.pipe = exports.NotificationKind = exports.Notification = exports.Subscriber = exports.Subscription = exports.Scheduler = exports.VirtualAction = exports.VirtualTimeScheduler = exports.animationFrameScheduler = exports.animationFrame = exports.queueScheduler = exports.queue = exports.asyncScheduler = exports.async = exports.asapScheduler = exports.asap = exports.AsyncSubject = exports.ReplaySubject = exports.BehaviorSubject = exports.Subject = exports.animationFrames = exports.observable = exports.ConnectableObservable = exports.Observable = void 0;
	exports.filter = exports.expand = exports.exhaustMap = exports.exhaustAll = exports.exhaust = exports.every = exports.endWith = exports.elementAt = exports.distinctUntilKeyChanged = exports.distinctUntilChanged = exports.distinct = exports.dematerialize = exports.delayWhen = exports.delay = exports.defaultIfEmpty = exports.debounceTime = exports.debounce = exports.count = exports.connect = exports.concatWith = exports.concatMapTo = exports.concatMap = exports.concatAll = exports.combineLatestWith = exports.combineLatestAll = exports.combineAll = exports.catchError = exports.bufferWhen = exports.bufferToggle = exports.bufferTime = exports.bufferCount = exports.buffer = exports.auditTime = exports.audit = exports.config = exports.NEVER = exports.EMPTY = exports.scheduled = exports.zip = exports.using = exports.timer = exports.throwError = exports.range = exports.race = exports.partition = exports.pairs = exports.onErrorResumeNext = exports.of = exports.never = exports.merge = void 0;
	exports.switchMap = exports.switchAll = exports.subscribeOn = exports.startWith = exports.skipWhile = exports.skipUntil = exports.skipLast = exports.skip = exports.single = exports.shareReplay = exports.share = exports.sequenceEqual = exports.scan = exports.sampleTime = exports.sample = exports.refCount = exports.retryWhen = exports.retry = exports.repeatWhen = exports.repeat = exports.reduce = exports.raceWith = exports.publishReplay = exports.publishLast = exports.publishBehavior = exports.publish = exports.pluck = exports.pairwise = exports.onErrorResumeNextWith = exports.observeOn = exports.multicast = exports.min = exports.mergeWith = exports.mergeScan = exports.mergeMapTo = exports.mergeMap = exports.flatMap = exports.mergeAll = exports.max = exports.materialize = exports.mapTo = exports.map = exports.last = exports.isEmpty = exports.ignoreElements = exports.groupBy = exports.first = exports.findIndex = exports.find = exports.finalize = void 0;
	exports.zipWith = exports.zipAll = exports.withLatestFrom = exports.windowWhen = exports.windowToggle = exports.windowTime = exports.windowCount = exports.window = exports.toArray = exports.timestamp = exports.timeoutWith = exports.timeout = exports.timeInterval = exports.throwIfEmpty = exports.throttleTime = exports.throttle = exports.tap = exports.takeWhile = exports.takeUntil = exports.takeLast = exports.take = exports.switchScan = exports.switchMapTo = void 0;
	var Observable_1 = require_Observable();
	Object.defineProperty(exports, "Observable", {
		enumerable: true,
		get: function() {
			return Observable_1.Observable;
		}
	});
	var ConnectableObservable_1 = require_ConnectableObservable();
	Object.defineProperty(exports, "ConnectableObservable", {
		enumerable: true,
		get: function() {
			return ConnectableObservable_1.ConnectableObservable;
		}
	});
	var observable_1 = require_observable();
	Object.defineProperty(exports, "observable", {
		enumerable: true,
		get: function() {
			return observable_1.observable;
		}
	});
	var animationFrames_1 = require_animationFrames();
	Object.defineProperty(exports, "animationFrames", {
		enumerable: true,
		get: function() {
			return animationFrames_1.animationFrames;
		}
	});
	var Subject_1 = require_Subject();
	Object.defineProperty(exports, "Subject", {
		enumerable: true,
		get: function() {
			return Subject_1.Subject;
		}
	});
	var BehaviorSubject_1 = require_BehaviorSubject();
	Object.defineProperty(exports, "BehaviorSubject", {
		enumerable: true,
		get: function() {
			return BehaviorSubject_1.BehaviorSubject;
		}
	});
	var ReplaySubject_1 = require_ReplaySubject();
	Object.defineProperty(exports, "ReplaySubject", {
		enumerable: true,
		get: function() {
			return ReplaySubject_1.ReplaySubject;
		}
	});
	var AsyncSubject_1 = require_AsyncSubject();
	Object.defineProperty(exports, "AsyncSubject", {
		enumerable: true,
		get: function() {
			return AsyncSubject_1.AsyncSubject;
		}
	});
	var asap_1 = require_asap();
	Object.defineProperty(exports, "asap", {
		enumerable: true,
		get: function() {
			return asap_1.asap;
		}
	});
	Object.defineProperty(exports, "asapScheduler", {
		enumerable: true,
		get: function() {
			return asap_1.asapScheduler;
		}
	});
	var async_1 = require_async();
	Object.defineProperty(exports, "async", {
		enumerable: true,
		get: function() {
			return async_1.async;
		}
	});
	Object.defineProperty(exports, "asyncScheduler", {
		enumerable: true,
		get: function() {
			return async_1.asyncScheduler;
		}
	});
	var queue_1 = require_queue();
	Object.defineProperty(exports, "queue", {
		enumerable: true,
		get: function() {
			return queue_1.queue;
		}
	});
	Object.defineProperty(exports, "queueScheduler", {
		enumerable: true,
		get: function() {
			return queue_1.queueScheduler;
		}
	});
	var animationFrame_1 = require_animationFrame();
	Object.defineProperty(exports, "animationFrame", {
		enumerable: true,
		get: function() {
			return animationFrame_1.animationFrame;
		}
	});
	Object.defineProperty(exports, "animationFrameScheduler", {
		enumerable: true,
		get: function() {
			return animationFrame_1.animationFrameScheduler;
		}
	});
	var VirtualTimeScheduler_1 = require_VirtualTimeScheduler();
	Object.defineProperty(exports, "VirtualTimeScheduler", {
		enumerable: true,
		get: function() {
			return VirtualTimeScheduler_1.VirtualTimeScheduler;
		}
	});
	Object.defineProperty(exports, "VirtualAction", {
		enumerable: true,
		get: function() {
			return VirtualTimeScheduler_1.VirtualAction;
		}
	});
	var Scheduler_1 = require_Scheduler();
	Object.defineProperty(exports, "Scheduler", {
		enumerable: true,
		get: function() {
			return Scheduler_1.Scheduler;
		}
	});
	var Subscription_1 = require_Subscription();
	Object.defineProperty(exports, "Subscription", {
		enumerable: true,
		get: function() {
			return Subscription_1.Subscription;
		}
	});
	var Subscriber_1 = require_Subscriber();
	Object.defineProperty(exports, "Subscriber", {
		enumerable: true,
		get: function() {
			return Subscriber_1.Subscriber;
		}
	});
	var Notification_1 = require_Notification();
	Object.defineProperty(exports, "Notification", {
		enumerable: true,
		get: function() {
			return Notification_1.Notification;
		}
	});
	Object.defineProperty(exports, "NotificationKind", {
		enumerable: true,
		get: function() {
			return Notification_1.NotificationKind;
		}
	});
	var pipe_1 = require_pipe();
	Object.defineProperty(exports, "pipe", {
		enumerable: true,
		get: function() {
			return pipe_1.pipe;
		}
	});
	var noop_1 = require_noop();
	Object.defineProperty(exports, "noop", {
		enumerable: true,
		get: function() {
			return noop_1.noop;
		}
	});
	var identity_1 = require_identity();
	Object.defineProperty(exports, "identity", {
		enumerable: true,
		get: function() {
			return identity_1.identity;
		}
	});
	var isObservable_1 = require_isObservable();
	Object.defineProperty(exports, "isObservable", {
		enumerable: true,
		get: function() {
			return isObservable_1.isObservable;
		}
	});
	var lastValueFrom_1 = require_lastValueFrom();
	Object.defineProperty(exports, "lastValueFrom", {
		enumerable: true,
		get: function() {
			return lastValueFrom_1.lastValueFrom;
		}
	});
	var firstValueFrom_1 = require_firstValueFrom();
	Object.defineProperty(exports, "firstValueFrom", {
		enumerable: true,
		get: function() {
			return firstValueFrom_1.firstValueFrom;
		}
	});
	var ArgumentOutOfRangeError_1 = require_ArgumentOutOfRangeError();
	Object.defineProperty(exports, "ArgumentOutOfRangeError", {
		enumerable: true,
		get: function() {
			return ArgumentOutOfRangeError_1.ArgumentOutOfRangeError;
		}
	});
	var EmptyError_1 = require_EmptyError();
	Object.defineProperty(exports, "EmptyError", {
		enumerable: true,
		get: function() {
			return EmptyError_1.EmptyError;
		}
	});
	var NotFoundError_1 = require_NotFoundError();
	Object.defineProperty(exports, "NotFoundError", {
		enumerable: true,
		get: function() {
			return NotFoundError_1.NotFoundError;
		}
	});
	var ObjectUnsubscribedError_1 = require_ObjectUnsubscribedError();
	Object.defineProperty(exports, "ObjectUnsubscribedError", {
		enumerable: true,
		get: function() {
			return ObjectUnsubscribedError_1.ObjectUnsubscribedError;
		}
	});
	var SequenceError_1 = require_SequenceError();
	Object.defineProperty(exports, "SequenceError", {
		enumerable: true,
		get: function() {
			return SequenceError_1.SequenceError;
		}
	});
	var timeout_1$1 = require_timeout();
	Object.defineProperty(exports, "TimeoutError", {
		enumerable: true,
		get: function() {
			return timeout_1$1.TimeoutError;
		}
	});
	var UnsubscriptionError_1 = require_UnsubscriptionError();
	Object.defineProperty(exports, "UnsubscriptionError", {
		enumerable: true,
		get: function() {
			return UnsubscriptionError_1.UnsubscriptionError;
		}
	});
	var bindCallback_1 = require_bindCallback();
	Object.defineProperty(exports, "bindCallback", {
		enumerable: true,
		get: function() {
			return bindCallback_1.bindCallback;
		}
	});
	var bindNodeCallback_1 = require_bindNodeCallback();
	Object.defineProperty(exports, "bindNodeCallback", {
		enumerable: true,
		get: function() {
			return bindNodeCallback_1.bindNodeCallback;
		}
	});
	var combineLatest_1$1 = require_combineLatest$1();
	Object.defineProperty(exports, "combineLatest", {
		enumerable: true,
		get: function() {
			return combineLatest_1$1.combineLatest;
		}
	});
	var concat_1$1 = require_concat$1();
	Object.defineProperty(exports, "concat", {
		enumerable: true,
		get: function() {
			return concat_1$1.concat;
		}
	});
	var connectable_1 = require_connectable();
	Object.defineProperty(exports, "connectable", {
		enumerable: true,
		get: function() {
			return connectable_1.connectable;
		}
	});
	var defer_1 = require_defer();
	Object.defineProperty(exports, "defer", {
		enumerable: true,
		get: function() {
			return defer_1.defer;
		}
	});
	var empty_1 = require_empty();
	Object.defineProperty(exports, "empty", {
		enumerable: true,
		get: function() {
			return empty_1.empty;
		}
	});
	var forkJoin_1 = require_forkJoin();
	Object.defineProperty(exports, "forkJoin", {
		enumerable: true,
		get: function() {
			return forkJoin_1.forkJoin;
		}
	});
	var from_1 = require_from();
	Object.defineProperty(exports, "from", {
		enumerable: true,
		get: function() {
			return from_1.from;
		}
	});
	var fromEvent_1 = require_fromEvent();
	Object.defineProperty(exports, "fromEvent", {
		enumerable: true,
		get: function() {
			return fromEvent_1.fromEvent;
		}
	});
	var fromEventPattern_1 = require_fromEventPattern();
	Object.defineProperty(exports, "fromEventPattern", {
		enumerable: true,
		get: function() {
			return fromEventPattern_1.fromEventPattern;
		}
	});
	var generate_1 = require_generate();
	Object.defineProperty(exports, "generate", {
		enumerable: true,
		get: function() {
			return generate_1.generate;
		}
	});
	var iif_1 = require_iif();
	Object.defineProperty(exports, "iif", {
		enumerable: true,
		get: function() {
			return iif_1.iif;
		}
	});
	var interval_1 = require_interval();
	Object.defineProperty(exports, "interval", {
		enumerable: true,
		get: function() {
			return interval_1.interval;
		}
	});
	var merge_1$1 = require_merge$1();
	Object.defineProperty(exports, "merge", {
		enumerable: true,
		get: function() {
			return merge_1$1.merge;
		}
	});
	var never_1 = require_never();
	Object.defineProperty(exports, "never", {
		enumerable: true,
		get: function() {
			return never_1.never;
		}
	});
	var of_1 = require_of();
	Object.defineProperty(exports, "of", {
		enumerable: true,
		get: function() {
			return of_1.of;
		}
	});
	var onErrorResumeNext_1 = require_onErrorResumeNext();
	Object.defineProperty(exports, "onErrorResumeNext", {
		enumerable: true,
		get: function() {
			return onErrorResumeNext_1.onErrorResumeNext;
		}
	});
	var pairs_1 = require_pairs();
	Object.defineProperty(exports, "pairs", {
		enumerable: true,
		get: function() {
			return pairs_1.pairs;
		}
	});
	var partition_1$1 = require_partition$1();
	Object.defineProperty(exports, "partition", {
		enumerable: true,
		get: function() {
			return partition_1$1.partition;
		}
	});
	var race_1$1 = require_race$1();
	Object.defineProperty(exports, "race", {
		enumerable: true,
		get: function() {
			return race_1$1.race;
		}
	});
	var range_1 = require_range();
	Object.defineProperty(exports, "range", {
		enumerable: true,
		get: function() {
			return range_1.range;
		}
	});
	var throwError_1 = require_throwError();
	Object.defineProperty(exports, "throwError", {
		enumerable: true,
		get: function() {
			return throwError_1.throwError;
		}
	});
	var timer_1 = require_timer();
	Object.defineProperty(exports, "timer", {
		enumerable: true,
		get: function() {
			return timer_1.timer;
		}
	});
	var using_1 = require_using();
	Object.defineProperty(exports, "using", {
		enumerable: true,
		get: function() {
			return using_1.using;
		}
	});
	var zip_1$1 = require_zip$1();
	Object.defineProperty(exports, "zip", {
		enumerable: true,
		get: function() {
			return zip_1$1.zip;
		}
	});
	var scheduled_1 = require_scheduled();
	Object.defineProperty(exports, "scheduled", {
		enumerable: true,
		get: function() {
			return scheduled_1.scheduled;
		}
	});
	var empty_2 = require_empty();
	Object.defineProperty(exports, "EMPTY", {
		enumerable: true,
		get: function() {
			return empty_2.EMPTY;
		}
	});
	var never_2 = require_never();
	Object.defineProperty(exports, "NEVER", {
		enumerable: true,
		get: function() {
			return never_2.NEVER;
		}
	});
	__exportStar(require_types(), exports);
	var config_1 = require_config();
	Object.defineProperty(exports, "config", {
		enumerable: true,
		get: function() {
			return config_1.config;
		}
	});
	var audit_1$1 = require_audit();
	Object.defineProperty(exports, "audit", {
		enumerable: true,
		get: function() {
			return audit_1$1.audit;
		}
	});
	var auditTime_1$1 = require_auditTime();
	Object.defineProperty(exports, "auditTime", {
		enumerable: true,
		get: function() {
			return auditTime_1$1.auditTime;
		}
	});
	var buffer_1$1 = require_buffer();
	Object.defineProperty(exports, "buffer", {
		enumerable: true,
		get: function() {
			return buffer_1$1.buffer;
		}
	});
	var bufferCount_1$1 = require_bufferCount();
	Object.defineProperty(exports, "bufferCount", {
		enumerable: true,
		get: function() {
			return bufferCount_1$1.bufferCount;
		}
	});
	var bufferTime_1$1 = require_bufferTime();
	Object.defineProperty(exports, "bufferTime", {
		enumerable: true,
		get: function() {
			return bufferTime_1$1.bufferTime;
		}
	});
	var bufferToggle_1$1 = require_bufferToggle();
	Object.defineProperty(exports, "bufferToggle", {
		enumerable: true,
		get: function() {
			return bufferToggle_1$1.bufferToggle;
		}
	});
	var bufferWhen_1$1 = require_bufferWhen();
	Object.defineProperty(exports, "bufferWhen", {
		enumerable: true,
		get: function() {
			return bufferWhen_1$1.bufferWhen;
		}
	});
	var catchError_1$1 = require_catchError();
	Object.defineProperty(exports, "catchError", {
		enumerable: true,
		get: function() {
			return catchError_1$1.catchError;
		}
	});
	var combineAll_1$1 = require_combineAll();
	Object.defineProperty(exports, "combineAll", {
		enumerable: true,
		get: function() {
			return combineAll_1$1.combineAll;
		}
	});
	var combineLatestAll_1$1 = require_combineLatestAll();
	Object.defineProperty(exports, "combineLatestAll", {
		enumerable: true,
		get: function() {
			return combineLatestAll_1$1.combineLatestAll;
		}
	});
	var combineLatestWith_1$1 = require_combineLatestWith();
	Object.defineProperty(exports, "combineLatestWith", {
		enumerable: true,
		get: function() {
			return combineLatestWith_1$1.combineLatestWith;
		}
	});
	var concatAll_1$1 = require_concatAll();
	Object.defineProperty(exports, "concatAll", {
		enumerable: true,
		get: function() {
			return concatAll_1$1.concatAll;
		}
	});
	var concatMap_1$1 = require_concatMap();
	Object.defineProperty(exports, "concatMap", {
		enumerable: true,
		get: function() {
			return concatMap_1$1.concatMap;
		}
	});
	var concatMapTo_1$1 = require_concatMapTo();
	Object.defineProperty(exports, "concatMapTo", {
		enumerable: true,
		get: function() {
			return concatMapTo_1$1.concatMapTo;
		}
	});
	var concatWith_1$1 = require_concatWith();
	Object.defineProperty(exports, "concatWith", {
		enumerable: true,
		get: function() {
			return concatWith_1$1.concatWith;
		}
	});
	var connect_1$1 = require_connect();
	Object.defineProperty(exports, "connect", {
		enumerable: true,
		get: function() {
			return connect_1$1.connect;
		}
	});
	var count_1$1 = require_count();
	Object.defineProperty(exports, "count", {
		enumerable: true,
		get: function() {
			return count_1$1.count;
		}
	});
	var debounce_1$1 = require_debounce();
	Object.defineProperty(exports, "debounce", {
		enumerable: true,
		get: function() {
			return debounce_1$1.debounce;
		}
	});
	var debounceTime_1$1 = require_debounceTime();
	Object.defineProperty(exports, "debounceTime", {
		enumerable: true,
		get: function() {
			return debounceTime_1$1.debounceTime;
		}
	});
	var defaultIfEmpty_1$1 = require_defaultIfEmpty();
	Object.defineProperty(exports, "defaultIfEmpty", {
		enumerable: true,
		get: function() {
			return defaultIfEmpty_1$1.defaultIfEmpty;
		}
	});
	var delay_1$1 = require_delay();
	Object.defineProperty(exports, "delay", {
		enumerable: true,
		get: function() {
			return delay_1$1.delay;
		}
	});
	var delayWhen_1$1 = require_delayWhen();
	Object.defineProperty(exports, "delayWhen", {
		enumerable: true,
		get: function() {
			return delayWhen_1$1.delayWhen;
		}
	});
	var dematerialize_1$1 = require_dematerialize();
	Object.defineProperty(exports, "dematerialize", {
		enumerable: true,
		get: function() {
			return dematerialize_1$1.dematerialize;
		}
	});
	var distinct_1$1 = require_distinct();
	Object.defineProperty(exports, "distinct", {
		enumerable: true,
		get: function() {
			return distinct_1$1.distinct;
		}
	});
	var distinctUntilChanged_1$1 = require_distinctUntilChanged();
	Object.defineProperty(exports, "distinctUntilChanged", {
		enumerable: true,
		get: function() {
			return distinctUntilChanged_1$1.distinctUntilChanged;
		}
	});
	var distinctUntilKeyChanged_1$1 = require_distinctUntilKeyChanged();
	Object.defineProperty(exports, "distinctUntilKeyChanged", {
		enumerable: true,
		get: function() {
			return distinctUntilKeyChanged_1$1.distinctUntilKeyChanged;
		}
	});
	var elementAt_1$1 = require_elementAt();
	Object.defineProperty(exports, "elementAt", {
		enumerable: true,
		get: function() {
			return elementAt_1$1.elementAt;
		}
	});
	var endWith_1$1 = require_endWith();
	Object.defineProperty(exports, "endWith", {
		enumerable: true,
		get: function() {
			return endWith_1$1.endWith;
		}
	});
	var every_1$1 = require_every();
	Object.defineProperty(exports, "every", {
		enumerable: true,
		get: function() {
			return every_1$1.every;
		}
	});
	var exhaust_1$1 = require_exhaust();
	Object.defineProperty(exports, "exhaust", {
		enumerable: true,
		get: function() {
			return exhaust_1$1.exhaust;
		}
	});
	var exhaustAll_1$1 = require_exhaustAll();
	Object.defineProperty(exports, "exhaustAll", {
		enumerable: true,
		get: function() {
			return exhaustAll_1$1.exhaustAll;
		}
	});
	var exhaustMap_1$1 = require_exhaustMap();
	Object.defineProperty(exports, "exhaustMap", {
		enumerable: true,
		get: function() {
			return exhaustMap_1$1.exhaustMap;
		}
	});
	var expand_1$1 = require_expand();
	Object.defineProperty(exports, "expand", {
		enumerable: true,
		get: function() {
			return expand_1$1.expand;
		}
	});
	var filter_1$2 = require_filter();
	Object.defineProperty(exports, "filter", {
		enumerable: true,
		get: function() {
			return filter_1$2.filter;
		}
	});
	var finalize_1$1 = require_finalize();
	Object.defineProperty(exports, "finalize", {
		enumerable: true,
		get: function() {
			return finalize_1$1.finalize;
		}
	});
	var find_1$1 = require_find();
	Object.defineProperty(exports, "find", {
		enumerable: true,
		get: function() {
			return find_1$1.find;
		}
	});
	var findIndex_1$1 = require_findIndex();
	Object.defineProperty(exports, "findIndex", {
		enumerable: true,
		get: function() {
			return findIndex_1$1.findIndex;
		}
	});
	var first_1$1 = require_first();
	Object.defineProperty(exports, "first", {
		enumerable: true,
		get: function() {
			return first_1$1.first;
		}
	});
	var groupBy_1$1 = require_groupBy();
	Object.defineProperty(exports, "groupBy", {
		enumerable: true,
		get: function() {
			return groupBy_1$1.groupBy;
		}
	});
	var ignoreElements_1$1 = require_ignoreElements();
	Object.defineProperty(exports, "ignoreElements", {
		enumerable: true,
		get: function() {
			return ignoreElements_1$1.ignoreElements;
		}
	});
	var isEmpty_1$1 = require_isEmpty();
	Object.defineProperty(exports, "isEmpty", {
		enumerable: true,
		get: function() {
			return isEmpty_1$1.isEmpty;
		}
	});
	var last_1$1 = require_last();
	Object.defineProperty(exports, "last", {
		enumerable: true,
		get: function() {
			return last_1$1.last;
		}
	});
	var map_1$1 = require_map();
	Object.defineProperty(exports, "map", {
		enumerable: true,
		get: function() {
			return map_1$1.map;
		}
	});
	var mapTo_1$1 = require_mapTo();
	Object.defineProperty(exports, "mapTo", {
		enumerable: true,
		get: function() {
			return mapTo_1$1.mapTo;
		}
	});
	var materialize_1$1 = require_materialize();
	Object.defineProperty(exports, "materialize", {
		enumerable: true,
		get: function() {
			return materialize_1$1.materialize;
		}
	});
	var max_1$1 = require_max();
	Object.defineProperty(exports, "max", {
		enumerable: true,
		get: function() {
			return max_1$1.max;
		}
	});
	var mergeAll_1$1 = require_mergeAll();
	Object.defineProperty(exports, "mergeAll", {
		enumerable: true,
		get: function() {
			return mergeAll_1$1.mergeAll;
		}
	});
	var flatMap_1$1 = require_flatMap();
	Object.defineProperty(exports, "flatMap", {
		enumerable: true,
		get: function() {
			return flatMap_1$1.flatMap;
		}
	});
	var mergeMap_1$1 = require_mergeMap();
	Object.defineProperty(exports, "mergeMap", {
		enumerable: true,
		get: function() {
			return mergeMap_1$1.mergeMap;
		}
	});
	var mergeMapTo_1$1 = require_mergeMapTo();
	Object.defineProperty(exports, "mergeMapTo", {
		enumerable: true,
		get: function() {
			return mergeMapTo_1$1.mergeMapTo;
		}
	});
	var mergeScan_1$1 = require_mergeScan();
	Object.defineProperty(exports, "mergeScan", {
		enumerable: true,
		get: function() {
			return mergeScan_1$1.mergeScan;
		}
	});
	var mergeWith_1$1 = require_mergeWith();
	Object.defineProperty(exports, "mergeWith", {
		enumerable: true,
		get: function() {
			return mergeWith_1$1.mergeWith;
		}
	});
	var min_1$1 = require_min();
	Object.defineProperty(exports, "min", {
		enumerable: true,
		get: function() {
			return min_1$1.min;
		}
	});
	var multicast_1$1 = require_multicast();
	Object.defineProperty(exports, "multicast", {
		enumerable: true,
		get: function() {
			return multicast_1$1.multicast;
		}
	});
	var observeOn_1$1 = require_observeOn();
	Object.defineProperty(exports, "observeOn", {
		enumerable: true,
		get: function() {
			return observeOn_1$1.observeOn;
		}
	});
	var onErrorResumeNextWith_1$1 = require_onErrorResumeNextWith();
	Object.defineProperty(exports, "onErrorResumeNextWith", {
		enumerable: true,
		get: function() {
			return onErrorResumeNextWith_1$1.onErrorResumeNextWith;
		}
	});
	var pairwise_1$1 = require_pairwise();
	Object.defineProperty(exports, "pairwise", {
		enumerable: true,
		get: function() {
			return pairwise_1$1.pairwise;
		}
	});
	var pluck_1$1 = require_pluck();
	Object.defineProperty(exports, "pluck", {
		enumerable: true,
		get: function() {
			return pluck_1$1.pluck;
		}
	});
	var publish_1$1 = require_publish();
	Object.defineProperty(exports, "publish", {
		enumerable: true,
		get: function() {
			return publish_1$1.publish;
		}
	});
	var publishBehavior_1$1 = require_publishBehavior();
	Object.defineProperty(exports, "publishBehavior", {
		enumerable: true,
		get: function() {
			return publishBehavior_1$1.publishBehavior;
		}
	});
	var publishLast_1$1 = require_publishLast();
	Object.defineProperty(exports, "publishLast", {
		enumerable: true,
		get: function() {
			return publishLast_1$1.publishLast;
		}
	});
	var publishReplay_1$1 = require_publishReplay();
	Object.defineProperty(exports, "publishReplay", {
		enumerable: true,
		get: function() {
			return publishReplay_1$1.publishReplay;
		}
	});
	var raceWith_1$2 = require_raceWith();
	Object.defineProperty(exports, "raceWith", {
		enumerable: true,
		get: function() {
			return raceWith_1$2.raceWith;
		}
	});
	var reduce_1$1 = require_reduce();
	Object.defineProperty(exports, "reduce", {
		enumerable: true,
		get: function() {
			return reduce_1$1.reduce;
		}
	});
	var repeat_1$1 = require_repeat();
	Object.defineProperty(exports, "repeat", {
		enumerable: true,
		get: function() {
			return repeat_1$1.repeat;
		}
	});
	var repeatWhen_1$1 = require_repeatWhen();
	Object.defineProperty(exports, "repeatWhen", {
		enumerable: true,
		get: function() {
			return repeatWhen_1$1.repeatWhen;
		}
	});
	var retry_1$1 = require_retry();
	Object.defineProperty(exports, "retry", {
		enumerable: true,
		get: function() {
			return retry_1$1.retry;
		}
	});
	var retryWhen_1$1 = require_retryWhen();
	Object.defineProperty(exports, "retryWhen", {
		enumerable: true,
		get: function() {
			return retryWhen_1$1.retryWhen;
		}
	});
	var refCount_1$1 = require_refCount();
	Object.defineProperty(exports, "refCount", {
		enumerable: true,
		get: function() {
			return refCount_1$1.refCount;
		}
	});
	var sample_1$1 = require_sample();
	Object.defineProperty(exports, "sample", {
		enumerable: true,
		get: function() {
			return sample_1$1.sample;
		}
	});
	var sampleTime_1$1 = require_sampleTime();
	Object.defineProperty(exports, "sampleTime", {
		enumerable: true,
		get: function() {
			return sampleTime_1$1.sampleTime;
		}
	});
	var scan_1$1 = require_scan();
	Object.defineProperty(exports, "scan", {
		enumerable: true,
		get: function() {
			return scan_1$1.scan;
		}
	});
	var sequenceEqual_1$1 = require_sequenceEqual();
	Object.defineProperty(exports, "sequenceEqual", {
		enumerable: true,
		get: function() {
			return sequenceEqual_1$1.sequenceEqual;
		}
	});
	var share_1$1 = require_share();
	Object.defineProperty(exports, "share", {
		enumerable: true,
		get: function() {
			return share_1$1.share;
		}
	});
	var shareReplay_1$1 = require_shareReplay();
	Object.defineProperty(exports, "shareReplay", {
		enumerable: true,
		get: function() {
			return shareReplay_1$1.shareReplay;
		}
	});
	var single_1$1 = require_single();
	Object.defineProperty(exports, "single", {
		enumerable: true,
		get: function() {
			return single_1$1.single;
		}
	});
	var skip_1$1 = require_skip();
	Object.defineProperty(exports, "skip", {
		enumerable: true,
		get: function() {
			return skip_1$1.skip;
		}
	});
	var skipLast_1$1 = require_skipLast();
	Object.defineProperty(exports, "skipLast", {
		enumerable: true,
		get: function() {
			return skipLast_1$1.skipLast;
		}
	});
	var skipUntil_1$1 = require_skipUntil();
	Object.defineProperty(exports, "skipUntil", {
		enumerable: true,
		get: function() {
			return skipUntil_1$1.skipUntil;
		}
	});
	var skipWhile_1$1 = require_skipWhile();
	Object.defineProperty(exports, "skipWhile", {
		enumerable: true,
		get: function() {
			return skipWhile_1$1.skipWhile;
		}
	});
	var startWith_1$1 = require_startWith();
	Object.defineProperty(exports, "startWith", {
		enumerable: true,
		get: function() {
			return startWith_1$1.startWith;
		}
	});
	var subscribeOn_1$1 = require_subscribeOn();
	Object.defineProperty(exports, "subscribeOn", {
		enumerable: true,
		get: function() {
			return subscribeOn_1$1.subscribeOn;
		}
	});
	var switchAll_1$1 = require_switchAll();
	Object.defineProperty(exports, "switchAll", {
		enumerable: true,
		get: function() {
			return switchAll_1$1.switchAll;
		}
	});
	var switchMap_1$1 = require_switchMap();
	Object.defineProperty(exports, "switchMap", {
		enumerable: true,
		get: function() {
			return switchMap_1$1.switchMap;
		}
	});
	var switchMapTo_1$1 = require_switchMapTo();
	Object.defineProperty(exports, "switchMapTo", {
		enumerable: true,
		get: function() {
			return switchMapTo_1$1.switchMapTo;
		}
	});
	var switchScan_1$1 = require_switchScan();
	Object.defineProperty(exports, "switchScan", {
		enumerable: true,
		get: function() {
			return switchScan_1$1.switchScan;
		}
	});
	var take_1$1 = require_take();
	Object.defineProperty(exports, "take", {
		enumerable: true,
		get: function() {
			return take_1$1.take;
		}
	});
	var takeLast_1$1 = require_takeLast();
	Object.defineProperty(exports, "takeLast", {
		enumerable: true,
		get: function() {
			return takeLast_1$1.takeLast;
		}
	});
	var takeUntil_1$1 = require_takeUntil();
	Object.defineProperty(exports, "takeUntil", {
		enumerable: true,
		get: function() {
			return takeUntil_1$1.takeUntil;
		}
	});
	var takeWhile_1$1 = require_takeWhile();
	Object.defineProperty(exports, "takeWhile", {
		enumerable: true,
		get: function() {
			return takeWhile_1$1.takeWhile;
		}
	});
	var tap_1$1 = require_tap();
	Object.defineProperty(exports, "tap", {
		enumerable: true,
		get: function() {
			return tap_1$1.tap;
		}
	});
	var throttle_1$1 = require_throttle();
	Object.defineProperty(exports, "throttle", {
		enumerable: true,
		get: function() {
			return throttle_1$1.throttle;
		}
	});
	var throttleTime_1$1 = require_throttleTime();
	Object.defineProperty(exports, "throttleTime", {
		enumerable: true,
		get: function() {
			return throttleTime_1$1.throttleTime;
		}
	});
	var throwIfEmpty_1$1 = require_throwIfEmpty();
	Object.defineProperty(exports, "throwIfEmpty", {
		enumerable: true,
		get: function() {
			return throwIfEmpty_1$1.throwIfEmpty;
		}
	});
	var timeInterval_1$1 = require_timeInterval();
	Object.defineProperty(exports, "timeInterval", {
		enumerable: true,
		get: function() {
			return timeInterval_1$1.timeInterval;
		}
	});
	var timeout_2 = require_timeout();
	Object.defineProperty(exports, "timeout", {
		enumerable: true,
		get: function() {
			return timeout_2.timeout;
		}
	});
	var timeoutWith_1$1 = require_timeoutWith();
	Object.defineProperty(exports, "timeoutWith", {
		enumerable: true,
		get: function() {
			return timeoutWith_1$1.timeoutWith;
		}
	});
	var timestamp_1$1 = require_timestamp();
	Object.defineProperty(exports, "timestamp", {
		enumerable: true,
		get: function() {
			return timestamp_1$1.timestamp;
		}
	});
	var toArray_1$1 = require_toArray();
	Object.defineProperty(exports, "toArray", {
		enumerable: true,
		get: function() {
			return toArray_1$1.toArray;
		}
	});
	var window_1$1 = require_window();
	Object.defineProperty(exports, "window", {
		enumerable: true,
		get: function() {
			return window_1$1.window;
		}
	});
	var windowCount_1$1 = require_windowCount();
	Object.defineProperty(exports, "windowCount", {
		enumerable: true,
		get: function() {
			return windowCount_1$1.windowCount;
		}
	});
	var windowTime_1$1 = require_windowTime();
	Object.defineProperty(exports, "windowTime", {
		enumerable: true,
		get: function() {
			return windowTime_1$1.windowTime;
		}
	});
	var windowToggle_1$1 = require_windowToggle();
	Object.defineProperty(exports, "windowToggle", {
		enumerable: true,
		get: function() {
			return windowToggle_1$1.windowToggle;
		}
	});
	var windowWhen_1$1 = require_windowWhen();
	Object.defineProperty(exports, "windowWhen", {
		enumerable: true,
		get: function() {
			return windowWhen_1$1.windowWhen;
		}
	});
	var withLatestFrom_1$1 = require_withLatestFrom();
	Object.defineProperty(exports, "withLatestFrom", {
		enumerable: true,
		get: function() {
			return withLatestFrom_1$1.withLatestFrom;
		}
	});
	var zipAll_1$1 = require_zipAll();
	Object.defineProperty(exports, "zipAll", {
		enumerable: true,
		get: function() {
			return zipAll_1$1.zipAll;
		}
	});
	var zipWith_1$1 = require_zipWith();
	Object.defineProperty(exports, "zipWith", {
		enumerable: true,
		get: function() {
			return zipWith_1$1.zipWith;
		}
	});
}));

//#endregion
//#region src/behaviors/Destroyable.ts
var import_cjs$22 = require_cjs();
var Destroyable = class {
	constructor() {
		this.destroyed$ = new import_cjs$22.Subject();
		this.subscriptions = [];
		this.subjects = [];
	}
	destroy() {
		this.subscriptions.forEach((sub) => sub.unsubscribe());
		this.subjects.forEach((subject) => subject.complete());
		this.destroyed$.next();
		this.destroyed$.complete();
	}
	subscribeTo(observable, observerOrNext) {
		const subscription = observable.subscribe(observerOrNext);
		this.subscriptions.push(subscription);
	}
	createSubject() {
		const subject = new import_cjs$22.Subject();
		this.subjects.push(subject);
		return subject;
	}
	createReplaySubject(bufferSize, windowTime$1) {
		const subject = new import_cjs$22.ReplaySubject(bufferSize, windowTime$1);
		this.subjects.push(subject);
		return subject;
	}
	createBehaviorSubject(initialValue) {
		const subject = new import_cjs$22.BehaviorSubject(initialValue);
		this.subjects.push(subject);
		return subject;
	}
	get $() {
		return (0, import_cjs$22.merge)(...this.subjects.map((s) => s instanceof import_cjs$22.BehaviorSubject ? s.pipe((0, import_cjs$22.skip)(1)) : s)).pipe((0, import_cjs$22.map)((_) => this));
	}
};

//#endregion
//#region src/core/errors.ts
var UnexpectedError = class extends Error {
	constructor(at, options) {
		super(`Unexpected Error${at ? ` at ${at}` : ""}`, options);
		this.at = at;
		this.name = "UnexpectedError";
	}
};
var UnimplementedError = class extends Error {
	constructor(reason = "Not Implemented", options) {
		super(reason, options);
		this.reason = reason;
		this.name = "UnimplementedError";
	}
};
var InvalidCredentialsError = class extends Error {
	constructor(reason = "Invalid Credentials", options) {
		super(reason, options);
		this.reason = reason;
		this.name = "InvalidCredentialsError";
	}
};
var WebSocketConnectionError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.name = "WebSocketConnectionError";
	}
};
var TransportConnectionError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.name = "TransportConnectionError";
	}
};
var WebSocketTimeoutError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.name = "WebSocketTimeoutError";
	}
};
var RequestTimeoutError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.name = "RequestTimeoutError";
	}
};
var RequestError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.name = "RequestError";
	}
};
var RPCTimeoutError = class extends Error {
	constructor(requestId, timeoutMs, options) {
		super(`RPC request ${requestId} timed out after ${timeoutMs}ms`, options);
		this.requestId = requestId;
		this.timeoutMs = timeoutMs;
		this.name = "RPCTimeoutError";
	}
};
var AuthStateHandlerError = class extends Error {
	constructor(error = null, options) {
		super("Error handling authorization state update", {
			...options,
			cause: options?.cause ?? (error instanceof Error ? error : void 0)
		});
		this.error = error;
		this.name = "AuthStateHandlerError";
	}
};
var StorageNotAvailableError = class extends Error {
	constructor(storageType = "localStorage", options) {
		super(`${storageType} is not available in this environment`, options);
		this.storageType = storageType;
		this.name = "StorageNotAvailableError";
	}
};
var SerializationError = class extends Error {
	constructor(key, originalError) {
		super(`Failed to serialize value for key "${key}": ${originalError.message}`, { cause: originalError });
		this.key = key;
		this.originalError = originalError;
		this.name = "SerializationError";
	}
};
var DeserializationError = class extends Error {
	constructor(key, originalError) {
		super(`Failed to deserialize value for key "${key}": ${originalError.message}`, { cause: originalError });
		this.key = key;
		this.originalError = originalError;
		this.name = "DeserializationError";
	}
};
var StorageWriteError = class extends Error {
	constructor(key, originalError) {
		super(`Failed to write to storage for key "${key}": ${originalError.message}`, { cause: originalError });
		this.key = key;
		this.originalError = originalError;
		this.name = "StorageWriteError";
	}
};
var StorageReadError = class extends Error {
	constructor(key, originalError) {
		super(`Failed to read from storage "${key}": ${originalError.message}`, { cause: originalError });
		this.key = key;
		this.originalError = originalError;
		this.name = "StorageReadError";
	}
};
var DependencyError = class extends Error {
	constructor(description, options) {
		super(`Dependency ${description} is not set or available.`, options);
		this.description = description;
		this.name = "DependencyError";
	}
};
var CallCreateError = class extends Error {
	constructor(message, error = null, options) {
		super(message, {
			...options,
			cause: options?.cause ?? (error instanceof Error ? error : void 0)
		});
		this.message = message;
		this.error = error;
		this.name = "CallCreateError";
	}
};
var JSONRPCError = class extends Error {
	constructor(code, message, data, options) {
		super(message, options);
		this.code = code;
		this.data = data;
		this.name = "JSONRPCError";
	}
};
var InvalidParams = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.message = message;
		this.name = "InvalidParams";
	}
};
var ConversationError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.message = message;
		this.name = "ConversationError";
	}
};
var VertoInviteHandlerError = class extends Error {
	constructor(error = null, options) {
		super("Error handling Verto invite", {
			...options,
			cause: options?.cause ?? (error instanceof Error ? error : void 0)
		});
		this.error = error;
		this.name = "VertoInviteHandlerError";
	}
};
var ValidationError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.name = "ValidationError";
	}
};
var VertoPongError = class extends Error {
	constructor(originalError) {
		super("Failed to send Verto pong - call may disconnect", { cause: originalError instanceof Error ? originalError : void 0 });
		this.originalError = originalError;
		this.name = "VertoPongError";
	}
};
var MessageParseError = class extends Error {
	constructor(originalError) {
		super("Failed to parse incoming WebSocket message", { cause: originalError instanceof Error ? originalError : void 0 });
		this.originalError = originalError;
		this.name = "MessageParseError";
	}
};
var CollectionFetchError = class extends Error {
	constructor(operation, originalError) {
		super(`Collection fetch failed during ${operation}`, { cause: originalError instanceof Error ? originalError : void 0 });
		this.operation = operation;
		this.originalError = originalError;
		this.name = "CollectionFetchError";
	}
};
var MediaTrackError = class extends Error {
	constructor(operation, kind, originalError) {
		super(`Media track ${operation} failed for ${kind}`, { cause: originalError instanceof Error ? originalError : void 0 });
		this.operation = operation;
		this.kind = kind;
		this.originalError = originalError;
		this.name = "MediaTrackError";
	}
};

//#endregion
//#region ../../node_modules/loglevel/lib/loglevel.js
var require_loglevel = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(root, definition) {
		"use strict";
		if (typeof define === "function" && define.amd) define(definition);
		else if (typeof module === "object" && module.exports) module.exports = definition();
		else root.log = definition();
	})(exports, function() {
		"use strict";
		var noop$1 = function() {};
		var undefinedType = "undefined";
		var isIE = typeof window !== undefinedType && typeof window.navigator !== undefinedType && /Trident\/|MSIE /.test(window.navigator.userAgent);
		var logMethods = [
			"trace",
			"debug",
			"info",
			"warn",
			"error"
		];
		var _loggersByName = {};
		var defaultLogger$1 = null;
		function bindMethod(obj, methodName) {
			var method = obj[methodName];
			if (typeof method.bind === "function") return method.bind(obj);
			else try {
				return Function.prototype.bind.call(method, obj);
			} catch (e) {
				return function() {
					return Function.prototype.apply.apply(method, [obj, arguments]);
				};
			}
		}
		function traceForIE() {
			if (console.log) if (console.log.apply) console.log.apply(console, arguments);
			else Function.prototype.apply.apply(console.log, [console, arguments]);
			if (console.trace) console.trace();
		}
		function realMethod(methodName) {
			if (methodName === "debug") methodName = "log";
			if (typeof console === undefinedType) return false;
			else if (methodName === "trace" && isIE) return traceForIE;
			else if (console[methodName] !== void 0) return bindMethod(console, methodName);
			else if (console.log !== void 0) return bindMethod(console, "log");
			else return noop$1;
		}
		function replaceLoggingMethods() {
			var level = this.getLevel();
			for (var i = 0; i < logMethods.length; i++) {
				var methodName = logMethods[i];
				this[methodName] = i < level ? noop$1 : this.methodFactory(methodName, level, this.name);
			}
			this.log = this.debug;
			if (typeof console === undefinedType && level < this.levels.SILENT) return "No console available for logging";
		}
		function enableLoggingWhenConsoleArrives(methodName) {
			return function() {
				if (typeof console !== undefinedType) {
					replaceLoggingMethods.call(this);
					this[methodName].apply(this, arguments);
				}
			};
		}
		function defaultMethodFactory(methodName, _level, _loggerName) {
			return realMethod(methodName) || enableLoggingWhenConsoleArrives.apply(this, arguments);
		}
		function Logger(name, factory) {
			var self = this;
			/**
			* The level inherited from a parent logger (or a global default). We
			* cache this here rather than delegating to the parent so that it stays
			* in sync with the actual logging methods that we have installed (the
			* parent could change levels but we might not have rebuilt the loggers
			* in this child yet).
			* @type {number}
			*/
			var inheritedLevel;
			/**
			* The default level for this logger, if any. If set, this overrides
			* `inheritedLevel`.
			* @type {number|null}
			*/
			var defaultLevel;
			/**
			* A user-specific level for this logger. If set, this overrides
			* `defaultLevel`.
			* @type {number|null}
			*/
			var userLevel;
			var storageKey = "loglevel";
			if (typeof name === "string") storageKey += ":" + name;
			else if (typeof name === "symbol") storageKey = void 0;
			function persistLevelIfPossible(levelNum) {
				var levelName = (logMethods[levelNum] || "silent").toUpperCase();
				if (typeof window === undefinedType || !storageKey) return;
				try {
					window.localStorage[storageKey] = levelName;
					return;
				} catch (ignore) {}
				try {
					window.document.cookie = encodeURIComponent(storageKey) + "=" + levelName + ";";
				} catch (ignore) {}
			}
			function getPersistedLevel() {
				var storedLevel;
				if (typeof window === undefinedType || !storageKey) return;
				try {
					storedLevel = window.localStorage[storageKey];
				} catch (ignore) {}
				if (typeof storedLevel === undefinedType) try {
					var cookie = window.document.cookie;
					var cookieName = encodeURIComponent(storageKey);
					var location = cookie.indexOf(cookieName + "=");
					if (location !== -1) storedLevel = /^([^;]+)/.exec(cookie.slice(location + cookieName.length + 1))[1];
				} catch (ignore) {}
				if (self.levels[storedLevel] === void 0) storedLevel = void 0;
				return storedLevel;
			}
			function clearPersistedLevel() {
				if (typeof window === undefinedType || !storageKey) return;
				try {
					window.localStorage.removeItem(storageKey);
				} catch (ignore) {}
				try {
					window.document.cookie = encodeURIComponent(storageKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
				} catch (ignore) {}
			}
			function normalizeLevel(input) {
				var level = input;
				if (typeof level === "string" && self.levels[level.toUpperCase()] !== void 0) level = self.levels[level.toUpperCase()];
				if (typeof level === "number" && level >= 0 && level <= self.levels.SILENT) return level;
				else throw new TypeError("log.setLevel() called with invalid level: " + input);
			}
			self.name = name;
			self.levels = {
				"TRACE": 0,
				"DEBUG": 1,
				"INFO": 2,
				"WARN": 3,
				"ERROR": 4,
				"SILENT": 5
			};
			self.methodFactory = factory || defaultMethodFactory;
			self.getLevel = function() {
				if (userLevel != null) return userLevel;
				else if (defaultLevel != null) return defaultLevel;
				else return inheritedLevel;
			};
			self.setLevel = function(level, persist) {
				userLevel = normalizeLevel(level);
				if (persist !== false) persistLevelIfPossible(userLevel);
				return replaceLoggingMethods.call(self);
			};
			self.setDefaultLevel = function(level) {
				defaultLevel = normalizeLevel(level);
				if (!getPersistedLevel()) self.setLevel(level, false);
			};
			self.resetLevel = function() {
				userLevel = null;
				clearPersistedLevel();
				replaceLoggingMethods.call(self);
			};
			self.enableAll = function(persist) {
				self.setLevel(self.levels.TRACE, persist);
			};
			self.disableAll = function(persist) {
				self.setLevel(self.levels.SILENT, persist);
			};
			self.rebuild = function() {
				if (defaultLogger$1 !== self) inheritedLevel = normalizeLevel(defaultLogger$1.getLevel());
				replaceLoggingMethods.call(self);
				if (defaultLogger$1 === self) for (var childName in _loggersByName) _loggersByName[childName].rebuild();
			};
			inheritedLevel = normalizeLevel(defaultLogger$1 ? defaultLogger$1.getLevel() : "WARN");
			var initialLevel = getPersistedLevel();
			if (initialLevel != null) userLevel = normalizeLevel(initialLevel);
			replaceLoggingMethods.call(self);
		}
		defaultLogger$1 = new Logger();
		defaultLogger$1.getLogger = function getLogger$1(name) {
			if (typeof name !== "symbol" && typeof name !== "string" || name === "") throw new TypeError("You must supply a name when creating a logger.");
			var logger$21 = _loggersByName[name];
			if (!logger$21) logger$21 = _loggersByName[name] = new Logger(name, defaultLogger$1.methodFactory);
			return logger$21;
		};
		var _log = typeof window !== undefinedType ? window.log : void 0;
		defaultLogger$1.noConflict = function() {
			if (typeof window !== undefinedType && window.log === defaultLogger$1) window.log = _log;
			return defaultLogger$1;
		};
		defaultLogger$1.getLoggers = function getLoggers() {
			return _loggersByName;
		};
		defaultLogger$1["default"] = defaultLogger$1;
		return defaultLogger$1;
	});
}));

//#endregion
//#region src/utils/logger.ts
var import_loglevel = /* @__PURE__ */ __toESM(require_loglevel(), 1);
const datetime = () => (/* @__PURE__ */ new Date()).toISOString();
const defaultLogger = import_loglevel.default.getLogger("signalwire");
const originalFactory = defaultLogger.methodFactory;
defaultLogger.methodFactory = (methodName, logLevel, loggerName) => {
	const rawMethod = originalFactory(methodName, logLevel, loggerName);
	return function(...args) {
		args.unshift(datetime(), "-");
		rawMethod.apply(void 0, args);
	};
};
const defaultLoggerLevel = defaultLogger.levels.DEBUG;
defaultLogger.setLevel(defaultLoggerLevel);
let userLogger;
let debugOptions = {};
const getLoggerInstance = () => {
	return userLogger ?? defaultLogger;
};
const shouldStringify = (payload) => {
	if ("method" in payload && payload.method === "signalwire.ping") return false;
	return true;
};
const wsTraffic = ({ type, payload }) => {
	const logger$21 = getLoggerInstance();
	const { logWsTraffic } = debugOptions ?? {};
	if (!logWsTraffic) return;
	const msg = shouldStringify(payload) ? JSON.stringify(payload, null, 2) : payload;
	return logger$21.debug(`${type.toUpperCase()}: \n`, msg, "\n");
};
const getLogger = () => {
	const logger$21 = getLoggerInstance();
	return new Proxy(logger$21, { get(target, prop, receiver) {
		if (prop === "wsTraffic") return wsTraffic;
		return Reflect.get(target, prop, receiver);
	} });
};

//#endregion
//#region src/utils/asyncRetry.ts
const DEFAULT_MAX_RETRIES = 10;
const DEFAULT_INITIAL_DELAY = 100;
const DEFAULT_DELAY_VARIATION = 1;
const increasingDelay = ({ delayLimit: upperDelayLimit = Number.MAX_SAFE_INTEGER, initialDelay = DEFAULT_INITIAL_DELAY, variation = DEFAULT_DELAY_VARIATION }) => {
	if (initialDelay < 0) throw new ValidationError("initialDelay must be gte 0");
	if (upperDelayLimit < 0) throw new ValidationError("upperDelayLimit must be gte 0");
	if (variation < 0) throw new ValidationError("variation must be gte 0");
	if (initialDelay > upperDelayLimit) throw new ValidationError("initialDelay must be lte delayLimit");
	let delay$1 = Math.min(initialDelay, upperDelayLimit);
	return () => {
		if (delay$1 === upperDelayLimit) return upperDelayLimit;
		const currentDelay = delay$1;
		delay$1 = Math.min(delay$1 + variation, upperDelayLimit);
		return currentDelay;
	};
};
const asyncRetry = async ({ asyncCallable, maxRetries: retries = DEFAULT_MAX_RETRIES, delayFn, validator, expectedErrorHandler }) => {
	let remainingAttempts = retries - 1;
	let wait = 0;
	const promiseAttempt = async () => {
		try {
			let result;
			if (wait <= 0) result = await asyncCallable();
			else result = await new Promise((resolve, reject) => setTimeout(() => {
				asyncCallable().then(resolve).catch(reject);
			}, wait));
			if (remainingAttempts) validator?.(result);
			return result;
		} catch (error) {
			if (remainingAttempts-- > 0 && !expectedErrorHandler?.(error)) {
				wait = delayFn?.() ?? 0;
				getLogger().debug(`Retrying request: ${retries - remainingAttempts} of ${retries}`);
				return promiseAttempt();
			} else throw error;
		}
	};
	return promiseAttempt();
};

//#endregion
//#region src/controllers/HTTPRequestController.ts
var import_cjs$21 = require_cjs();
const logger$20 = getLogger();
const GET_PARAMS = {
	method: "GET",
	headers: { Accept: "application/json" }
};
const POST_PARAMS = {
	method: "POST",
	headers: {
		Accept: "application/json",
		"Content-Type": "application/json"
	}
};
var HTTPRequestController = class HTTPRequestController {
	static {
		this.defaultMaxRetries = 3;
	}
	static {
		this.defaultRetryDelayMinMs = 1e3;
	}
	static {
		this.defaultRetryDelayMaxMs = 3e4;
	}
	static {
		this.defaultRequestTimeoutMs = 3e4;
	}
	constructor(baseURL, credential, options = {}) {
		this.baseURL = baseURL;
		this.credential = credential;
		this._responses$ = new import_cjs$21.Subject();
		this._errors$ = new import_cjs$21.Subject();
		this._status$ = new import_cjs$21.BehaviorSubject("idle");
		this.maxRetries = options.maxRetries ?? HTTPRequestController.defaultMaxRetries;
		this.retryDelayMin = options.retryDelayMin ?? HTTPRequestController.defaultRetryDelayMinMs;
		this.retryDelayMax = options.retryDelayMax ?? HTTPRequestController.defaultRetryDelayMaxMs;
		this.requestTimeout = options.requestTimeout ?? HTTPRequestController.defaultRequestTimeoutMs;
	}
	get status$() {
		return this._status$.asObservable();
	}
	get status() {
		return this._status$.value;
	}
	get responses$() {
		return this._responses$.asObservable();
	}
	get errors$() {
		return this._errors$.asObservable();
	}
	async request(request) {
		this._status$.next("requesting");
		try {
			const response = await this.executeWithRetry(request);
			this._status$.next("success");
			this._responses$.next(response);
			return response;
		} catch (error) {
			logger$20.error("[HTTPRequestController] Request error:", error);
			this._status$.next("error");
			const err = error instanceof Error ? error : new Error("HTTP request failed", { cause: error });
			this._errors$.next(err);
			throw err;
		}
	}
	async executeWithRetry(request) {
		const variation = Math.ceil((this.retryDelayMax - this.retryDelayMin) / Math.max(this.maxRetries - 1, 1));
		const delayFn = increasingDelay({
			initialDelay: this.retryDelayMin,
			variation,
			delayLimit: this.retryDelayMax
		});
		return asyncRetry({
			asyncCallable: async () => this.executeRequest(request),
			maxRetries: this.maxRetries,
			delayFn,
			validator: (response) => {
				if (response.status >= 500 && response.status < 600) throw new UnexpectedError(`Server error: ${response.status} ${response.statusText}`);
			}
		});
	}
	async executeRequest(request) {
		const url = this.buildURL(request.url);
		const headers = this.buildHeaders(request.headers);
		const timeout$4 = request.timeout ?? this.requestTimeout;
		logger$20.debug("[HTTPRequestController] Executing request:", {
			method: request.method,
			url,
			headers: Object.keys(headers).reduce((acc, key) => {
				acc[key] = key === "Authorization" ? `${headers[key].substring(0, 20)}...` : headers[key];
				return acc;
			}, {}),
			body: request.body
		});
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), timeout$4);
		try {
			const response = await fetch(url, {
				method: request.method,
				headers,
				body: request.body,
				signal: controller.signal
			});
			clearTimeout(timeoutId);
			const httpResponse = await this.convertResponse(response);
			logger$20.debug("[HTTPRequestController] Response received:", {
				status: response.status,
				statusText: response.statusText,
				headers: [...response.headers.entries()],
				body: httpResponse.body ? httpResponse.body.substring(0, 200) : "(empty)"
			});
			return httpResponse;
		} catch (error) {
			clearTimeout(timeoutId);
			if (error instanceof Error && error.name === "AbortError") throw new RequestTimeoutError(`Request timeout after ${timeout$4}ms`, { cause: error });
			logger$20.error("[HTTPRequestController] Request failed:", error);
			throw error;
		}
	}
	buildURL(url) {
		const urlString = typeof url === "string" ? url : url.toString();
		if (urlString.startsWith("http://") || urlString.startsWith("https://")) return urlString;
		return `${this.baseURL.endsWith("/") ? this.baseURL.slice(0, -1) : this.baseURL}${urlString.startsWith("/") ? urlString : `/${urlString}`}`;
	}
	buildHeaders(requestHeaders) {
		const headers = { ...requestHeaders ?? {} };
		if (this.credential.token) {
			headers.Authorization = `Bearer ${this.credential.token}`;
			logger$20.debug("[HTTPRequestController] Using Bearer token auth, token length:", this.credential.token.length);
		} else logger$20.warn("[HTTPRequestController] No credentials available for authentication");
		return headers;
	}
	async convertResponse(response) {
		const headers = {};
		response.headers.forEach((value, key) => {
			headers[key] = value;
		});
		const bodyText = await response.text();
		return {
			status: response.status,
			statusText: response.statusText,
			headers,
			body: bodyText,
			ok: response.ok,
			url: response.url
		};
	}
};

//#endregion
//#region src/core/constants.ts
const INVITE_VERSION = 1e3;
const DEFAULT_ICE_CANDIDATE_TIMEOUT_MS = 600;
const DEFAULT_ICE_GATHERING_TIMEOUT_MS = 6e3;
const DEFAULT_RECONNECT_CALLS_TIMEOUT_MS = 300 * 1e3;
const DEFAULT_CONNECTION_TIMEOUT_MS = 1e4;
const DEFAULT_RECONNECT_DELAY_MIN_MS = 100;
const DEFAULT_RECONNECT_DELAY_MAX_MS = 3e3;
const DEFAULT_DEVICE_DEBOUNCE_TIME_MS = 1500;
const DEFAULT_DEVICE_POLLING_INTERVAL_MS = 0;

//#endregion
//#region src/utils/time.ts
function fromSecToMs(seconds) {
	return seconds * 1e3;
}
function fromMsToSec(milliseconds) {
	return Math.round(milliseconds / 100) / 10;
}

//#endregion
//#region src/containers/PreferencesContainer.ts
var PreferencesContainer = class PreferencesContainer {
	static get instance() {
		this._instance ??= new PreferencesContainer();
		return this._instance;
	}
	constructor() {
		this.deviceDebounceTime = DEFAULT_DEVICE_DEBOUNCE_TIME_MS;
		this.devicePollingInterval = DEFAULT_DEVICE_POLLING_INTERVAL_MS;
		this.reconnectCallsTimeout = DEFAULT_RECONNECT_CALLS_TIMEOUT_MS;
		this.connectionTimeout = DEFAULT_CONNECTION_TIMEOUT_MS;
		this.reconnectDelayMin = DEFAULT_RECONNECT_DELAY_MIN_MS;
		this.reconnectDelayMax = DEFAULT_RECONNECT_DELAY_MAX_MS;
		this.disableUdpIceServers = false;
		this.relayOnly = false;
		this.iceCandidateTimeout = DEFAULT_ICE_CANDIDATE_TIMEOUT_MS;
		this.iceGatheringTimeout = DEFAULT_ICE_GATHERING_TIMEOUT_MS;
		this.defaultSignalWireOptions = {
			skipConnection: false,
			skipRegister: false,
			reconnectAttachedCalls: false
		};
		this.receiveVideo = true;
		this.receiveAudio = true;
		this.preferredAudioInput = null;
		this.preferredAudioOutput = null;
		this.preferredVideoInput = null;
		this.inviteSubscribeScreenshare = ["video.room.screenshare"];
		this.inviteSubscribeAdditionalDevice = [];
		this.inviteSubscribeMainDevice = [
			"track",
			"destroy",
			"member.updated.videoMuted",
			"layout.changed",
			"room.subscribed",
			"member.updated.audioMuted",
			"media.connected",
			"room.updated",
			"call.joined"
		];
		this.userVariables = {};
		this.enableDeviceMonitoring = true;
	}
	get preferredMediaOptions() {
		return {
			receiveVideo: this.receiveVideo,
			receiveAudio: this.receiveAudio,
			inputAudioDeviceConstraints: this.inputAudioDeviceConstraints,
			inputVideoDeviceConstraints: this.inputVideoDeviceConstraints
		};
	}
	get inputAudioDeviceConstraints() {
		return this._inputAudioDeviceConstraints;
	}
	set inputAudioDeviceConstraints(value) {
		this._inputAudioDeviceConstraints = value;
	}
	get inputVideoDeviceConstraints() {
		return this._inputVideoDeviceConstraints;
	}
	set inputVideoDeviceConstraints(value) {
		this._inputVideoDeviceConstraints = value;
	}
};
/**
* Public preferences API for configuring SDK behavior.
*
* Exposed as {@link SignalWire.preferences}. All timeout values
* are in seconds when accessed through this class.
*/
var ClientPreferences = class {
	/** WebSocket connection timeout in seconds. */
	get connectionTimeout() {
		return PreferencesContainer.instance.connectionTimeout;
	}
	set connectionTimeout(seconds) {
		PreferencesContainer.instance.connectionTimeout = fromSecToMs(seconds);
	}
	/** Timeout for reconnecting to previously attached calls, in seconds. */
	get reconnectCallsTimeout() {
		return fromMsToSec(PreferencesContainer.instance.reconnectCallsTimeout);
	}
	set reconnectCallsTimeout(seconds) {
		PreferencesContainer.instance.reconnectCallsTimeout = fromSecToMs(seconds);
	}
	/** Minimum reconnection backoff delay in seconds. */
	get reconnectDelayMin() {
		return fromMsToSec(PreferencesContainer.instance.reconnectDelayMin);
	}
	set reconnectDelayMin(seconds) {
		PreferencesContainer.instance.reconnectDelayMin = fromSecToMs(seconds);
	}
	/** Maximum reconnection backoff delay in seconds. */
	get reconnectDelayMax() {
		return fromMsToSec(PreferencesContainer.instance.reconnectDelayMax);
	}
	set reconnectDelayMax(seconds) {
		PreferencesContainer.instance.reconnectDelayMax = fromSecToMs(seconds);
	}
	/** Custom relay host URL. Empty string uses the default. */
	get relayHost() {
		return PreferencesContainer.instance.relayHost ?? "";
	}
	set relayHost(value) {
		PreferencesContainer.instance.relayHost = value;
	}
	/** Whether to receive remote video by default. */
	get receiveVideo() {
		return PreferencesContainer.instance.receiveVideo;
	}
	set receiveVideo(value) {
		PreferencesContainer.instance.receiveVideo = value;
	}
	/** Whether to receive remote audio by default. */
	get receiveAudio() {
		return PreferencesContainer.instance.receiveAudio;
	}
	set receiveAudio(value) {
		PreferencesContainer.instance.receiveAudio = value;
	}
	/** Preferred audio input device for new calls. */
	get preferredAudioInput() {
		return PreferencesContainer.instance.preferredAudioInput;
	}
	set preferredAudioInput(value) {
		PreferencesContainer.instance.preferredAudioInput = value;
	}
	/** Preferred audio output device for new calls. */
	get preferredAudioOutput() {
		return PreferencesContainer.instance.preferredAudioOutput;
	}
	set preferredAudioOutput(value) {
		PreferencesContainer.instance.preferredAudioOutput = value;
	}
	/** Preferred video input device for new calls. */
	get preferredVideoInput() {
		return PreferencesContainer.instance.preferredVideoInput;
	}
	set preferredVideoInput(value) {
		PreferencesContainer.instance.preferredVideoInput = value;
	}
	/** Default audio input track constraints. */
	get inputAudioConstraints() {
		return PreferencesContainer.instance.inputAudioDeviceConstraints;
	}
	set inputAudioConstraints(value) {
		PreferencesContainer.instance.inputAudioDeviceConstraints = value;
	}
	/** Default video input track constraints. */
	get inputVideoConstraints() {
		return PreferencesContainer.instance.inputVideoDeviceConstraints;
	}
	set inputVideoConstraints(value) {
		PreferencesContainer.instance.inputVideoDeviceConstraints = value;
	}
	/** Debounce time for device change events, in seconds. */
	get deviceDebounceTime() {
		return fromMsToSec(PreferencesContainer.instance.deviceDebounceTime);
	}
	set deviceDebounceTime(seconds) {
		PreferencesContainer.instance.deviceDebounceTime = fromSecToMs(seconds);
	}
	/** Polling interval for device enumeration, in seconds. */
	get devicePollingInterval() {
		return fromMsToSec(PreferencesContainer.instance.devicePollingInterval);
	}
	set devicePollingInterval(seconds) {
		PreferencesContainer.instance.devicePollingInterval = fromSecToMs(seconds);
	}
	/** Whether to filter out UDP-based ICE servers. */
	get disableUdpIceServers() {
		return PreferencesContainer.instance.disableUdpIceServers;
	}
	set disableUdpIceServers(value) {
		PreferencesContainer.instance.disableUdpIceServers = value;
	}
	/** Whether to force TURN relay-only ICE candidates. */
	get relayOnly() {
		return PreferencesContainer.instance.relayOnly;
	}
	set relayOnly(value) {
		PreferencesContainer.instance.relayOnly = value;
	}
	/** Timeout for individual ICE candidate gathering, in seconds. */
	get iceCandidateTimeout() {
		return fromMsToSec(PreferencesContainer.instance.iceCandidateTimeout);
	}
	set iceCandidateTimeout(seconds) {
		PreferencesContainer.instance.iceCandidateTimeout = fromSecToMs(seconds);
	}
	/** Timeout for the entire ICE gathering phase, in seconds. */
	get iceGatheringTimeout() {
		return fromMsToSec(PreferencesContainer.instance.iceGatheringTimeout);
	}
	set iceGatheringTimeout(seconds) {
		PreferencesContainer.instance.iceGatheringTimeout = fromSecToMs(seconds);
	}
};

//#endregion
//#region src/controllers/NavigatorDeviceController.ts
var import_cjs$20 = require_cjs();
const logger$19 = getLogger();
const initialDevicesState = {
	audioinput: [],
	audiooutput: [],
	videoinput: []
};
const initialSelectedDevicesState = {
	audioinput: null,
	audiooutput: null,
	videoinput: null
};
const selectDevice = (devices = [], selected, preferred) => {
	const available = selected ? Boolean(devices.find((device) => device.deviceId === selected.deviceId || device.label === selected.label)) : true;
	if ((!selected || !available) && devices.length > 0) return (preferred ? devices.find((device) => device.deviceId === preferred.deviceId || device.label === preferred.label) : void 0) ?? devices[0];
	return selected;
};
var NavigatorDeviceController = class extends Destroyable {
	constructor() {
		super();
		this.deviceChangeHandler = () => {
			logger$19.debug("[DeviceController] Device change detected");
			this.enumerateDevices();
		};
		this._devicesState$ = this.createBehaviorSubject(initialDevicesState);
		this._selectedDevicesState$ = this.createBehaviorSubject(initialSelectedDevicesState);
		this._errors$ = this.createSubject();
		this.init();
	}
	get selectedAudioInputDeviceConstraints() {
		return this.deviceInfoToConstraints(this.selectedAudioInputDevice);
	}
	get selectedVideoInputDeviceConstraints() {
		return this.deviceInfoToConstraints(this.selectedVideoInputDevice);
	}
	deviceInfoToConstraints(deviceInfo) {
		if (!deviceInfo?.deviceId || deviceInfo.deviceId.trim() === "") return {};
		const devices = deviceInfo.kind === "audioinput" ? this.audioInputDevices : this.videoInputDevices;
		const device = devices.find((device$1) => device$1.deviceId === deviceInfo.deviceId) ?? devices.find((device$1) => device$1.label === deviceInfo.label);
		if (device) return { deviceId: { exact: device.deviceId } };
		return {};
	}
	get errors$() {
		return this._errors$.asObservable().pipe((0, import_cjs$20.takeUntil)(this.destroyed$));
	}
	get audioInputDevices$() {
		return this._devicesState$.pipe((0, import_cjs$20.map)((state) => state.audioinput), (0, import_cjs$20.distinctUntilChanged)(), (0, import_cjs$20.takeUntil)(this.destroyed$));
	}
	get audioOutputDevices$() {
		return this._devicesState$.pipe((0, import_cjs$20.map)((state) => state.audiooutput), (0, import_cjs$20.distinctUntilChanged)(), (0, import_cjs$20.takeUntil)(this.destroyed$));
	}
	get videoInputDevices$() {
		return this._devicesState$.pipe((0, import_cjs$20.map)((state) => state.videoinput), (0, import_cjs$20.distinctUntilChanged)(), (0, import_cjs$20.takeUntil)(this.destroyed$));
	}
	get selectedAudioInputDevice$() {
		return this._selectedDevicesState$.asObservable().pipe((0, import_cjs$20.map)((state) => state.audioinput), (0, import_cjs$20.distinctUntilChanged)(), (0, import_cjs$20.takeUntil)(this.destroyed$), (0, import_cjs$20.tap)((info) => logger$19.debug("[DeviceController] Selected audio input device changed:", info)));
	}
	get selectedAudioOutputDevice$() {
		return this._selectedDevicesState$.asObservable().pipe((0, import_cjs$20.map)((state) => state.audiooutput), (0, import_cjs$20.distinctUntilChanged)(), (0, import_cjs$20.takeUntil)(this.destroyed$), (0, import_cjs$20.tap)((info) => logger$19.debug("[DeviceController] Selected audio output device changed:", info)));
	}
	get selectedVideoInputDevice$() {
		return this._selectedDevicesState$.asObservable().pipe((0, import_cjs$20.map)((state) => state.videoinput), (0, import_cjs$20.distinctUntilChanged)(), (0, import_cjs$20.takeUntil)(this.destroyed$), (0, import_cjs$20.tap)((info) => logger$19.debug("[DeviceController] Selected video input device changed:", info)));
	}
	get selectedAudioInputDevice() {
		return this._selectedDevicesState$.value.audioinput;
	}
	get selectedAudioOutputDevice() {
		return this._selectedDevicesState$.value.audiooutput;
	}
	get selectedVideoInputDevice() {
		return this._selectedDevicesState$.value.videoinput;
	}
	get audioInputDevices() {
		return this._devicesState$.value.audioinput;
	}
	get audioOutputDevices() {
		return this._devicesState$.value.audiooutput;
	}
	get videoInputDevices() {
		return this._devicesState$.value.videoinput;
	}
	selectAudioInputDevice(device) {
		this._selectedDevicesState$.next({
			...this._selectedDevicesState$.value,
			audioinput: device
		});
	}
	selectVideoInputDevice(device) {
		logger$19.debug("[DeviceController] Setting selected video input device:", device);
		this._selectedDevicesState$.next({
			...this._selectedDevicesState$.value,
			videoinput: device
		});
	}
	selectAudioOutputDevice(device) {
		this._selectedDevicesState$.next({
			...this._selectedDevicesState$.value,
			audiooutput: device
		});
	}
	init() {
		if (navigator.mediaDevices) {
			this.subscribeTo(this._devicesState$.pipe((0, import_cjs$20.debounceTime)(PreferencesContainer.instance.deviceDebounceTime)), (devicesState) => {
				const currentSelected = this._selectedDevicesState$.value;
				const newAudioInput = selectDevice(devicesState.audioinput, currentSelected.audioinput, PreferencesContainer.instance.preferredAudioInput);
				const newAudioOutput = selectDevice(devicesState.audiooutput, currentSelected.audiooutput, PreferencesContainer.instance.preferredAudioOutput);
				const newVideoInput = selectDevice(devicesState.videoinput, currentSelected.videoinput, PreferencesContainer.instance.preferredVideoInput);
				if (newAudioInput !== currentSelected.audioinput || newAudioOutput !== currentSelected.audiooutput || newVideoInput !== currentSelected.videoinput) this._selectedDevicesState$.next({
					audioinput: newAudioInput,
					audiooutput: newAudioOutput,
					videoinput: newVideoInput
				});
			});
			this.enumerateDevices();
		}
	}
	enableDeviceMonitoring() {
		this.disableDeviceMonitoring();
		navigator.mediaDevices.addEventListener("devicechange", this.deviceChangeHandler);
		if (PreferencesContainer.instance.devicePollingInterval > 0) this._devicesPoolingSubscription = (0, import_cjs$20.interval)(PreferencesContainer.instance.devicePollingInterval).subscribe(() => {
			logger$19.debug("[DeviceController] Polling devices due to interval");
			this.enumerateDevices();
		});
		this.enumerateDevices();
	}
	disableDeviceMonitoring() {
		navigator.mediaDevices.removeEventListener("devicechange", this.deviceChangeHandler);
		if (this._devicesPoolingSubscription) {
			this._devicesPoolingSubscription.unsubscribe();
			this._devicesPoolingSubscription = void 0;
		}
	}
	async enumerateDevices() {
		try {
			const devicesByKind = (await navigator.mediaDevices.enumerateDevices()).reduce((acc, device) => {
				acc[device.kind].push(device);
				return acc;
			}, {
				audioinput: [],
				audiooutput: [],
				videoinput: []
			});
			this._devicesState$.next(devicesByKind);
			logger$19.debug("[DeviceController] Devices enumerated:", {
				audioInputs: devicesByKind.audioinput.length,
				audioOutputs: devicesByKind.audiooutput.length,
				videoInputs: devicesByKind.videoinput.length
			});
		} catch (error) {
			logger$19.error("[DeviceController] Failed to enumerate devices:", error);
			this._errors$.next(error);
		}
	}
	destroy() {
		this.disableDeviceMonitoring();
		super.destroy();
	}
};

//#endregion
//#region src/dependencies/DefaultLocalStorage.ts
var DefaultLocalStorage = class {
	constructor() {
		if (typeof localStorage === "undefined") throw new StorageNotAvailableError("localStorage");
		if (typeof sessionStorage === "undefined") throw new StorageNotAvailableError("sessionStorage");
		try {
			const testKey = "__storage_test__";
			localStorage.setItem(testKey, "test");
			localStorage.removeItem(testKey);
		} catch (error) {
			getLogger().error("LocalStorage is not accessible:", error);
			throw new StorageNotAvailableError("localStorage");
		}
	}
	storage(scope) {
		return scope === "local" ? localStorage : sessionStorage;
	}
	async setItem(key, value, scope = "session") {
		this.storage(scope).setItem(key, value);
		return Promise.resolve();
	}
	async getItem(key, scope = "session") {
		return Promise.resolve(this.storage(scope).getItem(key));
	}
	async removeItem(key, scope = "session") {
		this.storage(scope).removeItem(key);
		return Promise.resolve();
	}
};

//#endregion
//#region src/managers/StorageManager.ts
var StorageManager = class {
	constructor(storageImpl = new DefaultLocalStorage()) {
		this.storageImpl = storageImpl;
	}
	/**
	* Validates that a value can be safely serialized to JSON
	* @throws SerializationError if value contains non-serializable types
	*/
	serialize(value, key) {
		if (value === void 0 || value === null) return null;
		try {
			return JSON.stringify(value);
		} catch (e) {
			throw new SerializationError(key ?? "unknown", e);
		}
	}
	/**
	* Stores a value in storage
	* @throws InvalidStorageValueError if value contains non-serializable types
	* @throws SerializationError if JSON serialization fails
	* @throws StorageWriteError if writing to storage fails
	*/
	async setItem(key, value, scope = "session") {
		const serialized = this.serialize(value, key);
		try {
			await this.storageImpl.setItem(key, serialized, scope);
		} catch (error) {
			throw new StorageWriteError(key, error);
		}
	}
	/**
	* Retrieves a value from storage
	*
	* This method distinguishes between:
	* - Storage errors (network, permission, etc.) - these are thrown
	* - JSON parse errors - these trigger onParseError and return raw string
	* - Missing keys - returns null
	*
	* @returns The parsed value, raw string (on parse error), or null
	* @throws StorageReadError
	*/
	async getItem(key, scope = "session") {
		let item;
		try {
			item = await this.storageImpl.getItem(key, scope);
		} catch (error) {
			throw new StorageReadError(key, error);
		}
		if (!item) return null;
		try {
			return JSON.parse(item);
		} catch (error) {
			throw new DeserializationError(key, error);
		}
	}
	/**
	* Removes a value from storage
	* @throws Error from underlying storage implementation
	*/
	async removeItem(key, scope = "session") {
		try {
			await this.storageImpl.removeItem(key, scope);
		} catch (error) {
			throw new StorageWriteError(key, error);
		}
	}
};

//#endregion
//#region src/containers/DependencyContainer.ts
var DependencyContainer = class {
	constructor() {
		this._webSocketConstructor = typeof WebSocket !== "undefined" ? WebSocket : void 0;
		this._baseURL = this.apiHost;
		this._credential = {};
	}
	get subscriberId() {
		return this.subscriber.id;
	}
	get subscriber() {
		if (!this._subscriber) throw new DependencyError("Subscriber");
		return this._subscriber;
	}
	set subscriber(subscriber) {
		this._subscriber = subscriber;
	}
	get storage() {
		if (!this._storageManager) {
			this._storageImpl ??= new DefaultLocalStorage();
			this._storageManager = new StorageManager(this._storageImpl);
		}
		return this._storageManager;
	}
	get http() {
		this._httpRequestController ??= new HTTPRequestController(this._baseURL, this._credential);
		return this._httpRequestController;
	}
	get conversationManager() {
		if (!this._conversationManager) throw new DependencyError("ConversationsManager");
		return this._conversationManager;
	}
	set conversationManager(conversationManager) {
		this._conversationManager = conversationManager;
	}
	get WebSocket() {
		if (!this._webSocketConstructor) throw new DependencyError("WebSocket constructor");
		return this._webSocketConstructor;
	}
	set WebSocket(WebSocketConstructor) {
		this._webSocketConstructor = WebSocketConstructor;
	}
	get deviceController() {
		this._deviceController ??= new NavigatorDeviceController();
		return this._deviceController;
	}
	get authorizationStateKey() {
		return `sw:${this.subscriberId}:as`;
	}
	get protocolKey() {
		return `sw:${this.subscriberId}:pt`;
	}
	get attachedCallsKey() {
		return `sw:${this.subscriberId}:att`;
	}
	getSubscriberFromAddressId() {
		return this.subscriber.addresses[0]?.id ?? "";
	}
	set baseURL(baseURL) {
		this._baseURL = baseURL;
		this._httpRequestController = void 0;
	}
	get credential() {
		return this._credential;
	}
	set credential(credential) {
		this._credential = credential;
		this._httpRequestController = void 0;
	}
	set storageImpl(storageImpl) {
		this._storageImpl = storageImpl;
		this._storageManager = void 0;
	}
	set ch(ch) {
		if (!ch) return;
		const firstDot = ch.indexOf(".");
		if (firstDot !== -1) {
			this._host = ch.substring(0, firstDot);
			this._domain = ch.substring(firstDot + 1);
		}
	}
	get relayHost() {
		return `wss://${this._host ?? "puc"}.${this._domain ?? "signalwire.com"}`;
	}
	get apiHost() {
		return `https://${this._host ?? "fabric"}.${this._domain ?? "signalwire.com"}`;
	}
};

//#endregion
//#region src/behaviors/Fetchable.ts
var import_cjs$19 = require_cjs();
var Fetchable = class extends Destroyable {
	constructor(fromPath, http) {
		super();
		this.fromPath = fromPath;
		this.http = http;
		this.fetched$ = (0, import_cjs$19.defer)(() => (0, import_cjs$19.from)(this.fetch())).pipe((0, import_cjs$19.shareReplay)(1), (0, import_cjs$19.takeUntil)(this.destroyed$));
	}
	async fetch() {
		const response = await this.http.request({
			url: this.fromPath,
			method: "GET",
			headers: { Accept: "application/json" }
		});
		if (response.ok && response.body) {
			const data = JSON.parse(response.body);
			this.populateInstance(data);
			return true;
		}
		return false;
	}
};

//#endregion
//#region src/core/entities/Subscriber.ts
/**
* Authenticated subscriber profile.
*
* Fetched automatically when a {@link SignalWire} connects.
* Contains identity, contact, and organization details.
*/
var Subscriber = class extends Fetchable {
	constructor(http) {
		super("/api/fabric/subscriber/info", http);
	}
	populateInstance(data) {
		this.id = data.id;
		this.email = data.email;
		this.firstName = data.first_name;
		this.lastName = data.last_name;
		this.displayName = data.display_name;
		this.jobTitle = data.job_title;
		this.timeZone = data.time_zone;
		this.country = data.country;
		this.region = data.region;
		this.companyName = data.company_name;
		this.pushNotificationKey = data.push_notification_key;
		this.appSettings = data.app_settings ? {
			displayName: data.app_settings.display_name,
			scopes: data.app_settings.scopes
		} : void 0;
		this.addresses = data.fabric_addresses;
	}
};

//#endregion
//#region ../../node_modules/uuid/dist-node/stringify.js
const byteToHex = [];
for (let i = 0; i < 256; ++i) byteToHex.push((i + 256).toString(16).slice(1));
function unsafeStringify(arr, offset = 0) {
	return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}

//#endregion
//#region ../../node_modules/uuid/dist-node/rng.js
const rnds8Pool = new Uint8Array(256);
let poolPtr = rnds8Pool.length;
function rng() {
	if (poolPtr > rnds8Pool.length - 16) {
		(0, node_crypto.randomFillSync)(rnds8Pool);
		poolPtr = 0;
	}
	return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

//#endregion
//#region ../../node_modules/uuid/dist-node/native.js
var native_default = { randomUUID: node_crypto.randomUUID };

//#endregion
//#region ../../node_modules/uuid/dist-node/v4.js
function _v4(options, buf, offset) {
	options = options || {};
	const rnds = options.random ?? options.rng?.() ?? rng();
	if (rnds.length < 16) throw new Error("Random bytes length must be >= 16");
	rnds[6] = rnds[6] & 15 | 64;
	rnds[8] = rnds[8] & 63 | 128;
	if (buf) {
		offset = offset || 0;
		if (offset < 0 || offset + 16 > buf.length) throw new RangeError(`UUID byte range ${offset}:${offset + 15} is out of buffer bounds`);
		for (let i = 0; i < 16; ++i) buf[offset + i] = rnds[i];
		return buf;
	}
	return unsafeStringify(rnds);
}
function v4(options, buf, offset) {
	if (native_default.randomUUID && !buf && !options) return native_default.randomUUID();
	return _v4(options, buf, offset);
}
var v4_default = v4;

//#endregion
//#region src/core/RPCMessages/helpers.ts
const buildRPCRequest = (params) => {
	return {
		jsonrpc: "2.0",
		id: params.id ?? v4_default(),
		...params
	};
};
const makeRPCResponse = (params) => {
	return {
		jsonrpc: "2.0",
		...params
	};
};

//#endregion
//#region src/core/RPCMessages/RPCConnect.ts
const DEFAULT_CONNECT_VERSION = {
	major: 4,
	minor: 0,
	revision: 0
};
const RPCConnect = (params) => {
	return buildRPCRequest({
		method: "signalwire.connect",
		params: {
			version: DEFAULT_CONNECT_VERSION,
			event_acks: true,
			...params
		}
	});
};

//#endregion
//#region src/core/RPCMessages/RPCPing.ts
const RPCPingResponse = (id, timestamp$1) => {
	return makeRPCResponse({
		id,
		result: { timestamp: timestamp$1 ?? Date.now() / 1e3 }
	});
};

//#endregion
//#region src/core/RPCMessages/RPCExecute.ts
const RPCExecute = ({ method, params }) => {
	return buildRPCRequest({
		method,
		params
	});
};

//#endregion
//#region src/core/RPCMessages/VertoMessages.ts
const tmpMap = {
	id: "callID",
	destinationNumber: "destination_number",
	remoteCallerName: "remote_caller_id_name",
	remoteCallerNumber: "remote_caller_id_number",
	callerName: "caller_id_name",
	callerNumber: "caller_id_number",
	fromCallAddressId: "from_fabric_address_id"
};
/**
* Translate SDK fields into verto variables
*/
const filterVertoParams = (params) => {
	if (Object.prototype.hasOwnProperty.call(params, "dialogParams")) {
		const { remoteSdp, localStream, remoteStream, ...dialogParams } = params.dialogParams;
		for (const key in tmpMap) if (key && Object.prototype.hasOwnProperty.call(dialogParams, key)) {
			dialogParams[tmpMap[key]] = dialogParams[key];
			delete dialogParams[key];
		}
		params.dialogParams = dialogParams;
	}
	return params;
};
const buildVertoRPCMessage = (method) => {
	return (params = {}) => {
		return buildRPCRequest({
			method,
			params: filterVertoParams(params)
		});
	};
};
const WebrtcVerto = (params) => {
	return buildRPCRequest({
		method: "webrtc.verto",
		params
	});
};
const VertoInvite = buildVertoRPCMessage("verto.invite");
const VertoBye = buildVertoRPCMessage("verto.bye");
const VertoAttach = buildVertoRPCMessage("verto.attach");
const VertoModify = buildVertoRPCMessage("verto.modify");
const VertoInfo = buildVertoRPCMessage("verto.info");
const VertoAnswer = buildVertoRPCMessage("verto.answer");
const VertoSubscribe = buildVertoRPCMessage("verto.subscribe");
const VertoPong = buildVertoRPCMessage("verto.pong");
const VertoByeCauseCodes = {
	NORMAL_CLEARING: "16",
	USER_BUSY: "17",
	MEDIA_TIMEOUT: "804"
};

//#endregion
//#region src/core/RPCMessages/RPCEventAck.ts
const RPCEventAckResponse = (id) => makeRPCResponse({
	id,
	result: {}
});

//#endregion
//#region src/managers/AttachManager.ts
const logger$18 = getLogger();
var AttachManager = class {
	constructor(storage, deviceController, reconnectCallsTimeout, attachKey) {
		this.storage = storage;
		this.deviceController = deviceController;
		this.reconnectCallsTimeout = reconnectCallsTimeout;
		this.attachKey = attachKey;
	}
	async detachAll() {
		const attached = await this.readAttached();
		for (const callId of Object.keys(attached)) await this.detach({
			id: callId,
			mediaDirections: attached[callId].mediaDirections
		});
	}
	setSession(session) {
		this.session = session;
	}
	async readAttached() {
		try {
			return await this.storage.getItem(this.attachKey) ?? {};
		} catch (error) {
			logger$18.warn("[AttachManager] Failed to retrieve attached calls from storage", error);
			return {};
		}
	}
	async writeAttached(attached) {
		try {
			await this.storage.setItem(this.attachKey, attached);
		} catch (error) {
			logger$18.warn("[AttachManager] Failed to write attached calls to storage", error);
		}
	}
	async attach(call) {
		if (!call.to) {
			logger$18.warn("[AttachManager] Skip attach for calls with no destination");
			return;
		}
		const attachment = {
			destination: call.to,
			mediaDirections: call.mediaDirections,
			audioInputDevice: call.mediaDirections.audio !== "inactive" ? this.deviceController.selectedAudioInputDevice : null,
			videoInputDevice: call.mediaDirections.video !== "inactive" ? this.deviceController.selectedVideoInputDevice : null,
			attachedAt: Date.now()
		};
		const attached = await this.readAttached();
		attached[call.id] = attachment;
		await this.writeAttached(attached);
	}
	async detach(call) {
		const attached = await this.readAttached();
		delete attached[call.id];
		await this.writeAttached(attached);
	}
	async flush() {
		await this.writeAttached({});
	}
	async reattachCalls() {
		const attached = await this.readAttached();
		await this.detachExpired();
		for (const [callId, attachment] of Object.entries(attached)) {
			const { destination } = attachment;
			const options = this.buildCallOptions(attachment);
			await this.session.createOutboundCall(destination, {
				callId,
				...options
			});
		}
	}
	buildCallOptions(attachment) {
		const { audio: audioDirection, video: videoDirection } = attachment.mediaDirections;
		const { audioInputDevice, videoInputDevice } = attachment;
		return {
			receiveAudio: audioDirection.includes("recv"),
			receiveVideo: videoDirection.includes("recv"),
			inputAudioDeviceConstraints: {
				audio: audioDirection.includes("send"),
				...this.deviceController.deviceInfoToConstraints(audioInputDevice)
			},
			inputVideoDeviceConstraints: {
				video: videoDirection.includes("send"),
				...this.deviceController.deviceInfoToConstraints(videoInputDevice)
			},
			reattach: true
		};
	}
	async detachExpired() {
		const attached = await this.readAttached();
		const expired = Object.entries(attached).filter(([, attachment]) => {
			const now = Date.now();
			const timeout$4 = this.reconnectCallsTimeout;
			return now - attachment.attachedAt > timeout$4;
		});
		expired.forEach(([callId]) => {
			delete attached[callId];
		});
		if (expired.length > 0) await this.writeAttached(attached);
	}
};

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/partition.js
var require_partition = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.partition = void 0;
	var not_1 = require_not();
	var filter_1$1 = require_filter();
	function partition(predicate, thisArg) {
		return function(source) {
			return [filter_1$1.filter(predicate, thisArg)(source), filter_1$1.filter(not_1.not(predicate, thisArg))(source)];
		};
	}
	exports.partition = partition;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/internal/operators/race.js
var require_race = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __read = exports && exports.__read || function(o, n) {
		var m = typeof Symbol === "function" && o[Symbol.iterator];
		if (!m) return o;
		var i = m.call(o), r, ar = [], e;
		try {
			while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
		} catch (error) {
			e = { error };
		} finally {
			try {
				if (r && !r.done && (m = i["return"])) m.call(i);
			} finally {
				if (e) throw e.error;
			}
		}
		return ar;
	};
	var __spreadArray = exports && exports.__spreadArray || function(to, from$7) {
		for (var i = 0, il = from$7.length, j = to.length; i < il; i++, j++) to[j] = from$7[i];
		return to;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.race = void 0;
	var argsOrArgArray_1 = require_argsOrArgArray();
	var raceWith_1$1 = require_raceWith();
	function race$2() {
		var args = [];
		for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
		return raceWith_1$1.raceWith.apply(void 0, __spreadArray([], __read(argsOrArgArray_1.argsOrArgArray(args))));
	}
	exports.race = race$2;
}));

//#endregion
//#region ../../node_modules/rxjs/dist/cjs/operators/index.js
var require_operators = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.mergeAll = exports.merge = exports.max = exports.materialize = exports.mapTo = exports.map = exports.last = exports.isEmpty = exports.ignoreElements = exports.groupBy = exports.first = exports.findIndex = exports.find = exports.finalize = exports.filter = exports.expand = exports.exhaustMap = exports.exhaustAll = exports.exhaust = exports.every = exports.endWith = exports.elementAt = exports.distinctUntilKeyChanged = exports.distinctUntilChanged = exports.distinct = exports.dematerialize = exports.delayWhen = exports.delay = exports.defaultIfEmpty = exports.debounceTime = exports.debounce = exports.count = exports.connect = exports.concatWith = exports.concatMapTo = exports.concatMap = exports.concatAll = exports.concat = exports.combineLatestWith = exports.combineLatest = exports.combineLatestAll = exports.combineAll = exports.catchError = exports.bufferWhen = exports.bufferToggle = exports.bufferTime = exports.bufferCount = exports.buffer = exports.auditTime = exports.audit = void 0;
	exports.timeInterval = exports.throwIfEmpty = exports.throttleTime = exports.throttle = exports.tap = exports.takeWhile = exports.takeUntil = exports.takeLast = exports.take = exports.switchScan = exports.switchMapTo = exports.switchMap = exports.switchAll = exports.subscribeOn = exports.startWith = exports.skipWhile = exports.skipUntil = exports.skipLast = exports.skip = exports.single = exports.shareReplay = exports.share = exports.sequenceEqual = exports.scan = exports.sampleTime = exports.sample = exports.refCount = exports.retryWhen = exports.retry = exports.repeatWhen = exports.repeat = exports.reduce = exports.raceWith = exports.race = exports.publishReplay = exports.publishLast = exports.publishBehavior = exports.publish = exports.pluck = exports.partition = exports.pairwise = exports.onErrorResumeNext = exports.observeOn = exports.multicast = exports.min = exports.mergeWith = exports.mergeScan = exports.mergeMapTo = exports.mergeMap = exports.flatMap = void 0;
	exports.zipWith = exports.zipAll = exports.zip = exports.withLatestFrom = exports.windowWhen = exports.windowToggle = exports.windowTime = exports.windowCount = exports.window = exports.toArray = exports.timestamp = exports.timeoutWith = exports.timeout = void 0;
	var audit_1 = require_audit();
	Object.defineProperty(exports, "audit", {
		enumerable: true,
		get: function() {
			return audit_1.audit;
		}
	});
	var auditTime_1 = require_auditTime();
	Object.defineProperty(exports, "auditTime", {
		enumerable: true,
		get: function() {
			return auditTime_1.auditTime;
		}
	});
	var buffer_1 = require_buffer();
	Object.defineProperty(exports, "buffer", {
		enumerable: true,
		get: function() {
			return buffer_1.buffer;
		}
	});
	var bufferCount_1 = require_bufferCount();
	Object.defineProperty(exports, "bufferCount", {
		enumerable: true,
		get: function() {
			return bufferCount_1.bufferCount;
		}
	});
	var bufferTime_1 = require_bufferTime();
	Object.defineProperty(exports, "bufferTime", {
		enumerable: true,
		get: function() {
			return bufferTime_1.bufferTime;
		}
	});
	var bufferToggle_1 = require_bufferToggle();
	Object.defineProperty(exports, "bufferToggle", {
		enumerable: true,
		get: function() {
			return bufferToggle_1.bufferToggle;
		}
	});
	var bufferWhen_1 = require_bufferWhen();
	Object.defineProperty(exports, "bufferWhen", {
		enumerable: true,
		get: function() {
			return bufferWhen_1.bufferWhen;
		}
	});
	var catchError_1 = require_catchError();
	Object.defineProperty(exports, "catchError", {
		enumerable: true,
		get: function() {
			return catchError_1.catchError;
		}
	});
	var combineAll_1 = require_combineAll();
	Object.defineProperty(exports, "combineAll", {
		enumerable: true,
		get: function() {
			return combineAll_1.combineAll;
		}
	});
	var combineLatestAll_1 = require_combineLatestAll();
	Object.defineProperty(exports, "combineLatestAll", {
		enumerable: true,
		get: function() {
			return combineLatestAll_1.combineLatestAll;
		}
	});
	var combineLatest_1 = require_combineLatest();
	Object.defineProperty(exports, "combineLatest", {
		enumerable: true,
		get: function() {
			return combineLatest_1.combineLatest;
		}
	});
	var combineLatestWith_1 = require_combineLatestWith();
	Object.defineProperty(exports, "combineLatestWith", {
		enumerable: true,
		get: function() {
			return combineLatestWith_1.combineLatestWith;
		}
	});
	var concat_1 = require_concat();
	Object.defineProperty(exports, "concat", {
		enumerable: true,
		get: function() {
			return concat_1.concat;
		}
	});
	var concatAll_1 = require_concatAll();
	Object.defineProperty(exports, "concatAll", {
		enumerable: true,
		get: function() {
			return concatAll_1.concatAll;
		}
	});
	var concatMap_1 = require_concatMap();
	Object.defineProperty(exports, "concatMap", {
		enumerable: true,
		get: function() {
			return concatMap_1.concatMap;
		}
	});
	var concatMapTo_1 = require_concatMapTo();
	Object.defineProperty(exports, "concatMapTo", {
		enumerable: true,
		get: function() {
			return concatMapTo_1.concatMapTo;
		}
	});
	var concatWith_1 = require_concatWith();
	Object.defineProperty(exports, "concatWith", {
		enumerable: true,
		get: function() {
			return concatWith_1.concatWith;
		}
	});
	var connect_1 = require_connect();
	Object.defineProperty(exports, "connect", {
		enumerable: true,
		get: function() {
			return connect_1.connect;
		}
	});
	var count_1 = require_count();
	Object.defineProperty(exports, "count", {
		enumerable: true,
		get: function() {
			return count_1.count;
		}
	});
	var debounce_1 = require_debounce();
	Object.defineProperty(exports, "debounce", {
		enumerable: true,
		get: function() {
			return debounce_1.debounce;
		}
	});
	var debounceTime_1 = require_debounceTime();
	Object.defineProperty(exports, "debounceTime", {
		enumerable: true,
		get: function() {
			return debounceTime_1.debounceTime;
		}
	});
	var defaultIfEmpty_1 = require_defaultIfEmpty();
	Object.defineProperty(exports, "defaultIfEmpty", {
		enumerable: true,
		get: function() {
			return defaultIfEmpty_1.defaultIfEmpty;
		}
	});
	var delay_1 = require_delay();
	Object.defineProperty(exports, "delay", {
		enumerable: true,
		get: function() {
			return delay_1.delay;
		}
	});
	var delayWhen_1 = require_delayWhen();
	Object.defineProperty(exports, "delayWhen", {
		enumerable: true,
		get: function() {
			return delayWhen_1.delayWhen;
		}
	});
	var dematerialize_1 = require_dematerialize();
	Object.defineProperty(exports, "dematerialize", {
		enumerable: true,
		get: function() {
			return dematerialize_1.dematerialize;
		}
	});
	var distinct_1 = require_distinct();
	Object.defineProperty(exports, "distinct", {
		enumerable: true,
		get: function() {
			return distinct_1.distinct;
		}
	});
	var distinctUntilChanged_1 = require_distinctUntilChanged();
	Object.defineProperty(exports, "distinctUntilChanged", {
		enumerable: true,
		get: function() {
			return distinctUntilChanged_1.distinctUntilChanged;
		}
	});
	var distinctUntilKeyChanged_1 = require_distinctUntilKeyChanged();
	Object.defineProperty(exports, "distinctUntilKeyChanged", {
		enumerable: true,
		get: function() {
			return distinctUntilKeyChanged_1.distinctUntilKeyChanged;
		}
	});
	var elementAt_1 = require_elementAt();
	Object.defineProperty(exports, "elementAt", {
		enumerable: true,
		get: function() {
			return elementAt_1.elementAt;
		}
	});
	var endWith_1 = require_endWith();
	Object.defineProperty(exports, "endWith", {
		enumerable: true,
		get: function() {
			return endWith_1.endWith;
		}
	});
	var every_1 = require_every();
	Object.defineProperty(exports, "every", {
		enumerable: true,
		get: function() {
			return every_1.every;
		}
	});
	var exhaust_1 = require_exhaust();
	Object.defineProperty(exports, "exhaust", {
		enumerable: true,
		get: function() {
			return exhaust_1.exhaust;
		}
	});
	var exhaustAll_1 = require_exhaustAll();
	Object.defineProperty(exports, "exhaustAll", {
		enumerable: true,
		get: function() {
			return exhaustAll_1.exhaustAll;
		}
	});
	var exhaustMap_1 = require_exhaustMap();
	Object.defineProperty(exports, "exhaustMap", {
		enumerable: true,
		get: function() {
			return exhaustMap_1.exhaustMap;
		}
	});
	var expand_1 = require_expand();
	Object.defineProperty(exports, "expand", {
		enumerable: true,
		get: function() {
			return expand_1.expand;
		}
	});
	var filter_1 = require_filter();
	Object.defineProperty(exports, "filter", {
		enumerable: true,
		get: function() {
			return filter_1.filter;
		}
	});
	var finalize_1 = require_finalize();
	Object.defineProperty(exports, "finalize", {
		enumerable: true,
		get: function() {
			return finalize_1.finalize;
		}
	});
	var find_1 = require_find();
	Object.defineProperty(exports, "find", {
		enumerable: true,
		get: function() {
			return find_1.find;
		}
	});
	var findIndex_1 = require_findIndex();
	Object.defineProperty(exports, "findIndex", {
		enumerable: true,
		get: function() {
			return findIndex_1.findIndex;
		}
	});
	var first_1 = require_first();
	Object.defineProperty(exports, "first", {
		enumerable: true,
		get: function() {
			return first_1.first;
		}
	});
	var groupBy_1 = require_groupBy();
	Object.defineProperty(exports, "groupBy", {
		enumerable: true,
		get: function() {
			return groupBy_1.groupBy;
		}
	});
	var ignoreElements_1 = require_ignoreElements();
	Object.defineProperty(exports, "ignoreElements", {
		enumerable: true,
		get: function() {
			return ignoreElements_1.ignoreElements;
		}
	});
	var isEmpty_1 = require_isEmpty();
	Object.defineProperty(exports, "isEmpty", {
		enumerable: true,
		get: function() {
			return isEmpty_1.isEmpty;
		}
	});
	var last_1 = require_last();
	Object.defineProperty(exports, "last", {
		enumerable: true,
		get: function() {
			return last_1.last;
		}
	});
	var map_1 = require_map();
	Object.defineProperty(exports, "map", {
		enumerable: true,
		get: function() {
			return map_1.map;
		}
	});
	var mapTo_1 = require_mapTo();
	Object.defineProperty(exports, "mapTo", {
		enumerable: true,
		get: function() {
			return mapTo_1.mapTo;
		}
	});
	var materialize_1 = require_materialize();
	Object.defineProperty(exports, "materialize", {
		enumerable: true,
		get: function() {
			return materialize_1.materialize;
		}
	});
	var max_1 = require_max();
	Object.defineProperty(exports, "max", {
		enumerable: true,
		get: function() {
			return max_1.max;
		}
	});
	var merge_1 = require_merge();
	Object.defineProperty(exports, "merge", {
		enumerable: true,
		get: function() {
			return merge_1.merge;
		}
	});
	var mergeAll_1 = require_mergeAll();
	Object.defineProperty(exports, "mergeAll", {
		enumerable: true,
		get: function() {
			return mergeAll_1.mergeAll;
		}
	});
	var flatMap_1 = require_flatMap();
	Object.defineProperty(exports, "flatMap", {
		enumerable: true,
		get: function() {
			return flatMap_1.flatMap;
		}
	});
	var mergeMap_1 = require_mergeMap();
	Object.defineProperty(exports, "mergeMap", {
		enumerable: true,
		get: function() {
			return mergeMap_1.mergeMap;
		}
	});
	var mergeMapTo_1 = require_mergeMapTo();
	Object.defineProperty(exports, "mergeMapTo", {
		enumerable: true,
		get: function() {
			return mergeMapTo_1.mergeMapTo;
		}
	});
	var mergeScan_1 = require_mergeScan();
	Object.defineProperty(exports, "mergeScan", {
		enumerable: true,
		get: function() {
			return mergeScan_1.mergeScan;
		}
	});
	var mergeWith_1 = require_mergeWith();
	Object.defineProperty(exports, "mergeWith", {
		enumerable: true,
		get: function() {
			return mergeWith_1.mergeWith;
		}
	});
	var min_1 = require_min();
	Object.defineProperty(exports, "min", {
		enumerable: true,
		get: function() {
			return min_1.min;
		}
	});
	var multicast_1 = require_multicast();
	Object.defineProperty(exports, "multicast", {
		enumerable: true,
		get: function() {
			return multicast_1.multicast;
		}
	});
	var observeOn_1 = require_observeOn();
	Object.defineProperty(exports, "observeOn", {
		enumerable: true,
		get: function() {
			return observeOn_1.observeOn;
		}
	});
	var onErrorResumeNextWith_1 = require_onErrorResumeNextWith();
	Object.defineProperty(exports, "onErrorResumeNext", {
		enumerable: true,
		get: function() {
			return onErrorResumeNextWith_1.onErrorResumeNext;
		}
	});
	var pairwise_1 = require_pairwise();
	Object.defineProperty(exports, "pairwise", {
		enumerable: true,
		get: function() {
			return pairwise_1.pairwise;
		}
	});
	var partition_1 = require_partition();
	Object.defineProperty(exports, "partition", {
		enumerable: true,
		get: function() {
			return partition_1.partition;
		}
	});
	var pluck_1 = require_pluck();
	Object.defineProperty(exports, "pluck", {
		enumerable: true,
		get: function() {
			return pluck_1.pluck;
		}
	});
	var publish_1 = require_publish();
	Object.defineProperty(exports, "publish", {
		enumerable: true,
		get: function() {
			return publish_1.publish;
		}
	});
	var publishBehavior_1 = require_publishBehavior();
	Object.defineProperty(exports, "publishBehavior", {
		enumerable: true,
		get: function() {
			return publishBehavior_1.publishBehavior;
		}
	});
	var publishLast_1 = require_publishLast();
	Object.defineProperty(exports, "publishLast", {
		enumerable: true,
		get: function() {
			return publishLast_1.publishLast;
		}
	});
	var publishReplay_1 = require_publishReplay();
	Object.defineProperty(exports, "publishReplay", {
		enumerable: true,
		get: function() {
			return publishReplay_1.publishReplay;
		}
	});
	var race_1 = require_race();
	Object.defineProperty(exports, "race", {
		enumerable: true,
		get: function() {
			return race_1.race;
		}
	});
	var raceWith_1 = require_raceWith();
	Object.defineProperty(exports, "raceWith", {
		enumerable: true,
		get: function() {
			return raceWith_1.raceWith;
		}
	});
	var reduce_1 = require_reduce();
	Object.defineProperty(exports, "reduce", {
		enumerable: true,
		get: function() {
			return reduce_1.reduce;
		}
	});
	var repeat_1 = require_repeat();
	Object.defineProperty(exports, "repeat", {
		enumerable: true,
		get: function() {
			return repeat_1.repeat;
		}
	});
	var repeatWhen_1 = require_repeatWhen();
	Object.defineProperty(exports, "repeatWhen", {
		enumerable: true,
		get: function() {
			return repeatWhen_1.repeatWhen;
		}
	});
	var retry_1 = require_retry();
	Object.defineProperty(exports, "retry", {
		enumerable: true,
		get: function() {
			return retry_1.retry;
		}
	});
	var retryWhen_1 = require_retryWhen();
	Object.defineProperty(exports, "retryWhen", {
		enumerable: true,
		get: function() {
			return retryWhen_1.retryWhen;
		}
	});
	var refCount_1 = require_refCount();
	Object.defineProperty(exports, "refCount", {
		enumerable: true,
		get: function() {
			return refCount_1.refCount;
		}
	});
	var sample_1 = require_sample();
	Object.defineProperty(exports, "sample", {
		enumerable: true,
		get: function() {
			return sample_1.sample;
		}
	});
	var sampleTime_1 = require_sampleTime();
	Object.defineProperty(exports, "sampleTime", {
		enumerable: true,
		get: function() {
			return sampleTime_1.sampleTime;
		}
	});
	var scan_1 = require_scan();
	Object.defineProperty(exports, "scan", {
		enumerable: true,
		get: function() {
			return scan_1.scan;
		}
	});
	var sequenceEqual_1 = require_sequenceEqual();
	Object.defineProperty(exports, "sequenceEqual", {
		enumerable: true,
		get: function() {
			return sequenceEqual_1.sequenceEqual;
		}
	});
	var share_1 = require_share();
	Object.defineProperty(exports, "share", {
		enumerable: true,
		get: function() {
			return share_1.share;
		}
	});
	var shareReplay_1 = require_shareReplay();
	Object.defineProperty(exports, "shareReplay", {
		enumerable: true,
		get: function() {
			return shareReplay_1.shareReplay;
		}
	});
	var single_1 = require_single();
	Object.defineProperty(exports, "single", {
		enumerable: true,
		get: function() {
			return single_1.single;
		}
	});
	var skip_1 = require_skip();
	Object.defineProperty(exports, "skip", {
		enumerable: true,
		get: function() {
			return skip_1.skip;
		}
	});
	var skipLast_1 = require_skipLast();
	Object.defineProperty(exports, "skipLast", {
		enumerable: true,
		get: function() {
			return skipLast_1.skipLast;
		}
	});
	var skipUntil_1 = require_skipUntil();
	Object.defineProperty(exports, "skipUntil", {
		enumerable: true,
		get: function() {
			return skipUntil_1.skipUntil;
		}
	});
	var skipWhile_1 = require_skipWhile();
	Object.defineProperty(exports, "skipWhile", {
		enumerable: true,
		get: function() {
			return skipWhile_1.skipWhile;
		}
	});
	var startWith_1 = require_startWith();
	Object.defineProperty(exports, "startWith", {
		enumerable: true,
		get: function() {
			return startWith_1.startWith;
		}
	});
	var subscribeOn_1 = require_subscribeOn();
	Object.defineProperty(exports, "subscribeOn", {
		enumerable: true,
		get: function() {
			return subscribeOn_1.subscribeOn;
		}
	});
	var switchAll_1 = require_switchAll();
	Object.defineProperty(exports, "switchAll", {
		enumerable: true,
		get: function() {
			return switchAll_1.switchAll;
		}
	});
	var switchMap_1 = require_switchMap();
	Object.defineProperty(exports, "switchMap", {
		enumerable: true,
		get: function() {
			return switchMap_1.switchMap;
		}
	});
	var switchMapTo_1 = require_switchMapTo();
	Object.defineProperty(exports, "switchMapTo", {
		enumerable: true,
		get: function() {
			return switchMapTo_1.switchMapTo;
		}
	});
	var switchScan_1 = require_switchScan();
	Object.defineProperty(exports, "switchScan", {
		enumerable: true,
		get: function() {
			return switchScan_1.switchScan;
		}
	});
	var take_1 = require_take();
	Object.defineProperty(exports, "take", {
		enumerable: true,
		get: function() {
			return take_1.take;
		}
	});
	var takeLast_1 = require_takeLast();
	Object.defineProperty(exports, "takeLast", {
		enumerable: true,
		get: function() {
			return takeLast_1.takeLast;
		}
	});
	var takeUntil_1 = require_takeUntil();
	Object.defineProperty(exports, "takeUntil", {
		enumerable: true,
		get: function() {
			return takeUntil_1.takeUntil;
		}
	});
	var takeWhile_1 = require_takeWhile();
	Object.defineProperty(exports, "takeWhile", {
		enumerable: true,
		get: function() {
			return takeWhile_1.takeWhile;
		}
	});
	var tap_1 = require_tap();
	Object.defineProperty(exports, "tap", {
		enumerable: true,
		get: function() {
			return tap_1.tap;
		}
	});
	var throttle_1 = require_throttle();
	Object.defineProperty(exports, "throttle", {
		enumerable: true,
		get: function() {
			return throttle_1.throttle;
		}
	});
	var throttleTime_1 = require_throttleTime();
	Object.defineProperty(exports, "throttleTime", {
		enumerable: true,
		get: function() {
			return throttleTime_1.throttleTime;
		}
	});
	var throwIfEmpty_1 = require_throwIfEmpty();
	Object.defineProperty(exports, "throwIfEmpty", {
		enumerable: true,
		get: function() {
			return throwIfEmpty_1.throwIfEmpty;
		}
	});
	var timeInterval_1 = require_timeInterval();
	Object.defineProperty(exports, "timeInterval", {
		enumerable: true,
		get: function() {
			return timeInterval_1.timeInterval;
		}
	});
	var timeout_1 = require_timeout();
	Object.defineProperty(exports, "timeout", {
		enumerable: true,
		get: function() {
			return timeout_1.timeout;
		}
	});
	var timeoutWith_1 = require_timeoutWith();
	Object.defineProperty(exports, "timeoutWith", {
		enumerable: true,
		get: function() {
			return timeoutWith_1.timeoutWith;
		}
	});
	var timestamp_1 = require_timestamp();
	Object.defineProperty(exports, "timestamp", {
		enumerable: true,
		get: function() {
			return timestamp_1.timestamp;
		}
	});
	var toArray_1 = require_toArray();
	Object.defineProperty(exports, "toArray", {
		enumerable: true,
		get: function() {
			return toArray_1.toArray;
		}
	});
	var window_1 = require_window();
	Object.defineProperty(exports, "window", {
		enumerable: true,
		get: function() {
			return window_1.window;
		}
	});
	var windowCount_1 = require_windowCount();
	Object.defineProperty(exports, "windowCount", {
		enumerable: true,
		get: function() {
			return windowCount_1.windowCount;
		}
	});
	var windowTime_1 = require_windowTime();
	Object.defineProperty(exports, "windowTime", {
		enumerable: true,
		get: function() {
			return windowTime_1.windowTime;
		}
	});
	var windowToggle_1 = require_windowToggle();
	Object.defineProperty(exports, "windowToggle", {
		enumerable: true,
		get: function() {
			return windowToggle_1.windowToggle;
		}
	});
	var windowWhen_1 = require_windowWhen();
	Object.defineProperty(exports, "windowWhen", {
		enumerable: true,
		get: function() {
			return windowWhen_1.windowWhen;
		}
	});
	var withLatestFrom_1 = require_withLatestFrom();
	Object.defineProperty(exports, "withLatestFrom", {
		enumerable: true,
		get: function() {
			return withLatestFrom_1.withLatestFrom;
		}
	});
	var zip_1 = require_zip();
	Object.defineProperty(exports, "zip", {
		enumerable: true,
		get: function() {
			return zip_1.zip;
		}
	});
	var zipAll_1 = require_zipAll();
	Object.defineProperty(exports, "zipAll", {
		enumerable: true,
		get: function() {
			return zipAll_1.zipAll;
		}
	});
	var zipWith_1 = require_zipWith();
	Object.defineProperty(exports, "zipWith", {
		enumerable: true,
		get: function() {
			return zipWith_1.zipWith;
		}
	});
}));

//#endregion
//#region src/operators/filterNull.ts
var import_operators$1 = require_operators();
var import_cjs$18 = require_cjs();
/**
* RxJS operator that filters out `null` and `undefined` values with type narrowing.
*
* @example
* ```ts
* source$.pipe(filterNull()).subscribe(value => {
*   // value is guaranteed non-null
* });
* ```
*/
function filterNull() {
	return (0, import_cjs$18.filter)((value) => value != null);
}

//#endregion
//#region src/core/capabilities/types.ts
/**
* Default on/off state with no permissions
*/
const DEFAULT_ON_OFF = {
	on: false,
	off: false
};
/**
* Default member capabilities with no permissions
*/
const DEFAULT_MEMBER_CAPABILITIES = {
	muteAudio: DEFAULT_ON_OFF,
	muteVideo: DEFAULT_ON_OFF,
	deaf: DEFAULT_ON_OFF,
	raisehand: DEFAULT_ON_OFF,
	microphoneVolume: false,
	microphoneSensitivity: false,
	speakerVolume: false,
	position: false,
	meta: false,
	remove: false,
	audioFlags: false
};
/**
* Default call capabilities with no permissions
*/
const DEFAULT_CALL_CAPABILITIES = {
	self: DEFAULT_MEMBER_CAPABILITIES,
	member: DEFAULT_MEMBER_CAPABILITIES,
	end: false,
	setLayout: false,
	sendDigit: false,
	vmutedHide: DEFAULT_ON_OFF,
	lock: DEFAULT_ON_OFF,
	device: false,
	screenshare: false
};

//#endregion
//#region src/core/capabilities/computeCapabilities.ts
/**
* Computes an on/off capability state from filtered flags
*
* Logic:
* - `on` is true if any flag does NOT end with `.off`
* - `off` is true if any flag does NOT end with `.on`
*
* This means parent permissions (without .on/.off suffix) grant both on and off
*/
function computeOnOffCapability(filteredFlags) {
	if (filteredFlags.length === 0) return DEFAULT_ON_OFF;
	return {
		on: filteredFlags.some((flag) => !flag.endsWith(".off")),
		off: filteredFlags.some((flag) => !flag.endsWith(".on"))
	};
}
/**
* Filters flags for a specific member capability with on/off support
*
* Matches:
* - The member type itself (e.g., "self" grants all self capabilities)
* - The parent capability (e.g., "self.mute" grants all mute capabilities)
* - The specific capability and its on/off variants (e.g., "self.mute.audio*")
*/
function filterMemberOnOffFlags(flags, memberType, parent, capability) {
	return flags.filter((flag) => flag === memberType || flag === `${memberType}.${parent}` || flag.startsWith(`${memberType}.${parent}.${capability}`));
}
/**
* Checks if a boolean capability is granted
*
* Matches:
* - The member type itself (e.g., "self" grants all self capabilities)
* - The parent capability if provided (e.g., "self.microphone" grants volume and sensitivity)
* - The specific capability (e.g., "self.microphone.volume.set")
*/
function hasBooleanCapability(flags, memberType, parent, capability) {
	return flags.some((flag) => flag === memberType || parent !== null && flag === `${memberType}.${parent}` || flag.startsWith(`${memberType}.${parent ? `${parent}.` : ""}${capability}`));
}
/**
* Computes member-level capabilities (self or member) from raw flags
*/
function computeMemberCapabilities(flags, memberType) {
	if (flags.filter((flag) => flag.startsWith(memberType) || flag === memberType).length === 0) return DEFAULT_MEMBER_CAPABILITIES;
	return {
		muteAudio: computeOnOffCapability(filterMemberOnOffFlags(flags, memberType, "mute", "audio")),
		muteVideo: computeOnOffCapability(filterMemberOnOffFlags(flags, memberType, "mute", "video")),
		deaf: computeOnOffCapability(flags.filter((flag) => flag === memberType || flag.startsWith(`${memberType}.deaf`))),
		raisehand: computeOnOffCapability(flags.filter((flag) => flag === memberType || flag.startsWith(`${memberType}.raisehand`))),
		microphoneVolume: hasBooleanCapability(flags, memberType, "microphone", "volume"),
		microphoneSensitivity: hasBooleanCapability(flags, memberType, "microphone", "sensitivity"),
		speakerVolume: hasBooleanCapability(flags, memberType, "speaker", "volume"),
		position: hasBooleanCapability(flags, memberType, null, "position"),
		meta: hasBooleanCapability(flags, memberType, null, "meta"),
		remove: hasBooleanCapability(flags, memberType, null, "remove"),
		audioFlags: hasBooleanCapability(flags, memberType, null, "audioflags")
	};
}
/**
* Computes all call capabilities from raw capability strings
*
* This is a pure function that transforms the raw capability strings
* from the `call.joined` event into a structured capabilities state.
*
* @param capabilities - Raw capability strings from the server
* @returns Computed capabilities state
*/
function computeCapabilities(capabilities) {
	if (capabilities.length === 0) return DEFAULT_CALL_CAPABILITIES;
	return {
		self: computeMemberCapabilities(capabilities, "self"),
		member: computeMemberCapabilities(capabilities, "member"),
		end: capabilities.some((cap) => cap === "end"),
		setLayout: capabilities.some((cap) => cap.startsWith("layout")),
		sendDigit: capabilities.some((cap) => cap.startsWith("digit")),
		vmutedHide: computeOnOffCapability(capabilities.filter((flag) => flag.startsWith("vmuted"))),
		lock: computeOnOffCapability(capabilities.filter((flag) => flag.startsWith("lock"))),
		device: capabilities.some((cap) => cap === "device"),
		screenshare: capabilities.some((cap) => cap === "screenshare")
	};
}

//#endregion
//#region src/core/capabilities/SelfCapabilities.ts
var import_cjs$17 = require_cjs();
/**
* SelfCapabilities manages the capability state for the self participant.
*
* Capabilities are received from the server via `call.joined` events and determine
* what actions the current participant is allowed to perform.
*
* Each capability is exposed as both:
* - An observable (e.g., `end$`) for reactive state management
* - A synchronous getter (e.g., `end`) for immediate access
*
* Member-level capabilities are accessed via the grouped `self` / `member` accessors:
* - `capabilities.self.muteAudio` (sync)
* - `capabilities.self$` (observable)
*
* When a new `call.joined` event is received, the capabilities state is
* completely replaced (not merged).
*/
var SelfCapabilities = class extends Destroyable {
	constructor(..._args) {
		super(..._args);
		this._state$ = this.createBehaviorSubject(DEFAULT_CALL_CAPABILITIES);
	}
	/**
	* Updates the capabilities state from raw capability strings.
	* This completely replaces the current state.
	*
	* @param capabilities - Raw capability strings from the server
	* @internal
	*/
	updateFromRaw(capabilities) {
		const newState = computeCapabilities(capabilities);
		this._state$.next(newState);
	}
	/** Observable for self member capabilities */
	get self$() {
		return this._state$.pipe((0, import_cjs$17.map)((state) => state.self), (0, import_cjs$17.distinctUntilChanged)());
	}
	/** Current self member capabilities */
	get self() {
		return this._state$.value.self;
	}
	/** Observable for other member capabilities */
	get member$() {
		return this._state$.pipe((0, import_cjs$17.map)((state) => state.member), (0, import_cjs$17.distinctUntilChanged)());
	}
	/** Current other member capabilities */
	get member() {
		return this._state$.value.member;
	}
	/** Observable for end call capability */
	get end$() {
		return this._state$.pipe((0, import_cjs$17.map)((state) => state.end), (0, import_cjs$17.distinctUntilChanged)());
	}
	/** Current end call capability */
	get end() {
		return this._state$.value.end;
	}
	/** Observable for set layout capability */
	get setLayout$() {
		return this._state$.pipe((0, import_cjs$17.map)((state) => state.setLayout), (0, import_cjs$17.distinctUntilChanged)());
	}
	/** Current set layout capability */
	get setLayout() {
		return this._state$.value.setLayout;
	}
	/** Observable for send digit capability */
	get sendDigit$() {
		return this._state$.pipe((0, import_cjs$17.map)((state) => state.sendDigit), (0, import_cjs$17.distinctUntilChanged)());
	}
	/** Current send digit capability */
	get sendDigit() {
		return this._state$.value.sendDigit;
	}
	/** Observable for vmuted hide capability */
	get vmutedHide$() {
		return this._state$.pipe((0, import_cjs$17.map)((state) => state.vmutedHide), (0, import_cjs$17.distinctUntilChanged)());
	}
	/** Current vmuted hide capability */
	get vmutedHide() {
		return this._state$.value.vmutedHide;
	}
	/** Observable for lock capability */
	get lock$() {
		return this._state$.pipe((0, import_cjs$17.map)((state) => state.lock), (0, import_cjs$17.distinctUntilChanged)());
	}
	/** Current lock capability */
	get lock() {
		return this._state$.value.lock;
	}
	/** Observable for device capability */
	get device$() {
		return this._state$.pipe((0, import_cjs$17.map)((state) => state.device), (0, import_cjs$17.distinctUntilChanged)());
	}
	/** Current device capability */
	get device() {
		return this._state$.value.device;
	}
	/** Observable for screenshare capability */
	get screenshare$() {
		return this._state$.pipe((0, import_cjs$17.map)((state) => state.screenshare), (0, import_cjs$17.distinctUntilChanged)());
	}
	/** Current screenshare capability */
	get screenshare() {
		return this._state$.value.screenshare;
	}
	/** Observable for the full capabilities state */
	get state$() {
		return this._state$.asObservable();
	}
	/** Current full capabilities state */
	get state() {
		return this._state$.value;
	}
};

//#endregion
//#region src/core/RPCMessages/utils.ts
function toggleDeafMethod(is) {
	return is ? "call.undeaf" : "call.deaf";
}
function toggleHandraiseMethod(is) {
	return is ? "call.lowerhand" : "call.raisehand";
}

//#endregion
//#region src/core/entities/Participant.ts
const logger$17 = getLogger();
const initialState = {};
/**
* Represents a participant in a call.
*
* Provides observable state (audio/video mute, hand raise, volume, etc.)
* and control methods for the participant. See {@link SelfParticipant} for
* the local participant with additional device control.
*/
var Participant = class extends Destroyable {
	constructor(id, executeMethod, deviceController) {
		super();
		this.executeMethod = executeMethod;
		this.deviceController = deviceController;
		this._state$ = this.createBehaviorSubject(initialState);
		this.id = id;
	}
	/** @internal */
	upnext(data) {
		this._state$.next({
			...this._state$.value,
			...data
		});
	}
	/** Observable of the participant's display name. */
	get name$() {
		return this._state$.pipe((0, import_operators$1.map)((state) => state.name), (0, import_operators$1.distinctUntilChanged)(), filterNull());
	}
	/** Observable of the participant type (e.g. `'member'`, `'screen'`). */
	get type$() {
		return this._state$.pipe((0, import_operators$1.map)((state) => state.type), (0, import_operators$1.distinctUntilChanged)(), filterNull());
	}
	/** Observable indicating whether the participant has raised their hand. */
	get handraised$() {
		return this._state$.pipe((0, import_operators$1.map)((state) => state.handraised), (0, import_operators$1.distinctUntilChanged)(), filterNull());
	}
	/** Observable indicating whether the participant is visible in the layout. */
	get visible$() {
		return this._state$.pipe((0, import_operators$1.map)((state) => state.visible), (0, import_operators$1.distinctUntilChanged)(), filterNull());
	}
	/** Observable indicating whether the participant's audio is muted. */
	get audioMuted$() {
		return this._state$.pipe((0, import_operators$1.map)((state) => state.audio_muted), (0, import_operators$1.distinctUntilChanged)(), filterNull());
	}
	/** Observable indicating whether the participant's video is muted. */
	get videoMuted$() {
		return this._state$.pipe((0, import_operators$1.map)((state) => state.video_muted), (0, import_operators$1.distinctUntilChanged)(), filterNull());
	}
	/** Observable indicating whether the participant is deafened. */
	get deaf$() {
		return this._state$.pipe((0, import_operators$1.map)((state) => state.deaf), (0, import_operators$1.distinctUntilChanged)(), filterNull());
	}
	/** Observable of the participant's microphone input volume. */
	get inputVolume$() {
		return this._state$.pipe((0, import_operators$1.map)((state) => state.input_volume), (0, import_operators$1.distinctUntilChanged)(), filterNull());
	}
	/** Observable of the participant's speaker output volume. */
	get outputVolume$() {
		return this._state$.pipe((0, import_operators$1.map)((state) => state.output_volume), (0, import_operators$1.distinctUntilChanged)(), filterNull());
	}
	/** Observable of the microphone input sensitivity level. */
	get inputSensitivity$() {
		return this._state$.pipe((0, import_operators$1.map)((state) => state.input_sensitivity), (0, import_operators$1.distinctUntilChanged)(), filterNull());
	}
	/** Observable indicating whether echo cancellation is enabled. */
	get echoCancellation$() {
		return this._state$.pipe((0, import_operators$1.map)((state) => state.echo_cancellation), (0, import_operators$1.distinctUntilChanged)(), filterNull());
	}
	/** Observable indicating whether auto-gain control is enabled. */
	get autoGain$() {
		return this._state$.pipe((0, import_operators$1.map)((state) => state.auto_gain), (0, import_operators$1.distinctUntilChanged)(), filterNull());
	}
	/** Observable indicating whether noise suppression is enabled. */
	get noiseSuppression$() {
		return this._state$.pipe((0, import_operators$1.map)((state) => state.noise_suppression), (0, import_operators$1.distinctUntilChanged)(), filterNull());
	}
	/** Observable indicating whether low-bitrate mode is active. */
	get lowbitrate$() {
		return this._state$.pipe((0, import_operators$1.map)((state) => state.lowbitrate), (0, import_operators$1.distinctUntilChanged)(), filterNull());
	}
	/** Observable indicating whether noise reduction is active. */
	get denoise$() {
		return this._state$.pipe((0, import_operators$1.map)((state) => state.denoise), (0, import_operators$1.distinctUntilChanged)(), filterNull());
	}
	/** Observable of custom metadata for this participant. */
	get meta$() {
		return this._state$.pipe((0, import_operators$1.map)((state) => state.meta), (0, import_operators$1.distinctUntilChanged)(), filterNull());
	}
	/** Observable of the participant's subscriber ID. */
	get subscriberId$() {
		return this._state$.pipe((0, import_operators$1.map)((state) => state.subscriber_id), (0, import_operators$1.distinctUntilChanged)(), filterNull());
	}
	/** Observable of the participant's address ID. */
	get addressId$() {
		return this._state$.pipe((0, import_operators$1.map)((state) => state.address_id), (0, import_operators$1.distinctUntilChanged)(), filterNull());
	}
	/** Observable of the server node ID for this participant. */
	get nodeId$() {
		return this._state$.pipe((0, import_operators$1.map)((state) => state.node_id), (0, import_operators$1.distinctUntilChanged)(), filterNull());
	}
	/** Observable indicating whether the participant is currently speaking. */
	get isTalking$() {
		return this._state$.pipe((0, import_operators$1.map)((state) => state.talking), (0, import_operators$1.distinctUntilChanged)(), filterNull());
	}
	/** Whether the participant is currently speaking. */
	get isTalking() {
		return this._state$.value.talking ?? false;
	}
	/** Observable of the participant's layout position. */
	get position$() {
		return this._state$.pipe((0, import_operators$1.map)((state) => state.position), (0, import_operators$1.distinctUntilChanged)(), filterNull());
	}
	/** Current layout position. */
	get position() {
		return this._state$.value.position;
	}
	/** Whether the participant is an audience member (view-only). */
	get isAudience() {
		return this._state$.value.isAudience ?? false;
	}
	/** Display name of this participant. */
	get name() {
		return this._state$.value.name;
	}
	/** Participant type (e.g. `'member'`, `'screen'`). */
	get type() {
		return this._state$.value.type;
	}
	get handraised() {
		return this._state$.value.handraised ?? false;
	}
	get visible() {
		return this._state$.value.visible ?? false;
	}
	get audioMuted() {
		return this._state$.value.audio_muted ?? false;
	}
	get videoMuted() {
		return this._state$.value.video_muted ?? false;
	}
	get deaf() {
		return this._state$.value.deaf ?? false;
	}
	get inputVolume() {
		return this._state$.value.input_volume;
	}
	get outputVolume() {
		return this._state$.value.output_volume;
	}
	get inputSensitivity() {
		return this._state$.value.input_sensitivity;
	}
	get echoCancellation() {
		return this._state$.value.echo_cancellation ?? false;
	}
	get autoGain() {
		return this._state$.value.auto_gain ?? false;
	}
	get noiseSuppression() {
		return this._state$.value.noise_suppression ?? false;
	}
	get lowbitrate() {
		return this._state$.value.lowbitrate ?? false;
	}
	get denoise() {
		return this._state$.value.denoise ?? false;
	}
	get meta() {
		return this._state$.value.meta;
	}
	get subscriberId() {
		return this._state$.value.subscriber_id;
	}
	get addressId() {
		return this._state$.value.address_id;
	}
	get nodeId() {
		return this._state$.value.node_id;
	}
	/** @internal */
	get value() {
		return this._state$.value;
	}
	/** Toggles the deafened state (mutes/unmutes incoming audio). */
	async toggleDeaf() {
		const method = toggleDeafMethod(this.deaf);
		await this.executeMethod(this.id, method, {});
	}
	/** Toggles the hand-raised state. */
	async toggleHandraise() {
		await this.executeMethod(this.id, toggleHandraiseMethod(this.handraised), {});
	}
	/** Mutes the participant's audio. */
	async mute() {
		await this.executeMethod(this.id, "call.mute", { channels: ["audio"] });
	}
	/** Unmutes the participant's audio. */
	async unmute() {
		await this.executeMethod(this.id, "call.unmute", { channels: ["audio"] });
	}
	/** Toggles the participant's audio mute state. */
	async toggleMute() {
		return this.audioMuted ? this.unmute() : this.mute();
	}
	/** Mutes the participant's video. */
	async muteVideo() {
		await this.executeMethod(this.id, "call.mute", { channels: ["video"] });
	}
	/** Unmutes the participant's video. */
	async unmuteVideo() {
		await this.executeMethod(this.id, "call.unmute", { channels: ["video"] });
	}
	/** Toggles the participant's video mute state. */
	async toggleMuteVideo() {
		return this.videoMuted ? this.unmuteVideo() : this.muteVideo();
	}
	/** Toggles echo cancellation on the audio input. */
	async toggleEchoCancellation() {
		await this.executeMethod(this.id, "call.audioflags.set", {
			echo_cancellation: !this.echoCancellation,
			auto_gain: this.autoGain,
			noise_suppression: this.noiseSuppression
		});
	}
	/** Toggles automatic gain control on the audio input. */
	async toggleAudioInputAutoGain() {
		await this.executeMethod(this.id, "call.audioflags.set", {
			echo_cancellation: this.echoCancellation,
			auto_gain: !this.autoGain,
			noise_suppression: this.noiseSuppression
		});
	}
	/** Toggles noise suppression on the audio input. */
	async toggleNoiseSuppression() {
		await this.executeMethod(this.id, "call.audioflags.set", {
			echo_cancellation: this.echoCancellation,
			auto_gain: this.autoGain,
			noise_suppression: !this.noiseSuppression
		});
	}
	async toggleLowbitrate() {
		throw new UnimplementedError();
	}
	/** Sets the microphone input sensitivity level. */
	async setAudioInputSensitivity(value) {
		await this.executeMethod(this.id, "call.microphone.sensitivity.set", { sensitivity: value });
	}
	/** Sets the microphone input volume level. */
	async setAudioInputVolume(value) {
		await this.executeMethod(this.id, "call.microphone.volume.set", { volume: value });
	}
	/** Sets the speaker output volume level. */
	async setAudioOutputVolume(value) {
		await this.executeMethod(this.id, "call.speaker.volume.set", { volume: value });
	}
	/** Sets the participant's position in the video layout. */
	async setPosition(value) {
		await this.executeMethod(this.id, "call.member.position.set", { position: value });
	}
	/** Removes this participant from the call. */
	async remove() {
		await this.executeMethod(this.id, "call.member.remove", {});
	}
	/** Ends the call for this participant. */
	async end() {
		await this.executeMethod(this.id, "call.end", {});
	}
	async setMeta(_meta) {
		throw new UnimplementedError();
	}
	async updateMeta(_meta) {
		throw new UnimplementedError();
	}
	async transfer(_options) {
		throw new UnimplementedError();
	}
	destroy() {
		this.executeMethod = void 0;
		super.destroy();
	}
};
/**
* The local participant in a call, with additional device and media control.
*
* Extends {@link Participant} with screen sharing, device selection,
* and local media stream management.
*/
var SelfParticipant = class extends Participant {
	constructor(id, executeMethod, vertoManager, deviceController) {
		super(id, executeMethod, deviceController);
		this.vertoManager = vertoManager;
		this.capabilities = new SelfCapabilities();
	}
	destroy() {
		this.capabilities.destroy();
		super.destroy();
	}
	/** Starts sharing the local screen. */
	async startScreenShare() {
		try {
			await this.vertoManager.addScreenMedia();
		} catch (error) {
			logger$17.error("[Participant.startScreenShare] Screen share error:", error);
		}
	}
	/** Observable of the current screen share status. */
	get screenShareStatus$() {
		return this.vertoManager.screenShareStatus$;
	}
	/** Current screen share status. */
	get screenShareStatus() {
		return this.vertoManager.screenShareStatus;
	}
	/** Stops the current screen share. */
	async stopScreenShare() {
		return this.vertoManager.removeScreenMedia();
	}
	/** Adds an additional media input device to the call. */
	async addAdditionalDevice(options) {
		try {
			await this.vertoManager.addInputDevice(options);
		} catch (error) {
			logger$17.error("[Participant.startScreenShare] Screen share error:", error);
		}
	}
	/** Removes an additional media input device by ID. */
	async removeAdditionalDevice(id) {
		return this.vertoManager.removeInputDevices(id);
	}
	/** Adds or replaces the primary audio input device with optional constraints or stream. */
	async addAudioInputDevice({ constraints, stream } = {}) {
		const audio = constraints ?? stream ? void 0 : true;
		return this.vertoManager.addMainInputDevices({
			audio,
			inputAudioDeviceConstraints: constraints,
			inputAudioStream: stream
		});
	}
	/** Adds or replaces the primary video input device with optional constraints or stream. */
	async addVideoInputDevice({ constraints, stream } = {}) {
		const video = constraints ?? stream ? void 0 : true;
		return this.vertoManager.addMainInputDevices({
			video,
			inputVideoDeviceConstraints: constraints,
			inputVideoStream: stream
		});
	}
	/** Adds or replaces primary input devices (audio and/or video). */
	async addInputDevices(options = {}) {
		await this.vertoManager.addMainInputDevices(options);
	}
	/** Selects the audio input device for future calls. Optionally saves as a preference. */
	selectAudioInputDevice(device, options = {}) {
		this.deviceController.selectAudioInputDevice(device);
		if (options.savePreference) PreferencesContainer.instance.preferredAudioInput = device;
	}
	/** Updates the audio input track constraints for the active call. */
	async setAudioInputDeviceConstraints(constraints) {
		await this.vertoManager.updateMediaConstraints({ audio: constraints });
	}
	/** Updates both audio and video input track constraints for the active call. */
	async setInputDevicesConstraints(constraints) {
		await this.vertoManager.updateMediaConstraints(constraints);
	}
	/** Selects the video input device for future calls. Optionally saves as a preference. */
	selectVideoInputDevice(device, options = {}) {
		this.deviceController.selectVideoInputDevice(device);
		if (options.savePreference) PreferencesContainer.instance.preferredVideoInput = device;
	}
	/** Updates the video input track constraints for the active call. */
	async setVideoInputDeviceConstraints(constraints) {
		await this.vertoManager.updateMediaConstraints({ video: constraints });
	}
	/** Selects the audio output device. Optionally saves as a preference. */
	selectAudioOutputDevice(device, options = {}) {
		this.deviceController.selectAudioOutputDevice(device);
		if (options.savePreference) PreferencesContainer.instance.preferredAudioOutput = device;
	}
	async mute() {
		try {
			await super.mute();
		} catch (error) {
			logger$17.warn("[Participant.toggleAudioInput] Server Error while muting audio input, proceeding with local toggle anyway", error);
		} finally {
			this.vertoManager.muteMainAudioInputDevice();
		}
	}
	async unmute() {
		try {
			await super.unmute();
		} catch (error) {
			logger$17.warn("[Participant.toggleAudioInput] Server Error while unmuting audio input, proceeding with local toggle anyway", error);
		} finally {
			await this.vertoManager.unmuteMainAudioInputDevice();
		}
	}
	async muteVideo() {
		try {
			await super.muteVideo();
		} catch (error) {
			logger$17.warn("[Participant.toggleVideoInput] Server Error while muting video input, proceeding with local toggle anyway", error);
		} finally {
			this.vertoManager.muteMainVideoInputDevice();
		}
	}
	async unmuteVideo() {
		try {
			await super.unmuteVideo();
		} catch (error) {
			logger$17.warn("[Participant.toggleVideoInput] Server Error while unmuting video input, proceeding with local toggle anyway", error);
		} finally {
			await this.vertoManager.unmuteMainVideoInputDevice();
		}
	}
};
/** Type guard that checks if a participant is the local {@link SelfParticipant}. */
const isSelfParticipant = (participant) => {
	return participant instanceof SelfParticipant;
};

//#endregion
//#region src/core/RPCMessages/guards/base.guards.ts
function isObject(value) {
	return typeof value === "object" && value !== null;
}
function hasProperty(obj, key) {
	return key in obj;
}
function isJSONRPCRequest(value) {
	return isObject(value) && hasProperty(value, "jsonrpc") && value.jsonrpc === "2.0" && hasProperty(value, "id") && typeof value.id === "string" && hasProperty(value, "method") && typeof value.method === "string";
}
function isJSONRPCResponse(value) {
	return isObject(value) && hasProperty(value, "jsonrpc") && value.jsonrpc === "2.0" && hasProperty(value, "id") && typeof value.id === "string" && hasProperty(value, "result");
}

//#endregion
//#region src/core/RPCMessages/guards/events.guards.ts
/**
* Factory function to create Request-level type guards.
*/
function createEventRequestGuard(eventType) {
	return (value) => isSignalwireRequest(value) && value.params.event_type === eventType;
}
/**
* Factory function to create Metadata-level type guards.
*/
function createEventMetadataGuard(eventType) {
	return (value) => isSignalwireMetadata(value) && value.event_type === eventType;
}
function isSignalwireRequest(value) {
	return isJSONRPCRequest(value) && value.method === "signalwire.event" && isObject(value.params) && hasProperty(value.params, "event_type");
}
const isSignalwireAuthorizationStateRequest = createEventRequestGuard("signalwire.authorization.state");
const isWebrtcMessageRequest = createEventRequestGuard("webrtc.message");
const isCallJoinedRequest = createEventRequestGuard("call.joined");
const isCallLeftRequest = createEventRequestGuard("call.left");
const isCallUpdatedRequest = createEventRequestGuard("call.updated");
const isCallStateRequest = createEventRequestGuard("call.state");
const isCallPlayRequest = createEventRequestGuard("call.play");
const isCallConnectRequest = createEventRequestGuard("call.connect");
const isMemberUpdatedRequest = createEventRequestGuard("member.updated");
const isMemberJoinedRequest = createEventRequestGuard("member.joined");
const isMemberLeftRequest = createEventRequestGuard("member.left");
const isMemberTalkingRequest = createEventRequestGuard("member.talking");
const isLayoutChangedRequest = createEventRequestGuard("layout.changed");
const isConversationMessageRequest = createEventRequestGuard("conversation.message");
const isConversationMessageUpdatedRequest = createEventRequestGuard("conversation.message.updated");
function isSignalwireMetadata(value) {
	return isObject(value) && hasProperty(value, "event_type") && typeof value.event_type === "string" && hasProperty(value, "params");
}
function isSignalwireCallMetadata(value) {
	return isSignalwireMetadata(value) && (isCallJoinedMetadata(value) || isCallLeftMetadata(value) || isCallUpdatedMetadata(value) || isCallStateMetadata(value) || isCallPlayMetadata(value) || isCallConnectMetadata(value) || isMemberUpdatedMetadata(value) || isMemberJoinedMetadata(value) || isMemberLeftMetadata(value) || isMemberTalkingMetadata(value) || isLayoutChangedMetadata(value) || isWebrtcMessageMetadata(value) || isConversationMessageMetadata(value) || isConversationMessageUpdatedMetadata(value));
}
const isSignalwireAuthorizationStateMetadata = createEventMetadataGuard("signalwire.authorization.state");
const isWebrtcMessageMetadata = createEventMetadataGuard("webrtc.message");
const isCallJoinedMetadata = createEventMetadataGuard("call.joined");
const isCallLeftMetadata = createEventMetadataGuard("call.left");
const isCallUpdatedMetadata = createEventMetadataGuard("call.updated");
const isCallStateMetadata = createEventMetadataGuard("call.state");
const isCallPlayMetadata = createEventMetadataGuard("call.play");
const isCallConnectMetadata = createEventMetadataGuard("call.connect");
const isMemberUpdatedMetadata = createEventMetadataGuard("member.updated");
const isMemberJoinedMetadata = createEventMetadataGuard("member.joined");
const isMemberLeftMetadata = createEventMetadataGuard("member.left");
const isMemberTalkingMetadata = createEventMetadataGuard("member.talking");
const isLayoutChangedMetadata = createEventMetadataGuard("layout.changed");
const isConversationMessageMetadata = createEventMetadataGuard("conversation.message");
const isConversationMessageUpdatedMetadata = createEventMetadataGuard("conversation.message.updated");
function isCallJoinedPayload(value) {
	return isObject(value) && hasProperty(value, "room_session") && hasProperty(value, "call_id") && hasProperty(value, "member_id") && hasProperty(value, "capabilities");
}
function isLayoutChangedPayload(value) {
	return isObject(value) && hasProperty(value, "room_id") && hasProperty(value, "room_session_id") && hasProperty(value, "layout");
}

//#endregion
//#region src/utils/getValueFrom.ts
const getValueFrom = (obj, path, defaultValue) => {
	const keys = path.split(".");
	let result = obj;
	for (const key of keys) if (result && typeof result === "object" && key in result) result = result[key];
	else return defaultValue;
	return result === void 0 ? defaultValue : result;
};

//#endregion
//#region src/operators/filterEventAs.ts
var import_cjs$16 = require_cjs();
var import_operators = require_operators();
/**
* RxJS operator that filters events based on a predicate and maps matching events.
*
* This operator combines filter and map operations:
* 1. Only events that match the predicate are emitted
* 2. Matching events are transformed using the map function
*
* @template TInput - The type of input events
* @template TOutput - The type of output after mapping
* @param predicate - Function to test each event. Returns true to include the event.
* @param mapFn - Function to transform matching events
* @returns An operator function that filters and maps events
*
* @example
* ```typescript
* interface CallEvent {
*   type: 'call.started' | 'call.ended';
*   id: string;
*   timestamp: number;
* }
*
* events$.pipe(
*   isEvent(
*     (event: CallEvent) => event.type === 'call.started',
*     (event: CallEvent) => ({ id: event.id, timestamp: event.timestamp })
*   )
* ).subscribe(startEvent => {
*   console.log('Call started:', startEvent);
* });
* ```
*/
function ifIsMap(predicate, mapFn) {
	return (0, import_cjs$16.pipe)((0, import_operators.filter)(predicate), (0, import_operators.map)(mapFn));
}
/**
* Generic RxJS operator that filters events using a type guard and extracts a property.
*
* This is the generic version that works with any type, not just JSONRPCRequest.
* Use this when you need to filter and extract properties from already-narrowed types.
*
* **Type inference**: The output type is automatically inferred from the input type and path!
*
* @template TInput - The type to narrow to (via type guard)
* @template TPath - The dot-notation path to extract (inferred from parameter)
* @param predicate - Type guard function to filter events
* @param resultPath - Dot-notation path to extract (e.g., 'params', 'params.data')
* @returns An operator function that filters and extracts
*
* @example
* ```typescript
* interface EventParams {
*   event_type: string;
*   data: { value: number };
* }
*
* const isAuthEvent = (e: unknown): e is EventParams =>
*   typeof e === 'object' && e !== null && 'event_type' in e;
*
* // Type of 'data' is automatically inferred as { value: number }
* params$.pipe(
*   filterAs(isAuthEvent, 'data')
* ).subscribe(data => {
*   console.log('Event data:', data.value); // TypeScript knows about .value!
* });
*
* // Deeply nested properties are also inferred
* params$.pipe(
*   filterAs(isAuthEvent, 'data.value')
* ).subscribe(value => {
*   console.log(value); // Type is 'number'
* });
* ```
*/
function filterAs(predicate, resultPath) {
	return (0, import_cjs$16.pipe)(ifIsMap(predicate, (event) => {
		return getValueFrom(event, resultPath);
	}), (0, import_operators.filter)((value) => value !== void 0));
}

//#endregion
//#region src/operators/throwOnRPCError.ts
var import_cjs$15 = require_cjs();
const logger$16 = getLogger();
/**
* RxJS operator that throws a {@link JSONRPCError} when the RPC response contains an error.
* Passes successful responses through unchanged.
*/
function throwOnRPCError() {
	return (0, import_cjs$15.map)((response) => {
		if (response.error) {
			logger$16.error("[throwOnRPCError] RPC error response:", {
				code: response.error.code,
				message: response.error.message,
				data: response.error.data
			});
			throw new JSONRPCError(response.error.code, response.error.message, response.error.data);
		}
		logger$16.debug("[throwOnRPCError] RPC successful response:", response);
		return response;
	});
}

//#endregion
//#region src/managers/CallEventsManager.ts
var import_cjs$14 = require_cjs();
const logger$15 = getLogger();
const initialSessionState = {};
var CallEventsManager = class extends Destroyable {
	constructor(webRtcCallSession, options = {}) {
		super();
		this.webRtcCallSession = webRtcCallSession;
		this.options = options;
		this.callIds = /* @__PURE__ */ new Set();
		this.roomSessionIds = /* @__PURE__ */ new Set();
		this._status$ = this.createBehaviorSubject("trying");
		this._participants$ = this.createBehaviorSubject({});
		this._self$ = this.createBehaviorSubject(null);
		this._sessionState$ = this.createBehaviorSubject(initialSessionState);
		this.initSubscriptions();
	}
	get participants$() {
		return this._participants$.asObservable().pipe((0, import_cjs$14.map)((participantsRecord) => Object.values(participantsRecord)));
	}
	get self$() {
		return this._self$.asObservable().pipe(filterNull());
	}
	get status$() {
		return this._status$.asObservable();
	}
	get status() {
		return this._status$.value;
	}
	isRoomSessionIdValid(roomSessionId) {
		return this.roomSessionIds.has(roomSessionId);
	}
	addCallId(callId) {
		this.callIds.add(callId);
	}
	isCallIdValid(callId) {
		return this.callIds.has(callId);
	}
	get recording$() {
		return this._sessionState$.pipe((0, import_cjs$14.map)((state) => state.recording), (0, import_cjs$14.distinctUntilChanged)(), filterNull());
	}
	get recordings$() {
		return this._sessionState$.pipe((0, import_cjs$14.map)((state) => state.recordings), (0, import_cjs$14.distinctUntilChanged)(), filterNull());
	}
	get streaming$() {
		return this._sessionState$.pipe((0, import_cjs$14.map)((state) => state.streaming), (0, import_cjs$14.distinctUntilChanged)(), filterNull());
	}
	get streams$() {
		return this._sessionState$.pipe((0, import_cjs$14.map)((state) => state.streams), (0, import_cjs$14.distinctUntilChanged)(), filterNull());
	}
	get playbacks$() {
		return this._sessionState$.pipe((0, import_cjs$14.map)((state) => state.playbacks), (0, import_cjs$14.distinctUntilChanged)(), filterNull());
	}
	get raiseHandPriority$() {
		return this._sessionState$.pipe((0, import_cjs$14.map)((state) => state.prioritize_handraise), (0, import_cjs$14.distinctUntilChanged)(), filterNull());
	}
	get locked$() {
		return this._sessionState$.pipe((0, import_cjs$14.map)((state) => state.locked), (0, import_cjs$14.distinctUntilChanged)(), filterNull());
	}
	get meta$() {
		return this._sessionState$.pipe((0, import_cjs$14.map)((state) => state.meta), (0, import_cjs$14.distinctUntilChanged)(), filterNull());
	}
	get capabilities$() {
		return this._sessionState$.pipe((0, import_cjs$14.map)((state) => state.capabilities), (0, import_cjs$14.distinctUntilChanged)(), filterNull());
	}
	get layout$() {
		return this._sessionState$.pipe((0, import_cjs$14.map)((state) => state.layout_name), (0, import_cjs$14.distinctUntilChanged)(), filterNull());
	}
	get layouts$() {
		return this._sessionState$.pipe((0, import_cjs$14.map)((state) => state.layouts), (0, import_cjs$14.distinctUntilChanged)(), filterNull());
	}
	get layoutLayers$() {
		return this._sessionState$.pipe((0, import_cjs$14.map)((state) => state.layout_layers), (0, import_cjs$14.distinctUntilChanged)(), filterNull());
	}
	get self() {
		return this._self$.value;
	}
	get layoutLayers() {
		return this._sessionState$.value.layout_layers ?? [];
	}
	get recording() {
		return this._sessionState$.value.recording ?? false;
	}
	get streaming() {
		return this._sessionState$.value.streaming ?? false;
	}
	get raiseHandPriority() {
		return this._sessionState$.value.prioritize_handraise ?? false;
	}
	get locked() {
		return this._sessionState$.value.locked ?? false;
	}
	get meta() {
		return this._sessionState$.value.meta ?? {};
	}
	get layout() {
		return this._sessionState$.value.layout_name;
	}
	get layouts() {
		return this._sessionState$.value.layouts ?? [];
	}
	get capabilities() {
		return this._sessionState$.value.capabilities ?? [];
	}
	isSessionEvent(id) {
		return this.callIds.has(id) || this.roomSessionIds.has(id);
	}
	initSubscriptions() {
		this.subscribeTo(this.callJoinedEvent$, (callJoinedEvent) => {
			logger$15.debug("[CallEventsManager] Handling call.joined event for call/session IDs:", {
				callId: callJoinedEvent.call_id,
				roomSessionId: callJoinedEvent.room_session_id
			});
			this._status$.next("connected");
			const sessionState = callJoinedEvent.room_session;
			const { capabilities } = callJoinedEvent;
			this.selfId = this.selfId ?? callJoinedEvent.member_id;
			this.originCallId = this.originCallId ?? callJoinedEvent.origin_call_id;
			this.callIds.add(callJoinedEvent.call_id);
			this.roomSessionIds.add(callJoinedEvent.room_session_id);
			this._sessionState$.next({
				...this._sessionState$.value,
				recording: sessionState.recording,
				recordings: sessionState.recordings,
				streaming: sessionState.streaming,
				streams: sessionState.streams,
				playbacks: sessionState.playbacks,
				prioritize_handraise: sessionState.prioritize_handraise,
				locked: sessionState.locked,
				meta: sessionState.meta,
				capabilities
			});
			this.updateParticipants(sessionState.members);
			this._self$.value?.capabilities.updateFromRaw(capabilities);
			this.updateLayouts();
		});
		this.subscribeTo(this.memberUpdates$, (member) => {
			logger$15.debug("[CallEventsManager] Handling member update event for member ID:", member);
			this.upsertParticipant(member);
		});
		this.subscribeTo(this.webRtcCallSession.memberLeft$, (memberLeftEvent) => {
			logger$15.debug("[CallEventsManager] Handling member.left event for member ID:", memberLeftEvent.member.member_id);
			const participants = { ...this._participants$.value };
			if (memberLeftEvent.member.member_id in participants) {
				delete participants[memberLeftEvent.member.member_id];
				this._participants$.next(participants);
			} else logger$15.warn(`[CallEventsManager] Received member.left event for unknown member ID: ${memberLeftEvent.member.member_id}`);
		});
		this.subscribeTo(this.layoutChangedEvent$, (layoutChangedEvent) => {
			logger$15.debug("[CallEventsManager] Handling layout.changed event:", layoutChangedEvent);
			this._sessionState$.next({
				...this._sessionState$.value,
				layout_name: layoutChangedEvent.id,
				layout_layers: layoutChangedEvent.layers
			});
			this.updateParticipantPositions(layoutChangedEvent);
		});
	}
	updateParticipantPositions(layoutChangedEvent) {
		if (Object.keys(this._participants$.value).length > 0 && !layoutChangedEvent.layers.some((layer) => !!layer.member_id)) logger$15.warn("[CallEventsManager] No layers with member_id found in layout.changed event. Nothing to update.");
		layoutChangedEvent.layers.filter((layer) => Boolean(layer.member_id)).map((layer) => {
			if (!layer.member_id) throw new DependencyError("Layer member_id is required");
			this._participants$.value[layer.member_id].upnext({ position: layer });
			return this._participants$.value[layer.member_id];
		}).forEach((participant) => {
			if (isSelfParticipant(participant)) this._self$.next(participant);
			this._participants$.next({
				...this._participants$.value,
				[participant.id]: participant
			});
		});
	}
	updateLayouts() {
		if (!this.selfId) return;
		this.webRtcCallSession.executeMethod(this.selfId, "call.layout.list", {}).then((response) => {
			this._sessionState$.next({
				...this._sessionState$.value,
				layouts: response.result.layouts
			});
		}).catch((error) => {
			logger$15.error("[CallEventsManager] Error fetching layouts:", error);
		});
	}
	updateParticipants(members) {
		members.forEach((member) => this.upsertParticipant(member));
	}
	upsertParticipant(member) {
		if (!(member.member_id in this._participants$.value)) {
			const newParticipant = this.webRtcCallSession.createParticipant(member.member_id, this.selfId);
			this._participants$.next({
				...this._participants$.value,
				[member.member_id]: newParticipant
			});
		}
		const participant = this._participants$.value[member.member_id];
		const oldValue = participant.value;
		logger$15.debug("[CallEventsManager] Updating participant:", member.member_id, {
			oldValue,
			newValue: member
		});
		participant.upnext({
			...oldValue,
			...member
		});
		if (isSelfParticipant(participant)) this._self$.next(participant);
		this._participants$.next(this._participants$.value);
	}
	get callJoinedEvent$() {
		return this.webRtcCallSession.callEvent$.pipe((0, import_cjs$14.filter)(isCallJoinedPayload), (0, import_cjs$14.tap)((event) => {
			logger$15.debug("[CallEventsManager] Call joined event:", event);
		}));
	}
	get layoutChangedEvent$() {
		return this.webRtcCallSession.callEvent$.pipe(filterAs(isLayoutChangedPayload, "layout"), (0, import_cjs$14.tap)((event) => {
			logger$15.debug("[CallEventsManager] Layout changed event:", event);
		}));
	}
	get memberUpdates$() {
		return (0, import_cjs$14.merge)(this.webRtcCallSession.memberJoined$, this.webRtcCallSession.memberUpdated$, this.webRtcCallSession.memberTalking$).pipe((0, import_cjs$14.map)((event) => event.member), (0, import_cjs$14.tap)((event) => {
			logger$15.debug("[CallEventsManager] Member update event:", event);
		}));
	}
	destroy() {
		Object.values(this._participants$.value).forEach((participant) => {
			participant.destroy();
		});
		this._participants$.next({});
		this._self$.next(null);
		this.callIds.clear();
		this.roomSessionIds.clear();
		this.selfId = void 0;
		this.originCallId = void 0;
		this.webRtcCallSession = void 0;
		this.callSession = void 0;
		super.destroy();
	}
};

//#endregion
//#region src/helpers/SDPHelper.ts
/**
* SDPHelper - Utility functions for SDP (Session Description Protocol) parsing and validation.
*
* This module provides helper functions to analyze and validate SDP content,
* particularly for ICE candidate validation in WebRTC connections.
*/
/**
* Validates that an SDP string has at least one non-host ICE candidate
* for each media section (m= line).
*
* Non-host candidates (srflx, prflx, relay) indicate that the SDP has
* gathered candidates that can be used for connectivity through NAT
* traversal mechanisms.
*
* @param sdp - The SDP string to validate
* @returns true if the SDP is valid (has non-host candidates for all media sections,
*          or has no media sections), false otherwise
*
* @example
* ```typescript
* const sdp = `v=0
* m=audio 9 UDP/TLS/RTP/SAVPF 111
* a=candidate:1 1 UDP 1694498815 203.0.113.1 50001 typ srflx
* m=video 9 UDP/TLS/RTP/SAVPF 96
* a=candidate:2 1 UDP 1694498815 203.0.113.1 50002 typ relay`;
*
* isValidLocalDescription(sdp); // returns true
* ```
*/
function isValidLocalDescription(sdp) {
	if (!sdp) return false;
	const lines = sdp.split("\r\n");
	const mediaSectionsValidCandidates = [];
	let currentSection = -1;
	for (const line of lines) if (line.startsWith("m=")) {
		currentSection += 1;
		mediaSectionsValidCandidates[currentSection] = 0;
	} else if (line.startsWith("a=candidate:")) {
		const typeMatch = /\styp\s+(host|srflx|prflx|relay)/.exec(line);
		if (typeMatch && typeMatch[1] !== "host") mediaSectionsValidCandidates[currentSection] += 1;
	}
	return !mediaSectionsValidCandidates.length || mediaSectionsValidCandidates.every((count$1) => count$1 > 0);
}

//#endregion
//#region src/controllers/ICEGatheringController.ts
var import_cjs$13 = require_cjs();
const logger$14 = getLogger();
var ICEGatheringController = class extends Destroyable {
	constructor(peerConnection, peerConnectionControllerNegotiating$, options = {}) {
		super();
		this.peerConnection = peerConnection;
		this.peerConnectionControllerNegotiating$ = peerConnectionControllerNegotiating$;
		this.onicegatheringstatechangeHandler = () => {
			const { iceGatheringState } = this.peerConnection;
			logger$14.debug(`[ICEGatheringController] ICE gathering state changed to: ${iceGatheringState}`);
			if (iceGatheringState === "gathering") this._iceCandidatesState.next({
				state: "gathering",
				validSDP: false
			});
		};
		this.onicecandidateHandler = (event) => {
			logger$14.debug("[ICEGatheringController] ICE candidate event received:", event.candidate);
			this.removeTimer("iceCandidateTimer");
			if (event.candidate) this.iceCandidateTimer = setTimeout(() => {
				if (this.peerConnection.iceGatheringState !== "complete") {
					logger$14.warn("[ICEGatheringController] ICE candidate timeout, using current SDP");
					this.handleICECandidateTimeout();
				}
			}, this.iceCandidateTimeout);
			else {
				logger$14.debug("[ICEGatheringController] ICE gathering completed: null candidate received");
				this.removeTimer("iceGatheringTimer");
				this.handleICEGatheringComplete();
			}
		};
		this._iceCandidatesState = this.createBehaviorSubject({
			state: "new",
			validSDP: false
		});
		this.iceCandidateTimeout = options.iceCandidateTimeout ?? DEFAULT_ICE_CANDIDATE_TIMEOUT_MS;
		this.iceGatheringTimeout = options.iceGatheringTimeout ?? DEFAULT_ICE_GATHERING_TIMEOUT_MS;
		this.relayOnly = options.relayOnly ?? false;
		this.setupEventListeners();
		this.subscribeTo(this.peerConnectionControllerNegotiating$.pipe((0, import_cjs$13.filter)((isNegotiating) => isNegotiating)), (isNegotiating) => {
			if (isNegotiating) {
				this.setupEventListeners();
				this.iceGatheringTimer = setTimeout(() => {
					if (this.peerConnection.iceGatheringState !== "complete") {
						logger$14.warn("[ICEGatheringController] ICE gathering timeout, using current SDP");
						this.handleICEGatheringTimeout();
					}
				}, this.iceGatheringTimeout);
			}
		});
	}
	setupEventListeners() {
		this.peerConnection.removeEventListener("icecandidate", this.onicecandidateHandler);
		this.peerConnection.addEventListener("icecandidate", this.onicecandidateHandler);
		this.peerConnection.removeEventListener("icegatheringstatechange", this.onicegatheringstatechangeHandler);
		this.peerConnection.addEventListener("icegatheringstatechange", this.onicegatheringstatechangeHandler);
	}
	get iceCandidatesState$() {
		return this._iceCandidatesState.pipe((0, import_cjs$13.withLatestFrom)(this.peerConnectionControllerNegotiating$), (0, import_cjs$13.filter)(([_, isNegotiating]) => isNegotiating), (0, import_cjs$13.map)(([state, _]) => state.state));
	}
	get hasValidLocalDescriptionSDP() {
		const sdp = this.peerConnection.localDescription?.sdp;
		return isValidLocalDescription(sdp ?? "");
	}
	get isRelayOnly() {
		return this.relayOnly;
	}
	setRelayOnly(value) {
		this.relayOnly = value;
	}
	handleICEGatheringComplete() {
		logger$14.debug("[ICEGatheringController] Handling ICE gathering complete");
		logger$14.debug(`[ICEGatheringController] Checking ICE gathering state: ${this.peerConnection.iceGatheringState}`);
		logger$14.debug("[ICEGatheringController] ICE gathering complete");
		this._iceCandidatesState.next({
			state: "complete",
			validSDP: this.hasValidLocalDescriptionSDP
		});
		this.stopGathering();
	}
	stopGathering() {
		this.peerConnection.removeEventListener("icegatheringstatechange", this.onicegatheringstatechangeHandler);
		this.peerConnection.removeEventListener("icecandidate", this.onicecandidateHandler);
		this.clearAllTimers();
	}
	handleICEGatheringTimeout() {
		this.removeTimer("iceGatheringTimer");
		const validSDP = this.hasValidLocalDescriptionSDP;
		if (validSDP) {
			logger$14.debug("[ICEGatheringController] Local SDP is valid");
			this._iceCandidatesState.next({
				state: "timeout",
				validSDP
			});
			this.stopGathering();
		} else logger$14.debug("### ICE gathering timeout\n", this.peerConnection.localDescription?.sdp);
	}
	handleICECandidateTimeout() {
		if (this.iceCandidateTimer) this.removeTimer("iceCandidateTimer");
		logger$14.warn("[ICEGatheringController] ICE candidate timeout");
		const validSDP = this.hasValidLocalDescriptionSDP;
		if (!validSDP && !this.relayOnly) this.restartICEGatheringWithRelayOnly();
		else {
			logger$14.debug("[ICEGatheringController] Using current SDP due to ICE candidate timeout");
			this._iceCandidatesState.next({
				state: "timeout",
				validSDP
			});
			this.stopGathering();
		}
	}
	restartICEGatheringWithRelayOnly() {
		logger$14.debug("[ICEGatheringController] Restarting ICE gathering with relay-only candidates");
		this.relayOnly = true;
		this.peerConnection.setConfiguration({
			...this.peerConnection.getConfiguration(),
			iceTransportPolicy: "relay"
		});
		if (!(this.peerConnection.connectionState === "connected")) this.peerConnection.restartIce();
	}
	removeTimer(timer$1) {
		if (this[timer$1]) {
			clearTimeout(this[timer$1]);
			this[timer$1] = void 0;
		}
	}
	clearAllTimers() {
		logger$14.debug("[ICEGatheringController] Clearing all timers");
		this.removeTimer("iceGatheringTimer");
		this.removeTimer("iceCandidateTimer");
	}
	removeEventListeners() {
		this.peerConnection.removeEventListener("icegatheringstatechange", this.onicegatheringstatechangeHandler);
		this.peerConnection.removeEventListener("icecandidate", this.onicecandidateHandler);
	}
	destroy() {
		logger$14.debug("[ICEGatheringController] Destroying ICEGatheringController");
		this.clearAllTimers();
		this.removeEventListeners();
		super.destroy();
	}
};

//#endregion
//#region src/controllers/LocalStreamController.ts
var import_cjs$12 = require_cjs();
const logger$13 = getLogger();
var LocalStreamController = class extends Destroyable {
	constructor(options) {
		super();
		this.options = options;
		this.mediaTrackEndedHandler = (event) => {
			this._mediaTrackEnded$.next(event);
		};
		this._localStream$ = this.createBehaviorSubject(null);
		this._localAudioTracks$ = this.createBehaviorSubject([]);
		this._localVideoTracks$ = this.createBehaviorSubject([]);
		this._mediaTrackEnded$ = this.createSubject();
	}
	get localStream$() {
		return this._localStream$.asObservable().pipe((0, import_cjs$12.takeUntil)(this.destroyed$));
	}
	get localAudioTracks$() {
		return this._localAudioTracks$.asObservable().pipe((0, import_cjs$12.takeUntil)(this.destroyed$));
	}
	get localVideoTracks$() {
		return this._localVideoTracks$.asObservable().pipe((0, import_cjs$12.takeUntil)(this.destroyed$));
	}
	get mediaTrackEnded$() {
		return this._mediaTrackEnded$.asObservable().pipe((0, import_cjs$12.takeUntil)(this.destroyed$));
	}
	get localStream() {
		return this._localStream$.value;
	}
	get localAudioTracks() {
		return this._localAudioTracks$.value;
	}
	get localVideoTracks() {
		return this._localVideoTracks$.value;
	}
	/**
	* Build the local media stream based on the provided options.
	*/
	async buildLocalStream() {
		logger$13.debug("[LocalStreamController] Building local media stream.");
		let stream;
		if (this.options.inputAudioStream ?? this.options.inputVideoStream) {
			const tracks = [...this.options.inputAudioStream?.getTracks() ?? [], ...this.options.inputVideoStream?.getTracks() ?? []];
			stream = new MediaStream(tracks);
		} else if (this.options.propose === "screenshare") {
			logger$13.debug("[LocalStreamController] Requesting display media for screen sharing with audio:", Boolean(this.options.inputAudioDeviceConstraints));
			stream = await this.options.getDisplayMedia({
				video: true,
				audio: Boolean(this.options.inputAudioDeviceConstraints)
			});
			logger$13.debug("[LocalStreamController] Screen share media obtained:", stream);
		} else {
			const constraints = {
				audio: this.options.inputAudioDeviceConstraints,
				video: this.options.inputVideoDeviceConstraints
			};
			logger$13.debug("[LocalStreamController] Requesting user media with constraints:", constraints);
			stream = await this.options.getUserMedia(constraints);
			logger$13.debug("[LocalStreamController] User media obtained:", stream);
		}
		this._localStream$.next(stream);
		return stream;
	}
	/**
	* Add a local media track to the local stream.
	* @param track - The MediaStreamTrack to add
	* @returns The MediaStream (either existing or newly created)
	*/
	addTrack(track) {
		const localStream = this._localStream$.value ?? new MediaStream();
		track.addEventListener("ended", this.mediaTrackEndedHandler);
		localStream.addTrack(track);
		this._localStream$.next(localStream);
		if (track.kind === "video") this._localVideoTracks$.next(localStream.getVideoTracks());
		else this._localAudioTracks$.next(localStream.getAudioTracks());
		logger$13.debug(`[LocalStreamController] ${track.kind} track added:`, track.id);
		return localStream;
	}
	/**
	* Remove a local media track from the local stream.
	* @param trackId - The ID of the track to remove
	* @returns The removed track, or undefined if not found
	*/
	removeTrack(trackId) {
		const stream = this._localStream$.value;
		const track = stream?.getTracks().find((t) => t.id === trackId);
		if (!track) {
			logger$13.debug(`[LocalStreamController] track not found: ${trackId}`);
			return;
		}
		track.removeEventListener("ended", this.mediaTrackEndedHandler);
		stream?.removeTrack(track);
		track.stop();
		this._localStream$.next(stream);
		if (track.kind === "video") this._localVideoTracks$.next(stream?.getVideoTracks() ?? []);
		else this._localAudioTracks$.next(stream?.getAudioTracks() ?? []);
		logger$13.debug(`[LocalStreamController] ${track.kind} track removed:`, trackId);
		return track;
	}
	/**
	* Get or create a local stream.
	*/
	getOrCreateLocalStream() {
		return this._localStream$.value ?? new MediaStream();
	}
	/**
	* Set the local stream directly.
	*/
	setLocalStream(stream) {
		this._localStream$.next(stream);
	}
	/**
	* Add a track ended event listener to a track.
	*/
	addTrackEndedListener(track) {
		track.addEventListener("ended", this.mediaTrackEndedHandler);
	}
	/**
	* Stop all local tracks and clean up.
	*/
	stopAllTracks() {
		this._localStream$.value?.getTracks().forEach((track) => {
			logger$13.debug(`[LocalStreamController] Stopping local track: ${track.kind}`);
			track.removeEventListener("ended", this.mediaTrackEndedHandler);
			track.stop();
		});
	}
	/**
	* Clean up resources.
	*/
	destroy() {
		this.stopAllTracks();
		super.destroy();
	}
};

//#endregion
//#region src/controllers/TransceiverController.ts
const logger$12 = getLogger();
const getDirection = (send, recv) => {
	if (send && recv) return "sendrecv";
	else if (send && !recv) return "sendonly";
	else if (!send && recv) return "recvonly";
	return "inactive";
};
var TransceiverController = class extends Destroyable {
	constructor(options) {
		super();
		this.peerConnection = options.peerConnection;
		this.options = options;
	}
	get useAddTransceivers() {
		return typeof this.peerConnection.addTransceiver === "function";
	}
	get useAddTrack() {
		return typeof this.peerConnection.addTrack === "function";
	}
	get useAddStream() {
		return typeof this.peerConnection.addStream === "function" && !this.useAddTransceivers && !this.useAddTrack;
	}
	get propose() {
		return this.options.propose;
	}
	get isAdditionalDevice() {
		return this.propose === "additional-device";
	}
	get isScreenShare() {
		return this.propose === "screenshare";
	}
	get isSimulcast() {
		return Boolean(this.options.simulcast);
	}
	get isSFU() {
		return Boolean(this.options.sfu);
	}
	get receiveVideo() {
		return Boolean(this.options.receiveVideo);
	}
	get receiveAudio() {
		return Boolean(this.options.receiveAudio);
	}
	get localStream() {
		return this.options.localStreamController.localStream;
	}
	get inputAudioDeviceConstraints() {
		return this.options.getInputAudioDeviceConstraints();
	}
	get inputVideoDeviceConstraints() {
		return this.options.getInputVideoDeviceConstraints();
	}
	get audioDirection() {
		if (this.isAdditionalDevice) return "sendonly";
		const { localStream } = this;
		const hasAudioTrack = localStream?.getAudioTracks().some((track) => track.enabled);
		const wantsToSendAudio = Boolean(this.inputAudioDeviceConstraints);
		const wantsToReceiveAudio = Boolean(this.receiveAudio);
		return getDirection(hasAudioTrack ?? wantsToSendAudio, wantsToReceiveAudio);
	}
	get videoDirection() {
		if (this.isAdditionalDevice || this.isScreenShare) return "sendonly";
		if (this.isSFU) return "recvonly";
		const { localStream } = this;
		const hasVideoTrack = localStream?.getVideoTracks().some((track) => track.enabled);
		const wantsToSendVideo = Boolean(this.inputVideoDeviceConstraints);
		const wantsToReceiveVideo = Boolean(this.receiveVideo);
		return getDirection(hasVideoTrack ?? wantsToSendVideo, wantsToReceiveVideo);
	}
	get sendEncodings() {
		if (!this.isSimulcast) return;
		return [
			"0",
			"1",
			"2"
		].map((rid) => ({
			active: true,
			rid,
			scaleResolutionDownBy: Number(rid) * 6 || 1
		}));
	}
	getConstraintsFor(kind) {
		const constraints = kind === "audio" ? this.inputAudioDeviceConstraints : this.inputVideoDeviceConstraints;
		return typeof constraints === "boolean" ? {} : constraints;
	}
	transceiverByKind(kind) {
		return this.peerConnection.getTransceivers().filter((t) => kind === "both" || t.receiver.track.kind === kind);
	}
	get audioTransceivers() {
		return this.transceiverByKind("audio");
	}
	get videoTransceivers() {
		return this.transceiverByKind("video");
	}
	async setupTransceiverSender(track, localStream, transceiver) {
		const isAudio = track.kind === "audio";
		const direction = isAudio ? this.audioDirection : this.videoDirection;
		const transceiverParams = {
			direction,
			sendEncodings: isAudio ? void 0 : this.sendEncodings,
			streams: direction === "recvonly" ? void 0 : [localStream]
		};
		logger$12.debug(`[TransceiverController] Setting up transceiver sender for local ${track.kind} track:`, {
			transceiver,
			transceiverParams
		});
		if (transceiverParams.direction && ["sendonly", "sendrecv"].includes(transceiverParams.direction)) if (transceiver) {
			await transceiver.sender.replaceTrack(track);
			transceiver.direction = transceiverParams.direction;
			if (transceiverParams.streams?.some((stream) => Boolean(stream))) {
				logger$12.debug(`[TransceiverController] Setting streams for transceiver sender for local ${track.kind} track:`, transceiverParams.streams);
				transceiver.sender.setStreams(...transceiverParams.streams);
			}
		} else {
			logger$12.debug(`[TransceiverController] Adding new transceiver for local ${track.kind} track:`, track.id);
			this.peerConnection.addTransceiver(track, transceiverParams);
		}
	}
	stopTrackSender(kind, options = { updateTransceiverDirection: false }) {
		try {
			const transceivers = this.transceiverByKind(kind);
			for (const transceiver of transceivers) if (transceiver.sender.track?.readyState === "live") {
				const trackId = transceiver.sender.track.id;
				transceiver.sender.track.stop();
				this.options.localStreamController.removeTrack(trackId);
				if (options.updateTransceiverDirection) transceiver.direction = "inactive";
			}
		} catch (error) {
			logger$12.error("[TransceiverController] stopTrackSender error", kind, error);
			this.options.onError?.(new MediaTrackError("stopTrackSender", kind, error));
		}
	}
	async restoreTrackSender(kind) {
		try {
			logger$12.debug("[TransceiverController] restoreTrackSender called", kind);
			const constraints = {};
			const transceivers = this.transceiverByKind(kind);
			for (const transceiver of transceivers) {
				const { track } = transceiver.sender;
				if (!track || track.readyState === "ended") {
					const trackKind = track?.kind ?? transceiver.receiver.track.kind;
					if (trackKind === "audio" || trackKind === "video") constraints[trackKind] = this.getConstraintsFor(trackKind);
				}
			}
			logger$12.debug("[TransceiverController] restoreTrackSender constraints:", constraints);
			if (Object.keys(constraints).length === 0) {
				logger$12.warn("[TransceiverController] restoreTrackSender: no tracks need restoration", kind);
				return;
			}
			const newTracks = (await this.options.getUserMedia(constraints)).getTracks();
			logger$12.debug("[TransceiverController] restoreTrackSender new tracks:", newTracks);
			for (const newTrack of newTracks) {
				this.options.localStreamController.addTrack(newTrack);
				const trackKind = newTrack.kind;
				const transceiverOfKind = this.transceiverByKind(trackKind)[0];
				transceiverOfKind.direction = trackKind === "audio" ? this.audioDirection : this.videoDirection;
				logger$12.debug("[TransceiverController] restoreTrackSender setting direction for", trackKind, transceiverOfKind.direction);
				await transceiverOfKind.sender.replaceTrack(newTrack);
			}
		} catch (error) {
			logger$12.error("[TransceiverController] restoreTrackSender error", kind, error);
			this.options.onError?.(new MediaTrackError("restoreTrackSender", kind, error));
		}
	}
	async replaceSenderTrack(kind, track) {
		const transceivers = kind === "audio" ? this.audioTransceivers : this.videoTransceivers;
		for (const transceiver of transceivers) await transceiver.sender.replaceTrack(track);
	}
	async setupRemoteTransceivers(type) {
		if (type === "answer") return;
		for (const kind of ["audio", "video"]) {
			const transceivers = kind === "audio" ? this.audioTransceivers : this.videoTransceivers;
			for (const transceiver of transceivers) {
				const direction = kind === "audio" ? this.audioDirection : this.videoDirection;
				if (["inactive", "recvonly"].includes(direction)) {
					transceiver.direction = direction;
					await transceiver.sender.replaceTrack(null);
					transceiver.sender.setStreams();
				}
			}
		}
		if (this.videoDirection === "recvonly" && this.isSFU && this.useAddTransceivers) {
			const { msStreamsNumber = 5 } = this.options;
			for (let i = 0; i < Number(msStreamsNumber); i++) this.peerConnection.addTransceiver("video", { direction: "recvonly" });
		}
	}
	async updateSendersConstraints(kind, constraints) {
		if (!constraints) {
			this.stopTrackSender(kind);
			return Promise.resolve();
		}
		const senders = this.peerConnection.getSenders().filter((sender) => sender.track?.kind === kind && sender.track.readyState === "live");
		for (const sender of senders) {
			const { track } = sender;
			if (track) {
				const constraintsToApply = {
					...track.getConstraints(),
					...constraints
				};
				try {
					await track.applyConstraints(constraintsToApply);
					logger$12.debug(`[TransceiverController] Updated ${kind} sender constraints:`, constraintsToApply);
					logger$12.debug(`[TransceiverController] Updated ${kind} sender constraints:`, track.getConstraints());
				} catch (error) {
					logger$12.warn(`[TransceiverController] Failed to apply constraints to ${kind} track ${track.id}:`, error);
					this.options.onError?.(new MediaTrackError("updateSendersConstraints", kind, error));
				}
			}
		}
	}
	getMediaDirections() {
		if (this.peerConnection.connectionState === "connected") return this.peerConnection.getTransceivers().reduce((acc, transceiver) => {
			return {
				...acc,
				[transceiver.receiver.track.kind]: transceiver.direction
			};
		}, {
			audio: "inactive",
			video: "inactive"
		});
		return {
			audio: this.audioDirection,
			video: this.videoDirection
		};
	}
	updatePeerConnection(peerConnection) {
		this.peerConnection = peerConnection;
	}
	updateOptions(options) {
		this.options = {
			...this.options,
			...options
		};
	}
};

//#endregion
//#region src/controllers/RTCPeerConnectionController.ts
var import_cjs$11 = require_cjs();
const logger$11 = getLogger();
var RTCPeerConnectionController = class extends Destroyable {
	constructor(options = {}, remoteSessionDescription, deviceController) {
		super();
		this.options = options;
		this.firstSDPExchangeCompleted = false;
		this.negotiationNeeded$ = this.createSubject();
		this.localDescription$ = (0, import_cjs$11.defer)(() => (0, import_cjs$11.from)(this.init())).pipe((0, import_cjs$11.switchMap)(() => this.iceGatheringController.iceCandidatesState$.pipe((0, import_cjs$11.filter)((iceCandidateState) => !["new", "gathering"].includes(iceCandidateState)), (0, import_cjs$11.tap)(() => {
			this.negotiationEnded();
		}), (0, import_cjs$11.filter)(() => this.shouldEmitLocalDescription), (0, import_cjs$11.map)(() => this.peerConnection?.localDescription), filterNull(), (0, import_cjs$11.tap)((desc) => {
			if (desc.type === "answer") this._type = "offer";
		}))), (0, import_cjs$11.shareReplay)(1), (0, import_cjs$11.takeUntil)(this.destroyed$));
		this.connectionTimeout = 3e3;
		this.oniceconnectionstatechangeHandler = () => {
			if (this.peerConnection) {
				const { iceConnectionState } = this.peerConnection;
				logger$11.debug(`[RTCPeerConnectionController] ICE connection state changed to: ${iceConnectionState}`);
				this._iceConnectionState$.next(this.peerConnection.iceConnectionState);
			}
		};
		this.onconnectionstatechangeHandler = () => {
			if (this.peerConnection) {
				const { connectionState } = this.peerConnection;
				logger$11.debug(`[RTCPeerConnectionController] Connection state changed to: ${connectionState}`);
				if (connectionState === "connected") this.removeConnectionTimer();
				this._connectionState$.next(this.peerConnection.connectionState);
			}
		};
		this.onsignalingstatechangeHandler = () => {
			logger$11.debug(`[RTCPeerConnectionController] Signaling state changed to: ${this.peerConnection?.signalingState}`);
		};
		this.onicegatheringstatechangeHandler = () => {
			if (this.peerConnection) this._iceGatheringState$.next(this.peerConnection.iceGatheringState);
		};
		this.onnegotiationneededHandler = (event) => {
			logger$11.debug("[RTCPeerConnectionController] Negotiation needed event received.", event);
			this.negotiationNeeded$.next();
		};
		this.updateSelectedInputDevice = async (kind, deviceInfo) => {
			try {
				const { localStream } = this;
				if (!localStream) {
					logger$11.warn("[RTCPeerConnectionController] No local stream available to update input device.");
					return;
				}
				logger$11.debug(`[RTCPeerConnectionController] Updating selected ${kind} input device:`, localStream.getTracks());
				const track = localStream.getTracks().find((track$1) => track$1.kind === kind);
				if (track) {
					this.transceiverController?.stopTrackSender(kind);
					this.localStream?.removeTrack(track);
					logger$11.debug(`[RTCPeerConnectionController] Stopped existing ${kind} track: ${track.id}`, localStream.getTracks());
					if (!deviceInfo) {
						logger$11.debug(`[RTCPeerConnectionController] ${kind} input device selected: none`);
						return;
					}
					const streamTrack = (await navigator.mediaDevices.getUserMedia({ [kind]: {
						...track.getConstraints(),
						...this.deviceController.deviceInfoToConstraints(deviceInfo)
					} })).getTracks().find((t) => t.kind === kind);
					if (streamTrack) {
						logger$11.debug(`[RTCPeerConnectionController] Adding new ${kind} track: ${streamTrack.id}`);
						this.localStream?.addTrack(streamTrack);
						await this.transceiverController?.replaceSenderTrack(kind, streamTrack);
						logger$11.debug(`[RTCPeerConnectionController] Added new ${kind} track: ${streamTrack.id}`, this.localStream?.getTracks());
					}
				}
				logger$11.debug(`[RTCPeerConnectionController] ${kind} input device selected:`, deviceInfo?.label);
			} catch (error) {
				logger$11.error(`[RTCPeerConnectionController] Failed to select ${kind} input device:`, error);
				this._errors$.next(error);
				throw error;
			}
		};
		this._isNegotiating$ = this.createBehaviorSubject(false);
		this._memberId = null;
		this._iceConnectionState$ = this.createReplaySubject(1);
		this._connectionState$ = this.createReplaySubject(1);
		this._signalingState$ = this.createReplaySubject(1);
		this._iceGatheringState$ = this.createReplaySubject(1);
		this._errors$ = this.createSubject();
		this._iceCandidates$ = this.createReplaySubject(1);
		this._initialized$ = this.createReplaySubject(1);
		this._remoteDescription$ = this.createReplaySubject(1);
		this._remoteStream$ = this.createBehaviorSubject(null);
		this.deviceController = deviceController ?? {};
		this.id = options.callId ?? v4_default();
		this._type = remoteSessionDescription ? "answer" : "offer";
		this.sdpInit = remoteSessionDescription ? {
			type: "offer",
			sdp: remoteSessionDescription
		} : void 0;
		this.options = {
			receiveAudio: options.receiveAudio ?? PreferencesContainer.instance.receiveAudio,
			receiveVideo: options.receiveVideo ?? PreferencesContainer.instance.receiveVideo,
			...options
		};
		this.localStreamController = new LocalStreamController({
			propose: this.propose,
			inputAudioStream: this.options.inputAudioStream,
			inputVideoStream: this.options.inputVideoStream,
			inputAudioDeviceConstraints: this.inputAudioDeviceConstraints,
			inputVideoDeviceConstraints: this.inputVideoDeviceConstraints,
			getUserMedia: async (constraints) => this.getUserMedia(constraints),
			getDisplayMedia: async (options$1) => this.getDisplayMedia(options$1)
		});
	}
	get iceGatheringController() {
		if (!this._iceGatheringController) throw new DependencyError("ICEGatheringController is not initialized");
		return this._iceGatheringController;
	}
	get shouldEmitLocalDescription() {
		if (!this.peerConnection) return false;
		const { localDescription, signalingState } = this.peerConnection;
		if (!localDescription || !isValidLocalDescription(localDescription.sdp)) return false;
		return localDescription.type === "offer" && signalingState === "have-local-offer" || localDescription.type === "answer" && signalingState === "stable";
	}
	removeConnectionTimer() {
		if (this.connectionTimer) {
			clearTimeout(this.connectionTimer);
			this.connectionTimer = void 0;
		}
	}
	setMemberId(memberId) {
		this._memberId = memberId;
	}
	get memberId() {
		return this._memberId;
	}
	stopTrackSender(kind, options = { updateTransceiverDirection: false }) {
		this.transceiverController?.stopTrackSender(kind, options);
	}
	get isNegotiating$() {
		return this._isNegotiating$.asObservable();
	}
	get isNegotiating() {
		return this._isNegotiating$.value;
	}
	updateMediaDevicesOptions(options) {
		this.options = {
			...this.options,
			...options
		};
	}
	get iceGatheringState$() {
		return this._iceGatheringState$.asObservable().pipe((0, import_cjs$11.takeUntil)(this.destroyed$));
	}
	get mediaTrackEnded$() {
		return this.localStreamController.mediaTrackEnded$.pipe((0, import_cjs$11.takeUntil)(this.destroyed$));
	}
	get errors$() {
		return this._errors$.asObservable().pipe((0, import_cjs$11.takeUntil)(this.destroyed$));
	}
	get iceCandidates$() {
		return this._iceCandidates$.asObservable().pipe((0, import_cjs$11.takeUntil)(this.destroyed$));
	}
	get initialized$() {
		return this._initialized$.asObservable().pipe((0, import_cjs$11.filter)((initialized) => initialized), (0, import_cjs$11.takeUntil)(this.destroyed$));
	}
	get remoteDescription$() {
		return this._remoteDescription$.asObservable().pipe((0, import_cjs$11.takeUntil)(this.destroyed$));
	}
	get localStream$() {
		return this.localStreamController.localStream$.pipe((0, import_cjs$11.takeUntil)(this.destroyed$));
	}
	get remoteStream$() {
		return this._remoteStream$.asObservable().pipe((0, import_cjs$11.takeUntil)(this.destroyed$));
	}
	get localAudioTracks$() {
		return this.localStreamController.localAudioTracks$.pipe((0, import_cjs$11.takeUntil)(this.destroyed$));
	}
	get localVideoTracks$() {
		return this.localStreamController.localVideoTracks$.pipe((0, import_cjs$11.takeUntil)(this.destroyed$));
	}
	get iceConnectionState$() {
		return this._iceConnectionState$.asObservable().pipe((0, import_cjs$11.takeUntil)(this.destroyed$));
	}
	get connectionState$() {
		return this._connectionState$.asObservable().pipe((0, import_cjs$11.takeUntil)(this.destroyed$));
	}
	get signalingState$() {
		return this._signalingState$.asObservable().pipe((0, import_cjs$11.takeUntil)(this.destroyed$));
	}
	get type() {
		return this._type;
	}
	get propose() {
		return this.options.propose ?? "main";
	}
	get isAdditionalDevice() {
		return this.propose === "additional-device";
	}
	get isMainDevice() {
		return this.propose === "main";
	}
	get isScreenShare() {
		return this.propose === "screenshare";
	}
	get iceServers() {
		if (!this.options.disableUdpIceServers) return this.options.iceServers ?? [];
		const tcpTransportParam = "transport=tcp";
		return (this.options.iceServers ?? []).map((server) => {
			const urls = Array.isArray(server.urls) ? server.urls : [server.urls];
			return {
				...server,
				urls: urls.filter((url) => url.includes(tcpTransportParam))
			};
		});
	}
	get rtcConfiguration() {
		const { iceServers: _iceServers, ...restOptions } = this.options;
		return {
			bundlePolicy: "max-compat",
			iceCandidatePoolSize: 10,
			iceServers: this.iceServers,
			iceTransportPolicy: this.options.relayOnly ? "relay" : "all",
			sdpSemantics: "unified-plan",
			...restOptions
		};
	}
	get receiveVideo() {
		return Boolean(this.options.receiveVideo);
	}
	get receiveAudio() {
		return Boolean(this.options.receiveAudio);
	}
	get localStream() {
		return this.localStreamController.localStream;
	}
	get remoteStream() {
		return this._remoteStream$.value;
	}
	get inputAudioDeviceConstraints() {
		if (this.options.audio === false && !this.options.inputAudioDeviceConstraints) return false;
		return {
			...this.options.inputAudioDeviceConstraints,
			...this.deviceController.selectedAudioInputDeviceConstraints
		};
	}
	get inputVideoDeviceConstraints() {
		if (this.options.video === false && !this.options.inputVideoDeviceConstraints) return false;
		return {
			...this.options.inputVideoDeviceConstraints,
			...this.deviceController.selectedVideoInputDeviceConstraints
		};
	}
	get WebRTCPeerConnectionConstructor() {
		return this.options.WebRTCPeerConnectionConstructor ?? RTCPeerConnection;
	}
	get offerOptions() {
		const options = { iceRestart: this.firstSDPExchangeCompleted ? true : void 0 };
		switch (this.propose) {
			case "screenshare":
			case "additional-device": return {
				...options,
				offerToReceiveAudio: false,
				offerToReceiveVideo: false
			};
			case "main":
			default: return {
				...options,
				offerToReceiveAudio: true,
				offerToReceiveVideo: Boolean(this.inputVideoDeviceConstraints)
			};
		}
	}
	get answerOptions() {
		return {};
	}
	/**
	* Initialize the RTCPeerConnection and setup event listeners.
	* Called automatically when localDescription$ is subscribed to (deferred pattern).
	* Uses Promise memoization to ensure initialization only happens once,
	* even if called concurrently.
	*/
	async init() {
		this.initPromise ??= this.doInit();
		return this.initPromise;
	}
	/**
	* Internal initialization implementation.
	* Should only be called via init() to ensure single execution.
	*/
	async doInit() {
		try {
			this.setupPeerConnection();
			this.subscribeTo(this.negotiationNeeded$.pipe((0, import_cjs$11.auditTime)(0), (0, import_cjs$11.exhaustMap)(async () => this.startNegotiation())), {
				next: () => {
					logger$11.debug("[RTCPeerConnectionController] Start Negotiation completed successfully");
				},
				error: (error) => {
					logger$11.error("[RTCPeerConnectionController] Start Negotiation error:", error);
					this._errors$.next(error);
				}
			});
			this.subscribeTo((0, import_cjs$11.merge)(this.deviceController.selectedAudioInputDevice$.pipe((0, import_cjs$11.map)((deviceInfo) => ["audio", deviceInfo])), this.deviceController.selectedVideoInputDevice$.pipe((0, import_cjs$11.map)((deviceInfo) => ["video", deviceInfo]))).pipe((0, import_cjs$11.skipWhile)(() => !this.localStreamController.localStream)), async ([kind, deviceInfo]) => {
				logger$11.debug(`[RTCPeerConnectionController] Selected input device changed for:`, {
					kind,
					deviceInfo
				});
				await this.updateSelectedInputDevice(kind, deviceInfo);
			});
			await this.setupTrackHandling();
			this._initialized$.next(true);
			if (this.type === "answer" && this.sdpInit) {
				this.setupEventListeners();
				await this.handleOfferReceived();
			}
		} catch (error) {
			logger$11.error("[RTCPeerConnectionController] Initialization error:", error);
			this._errors$.next(error);
			this.destroy();
		}
	}
	setupPeerConnection() {
		this.peerConnection = new this.WebRTCPeerConnectionConstructor(this.rtcConfiguration);
		this.peerConnection.addEventListener("negotiationneeded", this.onnegotiationneededHandler);
		this._iceGatheringController = new ICEGatheringController(this.peerConnection, this.isNegotiating$, {
			iceCandidateTimeout: this.options.iceCandidateTimeout,
			iceGatheringTimeout: this.options.iceGatheringTimeout,
			relayOnly: this.options.relayOnly
		});
		this.transceiverController = new TransceiverController({
			peerConnection: this.peerConnection,
			propose: this.propose,
			simulcast: this.options.simulcast,
			sfu: this.options.sfu,
			msStreamsNumber: this.options.msStreamsNumber,
			receiveAudio: this.receiveAudio,
			receiveVideo: this.receiveVideo,
			localStreamController: this.localStreamController,
			getInputAudioDeviceConstraints: () => this.inputAudioDeviceConstraints,
			getInputVideoDeviceConstraints: () => this.inputVideoDeviceConstraints,
			getUserMedia: async (constraints) => this.getUserMedia(constraints),
			onError: (error) => {
				this._errors$.next(error);
			}
		});
	}
	async startNegotiation() {
		if (this.isNegotiating) {
			logger$11.debug("[RTCPeerConnectionController] Negotiation already in progress, skipping.");
			return;
		}
		this.setupEventListeners();
		if (this.type === "answer") {
			logger$11.debug("[RTCPeerConnectionController] This is an answer type still, skipping offer creation.");
			return;
		}
		this._isNegotiating$.next(true);
		logger$11.debug("[RTCPeerConnectionController] Starting negotiation.");
		try {
			const { offerOptions } = this;
			logger$11.debug("[RTCPeerConnectionController] Creating offer with options:", offerOptions);
			await this.createOffer(offerOptions);
		} catch (error) {
			logger$11.error("[RTCPeerConnectionController] Error during negotiation:", error);
			this._errors$.next(error);
		}
	}
	/**
	* Create an SDP offer and set it as local description.
	*/
	async createOffer(options) {
		if (!this.peerConnection) throw new DependencyError("RTCPeerConnection is not initialized");
		const offer = await this.peerConnection.createOffer(options);
		await this.setLocalDescription(offer);
	}
	async updateAnswerStatus({ status, sdp }) {
		let readyToConnect = status !== "failed";
		try {
			if (status === "received" && sdp) {
				logger$11.debug("[RTCPeerConnectionController] Received answer SDP:", sdp);
				await this._setRemoteDescription({
					type: "answer",
					sdp
				});
			}
		} catch (error) {
			logger$11.error("[RTCPeerConnectionController] Error updating answer status:", error);
			this._errors$.next(error);
			readyToConnect = false;
		} finally {
			if (readyToConnect) this.readyToConnect();
			else this.iceGatheringController.restartICEGatheringWithRelayOnly();
		}
	}
	async updateOfferStatus({ status, sdp }) {
		switch (status) {
			case "received":
				this._type = "answer";
				this.sdpInit = {
					type: "offer",
					sdp
				};
				await this.handleOfferReceived();
				break;
			case "failed":
				logger$11.error("[RTCPeerConnectionController] Offer failed to be processed by remote.");
				break;
			case "sent":
			default:
		}
	}
	async handleOfferReceived() {
		if (!this.sdpInit) throw new DependencyError("SDP initialization parameters are not set");
		this._isNegotiating$.next(true);
		await this._setRemoteDescription(this.sdpInit);
		const { answerOptions } = this;
		logger$11.debug("[RTCPeerConnectionController] Creating answer with options:", answerOptions);
		await this.createAnswer(answerOptions);
	}
	readyToConnect() {
		this.firstSDPExchangeCompleted = true;
		this.connectionTimer = setTimeout(() => {
			this.removeConnectionTimer();
			if (this.peerConnection?.connectionState !== "connected") {
				logger$11.debug("[RTCPeerConnectionController] Connection timeout, restarting ICE gathering with relay only.");
				this.iceGatheringController.restartICEGatheringWithRelayOnly();
			}
		}, this.connectionTimeout);
	}
	async setRemoteDescriptionBefore(sdp = "") {
		return Promise.resolve(sdp);
	}
	async setLocalDescription(params) {
		const finalLocal = await this.setLocalDescriptionBefore(params.sdp);
		return this.peerConnection?.setLocalDescription({
			...params,
			sdp: finalLocal
		});
	}
	async setLocalDescriptionBefore(sdp = "") {
		return Promise.resolve(sdp);
	}
	/**
	* Create an SDP answer and set it as local description.
	*/
	async createAnswer(options) {
		if (!this.peerConnection) throw new DependencyError("RTCPeerConnection is not initialized");
		const answer = await this.peerConnection.createAnswer(options);
		await this.setLocalDescription(answer);
	}
	/**
	* Setup event listeners on RTCPeerConnection for state changes.
	*/
	setupEventListeners() {
		if (!this.peerConnection) throw new DependencyError("RTCPeerConnection is not initialized");
		this._iceConnectionState$.next(this.peerConnection.iceConnectionState);
		this._connectionState$.next(this.peerConnection.connectionState);
		this._signalingState$.next(this.peerConnection.signalingState);
		this._iceGatheringState$.next(this.peerConnection.iceGatheringState);
		this._remoteDescription$.next(this.peerConnection.remoteDescription);
		this.peerConnection.removeEventListener("icegatheringstatechange", this.onicegatheringstatechangeHandler);
		this.peerConnection.addEventListener("icegatheringstatechange", this.onicegatheringstatechangeHandler);
		this.peerConnection.removeEventListener("iceconnectionstatechange", this.oniceconnectionstatechangeHandler);
		this.peerConnection.addEventListener("iceconnectionstatechange", this.oniceconnectionstatechangeHandler);
		this.peerConnection.removeEventListener("connectionstatechange", this.onconnectionstatechangeHandler);
		this.peerConnection.addEventListener("connectionstatechange", this.onconnectionstatechangeHandler);
		this.peerConnection.removeEventListener("signalingstatechange", this.onsignalingstatechangeHandler);
		this.peerConnection.addEventListener("signalingstatechange", this.onsignalingstatechangeHandler);
	}
	negotiationEnded() {
		this._isNegotiating$.next(false);
	}
	restarIce() {
		this.peerConnection?.restartIce();
	}
	/**
	* Setup track handling for remote tracks.
	*/
	async setupTrackHandling() {
		if (!this.peerConnection) throw new DependencyError("RTCPeerConnection is not initialized");
		await this.setupLocalTracks();
		await this.setupRemoteTracks();
	}
	async setupLocalTracks() {
		logger$11.debug("[RTCPeerConnectionController] Setting up local tracks/transceivers.");
		let { localStream } = this;
		if (!localStream) try {
			localStream = await this.localStreamController.buildLocalStream();
		} catch (error) {
			logger$11.error("[RTCPeerConnectionController] Error building local stream:", error);
			this._errors$.next(error);
		}
		if (localStream) {
			if (this.transceiverController?.useAddStream ?? false) {
				logger$11.warn("[RTCPeerConnectionController] Using deprecated addStream API to add local stream.");
				this.peerConnection?.addStream(localStream);
				if (!this.isNegotiating) {
					logger$11.debug("[RTCPeerConnectionController] Forcing negotiationneeded after local tracks setup.");
					this.negotiationNeeded$.next();
				}
				return;
			}
			for (const kind of ["audio", "video"]) {
				const tracks = (kind === "audio" ? localStream.getAudioTracks() : localStream.getVideoTracks()).map((track, index) => ({
					index,
					track
				}));
				for (const { index, track } of tracks) {
					this.localStreamController.addTrackEndedListener(track);
					if (this.transceiverController?.useAddTransceivers ?? false) {
						const transceivers = (kind === "audio" ? this.transceiverController?.audioTransceivers : this.transceiverController?.videoTransceivers) ?? [];
						await this.transceiverController?.setupTransceiverSender(track, localStream, transceivers[index]);
					} else {
						logger$11.debug(`[RTCPeerConnectionController] Using addTrack for local ${kind} track:`, track.id);
						this.peerConnection?.addTrack(track, localStream);
					}
				}
			}
		}
	}
	async getUserMedia(constraints) {
		return this.options.getUserMedia?.(constraints) ?? navigator.mediaDevices.getUserMedia(constraints);
	}
	async getDisplayMedia(options) {
		return this.options.getDisplayMedia?.(options) ?? navigator.mediaDevices.getDisplayMedia(options);
	}
	async setupRemoteTracks() {
		if (!this.peerConnection) throw new DependencyError("RTCPeerConnection is not initialized");
		this.peerConnection.ontrack = (event) => {
			logger$11.debug("[RTCPeerConnectionController] Remote track received:", event.track.kind);
			this._remoteStream$.next(event.streams[0]);
		};
		await this.transceiverController?.setupRemoteTransceivers(this.type);
	}
	async restoreTrackSender(kind) {
		await this.transceiverController?.restoreTrackSender(kind);
	}
	/**
	* Add a local media track to the peer connection.
	* @param track - The MediaStreamTrack to add
	*/
	addLocalTrack(track) {
		if (!this.peerConnection) {
			const error = new DependencyError("RTCPeerConnection is not initialized");
			this._errors$.next(error);
			throw error;
		}
		try {
			const localStream = this.localStreamController.addTrack(track);
			this.peerConnection.addTrack(track, localStream);
			logger$11.debug(`[RTCPeerConnectionController] ${track.kind} track added:`, track.id);
		} catch (error) {
			logger$11.error(`[RTCPeerConnectionController] Failed to add ${track.kind} track:`, error);
			this._errors$.next(error);
			throw error;
		}
	}
	/**
	* Remove a local media track from the peer connection.
	* @param trackId - The ID of the track to remove
	*/
	removeLocalTrack(trackId) {
		if (!this.peerConnection) {
			const error = new DependencyError("RTCPeerConnection is not initialized");
			this._errors$.next(error);
			throw error;
		}
		const sender = this.peerConnection.getSenders().find((sender$1) => sender$1.track?.id === trackId);
		if (!sender) {
			logger$11.debug(`[RTCPeerConnectionController] track not found: ${trackId}`);
			return;
		}
		try {
			this.peerConnection.removeTrack(sender);
			this.localStreamController.removeTrack(trackId);
			logger$11.debug(`[RTCPeerConnectionController] ${sender.track?.kind} track removed:`, trackId);
		} catch (error) {
			logger$11.error(`[RTCPeerConnectionController] Failed to remove ${sender.track?.kind} track:`, error);
			this._errors$.next(error);
			throw error;
		}
	}
	/**
	* Replace all existing media tracks with a new media  track.
	* Convenience method for single-track scenarios.
	* @param track - The MediaStreamTrack to set
	*/
	setLocalTrack(track) {
		const existingTracks = [...track.kind === "audio" ? this.localStreamController.localAudioTracks : this.localStreamController.localVideoTracks];
		for (const existingTrack of existingTracks) this.removeLocalTrack(existingTrack.id);
		this.addLocalTrack(track);
	}
	async updateSendersConstraints(kind, constraints) {
		await this.transceiverController?.updateSendersConstraints(kind, constraints);
	}
	/**
	* Clean up resources and close the peer connection.
	* Completes all observables to prevent memory leaks.
	*/
	destroy() {
		logger$11.debug(`[RTCPeerConnectionController] Destroying RTCPeerConnectionController. ${this.propose}`);
		this.removeConnectionTimer();
		this._iceGatheringController?.destroy();
		this.localStreamController.destroy();
		this.transceiverController?.destroy();
		if (this.peerConnection) {
			this.stopRemoteTracks();
			this.removeAllListeners();
			this.peerConnection.close();
			this.peerConnection = void 0;
		}
		super.destroy();
	}
	removeAllListeners() {
		if (this.peerConnection) {
			this.peerConnection.removeEventListener("icegatheringstatechange", this.onicegatheringstatechangeHandler);
			this.peerConnection.removeEventListener("iceconnectionstatechange", this.oniceconnectionstatechangeHandler);
			this.peerConnection.removeEventListener("connectionstatechange", this.onconnectionstatechangeHandler);
			this.peerConnection.removeEventListener("signalingstatechange", this.onsignalingstatechangeHandler);
			this.peerConnection.removeEventListener("negotiationneeded", this.onnegotiationneededHandler);
		}
	}
	stopRemoteTracks() {
		this._remoteStream$.value?.getTracks().forEach((track) => {
			logger$11.debug(`[RTCPeerConnectionController] Stopping remote track: ${track.kind}`);
			track.stop();
		});
	}
	get mediaDirections() {
		return this.transceiverController?.getMediaDirections() ?? {
			audio: "inactive",
			video: "inactive"
		};
	}
	async _setRemoteDescription(params) {
		if (!this.peerConnection) throw new DependencyError("RTCPeerConnection is not initialized");
		const finalRemote = await this.setRemoteDescriptionBefore(params.sdp);
		const answer = {
			...params,
			sdp: finalRemote
		};
		logger$11.debug("[RTCPeerConnectionController] Setting remote description:", answer);
		return this.peerConnection.setRemoteDescription(answer);
	}
};

//#endregion
//#region src/core/RPCMessages/guards/verto.guards.ts
function isVertoMethodMessage(value) {
	return isObject(value) && hasProperty(value, "jsonrpc") && value.jsonrpc === "2.0" && hasProperty(value, "id");
}
function isVertoInviteMessage(value) {
	if (!isVertoMethodMessage(value)) return false;
	const msg = value;
	return msg.method === "verto.invite" && isObject(msg.params) && hasProperty(msg.params, "sdp") && hasProperty(msg.params, "callID");
}
function isVertoByeMessage(value) {
	if (!isVertoMethodMessage(value)) return false;
	return value.method === "verto.bye";
}
function isVertoAttachMessage(value) {
	if (!isVertoMethodMessage(value)) return false;
	return value.method === "verto.attach";
}
function isVertoAnswerInnerParams(value) {
	return isObject(value) && hasProperty(value, "jsonrpc") && value.jsonrpc === "2.0" && hasProperty(value, "method") && value.method === "verto.answer" && isObject(value.params) && hasProperty(value.params, "callID") && hasProperty(value.params, "sdp");
}
function isVertoMediaParamsInnerParams(value) {
	return isObject(value) && hasProperty(value, "jsonrpc") && value.jsonrpc === "2.0" && hasProperty(value, "method") && value.method === "verto.mediaParams" && isObject(value.params) && hasProperty(value.params, "mediaParams");
}
function isVertoPingInnerParams(value) {
	return isObject(value) && hasProperty(value, "jsonrpc") && value.jsonrpc === "2.0" && hasProperty(value, "method") && value.method === "verto.ping";
}

//#endregion
//#region src/managers/VertoManager.ts
var import_cjs$10 = require_cjs();
const logger$10 = getLogger();
var VertoManager = class extends Destroyable {
	constructor(callSession) {
		super();
		this.callSession = callSession;
	}
	destroy() {
		this.callSession = void 0;
		super.destroy();
	}
};
var WebRTCVertoManager = class extends VertoManager {
	constructor(webRtcCallSession, attachManager, deviceController, options = {}) {
		super(webRtcCallSession);
		this.webRtcCallSession = webRtcCallSession;
		this.attachManager = attachManager;
		this.deviceController = deviceController;
		this._rtcPeerConnections$ = this.createBehaviorSubject([]);
		this._selfId$ = this.createBehaviorSubject(null);
		this._signalingStatus$ = this.createBehaviorSubject(null);
		this._screenShareStatus$ = this.createBehaviorSubject("none");
		this._rtcPeerConnectionsMap = /* @__PURE__ */ new Map();
		this._screenShareTimeoutMs = 5e4;
		this._nodeId$ = this.createBehaviorSubject(options.nodeId ?? null);
		this.onError = options.onError;
		this.initSubscriptions();
		this.initMainPeerConnection();
	}
	async hold() {
		const vertoModifyMessage = VertoModify({
			sessid: this.webRtcCallSession.id,
			dialogParams: { callID: this.webRtcCallSession.id },
			action: "hold"
		});
		try {
			await this.executeVerto(vertoModifyMessage);
		} catch (error) {
			logger$10.warn("[WebRTCManager] Call might already be disconnected, error sending Verto hold:", error);
			throw error;
		}
	}
	async unhold() {
		const vertoModifyMessage = VertoModify({
			sessid: this.webRtcCallSession.id,
			dialogParams: { callID: this.webRtcCallSession.id },
			action: "unhold"
		});
		try {
			await this.executeVerto(vertoModifyMessage);
		} catch (error) {
			logger$10.warn("[WebRTCManager] Call might already be disconnected, error sending Verto unhold:", error);
			throw error;
		}
	}
	get mediaDirections() {
		return this.mainPeerConnection.mediaDirections;
	}
	get rtcPeerConnections$() {
		return this._rtcPeerConnections$.asObservable();
	}
	get rtcPeerConnections() {
		return this._rtcPeerConnections$.value;
	}
	get nodeId$() {
		return this._nodeId$.asObservable();
	}
	get selfId$() {
		return this._selfId$.asObservable();
	}
	get localStream() {
		return this._rtcPeerConnectionsMap.get(this.webRtcCallSession.id)?.localStream ?? null;
	}
	get remoteStream() {
		return this._rtcPeerConnectionsMap.get(this.webRtcCallSession.id)?.remoteStream ?? null;
	}
	get nodeId() {
		return this._nodeId$.value;
	}
	get screenShareStatus() {
		return this._screenShareStatus$.value;
	}
	get screenShareStatus$() {
		return this._screenShareStatus$.asObservable();
	}
	get mainPeerConnection() {
		const rtcPeerConnection = this._rtcPeerConnectionsMap.get(this.webRtcCallSession.id);
		if (!rtcPeerConnection) throw new DependencyError("Main peer connection not found");
		return rtcPeerConnection;
	}
	get signalingStatus$() {
		return (0, import_cjs$10.merge)(this._signalingStatus$.pipe(filterNull()), this.mainPeerConnection.connectionState$.pipe((0, import_cjs$10.filter)((connectionState) => [
			"connected",
			"disconnected",
			"failed"
		].includes(connectionState))));
	}
	initSubscriptions() {
		this.subscribeTo(this.vertoAnswer$, (event) => {
			logger$10.debug("[WebRTCManager] Received Verto answer event:", event);
			const { sdp } = event;
			this._rtcPeerConnectionsMap.get(event.callID)?.updateAnswerStatus({
				status: "received",
				sdp
			});
		});
		this.subscribeTo(this.vertoMediaParams$, (event) => {
			logger$10.debug("[WebRTCManager] Received Verto mediaParams event:", event);
			const { mediaParams, callID } = event;
			const rtcPeerConnController = this._rtcPeerConnectionsMap.get(callID);
			const { audio, video } = mediaParams;
			if (audio) rtcPeerConnController?.updateSendersConstraints("audio", audio);
			if (video) rtcPeerConnController?.updateSendersConstraints("video", video);
		});
		this.subscribeTo(this.vertoPing$, (vertoPing) => {
			this.attachManager.attach(this.webRtcCallSession);
			this.sendVertoPong(vertoPing);
		});
	}
	async sendVertoPong(vertoPing) {
		try {
			const vertoPongMessage = VertoPong({ ...vertoPing });
			await this.executeVerto(vertoPongMessage);
		} catch (error) {
			logger$10.warn("[WebRTCManager] Call might disconnect, error sending Verto pong:", error);
			this.onError?.(new VertoPongError(error));
		}
	}
	async updateMediaConstraints(options = {}) {
		const { audio, video } = options;
		try {
			if (audio) await this.mainPeerConnection.updateSendersConstraints("audio", audio);
			if (video) await this.mainPeerConnection.updateSendersConstraints("video", video);
		} catch (error) {
			logger$10.warn("[WebRTCManager] Error updating media constraints:", error);
			this.onError?.(error instanceof Error ? error : new Error(String(error), { cause: error }));
			throw error;
		}
	}
	get selfId() {
		return this._selfId$.value;
	}
	get vertoAnswer$() {
		return this.webRtcCallSession.webrtcMessages$.pipe(filterAs(isVertoAnswerInnerParams, "params"), (0, import_cjs$10.takeUntil)(this.destroyed$));
	}
	get vertoMediaParams$() {
		return this.webRtcCallSession.webrtcMessages$.pipe(filterAs(isVertoMediaParamsInnerParams, "params"), (0, import_cjs$10.takeUntil)(this.destroyed$));
	}
	get vertoBye$() {
		return this.webRtcCallSession.webrtcMessages$.pipe(filterAs(isVertoByeMessage, "params"), (0, import_cjs$10.takeUntil)(this.destroyed$));
	}
	get vertoAttach$() {
		return this.webRtcCallSession.webrtcMessages$.pipe(filterAs(isVertoAttachMessage, "params"), (0, import_cjs$10.takeUntil)(this.destroyed$));
	}
	get vertoPing$() {
		return this.webRtcCallSession.webrtcMessages$.pipe(filterAs(isVertoPingInnerParams, "params"), (0, import_cjs$10.takeUntil)(this.destroyed$));
	}
	async executeVerto(message, optionals = {}) {
		const webrtcVertoMessage = WebrtcVerto({
			callID: optionals.callID ?? this.webRtcCallSession.id,
			node_id: optionals.node_id ?? this._nodeId$.value ?? "",
			message,
			subscribe: optionals.subscribe
		});
		const response = await this.webRtcCallSession.execute(webrtcVertoMessage);
		if (response.error) {
			const error = new JSONRPCError(response.error.code, response.error.message, response.error.data);
			this.onError?.(error);
			throw error;
		}
		const innerResult = getValueFrom(response, "result.result");
		if (innerResult?.error) {
			const error = new JSONRPCError(innerResult.error.code, innerResult.error.message, innerResult.error.data);
			this.onError?.(error);
			throw error;
		}
		return response;
	}
	async sendLocalDescription(message, rtcPeerConnController) {
		const vertoMethod = message.method;
		const optionalsParams = this.getSendLocalSDPOptionalParams(rtcPeerConnController);
		try {
			const response = await this.executeVerto(message, optionalsParams);
			switch (vertoMethod) {
				case "verto.invite":
					this.processInviteResponse(response, rtcPeerConnController);
					break;
				case "verto.modify":
					await this.processModifyResponse(response, rtcPeerConnController);
					break;
				default:
			}
		} catch (error) {
			logger$10.error(`[WebRTCManager] Error sending Verto ${vertoMethod}:`, error);
			throw error;
		}
	}
	async processModifyResponse(response, rtcPeerConnController) {
		if (!response.error) {
			const action = getValueFrom(response, "result.result.result.action");
			const sdp = getValueFrom(response, "result.result.result.sdp");
			if (action === "updateMedia" && !!sdp) try {
				await rtcPeerConnController.updateAnswerStatus({
					status: "received",
					sdp
				});
			} catch (error) {
				logger$10.warn("[WebRTCManager] Error processing modify response:", error);
				this.onError?.(error instanceof Error ? error : new Error(String(error), { cause: error }));
			}
		}
	}
	processInviteResponse(response, rtcPeerConnController) {
		if (!response.error && getValueFrom(response, "result.result.result.message") === "CALL CREATED") {
			this._nodeId$.next(getValueFrom(response, "result.node_id") ?? null);
			const memberId = getValueFrom(response, "result.result.result.memberID") ?? null;
			const callId = getValueFrom(response, "result.result.result.callID") ?? null;
			logger$10.debug("[WebRTCManager] Verto invite response:", {
				callId,
				memberId,
				response
			});
			this._selfId$.next(memberId);
			rtcPeerConnController.setMemberId(memberId);
			if (callId) this.webRtcCallSession.addCallId(callId);
			this._signalingStatus$.next("ringing");
			this.attachManager.attach(this.webRtcCallSession);
			logger$10.info("[WebRTCManager] Verto invite successful");
			logger$10.debug(`[WebRTCManager] nodeid: ${this._nodeId$.value}, selfId: ${this._selfId$.value}`);
		} else {
			logger$10.error("[WebRTCManager] Verto invite failed:", response);
			const inviteError = response.error ? new JSONRPCError(response.error.code, response.error.message, response.error.data) : /* @__PURE__ */ new Error("Verto invite failed: unexpected response");
			this.onError?.(inviteError);
		}
	}
	get RTCPeerConnectionConfig() {
		return {
			iceServers: this.webRtcCallSession.clientSession.iceServers ?? PreferencesContainer.instance.iceServers,
			relayOnly: PreferencesContainer.instance.relayOnly || PreferencesContainer.instance.disableUdpIceServers,
			disableUdpIceServers: PreferencesContainer.instance.disableUdpIceServers,
			iceCandidateTimeout: PreferencesContainer.instance.iceCandidateTimeout,
			iceGatheringTimeout: PreferencesContainer.instance.iceGatheringTimeout
		};
	}
	initMainPeerConnection() {
		const { options } = this.webRtcCallSession;
		const rtcPeerConnController = new RTCPeerConnectionController({
			propose: "main",
			callId: this.webRtcCallSession.id,
			audio: options.audio,
			video: options.video,
			inputAudioDeviceConstraints: options.inputAudioDeviceConstraints,
			inputVideoDeviceConstraints: options.inputVideoDeviceConstraints,
			inputAudioStream: options.inputAudioStream,
			inputVideoStream: options.inputVideoStream,
			receiveAudio: options.receiveAudio,
			receiveVideo: options.receiveVideo,
			...this.RTCPeerConnectionConfig
		}, options.initOffer, this.deviceController);
		this.setupLocalDescriptionHandler(rtcPeerConnController);
		this.setupVertoByeHandler();
		this.setupVertoAttachHandler();
		this.initObservables(rtcPeerConnController);
		this._rtcPeerConnectionsMap.set(rtcPeerConnController.id, rtcPeerConnController);
		this._rtcPeerConnections$.next(Array.from(this._rtcPeerConnectionsMap.values()));
		this.subscribeTo(rtcPeerConnController.errors$, (error) => {
			this.onError?.(error);
		});
	}
	setupVertoAttachHandler() {
		this.subscribeTo(this.vertoAttach$, async (vertoAttach) => {
			logger$10.debug("[WebRTCManager] Received Verto attach event:", vertoAttach);
			const { callID } = vertoAttach;
			await this.attachManager.attach({
				id: callID,
				to: vertoAttach.callee_id_number,
				mediaDirections: {
					audio: "sendrecv",
					video: "inactive"
				}
			});
			await this.attachManager.reattachCalls();
		});
	}
	initObservables(rtcPeerConnController) {
		this.mediaDirections$ = rtcPeerConnController.connectionState$.pipe((0, import_cjs$10.filter)((state) => state === "connected"), (0, import_cjs$10.takeUntil)(this.destroyed$), (0, import_cjs$10.map)(() => rtcPeerConnController.mediaDirections));
		this.localStream$ = rtcPeerConnController.localStream$.pipe(filterNull(), (0, import_cjs$10.takeUntil)(this.destroyed$));
		this.remoteStream$ = rtcPeerConnController.remoteStream$.pipe(filterNull(), (0, import_cjs$10.takeUntil)(this.destroyed$));
	}
	setupLocalDescriptionHandler(rtcPeerConnController) {
		this.subscribeTo(rtcPeerConnController.localDescription$.pipe((0, import_cjs$10.filter)((description) => description !== null), (0, import_cjs$10.takeUntil)(this.destroyed$)), (description) => {
			const { type, sdp } = description;
			const dialogParams = this.dialogParams(rtcPeerConnController);
			const initial = !rtcPeerConnController.firstSDPExchangeCompleted;
			if (type === "answer") {
				const vertoMessageRequest = VertoAnswer({
					dialogParams,
					sdp
				});
				this.sendLocalDescriptionOnceAccepted(vertoMessageRequest, rtcPeerConnController);
			} else if (initial) {
				this._signalingStatus$.next("trying");
				const vertoMessageRequest = VertoInvite({
					dialogParams,
					sdp
				});
				this.sendLocalDescription(vertoMessageRequest, rtcPeerConnController);
			} else {
				const vertoMessageRequest = VertoModify({
					dialogParams,
					sdp,
					action: "updateMedia"
				});
				this.sendLocalDescription(vertoMessageRequest, rtcPeerConnController);
			}
		});
	}
	setupVertoByeHandler() {
		this.subscribeTo(this.vertoBye$, () => {
			this.attachManager.detach(this.webRtcCallSession);
			this.callSession?.destroy();
		});
	}
	getSendLocalSDPOptionalParams(rtcPeerConnController) {
		let subscribe = void 0;
		const initial = !rtcPeerConnController.firstSDPExchangeCompleted;
		if (initial) {
			subscribe = [];
			if (rtcPeerConnController.isMainDevice) subscribe.push(...PreferencesContainer.instance.inviteSubscribeMainDevice);
			else if (rtcPeerConnController.isAdditionalDevice) subscribe.push(...PreferencesContainer.instance.inviteSubscribeAdditionalDevice);
			else if (rtcPeerConnController.isScreenShare) subscribe.push(...PreferencesContainer.instance.inviteSubscribeScreenshare);
		}
		return {
			callID: rtcPeerConnController.id,
			node_id: initial ? "" : this._nodeId$.value ?? "",
			subscribe
		};
	}
	async sendLocalDescriptionOnceAccepted(vertoMessageRequest, rtcPeerConnectionController) {
		logger$10.debug("[WebRTCManager] Waiting for call to be accepted or ended before sending answer");
		const vertoByeOrAccepted = await (0, import_cjs$10.firstValueFrom)((0, import_cjs$10.race)(this.vertoBye$, this.webRtcCallSession.answered$));
		if (isVertoByeMessage(vertoByeOrAccepted)) {
			logger$10.info("[WebRTCManager] Call ended before answer was sent.");
			this.callSession?.destroy();
		} else if (!vertoByeOrAccepted) {
			logger$10.info("[WebRTCManager] Call was not accepted, sending verto.bye.");
			await this.bye("USER_BUSY");
		} else {
			logger$10.debug("[WebRTCManager] Call accepted, sending answer");
			try {
				this._signalingStatus$.next("connecting");
				await this.sendLocalDescription(vertoMessageRequest, rtcPeerConnectionController);
				await rtcPeerConnectionController.updateAnswerStatus({ status: "sent" });
				await this.attachManager.attach(this.webRtcCallSession);
			} catch (error) {
				logger$10.error("[WebRTCManager] Error sending Verto answer:", error);
				this.onError?.(error instanceof Error ? error : new Error(String(error), { cause: error }));
				await rtcPeerConnectionController.updateAnswerStatus({ status: "failed" });
			}
		}
	}
	dialogParams(rtcPeerConnectionController) {
		const memberId = rtcPeerConnectionController.memberId ?? this._selfId$.value ?? void 0;
		const attach = rtcPeerConnectionController.propose === "main" && !rtcPeerConnectionController.firstSDPExchangeCompleted && this.webRtcCallSession.options.reattach;
		return {
			id: rtcPeerConnectionController.isMainDevice ? this.webRtcCallSession.id : rtcPeerConnectionController.id,
			destinationNumber: this.webRtcCallSession.to ?? this.webRtcCallSession.from,
			attach,
			reattaching: attach,
			callerName: this.webRtcCallSession.fromName,
			callerNumber: this.webRtcCallSession.from,
			remoteCallerName: this.webRtcCallSession.toName,
			remoteCallerNumber: this.webRtcCallSession.to,
			userVariables: {
				memberCallId: this.webRtcCallSession.id,
				memberId,
				...this.webRtcCallSession.options.userVariables,
				...PreferencesContainer.instance.userVariables
			},
			screenShare: rtcPeerConnectionController.isScreenShare,
			additionalDevice: rtcPeerConnectionController.isAdditionalDevice,
			pingSupported: true,
			version: INVITE_VERSION
		};
	}
	muteMainAudioInputDevice() {
		return this.mainPeerConnection.stopTrackSender("audio");
	}
	muteMainVideoInputDevice() {
		return this.mainPeerConnection.stopTrackSender("video");
	}
	async unmuteMainAudioInputDevice() {
		return this.mainPeerConnection.restoreTrackSender("audio");
	}
	async unmuteMainVideoInputDevice() {
		return this.mainPeerConnection.restoreTrackSender("video");
	}
	async addInputDevice(options = {
		audio: false,
		video: true
	}) {
		return this.initAdditionalPeerConnection("additional-device", options);
	}
	/**
	* Add a new input device to the main peer connection,
	* only if a device of the same kind is not present already.
	*
	* @see selectAudioInputDevice
	* @see selectVideoInputDevice
	* @param options
	*/
	async addMainInputDevices(options = { audio: true }) {
		let deviceKind = void 0;
		const { mediaDirections } = this.mainPeerConnection;
		if (options.audio ?? options.inputAudioDeviceConstraints ?? (options.inputAudioStream && mediaDirections.audio.startsWith("send"))) deviceKind = "audio";
		if (options.video ?? options.inputVideoDeviceConstraints ?? (options.inputVideoStream && !mediaDirections.video.startsWith("send"))) deviceKind = deviceKind === "audio" ? "both" : "video";
		if (deviceKind) {
			this.mainPeerConnection.updateMediaDevicesOptions(options);
			await this.mainPeerConnection.restoreTrackSender(deviceKind);
		} else {
			const error = new InvalidParams("No valid device to be added");
			this.onError?.(error);
			throw error;
		}
	}
	async addScreenMedia(options = { audio: false }) {
		await this.initAdditionalPeerConnection("screenshare", options);
	}
	async initAdditionalPeerConnection(propose, options) {
		let rtcPeerConnController = null;
		try {
			this._screenShareStatus$.next("starting");
			rtcPeerConnController = new RTCPeerConnectionController({
				...options,
				...this.RTCPeerConnectionConfig,
				propose
			}, void 0, this.deviceController);
			this.setupLocalDescriptionHandler(rtcPeerConnController);
			if (propose === "screenshare") this._screenShareId = rtcPeerConnController.id;
			this._rtcPeerConnectionsMap.set(rtcPeerConnController.id, rtcPeerConnController);
			this._rtcPeerConnections$.next(Array.from(this._rtcPeerConnectionsMap.values()));
			this.subscribeTo(rtcPeerConnController.errors$, (error) => {
				this.onError?.(error);
			});
			await (0, import_cjs$10.firstValueFrom)(rtcPeerConnController.connectionState$.pipe((0, import_cjs$10.filter)((state) => state === "connected"), (0, import_cjs$10.take)(1), (0, import_cjs$10.timeout)(this._screenShareTimeoutMs)));
			this._screenShareStatus$.next("started");
			logger$10.info("[WebRTCManager] Screen share started successfully.");
			return rtcPeerConnController.id;
		} catch (error) {
			logger$10.warn("[WebRTCManager] Error initializing additional peer connection:", error);
			this.onError?.(error instanceof Error ? error : new Error(String(error), { cause: error }));
			if (rtcPeerConnController) rtcPeerConnController.destroy();
			this._screenShareStatus$.next("none");
		}
	}
	async removeInputDevices(id) {
		return this.removeAdditionalPeerConnection(id);
	}
	removeMainInputDevice(options = {
		removeAudio: false,
		removeVideo: true
	}) {
		let removeTrack = void 0;
		if (options.removeAudio) removeTrack = "audio";
		if (options.removeVideo) removeTrack = removeTrack === "audio" ? "both" : "video";
		if (removeTrack) return this.mainPeerConnection.stopTrackSender(removeTrack, { updateTransceiverDirection: true });
	}
	async removeScreenMedia() {
		if (!["starting", "started"].includes(this._screenShareStatus$.value)) logger$10.warn("[WebRTCManager] No active screen share to stop.");
		if (!this._screenShareId) {
			logger$10.debug("[WebRTCManager] No screen share peer connection found.");
			return;
		}
		this._screenShareStatus$.next("stopping");
		await this.removeAdditionalPeerConnection(this._screenShareId);
		this._screenShareId = void 0;
		this._screenShareStatus$.next("none");
	}
	async removeAdditionalPeerConnection(id) {
		const rtcPeerConnController = this._rtcPeerConnectionsMap.get(id);
		try {
			if (rtcPeerConnController) await this.executeVertoBye(rtcPeerConnController);
		} finally {
			rtcPeerConnController?.destroy();
			this._rtcPeerConnectionsMap.delete(id);
			this._rtcPeerConnections$.next(Array.from(this._rtcPeerConnectionsMap.values()));
		}
	}
	async executeVertoBye(rtcPeerConnController, cause) {
		try {
			const causeParams = cause ? {
				cause,
				cause_code: VertoByeCauseCodes[cause]
			} : {};
			await this.executeVerto(VertoBye({
				...causeParams,
				dialogParams: this.dialogParams(rtcPeerConnController)
			}));
		} catch (error) {
			logger$10.warn("[WebRTCManager] Call might already be disconnected, error sending Verto bye:", error);
			throw error;
		}
	}
	async bye(cause) {
		this.attachManager.detach(this.webRtcCallSession);
		const rtcPeerConnController = this._rtcPeerConnectionsMap.get(this.webRtcCallSession.id);
		if (rtcPeerConnController) await this.executeVertoBye(rtcPeerConnController, cause);
	}
	async sendDigits(dtmf) {
		const vertoInfoMessage = VertoInfo({
			sessid: this.webRtcCallSession.id,
			dialogParams: { callID: this.webRtcCallSession.id },
			dtmf
		});
		try {
			await this.executeVerto(vertoInfoMessage);
		} catch (error) {
			logger$10.warn("[WebRTCManager] Error sending DTMF digits:", error);
			throw error;
		}
	}
	destroy() {
		this._rtcPeerConnectionsMap.forEach((rtcPeerConnController) => {
			rtcPeerConnController.destroy();
		});
		this._rtcPeerConnectionsMap.clear();
		this._rtcPeerConnections$.complete();
		super.destroy();
	}
};

//#endregion
//#region src/managers/ParticipantFactory.ts
/**
* Factory for creating Participant instances with proper dependency injection
* Eliminates circular dependency between Call and Participant
*/
var ParticipantFactory = class {
	constructor(executeMethod, vertoManager, deviceController) {
		this.executeMethod = executeMethod;
		this.vertoManager = vertoManager;
		this.deviceController = deviceController;
	}
	/**
	* Create a self participant (the local user in the call)
	*/
	createSelfParticipant(id) {
		return new SelfParticipant(id, this.executeMethod, this.vertoManager, this.deviceController);
	}
	/**
	* Create a remote participant
	*/
	createParticipant(id) {
		return new Participant(id, this.executeMethod, this.deviceController);
	}
};

//#endregion
//#region src/core/entities/Call.ts
var import_cjs$9 = require_cjs();
const logger$9 = getLogger();
/**
* Concrete WebRTC call implementation.
*
* Manages the full lifecycle of a call including signaling, media streams,
* participants, layout, and event routing. Created via {@link SignalWire.dial}
* or received as an inbound call.
*/
var WebRTCCall = class extends Destroyable {
	constructor(clientSession, options, initialization, address) {
		super();
		this.clientSession = clientSession;
		this.options = options;
		this.address = address;
		this.participantsMap = /* @__PURE__ */ new Map();
		this._errors$ = this.createSubject();
		this._answered$ = this.createReplaySubject();
		this._holdState = false;
		this.id = options.callId ?? v4_default();
		this.to = options.to;
		const managers = initialization.initializeManagers(this);
		this.vertoManager = managers.vertoManager;
		this.callEventsManager = managers.callEventsManager;
		if (options.initOffer) this._status$ = this.createBehaviorSubject("ringing");
		else this._status$ = this.createBehaviorSubject("new");
		const { deviceController } = initialization;
		this.participantFactory = new ParticipantFactory(this.executeMethod.bind(this), this.vertoManager, deviceController);
	}
	/** Observable stream of errors from media, signaling, and peer connection layers. */
	get errors$() {
		return this._errors$.asObservable();
	}
	/** @internal Push an error to the call's error stream. */
	emitError(error) {
		this._errors$.next(error);
	}
	/** Whether this call is `'inbound'` or `'outbound'`. */
	get direction() {
		return this.options.initOffer ? "inbound" : "outbound";
	}
	/** Observable of the address associated with this call. */
	get address$() {
		return (0, import_cjs$9.from)([this.address]);
	}
	/** Display name of the caller. */
	get fromName() {
		return this.options.fromName;
	}
	/** Address URI of the caller. */
	get from() {
		return this.options.from;
	}
	/** Display name of the callee. */
	get toName() {
		return this.options.toName;
	}
	/** Toggles whether incoming video is received. @throws {UnimplementedError} Not yet implemented. */
	async toggleIncomingVideo() {
		throw new UnimplementedError();
	}
	/** Toggles whether incoming audio is received. @throws {UnimplementedError} Not yet implemented. */
	async toggleIncomingAudio() {
		throw new UnimplementedError();
	}
	/** @internal Registers an additional call ID for event routing. */
	addCallId(callId) {
		this.callEventsManager.addCallId(callId);
	}
	/** List of capabilities available in the current call. */
	get capabilities() {
		return this.callEventsManager.capabilities;
	}
	/** Current snapshot of all participants in the call. */
	get participants() {
		return Array.from(this.participantsMap.values());
	}
	/** The local participant, or `null` if not yet joined. */
	get self() {
		return this.callEventsManager.self;
	}
	async toggleLock() {
		const method = this.locked ? "call.unlock" : "call.lock";
		await this.executeMethod(this.selfId ?? "", method, {});
		throw new UnimplementedError();
	}
	async toggleHold() {
		if (this._holdState) await this.vertoManager.unhold();
		else await this.vertoManager.hold();
		this._holdState = !this._holdState;
	}
	async startRecording() {
		throw new UnimplementedError();
	}
	async startStreaming() {
		throw new UnimplementedError();
	}
	async setMeta(_meta) {
		throw new UnimplementedError();
	}
	async updateMeta(_meta) {
		throw new UnimplementedError();
	}
	/** Observable of layout layer positions for all participants. */
	get layoutLayers$() {
		return this.callEventsManager.layoutLayers$;
	}
	/** Current snapshot of layout layers. */
	get layoutLayers() {
		return this.callEventsManager.layoutLayers;
	}
	/** Executes a Verto RPC method targeting a specific participant. */
	async executeMethod(target, method, args) {
		const params = this.buildMethodParams(target, args);
		const request = buildRPCRequest({
			method,
			params
		});
		try {
			return await this.clientSession.execute(request);
		} catch (error) {
			logger$9.error(`[Call] Error executing method ${method} with params`, params, error);
			throw error;
		}
	}
	buildMethodParams(target, args) {
		const reference = {
			node_id: this.nodeId,
			call_id: this.id
		};
		return {
			...args,
			self: {
				...reference,
				member_id: this.vertoManager.selfId
			},
			target: {
				...reference,
				member_id: target
			}
		};
	}
	/** Observable of the current call status (e.g. `'ringing'`, `'connected'`). */
	get status$() {
		return (0, import_cjs$9.merge)(this._status$.asObservable(), this.vertoManager.signalingStatus$);
	}
	/** Observable of the participants list, emits on join/leave/update. */
	get participants$() {
		return this.callEventsManager.participants$;
	}
	/** Observable of the local (self) participant. */
	get self$() {
		return this.callEventsManager.self$;
	}
	/** Observable indicating whether the call is being recorded. */
	get recording$() {
		return this.callEventsManager.recording$;
	}
	/** Observable indicating whether the call is being streamed. */
	get streaming$() {
		return this.callEventsManager.streaming$;
	}
	/** Observable indicating whether raise-hand priority is active. */
	get raiseHandPriority$() {
		return this.callEventsManager.raiseHandPriority$;
	}
	/** Observable indicating whether the call room is locked. */
	get locked$() {
		return this.callEventsManager.locked$;
	}
	/** Observable of custom metadata associated with the call. */
	get meta$() {
		return this.callEventsManager.meta$;
	}
	/** Observable of the call's capability flags. */
	get capabilities$() {
		return this.callEventsManager.capabilities$;
	}
	/** Observable of the current layout name. */
	get layout$() {
		return this.callEventsManager.layout$;
	}
	/** Current call status. */
	get status() {
		return this._status$.value;
	}
	/** Whether the call is currently being recorded. */
	get recording() {
		return this.callEventsManager.recording;
	}
	/** Whether the call is currently being streamed. */
	get streaming() {
		return this.callEventsManager.streaming;
	}
	/** Whether raise-hand priority is active. */
	get raiseHandPriority() {
		return this.callEventsManager.raiseHandPriority;
	}
	/** Whether the call room is locked. */
	get locked() {
		return this.callEventsManager.locked;
	}
	/** Current custom metadata of the call. */
	get meta() {
		return this.callEventsManager.meta;
	}
	/** Current layout name, or `undefined` if not set. */
	get layout() {
		return this.callEventsManager.layout;
	}
	/** Observable of available layout names. */
	get layouts$() {
		return this.callEventsManager.layouts$;
	}
	/** Current snapshot of available layout names. */
	get layouts() {
		return this.callEventsManager.layouts;
	}
	/** Observable of the local media stream (camera/microphone). */
	get localStream$() {
		return this.vertoManager.localStream$;
	}
	/** Current local media stream, or `null` if not available. */
	get localStream() {
		return this.vertoManager.localStream;
	}
	/** Observable of the remote media stream from the far end. */
	get remoteStream$() {
		return this.vertoManager.remoteStream$;
	}
	/** Current remote media stream, or `null` if not available. */
	get remoteStream() {
		return this.vertoManager.remoteStream;
	}
	/** @internal */
	createParticipant(memberId, selfId) {
		if (memberId === (selfId ?? this.vertoManager.selfId)) return this.participantFactory.createSelfParticipant(memberId);
		return this.participantFactory.createParticipant(memberId);
	}
	/** Observable of the current audio/video send/receive directions. */
	get mediaDirections$() {
		return this.vertoManager.mediaDirections$;
	}
	/** Current audio/video send/receive directions. */
	get mediaDirections() {
		return this.vertoManager.mediaDirections;
	}
	get participantsId$() {
		return this.participants$.pipe((0, import_cjs$9.map)((participants) => participants.map((participant) => participant.id)));
	}
	/** Executes a raw JSON-RPC request on the client session. */
	async execute(request, options) {
		return this.clientSession.execute(request, options);
	}
	/** Observable of the local participant's member ID. */
	get selfId$() {
		return this.vertoManager.selfId$;
	}
	/** Local participant's member ID, or `null` if not joined. */
	get selfId() {
		return this.vertoManager.selfId;
	}
	/** Observable of the server node ID handling this call. */
	get nodeId$() {
		return this.vertoManager.nodeId$;
	}
	/** Server node ID handling this call, or `null`. */
	get nodeId() {
		return this.vertoManager.nodeId;
	}
	isCallSessionEvent(event) {
		try {
			logger$9.debug("[Call] Checking if event is for this call session:", event);
			const callId = getValueFrom(event, "params.params.callID") ?? getValueFrom(event, "params.call_id");
			const roomSessionId = getValueFrom(event, "params.room_session_id");
			logger$9.debug(`[Call] Extracted session identifiers callID: ${callId} and roomSessionID: ${roomSessionId} from event:`);
			return callId === this.id || !!callId && this.callEventsManager.isCallIdValid(callId) || !!roomSessionId && this.callEventsManager.isRoomSessionIdValid(roomSessionId);
		} catch (error) {
			logger$9.error("[Call] Error checking if event is for this call session:", error);
			return false;
		}
	}
	get callSessionEvents$() {
		return this.clientSession.signalingEvent$.pipe((0, import_cjs$9.filter)((event) => this.isCallSessionEvent(event)), (0, import_cjs$9.tap)((event) => logger$9.debug("[Call] Received call session event:", event)), (0, import_cjs$9.takeUntil)(this.destroyed$));
	}
	/** Observable of call-updated events. */
	get callUpdated$() {
		return this.callSessionEvents$.pipe(filterAs(isCallUpdatedMetadata, "params"), (0, import_cjs$9.takeUntil)(this.destroyed$));
	}
	/** Observable of member-joined events. */
	get memberJoined$() {
		return this.callSessionEvents$.pipe(filterAs(isMemberJoinedMetadata, "params"), (0, import_cjs$9.takeUntil)(this.destroyed$));
	}
	/** Observable of member-left events. */
	get memberLeft$() {
		return this.callSessionEvents$.pipe(filterAs(isMemberLeftMetadata, "params"), (0, import_cjs$9.takeUntil)(this.destroyed$));
	}
	/** Observable of member-updated events (mute, volume, etc.). */
	get memberUpdated$() {
		return this.callSessionEvents$.pipe(filterAs(isMemberUpdatedMetadata, "params"), (0, import_cjs$9.takeUntil)(this.destroyed$));
	}
	/** Observable of member-talking events (speech start/stop). */
	get memberTalking$() {
		return this.callSessionEvents$.pipe(filterAs(isMemberTalkingMetadata, "params"), (0, import_cjs$9.takeUntil)(this.destroyed$));
	}
	/** Observable of call state-change events. */
	get callStates$() {
		return this.callSessionEvents$.pipe(filterAs(isCallStateMetadata, "params"), (0, import_cjs$9.takeUntil)(this.destroyed$));
	}
	/** Observable of layout-changed events. */
	get layoutUpdates$() {
		return this.callSessionEvents$.pipe(filterAs(isLayoutChangedMetadata, "params"), (0, import_cjs$9.takeUntil)(this.destroyed$));
	}
	/** Underlying `RTCPeerConnection`, for advanced use cases. */
	get rtcPeerConnection() {
		return this.vertoManager.mainPeerConnection.peerConnection;
	}
	/** Observable of raw signaling events as plain objects. */
	get signalingEvent$() {
		return this.callEvent$.pipe((0, import_cjs$9.map)((event) => JSON.parse(JSON.stringify(event))));
	}
	/** Observable of WebRTC-specific signaling messages. */
	get webrtcMessages$() {
		return this.callSessionEvents$.pipe(filterAs(isWebrtcMessageMetadata, "params"), (0, import_cjs$9.tap)((event) => logger$9.debug("[Call] Event is a WebRTC message event:", event)), (0, import_cjs$9.takeUntil)(this.destroyed$));
	}
	/** Observable of call-level signaling events. */
	get callEvent$() {
		return this.callSessionEvents$.pipe(filterAs(isSignalwireCallMetadata, "params"), (0, import_cjs$9.tap)((event) => logger$9.debug("[Call] Event is a call event:", event)), (0, import_cjs$9.takeUntil)(this.destroyed$));
	}
	/** Observable of layout-changed signaling events. */
	get layoutEvent$() {
		return this.callEvent$.pipe(filterAs(isLayoutChangedMetadata, "params"));
	}
	/** Hangs up the call and releases all resources. */
	async hangup() {
		this._status$.next("disconnecting");
		try {
			await this.vertoManager.bye();
		} finally {
			this._status$.next("destroyed");
			this.destroy();
		}
	}
	/** Sends DTMF digits (e.g. `'1234#'`) on the call. */
	async sendDigits(dtmf) {
		return this.vertoManager.sendDigits(dtmf);
	}
	/** Accepts an inbound call. */
	answer() {
		this._answered$.next(true);
	}
	/** Rejects an inbound call. */
	reject() {
		this._answered$.next(false);
	}
	/** Observable that emits `true` when answered, `false` when rejected. */
	get answered$() {
		return this._answered$.asObservable();
	}
	/**
	* Sets the call layout and participant positions.
	* @param layout - Layout name (must be one of {@link layouts}).
	* @param positions - Map of member IDs to video positions.
	*/
	async setLayout(layout, positions) {
		if (!this.layouts.includes(layout)) throw new InvalidParams(`Layout ${layout} is not available in the current call layouts: ${this.layouts.join(", ")}`);
		const selfId = await (0, import_cjs$9.firstValueFrom)(this.selfId$.pipe((0, import_cjs$9.filter)((id) => id !== null)));
		await this.executeMethod(selfId, "call.layout.set", {
			layout,
			positions
		});
	}
	/** Transfers the call to other participants. @throws {UnimplementedError} Not yet implemented. */
	async transfer(_participants, _options) {
		throw new UnimplementedError();
	}
	/** Destroys the call, releasing all resources and subscriptions. */
	destroy() {
		this.vertoManager.destroy();
		this.callEventsManager.destroy();
		this.participantsMap.clear();
		super.destroy();
	}
};

//#endregion
//#region src/managers/CallFactory.ts
/**
* Factory for creating WebRTCCall instances with proper manager wiring.
* Eliminates circular dependencies by centralizing Call and Manager creation.
*/
var CallFactory = class {
	constructor(sessionManager, deviceController, attachManager) {
		this.sessionManager = sessionManager;
		this.deviceController = deviceController;
		this.attachManager = attachManager;
	}
	/**
	* Create a new WebRTCCall with properly initialized managers
	*/
	createCall(address, options) {
		return new WebRTCCall(this.sessionManager, options, {
			initializeManagers: (callInstance) => {
				return {
					vertoManager: new WebRTCVertoManager(callInstance, this.attachManager, this.deviceController, {
						nodeId: options.nodeId,
						onError: (error) => {
							callInstance.emitError(error);
						}
					}),
					callEventsManager: new CallEventsManager(callInstance)
				};
			},
			deviceController: this.deviceController
		}, address);
	}
};

//#endregion
//#region src/behaviors/Collection.ts
var import_cjs$8 = require_cjs();
const logger$8 = getLogger();
var Fetcher = class {
	constructor(endpoint, params, http) {
		this.endpoint = endpoint;
		this.http = http;
		this.filter = (_item) => true;
		this.mapper = (item) => item;
		this.nextUrl = `${this.endpoint}?${params}`;
	}
	async next() {
		if (!this.nextUrl) return [];
		const response = await this.http.request({
			...GET_PARAMS,
			url: this.nextUrl
		});
		if (response.ok && !!response.body) {
			const result = JSON.parse(response.body);
			this.nextUrl = result.links.next;
			return result.data.filter(this.filter).map(this.mapper);
		}
		logger$8.error("Failed to fetch entity");
		return [];
	}
	async id(v) {
		const response = await this.http.request({
			...GET_PARAMS,
			url: `${this.endpoint}/${String(v)}`
		});
		if (response.ok && !!response.body) return JSON.parse(response.body);
	}
};
var EntityCollection = class extends Destroyable {
	constructor(fetchController, update$, onError) {
		super();
		this.fetchController = fetchController;
		this.update$ = update$;
		this.onError = onError;
		this.loading$ = this.createBehaviorSubject(false);
		this.values$ = this.createReplaySubject(1);
		this.collectionData = /* @__PURE__ */ new Map();
		this.observablesRegistry = /* @__PURE__ */ new Map();
		this.upsertData = (data) => {
			if (!data.id) return;
			const updated = {
				...this.collectionData.get(data.id) ?? {},
				...data
			};
			this.collectionData.set(data.id, updated);
			this.observablesRegistry.get(data.id)?.next(updated);
			this.values$.next(Array.from(this.collectionData.values()));
		};
		this._destroy$ = new import_cjs$8.Subject();
		this.updateSubscription = this.update$.subscribe(this.upsertData);
		this.loading$.next(false);
		this.hasMore$ = (0, import_cjs$8.defer)(() => (0, import_cjs$8.from)(this.init())).pipe((0, import_cjs$8.shareReplay)(1), (0, import_cjs$8.takeUntil)(this._destroy$));
	}
	get loading() {
		return this.loading$.value;
	}
	get hasMore() {
		return this.fetchController.hasMore ?? true;
	}
	get updated$() {
		return this.loading$.pipe((0, import_cjs$8.distinctUntilChanged)(), (0, import_cjs$8.skip)(1), (0, import_cjs$8.filter)((loading) => !loading), (0, import_cjs$8.map)(() => void 0), (0, import_cjs$8.takeUntil)(this._destroy$));
	}
	get values() {
		return Array.from(this.collectionData.values());
	}
	async init() {
		if (this.fetchController.hasMore === false) return Promise.resolve(false);
		await this.fetchMore();
		return this.fetchController.hasMore ?? true;
	}
	async fetchMore() {
		try {
			this.loading$.next(true);
			(await this.fetchController.next()).forEach(this.upsertData);
			this.loading$.next(false);
		} catch (error) {
			logger$8.error(`Failed to fetch initial collection data`, error);
			this.loading$.next(false);
			this.onError?.(new CollectionFetchError("fetchMore", error));
		}
	}
	async tryFetch(key, value) {
		try {
			this.loading$.next(true);
			const data = await this.fetchController[key]?.(value);
			this.loading$.next(false);
			if (data) this.upsertData(data);
			return data;
		} catch (error) {
			logger$8.error(`Failed to fetch data for (${String(key)}:${String(value)}) :`, error);
			this.loading$.next(false);
			this.onError?.(new CollectionFetchError(`tryFetch(${String(key)})`, error));
		}
	}
	get$(id) {
		if (!this.observablesRegistry.has(id)) {
			this.observablesRegistry.set(id, new import_cjs$8.ReplaySubject(1));
			const data = this.collectionData.get(id);
			if (data) this.observablesRegistry.get(id)?.next(data);
			else this.tryFetch("id", id);
		}
		return this.observablesRegistry.get(id)?.asObservable();
	}
	async find$(key, value) {
		const data = Array.from(this.collectionData.values()).find((item) => item[key] === value) ?? await this.tryFetch(key, value);
		return data ? this.get$(data.id) : void 0;
	}
	loadMore() {
		if (this.fetchController.hasMore !== false) this.fetchMore();
	}
	destroy() {
		this._destroy$.next();
		this._destroy$.complete();
		this.updateSubscription.unsubscribe();
		this.loading$.complete();
		this.observablesRegistry.forEach((subject) => subject.complete());
	}
};
var EntityCollectionTransformed = class {
	constructor(originalCollection, filter$13 = (i) => !!i, mapper = (item) => item) {
		this.originalCollection = originalCollection;
		this.filter = filter$13;
		this.mapper = mapper;
	}
	get loading$() {
		return this.originalCollection.loading$;
	}
	get loading() {
		return this.originalCollection.loading;
	}
	get hasMore$() {
		return this.originalCollection.hasMore$;
	}
	get hasMore() {
		return this.originalCollection.hasMore;
	}
	get values() {
		return this.originalCollection.values.filter(this.filter).map(this.mapper);
	}
	get values$() {
		return this.originalCollection.values$.pipe((0, import_cjs$8.map)((values) => values.filter(this.filter).map(this.mapper)));
	}
	get$(id) {
		const original$ = this.originalCollection.get$(id);
		return !original$ ? original$ : original$.pipe((0, import_cjs$8.pipe)((0, import_cjs$8.filter)(this.filter), (0, import_cjs$8.map)(this.mapper)));
	}
	async find$(key, value) {
		const original$ = await this.originalCollection.find$(key, value);
		return !original$ ? original$ : original$.pipe((0, import_cjs$8.pipe)((0, import_cjs$8.filter)(this.filter), (0, import_cjs$8.map)(this.mapper)));
	}
	loadMore() {
		this.originalCollection.loadMore();
	}
	destroy() {
		this.originalCollection.destroy();
	}
};

//#endregion
//#region src/core/entities/Address.ts
var import_cjs$7 = require_cjs();
/**
* Represents a contact or room in the directory.
*
* Provides identity metadata, conversation history, text messaging,
* and activity state for an address entry.
*/
var Address = class extends Destroyable {
	constructor(addressId, conversationManager, addressProvider) {
		super();
		this.addressId = addressId;
		this.conversationManager = conversationManager;
		this.addressProvider = addressProvider;
		this.initConversationMessages = async () => {
			this._conversationMessages = this._conversationMessages ?? await this.conversationManager.getConversationMessageCollection(this.id);
			if (this._conversationMessages.hasMore) this._conversationMessages.loadMore();
			return this._conversationMessages;
		};
		this.textMessages$ = (0, import_cjs$7.defer)(this.initConversationMessages).pipe((0, import_cjs$7.map)(() => this.textMessage), (0, import_cjs$7.shareReplay)(1), (0, import_cjs$7.takeUntil)(this.destroyed$));
		this.history$ = (0, import_cjs$7.defer)(this.initConversationMessages).pipe((0, import_cjs$7.map)(() => this.history), (0, import_cjs$7.shareReplay)(1), (0, import_cjs$7.takeUntil)(this.destroyed$));
		this._state$ = this.createBehaviorSubject(null);
	}
	/** @internal */
	upnext(state) {
		const update = {
			...this._state$.value,
			...state
		};
		this._state$.next(update);
	}
	/** @internal */
	get state() {
		return this._state$.value;
	}
	/** Unique address identifier. */
	get id() {
		return this.addressId;
	}
	/** Address name (resource identifier). */
	get name() {
		if (!this._state$.value) throw new DependencyError("state not initialized");
		return this._state$.value.name;
	}
	/** ISO timestamp of when the address was created. */
	get createdAt() {
		if (!this._state$.value) throw new DependencyError("state not initialized");
		return this._state$.value.created_at;
	}
	/** Default communication channel URI (video for rooms, audio otherwise). */
	get defaultChannel() {
		return this.type === "room" ? this.channels.video : this.channels.audio;
	}
	/** Observable of the human-readable display name. */
	get displayName$() {
		return this._state$.pipe(filterNull(), (0, import_cjs$7.map)((state) => state.display_name), (0, import_cjs$7.takeUntil)(this.destroyed$));
	}
	/** Human-readable display name. */
	get displayName() {
		if (!this._state$.value) throw new DependencyError("state not initialized");
		return this._state$.value.display_name;
	}
	/** Observable of the preview image URL. */
	get previewUrl$() {
		return this._state$.pipe(filterNull(), (0, import_cjs$7.map)((state) => state.preview_url), (0, import_cjs$7.takeUntil)(this.destroyed$));
	}
	/** Preview image URL. */
	get previewUrl() {
		if (!this._state$.value) throw new DependencyError("state not initialized");
		return this._state$.value.preview_url;
	}
	/** Observable of the cover image URL. */
	get coverUrl$() {
		return this._state$.pipe(filterNull(), (0, import_cjs$7.shareReplay)(1), (0, import_cjs$7.map)((state) => state.cover_url), (0, import_cjs$7.takeUntil)(this.destroyed$));
	}
	/** Cover image URL. */
	get coverUrl() {
		if (!this._state$.value) throw new DependencyError("state not initialized");
		return this._state$.value.cover_url;
	}
	/** Observable of the underlying resource ID. */
	get resourceId$() {
		return this._state$.pipe(filterNull(), (0, import_cjs$7.shareReplay)(1), (0, import_cjs$7.map)((state) => state.resource_id), (0, import_cjs$7.takeUntil)(this.destroyed$));
	}
	/** Underlying resource ID. */
	get resourceId() {
		if (!this._state$.value) throw new DependencyError("state not initialized");
		return this._state$.value.resource_id;
	}
	/** Observable of the resource type (e.g. `'room'`, `'subscriber'`). */
	get type$() {
		return this._state$.pipe(filterNull(), (0, import_cjs$7.shareReplay)(1), (0, import_cjs$7.map)((state) => state.type), (0, import_cjs$7.takeUntil)(this.destroyed$));
	}
	/** Resource type (e.g. `'room'`, `'subscriber'`). */
	get type() {
		if (!this._state$.value) throw new DependencyError("state not initialized");
		return this._state$.value.type;
	}
	/** Observable of available communication channels (audio, video, messaging). */
	get channels$() {
		return this._state$.pipe(filterNull(), (0, import_cjs$7.shareReplay)(1), (0, import_cjs$7.map)((state) => state.channels), (0, import_cjs$7.takeUntil)(this.destroyed$));
	}
	/** Available communication channels. */
	get channels() {
		if (!this._state$.value) throw new DependencyError("state not initialized");
		return this._state$.value.channels;
	}
	/** Whether the address (room) is locked. */
	get locked() {
		if (!this._state$.value) throw new DependencyError("state not initialized");
		return this._state$.value.locked;
	}
	/** Observable indicating whether the address (room) is locked. */
	get locked$() {
		return this._state$.pipe(filterNull(), (0, import_cjs$7.shareReplay)(1), (0, import_cjs$7.map)((state) => state.locked), (0, import_cjs$7.takeUntil)(this.destroyed$));
	}
	/** Sends a text message to this address. */
	async sendText(text) {
		return this.conversationManager.sendText(text, this.id);
	}
	/** Collection of text messages for this address, with pagination support. */
	get textMessage() {
		if (!this._conversationMessages) return;
		this._textMessages$ = this._textMessages$ ?? new EntityCollectionTransformed(this._conversationMessages, (item) => item.subtype === "chat", (item) => ({
			id: item.id,
			text: item.text,
			created: item.ts,
			fromAddress$: this.addressProvider.get$(item.from_fabric_address_id)
		}));
		return this._textMessages$;
	}
	/** Collection of call history entries for this address, with pagination support. */
	get history() {
		if (!this._conversationMessages) return;
		this._history$ = this._history$ ?? new EntityCollectionTransformed(this._conversationMessages, (item) => item.subtype === "log", (item) => ({
			id: item.id,
			kind: item.kind,
			status: item.details.status,
			started: item.details.start_time,
			ended: item.details.end_time,
			fromAddress$: this.addressProvider.get$(item.from_fabric_address_id)
		}));
		return this._history$;
	}
	/** Observable of active call states for this address. @throws {UnimplementedError} Requires presence support. */
	get activity$() {
		throw new UnimplementedError();
	}
	/** Active call states for this address. @throws {UnimplementedError} Requires presence support. */
	get activity() {
		throw new UnimplementedError();
	}
};

//#endregion
//#region src/core/utils.ts
var import_cjs$6 = require_cjs();
const logger$7 = getLogger();
const isRPCConnectResult = (e) => {
	logger$7.debug("isRPCConnectResult check:", e);
	if (!e || typeof e !== "object") return false;
	const result = e;
	const is = typeof result.identity === "string" && typeof result.protocol === "string" && typeof result.authorization === "object" && typeof result.authorization.jti === "string" && typeof result.authorization.project_id === "string" && typeof result.authorization.fabric_subscriber === "object";
	logger$7.debug("isRPCConnectResult check result:", is);
	return is;
};
var PendingRPC = class PendingRPC {
	static {
		this.defaultTimeoutMs = 5e3;
	}
	constructor(request, responses$, options) {
		this.id = v4_default();
		logger$7.debug(`[PendingRPC(${this.id}) request:${request.id}: method:${request.method}] Creating PendingRPC`);
		this.request = request;
		const timeoutMs = options?.timeoutMs ?? PendingRPC.defaultTimeoutMs;
		const signal = options?.signal;
		this.promise = new Promise((resolve, reject) => {
			if (signal?.aborted) {
				reject(new DOMException("The operation was aborted", "AbortError"));
				return;
			}
			let isSettled = false;
			const subscription = (0, import_cjs$6.race)(responses$.pipe((0, import_cjs$6.filter)((result) => result.id === request.id), (0, import_cjs$6.take)(1)), new import_cjs$6.Observable((subscriber) => {
				const timer$1 = setTimeout(() => {
					subscriber.error(new RPCTimeoutError(request.id, timeoutMs));
				}, timeoutMs);
				return () => clearTimeout(timer$1);
			}), signal ? new import_cjs$6.Observable((subscriber) => {
				const abortHandler = () => {
					subscriber.error(new DOMException("The operation was aborted", "AbortError"));
				};
				signal.addEventListener("abort", abortHandler);
				return () => signal.removeEventListener("abort", abortHandler);
			}) : import_cjs$6.NEVER).subscribe({
				next: (response) => {
					logger$7.debug(`[PendingRPC(${this.id}) request:${request.id}] Resolving promise with response:`, response);
					isSettled = true;
					resolve(response);
					subscription.unsubscribe();
				},
				error: (error) => {
					logger$7.debug(`[PendingRPC(${this.id}) request:${request.id}] Rejecting promise with error:`, error);
					isSettled = true;
					reject(error);
					subscription.unsubscribe();
				},
				complete: () => {
					logger$7.debug(`[PendingRPC(${this.id}) request:${request.id}] Observable completed`);
					if (!isSettled) reject(new RPCTimeoutError(request.id, timeoutMs));
					subscription.unsubscribe();
				}
			});
		});
	}
	async then(onfulfilled, onrejected) {
		return this.promise.then(onfulfilled, onrejected);
	}
	async catch(onrejected) {
		return this.promise.catch(onrejected);
	}
	async finally(onfinally) {
		return this.promise.finally(onfinally);
	}
};

//#endregion
//#region src/managers/ClientSessionManager.ts
var import_cjs$5 = require_cjs();
const logger$6 = getLogger();
const getAddressSearchURI = (options) => {
	const to = options.to?.split("?")[0];
	const from$7 = options.from?.startsWith("subscriber://") ? options.from.replace("subscriber://", "") : options.from;
	const name = to ?? from$7;
	if (!name) throw new UnexpectedError("Error building Address name");
	return name;
};
var ClientSessionManager = class extends Destroyable {
	constructor(credential, transport, storage, authorizationStateKey, deviceController, attachManager) {
		super();
		this.credential = credential;
		this.transport = transport;
		this.storage = storage;
		this.authorizationStateKey = authorizationStateKey;
		this.attachManager = attachManager;
		this.callCreateTimeout = 6e3;
		this.agent = `signalwire-typescript-sdk/1.0.0`;
		this.eventAcks = true;
		this.authorization$ = this.createSubject();
		this.authorizationState$ = this.createReplaySubject(1);
		this.connectVersion = {
			major: 4,
			minor: 0,
			revision: 0
		};
		this._errors$ = this.createSubject();
		this._authenticated$ = this.createBehaviorSubject(false);
		this._subscriberInfo$ = this.createBehaviorSubject(null);
		this._calls$ = this.createBehaviorSubject({});
		this._iceServers$ = this.createBehaviorSubject([]);
		attachManager.setSession(this);
		this.callFactory = new CallFactory(this, deviceController, attachManager);
		this.initialized$ = (0, import_cjs$5.defer)(() => (0, import_cjs$5.from)(this.init())).pipe((0, import_cjs$5.shareReplay)(1), (0, import_cjs$5.takeUntil)(this.destroyed$));
	}
	get incomingCalls$() {
		return this.calls$.pipe((0, import_cjs$5.map)((calls) => calls.filter((call) => call.direction === "inbound")));
	}
	get incomingCalls() {
		return Object.values(this._calls$.value).filter((call) => call.direction === "inbound");
	}
	get subscriberInfo$() {
		return this._subscriberInfo$.asObservable();
	}
	get subscriberInfo() {
		return this._subscriberInfo$.value;
	}
	get calls$() {
		return this._calls$.pipe((0, import_cjs$5.map)((calls) => Object.values(calls)));
	}
	get calls() {
		return Object.values(this._calls$.value);
	}
	get iceServers() {
		return this._iceServers$.value;
	}
	get errors$() {
		return this._errors$.asObservable();
	}
	get authenticated$() {
		return this._authenticated$.asObservable();
	}
	get authenticated() {
		return this._authenticated$.value;
	}
	/**
	* Set the directory instance
	* Called by SignalWire after directory is created
	* @internal
	*/
	setDirectory(directory) {
		this._directory = directory;
	}
	async execute(request, options) {
		try {
			return await this.transport.execute(request, options);
		} catch (error) {
			logger$6.debug("[Session] Execute Error", error);
			this._errors$.next(error instanceof Error ? error : new Error(String(error), { cause: error }));
			throw error;
		}
	}
	send(message) {
		this.transport.send(message);
	}
	async init() {
		await this.loadAuthorizationStateFromStorage();
		this.setupMessageHandlers();
		return true;
	}
	setupMessageHandlers() {
		logger$6.debug("[Session] Setting up message handlers");
		this.subscribeTo(this.authStateEvent$, async (authStateEvent) => {
			logger$6.debug("[Session] Authorization state event received:", authStateEvent);
			try {
				await this.updateAuthorizationStateInStorage(authStateEvent.authorization_state);
			} catch (error) {
				logger$6.error("[Session] Failed to handle authorization state update:", error);
				this._errors$.next(new AuthStateHandlerError(error));
			}
		});
		this.subscribeTo(this.transport.connectionStatus$.pipe((0, import_cjs$5.filter)((status) => status === "connected")), async () => {
			try {
				logger$6.debug("[Session] Connection established, initiating authentication");
				await this.authenticate();
			} catch (error) {
				this.handleAuthenticationError(error).catch((err) => {
					logger$6.error("[Session] Error handling authentication failure:", err);
				});
			}
		});
		this.subscribeTo(this.vertoInvite$, async (invite) => {
			logger$6.debug("[Session] Verto invite received:", invite);
			try {
				await this.createInboundCall(invite);
			} catch (error) {
				logger$6.error("[Session] Error handling Verto invite:", error);
				this._errors$.next(new VertoInviteHandlerError(error));
			}
		});
	}
	async loadAuthorizationStateFromStorage() {
		try {
			const storedState = await this.storage.getItem(this.authorizationStateKey);
			this.authorizationState$.next(storedState ?? void 0);
		} catch (error) {
			logger$6.error("Failed to retrieve authorization state from storage:", error);
			this.authorizationState$.next(void 0);
		}
	}
	async updateAuthorizationStateInStorage(authorizationState) {
		if (!authorizationState) {
			logger$6.debug("[Session] Removing authorization state from storage");
			try {
				await this.storage.removeItem(this.authorizationStateKey);
			} catch (error) {
				logger$6.error("Failed to remove authorization state from storage:", error);
				throw error;
			}
			return;
		}
		try {
			logger$6.debug("[Session] Updating authorization state in storage");
			await this.storage.setItem(this.authorizationStateKey, authorizationState);
			this.authorizationState$.next(authorizationState);
		} catch (error) {
			logger$6.error("Failed to retrieve authorization state from storage:", error);
			throw error;
		}
	}
	get authStateEvent$() {
		return this.signalingEvent$.pipe((0, import_cjs$5.tap)((msg) => {
			logger$6.debug("[Session] Received incoming message:", msg);
		}), filterAs(isSignalwireAuthorizationStateMetadata, "params"), (0, import_cjs$5.tap)((event) => {
			logger$6.debug("[Session] Authorization state event received:", event.authorization_state);
		}));
	}
	get signalingEvent$() {
		return this.transport.incomingEvent$.pipe(filterAs(isSignalwireRequest, "params"));
	}
	get vertoInvite$() {
		return this.signalingEvent$.pipe((0, import_cjs$5.filter)(isWebrtcMessageMetadata), (0, import_cjs$5.filter)((event) => isVertoInviteMessage(event.params)), (0, import_cjs$5.map)((event) => ({
			node_id: event.node_id,
			...event.params.params
		})));
	}
	get contexts() {
		return [];
	}
	get eventing() {
		return [];
	}
	get topics() {
		return [];
	}
	get authentication() {
		if (!this.credential.token) throw new DependencyError("Credential token is undefined");
		return { jwt_token: this.credential.token };
	}
	async connect() {
		await (0, import_cjs$5.firstValueFrom)(this.initialized$);
		await this.transport.connect();
	}
	async handleAuthenticationError(error) {
		logger$6.error("Authentication error:", error);
		this._errors$.next(error);
		if (error.message === "Requester validation failed") try {
			await this.cleanupStoredConnectionParams();
		} catch (error$1) {
			logger$6.error("Failed to cleanup stored connection params:", error$1);
		} finally {
			this.transport.reconnect();
		}
	}
	async cleanupStoredConnectionParams() {
		await this.transport.setProtocol(void 0);
		await this.updateAuthorizationStateInStorage(void 0);
		await this.attachManager.detachAll();
	}
	async updateAuthState(authorization_state) {
		try {
			await this.storage.setItem(this.authorizationStateKey, authorization_state);
		} catch (error) {
			logger$6.error("Failed to update authorization state in storage:", error);
			this._errors$.next(new AuthStateHandlerError(error));
		}
	}
	async authenticate() {
		logger$6.debug("[Session] Starting authentication process");
		const params = {
			authentication: this.authentication,
			version: this.connectVersion,
			agent: this.agent,
			contexts: this.contexts,
			eventing: this.eventing,
			topics: this.topics,
			event_acks: this.eventAcks
		};
		const persistedParams = await (0, import_cjs$5.firstValueFrom)((0, import_cjs$5.combineLatest)({
			protocol: this.transport.protocol$,
			authorization_state: this.authorizationState$
		}).pipe((0, import_cjs$5.take)(1)));
		logger$6.debug("[Session] Persisted params:\n", {
			protocol: persistedParams.protocol,
			authStateLength: persistedParams.authorization_state?.length
		});
		const rpcConnectRequest = RPCConnect({
			...params,
			...persistedParams
		});
		const response = await (0, import_cjs$5.lastValueFrom)((0, import_cjs$5.from)(this.transport.execute(rpcConnectRequest)).pipe(throwOnRPCError(), (0, import_cjs$5.map)((res) => res.result), (0, import_cjs$5.filter)(isRPCConnectResult), (0, import_cjs$5.tap)(() => {
			logger$6.debug("[Session] Response passed filter, processing authentication result");
		}), (0, import_cjs$5.take)(1), (0, import_cjs$5.catchError)((err) => {
			logger$6.error("[Session] Authentication RPC failed:", err);
			throw err;
		})));
		logger$6.debug("[Session] Processing authentication result:", {
			hasProtocol: !!response.protocol,
			hasAuthorization: !!response.authorization,
			hasIceServers: !!response.ice_servers
		});
		if (response.protocol) await this.transport.setProtocol(response.protocol);
		this.authorization$.next(response.authorization);
		this._iceServers$.next(response.ice_servers ?? []);
		this._authenticated$.next(true);
		logger$6.debug("[Session] Authentication completed successfully");
	}
	async disconnect() {
		this.transport.disconnect();
		this._authenticated$.next(false);
		await this.cleanupStoredConnectionParams();
	}
	async createInboundCall(invite) {
		const callSession = await this.createCall({
			nodeId: invite.node_id,
			callId: invite.callID,
			initOffer: invite.sdp,
			toName: invite.callee_id_name,
			to: invite.callee_id_number,
			fromName: invite.caller_id_name,
			from: invite.caller_id_number,
			displayDirection: invite.display_direction
		});
		await (0, import_cjs$5.firstValueFrom)(callSession.status$);
		this._calls$.next({
			[`${callSession.id}`]: callSession,
			...this._calls$.value
		});
	}
	async createOutboundCall(destination, options = {}) {
		const destinationURI = destination instanceof Address ? destination.defaultChannel : destination;
		try {
			const callSession = await this.createCall({
				to: destinationURI,
				...options
			});
			await (0, import_cjs$5.firstValueFrom)(callSession.selfId$.pipe((0, import_cjs$5.filter)((id) => Boolean(id)), (0, import_cjs$5.take)(1), (0, import_cjs$5.timeout)(this.callCreateTimeout)));
			this._calls$.next({
				[`${callSession.id}`]: callSession,
				...this._calls$.value
			});
			return callSession;
		} catch (error) {
			logger$6.error("[Session] Error creating outbound call:", error);
			const callError = new CallCreateError("Call create timeout", error);
			this._errors$.next(callError);
			throw callError;
		}
	}
	async createCall(options = {}) {
		try {
			if (!this._directory) throw new DependencyError("Directory not initialized");
			const addressURI = getAddressSearchURI(options);
			const addressId = await this._directory.findAddressIdByURI(addressURI);
			if (!addressId) throw new DependencyError(`Address name: ${addressURI} not found`);
			const address = this._directory.get(addressId);
			if (!address) throw new DependencyError(`Address ID: ${addressId} not found`);
			const callSession = this.callFactory.createCall(address, { ...options });
			callSession.status$.pipe((0, import_cjs$5.filter)((status) => status === "destroyed"), (0, import_cjs$5.take)(1)).subscribe(() => {
				const { [`${callSession.id}`]: _, ...remainingCalls } = this._calls$.value;
				this._calls$.next(remainingCalls);
			});
			return callSession;
		} catch (error) {
			logger$6.error("[Session] Error creating call session:", error);
			throw new CallCreateError("Call create error", error);
		}
	}
	destroy() {
		for (const call of Object.values(this._calls$.value)) call.hangup();
		super.destroy();
	}
};
var ClientSessionWrapper = class {
	constructor(clientSessionManager) {
		this.clientSessionManager = clientSessionManager;
	}
	get authenticated$() {
		return this.clientSessionManager.authenticated$;
	}
	get authenticated() {
		return this.clientSessionManager.authenticated;
	}
	get signalingEvent$() {
		return this.clientSessionManager.signalingEvent$;
	}
	async execute(request, options) {
		return this.clientSessionManager.execute(request, options);
	}
	get incomingCalls$() {
		return this.clientSessionManager.incomingCalls$;
	}
	get incomingCalls() {
		return this.clientSessionManager.incomingCalls;
	}
	get calls$() {
		return this.clientSessionManager.calls$;
	}
	get calls() {
		return this.clientSessionManager.calls;
	}
};

//#endregion
//#region src/utils/isString.ts
const isString = (obj) => typeof obj === "string";

//#endregion
//#region src/managers/ConversationsManager.ts
var import_cjs$4 = require_cjs();
const logger$5 = getLogger();
var ConversationMessagesFetcher = class extends Fetcher {
	constructor(groupId, http) {
		super(`/api/fabric/conversations/${groupId}/messages`, "page_size=100", http);
		this.groupId = groupId;
	}
};
var ConversationMessageCollection = class extends EntityCollection {
	constructor(groupId, update$, http, onError) {
		super(new ConversationMessagesFetcher(groupId, http), update$, onError);
	}
};
var ConversationsManager = class {
	constructor(clientSession, http, getSubscriberAddressId, onError) {
		this.clientSession = clientSession;
		this.http = http;
		this.getSubscriberAddressId = getSubscriberAddressId;
		this.onError = onError;
		this.groupIds = /* @__PURE__ */ new Map();
	}
	async join(addressId) {
		const subscriberFromAddressId = this.getSubscriberAddressId();
		try {
			const response = await this.http.request({
				...POST_PARAMS,
				url: `/api/fabric/conversations/join`,
				body: JSON.stringify({
					from_fabric_address_id: subscriberFromAddressId,
					fabric_address_ids: [addressId, subscriberFromAddressId]
				})
			});
			if (response.ok && !!response.body) {
				const data = JSON.parse(response.body);
				if (isString(data.group_id)) {
					this.groupIds.set(addressId, data.group_id);
					return data.group_id;
				}
			}
			throw new ConversationError("Join Failed - Unexpected response");
		} catch (error) {
			logger$5.error("[ConversationsManager] Failed to join conversation:", error);
			throw error;
		}
	}
	async getConversationMessageCollection(addressId) {
		const groupId = this.groupIds.get(addressId) ?? await this.join(addressId);
		return Promise.resolve(new ConversationMessageCollection(groupId, this.clientSession.signalingEvent$.pipe(filterAs(isConversationMessageMetadata, "params"), (0, import_cjs$4.tap)((event) => logger$5.debug("[ConversationsManager ] Conversation Event:", event)), (0, import_cjs$4.map)((params) => ({ ...params }))), this.http, this.onError));
	}
	async sendText(text, destinationAddressId) {
		const groupId = this.groupIds.get(destinationAddressId) ?? await this.join(destinationAddressId);
		const subscriberFromAddressId = this.getSubscriberAddressId();
		try {
			if ((await this.http.request({
				...POST_PARAMS,
				url: "/api/fabric/messages",
				body: JSON.stringify({
					group_id: groupId,
					from_fabric_address_id: subscriberFromAddressId,
					text
				})
			})).ok) return;
			throw new ConversationError("Send Text Failed - Unexpected response");
		} catch (error) {
			logger$5.error("[ConversationsManager] Failed to send text message:", error);
		}
	}
};

//#endregion
//#region src/utils/arrays.ts
const isEmptyArray = (a) => {
	return (a?.length ?? 0) === 0;
};

//#endregion
//#region src/utils/warnup.ts
var import_cjs$3 = require_cjs();
const warnup = (observable) => {
	observable.pipe((0, import_cjs$3.take)(1)).subscribe();
};

//#endregion
//#region src/managers/DirectoryManager.ts
var import_cjs$2 = require_cjs();
const logger$4 = getLogger();
var AddressFetcher = class extends Fetcher {
	constructor(http) {
		super("/api/fabric/addresses", "sort_by=name&sort_order=asc", http);
	}
	async name(name) {
		const response = await this.http.request({
			...GET_PARAMS,
			url: `${this.endpoint}?name=${encodeURIComponent(name)}`
		});
		if (response.ok && !!response.body) {
			const result = JSON.parse(response.body);
			if (!isEmptyArray(result.data)) return result.data[0];
		}
		logger$4.error("Failed to fetch addresses");
	}
};
var AddressStateCollection = class extends EntityCollection {
	constructor(update$, http, onError) {
		super(new AddressFetcher(http), update$, onError);
	}
};
var DirectoryManager = class extends Destroyable {
	constructor(http, clientSession, conversationManager, onError) {
		super();
		this.http = http;
		this.conversationManager = conversationManager;
		this.onError = onError;
		this.addNewAddress = (id) => {
			const address = new Address(id, this.conversationManager, this);
			const observable = this._statesCollection.get$(id)?.pipe(filterNull(), (0, import_cjs$2.map)((data) => {
				address.upnext(data);
				return address;
			}));
			if (observable) {
				warnup(observable);
				this._observableRegistry.set(id, observable);
			}
			this._addressesInstances.set(id, address);
		};
		this._addresses$ = this.createBehaviorSubject([]);
		this._addressesInstances = /* @__PURE__ */ new Map();
		this._observableRegistry = /* @__PURE__ */ new Map();
		this._statesCollection = new AddressStateCollection(clientSession.signalingEvent$.pipe(filterAs(isConversationMessageUpdatedMetadata, "params"), (0, import_cjs$2.map)((_) => ({}))), this.http, this.onError);
		this.initSubscriptions();
	}
	get loading() {
		return this._statesCollection.loading;
	}
	initSubscriptions() {
		this.subscribeTo(this._statesCollection.updated$, () => {
			const existing = Array.from(this._addressesInstances.values().map((address) => address.id));
			const newStates = this._statesCollection.values.filter((state) => !existing.includes(state.id));
			if (!isEmptyArray(newStates)) {
				newStates.forEach((state) => this.addNewAddress(state.id));
				this._addresses$.next(Array.from(this._addressesInstances.values()));
			}
		});
	}
	get addresses$() {
		return this._addresses$.asObservable();
	}
	get addresses() {
		return this._addresses$.value;
	}
	get hasMore$() {
		return this._statesCollection.hasMore$;
	}
	get loading$() {
		return this._statesCollection.loading$;
	}
	loadMore() {
		if (this._statesCollection.hasMore) this._statesCollection.loadMore();
	}
	get$(id) {
		if (!this._observableRegistry.has(id)) this.addNewAddress(id);
		return this._observableRegistry.get(id);
	}
	get(addressId) {
		return this._addressesInstances.get(addressId);
	}
	async findAddressIdByURI(name) {
		let addressId = this._addressesInstances.values().find((addr) => addr.name === name)?.id;
		if (!addressId) {
			const found$ = await this._statesCollection.find$("name", name);
			if (found$) {
				const state = await (0, import_cjs$2.firstValueFrom)(found$);
				this.addNewAddress(state.id);
				addressId = state.id;
			}
		}
		return addressId;
	}
};

//#endregion
//#region src/controllers/WebSocketController.ts
const logger$3 = getLogger();
var WebSocketController = class WebSocketController extends Destroyable {
	static {
		this.DEFAULT_RECONNECT_DELAY_MIN_MS = 1e3;
	}
	static {
		this.DEFAULT_RECONNECT_DELAY_MAX_MS = 3e4;
	}
	static {
		this.DEFAULT_CONNECTION_TIMEOUT_MS = 1e4;
	}
	constructor(WebSocketConstructor, endpoint, outgoingMessages$, options = {}) {
		super();
		this.WebSocketConstructor = WebSocketConstructor;
		this.endpoint = endpoint;
		this.outgoingMessages$ = outgoingMessages$;
		this.messageQueue = [];
		this.shouldReconnect = false;
		this._status$ = this.createBehaviorSubject("disconnected");
		this._incomingMessages$ = this.createSubject();
		this._errors$ = this.createSubject();
		this.reconnectDelayMin = options.reconnectDelayMin ?? WebSocketController.DEFAULT_RECONNECT_DELAY_MIN_MS;
		this.reconnectDelayMax = options.reconnectDelayMax ?? WebSocketController.DEFAULT_RECONNECT_DELAY_MAX_MS;
		this.connectionTimeout = options.connectionTimeout ?? WebSocketController.DEFAULT_CONNECTION_TIMEOUT_MS;
		this.currentReconnectDelay = this.reconnectDelayMin;
		this.subscriptions.push(this.outgoingMessages$.subscribe((data) => {
			this.send(data);
		}));
	}
	get status$() {
		return this._status$.asObservable();
	}
	get incomingMessages$() {
		return this._incomingMessages$.asObservable();
	}
	get errors$() {
		return this._errors$.asObservable();
	}
	connect() {
		if (this._status$.value === "connecting" || this._status$.value === "connected") return;
		this.shouldReconnect = true;
		this._status$.next("connecting");
		this.createWebSocket();
	}
	disconnect() {
		this.shouldReconnect = false;
		this.clearReconnectTimer();
		this.clearConnectionTimeout();
		const currentStatus = this._status$.value;
		if (currentStatus === "connected" || currentStatus === "connecting" || currentStatus === "reconnecting") if (this.socket) {
			this._status$.next("disconnecting");
			this.socket.close();
		} else this._status$.next("disconnected");
		else this._status$.next("disconnected");
	}
	reconnect() {
		if (this.shouldReconnect) {
			this._status$.next("reconnecting");
			this.scheduleReconnection();
		} else this._status$.next("disconnected");
	}
	send(data) {
		if (this._status$.value === "connected" && this.socket?.readyState === 1) {
			try {
				logger$3.debug(`[WebSocketConnectionManager] Sending message:\n${JSON.stringify(JSON.parse(data), null, 2)}`);
			} catch {
				logger$3.warn(`[WebSocketConnectionManager] Sending non-JSON message:\n${data}`);
			}
			this.socket.send(data);
		} else this.messageQueue.push(data);
	}
	createWebSocket() {
		try {
			this.socket = new this.WebSocketConstructor(this.endpoint);
			this.setupWebSocketListeners();
			this.startConnectionTimeout();
		} catch (error) {
			const err = error instanceof Error ? error : new UnexpectedError("Failed to create WebSocket");
			this._errors$.next(err);
			this.handleConnectionError();
		}
	}
	setupWebSocketListeners() {
		if (!this.socket) return;
		this.socket.addEventListener("open", () => this.handleOpen());
		this.socket.addEventListener("close", (event) => this.handleClose(event));
		this.socket.addEventListener("error", () => this.handleError());
		this.socket.addEventListener("message", (event) => this.handleMessage(event));
	}
	handleOpen() {
		this.clearConnectionTimeout();
		this._status$.next("connected");
		this.currentReconnectDelay = this.reconnectDelayMin;
		this.flushMessageQueue();
	}
	handleClose(_event) {
		this.clearConnectionTimeout();
		if (this.shouldReconnect) {
			this._status$.next("reconnecting");
			this.scheduleReconnection();
		} else this._status$.next("disconnected");
	}
	handleError() {
		const error = new WebSocketConnectionError("WebSocket connection error");
		this._errors$.next(error);
		this.handleConnectionError();
	}
	handleMessage(event) {
		try {
			logger$3.debug(`[WebSocketConnectionManager] Received message:\n${JSON.stringify(JSON.parse(event.data), null, 2)}`);
		} catch {
			logger$3.warn(`[WebSocketConnectionManager] Received non-JSON message:\n${event.data}`);
		}
		this._incomingMessages$.next(event);
	}
	handleConnectionError() {
		this.reconnect();
	}
	scheduleReconnection() {
		this.clearReconnectTimer();
		this.reconnectTimer = setTimeout(() => {
			if (this.shouldReconnect) {
				this._status$.next("connecting");
				this.createWebSocket();
				this.increaseReconnectDelay();
			}
		}, this.currentReconnectDelay);
	}
	increaseReconnectDelay() {
		this.currentReconnectDelay = Math.min(this.currentReconnectDelay * 2, this.reconnectDelayMax);
	}
	startConnectionTimeout() {
		this.clearConnectionTimeout();
		this.connectionTimeoutTimer = setTimeout(() => {
			if (this._status$.value === "connecting") {
				const error = new WebSocketTimeoutError("WebSocket connection timeout");
				this._errors$.next(error);
				if (this.socket) this.socket.close();
			}
		}, this.connectionTimeout);
	}
	clearConnectionTimeout() {
		if (this.connectionTimeoutTimer) {
			clearTimeout(this.connectionTimeoutTimer);
			this.connectionTimeoutTimer = void 0;
		}
	}
	clearReconnectTimer() {
		if (this.reconnectTimer) {
			clearTimeout(this.reconnectTimer);
			this.reconnectTimer = void 0;
		}
	}
	flushMessageQueue() {
		while (this.messageQueue.length > 0 && this.socket?.readyState === 1) {
			const message = this.messageQueue.shift();
			if (message !== void 0) this.socket.send(message);
		}
	}
};

//#endregion
//#region src/core/RPCMessages/guards/methods.guards.ts
function isSignalwirePingRequest(value) {
	return isJSONRPCRequest(value) && value.method === "signalwire.ping";
}

//#endregion
//#region src/managers/TransportManager.ts
var import_cjs$1 = require_cjs();
const logger$2 = getLogger();
var TransportManager = class extends Destroyable {
	constructor(storage, protocolKey, webSocketConstructor, relayHost, onError) {
		super();
		this.storage = storage;
		this.protocolKey = protocolKey;
		this.onError = onError;
		this.protocol$ = this.createReplaySubject(1);
		this.outgoingMessages$ = this.createSubject();
		this.isConnecting = false;
		this.isConnected = false;
		this.ackEvent = () => {
			return (0, import_cjs$1.tap)((message) => {
				if (isSignalwireRequest(message)) try {
					logger$2.debug("[Transport] Sending event ack", { eventId: message.id });
					this.send(RPCEventAckResponse(message.id));
				} catch (error) {
					logger$2.error("[Transport] Failed to send event acknowledgment:", error);
				}
			});
		};
		this.replySignalwirePing = () => {
			return (0, import_cjs$1.filter)((message) => {
				if (isSignalwirePingRequest(message)) {
					try {
						logger$2.debug("[Transport] Received ping, sending pong", { pingId: message.id });
						this.send(RPCPingResponse(message.id));
					} catch (error) {
						logger$2.error("[Transport] Failed to send ping response:", error);
					}
					return false;
				}
				return true;
			});
		};
		this._webSocketConnections = new WebSocketController(webSocketConstructor, relayHost, this.outgoingMessages$, {
			connectionTimeout: PreferencesContainer.instance.connectionTimeout,
			reconnectDelayMin: PreferencesContainer.instance.reconnectDelayMin,
			reconnectDelayMax: PreferencesContainer.instance.reconnectDelayMax
		});
		this.subscribeTo(this._webSocketConnections.errors$, (error) => {
			this.onError?.(error);
		});
		this.initialized$ = (0, import_cjs$1.defer)(() => (0, import_cjs$1.from)(this._init())).pipe((0, import_cjs$1.shareReplay)(1), (0, import_cjs$1.takeUntil)(this.destroyed$));
		this._jsonRPCMessage$ = this._webSocketConnections.incomingMessages$.pipe((0, import_cjs$1.map)((event) => {
			try {
				return JSON.parse(event.data);
			} catch (error) {
				logger$2.error("[Transport] Failed to parse incoming message:", error);
				this.onError?.(new MessageParseError(error));
				return null;
			}
		}), (0, import_cjs$1.filter)((message) => message !== null && (isJSONRPCResponse(message) || isJSONRPCRequest(message))), (0, import_cjs$1.catchError)((error) => {
			logger$2.error("[Transport] Message processing error:", error);
			this.onError?.(error instanceof Error ? error : new Error(String(error), { cause: error }));
			return import_cjs$1.EMPTY;
		}), (0, import_cjs$1.share)(), (0, import_cjs$1.takeUntil)(this.destroyed$));
		this._jsonRPCResponse$ = this._jsonRPCMessage$.pipe((0, import_cjs$1.filter)(isJSONRPCResponse));
		this._incomingEvent$ = this._jsonRPCMessage$.pipe(this.ackEvent(), this.replySignalwirePing(), (0, import_cjs$1.filter)((message) => !isJSONRPCResponse(message)), (0, import_cjs$1.share)(), (0, import_cjs$1.takeUntil)(this.destroyed$));
	}
	async setProtocol(protocol) {
		this.protocol$.next(protocol);
		await this._updateProtocolInStorage(protocol);
	}
	get incomingEvent$() {
		return this._incomingEvent$;
	}
	get connectionStatus$() {
		return this._webSocketConnections.status$;
	}
	async connect() {
		if (this.isConnecting || this.isConnected) {
			logger$2.warn("[Transport] Already connecting or connected");
			return Promise.resolve();
		}
		return new Promise((resolve, reject) => {
			this.isConnecting = true;
			this.subscribeTo(this.initialized$, () => {
				this._webSocketConnections.connect();
				const connectionSub = this._webSocketConnections.status$.pipe((0, import_cjs$1.filter)((status) => status === "connected" || status === "disconnected"), (0, import_cjs$1.take)(1), (0, import_cjs$1.timeout)(1e4)).subscribe({
					next: (status) => {
						if (status === "connected") {
							this.isConnecting = false;
							this.isConnected = true;
							logger$2.debug("[Transport] Connection established");
							resolve();
						} else {
							this.isConnecting = false;
							const error = new TransportConnectionError("Failed to connect");
							logger$2.error("[Transport] Connection failed");
							this.onError?.(error);
							reject(error);
						}
					},
					error: (err) => {
						this.isConnecting = false;
						logger$2.error("[Transport] Connection error:", err);
						this.onError?.(err instanceof Error ? err : new Error(String(err), { cause: err }));
						reject(err);
					}
				});
				this.subscriptions.push(connectionSub);
				this.subscribeTo(this._webSocketConnections.status$.pipe((0, import_cjs$1.filter)((status) => status === "disconnected")), () => {
					logger$2.debug("[Transport] Disconnected");
					this.isConnected = false;
				});
			});
		});
	}
	reconnect() {
		this._webSocketConnections.reconnect();
	}
	async execute(request, options) {
		this.send(request);
		return new PendingRPC(request, this._jsonRPCResponse$, options).promise;
	}
	send(message) {
		const payload = JSON.stringify(message);
		this.outgoingMessages$.next(payload);
	}
	disconnect() {
		logger$2.debug("[Transport] Disconnecting");
		this.isConnected = false;
		this.isConnecting = false;
		this._webSocketConnections.disconnect();
	}
	destroy() {
		logger$2.debug("[Transport] Destroying");
		this.disconnect();
		super.destroy();
		this._webSocketConnections.destroy();
	}
	async _loadProtocolFromStorage() {
		try {
			const storedProtocol = await this.storage.getItem(this.protocolKey);
			this.protocol$.next(storedProtocol ?? void 0);
		} catch (error) {
			logger$2.error("Failed to retrieve protocol from storage:", error);
			throw error;
		}
	}
	async _updateProtocolInStorage(protocol) {
		if (!protocol) {
			try {
				await this.storage.removeItem(this.protocolKey);
			} catch (error) {
				logger$2.error("Failed to remove protocol from storage:", error);
				throw error;
			}
			return;
		}
		try {
			const storedProtocol = await this.storage.getItem(this.protocolKey);
			if (!storedProtocol || storedProtocol !== protocol) await this.storage.setItem(this.protocolKey, protocol);
		} catch (error) {
			logger$2.error("Failed to update protocol in storage:", error);
			throw error;
		}
	}
	async _init() {
		await this._loadProtocolFromStorage();
		return true;
	}
};

//#endregion
//#region src/clients/SignalWire.ts
var import_cjs = require_cjs();
const logger$1 = getLogger();
const buildOptionsFromDestination = (destination) => {
	if (typeof destination === "string") {
		const queryStartIndex = destination.indexOf("?");
		if (queryStartIndex !== -1) {
			const queryString = destination.substring(queryStartIndex + 1);
			const channel = new URLSearchParams(queryString).get("channel");
			if (channel === "video") return {
				audio: true,
				video: true
			};
			else if (channel === "audio") return {
				audio: true,
				video: false
			};
		}
	}
	return {};
};
/**
* Main entry point for the SignalWire Browser SDK.
*
* Manages authentication, WebSocket transport, call creation, and media devices.
*
* @example
* ```ts
* const client = new SignalWire(credentialProvider);
* client.isConnected$.subscribe(connected => console.log('Connected:', connected));
* const call = await client.dial('/public/my-room');
* ```
*/
var SignalWire = class extends Destroyable {
	constructor(credentialProvider, options = {}) {
		super();
		this.preferences = new ClientPreferences();
		this._directory$ = this.createBehaviorSubject(void 0);
		this._isConnected$ = this.createBehaviorSubject(false);
		this._isRegistered$ = this.createBehaviorSubject(false);
		this._errors$ = this.createSubject();
		this._options = {};
		this._deps = new DependencyContainer();
		this._options = {
			...PreferencesContainer.instance.defaultSignalWireOptions,
			...options
		};
		if (this._options.storageImplementation) this._deps.storageImpl = this._options.storageImplementation;
		if (this._options.webSocketConstructor) this._deps.WebSocket = this._options.webSocketConstructor;
		this._deviceController = this._deps.deviceController;
		if (!this._options.skipDeviceMonitoring) this._deviceController.enableDeviceMonitoring();
		this.subscribeTo(this._deviceController.errors$, (error) => {
			this._errors$.next(error);
		});
		this.validateCredentials(credentialProvider).then(() => {
			this.init().catch((error) => {
				logger$1.error("[SignalWire] Initialization error:", error);
				this._errors$.next(error instanceof Error ? error : new Error(String(error), { cause: error }));
			});
		}).catch((error) => {
			logger$1.error("[SignalWire] Initialization error:", error);
			this._errors$.next(error instanceof Error ? error : new Error(String(error), { cause: error }));
		});
	}
	async validateCredentials(credentialProvider, credentials) {
		const _credentials = credentials ?? await credentialProvider.authenticate();
		if (_credentials.token) try {
			const decodeHeader = jwtDecode(_credentials.token, { header: true });
			this._deps.ch = decodeHeader.ch;
		} catch (error) {
			logger$1.error("[SignalWire] Invalid JWT token provided in credentials:", error);
			throw new InvalidCredentialsError("Invalid JWT token provided in credentials.", { cause: error });
		}
		if (!_credentials.token && !_credentials.authorizationState) {
			logger$1.error("[SignalWire] No valid authentication credentials provided.");
			throw new InvalidCredentialsError("No valid authentication credentials provided.");
		}
		if (_credentials.expiry_at && _credentials.expiry_at < Date.now()) {
			logger$1.error("[SignalWire] Provided credentials have expired.");
			throw new InvalidCredentialsError("Provided credentials have expired.");
		}
		if (_credentials.expiry_at && credentialProvider.refresh) {
			const refreshFn = credentialProvider.refresh;
			const refreshInterval = Math.max(_credentials.expiry_at - Date.now() - 5e3, 1e3);
			this._refreshTimerId = setTimeout(async () => {
				try {
					const newCredentials = await refreshFn();
					this._deps.credential = newCredentials;
					logger$1.info("[SignalWire] Credentials refreshed successfully.");
					this.validateCredentials(credentialProvider, newCredentials).catch((error) => {
						logger$1.error("[SignalWire] Credential refresh error:", error);
						this._errors$.next(error instanceof Error ? error : new Error(String(error), { cause: error }));
					});
				} catch (error) {
					logger$1.error("[SignalWire] Credential refresh failed:", error);
					this._errors$.next(error instanceof Error ? error : new Error(String(error), { cause: error }));
				}
			}, refreshInterval);
		}
		this._deps.credential = _credentials;
	}
	async init() {
		this.subscriber = new Subscriber(this._deps.http);
		if (!this._options.skipConnection) await this.connect();
		if (this._options.skipReconnect && this._attachManager) await this._attachManager.flush();
		if (!this._options.skipRegister) this.register();
		this.handleAttachments();
	}
	async handleAttachments() {
		if (!this._attachManager) {
			logger$1.error("[SignalWire] AttachManager not initialized");
			return;
		}
		if (!this._options.reconnectAttachedCalls) return;
		try {
			await this._attachManager.reattachCalls();
		} catch (error) {
			logger$1.error("[SignalWire] Failed to reattach calls:", error);
			this._errors$.next(error instanceof Error ? error : new Error(String(error), { cause: error }));
		}
	}
	/** Establishes the WebSocket connection and authenticates the session. */
	async connect() {
		try {
			if (!await (0, import_cjs.firstValueFrom)(this.subscriber.fetched$)) throw new UnexpectedError("Failed to fetch subscriber information - fetched$ emitted false");
			this._deps.subscriber = this.subscriber;
		} catch (error) {
			logger$1.error(`[SignalWire] Failed to fetch subscriber information: ${error instanceof Error ? error.message : "Unknown error"}. This usually means the subscriber token is invalid or expired.`);
			throw new UnexpectedError("Error fetching subscriber information", { cause: error });
		}
		const errorHandler = (error) => {
			this._errors$.next(error);
		};
		this._transport = new TransportManager(this._deps.storage, this._deps.protocolKey, this._deps.WebSocket, PreferencesContainer.instance.relayHost ?? this._deps.relayHost, errorHandler);
		this._attachManager = new AttachManager(this._deps.storage, this._deps.deviceController, PreferencesContainer.instance.reconnectCallsTimeout, this._deps.attachedCallsKey);
		this._clientSession = new ClientSessionManager(this._deps.credential, this._transport, this._deps.storage, this._deps.authorizationStateKey, this._deps.deviceController, this._attachManager);
		this._publicSession = new ClientSessionWrapper(this._clientSession);
		this.subscribeTo(this._clientSession.errors$, (error) => {
			this._errors$.next(error);
		});
		await this._clientSession.connect();
		const conversationManager = new ConversationsManager(this._clientSession, this._deps.http, () => this._deps.getSubscriberFromAddressId(), errorHandler);
		const directory = new DirectoryManager(this._deps.http, this._clientSession, conversationManager, errorHandler);
		this._directory$.next(directory);
		this._clientSession.setDirectory(directory);
		this._isConnected$.next(true);
	}
	/**
	* Observable that emits the {@link Directory} instance once the client is connected,
	* or `undefined` while disconnected. Subscribe to this to safely wait for the directory
	* to become available without risking an error.
	*
	* @example
	* ```ts
	* client.directory$.subscribe(dir => {
	*   if (dir) dir.addresses$.subscribe(console.log);
	* });
	* ```
	*/
	get directory$() {
		return this._directory$.asObservable();
	}
	/**
	* Current directory snapshot, or `undefined` if the client is not yet connected.
	* Prefer {@link directory$} when you need to react to the directory becoming available.
	*/
	get directory() {
		return this._directory$.value;
	}
	/** Observable that emits when the subscriber registration state changes. */
	get isRegistered$() {
		return this._isRegistered$.asObservable();
	}
	/** Whether the subscriber is currently registered. */
	get isRegistered() {
		return this._isRegistered$.value;
	}
	/** Whether the client is currently connected. */
	get isConnected() {
		return this._isConnected$.value;
	}
	/** Observable that emits when the connection state changes. */
	get isConnected$() {
		return this._isConnected$.asObservable();
	}
	/** Observable that emits `true` when the client is both connected and authenticated. */
	get ready$() {
		return this._isConnected$.pipe((0, import_cjs.switchMap)((connected) => connected ? this._clientSession.authenticated$ : (0, import_cjs.of)(false)));
	}
	/** Observable stream of errors from transport, authentication, and devices. */
	get errors$() {
		return this._errors$.asObservable();
	}
	/** Disconnects the WebSocket and tears down the session. */
	async disconnect() {
		await this._clientSession.disconnect();
		this._clientSession.destroy();
		this._isConnected$.next(false);
	}
	async waitAuthentication() {
		await (0, import_cjs.firstValueFrom)(this.ready$.pipe((0, import_cjs.filter)((ready$1) => ready$1 === true)));
	}
	/** Registers the subscriber as online to receive inbound calls and events. */
	async register() {
		try {
			await this.waitAuthentication();
			await this._transport.execute(RPCExecute({
				method: "subscriber.online",
				params: {}
			}));
			this._isRegistered$.next(true);
		} catch (error) {
			logger$1.error("[SignalWire] Failed to register subscriber:", error);
			this._errors$.next(error instanceof Error ? error : new Error(String(error), { cause: error }));
		}
	}
	/** Unregisters the subscriber, going offline for inbound calls. */
	async unregister() {
		try {
			await this._transport.execute(RPCExecute({
				method: "subscriber.offline",
				params: {}
			}));
			this._isRegistered$.next(false);
		} catch (error) {
			logger$1.error("[SignalWire] Failed to unregister subscriber:", error);
			this._errors$.next(error instanceof Error ? error : new Error(String(error), { cause: error }));
			throw error;
		}
	}
	/**
	* Places an outbound call to the given destination.
	* @param destination - Address URI string or {@link Address} instance to call.
	* @param options - Media and dial options (audio/video, constraints).
	* @returns The created {@link Call} instance.
	*/
	async dial(destination, options = {}) {
		const computed_options = {
			...PreferencesContainer.instance.preferredMediaOptions,
			...buildOptionsFromDestination(destination),
			...options
		};
		await this.waitAuthentication();
		logger$1.debug("[SignalWire] Dialing with options:", computed_options);
		return this._clientSession.createOutboundCall(destination, computed_options);
	}
	/** The underlying client session for advanced RPC operations. */
	get session() {
		return this._publicSession;
	}
	/** Observable list of available audio input (microphone) devices. */
	get audioInputDevices$() {
		return this._deviceController.audioInputDevices$;
	}
	/** Current snapshot of available audio input devices. */
	get audioInputDevices() {
		return this._deviceController.audioInputDevices;
	}
	/** Observable list of available audio output (speaker) devices. */
	get audioOutputDevices$() {
		return this._deviceController.audioOutputDevices$;
	}
	/** Current snapshot of available audio output devices. */
	get audioOutputDevices() {
		return this._deviceController.audioOutputDevices;
	}
	/** Observable list of available video input (camera) devices. */
	get videoInputDevices$() {
		return this._deviceController.videoInputDevices$;
	}
	/** Current snapshot of available video input devices. */
	get videoInputDevices() {
		return this._deviceController.videoInputDevices;
	}
	/** Observable of the currently selected audio input device. */
	get selectedAudioInputDevice$() {
		return this._deviceController.selectedAudioInputDevice$;
	}
	/** Observable of the currently selected audio output device. */
	get selectedAudioOutputDevice$() {
		return this._deviceController.selectedAudioOutputDevice$;
	}
	/** Observable of the currently selected video input device. */
	get selectedVideoInputDevice$() {
		return this._deviceController.selectedVideoInputDevice$;
	}
	/** Currently selected audio input device, or `null` if none. */
	get selectedAudioInputDevice() {
		return this._deviceController.selectedAudioInputDevice;
	}
	/** Currently selected audio output device, or `null` if none. */
	get selectedAudioOutputDevice() {
		return this._deviceController.selectedAudioOutputDevice;
	}
	/** Currently selected video input device, or `null` if none. */
	get selectedVideoInputDevice() {
		return this._deviceController.selectedVideoInputDevice;
	}
	/** Media track constraints for the selected audio input device. */
	get selectedAudioInputDeviceConstraints() {
		return this._deviceController.selectedAudioInputDeviceConstraints;
	}
	/** Media track constraints for the selected video input device. */
	get selectedVideoInputDeviceConstraints() {
		return this._deviceController.selectedVideoInputDeviceConstraints;
	}
	/** Converts a `MediaDeviceInfo` to track constraints suitable for `getUserMedia`. */
	deviceInfoToConstraints(deviceInfo) {
		return this._deviceController.deviceInfoToConstraints(deviceInfo);
	}
	/** Sets the preferred audio input device. */
	selectAudioInputDevice(device) {
		this._deviceController.selectAudioInputDevice(device);
	}
	/** Sets the preferred video input device. */
	selectVideoInputDevice(device) {
		this._deviceController.selectVideoInputDevice(device);
	}
	/** Sets the preferred audio output device. */
	selectAudioOutputDevice(device) {
		this._deviceController.selectAudioOutputDevice(device);
	}
	/** Starts monitoring for media device changes (connect/disconnect). */
	enableDeviceMonitoring() {
		this._deviceController.enableDeviceMonitoring();
	}
	/** Stops monitoring for media device changes. */
	disableDeviceMonitoring() {
		this._deviceController.disableDeviceMonitoring();
	}
	destroy() {
		if (this._refreshTimerId) {
			clearTimeout(this._refreshTimerId);
			this._refreshTimerId = void 0;
		}
		super.destroy();
	}
};

//#endregion
//#region src/dependencies/EmbedTokenCredentialProvider.ts
const logger = getLogger();
var EmbedTokenCredentialProvider = class {
	constructor(host, embedToken) {
		this.host = host;
		this.embedToken = embedToken;
	}
	async fetchSAT() {
		const url = `https://${this.host}/api/fabric/embeds/tokens`;
		const timeout$4 = 1e4;
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), timeout$4);
		try {
			const response = await fetch(url, {
				method: "POST",
				body: JSON.stringify({ token: this.embedToken }),
				signal: controller.signal
			});
			clearTimeout(timeoutId);
			if (response.ok) return (await response.json()).token;
			throw new RequestError(`Failed to fetch SAT using embed token: ${response.status} ${response.statusText}`);
		} catch (error) {
			clearTimeout(timeoutId);
			if (error instanceof Error && error.name === "AbortError") throw new RequestTimeoutError(`Request timeout after ${timeout$4}ms`, { cause: error });
			logger.error("[EmbedCredentialProvider] Request failed:", error);
			throw error;
		}
	}
	async authenticate() {
		return {
			token: await this.fetchSAT(),
			expiry_at: Date.now() + 3600 * 1e3
		};
	}
	async refresh() {
		return this.authenticate();
	}
};

//#endregion
//#region src/utils/embeddableCall.ts
/**
* Creates a call using an embed token for simple, embeddable integrations.
*
* Handles client creation, authentication, and dialing in a single call.
*
* @param options - Embed token, host, and destination.
* @returns The created {@link Call} instance.
*/
async function embeddableCall(options) {
	const { to, embedToken, host } = options;
	const requiredFailed = [];
	if (!to) requiredFailed.push("to");
	if (!embedToken) requiredFailed.push("embedToken");
	if (!host) requiredFailed.push("host");
	if (requiredFailed.length > 0) return Promise.reject(new DependencyError(`Missing required options: ${requiredFailed.join(", ")}`));
	return await new SignalWire(new EmbedTokenCredentialProvider(host, embedToken)).dial(to);
}

//#endregion
//#region src/dependencies/StaticCredentialProvider.ts
/**
* Credential provider that returns a fixed set of credentials.
*
* Use when the token is already available (e.g. from a backend endpoint).
*
* @example
* ```ts
* const provider = new StaticCredentialProvider({ token: 'my-sat-token' });
* const client = new SignalWire(provider);
* ```
*/
var StaticCredentialProvider = class {
	constructor(credentials) {
		this.credentials = credentials;
	}
	/** Returns the static credentials. */
	async authenticate() {
		return Promise.resolve(this.credentials);
	}
};

//#endregion
//#region src/index.ts
/**
* Library version from package.json, injected at build time.
*/
const version = "4.0.0-rc.0";
/**
* Flag indicating the library has been loaded and is ready to use.
* For UMD builds: `window.SignalWire.ready`
* For ES modules: `import { ready } from '@signalwire/signalwire-js'`
*/
const ready = true;
/**
* Emits 'signalwire:js:ready' event when the library is loaded.
*
* Scripts that might load BEFORE the library (check flag first):
*    ```js
*    if (window.SignalWire?.ready) {
*      // Library already loaded, use it directly
*      initApp();
*    } else {
*      window.addEventListener('signalwire:js:ready', () => initApp());
*    }
*    ```
*/
const emitReadyEvent = () => {
	if (typeof window !== "undefined") {
		const event = new CustomEvent("signalwire:js:ready", { detail: { version: "4.0.0-rc.0" } });
		window.dispatchEvent(event);
	}
};
emitReadyEvent();

//#endregion
//#region src/browser-entry.ts
/**
* Browser bundle entry point
*
* WARNING: This file should NEVER be imported by internal modules
* Internal modules must import directly from source files
*
* This entry point:
* 1. Polyfills Node.js globals for browser compatibility
* 2. Re-exports all public APIs from the main package
*
* The polyfill is embedded directly in the code (not via banner)
* to ensure it's always present regardless of how the bundle is loaded.
*/
if (typeof process === "undefined") globalThis.process = { env: { NODE_ENV: "production" } };

//#endregion
exports.Address = Address;
exports.CallCreateError = CallCreateError;
exports.ClientPreferences = ClientPreferences;
exports.CollectionFetchError = CollectionFetchError;
exports.MediaTrackError = MediaTrackError;
exports.MessageParseError = MessageParseError;
exports.Participant = Participant;
exports.SelfParticipant = SelfParticipant;
exports.SignalWire = SignalWire;
exports.StaticCredentialProvider = StaticCredentialProvider;
exports.Subscriber = Subscriber;
exports.VertoPongError = VertoPongError;
exports.WebRTCCall = WebRTCCall;
exports.embeddableCall = embeddableCall;
exports.isSelfParticipant = isSelfParticipant;
exports.ready = ready;
exports.version = version;
});
//# sourceMappingURL=browser.umd.js.map