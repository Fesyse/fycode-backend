<h1 align="center">Fycode</h1>

<p align="center">A place to test your programming skills on real problems</p>
<p align="center"><img src="./public/main.png" alt="main-page" /></p>

## How to run project

make sure you have installed:

- [Node.js](https://nodejs.org/en/)
- [pnpm](https://pnpm.io/)

add necessary enviroment variables

```env
DATABASE_URL="postgresql://username:password@localhost:port/fycode?schema=public"
JWT_SECRET="random_string"

BASE_URL=""
CLIENT_URL=""

SERVER_MODE="dev" # change to "prod" in production mode
```

then install all dependencies

```bash
pnpm install
```

run project

```bash
pnpm start
```

in development mode

```bash
pnpm start:dev
```

or build

```bash
pnpm start:build
```

## TODO

- [+] code editor header
  - [+] language choose in code editor
- [+] code editor
- [+] code editor footer
  - [+] setup custom tests
  - [+] setup results
- [+] attempt and submit code buttons
- [+] user profile page
- [+] create problem page
