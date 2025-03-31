/*
  Warnings:

  - You are about to drop the column `phonenumber` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phone]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `User_phonenumber_key` ON `user`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `phonenumber`,
    ADD COLUMN `phone` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_phone_key` ON `User`(`phone`);
