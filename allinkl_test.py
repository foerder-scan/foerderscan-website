import hashlib
import http.client
import urllib.parse
import json
import re

# ── Credentials aus .env lesen ────────────────────────────────────────────────
def load_env(path=".env"):
    env = {}
    try:
        with open(path, encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    env[k.strip()] = v.strip()
    except FileNotFoundError:
        print(f"❌ .env nicht gefunden: {path}")
    return env

env = load_env("/Users/t.f/Desktop/Webseite FörderScan /.env")
KAS_USER = env.get("ALLINKL_KAS_USER", "")
KAS_PASS = env.get("ALLINKL_KAS_PASS", "")

print(f"👤 KAS User: {KAS_USER}")
print(f"🔑 KAS Pass: {KAS_PASS[:4]}{'*' * (len(KAS_PASS)-4)}")
print()

# ── Hilfsfunktion: SOAP POST ──────────────────────────────────────────────────
def soap_post(endpoint, params_dict):
    body = urllib.parse.urlencode({
        "Params": json.dumps(params_dict, separators=(",", ":"))
    })
    conn = http.client.HTTPSConnection("kasapi.kasserver.com")
    conn.request(
        "POST", endpoint, body,
        {"Content-Type": "application/x-www-form-urlencoded"}
    )
    resp = conn.getresponse()
    raw = resp.read().decode("utf-8")
    return resp.status, raw

# ── Schritt 1: Auth-Token holen ───────────────────────────────────────────────
print("━" * 50)
print("SCHRITT 1: Authentifizierung")
print("━" * 50)

results = []

for auth_type, auth_data in [
    ("plain",  KAS_PASS),
    ("sha1",   hashlib.sha1(KAS_PASS.encode("utf-8")).hexdigest()),
    ("sha1",   hashlib.sha1(KAS_PASS.encode("latin-1")).hexdigest()),
    ("md5",    hashlib.md5(KAS_PASS.encode("utf-8")).hexdigest()),
]:
    status, raw = soap_post("/soap/KasAuth.php", {
        "KasUser": KAS_USER,
        "KasAuthType": auth_type,
        "KasAuthData": auth_data,
        "KasReqSchedule": 0,
    })
    ok = "Fault" not in raw
    label = f"{auth_type:8} | hash={auth_data[:16]}..."
    print(f"  {'✅' if ok else '❌'} {label} → HTTP {status}")
    if ok:
        # Token aus XML extrahieren
        match = re.search(r"<return[^>]*>([^<]+)</return>", raw)
        token = match.group(1) if match else raw[:200]
        results.append((auth_type, auth_data, token))
        print(f"     🎉 Token: {token[:40]}...")

if not results:
    print()
    print("⚠️  Alle Auth-Versuche fehlgeschlagen.")
    print()
    print("Mögliche Ursachen:")
    print("  1. KAS-Passwort ist falsch")
    print("  2. API-Zugang ist in KAS deaktiviert")
    print("  3. IP-Sperre aktiv")
    print()
    print("Bitte prüfe das Passwort unter: https://kas.all-inkl.com")
    exit(1)

# ── Schritt 2: kas_list_domains ───────────────────────────────────────────────
print()
print("━" * 50)
print("SCHRITT 2: kas_list_domains")
print("━" * 50)

auth_type, auth_data, token = results[0]

status, raw = soap_post("/soap/KasApi.php", {
    "KasUser":        KAS_USER,
    "KasAuthType":    auth_type,
    "KasAuthData":    auth_data,
    "KasRequestParams": json.dumps({}),
    "KasRequest":     "kas_list_domains",
})

print(f"  HTTP Status: {status}")
if "Fault" in raw:
    print(f"  ❌ Fehler: {raw[:300]}")
else:
    print(f"  ✅ Antwort erhalten")
    # Domains aus XML extrahieren
    domains = re.findall(r"<domain_name[^>]*>([^<]+)</domain_name>", raw)
    if domains:
        print(f"\n  📋 Gefundene Domains ({len(domains)}):")
        for d in domains:
            print(f"     • {d}")
    else:
        print(f"  Raw (erste 500 Zeichen):\n{raw[:500]}")
