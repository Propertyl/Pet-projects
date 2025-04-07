-- CreateTable
CREATE TABLE `Locales` (
    `page` VARCHAR(191) NOT NULL,
    `language` VARCHAR(191) NOT NULL,
    `text` JSON NOT NULL,

    UNIQUE INDEX `Locales_page_key`(`page`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
