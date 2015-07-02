'use strict';

angular.module('app.i18n', ['pascalprecht.translate']).config(['$translateProvider',
function($translateProvider) {
	$translateProvider.translations('en_US', {
		MENU : 'Menu',
		BTN : {
			OK : 'OK',
			RESET : 'Reset',
			NO : 'Cancel'
		},
		PAGE_NAME : {
			HOME : 'Home',
			ROOMS : 'My rooms',
			JOIN : 'Join room',
			REG_ROOM : 'Register local room',
			LOGIN : 'Login',
			LOGOUT : 'Logout'
		},
		PAGE : {
			REG_ROOM : {
				DESC : 'Register your local running room client to cloud',
				NO_RUNNING_CLIENT : 'There is no running room client!',
				ENTER_ROOM_NAME : 'Local room found, enter the room name here:'
			},
			LOGIN : {
				DESC : 'Choose your favorite login site',
				OAUTH : {
					QQ : 'QQ',
					BAIDU : 'Baidu',
					WEIBO : 'Weibo',
					MOCK : 'Mock'
				}
			},
			JOIN : {
				DESC : 'Join an exist room',
				INVITE_CODE : 'Invite code',
				FORM : {
					ENTER_ROOM : 'Enter the room id:',
					ENTER_CODE : 'Enter the invite code:',
					ROOM : 'Room:',
					CODE : 'Code:',
					URL : 'Full Url'
				}
			},
			ROOMS : {
				OPEN_SET_ROOM : 'Set room name',
				OPEN_INVITE_CODE : 'Share with friend',
				OPEN_SET_CAM : 'Manage camera',
				CAM : {
					PLAY : 'Play'
				},
				SET_ROOM : {
					TITLE : 'Set room name',
					OLD_NAME_IS : 'Old name is: ',
					NEW_NAME : 'Enter the new room name:'
				},
				SET_IPCAM : {
					TITLE : 'Edit the ipcam',
					NAME : 'Name',
					URL : 'Url',
					TURN_OFF : 'Turn off',
				},
				CHAT : {
					OPEN : 'Send message to room'
				}
			}
		}
	});
	$translateProvider.preferredLanguage('en_US');
}]);
