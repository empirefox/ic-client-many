'use strict';

angular.module('app.i18n.en_US', ['pascalprecht.translate']).config(['$translateProvider',
  function($translateProvider) {
    $translateProvider.translations('en_US', {
      MENU: 'Menu',
      BTN: {
        OK: 'OK',
        RESET: 'Reset',
        NO: 'Cancel',
      },
      NAVBAR: {
        LANG: 'Language',
        EN_US: 'English',
        ZH_CN: '中文',
      },
      PAGE_NAME: {
        INDEX: 'Home',
        ROOMS: 'My rooms',
        JOIN: 'Join room',
        REG_ROOM: 'Register local room',
        LOGIN: 'Login',
        LOGOUT: 'Logout',
        LOGOFF: 'Destory Account',
      },
      PAGE: {
        REG_ROOM: {
          DESC: 'Register your local running room client to cloud',
          NO_RUNNING_CLIENT: 'There is no running room client!',
          ENTER_ROOM_NAME: 'Local room found, enter the room name here:',
        },
        LOGIN: {
          DESC: 'Choose your favorite login site',
          OAUTH: {
            QQ: 'Login with QQ',
            BAIDU: 'Login with Baidu',
            WEIBO: 'Login with Weibo',
            MOCK: 'Login with Mock',
          }
        },
        JOIN: {
          DESC: 'Join an exist room',
          INVITE_CODE: 'Invite code',
          FORM: {
            ENTER_ROOM: 'Enter the room id:',
            ENTER_CODE: 'Enter the invite code:',
            ROOM: 'Room:',
            CODE: 'Code:',
            URL: 'Full Url',
          }
        },
        ROOMS: {
          OPEN_SET_ROOM: 'Set room name',
          OPEN_INVITE_CODE: 'Share with friend',
          OPEN_SET_CAM: 'Manage camera',
          CAM: {
            PLAY: 'Play',
            STOP: 'Stop',
          },
          SET_ROOM: {
            TITLE: 'Set room name',
            OLD_NAME_IS: 'Old name is: ',
            NEW_NAME: 'Enter the new room name:',
          },
          SET_IPCAM: {
            TITLE: 'Edit the ipcam',
            NAME: 'Name',
            URL: 'Url',
            TURN_OFF: 'Turn off',
          },
          CHAT: {
            OPEN: 'Send message to room',
          },
        },
        INDEX: {
          DESC: 'Home Page',
          START: 'Start Now!',
          BROWSER_TIP: 'These browsers will give you comfortable experience',
          DOWNLOAD: 'Download',
          FIREFOX: 'Mozilla Firefox',
          CHROME: 'Google Chrome',
        },
        LOGOFF: {
          CONFIRM: 'Need Confirm to Destroy Your Account',
          WARNING: 'Very Dangerous!',
          MESSAGE: 'All data will be deleted permanently, when your continue this action.'
        },
      },
    });
  }
]);
