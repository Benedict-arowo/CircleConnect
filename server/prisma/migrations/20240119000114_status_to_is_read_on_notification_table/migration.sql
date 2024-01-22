/*
  Warnings:

  - You are about to drop the column `status` on the `Notification` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "status",
ADD COLUMN     "is_read" BOOLEAN NOT NULL DEFAULT false;

-- DropEnum
DROP TYPE "NotificationStatus";
