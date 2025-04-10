-- CreateTable
CREATE TABLE `MonthUA` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `numberM` INTEGER NOT NULL,
    `month` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `MonthUA_numberM_key`(`numberM`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MonthEN` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `numberM` INTEGER NOT NULL,
    `month` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `MonthEN_numberM_key`(`numberM`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
