# whatsapp-to-html

## The problem

Currently, WhatsApp lets you export chats only in the plain .txt format, which is difficult to read. It'd be nice to have those chats nicely formatted.

## The solution

```bash
$ npm install -g whatsapp-to-html
```

It comes with a command line program and a user-facing API.

## Usage

### CLI

`whatsapp-to-html` expects a [date pattern][date-pattern] and an exported WhatsApp chat. You can also optionally pass it a path to a JSON file, which should be a map of the interlocutors in the provided WhatsApp chat to strings, which will be used as aliases. See an example below.

Thus, the flags are:

```
-d              A date pattern
-a              A path to a JSON file containing aliases for the participants in the provided chat
```

The last argument should a the path to an exported WhatsApp chat.

The resulting HTML will be written to `stdout`.

#### Examples

Let's say we have the following chat exported from WhatsApp in a `_chat.txt` file:

```
[12/05/2019, 3:32:47 PM] Daniel: Who are you?
[12/05/2019, 3:33:14 PM] Mysterion: I’m an angel keeping watch over the city at night
[12/05/2019, 3:43:46 PM] Daniel: Are you Craig?
[12/05/2019, 3:48:09 PM] Mysterion: I might be Craig, and then again, I might not be. My identity must remain a secret. You cannot know.
[12/05/2019, 3:48:41 PM] Daniel: What are you doing here?
[12/05/2019, 3:49:32 PM] Mysterion: The city needs my help. It cries for protection, and I will answer the call to save her.
[13/05/2019, 8:00:43 AM] Mysterion: Today you crossed paths with the wrong immortal fourth grader
[13/05/2019, 2:53:14 PM] Daniel: Right. This conversation is over.
```

According to [this table][date-pattern], the date pattern in this file is DD/MM/YYYY. Running this

```bash
$ whatsapp-to-html -d DD/MM/YYYY -- _chat.txt > out.html
```

will produce the following `out.html`

```html
<h2>Sunday, May 12, 2019</h2>

<p>
  <span style="color:#ed6f42">Daniel</span> @
  <span style="color:grey;font-size:10px">3:32:47 PM</span>: Who are you?
</p>
<p>
  <span style="color:#c4e559">Mysterion</span> @
  <span style="color:grey;font-size:10px">3:33:14 PM</span>: I’m an angel
  keeping watch over the city at night
</p>
<p>
  <span style="color:#ed6f42">Daniel</span> @
  <span style="color:grey;font-size:10px">3:43:46 PM</span>: Are you Craig?
</p>
<p>
  <span style="color:#c4e559">Mysterion</span> @
  <span style="color:grey;font-size:10px">3:48:09 PM</span>: I might be Craig,
  and then again, I might not be. My identity must remain a secret. You cannot
  know.
</p>
<p>
  <span style="color:#ed6f42">Daniel</span> @
  <span style="color:grey;font-size:10px">3:48:41 PM</span>: What are you doing
  here?
</p>
<p>
  <span style="color:#c4e559">Mysterion</span> @
  <span style="color:grey;font-size:10px">3:49:32 PM</span>: The city needs my
  help. It cries for protection, and I will answer the call to save her.
</p>

<h2>Monday, May 13, 2019</h2>

<p>
  <span style="color:#c4e559">Mysterion</span> @
  <span style="color:grey;font-size:10px">8:09:43 PM</span>: Today you crossed
  paths with the wrong immortal fourth grader
</p>
<p>
  <span style="color:#ed6f42">Daniel</span> @
  <span style="color:grey;font-size:10px">2:30:14 PM</span>: Right. This
  conversation is over.
</p>
```

It will look [like this](https://codepen.io/danplisetsky/pen/MNwEBB), which is much more readable.

Optionally, you can create a JSON file (let's call it `_chat.json`):

```json
{
  "Mysterion": "Kenny"
}
```

If you passed it to the program, you'd get this:

```bash
$ whatsapp-to-html -d DD/MM/YYYY -a _chat.json -- _chat.txt > out.html
```

`out.html`:

```html
<h2>Sunday, May 12, 2019</h2>

<p>
  <span style="color:#48e2dd">Daniel</span> @
  <span style="color:grey;font-size:10px">3:32:47 PM</span>: Who are you?
</p>
<p>
  <span style="color:#e28f85">Kenny</span> @
  <span style="color:grey;font-size:10px">3:33:14 PM</span>: I’m an angel
  keeping watch over the city at night
</p>
<p>
  <span style="color:#48e2dd">Daniel</span> @
  <span style="color:grey;font-size:10px">3:43:46 PM</span>: Are you Craig?
</p>
<p>
  <span style="color:#e28f85">Kenny</span> @
  <span style="color:grey;font-size:10px">3:48:09 PM</span>: I might be Craig,
  and then again, I might not be. My identity must remain a secret. You cannot
  know.
</p>
<p>
  <span style="color:#48e2dd">Daniel</span> @
  <span style="color:grey;font-size:10px">3:48:41 PM</span>: What are you doing
  here?
</p>
<p>
  <span style="color:#e28f85">Kenny</span> @
  <span style="color:grey;font-size:10px">3:49:32 PM</span>: The city needs my
  help. It cries for protection, and I will answer the call to save her.
</p>

<h2>Monday, May 13, 2019</h2>

<p>
  <span style="color:#e28f85">Kenny</span> @
  <span style="color:grey;font-size:10px">8:09:43 PM</span>: Today you crossed
  paths with the wrong immortal fourth grader
</p>
<p>
  <span style="color:#48e2dd">Daniel</span> @
  <span style="color:grey;font-size:10px">2:30:14 PM</span>: Right. This
  conversation is over.
</p>
```

`Mysterion` is now displayed as `Kenny`, which is just as well.

### API

After installing the library, `import` it:

```javascript
import { whatsappToHtml } from "whatsapp-to-html";
```

or `require` it:

```javascript
const whatsappToHtml = require("whatsapp-to-html").whatsappToHtml;
```

#### whatsappToHtml(filePath, datePattern, senderAliases?)

- @param {**string**} filePath
- @param {**string**} datePattern
- @param {**{ readonly [s: string]: string }**} [senderAliases]

```javascript
const html = whatsappToHtml("./_chat.txt", "DD/MM/YYYY", {
  Mysterion: "Kenny",
});
```

This will return the same html as we saw before.

## Notes

- The colors are assigned to chat participants at random. If you don't like the result, run the program again
- If there are chat participants identified by their phone numbers, use the following rule to properly map them to names (or whatever you'd like to map them to. Maybe different numbers. Who knows):
  - Remove all the dashes and parentheses, if there are any, from the number, but keep the spaces. For instance, if the number is `(+451 12-34-5678)`, use `"+451 12345678"` as a key in your JSON file / object

[date-pattern]: https://www.npmjs.com/package/date-and-time#parsedatestring-formatstring-utc
