<h1  align="center">❯❯❯ Stato-API</h1>
<p  align="center">Simply work.</p>
<p  align="center">
<img  src="https://forthebadge.com/images/badges/made-with-javascript.svg">

<img  src="https://forthebadge.com/images/badges/built-with-love.svg">
</p>

Stato is a minimal tool to increase your productivity and work without getting disturbed in offices or even in remote teams.

This is the repository of API which serves [stato-electron](https://github.com/lunaticmonk/stato-electron)

### Tech

Stato uses a number of open source projects to work properly:

- [Node.js](https://nodejs.org/en/) - Evented I/O for the backend
- [Express](https://expressjs.com/) - a Node.js web application framework
- [Bookshelf](https://bookshelfjs.org/) - JavaScript ORM for Node.js
- [Knex](https://knexjs.org/) - SQL query builder
- [PostgreSQL](https://www.postgresql.org/) - Object relational database to hold the data

### Desktop app

Stato API serves the desktop app. Head over [here](https://github.com/lunaticmonk/stato-electron).

### Installation

Stato requires [Node.js](https://nodejs.org/) v8+ to run.

### Development

Want to contribute? Great!

```sh
$ git clone git@github.com:lunaticmonk/stato-api.git
$ cd stato-api
$ npm install
```

But, before that, you will have to ensure that PostgreSQL is installed on your system.

- Install PostgreSQL on your system(Follow any tutorial for installing it, quite simple thing).
- Create a database user or use the default one i.e `postgresql`(Make sure to change the configs in .env once you create new user).
- Once that is done, run `createdb statodev` from your terminal.

After that, run the migrations with knex.

```sh
$ knex migrate:latest --knexfile ./src/knexfile.js
```

Create a .env and add following environment variables to it.

```sh
DATABASE_USER=DATABASE_USER
DATABASE_PASSWORD=DATABASE_PASSWORD
DATABASE_NAME=DATABASE_NAME
NODE_ENV=NODE_ENV
ALLOWED_DOMAINS=*
```

Finally, run

```sh
$ npm run start
```

### To launch stato-api on your own server(prod use)

```sh
$ npm install pm2 -g
$ npm run daemon
```

### Todos

- Suggest more features
- Write Tests

Please ⭐ this repository if you liked it.

## License

MIT
