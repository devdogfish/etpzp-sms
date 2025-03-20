import { MessageState } from "./contexts/use-new-message";

export const PORTUGUESE_DATE_FORMAT = "dd/MM/yyyy HH:mm";

export const EMPTY_MESSAGE: MessageState = {
  sender: "ETPZP",
  subject: "",
  recipients: [],
  body: "",
  recipientInput: {
    recipientsExpanded: false,
    value: "",
    error: undefined,
    isHidden: false,
  },
  scheduledDate: new Date(),
  scheduledDateModified: false,
};
