/*
  Warnings:

  - A unique constraint covering the columns `[userId,circleId]` on the table `CircleRating` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "CircleRating" ALTER COLUMN "rating" SET DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "CircleRating_userId_circleId_key" ON "CircleRating"("userId", "circleId");
