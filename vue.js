
// 冻结一个空对象
var emptyObject = Object.freeze({});

// 判断是否为 undefined 或者是 null
function isUndef(v) {
	return v === undefined || v === null
}

// 判断不是 undefined 或者是 null
function isDef(v) {
	return v !== undefined && v !== null
}

// 判断是否为 true
function isTrue(v) {
	return v === true
}

// 判断是否为 false
function isFalse(v) {
	return v === false
}

// 检查值是否为基本数据类型
function isPrimitive(value) {
	return (
		typeof value === 'string' ||
		typeof value === 'number' ||
		typeof value === 'symbol' ||
		typeof value === 'boolean'
	)
}

// 判断是否是对象
function isObject(obj) {
	return obj !== null && typeof obj === 'object'
}

var _toString = Object.prototype.toString;

// Object.prototype.toString.call('1')
// '[object String]'
function toRawType(value) {
	return _toString.call(value).slice(8, -1)
}

// 检查是否是对象
function isPlainObject(obj) {
	return _toString.call(obj) === '[object Object]'
}

// 检查是否是正则表达式
function isRegExp(v) {
	return _toString.call(v) === '[object RegExp]'
}

// 检查val是否是有效的数组下标
function isValidArrayIndex(val) {
	var n = parseFloat(String(val));
	return n >= 0 && Math.floor(n) === n && isFinite(val)
}

// 将值转换为实际呈现的字符串
function toString(val) {
	return val == null ? '' :
		typeof val === 'object'
			? JSON.stringify(val, null, 2)
			: String(val)
}

// 将输入值转换为持久的数字
// 如果转换失败，返回原始字符串
function toNumber(val) {
	var n = parseFloat(val);
	return isNaN(n) ? val : n
}

// 检查标签是否是内置标签
var isBuiltInTag = makeMap('slot,component', true);

// 检查某个属性是否是保留属性
var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is')

// 制作一个映射并返回一个函数来检查是否有键
// 在Map上
function makeMap(str, expectsLowerCase) {
	var map = Object.create(null);
	var list = str.spllit(',');
	for (var i = 0; i < list.length; i++) {
		// eg: map[slot] = true
		map[list[i]] = true;
	}
	return expectsLowerCase
		? function (val) { return map[val.toLowerCase()]; }
		: function (val) { return map[val]; }
}

// 从数组中删除一个项
function remove(arr, item) {
	if (arr.length) {
		var index = arr.indexOf(item);
		if (index > -1) {
			return arr.splice(index, 1)
		}
	}
}

// 检查对象是否具有该属性
var hasOwnProperty = Object.prototype.hasOwnProperty;

function hasOwn(obj, key) {
	return hasOwnProperty.call(obj, key)
}

// 创建纯函数的缓存版本
function cached(fn) {
	var cache = Object.create(null);
	return (function cachedFn(str) {
		// hit = {}
		var hit = cache[str];
		return hit || (cache[str] = fn(str))
	})
}

// 用连字符分隔的字符串
// 匹配字母、数字、下划线。
// 等价于 [A-Za-z0-9_]
var camelizeRE = /-(\w)/g;

var camelize = cached(function (str) {
	return str.replace(camelizeRE, function (_, c) {
		return c ? c.toUpperCase() : '';
	})
})

// 字符串大写
var capitalize = cached(function (str) {
	return str.charAt(0).toUpperCase() + str.slice(1)
})

// 用连字符连接骆驼字串
// 匹配非单词边界。 这个会匹配到位置，而不是字符。
// \B
var hyphenateRE = /\B([A-Z])/g;

var hyphenate = cached(function (str) {
	return str.replace(hyphenateRE, '-$1').toLowerCase()
})

// 将一个类似Array的对象转换为一个真正的Array
function toArray(list, start) {
	start = start || 0;
	var i = list.length - start;
	var ret = new Array(i);
	while (i--) {
		ret[i] = list[i + start];
	}
	return ret;
}

// eg: convert
const convert = function (arr, n) {
	const res = []
	for (let i = 0; i < n; i++) {
		res.push(arr[i])
	}
	return res
}

// 将属性混合到目标对象中
// Mix properties into target object
// eg: mixin({}, {a: 1, b: 2})
function extend(to, _from) {
	for (var key in _from) {
		to[key] = _from[key];
	}
	return to;
}

// eg: mix
const mix = function (target, source) {
	Object.keys(source).forEach(key => {
		target[key] = source[key];
	})
}

