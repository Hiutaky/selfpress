/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "WordPressInstallation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "dockerId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "dockerConfigId" INTEGER,
    "wordpressSettingsId" INTEGER,
    CONSTRAINT "WordPressInstallation_dockerConfigId_fkey" FOREIGN KEY ("dockerConfigId") REFERENCES "DockerConfig" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "WordPressInstallation_wordpressSettingsId_fkey" FOREIGN KEY ("wordpressSettingsId") REFERENCES "WordPressSettings" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DockerConfig" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "containerName" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "ports" TEXT NOT NULL,
    "volumes" TEXT NOT NULL,
    "environment" TEXT NOT NULL,
    "restartPolicy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "WordPressSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "siteName" TEXT NOT NULL,
    "siteUrl" TEXT NOT NULL,
    "adminEmail" TEXT NOT NULL,
    "dbHost" TEXT NOT NULL,
    "dbName" TEXT NOT NULL,
    "dbUser" TEXT NOT NULL,
    "dbPassword" TEXT NOT NULL,
    "tablePrefix" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "WordPressInstallation_name_key" ON "WordPressInstallation"("name");

-- CreateIndex
CREATE UNIQUE INDEX "WordPressInstallation_domain_key" ON "WordPressInstallation"("domain");

-- CreateIndex
CREATE UNIQUE INDEX "WordPressInstallation_dockerId_key" ON "WordPressInstallation"("dockerId");

-- CreateIndex
CREATE UNIQUE INDEX "DockerConfig_containerName_key" ON "DockerConfig"("containerName");
