/*
  Warnings:

  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nonce" INTEGER NOT NULL,
    "publicAddress" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "isContract" BOOLEAN NOT NULL DEFAULT false,
    "email" TEXT NOT NULL
);
INSERT INTO "new_User" ("createdAt", "id", "isContract", "nonce", "publicAddress", "username") SELECT "createdAt", "id", "isContract", "nonce", "publicAddress", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_publicAddress_key" ON "User"("publicAddress");
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
