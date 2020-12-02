-- Description: rework notes
-- Up migration
DROP TABLE IF EXISTS `sleighride`.`notes`;
CREATE TABLE `sleighride`.`notes` (
	`id` SERIAL,
	`fromUser` INT,
	`toUser` INT,
	`toSanta` TINYINT(1),
	`sendTime` DATETIME,
	`content` TEXT,
	PRIMARY KEY (id)
);