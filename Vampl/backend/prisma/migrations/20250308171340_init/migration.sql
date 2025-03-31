/*
  Warnings:

  - You are about to drop the `chatdata` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `chatdata`;

-- CreateTable
CREATE TABLE `Chats` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `chatId` VARCHAR(191) NOT NULL,
    `chatUsers` JSON NOT NULL,
    `messages` JSON NOT NULL,

    UNIQUE INDEX `Chats_chatId_key`(`chatId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
