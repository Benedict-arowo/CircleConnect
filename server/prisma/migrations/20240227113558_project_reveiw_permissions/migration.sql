-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "canCreateProjectReviews" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canDeleteOwnProjectReviews" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canManageProjectRevies" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canModifyOwnProjectReviews" BOOLEAN NOT NULL DEFAULT false;
