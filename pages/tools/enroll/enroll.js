import sice from '../../../utils/sice';

function dateFormat(dt, isTime, retArr) {
  ; (dt == null || dt == 'now') && (dt = new Date())
  dt = dt instanceof Date ? dt : new Date(dt)
  let d2 = val => (val * 1 >= 10 ? val : '0' + val)
  let dparts = [dt.getFullYear(), dt.getMonth() + 1, dt.getDate()].map(d2)
  let tparts = [dt.getHours(), dt.getMinutes(), dt.getSeconds()].map(d2)

  return retArr ? [...dparts, ...tparts] : dparts.join('-') + (isTime ? ' ' + tparts.join(':') : '')
}

Page({
  data: {
    names: '',
    sn: 0,
    newname: '',
    dt: 'haha'
  },
  dateFormat,
  handleRawNames(data) {
    let snLineRe = /^\d/;
    let lines = data.split(/\n/).filter(line => !!line.replace(/\s/g, ''));
    let title = lines[0].trim().match(snLineRe) ? '' : lines.shift().trim();
    let names = lines;
    
    // >=五个空格+序号姓名 则空格转换为换行
    let nlRe = /\s{5,}(\d)/g;
    if(title && nlRe.test(title)) {// 如第1行包含有连续空格+序号的情况
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

    let firstNameIndex = names.findIndex(name => snLineRe.test(name)); // 之前的为活动文本
    let notNameCount = firstNameIndex;

    // 规范化序号
    let enRe = /^[\d\s\.。、]+/;
    names = names.map((name, i) => {
        return i >= firstNameIndex ? name.replace(enRe, `${sice.d2(i+1-notNameCount)}. `) : name
    });

    this.setData({sn: names.length - notNameCount});

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
    console.warn('enroll page load ---------->');
    console.vm = this;
    let {names} = this.data;
    this.setData({dt: this.dateFormat(Date.now())})
    if(names) {
        this.setData({names: this.handleRawNames(names)});
    }
  }
})