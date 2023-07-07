-- CreateTable
CREATE TABLE "WaitingCompany" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phomeNumber" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,

    CONSTRAINT "WaitingCompany_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WaitingCompany_email_key" ON "WaitingCompany"("email");

-- CreateIndex
CREATE UNIQUE INDEX "WaitingCompany_phomeNumber_key" ON "WaitingCompany"("phomeNumber");
