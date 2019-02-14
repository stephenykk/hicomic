import sice from '../../../utils/sice';

Page({
  data: {
    names: '',
    sn: 1,
    newname: ''
  },
  handleRawNames(data) {
    let snLineRe = /^\d/;
    let lines = data.split(/\n/).filter(line => !!line.replace(/\s/g, ''));
    let title = lines[0].trim().match(snLineRe) ? '' : lines.shift().trim();
    let names = lines;
    
    // >=五个空格+序号姓名 则空格转换为换行
    let nlRe = /\s{5,}(\d)/g;
    if(title && nlRe.test(title)) {
        let arr = title.replace(nlRe, '\n$1').split('\n');
        title = arr.shift().trim();
        names = arr.concat(names);
    }

    names = names.map(name => {
        if(nlRe.test(name)) {
            return name.replace(nlRe, '\n$1').split('\n').map(val => val.trim());
        } else {
            return name.trim()
        }
    });

    names = sice.flatten(names);

    // 规范化序号
    let enRe = /^[\d\s\.。、]+/;
    names = names.map((name, i) => {
        return name.replace(enRe, `${sice.d2(i+1)}. `);
    });

    this.setData({sn: names.length});

    if(title) {
        names.unshift(title);
    }

    return names.join('\n');
  },
  paste() {
    wx.getClipboardData({
        success: res => {
            let names = this.handleRawNames(res.data);
            this.setData({names});
        },
        fail: res => {
            sice.toast('获取剪贴板数据异常:' + res)
        }
    })
  },

  copy() {
    let {names} = this.data;
    wx.setClipboardData({
        data: names,
        success() {
            sice.toast('复制成功');
        },
        fail(res) {
            sice.toast('复制失败:' + res);
        }
    })
  },

  submit() {
    let {names, sn, newname} = this.data;
    this.setData({names: `${names}\n${sice.d2(sn+1)}. ${newname}`, sn: sn+1, newname: ''});
  },

  updateNames(event) {
    let {value} = event.detail
    this.setData({names: value});
  },
  updateNewname(event) {
    let {value} = event.detail;
    this.setData({newname: value});
  },
  onLoad: function () {
    console.warn('enroll page load ---------->')
  }
})