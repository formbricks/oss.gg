/*
  Warnings:

  - You are about to drop the column `currentLevelId` on the `enrollments` table. All the data in the column will be lost.
  - You are about to drop the column `totalPoints` on the `enrollments` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "enrollments" DROP CONSTRAINT "enrollments_currentLevelId_fkey";

-- AlterTable
ALTER TABLE "enrollments" DROP COLUMN "currentLevelId",
DROP COLUMN "totalPoints";
