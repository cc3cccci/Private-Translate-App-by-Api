-- CreateTable
CREATE TABLE "TranslationHistory" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sourceText" TEXT NOT NULL,
    "translatedText" TEXT NOT NULL,
    "sourceLang" TEXT NOT NULL DEFAULT 'auto',
    "targetLang" TEXT NOT NULL,
    "modelUsed" TEXT NOT NULL,

    CONSTRAINT "TranslationHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vocabulary" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "word" TEXT NOT NULL,
    "definition" TEXT NOT NULL,
    "contextSentence" TEXT,
    "sourceLang" TEXT,
    "targetLang" TEXT,
    "tags" TEXT,

    CONSTRAINT "Vocabulary_pkey" PRIMARY KEY ("id")
);
