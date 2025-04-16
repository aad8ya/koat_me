-- CreateEnum
CREATE TYPE "State" AS ENUM ('AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY');

-- AlterTable
ALTER TABLE "Quote" ADD COLUMN     "roofTypeIdTemp" INTEGER,
ADD COLUMN     "stateTemp" "State";

-- CreateTable
CREATE TABLE "RoofType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "RoofType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RoofType_name_key" ON "RoofType"("name");

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_roofTypeIdTemp_fkey" FOREIGN KEY ("roofTypeIdTemp") REFERENCES "RoofType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
