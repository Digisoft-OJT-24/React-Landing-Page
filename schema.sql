/*
 Navicat Premium Dump SQL

 Source Server         : WinServer
 Source Server Type    : MySQL
 Source Server Version : 120102 (12.1.2-MariaDB)
 Source Host           : 167.86.126.108:3306
 Source Schema         : digisoft

 Target Server Type    : MySQL
 Target Server Version : 120102 (12.1.2-MariaDB)
 File Encoding         : 65001

 Date: 06/02/2026 10:43:20
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for __efmigrationshistory
-- ----------------------------
DROP TABLE IF EXISTS `__efmigrationshistory`;
CREATE TABLE `__efmigrationshistory`  (
  `MigrationId` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NOT NULL,
  `ProductVersion` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NOT NULL,
  PRIMARY KEY (`MigrationId`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for changelogs
-- ----------------------------
DROP TABLE IF EXISTS `changelogs`;
CREATE TABLE `changelogs`  (
  `Id` int NOT NULL AUTO_INCREMENT,
  `AppName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NOT NULL,
  `Version` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NOT NULL,
  `Date` datetime(6) NOT NULL,
  `Revision` int NOT NULL,
  `Description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NOT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `IX_ChangeLogs_AppName`(`AppName` ASC) USING BTREE,
  INDEX `IX_ChangeLogs_AppName_Date`(`AppName` ASC, `Date` ASC) USING BTREE,
  CONSTRAINT `FK_ChangeLogs_Products_AppName` FOREIGN KEY (`AppName`) REFERENCES `products` (`Code`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 4394 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for files
-- ----------------------------
DROP TABLE IF EXISTS `files`;
CREATE TABLE `files`  (
  `Id` int NOT NULL AUTO_INCREMENT,
  `FileName` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NOT NULL,
  `ContentType` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NOT NULL,
  `Base64Content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NOT NULL,
  `Size` bigint NOT NULL,
  `UploadedAt` datetime(6) NOT NULL,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for productdownloads
-- ----------------------------
DROP TABLE IF EXISTS `productdownloads`;
CREATE TABLE `productdownloads`  (
  `Id` int NOT NULL AUTO_INCREMENT,
  `ProductCode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NOT NULL,
  `Title` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NOT NULL,
  `Link` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NOT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `IX_ProductDownloads_ProductCode`(`ProductCode` ASC) USING BTREE,
  CONSTRAINT `FK_ProductDownloads_Products_ProductCode` FOREIGN KEY (`ProductCode`) REFERENCES `products` (`Code`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 28 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for productfaqs
-- ----------------------------
DROP TABLE IF EXISTS `productfaqs`;
CREATE TABLE `productfaqs`  (
  `Id` int NOT NULL AUTO_INCREMENT,
  `ProductCode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NOT NULL,
  `Faq` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NOT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `IX_ProductFaqs_ProductCode`(`ProductCode` ASC) USING BTREE,
  CONSTRAINT `FK_ProductFaqs_Products_ProductCode` FOREIGN KEY (`ProductCode`) REFERENCES `products` (`Code`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for products
-- ----------------------------
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products`  (
  `Code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NOT NULL,
  `Title` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NOT NULL,
  `Short` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL,
  `Description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL,
  PRIMARY KEY (`Code`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for productversions
-- ----------------------------
DROP TABLE IF EXISTS `productversions`;
CREATE TABLE `productversions`  (
  `Id` int NOT NULL AUTO_INCREMENT,
  `ProductCode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NOT NULL,
  `Version` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NOT NULL,
  `Link` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NOT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `IX_ProductVersions_ProductCode`(`ProductCode` ASC) USING BTREE,
  CONSTRAINT `FK_ProductVersions_Products_ProductCode` FOREIGN KEY (`ProductCode`) REFERENCES `products` (`Code`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 193 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for provinces
-- ----------------------------
DROP TABLE IF EXISTS `provinces`;
CREATE TABLE `provinces`  (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NOT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for schools
-- ----------------------------
DROP TABLE IF EXISTS `schools`;
CREATE TABLE `schools`  (
  `Id` int NOT NULL AUTO_INCREMENT,
  `ProvinceId` int NOT NULL,
  `Name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NOT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  PRIMARY KEY (`Id`) USING BTREE,
  INDEX `IX_Schools_ProvinceId`(`ProvinceId` ASC) USING BTREE,
  CONSTRAINT `FK_Schools_Provinces_ProvinceId` FOREIGN KEY (`ProvinceId`) REFERENCES `provinces` (`Id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 99 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Username` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NOT NULL,
  `Password` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NOT NULL,
  PRIMARY KEY (`Id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
