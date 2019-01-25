export interface WhatsAppMessage {
  readonly date: string;
  readonly time: string;
  readonly sender: string; // phone number or name
  readonly message: string;
}

export type ParsedWhatsAppMessage = WhatsAppMessage | null;
