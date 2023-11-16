/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Circle` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Circle" DROP CONSTRAINT "Circle_ownerId_fkey";

-- AlterTable
ALTER TABLE "Circle" DROP COLUMN "ownerId";
