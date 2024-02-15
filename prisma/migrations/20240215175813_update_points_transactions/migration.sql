/*
  Warnings:

  - A unique constraint covering the columns `[userId,repositoryId,url]` on the table `point_transactions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "point_transactions_userId_repositoryId_url_key" ON "point_transactions"("userId", "repositoryId", "url");
