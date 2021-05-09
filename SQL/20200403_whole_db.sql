-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: cadds
-- ------------------------------------------------------
-- Server version	5.7.29-log

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
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clients` (
  `uid` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `address` text NOT NULL,
  `phone` varchar(16) NOT NULL,
  `email` varchar(64) NOT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
INSERT INTO `clients` VALUES (1,'asdfadsf adfadf','tadasjhdas ajshda','134312432','test@test.com'),(2,'asdfadsf adfadf','tadasjhdas ajshda','134312432','test@test.com'),(3,'asdfadsf adfadf','tadasjhdas ajshda','134312432','test@test.com'),(4,'asdfadsf adfadf','tadasjhdas ajshda','134312432','test@test.com'),(5,'asdfadsf adfadf','tadasjhdas ajshda','134312432','test@test.com'),(6,'asdfadsf adfadf','tadasjhdas ajshda','134312432','test@test.com'),(7,'asdfadsf adfadf','tadasjhdas ajshda','134312432','test@test.com'),(8,'asdfadsf adfadf','tadasjhdas ajshda','134312432','test@test.com'),(9,'asdfadsf adfadf','tadasjhdas ajshda','134312432','test@test.com'),(10,'asdfadsf adfadf','tadasjhdas ajshda','134312432','test@test.com'),(11,'asdfadsf adfadf','tadasjhdas ajshda','134312432','test@test.com'),(12,'asdfadsf adfadf','tadasjhdas ajshda','134312432','test@test.com'),(13,'asdfadsf adfadf','tadasjhdas ajshda','134312432','test@test.com'),(14,'asdfadsf adfadf','tadasjhdas ajshda','134312432','test@test.com'),(15,'asdfadsf adfadf','tadasjhdas ajshda','134312432','test@test.com'),(16,'sfa','adfadfafaf awdf aw','21341324','test@test.com'),(17,'asdas','asdfasf adf adsf ','1231234','asdasd@test.com');
/*!40000 ALTER TABLE `clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `locations`
--

