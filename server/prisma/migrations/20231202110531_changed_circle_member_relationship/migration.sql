/*
  Warnings:

  - You are about to drop the `Member` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Member" DROP CONSTRAINT "Member_circleId_fkey";

-- DropForeignKey
ALTER TABLE "Member" DROP CONSTRAINT "Member_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "circleId" TEXT,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'MEMBER';

-- DropTable
DROP TABLE "Member";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_circleId_fkey" FOREIGN KEY ("circleId") REFERENCES "Circle"("id") ON DELETE SET NULL ON UPDATE CASCADE;
