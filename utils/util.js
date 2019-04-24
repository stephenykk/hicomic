function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

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

function d2(n) {
  return n * 1 >= 10 ? n : '0' + n
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

  formatTime,
  formatNumber
}