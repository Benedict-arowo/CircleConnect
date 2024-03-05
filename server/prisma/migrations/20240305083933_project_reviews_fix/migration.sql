/*
  Warnings:

  - You are about to drop the column `canManageProjectReviwes` on the `Role` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Role" DROP COLUMN "canManageProjectReviwes",
ADD COLUMN     "canManageProjectReviews" BOOLEAN NOT NULL DEFAULT false;
