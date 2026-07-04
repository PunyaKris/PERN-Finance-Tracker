-- AlterTable
ALTER TABLE "budgets" ADD COLUMN     "description" TEXT,
ADD COLUMN     "icon" TEXT;

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "icon" TEXT,
ALTER COLUMN "transactionDate" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "globalYearlyLimit" DECIMAL(65,30),
ADD COLUMN     "username" TEXT NOT NULL DEFAULT '';
