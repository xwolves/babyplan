(function () {
    'use strict';

    angular.module('JPushService', [])
    .factory('JPushService', JPushService);

    JPushService.$inject = ['$http', '$window', '$document'];

    function JPushService($http, $window, $document) {
        var jpushServiceFactory = {};

        //var jpushapi=$window.plugins.jPushPlugin;

        //������������
        var _init = function (config) {

            if(!$window.plugins) return;

            $window.plugins.jPushPlugin.init();
            //����tag��Alias�����¼�����
            //document.addEventListener('jpush.setTagsWithAlias', config.stac, false);
            //��������Ϣ�¼�����
            $window.plugins.jPushPlugin.openNotificationInAndroidCallback = config.openNotificationInAndroidCallback;
            $window.plugins.jPushPlugin.receiveMessageInAndroidCallback = config.receiveMessageInAndroidCallback;
            $window.plugins.jPushPlugin.receiveNotificationInAndroidCallback = config.receiveNotificationInAndroidCallback;

            document.addEventListener('jpush.receiveNotification', config.receiveNotificationInAndroidCallback, false);
            document.addEventListener('jpush.receiveMessage', config.receiveMessageInAndroidCallback, false);
            document.addEventListener('jpush.openNotification', config.openNotificationInAndroidCallback, false);
            
            $window.plugins.jPushPlugin.setDebugMode(true);
        }
        //��ȡ״̬
        var _isPushStopped = function (fun) {
            $window.plugins && $window.plugins.jPushPlugin.isPushStopped(fun)
        }
        //ֹͣ��������
        var _stopPush = function () {
            $window.plugins && $window.plugins.jPushPlugin.stopPush();
        }

        //������������
        var _resumePush = function () {
            $window.plugins && $window.plugins.jPushPlugin.resumePush();
        }

        //���ñ�ǩ�ͱ���
        var _setTagsWithAlias = function (tags, alias) {
            $window.plugins && $window.plugins.jPushPlugin.setTagsWithAlias(tags, alias);
        }

        //���ñ�ǩ
        var _setTags = function (tags) {
            $window.plugins && $window.plugins.jPushPlugin.setTags(tags);
        }

        //���ñ���
        var _setAlias = function (alias) {
            $window.plugins && $window.plugins.jPushPlugin.setAlias(alias);
        }


        jpushServiceFactory.init = _init;
        jpushServiceFactory.isPushStopped = _isPushStopped;
        jpushServiceFactory.stopPush = _stopPush;
        jpushServiceFactory.resumePush = _resumePush;
        jpushServiceFactory.setTagsWithAlias = _setTagsWithAlias;
        jpushServiceFactory.setTags = _setTags;
        jpushServiceFactory.setAlias = _setAlias;

        return jpushServiceFactory;
    }

}());
