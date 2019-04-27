import util from './util';

export default {
    navigateTo(url) {
        let option = util.isObject(url) ? url : {
            url
        };
        wx.navigateTo(option);
    },
    toast(msg) {
        let option = util.isObject(msg) ? msg : {
            title: msg,
            icon: 'none'
        };

        wx.showToast(option);
    }
}