// [{'a': 'b'}, {'c': 'd'}] -> {'a': 'b', 'c': 'd'}
// 将一个对象数组合并为一个对象
function toObject(arr) {
	var res = {};
	for (let i = 0; i < arr.length; i++) {
		if (arr[i]) {
			// {} {'a': 'b'}
			extend(res, arr[i]);
		}
	}
	return res;
}

// 确保函数只被调用一次
// 写一个函数，确保该函数只被调用一次
function once(fn) {
	var called = false;
	return function () {
		if (!called) {
			called = true;
			fn.apply(this, arguments);
		}
	}
}

var SSR_ATTR = 'data-server-renderd';

var ASSET_TYPES = [
	'component',
	'directive',
	'filter'
]

var LIFECYCLE_HOOKS = [
	'beforeCreate',
	'created',

	'beforeMount',
	'mounted',

	'beforeUpdate',
	'updated',

	'beforeDestroy',
	'destroyed',

	'activated',
	'deactivated',

	'errorCaptured',
]

var config = ({
	// 选项合并策略(在core/util/options中使用)
	optionMergeStrategies: Object.create(null),

	// 是否压制警告
	silent: false,

	// 在启动时显示生产模式提示信息
	// 此选项仅在生产模式下生效
	productionTip: "development" !== "production",

	// 是否启用devtools
	devtools: "development" !== "production",

	// 是否记录性能
	performance: false,

	// 用于监视程序错误的错误处理程序
	errorHandler: null,

	// 警告处理程序的监视警告
	warnHandler: null,

	// 忽略某些自定义元素
	ignoredElements: [],

	// v-on的自定义用户密钥别名
	keyCodes: Object.create(null),

	// 检查一个标记是否被保留，这样它就不能被注册为组件。这是平台相关的，可能会被覆盖
	isReservedTag: no,

	// 检查某个属性是否被保留以使其不能用作组件道具。这是平台相关的，可能会被覆盖
	isReservedAttr: no,

	// 检查标记是否为未知元素。平台相关的。
	isUnknownElement: no,

	// 获取元素的名称空间
	getTagNamespace: noop,

	// 解析特定平台的真实标记名称。
	parsePlatformTagName: identity,

	// 检查一个属性是否必须使用属性绑定，例如value
	mustUseProp: no,

	// 由于遗留原因而暴露
	_lifecycleHooks: LIFECYCLE_HOOKS,

})


// 检查字符串是否以$或_开头
// Check if a string starts with $ or _
// eg: isStartsWith
const isStartsWith = function (str) {
	return str.startsWith("$") || str.startsWith("_")
}

function isReserved(str) {
	var c = (str + '').charCodeAt(0);
	return c === 0x24 || c === 0x5F
}

// 定义一个属性
function def(obj, key, val, enumerable) {
	Object.defineProperty(obj, key, {
		value: val,
		enumerable: !!enumerable,
		writable: true,
		configurable: true
	})
}

// 解析简单路径
var bailRE = /[^\w.$]/;
// 匹配不在集合中的任何字符。
// 匹配字母、数字、下划线。 只匹配小ASCII码的字符（无声调字母或非罗马英文字符）。 等价于 [A-Za-z0-9_]
function parsePath(path) {
	if (bailRE.test(path)) {
		return
	}
	var segments = path.split('.')
	return function (obj) {
		for (var i = 0; i < segments.length; i++) {
			if (!obj) { return }
			obj = obj[segments[i]];
		}
		return obj;
	}
}

// eg: parsePath2
function parsePath2(path) {
	var pathArr = path.split('.')
	var key
	var obj = this
	for (var i = 0, l = pathArr.length; i < l; i++) {
		key = pathArr[i]
		if (key.charCodeAt(0) === 0) {
			return
		}
		if (i === l - 1) {
			obj[key] = true
			break
		}
		obj = obj[key]
	}
}

// 我们可以使用__proto__吗?
var hasProto = '__proto__' in {};

var inBrowser = typeof window !== 'undefined';

var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;

var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();

var UA = inBrowser && window.navigator.userAgent.toLowerCase();

var isIE = UA && /msie|trident/.test(UA);

var isIE9 = UA && UA.indexOf('msie 9.0') > 0;

var isEdge = UA && UA.indexOf('edge/') > 0;

var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');

var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');

var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;

