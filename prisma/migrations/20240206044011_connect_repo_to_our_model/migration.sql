-- AlterTable
ALTER TABLE "repositories" ADD COLUMN     "configured" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "default_branch" DROP NOT NULL;
