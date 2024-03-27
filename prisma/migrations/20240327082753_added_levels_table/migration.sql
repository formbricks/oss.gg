/*
  Warnings:

  - You are about to drop the column `levels` on the `repositories` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "enrollments" ADD COLUMN     "currentLevelId" TEXT,
ADD COLUMN     "totalPoints" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "repositories" DROP COLUMN "levels";

-- CreateTable
CREATE TABLE "levels" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "pointThreshold" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "permissions" JSONB NOT NULL,
    "tags" TEXT[],
    "repositoryId" TEXT NOT NULL,

    CONSTRAINT "levels_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "levels_repositoryId_key" ON "levels"("repositoryId");

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_currentLevelId_fkey" FOREIGN KEY ("currentLevelId") REFERENCES "levels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "levels" ADD CONSTRAINT "levels_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "repositories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
