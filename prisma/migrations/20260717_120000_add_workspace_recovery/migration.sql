-- CreateTable
CREATE TABLE "MvpWorkspaceRecovery" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "exportedAt" TIMESTAMP(3) NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MvpWorkspaceRecovery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MvpWorkspaceRecovery_userId_createdAt_idx" ON "MvpWorkspaceRecovery"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "MvpWorkspaceRecovery" ADD CONSTRAINT "MvpWorkspaceRecovery_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
