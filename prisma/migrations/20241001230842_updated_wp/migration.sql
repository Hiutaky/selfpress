-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DockerConfig" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "containerName" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "ports" TEXT NOT NULL,
    "volumes" TEXT NOT NULL,
    "environment" TEXT NOT NULL,
    "restartPolicy" TEXT NOT NULL DEFAULT 'always',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_DockerConfig" ("containerName", "createdAt", "environment", "id", "image", "ports", "restartPolicy", "updatedAt", "volumes") SELECT "containerName", "createdAt", "environment", "id", "image", "ports", "restartPolicy", "updatedAt", "volumes" FROM "DockerConfig";
DROP TABLE "DockerConfig";
ALTER TABLE "new_DockerConfig" RENAME TO "DockerConfig";
CREATE UNIQUE INDEX "DockerConfig_containerName_key" ON "DockerConfig"("containerName");
CREATE TABLE "new_WordPressSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "siteName" TEXT NOT NULL,
    "siteUrl" TEXT NOT NULL,
    "adminEmail" TEXT NOT NULL,
    "dbHost" TEXT NOT NULL,
    "dbName" TEXT NOT NULL,
    "dbUser" TEXT NOT NULL,
    "dbPassword" TEXT NOT NULL,
    "tablePrefix" TEXT NOT NULL DEFAULT 'WP_',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_WordPressSettings" ("adminEmail", "createdAt", "dbHost", "dbName", "dbPassword", "dbUser", "id", "siteName", "siteUrl", "tablePrefix", "updatedAt") SELECT "adminEmail", "createdAt", "dbHost", "dbName", "dbPassword", "dbUser", "id", "siteName", "siteUrl", "tablePrefix", "updatedAt" FROM "WordPressSettings";
DROP TABLE "WordPressSettings";
ALTER TABLE "new_WordPressSettings" RENAME TO "WordPressSettings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
