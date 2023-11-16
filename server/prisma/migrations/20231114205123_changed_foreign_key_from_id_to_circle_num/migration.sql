/*
  Warnings:

  - You are about to drop the column `circleId` on the `Member` table. All the data in the column will be lost.
  - Added the required column `circleNumber` to the `Member` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Member" DROP CONSTRAINT "Member_circleId_fkey";

-- AlterTable
ALTER TABLE "Member" DROP COLUMN "circleId",
ADD COLUMN     "circleNumber" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_circleNumber_fkey" FOREIGN KEY ("circleNumber") REFERENCES "Circle"("num") ON DELETE RESTRICT ON UPDATE CASCADE;
