//index.js
//获取应用实例
var util = require('../../utils/u1.js')
var today = new Date();
var iday = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
var drinks = ["水", "茶", "红茶", "绿茶", "咖啡", "奶茶", "可乐", "鲜奶", "豆奶", "果汁", "果味汽水", "苏打水", "运动饮料", "酸奶", "酒"]
var directions = ["北方", "东北方", "东方", "东南方", "南方", "西南方", "西方", "西北方"]
var app = getApp()
Page({
  data: {
    goodlists:[],
    splitlists:[],
    today:''
  },
  
  onLoad: function () {

    var week = today.getUTCDay()
    var year = today.getFullYear()
    var month = today.getMonth()+1
    var day = today.getDate()

    var stars=''
    this.setData({
      date: '今天是'+year + '年' + month + '月' + day+ '日  ',
      iday: iday
    })
    switch (week) {
      case 1:
        this.setData({
          week: "星期一"
        })
        break;
      case 2:
        this.setData({
          week: "星期二"
        })
        break;
      case 3:
        this.setData({
          week: "星期三"
        })
        break;
      case 4:
        this.setData({
          week: "星期四"
        })
        break;
      case 5:
        this.setData({
          week: "星期五"
        })
        break;
      case 6:
        this.setData({
          week: "星期六"
        })
        break;
      case 0:
        this.setData({
          week: "星期日"
        })
        break;
    }
    this.setData({
      drinks: pickRandom(drinks,2),
      direction: directions[random(iday, 2) % directions.length],
      stars: star(random(iday, 6) % 5 + 1),
      goodlists: pickTodaysLuck(1),
      splitlists: pickTodaysLuck(0)
    })
  },
  onShareAppMessage: function () {
    return {
      title: '程序员老黄历',
      desc: '程序员老黄历!',
      path: 'pages/index/index'
    }
  }
})


function star(num) {
  var result = "";
  var i = 0;
  while (i < num) {
    result += "★";
    i++;
  }
  while (i < 5) {
    result += "☆";
    i++;
  }
  return result;
}
function random(dayseed, indexseed) {
  var n = dayseed % 11117;
  for (var i = 0; i < 100 + indexseed; i++) {
    n = n * n;
    n = n % 11117;   // 11117 是个质数
  }
  return n;
}
var activities = util.activities
var tools = util.tools
var varNames = util.varNames

// 生成今日运势
function pickTodaysLuck(e) {
  var goodlist = [];
  var splitlist = [];
  var _activities = filter(activities);

  var numGood = random(iday, 98) % 3 + 2;
  var numBad = random(iday, 87) % 3 + 2;
  var eventArr = pickRandomActivity(_activities, numGood + numBad);


  for (var i = 0; i < numGood; i++) {
    goodlist.push(eventArr[i]);
  }

  for (var i = 0; i < numBad; i++) {
    splitlist.push(eventArr[numGood+i]);
  }
  if(e==1){
    return goodlist
  }else if(e==0){
    return splitlist
  }
}

// 去掉一些不合今日的事件
function filter(activities) {
  var result = [];

  // 周末的话，只留下 weekend = true 的事件
  if (isWeekend()) {

    for (var i = 0; i < activities.length; i++) {
      if (activities[i].weekend) {
        result.push(activities[i]);
      }
    }

    return result;
  }
  console.log(activities);
  return activities;
}

function isWeekend() {
  return today.getUTCDay() == 0 || today.getUTCDay() == 6;
}

// 从 activities 中随机挑选 size 个
function pickRandomActivity(activities, size) {
  var picked_events = pickRandom(activities, size);

  for (var i = 0; i < picked_events.length; i++) {
    picked_events[i] = parse(picked_events[i]);
  }

  return picked_events;
}

// 从数组中随机挑选 size 个
function pickRandom(array, size) {
  var result = [];

  for (var i = 0; i < array.length; i++) {
    result.push(array[i]);
  }

  for (var j = 0; j < array.length - size; j++) {
    var index = random(iday, j) % result.length;
    result.splice(index, 1);
  }

  return result;
}

// 解析占位符并替换成随机内容
function parse(event) {
  var result = { name: event.name, good: event.good, bad: event.bad };  // clone

  if (result.name.indexOf('%v') != -1) {
    result.name = result.name.replace('%v', varNames[random(iday, 12) % varNames.length]);
  }

  if (result.name.indexOf('%t') != -1) {
    result.name = result.name.replace('%t', tools[random(iday, 11) % tools.length]);
  }

  if (result.name.indexOf('%l') != -1) {
    result.name = result.name.replace('%l', (random(iday, 12) % 247 + 30).toString());
  }

  return result;
}