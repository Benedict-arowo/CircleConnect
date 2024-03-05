-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "canAddProjectToCircle" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canRemoveProjectFromCircle" BOOLEAN NOT NULL DEFAULT false;
