-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_circleId_fkey";

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "github" DROP NOT NULL,
ALTER COLUMN "circleId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_circleId_fkey" FOREIGN KEY ("circleId") REFERENCES "Circle"("id") ON DELETE SET NULL ON UPDATE CASCADE;
