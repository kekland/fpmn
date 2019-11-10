# fpmn

A package manager for **Flutter** that is similar in fashion to **npm**.

Work in progress!


## Installation

You will need **Node.js** in order for this to work.

```bash
$ npm i -g fpmn
```

## Usage

Firstly, your terminal should be in a folder where your flutter project is.

### Installing a package

```bash
# fpm install intl
$ fpm i intl

# output
√ Fetching package intl from pub.dev
√ Package intl with version latest already exists in pubspec.yaml. Do you want to upgrade it? » Yes
√ Fetching versions of intl
√ Select the version: » 0.16.0
√ Running flutter pub get
```

### Uninstalling package (wip)

```bash
$ fpm u intl
```

## Contact me

**E-Mail**: `kk.erzhan@gmail.com`