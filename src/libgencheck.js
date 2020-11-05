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

if (args.length === 0)
{
    console.log(`Please specify at least one file to process!`);
    return;
}

console.log(`Files chosen for processing: ${args}`);

args.forEach(async file => 
    {
        try
        {
            const hash = md5_file.sync(file);

            console.log(`${file} hash: ${hash}`);

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
            console.log(`Could not find file: ${file}`);
            return;
        }
    });
