/*
  Warnings:

  - Added the required column `networkName` to the `DockerConfig` table without a default value. This is not possible if the table is not empty.

*/
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
    "networkName" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_DockerConfig" ("containerName", "createdAt", "environment", "id", "image", "ports", "restartPolicy", "updatedAt", "volumes") SELECT "containerName", "createdAt", "environment", "id", "image", "ports", "restartPolicy", "updatedAt", "volumes" FROM "DockerConfig";
DROP TABLE "DockerConfig";
ALTER TABLE "new_DockerConfig" RENAME TO "DockerConfig";
CREATE UNIQUE INDEX "DockerConfig_containerName_key" ON "DockerConfig"("containerName");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
