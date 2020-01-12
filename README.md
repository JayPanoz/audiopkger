# audiopkger

A command-line tool to generate and package W3C audiobooks

## Abstract

This is a small utility you can use in your terminal to generate [W3C audiobooks](https://www.w3.org/TR/audiobooks/). It helps you create a publication manifest, a table of contents (if required), and package your folder into [an `.lpf` archive](https://www.w3.org/TR/lpf/).

Note this utility only works with simple audiobooks. It doesn’t support:

- alternate formats and content (e.g. Synchronized Narration or text);
- media fragments (a.k.a. references to locations in a single audio track);
- supplemental content;
- internal previews;
- language and base direction;
- multiple creators.

However, it can still be used to create a starting point in those cases: it will generate files you can edit and augment.

## Install

First make sure you have nodeJS and npm installed. If you don’t, [install it](https://nodejs.org/).

If you don’t want to clone the repository and have easier access to its source code then:

```
npm install -g git+https://git@github.com/JayPanoz/audiopkger.git
```

Cloning the repo will make it easier to edit code, add new scripts and formats, etc. since the global command will be tied to your clone, and you will be able to directly run the command with those changes.

To clone the repo: 

```
git clone https://github.com/JayPanoz/audiopkger.git
```

Then:

```
cd path/to/the/cloned-repo
```

Finally run:

```
npm install -g
```

If for some reason the `audiopkger` command doesn’t work after the install, run `npm link` from the root of the cloned repository.

## Usage

Please make sure you are running those commands from the root directory of your audiobook.

```
cd path/to/your/audiobook-directory
```

Indeed, the utility will look for the files and subfolders within this directory to create the `readingOrder`, list of `resources`, and table of contents.

### Generate a Manifest and a Table of Contents

Run the following command:

```
audiopkger init
```

This will launch an interactive interface asking you questions to populate the audiobook’s manifest. More precisely, it will ask for:

1. the title of the book;
2. its isbn (falls back to auto-generated uuid if you don’t have any);
3. its author;
4. its narrator;
5. its publisher;
6. its language;
7. its publication date;
8. its cover;
9. its table of contents.

Then it will search for audio files in the directory and list them in the manifest (`readingOrder`). Please make sure their filenames are in the correct order.

If you don’t have a table of contents, you can tell the utility to create one from the `readingOrder` automatically, although you will have to edit the entries of the navigation list. This will create a Primary Entry Page (`index.html`) with the table of contents and add it in the root directory.

Once completed, a `publication.json` file will be added in the root directory.

### Package

The `init` command doesn’t automatically package the audiobook. Indeed, you may have to edit the manifest and table of contents, especially as a pattern `Track + file-index` is used as the title of the chapter (`name`).

To package, run the following command: 

```
audiopkger package
```

Note this script expects the manifest to be named `publication.json`, and will error if it isn’t.

It will then check the manifest and package resources into an `.lpf` archive – with audio files using `STORE`. This consequently shouldn’t package dot files if you’re using a Mac for instance.

This means you can also use this command as a quick and simple packager for W3C audiobooks if you already have everything required.

### Misc

To print the help, run:

```
audiopkger -h
```

To check the version, run:

```
audiopkger -v
```

## Help

```
audiopkger [command]

  help ............... show help menu
  init ............... create an audiobook manifest (and toc) in the directory
  package ............ package the directory as .lpf
  version ............ show the version
```