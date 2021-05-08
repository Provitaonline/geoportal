# Geoportal Provita

This project is the source for [Provita's Geographical Information Portal](https://geoportal.provita.org.ve/).

This project is currently in Beta test.

## Development environment

The site is based on the [Gridsome](https://gridsome.org/) [Vue.js](https://vuejs.org/) framework.

## Development/deployment instructions

#### Prerequisite: [Netlify CLI](https://docs.netlify.com/cli/get-started/#installation)

* Clone the repository
* ```npm install```
* Develop: ```netlify dev```; runs a development server; to access the application, point your browser to: ```http://localhost:8888```
* Build: ```netlify build```; the result is in the ```"dist"``` folder

## Directory structure

```
content - Static content (markdown, images)

src - Source code (Gridsome application)

static - Static content copied directly onto "dist"
  images - Various images used in the app
  mapstyles - Mapbox-compatible style documents
  sound - Sounds used by the app (e.g., camera click)
```

## Licenses

The code is under [MIT license](https://opensource.org/licenses/MIT). The site content (e.g., GIS datasets, maps) is under the [Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)](https://creativecommons.org/licenses/by-nc/4.0/).
