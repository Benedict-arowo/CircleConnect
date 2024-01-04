/*
  Warnings:

  - You are about to drop the column `circleNumber` on the `Member` table. All the data in the column will be lost.
  - Added the required column `circleId` to the `Member` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Member" DROP CONSTRAINT "Member_circleNumber_fkey";

-- AlterTable
ALTER TABLE "Member" DROP COLUMN "circleNumber",
ADD COLUMN     "circleId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_circleId_fkey" FOREIGN KEY ("circleId") REFERENCES "Circle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
