-- Description: rework notes
-- Down migration
DROP TABLE IF EXISTS `sleighride`.`notes`;
CREATE TABLE `sleighride`.`notes` (
	`id` SERIAL,
	`fromUser` INT,
	`toSecret` TINYINT(1),
	`content` TEXT,
	PRIMARY KEY (id)
);