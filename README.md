# LibgenCheck
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0) [![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg)](CODE_OF_CONDUCT.md)

A simple Node.js script designed to check whether books in your collection exist on Library Genesis or not.

## Usage
```
Usage: libgencheck.js [OPTION]...  [FILE]...

Options:
      --help           Show help                                       [boolean]
      --version        Show version number                             [boolean]
  -c, --copy           Copy files available on Library Genesis to a specified
                       folder
  -C, --copy-reverse   Copy files NOT available on Library Genesis to a
                       specified folder
  -l, --libgen-mirror  Choose a Library Genesis mirror
                                              [default: "http://gen.lib.rus.ec"]
  -m, --move           Move files available on Library Genesis to a specified
                       folder
  -M, --move-reverse   Move files NOT available on Library Genesis to a
                       specified folder
  -v, --verbose        Explain what is being done. Specify multiple times to
                       increase verbosity (up to 2 times)                [count]
```


To check all the files in a folder you can utilize shell globbing:
`libgencheck *`

To check all the files with the PDF extension you can use this:
`libgencheck *.pdf`

## Contributing

For guidelines on how to contribute please refer to [CONTRIBUTING.md](./CONTRIBUTING.md). Please keep in mind that all pull/merge requests should be submitted to the [GitLab repo](https://gitlab.com/Atrate/libgencheck), since repos on e.g. GitHub are just mirrors.

## Dependencies and third-party components
 - [libgen](https://www.npmjs.com/package/libgen) (MIT):
 `npm install libgen`
 - [md5-file](https://www.npmjs.com/package/md5-file) (MIT):
 `npm install md5-file`
 - [yargs](https://www.npmjs.com/package/yargs) (MIT):
 `npm install yargs`

## License
This project is licensed under the [GPL-3.0-or-later](https://www.gnu.org/licenses/gpl-3.0.html).
