/*
  Warnings:

  - You are about to drop the `CheatingLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CheatingLog" DROP CONSTRAINT "CheatingLog_sessionId_fkey";

-- DropTable
DROP TABLE "CheatingLog";

-- CreateTable
CREATE TABLE "ProctoringReport" (
    "id" SERIAL NOT NULL,
    "sessionId" INTEGER NOT NULL,
    "lookingAwayCount" INTEGER NOT NULL DEFAULT 0,
    "multiplePeopleDetected" BOOLEAN NOT NULL DEFAULT false,
    "phoneDetected" BOOLEAN NOT NULL DEFAULT false,
    "infractionTimeline" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProctoringReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProctoringReport_sessionId_key" ON "ProctoringReport"("sessionId");

-- AddForeignKey
ALTER TABLE "ProctoringReport" ADD CONSTRAINT "ProctoringReport_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "AssessmentSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
