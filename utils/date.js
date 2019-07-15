import util from './util'

const {formatNumber} = util;

function dateFormat(dt, isTime, retArr) {
  ; (dt == null || dt == 'now') && (dt = new Date())
  dt = dt instanceof Date ? dt : new Date(dt)
  let d2 = val => (val * 1 >= 10 ? val : '0' + val)
  let dparts = [dt.getFullYear(), dt.getMonth() + 1, dt.getDate()].map(d2)
  let tparts = [dt.getHours(), dt.getMinutes(), dt.getSeconds()].map(d2)

  return retArr ? [...dparts, ...tparts] : dparts.join('-') + (isTime ? ' ' + tparts.join(':') : '')
}


function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

export default {
	dateFormat,
	formatTime
}