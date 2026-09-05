# Images

## alan-joy.jpg — the portrait (not yet added)

The homepage and About page reference `assets/img/alan-joy.jpg` for the avatar.
Until that file exists the script removes the `<img>` and the "AJ" initials show
instead, so nothing looks broken — but the browser console logs one 404.

To add it:

1. Save the headshot as `assets/img/alan-joy.jpg`
2. Square crop, 512×512 or larger (it renders at 128px, so 512 covers retina)
3. Keep it under ~200 KB — it is above the fold on two pages

That is the only step. The markup and styling are already in place.
