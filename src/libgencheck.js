#!env node
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

const args = process.argv.slice(2);

(async (args) => 
    {
        console.log(args);

        args.forEach(async file => 
            {
                const hash = md5_file.sync(file);
                console.log(`${hash}`);

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
                        console.log(`No results for "${options.query}"`);
                    }
                    else
                    {
                        console.log(`There are results for "${options.query}"`);

                    }
                }
                catch (err) 
                {
                    console.error(err);
                }

            });
    } )(args);
