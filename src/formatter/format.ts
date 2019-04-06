import { WhatsAppMessage, Sender } from "@parser/types";
import date from "date-and-time";

const messageTemplate =
  '<p><span style="color:{color}">{sender}</span> @ <span style="color:grey;font-size:10px">{time}</span>: {message}</p>';

const colors: ReadonlyArray<string> = ["orange", "cyan"];

//#region INTERNALS

function createMessageTemplate(color: string, sender: Sender): string {
  return messageTemplate.replace(
    /{color}(.+){sender}/,
    (match, p1) => color + p1 + sender
  );
}

function formatMessages(
  [currentMessage, ...messages]: ReadonlyArray<WhatsAppMessage>,
  messageTemplates: ReadonlyMap<Sender, string>,
  datePattern: string,
  currentDate: string = "",
  result: ReadonlyArray<string> = [""]
): ReadonlyArray<string> {
  if (!currentMessage) return result;

  const template = messageTemplates.get(currentMessage.sender);
  if (!template)
    throw new Error(
      "unknown sender in message: " + JSON.stringify(currentMessage)
    );
  const resultingMessage = (template as string).replace(
    /{time}(.+){message}/,
    (match, p1) => currentMessage.time + p1 + currentMessage.message
  );

  if (currentMessage.date !== currentDate) {
    const parsedDate = date.parse(currentMessage.date, datePattern);
    const dateHeader =
      "\n<h2>" +
      date.format(new Date(parsedDate), "dddd, MMMM D, YYYY") +
      "</h2>\n";

    return formatMessages(
      messages,
      messageTemplates,
      datePattern,
      currentMessage.date,
      [...result, dateHeader, resultingMessage]
    );
  } else {
    return formatMessages(
      messages,
      messageTemplates,
      datePattern,
      currentMessage.date,
      [...result, resultingMessage]
    );
  }
}
//#endregion

//#region EXPORTS

export function formatMarkdown({
  messages,
  senders,
  datePattern,
}: {
  readonly messages: ReadonlyArray<WhatsAppMessage>;
  readonly senders: ReadonlySet<Sender>;
  readonly datePattern: string;
}): string {
  const messageTemplates: Map<Sender, string> = new Map(
    [...senders.values()].map(
      (sender, i) =>
        [sender, createMessageTemplate(colors[i], sender)] as [string, string]
    )
  );

  return formatMessages(messages, messageTemplates, datePattern).join("\n");
}

//#endregion
