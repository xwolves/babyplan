(function() {
    'use strict';

    angular.module('depositCommentService', [])
        .factory('depositCommentService', myService);

    function myService( $q, $http,Constants,ResultHandler) {
        'ngInject';
        var service = {
            saveDepositComment:saveDepositComment,
            getDepositComment:getDepositComment,
            getTotalDepositScore:getTotalDepositScore
        };


        //1.家长评分
        //POST
        //URL: /api/v1/comments/parent/deposit
        //Request Body:
        //{
        //    "depositid":10000001,
        //    "parentid": 31000001,
        //    "scores":{
        //    "kitchen":8,
        //        "food":8,
        //        "road_safety":8,
        //        "edu_fire_safety":8,
        //        "teacher_responsibility":8
        //      },
        //    "comments_text":"老师责任心很好"
        //}
        function saveDepositComment(data) {
            var url = Constants.serverUrl + 'comments/parent/deposit';
            return $http({
                method: 'post',
                url: url,
                data: data
            }).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
        };

        //2.获取家长评分
        //GET
        //URL: /api/v1/comments/parent/deposit/?parentid=30000001&depositid=10000001
        //    Response Body:
        //{
        //    "errno":0,
        //    "error":"",
        //    "data":{
        //    "scores":{
        //        "kitchen":8,
        //            "food":8,
        //            "road_safety":8,
        //            "edu_fire_safety":8,
        //            "teacher_responsibility":8
        //        },
        //    "comments_text":"老师责任心很好"
        //    }
        //}
        function getDepositComment(pid,did) {
            var url = Constants.serverUrl + 'comments/parent/deposit?parentid='+pid+"&depositid="+did;
            return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
        };

        //3.获取总评分
        //总评分计算公式： 总评分 = 公司评分 * 40% + 所有家长的各项评分的总平均分 * 60%
        //GET
        //URL: /api/v1/comments/deposit/?depositid=10000001
        //Response Body:
        //{
        //    "errno":0,
        //    "error":"",
        //    "data":{
        //        "scores":8
        //    }
        //}
        function getTotalDepositScore(did) {
            var url = Constants.serverUrl + 'comments/deposit?depositid='+did;
            console.log(url);
            return $http.get(url).then(ResultHandler.successedFuc, ResultHandler.failedFuc);
        };

        return service;


    }

}());