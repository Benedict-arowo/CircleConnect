-- CreateEnum
CREATE TYPE "circleVisibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- AlterTable
ALTER TABLE "Circle" ADD COLUMN     "visibility" "circleVisibility" NOT NULL DEFAULT 'PUBLIC';

-- CreateTable
CREATE TABLE "CircleRating" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "circleId" TEXT NOT NULL,

    CONSTRAINT "CircleRating_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CircleRating" ADD CONSTRAINT "CircleRating_circleId_fkey" FOREIGN KEY ("circleId") REFERENCES "Circle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
