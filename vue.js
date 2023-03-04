
// 冻结一个空对象
var emptyObject = Object.freeze({});

// 判断是否为 undefined 或者是 null
function isUndef (v) {
	return v === undefined || v === null
}

// 判断不是 undefined 或者是 null
function isDef (v) {
	return v !== undefined && v !== null
}

// 判断是否为 true
function isTrue (v) {
	return v === true
}

// 判断是否为 false
function isFalse (v) {
	return v === false
}

// 检查值是否为基本数据类型
function isPrimitive (value) {
	return (
		typeof value === 'string' ||
		typeof value === 'number' ||
		typeof value === 'symbol' ||
		typeof value === 'boolean'
	)
}

// 判断是否是对象
function isObject (obj) {
	return obj !== null && typeof obj === 'object'
}

var _toString = Object.prototype.toString;

// Object.prototype.toString.call('1')
// '[object String]'
function toRawType (value) {
	return _toString.call(value).slice(8, -1)
}

// 检查是否是对象
function isPlainObject (obj) {
	return _toString.call(obj) === '[object Object]'
}

// 检查是否是正则表达式
function isRegExp (v) {
	return _toString.call(v) === '[object RegExp]'
}

// 检查val是否是有效的数组下标
function isValidArrayIndex (val) {
	var n = parseFloat(String(val));
	return n >= 0 && Math.floor(n) === n && isFinite(val)
}

// 将值转换为实际呈现的字符串
function toString (val) {
	return val == null ? '' :
		typeof val === 'object'
			? JSON.stringify(val, null, 2)
			: String(val)
}

// 将输入值转换为持久的数字
// 如果转换失败，返回原始字符串
function toNumber (val) {
	var n = parseFloat(val);
	return isNaN(n) ? val : n
}

// 检查标签是否是内置标签
var isBuiltInTag = makeMap('slot,component', true);

// 检查某个属性是否是保留属性
var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is')

// 制作一个映射并返回一个函数来检查是否有键
// 在Map上
function makeMap (str, expectsLowerCase) {
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
function remove (arr, item) {
	if (arr.length) {
		var index = arr.indexOf(item);
		if (index > -1) {
			return arr.splice(index, 1)
		}
	}
}

// 检查对象是否具有该属性
var hasOwnProperty = Object.prototype.hasOwnProperty;

function hasOwn (obj, key) {
	return hasOwnProperty.call(obj, key)
}

// 创建纯函数的缓存版本
function cached (fn) {
	var cache = Object.create(null);
	return (function cachedFn (str) {
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
function toArray (list, start) {
 start = start || 0;
	var i = list.length - start;
	var ret = new Array(i);
	while (i--) {
	 ret[i] = list[i + start];
	}
	return ret;
}

// eg: convert
const convert = function(arr, n) {
 const res = []
	for (let i = 0; i < n; i++) {
	 res.push(arr[i])
	}
	return res
}

// 将属性混合到目标对象中
// Mix properties into target object
// eg: mixin({}, {a: 1, b: 2})
function extend (to, _from) {
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
function toObject (arr) {
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
function once (fn) {
 var called = false;
	return function () {
	 if (!called) {
		 called = true;
			fn.apply(this, arguments);
		}
	}
}









