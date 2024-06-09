/*
  Warnings:

  - The primary key for the `CircleMember` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `CircleMember` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CircleMember" DROP CONSTRAINT "CircleMember_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "CircleMember_pkey" PRIMARY KEY ("userId");
