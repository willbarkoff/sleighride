# Sleighride Client

This is the Sleighride client! It's written in TypeScript and React, and can be configured very easily.

To follow these steps, you must install [Yarn](https://yarnpkg.com).

First, create a `.env` file. Populate it with one line:
```
API_BASEURL=http://localhost:4853
```

Replace localhost:4853 with the URL of your Sleighride API server. Then, run `yarn`.

Once yarn finishes installing packages, you can run `yarn build` to build a production version, or `yarn start` to run a development server. `yarn lint` will also ensure you are following best code-style practices.