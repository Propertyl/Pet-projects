/*
  Warnings:

  - You are about to drop the column `ip` on the `usertheme` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phone]` on the table `UserTheme` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `phone` to the `UserTheme` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `UserTheme_ip_key` ON `usertheme`;

-- AlterTable
ALTER TABLE `usertheme` DROP COLUMN `ip`,
    ADD COLUMN `phone` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `UserTheme_phone_key` ON `UserTheme`(`phone`);
