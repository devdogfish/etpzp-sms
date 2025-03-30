import { MessageState } from "./contexts/use-new-message";

export const PT_DATE_FORMAT = "dd/MM/yyyy HH:mm";
export const PT_DATE_FORMAT_NO_TIME = "dd/MM/yyyy";
export const ISO8601_DATE_FORMAT = "yyyy-MM-dd";
export const DEFAULT_START_DATE = "2025-01-01";

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
  scheduledDateConfirmed: false,
};
