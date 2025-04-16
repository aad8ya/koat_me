-- CreateTable
CREATE TABLE "Quote" (
    "id" TEXT NOT NULL,
    "contractor" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "roofSize" DOUBLE PRECISION NOT NULL,
    "roofType" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "projectDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
);