DROP TABLE IF EXISTS `locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `locations` (
  `uid` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user` int(11) unsigned NOT NULL,
  `location` point NOT NULL,
  `accuracy` float(10,5) unsigned DEFAULT NULL,
  `city` varchar(32) DEFAULT NULL,
  `country` varchar(80) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `postal_code` varchar(10) DEFAULT NULL,
  `region` varchar(32) DEFAULT NULL,
  `street` varchar(32) DEFAULT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`uid`),
  KEY `locations_user_idx` (`user`),
  CONSTRAINT `locations_user` FOREIGN KEY (`user`) REFERENCES `users` (`uid`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locations`
--

LOCK TABLES `locations` WRITE;
/*!40000 ALTER TABLE `locations` DISABLE KEYS */;
INSERT INTO `locations` VALUES (1,1,_binary '\0\0\0\0\0\0\0\0\0$UF1^@¾\'°\Ú~\Ó-@',0.00000,'Calumpit','Philippines','264','','Central Luzon','D. Fajardo','2020-04-03 09:50:09','2020-04-03 09:50:09'),(2,1,_binary '\0\0\0\0\0\0\0\0\0$UF1^@¾\'°\Ú~\Ó-@',0.00000,'Calumpit','Philippines','264','','Central Luzon','D. Fajardo','2020-04-03 09:51:16','2020-04-03 09:51:16'),(3,1,_binary '\0\0\0\0\0\0\0\0\0$UF1^@¾\'°\Ú~\Ó-@',0.00000,'Calumpit','Philippines','264','','Central Luzon','D. Fajardo','2020-04-03 09:52:17','2020-04-03 09:52:17'),(4,1,_binary '\0\0\0\0\0\0\0\0\0$UF1^@¾\'°\Ú~\Ó-@',0.00000,'Calumpit','Philippines','264','','Central Luzon','D. Fajardo','2020-04-03 09:53:08','2020-04-03 09:53:08'),(5,1,_binary '\0\0\0\0\0\0\0\0\0$UF1^@¾\'°\Ú~\Ó-@',0.00000,'Calumpit','Philippines','264','','Central Luzon','D. Fajardo','2020-04-03 09:53:58','2020-04-03 09:53:58'),(6,1,_binary '\0\0\0\0\0\0\0\0\0$UF1^@¾\'°\Ú~\Ó-@',0.00000,'Calumpit','Philippines','264','','Central Luzon','D. Fajardo','2020-04-03 09:55:23','2020-04-03 09:55:23'),(7,1,_binary '\0\0\0\0\0\0\0\0\0$UF1^@¾\'°\Ú~\Ó-@',0.00000,'Calumpit','Philippines','264','','Central Luzon','D. Fajardo','2020-04-03 10:00:06','2020-04-03 10:00:06'),(8,1,_binary '\0\0\0\0\0\0\0\0\0$UF1^@¾\'°\Ú~\Ó-@',0.00000,'Calumpit','Philippines','264','','Central Luzon','D. Fajardo','2020-04-03 10:05:17','2020-04-03 10:05:17'),(9,1,_binary '\0\0\0\0\0\0\0\0\0$UF1^@¾\'°\Ú~\Ó-@',0.00000,'Calumpit','Philippines','264','','Central Luzon','D. Fajardo','2020-04-03 10:10:03','2020-04-03 10:10:03'),(10,1,_binary '\0\0\0\0\0\0\0\0\0$UF1^@¾\'°\Ú~\Ó-@',0.00000,'Calumpit','Philippines','264','','Central Luzon','D. Fajardo','2020-04-03 10:12:21','2020-04-03 10:12:21'),(11,1,_binary '\0\0\0\0\0\0\0\0\0$UF1^@¾\'°\Ú~\Ó-@',0.00000,'Calumpit','Philippines','264','','Central Luzon','D. Fajardo','2020-04-03 10:13:50','2020-04-03 10:13:50'),(12,1,_binary '\0\0\0\0\0\0\0\0\0$UF1^@¾\'°\Ú~\Ó-@',0.00000,'Calumpit','Philippines','264','','Central Luzon','D. Fajardo','2020-04-03 10:15:05','2020-04-03 10:15:05'),(13,1,_binary '\0\0\0\0\0\0\0\0\0$UF1^@¾\'°\Ú~\Ó-@',0.00000,'Calumpit','Philippines','264','','Central Luzon','D. Fajardo','2020-04-03 10:15:12','2020-04-03 10:15:12'),(14,1,_binary '\0\0\0\0\0\0\0\0\0$UF1^@¾\'°\Ú~\Ó-@',0.00000,'Calumpit','Philippines','264','','Central Luzon','D. Fajardo','2020-04-03 10:15:35','2020-04-03 10:15:35'),(15,1,_binary '\0\0\0\0\0\0\0\0\0$UF1^@¾\'°\Ú~\Ó-@',0.00000,'Calumpit','Philippines','264','','Central Luzon','D. Fajardo','2020-04-03 10:16:56','2020-04-03 10:16:56'),(16,1,_binary '\0\0\0\0\0\0\0\0NF1^@f/U¤~\Ó-@',0.00000,'Calumpit','Philippines','264','','Central Luzon','D. Fajardo','2020-04-03 10:17:58','2020-04-03 10:17:58'),(17,1,_binary '\0\0\0\0\0\0\0\0\0<=F1^@¦A\á!~\Ó-@',0.00000,'Calumpit','Philippines','264','','Central Luzon','D. Fajardo','2020-04-03 10:21:55','2020-04-03 10:21:55'),(18,1,_binary '\0\0\0\0\0\0\0\0\08ü0^@Õ®\ï\Ô-@',0.00000,'Calumpit','Philippines','Calumpit','','Central Luzon','','2020-04-03 10:29:59','2020-04-03 10:29:59');
/*!40000 ALTER TABLE `locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `media`
--

DROP TABLE IF EXISTS `media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `media` (
  `uid` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `type` tinyint(3) unsigned NOT NULL,
  `user` int(11) unsigned NOT NULL,
  `hash` binary(16) NOT NULL,
  `content_type` varchar(50) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` timestamp NULL DEFAULT NULL,
  `deleted_by` int(10) unsigned DEFAULT NULL,
  `project` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`uid`),
  KEY `user_idx` (`user`),
  KEY `media_user_idx` (`user`),
  KEY `media_type_idx` (`type`),
  KEY `media_deleted_by_idx` (`deleted_by`),
  KEY `media_project_idx` (`project`),
  CONSTRAINT `media_deleted_by` FOREIGN KEY (`deleted_by`) REFERENCES `users` (`uid`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `media_project` FOREIGN KEY (`project`) REFERENCES `projects` (`uid`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `media_type` FOREIGN KEY (`type`) REFERENCES `media_types` (`uid`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `media_user` FOREIGN KEY (`user`) REFERENCES `users` (`uid`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `media`
--

LOCK TABLES `media` WRITE;
/*!40000 ALTER TABLE `media` DISABLE KEYS */;
INSERT INTO `media` VALUES (1,1,1,_binary 'okýB®	\ì\"žŽ*‚ˆ\Ì','image/jpeg','2020-04-03 10:17:58',NULL,NULL,6),(2,1,1,_binary '4Î´h±üDŽA…¤,,&','image/jpeg','2020-04-03 10:29:59',NULL,NULL,8);
/*!40000 ALTER TABLE `media` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `media_types`
--

DROP TABLE IF EXISTS `media_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `media_types` (
  `uid` tinyint(3) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `media_types`
--

LOCK TABLES `media_types` WRITE;
/*!40000 ALTER TABLE `media_types` DISABLE KEYS */;
INSERT INTO `media_types` VALUES (1,'PROJECT');
/*!40000 ALTER TABLE `media_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_statuses`
--

DROP TABLE IF EXISTS `project_statuses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_statuses` (
  `uid` tinyint(3) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_statuses`
--

LOCK TABLES `project_statuses` WRITE;
/*!40000 ALTER TABLE `project_statuses` DISABLE KEYS */;
INSERT INTO `project_statuses` VALUES (1,'ACTIVE'),(4,'CANCELLED'),(2,'COMPLETED'),(3,'DRAFT');
/*!40000 ALTER TABLE `project_statuses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects` (
  `uid` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user` int(11) unsigned NOT NULL,
  `job_number` int(11) NOT NULL,
  `status` tinyint(3) unsigned NOT NULL,
  `title` varchar(64) NOT NULL,
  `site` int(11) unsigned NOT NULL,
  `client` int(11) unsigned NOT NULL,
  `work_order_number` varchar(64) NOT NULL,
  `scope` text NOT NULL,
  `hourly_rate` decimal(10,0) DEFAULT NULL,
  `quoted_rate` decimal(10,0) DEFAULT NULL,
  `edm_number` int(11) DEFAULT NULL,
  `deadline` timestamp NULL DEFAULT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`uid`),
  KEY `projects_status_idx` (`status`),
  KEY `projects__site_idx` (`site`),
  KEY `projects_client_idx` (`client`),
  KEY `project_user_idx` (`user`),
  CONSTRAINT `project_user` FOREIGN KEY (`user`) REFERENCES `users` (`uid`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `projects_client` FOREIGN KEY (`client`) REFERENCES `clients` (`uid`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `projects_site` FOREIGN KEY (`site`) REFERENCES `locations` (`uid`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `projects_status` FOREIGN KEY (`status`) REFERENCES `project_statuses` (`uid`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES (1,1,123123,1,'adsfadfafdda',11,10,'asdfdrf321421asd','vfagfdhfjashdfjj I\'ll,amhdsf kjhadsfj akjfaksjf asflh salkdfljh iuew r83y98 4h 23984 2jkdjf 792hfjkshf \n',1234,0,123241,'2021-04-04 16:00:00','2020-04-03 10:13:50','2020-04-03 10:13:50'),(2,1,123123,1,'adsfadfafdda',12,11,'asdfdrf321421asd','vfagfdhfjashdfjj I\'ll,amhdsf kjhadsfj akjfaksjf asflh salkdfljh iuew r83y98 4h 23984 2jkdjf 792hfjkshf \n',1234,0,123241,'2021-04-04 16:00:00','2020-04-03 10:15:05','2020-04-03 10:15:05'),(3,1,123123,1,'adsfadfafdda',13,12,'asdfdrf321421asd','vfagfdhfjashdfjj I\'ll,amhdsf kjhadsfj akjfaksjf asflh salkdfljh iuew r83y98 4h 23984 2jkdjf 792hfjkshf \n',1234,0,123241,'2021-04-04 16:00:00','2020-04-03 10:15:12','2020-04-03 10:15:12'),(4,1,123123,1,'adsfadfafdda',14,13,'asdfdrf321421asd','vfagfdhfjashdfjj I\'ll,amhdsf kjhadsfj akjfaksjf asflh salkdfljh iuew r83y98 4h 23984 2jkdjf 792hfjkshf \n',1234,0,123241,'2021-04-04 16:00:00','2020-04-03 10:15:35','2020-04-03 10:15:35'),(5,1,123123,1,'adsfadfafdda',15,14,'asdfdrf321421asd','vfagfdhfjashdfjj I\'ll,amhdsf kjhadsfj akjfaksjf asflh salkdfljh iuew r83y98 4h 23984 2jkdjf 792hfjkshf \n',1234,0,123241,'2021-04-04 16:00:00','2020-04-03 10:16:56','2020-04-03 10:16:56'),(6,1,123123,1,'adsfadfafdda',16,15,'asdfdrf321421asd','vfagfdhfjashdfjj I\'ll,amhdsf kjhadsfj akjfaksjf asflh salkdfljh iuew r83y98 4h 23984 2jkdjf 792hfjkshf \n',1234,0,123241,'2021-04-04 16:00:00','2020-04-03 10:17:58','2020-04-03 10:17:58'),(7,1,1234,1,'sfasdf',17,16,'adf2313','adsfadsfaf Sadaf ASDF ASF adsfadsfaf ASDF ASF ASDF ASF a a\n',123,0,123241,NULL,'2020-04-03 10:21:55','2020-04-03 10:21:55'),(8,1,12312312,1,'asdasdafdas',18,17,'asrfasd1322d','WWE WWE WWE WWE WWE WWE WWE qdfdfs after add for\n',1235,0,123124,'2022-04-02 16:00:00','2020-04-03 10:29:59','2020-04-03 10:29:59');
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `push_tokens`
--

DROP TABLE IF EXISTS `push_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `push_tokens` (
  `uid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `token` varchar(64) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `token_UNIQUE` (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `push_tokens`
--

LOCK TABLES `push_tokens` WRITE;
/*!40000 ALTER TABLE `push_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `push_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `uid` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `session_id` binary(32) NOT NULL,
  `user` int(10) unsigned NOT NULL,
  `started` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `valid_until` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`uid`),
  UNIQUE KEY `user_UNIQUE` (`user`),
  CONSTRAINT `sessions_user` FOREIGN KEY (`user`) REFERENCES `users` (`uid`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES (1,_binary '\"^a6*£^(ù‹‡ˆ	¸.¢k+\ïÀ¿§Fd=LN\ÛN~',3,'2020-03-30 21:01:15','2020-04-29 21:01:15'),(2,_binary ' -\Ñn7\Ï–\ëL\Ó\Õn\Î\Éõ€Ý½\ÃQ²Y«\Õ6™=',1,'2020-04-03 12:31:52','2020-05-03 12:31:52'),(11,_binary '†63d9¸\è!9 \ë\å^<|J\Â\ÌhGx^#‡±',4,'2020-04-02 19:02:22','2020-05-02 19:02:22'),(12,_binary 'OD]%ZBk\Ãñó\âƒ÷¶1Z\"ˆ•y\Ó\'ˆr¨Zõ',6,'2020-04-03 00:26:19','2020-05-03 00:26:19');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_roles` (
  `uid` tinyint(2) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(16) NOT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` VALUES (2,'ADMIN'),(1,'USER');
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `uid` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(128) NOT NULL,
  `password` binary(32) NOT NULL,
  `role` tinyint(2) unsigned NOT NULL,
  `position` varchar(80) NOT NULL,
  `first_name` varchar(60) NOT NULL,
  `last_name` varchar(60) NOT NULL,
  `registered` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`uid`),
  KEY `users_role_idx` (`role`),
  CONSTRAINT `users_role` FOREIGN KEY (`role`) REFERENCES `user_roles` (`uid`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'francisjohngaddi@gmail.com',_binary 'Q*¥!M<\Ø4<\ÕÂ¡\Äz>s\Ä~Å‹Ÿ\á<2ôù\ÅI',1,'Developer','Francis','Gaddi','2020-03-30 20:21:59','2020-03-30 20:21:59'),(2,'francisjohngaddi2@gmail.com',_binary 'Q*¥!M<\Ø4<\ÕÂ¡\Äz>s\Ä~Å‹Ÿ\á<2ôù\ÅI',1,'Developer','Francis','Gaddi','2020-03-30 20:23:52','2020-03-30 20:23:52'),(3,'francisjohngaddi3@gmail.com',_binary 'Q*¥!M<\Ø4<\ÕÂ¡\Äz>s\Ä~Å‹Ÿ\á<2ôù\ÅI',1,'Developer','Francis','Gaddi','2020-03-30 20:26:17','2020-03-30 20:26:17'),(4,'kaijes@ymail.com',_binary 'Q*¥!M<\Ø4<\ÕÂ¡\Äz>s\Ä~Å‹Ÿ\á<2ôù\ÅI',1,'Developer','Francis','Gaddi','2020-04-02 19:02:04','2020-04-02 19:02:04'),(5,'kaijes2@ymail.com',_binary 'Q*¥!M<\Ø4<\ÕÂ¡\Äz>s\Ä~Å‹Ÿ\á<2ôù\ÅI',1,'Developer','Francis','De','2020-04-02 19:03:34','2020-04-02 19:03:34'),(6,'test@test.com',_binary 'Q*¥!M<\Ø4<\ÕÂ¡\Äz>s\Ä~Å‹Ÿ\á<2ôù\ÅI',1,'test','test','testa','2020-04-02 19:06:57','2020-04-02 19:06:57');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-04-03 20:56:45
