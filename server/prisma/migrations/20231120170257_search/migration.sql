/*
  Warnings:

  - A unique constraint covering the columns `[search]` on the table `Search` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Search_search_key" ON "Search"("search");
