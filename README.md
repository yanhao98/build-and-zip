# build-and-zip

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
