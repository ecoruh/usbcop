# usbcop

This is a usb copier command line interface app. It allows copying files stored in subfolders of a source folder to a target folder partitioned by date.

## Rationale

As a photographer, after a photo shoot session, I want to run a command to transfer all my image files from the SD card to my Mac computer so that each file is stored under a specific folder partitioned by date, named as "yyyy-mm-dd" where yyyy, mm, and dd are the image creation year, month, and day respectively.

The program takes a single input from a json file called `config.json` as follows:

```json
{
    "sourceFolder": "/Volumes/LEICA DSC/DCIM",
    "folderRegex": "\\d+LEICA",
    "targetFolder": "/Users/user/Photos/2024"
}
```

Note: the attribute `folderRegex` holds a regular expression to match the source subfolder names under the `sourceFolder`.

For example:

```text

// Given:

sourceFolder\LEICA106
            L1060001.DNG   (created: 27/07/2024)
            L1060002.DNG   (created: 28/07/2024)
sourceFolder\LEICA107
            L1070001.DNG   (created: 30/07/2024)

// After the copy:

targetFolder\2024-07-27\L1060001.DNG
targetFolder\2024-07-28\L1060002.DNG
targetFolder\2024-07-30\L1070001.DNG
```

## Prerequisites

[Download Node.js](https://nodejs.org/en/download/package-manager)

## Usage

```bash
npm install
node usbcop
```
