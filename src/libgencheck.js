#!/usr/bin/env node
/*
 * Copyright (C) 2020 Atrate <atrate@protonmail.com>
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; version 3 of the License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 */

const md5_file = require("md5-file");
const libgen = require("libgen");
const fs = require("fs");
var argv = require("yargs")(process.argv.slice(2))
    .scriptName("libgencheck.js")
    .usage("Usage: $0 [OPTION]...  [FILE]...")
    .option("c",
        {
            alias: "copy",
            describe: "Copy files available on Library Genesis to a specified folder",
            nargs: 1
        })
    .option("C",
        {
            alias: "copy-reverse",
            describe: "Copy files NOT available on Library Genesis to a specified folder",
            nargs: 1
        })
    .option("l",
        {
            alias: "libgen-mirror",
            describe: "Choose a Library Genesis mirror",
            nargs: 1
        })
    .default("l", "http://gen.lib.rus.ec")
    .option("m",
        {
            alias: "move",
            describe: "Move files available on Library Genesis to a specified folder",
            nargs: 1
        })
    .option("M",
        {
            alias: "move-reverse",
            describe: "Move files NOT available on Library Genesis to a specified folder",
            nargs: 1
        })
    .count("v")
    .alias("v", "verbose")
    .describe("v", "Explain what is being done. Specify multiple times to increase verbosity (up to 2 times)")
    .demandCommand(1)
    .argv;

const VERBOSE_LEVEL = argv.v;

function WARN()  { VERBOSE_LEVEL >= 0 && console.log.apply(console, arguments); }
function INFO()  { VERBOSE_LEVEL >= 1 && console.log.apply(console, arguments); }
function DEBUG() { VERBOSE_LEVEL >= 2 && console.log.apply(console, arguments); }

INFO(`Files chosen for processing: ${argv._}`);

argv._.forEach(async file => 
    {
        try
        {
            const hash = md5_file.sync(file);

            INFO(`${file} hash: ${hash}`);

            const options = 
                {
                    mirror: argv.l,
                    query: hash,
                    search_in: 'md5'
                }
            DEBUG(options)
            try 
            {
                const data = await libgen.search(options);

                if (data.length === undefined)
                {
                    console.log(`${file} does not exist on Library Genesis`);
                    if (typeof argv.C !== 'undefined')
                    {
                        if (!fs.existsSync(argv.C))
                        {
                            fs.mkdirSync(argv.C);
                        }
                        fs.copyFile(file, argv.C + "/"  + file, (err) =>
                            {
                                if (err) throw err;
                                INFO(`Copied ${file} to ${argv.C}`)
                            });
                    }
                    if (typeof argv.M !== 'undefined')
                    {
                        if (!fs.existsSync(argv.M))
                        {
                            fs.mkdirSync(argv.M);
                        }
                        fs.rename(file, argv.M + "/"  + file, (err) =>
                            {
                                if (err) throw err;
                                INFO(`Moved ${file} to ${argv.M}`)
                            });
                    }                    
                }
                else
                {                  
                    console.log(`${file} exists on Library Genesis`);
                    DEBUG(data);
                    if (typeof argv.c !== 'undefined')
                    {
                        if (!fs.existsSync(argv.c))
                        {
                            fs.mkdirSync(argv.c);
                        }
                        fs.copyFile(file, argv.c + "/"  + file, (err) =>
                            {
                                if (err) throw err;
                                INFO(`Copied ${file} to ${argv.c}`)
                            });
                    }
                    if (typeof argv.m !== 'undefined')
                    {
                        if (!fs.existsSync(argv.m))
                        {
                            fs.mkdirSync(argv.m);
                        }
                        fs.rename(file, argv.m + "/"  + file, (err) =>
                            {
                                if (err) throw err;
                                INFO(`Moved ${file} to ${argv.m}`)
                            });
                    }
                }
            }
            catch (err) 
            {
                WARN(`Connecting to Library Genesis failed! Please check your internet connectivity, the mirror and whether you're being rate-limited by the API. For more info, pass -vv`);
                DEBUG(err);
            }

        }
        catch (err)
        {
            WARN(`Could not find file: ${file}`);
            return;
        }
    });
