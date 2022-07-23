#!/usr/bin/env node

const yargs = require("yargs");

const options = yargs
 .usage("Usage: -n <name>")
 .option("n", { alias: "name", describe: "Seu nome", type: "string", demandOption: true })
 .argv;

const greeting = `Olá, ${options.name}!`;

console.log(greeting);