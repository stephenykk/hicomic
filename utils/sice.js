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

function toast(msg) {
    let option = isObject(msg) ? msg : {
        title: msg,
        icon: 'none'
    };

    wx.showToast(option);
}

export default {
    isArray,
    isObject,
    flatten,
    d2,
    toast,
}