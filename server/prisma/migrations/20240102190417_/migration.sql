/*
  Warnings:

  - You are about to drop the column `averageUserRating` on the `Circle` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "CircleRating" DROP CONSTRAINT "CircleRating_circleId_fkey";

-- AlterTable
ALTER TABLE "Circle" DROP COLUMN "averageUserRating",
ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL DEFAULT 0.0;
