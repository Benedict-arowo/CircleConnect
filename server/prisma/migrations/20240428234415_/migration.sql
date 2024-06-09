/*
  Warnings:

  - You are about to drop the column `coleadOfId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `leadOfId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `memberOfId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `pendingRequestId` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "CircleStatus" AS ENUM ('LEADER', 'COLEADER', 'MEMBER', 'PENDING');

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_coleadOfId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_leadOfId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_memberOfId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_pendingRequestId_fkey";

-- DropIndex
DROP INDEX "User_coleadOfId_key";

-- DropIndex
DROP INDEX "User_leadOfId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "coleadOfId",
DROP COLUMN "leadOfId",
DROP COLUMN "memberOfId",
DROP COLUMN "pendingRequestId";

-- CreateTable
CREATE TABLE "CircleMember" (
    "id" TEXT NOT NULL,
    "circleId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "CircleStatus" NOT NULL,

    CONSTRAINT "CircleMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CircleMember_userId_key" ON "CircleMember"("userId");

-- AddForeignKey
ALTER TABLE "CircleMember" ADD CONSTRAINT "CircleMember_circleId_fkey" FOREIGN KEY ("circleId") REFERENCES "Circle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CircleMember" ADD CONSTRAINT "CircleMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
