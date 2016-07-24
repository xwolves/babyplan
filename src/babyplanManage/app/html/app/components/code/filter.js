(function() {
'use strict';

var app = angular.module('CustomFilter', []);
app.filter('ZTchange', function () {
    return function (input) {
        if (input == "1")return "已办结";
        else if (input == "0")return "未办结";
        else return "未知";
    };
});

app.filter('JSchange', function () {
    return function (input) {
        if (input == "1")return "管理员";
        else if (input == "0")return "超级管理员";
        else if (input == "2")return "用户";
        else if (input == "*")return "人员";
        else return "未知人员";
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

app.filter('limitPage', function () {
        return function(input, limit, begin) {
            if (input===undefined) return input;
            if (Math.abs(Number(limit)) === Infinity) {
                limit = Number(limit);
            } else {
                limit = parseInt(limit);
            }
            if (isNaN(limit)) return input;
            //if (isNumber(input)) input = input.toString();
            //if (!isArray(input) && !isString(input)) return input;

            begin = (!begin || isNaN(begin)) ? 0 : parseInt(begin);
            begin = (begin < 0) ? Math.max(0, input.length + begin) : begin;

            if (limit >= 0) {
                return input.slice(begin, begin + limit);
            } else {
                if (begin === 0) {
                    return input.slice(limit, input.length);
                } else {
                    return input.slice(Math.max(0, begin + limit), begin);
                }
            }
        }
});

}());
