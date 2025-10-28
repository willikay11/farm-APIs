export class ReceiptDto {
  readonly fileUrl: string;
  readonly chatId: number;
  readonly messageGroupId: number;
  readonly timestamp: number;
  readonly fromUser: string;
  readonly messageId: number;
}