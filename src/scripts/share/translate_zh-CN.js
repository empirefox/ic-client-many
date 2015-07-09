'use strict';

angular.module('app.i18n.zh_CN', ['pascalprecht.translate']).config(['$translateProvider',
  function($translateProvider) {
    $translateProvider.translations('zh_CN', {
      MENU: '菜单',
      BTN: {
        OK: '确定',
        RESET: '重置',
        NO: '取消'
      },
      PAGE_NAME: {
        HOME: '首页',
        ROOMS: '我的监控室',
        JOIN: '加入监控室',
        REG_ROOM: '注册本地监控室',
        LOGIN: '登录',
        LOGOUT: '退出'
      },
      PAGE: {
        REG_ROOM: {
          DESC: '注册本地监控室到云中心',
          NO_RUNNING_CLIENT: '本地没有运行监控室!',
          ENTER_ROOM_NAME: '本地监控室正在运行, 为监控室命名:'
        },
        LOGIN: {
          DESC: '请选择登录方式',
          OAUTH: {
            QQ: '使用QQ账户登录',
            BAIDU: '使用百度账户登录',
            WEIBO: '使用微博账户登录',
            MOCK: '使用Mock账户登录'
          }
        },
        JOIN: {
          DESC: '加入已有监控室',
          INVITE_CODE: '邀请码',
          FORM: {
            ENTER_ROOM: '填写监控室标志:',
            ENTER_CODE: '填写邀请码:',
            ROOM: '监控室标志:',
            CODE: '邀请码:',
            URL: '邀请链接'
          }
        },
        ROOMS: {
          OPEN_SET_ROOM: '设置监控室名称',
          OPEN_INVITE_CODE: '邀请',
          OPEN_SET_CAM: '设置摄像头',
          CAM: {
            PLAY: '播放',
            STOP: '停止'
          },
          SET_ROOM: {
            TITLE: '设置监控室名称',
            OLD_NAME_IS: '旧的名称: ',
            NEW_NAME: '填写新的名称:'
          },
          SET_IPCAM: {
            TITLE: '编辑摄像头',
            NAME: '名称',
            URL: '监控室连接摄像头的url',
            TURN_OFF: '关闭状态',
          },
          CHAT: {
            OPEN: '发送消息到监控室'
          }
        }
      }
    });
  }
]);
