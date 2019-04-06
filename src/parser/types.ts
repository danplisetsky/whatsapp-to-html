export type Sender = string;

export interface WhatsAppMessage {
  readonly date: string;
  readonly time: string;
  /** @description Phone number or name */
  readonly sender: Sender;
  readonly message: string;
}

export type ParsedWhatsAppMessage = WhatsAppMessage | null;
