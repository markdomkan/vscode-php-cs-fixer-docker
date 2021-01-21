# php-cs-fixer-docker README

## Features

Todo docs

## Requirements

- Docker.
- [PHP cs fixer](https://github.com/FriendsOfPHP/PHP-CS-Fixer) installed inside container.
- Container name that contains php cs fixer installed configured inside global vs code settings or _.vscode/settings.json_ workespace dir.

## Extension Settings

```json
{
  "php-cs-docker.containerName": "container_name_with_php_cs_fixer_installed"
}
```

## Build

1. Install dependencies with

```
yarn
```

2. and compile with

```
yarn vsce package
```

## Install

```
code --install-extension php-cs-docker-X.X.X.vsix
```

**Enjoy!**
