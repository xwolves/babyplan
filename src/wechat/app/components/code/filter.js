(function() {
'use strict';

var app = angular.module('CustomFilter', []);
app.filter('gendarChange', function () {
    return function (input) {
        if (input == "1")return "男";
        else if (input == "2")return "女";
        else return "未知";
    };
});

app.filter('JSchange', function () {
    return function (input) {
        if (input == "1")return "托管机构";
        else if (input == "3")return "老师";
        else if (input == "2")return "家长";
        else return "未知人员";
    };
});

app.filter('PayStatus', function () {
    return function (input) {
        if (input == "1")return "已付款";
        else if (input == "0")return "未付款";
        else return "未知";
    };
});

app.filter('PayType', function () {
    return function (input) {
        if (input == "1")return "支付宝支付";
        else if (input == "0")return "微信支付";
        else if (input == "2")return "其它";
        else return "未知";
    };
});

app.filter('relationshipChange', function () {
    return function (input) {
        if (input == "1")return "父亲";
        else if (input == "2")return "母亲";
        else if (input == "3")return "爷爷";
        else if (input == "4")return "奶奶";
        else return "其它";
    };
});

app.filter('dateChange', function () {
    return function (input) {
        var d = new Date(input.replace(/-/g,   "/"));
        var now = new Date();
        var time=now.getTime()- d.getTime();
        if(time>24*60*60*1000){
            return d.Format('MM月dd日');
        }else if(time>60*60*1000){
            return d.Format('hh')+"小时前";
        }else{
            return d.Format('mm')+"分钟前";
        }
    };
});

app.filter('ImageMin', function () {
    return function (input) {
        if(input!=null){
            var fileExtension = input.substring(input.lastIndexOf('.') + 1);
            var fileName = input.substring(0,input.lastIndexOf('.'));
            if(fileExtension.toLowerCase()=='jpg' ||fileExtension.toLowerCase() =='png' || fileExtension.toLowerCase()=='gif'){
                return fileName+"_64x64"+"."+fileExtension;
            }return input;
        }else{
            return '';
        }

    };
});

app.filter('statusChange', function () {
    return function (input,rule) {
        //var rule=[{dm:"0",mc:"未办结"},{dm:"1",mc:"已办结"}];
        if(rule!=null&&rule.length>0) {
            for (var i = 0; i < rule.length; i++) {
                if(rule[i].dm==input)return rule[i].mc;
            }
        }else{
            return input;
        }
    };
});
}());
