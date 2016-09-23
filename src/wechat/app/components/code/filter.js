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
