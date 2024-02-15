/*
  Warnings:

  - You are about to drop the column `canMotifyOtherCircle` on the `Role` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Role" DROP COLUMN "canMotifyOtherCircle",
ADD COLUMN     "canModifyOtherCircle" BOOLEAN NOT NULL DEFAULT false;
