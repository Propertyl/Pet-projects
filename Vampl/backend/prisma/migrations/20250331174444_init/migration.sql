-- CreateTable
CREATE TABLE `UserTheme` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ip` VARCHAR(191) NOT NULL,
    `theme` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `UserTheme_ip_key`(`ip`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
