OSLint
====================
_by @angrykoala_

Analyse Open source projects and give hints on how to improve them. Only GitHub projects supported for now.


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

* Add Caddyfile with this structure:

```
<Public-url> {
  proxy / oslint:3030
}
```

* Execute `bash deploy.sh`
* To deploy a new version of oslint execute `bash deploy.sh oslint`

## License
This projects is under GPL-3.0 License
