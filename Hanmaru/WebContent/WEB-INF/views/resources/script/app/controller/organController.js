
appHanmaru.controller('organController', ['$scope', '$http', '$rootScope', '$timeout', function($s, $http, $rs, $timeout) {
	$s.org_user_list;
	$s.tab_index = 2;
	$s.search_org_user_list = new Array();
	$s.search_org_addr_list = new Array();
	$s.orgSearchKeyword;
	$s.selectedOrganUser;
	$s.isProfileImgEnlarge = true;
	$rs.snbCurrSelectedDeptCode = '';
	$s.addrCnt = 0;
	$s.organCnt = 0;
	$s.isTopOrgExpand = true;
	
	$rs.$on('initInsaBox', function(event) {
		var param = callApiObject('insa', 'insaBoxs', {LoginKey:$rs.userInfo.LoginKey});
		console.log(param);
		$http(param).success(function(data) {
			var boxList = JSON.parse(data.value);
			
			$rs.subMenuType = 'insa';
			$rs.subMenuList = boxList;
			
			console.log(boxList);
			
			$rs.$broadcast('initInsaList');
			var pageName = angular.element('[class^="panel"][class*="current"]').attr('id');
			pushPage(pageName, 'pg_insa_list');
		}).then(function(){
			$timeout(function(){
				$rs.dialog_progress = false;
			}, 1000);
		});
	});
	
	$rs.$on('initInsaList', function(event) {
		$s.tab_index = 2;
		$rs.topDeptCode = $rs.subMenuList.Depts[0];
		var currUserDepts = $rs.subMenuList;
		
		console.log('topDeptCode : ' ,$rs.topDeptCode);
		console.log('currUserDepts : ' ,currUserDepts);
		
		$rs.isExpandOrganList = false; //조직도 SNB에서 선택시 한번만 스크롤되기 위한 변수.
		recursiveOrganTree(currUserDepts, currUserDepts.Depts.length, 0);
//		console.log('currUserDepts : ',currUserDepts);
//		console.log('currUserDepts.Depts.length : ',currUserDepts.Depts.length);
	});
	
	$rs.findChildDept = function(dept, depth) {
		$rs.snbCurrSelectedDeptCode = dept.DeptCode;
//		console.log('side dept code : ',$rs.snbCurrSelectedDeptCode);
		var maxDepth = parseInt(dept.DeptLevel, 10);
		searchDept(dept, depth, maxDepth);
	}
	
	$rs.userDeptBtn = function(userInfo){
		
//		console.log('클릭된 user info : ',userInfo);
		
		var reqInsaListOrganData = {
				LoginKey:$rs.userInfo.LoginKey,
				Search:userInfo.DeptName
			};
			
			var organParam = callApiObject('insa', 'insaFind', reqInsaListOrganData);
			$http(organParam).success(function(data) {
				var code = JSON.parse(data.Code);
//				console.log('result : ',code);
				if(code==1){
					var result = JSON.parse(data.value);
					var tmp = result.Depts;
//					console.log('검색된 조직원 : ',tmp);
					for(idx in tmp){
						if(tmp[idx].DeptCode == userInfo.DeptCode){
//							console.log(tmp[idx].DeptCode);
							$rs.findChildDept(tmp[idx],tmp[idx].DeptLevel);
						}
					}
				}
			}).then(function(){
				setTimeout(function(){
					$s.$apply(function(){
						$s.tab_index = 2;
					});
				},300);
			});
		
	}
	
	$rs.btnCollapseTree = function(dept) {
		if(dept.isExpand == undefined) {
			dept.isExpand = false;
		} else {
			dept.isExpand = !dept.isExpand;
		}
	}
	
	$s.selectOrgTab = function(index) {
		$s.tab_index = index;
	};
	
	$s.btnDetectSearch = function(e) {
		var keyCode = e.keyCode;
		if(keyCode == 13) {
			$s.btnSearchOrgUserList();
		}
	};
	
	$s.btnSearchOrgUserList = function(e) {
		if($s.orgSearchKeyword != '' && $s.orgSearchKeyword != undefined) {
			var reqInsaListAddrData = {
				LoginKey:$rs.userInfo.LoginKey,
				PageNumber:1,
				PageSize:20,
				SearchValue:$s.orgSearchKeyword
			};
			
			var addrParam = callApiObject('mail', 'mailAddressBook', reqInsaListAddrData);
			$http(addrParam).success(function(data) {
				var code = JSON.parse(data.Code);
				if(code == 1){
					var result = JSON.parse(data.value);
					setTimeout(function(){
						$s.$apply(function(){
							$s.search_org_addr_list = result.Users;
							$s.addrCnt = $s.search_org_addr_list.length;
						});
					}, 500);					
				}else{
					$s.addrCnt = 0;
				}
			});
			
			var reqInsaListOrganData = {
				LoginKey:$rs.userInfo.LoginKey,
				Search:$s.orgSearchKeyword
			};
			
			var organParam = callApiObject('insa', 'insaFind', reqInsaListOrganData);
			$http(organParam).success(function(data) {
				var code = JSON.parse(data.Code);
				if(code==1){
					var result = JSON.parse(data.value);
					
					console.log(result);
					
					setTimeout(function(){
						$s.$apply(function(){
							$s.search_org_user_list = result.Users;
							$s.organCnt = $s.search_org_user_list.length;
						});
					}, 500);					
				}else{
					$s.organCnt = 0;
				}
			}).then(function(){
				setTimeout(function(){
					if($s.addrCnt > 0 && $s.organCnt == 0){
						$s.$apply(function(){
							$s.tab_index = 0;
						});
					}else{
						$s.$apply(function(){
							$s.tab_index = 1;
						});					
					}
				},1000);
			});
		} 
	};
	
	$s.determineProfileImg = function(user) {
		var rtnUrl = '';
		
		if(user.MyPhotoUrl.indexOf('//https') != -1) {
			rtnUrl = 'https://' + user.MyPhotoUrl.substring(user.MyPhotoUrl.indexOf('//https')+10, user.MyPhotoUrl.length);
			try {
				$http.get(rtnUrl).error(function(data){
					user.MyPhotoUrl = '/resources/image/organization/org_user.png';
				});
			} catch(e) {
				user.MyPhotoUrl = '/resources/image/organization/org_user.png';
			}
		}else if(user.MyPhotoUrl.indexOf('http://') != -1) {
			rtnUrl = user.MyPhotoUrl.replace('http', 'https');
			user.MyPhotoUrl = rtnUrl;
		}else if(user.MyPhotoUrl == ''){
			user.MyPhotoUrl = '/resources/image/organization/org_user.png';
		}
	}
	
	$s.selectOrganUser = function(user) {
		var reqInsaUserData = {
			LoginKey:$rs.userInfo.LoginKey,
			UserKey:user.UserKey,
			CompanyCode:user.CompCode,
			EmailAddress:user.EmailAddress
		};
		
		var param = callApiObject('insa', 'insaUserDetail', reqInsaUserData);
		$http(param).success(function(data) {
			var result = JSON.parse(data.value);
			
			if(result.UserName == '') {
				result.UserName = user.UserName;
				result.CompName = user.CompName;
			}
			
			$s.selectedOrganUser = result;
			$s.determineProfileImg($s.selectedOrganUser);
		});
	}
	
	$s.closeOrganUserDialog = function(){
		$s.selectedOrganUser = undefined;
		$s.isProfileImgEnlarge = true;
	}
	
	$s.toggleProfileEnlarge = function() {
		$s.isProfileImgEnlarge = !$s.isProfileImgEnlarge;
	}
	
	// 전화걸기
	$s.doExecCallPhone = function(num) {
		if($rs.agent == 'android') {
			if(androidWebView != undefined) {
				androidWebView.callDial(num);
			} 
		} else if($rs.agent=='ios') {
			
		}
	}
	
	// SMS
	$s.doExecSMSPhone = function(num) {
		if($rs.agent == 'android') {
			if(androidWebView != undefined) {
				androidWebView.callSMSSend(num);
			} 
		} else if($rs.agent=='ios') {
			
		}
	}
	
	// 이메일
	$s.doExecEmail = function(user) {
		var arr = new Array();
		arr.push(user);
		
		$rs.$broadcast("mailApplySelectedUser", arr, new Array(), new Array());
		pushOnePage('pg_mail_write');
		
		$s.closeOrganUserDialog();
	}
	
	// 펼치기 접기
// $rs.btnExpandCollapse = function(obj){
// if(obj.isExpand != undefined) {
// obj.isExpand = !obj.isExpand;
// } else {
// obj.isExpand = false;
// }
// }
	
	// 현재 로그인한 아이디가 속한 부서와 사용자 찾기
	function recursiveOrganTree(dept, maxDepth, currDepth) {
//		console.log('currDepth : ',currDepth);
//		console.log('maxDepth : ',maxDepth);
//		console.log('dept : ',dept);
		
		if(currDepth < maxDepth) {
			setTimeout(function(){
				searchDept(dept.Depts[currDepth], currDepth, maxDepth);
				recursiveOrganTree(dept, maxDepth, ++currDepth);
			}, 100);
		} else {
			var code = dept.Users[0].DeptCode;
			switch(currDepth - 1) {
				case 0 : break;
				case 1 : $rs.selected_firstDepth_code = code; break;
				case 2 : $rs.selected_secondDepth_code = code; break;
				case 3 : $rs.selected_thirdDepth_code = code; break;
				case 4 : $rs.selected_fourthDepth_code = code; break;
			}
			setTimeout(function(){
				searchDept(dept.Depts[currDepth-1], currDepth, maxDepth);
			}, 100);
		}
	}
	
	// 조직도 수동으로 눌러서 찾기
	function searchDept(deptCode, depth, maxDepth) {
		
//		console.log('deptCode : ',deptCode);
//		console.log('depth : ',depth);
//		console.log('maxDepth',maxDepth);
		
		var reqInsaListData = {
			LoginKey:$rs.userInfo.LoginKey,
			DeptCode:deptCode.DeptCode,
			FindType:0
		};
		var param = callApiObject('insa', 'insaDeptChild', reqInsaListData);
		$http(param).success(function(data) {
			var result = JSON.parse(data.value);
			var dept = result.Depts;
			
			if(depth == maxDepth) {
				setTimeout(function(){
					$s.$apply(function(){
						$s.org_user_list = result.Users;
					});
					
					//2020.01.10 추가
					if(!$rs.isExpandOrganList){
						setTimeout(function(){
							$s.$apply(function(){
								var scrollHeight = $('.slideMenuMailList').prop('scrollHeight');
								$('.slideMenuMailList').scrollTop((scrollHeight/2) - 170); //조직도 스크롤 영역
							},50);
							$rs.isExpandOrganList = true;
						});
					}
					
				}, 200);
				
				$rs.snbCurrSelectedDeptCode = deptCode.DeptCode;
			}
			
			switch(depth) {
				case 0 :
					$rs.first_depth_list = dept;
					break;
				case 1 :
					$rs.second_depth_list = dept;
					$rs.selected_firstDepth_code = deptCode.DeptCode;
// //console.log($rs.selected_firstDepth_code);
					break;
				case 2 :
					$rs.third_depth_list = dept;
					$rs.selected_secondDepth_code = deptCode.DeptCode;
// //console.log($rs.selected_secondDepth_code);
					break;
				case 3 :
					$rs.fourth_depth_list = dept;
					$rs.selected_thirdDepth_code = deptCode.DeptCode;
// //console.log($rs.selected_thirdDepth_code);
					break;
				case 4 :
					$rs.fifth_depth_list = dept;
					$rs.selected_fourthDepth_code = deptCode.DeptCode;
// //console.log($rs.selected_fourthDepth_code);
					break;
				case 5 :
					$rs.sixth_depth_list = dept;
					break;
			} 
		});
	}
}]);

