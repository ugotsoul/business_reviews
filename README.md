A business dashboard app built on Express & Node.

#### Setup

Install node v4.4 or use [nvm](https://github.com/creationix/nvm)
```bash
$ nvm use // node version 4.4
$ npm install
```

Create a MongoDB cloud account & database on [mLab](https://mlab.com/) to store reviews.

Create a configuration file `lib/config.js` and add your DB's connection string:

```javascript
'use strict';
module.exports = {
  mongo: {
    development: {
      connectionString: 'mongodb://YOUR_DB_URL'
    }
  },
  cookieSecret: "SECRET"
};
```

#### Run
```bash
$ nodemon --exec npm run babel-node -- app.js
```

#### Lint
```bash
./node_modules/.bin/eslint
```
