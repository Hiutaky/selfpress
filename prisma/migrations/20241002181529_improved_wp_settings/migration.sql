/*
  Warnings:

  - Added the required column `adminName` to the `WordPressSettings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `adminPassword` to the `WordPressSettings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `siteDescription` to the `WordPressSettings` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WordPressSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "siteDescription" TEXT NOT NULL,
    "siteName" TEXT NOT NULL,
    "siteUrl" TEXT NOT NULL,
    "adminEmail" TEXT NOT NULL,
    "adminName" TEXT NOT NULL,
    "adminPassword" TEXT NOT NULL,
    "dbHost" TEXT NOT NULL,
    "dbName" TEXT NOT NULL,
    "dbUser" TEXT NOT NULL,
    "dbPassword" TEXT NOT NULL,
    "tablePrefix" TEXT NOT NULL DEFAULT 'WP_',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "empty" TEXT
);
INSERT INTO "new_WordPressSettings" ("adminEmail", "createdAt", "dbHost", "dbName", "dbPassword", "dbUser", "empty", "id", "siteName", "siteUrl", "tablePrefix", "updatedAt") SELECT "adminEmail", "createdAt", "dbHost", "dbName", "dbPassword", "dbUser", "empty", "id", "siteName", "siteUrl", "tablePrefix", "updatedAt" FROM "WordPressSettings";
DROP TABLE "WordPressSettings";
ALTER TABLE "new_WordPressSettings" RENAME TO "WordPressSettings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
