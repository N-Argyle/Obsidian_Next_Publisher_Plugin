# Obsidian Next Publisher Plugin

This is a plugin for [Obsidian](https://obsidian.md/). Paired with the [Obsidian Next Publisher](https://github.com/N-Argyle/Obsidian_Next_Publisher) server, it allows you to publish password-protected notes online. Unlike Obsidian's Publishing tool, each page is shared individually, with its own password. There is no directory or explorer. It's designed for securely sharing individual documents.

**Note:** This plugin is currently in alpha and is only recommended for developers.

## Installation

To install the plugin, follow these steps:

1. Clone this repository into the `{vault}/.obsidian/plugins` directory of your Obsidian vault.
2. Run `yarn dev` or an equivalent command to install the dependencies.
3. Activate the plugin in Obsidian.

## Setup

1. Navigate to the plugin settings in Obsidian.
2. Set an API key, master password, and server URL.
    - You'll need to come up with the API key and master password on your own.
    - For the server, please refer to the server repository's README file.

## Usage

Once set up, with a note active and in edit mode, open the command palette and choose `Next Publisher: Publish`.

Individual document passwords are encrypted locally, using your Master Password as the key.

## Demo of the server
Go here [https://obsidian-next-publisher.vercel.app/docs/xFjyN4H5fI], use `test` as the password.