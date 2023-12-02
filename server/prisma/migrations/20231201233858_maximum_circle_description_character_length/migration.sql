/*
  Warnings:

  - You are about to alter the column `description` on the `Circle` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(300)`.
  - Made the column `description` on table `Circle` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Circle" ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "description" SET DATA TYPE VARCHAR(300);
