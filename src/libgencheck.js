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
const colors = require("colors");
const path = require("path");
const fs = require("fs");

// Set up yargs arguments
// ----------------------
var argv = require("yargs")(process.argv.slice(2))
    .scriptName("libgencheck.js")
    .usage("Usage: $0 [OPTION]...  [FILE]...")
    .option("a",
        {
            alias: "available-only",
            describe: "Only output files files available on Library Genesis",
            nargs: 0
        })
    .option("A",
        {
            alias: "unavailable-only",
            describe: "Only output files NOT available on Library Genesis",
            nargs: 0
        })
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
    .option("n",
        {
            alias: "no-formatting",
            describe: "Disable output formatting (colours and font styles). Also changes checkmarks into 'O's and crosses into 'X'es",
            nargs: 0
        })
    .count("v")
    .alias("v", "verbose")
    .describe("v", "Explain what is being done. Specify multiple times to increase verbosity (up to 2 times)")
    .demandCommand(1)
    .argv;

// Declare functions responsible for output
// ----------------------------------------
const VERBOSE_LEVEL = argv.v;

function LOG() { VERBOSE_LEVEL >= 0 && console.log.apply(console, arguments); }
function WARN()  { VERBOSE_LEVEL >= 0 && console.log.apply(console, arguments); }
function INFO()  { VERBOSE_LEVEL >= 1 && console.log.apply(console, arguments); }
function DEBUG() { VERBOSE_LEVEL >= 2 && console.log.apply(console, arguments); }

INFO(argv.n ? `Files chosen for processing: ${argv._}`: `Files chosen for processing: `.bold + `${argv._}`.italic );
INFO("");

// Iterate through each argument from the argv._ and check files from there
// ------------------------------------------------------------------------
argv._.forEach(async file => 
    {
        // Declare variables before try-catch blocks since JS is illogical and try-catches are scoped
        // ------------------------------------------------------------------------------------------
        let hash;
        try
        {
            hash = md5_file.sync(file);
        }
        catch (err)
        {
            WARN(`Could not find file: ${file}`);
            DEBUG(err);
            return;
        }
        INFO(argv.n ? `${file} hash : ${hash}` : `${file}`.italic + ` hash: ` + `${hash}`.gray );

        const options = 
            {
                mirror: argv.l,
                query: hash,
                search_in: 'md5'
            }
        DEBUG(options);
        
        // Grab file information from Library Genesis
        // ------------------------------------------
        let data;
        try 
        {
            data = await libgen.search(options);
        }
        catch (err) 
        {
            WARN(`Connecting to Library Genesis failed! Please check your internet connectivity, the mirror and whether you're being rate-limited by the API. For more info, pass -vv`);
            DEBUG(err);
        }

        // The if clause evaluates to true when the searched for file does not exist on Library Genesis
        // --------------------------------------------------------------------------------------------
        if (data.length === undefined)
        {
            if (!argv.a)
            {
                LOG(argv.n ? `[X] ${file} does not exist on Library Genesis` : `[` + `✘`.red + `] ` + `${file}`.italic  + ` does not exist`.bold + ` on Library Genesis`);
            }
            if (typeof argv.C !== 'undefined')
            {
                if (!fs.existsSync(argv.C))
                {
                    fs.mkdirSync(argv.C);
                }
                fs.copyFile(file, path.join(argv.C, path.basename(file)), (err) =>
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
                fs.rename(file, path.join(argv.M, path.basename(file)), (err) =>
                    {
                        if (err) throw err;
                        INFO(`Moved ${file} to ${argv.M}`)
                    });
            }                    
        }
        else
        {    
            if (!argv.A)
            {
                LOG(argv.n ? `[O] ${file} exists on Library Genesis`: `[` + `✔`.green + `] ` +  `${file}`.italic + ` exists`.bold + ` on Library Genesis`);
            }
            DEBUG(data);
            if (typeof argv.c !== 'undefined')
            {
                if (!fs.existsSync(argv.c))
                {
                    fs.mkdirSync(argv.c);
                }
                fs.copyFile(file, path.join(argv.c, path.basename(file)), (err) =>
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
                fs.rename(file, path.join(argv.m, path.basename(file)), (err) =>
                    {
                        if (err) throw err;
                        INFO(`Moved ${file} to ${argv.m}`)
                    });
            }
        }
    });
