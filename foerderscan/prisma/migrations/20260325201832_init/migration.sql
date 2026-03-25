-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'REDAKTEUR', 'BERATER_PRO', 'BERATER_FREE', 'ENDKUNDE', 'TEAM_MITGLIED');

-- CreateEnum
CREATE TYPE "Foerdergeber" AS ENUM ('KFW', 'BAFA', 'LAND', 'KOMMUNE', 'EU');

-- CreateEnum
CREATE TYPE "Foerdersegment" AS ENUM ('BEG_WG', 'BEG_EM', 'BEG_KFN', 'EBW', 'LANDESFOERDERUNG', 'STEUERLICH', 'SONSTIGE');

-- CreateEnum
CREATE TYPE "Foerderart" AS ENUM ('ZUSCHUSS', 'TILGUNGSZUSCHUSS', 'KREDIT', 'STEUERBONUS', 'KOMBINATION');

-- CreateEnum
CREATE TYPE "ProgrammStatus" AS ENUM ('AKTIV', 'AUSLAUFEND', 'BEENDET', 'ANGEKUENDIGT');

-- CreateEnum
CREATE TYPE "ProjektStatus" AS ENUM ('RECHERCHE', 'ANTRAG_GESTELLT', 'ZUGESAGT', 'ABGERECHNET', 'ABGEBROCHEN');

-- CreateEnum
CREATE TYPE "Gebaeudetyp" AS ENUM ('EFH', 'ZFH', 'MFH', 'NWG', 'DENKMAL');

-- CreateEnum
CREATE TYPE "Massnahmenart" AS ENUM ('GEBAEUDEHUELLE', 'ANLAGENTECHNIK', 'HEIZUNG', 'EH_KOMPLETTSANIERUNG', 'FACHPLANUNG', 'ENERGIEBERATUNG');

