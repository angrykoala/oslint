OSLint
====================
_by @angrykoala_


## Instructions:

1. `npm install`
2. Create a file `.env` in the root with the following structure:
```env_file
GITHUB_USERNAME=
GITHUB_TOKEN=
```

4. `npm run compile` to build the whole app
    * `npm run tsc` to recompile backend
    * `npm run build-frontend` to recompile frontend
3. [optional] `npm run watch-frontend` to rebuild frontend automatically
4. `npm start` to run the server

## Deploy with Caddy


* Caddyfile file with this structure:

```
url {
  proxy / os-analiser:3030
}
```

* `docker-compose up -d`

## License
This projects is under GPL-3.0 License
