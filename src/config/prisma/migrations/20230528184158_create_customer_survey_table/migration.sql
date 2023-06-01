-- CreateTable
CREATE TABLE "CustomerSurvey" (
    "id" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "customerId" TEXT NOT NULL,
    "surveyId" TEXT NOT NULL,

    CONSTRAINT "CustomerSurvey_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CustomerSurvey" ADD CONSTRAINT "CustomerSurvey_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerSurvey" ADD CONSTRAINT "CustomerSurvey_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
