/*
  Warnings:

  - Added the required column `panelUrl` to the `GlobalSettings` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GlobalSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cloudflareZoneId" TEXT NOT NULL,
    "baseUrl" TEXT NOT NULL,
    "panelUrl" TEXT NOT NULL
);
INSERT INTO "new_GlobalSettings" ("baseUrl", "cloudflareZoneId", "id") SELECT "baseUrl", "cloudflareZoneId", "id" FROM "GlobalSettings";
DROP TABLE "GlobalSettings";
ALTER TABLE "new_GlobalSettings" RENAME TO "GlobalSettings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
