-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('easy', 'medium', 'hard');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Problem" (
    "id" SERIAL NOT NULL,
    "creatorId" TEXT NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "tags" TEXT[],
    "testsOptions" JSONB NOT NULL,
    "functionOptions" JSONB NOT NULL,
    "solution" TEXT NOT NULL,

    CONSTRAINT "Problem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_problems" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_solved_problems" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_dislikes_problems" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_likes_problems" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_problems_AB_unique" ON "_problems"("A", "B");

-- CreateIndex
CREATE INDEX "_problems_B_index" ON "_problems"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_solved_problems_AB_unique" ON "_solved_problems"("A", "B");

-- CreateIndex
CREATE INDEX "_solved_problems_B_index" ON "_solved_problems"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_dislikes_problems_AB_unique" ON "_dislikes_problems"("A", "B");

-- CreateIndex
CREATE INDEX "_dislikes_problems_B_index" ON "_dislikes_problems"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_likes_problems_AB_unique" ON "_likes_problems"("A", "B");

-- CreateIndex
CREATE INDEX "_likes_problems_B_index" ON "_likes_problems"("B");

-- AddForeignKey
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_problems" ADD CONSTRAINT "_problems_A_fkey" FOREIGN KEY ("A") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_problems" ADD CONSTRAINT "_problems_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_solved_problems" ADD CONSTRAINT "_solved_problems_A_fkey" FOREIGN KEY ("A") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_solved_problems" ADD CONSTRAINT "_solved_problems_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_dislikes_problems" ADD CONSTRAINT "_dislikes_problems_A_fkey" FOREIGN KEY ("A") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_dislikes_problems" ADD CONSTRAINT "_dislikes_problems_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_likes_problems" ADD CONSTRAINT "_likes_problems_A_fkey" FOREIGN KEY ("A") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_likes_problems" ADD CONSTRAINT "_likes_problems_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

