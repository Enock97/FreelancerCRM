/*
  Warnings:

  - The `status` column on the `Contact` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ContactStatus" AS ENUM ('VENTER_PA_SVAR', 'I_SAMTALE', 'TENKER_PA_DET', 'AVKLART');

-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "status",
ADD COLUMN     "status" "ContactStatus";