appHanmaru.controller('organAltController', ['$scope', '$http', '$rootScope', '$timeout', function($s, $http, $rs, $timeout) {
	$s.org_alt_user_list;
	$s.tab_index = 2;
	$s.search_org_user_list = new Array();
	$s.search_org_addr_list = new Array();
	$s.orgSearchKeyword;
	$s.selectedOrganUser;
	$s.isProfileImgEnlarge = true;
	$s.addrCnt = 0;
	$s.organCnt = 0;
	
	$rs.$on('initInsaAltList', function(event) {
		/*
		 * var reqInsaListData = { LoginKey:$rs.userInfo.LoginKey,
		 * DeptCode:$rs.userInfo.DeptCode, FindType:0 }; var param =
		 * callApiObject('insa', 'insaDeptChild', reqInsaListData);
		 * $http(param).success(function(data) { var result =
		 * JSON.parse(data.value); var dept = result.Depts;
		 * 
		 * setTimeout(function(){ $s.$apply(function(){ $s.org_alt_user_list =
		 * result.Users; }); //console.log($s.org_alt_user_list); }, 1000); });
		 */
		$s.tab_index = 2;
		$s.orgSearchKeyword = '';
		$s.search_org_user_list = undefined;
		
		var reqInsaListData = {
			LoginKey:$rs.userInfo.LoginKey
		};
		
		var param = callApiObject('insa', 'insaBoxs', reqInsaListData);
		$http(param).success(function(data) {
			var result = JSON.parse(data.value);
			$s.topDeptCode = result.Depts[0];
			//console.log(result);
			
			searchDept(result.Depts[0], 0);
			recursiveOrganTree(result, 0, result.Depts.length);
			$s.selected_deptCode = $rs.userInfo.DeptCode; 
		});
	});
	
	$s.findChildDept = function(dept, depth) {
		
		
		$s.selected_deptCode = dept.DeptCode;
		searchDept(dept, depth);
	}
	
	$s.selectOrgTab = function(index) {
		$s.tab_index = index;
	};
	
	$s.btnDetectSearch = function(e) {
		var keyCode = e.keyCode;
		if(keyCode == 13) {
			$s.btnSearchOrgUserList();
		}
	};
	
	// 조직도 임직원 / 주소록 검색 결과
	$s.btnSearchOrgUserList = function(e) {
		if($s.orgSearchKeyword != '' && $s.orgSearchKeyword != undefined) {
			var reqInsaListAddrData = {
				LoginKey:$rs.userInfo.LoginKey,
				PageNumber:1,
				PageSize:20,
				SearchValue:$s.orgSearchKeyword
			};
			
			var addrParam = callApiObject('mail', 'mailAddressBook', reqInsaListAddrData);
			$http(addrParam).success(function(data) {
				
				var code = JSON.parse(data.Code);
				if(code == 1){
					var result = JSON.parse(data.value);
					setTimeout(function(){
						$s.$apply(function(){
							$s.search_org_addr_list = result.Users;
							$s.addrCnt = $s.search_org_addr_list.length;
							
						});
					}, 500);					
				}else{
					$s.addrCnt = 0;
				}
				
			});
			var reqInsaListOrganData = {
				LoginKey:$rs.userInfo.LoginKey,
				Search:$s.orgSearchKeyword
			};
			
			var organParam = callApiObject('insa', 'insaFind', reqInsaListOrganData);
			$http(organParam).success(function(data) {
				var code = JSON.parse(data.Code);
				if(code==1){
					var result = JSON.parse(data.value);
					setTimeout(function(){
						$s.$apply(function(){
							$s.search_org_user_list = result.Users;
							$s.organCnt = $s.search_org_user_list.length;
						});
					}, 500);					
				}else{
					$s.organCnt = 0;
				}
			}).then(function(){
				setTimeout(function(){
					if($s.addrCnt > 0 && $s.organCnt == 0){
						$s.$apply(function(){
							$s.tab_index = 0;
						});
					}else{
						$s.$apply(function(){
							$s.tab_index = 1;
						});					
					}
				},1000);
			});
		} 
	};
	
	$s.determineProfileImg = function(user) {
		var rtnUrl = '';
		
		if(user.MyPhotoUrl.indexOf('//https') != -1) {
			rtnUrl = 'https://' + user.MyPhotoUrl.substring(user.MyPhotoUrl.indexOf('//https')+10, user.MyPhotoUrl.length);
			try {
				$http.get(rtnUrl).error(function(data){
					// console.log(data);
					user.MyPhotoUrl = '/resources/image/organization/org_user.png';
				});
			} catch(e) {
				user.MyPhotoUrl = '/resources/image/organization/org_user.png';
			}
		} else if(user.MyPhotoUrl.indexOf('http://') != -1) {
			rtnUrl = user.MyPhotoUrl.replace('http', 'https');
			user.MyPhotoUrl = rtnUrl;
		}else if(user.MyPhotoUrl == ''){
			user.MyPhotoUrl = '/resources/image/organization/org_user.png';
		}
	}
	
	$s.selectOrganUser = function(user) {
		var reqInsaUserData = {
			LoginKey:$rs.userInfo.LoginKey,
			UserKey:user.UserKey,
			CompanyCode:user.CompCode,
			EmailAddress:user.EmailAddress
		};
		
		var param = callApiObject('insa', 'insaUserDetail', reqInsaUserData);
		$http(param).success(function(data) {
			var result = JSON.parse(data.value);

			if(result.UserName == '') {
				result.UserName = user.UserName;
				result.CompName = user.CompName;
			}
			
			$s.selectedOrganUser = result;
			
			$s.determineProfileImg($s.selectedOrganUser);
		});
	}
	
	$s.closeOrganUserDialog = function(){
		$s.selectedOrganUser = undefined;
		$s.isProfileImgEnlarge = true;
	}
	
	$s.toggleProfileEnlarge = function() {
		$s.isProfileImgEnlarge = !$s.isProfileImgEnlarge;
	}
	
	// 전화걸기
	$s.doExecCallPhone = function(num) {
		if($rs.agent == 'android') {
			if(androidWebView != undefined) {
				androidWebView.callDial(num);
			} 
		} else if($rs.agent=='ios') {
			
		}
	}
	
	// SMS
	$s.doExecSMSPhone = function(num) {
		if($rs.agent == 'android') {
			if(androidWebView != undefined) {
				androidWebView.callSMSSend(num);
			} 
		} else if($rs.agent=='ios') {
			
		}
	}
	
	// 이메일
	$s.doExecEmail = function(email) {
		$s.arr_selected_rcv.push(email);
		
		$rs.$broadcast("mailApplySelectedUser", $s.arr_selected_rcv, new Array(), new Array());
		var currPage = angular.element('[class^="panel"][class*="current"]');
		var pageName = currPage.eq(currPage.length-1).attr('id');
		popPage(pageName);
		
		$s.closeOrganUserDialog();
	}
	
	
	// 현재 로그인한 아이디가 속한 부서와 사용자 찾기
	function recursiveOrganTree(dept, currDepth, maxDepth) {
		if(currDepth < maxDepth) {
			setTimeout(function(){
				searchDept(dept.Depts[currDepth], currDepth);
				recursiveOrganTree(dept, ++currDepth, maxDepth);
			},100);
		} else {
			var code = dept.Users[0].DeptCode;
			switch(currDepth - 1) {
				case 0 : break;
				case 1 : $rs.selected_firstDepth_code = code; break;
				case 2 : $rs.selected_secondDepth_code = code; break;
				case 3 : $rs.selected_thirdDepth_code = code; break;
				case 4 : $rs.selected_fourthDepth_code = code; break;
			}
			setTimeout(function(){
				searchDept(dept.Depts[currDepth-1], currDepth, maxDepth);
			}, 100);
		}
	}
	
	// 조직도 수동으로 눌러서 찾기
	function searchDept(deptCode, currDepth) {
		var reqInsaListData = {
			LoginKey:$rs.userInfo.LoginKey,
			DeptCode:deptCode.DeptCode,
			FindType:0
		};
		
		var param = callApiObject('insa', 'insaDeptChild', reqInsaListData);
		$http(param).success(function(data) {
			var result = JSON.parse(data.value);
			var dept = result.Depts;
			
			console.log(result);
			console.log(dept);
			
			if(dept.length > 0) {
				switch(currDepth) {
					case 0 :
						$s.first_depth_list = dept;
// $s.org_first_alt_user_list = result.Users;
						break;
					case 1 :
						$s.second_depth_list = dept;
						$s.selected_firstDepth_code = deptCode.DeptCode;
	// //console.log($s.selected_firstDepth_code);
						break;
					case 2 :
						$s.third_depth_list = dept;
						$s.selected_secondDepth_code = deptCode.DeptCode;
	// //console.log($s.selected_secondDepth_code);
						break;
					case 3 :
						$s.fourth_depth_list = dept;
						$s.selected_thirdDepth_code = deptCode.DeptCode;
	// //console.log($s.selected_thirdDepth_code);
						break;
					case 4 :
						$s.fifth_depth_list = dept;
						$s.selected_fourthDepth_code = deptCode.DeptCode;
	// //console.log($s.selected_fourthDepth_code);
						break;
					case 5 :
						$s.sixth_depth_list = dept;
						break;
				}
				
				$s.org_alt_user_list = result.Users;
			} else {
				$s.org_alt_user_list = result.Users;
			}
			
			// console.log($s.org_alt_user_list);
		});
	}

	$s.isUserDeptSelected = false;
	$s.userDeptSelectType = '';
	$s.rcv_count = 0;
	$s.cc_count = 0;
	$s.bcc_count = 0;
	$s.arr_selected_rcv = new Array();
	$s.arr_selected_cc = new Array();
	$s.arr_selected_bcc = new Array();
	$s.arr_selected_userDept = new Array();
	
	$s.userDeptChecked = function(obj) {
		return $s.arr_selected_userDept.indexOf(obj) != -1 ? true : false;
	}
	
	$s.toggleUserDeptChecked = function(type, obj){
		if(type === 'dept') {
			var addr = obj.Address;
			if($s.arr_selected_userDept.indexOf(obj) != -1) {
				$s.arr_selected_userDept.splice($s.arr_selected_userDept.indexOf(obj), 1);
			} else {
				$s.arr_selected_userDept.push(obj);
			}
		} else if(type === 'user'){
			var addr = obj.EmailAddress;
			if($s.arr_selected_userDept.indexOf(obj) != -1) {
				$s.arr_selected_userDept.splice($s.arr_selected_userDept.indexOf(obj), 1);
			} else {
				$s.arr_selected_userDept.push(obj);
			}
		}
	}
	
	$s.btnAddRcvUserList = function(e) {
		if($s.arr_selected_userDept.length == 0) {
			$s.isUserDeptSelected = true;
			$s.selectedDialogName = '받는 사람';
			$s.userDeptSelectType = 'rcv';
		} else {
			$s.isUserDeptSelected = true;
			$s.selectedDialogName = '받는 사람';
			$s.userDeptSelectType = 'rcv';
			
			for(idx in $s.arr_selected_userDept) {
				var userDept = $s.arr_selected_userDept[idx];
				
				if($s.arr_selected_rcv.indexOf(userDept) == -1) {
					$s.arr_selected_rcv.push(userDept);
				} else {
					continue;
				}
			}
			
			$s.rcv_count = $s.arr_selected_rcv.length;
			$s.arr_selected_userDept.splice(0, $s.arr_selected_userDept.length);
		}
	}
	
	$s.btnAddCCUserList = function(e) {
		if($s.arr_selected_userDept.length == 0) {
			$s.isUserDeptSelected = true;
			$s.selectedDialogName = '참조';
			$s.userDeptSelectType = 'cc';
		} else {
			$s.isUserDeptSelected = true;
			$s.selectedDialogName = '참조';
			$s.userDeptSelectType = 'cc';
			
			for(idx in $s.arr_selected_userDept) {
				var userDept = $s.arr_selected_userDept[idx];
				if($s.arr_selected_cc.indexOf(userDept) == -1) {
					$s.arr_selected_cc.push(userDept);
				} else {
					continue;
				}
			}
			$s.cc_count = $s.arr_selected_cc.length;
			$s.arr_selected_userDept.splice(0, $s.arr_selected_userDept.length);
		}
	}
	
	$s.btnAddBCCUserList = function(e) {
		if($s.arr_selected_userDept.length == 0) {
			$s.isUserDeptSelected = true;
			$s.selectedDialogName = '숨은 참조';
			$s.userDeptSelectType = 'bcc';
		} else {
			$s.isUserDeptSelected = true;
			$s.selectedDialogName = '숨은 참조';
			$s.userDeptSelectType = 'bcc';
			

			for(idx in $s.arr_selected_userDept) {
				var userDept = $s.arr_selected_userDept[idx];

				// console.log(userDept);
				
				if($s.arr_selected_bcc.indexOf(userDept) == -1) {
					$s.arr_selected_bcc.push(userDept);
				} else {
					continue;
				}
			}
			
			$s.bcc_count = $s.arr_selected_bcc.length;
			$s.arr_selected_userDept.splice(0, $s.arr_selected_userDept.length);
		}
	}
	
	$s.btnCloseSelectedDialog = function(e) {
		$s.isUserDeptSelected = false;
	}
	
	$s.btnRemoveRCV = function(index) {
		$s.arr_selected_rcv.splice(index, 1);
		$s.rcv_count = $s.arr_selected_rcv.length;
	}
	
	$s.btnRemoveCC = function(index) {
		$s.arr_selected_cc.splice(index, 1);
		$s.cc_count = $s.arr_selected_cc.length;
	}
	
	$s.btnRemoveBCC = function(index) {
		$s.arr_selected_bcc.splice(index, 1);
		$s.bcc_count = $s.arr_selected_bcc.length;
	}
	
	$s.btnApplySelectedUser = function(e){
		$rs.$broadcast("mailApplySelectedUser", $s.arr_selected_rcv, $s.arr_selected_cc, $s.arr_selected_bcc);
		var currPage = angular.element('[class^="panel"][class*="current"]');
		var pageName = currPage.eq(currPage.length-1).attr('id');
		popPage(pageName);
		
		$s.rcv_count = 0;
		$s.cc_count = 0;
		$s.bcc_count = 0;
		$s.arr_selected_rcv.splice(0, $s.arr_selected_rcv.length);
		$s.arr_selected_cc.splice(0, $s.arr_selected_cc.length);
		$s.arr_selected_bcc.splice(0, $s.arr_selected_bcc.length);
		$s.arr_selected_userDept.splice(0, $s.arr_selected_userDept.length);
	}
	
	$s.popPage = function(){
		$rs.$broadcast("mailApplySelectedUser", $s.arr_selected_rcv, $s.arr_selected_cc, $s.arr_selected_bcc);
		var currPage = angular.element('[class^="panel"][class*="current"]');
		var pageName = currPage.eq(currPage.length-1).attr('id');
		popPage('pg_insa_list_alt');
		
		$s.rcv_count = 0;
		$s.cc_count = 0;
		$s.bcc_count = 0;
		$s.addrCnt = 0;
		$s.organCnt = 0;
	}
}]);