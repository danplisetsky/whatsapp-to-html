import * as fs from "fs";
import * as os from "os";

import { WhatsAppMessage, ParsedWhatsAppMessage, Sender } from "@parser/types";
import { sanitize } from "@utils/string";

//#region INTERNALS

const parseRegExp = /([\d\/]+),\s*([\d:]{4,}(?:\s*[AP]M)?)([^:]+):\s*(.*)/;

function _parseMessage(message: string): ParsedWhatsAppMessage {
  function sanitizeSender(sender: string): string {
    return sanitize(sender, /[\+\s\d\p{L}]/u);
  }

  const res = parseRegExp.exec(message);

  return res
    ? {
        date: res[1],
        time: res[2],
        sender: sanitizeSender(res[3]),
        message: res[4],
      }
    : null;
}

//#endregion

//#region EXPORTS

export function parseFile(
  path: string
): {
  readonly messages: ReadonlyArray<WhatsAppMessage>;
  readonly senders: ReadonlySet<Sender>;
} {
  const content = fs.readFileSync(path).toString();
  const messages = content.split(os.EOL).reduce((prev, cur) => {
    if (parseRegExp.test(cur)) return [...prev, cur];
    else {
      const lastMessage = prev[prev.length - 1];
      const lastMessageWithAppendedChunk = lastMessage + " " + cur;

      return [...prev.slice(0, prev.length - 1), lastMessageWithAppendedChunk];
    }
  }, []);
  const parsedMessages = messages.map(
    message => _parseMessage(message) as WhatsAppMessage
  );
  const senders = new Set(parsedMessages.map(pm => pm.sender));

  return {
    messages: parsedMessages.filter(message => !!message),
    senders,
  };
}

//#endregion
