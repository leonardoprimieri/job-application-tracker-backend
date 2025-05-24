-- AlterEnum
ALTER TYPE "ApplicationStatus" ADD VALUE 'ACCEPTED';

-- AlterTable
ALTER TABLE "job_applications" ADD COLUMN     "salary_range" TEXT;
