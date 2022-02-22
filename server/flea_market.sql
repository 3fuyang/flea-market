CREATE DATABASE  IF NOT EXISTS `se` /*!40100 DEFAULT CHARACTER SET utf8 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `se`;
-- MySQL dump 10.13  Distrib 8.0.26, for Win64 (x86_64)
--
-- Host: localhost    Database: se
-- ------------------------------------------------------
-- Server version	8.0.26

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `adminaccount`
--

DROP TABLE IF EXISTS `adminaccount`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8 */;
CREATE TABLE `adminaccount` (
  `admin_id` char(4) NOT NULL,
  `mypassword` varchar(20) NOT NULL,
  PRIMARY KEY (`admin_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `adminaccount`
--

LOCK TABLES `adminaccount` WRITE;
/*!40000 ALTER TABLE `adminaccount` DISABLE KEYS */;
INSERT INTO `adminaccount` VALUES ('0001','qwe12345'),('0002','qwe12345');
/*!40000 ALTER TABLE `adminaccount` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chatrecord`
--

DROP TABLE IF EXISTS `chatrecord`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8 */;
CREATE TABLE `chatrecord` (
  `a_user_id` char(7) NOT NULL,
  `b_user_id` char(7) NOT NULL,
  `day_time` datetime NOT NULL,
  `speaker` decimal(1,0) NOT NULL,
  `details` varchar(400) NOT NULL,
  PRIMARY KEY (`a_user_id`,`b_user_id`,`day_time`,`speaker`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chatrecord`
--

LOCK TABLES `chatrecord` WRITE;
/*!40000 ALTER TABLE `chatrecord` DISABLE KEYS */;
/*!40000 ALTER TABLE `chatrecord` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favorite`
--

DROP TABLE IF EXISTS `favorite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8 */;
CREATE TABLE `favorite` (
  `user_id` char(7) NOT NULL,
  `goods_id` char(6) NOT NULL,
  PRIMARY KEY (`user_id`,`goods_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorite`
--

LOCK TABLES `favorite` WRITE;
/*!40000 ALTER TABLE `favorite` DISABLE KEYS */;
/*!40000 ALTER TABLE `favorite` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `goods`
--

DROP TABLE IF EXISTS `goods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8 */;
CREATE TABLE `goods` (
  `goods_id` char(6) NOT NULL,
  `owner_id` char(7) DEFAULT NULL,
  `goods_category` varchar(10) NOT NULL,
  `available` decimal(1,0) NOT NULL DEFAULT '0',
  `goods_name` varchar(20) NOT NULL,
  `goods_title` varchar(30) NOT NULL,
  `price` decimal(6,2) NOT NULL,
  `goods_info` varchar(600) DEFAULT NULL,
  `keywords` varchar(30) NOT NULL,
  `region` varchar(10) NOT NULL,
  `shelftime` datetime NOT NULL,
  `url` varchar(140) DEFAULT NULL,
  `meetAddress` varchar(20) DEFAULT NULL,
  `detail` varchar(140) DEFAULT NULL,
  PRIMARY KEY (`goods_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `goods`
--

LOCK TABLES `goods` WRITE;
/*!40000 ALTER TABLE `goods` DISABLE KEYS */;
INSERT INTO `goods` VALUES ('000001','1951002','图书音像',0,'大学物理学','大学物理学 (附)网络课程&配套习题',15.00,'九成新，附习题，可以跨校区包邮','物理学;','嘉定校区','2021-03-01 04:05:18','physics.png','秋谷苑西北餐厅','无'),('000002','1951002','电子产品',0,'苹果电脑','Apple iPad Pro 11英寸平板电脑',3499.00,'八成新，附两年保修，只接受线下','苹果;ipad;平板电脑','四平路校区','2021-03-29 04:59:00','ipad.png','联合广场星巴克','无'),('000003','1951002','其他',0,'派克钢笔','派克威雅XL系列 樱花粉特别款礼盒',198.00,'九成新，未使用过，跨校区自付邮费','钢笔;派克','沪北校区','2021-04-01 22:00:05','pen.png','请与买家联系商定','无'),('000004','1951002','生活电器',0,'空气净化器','Ecovas智能家用空气净化器 机器智能',3399.00,'八成新，附电源和保修卡，注意为寝室违规电器','净化器;家电','嘉定校区','2021-04-07 22:00:05','philips.png','嘉实星巴克','无'),('000005','1951001','其他',0,'茶叶','传奇武夷山 大红袍茶叶',149.00,'未开封全新，远低于市场价','大红袍;茶叶','四平路校区','2021-09-11 22:00:05','tea.png','西南一前音乐广场','无');
/*!40000 ALTER TABLE `goods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8 */;
CREATE TABLE `orders` (
  `order_id` char(5) NOT NULL,
  `buyer_id` char(7) DEFAULT NULL,
  `seller_id` char(7) DEFAULT NULL,
  `goods_id` char(6) DEFAULT NULL,
  `price` decimal(6,2) DEFAULT NULL,
  `generated_time` datetime NOT NULL,
  `meet_time` datetime DEFAULT NULL,
  `detailed_time` varchar(50) DEFAULT NULL,
  `meet_address` varchar(30) DEFAULT NULL,
  `detailed_address` varchar(50) DEFAULT NULL,
  `status` varchar(8) NOT NULL DEFAULT '进行中',
  `stars` decimal(1,0) DEFAULT NULL,
  `review` varchar(400) DEFAULT NULL,
  PRIMARY KEY (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES ('00001','1951001','1951002','000001',25.00,'2022-01-06 20:15:00','2022-01-09 08:00:00',NULL,'嘉实星巴克',NULL,'进行中',NULL,NULL),('00002','1951001','1952001','000002',49.00,'2022-01-01 18:00:05','2022-01-02 14:30:00',NULL,'全家便利店',NULL,'未评价',NULL,NULL);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `report`
--

DROP TABLE IF EXISTS `report`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8 */;
CREATE TABLE `report` (
  `report_id` char(5) NOT NULL,
  `user_id` char(7) DEFAULT NULL,
  `order_id` char(6) DEFAULT NULL,
  `reason` varchar(500) NOT NULL,
  `report_time` datetime DEFAULT NULL,
  PRIMARY KEY (`report_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `report`
--

LOCK TABLES `report` WRITE;
/*!40000 ALTER TABLE `report` DISABLE KEYS */;
/*!40000 ALTER TABLE `report` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shoppingcart`
--

DROP TABLE IF EXISTS `shoppingcart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8 */;
CREATE TABLE `shoppingcart` (
  `user_id` char(7) NOT NULL,
  `goods_id` char(6) NOT NULL,
  PRIMARY KEY (`user_id`,`goods_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shoppingcart`
--

LOCK TABLES `shoppingcart` WRITE;
/*!40000 ALTER TABLE `shoppingcart` DISABLE KEYS */;
INSERT INTO `shoppingcart` VALUES ('1951001','000006'),('1951001','000008');
/*!40000 ALTER TABLE `shoppingcart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `track`
--

DROP TABLE IF EXISTS `track`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8 */;
CREATE TABLE `track` (
  `user_id` char(7) NOT NULL,
  `goods_id` char(6) NOT NULL,
  `day_time` datetime NOT NULL,
  PRIMARY KEY (`user_id`,`goods_id`,`day_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `track`
--

LOCK TABLES `track` WRITE;
/*!40000 ALTER TABLE `track` DISABLE KEYS */;
/*!40000 ALTER TABLE `track` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `useraccount`
--

DROP TABLE IF EXISTS `useraccount`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8 */;
CREATE TABLE `useraccount` (
  `user_id` char(7) NOT NULL,
  `mypassword` varchar(20) NOT NULL,
  `myname` varchar(12) DEFAULT NULL,
  `gender` varchar(3) DEFAULT NULL,
  `telnum` decimal(11,0) NOT NULL,
  `nickname` varchar(12) DEFAULT NULL,
  `birthday` date NOT NULL,
  `college` varchar(25) NOT NULL,
  `info` varchar(40) DEFAULT NULL,
  `buyerpoint` decimal(2,1) DEFAULT '0.0',
  `sellerpoint` decimal(2,1) DEFAULT '0.0',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `useraccount`
--

LOCK TABLES `useraccount` WRITE;
/*!40000 ALTER TABLE `useraccount` DISABLE KEYS */;
INSERT INTO `useraccount` VALUES ('1951001','qwe12345','王小明','男',13375879899,'明','2001-01-06','软件学院','我我我我我我',0.0,0.0),('1951002','qwe12345','张晓春','女',12365468858,'春','2000-01-09','材料学院','啊实打实大苏打',0.0,0.0),('1952002','qwe12345','新人','女',98765432154,'新','2000-07-14','机械与能源工程学院',NULL,0.0,0.0);
/*!40000 ALTER TABLE `useraccount` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-02-22 11:54:01
