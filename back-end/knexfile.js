/**
 * Knex configuration file.
 *
 * You will not need to make changes to this file.
 */

require("dotenv").config();
const path = require("path");

const {
  DATABASE_URL = "postgres://ugkzsyhg:DJ__noElG0I0CU5Dxy5c9HlKjsH5fBgm@stampy.db.elephantsql.com/ugkzsyhg",
  DATABASE_URL_DEVELOPMENT = "postgres://tdgyvoon:VChfumvSGzY5zrjdiIseR-8xwEVF80eG@stampy.db.elephantsql.com/tdgyvoon",
  DATABASE_URL_TEST = "postgres://rmnzalbh:569iM2pyX6nxsadpZbkABQKONwFG8VK6@stampy.db.elephantsql.com/rmnzalbh",
  DATABASE_URL_PREVIEW = "postgres://vrpurdks:8prRLnwm1kY_tNy1QOlZKO0BoLJ7Nu0A@stampy.db.elephantsql.com/vrpurdks",
  DEBUG,
} = process.env;

module.exports = {
  development: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_DEVELOPMENT,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  test: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_TEST,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  preview: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_PREVIEW,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  production: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
};
