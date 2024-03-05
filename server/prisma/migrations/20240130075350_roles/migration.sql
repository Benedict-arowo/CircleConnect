/*
  Warnings:

  - Added the required column `roleId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "School" AS ENUM ('ENGINEERING');

-- CreateEnum
CREATE TYPE "Track" AS ENUM ('FRONTEND', 'BACKEND', 'CLOUD');

-- AlterTable
ALTER TABLE "Circle" ALTER COLUMN "description" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "roleId" TEXT NOT NULL,
ADD COLUMN     "school" "School" NOT NULL DEFAULT 'ENGINEERING',
ADD COLUMN     "track" "Track";

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "canCreateCircle" BOOLEAN NOT NULL DEFAULT false,
    "canModifyOwnCircle" BOOLEAN NOT NULL DEFAULT false,
    "canMotifyOtherCircle" BOOLEAN NOT NULL DEFAULT false,
    "canDeleteOwnCircle" BOOLEAN NOT NULL DEFAULT false,
    "canDeleteOtherCircles" BOOLEAN NOT NULL DEFAULT false,
    "canLeaveCircle" BOOLEAN NOT NULL DEFAULT false,
    "canJoinCircle" BOOLEAN NOT NULL DEFAULT false,
    "canCreateProject" BOOLEAN NOT NULL DEFAULT false,
    "canModifyOwnProject" BOOLEAN NOT NULL DEFAULT false,
    "canModifyOtherProject" BOOLEAN NOT NULL DEFAULT false,
    "canDeleteOwnProject" BOOLEAN NOT NULL DEFAULT false,
    "canDeleteOtherProject" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
