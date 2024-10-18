-- CreateTable
CREATE TABLE "GlobalSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cloudflareZoneId" TEXT NOT NULL,
    "baseUrl" TEXT NOT NULL
);
