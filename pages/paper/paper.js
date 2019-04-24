function log() {
  var args = [].slice.call(arguments);
  args.unshift('[MYLOG]: ');
  console.log.apply(console, args);
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg: 'hello'
  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    log('onReady');
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    log('onShow');
  }
})