/*
  Warnings:

  - The primary key for the `Circle` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `num` on the `Circle` table. All the data in the column will be lost.
  - The `coleadOfId` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `leadOfId` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `memberOfId` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `id` on the `Circle` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `circleId` on the `CircleRating` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `circleId` on the `Project` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "CircleRating" DROP CONSTRAINT "CircleRating_circleId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_circleId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_coleadOfId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_leadOfId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_memberOfId_fkey";

-- DropIndex
DROP INDEX "Circle_num_key";

-- AlterTable
ALTER TABLE "Circle" DROP CONSTRAINT "Circle_pkey",
DROP COLUMN "num",
DROP COLUMN "id",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "Circle_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "CircleRating" DROP COLUMN "circleId",
ADD COLUMN     "circleId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "circleId",
ADD COLUMN     "circleId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "coleadOfId",
ADD COLUMN     "coleadOfId" INTEGER,
DROP COLUMN "leadOfId",
ADD COLUMN     "leadOfId" INTEGER,
DROP COLUMN "memberOfId",
ADD COLUMN     "memberOfId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Circle_id_key" ON "Circle"("id");

-- CreateIndex
CREATE UNIQUE INDEX "CircleRating_userId_circleId_key" ON "CircleRating"("userId", "circleId");

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

-- AddForeignKey
ALTER TABLE "CircleRating" ADD CONSTRAINT "CircleRating_circleId_fkey" FOREIGN KEY ("circleId") REFERENCES "Circle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_circleId_fkey" FOREIGN KEY ("circleId") REFERENCES "Circle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
