/*
  Warnings:

  - You are about to drop the column `canManageProjectRevies` on the `Role` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Role" DROP COLUMN "canManageProjectRevies",
ADD COLUMN     "canManageProjectReviwes" BOOLEAN NOT NULL DEFAULT false;
