# CutieBot

*Yet another Discord bot...*

To set up the bot, you need to create a `.env` file in the root directory. You can use the `example.env` file as a template.

## Photo library

This bot allows you to create a photo library on Discord. Set a channel as the album, and send photos to it or use the `/reg-pic` command to register new pictures. You can easily set attributes to your pictures, such as a title, a description, a date and a location. And they will be parsed using some regex to allow typing errors and different formats.

You have then a full control over your library, using buttons to edit attributes (title, description, date, location) or delete pictures. You can always put them to trash and restore them later.

The `/cute-pic` command will send a random picture from the library, and you can also ask for a specific one using `/cute-pic pic:<file_name>`.


## Auto-replies

You can set auto-replies to specific words or sentences. The bot will then reply with a random message from a list of possible answers. Those answers will have a decreasing probability to be chosen, so that the bot will not always reply with the same message.


## Reminders

You can set daily reminders (for lunch and dinner, or others if you fork the bot) that will be sent to a specific user.


## Message data viewer

A context menu command is available to check the JSON data of a message, such as its content, embeds, attachments and components. This is mainly used for debugging purposes, but can be very helpful sometimes.


---

# Old version

For the original version of the bot, written in JavaScript and using web scraping with a Google Photos library, check the [`old-JS-version` branch](https://github.com/oligonyx/CutieBot/tree/old-JS-version).
