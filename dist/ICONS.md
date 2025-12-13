# PWA Icons

The app requires two PWA icon files:

- `pwa-192x192.png` (192x192 pixels)
- `pwa-512x512.png` (512x512 pixels)

## Generating Icons

You can generate these icons using:

1. **Online tools**:
   - [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator)
   - [RealFaviconGenerator](https://realfavicongenerator.net/)

2. **Image editing software**:
   - Create a square image with your app logo/design
   - Export as PNG at 192x192 and 512x512 sizes

3. **Command line** (if you have ImageMagick):
   ```bash
   # If you have a source image (e.g., icon.png)
   convert icon.png -resize 192x192 public/pwa-192x192.png
   convert icon.png -resize 512x512 public/pwa-512x512.png
   ```

Place both files in the `public/` directory. The app will work without them, but PWA installation features will be limited.

