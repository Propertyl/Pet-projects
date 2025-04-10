/*
  Warnings:

  - A unique constraint covering the columns `[ip]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `ip` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_ip_key` ON `User`(`ip`);
