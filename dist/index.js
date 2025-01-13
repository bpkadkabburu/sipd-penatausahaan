#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Import necessary modules from commander
var commander_1 = require("commander");
var program = new commander_1.Command();
// Set CLI version
program.version('1.0.0');
// Add a command
program
    .command('greet <name>')
    .description('Greet the person with the given name')
    .action(function (name) {
    console.log("Hello, ".concat(name, "!"));
});
// Parse the CLI input
program.parse(process.argv);