// Firefox在Object.prototype上有一个“观察”功能…
var nativeWatch = ({}).watch;

var supportsPassive = false;

if (inBrowser) {
	try {
		var opts = {};
		Object.defineProperty(opts, 'passive', {
			get: function get() {
				supportsPassive = true;
			}
		});
		window.addEventListener('test-passive', null, opts);
	} catch (e) { }
}

// 这需要延迟计算，因为vue-server-renderer可能需要vue才能设置VUE_ENV
// var _isServer = typeof window === 'undefined';
var _isServer;

var isServerRendering = function () {
	if (_isServer === undefined) {
		if (!inBrowser && !inWeex && typeof global !== 'undefined') {
			// _isServer = global.document && global.document.createElement('div').style.position === 'absolute';
			_isServer = global['process'].env.VUE_ENV === 'server';
		} else {
			_isServer = false;
		}
	}
	return _isServer;
};

// detect devtools

var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

function isNative(Ctor) {

	return typeof Ctor === 'function' && /native code/.test(Ctor.toString())

}

var hasSymbol =

	typeof Symbol !== 'undefined' && isNative(Symbol) &&

	typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

var _Set;

if (typeof Set !== 'undefined' && isNative(Set)) {

	_Set = Set;

} else {

	_Set = (function () {

		function Set() {

			this.set = Object.create(null);

		}

		Set.prototype.has = function has(key) {

			return this.set[key] === true

		};

		Set.prototype.add = function add(key) {

			this.set[key] = true;

		};

		Set.prototype.clear = function clear() {

			this.set = Object.create(null);

		};

		return Set;

	}());

}

var warn = noop;

var tip = noop;

var generateComponentTrace = (noop); // work around flow check

var formatComponentName = (noop);

var uid = 0;

// dep是一个可观察对象，可以有多个指令订阅它。
var Dep = function Dep() {
	this.id = uid++;
	this.subs = [];
}

