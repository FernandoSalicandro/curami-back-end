-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: curami_db
-- ------------------------------------------------------
-- Server version	8.4.5

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
-- Table structure for table `disponibilità`
--

DROP TABLE IF EXISTS `disponibilità`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `disponibilità` (
  `id` bigint unsigned NOT NULL,
  `professionista_id` bigint unsigned NOT NULL,
  `giorno` varchar(255) NOT NULL,
  `orario` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_professionista` (`professionista_id`),
  CONSTRAINT `fk_professionista` FOREIGN KEY (`professionista_id`) REFERENCES `professionisti` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `disponibilità`
--

LOCK TABLES `disponibilità` WRITE;
/*!40000 ALTER TABLE `disponibilità` DISABLE KEYS */;
INSERT INTO `disponibilità` VALUES (1,1,'Lunedì','Mattina'),(2,1,'Lunedì ','Pomeriggio'),(3,1,'Lunedì','Sera'),(4,1,'Martedì','Mattina'),(5,1,'Martedì','Pomeriggio'),(6,1,'Martedì','Sera'),(7,1,'Mercoledì','Mattina'),(8,1,'Mercoledì','Pomeriggio'),(9,1,'Mercoledì','Sera'),(10,1,'Giovedì','Mattina'),(11,1,'Giovedì','Pomeriggio'),(12,1,'Giovedì','Sera'),(13,1,'Venerdì','Mattina'),(14,1,'Venerdì','Pomeriggio'),(15,1,'Venerdì','Sera'),(16,1,'Sabato','Mattina'),(17,2,'Lunedì','Mattina'),(18,2,'Lunedì ','Pomeriggio'),(19,2,'Lunedì','Sera'),(20,2,'Martedì','Mattina'),(21,2,'Martedì','Pomeriggio'),(22,2,'Martedì','Sera'),(23,2,'Mercoledì','Mattina'),(24,2,'Mercoledì','Pomeriggio'),(25,2,'Mercoledì','Sera'),(26,2,'Giovedì','Mattina'),(27,2,'Giovedì','Pomeriggio'),(28,2,'Giovedì','Sera'),(29,2,'Venerdì','Mattina'),(30,2,'Venerdì','Pomeriggio'),(31,2,'Venerdì','Sera'),(32,2,'Sabato','Mattina'),(33,2,'Sabato','Pomeriggio'),(34,3,'Lunedì','Mattina'),(35,3,'Lunedì','Pomeriggio'),(36,3,'Lunedì','Sera'),(37,3,'Martedì','Mattina'),(38,3,'Martedì','Pomeriggio'),(39,3,'Martedì','Sera'),(40,3,'Mercoledì','Mattina'),(41,3,'Mercoledì','Pomeriggio'),(42,3,'Mercoledì','Sera'),(43,3,'Giovedì','Mattina'),(44,3,'Giovedì','Pomeriggio'),(45,3,'Giovedì','Sera'),(46,3,'Venerdì','Mattina'),(47,3,'Venerdì','Pomeriggio'),(48,3,'Venerdì','Sera'),(49,3,'Sabato','Mattina'),(50,3,'Sabato','Pomeriggio'),(51,3,'Sabato','Sera'),(52,4,'Lunedì','Mattina'),(53,4,'Lunedì','Pomeriggio'),(54,4,'Lunedì','Sera'),(55,4,'Martedi','Mattina'),(56,4,'Martedì','Pomeriggio'),(57,4,'Martedì','Sera'),(58,4,'Mercoledì','Mattina'),(59,4,'Mercoledì','Pomeriggio'),(60,4,'Mercoledì','Sera'),(61,4,'Giovedì','Mattina'),(62,4,'Giovedì','Pomeriggio'),(63,4,'Giovedì','Sera'),(64,4,'Venerdì','Mattina'),(65,4,'Venerdì','Pomeriggio'),(66,4,'Venerdì','Sera'),(67,4,'Sabato','Mattina'),(68,4,'Sabato','Pomeriggio'),(69,4,'Sabato','Sera');
/*!40000 ALTER TABLE `disponibilità` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paziente`
--

DROP TABLE IF EXISTS `paziente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `paziente` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `cognome` varchar(255) NOT NULL,
  `telefono` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `età` varchar(10) NOT NULL,
  `stato_paziente` varchar(255) NOT NULL,
  `servizio` varchar(255) NOT NULL,
  `racconto` text,
  `urgenza` varchar(255) NOT NULL,
  `giorni` varchar(255) NOT NULL,
  `orari` varchar(255) NOT NULL,
  `preferenza_genere` varchar(10) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `genere` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paziente`
--

LOCK TABLES `paziente` WRITE;
/*!40000 ALTER TABLE `paziente` DISABLE KEYS */;
INSERT INTO `paziente` VALUES (1,'Giuacchina','Salicandro','3791228440','studio.salicandro@gmail.com','36-45','Operato','Entrambi','Mi sono operato al ginocchio','4','Lunedì, Giovedì, Venerdì','Mattina','Donne','2025-08-26 17:49:55','Uomo'),(2,'Giuacchina','Salicandro','3791228440','studio.salicandro@gmail.com','36-45','Operato','Entrambi','è successo un casino compa','3','Lunedì, Martedì, Mercoledì','Mattina','Donne','2025-08-26 18:16:34','Uomo'),(3,'Giuacchina','g','3791228440','studio.salicandro@gmail.com','26-35','Nessuna delle due','Infermiere','','3','Lunedì, Giovedì, Venerdì','Mattina','Donne','2025-08-26 18:20:28','Uomo'),(4,'Giuacchino','Salicandro','3791228440','studio.salicandro@gmail.com','36-45','Nessuna delle due','Fisioterapista','','5','Lunedì, Martedì, Mercoledì','Mattina','Uomini','2025-08-26 18:27:38','Uomo'),(5,'Giuacchino','Salicandro','3791228440','studio.salicandro@gmail.com','36-45','Nessuna delle due','Fisioterapista','','5','Lunedì, Martedì, Mercoledì','Mattina','Uomini','2025-08-26 18:29:41','Uomo'),(6,'Oeeeeeeeee','Salicandro','3791228440','studio.salicandro@gmail.com','36-45','Nessuna delle due','Fisioterapista','','5','Lunedì, Giovedì, Venerdì','Mattina','Uomini','2025-08-26 18:35:37','Uomo'),(7,'Matteo','lapizza','3791228440','studio.salicandro@gmail.com','26-35','Nessuna delle due','Fisioterapista','','5','Lunedì, Giovedì, Venerdì','Mattina, Pomeriggio','Uomini','2025-08-26 18:42:48','Donna'),(8,'Stapizza','saijds','3791228440','studio.salicandro@gmail.com','36-45','Nessuna delle due','Infermiere','','4','Lunedì, Giovedì, Sabato','Mattina, Pomeriggio','Donne','2025-08-26 18:44:26','Donna'),(9,'Fernando','Salicandro','3791228440','studio.salicandro@gmail.com','46-55','Nessuna delle due','Infermiere','','4','Lunedì, Mercoledì, Venerdì','Mattina, Pomeriggio','Donne','2025-08-26 18:49:35','Donna'),(10,'Mario','Rossi','3791228440','studio.salicandro@gmail.com','26-35','Operato','Entrambi','Sono stato operato al ginocchio destro','4','Lunedì, Martedì, Mercoledì','Mattina','Uomini','2025-08-26 19:07:56','Donna'),(11,'Lollopop','Salicandro','3791228440','studio.salicandro@gmail.com','36-45','Nessuna delle due','Fisioterapista','','5','Lunedì, Giovedì, Venerdì','Mattina, Pomeriggio','Uomini','2025-08-26 19:18:51','Uomo'),(12,'Fugiat sit veniam','Fuga Quis ut conseq','+1 (442) 744-6287','studio.salicandro@gmail.com','55+','Dimesso','Entrambi','Mi sono operato al ginocchio e ora sono stato dimesso dall\'ospedale, mi servono delle cure a casa','4','Lunedì, Giovedì, Venerdì','Mattina, Pomeriggio','Uomini','2025-08-26 19:24:57','Donna'),(13,'Fernando','Salicandro','3791228440','studio.salicandro@gmail.com','36-45','Operato','Entrambi','Oeeeeeeeeeeeeeee mi sono fatto male e ho bisogno di cure a casa, è semplice la cosa vae, ecceccosa','4','Lunedì, Giovedì, Venerdì','Mattina','Uomini','2025-08-26 19:28:22','Donna'),(14,'Giovannigno','Salicandro','3791228440','studio.salicandro@gmail.com','36-45','Nessuna delle due','Fisioterapista','','5','Lunedì, Giovedì, Venerdì','Mattina, Pomeriggio','Donne','2025-08-26 19:35:13','Uomo'),(15,'Johhny','Banana','3791228440','studio.salicandro@gmail.com','55+','Nessuna delle due','Infermiere','','5','Lunedì, Mercoledì, Venerdì','Mattina, Pomeriggio, Sera','Donne','2025-08-26 19:37:06','Donna'),(16,'Giannina','Assumenda irure volu','+1 (931) 477-9863','studio.salicandro@gmail.com','36-45','Nessuna delle due','Infermiere','','4','Lunedì, Giovedì, Venerdì','Mattina, Pomeriggio, Sera','Uomini','2025-08-28 07:59:04','Uomo'),(17,'Tenetur sunt explica','Exercitation sequi d','+1 (152) 151-4474','studio.salicandro@gmail.com','36-45','Dimesso','Entrambi','Mia mamma è stata operata recentemente alla schiena e ha bisogno sia di punture che di fisioterapia','4','Lunedì, Giovedì, Venerdì','Mattina, Pomeriggio, Sera','Donne','2025-08-28 08:14:51','Uomo');
/*!40000 ALTER TABLE `paziente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `professionista_specializzazione`
--

DROP TABLE IF EXISTS `professionista_specializzazione`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `professionista_specializzazione` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `professionista_id` bigint NOT NULL,
  `specializzazione_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `professionista_id_specializzazione_id_index` (`professionista_id`,`specializzazione_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `professionista_specializzazione`
--

LOCK TABLES `professionista_specializzazione` WRITE;
/*!40000 ALTER TABLE `professionista_specializzazione` DISABLE KEYS */;
/*!40000 ALTER TABLE `professionista_specializzazione` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `professionisti`
--

DROP TABLE IF EXISTS `professionisti`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `professionisti` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nome` text NOT NULL,
  `cognome` text NOT NULL,
  `settore` enum('Fisioterapista','Infermiere') NOT NULL,
  `genere` enum('Uomo','Donna') NOT NULL,
  `provincia` text NOT NULL,
  `raggio_km` int NOT NULL,
  `telefono` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `professionisti`
--

LOCK TABLES `professionisti` WRITE;
/*!40000 ALTER TABLE `professionisti` DISABLE KEYS */;
INSERT INTO `professionisti` VALUES (1,'Fernando','Salicandro','Fisioterapista','Uomo','Francavilla Fontana',40,'3791228440','studio.salicandro@gmail.com'),(2,'Maria','Altavilla','Infermiere','Donna','Francavilla Fontana',40,'3249214148','mari.altavilla99@gmail.com'),(3,'Fernanda','Salicandra','Fisioterapista','Donna','Francavilla Fontana',40,'3791228440','studio.salicandro@gmail.com'),(4,'Mario ','Altavillo','Infermiere','Uomo','Francavilla Fontana',40,'3791228440','studio.salicandro@gmail.com');
/*!40000 ALTER TABLE `professionisti` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `specializzazione`
--

DROP TABLE IF EXISTS `specializzazione`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `specializzazione` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nome_specializzazione` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `specializzazione`
--

LOCK TABLES `specializzazione` WRITE;
/*!40000 ALTER TABLE `specializzazione` DISABLE KEYS */;
/*!40000 ALTER TABLE `specializzazione` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-28 10:46:30
