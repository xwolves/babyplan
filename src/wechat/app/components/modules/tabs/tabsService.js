(function() {
    'use strict';

    angular.module('tabsService', [])
        .factory('tabsService', tabsService);

    function tabsService($q, $http) {
        'ngInject';
        var service = {
            getHomeOptions: getHomeOptions,
            getSlideBoxImgs: getSlideBoxImgs
        };

        function getHomeOptions() {
            return [{
                label: '填写信息',
                iconSrc: 'img/home_icon1.png',
                state: 'PersonalDetails',
                textColor:"#DC5858"
            }, {
                label: '到校方式',
                iconSrc: 'img/home_icon2.png',
                state: 'PersonalDetails',
                textColor:"#5976DF"
            }, {
                label: '新生报到',
                iconSrc: 'img/home_icon3.png',
                state: 'Register',
                textColor:"#27CAD4"
            }, {
                label: '修改密码',
                iconSrc: 'img/home_icon4.png',
                state: 'ModifyPsw',
                textColor:"#DC75E0"
            }, {
                label: '关于应用',
                iconSrc: 'img/home_icon5.png',
                state: 'About',
                textColor:"#75E084"
            }]
        }

        function getSlideBoxImgs() {
            return [{
                index: 0,
                src: "img/home_bg1.png"
            }, {
                index: 1,
                src: "img/home_bg2.png"
            }, {
                index: 2,
                src: "img/home_bg3.png"
            }];
        }
        return service;


    }

}());
