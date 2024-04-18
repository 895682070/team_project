/*
 Navicat Premium Data Transfer

 Source Server         : lineWebTeam
 Source Server Type    : MySQL
 Source Server Version : 50736
 Source Host           : 101.43.228.243:9004
 Source Schema         : webTeam

 Target Server Type    : MySQL
 Target Server Version : 50736
 File Encoding         : 65001

 Date: 18/04/2024 11:20:19
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for collection
-- ----------------------------
DROP TABLE IF EXISTS `collection`;
CREATE TABLE `collection`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `community_id` int(11) NOT NULL,
  `create_time` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`, `user_id`, `community_id`) USING BTREE,
  INDEX `collection_community`(`community_id`) USING BTREE,
  INDEX `collection_user`(`user_id`) USING BTREE,
  CONSTRAINT `collection_community` FOREIGN KEY (`community_id`) REFERENCES `community` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `collection_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 45 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = COMPACT;

-- ----------------------------
-- Table structure for comments
-- ----------------------------
DROP TABLE IF EXISTS `comments`;
CREATE TABLE `comments`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
  `content` varchar(20000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '评论内容',
  `community_id` int(11) NOT NULL COMMENT '文章id',
  `user_id` int(11) NOT NULL COMMENT '用户id',
  PRIMARY KEY (`id`, `user_id`, `community_id`) USING BTREE,
  INDEX `comments_user`(`user_id`) USING BTREE,
  INDEX `comments_community`(`community_id`) USING BTREE,
  INDEX `id`(`id`) USING BTREE,
  CONSTRAINT `comments_community` FOREIGN KEY (`community_id`) REFERENCES `community` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `comments_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 62 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = COMPACT;

-- ----------------------------
-- Table structure for community
-- ----------------------------
DROP TABLE IF EXISTS `community`;
CREATE TABLE `community`  (
  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '标题',
  `id` int(255) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `content` varchar(20000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '内容',
  `image_path` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '图片',
  `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
  `priview_address` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '预览地址',
  `code_address` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '源码地址',
  `star_status` int(10) NULL DEFAULT 0 COMMENT '是否收藏 0未收藏 1已收藏',
  `user_id` int(11) NOT NULL COMMENT '用户id',
  `delete_status` int(255) NULL DEFAULT 1 COMMENT '删除标志 0 删除 1 未删除',
  `public_status` int(255) NULL DEFAULT 1 COMMENT '是否发布 0不发布 1发布',
  `article_type` int(255) NULL DEFAULT 1 COMMENT '文章类型 1文章  2 新闻 3 内推',
  `review_status` int(255) NULL DEFAULT 1 COMMENT '审核状态 1审核通过 0 审核不通过',
  `review_dec` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '不通过描述',
  `access_count` int(255) NULL DEFAULT 0 COMMENT '访问量',
  `job_address` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '工作地址id',
  `job_type` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '职位id',
  `job_address_name` longtext CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '地址名字',
  `job_type_name` longtext CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '职位名字',
  PRIMARY KEY (`id`, `user_id`) USING BTREE,
  INDEX `title`(`title`) USING BTREE,
  INDEX `id`(`id`) USING BTREE,
  INDEX `user_community`(`user_id`) USING BTREE,
  CONSTRAINT `user_community` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 147 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = COMPACT;

-- ----------------------------
-- Table structure for communityType
-- ----------------------------
DROP TABLE IF EXISTS `communityType`;
CREATE TABLE `communityType`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `create_time` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 15 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for gameRecord
-- ----------------------------
DROP TABLE IF EXISTS `gameRecord`;
CREATE TABLE `gameRecord`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自身id',
  `user_account` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '用户账号',
  `record` varchar(10000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '棋盘记录',
  `other_account` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '对方账号',
  `win` int(255) NOT NULL DEFAULT 0 COMMENT '1：赢，0：输',
  `game_type` int(255) NOT NULL DEFAULT 1 COMMENT '1:五子棋',
  `grade` int(255) NULL DEFAULT NULL COMMENT '每局的分数',
  `create_time` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 89 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for page_arrange
-- ----------------------------
DROP TABLE IF EXISTS `page_arrange`;
CREATE TABLE `page_arrange`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NULL DEFAULT NULL COMMENT '用户id',
  `dir` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '文件夹',
  `create_time` datetime NULL DEFAULT NULL COMMENT '时间',
  `file` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '内部文件',
  `file_title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `file_describe` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `file_zip` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '压缩包',
  `file_source` int(11) NULL DEFAULT NULL COMMENT '是否开源',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `arrange_user`(`user_id`) USING BTREE,
  CONSTRAINT `arrange_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 89 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for question_bank
-- ----------------------------
DROP TABLE IF EXISTS `question_bank`;
CREATE TABLE `question_bank`  (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `title` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `content` varchar(15000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `category_id` int(100) NOT NULL DEFAULT 0,
  `create_time` datetime(6) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(6),
  `delete_status` int(255) NOT NULL DEFAULT 1,
  `user_id` int(255) NOT NULL,
  PRIMARY KEY (`id`, `category_id`, `user_id`) USING BTREE,
  INDEX `bank_type_id`(`category_id`) USING BTREE,
  INDEX `id`(`id`) USING BTREE,
  INDEX `bank_user_id`(`user_id`) USING BTREE,
  CONSTRAINT `bank_type_id` FOREIGN KEY (`category_id`) REFERENCES `question_type` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `bank_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 34 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for question_collection
-- ----------------------------
DROP TABLE IF EXISTS `question_collection`;
CREATE TABLE `question_collection`  (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `user_id` int(255) NOT NULL,
  `score` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `bank_id` int(255) NOT NULL,
  `create_time` datetime(6) NULL DEFAULT NULL,
  PRIMARY KEY (`id`, `user_id`, `bank_id`) USING BTREE,
  INDEX `collection_bank`(`bank_id`) USING BTREE,
  INDEX `question_collection_user`(`user_id`) USING BTREE,
  CONSTRAINT `collection_bank` FOREIGN KEY (`bank_id`) REFERENCES `question_bank` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `question_collection_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 64 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for question_type
-- ----------------------------
DROP TABLE IF EXISTS `question_type`;
CREATE TABLE `question_type`  (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `create_time` datetime(6) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for secondary_comments
-- ----------------------------
DROP TABLE IF EXISTS `secondary_comments`;
CREATE TABLE `secondary_comments`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `comments_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `create_time` datetime NOT NULL,
  `content` varchar(6666) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '评论内容',
  `community_id` int(11) NOT NULL COMMENT '文章id',
  PRIMARY KEY (`id`, `comments_id`, `community_id`, `user_id`) USING BTREE,
  INDEX `sc_comments`(`comments_id`) USING BTREE,
  INDEX `sc_user`(`user_id`) USING BTREE,
  INDEX `sc_community`(`community_id`) USING BTREE,
  CONSTRAINT `sc_comments` FOREIGN KEY (`comments_id`) REFERENCES `comments` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `sc_community` FOREIGN KEY (`community_id`) REFERENCES `community` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `sc_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 32 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for three_comments
-- ----------------------------
DROP TABLE IF EXISTS `three_comments`;
CREATE TABLE `three_comments`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `comments_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `create_time` datetime NOT NULL,
  `content` varchar(6666) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '评论内容',
  `community_id` int(11) NOT NULL,
  `be_user_id` int(11) NOT NULL COMMENT '评论了谁',
  PRIMARY KEY (`id`, `comments_id`, `user_id`, `community_id`, `be_user_id`) USING BTREE,
  INDEX `tc_community`(`community_id`) USING BTREE,
  INDEX `tc_ba_user`(`user_id`) USING BTREE,
  INDEX `tc_comments`(`comments_id`) USING BTREE,
  CONSTRAINT `tc_ba_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `tc_comments` FOREIGN KEY (`comments_id`) REFERENCES `comments` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `tc_community` FOREIGN KEY (`community_id`) REFERENCES `community` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `tc_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 15 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `nickName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '昵称',
  `account` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '账号',
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '密码',
  `avatar` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '头像',
  `id` int(255) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `user_type` int(255) NULL DEFAULT 1 COMMENT '用户类型 1普通用户 2 管理员 3 超级管理员',
  `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
  `push_job` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '推送职位',
  `push_address` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '推送地址',
  `push_type` int(255) NOT NULL DEFAULT 0 COMMENT '是否推送 1 推送 0 不推送',
  `is_line` int(11) NOT NULL DEFAULT 0 COMMENT '是否在线 1 0',
  `gomoku_score` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '五子棋分数',
  `last_time` datetime NULL DEFAULT NULL COMMENT '最后一次上线时间',
  `landlord_pulse` int(255) NULL DEFAULT 0 COMMENT '斗地主金豆数量',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `nickName`(`nickName`) USING BTREE,
  INDEX `id`(`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 89 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = COMPACT;

SET FOREIGN_KEY_CHECKS = 1;
