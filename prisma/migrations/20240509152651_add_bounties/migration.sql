-- CreateEnum
CREATE TYPE "BountyStatus" AS ENUM ('open', 'redeemed');

-- AlterTable
ALTER TABLE "repositories" ADD COLUMN     "maxAutomaticPayout" INTEGER NOT NULL DEFAULT 50,
ADD COLUMN     "maxBounty" INTEGER NOT NULL DEFAULT 250;

-- CreateTable
CREATE TABLE "bounties" (
    "id" TEXT NOT NULL,
    "usdAmount" INTEGER NOT NULL,
    "status" "BountyStatus" NOT NULL,
    "issueUrl" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "rewardId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "repositoryId" TEXT NOT NULL,

    CONSTRAINT "bounties_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "bounties" ADD CONSTRAINT "bounties_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bounties" ADD CONSTRAINT "bounties_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "repositories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
