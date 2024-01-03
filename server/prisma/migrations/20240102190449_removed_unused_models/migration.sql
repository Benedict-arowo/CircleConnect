/*
  Warnings:

  - You are about to drop the `CircleRating` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CircleRating" DROP CONSTRAINT "CircleRating_userId_fkey";

-- DropTable
DROP TABLE "CircleRating";
