/*
  Warnings:

  - Made the column `questionId` on table `CustomerAnswer` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "CustomerAnswer" DROP CONSTRAINT "CustomerAnswer_questionId_fkey";

-- AlterTable
ALTER TABLE "CustomerAnswer" ALTER COLUMN "questionId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "CustomerAnswer" ADD CONSTRAINT "CustomerAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
