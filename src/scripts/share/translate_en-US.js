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
        DOWNLOAD: 'Download',
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
          INVITE_CODE: 'Invite code(Valid in 5 minutes)',
          FORM: {
            ENTER_CODE: 'Enter the invite code:',
            CODE: 'Code:',
            URL: 'Full Url',
          }
        },
        ROOMS: {
          OPEN_SET_ROOM: 'Set room name',
          OPEN_DEL_ROOM: 'Delete room',
          OPEN_INVITE_CODE: 'Share with friend',
          OPEN_SET_CAM: 'Manage camera',
          OPEN_NEW_IPCAM: 'New Camera',
          OPEN_DEL_CAM: 'Delete',
          CAM: {
            PLAY: 'Play',
            STOP: 'Stop',
          },
          SET_ROOM: {
            TITLE: 'Set room name',
            OLD_NAME_IS: 'Old name is: ',
            NEW_NAME: 'Enter the new room name:',
          },
          DEL_ROOM: {
            TITLE: 'Delete Room',
            WARNING: 'Are you sure deleting this Room?',
          },
          SET_IPCAM: {
            TITLE: 'Edit the ipcam',
            ID: 'Id',
            URL: 'Url',
            AUDIO_OFF: 'Audio off',
            TURN_OFF: 'Camera off',
          },
          NEW_IPCAM: {
            TITLE: 'Add new ipcam',
          },
          DEL_IPCAM: {
            TITLE: 'Delete ipcam',
            WARNING: 'Are you sure deleting this camera?',
          },
          CHAT: {
            OPEN: 'Send message to room',
          },
        },
        INDEX: {
          SITE_NAME: 'GogogoCam',
          SITE_DESC: 'Focus on home monitoring integration',
          START: 'Start Now!',
          UNSUPPORTED: 'Your browser is old and does not support our feathure. Please use the ones list below:',
          FIREFOX: 'Mozilla Firefox(>=39)',
          CHROME: 'Google Chrome(>=44)',
          OPERA: 'Opera(>=31)',
          FEATURE: {
            FREE: 'Free',
            SECURE: 'Secure',
            EASY: 'Easy',
          },
        },
        LOGOFF: {
          CONFIRM: 'Need Confirm to Destroy Your Account',
          WARNING: 'Very Dangerous!',
          MESSAGE: 'All data will be deleted permanently, when your continue this action.'
        },
        DOWNLOAD: {
          DESC: 'Only linux client provided now. Welcome any suggest to empirefox@gmail.com',
          PUB_TIME: 'Publish Time',
          BIT: 'bit',
          OS: 'Operation System',
        },
      },
    });
  }
]);
