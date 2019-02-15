import sice from '../../../utils/sice';

Page({
  data: {
    names: `搭食早餐、午餐的请接龙
姓名:张三(早餐或午餐)
1.吴炫霖   午餐
2.龙梓茵丶午餐
3.陈馨平、早餐，午餐
4.赵岳瑜，午餐
5.陈梓言，早餐，午餐
6.程钊毅，早餐，午餐
7.肖丹婷 午餐
8、冯健钊，午餐
9、吴正扬、午餐
10、杜雨峻,早餐丶午餐。      11、邓灵 早餐，午餐
12、王辰初   午餐
13、刘梓萱、午餐 
14、王子炎   午餐 
15、苏茵婷   早餐   午餐
16、李涛，午餐
17.梁博瀚，午餐
18.郭晓澄，早餐，午餐
19.黎锦芬，午餐
20.陈嘉莉，早餐，午餐
21.刘东，午餐
22.韩颖思，早餐，午餐
23.黎焕彬，早餐，午餐                     24.代嘉欣，午餐                                   25.周予馨 ，午餐
26.宗昊轩，午餐
27.范佳麒，午餐
28.舒乐，午餐                                     29.邓国浩，早餐，午餐`,
    sn: 0,
    newname: ''
  },
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
    let {names} = this.data;
    if(names) {
        this.setData({names: this.handleRawNames(names)});
    }
  }
})