/*
  Warnings:

  - You are about to drop the column `circleId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[leadOfId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[coleadOfId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_circleId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "circleId",
DROP COLUMN "role",
ADD COLUMN     "coleadOfId" TEXT,
ADD COLUMN     "leadOfId" TEXT,
ADD COLUMN     "memberOfId" TEXT;

-- DropEnum
DROP TYPE "Role";

-- CreateIndex
CREATE UNIQUE INDEX "User_leadOfId_key" ON "User"("leadOfId");

-- CreateIndex
CREATE UNIQUE INDEX "User_coleadOfId_key" ON "User"("coleadOfId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_leadOfId_fkey" FOREIGN KEY ("leadOfId") REFERENCES "Circle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_coleadOfId_fkey" FOREIGN KEY ("coleadOfId") REFERENCES "Circle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_memberOfId_fkey" FOREIGN KEY ("memberOfId") REFERENCES "Circle"("id") ON DELETE SET NULL ON UPDATE CASCADE;
