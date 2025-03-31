/*
  Warnings:

  - You are about to alter the column `chatUsers` on the `chats` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.

*/
-- AlterTable
ALTER TABLE `chats` MODIFY `chatUsers` JSON NOT NULL;
