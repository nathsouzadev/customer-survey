/*
  Warnings:

  - You are about to drop the column `phomeNumber` on the `WaitingCompany` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phoneNumber]` on the table `WaitingCompany` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `phoneNumber` to the `WaitingCompany` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "WaitingCompany_phomeNumber_key";

-- AlterTable
ALTER TABLE "WaitingCompany" DROP COLUMN "phomeNumber",
ADD COLUMN     "phoneNumber" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "WaitingCompany_phoneNumber_key" ON "WaitingCompany"("phoneNumber");
