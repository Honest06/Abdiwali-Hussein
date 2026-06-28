======================================================
MMIC WEBSITE — cPANEL UPLOAD & MANAGEMENT GUIDE
Midnimo Microfinance Institution Company (MMIC)
www.mmic.so
======================================================

1. HOW TO UPLOAD TO cPANEL
================================
Step 1: Log into your cPanel account (e.g. https://mmic.so:2083)
Step 2: Open "File Manager"
Step 3: Navigate to the "public_html" folder
Step 4: Delete any existing index.html or default files
Step 5: Upload all website files:
        - Click "Upload" in the top menu
        - Upload the ZIP file (mmic-website.zip)
        - Right-click the ZIP > "Extract" to public_html
Step 6: Make sure these files are directly inside public_html (NOT in a subfolder):
        - index.html
        - about.html
        - services.html
        - islamic-finance.html
        - impact.html
        - partners.html
        - news.html
        - careers.html
        - contact.html
        - apply.html
Step 7: Make sure the "assets" folder is also in public_html:
        - assets/css/style.css
        - assets/js/main.js
        - assets/images/ (your images go here)

FILE PERMISSIONS:
        - HTML files: 644
        - CSS/JS files: 644
        - Folders: 755


2. REQUIRED FILES IN public_html
================================
Your public_html should look like this:

public_html/
├── index.html
├── about.html
├── services.html
├── islamic-finance.html
├── impact.html
├── partners.html
├── news.html
├── careers.html
├── contact.html
├── apply.html
├── README_UPLOAD.txt
└── assets/
    ├── css/
    │   └── style.css
    ├── js/
    │   └── main.js
    └── images/
        ├── logo.png
        ├── favicon.png
        ├── hero.jpg
        ├── og-image.jpg
        ├── office.jpg
        ├── women-finance.jpg
        ├── youth-finance.jpg
        ├── agriculture.jpg
        ├── client-1.jpg
        ├── client-2.jpg
        ├── client-3.jpg
        ├── news-1.jpg
        ├── news-2.jpg
        ├── news-3.jpg
        ├── news-4.jpg
        ├── news-5.jpg
        ├── news-6.jpg
        ├── team-ceo.jpg
        ├── team-cfo.jpg
        └── team-coo.jpg


3. HOW TO REPLACE IMAGES
================================
All images are referenced from: assets/images/

To replace any image:
Step 1: Name your photo with the correct filename (see list above)
Step 2: Upload it to: public_html/assets/images/
Step 3: The website will automatically use the new image

Recommended image sizes:
- hero.jpg         → 1920 × 1080 px (full-screen hero)
- og-image.jpg     → 1200 × 630 px (Facebook/LinkedIn sharing)
- office.jpg       → 800 × 600 px
- women-finance.jpg → 800 × 600 px
- youth-finance.jpg → 800 × 600 px
- agriculture.jpg  → 800 × 600 px
- client-1/2/3.jpg → 600 × 500 px
- news-1 to 6.jpg  → 800 × 500 px
- team-*.jpg       → 400 × 500 px (portrait orientation)
- logo.png         → 200 × 80 px (transparent background preferred)
- favicon.png      → 32 × 32 px


4. HOW TO UPDATE PHONE, EMAIL & WHATSAPP
================================
Search and replace these placeholders in all .html files:

PHONE:
  Find:    +252 XXX XXX XXX
  Replace: Your actual phone number (e.g. +252 61 234 5678)

EMAIL:
  Find:    info@mmic.so
  Replace: Your actual email address

WHATSAPP:
  Find:    252XXXXXXXXX
  Replace: Your WhatsApp number without "+" (e.g. 252612345678)
  (This number appears in wa.me links throughout the site)

WHATSAPP BRANCH EMAILS:
  Find:    mogadishu@mmic.so
  Replace: Your Mogadishu branch email
  Find:    baidoa@mmic.so
  Replace: Your Baidoa branch email
  Find:    hudur@mmic.so
  Replace: Your Hudur branch email

To do a bulk find-replace:
  - Open each .html file in a text editor (Notepad, VSCode, etc.)
  - Use Ctrl+H (Find & Replace)
  - Replace all occurrences


5. HOW TO UPDATE TEXT CONTENT
================================
All website text is in the .html files.

To change text:
Step 1: Open the relevant .html file in any text editor
Step 2: Use Ctrl+F to find the text you want to change
Step 3: Edit the text directly
Step 4: Save the file
Step 5: Re-upload to cPanel

Important text areas to customize:
- Homepage hero headline: Search for "Empowering Communities"
- Homepage hero subheadline: Search for "provides Sharia-compliant financial"
- Branch addresses: Search for "Hodan District, Mogadishu"
- Statistics: Search for "12,500" (client count), "$4.2M" (portfolio)
- News articles: Edit news cards in news.html
- Job vacancies: Edit job cards in careers.html
- Team members: Edit team cards in about.html


6. CONTACT FORMS
================================
The contact, partnership, and career forms use mailto links.
When a user submits a form, it opens their email client with a pre-filled message.

To change where form emails go:
  In contact.html:   Search for "info@mmic.so"
  In partners.html:  Search for "partnerships@mmic.so"
  In careers.html:   Search for "careers@mmic.so"

For a server-side form (PHP), create a simple contact.php handler, OR use a free service:
  - Formspree (https://formspree.io) — add your form endpoint to the action attribute
  - Netlify Forms — if you host on Netlify instead of cPanel


7. HOW TO BACKUP & RESTORE
================================
BACKUP (before making changes):
Step 1: In cPanel File Manager, select all files in public_html
Step 2: Right-click > Compress to ZIP
Step 3: Download the ZIP file to your computer
Step 4: Label it with the date (e.g. mmic-backup-2024-12-01.zip)

RESTORE (if something goes wrong):
Step 1: Delete all files in public_html
Step 2: Upload your backup ZIP
Step 3: Extract to public_html


8. ADDING NEW PAGES
================================
To add a new page (e.g. page-name.html):
Step 1: Copy an existing page (e.g. contact.html)
Step 2: Rename it (e.g. newpage.html)
Step 3: Change the title, meta description, and breadcrumb
Step 4: Edit the content between the page-hero section and footer
Step 5: Add a link to it in the navbar (in assets/css style or all HTML files)
Step 6: Upload to public_html


9. SOCIAL MEDIA LINKS
================================
Find and update these in all .html files:

FACEBOOK:
  Find:    https://facebook.com/mmic.so
  Replace: Your actual Facebook page URL

LINKEDIN:
  Find:    https://linkedin.com/company/mmic-somalia
  Replace: Your actual LinkedIn company page URL


10. SEO & META TAGS
================================
Each page has its own meta tags at the top. To update:
  - <title> tag: The page title shown in browser and Google
  - <meta name="description">: Short description for Google search results
  - <meta property="og:image">: Image shown when link is shared on Facebook/LinkedIn

For best results, upload og-image.jpg (1200×630px) to assets/images/


11. GOOGLE ANALYTICS (Optional)
================================
To add Google Analytics:
Step 1: Create a Google Analytics account at analytics.google.com
Step 2: Get your Measurement ID (e.g. G-XXXXXXXXXX)
Step 3: Add this code just before </head> in each HTML file:
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  </script>


12. SUPPORT & TROUBLESHOOTING
================================
If the website looks broken after upload:
  1. Check that all files are in public_html (not in a subfolder)
  2. Check that assets/css/style.css exists
  3. Check that assets/js/main.js exists
  4. Clear your browser cache (Ctrl + Shift + R)
  5. Check file permissions: HTML = 644, Folders = 755

If images don't show:
  - Check the filename matches exactly (case-sensitive on Linux servers)
  - Check the file is in assets/images/

For any technical issues, contact your web developer or cPanel hosting support.

======================================================
Website built for: Midnimo Microfinance Institution Company (MMIC)
Domain: www.mmic.so
Country: Somalia
======================================================
