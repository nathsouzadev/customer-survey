/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Sender` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Sender_email_key" ON "Sender"("email");
