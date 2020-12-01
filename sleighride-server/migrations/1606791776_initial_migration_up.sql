-- Description: initial migration
-- Up migration
CREATE TABLE `sleighride`.`users` (
	`id` SERIAL,
	`username` VARCHAR(255),
	`fname` VARCHAR(255),
	`lname` VARCHAR(255),
	`password` VARCHAR(255),
	`addr1` VARCHAR(255),
	`addr2` VARCHAR(255),
	`city` VARCHAR(255),
	`state` VARCHAR(2),
	`zip` VARCHAR(6),
	`assignedUser` INT,
	`isManager` TINYINT(1),
	PRIMARY KEY (id)
);
CREATE TABLE `sleighride`.`notes` (
	`id` SERIAL,
	`fromUser` INT,
	`toSecret` TINYINT(1),
	`content` TEXT,
	PRIMARY KEY (id)
);