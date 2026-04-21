/*
  Warnings:

  - The `difficulty` column on the `QuestionBank` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `importance` on the `JobSkill` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "QuestionDifficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- AlterTable
ALTER TABLE "JobSkill" DROP COLUMN "importance",
ADD COLUMN     "importance" "SkillType" NOT NULL;

-- AlterTable
ALTER TABLE "QuestionBank" DROP COLUMN "difficulty",
ADD COLUMN     "difficulty" "QuestionDifficulty";

-- DropEnum
DROP TYPE "QuestionDifficuty";
