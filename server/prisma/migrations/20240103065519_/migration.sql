/*
  Warnings:

  - The primary key for the `ProjectRating` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ProjectRating` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "ProjectRating_userId_projectId_key";

-- AlterTable
ALTER TABLE "ProjectRating" DROP CONSTRAINT "ProjectRating_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "ProjectRating_pkey" PRIMARY KEY ("userId", "projectId");
