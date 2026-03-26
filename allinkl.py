"""
AllInkl KAS API Client – SOAP Implementation
Kommuniziert via echtem SOAP/XML mit der KAS-API.
Docs: https://kasapi.kasserver.com/dokumentation/phpdoc/
"""

import hashlib
import http.client
import json
import re
import os
import xml.etree.ElementTree as ET
from typing import Any


class AllInklError(Exception):
    pass


class AllInkl:
    API_HOST  = "kasapi.kasserver.com"
    AUTH_PATH = "/soap/KasAuth.php"
    API_PATH  = "/soap/KasApi.php"

    # SOAP-Namespaces
    _NS_ENV  = "http://schemas.xmlsoap.org/soap/envelope/"
    _NS_ENC  = "http://schemas.xmlsoap.org/soap/encoding/"
    _NS_XSD  = "http://www.w3.org/2001/XMLSchema"
    _NS_XSI  = "http://www.w3.org/2001/XMLSchema-instance"
    _NS_AUTH = "urn:xmethodsKasApiAuthentication"
    _NS_API  = "urn:xmethodsKasApi"

    def __init__(self, user: str, password: str, auth_type: str = "sha1"):
        self.user      = user
        self.password  = password
        self.auth_type = auth_type
        self._auth_data = self._hash(password, auth_type)
        self._token: str | None = None

    # ── Hilfsmethoden ─────────────────────────────────────────────────────────

    @staticmethod
    def _hash(password: str, method: str) -> str:
        if method == "sha1":
            return hashlib.sha1(password.encode("utf-8")).hexdigest()
        if method == "md5":
            return hashlib.md5(password.encode("utf-8")).hexdigest()
        return password  # plain

    def _build_soap(self, ns: str, action: str, params: dict) -> bytes:
        """Erstellt einen echten SOAP/XML-Request-Body."""
        params_json = json.dumps(params, separators=(",", ":"))
        # JSON-Sonderzeichen in XML maskieren
        params_escaped = (
            params_json
            .replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;")
            .replace('"', "&quot;")
        )
        soap = (
            '<?xml version="1.0" encoding="UTF-8"?>'
            '<SOAP-ENV:Envelope'
            f' xmlns:SOAP-ENV="{self._NS_ENV}"'
            f' xmlns:ns1="{ns}"'
            f' xmlns:xsd="{self._NS_XSD}"'
            f' xmlns:xsi="{self._NS_XSI}"'
            f' xmlns:SOAP-ENC="{self._NS_ENC}"'
            f' SOAP-ENV:encodingStyle="{self._NS_ENC}">'
            '<SOAP-ENV:Body>'
            f'<ns1:{action}>'
            f'<Params xsi:type="xsd:string">{params_escaped}</Params>'
            f'</ns1:{action}>'
            '</SOAP-ENV:Body>'
            '</SOAP-ENV:Envelope>'
        )
        return soap.encode("utf-8")

    def _post(self, path: str, soap_action: str, ns: str,
              action: str, params: dict) -> str:
        """Sendet SOAP-Request und gibt XML-Antwort zurück."""
        body = self._build_soap(ns, action, params)
        conn = http.client.HTTPSConnection(self.API_HOST, timeout=20)
        conn.request("POST", path, body, {
            "Content-Type":   "text/xml; charset=utf-8",
            "SOAPAction":     f'"{soap_action}"',
            "Content-Length": str(len(body)),
        })
        resp = conn.getresponse()
        raw  = resp.read().decode("utf-8")

        # SOAP-Fault auswerten
        if "Fault" in raw:
            fault = re.search(r"<faultstring[^>]*>([^<]+)</faultstring>", raw)
            msg   = fault.group(1) if fault else raw[:300]
            raise AllInklError(f"KAS SOAP-Fault: {msg}")
        return raw

    def _auth_post(self, params: dict) -> str:
        return self._post(
            self.AUTH_PATH,
            soap_action="urn:xmethodsKasApiAuthentication#KasAuth",
            ns=self._NS_AUTH,
            action="KasAuth",
            params=params,
        )

    def _api_post(self, params: dict) -> str:
        return self._post(
            self.API_PATH,
            soap_action="urn:xmethodsKasApi#KasApi",
            ns=self._NS_API,
            action="KasApi",
            params=params,
        )

    @staticmethod
    def _extract_items(xml: str) -> list[dict]:
        """Extrahiert key/value Paare aus KAS SOAP-Antworten."""
        items = []
        for block in re.findall(r"<item>(.*?)</item>", xml, re.DOTALL):
            keys   = re.findall(r"<key[^>]*>([^<]+)</key>",   block)
            values = re.findall(r"<value[^>]*>([^<]*)</value>", block)
            if keys and values:
                items.append(dict(zip(keys, values)))
        return items

    # ── Authentifizierung ─────────────────────────────────────────────────────

    def login(self) -> str:
        """Holt einen temporären Auth-Token von KAS."""
        raw = self._auth_post({
            "KasUser":        self.user,
            "KasAuthType":    self.auth_type,
            "KasAuthData":    self._auth_data,
            "KasReqSchedule": 0,
        })
        match = re.search(r"<return[^>]*>([^<]+)</return>", raw)
        if not match:
            raise AllInklError(f"Kein Token in Antwort: {raw[:300]}")
        self._token = match.group(1)
        return self._token

    def _request(self, function: str, params: dict = {}) -> str:
        """Führt einen authentifizierten KAS-API-Aufruf durch."""
        if not self._token:
            self.login()
        return self._api_post({
            "KasUser":          self.user,
            "KasAuthType":      self.auth_type,
            "KasAuthData":      self._auth_data,
            "KasRequestParams": json.dumps(params, separators=(",", ":")),
            "KasRequest":       function,
        })

    # ── Domains ───────────────────────────────────────────────────────────────

    def list_domains(self) -> list[dict]:
        """Alle Domains des Accounts auflisten."""
        return self._extract_items(self._request("kas_list_domains"))

    # ── DNS ───────────────────────────────────────────────────────────────────

    def list_dns(self, zone: str) -> list[dict]:
        """Alle DNS-Einträge einer Zone auflisten."""
        return self._extract_items(
            self._request("kas_get_dns_settings", {"zone_host": zone})
        )

    def add_dns(self, zone: str, record_type: str, name: str,
                value: str, priority: int = 0, ttl: int = 600) -> bool:
        """DNS-Eintrag hinzufügen."""
        raw = self._request("kas_add_dns_settings", {
            "zone_host":   zone,
            "record_type": record_type.upper(),
            "record_name": name,
            "record_data": value,
            "record_aux":  str(priority),
            "record_ttl":  str(ttl),
        })
        return True  # Kein Fault → Erfolg (Exception wäre geworfen worden)

    def delete_dns(self, record_id: str) -> bool:
        """DNS-Eintrag per ID löschen."""
        self._request("kas_delete_dns_settings", {"record_id": record_id})
        return True

    def update_dns(self, record_id: str, record_type: str, name: str,
                   value: str, priority: int = 0, ttl: int = 600) -> bool:
        """Bestehenden DNS-Eintrag aktualisieren."""
        self._request("kas_update_dns_settings", {
            "record_id":   record_id,
            "record_type": record_type.upper(),
            "record_name": name,
            "record_data": value,
            "record_aux":  str(priority),
            "record_ttl":  str(ttl),
        })
        return True

    def ensure_dns(self, zone: str, record_type: str, name: str,
                   value: str, priority: int = 0) -> str:
        """Fügt DNS-Eintrag hinzu oder überschreibt bestehenden (idempotent).

        Returns:
            'added' | 'updated' | 'unchanged'
        """
        for rec in self.list_dns(zone):
            if (rec.get("record_type", "").upper() == record_type.upper() and
                    rec.get("record_name", "") == name):
                if rec.get("record_data", "") == value:
                    return "unchanged"
                self.update_dns(rec["record_id"], record_type, name, value, priority)
                return "updated"
        self.add_dns(zone, record_type, name, value, priority)
        return "added"

    # ── E-Mail Konten ─────────────────────────────────────────────────────────

    def list_mailaccounts(self) -> list[dict]:
        return self._extract_items(self._request("kas_list_mailaccounts"))

    def add_mailaccount(self, local_part: str, domain: str,
                        password: str, quota_mb: int = 1024) -> bool:
        self._request("kas_add_mailaccount", {
            "mail_local_part": local_part,
            "mail_domain":     domain,
            "mail_password":   password,
            "mail_quota":      str(quota_mb),
        })
        return True

    def delete_mailaccount(self, local_part: str, domain: str) -> bool:
        self._request("kas_delete_mailaccount", {
            "mail_local_part": local_part,
            "mail_domain":     domain,
        })
        return True

    def update_mailaccount_password(self, local_part: str,
                                    domain: str, new_password: str) -> bool:
        self._request("kas_update_mailaccount", {
            "mail_local_part": local_part,
            "mail_domain":     domain,
            "mail_password":   new_password,
        })
        return True

    # ── E-Mail Weiterleitungen ────────────────────────────────────────────────

    def list_mailforwards(self) -> list[dict]:
        return self._extract_items(self._request("kas_list_mailforwards"))

    def add_mailforward(self, local_part: str, domain: str, target: str) -> bool:
        self._request("kas_add_mailforward", {
            "mail_local_part": local_part,
            "mail_domain":     domain,
            "mail_forward":    target,
        })
        return True

    def delete_mailforward(self, local_part: str, domain: str) -> bool:
        self._request("kas_delete_mailforward", {
            "mail_local_part": local_part,
            "mail_domain":     domain,
        })
        return True

    # ── Subdomains ────────────────────────────────────────────────────────────

    def list_subdomains(self) -> list[dict]:
        return self._extract_items(self._request("kas_list_subdomains"))

    def add_subdomain(self, subdomain: str, domain: str,
                      target_path: str = "") -> bool:
        self._request("kas_add_subdomain", {
            "subdomain_name":   subdomain,
            "subdomain_domain": domain,
            "subdomain_path":   target_path,
        })
        return True

    # ── Datenbanken & Account ─────────────────────────────────────────────────

    def list_databases(self) -> list[dict]:
        return self._extract_items(self._request("kas_list_databases"))

    def get_account_info(self) -> dict:
        items = self._extract_items(self._request("kas_get_accountsettings"))
        return items[0] if items else {}

    # ── Klassenmethode: aus .env laden ────────────────────────────────────────

    @classmethod
    def from_env(cls, env_path: str = ".env") -> "AllInkl":
        env: dict[str, str] = {}
        try:
            with open(env_path, encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        k, v = line.split("=", 1)
                        env[k.strip()] = v.strip()
        except FileNotFoundError:
            raise AllInklError(f".env nicht gefunden: {env_path}")

        user = env.get("ALLINKL_KAS_USER") or os.getenv("ALLINKL_KAS_USER")
        pw   = env.get("ALLINKL_KAS_PASS") or os.getenv("ALLINKL_KAS_PASS")

        if not user or not pw:
            raise AllInklError(
                "ALLINKL_KAS_USER und ALLINKL_KAS_PASS müssen in .env gesetzt sein."
            )
        return cls(user, pw)

    def __repr__(self) -> str:
        status = "eingeloggt" if self._token else "nicht eingeloggt"
        return f"<AllInkl user={self.user} {status}>"


# ── Direktausführung: Verbindungstest + Resend DNS setzen ─────────────────────

if __name__ == "__main__":
    ENV_PATH = "/Users/t.f/Desktop/Webseite FörderScan /.env"
    ZONE     = "xn--frderscan-07a.de"   # förderscan.de (Punycode)

    # Resend DNS-Records die gesetzt werden müssen
    DNS_RECORDS = [
        # (type,  name,               value,                                                    prio)
        ("A",     "@",                "76.76.21.21",                                            0),
        ("TXT",   "resend._domainkey","p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC7...",        0),
        ("MX",    "send",             "feedback-smtp.eu-west-1.amazonses.com",                  10),
        ("TXT",   "send",             "v=spf1 include:amazonses.com ~all",                      0),
    ]

    print("━" * 60)
    print("  All-Inkl KAS API – SOAP Client")
    print("━" * 60)

    try:
        kas = AllInkl.from_env(ENV_PATH)
        print(f"  User:      {kas.user}")
        print(f"  Auth-Hash: {kas._auth_data[:20]}...")
        print()

        # Login
        print("Login...")
        token = kas.login()
        print(f"  Token: {token[:35]}...")
        print()

        # Domains
        print("Domains:")
        for d in kas.list_domains():
            print(f"  • {d.get('domain_name', d)}")
        print()

        # DNS-Eintraege anzeigen
        print(f"DNS-Eintraege ({ZONE}):")
        for r in kas.list_dns(ZONE):
            print(f"  {r.get('record_type','?'):6} {r.get('record_name','@'):32} "
                  f"-> {r.get('record_data','')[:50]}")
        print()

        # E-Mail-Konten
        print("E-Mail-Konten:")
        for m in kas.list_mailaccounts():
            print(f"  • {m.get('mail_local_part','')}@{m.get('mail_domain','')}")

    except AllInklError as e:
        print(f"\nFehler: {e}")
        print()
        print("Mögliche Ursachen:")
        print("  1. KAS-API-Passwort noch nicht gesetzt")
        print("     -> KAS-Panel -> Mein Account -> KAS-API -> Passwort vergeben")
        print("  2. Falsches Passwort in .env (ALLINKL_KAS_PASS)")
        print("  3. IP-Sperre durch zu viele Fehlversuche")
    except Exception as e:
        print(f"\nUnerwarteter Fehler: {type(e).__name__}: {e}")
