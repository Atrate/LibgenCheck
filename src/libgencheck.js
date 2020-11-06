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
var argv = require("yargs")(process.argv.slice(2))
    .scriptName("libgencheck")
    .usage("Usage: $0")
    .count("verbose")
    .alias("v","verbose")
    .option("c",
        {
            alias: "copy",
            describe: "PLACEHOLDER",
            nargs: 1
        })
    .option("m",
        {
            alias: "mirror",
            nargs: 1
        })
    .demandCommand(1)
    .default("m", "http://gen.lib.rus.ec")
    .argv;
        
VERBOSE_LEVEL = argv.verbose;

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
                    mirror: 'http://gen.lib.rus.ec',
                    query: hash,
                    search_in: 'md5'
                }
            try 
            {
                const data = await libgen.search(options);

                if (data.length === undefined)
                {
                    console.log(`${file} does not exist on Library Genesis`);
                }
                else
                {
                    console.log(`${file} exists on Library Genesis`);
                }
            }
            catch (err) 
            {
                console.error(err);
            }

        }
        catch (err)
        {
            WARN(`Could not find file: ${file}`);
            return;
        }
    });
