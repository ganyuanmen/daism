/*
 Navicat Premium Dump SQL

 Source Server         : qqq
 Source Server Type    : MySQL
 Source Server Version : 80040 (8.0.40)
 Source Host           : localhost:3306
 Source Schema         : dao_db

 Target Server Type    : MySQL
 Target Server Version : 80040 (8.0.40)
 File Encoding         : 65001

 Date: 27/11/2024 12:46:22
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for a_account
-- ----------------------------
DROP TABLE IF EXISTS `a_account`;
CREATE TABLE `a_account`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `block_num` bigint NULL DEFAULT NULL COMMENT '用于对比更新最后的',
  `dao_id` int NULL DEFAULT NULL,
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
  UNIQUE INDEX `acount`(`actor_account` ASC) USING BTREE,
  UNIQUE INDEX `block_num`(`block_num` ASC) USING BTREE,
  UNIQUE INDEX `manager`(`dao_id` ASC, `manager` ASC) USING BTREE,
  UNIQUE INDEX `actor_url`(`actor_url` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of a_account
-- ----------------------------

-- ----------------------------
-- Table structure for a_bookmark
-- ----------------------------
DROP TABLE IF EXISTS `a_bookmark`;
CREATE TABLE `a_bookmark`  (
  `pid` int NOT NULL COMMENT '发文ID',
  `account` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '收藏人帐号',
  PRIMARY KEY (`account`, `pid`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of a_bookmark
-- ----------------------------

-- ----------------------------
-- Table structure for a_bookmarksc
-- ----------------------------
DROP TABLE IF EXISTS `a_bookmarksc`;
CREATE TABLE `a_bookmarksc`  (
  `pid` int NOT NULL COMMENT '发文ID',
  `account` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '收藏帐号',
  PRIMARY KEY (`account`, `pid`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of a_bookmarksc
-- ----------------------------

-- ----------------------------
-- Table structure for a_domain
-- ----------------------------
DROP TABLE IF EXISTS `a_domain`;
CREATE TABLE `a_domain`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `daomain` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '域名',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of a_domain
-- ----------------------------

-- ----------------------------
-- Table structure for a_eip_type
-- ----------------------------
DROP TABLE IF EXISTS `a_eip_type`;
CREATE TABLE `a_eip_type`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `type_name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT 'smart common 类型名称',
  `type_desc` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '类型描述',
  `_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `relay_type` tinyint NULL DEFAULT NULL COMMENT '1 链上确认',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `type_name`(`type_name` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of a_eip_type
-- ----------------------------

-- ----------------------------
-- Table structure for a_follow
-- ----------------------------
DROP TABLE IF EXISTS `a_follow`;
CREATE TABLE `a_follow`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `follow_id` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '关注ID 唯一',
  `actor_account` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '被关注帐号',
  `actor_url` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '被关注url',
  `actor_inbox` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '被关注信箱',
  `actor_avatar` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '被关注头像',
  `user_account` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '主动关注帐号',
  `user_url` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '主动关注帐号url',
  `user_avatar` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '主动关注者头像',
  `user_inbox` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '主动关注者信箱',
  `createtime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `follow_id`(`follow_id` ASC) USING BTREE,
  UNIQUE INDEX `idd`(`actor_account` ASC, `user_account` ASC) USING BTREE,
  INDEX `user_account`(`user_account` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of a_follow
-- ----------------------------

-- ----------------------------
-- Table structure for a_heart
-- ----------------------------
DROP TABLE IF EXISTS `a_heart`;
CREATE TABLE `a_heart`  (
  `pid` int NOT NULL COMMENT '发文ID',
  `account` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '点赞人',
  PRIMARY KEY (`account`, `pid`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of a_heart
-- ----------------------------

-- ----------------------------
-- Table structure for a_heartsc
-- ----------------------------
DROP TABLE IF EXISTS `a_heartsc`;
CREATE TABLE `a_heartsc`  (
  `pid` int NOT NULL COMMENT '发文ID',
  `account` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '点赞人',
  PRIMARY KEY (`account`, `pid`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of a_heartsc
-- ----------------------------

-- ----------------------------
-- Table structure for a_message
-- ----------------------------
DROP TABLE IF EXISTS `a_message`;
CREATE TABLE `a_message`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
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
  `is_send` tinyint NULL DEFAULT 1 COMMENT '允许推送给关注组',
  `is_discussion` tinyint NULL DEFAULT 1 COMMENT '允许评论',
  `top_img` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '头部图片url地址',
  `receive_account` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '',
  `send_type` tinyint NULL DEFAULT 0 COMMENT '0 本地，1 推送',
  `createtime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `reply_time` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `message_id`(`message_id` ASC, `receive_account` ASC) USING BTREE,
  INDEX `actor_account`(`actor_account` ASC) USING BTREE,
  INDEX `send_type`(`send_type` ASC, `receive_account` ASC) USING BTREE,
  INDEX `dao_id`(`send_type` ASC) USING BTREE,
  INDEX `receive_account`(`receive_account` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of a_message
-- ----------------------------

-- ----------------------------
-- Table structure for a_message_commont
-- ----------------------------
DROP TABLE IF EXISTS `a_message_commont`;
CREATE TABLE `a_message_commont`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `pid` int UNSIGNED NULL DEFAULT NULL COMMENT '父ID',
  `message_id` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '回复/接收r的发文ID,唯一',
  `manager` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '钱包地址',
  `actor_name` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '昵称',
  `avatar` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '头像',
  `actor_account` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '创建/发送帐号',
  `actor_url` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '创建/发送帐号',
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '内容',
  `createtime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `message_id`(`message_id` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of a_message_commont
-- ----------------------------

-- ----------------------------
-- Table structure for a_messagesc
-- ----------------------------
DROP TABLE IF EXISTS `a_messagesc`;
CREATE TABLE `a_messagesc`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `actor_id` int NULL DEFAULT 0 COMMENT '发布帐号ID',
  `dao_id` bigint NULL DEFAULT 0,
  `title` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '标题',
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '内容',
  `is_send` tinyint NULL DEFAULT 1 COMMENT '允许推送给关注组',
  `is_discussion` tinyint NULL DEFAULT 1 COMMENT '允许评论',
  `top_img` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '头部图片url地址',
  `start_time` datetime NULL DEFAULT NULL COMMENT '活动的开始时间',
  `end_time` datetime NULL DEFAULT NULL COMMENT '活动的结束时间',
  `event_url` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '活动网站主页',
  `event_address` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '活动地址',
  `time_event` tinyint NULL DEFAULT -1 COMMENT '活动定时活动,星期几',
  `_type` tinyint NULL DEFAULT 0 COMMENT '0:普通 1:活动',
  `reply_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '回复时间，用于排序',
  `createtime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `message_id` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `_type`(`_type` ASC) USING BTREE,
  INDEX `dao_id`(`dao_id` ASC) USING BTREE,
  INDEX `reply_time`(`reply_time` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of a_messagesc
-- ----------------------------

-- ----------------------------
-- Table structure for a_messagesc_commont
-- ----------------------------
DROP TABLE IF EXISTS `a_messagesc_commont`;
CREATE TABLE `a_messagesc_commont`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `pid` int UNSIGNED NULL DEFAULT NULL COMMENT '父ID',
  `message_id` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '回复/接收r的发文ID,唯一',
  `manager` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '钱包地址',
  `actor_name` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '昵称',
  `avatar` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '头像',
  `actor_account` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '创建/发送帐号',
  `actor_url` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '创建/发送帐号',
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '内容',
  `createtime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `message_id`(`message_id` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of a_messagesc_commont
-- ----------------------------

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
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

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
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of aux_tree
-- ----------------------------
INSERT INTO `aux_tree` VALUES ('actor', 'select id,dao_id,actor_name,domain,manager,actor_account,actor_url,avatar,actor_desc from a_account where manager=? and dao_id=0', '地址获帐号/dao_id=0是个人帐号');
INSERT INTO `aux_tree` VALUES ('actorbyid', 'select id,dao_id,actor_name,domain,manager,actor_account,actor_url,avatar,actor_desc from a_account where id=?', 'id 获个人帐号');
INSERT INTO `aux_tree` VALUES ('checkdao', 'SELECT a.id,b.dao_name,c.dao_symbol,d.creator FROM (SELECT 1 id) a LEFT JOIN (SELECT dao_name FROM t_dao WHERE dao_name=?) b ON 1=1 LEFT JOIN (SELECT dao_symbol FROM t_dao WHERE dao_symbol=?) c ON 1=1 LEFT JOIN (SELECT creator FROM t_dao WHERE creator=?) d ON 1=1', '检测dao 是否存在');
INSERT INTO `aux_tree` VALUES ('daoactor', 'SELECT a.*,b.actor_account,b.actor_url,b.domain FROM v_dao a LEFT JOIN a_account b ON a.dao_id=b.dao_id WHERE a.dao_id IN(SELECT dao_id FROM t_daodetail WHERE member_address=?)', '地址->所在的智能化器');
INSERT INTO `aux_tree` VALUES ('daoactorbyid', 'SELECT a.*,b.actor_account,b.actor_url,b.domain FROM v_dao a LEFT JOIN a_account b ON a.dao_id=b.dao_id WHERE a.dao_id IN(SELECT dao_id FROM t_daodetail WHERE member_address=(SELECT manager FROM a_account WHERE id=?))', 'id->所在智能公器');
INSERT INTO `aux_tree` VALUES ('daodatabyid', 'SELECT a.*,b.actor_account,b.actor_url,b.domain FROM v_dao a LEFT JOIN a_account b ON a.dao_id=b.dao_id WHERE a.dao_id=?', NULL);
INSERT INTO `aux_tree` VALUES ('daomember', 'SELECT a.member_address,b.actor_url,b.actor_account,b.avatar FROM t_daodetail a LEFT JOIN (SELECT * FROM a_account WHERE dao_id=0) b ON a.`member_address`=b.manager WHERE a.dao_id=?', 'dao 下所有成员');
INSERT INTO `aux_tree` VALUES ('fllower', 'SELECT user_account account,user_url url,user_avatar avatar,user_inbox inbox,createtime,follow_id,id FROM v_follow WHERE actor_account=(SELECT actor_account FROM a_account WHERE dao_id=?)', '按daoid 找谁关注我');
INSERT INTO `aux_tree` VALUES ('follow0', 'SELECT actor_account account,actor_url url,actor_avatar avatar,actor_inbox inbox,createtime,follow_id,id FROM v_follow WHERE user_account=?', '我关注了谁集合');
INSERT INTO `aux_tree` VALUES ('follow1', 'SELECT user_account account,user_url url,user_avatar avatar,user_inbox inbox,createtime,follow_id,id FROM v_follow WHERE actor_account=?', '谁关注了我集合');
INSERT INTO `aux_tree` VALUES ('getnft', 'select count(*) as total from t_nft_transfer', NULL);
INSERT INTO `aux_tree` VALUES ('minttime', 'SELECT TIMESTAMPDIFF(MINUTE, in_time, NOW()) AS minttime FROM t_nft_transfer ORDER BY in_time LIMIT 1', NULL);

-- ----------------------------
-- Table structure for t_ad
-- ----------------------------
DROP TABLE IF EXISTS `t_ad`;
CREATE TABLE `t_ad`  (
  `id` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of t_ad
-- ----------------------------

-- ----------------------------
-- Table structure for t_changelogo
-- ----------------------------
DROP TABLE IF EXISTS `t_changelogo`;
CREATE TABLE `t_changelogo`  (
  `dao_id` int NOT NULL COMMENT 'dao id',
  `block_num` bigint NOT NULL COMMENT '区块号',
  `dao_time` int NULL DEFAULT NULL COMMENT '时间戳',
  `logo_id` int NULL DEFAULT NULL,
  `dao_logo` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `block_num`(`block_num` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of t_changelogo
-- ----------------------------

-- ----------------------------
-- Table structure for t_createversion
-- ----------------------------
DROP TABLE IF EXISTS `t_createversion`;
CREATE TABLE `t_createversion`  (
  `block_num` bigint UNSIGNED NOT NULL,
  `dao_id` int NULL DEFAULT NULL,
  `creator` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `dao_version` int NULL DEFAULT NULL,
  `_time` int NULL DEFAULT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `block_num`(`block_num` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of t_createversion
-- ----------------------------

-- ----------------------------
-- Table structure for t_dao
-- ----------------------------
DROP TABLE IF EXISTS `t_dao`;
CREATE TABLE `t_dao`  (
  `dao_id` int NOT NULL COMMENT 'dao ID',
  `block_num` bigint NULL DEFAULT NULL COMMENT '区块号',
  `dao_name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '名称',
  `dao_symbol` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '代币名称',
  `dao_desc` varchar(4000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '描述',
  `dao_manager` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '管理员地址',
  `dao_logo` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT 'logo',
  `utoken_cost` decimal(18, 6) NULL DEFAULT 0.000000 COMMENT '币值',
  `dao_ranking` int NULL DEFAULT 0 COMMENT '排名',
  `creator` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT 'mint dao的合约地址',
  `delegator` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT 'DAO代理地址',
  `dao_exec` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '执行者',
  `dao_time` int NULL DEFAULT NULL COMMENT '时间戳',
  `strategy` int NULL DEFAULT NULL COMMENT '2的16次方',
  `lifetime` int NULL DEFAULT NULL COMMENT '寿命期（秒）',
  `cool_time` int NULL DEFAULT NULL COMMENT '冷却时间(秒)',
  `_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `dapp_owner` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT 'dapp 所有者',
  `sctype` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '智能公器类型',
  PRIMARY KEY (`dao_id`) USING BTREE,
  UNIQUE INDEX `dao_name`(`dao_name` ASC) USING BTREE,
  UNIQUE INDEX `delegator`(`delegator` ASC) USING BTREE,
  UNIQUE INDEX `dao_symbol`(`dao_symbol` ASC) USING BTREE,
  INDEX `block_num`(`block_num` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of t_dao
-- ----------------------------

-- ----------------------------
-- Table structure for t_daoaccount
-- ----------------------------
DROP TABLE IF EXISTS `t_daoaccount`;
CREATE TABLE `t_daoaccount`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `block_num` bigint UNSIGNED NOT NULL COMMENT '区块号 用于监听标记',
  `delegator` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT 'smart common 代理地址',
  `account` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '成员地址',
  `dividendRights` int NULL DEFAULT NULL COMMENT '分红，票权， 0 表示已删除',
  `dao_id` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `block_num`(`block_num` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 20 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of t_daoaccount
-- ----------------------------

-- ----------------------------
-- Table structure for t_daodetail
-- ----------------------------
DROP TABLE IF EXISTS `t_daodetail`;
CREATE TABLE `t_daodetail`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `dao_id` int NULL DEFAULT 0 COMMENT 'smart common id',
  `member_votes` int NULL DEFAULT 0 COMMENT '成员票数',
  `member_address` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '成员地址',
  `member_index` int NULL DEFAULT 0 COMMENT '成员序号,已作废',
  `member_type` tinyint NULL DEFAULT 1 COMMENT '类型:1原始，0邀请，已作废',
  `delegator` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT 'smartcommon代理地址',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `id`(`dao_id` ASC, `member_address` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 20 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of t_daodetail
-- ----------------------------

-- ----------------------------
-- Table structure for t_domain
-- ----------------------------
DROP TABLE IF EXISTS `t_domain`;
CREATE TABLE `t_domain`  (
  `block_num` bigint UNSIGNED NOT NULL COMMENT '区块号，用于监听标记',
  `dao_id` int NULL DEFAULT NULL COMMENT 'smart common id',
  `domain` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '域名',
  `pubkey` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '公钥',
  `privkey` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '私钥',
  `_time` int NULL DEFAULT NULL COMMENT '时间戳',
  PRIMARY KEY (`block_num`, `domain`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of t_domain
-- ----------------------------

-- ----------------------------
-- Table structure for t_domainsing
-- ----------------------------
DROP TABLE IF EXISTS `t_domainsing`;
CREATE TABLE `t_domainsing`  (
  `block_num` bigint NOT NULL COMMENT '区块号，用于监听标记',
  `addr` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '钱包地址',
  `domain` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '域名',
  `nick_name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '名称/昵称',
  `pubkey` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '公钥',
  `privkey` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '私钥',
  `_time` int NULL DEFAULT NULL COMMENT '时间戳',
  `id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `block_num`(`block_num` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of t_domainsing
-- ----------------------------

-- ----------------------------
-- Table structure for t_e2t
-- ----------------------------
DROP TABLE IF EXISTS `t_e2t`;
CREATE TABLE `t_e2t`  (
  `block_num` bigint NOT NULL,
  `from_address` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `to_address` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `in_amount` decimal(18, 6) NULL DEFAULT 0.000000,
  `out_amount` decimal(18, 6) NULL DEFAULT 0.000000,
  `swap_time` int NULL DEFAULT NULL,
  `_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `tran_hash` char(66) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `utoken_cost` decimal(18, 6) NULL DEFAULT 0.000000,
  `token_id` int NULL DEFAULT NULL,
  `swap_gas` int NULL DEFAULT 0,
  `tipAmount` decimal(18, 6) NULL DEFAULT NULL COMMENT '打赏uto',
  `id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `tran_hash`(`tran_hash` ASC) USING BTREE,
  INDEX `block_num`(`block_num` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of t_e2t
-- ----------------------------

-- ----------------------------
-- Table structure for t_eth_utoken
-- ----------------------------
DROP TABLE IF EXISTS `t_eth_utoken`;
CREATE TABLE `t_eth_utoken`  (
  `block_num` bigint NOT NULL,
  `_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `swap_address` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `swap_time` int NULL DEFAULT NULL,
  `swap_eth` decimal(18, 6) NULL DEFAULT 0.000000,
  `swap_utoken` decimal(18, 6) NULL DEFAULT 0.000000,
  `tran_hash` char(66) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `swap_gas` int NULL DEFAULT 0,
  `id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `tran_hash`(`tran_hash` ASC) USING BTREE,
  INDEX `block_num`(`block_num` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of t_eth_utoken
-- ----------------------------

-- ----------------------------
-- Table structure for t_getdaoutoken
-- ----------------------------
DROP TABLE IF EXISTS `t_getdaoutoken`;
CREATE TABLE `t_getdaoutoken`  (
  `block_num` bigint UNSIGNED NOT NULL COMMENT '区块号 用于监听标记',
  `delegator` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT 'smart common 代理地址',
  `account` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '分红者地址',
  `utoken_amount` decimal(18, 6) NULL DEFAULT NULL COMMENT '分红的utoken',
  `_time` int NULL DEFAULT NULL,
  `dao_owner` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '成员地址',
  `pre_time` int NULL DEFAULT NULL COMMENT '上次取的时间戳',
  `id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `block_num`(`block_num` ASC, `delegator` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of t_getdaoutoken
-- ----------------------------

-- ----------------------------
-- Table structure for t_mynft
-- ----------------------------
DROP TABLE IF EXISTS `t_mynft`;
CREATE TABLE `t_mynft`  (
  `to_address` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `token_id` int NOT NULL,
  `template_id` int NULL DEFAULT NULL,
  `dao_id` int NULL DEFAULT NULL,
  `_time` char(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `tokensvg` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `block_num` bigint NULL DEFAULT NULL,
  `contract_address` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `_type` tinyint NOT NULL DEFAULT 0 COMMENT '0发布时,1其它mint, 2打赏 3mint smart common',
  `tips` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`_type`, `to_address`, `token_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of t_mynft
-- ----------------------------

-- ----------------------------
-- Table structure for t_nft
-- ----------------------------
DROP TABLE IF EXISTS `t_nft`;
CREATE TABLE `t_nft`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `block_num` bigint UNSIGNED NOT NULL,
  `dao_id` int NULL DEFAULT NULL,
  `token_id` int NULL DEFAULT NULL,
  `token_to` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `tokensvg` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `_time` int NULL DEFAULT NULL,
  `contract_address` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `tips` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '事件数组',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `block_num`(`block_num` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of t_nft
-- ----------------------------

-- ----------------------------
-- Table structure for t_nft_mint
-- ----------------------------
DROP TABLE IF EXISTS `t_nft_mint`;
CREATE TABLE `t_nft_mint`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `block_num` bigint UNSIGNED NOT NULL,
  `dao_id` int NULL DEFAULT NULL,
  `token_id` int NULL DEFAULT NULL,
  `token_to` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `tokensvg` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `_time` int NULL DEFAULT NULL,
  `contract_address` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `block_num`(`block_num` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 21 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of t_nft_mint
-- ----------------------------

-- ----------------------------
-- Table structure for t_nft_swap
-- ----------------------------
DROP TABLE IF EXISTS `t_nft_swap`;
CREATE TABLE `t_nft_swap`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `block_num` bigint UNSIGNED NOT NULL,
  `dao_id` int NULL DEFAULT NULL,
  `token_id` int NULL DEFAULT NULL,
  `token_to` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `tokensvg` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `_time` int NULL DEFAULT NULL,
  `contract_address` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `utoken` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `block_num`(`block_num` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of t_nft_swap
-- ----------------------------

-- ----------------------------
-- Table structure for t_nft_swaphonor
-- ----------------------------
DROP TABLE IF EXISTS `t_nft_swaphonor`;
CREATE TABLE `t_nft_swaphonor`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `block_num` bigint UNSIGNED NOT NULL,
  `dao_id` int NULL DEFAULT NULL,
  `token_id` int NULL DEFAULT NULL,
  `token_to` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `tokensvg` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `_time` int NULL DEFAULT NULL,
  `contract_address` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `tips` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '事件数组',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `block_num`(`block_num` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of t_nft_swaphonor
-- ----------------------------

-- ----------------------------
-- Table structure for t_nft_transfer
-- ----------------------------
DROP TABLE IF EXISTS `t_nft_transfer`;
CREATE TABLE `t_nft_transfer`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `block_num` bigint UNSIGNED NULL DEFAULT NULL,
  `token_id` int NULL DEFAULT NULL,
  `token_to` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `tokensvg` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `_time` int NULL DEFAULT NULL,
  `contract_address` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `in_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `block_num`(`block_num` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of t_nft_transfer
-- ----------------------------

-- ----------------------------
-- Table structure for t_pro
-- ----------------------------
DROP TABLE IF EXISTS `t_pro`;
CREATE TABLE `t_pro`  (
  `block_num` bigint UNSIGNED NOT NULL COMMENT '区块号 用于监听标记',
  `delegator` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT 'smart common 代理地址',
  `creator` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '提案创建人',
  `account` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '参数1',
  `dividendRights` int NULL DEFAULT 0 COMMENT '参数2',
  `createTime` int NULL DEFAULT 0 COMMENT '参数3',
  `rights` int NULL DEFAULT 0 COMMENT '参数4',
  `antirights` int NULL DEFAULT 0 COMMENT '参数5',
  `dao_desc` varchar(4000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '参数6',
  `is_end` tinyint UNSIGNED NULL DEFAULT 0 COMMENT '0未完成 1完成 2 过期',
  `dao_id` int NULL DEFAULT NULL COMMENT 'smart common id',
  `strategy` int NULL DEFAULT NULL COMMENT '通过率',
  `lifetime` int NULL DEFAULT NULL COMMENT '寿命',
  `cool_time` int NULL DEFAULT NULL COMMENT '冷却时间',
  `pro_type` tinyint NULL DEFAULT NULL COMMENT '1修改logo,2修改描述,3修改管理者,4 修改类型,7修改策略,5新增成员,6,修改票权,0删除成员',
  `imgstr` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
  `proposalType` tinyint NULL DEFAULT NULL COMMENT '0 为修改strategy\n1 为修改logo\n2 为修改描述\n3 为修改管理员\n4 为修改智能公器类型',
  `id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `delegator`(`delegator` ASC, `createTime` ASC) USING BTREE,
  INDEX `block_num`(`block_num` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of t_pro
-- ----------------------------

-- ----------------------------
-- Table structure for t_proexcu
-- ----------------------------
DROP TABLE IF EXISTS `t_proexcu`;
CREATE TABLE `t_proexcu`  (
  `block_num` bigint UNSIGNED NOT NULL COMMENT '区块号 用于监听标记',
  `delegator` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT 'smart common 代理地址',
  `account` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '提案参数1',
  `dividendRights` int NULL DEFAULT NULL COMMENT '提案参数2',
  `_time` int NULL DEFAULT NULL COMMENT '链上时间戳',
  `proposalType` tinyint NULL DEFAULT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `block_num`(`block_num` ASC, `delegator` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of t_proexcu
-- ----------------------------

-- ----------------------------
-- Table structure for t_provote
-- ----------------------------
DROP TABLE IF EXISTS `t_provote`;
CREATE TABLE `t_provote`  (
  `block_num` bigint UNSIGNED NOT NULL COMMENT '区块号 用于监听标记',
  `delegator` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT 'smart common 代理地址',
  `createTime` int NULL DEFAULT NULL COMMENT '提案时间戳',
  `creator` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '投票人地址',
  `antirights` int NULL DEFAULT NULL COMMENT '反对票',
  `rights` int NULL DEFAULT NULL COMMENT '赞成票',
  `_time` int NULL DEFAULT NULL COMMENT '链上时间戳',
  `proposalType` tinyint NULL DEFAULT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `block_num`(`block_num` ASC, `delegator` ASC) USING BTREE,
  INDEX `delegator`(`delegator` ASC, `createTime` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of t_provote
-- ----------------------------

-- ----------------------------
-- Table structure for t_swap
-- ----------------------------
DROP TABLE IF EXISTS `t_swap`;
CREATE TABLE `t_swap`  (
  `block_num` bigint UNSIGNED NOT NULL COMMENT '区块号 用于监听标记',
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
  `id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `tran_hash`(`tran_hash` ASC) USING BTREE,
  INDEX `block_num`(`block_num` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of t_swap
-- ----------------------------

-- ----------------------------
-- Table structure for t_t2t
-- ----------------------------
DROP TABLE IF EXISTS `t_t2t`;
CREATE TABLE `t_t2t`  (
  `block_num` bigint NOT NULL,
  `from_dao_id` int NULL DEFAULT NULL,
  `to_dao_id` int NULL DEFAULT NULL,
  `_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `from_utoken_cost` decimal(18, 6) NULL DEFAULT 0.000000,
  `to_utoken_cost` decimal(18, 6) NULL DEFAULT 0.000000,
  `from_address` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `to_address` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `from_token` decimal(18, 6) NULL DEFAULT 0.000000,
  `to_token` decimal(18, 6) NULL DEFAULT 0.000000,
  `swap_time` int NULL DEFAULT NULL,
  `tran_hash` char(66) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `swap_gas` int NULL DEFAULT NULL,
  `tipAmount` decimal(18, 6) NULL DEFAULT NULL COMMENT '打赏',
  `sc_id` int NULL DEFAULT NULL COMMENT '打赏scID',
  `id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `tran_hash`(`tran_hash` ASC) USING BTREE,
  INDEX `block_num`(`block_num` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of t_t2t
-- ----------------------------

-- ----------------------------
-- Table structure for t_t2u
-- ----------------------------
DROP TABLE IF EXISTS `t_t2u`;
CREATE TABLE `t_t2u`  (
  `block_num` bigint NOT NULL,
  `from_token_id` int NULL DEFAULT NULL,
  `utoken_cost` decimal(18, 6) NULL DEFAULT 0.000000,
  `from_address` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `to_address` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `utoken_amount` decimal(18, 6) NULL DEFAULT 0.000000,
  `token_amount` decimal(18, 6) NULL DEFAULT 0.000000,
  `swap_time` int NULL DEFAULT NULL,
  `_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `tran_hash` char(66) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `swap_gas` int NULL DEFAULT 0,
  `tipAmount` decimal(18, 6) NULL DEFAULT NULL COMMENT '打赏',
  `id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `tran_hash`(`tran_hash` ASC) USING BTREE,
  INDEX `block_num`(`block_num` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of t_t2u
-- ----------------------------

-- ----------------------------
-- Table structure for t_token
-- ----------------------------
DROP TABLE IF EXISTS `t_token`;
CREATE TABLE `t_token`  (
  `dao_id` int NOT NULL COMMENT 'smart common Id',
  `token_id` int NULL DEFAULT NULL COMMENT '代币 Id',
  `block_num` bigint NOT NULL COMMENT '区块号 用于监听标记',
  `dao_time` int NULL DEFAULT NULL COMMENT '链上时间戳',
  `_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '入库时间',
  PRIMARY KEY (`dao_id`) USING BTREE,
  UNIQUE INDEX `token_id`(`token_id` ASC) USING BTREE,
  INDEX `block_num`(`block_num` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of t_token
-- ----------------------------

-- ----------------------------
-- Table structure for t_tokenuser
-- ----------------------------
DROP TABLE IF EXISTS `t_tokenuser`;
CREATE TABLE `t_tokenuser`  (
  `dao_id` int NULL DEFAULT NULL COMMENT 'smart common id',
  `token_id` int NOT NULL COMMENT '代币ID',
  `dao_manager` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT 'smart common 管理员地址',
  `token_cost` decimal(18, 6) NULL DEFAULT 0.000000 COMMENT '代币余额',
  PRIMARY KEY (`token_id`, `dao_manager`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of t_tokenuser
-- ----------------------------

-- ----------------------------
-- Table structure for t_u2t
-- ----------------------------
DROP TABLE IF EXISTS `t_u2t`;
CREATE TABLE `t_u2t`  (
  `block_num` bigint NOT NULL,
  `token_id` int NULL DEFAULT NULL,
  `utoken_cost` decimal(18, 6) NULL DEFAULT 0.000000,
  `from_address` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `to_address` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `utoken_amount` decimal(18, 6) NULL DEFAULT 0.000000,
  `token_amount` decimal(18, 6) NULL DEFAULT 0.000000,
  `swap_time` int NULL DEFAULT NULL,
  `_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `tran_hash` char(66) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `swap_gas` int NULL DEFAULT 0,
  `tipAmount` decimal(18, 6) NULL DEFAULT NULL COMMENT '打赏',
  `id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `tran_hash`(`tran_hash` ASC) USING BTREE,
  INDEX `block_num`(`block_num` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of t_u2t
-- ----------------------------

-- ----------------------------
-- Table structure for t_updatedaocreator
-- ----------------------------
DROP TABLE IF EXISTS `t_updatedaocreator`;
CREATE TABLE `t_updatedaocreator`  (
  `block_num` bigint UNSIGNED NOT NULL,
  `dao_id` int NULL DEFAULT NULL,
  `creator` char(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `_time` int NULL DEFAULT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `block_num`(`block_num` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of t_updatedaocreator
-- ----------------------------

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
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `v_daotoken` AS select -(2) AS `token_id`,-(2) AS `dao_id`,'eth' AS `dao_symbol`,NULL AS `dao_logo` union all select -(1) AS `token_id`,-(1) AS `dao_id`,'utoken' AS `dao_symbol`,NULL AS `dao_logo` union all select `a`.`token_id` AS `token_id`,`a`.`dao_id` AS `dao_id`,`a`.`dao_symbol` AS `dao_symbol`,`a`.`dao_logo` AS `dao_logo` from `v_dao` `a` where (`a`.`token_id` > 0);

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
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `v_message` AS select `a_message`.`id` AS `id`,`a_message`.`message_id` AS `message_id`,`a_message`.`manager` AS `manager`,`a_message`.`actor_name` AS `actor_name`,`a_message`.`avatar` AS `avatar`,`a_message`.`actor_account` AS `actor_account`,`a_message`.`actor_url` AS `actor_url`,`a_message`.`title` AS `title`,`a_message`.`content` AS `content`,`a_message`.`is_send` AS `is_send`,`a_message`.`is_discussion` AS `is_discussion`,`a_message`.`top_img` AS `top_img`,`a_message`.`receive_account` AS `receive_account`,`a_message`.`actor_inbox` AS `actor_inbox`,`a_message`.`link_url` AS `link_url`,`b`.`dao_id` AS `dao_id`,`a_message`.`send_type` AS `send_type`,date_format(`a_message`.`createtime`,'%Y-%m-%d %H:%i:%s') AS `createtime`,date_format(`a_message`.`reply_time`,'%Y-%m-%d %H:%i:%s') AS `reply_time`,(case when (timestampdiff(YEAR,`a_message`.`createtime`,now()) > 0) then concat(timestampdiff(YEAR,`a_message`.`createtime`,now()),'_year') when (timestampdiff(MONTH,`a_message`.`createtime`,now()) > 0) then concat(timestampdiff(MONTH,`a_message`.`createtime`,now()),'_month') when (timestampdiff(DAY,`a_message`.`createtime`,now()) > 0) then concat(timestampdiff(DAY,`a_message`.`createtime`,now()),'_day') when (timestampdiff(HOUR,`a_message`.`createtime`,now()) > 0) then concat(timestampdiff(HOUR,`a_message`.`createtime`,now()),'_hour') else concat(timestampdiff(MINUTE,`a_message`.`createtime`,now()),'_minute') end) AS `times`,ifnull(`b`.`id`,0) AS `actor_id` from (`a_message` left join `a_account` `b` on((`a_message`.`actor_account` = `b`.`actor_account`)));

-- ----------------------------
-- View structure for v_message_commont
-- ----------------------------
DROP VIEW IF EXISTS `v_message_commont`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `v_message_commont` AS select `a_message_commont`.`id` AS `id`,`a_message_commont`.`pid` AS `pid`,`a_message_commont`.`message_id` AS `message_id`,`a_message_commont`.`manager` AS `manager`,`a_message_commont`.`actor_name` AS `actor_name`,`a_message_commont`.`avatar` AS `avatar`,`a_message_commont`.`actor_account` AS `actor_account`,`a_message_commont`.`actor_url` AS `actor_url`,`a_message_commont`.`content` AS `content`,date_format(`a_message_commont`.`createtime`,'%Y-%m-%d %H:%i:%s') AS `createtime`,(case when (timestampdiff(YEAR,`a_message_commont`.`createtime`,now()) > 0) then concat(timestampdiff(YEAR,`a_message_commont`.`createtime`,now()),'_year') when (timestampdiff(MONTH,`a_message_commont`.`createtime`,now()) > 0) then concat(timestampdiff(MONTH,`a_message_commont`.`createtime`,now()),'_month') when (timestampdiff(DAY,`a_message_commont`.`createtime`,now()) > 0) then concat(timestampdiff(DAY,`a_message_commont`.`createtime`,now()),'_day') when (timestampdiff(HOUR,`a_message_commont`.`createtime`,now()) > 0) then concat(timestampdiff(HOUR,`a_message_commont`.`createtime`,now()),'_hour') else concat(timestampdiff(MINUTE,`a_message_commont`.`createtime`,now()),'_minute') end) AS `times` from `a_message_commont`;

-- ----------------------------
-- View structure for v_messagesc
-- ----------------------------
DROP VIEW IF EXISTS `v_messagesc`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `v_messagesc` AS select `a`.`id` AS `id`,`a`.`actor_id` AS `actor_id`,`a`.`dao_id` AS `dao_id`,`a`.`title` AS `title`,`a`.`content` AS `content`,`a`.`is_send` AS `is_send`,`a`.`is_discussion` AS `is_discussion`,`a`.`top_img` AS `top_img`,date_format(`a`.`start_time`,'%Y-%m-%d %H:%i:%s') AS `start_time`,date_format(`a`.`end_time`,'%Y-%m-%d %H:%i:%s') AS `end_time`,`a`.`event_url` AS `event_url`,`a`.`event_address` AS `event_address`,`a`.`time_event` AS `time_event`,`a`.`_type` AS `_type`,date_format(`a`.`reply_time`,'%Y-%m-%d %H:%i:%s') AS `reply_time`,date_format(`a`.`createtime`,'%Y-%m-%d %H:%i:%s') AS `createtime`,`b`.`actor_name` AS `actor_name`,`b`.`avatar` AS `avatar`,`b`.`actor_account` AS `actor_account`,`a`.`message_id` AS `message_id`,0 AS `send_type`,`b`.`actor_url` AS `actor_url`,`c`.`manager` AS `manager`,concat('https://',`b`.`domain`,'/api/activitepub/inbox/',`b`.`actor_name`) AS `actor_inbox`,(case when (timestampdiff(YEAR,`a`.`createtime`,now()) > 0) then concat(timestampdiff(YEAR,`a`.`createtime`,now()),'_year') when (timestampdiff(MONTH,`a`.`createtime`,now()) > 0) then concat(timestampdiff(MONTH,`a`.`createtime`,now()),'_month') when (timestampdiff(DAY,`a`.`createtime`,now()) > 0) then concat(timestampdiff(DAY,`a`.`createtime`,now()),'_day') when (timestampdiff(HOUR,`a`.`createtime`,now()) > 0) then concat(timestampdiff(HOUR,`a`.`createtime`,now()),'_hour') else concat(timestampdiff(MINUTE,`a`.`createtime`,now()),'_minute') end) AS `times` from ((`a_messagesc` `a` left join `a_account` `b` on((`a`.`dao_id` = `b`.`dao_id`))) left join `a_account` `c` on((`a`.`actor_id` = `c`.`id`)));

-- ----------------------------
-- View structure for v_messagesc_commont
-- ----------------------------
DROP VIEW IF EXISTS `v_messagesc_commont`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `v_messagesc_commont` AS select `a_messagesc_commont`.`id` AS `id`,`a_messagesc_commont`.`pid` AS `pid`,`a_messagesc_commont`.`message_id` AS `message_id`,`a_messagesc_commont`.`manager` AS `manager`,`a_messagesc_commont`.`actor_name` AS `actor_name`,`a_messagesc_commont`.`avatar` AS `avatar`,`a_messagesc_commont`.`actor_account` AS `actor_account`,`a_messagesc_commont`.`actor_url` AS `actor_url`,`a_messagesc_commont`.`content` AS `content`,date_format(`a_messagesc_commont`.`createtime`,'%Y-%m-%d %H:%i:%s') AS `createtime`,(case when (timestampdiff(YEAR,`a_messagesc_commont`.`createtime`,now()) > 0) then concat(timestampdiff(YEAR,`a_messagesc_commont`.`createtime`,now()),'_year') when (timestampdiff(MONTH,`a_messagesc_commont`.`createtime`,now()) > 0) then concat(timestampdiff(MONTH,`a_messagesc_commont`.`createtime`,now()),'_month') when (timestampdiff(DAY,`a_messagesc_commont`.`createtime`,now()) > 0) then concat(timestampdiff(DAY,`a_messagesc_commont`.`createtime`,now()),'_day') when (timestampdiff(HOUR,`a_messagesc_commont`.`createtime`,now()) > 0) then concat(timestampdiff(HOUR,`a_messagesc_commont`.`createtime`,now()),'_hour') else concat(timestampdiff(MINUTE,`a_messagesc_commont`.`createtime`,now()),'_minute') end) AS `times` from `a_messagesc_commont`;

-- ----------------------------
-- View structure for v_mynft
-- ----------------------------
DROP VIEW IF EXISTS `v_mynft`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `v_mynft` AS select `a`.`to_address` AS `to_address`,`a`.`token_id` AS `token_id`,`a`.`template_id` AS `template_id`,`a`.`dao_id` AS `dao_id`,`a`.`tips` AS `tips`,`a`.`_time` AS `_time`,`a`.`tokensvg` AS `tokensvg`,`a`.`contract_address` AS `contract_address`,`a`.`block_num` AS `block_num`,`a`.`_type` AS `_type`,`b`.`dao_logo` AS `dao_logo`,`b`.`dao_name` AS `dao_name`,`b`.`dao_symbol` AS `dao_symbol` from (`t_mynft` `a` left join `t_dao` `b` on((`a`.`dao_id` = `b`.`dao_id`)));

-- ----------------------------
-- View structure for v_pro
-- ----------------------------
DROP VIEW IF EXISTS `v_pro`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `v_pro` AS select `b`.`dao_name` AS `dao_name`,`b`.`dao_symbol` AS `dao_symbol`,`b`.`dao_logo` AS `dao_logo`,`b`.`dao_desc` AS `daodesc`,`a`.`proposalType` AS `proposalType`,`a`.`imgstr` AS `imgstr`,`a`.`pro_type` AS `pro_type`,(unix_timestamp() - (`a`.`createTime` + `a`.`cool_time`)) AS `cool_time`,`a`.`block_num` AS `block_num`,`a`.`delegator` AS `delegator`,`a`.`creator` AS `creator`,`a`.`account` AS `account`,`a`.`dividendRights` AS `dividendRights`,`a`.`createTime` AS `createTime`,date_format(from_unixtime(`a`.`createTime`),'%Y-%m-%d') AS `create_date`,(((`a`.`createTime` + `a`.`lifetime`) - unix_timestamp()) / (24 * 3600)) AS `lifetime`,`a`.`rights` AS `rights`,`a`.`antirights` AS `antirights`,`a`.`dao_desc` AS `dao_desc`,`a`.`is_end` AS `is_end`,`a`.`dao_id` AS `dao_id`,round(((`a`.`strategy` / 65535) * 100),0) AS `strategy`,ifnull(`c`.`s`,0) AS `total_vote` from ((`t_pro` `a` join `t_dao` `b` on((`a`.`dao_id` = `b`.`dao_id`))) left join (select `t_daodetail`.`dao_id` AS `dao_id`,sum(`t_daodetail`.`member_votes`) AS `s` from `t_daodetail` where (`t_daodetail`.`member_type` = 1) group by `t_daodetail`.`dao_id`) `c` on((`a`.`dao_id` = `c`.`dao_id`)));

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
CREATE DEFINER=`root`@`localhost` PROCEDURE `aa`()
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
-- Procedure structure for excuteRank
-- ----------------------------
DROP PROCEDURE IF EXISTS `excuteRank`;
delimiter ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `excuteRank`()
BEGIN
UPDATE t_dao t1 JOIN (
SELECT dao_id,  utoken_cost, yy FROM
(SELECT dao_id,  utoken_cost,
@curRank := IF(@prevRank = utoken_cost, @curRank, @incRank) AS yy, 
@incRank := @incRank + 1, 
@prevRank := utoken_cost
FROM t_dao p, (
SELECT @curRank :=0, @prevRank := NULL, @incRank := 1
) r 
ORDER BY utoken_cost DESC) s
) t2 
ON t1.dao_id = t2.dao_id
SET t1.dao_ranking = t2.yy;
    END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for excuteToken
-- ----------------------------
DROP PROCEDURE IF EXISTS `excuteToken`;
delimiter ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `excuteToken`(_tokenid int,_address VARCHAR(50),_cost decimal(18,4))
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
CREATE DEFINER=`root`@`localhost` PROCEDURE `getAccount`(did char(42))
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
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_page`(_daima VARCHAR(6000),_ps INT,_i INT,_s VARCHAR(6000),_a VARCHAR(4),_w NVARCHAR(6000))
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
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_price`()
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
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_prolist`(_address char(42))
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
CREATE DEFINER=`root`@`localhost` PROCEDURE `i_changelogo`(daoid int,blocknum bigint,daotime int,_logo_id int,_logo varchar(256))
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
CREATE DEFINER=`root`@`localhost` PROCEDURE `i_daoaccount`(_blocknum bigint,_delegator char(42),_account char(42),_dividendRights int,daoId int)
BEGIN
	if not exists(select * from t_daoaccount where block_num=_blocknum and account=_account) then
		INSERT INTO t_daoaccount(block_num,delegator,account,dividendRights,dao_id) VALUES(_blocknum,_delegator,_account,_dividendRights,daoId);
	end if;
    END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for i_daodetail
-- ----------------------------
DROP PROCEDURE IF EXISTS `i_daodetail`;
delimiter ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `i_daodetail`(daoid int,daoaddress char(42),daovotes int,daoindex int)
BEGIN
	if not exists(select * from t_daodetail where dao_id=daoid and member_address=daoaddress) then
		INSERT INTO t_daodetail(dao_id,member_address,member_votes,member_index) VALUES(daoid,daoaddress,daovotes,daoindex);
	end if;
	
    END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for i_eip_type
-- ----------------------------
DROP PROCEDURE IF EXISTS `i_eip_type`;
delimiter ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `i_eip_type`(_type varchar(32),_desc varchar(2000))
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
CREATE DEFINER=`root`@`localhost` PROCEDURE `i_pro`(_blockNum bigint,_delegator char(42),_creator char(42),_account char(42),_dividendRights int,_createTime int,_daodesc varchar(4000),_imgstr text,_proposalType tinyint)
BEGIN
    
    declare _daoid int;
    declare _strategy int;
    declare _lifetime int;
    declare _cooltime int;
    declare _type tinyint;
    
    select dao_id,strategy,lifetime,cool_time into _daoid,_strategy,_lifetime,_cooltime from t_dao where delegator=_delegator;
    
    if _proposalType=0 then 
	SET _type=7; -- 策略
    else    
	IF  _proposalType<5 THEN 
		set _type=_proposalType;
	ELSE 
		IF NOT EXISTS(SELECT * from t_daodetail where dao_id=_daoid and member_address=_account ) then --  新增
		      set _type=5;
		else 
		     set _type=6;
		end if;
		
	END IF;
    END IF;
    
    UPDATE t_pro SET is_end=1 WHERE block_num<_blockNum and dao_id=_daoid AND is_end=0;
    INSERT INTO t_pro(block_num,delegator,creator,account,dividendRights,createTime,dao_desc,dao_id,strategy,lifetime,cool_time,pro_type,imgstr,proposalType) 
    VALUES(_blockNum,_delegator,_creator,_account,_dividendRights,_createTime,_daodesc,_daoid,_strategy,_lifetime,_cooltime,_type,_imgstr,_proposalType);
    END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for i_swap
-- ----------------------------
DROP PROCEDURE IF EXISTS `i_swap`;
delimiter ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `i_swap`(blocknum bigint,swapaddress char(42),swaptime int,swapeth decimal(18,4),swaputoken decimal(18,6),tranHash char(66),swapgas int)
BEGIN
    IF NOT EXISTS(SELECT * FROM t_eth_utoken WHERE block_num=blocknum) THEN
			INSERT INTO t_eth_utoken(block_num,swap_address,swap_time,swap_eth,swap_utoken,tran_hash,swap_gas) 
			VALUES(blocknum,swapaddress,swaptime,swapeth,swaputoken,tranHash,swapgas);
		end if;
    END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for i_t2t
-- ----------------------------
DROP PROCEDURE IF EXISTS `i_t2t`;
delimiter ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `i_t2t`(blocknum bigint,fromdaoid int,todaoid int,fromutokencost decimal(18,6),toutokencost DECIMAL(18,6),
    fromaddress char(42),toaddress char(42),fromtoken DECIMAL(18,6),totoken DECIMAL(18,6),swaptime int,tranHsh char(66),swapgas int,_tip DECIMAL(18,6),_scid int)
BEGIN
     IF NOT EXISTS(SELECT * FROM t_t2t WHERE block_num=blocknum) THEN
	INSERT INTO t_t2t(block_num,from_dao_id,to_dao_id,from_utoken_cost,to_utoken_cost,from_address,to_address,from_token,to_token,swap_time,tran_hash,swap_gas,tipAmount,sc_id)
	 VALUES(blocknum,fromdaoid,todaoid,fromutokencost,toutokencost,fromaddress,toaddress,fromtoken,totoken,swaptime,tranHsh,swapgas,_tip,_scid);
	 end if;
    END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for i_t2u
-- ----------------------------
DROP PROCEDURE IF EXISTS `i_t2u`;
delimiter ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `i_t2u`(blocknum bigint,fromTokenId int,utokencost decimal(18,6),fromaddress char(42)
    ,toaddress char(42),utokenamount DECIMAL(18,6),tokenamount DECIMAL(18,6),swaptime int,tranHash char(66),swapgas int,_tip DECIMAL(18,6))
BEGIN
    IF NOT EXISTS(SELECT * FROM t_t2u WHERE block_num=blocknum) THEN
	
	INSERT INTO t_t2u(block_num,from_token_id,utoken_cost,from_address,to_address,utoken_amount,token_amount,swap_time,tran_hash,swap_gas,tipAmount)  
	VALUES(blocknum,fromTokenId,utokencost,fromaddress,toaddress,utokenamount,tokenamount,swaptime,tranHash,swapgas,_tip);
	end if;
    END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for i_token
-- ----------------------------
DROP PROCEDURE IF EXISTS `i_token`;
delimiter ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `i_token`(daoid int,tokenid int,blocknum bigint,daotime int)
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
CREATE DEFINER=`root`@`localhost` PROCEDURE `i_u2t`(blocknum bigint,tokenId int,utokencost decimal(18,6),fromaddress char(42)
    ,toaddress char(42),utokenamount DECIMAL(18,6),tokenamount DECIMAL(18,6),swaptime int,tranHash char(66),swapgas int,_tip DECIMAL(18,6))
BEGIN
    IF NOT EXISTS(SELECT * FROM t_u2t WHERE block_num=blocknum) THEN
	INSERT INTO t_u2t(block_num,token_id,utoken_cost,from_address,to_address,utoken_amount,token_amount,swap_time,tran_hash,swap_gas,tipAmount) 
	VALUES(blocknum,tokenId,utokencost,fromaddress,toaddress,utokenamount,tokenamount,swaptime,tranHash,swapgas,_tip);
	end if;
    END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for recover_follow
-- ----------------------------
DROP PROCEDURE IF EXISTS `recover_follow`;
delimiter ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `recover_follow`(new_account varchar(256),old_account varchar(256))
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
    END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table a_message_commont
-- ----------------------------
DROP TRIGGER IF EXISTS `commont_insert`;
delimiter ;;
CREATE TRIGGER `commont_insert` AFTER INSERT ON `a_message_commont` FOR EACH ROW BEGIN
	update a_message set reply_time=now() where id=new.pid;
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
    END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table a_messagesc_commont
-- ----------------------------
DROP TRIGGER IF EXISTS `commontsc_insert`;
delimiter ;;
CREATE TRIGGER `commontsc_insert` AFTER INSERT ON `a_messagesc_commont` FOR EACH ROW BEGIN
	update a_messagesc set reply_time=now() where id=new.pid;
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
	
	if not exists(select * from t_daodetail where dao_id=new.dao_id and member_address=new.account) then 
		INSERT INTO t_daodetail (dao_id,member_votes,member_address,delegator) VALUES(new.dao_id,new.dividendRights,new.account,new.delegator);
	else 
		if new.dividendRights=0 then 
			delete from t_daodetail where dao_id=new.dao_id AND member_address=new.account;
		else
			UPDATE t_daodetail  SET member_votes=new.dividendRights WHERE dao_id=new.dao_id AND member_address=new.account; 
		end if;
	end if;
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
		DECLARE _dao_logo varCHAR(128);
		DECLARE _desc text;
		SELECT  dao_symbol,dao_manager,dao_logo,dao_desc INTO _name,_manager,_dao_logo,_desc FROM t_dao WHERE dao_id=new.dao_id;
	IF not EXISTS(SELECT * FROM a_account WHERE dao_id=new.dao_id) THEN
		
		INSERT INTO a_account(block_num,dao_id,domain,manager,pubkey,privkey,actor_account,actor_url,avatar,createtime,actor_name,actor_desc) 
		VALUES(new.block_num,new.dao_id,new.domain,_manager,new.pubkey,new.privkey,concat(_name,'@',new.domain),concat('https://',new.domain,'/api/activitepub/users/',_name),_dao_logo,
		DATE_FORMAT(FROM_UNIXTIME(new._time),'%Y-%m-%d %H:%i:%s'),_name,_desc);	
	else
		-- 只更新最后的
		update a_account set block_num=new.block_num,domain=new.domain,actor_account=CONCAT(_name,'@',new.domain),actor_url=CONCAT('https://',new.domain,'/api/activitepub/users/',_name),avatar=_dao_logo,
		createtime=DATE_FORMAT(FROM_UNIXTIME(new._time),'%Y-%m-%d %H:%i:%s') where dao_id=new.dao_id and block_num<=new.block_num;
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
	IF not EXISTS(SELECT * FROM a_account WHERE dao_id=0 and manager=new.addr) THEN
		
		INSERT INTO a_account(block_num,dao_id,domain,manager,pubkey,privkey,actor_account,actor_url,avatar,createtime,actor_name,actor_desc) 
		VALUES(new.block_num,0,new.domain,new.addr,new.pubkey,new.privkey,concat(new.nick_name,'@',new.domain),concat('https://',new.domain,'/api/activitepub/users/',new.nick_name),
		CONCAT('https://',new.domain,'/user.svg'),DATE_FORMAT(FROM_UNIXTIME(new._time),'%Y-%m-%d %H:%i:%s'),new.nick_name,'');	
	else
		-- 只更新最后的
		update a_account set actor_name=new.nick_name, block_num=new.block_num,domain=new.domain,actor_account=CONCAT(new.nick_name,'@',new.domain),actor_url=CONCAT('https://',new.domain,'/api/activitepub/users/',new.nick_name)
		,createtime=DATE_FORMAT(FROM_UNIXTIME(new._time),'%Y-%m-%d %H:%i:%s') where dao_id=0 AND manager=new.addr and block_num<=new.block_num;
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
	SELECT dao_symbol INTO _out FROM v_token WHERE token_id=new.token_id;
	UPDATE t_dao SET utoken_cost=new.utoken_cost WHERE dao_id  IN(SELECT dao_id FROM t_token WHERE token_id =new.token_id);
	IF NOT EXISTS(SELECT * FROM t_swap WHERE block_num=new.block_num) THEN 	
	 INSERT INTO t_swap(block_num,tran_hash,title,in_amount,out_amount,swap_address,swap_time,in_str,out_str,tipAmount,tip_str) 
	 VALUES(new.block_num,new.tran_hash,'ETH->token',new.in_amount,new.out_amount,new.from_address,DATE_FORMAT(FROM_UNIXTIME(new.swap_time),'%Y-%m-%d %H:%i:%s')
	 ,CONCAT(CAST(new.in_amount AS CHAR) + 0,' ETH'),CONCAT(CAST(new.out_amount AS CHAR) + 0,' ',_out),new.tipAmount,case when new.tipAmount>0 then _out else '' end);
	 end if;
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
	IF NOT EXISTS(SELECT * FROM t_swap WHERE block_num=new.block_num) THEN 	
		INSERT INTO t_swap (block_num,tran_hash,title,in_amount,out_amount,swap_address,swap_time,in_str,out_str) 
		 VALUES(new.block_num,new.tran_hash,'ETH->UTO',new.swap_eth,new.swap_utoken,new.swap_address,DATE_FORMAT(FROM_UNIXTIME(new.swap_time),'%Y-%m-%d %H:%i:%s')
		 ,CONCAT(CAST(new.swap_eth AS CHAR) + 0,' ETH'),CONCAT(CAST(new.swap_utoken AS CHAR) + 0,' UTO'));
	end if;
    END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table t_nft
-- ----------------------------
DROP TRIGGER IF EXISTS `nft_trigger`;
delimiter ;;
CREATE TRIGGER `nft_trigger` AFTER INSERT ON `t_nft` FOR EACH ROW BEGIN
	IF NOT EXISTS(SELECT * FROM t_mynft WHERE  token_id=new.token_id AND _type=1 AND contract_address=new.contract_address) THEN	
		INSERT INTO t_mynft(to_address,token_id,_time,template_id,dao_id,tokensvg,contract_address,block_num,_type,tips) 
		VALUES(new.token_to,new.token_id,DATE_FORMAT(FROM_UNIXTIME(new._time),'%Y-%m-%d %H:%i:%s'),0,new.dao_id,new.tokensvg,new.contract_address,new.block_num,1,new.tips);
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
	IF NOT EXISTS(SELECT * FROM t_mynft WHERE  token_id=new.token_id AND _type=3 AND contract_address=new.contract_address) THEN	
		INSERT INTO t_mynft(to_address,token_id,_time,template_id,dao_id,tokensvg,contract_address,block_num,_type,tips) 
		VALUES(new.token_to,new.token_id,DATE_FORMAT(FROM_UNIXTIME(new._time),'%Y-%m-%d %H:%i:%s'),0,new.dao_id,new.tokensvg,new.contract_address,new.block_num,3
		,'A Smart Common minted');
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
	IF NOT EXISTS(SELECT * FROM t_mynft WHERE  token_id=new.token_id AND _type=2 AND contract_address=new.contract_address) THEN	
		INSERT INTO t_mynft(to_address,token_id,_time,template_id,dao_id,tokensvg,contract_address,block_num,_type,tips) 
		VALUES(new.token_to,new.token_id,DATE_FORMAT(FROM_UNIXTIME(new._time),'%Y-%m-%d %H:%i:%s'),0,new.dao_id,new.tokensvg,new.contract_address,new.block_num,2
		,concat('Tipping(UTO',new.utoken,')'));
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
	IF NOT EXISTS(SELECT * FROM t_mynft WHERE  token_id=new.token_id AND _type=4 AND contract_address=new.contract_address) THEN	
		INSERT INTO t_mynft(to_address,token_id,_time,template_id,dao_id,tokensvg,contract_address,block_num,_type,tips) 
		VALUES(new.token_to,new.token_id,DATE_FORMAT(FROM_UNIXTIME(new._time),'%Y-%m-%d %H:%i:%s'),0,new.dao_id,new.tokensvg,new.contract_address,new.block_num,4,new.tips);
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
	IF NOT EXISTS(SELECT * FROM t_mynft WHERE token_id=new.token_id and _type=0 AND contract_address=new.contract_address) THEN
		
		INSERT INTO t_mynft(to_address,token_id,_time,template_id,dao_id,tokensvg,contract_address,block_num,_type,tips) 
		VALUES(new.token_to,new.token_id,DATE_FORMAT(FROM_UNIXTIME(new._time),'%Y-%m-%d %H:%i:%s'),0,0,new.tokensvg,new.contract_address,new.block_num,0,'50Satoshis');
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
	declare _in varchar(128);
	declare _out varchar(128);
	DECLARE _sc VARCHAR(128); -- 打赏 sc_id
    
	UPDATE t_dao SET utoken_cost=new.from_utoken_cost WHERE dao_id =(select dao_id from t_token where token_id=new.from_dao_id);
	UPDATE t_dao SET utoken_cost=new.to_utoken_cost WHERE dao_id =(select dao_id from t_token where token_id=new.to_dao_id);
	if not exists(select * from t_swap where block_num=new.block_num) then 	
		select dao_symbol into _in from v_token where token_id=new.from_dao_id;
		SELECT dao_symbol into _out from v_token WHERE token_id=new.to_dao_id;
		SELECT dao_symbol INTO _sc FROM v_token WHERE token_id=new.sc_id;
		INSERT INTO t_swap (block_num,tran_hash,title,in_amount,out_amount,swap_address,swap_time,in_str,out_str,tipAmount,tip_str) 
		values(new.block_num,new.tran_hash,'token->token',new.from_token,new.to_token,new.to_address,DATE_FORMAT(FROM_UNIXTIME(new.swap_time),'%Y-%m-%d %H:%i:%s')
		,CONCAT(CAST(new.from_token AS CHAR) + 0,' ',_in),CONCAT(CAST(new.to_token AS CHAR) + 0,' ',_out),new.tipAmount,case when new.tipAmount>0 then _sc else '' end);
	end if;
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
	DECLARE _in VARCHAR(128);
	SELECT dao_symbol INTO _in FROM v_token WHERE token_id=new.from_token_id;
	UPDATE t_dao SET utoken_cost=new.utoken_cost WHERE dao_id IN (SELECT dao_id FROM t_token WHERE token_id=new.from_token_id);
	IF NOT EXISTS(SELECT * FROM t_swap WHERE block_num=new.block_num) THEN
		INSERT INTO t_swap (block_num,tran_hash,title,in_amount,out_amount,swap_address,swap_time,in_str,out_str,tipAmount,tip_str) 
		VALUES(new.block_num,new.tran_hash,'token->UTO',new.token_amount,new.utoken_amount,new.to_address,DATE_FORMAT(FROM_UNIXTIME(new.swap_time),'%Y-%m-%d %H:%i:%s')
		,CONCAT(CAST(new.token_amount AS CHAR) + 0,' ',_in),CONCAT(CAST(new.utoken_amount AS CHAR) + 0,' UTO'),new.tipAmount,CASE WHEN new.tipAmount>0 THEN _in ELSE '' END);
	end if;
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
	DECLARE _out VARCHAR(128);
	UPDATE t_dao SET utoken_cost=new.utoken_cost WHERE dao_id  IN(SELECT dao_id FROM t_token WHERE token_id =new.token_id);
	if not exists(select * from t_swap where block_num=new.block_num) then
		
		SELECT dao_symbol INTO _out FROM v_token WHERE token_id=new.token_id;
		INSERT INTO t_swap (block_num,tran_hash,title,in_amount,out_amount,swap_address,swap_time,in_str,out_str,tipAmount,tip_str) 
		VALUES(new.block_num,new.tran_hash,'UTO->token',new.utoken_amount,new.token_amount,new.to_address,DATE_FORMAT(FROM_UNIXTIME(new.swap_time),'%Y-%m-%d %H:%i:%s')
		,CONCAT(CAST(new.utoken_amount AS CHAR) + 0,' UTO'),CONCAT(CAST(new.token_amount AS CHAR) + 0,' ',_out),new.tipAmount,CASE WHEN new.tipAmount>0 THEN _out ELSE '' END);
	end if;
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