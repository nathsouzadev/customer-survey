/*
  Warnings:

  - Made the column `metaId` on table `PhoneCompany` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "PhoneCompany" ALTER COLUMN "metaId" SET NOT NULL;
