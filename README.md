# LibgenCheck
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0) [![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg)](code_of_conduct.md)

A simple Node.js script designed to check whether books in your collection exist on Library Genesis or not.

## Usage
`libgencheck FILE1 FILE2 …`

To check all the files in a folder you can utilize shell globbing:
`libgencheck *`

To check all the files with the PDF extension you can use this:
`libgencheck *.pdf`

## Contributing

For guidelines on how to contribute please refer to [CONTRIBUTING.md](./CONTRIBUTING.md). Please keep in mind that all pull/merge requests should be submitted to the [GitLab repo](https://gitlab.com/Atrate/libgencheck), since repos on e.g. GitHub are just mirrors.

## Dependencies and third-party components
 - [md5-file](https://www.npmjs.com/package/md5-file) (MIT):
  `npm install md5-file`
  - [libgen](https://www.npmjs.com/package/libgen) (MIT):
  `npm install libgen`
  
## License
This project is licensed under the [GPL-3.0-or-later](https://www.gnu.org/licenses/gpl-3.0.html).