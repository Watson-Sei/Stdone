-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "twitch_id" TEXT,
    "youtube_id" TEXT,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "address" TEXT,
    "is_account" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_User" ("address", "email", "id", "twitch_id", "username", "youtube_id") SELECT "address", "email", "id", "twitch_id", "username", "youtube_id" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
