/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `Auth` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `phone` to the `Auth` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Auth_ip_key` ON `auth`;

-- DropIndex
DROP INDEX `User_password_key` ON `user`;

-- AlterTable
ALTER TABLE `auth` ADD COLUMN `phone` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Auth_phone_key` ON `Auth`(`phone`);
