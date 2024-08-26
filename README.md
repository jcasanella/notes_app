# Notes App

App to learn the basics with NodeJs and ExpressJS

```
npx express-generator@4.x --view=hbs --git .
pnpm install
pnpm install cross-env
```

## Issues:

To build the custom bootstrap using pnpm, you must create the file `.npmrc` with this content:

```
enable-pre-post-scripts=true
```

This will allow us to run prebuild, build and postbuild.
See the link: https://thedaviddias.com/notes/how-to-fix-post-pre-build-pnpm
