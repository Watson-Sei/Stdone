-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "twitch_id" TEXT NOT NULL,
    "youtube_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_twitch_id_key" ON "User"("twitch_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_youtube_id_key" ON "User"("youtube_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
