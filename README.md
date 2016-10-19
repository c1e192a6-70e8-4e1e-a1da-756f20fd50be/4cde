# 4cde
A solve to something of somekind. Have fun :)

## Memo:
`npm install` might be killed during installation on machines with less than 1G memory and no swap file config..  
npm 3+ is desired.

## Test
Expect local beanstalkd and mongo server. `NODE_ENV` is set to test.

`npm test`

## Run
### Consumer worker
`npm start`
Start a loopback Server in repl mode.

### Producer worker


## Solutions to sub problems:
1. Database
	- Loopback's ORM - for being lazy...
2. Beanstalkd workers
	- `Aftership/bsw` ... this is kind of cheating.
	- forked version of `Aftership/bsw` which emits event when a job is reserved and finished. [link](https://github.com/c1e192a6-70e8-4e1e-a1da-756f20fd50be/bsw)
	- `./units/bsw-handler.js` bsw-handler
	- `./units/bsw-worker.js` bsw-worker monuter.
	- `./units/rate-extract-job` generator function to complete the task.
3. Cwarling
	- `request` && `request-promis` for request handling and rejecting non-2xx by default.
	- `cheerio` for html parsing and retrive text and only text from `<body>` tag
	- `./units/rate-extractor.js` for extract rates.
4. Reporting mechanism.
	- `loopback` server, defalut port on 13370
	- **GET /** echos current server status
	- **GET /logs** echos local bsw logs.
	- **GET /explorer** and etc. Free Swagger-UI and restful API by using loopback. && this project does not have security concern...

## Things to improve:
Maybe also get timestamp from remote server in case server time doesn't consist.
