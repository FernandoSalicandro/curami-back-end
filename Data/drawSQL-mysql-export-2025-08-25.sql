CREATE TABLE `Professionisti`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `nome` TEXT NOT NULL,
    `cognome` TEXT NOT NULL,
    `settore` ENUM('Fisioterapista', 'Infermiere') NOT NULL,
    `genere` ENUM('Uomo', 'Donna') NOT NULL,
    `provincia` TEXT NOT NULL,
    `raggio_km` INT NOT NULL,
    `disponibilità` TEXT NOT NULL,
    `telefono` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL
);
CREATE TABLE `specializzazione`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `nome_specializzazione` TEXT NOT NULL
);
CREATE TABLE `professionista_specializzazione`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `professionista_id` BIGINT NOT NULL,
    `specializzazione_id` BIGINT NOT NULL
);
ALTER TABLE
    `professionista_specializzazione` ADD INDEX `professionista_id_specializzazione_id_index`(
        `professionista_id`,
        `specializzazione_id`
    );
CREATE TABLE `paziente`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `nome` VARCHAR(255) NOT NULL,
    `cognome` VARCHAR(255) NOT NULL,
    `telefono` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `età` INT NOT NULL,
    `stato_paziente` VARCHAR(255) NOT NULL,
    `servizio` VARCHAR(255) NOT NULL,
    `racconto` TEXT NOT NULL,
    `urgenza` VARCHAR(255) NOT NULL,
    `giorni` VARCHAR(255) NOT NULL,
    `orari` VARCHAR(255) NOT NULL,
    `preferenza_genere` ENUM('Uomo', 'Donna', 'Indifferente') NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE
    `professionista_specializzazione` ADD CONSTRAINT `professionista_specializzazione_professionista_id_foreign` FOREIGN KEY(`professionista_id`) REFERENCES `Professionisti`(`id`);
ALTER TABLE
    `professionista_specializzazione` ADD CONSTRAINT `professionista_specializzazione_specializzazione_id_foreign` FOREIGN KEY(`specializzazione_id`) REFERENCES `specializzazione`(`id`);