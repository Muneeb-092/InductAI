/*
  Warnings:

  - You are about to drop the `AssessmentLink` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AssessmentLink" DROP CONSTRAINT "AssessmentLink_jobId_fkey";

-- DropTable
DROP TABLE "AssessmentLink";
