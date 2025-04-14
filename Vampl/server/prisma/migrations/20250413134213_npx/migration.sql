/*
  Warnings:

  - You are about to drop the column `ip` on the `onlinestatuses` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phone]` on the table `OnlineStatuses` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `phone` to the `OnlineStatuses` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `OnlineStatuses_ip_key` ON `onlinestatuses`;

-- AlterTable
ALTER TABLE `onlinestatuses` DROP COLUMN `ip`,
    ADD COLUMN `phone` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `OnlineStatuses_phone_key` ON `OnlineStatuses`(`phone`);
