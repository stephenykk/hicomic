

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function isArray(arr) {
  return Object.prototype.toString.call(arr) === '[object Array]'
}

function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

function flatten(arr) {
  let newArr = []
  arr.forEach(el => {
    newArr.push.apply(newArr, isArray(el) ? flatten(el) : [el]);
  })
  return newArr;
}


function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}


function d2(n) {
  return n * 1 >= 10 ? n : '0' + n
}

function pick(obj, keys) {
  let picked = {}
  eachKey(obj, function (val, key) {
    if (keys.includes(key)) {
      picked[key] = val;
    }
  })
  return picked;

}

function eachKey(obj, fn) {
  Object.keys(obj).forEach(function (key) {
    fn(obj[key], key, obj);
  })
}


function log() {
  var args = [].slice.call(arguments);
  args.unshift('[MYLOG]: ');
  console.log.apply(console, args);
}

export default {
  isArray,
  isObject,
  flatten,
  log,
  d2,
  pick,
  eachKey,
  clone,

  formatNumber
}