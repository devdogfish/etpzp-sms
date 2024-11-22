"use client";
import { useTranslation } from "react-i18next"; // the client side function for translations from `react`

export default function Greeting() {
  const { t } = useTranslation();

  // in this case I used username variable interpolation, so pass that as well
  const username = "Luigi";
  return <div>{t("greeting", { username })}</div>;
}
