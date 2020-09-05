export interface ReceiptItem {
  userId: string
  receiptId: string
  createdAt: string
  name: string
  amount: number
  attachmentUrl?: string
}
