-- CreateTable
CREATE TABLE "PhoneCompany" (
    "id" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "PhoneCompany_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PhoneCompany" ADD CONSTRAINT "PhoneCompany_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