-- CreateEnum
CREATE TYPE "PricingTier" AS ENUM ('FREE', 'STARTER', 'PROFESSIONAL', 'ENTERPRISE');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "name" TEXT,
    "passwordHash" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'BERATER_FREE',
    "beraternummer" TEXT,
    "company" TEXT,
    "phone" TEXT,
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorSecret" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLoginAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tier" "PricingTier" NOT NULL DEFAULT 'FREE',
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "stripePriceId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "currentPeriodStart" TIMESTAMP(3),
    "currentPeriodEnd" TIMESTAMP(3),
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_keys" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "keyHash" TEXT NOT NULL,
    "keyPrefix" TEXT NOT NULL,
    "lastUsedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "foerderprogramme" (
    "id" TEXT NOT NULL,
    "programmNummer" TEXT,
    "name" TEXT NOT NULL,
    "kurzname" TEXT,
    "foerdergeber" "Foerdergeber" NOT NULL,
    "foerdersegment" "Foerdersegment" NOT NULL,
    "foerderart" "Foerderart" NOT NULL,
    "basisfördersatz" DECIMAL(5,4) NOT NULL,
    "maxFoerdersatz" DECIMAL(5,4) NOT NULL,
    "maxFoerderfaehigeKosten" INTEGER,
    "maxFoerderfaehigeKostenEE" INTEGER,
    "kreditbetragMax" INTEGER,
    "bewilligungszeitraum" INTEGER,
    "status" "ProgrammStatus" NOT NULL DEFAULT 'AKTIV',
    "gueltigAb" TIMESTAMP(3),
    "gueltigBis" TIMESTAMP(3),
    "quellUrl" TEXT,
    "beschreibung" TEXT,
    "hinweise" TEXT,
    "bundesweit" BOOLEAN NOT NULL DEFAULT true,
    "bundesland" TEXT,
    "letzteModifikation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "letzteAutoPruefung" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "foerderprogramme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "boni" (
    "id" TEXT NOT NULL,
    "programmId" TEXT NOT NULL,
    "bezeichnung" TEXT NOT NULL,
    "kuerzel" TEXT NOT NULL,
    "bonusSatz" DECIMAL(5,4) NOT NULL,
    "voraussetzung" TEXT,
    "exklusiv" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "boni_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kumulierungsregeln" (
    "id" TEXT NOT NULL,
    "programmId" TEXT NOT NULL,
    "ausschlussTyp" TEXT NOT NULL,
    "beschreibung" TEXT NOT NULL,
    "maxFoerderquote" DECIMAL(5,4),
    "kombinierbaresMit" TEXT,

    CONSTRAINT "kumulierungsregeln_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "programm_gebaeudetypen" (
    "id" TEXT NOT NULL,
    "programmId" TEXT NOT NULL,
    "gebaeudetyp" "Gebaeudetyp" NOT NULL,

    CONSTRAINT "programm_gebaeudetypen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "programm_massnahmen" (
    "id" TEXT NOT NULL,
    "programmId" TEXT NOT NULL,
    "massnahmenart" "Massnahmenart" NOT NULL,

    CONSTRAINT "programm_massnahmen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projekte" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "titel" TEXT NOT NULL,
    "kundeName" TEXT NOT NULL,
    "kundeEmail" TEXT,
    "plz" TEXT NOT NULL,
    "ort" TEXT,
    "strasse" TEXT,
    "gebaeudetyp" "Gebaeudetyp" NOT NULL,
    "baujahr" INTEGER,
    "wohneinheiten" INTEGER NOT NULL DEFAULT 1,
    "istDenkmal" BOOLEAN NOT NULL DEFAULT false,
    "ehStufe" TEXT,
    "notizen" TEXT,
    "status" "ProjektStatus" NOT NULL DEFAULT 'RECHERCHE',
    "hatISFP" BOOLEAN NOT NULL DEFAULT false,
    "istWPB" BOOLEAN NOT NULL DEFAULT false,
    "istSerSan" BOOLEAN NOT NULL DEFAULT false,
    "hatEEKlasse" BOOLEAN NOT NULL DEFAULT false,
    "hatNHKlasse" BOOLEAN NOT NULL DEFAULT false,
    "haushaltseinkommen" INTEGER,
    "istSelbstgenutzt" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projekte_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projekt_massnahmen" (
    "id" TEXT NOT NULL,
    "projektId" TEXT NOT NULL,
    "massnahmenart" "Massnahmenart" NOT NULL,
    "beschreibung" TEXT,
    "investitionskosten" INTEGER,
    "geplantesDatum" TIMESTAMP(3),

    CONSTRAINT "projekt_massnahmen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projekt_foerderungen" (
    "id" TEXT NOT NULL,
    "projektId" TEXT NOT NULL,
    "programmId" TEXT NOT NULL,
    "beantragterBetrag" INTEGER,
    "bewilligterBetrag" INTEGER,
    "antragsDatum" TIMESTAMP(3),
    "bewilligungsDatum" TIMESTAMP(3),
    "ablaufDatum" TIMESTAMP(3),
    "aktiveBonus" TEXT[],
    "notizen" TEXT,

    CONSTRAINT "projekt_foerderungen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dokumente" (
    "id" TEXT NOT NULL,
    "projektId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "typ" TEXT NOT NULL,
    "dateipfad" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dokumente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "aktion" TEXT NOT NULL,
    "ressource" TEXT,
    "details" JSONB,
    "ipAdresse" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_beraternummer_key" ON "users"("beraternummer");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_userId_key" ON "subscriptions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_stripeCustomerId_key" ON "subscriptions"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_stripeSubscriptionId_key" ON "subscriptions"("stripeSubscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_keyHash_key" ON "api_keys"("keyHash");

-- CreateIndex
CREATE UNIQUE INDEX "programm_gebaeudetypen_programmId_gebaeudetyp_key" ON "programm_gebaeudetypen"("programmId", "gebaeudetyp");

-- CreateIndex
CREATE UNIQUE INDEX "programm_massnahmen_programmId_massnahmenart_key" ON "programm_massnahmen"("programmId", "massnahmenart");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boni" ADD CONSTRAINT "boni_programmId_fkey" FOREIGN KEY ("programmId") REFERENCES "foerderprogramme"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kumulierungsregeln" ADD CONSTRAINT "kumulierungsregeln_programmId_fkey" FOREIGN KEY ("programmId") REFERENCES "foerderprogramme"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "programm_gebaeudetypen" ADD CONSTRAINT "programm_gebaeudetypen_programmId_fkey" FOREIGN KEY ("programmId") REFERENCES "foerderprogramme"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "programm_massnahmen" ADD CONSTRAINT "programm_massnahmen_programmId_fkey" FOREIGN KEY ("programmId") REFERENCES "foerderprogramme"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projekte" ADD CONSTRAINT "projekte_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projekt_massnahmen" ADD CONSTRAINT "projekt_massnahmen_projektId_fkey" FOREIGN KEY ("projektId") REFERENCES "projekte"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projekt_foerderungen" ADD CONSTRAINT "projekt_foerderungen_projektId_fkey" FOREIGN KEY ("projektId") REFERENCES "projekte"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projekt_foerderungen" ADD CONSTRAINT "projekt_foerderungen_programmId_fkey" FOREIGN KEY ("programmId") REFERENCES "foerderprogramme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dokumente" ADD CONSTRAINT "dokumente_projektId_fkey" FOREIGN KEY ("projektId") REFERENCES "projekte"("id") ON DELETE CASCADE ON UPDATE CASCADE;
