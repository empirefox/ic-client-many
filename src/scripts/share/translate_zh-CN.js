'use strict';

angular.module('app.i18n.zh_CN', ['pascalprecht.translate']).constant('I18nZhCN', {
  MENU: '菜单',
  BTN: {
    OK: '确定',
    RESET: '重置',
    NO: '取消',
  },
  NAVBAR: {
    LANG: '语言',
    EN_US: 'English',
    ZH_CN: '中文',
  },
  PAGE_NAME: {
    INDEX: '首页',
    ROOMS: '我的监控室',
    JOIN: '加入监控室',
    REG_ROOM: '注册本地监控室',
    LOGIN: '登录',
    LOGOUT: '退出',
    LOGOFF: '销毁账号',
    DOWNLOAD: '下载',
  },
  PAGE: {
    REG_ROOM: {
      DESC: '注册本地监控室到云中心',
      NO_RUNNING_CLIENT: '本地没有运行监控室',
      ENTER_ROOM_NAME: '本地监控室正在运行, 为监控室命名:',
    },
    LOGIN: {
      TITLE: '登录',
      OAUTH: {
        douban: '使用豆瓣账户登录',
        qq: '使用QQ账户登录',
        baidu: '使用百度账户登录',
        weibo: '使用微博账户登录',
        mock: '使用Mock账户登录',
        facebook: '使用Facebook账户登录',
        google: '使用Google账户登录',
        github: '使用GitHub账户登录',
        instagram: '使用Instagram账户登录',
        linkedin: '使用LinkedIn账户登录',
        twitter: '使用Twitter账户登录',
        live: '使用Live账户登录',
        yahoo: '使用Yahoo账户登录',
      },
    },
    JOIN: {
      DESC: '加入已有监控室',
      INVITE_CODE: '邀请码（5分钟内有效）',
      FORM: {
        ENTER_CODE: '填写邀请码:',
        CODE: '邀请码:',
        URL: '邀请链接',
      },
    },
    ROOMS: {
      OPEN_SET_ROOM: '设置监控室名称',
      OPEN_DEL_ROOM: '移除监控室',
      OPEN_INVITE_CODE: '邀请',
      OPEN_SET_CAM: '设置摄像头',
      OPEN_NEW_IPCAM: '添加摄像头',
      OPEN_DEL_CAM: '删除',
      CAM: {
        PLAY: '播放',
        STOP: '停止',
      },
      SET_ROOM: {
        TITLE: '设置监控室名称',
        OLD_NAME_IS: '旧的名称: ',
        NEW_NAME: '填写新的名称:',
      },
      DEL_ROOM: {
        TITLE: '删除监控室',
        WARNING: '您确定要删除吗?',
      },
      SET_IPCAM: {
        TITLE: '编辑摄像头',
        ID: '名称',
        URL: '监控室连接摄像头的url',
        AUDIO_OFF: '关闭音频',
        TURN_OFF: '关闭摄像头',
      },
      NEW_IPCAM: {
        TITLE: '添加新的摄像头',
      },
      DEL_IPCAM: {
        TITLE: '删除摄像头',
        WARNING: '您确定要删除吗?',
      },
      CHAT: {
        OPEN: '发送消息到监控室',
      },
    },
    INDEX: {
      SITE_NAME: '云监控中心',
      SITE_DESC: '专注家庭监控整合',
      START: '开始体验!',
      UNSUPPORTED: '您的浏览器有点不给力，请使用以下浏览器:',
      FIREFOX: 'Mozilla Firefox(>=39) | 火狐浏览器',
      CHROME: 'Google Chrome(>=44) | 谷歌浏览器',
      OPERA: 'Opera(>=31) | 欧朋浏览器',
      FEATURE: {
        FREE: '免费',
        SECURE: '安全',
        EASY: '易用',
      },
    },
    LOGOFF: {
      CONFIRM: '需要确认才能销毁您的账户',
      WARNING: '非常危险!',
      MESSAGE: '当您继续操作后，您的所有数据将永久删除.'
    },
    DOWNLOAD: {
      DESC: '当前仅提供linux平台客户端，其它平台客户端稍后提供. 欢迎提出建议到empirefox@gmail.com',
      PUB_TIME: '发布时间',
      BIT: '位',
      OS: '操作系统',
    },
  }
}).config(['$translateProvider', 'I18nZhCN',
  function($translateProvider, I18nZhCN) {
    $translateProvider.translations('zh_CN', I18nZhCN);
  }
]);
