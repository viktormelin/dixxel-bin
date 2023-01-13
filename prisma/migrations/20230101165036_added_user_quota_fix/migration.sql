-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bandwidth" TEXT,
ADD COLUMN     "group" TEXT NOT NULL DEFAULT 'base';