Dep.prototype.addSub = function addSub(sub) {
	this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub(sub) {

	remove(this.subs, sub);

};

// eg
// Dep.prototype.removeSub = function removeSub (sub) {
//  for (var i = 0; i < this.subs.length; i++) {
//   if (this.subs[i] === sub) {
//    this.subs.splice(i, 1);
//    return
//   }
//  }
// };

Dep.prototype.depend = function depend() {
	if (Dep.target) {
		Dep.target.addDep(this);
	}
};

Dep.prototype.notify = function notify() {

	// stabilize the subscriber list first
	// 首先稳定订阅者列表

	var subs = this.subs.slice();

	for (var i = 0, l = subs.length; i < l; i++) {

		subs[i].update();

	}

};

// 当前正在计算的目标监视程序。

// 这是全局唯一的，因为只能有一个

// watcher在任何时候被计算。

Dep.target = null;

var targetStack = [];

function pushTarget(_target) {

	if (Dep.target) { targetStack.push(Dep.target); }

	Dep.target = _target;

}

function popTarget() {

	Dep.target = targetStack.pop();

}

var VNode = function VNode(

	tag,

	data,

	children,

	text,

	elm,

	context,

	componentOptions,

	asyncFactory

) {

	this.tag = tag;

	this.data = data;

	this.children = children;

	this.text = text;

	this.elm = elm;

	this.ns = undefined;

	this.context = context;

	this.fnContext = undefined;

	this.fnOptions = undefined;

	this.fnScopeId = undefined;

	this.key = data && data.key;

	this.componentOptions = componentOptions;

	this.componentInstance = undefined;

	this.parent = undefined;

	this.raw = false;

	this.isStatic = false;

	this.isRootInsert = true;

	this.isComment = false;

	this.isCloned = false;

	this.isOnce = false;

	this.asyncFactory = asyncFactory;

	this.asyncMeta = undefined;

	this.isAsyncPlaceholder = false;

};

var prototypeAccessors = { child: { configurable: true } };

// DEPRECATED:用于反向compat的componentInstance的别名。

prototypeAccessors.child.get = function () {

	return this.componentInstance

};

Object.defineProperties(VNode.prototype, prototypeAccessors);

var createEmptyNode = function (text) {
	if (text === void 0) text = '';

	var node = new VNode();

	node.text = text;

	node.isComment = true;

	return node

};

function createTextVNode(val) {

	return new VNode(undefined, undefined, undefined, String(val))

}

function cloneVNode(vnode) {

	var cloned = new VNode(

		vnode.tag,

		vnode.data,

		vnode.children,

		vnode.text,

		vnode.elm,

		vnode.context,

		vnode.componentOptions,

		vnode.asyncFactory

	);

	cloned.ns = vnode.ns;

	cloned.isStatic = vnode.isStatic;

	cloned.key = vnode.key;

	cloned.isComment = vnode.isComment;

	cloned.fnContext = vnode.fnContext;

	cloned.fnOptions = vnode.fnOptions;

	cloned.fnScopeId = vnode.fnScopeId;

	cloned.isCloned = true;

	return cloned

}

// 没有对该文件进行类型检查，因为flow不能很好地使用

// 动态访问数组原型上的方法

var arrayProto = Array.prototype;

var arrayMethods = Object.create(arrayProto);

var methodsToPatch = [

	'push',
	'pop',

	'shift',
	'unshift',

	'splice',
	'sort',
	'reverse'
];

// 拦截突变方法并发出事件
methodsToPatch.forEach(function (method) {

	// cache original method

	var original = arrayProto[method];

	def(arrayMethods, method, function mutator() {

		var args = [], len = arguments.length;

		while (len--) args[len] = arguments[len];

		var result = original.apply(this, args);

		var ob = this.__ob__;

		var inserted;

		switch (method) {

			case 'push':

			case 'unshift':

				inserted = args;

				break

			case 'splice':

				inserted = args.slice(2);

				break

		}

		if (inserted) { ob.observeArray(inserted); }

		// notify change

		ob.dep.notify();

		return result

	});

});

// 重写完
var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

// 在某些情况下，我们可能希望在组件的更新计算中禁用观察。
var shouldObserve = true;

function toggleObserving(value) {

	shouldObserve = value;

}

// 观察者类附加到每个被观察
// 对象。一旦连接，观察者转换目标
// 对象的属性键到getter/setter
// 收集依赖项并分发更新。

var Observer = function Observer(value) {
	this.value = value;
	this.dep = new Dep();
	this.vmCount = 0
	def(value, '__ob__', this);
	if (Array.isArray(value)) {
		var augment = hasProto
			? protoAugment
			: copyAugment;
		augment(value, arrayMethods, arrayKeys);
		this.observeArray(value);
	} else {
		this.walk(value);
	}
};

// 走过每个属性并将它们转换为
// getter / setter。此方法只应在以下情况下调用
// 值类型为对象。

Observer.prototype.walk = function walk(obj) {

	var keys = Object.keys(obj);

	for (var i = 0; i < keys.length; i++) {

		defineReactive(obj, keys[i]);

	}

};

// 观察数组项的列表
Observer.prototype.observeArray = function observeArray(items) {

	for (var i = 0, l = items.length; i < l; i++) {

		observe(items[i]);

	}

};

/**

Observer.prototype = {
	// 初始化观察者
	constructor: Observer,
	// 观察目标对象
	walk: function walk(obj) {
		var keys = Object.keys(obj);
		for (var i = 0, l = keys.length; i < l; i++) {
			this.convert(keys[i], obj[keys[i]]);
		}
	},
	// 观察目标对象的属性
	convert: function (key, value) {
		defineReactive(this.value, key, value);
	},
	// 观察目标对象的属性
	observeArray: function observeArray(value) {
		if (Array.isArray(value)) {
			this.walk(value);
		}
	}
};

	*/


// helpers

// 通过拦截来增加目标对象或数组

// 原型链使用__proto__

function protoAugment(target, src, keys) {

	/* eslint-disable no-proto */

	target.__proto__ = src;

	/* eslint-enable no-proto */

}

// 通过定义扩充目标对象或数组

// 隐藏属性。

function copyAugment(target, src, keys) {

	for (var i = 0, l = keys.length; i < l; i++) {

		var key = keys[i];

		def(target, key, src[key]);

	}

}

// 尝试为一个值创建一个观察者实例，

// 如果成功观察，返回新的观察器，

// 或者现有的观察者(如果值已经有)。

// 创建观察者

function observe(value, asRootData) {
	if (!isObject(value) || value instanceof Observer) {
		return
	}
	var ob;
	if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
		ob = value.__ob__;
	} else if (
		shouldObserve &&
		!isServerRendering() &&
		(Array.isArray(value) || isPlainObject(value)) &&
		Object.isExtensible(value) &&
		!value._isVue
	) {
		ob = new Observer(value);
	}
	if (asRootData && ob) {
		ob.vmCount++;
	}
	return ob
}

