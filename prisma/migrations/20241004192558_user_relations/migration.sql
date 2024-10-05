/*
  Warnings:

  - Added the required column `userId` to the `Domain` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `WordPressInstallation` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Domain" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "domainName" TEXT NOT NULL,
    "dnsPointing" BOOLEAN NOT NULL,
    "isSsl" BOOLEAN NOT NULL DEFAULT true,
    "wordpressInstallationId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Domain_wordpressInstallationId_fkey" FOREIGN KEY ("wordpressInstallationId") REFERENCES "WordPressInstallation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Domain_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Domain" ("createdAt", "dnsPointing", "domainName", "id", "isSsl", "updatedAt", "wordpressInstallationId") SELECT "createdAt", "dnsPointing", "domainName", "id", "isSsl", "updatedAt", "wordpressInstallationId" FROM "Domain";
DROP TABLE "Domain";
ALTER TABLE "new_Domain" RENAME TO "Domain";
CREATE UNIQUE INDEX "Domain_domainName_key" ON "Domain"("domainName");
CREATE TABLE "new_WordPressInstallation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "dockerId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "imagePath" TEXT,
    "userId" INTEGER NOT NULL,
    "dockerConfigId" INTEGER,
    "wordpressSettingsId" INTEGER,
    CONSTRAINT "WordPressInstallation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "WordPressInstallation_dockerConfigId_fkey" FOREIGN KEY ("dockerConfigId") REFERENCES "DockerConfig" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "WordPressInstallation_wordpressSettingsId_fkey" FOREIGN KEY ("wordpressSettingsId") REFERENCES "WordPressSettings" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_WordPressInstallation" ("createdAt", "dockerConfigId", "dockerId", "domain", "id", "imagePath", "name", "path", "status", "updatedAt", "wordpressSettingsId") SELECT "createdAt", "dockerConfigId", "dockerId", "domain", "id", "imagePath", "name", "path", "status", "updatedAt", "wordpressSettingsId" FROM "WordPressInstallation";
DROP TABLE "WordPressInstallation";
ALTER TABLE "new_WordPressInstallation" RENAME TO "WordPressInstallation";
CREATE UNIQUE INDEX "WordPressInstallation_name_key" ON "WordPressInstallation"("name");
CREATE UNIQUE INDEX "WordPressInstallation_domain_key" ON "WordPressInstallation"("domain");
CREATE UNIQUE INDEX "WordPressInstallation_dockerId_key" ON "WordPressInstallation"("dockerId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
