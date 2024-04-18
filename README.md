# build-and-zip

## Install
```bash
pnpm add @yanhao98/build-and-zip -D
```

## Usage
package.json
```
{
  "name": "project-name",
  "scripts": {
    "build:prod": "vue-cli-service build",
    "build:prod:zip": "build-and-zip --script=build:prod"
  }
}
```

index.html
```html
<html data-build-time="<%- VUE_APP_BUILD_TIME %>">
<html data-build-time="%VITE_BUILD_TIME%">
```

.gitignore
```
dist-zip/
```

## Links

- https://github.com/vuejs/devtools/blob/main/extension-zips.js
