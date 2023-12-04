/*
  Warnings:

  - A unique constraint covering the columns `[pendingRequestId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "pendingRequestId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "User_pendingRequestId_key" ON "User"("pendingRequestId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_pendingRequestId_fkey" FOREIGN KEY ("pendingRequestId") REFERENCES "Circle"("id") ON DELETE SET NULL ON UPDATE CASCADE;
