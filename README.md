# build-and-zip

## install
```bash
pnpm add @yanhao98/build-and-zip -D
```

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

.gitignore
```
dist-zip/
```