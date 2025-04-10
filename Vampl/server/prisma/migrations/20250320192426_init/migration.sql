/*
  Warnings:

  - You are about to drop the column `number` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phonenumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `User_number_key` ON `user`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `number`,
    ADD COLUMN `phonenumber` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_phonenumber_key` ON `User`(`phonenumber`);
