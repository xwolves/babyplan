(function() {

	'use strict';

	angular.module('WebService', []).factory('WebService', webService);
	function webService($q, $http, Session, Env) {

		//var url = "http://127.0.0.1:8080/manager/api/v1/";
		var url = "../babyapi/api/v1/";
		// var url = "../Api/";
		// var url = Env.url;
		var service = {

			login : login,
			logout:logout,
			querydepositinfo : querydepositinfo,
			queryDepostbyid : queryDepostbyid,
			registerDePosit : registerDePosit,
			queryChildrenExt : queryChildrenExt,
			queryTeacherExt:queryTeacherExt,
			queryDepositDaily:queryDepositDaily,
			queryChildrenSign:queryChildrenSign,
			queryDeviceDetail:queryDeviceDetail,
			queryParentOrder:queryParentOrder,
		};
		return service;
		
		
		function logout() {

			return $http.get(url + "logout").then(function(response) {
				if (response.data.status == 0) {
					return response.data;
				} else {
					return $q.reject(response.data);
				}
			}, function(error) {
				return $q.reject(error);
			});
		}
		;

		// login
		function login(user, password) {

			if (user == null)
				return $q.reject("用户名不能为空");
			if (password == null)
				return $q.reject("密码不能为空");

			var json = {
				"name" : user,
				"password" : password
			};

			return $http.post(url + "login", json).then(function(response) {
				if (response.data.status == 0) {
					return response.data;
				} else {
					return $q.reject(response.data);
				}
			}, function(error) {
				return $q.reject(error);
			});
		}
		;

		// desp
		function querydepositinfo(pageNumber, pageSize, order, filter) {
			
			var tempvar = "pageNumber=" + pageNumber + "&pageSize=" + pageSize;
			if (order != undefined) {
				tempvar += "&order=" + order;

			}

			if (filter != undefined) {
				tempvar += "&filter=" + filter;

			}
			
			var descurl = encodeURI(url + "queryDepositinfo/?"+tempvar);
			
			console.log(tempvar);
			return $http.get(descurl).then(function(response) {
				if (response.data.status == 0) {
					return response.data.content;
				} else {
					return $q.reject(response);
				}
			}, function(error) {
				return $q.reject(error);
			});
		}
		;

		function registerDePosit(accountId, orgName, address, markId,
				contactName, contactPhone, licenseType, placeContractType,
				frontDeskLink, publicZoneLink, kitchenLink, diningRoomLink,
				restRoomLink1, restRoomLink2, classRoomLink1, classRoomLink2,
				otherRoomLink1, otherRoomLink2, iD2Number, iD2PhotoLink,
				remark, password, longitude, latitude) {

			var json = {
				"accountId" : accountId,
				"orgName" : orgName,
				"address" : address,
				"markId" : markId,
				"contactName" : contactName,
				"contactPhone" : contactPhone,
				"licenseType" : licenseType,
				"placeContractType" : placeContractType,
				"frontDeskLink" : frontDeskLink,
				"publicZoneLink" : publicZoneLink,
				"kitchenLink" : kitchenLink,
				"diningRoomLink" : diningRoomLink,
				"restRoomLink1" : restRoomLink1,
				"restRoomLink2" : restRoomLink2,
				"classRoomLink1" : classRoomLink1,
				"classRoomLink2" : classRoomLink2,
				"otherRoomLink1" : otherRoomLink1,
				"otherRoomLink2" : otherRoomLink2,
				"iD2Number" : iD2Number,
				"iD2PhotoLink" : iD2PhotoLink,
				"remark" : remark,
				"password" : password,
				"longitude" : longitude,
				"latitude" : latitude
			};

			return $http.post(url + "register", json).then(function(response) {
				if (response.data.status == 0) {
					return response.data;
				} else {
					return $q.reject(response.data);
				}
			}, function(error) {
				return $q.reject(error);
			});
		}
		;

		function queryDepostbyid(accountID) {
			return $http.get(url + "depositinfoOne?id=" + accountID).then(
					function(response) {
						if (response.data.status == 0) {
							return response.data.content;
						} else {
							return $q.reject(response);
						}
					}, function(error) {
						return $q.reject(error);
					});
		}
		;

		function queryChildrenExt(pageNumber, pageSize, order, filter) {
			var tempvar = "pageNumber=" + pageNumber + "&pageSize=" + pageSize;
			if (order != undefined) {
				tempvar += "&order=" + order;

			}

			if (filter != undefined) {
				tempvar += "&filter=" + filter;

			}

			var descurl = encodeURI(url + "queryChildrenExtinfo/?"+tempvar);
			
			return $http.get(descurl).then(function(response) {
				if (response.data.status == 0) {
					return response.data.content;
				} else {
					return $q.reject(response.data);
				}
			}, function(error) {
				return $q.reject(error);
			});
		}
		;
		
		function queryTeacherExt(pageNumber, pageSize, order, filter) {
			var tempvar = "pageNumber=" + pageNumber + "&pageSize=" + pageSize;
			if (order != undefined) {
				tempvar += "&order=" + order;

			}

			if (filter != undefined) {
				tempvar += "&filter=" + filter;

			}
			
			var descurl = encodeURI(url + "queryTeacherExtinfo/?"+tempvar);

			return $http.get(descurl).then(function(response) {
				if (response.data.status == 0) {
					return response.data.content;
				} else {
					return $q.reject(response.data);
				}
			}, function(error) {
				return $q.reject(error);
			});
		}
		;
		
		
		//zzm add 2016 10.2
		function queryChildrenSign(pageNumber, pageSize, order, filter) {
			
			var tempvar = "pageNumber=" + pageNumber + "&pageSize=" + pageSize;
			if (order != undefined) {
				tempvar += "&order=" + order;

			}

			if (filter != undefined) {
				tempvar += "&filter=" + filter;

			}
			
			var descurl = encodeURI(url + "queryChildrenSign/?"+tempvar);
			
			console.log(tempvar);
			return $http.get(descurl).then(function(response) {
				if (response.data.status == 0) {
					return response.data.content;
				} else {
					return $q.reject(response);
				}
			}, function(error) {
				return $q.reject(error);
			});
		}
		;
		
		function queryDepositDaily(pageNumber, pageSize, order, filter) {
			
			var tempvar = "pageNumber=" + pageNumber + "&pageSize=" + pageSize;
			if (order != undefined) {
				tempvar += "&order=" + order;

			}

			if (filter != undefined) {
				tempvar += "&filter=" + filter;

			}
			
			var descurl = encodeURI(url + "queryDepositDaily/?"+tempvar);
			
			console.log(tempvar);
			return $http.get(descurl).then(function(response) {
				if (response.data.status == 0) {
					return response.data.content;
				} else {
					return $q.reject(response);
				}
			}, function(error) {
				return $q.reject(error);
			});
		}
		;
		
		
		function queryDeviceDetail(pageNumber, pageSize, order, filter) {
			
			var tempvar = "pageNumber=" + pageNumber + "&pageSize=" + pageSize;
			if (order != undefined) {
				tempvar += "&order=" + order;

			}

			if (filter != undefined) {
				tempvar += "&filter=" + filter;

			}
			
			var descurl = encodeURI(url + "queryDeviceDetail/?"+tempvar);
			
			console.log(tempvar);
			return $http.get(descurl).then(function(response) {
				if (response.data.status == 0) {
					return response.data.content;
				} else {
					return $q.reject(response);
				}
			}, function(error) {
				return $q.reject(error);
			});
		}
		;

		function queryParentOrder(pageNumber, pageSize, order, filter) {
			
			var tempvar = "pageNumber=" + pageNumber + "&pageSize=" + pageSize;
			if (order != undefined) {
				tempvar += "&order=" + order;

			}

			if (filter != undefined) {
				tempvar += "&filter=" + filter;

			}
			
			var descurl = encodeURI(url + "queryParentOrder/?"+tempvar);
			
			console.log(tempvar);
			return $http.get(descurl).then(function(response) {
				if (response.data.status == 0) {
					return response.data.content;
				} else {
					return $q.reject(response);
				}
			}, function(error) {
				return $q.reject(error);
			});
		}
		;
		
		// 下面的都是没有用的

		function queryDocument() {
			return $http.get(url + "Document").then(function(response) {
				if (response.data.status == 0) {
					return response.data.content;
				} else {
					return $q.reject(response);
				}
			}, function(error) {
				return $q.reject(error);
			});
		}
		;

		function getStartMonth() {
			var date = new Date();
			var startM;
			var startY;

			if (date.getMonth() >= 2) {
				startM = date.getMonth() - 2;
				startY = date.getFullYear();
			} else if (date.getMonth() == 1) {
				var startM = 11;
				startY = date.getFullYear() - 1;
			} else if (date.getMonth() == 0) {
				var startM = 10;
				startY = date.getFullYear() - 1;
			}
			return new Date(startY, startM, 1, 0, 0, 0);
		}
		;

		function queryThreeMonthDocument() {
			return $http.get(
					url + "Document?startDate=" + getStartMonth().getTime()
							+ "&endDate=" + new Date().getTime()).then(
					function(response) {
						if (response.data.status == 0) {
							return response.data.content;
						} else {
							return $q.reject(response);
						}
					}, function(error) {
						return $q.reject(error);
					});
		}
		;

		function queryPageDocument(page, size) {
			return $http.get(url + "Document/?page=" + page + "&size=" + size)
					.then(function(response) {
						if (response.data.status == 0) {
							return response.data.content;
						} else {
							return $q.reject(response);
						}
					}, function(error) {
						return $q.reject(error);
					});
		}
		;

		function queryPersonDocument(gh) {
			return $http.get(url + "personDocument/" + gh).then(
					function(response) {
						if (response.data.status == 0) {
							return response.data.content;
						} else {
							return $q.reject(response);
						}
					}, function(error) {
						return $q.reject(error);
					});
		}
		;

		function queryThreeMonthPersonDocument(gh) {
			return $http.get(
					url + "personDocument/" + gh + "?startDate="
							+ getStartMonth().getTime() + "&endDate="
							+ new Date().getTime()).then(function(response) {
				if (response.data.status == 0) {
					return response.data.content;
				} else {
					return $q.reject(response);
				}
			}, function(error) {
				return $q.reject(error);
			});
		}
		;

		function querySingleDocument(no, index) {
			return $http.get(url + "Document/" + no).then(function(response) {
				response.data.index = index;
				return response.data;
			}, function(error) {
				return $q.reject(error);
			});
		}
		;

		function queryLikeDocument(no) {
			return $http.get(url + "Document?like=" + no).then(
					function(response) {
						if (response.data.status == 0) {
							return response.data.content;
						} else {
							return $q.reject(response);
						}
					}, function(error) {
						return $q.reject(error);
					});
		}
		;

		function querySignProcess(no) {
			return $http.get(url + "SignProcess/" + no).then(
					function(response) {
						// console.log(response);
						return response.data;
					}, function(error) {
						return $q.reject(error);
					});
		}
		;

		function queryTeacherSignProcess(gh) {
			// return $http.get(url + "TeacherSignProcess/" + gh)
			return $http.get(url + "MySignProcess/" + gh).then(
					function(response) {
						// console.log(response);
						return response.data.content;
					}, function(error) {
						return $q.reject(error);
					});
		}
		;

		function queryThreeMonthTeacherSignProcess(gh) {
			return $http.get(
					url + "MySignProcess/" + gh + "?startDate="
							+ getStartMonth().getTime() + "&endDate="
							+ new Date().getTime()).then(function(response) {
				// console.log(response);
				return response.data.content;
			}, function(error) {
				return $q.reject(error);
			});
		}
		;

		function countTodayOfficialDocument() {
			var now = new Date();
			var d = new Date(now.getFullYear() + "-" + (now.getMonth() + 1)
					+ "-" + now.getDate() + " 00:00:00");
			return $http.get(
					url + "/Document/today?start=" + d.getTime() + "&end="
							+ (d.getTime() + 24 * 60 * 60)).then(
					function(response) {
						// console.log(response);
						return response.data;
					}, function(error) {
						return $q.reject(error);
					});
		}

		function countOneDayOfficialDocument() {
			return $http.get(url + "/Document/count").then(function(response) {
				// console.log(response);
				return response.data;
			}, function(error) {
				return $q.reject(error);
			});
		}

		function getDocumentNum() {
			return $http.get(url + "/Document/num").then(function(response) {
				return response.data;
			}, function(error) {
				return $q.reject(error);
			});
		}

		function createDocument(fwbh, fwmc, fwms, fwrymc, fwrybm, fwrysj) {
			var fwr = Session.ry;
			console.log(fwr);
			if (fwbh == null)
				return $q.reject("发文编号不能为空");
			if (fwmc == null)
				return $q.reject("发文名称不能为空");
			if (fwrymc == null)
				return $q.reject("发文人不能为空");

			var json = {
				"fwrygh" : fwr != null ? fwr.gh : "",
				"fwrymc" : fwrymc != null ? fwrymc : fwr.mc,
				"fwrybm" : fwrybm != null ? fwrybm : fwr.bm,
				"fwrysj" : fwrysj != null ? fwrysj : fwr.sjhm,
				"fwmc" : fwmc,
				"fwms" : fwms,
				"fwbh" : fwbh,
				"fwzt" : 0,
				"sjrgh" : "",
				"sjrmc" : "",
				"sjrbm" : "",
				"fwrq" : new Date().getTime(),
				"fwjbrq" : "",
				"version" : 0
			};

			return $http.post(url + "Document", json).then(function(response) {
				// console.log(response);
				return response.data;
			}, function(error) {
				return $q.reject(error);
			});
		}
		;

		function signDocument(fwbh, qsr, sm) {
			if (fwbh == null)
				return $q.reject("发文编号不能为空");
			var json = {
				fwbh : fwbh,
				qsrgh : qsr != null ? qsr.gh : "",
				qsrmc : qsr != null ? qsr.mc : "",
				qsrbm : qsr != null ? qsr.bm : "",
				qssm : sm != null ? sm : ((qsr != null ? qsr.mc : "") + "签收"),
				rq : new Date().getTime(),
				version : 0
			};
			return $http.post(url + "SignProcess", json).then(
					function(response) {
						return response.data;
					}, function(error) {
						return $q.reject(error);
					});
		}
		;

		function deleteSignProcess(bh) {
			if (bh == null)
				return $q.reject("请求编号不能为空");
			// return $http.delete(url + "SignProcess/"+bh)
			// The problem is that delete is a javascript keyword and IE8 parses
			// it slightly incorrectly.
			// According to the standard, identifiers can be called delete.
			// A quick fix is: $http['delete'](url + "SignProcess/"+bh)
			return $http['delete'](url + "SignProcess/" + bh).then(
					function(response) {
						console.log("deleteSignProcess result is ");
						console.log(response);
						return response.data;
					}, function(error) {
						return $q.reject(error);
					});
		}
		;

		function finishDocment(bh) {
			if (bh == null)
				return $q.reject("发文编号不能为空");
			var json = {
				fwzt : '1',
				fwjbrq : new Date().getTime()
			};
			return $http.put(url + "Document/" + bh, json).then(
					function(response) {
						return response.data;
					}, function(error) {
						return $q.reject(error);
					});
		}
		;

		function queryUser(no) {
			console.log("check User");
			return $http.get(url + "User/" + no).then(function(response) {
				console.log(response.data);
				return response.data;
			}, function(error) {
				return $q.reject(error);
			});
		}
		;

		function queryAllUser() {
			console.log("get all User");
			return $http.get(url + "User").then(function(response) {
				console.log(response.data);
				return response.data;
			}, function(error) {
				return $q.reject(error);
			});
		}
		;

		function saveUser(gh, mc, bm, sj, yx, fromcas) {
			console.log("save User");
			if (gh == null)
				return $q.reject("工号不能为空");
			if (mc == null)
				return $q.reject("名称不能为空");
			if (bm == null)
				return $q.reject("部门不能为空");
			if (fromcas)
				sj = "";
			if (sj == null)
				return $q.reject("手机不能为空");
			var json = {
				"bh" : "",
				"gh" : gh,
				"mc" : mc != null ? mc : "",
				"bm" : bm != null ? bm : "",
				"js" : "2",
				"sjhm" : sj != null ? sj : "",
				"dzyx" : yx,
				"version" : 0
			};
			console.log(JSON.stringify(json));
			return $http.post(url + "User", json).then(function(response) {
				console.log(response.data);
				return response.data;
			}, function(error) {
				console.log("save user error !");
				console.log(error);
				return $q.reject(error);
			});
		}
		;

		function saveUserRole(user, js) {
			console.log("save User role");
			if (js == user) {
				console.log("no change role");
				return $q.reject("角色无需更新");
			}
			user.js = js;
			console.log(JSON.stringify(user));
			return $http.post(url + "User", user).then(function(response) {
				console.log(response.data);
				return response.data;
			}, function(error) {
				console.log("save user error !");
				console.log(error);
				return $q.reject(error);
			});
		}
		;

		function getStatisticsDocs(year, month) {
			// http://localhost:8080/documentSignProcess/Api/StatisticsDocs?y=2016
			var queryStr = "";
			if (year != null && month != null) {
				queryStr = "?y=" + year + "&m=" + month;
			} else if (year != null && month == null) {
				queryStr = "?y=" + year;
			} else if (month != null && year == null)
				queryStr = "?m=" + month;
			return $http.get(url + "StatisticsDocs" + queryStr).then(
					function(response) {
						if (response.data.status == 0) {
							return response.data.content;
						} else {
							return $q.reject(response);
						}
					}, function(error) {
						return $q.reject(error);
					});
		}
		;

		function getExportExcel(start, end) {
			if (start.length != 8 || isNaN(start) || isNaN(end)
					|| start.length != 8) {
				return $q.reject("参数值不正确");
			}
			return $http.get(
					url + "exportExcel" + "?start=" + start + "&end=" + end)
					.then(function(response) {
						if (response.data.status == 0) {
							return response.data.content;
						} else {
							return $q.reject(response);
						}
					}, function(error) {
						return $q.reject(error);
					});
		}

		function queryCasInfo() {
			// return $http.get(url + "casInfo")
			// return $http.get(Env.servletUrl)
			return $http.get(url + "casInfo").then(function(response) {
				console.log(response);
				if (response.data.status == 0) {
					return response.data.content;
				} else {
					return $q.reject(response);
				}
			}, function(error) {
				return $q.reject(error);
			});
		}
		;

		function logoutCas() {
			return $http.get(url + "logoutCas").then(function(response) {
				if (response.data.status == 0) {
					console.log(response.data);
					return response.data;
				} else {
					return $q.reject(response);
				}
			}, function(error) {
				return $q.reject(error);
			});
		}
	}
}());
