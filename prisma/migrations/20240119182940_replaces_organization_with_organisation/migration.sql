/*
  Warnings:

  - The values [organisation] on the enum `InstallationType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "InstallationType_new" AS ENUM ('user', 'organization');
ALTER TABLE "installations" ALTER COLUMN "type" TYPE "InstallationType_new" USING ("type"::text::"InstallationType_new");
ALTER TYPE "InstallationType" RENAME TO "InstallationType_old";
ALTER TYPE "InstallationType_new" RENAME TO "InstallationType";
DROP TYPE "InstallationType_old";
COMMIT;
