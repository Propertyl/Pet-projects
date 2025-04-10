-- CreateTable
CREATE TABLE `ChatData` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userIp` VARCHAR(191) NOT NULL,
    `chats` JSON NOT NULL,

    UNIQUE INDEX `ChatData_userIp_key`(`userIp`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
