# build-and-zip

## install
```bash
pnpm add @yanhao98/build-and-zip -D
```

## usage
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

