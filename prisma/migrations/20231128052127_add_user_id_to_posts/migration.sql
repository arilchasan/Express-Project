/*
  Warnings:

  - You are about to alter the column `title` on the `post` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - Added the required column `userId` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `post` ADD COLUMN `userId` VARCHAR(100) NOT NULL,
    MODIFY `title` VARCHAR(100) NOT NULL,
    MODIFY `body` VARCHAR(200) NULL;
