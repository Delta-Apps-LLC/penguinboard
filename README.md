# propsv1

## Temporary Name: Bravo

Below is a diagram showing the total flow of the web app for the whole stack.
![Diagram](/assets/files/Sandbox-Bravo.png)

### Frontend
The client-side of this web app is build using NuxtJS, a Javacsript framework wrapping VueJS. NuxtJS handles the User Interface, and sends data to the API when needed.

### Server
The server is PostgREST, which is an auto-generated API layer that sits over the database. PostgREST reads the database and automatically creates endpoints for each table that can be targeted through the API access point. It can be called through HTTP requests, such as GET, POST, PATCH, and DELETE. This is hosted in a simple EC2 in AWS. Authentication is done using JWTs.

### Database
Data is hosted in a PostgreSQL database on Railway. PostgreSQL is a relational database, and is queried by the PostgREST API based on the requests it receives. More information about how the server and database were setup can be found in [this tutorial](https://github.com/aatishnn/it350_sample/wiki/Creating-a-REST-API).


## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at 54.219.6.20:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out the [documentation](https://nuxtjs.org).

## Special Directories

You can create the following extra directories, some of which have special behaviors. Only `pages` is required; you can delete them if you don't want to use their functionality.

### `assets`

The assets directory contains your uncompiled assets such as Stylus or Sass files, images, or fonts.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/assets).

### `components`

The components directory contains your Vue.js components. Components make up the different parts of your page and can be reused and imported into your pages, layouts and even other components.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/components).

### `layouts`

Layouts are a great help when you want to change the look and feel of your Nuxt app, whether you want to include a sidebar or have distinct layouts for mobile and desktop.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/layouts).


### `pages`

This directory contains your application views and routes. Nuxt will read all the `*.vue` files inside this directory and setup Vue Router automatically.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/get-started/routing).

### `plugins`

The plugins directory contains JavaScript plugins that you want to run before instantiating the root Vue.js Application. This is the place to add Vue plugins and to inject functions or constants. Every time you need to use `Vue.use()`, you should create a file in `plugins/` and add its path to plugins in `nuxt.config.js`.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/plugins).

### `static`

This directory contains your static files. Each file inside this directory is mapped to `/`.

Example: `/static/robots.txt` is mapped as `/robots.txt`.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/static).

### `store`

This directory contains your Vuex store files. Creating a file in this directory automatically activates Vuex.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/store).
