# one-more-kenyan-movement-
non profitable

## ONE-MORE KENYA website

Open `index.html` in a browser to view the site. Member registrations are stored in the browser's `localStorage` and displayed in the Admin Desk section at the bottom of the page. Replace the placeholder leader names, phone numbers, and image URLs in `index.html` when the leadership details are available.

Department workspaces are available at `ict-media.html`, `finance.html`, `business-entrepreneurship.html`, `welfare.html`, `community-outreach.html`, `legal-compliance.html`, and `project-management.html`. Each page has its own priority checklist and update history, stored separately in the browser's `localStorage`.

## HTTPS deployment

This is a static site, so SSL/TLS is provided by the hosting platform rather than by the HTML or JavaScript. The included `_redirects` and `_headers` files are ready for Netlify: deploy the project, enable the site's automatically managed HTTPS certificate, and keep **Force HTTPS** enabled. The headers enforce HTTPS with HSTS and add a restrictive content security policy.

Do not use `file://` or an HTTP-only local server for collecting real member information. The member directory is browser-local demo storage, not a secure shared database or admin system; use an HTTPS backend with authentication before using it for production data.
