-- AlterTable
ALTER TABLE "CustomerAnswer" ADD COLUMN     "questionId" TEXT;

-- AddForeignKey
ALTER TABLE "CustomerAnswer" ADD CONSTRAINT "CustomerAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE SET NULL ON UPDATE CASCADE;
