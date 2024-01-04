/*
  Warnings:

  - You are about to drop the column `live` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "live",
ADD COLUMN     "liveLink" TEXT;
