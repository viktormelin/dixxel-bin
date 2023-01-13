/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Images` table. All the data in the column will be lost.
  - Added the required column `imageId` to the `Images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageURL` to the `Images` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Images" DROP COLUMN "updatedAt",
ADD COLUMN     "imageId" TEXT NOT NULL,
ADD COLUMN     "imageURL" TEXT NOT NULL;
