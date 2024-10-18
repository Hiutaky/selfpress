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
    CONSTRAINT "Domain_wordpressInstallationId_fkey" FOREIGN KEY ("wordpressInstallationId") REFERENCES "WordPressInstallation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Domain" ("createdAt", "dnsPointing", "domainName", "id", "updatedAt", "wordpressInstallationId") SELECT "createdAt", "dnsPointing", "domainName", "id", "updatedAt", "wordpressInstallationId" FROM "Domain";
DROP TABLE "Domain";
ALTER TABLE "new_Domain" RENAME TO "Domain";
CREATE UNIQUE INDEX "Domain_domainName_key" ON "Domain"("domainName");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
