"use client";

import type React from "react";
import {
  createContext,
  useState,
  useContext,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { toast } from "sonner";
import type { Message } from "@/types";
import type { DBContact } from "@/types/contact";
import type {
  DBRecipient,
  NewRecipient,
  RankedRecipient,
  WithContact,
} from "@/types/recipient";
import {
  convertToRecipient,
  getUniques,
  matchContactsToRecipients,
  validatePhoneNumber,
} from "@/lib/utils";
import { useContacts } from "./use-contacts";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { MessageSchema } from "@/lib/form.schemas";
import InsertContactModal from "@/components/modals/insert-contact";
import CreateContactModal from "@/components/modals/create-contact";
import RecipientInfoModal from "@/components/modals/recipient-info";
import { EMPTY_MESSAGE } from "@/global.config";
import ScheduleMessageModal, {
  ScheduleAlertModal,
} from "@/components/modals/schedule-message";

// This is our biggest state where we store all data related to the active message, that should be persisted during draft saving re-renders
// MessageState is only used here & for EMPTY_MESSAGE
export type MessageState = Message & {
  // This is only for the front end composing of the message and will not be used on the server
  recipientInput: {
    value: string;
    error?: string;
    isHidden: boolean;
    recipientsExpanded: boolean;
  };
  serverStateErrors?: { [K in keyof z.infer<typeof MessageSchema>]?: string[] };
  invalidRecipients?: NewRecipient[];

  scheduledDate: Date;
  scheduledDateModified: boolean;
};

type MessageContextValues = {
  // Message state
  message: MessageState;
  setMessage: React.Dispatch<React.SetStateAction<MessageState>>;

  // Recipient management
  recipients: NewRecipient[];
  addRecipient: (phone: string) => void;
  removeRecipient: (
    recipient: NewRecipient,
    replaceWithRecipient?: NewRecipient
  ) => void;

  // Recipient search and suggestions
  searchRecipients: (searchTerm: string) => void;
  suggestedRecipients: WithContact[];

  // UI state
  showInfoAbout: React.Dispatch<React.SetStateAction<NewRecipient | null>>;
  selectedPhone: string | null;
  updateSelectedPhone: (direction: "ArrowDown" | "ArrowUp") => void;

  revalidateRecipients: () => void;
  focusedInput: string | null;
  setFocusedInput: React.Dispatch<React.SetStateAction<string | null>>;

  // DEBUG / CONTINUE_HERE
  form: HTMLFormElement | null;
  setForm: React.Dispatch<React.SetStateAction<HTMLFormElement | null>>;
};
type ContextProps = {
  children: React.ReactNode;
  rankedRecipients: RankedRecipient[];
  initialMessage?: MessageState;
};

const NewMessageContext = createContext<MessageContextValues | null>(null);

export function NewMessageProvider({
  children,
  rankedRecipients,
  initialMessage,
}: ContextProps) {
  // Message state
  const [message, setMessage] = useState<MessageState>(
    initialMessage || EMPTY_MESSAGE
  );
  const { contacts } = useContacts();
  const { t } = useTranslation(["new-message-page"]);

  // Associate contacts with matching phone numbers  to recipients
  const initialRecipients: WithContact[] =
    matchContactsToRecipients(rankedRecipients, contacts) || [];

  // UI state
  const [moreInfoOn, showInfoAbout] = useState<NewRecipient | null>(null);
  const [selectedPhone, setSelectedPhone] = useState<string | null>(null);
  const [suggestedRecipients, setSuggestedRecipients] =
    useState(initialRecipients);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [form, setForm] = useState<HTMLFormElement | null>(null);

  // Memoized values
  const recommendedRecipients: WithContact[] = useMemo(() => {
    // adjust this to your liking
    const AMOUNT = 10;
    const topRecipients = initialRecipients.slice(0, AMOUNT);

    if (topRecipients.length === AMOUNT) {
      // Check if there are enough topRecipients
      return topRecipients;
    } else {
      // If not look for unused contacts to fill the gap
      const extraContacts: WithContact[] = contacts
        // 1. Filter out the ones that already exist in the top recipients
        .filter(
          (contact) => !topRecipients.some((top) => top.phone === contact.phone)
        )
        // 2. Get only the extra ones we need to fill the gap
        .slice(0, AMOUNT - topRecipients.length)
        // 3. Adjust the contacts to match the other recipients in the array
        .map(({ id, phone, name, description }) => ({
          id,
          phone,
          contact: {
            id,
            name,
            phone,
            description,
          },
        }));

      return [...topRecipients, ...extraContacts] as WithContact[];
    }
  }, [contacts]);

  // Helper functions
  const revalidateRecipients = () => {
    setMessage((prevMessage) => ({
      // For some reason this inner part gets run twice while the outer function only gets run once
      ...prevMessage,
      recipients: prevMessage.recipients.map((recipient, index) => {
        const foundContact = contacts.find(
          (contact) => contact.phone === recipient.phone
        );

        if (foundContact) {
          return { ...recipient, contact: foundContact };
        } else return recipient;
      }),
    }));
  };

  const DEFAULT_SELECTED_PHONE_INDEX = null;
  // Recipient management functions
  const addRecipient = (phone: string) => {
    console.log("Trying to add new phone: ", phone);

    if (message.recipients.some((item) => item.phone === phone)) {
      // I know this is not on the server, but I wanted to keep the same format
      return toast.error(t("server-duplicate_recipients_error"), {
        description: t("server-duplicate_recipients_error_caption"),
      });
    }

    setMessage((prev) => {
      const validatedRecipient = validatePhoneNumber(phone);
      const foundContact = contacts.find((contact) => contact.phone === phone);
      return {
        ...prev,
        recipients: [
          ...prev.recipients,
          // In case `recipientWithContact` has some old fields
          {
            ...validatedRecipient,
            contact: foundContact
              ? convertToRecipient(foundContact).contact
              : undefined,
          },
        ],
      };
    });

    // Update selectedPhone to the next available recipient
    setSelectedPhone((prevSelected) => {
      if (prevSelected === phone) {
        const nextRecipient = suggestedRecipients.find(
          (r) => r.phone !== phone
        );
        return nextRecipient ? nextRecipient.phone : null;
      }
      return prevSelected;
    });
    // Reset the input and search:
    setMessage((m) => ({
      ...m,
      recipientInput: { ...m.recipientInput, value: "" },
      recipients: m.recipients.map((r) => ({
        ...r,
        proneForDeletion: false,
      })),
    }));
  };

  const removeRecipient = useCallback(
    (recipient: NewRecipient, replaceWithRecipient?: NewRecipient) => {
      setMessage((prev) => ({
        ...prev,
        // recipientInput: { ...prev.recipientInput, value: "" },
        recipients: prev.recipients
          .map((r) => (r === recipient ? replaceWithRecipient : r))
          .filter((r) => r !== undefined), // Filter out undefined values
      }));
    },
    []
  );

  // Search and suggestion functions
  const searchRecipients = (rawSearchTerm: string) => {
    const searchTerm = rawSearchTerm.trim().toLowerCase();
    if (!suggestedRecipients.length && !recommendedRecipients.length) {
      // Searched suggested- and recommended recipients are empty -
      // All recipients from the suggested list have already been added!
      return setSelectedPhone(null);
    }

    // There are still suggested recipients that haven't been added yet, so do additional checks
    if (searchTerm.length) {
      const filteredRecipients = getUniques(
        message.recipients,
        initialRecipients.filter(
          (recipient) =>
            (recipient.contact?.name?.toLowerCase().includes(searchTerm) ||
              recipient.phone.toLowerCase().includes(searchTerm)) &&
            !message.recipients.some((r) => r.phone === recipient.phone)
        )
      );
      setSuggestedRecipients(filteredRecipients);

      if (!filteredRecipients.length) {
        // No recipients found (the suggested panel will be hidden) - deselect the previous phone
        setSelectedPhone(null);
      } else {
        setSelectedPhone(
          DEFAULT_SELECTED_PHONE_INDEX
            ? filteredRecipients[DEFAULT_SELECTED_PHONE_INDEX]?.phone
            : DEFAULT_SELECTED_PHONE_INDEX
        );
      }
    } else {
      setSuggestedRecipients(
        getUniques(message.recipients, recommendedRecipients)
      );
      setSelectedPhone(
        DEFAULT_SELECTED_PHONE_INDEX
          ? recommendedRecipients[DEFAULT_SELECTED_PHONE_INDEX]?.phone
          : DEFAULT_SELECTED_PHONE_INDEX
      );
    }
  };

  // UI update functions
  const updateSelectedPhone = useCallback(
    (input: "ArrowDown" | "ArrowUp") => {
      setSelectedPhone((prevPhone) => {
        const currentIndex = suggestedRecipients.findIndex(
          (item) => item.phone === prevPhone
        );
        const length = suggestedRecipients.length;
        const newIndex =
          input === "ArrowUp"
            ? (currentIndex - 1 + length) % length
            : (currentIndex + 1) % length;
        return suggestedRecipients[newIndex]?.phone;
      });
    },
    [suggestedRecipients]
  );

  useEffect(() => {
    // Revalidate recipients when contacts get re-fetched
    revalidateRecipients();
    console.log(suggestedRecipients);
  }, [contacts]);

  useEffect(() => {
    if (!!initialMessage === false) {
      // If initialMessage is undefined, reset all the controlled inputs to an empty value
      setMessage(EMPTY_MESSAGE);
    }
  }, [initialMessage]);

  // When recipients change do this:
  useEffect(() => {
    // If we still freshly have the invalid recipients error
    if (message.invalidRecipients) {
      const validRecipientExists = !!message.recipients.find(
        (r) => r.isValid === true
      );
      if (validRecipientExists) {
        // If the new recipient is valid, we clear the error, allowing error pulsing for more invalid recipients.
        setMessage((prev) => ({ ...prev, invalidRecipients: undefined }));
      }
    }

    // Note: Works only correctly here; won't update correctly with add/remove operations.
    searchRecipients(message.recipientInput.value);
  }, [message.recipients]);
  return (
    <NewMessageContext.Provider
      value={{
        message,
        setMessage,
        recipients: message.recipients,
        addRecipient,
        removeRecipient,
        suggestedRecipients,
        searchRecipients,

        showInfoAbout,
        selectedPhone,
        updateSelectedPhone,
        revalidateRecipients,
        focusedInput,
        setFocusedInput,

        form,
        setForm,
      }}
    >
      {/* We move modals here, because unlike the form component, this doesn't re-render when a draft gets saved */}
      <InsertContactModal />
      <ScheduleMessageModal />
      <ScheduleAlertModal />
      {/* This should always be defined as we pass a defaultPhone and may create a contact from scratch. */}
      <CreateContactModal
        defaultPhone={moreInfoOn?.phone}
        onCreateSuccess={(contact) => {
          // After creating the new contact, replace the old recipient
          const oldRecipient = message.recipients.find(
            (r) => r.phone == moreInfoOn?.phone
          );
          if (oldRecipient) {
            removeRecipient(oldRecipient, convertToRecipient(contact));
          }
        }}
      />

      {moreInfoOn && (
        <RecipientInfoModal recipient={moreInfoOn} allowContactCreation />
      )}
      {children}
    </NewMessageContext.Provider>
  );
}

export function useNewMessage() {
  const context = useContext(NewMessageContext);
  if (!context) {
    throw new Error("useNewMessage must be used within a NewMessageProvider");
  }
  return context;
}
