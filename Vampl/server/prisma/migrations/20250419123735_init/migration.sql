/*
  Warnings:

  - You are about to drop the column `ip` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `auth` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `ip`,
    ALTER COLUMN `image` DROP DEFAULT;

-- DropTable
DROP TABLE `auth`;
