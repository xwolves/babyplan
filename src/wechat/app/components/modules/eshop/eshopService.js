/**
 * 商城API服务
 */

angular.module('eshopService', [])
  .service('eshopService', function ($q, $http, $window, Constants) {

      /**
        * 注册
        * @param {*} userName 账号 
        * @param {*} password 密码 
        * @param {*} email    邮箱 
        */
      function _signup(userName, password, email) {
          var defer = $q.defer(),
           apiUrl = Constants.eshopApiUrl + 'ecapi.auth.default.signup';

          var singUpInfo = {
              username: userName,
              password: password,
              email: email
          };

          $http({
              method: 'POST',
              url: apiUrl,
              params: null,
              data: singUpInfo
          }).success(function (data) {
              if (!!data["error_code"] && data["error_code"] > 0) {
                  defer.reject(data["error_desc"]);
              } else {
                  $window.localStorage.setItem("eshop_auth", JSON.stringify(data));
                  defer.resolve(data);
              }
          }).error(function (err) {
              defer.reject(err);
          });

          return defer.promise;
      }

      /**
        * 登录
        * @param {*} userName 账号 
        * @param {*} password 密码 
        */
      function _signin(userName, password) {
          var defer = $q.defer(),
           apiUrl = Constants.eshopApiUrl + 'ecapi.auth.signin';

          var singInInfo = {
              username: userName,
              password: password,
          };

          $http({
              method: 'POST',
              url: apiUrl,
              params: null,
              data: singInInfo
          }).success(function (data) {
              if (!!data["error_code"] && data["error_code"] > 0) {
                  defer.reject(data["error_desc"]);
              } else {
                  $window.localStorage.setItem("eshop_auth", JSON.stringify(data));
                  defer.resolve(data);
              }
          }).error(function (err) {
              defer.reject(err);
          });

          return defer.promise;
      }



      /**
        * 更改密码
        * @param {*} oldPassword 账号 
        * @param {*} password 密码 
        */
      function _changePassword(oldPassword, password) {
          var defer = $q.defer(),
           apiUrl = Constants.eshopApiUrl + 'ecapi.user.password.update';

          var changePwdInfo = {
              old_password: oldPassword,
              password: password,
          };

          var header=null,
              authInfo = $window.localStorage.getItem("eshop_auth");
          if (!!authInfo) {
              authInfo = JSON.parse(authInfo);
              header={"X-ECAPI-Authorization":authInfo.token};
          }

          $http({
              method: 'POST',
              url: apiUrl,
              params: null,
              data: changePwdInfo,
              headers: header
          })
          .success(function (data) {
              if (!!data["error_code"] && data["error_code"] > 0) {
                  defer.reject(data["error_desc"]);
              } else {
                  defer.resolve();
              }
          }).error(function (err) {
              defer.reject(err);
          });

          return defer.promise;
      }

      /**
       * 注销
       */
      function _signout() {
          $window.localStorage.removeItem("eshop_auth");
      }

      return {
          signup: _signup,
          signin: _signin,
          changePassword: _changePassword,
          signout: _signout
      };
  });
