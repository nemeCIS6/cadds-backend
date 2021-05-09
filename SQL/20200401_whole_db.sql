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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
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
  `coordinates` point NOT NULL,
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locations`
--

LOCK TABLES `locations` WRITE;
/*!40000 ALTER TABLE `locations` DISABLE KEYS */;
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
  PRIMARY KEY (`uid`),
  KEY `user_idx` (`user`),
  KEY `media_user_idx` (`user`),
  KEY `media_type_idx` (`type`),
  KEY `media_deleted_by_idx` (`deleted_by`),
  CONSTRAINT `media_deleted_by` FOREIGN KEY (`deleted_by`) REFERENCES `users` (`uid`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `media_type` FOREIGN KEY (`type`) REFERENCES `media_type` (`uid`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `media_user` FOREIGN KEY (`user`) REFERENCES `users` (`uid`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `media`
--

LOCK TABLES `media` WRITE;
/*!40000 ALTER TABLE `media` DISABLE KEYS */;
/*!40000 ALTER TABLE `media` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `media_type`
--

DROP TABLE IF EXISTS `media_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `media_type` (
  `uid` tinyint(3) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `media_type`
--

LOCK TABLES `media_type` WRITE;
/*!40000 ALTER TABLE `media_type` DISABLE KEYS */;
/*!40000 ALTER TABLE `media_type` ENABLE KEYS */;
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
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` int(11) unsigned NOT NULL,
  `job_number` int(11) NOT NULL,
  `status` tinyint(3) unsigned NOT NULL,
  `title` varchar(64) NOT NULL,
  `site` int(11) unsigned NOT NULL,
  `client` int(11) unsigned NOT NULL,
  `work_order_number` varchar(64) NOT NULL,
  `hourly_rate` decimal(10,0) DEFAULT NULL,
  `quoted_rate` decimal(10,0) DEFAULT NULL,
  `edm_number` int(11) DEFAULT NULL,
  `deadline` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `projects_status_idx` (`status`),
  KEY `projects__site_idx` (`site`),
  KEY `projects_client_idx` (`client`),
  KEY `project_user_idx` (`user`),
  CONSTRAINT `project_user` FOREIGN KEY (`user`) REFERENCES `users` (`uid`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `projects_client` FOREIGN KEY (`client`) REFERENCES `clients` (`uid`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `projects_site` FOREIGN KEY (`site`) REFERENCES `locations` (`uid`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `projects_status` FOREIGN KEY (`status`) REFERENCES `project_statuses` (`uid`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES (1,_binary '\"^a6*£^(ù‹‡ˆ	¸.¢k+\ïÀ¿§Fd=LN\ÛN~',3,'2020-03-30 21:01:15','2020-04-29 21:01:15');
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'francisjohngaddi@gmail.com',_binary 'Q*¥!M<\Ø4<\ÕÂ¡\Äz>s\Ä~Å‹Ÿ\á<2ôù\ÅI',1,'Developer','Francis','Gaddi','2020-03-30 20:21:59','2020-03-30 20:21:59'),(2,'francisjohngaddi2@gmail.com',_binary 'Q*¥!M<\Ø4<\ÕÂ¡\Äz>s\Ä~Å‹Ÿ\á<2ôù\ÅI',1,'Developer','Francis','Gaddi','2020-03-30 20:23:52','2020-03-30 20:23:52'),(3,'francisjohngaddi3@gmail.com',_binary 'Q*¥!M<\Ø4<\ÕÂ¡\Äz>s\Ä~Å‹Ÿ\á<2ôù\ÅI',1,'Developer','Francis','Gaddi','2020-03-30 20:26:17','2020-03-30 20:26:17');
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

-- Dump completed on 2020-04-01  0:34:05
