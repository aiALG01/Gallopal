# Galoppal

Marketing-Website für Galoppal, die App zur automatisierten Trainingsplanung für Reittrainer:innen.

## Stack

Statisches One-Pager-Setup ohne Build-Schritt: reines HTML, CSS und JavaScript.

- `index.html`: Seitenstruktur und Inhalte
- `css/styles.css`: Design-Tokens (Farben, Typografie, Spacing, Radius, Motion) und Styles
- `js/main.js`: Navigation, Scroll-Reveals, interaktive Buchungs-Vorschau, Formularlogik

## Lokal ansehen

Da keine Build-Tools nötig sind, reicht ein einfacher statischer Server, zum Beispiel:

```bash
python3 -m http.server 8000
```

Danach `http://localhost:8000` im Browser öffnen.

## Vor dem Live-Gang

- **Impressum & Datenschutz**: Die Footer-Links sind aktuell Platzhalter (`#impressum`, `#datenschutz`). Für den Live-Betrieb in Deutschland sind ein rechtsgültiges Impressum und eine Datenschutzerklärung Pflicht.
- **Kontaktformular**: Sendet aktuell per `mailto:` an die im Code hinterlegte Adresse. Für eine zuverlässige Newsletter-/Tester-Anmeldung empfiehlt sich die Anbindung an ein echtes Formular-Backend oder einen Newsletter-Dienst (z. B. Formspree, Mailchimp, Brevo).
