/*
  Warnings:

  - You are about to drop the column `roofType` on the `Quote` table. All the data in the column will be lost.
  - You are about to drop the column `roofTypeIdTemp` on the `Quote` table. All the data in the column will be lost.
  - You are about to drop the column `stateTemp` on the `Quote` table. All the data in the column will be lost.
  - Added the required column `roofTypeId` to the `Quote` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `state` on the `Quote` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Quote" DROP CONSTRAINT "Quote_roofTypeIdTemp_fkey";

-- AlterTable
ALTER TABLE "Quote" DROP COLUMN "roofType";
ALTER TABLE "Quote" DROP COLUMN "state";
ALTER TABLE "Quote" RENAME COLUMN "roofTypeIdTemp" TO "roofTypeId";
ALTER TABLE "Quote" RENAME COLUMN "stateTemp" TO "state";
ALTER TABLE "Quote" ALTER COLUMN "roofTypeId" SET NOT NULL;
ALTER TABLE "Quote" ALTER COLUMN "state" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Quote_roofTypeId_idx" ON "Quote"("roofTypeId");

-- CreateIndex
CREATE INDEX "Quote_state_idx" ON "Quote"("state");

-- CreateIndex
CREATE INDEX "Quote_roofTypeId_state_idx" ON "Quote"("roofTypeId", "state");

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_roofTypeId_fkey" FOREIGN KEY ("roofTypeId") REFERENCES "RoofType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
