/*
  Warnings:

  - Changed the type of `githubId` on the `installations` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `githubId` on the `repositories` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `githubId` on the `users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "installations" DROP COLUMN "githubId",
ADD COLUMN     "githubId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "repositories" DROP COLUMN "githubId",
ADD COLUMN     "githubId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "githubId",
ADD COLUMN     "githubId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "installations_githubId_key" ON "installations"("githubId");

-- CreateIndex
CREATE UNIQUE INDEX "repositories_githubId_key" ON "repositories"("githubId");

-- CreateIndex
CREATE UNIQUE INDEX "users_githubId_key" ON "users"("githubId");
