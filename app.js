import sice from './utils/sice';


if(typeof top !== 'undefined' && top.Object === Object) {
    top.sice = sice;
    console.warn('Got global object');
    console.warn('sice: ', sice);
} else {
    console.warn('Can not got global object');
}

App({
  onLaunch: function () {
    console.log('app starts...........');
  },
  globalData: {
    userInfo: null
  }
})