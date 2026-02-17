Add Poppins font files and link them

What to add:
- Create the folder: ./assets/fonts/
- Add these TTF files (recommended filenames):
  - Poppins-Light.ttf
  - Poppins-Regular.ttf
  - Poppins-Medium.ttf
  - Poppins-SemiBold.ttf
  - Poppins-Bold.ttf

Why:
- `src/styles/fonts.js` was updated to map the app's font names to these font file names. The app references these names (for example, `Poppins-Regular`) in the styles.

How to link:
- For React Native >= 0.60, the project should autolink assets, but to be safe run:

  npx react-native-asset

  or

  npx react-native link

- For iOS, after adding font files run:

  cd ios; pod install; cd ..

Notes:
- On Android the font family name sometimes needs to match the filename without extension. If you find the font isn't applied, try renaming the files or adjusting `src/styles/fonts.js` to the exact family names your platform expects.

If you want, I can add placeholder Poppins TTFs to `assets/fonts/` now (small, permissive placeholders) and wire them in — tell me if you'd like that.
