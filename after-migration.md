# After Migration Checklist: vindex.lv

When moving from `dev.omarketing.lv/vindex/` to `vindex.lv` (root domain).

---

## 1. Path Prefix Removal

All internal paths currently use `/vindex/` prefix. Replace globally:

- `/vindex/css/` to `/css/`
- `/vindex/js/` to `/js/`
- `/vindex/images/` to `/images/`
- `/vindex/fonts/` to `/fonts/`
- `/vindex/en/` to `/en/`
- `/vindex/pakalpojumi/` to `/pakalpojumi/`
- `/vindex/birojs/` to `/birojs/`
- `/vindex/kontakti/` to `/kontakti/`
- `/vindex/privatuma-politika/` to `/privatuma-politika/`
- `/vindex/sikdatnu-politika/` to `/sikdatnu-politika/`
- `/vindex/` to `/`

Also update `css/fonts.css` font `url()` paths.

## 2. deploy.php

Update the path inside deploy.php to point to the new document root.
Update GitHub webhook URL to `https://vindex.lv/deploy.php`.

## 3. Formspree Redirect URLs

Update redirect values in forms from dev domain to vindex.lv.

## 4. Google Analytics (GA4)

Get the GA4 Measurement ID from the current vindex.lv account holder.
The current site uses WordPress with a GA plugin. Check the GA account for the ID.

Add GA4 script loading to `cookie-consent.js` `loadAnalytics()` function.
Analytics must only load AFTER cookie consent (GDPR requirement).

## 5. Google Tag Manager

Alternative to direct GA4. Get GTM container ID from client.

## 6. Google Search Console

1. Verify `vindex.lv` in Google Search Console
2. Submit sitemap: `https://vindex.lv/sitemap.xml`
3. Request indexing for main pages

## 7. Facebook Pixel

Check with client if they use Facebook advertising. If yes, add pixel with consent gate.

## 8. Meta Tags

All `canonical`, `og:url`, `hreflang` tags already point to `vindex.lv`. No changes needed.

## 9. 301 Redirects from Old WordPress URLs

Add to .htaccess to handle old WordPress URL patterns if they differ.

## 10. SSL Certificate

Ensure SSL is active on vindex.lv. cPanel > SSL/TLS > check AutoSSL.

## 11. DNS

Point vindex.lv A record to cPanel server IP.

## 12. Test After Migration

- All pages load (LV + EN)
- CSS/JS/fonts/images load
- Contact form submits to Formspree
- Cookie banner appears
- Language switch works
- Mobile menu works
- Phone/email links work
- OG image shows on social sharing
- robots.txt accessible
- sitemap.xml accessible
- Google Search Console verified
- Analytics tracking works (after consent)

## 13. GitHub Repository Visibility

Currently the repo is **PUBLIC** because cPanel git pull requires unauthenticated HTTPS access.

For a client project, decide:

**Option A: Keep public** — OK if no secrets in code (Web3Forms key is public by design). Source code of a static site has no sensitive logic. Most law firm websites are not targets for source code theft.

**Option B: Make private + deploy token** — More professional for client work. Steps:
1. Generate a GitHub Personal Access Token (fine-grained, read-only, repo scope)
2. On the server, update remote URL:
   `git remote set-url origin https://TOKEN@github.com/maxmiko/vindex.git`
3. Then make repo private: `gh repo edit maxmiko/vindex --visibility private --accept-visibility-change-consequences`
4. Test that `git pull` still works

**Option C: Transfer repo to client's GitHub** — Best long-term. Client owns their code.
