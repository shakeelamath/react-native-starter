Image assets instructions

Files created for placeholders:
- assets/images/drawer/profile.png.b64
- assets/images/drawer/tickets.png.b64

These are minimal 1x1 transparent PNGs encoded in Base64 so the JS bundler will succeed. To convert them to PNG files in-place run the provided Node script:

Windows PowerShell:

```powershell
node tools/decode-base64-images.js
```

This will write `profile.png` and `tickets.png` next to the `.b64` files.

Recommended image names to add later (replace the placeholders):
- assets/images/drawer/profile.png (64x64 PNG; profile icon)
- assets/images/drawer/tickets.png (64x64 PNG; tickets icon)
- assets/images/drawer/home.png (already present)
- assets/images/drawer/calendar.png (already present)
- assets/images/drawer/pages.png (already present)
- assets/images/eventbg.png (background for upcoming events; recommended 1200x600 or similar landscape JPG/PNG)
- assets/images/home/artist.png (thumbnail for artists; recommend square 400x400)

Naming and density:
- If you want higher-density variants, add `@2x` and `@3x` files (e.g., `profile@2x.png`).

When you're ready, replace the placeholder images with your own artwork and rebuild the app.
