# Sleighride Server

This is the Sleighride server! It's written in go, and can be configured very easily. To follow these steps, you must install [The Go Programming Language](https://golang.org) and [Roamer](https://github.com/thatoddmailbox/roamer). Instructions can be found on the linked pages.

First configure Roamer by running `roamer setup`. This will create a `roamer.local.toml` file. Modify that file to connect to a database. Right now, MySQL is the only supported database.

Next, run `roamer upgrade`. This will properly format the database according to the most current schema.

After that, create a `.env` file. This file stores the secrets for the application. It should follow this format:
```
SECRET=randomstring
DSN=sleighride:sleighride@tcp(localhost:3306)/sleighride
SECRET_CODE=letmein
```

`SECRET` is the secret string used for signing cookies. This should be randomly generated and kept a secret! `DSN` is the data-source name. It should follow the format `user:password@host:port/database`. You can use `tcp` to force a connection with TCP. `SECRET_CODE` is the code that you can share with your friends to make sure that they're the correct people joining. **Don't mix up `SECRET` and `SECRET_CODE`!**.

Next, install the application with `go install`, and run it with `sleighride-server`. I'd recommend setting up a `systemd` service to keep Sleighride running on the server, but I won't go into that here. There are numerous tutorials online.