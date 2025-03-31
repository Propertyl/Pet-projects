/*
  Warnings:

  - You are about to drop the column `auth` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `auth`;

-- CreateTable
CREATE TABLE `Auth` (
    `ip` VARCHAR(191) NOT NULL,
    `authorized` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Auth_ip_key`(`ip`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
