-- CreateTable
CREATE TABLE "api_keys" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "label" TEXT,
    "hashedKey" TEXT NOT NULL,
    "repositoryId" TEXT NOT NULL,

    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_id_key" ON "api_keys"("id");

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_hashedKey_key" ON "api_keys"("hashedKey");

-- CreateIndex
CREATE INDEX "api_keys_repositoryId_idx" ON "api_keys"("repositoryId");

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "repositories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
