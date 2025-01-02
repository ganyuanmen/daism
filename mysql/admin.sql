/*
 Navicat Premium Data Transfer

 Source Server         : mysql
 Source Server Type    : MySQL
 Source Server Version : 80025
 Source Host           : localhost:3306
 Source Schema         : dao_db

 Target Server Type    : MySQL
 Target Server Version : 80025
 File Encoding         : 65001

 Date: 02/01/2025 09:28:17
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for a_account
-- ----------------------------
DROP TABLE IF EXISTS `a_account`;
CREATE TABLE `a_account`  (
  `id` int(0) UNSIGNED NOT NULL AUTO_INCREMENT,
  `block_num` bigint(0) NULL DEFAULT NULL COMMENT '用于对比更新最后的',
  `dao_id` int(0) NULL DEFAULT NULL,
  `actor_name` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '昵称(组帐是对应代币名称)',
  `domain` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '域名',
  `manager` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '管理员地址/个人帐号是钱包地址',
  `pubkey` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '公钥',
  `privkey` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '私钥',
  `actor_account` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '社交帐号@表示',
  `actor_url` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '社交帐号url 表示',
  `avatar` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'https://daism.io/logo.svg' COMMENT '头像地址/组帐号是logo',
  `actor_desc` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '帐号描述/组帐号是dao描述',
  `createtime` char(19) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '注册时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `acount`(`actor_account`) USING BTREE,
  UNIQUE INDEX `block_num`(`block_num`) USING BTREE,
  UNIQUE INDEX `manager`(`dao_id`, `manager`) USING BTREE,
  UNIQUE INDEX `actor_url`(`actor_url`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for a_bookmark
-- ----------------------------
DROP TABLE IF EXISTS `a_bookmark`;
CREATE TABLE `a_bookmark`  (
  `pid` int(0) NOT NULL COMMENT '发文ID',
  `account` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '收藏人帐号',
  PRIMARY KEY (`account`, `pid`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for a_bookmarksc
-- ----------------------------
DROP TABLE IF EXISTS `a_bookmarksc`;
CREATE TABLE `a_bookmarksc`  (
  `pid` int(0) NOT NULL COMMENT '发文ID',
  `account` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '收藏帐号',
  PRIMARY KEY (`account`, `pid`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for a_domain
-- ----------------------------
DROP TABLE IF EXISTS `a_domain`;
CREATE TABLE `a_domain`  (
  `id` int(0) UNSIGNED NOT NULL AUTO_INCREMENT,
  `daomain` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '域名',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for a_eip_type
-- ----------------------------
DROP TABLE IF EXISTS `a_eip_type`;
CREATE TABLE `a_eip_type`  (
  `id` int(0) UNSIGNED NOT NULL AUTO_INCREMENT,
  `type_name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT 'smart common 类型名称',
  `type_desc` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '类型描述',
  `_time` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
  `relay_type` tinyint(0) NULL DEFAULT NULL COMMENT '1 链上确认',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `type_name`(`type_name`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for a_follow
-- ----------------------------
DROP TABLE IF EXISTS `a_follow`;
CREATE TABLE `a_follow`  (
  `id` int(0) UNSIGNED NOT NULL AUTO_INCREMENT,
  `follow_id` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '关注ID 唯一',
  `actor_account` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '被关注帐号',
  `actor_url` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '被关注url',
  `actor_inbox` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '被关注信箱',
  `actor_avatar` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '被关注头像',
  `user_account` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '主动关注帐号',
  `user_url` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '主动关注帐号url',
  `user_avatar` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '主动关注者头像',
  `user_inbox` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '主动关注者信箱',
  `createtime` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `follow_id`(`follow_id`) USING BTREE,
  UNIQUE INDEX `idd`(`actor_account`, `user_account`) USING BTREE,
  INDEX `user_account`(`user_account`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for a_heart
-- ----------------------------
DROP TABLE IF EXISTS `a_heart`;
CREATE TABLE `a_heart`  (
  `pid` int(0) NOT NULL COMMENT '发文ID',
  `account` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '点赞人',
  PRIMARY KEY (`account`, `pid`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for a_heartsc
-- ----------------------------
DROP TABLE IF EXISTS `a_heartsc`;
CREATE TABLE `a_heartsc`  (
  `pid` int(0) NOT NULL COMMENT '发文ID',
  `account` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '点赞人',
  PRIMARY KEY (`account`, `pid`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for a_message
-- ----------------------------
DROP TABLE IF EXISTS `a_message`;
CREATE TABLE `a_message`  (
  `id` int(0) UNSIGNED NOT NULL AUTO_INCREMENT,
  `message_id` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '发送/接收r的发文ID,唯一',
  `manager` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '钱包地址(接收推送也要有)',
  `actor_name` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '昵称',
  `avatar` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '头像',
  `actor_account` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '创建/发送帐号',
  `actor_url` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '创建/发送帐号',
  `actor_inbox` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '帐号邮箱',
  `link_url` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '链接url',
  `title` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '标题',
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '内容',
  `is_send` tinyint(0) NULL DEFAULT 1 COMMENT '允许推送给关注组',
  `is_discussion` tinyint(0) NULL DEFAULT 1 COMMENT '允许评论',
  `top_img` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '头部图片url地址',
  `receive_account` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '',
  `send_type` tinyint(0) NULL DEFAULT 0 COMMENT '0 本地，1 推送 2 @',
  `createtime` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
  `reply_time` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
  `vedio_url` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `account_at` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `property_index` tinyint(0) NULL DEFAULT 1,
  `type_index` tinyint(0) NULL DEFAULT 1,
  `content_link` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `total` int(0) NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `message_id`(`message_id`, `receive_account`) USING BTREE,
  INDEX `actor_account`(`actor_account`) USING BTREE,
  INDEX `send_type`(`send_type`, `receive_account`) USING BTREE,
  INDEX `receive_account`(`receive_account`) USING BTREE,
  INDEX `dao_id`(`send_type`, `property_index`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for a_message_commont
-- ----------------------------
DROP TABLE IF EXISTS `a_message_commont`;
CREATE TABLE `a_message_commont`  (
  `id` int(0) UNSIGNED NOT NULL AUTO_INCREMENT,
  `pid` int(0) UNSIGNED NULL DEFAULT NULL COMMENT '父ID',
  `message_id` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '回复/接收r的发文ID,唯一',
  `manager` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '钱包地址',
  `actor_name` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '昵称',
  `avatar` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '头像',
  `actor_account` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '创建/发送帐号',
  `actor_url` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '创建/发送帐号',
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '内容',
  `createtime` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
  `type_index` tinyint(0) NULL DEFAULT 0 COMMENT '0 短，1长',
  `vedio_url` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `top_img` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `content_link` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `ppid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `message_id`(`message_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for a_messagesc
-- ----------------------------
DROP TABLE IF EXISTS `a_messagesc`;
CREATE TABLE `a_messagesc`  (
  `id` int(0) UNSIGNED NOT NULL AUTO_INCREMENT,
  `actor_id` int(0) NULL DEFAULT 0 COMMENT '发布帐号ID',
  `dao_id` bigint(0) NULL DEFAULT 0,
  `title` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '标题',
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '内容',
  `is_send` tinyint(0) NULL DEFAULT 1 COMMENT '允许推送给关注组',
  `is_discussion` tinyint(0) NULL DEFAULT 1 COMMENT '允许评论',
  `top_img` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '头部图片url地址',
  `start_time` datetime(0) NULL DEFAULT NULL COMMENT '活动的开始时间',
  `end_time` datetime(0) NULL DEFAULT NULL COMMENT '活动的结束时间',
  `event_url` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '活动网站主页',
  `event_address` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '活动地址',
  `time_event` tinyint(0) NULL DEFAULT -1 COMMENT '活动定时活动,星期几',
  `_type` tinyint(0) NULL DEFAULT 0 COMMENT '0:普通 1:活动',
  `reply_time` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '回复时间，用于排序',
  `createtime` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
  `message_id` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `vedio_url` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `account_at` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `property_index` tinyint(0) NULL DEFAULT 1,
  `type_index` tinyint(0) NULL DEFAULT 1,
  `content_link` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `total` int(0) NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `_type`(`_type`) USING BTREE,
  INDEX `dao_id`(`dao_id`) USING BTREE,
  INDEX `reply_time`(`reply_time`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for a_messagesc_commont
-- ----------------------------
DROP TABLE IF EXISTS `a_messagesc_commont`;
CREATE TABLE `a_messagesc_commont`  (
  `id` int(0) UNSIGNED NOT NULL AUTO_INCREMENT,
  `pid` int(0) UNSIGNED NULL DEFAULT NULL COMMENT '父ID',
  `message_id` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '回复/接收r的发文ID,唯一',
  `manager` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '钱包地址',
  `actor_name` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '昵称',
  `avatar` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '头像',
  `actor_account` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '创建/发送帐号',
  `actor_url` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '创建/发送帐号',
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '内容',
  `createtime` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
  `type_index` tinyint(0) NULL DEFAULT 0 COMMENT '0 短，1长',
  `vedio_url` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `top_img` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `content_link` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `ppid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `message_id`(`message_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for aux_bt
-- ----------------------------
DROP TABLE IF EXISTS `aux_bt`;
CREATE TABLE `aux_bt`  (
  `d` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `t` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `f` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `s` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `w` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `rt` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`d`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of aux_bt
-- ----------------------------
INSERT INTO `aux_bt` VALUES ('dao', 'v_dao', '*', '', '1=1', '');
INSERT INTO `aux_bt` VALUES ('daotoken', 'v_daotoken', '*', NULL, '1=1', NULL);
INSERT INTO `aux_bt` VALUES ('dcview', 'v_discussion_commont', '*', NULL, '1=1', NULL);
INSERT INTO `aux_bt` VALUES ('discussions', 'v_discussion', '*', NULL, '1=1', NULL);
INSERT INTO `aux_bt` VALUES ('ecrview', 'v_events_reply', '*', NULL, '1=1', NULL);
INSERT INTO `aux_bt` VALUES ('ecview', 'v_events_commont', '*', NULL, '1=1', NULL);
INSERT INTO `aux_bt` VALUES ('events', 'v_events', '*', NULL, '1=1', NULL);
INSERT INTO `aux_bt` VALUES ('getutoken', 'v_getdaoutoken', '*', NULL, '1=1', NULL);
INSERT INTO `aux_bt` VALUES ('messagesc', 'v_messagesc', '*', NULL, '1=1', NULL);
INSERT INTO `aux_bt` VALUES ('messageview', 'v_message', '*', NULL, '1=1', NULL);
INSERT INTO `aux_bt` VALUES ('news', 'v_news', '*', NULL, '1=1', NULL);
INSERT INTO `aux_bt` VALUES ('pro', 'v_pro', '*', NULL, '1=1', NULL);
INSERT INTO `aux_bt` VALUES ('replyview', 'v_message_commont', '*', NULL, '1=1', NULL);
INSERT INTO `aux_bt` VALUES ('swap', 't_swap', '*', NULL, '1=1', NULL);

-- ----------------------------
-- Table structure for aux_tree
-- ----------------------------
DROP TABLE IF EXISTS `aux_tree`;
CREATE TABLE `aux_tree`  (
  `id` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `sqls` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `desc` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of aux_tree
-- ----------------------------
INSERT INTO `aux_tree` VALUES ('accountAr', 'select actor_name,avatar from a_account where dao_id=0 and domain=?', NULL);
INSERT INTO `aux_tree` VALUES ('actor', 'select id,dao_id,actor_name,domain,manager,actor_account,actor_url,avatar,actor_desc from a_account where manager=? and dao_id=0', '地址获帐号/dao_id=0是个人帐号');
INSERT INTO `aux_tree` VALUES ('actorbyid', 'select id,dao_id,actor_name,domain,manager,actor_account,actor_url,avatar,actor_desc from a_account where id=?', 'id 获个人帐号');
INSERT INTO `aux_tree` VALUES ('checkdao', 'SELECT a.id,b.dao_name,c.dao_symbol,d.creator FROM (SELECT 1 id) a LEFT JOIN (SELECT dao_name FROM t_dao WHERE dao_name=?) b ON 1=1 LEFT JOIN (SELECT dao_symbol FROM t_dao WHERE dao_symbol=?) c ON 1=1 LEFT JOIN (SELECT creator FROM t_dao WHERE creator=?) d ON 1=1', '检测dao 是否存在');
INSERT INTO `aux_tree` VALUES ('daoactor', 'SELECT a.*,b.actor_account,b.actor_url,b.domain FROM v_dao a LEFT JOIN a_account b ON a.dao_id=b.dao_id WHERE a.delegator IN(SELECT delegator FROM t_daodetail WHERE member_address=?)', '地址->所在的智能化器');
INSERT INTO `aux_tree` VALUES ('daoactorbyid', 'SELECT a.*,b.actor_account,b.actor_url,b.domain FROM v_dao a LEFT JOIN a_account b ON a.dao_id=b.dao_id WHERE a.delegator IN(SELECT delegator FROM t_daodetail WHERE member_address=(SELECT manager FROM a_account WHERE id=?))', 'id->所在智能公器');
INSERT INTO `aux_tree` VALUES ('daodatabyid', 'SELECT a.*,b.actor_account,b.actor_url,b.domain FROM v_dao a LEFT JOIN a_account b ON a.dao_id=b.dao_id WHERE a.dao_id=?', NULL);
INSERT INTO `aux_tree` VALUES ('daomember', 'SELECT a.member_address,b.actor_url,b.actor_account,b.avatar FROM t_daodetail a LEFT JOIN (SELECT * FROM a_account WHERE dao_id=0) b ON a.`member_address`=b.manager WHERE a.dao_id=?', 'dao 下所有成员');
INSERT INTO `aux_tree` VALUES ('fllower', 'SELECT user_account account,user_url url,user_avatar avatar,user_inbox inbox,createtime,follow_id,id FROM v_follow WHERE actor_account=(SELECT actor_account FROM a_account WHERE dao_id=?)', '按daoid 找谁关注我');
INSERT INTO `aux_tree` VALUES ('follow0', 'SELECT actor_account account,actor_url url,actor_avatar avatar,actor_inbox inbox,createtime,follow_id,id FROM v_follow WHERE user_account=?', '我关注了谁集合');
INSERT INTO `aux_tree` VALUES ('follow1', 'SELECT user_account account,user_url url,user_avatar avatar,user_inbox inbox,createtime,follow_id,id FROM v_follow WHERE actor_account=?', '谁关注了我集合');
INSERT INTO `aux_tree` VALUES ('getFollow', 'select actor_account from a_follow where user_account=?', NULL);
INSERT INTO `aux_tree` VALUES ('getnft', 'select count(*) as total from t_nft_transfer', NULL);
INSERT INTO `aux_tree` VALUES ('minttime', 'SELECT TIMESTAMPDIFF(MINUTE, in_time, NOW()) AS minttime FROM t_nft_transfer ORDER BY in_time LIMIT 1', NULL);

-- ----------------------------
-- Table structure for t_ad
-- ----------------------------
DROP TABLE IF EXISTS `t_ad`;
CREATE TABLE `t_ad`  (
  `id` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for t_changelogo
-- ----------------------------
DROP TABLE IF EXISTS `t_changelogo`;
CREATE TABLE `t_changelogo`  (
  `dao_id` int(0) NOT NULL COMMENT 'dao id',
  `block_num` bigint(0) NOT NULL COMMENT '区块号',
  `dao_time` int(0) NULL DEFAULT NULL COMMENT '时间戳',
  `logo_id` int(0) NULL DEFAULT NULL,
  `dao_logo` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `_time` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
  `id` int(0) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `block_num`(`block_num`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for t_createversion
-- ----------------------------
DROP TABLE IF EXISTS `t_createversion`;
CREATE TABLE `t_createversion`  (
  `block_num` bigint(0) UNSIGNED NOT NULL,
  `dao_id` int(0) NULL DEFAULT NULL,
  `creator` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `dao_version` int(0) NULL DEFAULT NULL,
  `_time` int(0) NULL DEFAULT NULL,
  `id` int(0) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `block_num`(`block_num`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for t_dao
-- ----------------------------
DROP TABLE IF EXISTS `t_dao`;
CREATE TABLE `t_dao`  (
  `dao_id` int(0) NOT NULL COMMENT 'dao ID',
  `block_num` bigint(0) NULL DEFAULT NULL COMMENT '区块号',
  `dao_name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '名称',
  `dao_symbol` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '代币名称',
  `dao_desc` varchar(4000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '描述',
  `dao_manager` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '管理员地址',
  `dao_logo` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT 'logo',
  `utoken_cost` decimal(18, 6) NULL DEFAULT 0.000000 COMMENT '币值',
  `dao_ranking` int(0) NULL DEFAULT 0 COMMENT '排名',
  `creator` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT 'mint dao的合约地址',
  `delegator` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT 'DAO代理地址',
  `dao_exec` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '执行者',
  `dao_time` int(0) NULL DEFAULT NULL COMMENT '时间戳',
  `strategy` int(0) NULL DEFAULT NULL COMMENT '2的16次方',
  `lifetime` int(0) NULL DEFAULT NULL COMMENT '寿命期（秒）',
  `cool_time` int(0) NULL DEFAULT NULL COMMENT '冷却时间(秒)',
  `_time` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
  `dapp_owner` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT 'dapp 所有者',
  `sctype` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '智能公器类型',
  PRIMARY KEY (`dao_id`) USING BTREE,
  UNIQUE INDEX `dao_name`(`dao_name`) USING BTREE,
  UNIQUE INDEX `delegator`(`delegator`) USING BTREE,
  UNIQUE INDEX `dao_symbol`(`dao_symbol`) USING BTREE,
  INDEX `block_num`(`block_num`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for t_daoaccount
-- ----------------------------
DROP TABLE IF EXISTS `t_daoaccount`;
CREATE TABLE `t_daoaccount`  (
  `id` int(0) UNSIGNED NOT NULL AUTO_INCREMENT,
  `block_num` bigint(0) UNSIGNED NOT NULL COMMENT '区块号 用于监听标记',
  `delegator` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT 'smart common 代理地址',
  `account` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '成员地址',
  `dividendRights` int(0) NULL DEFAULT NULL COMMENT '分红，票权， 0 表示已删除',
  `dao_id` int(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `block_num`(`block_num`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 30 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for t_daodetail
-- ----------------------------
DROP TABLE IF EXISTS `t_daodetail`;
CREATE TABLE `t_daodetail`  (
  `id` int(0) UNSIGNED NOT NULL AUTO_INCREMENT,
  `member_votes` int(0) NULL DEFAULT 0 COMMENT '成员票数',
  `member_address` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '成员地址',
  `member_index` int(0) NULL DEFAULT 0 COMMENT '成员序号,已作废',
  `member_type` tinyint(0) NULL DEFAULT 1 COMMENT '类型:1原始，0邀请，已作废',
  `delegator` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT 'smartcommon代理地址',
  `dao_id` int(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `id`(`delegator`, `member_address`) USING BTREE,
  UNIQUE INDEX `dao_id`(`dao_id`, `member_address`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 28 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for t_domain
-- ----------------------------
DROP TABLE IF EXISTS `t_domain`;
CREATE TABLE `t_domain`  (
  `block_num` bigint(0) UNSIGNED NOT NULL COMMENT '区块号，用于监听标记',
  `dao_id` int(0) NULL DEFAULT NULL COMMENT 'smart common id',
  `domain` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '域名',
  `pubkey` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '公钥',
  `privkey` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '私钥',
  `_time` int(0) NULL DEFAULT NULL COMMENT '时间戳',
  PRIMARY KEY (`block_num`, `domain`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for t_domainsing
-- ----------------------------
DROP TABLE IF EXISTS `t_domainsing`;
CREATE TABLE `t_domainsing`  (
  `block_num` bigint(0) NOT NULL COMMENT '区块号，用于监听标记',
  `addr` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '钱包地址',
  `domain` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '域名',
  `nick_name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '名称/昵称',
  `pubkey` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '公钥',
  `privkey` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '私钥',
  `_time` int(0) NULL DEFAULT NULL COMMENT '时间戳',
  `id` int(0) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `block_num`(`block_num`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for t_e2t
-- ----------------------------
DROP TABLE IF EXISTS `t_e2t`;
CREATE TABLE `t_e2t`  (
  `block_num` bigint(0) NOT NULL,
  `from_address` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `to_address` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `in_amount` decimal(18, 6) NULL DEFAULT 0.000000,
  `out_amount` decimal(18, 6) NULL DEFAULT 0.000000,
  `swap_time` int(0) NULL DEFAULT NULL,
  `_time` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
  `tran_hash` char(66) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `utoken_cost` decimal(18, 6) NULL DEFAULT 0.000000,
  `token_id` int(0) NULL DEFAULT NULL,
  `swap_gas` int(0) NULL DEFAULT 0,
  `tipAmount` decimal(18, 6) NULL DEFAULT NULL COMMENT '打赏uto',
  `id` int(0) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `tran_hash`(`tran_hash`) USING BTREE,
  INDEX `block_num`(`block_num`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for t_eth_utoken
-- ----------------------------
DROP TABLE IF EXISTS `t_eth_utoken`;
CREATE TABLE `t_eth_utoken`  (
  `block_num` bigint(0) NOT NULL,
  `_time` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
  `swap_address` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `swap_time` int(0) NULL DEFAULT NULL,
  `swap_eth` decimal(18, 6) NULL DEFAULT 0.000000,
  `swap_utoken` decimal(18, 6) NULL DEFAULT 0.000000,
  `tran_hash` char(66) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `swap_gas` int(0) NULL DEFAULT 0,
  `id` int(0) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `tran_hash`(`tran_hash`) USING BTREE,
  INDEX `block_num`(`block_num`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for t_getdaoutoken
-- ----------------------------
DROP TABLE IF EXISTS `t_getdaoutoken`;
CREATE TABLE `t_getdaoutoken`  (
  `block_num` bigint(0) UNSIGNED NOT NULL COMMENT '区块号 用于监听标记',
  `delegator` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT 'smart common 代理地址',
  `account` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '分红者地址',
  `utoken_amount` decimal(18, 6) NULL DEFAULT NULL COMMENT '分红的utoken',
  `_time` int(0) NULL DEFAULT NULL,
  `dao_owner` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '成员地址',
  `pre_time` int(0) NULL DEFAULT NULL COMMENT '上次取的时间戳',
  `id` int(0) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `block_num`(`block_num`, `delegator`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for t_mynft
-- ----------------------------
DROP TABLE IF EXISTS `t_mynft`;
CREATE TABLE `t_mynft`  (
  `to_address` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `token_id` int(0) NOT NULL,
  `template_id` int(0) NULL DEFAULT NULL,
  `dao_id` int(0) NULL DEFAULT NULL,
  `_time` char(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `tokensvg` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `block_num` bigint(0) NULL DEFAULT NULL,
  `contract_address` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `_type` tinyint(0) NOT NULL DEFAULT 0 COMMENT '0发布时,1其它mint, 2打赏 3mint smart common',
  `tips` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`_type`, `to_address`, `token_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for t_nft
-- ----------------------------
DROP TABLE IF EXISTS `t_nft`;
CREATE TABLE `t_nft`  (
  `id` int(0) UNSIGNED NOT NULL AUTO_INCREMENT,
  `block_num` bigint(0) UNSIGNED NOT NULL,
  `dao_id` int(0) NULL DEFAULT NULL,
  `token_id` int(0) NULL DEFAULT NULL,
  `token_to` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `tokensvg` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `_time` int(0) NULL DEFAULT NULL,
  `contract_address` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `tips` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '事件数组',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `block_num`(`block_num`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for t_nft_mint
-- ----------------------------
DROP TABLE IF EXISTS `t_nft_mint`;
CREATE TABLE `t_nft_mint`  (
  `id` int(0) UNSIGNED NOT NULL AUTO_INCREMENT,
  `block_num` bigint(0) UNSIGNED NOT NULL,
  `dao_id` int(0) NULL DEFAULT NULL,
  `token_id` int(0) NULL DEFAULT NULL,
  `token_to` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `tokensvg` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `_time` int(0) NULL DEFAULT NULL,
  `contract_address` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `block_num`(`block_num`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 19 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for t_nft_swap
-- ----------------------------
DROP TABLE IF EXISTS `t_nft_swap`;
CREATE TABLE `t_nft_swap`  (
  `id` int(0) UNSIGNED NOT NULL AUTO_INCREMENT,
  `block_num` bigint(0) UNSIGNED NOT NULL,
  `dao_id` int(0) NULL DEFAULT NULL,
  `token_id` int(0) NULL DEFAULT NULL,
  `token_to` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `tokensvg` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `_time` int(0) NULL DEFAULT NULL,
  `contract_address` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `utoken` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `block_num`(`block_num`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for t_nft_swaphonor
-- ----------------------------
DROP TABLE IF EXISTS `t_nft_swaphonor`;
CREATE TABLE `t_nft_swaphonor`  (
  `id` int(0) UNSIGNED NOT NULL AUTO_INCREMENT,
  `block_num` bigint(0) UNSIGNED NOT NULL,
  `dao_id` int(0) NULL DEFAULT NULL,
  `token_id` int(0) NULL DEFAULT NULL,
  `token_to` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `tokensvg` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `_time` int(0) NULL DEFAULT NULL,
  `contract_address` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `tips` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '事件数组',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `block_num`(`block_num`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for t_nft_transfer
-- ----------------------------
DROP TABLE IF EXISTS `t_nft_transfer`;
CREATE TABLE `t_nft_transfer`  (
  `id` int(0) UNSIGNED NOT NULL AUTO_INCREMENT,
  `block_num` bigint(0) UNSIGNED NULL DEFAULT NULL,
  `token_id` int(0) NULL DEFAULT NULL,
  `token_to` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `tokensvg` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `_time` int(0) NULL DEFAULT NULL,
  `contract_address` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `in_time` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `block_num`(`block_num`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for t_pro
-- ----------------------------
DROP TABLE IF EXISTS `t_pro`;
CREATE TABLE `t_pro`  (
  `block_num` bigint(0) UNSIGNED NOT NULL COMMENT '区块号 用于监听标记',
  `delegator` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT 'smart common 代理地址',
  `creator` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '提案创建人',
  `account` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '参数1',
  `dividendRights` int(0) NULL DEFAULT 0 COMMENT '参数2',
  `createTime` int(0) NULL DEFAULT 0 COMMENT '参数3',
  `rights` int(0) NULL DEFAULT 0 COMMENT '参数4',
  `antirights` int(0) NULL DEFAULT 0 COMMENT '参数5',
  `dao_desc` varchar(4000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '参数6',
  `is_end` tinyint(0) UNSIGNED NULL DEFAULT 0 COMMENT '0未完成 1通过 2 未通过，3过期',
  `dao_id` int(0) NULL DEFAULT NULL COMMENT 'smart common id',
  `strategy` int(0) NULL DEFAULT NULL COMMENT '通过率',
  `lifetime` int(0) NULL DEFAULT NULL COMMENT '寿命',
  `cool_time` int(0) NULL DEFAULT NULL COMMENT '冷却时间',
  `pro_type` tinyint(0) NULL DEFAULT NULL COMMENT '1修改logo,2修改描述,3修改管理者,4 修改类型,7修改策略,5新增成员,6,修改票权,0删除成员',
  `imgstr` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `proposalType` tinyint(0) NULL DEFAULT NULL COMMENT '0 为修改strategy\n1 为修改logo\n2 为修改描述\n3 为修改管理员\n4 为修改智能公器类型',
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `total_vote` int(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `delegator`(`delegator`, `createTime`) USING BTREE,
  INDEX `block_num`(`block_num`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 28 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for t_proexcu
-- ----------------------------
DROP TABLE IF EXISTS `t_proexcu`;
CREATE TABLE `t_proexcu`  (
  `block_num` bigint(0) UNSIGNED NOT NULL COMMENT '区块号 用于监听标记',
  `delegator` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT 'smart common 代理地址',
  `account` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '提案参数1',
  `dividendRights` int(0) NULL DEFAULT NULL COMMENT '提案参数2',
  `_time` int(0) NULL DEFAULT NULL COMMENT '链上时间戳',
  `proposalType` tinyint(0) NULL DEFAULT NULL,
  `id` int(0) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `block_num`(`block_num`, `delegator`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 15 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for t_provote
-- ----------------------------
DROP TABLE IF EXISTS `t_provote`;
CREATE TABLE `t_provote`  (
  `block_num` bigint(0) UNSIGNED NOT NULL COMMENT '区块号 用于监听标记',
  `delegator` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT 'smart common 代理地址',
  `createTime` int(0) NULL DEFAULT NULL COMMENT '提案时间戳',
  `creator` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '投票人地址',
  `antirights` int(0) NULL DEFAULT NULL COMMENT '反对票',
  `rights` int(0) NULL DEFAULT NULL COMMENT '赞成票',
  `_time` int(0) NULL DEFAULT NULL COMMENT '链上时间戳',
  `proposalType` tinyint(0) NULL DEFAULT NULL,
  `id` int(0) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `block_num`(`block_num`, `delegator`) USING BTREE,
  INDEX `delegator`(`delegator`, `createTime`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 17 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for t_swap
-- ----------------------------
DROP TABLE IF EXISTS `t_swap`;
CREATE TABLE `t_swap`  (
  `block_num` bigint(0) UNSIGNED NOT NULL COMMENT '区块号 用于监听标记',
  `tran_hash` char(66) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT 'Etherscan交易hash码',
  `title` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '兑换内容',
  `in_amount` decimal(18, 6) NULL DEFAULT NULL COMMENT '输入数值',
  `out_amount` decimal(18, 6) NULL DEFAULT NULL COMMENT '输出数值',
  `swap_address` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '兑换人地址',
  `swap_time` char(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '兑换时间',
  `in_str` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `out_str` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `tipAmount` decimal(18, 6) NULL DEFAULT NULL COMMENT '打赏uto',
  `tip_str` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '打赏给',
  `id` int(0) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `tran_hash`(`tran_hash`) USING BTREE,
  INDEX `block_num`(`block_num`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for t_t2t
-- ----------------------------
DROP TABLE IF EXISTS `t_t2t`;
CREATE TABLE `t_t2t`  (
  `block_num` bigint(0) NOT NULL,
  `from_dao_id` int(0) NULL DEFAULT NULL,
  `to_dao_id` int(0) NULL DEFAULT NULL,
  `_time` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
  `from_utoken_cost` decimal(18, 6) NULL DEFAULT 0.000000,
  `to_utoken_cost` decimal(18, 6) NULL DEFAULT 0.000000,
  `from_address` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `to_address` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `from_token` decimal(18, 6) NULL DEFAULT 0.000000,
  `to_token` decimal(18, 6) NULL DEFAULT 0.000000,
  `swap_time` int(0) NULL DEFAULT NULL,
  `tran_hash` char(66) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `swap_gas` int(0) NULL DEFAULT NULL,
  `tipAmount` decimal(18, 6) NULL DEFAULT NULL COMMENT '打赏',
  `sc_id` int(0) NULL DEFAULT NULL COMMENT '打赏scID',
  `id` int(0) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `tran_hash`(`tran_hash`) USING BTREE,
  INDEX `block_num`(`block_num`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for t_t2u
-- ----------------------------
DROP TABLE IF EXISTS `t_t2u`;
CREATE TABLE `t_t2u`  (
  `block_num` bigint(0) NOT NULL,
  `from_token_id` int(0) NULL DEFAULT NULL,
  `utoken_cost` decimal(18, 6) NULL DEFAULT 0.000000,
  `from_address` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `to_address` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `utoken_amount` decimal(18, 6) NULL DEFAULT 0.000000,
  `token_amount` decimal(18, 6) NULL DEFAULT 0.000000,
  `swap_time` int(0) NULL DEFAULT NULL,
  `_time` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
  `tran_hash` char(66) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `swap_gas` int(0) NULL DEFAULT 0,
  `tipAmount` decimal(18, 6) NULL DEFAULT NULL COMMENT '打赏',
  `id` int(0) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `tran_hash`(`tran_hash`) USING BTREE,
  INDEX `block_num`(`block_num`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for t_token
-- ----------------------------
DROP TABLE IF EXISTS `t_token`;
CREATE TABLE `t_token`  (
  `dao_id` int(0) NOT NULL COMMENT 'smart common Id',
  `token_id` int(0) NULL DEFAULT NULL COMMENT '代币 Id',
  `block_num` bigint(0) NOT NULL COMMENT '区块号 用于监听标记',
  `dao_time` int(0) NULL DEFAULT NULL COMMENT '链上时间戳',
  `_time` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '入库时间',
  PRIMARY KEY (`dao_id`) USING BTREE,
  UNIQUE INDEX `token_id`(`token_id`) USING BTREE,
  INDEX `block_num`(`block_num`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for t_tokenuser
-- ----------------------------
DROP TABLE IF EXISTS `t_tokenuser`;
CREATE TABLE `t_tokenuser`  (
  `dao_id` int(0) NULL DEFAULT NULL COMMENT 'smart common id',
  `token_id` int(0) NOT NULL COMMENT '代币ID',
  `dao_manager` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT 'smart common 管理员地址',
  `token_cost` decimal(18, 6) NULL DEFAULT 0.000000 COMMENT '代币余额',
  PRIMARY KEY (`token_id`, `dao_manager`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for t_u2t
-- ----------------------------
DROP TABLE IF EXISTS `t_u2t`;
CREATE TABLE `t_u2t`  (
  `block_num` bigint(0) NOT NULL,
  `token_id` int(0) NULL DEFAULT NULL,
  `utoken_cost` decimal(18, 6) NULL DEFAULT 0.000000,
  `from_address` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `to_address` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `utoken_amount` decimal(18, 6) NULL DEFAULT 0.000000,
  `token_amount` decimal(18, 6) NULL DEFAULT 0.000000,
  `swap_time` int(0) NULL DEFAULT NULL,
  `_time` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
  `tran_hash` char(66) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `swap_gas` int(0) NULL DEFAULT 0,
  `tipAmount` decimal(18, 6) NULL DEFAULT NULL COMMENT '打赏',
  `id` int(0) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `tran_hash`(`tran_hash`) USING BTREE,
  INDEX `block_num`(`block_num`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for t_updatedaocreator
-- ----------------------------
DROP TABLE IF EXISTS `t_updatedaocreator`;
CREATE TABLE `t_updatedaocreator`  (
  `block_num` bigint(0) UNSIGNED NOT NULL,
  `dao_id` int(0) NULL DEFAULT NULL,
  `creator` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `_time` int(0) NULL DEFAULT NULL,
  `id` int(0) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `block_num`(`block_num`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- View structure for v_account
-- ----------------------------
DROP VIEW IF EXISTS `v_account`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `v_account` AS select `a_account`.`id` AS `id`,`a_account`.`block_num` AS `block_num`,`a_account`.`dao_id` AS `dao_id`,`a_account`.`actor_name` AS `actor_name`,`a_account`.`domain` AS `domain`,`a_account`.`manager` AS `manager`,`a_account`.`pubkey` AS `pubkey`,`a_account`.`privkey` AS `privkey`,`a_account`.`actor_account` AS `actor_account`,`a_account`.`actor_url` AS `actor_url`,`a_account`.`avatar` AS `avatar`,`a_account`.`actor_desc` AS `actor_desc`,`a_account`.`createtime` AS `createtime`,concat('https://',`a_account`.`domain`,'/api/activitepub/inbox/',`a_account`.`actor_name`) AS `actor_inbox` from `a_account`;

-- ----------------------------
-- View structure for v_allsmartcommon
-- ----------------------------
DROP VIEW IF EXISTS `v_allsmartcommon`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `v_allsmartcommon` AS select `a`.`id` AS `id`,`a`.`dao_id` AS `dao_id`,`a`.`actor_name` AS `actor_name`,`a`.`actor_account` AS `actor_account`,`a`.`actor_url` AS `actor_url`,`a`.`domain` AS `domain`,`a`.`avatar` AS `avatar`,`b`.`dao_name` AS `dao_name`,`b`.`dao_manager` AS `manager`,ifnull(`c`.`amount`,0) AS `amount` from (((select `a_account`.`id` AS `id`,`a_account`.`dao_id` AS `dao_id`,`a_account`.`actor_name` AS `actor_name`,`a_account`.`actor_account` AS `actor_account`,`a_account`.`actor_url` AS `actor_url`,`a_account`.`domain` AS `domain`,`a_account`.`avatar` AS `avatar` from `a_account` where (`a_account`.`dao_id` > 0)) `a` left join `t_dao` `b` on((`a`.`dao_id` = `b`.`dao_id`))) left join (select `a_messagesc`.`dao_id` AS `dao_id`,count(0) AS `amount` from `a_messagesc` where (`a_messagesc`.`dao_id` > 0) group by `a_messagesc`.`dao_id`) `c` on((`a`.`dao_id` = `c`.`dao_id`)));

-- ----------------------------
-- View structure for v_createversion
-- ----------------------------
DROP VIEW IF EXISTS `v_createversion`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `v_createversion` AS select `t_createversion`.`block_num` AS `block_num`,`t_createversion`.`dao_id` AS `dao_id`,`t_createversion`.`creator` AS `creator`,`t_createversion`.`dao_version` AS `dao_version`,date_format(from_unixtime(`t_createversion`.`_time`),'%Y-%m-%d') AS `_time` from `t_createversion`;

-- ----------------------------
-- View structure for v_dao
-- ----------------------------
DROP VIEW IF EXISTS `v_dao`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `v_dao` AS select round(((`a`.`strategy` / 65535) * 100),0) AS `strategy`,`a`.`cool_time` AS `cool_time`,`a`.`lifetime` AS `lifetime`,`a`.`dao_id` AS `dao_id`,`a`.`block_num` AS `block_num`,`a`.`sctype` AS `sctype`,`a`.`dao_name` AS `dao_name`,concat(`a`.`dao_symbol`,'.',lower(`a`.`sctype`)) AS `dao_symbol`,`a`.`dao_desc` AS `dao_desc`,date_format(from_unixtime(`a`.`dao_time`),'%Y-%m-%d %H:%i:%s') AS `dao_time`,`a`.`dao_manager` AS `dao_manager`,`a`.`dao_logo` AS `dao_logo`,`a`.`creator` AS `creator`,`a`.`delegator` AS `delegator`,`a`.`utoken_cost` AS `utoken_cost`,`a`.`dao_ranking` AS `dao_ranking`,`a`.`dao_exec` AS `dao_exec`,date_format(from_unixtime(`a`.`_time`),'%Y-%m-%d %H:%i:%s') AS `_time`,ifnull(`b`.`token_id`,0) AS `token_id` from (`t_dao` `a` left join `t_token` `b` on((`a`.`dao_id` = `b`.`dao_id`)));

-- ----------------------------
-- View structure for v_daotoken
-- ----------------------------
DROP VIEW IF EXISTS `v_daotoken`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `v_daotoken` AS select -(2) AS `token_id`,-(2) AS `dao_id`,'ETH' AS `dao_symbol`,NULL AS `dao_logo` union all select -(1) AS `token_id`,-(1) AS `dao_id`,'UTO' AS `dao_symbol`,NULL AS `dao_logo` union all select `a`.`token_id` AS `token_id`,`a`.`dao_id` AS `dao_id`,`a`.`dao_symbol` AS `dao_symbol`,`a`.`dao_logo` AS `dao_logo` from `v_dao` `a` where (`a`.`token_id` > 0);

-- ----------------------------
-- View structure for v_follow
-- ----------------------------
DROP VIEW IF EXISTS `v_follow`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `v_follow` AS select `a_follow`.`id` AS `id`,`a_follow`.`follow_id` AS `follow_id`,`a_follow`.`actor_account` AS `actor_account`,`a_follow`.`actor_url` AS `actor_url`,`a_follow`.`actor_inbox` AS `actor_inbox`,`a_follow`.`actor_avatar` AS `actor_avatar`,`a_follow`.`user_account` AS `user_account`,`a_follow`.`user_url` AS `user_url`,`a_follow`.`user_avatar` AS `user_avatar`,`a_follow`.`user_inbox` AS `user_inbox`,date_format(`a_follow`.`createtime`,'%Y-%m-%d %H:%i:%s') AS `createtime` from `a_follow`;

-- ----------------------------
-- View structure for v_getdaoutoken
-- ----------------------------
DROP VIEW IF EXISTS `v_getdaoutoken`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `v_getdaoutoken` AS select `a`.`block_num` AS `block_num`,`a`.`delegator` AS `delegator`,`a`.`account` AS `account`,`a`.`utoken_amount` AS `utoken_amount`,date_format(from_unixtime(`a`.`_time`),'%Y-%m-%d') AS `_time`,`a`.`dao_owner` AS `dao_owner`,date_format(from_unixtime(`a`.`pre_time`),'%Y-%m-%d') AS `pre_time`,`b`.`dao_name` AS `dao_name`,`b`.`dao_symbol` AS `dao_symbol`,`b`.`dao_logo` AS `dao_logo` from (`t_getdaoutoken` `a` left join `t_dao` `b` on((`a`.`delegator` = `b`.`delegator`)));

-- ----------------------------
-- View structure for v_message
-- ----------------------------
DROP VIEW IF EXISTS `v_message`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `v_message` AS select `a`.`id` AS `id`,`a`.`message_id` AS `message_id`,`a`.`manager` AS `manager`,`a`.`actor_name` AS `actor_name`,`a`.`avatar` AS `avatar`,`a`.`actor_account` AS `actor_account`,`a`.`actor_url` AS `actor_url`,`a`.`actor_inbox` AS `actor_inbox`,`a`.`link_url` AS `link_url`,`a`.`title` AS `title`,`a`.`content` AS `content`,`a`.`is_send` AS `is_send`,`a`.`is_discussion` AS `is_discussion`,`a`.`top_img` AS `top_img`,`a`.`receive_account` AS `receive_account`,`a`.`send_type` AS `send_type`,`a`.`createtime` AS `createtime`,`a`.`reply_time` AS `reply_time`,`a`.`vedio_url` AS `vedio_url`,`a`.`account_at` AS `account_at`,`a`.`property_index` AS `property_index`,`a`.`type_index` AS `type_index`,`a`.`content_link` AS `content_link`,`a`.`total` AS `total`,`b`.`dao_id` AS `dao_id`,ifnull(`b`.`id`,0) AS `actor_id`,now() AS `currentTime` from (`a_message` `a` left join `a_account` `b` on((`a`.`actor_account` = `b`.`actor_account`)));

-- ----------------------------
-- View structure for v_message_commont
-- ----------------------------
DROP VIEW IF EXISTS `v_message_commont`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `v_message_commont` AS select `a_message_commont`.`id` AS `id`,`a_message_commont`.`pid` AS `pid`,`a_message_commont`.`ppid` AS `ppid`,`a_message_commont`.`message_id` AS `message_id`,`a_message_commont`.`manager` AS `manager`,`a_message_commont`.`actor_name` AS `actor_name`,`a_message_commont`.`avatar` AS `avatar`,`a_message_commont`.`actor_account` AS `actor_account`,`a_message_commont`.`actor_url` AS `actor_url`,`a_message_commont`.`content` AS `content`,`a_message_commont`.`createtime` AS `createtime`,`a_message_commont`.`type_index` AS `type_index`,`a_message_commont`.`vedio_url` AS `vedio_url`,`a_message_commont`.`top_img` AS `top_img`,`a_message_commont`.`content_link` AS `content_link`,now() AS `currentTime` from `a_message_commont`;

-- ----------------------------
-- View structure for v_messagesc
-- ----------------------------
DROP VIEW IF EXISTS `v_messagesc`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `v_messagesc` AS select `a`.`id` AS `id`,`a`.`actor_id` AS `actor_id`,`a`.`dao_id` AS `dao_id`,`a`.`title` AS `title`,`a`.`content` AS `content`,`a`.`is_send` AS `is_send`,`a`.`is_discussion` AS `is_discussion`,`a`.`top_img` AS `top_img`,`a`.`start_time` AS `start_time`,`a`.`end_time` AS `end_time`,`a`.`event_url` AS `event_url`,`a`.`event_address` AS `event_address`,`a`.`time_event` AS `time_event`,`a`.`_type` AS `_type`,`a`.`reply_time` AS `reply_time`,`a`.`createtime` AS `createtime`,`a`.`message_id` AS `message_id`,`a`.`vedio_url` AS `vedio_url`,`a`.`account_at` AS `account_at`,`a`.`property_index` AS `property_index`,`a`.`type_index` AS `type_index`,`a`.`content_link` AS `content_link`,`a`.`total` AS `total`,concat('https://',`b`.`domain`,'/api/activitepub/inbox/',`b`.`actor_name`) AS `actor_inbox`,`b`.`actor_name` AS `actor_name`,`b`.`avatar` AS `avatar`,`b`.`actor_account` AS `actor_account`,`b`.`actor_url` AS `actor_url`,`c`.`manager` AS `manager`,0 AS `send_type`,now() AS `currentTime` from ((`a_messagesc` `a` left join `a_account` `b` on((`a`.`dao_id` = `b`.`dao_id`))) left join `a_account` `c` on((`a`.`actor_id` = `c`.`id`)));

-- ----------------------------
-- View structure for v_messagesc_commont
-- ----------------------------
DROP VIEW IF EXISTS `v_messagesc_commont`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `v_messagesc_commont` AS select `a_messagesc_commont`.`id` AS `id`,`a_messagesc_commont`.`pid` AS `pid`,`a_messagesc_commont`.`ppid` AS `ppid`,`a_messagesc_commont`.`message_id` AS `message_id`,`a_messagesc_commont`.`manager` AS `manager`,`a_messagesc_commont`.`actor_name` AS `actor_name`,`a_messagesc_commont`.`avatar` AS `avatar`,`a_messagesc_commont`.`actor_account` AS `actor_account`,`a_messagesc_commont`.`actor_url` AS `actor_url`,`a_messagesc_commont`.`content` AS `content`,`a_messagesc_commont`.`createtime` AS `createtime`,`a_messagesc_commont`.`type_index` AS `type_index`,`a_messagesc_commont`.`vedio_url` AS `vedio_url`,`a_messagesc_commont`.`top_img` AS `top_img`,`a_messagesc_commont`.`content_link` AS `content_link`,now() AS `currentTime` from `a_messagesc_commont`;

-- ----------------------------
-- View structure for v_mynft
-- ----------------------------
DROP VIEW IF EXISTS `v_mynft`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `v_mynft` AS select `a`.`to_address` AS `to_address`,`a`.`token_id` AS `token_id`,`a`.`template_id` AS `template_id`,`a`.`dao_id` AS `dao_id`,`a`.`tips` AS `tips`,`a`.`_time` AS `_time`,`a`.`tokensvg` AS `tokensvg`,`a`.`contract_address` AS `contract_address`,`a`.`block_num` AS `block_num`,`a`.`_type` AS `_type`,`b`.`dao_logo` AS `dao_logo`,`b`.`dao_name` AS `dao_name`,`b`.`dao_symbol` AS `dao_symbol` from (`t_mynft` `a` left join `t_dao` `b` on((`a`.`dao_id` = `b`.`dao_id`)));

-- ----------------------------
-- View structure for v_pro
-- ----------------------------
DROP VIEW IF EXISTS `v_pro`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `v_pro` AS select `b`.`dao_name` AS `dao_name`,`b`.`dao_symbol` AS `dao_symbol`,`b`.`dao_logo` AS `dao_logo`,`b`.`dao_desc` AS `daodesc`,`a`.`proposalType` AS `proposalType`,`a`.`imgstr` AS `imgstr`,`a`.`pro_type` AS `pro_type`,`a`.`cool_time` AS `cool_time`,`a`.`block_num` AS `block_num`,`a`.`delegator` AS `delegator`,`a`.`creator` AS `creator`,`a`.`account` AS `account`,`a`.`dividendRights` AS `dividendRights`,`a`.`createTime` AS `createTime`,date_format(from_unixtime(`a`.`createTime`),'%Y-%m-%d') AS `create_date`,((`a`.`createTime` + `a`.`lifetime`) - unix_timestamp()) AS `lifetime`,`a`.`rights` AS `rights`,`a`.`antirights` AS `antirights`,`a`.`dao_desc` AS `dao_desc`,`a`.`is_end` AS `is_end`,`a`.`dao_id` AS `dao_id`,round(((`a`.`strategy` / 65535) * 100),0) AS `strategy`,`a`.`total_vote` AS `total_vote` from (`t_pro` `a` join `t_dao` `b` on((`a`.`dao_id` = `b`.`dao_id`)));

-- ----------------------------
-- View structure for v_t2tsame
-- ----------------------------
DROP VIEW IF EXISTS `v_t2tsame`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `v_t2tsame` AS select `a`.`tran_hash` AS `tran_hash`,`a`.`token_amount` AS `token1`,`b`.`token_amount` AS `token2`,`a`.`from_address` AS `from_address`,`a`.`swap_time` AS `swap_time`,`a`.`block_num` AS `block_num` from (`t_t2u` `a` join `t_u2t` `b` on((`a`.`tran_hash` = `b`.`tran_hash`)));

-- ----------------------------
-- View structure for v_token
-- ----------------------------
DROP VIEW IF EXISTS `v_token`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `v_token` AS select `a`.`dao_id` AS `dao_id`,`a`.`token_id` AS `token_id`,`b`.`dao_name` AS `dao_name`,`b`.`dao_symbol` AS `dao_symbol`,`b`.`dao_logo` AS `dao_logo`,`b`.`delegator` AS `delegator` from (`t_token` `a` left join `t_dao` `b` on((`a`.`dao_id` = `b`.`dao_id`)));

-- ----------------------------
-- View structure for v_tokenuser
-- ----------------------------
DROP VIEW IF EXISTS `v_tokenuser`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `v_tokenuser` AS select `a`.`dao_id` AS `dao_id`,`a`.`token_id` AS `token_id`,`a`.`dao_manager` AS `dao_manager`,`a`.`token_cost` AS `token_cost`,`b`.`dao_logo` AS `dao_logo`,`b`.`dao_symbol` AS `dao_symbol` from (`t_tokenuser` `a` join `t_dao` `b` on((`a`.`dao_id` = `b`.`dao_id`)));

-- ----------------------------
-- Procedure structure for aa
-- ----------------------------
DROP PROCEDURE IF EXISTS `aa`;
delimiter ;;
CREATE PROCEDURE `aa`()
BEGIN
	-- update t_tokenuser set dao_id=2 where token_id=38888888;
	-- select ROW_COUNT();
	-- declare str varchar(100);
	-- set str='aaa1a78787823bbb@qwe';
	-- select substring_index(str,'@',1) as aa;
TRUNCATE TABLE t_dao;
TRUNCATE TABLE t_daodetail;
TRUNCATE TABLE t_changelogo;
TRUNCATE TABLE t_pro;
TRUNCATE TABLE t_proexcu;
TRUNCATE TABLE t_eth_utoken;
TRUNCATE TABLE t_t2u;
TRUNCATE TABLE t_token;
TRUNCATE TABLE t_tokenuser;
TRUNCATE TABLE t_u2t;
TRUNCATE TABLE t_t2t;
TRUNCATE TABLE t_provote;
TRUNCATE TABLE t_e2t;
TRUNCATE TABLE t_swap;
truncate table t_daoaccount;
TRUNCATE TABLE t_createversion;
TRUNCATE TABLE t_getdaoutoken;
TRUNCATE TABLE t_domain;
truncate table t_daoaccount;
truncate table a_account;
truncate table t_nft;
TRUNCATE TABLE t_mynft;
TRUNCATE TABLE t_nft_transfer;
TRUNCATE TABLE  t_nft_mint;
TRUNCATE TABLE  t_nft_swap;
TRUNCATE TABLE  t_updatedaocreator;
truncate table t_domainsing;
TRUNCATE TABLE a_eip_type;
truncate table a_bookmark;
TRUNCATE TABLE a_bookmarksc;
truncate table a_heart;
TRUNCATE TABLE a_heartsc;
truncate table a_follow;
truncate table a_message;
TRUNCATE TABLE a_messagesc;
TRUNCATE TABLE t_ad;
truncate table a_message_commont;
TRUNCATE TABLE a_messagesc_commont;
truncate table t_nft_swaphonor;
	
    END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for calc_pro
-- ----------------------------
DROP PROCEDURE IF EXISTS `calc_pro`;
delimiter ;;
CREATE PROCEDURE `calc_pro`(p_nump bigint,p_delegator CHAR(42), p_createTime INT,p_creator char(42),p_rights int,p_antirights int,p_time int,p_type tinyint)
BEGIN
	DECLARE t INT;   -- 总票数
	DECLARE s INT;   -- 策略
	DECLARE r INT;   -- 赞成票
	DECLARE a INT;   -- 反对票
	DECLARE cc INT;  -- 本次投票数
	-- 分别查询，并处理 NULL 情况
	SELECT IFNULL(SUM(total_vote), 0) INTO t FROM t_pro WHERE delegator = p_delegator AND createTime = p_createTime;
	SELECT IFNULL(SUM(strategy), 0) INTO s FROM t_pro WHERE delegator = p_delegator AND createTime = p_createTime;
	SELECT IFNULL(SUM(rights), 0) INTO r FROM t_pro WHERE delegator = p_delegator AND createTime = p_createTime;
	SELECT IFNULL(SUM(antirights), 0) INTO a FROM t_pro WHERE delegator = p_delegator AND createTime = p_createTime;
	SELECT IFNULL(SUM(member_votes), 0) INTO cc FROM t_daodetail WHERE delegator=p_delegator AND member_address=p_creator;    
	 
	 if p_rights> r then --  赞成票增加
		INSERT INTO t_provote(block_num,delegator,createTime,creator,antirights,rights,_time,proposalType) VALUES(p_nump,p_delegator,p_createTime,p_creator,0,cc,p_time,77);
	 ELSEIF p_antirights>a then -- 反对票增加
		INSERT INTO t_provote(block_num,delegator,createTime,creator,antirights,rights,_time,proposalType) VALUES(p_nump,p_delegator,p_createTime,p_creator,cc,0,p_time,88);
	 else  -- 历史记录，直接用当前的
		INSERT INTO t_provote(block_num,delegator,createTime,creator,antirights,rights,_time,proposalType) VALUES(p_nump,p_delegator,p_createTime,p_creator,p_antirights,p_rights,p_time,99);
	 end if;
	 
	UPDATE t_pro SET rights=p_rights,antirights=p_antirights WHERE delegator=p_delegator AND createTime=p_createTime;
    -- 使用浮点数除法， 并确保分母不为0
    IF t > 0 AND (p_rights/t) >= (s/65535) THEN
        UPDATE t_pro SET is_end = 1 WHERE delegator = p_delegator AND createTime = p_createTime;
    ELSEIF t > 0 AND (t-p_antirights) / t < (s/65535) THEN
        UPDATE t_pro SET is_end = 2 WHERE delegator = p_delegator AND createTime = p_createTime;
    END IF;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for excuteRank
-- ----------------------------
DROP PROCEDURE IF EXISTS `excuteRank`;
delimiter ;;
CREATE PROCEDURE `excuteRank`()
BEGIN
	UPDATE t_dao t1 
	JOIN (SELECT dao_id,ROW_NUMBER() OVER (ORDER BY utoken_cost DESC) AS dao_ranking FROM t_dao) t2 ON t1.dao_id = t2.dao_id
	SET t1.dao_ranking = t2.dao_ranking;
    -- 初始化排名变量
   -- SET @curRank := 0;
   -- SET @prevRank := NULL;
   -- SET @incRank := 1;
    -- 使用变量计算排名并更新
  --  UPDATE t_dao t1
  --  JOIN (
      --  SELECT dao_id, 
               -- 计算排名
          --     @curRank := IF(@prevRank = utoken_cost, @curRank, @incRank) AS rank0,
         --      @incRank := @incRank + 1,
         --      @prevRank := utoken_cost
       -- FROM t_dao
     --   ORDER BY utoken_cost DESC
  --  ) t2 
  --  ON t1.dao_id = t2.dao_id
  --  SET t1.dao_ranking = t2.rank0;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for excuteToken
-- ----------------------------
DROP PROCEDURE IF EXISTS `excuteToken`;
delimiter ;;
CREATE PROCEDURE `excuteToken`(_tokenid int,_address VARCHAR(50),_cost decimal(18,4))
BEGIN
	declare _daoid int;
	IF EXISTS(SELECT * FROM t_tokenuser WHERE token_id=_tokenid and dao_manager=_address) THEN 
		UPDATE t_tokenuser SET token_cost=_cost WHERE token_id=_tokenid AND dao_manager=_address;
	ELSE
		select dao_id into _daoid from t_token where token_id=_tokenid;
		INSERT INTO t_tokenuser(dao_id,token_id,dao_manager,token_cost) VALUES(_daoid,_tokenid,_address,_cost) ;
	END IF;
 END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for getAccount
-- ----------------------------
DROP PROCEDURE IF EXISTS `getAccount`;
delimiter ;;
CREATE PROCEDURE `getAccount`(did char(42))
BEGIN
	SELECT a.dao_id,a.dao_manager,IFNULL(b.account,'') account FROM t_dao a LEFT JOIN a_account b ON a.dao_id=b.dao_id WHERE a.dao_id IN(SELECT dao_id FROM t_daodetail
	 WHERE member_address=did);
    END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for get_page
-- ----------------------------
DROP PROCEDURE IF EXISTS `get_page`;
delimiter ;;
CREATE PROCEDURE `get_page`(_daima VARCHAR(6000),_ps INT,_i INT,_s VARCHAR(6000),_a VARCHAR(4),_w NVARCHAR(6000))
BEGIN
declare _t varchar(20);
	SELECT t INTO _t FROM aux_bt WHERE d=_daima;
	
	IF _w='' THEN 
	SELECT w INTO _w FROM aux_bt WHERE d=_daima;
	END IF;
	
	SET _w=IF(_w='','',CONCAT(' where ',_w));
	
	SET @cqw=CONCAT('SELECT * FROM ',_t,_w,' order by ',_s,' ',_a,' LIMIT ',_ps,' OFFSET ',(_i-1)*_ps);
	PREPARE stmt1 FROM @cqw;
	EXECUTE stmt1 ;
		
	 SET @cqw=CONCAT('SELECT count(*) as mcount FROM ',_t,_w);
	 PREPARE stmt1 FROM @cqw;
         EXECUTE stmt1 ;
	END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for get_price
-- ----------------------------
DROP PROCEDURE IF EXISTS `get_price`;
delimiter ;;
CREATE PROCEDURE `get_price`()
BEGIN
SELECT AVG(swap_gas) AS price FROM (SELECT * FROM t_e2t ORDER BY block_num DESC  LIMIT 10) a UNION ALL
SELECT AVG(swap_gas) AS price FROM (SELECT * FROM t_eth_utoken ORDER BY block_num DESC  LIMIT 10) b UNION ALL
SELECT AVG(swap_gas) AS price FROM (SELECT * FROM t_u2t ORDER BY block_num DESC  LIMIT 10) c UNION ALL
SELECT AVG(swap_gas) AS price FROM (SELECT * FROM t_t2u ORDER BY block_num DESC  LIMIT 10) d UNION ALL
SELECT AVG(swap_gas) AS price FROM (SELECT * FROM t_t2t ORDER BY block_num DESC  LIMIT 10) e ;
    END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for get_prolist
-- ----------------------------
DROP PROCEDURE IF EXISTS `get_prolist`;
delimiter ;;
CREATE PROCEDURE `get_prolist`(_address char(42))
BEGIN
	SELECT a.*,IFNULL(e.block_num,0) yvote 
	FROM (SELECT * FROM v_pro WHERE is_end=0 AND dao_id IN (SELECT dao_id FROM t_daodetail WHERE member_address=_address)) a LEFT JOIN 
        (SELECT block_num,delegator,createTime FROM t_provote WHERE creator=_address) e ON a.delegator=e.delegator AND a.createTime=e.createTime;
    END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for i_changelogo
-- ----------------------------
DROP PROCEDURE IF EXISTS `i_changelogo`;
delimiter ;;
CREATE PROCEDURE `i_changelogo`(daoid int,blocknum bigint,daotime int,_logo_id int,_logo varchar(256))
BEGIN
	if not exists(select * from t_changelogo where block_num=blocknum) then
	INSERT INTO t_changelogo(dao_id,block_num,dao_time,logo_id,dao_logo) VALUES(daoid,blocknum,daotime,_logo_id,_logo);
	
	end if;
    END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for i_daoaccount
-- ----------------------------
DROP PROCEDURE IF EXISTS `i_daoaccount`;
delimiter ;;
CREATE PROCEDURE `i_daoaccount`(_blocknum bigint,_delegator char(42),_account char(42),_dividendRights int)
BEGIN
	if not exists(select 1 from t_daoaccount where block_num=_blocknum and account=_account) then
		INSERT INTO t_daoaccount(block_num,delegator,account,dividendRights) VALUES(_blocknum,_delegator,_account,_dividendRights);
	end if;
    END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for i_daodetail
-- ----------------------------
DROP PROCEDURE IF EXISTS `i_daodetail`;
delimiter ;;
CREATE PROCEDURE `i_daodetail`(votes int,member char(42),delegat char(42) ,daoid int)
BEGIN
if not exists(select 1 from t_daodetail where dao_id=daoid and member_address=member) then
		INSERT INTO t_daodetail(member_votes,member_address,delegator,dao_id) values(votes,member,delegat,daoid);
	end if;
    END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for i_eip_type
-- ----------------------------
DROP PROCEDURE IF EXISTS `i_eip_type`;
delimiter ;;
CREATE PROCEDURE `i_eip_type`(_type varchar(32),_desc varchar(2000))
BEGIN
	IF NOT exists(SELECT * FROM a_eip_type WHERE type_name=_type) THEN 
		INSERT INTO a_eip_type(type_name,type_desc) VALUES(_type,_desc);
	END IF;
    END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for i_pro
-- ----------------------------
DROP PROCEDURE IF EXISTS `i_pro`;
delimiter ;;
CREATE PROCEDURE `i_pro`(_blockNum BIGINT,
    _delegator CHAR(42),
    _creator CHAR(42),
    _account CHAR(42),
    _dividendRights INT,
    _createTime INT,
    _daodesc VARCHAR(4000),
    _imgstr TEXT,
    _proposalType TINYINT)
BEGIN
    DECLARE _daoid INT;
    DECLARE _strategy INT;
    DECLARE _lifetime INT;
    DECLARE _cooltime INT;
    DECLARE _type TINYINT;
    DECLARE _votes INT;
   
    select sum(member_votes) into _votes from t_daodetail where delegator=_delegator;
    -- 获取 DAO 信息
    SELECT dao_id, strategy, lifetime, cool_time 
    INTO _daoid, _strategy, _lifetime, _cooltime 
    FROM t_dao 
    WHERE delegator = _delegator;
    -- 使用 CASE 表达式统一设置 _type
    SET _type = CASE 
        WHEN _proposalType = 0 THEN 7  -- 策略
        WHEN _proposalType < 5 THEN _proposalType
        WHEN NOT EXISTS(SELECT 1 FROM t_daodetail WHERE dao_id = _daoid AND member_address = _account ) THEN 5 -- 新增
        ELSE 6
    END;
    
   -- 更新旧的提案状态
   UPDATE t_pro
   SET is_end = CASE
       WHEN createTime + lifetime - UNIX_TIMESTAMP() < 0 THEN 3 -- 过期
       WHEN rights > antirights THEN 1   -- 赞成
       ELSE 2 -- 反对
   END
   WHERE block_num < _blockNum 
     AND dao_id = _daoid 
     AND is_end = 0;
   -- 插入新的提案
    INSERT INTO t_pro (
        block_num,
        delegator,
        creator,
        account,
        dividendRights,
        createTime,
        dao_desc,
        dao_id,
        strategy,
        lifetime,
        cool_time,
        pro_type,
        imgstr,
	proposalType,
	total_vote
    )
    VALUES (
        _blockNum,
        _delegator,
        _creator,
        _account,
        _dividendRights,
        _createTime,
        _daodesc,
        _daoid,
        _strategy,
        _lifetime,
        _cooltime,
        _type,
        _imgstr,
	_proposalType,
	_votes
    );
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for i_swap
-- ----------------------------
DROP PROCEDURE IF EXISTS `i_swap`;
delimiter ;;
CREATE PROCEDURE `i_swap`(blocknum BIGINT,
    swapaddress CHAR(42),
    swaptime INT,
    swapeth DECIMAL(18,4),
    swaputoken DECIMAL(18,6),
    tranHash CHAR(66),
    swapgas INT)
BEGIN
    -- 检查是否存在相同的 tran_hash
    IF NOT EXISTS(SELECT 1 FROM t_eth_utoken WHERE tran_hash = tranHash) THEN
        -- 插入新的记录
        INSERT INTO t_eth_utoken(
            block_num,
            swap_address,
            swap_time,
            swap_eth,
            swap_utoken,
            tran_hash,
            swap_gas
        ) 
        VALUES(
            blocknum,
            swapaddress,
            swaptime,
            swapeth,
            swaputoken,
            tranHash,
            swapgas
        );
    END IF;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for i_t2t
-- ----------------------------
DROP PROCEDURE IF EXISTS `i_t2t`;
delimiter ;;
CREATE PROCEDURE `i_t2t`(blocknum BIGINT,
    fromdaoid INT,
    todaoid INT,
    fromutokencost DECIMAL(18,6),
    toutokencost DECIMAL(18,6),
    fromaddress CHAR(42),
    toaddress CHAR(42),
    fromtoken DECIMAL(18,6),
    totoken DECIMAL(18,6),
    swaptime INT,
    tranHsh CHAR(66),
    swapgas INT,
    _tip DECIMAL(18,6),
    _scid INT)
BEGIN
    -- 检查记录是否存在，避免重复插入
    IF NOT EXISTS (SELECT 1 FROM t_t2t WHERE tran_hash = tranHsh) THEN
        -- 插入新记录
        INSERT INTO t_t2t (
            block_num,
            from_dao_id,
            to_dao_id,
            from_utoken_cost,
            to_utoken_cost,
            from_address,
            to_address,
            from_token,
            to_token,
            swap_time,
            tran_hash,
            swap_gas,
            tipAmount,
            sc_id
        ) 
        VALUES (
            blocknum,
            fromdaoid,
            todaoid,
            fromutokencost,
            toutokencost,
            fromaddress,
            toaddress,
            fromtoken,
            totoken,
            swaptime,
            tranHsh,
            swapgas,
            _tip,
            _scid
        );
    END IF;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for i_t2u
-- ----------------------------
DROP PROCEDURE IF EXISTS `i_t2u`;
delimiter ;;
CREATE PROCEDURE `i_t2u`(blocknum BIGINT,
    fromTokenId INT,
    utokencost DECIMAL(18,6),
    fromaddress CHAR(42),
    toaddress CHAR(42),
    utokenamount DECIMAL(18,6),
    tokenamount DECIMAL(18,6),
    swaptime INT,
    tranHash CHAR(66),
    swapgas INT,
    _tip DECIMAL(18,6))
BEGIN
    -- 检查记录是否已存在
    IF NOT EXISTS (SELECT 1 FROM t_t2u WHERE tran_hash = tranHash) THEN
        -- 插入新记录
        INSERT INTO t_t2u (
            block_num, from_token_id, utoken_cost, from_address, to_address, 
            utoken_amount, token_amount, swap_time, tran_hash, swap_gas, tipAmount
        )  
        VALUES (
            blocknum, fromTokenId, utokencost, fromaddress, toaddress, 
            utokenamount, tokenamount, swaptime, tranHash, swapgas, _tip
        );
    END IF;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for i_token
-- ----------------------------
DROP PROCEDURE IF EXISTS `i_token`;
delimiter ;;
CREATE PROCEDURE `i_token`(daoid int,tokenid int,blocknum bigint,daotime int)
BEGIN
	if not exists(select * from t_token where block_num=blocknum) then
	INSERT INTO t_token(dao_id,token_id,block_num,dao_time) VALUES(daoid,tokenid,blocknum,daotime);
	end if;
    END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for i_u2t
-- ----------------------------
DROP PROCEDURE IF EXISTS `i_u2t`;
delimiter ;;
CREATE PROCEDURE `i_u2t`(blocknum BIGINT,
    tokenId INT,
    utokencost DECIMAL(18,6),
    fromaddress CHAR(42),
    toaddress CHAR(42),
    utokenamount DECIMAL(18,6),
    tokenamount DECIMAL(18,6),
    swaptime INT,
    tranHash CHAR(66),
    swapgas INT,
    _tip DECIMAL(18,6))
BEGIN
    -- 使用 NOT EXISTS 来检查 tranHash 是否存在，若不存在则插入数据
    IF NOT EXISTS(SELECT 1 FROM t_u2t WHERE tran_hash = tranHash) THEN
        INSERT INTO t_u2t (
            block_num, token_id, utoken_cost, from_address, to_address, 
            utoken_amount, token_amount, swap_time, tran_hash, swap_gas, tipAmount
        ) 
        VALUES (
            blocknum, tokenId, utokencost, fromaddress, toaddress, 
            utokenamount, tokenamount, swaptime, tranHash, swapgas, _tip
        );
    END IF;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for recover_follow
-- ----------------------------
DROP PROCEDURE IF EXISTS `recover_follow`;
delimiter ;;
CREATE PROCEDURE `recover_follow`(new_account varchar(256),old_account varchar(256))
BEGIN
    
    declare _user_url varchar(256);
    declare _user_avatar varchar(256);
    declare _user_inbox varchar(256);
    
    SELECT actor_url,avatar,REPLACE(actor_url,'users','inbox') into _user_url,_user_avatar,_user_inbox  FROM a_account WHERE actor_account=new_account;
    
    -- 我关注了谁
    update a_follow set user_url=_user_url,user_avatar=_user_avatar,user_inbox=_user_inbox,user_account=new_account where user_account=old_account;
    -- 谁关注了我
    UPDATE a_follow SET actor_url=_user_url,actor_avatar=_user_avatar,actor_inbox=_user_inbox,actor_account=new_account WHERE actor_account=old_account;
    
    
    END
;;
delimiter ;

-- ----------------------------
-- Event structure for day_event
-- ----------------------------
DROP EVENT IF EXISTS `day_event`;
delimiter ;;
CREATE EVENT `day_event`
ON SCHEDULE
EVERY '1' DAY STARTS '2024-04-01 00:00:00'
DO BEGIN
	    UPDATE a_messagesc SET end_time=DATE_ADD(end_time, INTERVAL 7 DAY),start_time=DATE_ADD(start_time, INTERVAL 7 DAY)  WHERE time_event>0 AND NOW()>end_time and receive_account is null;
	    update t_pro set is_end=2 where (createTime + lifetime - UNIX_TIMESTAMP())<0;
	    delete from a_message where DATEDIFF(NOW(), createtime)>730;
	    DELETE FROM a_messagesc WHERE DATEDIFF(NOW(), createtime)>730;
	    update t_pro set is_end=3 where is_end=0 and createTime+ lifetime - UNIX_TIMESTAMP()<0;
	   
	    
	END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table a_message
-- ----------------------------
DROP TRIGGER IF EXISTS `delmessage`;
delimiter ;;
CREATE TRIGGER `delmessage` AFTER DELETE ON `a_message` FOR EACH ROW BEGIN
	delete from a_message_commont where pid=old.id;
	DELETE FROM a_bookmark WHERE pid=old.id;
	DELETE FROM a_heart WHERE pid=old.id;
    END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table a_message_commont
-- ----------------------------
DROP TRIGGER IF EXISTS `commont_insert`;
delimiter ;;
CREATE TRIGGER `commont_insert` AFTER INSERT ON `a_message_commont` FOR EACH ROW BEGIN
	UPDATE a_message SET reply_time=NOW(),total=total+1 WHERE message_id=new.ppid;
	
    END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table a_messagesc
-- ----------------------------
DROP TRIGGER IF EXISTS `delmessagesc`;
delimiter ;;
CREATE TRIGGER `delmessagesc` AFTER DELETE ON `a_messagesc` FOR EACH ROW BEGIN
	delete from a_messagesc_commont where pid=old.id;
	DELETE FROM a_bookmarksc WHERE pid=old.id;
	DELETE FROM a_heartsc WHERE pid=old.id;
    END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table a_messagesc_commont
-- ----------------------------
DROP TRIGGER IF EXISTS `commontsc_insert`;
delimiter ;;
CREATE TRIGGER `commontsc_insert` AFTER INSERT ON `a_messagesc_commont` FOR EACH ROW BEGIN
	UPDATE a_messagesc SET reply_time=NOW(),total=total+1 WHERE message_id=new.ppid;
    END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table t_dao
-- ----------------------------
DROP TRIGGER IF EXISTS `dao_insert`;
delimiter ;;
CREATE TRIGGER `dao_insert` AFTER INSERT ON `t_dao` FOR EACH ROW BEGIN
    
    if(new.sctype!='dapp' and new.sctype!='EIP') then 
	if not exists( select * from a_eip_type where type_name=new.sctype) then 
		insert into a_eip_type(type_name,type_desc) values(new.sctype,new.sctype);
	end if;
    end if;
    END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table t_daoaccount
-- ----------------------------
DROP TRIGGER IF EXISTS `daoaccount_insert`;
delimiter ;;
CREATE TRIGGER `daoaccount_insert` AFTER INSERT ON `t_daoaccount` FOR EACH ROW BEGIN
    -- 尝试先查找对应的记录
    DECLARE existing_votes INT;
     DECLARE _daoid INT;
    SELECT member_votes INTO existing_votes FROM t_daodetail 
    WHERE delegator = NEW.delegator AND member_address = NEW.account
    LIMIT 1;
    -- 如果没有找到记录，插入新的记录
    IF existing_votes IS NULL THEN
	select dao_id into _daoid from t_dao where delegator= NEW.delegator;
        INSERT INTO t_daodetail (member_votes, member_address, delegator,dao_id) 
        VALUES (NEW.dividendRights, NEW.account, NEW.delegator,_daoid);
    -- 如果已有记录，进行相应的更新或删除
    ELSE
        IF NEW.dividendRights = 0 THEN
            DELETE FROM t_daodetail 
            WHERE delegator = NEW.delegator AND member_address = NEW.account;
        ELSE
            UPDATE t_daodetail 
            SET member_votes = NEW.dividendRights 
            WHERE delegator = NEW.delegator AND member_address = NEW.account;
        END IF;
    END IF;
END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table t_domain
-- ----------------------------
DROP TRIGGER IF EXISTS `domain_trigger`;
delimiter ;;
CREATE TRIGGER `domain_trigger` AFTER INSERT ON `t_domain` FOR EACH ROW BEGIN
    DECLARE _name VARCHAR(256);
    DECLARE _manager CHAR(42);
    DECLARE _dao_logo VARCHAR(128);
    DECLARE _desc TEXT;
    -- 获取对应的 DAO 信息
    SELECT dao_symbol, dao_manager, dao_logo, dao_desc
    INTO _name, _manager, _dao_logo, _desc
    FROM t_dao
    WHERE dao_id = NEW.dao_id;
    -- 检查是否已经存在对应的记录
    IF NOT EXISTS (
        SELECT 1 
        FROM a_account 
        WHERE dao_id = NEW.dao_id
    ) THEN
        -- 插入新记录
        INSERT INTO a_account (
            block_num,
            dao_id,
            domain,
            manager,
            pubkey,
            privkey,
            actor_account,
            actor_url,
            avatar,
            createtime,
            actor_name,
            actor_desc
        )
        VALUES (
            NEW.block_num,
            NEW.dao_id,
            NEW.domain,
            _manager,
            NEW.pubkey,
            NEW.privkey,
            CONCAT(_name, '@', NEW.domain),
            CONCAT('https://', NEW.domain, '/api/activitepub/users/', _name),
            _dao_logo,
            FROM_UNIXTIME(NEW._time), -- 简化时间处理
            _name,
            _desc
        );
    ELSE
        -- 更新已有记录
        UPDATE a_account
        SET 
            block_num = NEW.block_num,
            domain = NEW.domain,
            actor_account = CONCAT(_name, '@', NEW.domain),
            actor_url = CONCAT('https://', NEW.domain, '/api/activitepub/users/', _name),
            avatar = _dao_logo,
            createtime = FROM_UNIXTIME(NEW._time)
        WHERE dao_id = NEW.dao_id AND block_num <= NEW.block_num;
    END IF;
END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table t_domainsing
-- ----------------------------
DROP TRIGGER IF EXISTS `daomainsing_trigger`;
delimiter ;;
CREATE TRIGGER `daomainsing_trigger` AFTER INSERT ON `t_domainsing` FOR EACH ROW BEGIN
    -- 检查是否存在匹配的记录
    IF NOT EXISTS (
        SELECT 1
        FROM a_account
        WHERE dao_id = 0 AND manager = NEW.addr
    ) THEN
        -- 插入新记录
        INSERT INTO a_account (
            block_num,
            dao_id,
            domain,
            manager,
            pubkey,
            privkey,
            actor_account,
            actor_url,
            avatar,
            createtime,
            actor_name,
            actor_desc
        )
        VALUES (
            NEW.block_num,
            0,
            NEW.domain,
            NEW.addr,
            NEW.pubkey,
            NEW.privkey,
            CONCAT(NEW.nick_name, '@', NEW.domain),
            CONCAT('https://', NEW.domain, '/api/activitepub/users/', NEW.nick_name),
            CONCAT('https://', NEW.domain, '/user.svg'),
            FROM_UNIXTIME(NEW._time), -- 简化时间处理
            NEW.nick_name,
            ''
        );
    ELSE
        -- 更新已有记录
        UPDATE a_account
        SET 
            actor_name = NEW.nick_name,
            block_num = NEW.block_num,
            domain = NEW.domain,
            actor_account = CONCAT(NEW.nick_name, '@', NEW.domain),
            actor_url = CONCAT('https://', NEW.domain, '/api/activitepub/users/', NEW.nick_name),
            createtime = FROM_UNIXTIME(NEW._time)
        WHERE dao_id = 0 AND manager = NEW.addr AND block_num <= NEW.block_num;
    END IF;
END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table t_e2t
-- ----------------------------
DROP TRIGGER IF EXISTS `e2t_insert`;
delimiter ;;
CREATE TRIGGER `e2t_insert` AFTER INSERT ON `t_e2t` FOR EACH ROW BEGIN
    DECLARE _out VARCHAR(128);
    
    -- 获取 token_symbol
    SELECT dao_symbol INTO _out 
    FROM v_token 
    WHERE token_id = NEW.token_id;
    
    -- 更新 t_dao 表
    UPDATE t_dao 
    SET utoken_cost = NEW.utoken_cost 
    WHERE dao_id = (SELECT dao_id FROM t_token WHERE token_id = NEW.token_id);
    
    -- 检查 tran_hash 是否存在
    IF NOT EXISTS(SELECT 1 FROM t_swap WHERE tran_hash = NEW.tran_hash) THEN
        -- 插入到 t_swap 表
        INSERT INTO t_swap (
            block_num,
            tran_hash,
            title,
            in_amount,
            out_amount,
            swap_address,
            swap_time,
            in_str,
            out_str,
            tipAmount,
            tip_str
        ) 
        VALUES (
            NEW.block_num,
            NEW.tran_hash,
            'ETH->token',
            NEW.in_amount,
            NEW.out_amount,
            NEW.from_address,
            FROM_UNIXTIME(NEW.swap_time),  -- 简化时间格式化
            CONCAT(TRIM(TRAILING '0' FROM FORMAT(NEW.in_amount, 8)), ' ETH'),
            CONCAT(TRIM(TRAILING '0' FROM FORMAT(NEW.out_amount, 8)), ' ', _out),
            NEW.tipAmount,
            CASE WHEN NEW.tipAmount > 0 THEN _out ELSE '' END
        );
    END IF;
    
    -- 执行排名更新
    CALL excuteRank();
END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table t_eth_utoken
-- ----------------------------
DROP TRIGGER IF EXISTS `e2u_insert`;
delimiter ;;
CREATE TRIGGER `e2u_insert` AFTER INSERT ON `t_eth_utoken` FOR EACH ROW BEGIN
    -- 检查 tran_hash 是否已存在
    IF NOT EXISTS(SELECT 1 FROM t_swap WHERE tran_hash = NEW.tran_hash) THEN
        -- 插入新的记录到 t_swap
        INSERT INTO t_swap (
            block_num,
            tran_hash,
            title,
            in_amount,
            out_amount,
            swap_address,
            swap_time,
            in_str,
            out_str
        ) 
        VALUES (
            NEW.block_num,
            NEW.tran_hash,
            'ETH->UTO',
            NEW.swap_eth,
            NEW.swap_utoken,
            NEW.swap_address,
            FROM_UNIXTIME(NEW.swap_time),  -- 简化时间格式化
            CONCAT(TRIM(TRAILING '0' FROM FORMAT(NEW.swap_eth, 8)), ' ETH'),
            CONCAT(TRIM(TRAILING '0' FROM FORMAT(NEW.swap_utoken, 8)), ' UTO')
        );
    END IF;
END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table t_nft
-- ----------------------------
DROP TRIGGER IF EXISTS `nft_trigger`;
delimiter ;;
CREATE TRIGGER `nft_trigger` AFTER INSERT ON `t_nft` FOR EACH ROW BEGIN
    -- 检查记录是否已存在于 t_mynft 表中
    IF NOT EXISTS(
        SELECT 1 
        FROM t_mynft 
        WHERE token_id = NEW.token_id 
          AND _type = 1 
          AND contract_address = NEW.contract_address
    ) THEN
        -- 插入新记录到 t_mynft 表
        INSERT INTO t_mynft (
            to_address,
            token_id,
            _time,
            template_id,
            dao_id,
            tokensvg,
            contract_address,
            block_num,
            _type,
            tips
        ) 
        VALUES (
            NEW.token_to,
            NEW.token_id,
            FROM_UNIXTIME(NEW._time), -- 简化时间格式化
            0, -- 默认 template_id
            NEW.dao_id,
            NEW.tokensvg,
            NEW.contract_address,
            NEW.block_num,
            1, -- _type 表示 NFT 类型为 1
            NEW.tips
        );
    END IF;
END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table t_nft_mint
-- ----------------------------
DROP TRIGGER IF EXISTS `nft_mint_trigger`;
delimiter ;;
CREATE TRIGGER `nft_mint_trigger` AFTER INSERT ON `t_nft_mint` FOR EACH ROW BEGIN
    -- 检查记录是否存在于 t_mynft 表中
    IF NOT EXISTS(
        SELECT 1 
        FROM t_mynft 
        WHERE token_id = NEW.token_id 
          AND _type = 3 
          AND contract_address = NEW.contract_address
    ) THEN
        -- 插入新记录到 t_mynft 表
        INSERT INTO t_mynft (
            to_address,
            token_id,
            _time,
            template_id,
            dao_id,
            tokensvg,
            contract_address,
            block_num,
            _type,
            tips
        ) 
        VALUES (
            NEW.token_to,
            NEW.token_id,
            FROM_UNIXTIME(NEW._time), -- 简化时间格式化
            0,
            NEW.dao_id,
            NEW.tokensvg,
            NEW.contract_address,
            NEW.block_num,
            3,
            'A Smart Common minted'
        );
    END IF;
END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table t_nft_swap
-- ----------------------------
DROP TRIGGER IF EXISTS `nft_swap_trigger`;
delimiter ;;
CREATE TRIGGER `nft_swap_trigger` AFTER INSERT ON `t_nft_swap` FOR EACH ROW BEGIN
    -- 检查记录是否已经存在于 t_mynft 表中
    IF NOT EXISTS(
        SELECT 1 
        FROM t_mynft 
        WHERE token_id = NEW.token_id 
          AND _type = 2 
          AND contract_address = NEW.contract_address
    ) THEN
        -- 插入新记录到 t_mynft 表
        INSERT INTO t_mynft (
            to_address,
            token_id,
            _time,
            template_id,
            dao_id,
            tokensvg,
            contract_address,
            block_num,
            _type,
            tips
        ) 
        VALUES (
            NEW.token_to,
            NEW.token_id,
            FROM_UNIXTIME(NEW._time), -- 简化时间格式化处理
            0,
            NEW.dao_id,
            NEW.tokensvg,
            NEW.contract_address,
            NEW.block_num,
            2,
            CONCAT('Tipping (UTO', NEW.utoken, ')') -- 优化 CONCAT 语法
        );
    END IF;
END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table t_nft_swaphonor
-- ----------------------------
DROP TRIGGER IF EXISTS `nft_swaphonor_trigger`;
delimiter ;;
CREATE TRIGGER `nft_swaphonor_trigger` AFTER INSERT ON `t_nft_swaphonor` FOR EACH ROW BEGIN
    -- 检查记录是否已存在于 t_mynft 表中
    IF NOT EXISTS(
        SELECT 1 
        FROM t_mynft 
        WHERE token_id = NEW.token_id 
          AND _type = 4 
          AND contract_address = NEW.contract_address
    ) THEN
        -- 插入新记录到 t_mynft 表
        INSERT INTO t_mynft (
            to_address,
            token_id,
            _time,
            template_id,
            dao_id,
            tokensvg,
            contract_address,
            block_num,
            _type,
            tips
        ) 
        VALUES (
            NEW.token_to,
            NEW.token_id,
            FROM_UNIXTIME(NEW._time), -- 简化时间格式化处理
            0,
            NEW.dao_id,
            NEW.tokensvg,
            NEW.contract_address,
            NEW.block_num,
            4,
            NEW.tips -- 直接引用 NEW.tips，无需额外处理
        );
    END IF;
END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table t_nft_transfer
-- ----------------------------
DROP TRIGGER IF EXISTS `nft_transfer_trigger`;
delimiter ;;
CREATE TRIGGER `nft_transfer_trigger` AFTER INSERT ON `t_nft_transfer` FOR EACH ROW BEGIN
    -- 检查记录是否已存在于 t_mynft 表中
    IF NOT EXISTS(
        SELECT 1 
        FROM t_mynft 
        WHERE token_id = NEW.token_id 
          AND _type = 0 
          AND contract_address = NEW.contract_address
    ) THEN
        -- 插入新记录到 t_mynft 表
        INSERT INTO t_mynft (
            to_address,
            token_id,
            _time,
            template_id,
            dao_id,
            tokensvg,
            contract_address,
            block_num,
            _type,
            tips
        ) 
        VALUES (
            NEW.token_to,
            NEW.token_id,
            FROM_UNIXTIME(NEW._time), -- 简化时间格式化
            0, -- template_id 默认值
            0, -- dao_id 默认值
            NEW.tokensvg,
            NEW.contract_address,
            NEW.block_num,
            0, -- _type 表示普通转移
            '50Satoshis' -- 提示信息
        );
    END IF;
END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table t_t2t
-- ----------------------------
DROP TRIGGER IF EXISTS `t2t_regisster`;
delimiter ;;
CREATE TRIGGER `t2t_regisster` AFTER INSERT ON `t_t2t` FOR EACH ROW BEGIN
    DECLARE _in VARCHAR(128);
    DECLARE _out VARCHAR(128);
    DECLARE _sc VARCHAR(128); -- 打赏 sc_id
    -- 更新 DAO 的 utoken_cost
    UPDATE t_dao 
    SET utoken_cost = NEW.from_utoken_cost 
    WHERE dao_id = (SELECT dao_id FROM t_token WHERE token_id = NEW.from_dao_id);
    
    UPDATE t_dao 
    SET utoken_cost = NEW.to_utoken_cost 
    WHERE dao_id = (SELECT dao_id FROM t_token WHERE token_id = NEW.to_dao_id);
    -- 检查是否已存在相同的交易
    IF NOT EXISTS (SELECT 1 FROM t_swap WHERE tran_hash = NEW.tran_hash) THEN
        -- 获取相应的 dao_symbol
        SELECT dao_symbol INTO _in FROM v_token WHERE token_id = NEW.from_dao_id;
        SELECT dao_symbol INTO _out FROM v_token WHERE token_id = NEW.to_dao_id;
        SELECT dao_symbol INTO _sc FROM v_token WHERE token_id = NEW.sc_id;
        -- 插入 t_swap 表
        INSERT INTO t_swap (
            block_num, 
            tran_hash, 
            title, 
            in_amount, 
            out_amount, 
            swap_address, 
            swap_time, 
            in_str, 
            out_str, 
            tipAmount, 
            tip_str
        ) 
        VALUES (
            NEW.block_num, 
            NEW.tran_hash, 
            'token->token', 
            NEW.from_token, 
            NEW.to_token, 
            NEW.to_address, 
            FROM_UNIXTIME(NEW.swap_time),  -- 简化时间格式化
            CONCAT(TRIM(TRAILING '0' FROM FORMAT(NEW.from_token, 8)), ' ', _in), 
            CONCAT(TRIM(TRAILING '0' FROM FORMAT(NEW.to_token, 8)), ' ', _out), 
            NEW.tipAmount, 
            CASE WHEN NEW.tipAmount > 0 THEN _sc ELSE '' END
        );
    END IF;
    -- 调用 excuteRank 存储过程
    CALL excuteRank();
END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table t_t2u
-- ----------------------------
DROP TRIGGER IF EXISTS `t2u_insert`;
delimiter ;;
CREATE TRIGGER `t2u_insert` AFTER INSERT ON `t_t2u` FOR EACH ROW BEGIN
    DECLARE _dao_symbol VARCHAR(128);
    -- 获取 dao_symbol
    SELECT dao_symbol INTO _dao_symbol 
    FROM v_token 
    WHERE token_id = NEW.from_token_id;
    -- 更新 t_dao 表中的 utoken_cost
    UPDATE t_dao 
    SET utoken_cost = NEW.utoken_cost 
    WHERE dao_id = (SELECT dao_id FROM t_token WHERE token_id = NEW.from_token_id);
    -- 检查是否需要插入到 t_swap 表
    IF NOT EXISTS (SELECT 1 FROM t_swap WHERE tran_hash = NEW.tran_hash) THEN
        -- 插入到 t_swap 表
        INSERT INTO t_swap (
            block_num, tran_hash, title, in_amount, out_amount, swap_address, swap_time, 
            in_str, out_str, tipAmount, tip_str
        ) 
        VALUES (
            NEW.block_num, 
            NEW.tran_hash, 
            'token->UTO', 
            NEW.token_amount, 
            NEW.utoken_amount, 
            NEW.to_address, 
            FROM_UNIXTIME(NEW.swap_time), -- 简化日期格式化
            CONCAT(TRIM(TRAILING '0' FROM FORMAT(NEW.token_amount, 8)), ' ', _dao_symbol), 
            CONCAT(TRIM(TRAILING '0' FROM FORMAT(NEW.utoken_amount, 8)), ' UTO'), 
            NEW.tipAmount, 
            CASE WHEN NEW.tipAmount > 0 THEN _dao_symbol ELSE '' END
        );
    END IF;
    -- 调用存储过程 excuteRank
    CALL excuteRank();
END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table t_u2t
-- ----------------------------
DROP TRIGGER IF EXISTS `u2t_insert`;
delimiter ;;
CREATE TRIGGER `u2t_insert` AFTER INSERT ON `t_u2t` FOR EACH ROW BEGIN
    DECLARE _dao_symbol VARCHAR(128);
    -- 更新 t_dao 表中的 utoken_cost
    UPDATE t_dao 
    SET utoken_cost = NEW.utoken_cost 
    WHERE dao_id = (SELECT dao_id FROM t_token WHERE token_id = NEW.token_id);
    -- 检查是否需要插入到 t_swap 表
    IF NOT EXISTS (SELECT 1 FROM t_swap WHERE tran_hash = NEW.tran_hash) THEN
        -- 获取 dao_symbol
        SELECT dao_symbol INTO _dao_symbol 
        FROM v_token 
        WHERE token_id = NEW.token_id;
        -- 插入到 t_swap 表
        INSERT INTO t_swap (
            block_num, tran_hash, title, in_amount, out_amount, swap_address, swap_time, 
            in_str, out_str, tipAmount, tip_str
        ) 
        VALUES (
            NEW.block_num, 
            NEW.tran_hash, 
            'UTO->token', 
            NEW.utoken_amount, 
            NEW.token_amount, 
            NEW.to_address, 
            FROM_UNIXTIME(NEW.swap_time),  -- 简化日期格式化
            CONCAT(TRIM(TRAILING '0' FROM FORMAT(NEW.utoken_amount, 8)), ' UTO'), 
            CONCAT(TRIM(TRAILING '0' FROM FORMAT(NEW.token_amount, 8)), ' ', _dao_symbol), 
            NEW.tipAmount, 
            CASE WHEN NEW.tipAmount > 0 THEN _dao_symbol ELSE '' END
        );
    END IF;
    -- 调用存储过程 excuteRank
    CALL excuteRank();
END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table t_updatedaocreator
-- ----------------------------
DROP TRIGGER IF EXISTS `ucreator_tigger`;
delimiter ;;
CREATE TRIGGER `ucreator_tigger` AFTER INSERT ON `t_updatedaocreator` FOR EACH ROW BEGIN
    
    update t_dao set creator=new.creator where dao_id=new.dao_id;
    END
;;
delimiter ;

SET FOREIGN_KEY_CHECKS = 1;
