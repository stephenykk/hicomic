import sice from './utils/sice';


function getGlobal() {
  var done = true
  if (typeof top !== 'undefined' && top.Object === Object) {
      top.sice = sice;
      console.warn('Got global object top');
  } else if (typeof global !== 'undefined' && global.Object === Object) {
      global.sice = sice;
      console.warn('Got global object global');
  } else if (typeof root !== 'undefined' && root.Object === Object) {
      root.sice = sice;
      console.warn('Got global object root');
  } else {
    var thisObj = new Function('return this')();
    if(typeof thisObj !== 'undefined' && thisObj.Object === Object ) {
      thisObj.sice = sice;
      console.warn('Got global object thisObj');
    } else {

      done = false
        console.warn('Can not got global object');
    }
  }

  if(done) {
    console.log('sice: ', sice);
  }

  return done
  
}

var done = getGlobal();
var c = 1;
if(!done) {
  console.warn('try getGlobal later ', c);
  setTimeout(function() {
    done = getGlobal()
  }, 4000);
}


console.App = App;

App({
    onLaunch: function() {
        console.log('app starts...........');
    },
    globalData: {
        userInfo: null
    }
})