/*
// 创建观察者

function shouldObserve(value) {
	return (
		isServerRendering() ||
		(Array.isArray(value) || isPlainObject(value)) &&
		Object.isExtensible(value) &&
		!value._isVue
	)
}

*/


// 创建观察者
// 在对象上定义响应属性

function defineReactive(
	obj,
	key,
	val,
	customSetter,
	shallow
) {
	var dep = new Dep();

	var property = Object.getOwnPropertyDescriptor(obj, key);
	if (property && property.configurable === false) {
		return
	}

	// cater for pre-defined getter/setters
	var getter = property && property.get;
	var setter = property && property.set;

	var childOb = !shallow && observe(val);
	Object.defineProperty(obj, key, {
		enumerable: true,
		configurable: true,
		get: function reactiveGetter() {
			var value = getter ? getter.call(obj) : val;
			if (Dep.target) {
				dep.depend();
				if (childOb) {
					childOb.dep.depend();
					if (Array.isArray(value)) {
						dependArray(value);
					}
				}
			}
			return value
		},
		set: function reactiveSetter(newVal) {
			var value = getter ? getter.call(obj) : val;
			/* eslint-disable no-self-compare */
			if (newVal === value || (newVal !== newVal && value !== value)) {
				return
			}
			/* eslint-enable no-self-compare */
			if ("development" !== "production" && customSetter) {
				customSetter();
			}
			// #7981: for accessor properties without setter
			if (getter && !setter) { return }

			if (setter) {
				setter.call(obj, newVal);
			} else {
				val = newVal;
			}

			childOb = !shallow && observe(newVal);
			dep.notify();
		}
	});
}

/**
	* 在对象上设置属性。添加新属性和
	*	如果属性没有更改，则触发更改通知
	*	已经存在。
	*/

function set(target, key, val) {

	if ("development" !== 'production' &&

		(isUndef(target) || isPrimitive(target))

	) {

		warn(("Cannot set reactive property on undefined, null, or primitive value: " + ((target))));

	}

	if (Array.isArray(target) && isValidArrayIndex(key)) {

		target.length = Math.max(target.length, key);

		target.splice(key, 1, val);

		return val

	}

	if (key in target && !(key in Object.prototype)) {

		target[key] = val;

		return val

	}

	var ob = (target).__ob__;

	if (target._isVue || (ob && ob.vmCount)) {

		"development" !== 'production' && warn(

			'Avoid adding reactive properties to a Vue instance or its root $data ' +

			'at runtime - declare it upfront in the data option.'

		);

		return val

	}

	if (!ob) {

		target[key] = val;

		return val

	}

	defineReactive(ob.value, key, val);

	ob.dep.notify();

	return val

}


/**
	* 删除属性并在必要时触发更改。
	*/

function del(target, key) {

	if ("development" !== 'production' &&

		(isUndef(target) || isPrimitive(target))

	) {

		warn(("Cannot delete reactive property on undefined, null, or primitive value: " + ((target))));

	}

	if (Array.isArray(target) && isValidArrayIndex(key)) {

		target.splice(key, 1);

		return

	}

	var ob = (target).__ob__;

	if (target._isVue || (ob && ob.vmCount)) {

		"development" !== 'production' && warn(

			'Avoid deleting properties on a Vue instance or its root $data ' +

			'- just set it to null.'

		);

		return

	}

	if (!hasOwn(target, key)) {

		return

	}

	delete target[key];

	if (!ob) {

		return

	}

	ob.dep.notify();

}

/**
	* 当数组被触及时，收集数组元素上的依赖项，因为 我们不能像属性getter那样拦截数组元素访问。
	*/
function dependArray(value) {
	for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
		e = value[i];
		e && e.__ob__ && e.__ob__.dep.depend();
		if (Array.isArray(e)) {
			dependArray(e);
		}
	}
}

/*  */

/**
	* 选项覆盖策略是处理
	* 如何合并父选项值和子选项
	* 值转换为最终值。
	*/
var strats = config.optionMergeStrategies;

/**
	* Options with restrictions 有限制的选项
	*/
{

  strats.el = strats.propsData = function (parent, child, vm, key) {

    if (!vm) {

      warn(

        "option \"" + key + "\" can only be used during instance " +

        'creation with the `new` keyword.'

      );

    }

    return defaultStrat(parent, child)

  };

}






