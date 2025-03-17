import React, { JSX } from "react";
import {
  Clock1,
  Clock2,
  Clock3,
  Clock4,
  Clock5,
  Clock6,
  Clock7,
  Clock8,
  Clock9,
  Clock10,
  Clock11,
  Clock12,
} from "lucide-react";

function ClockIcon({ hour }: { hour: number }) {
  // Ensure the hour is between 1 and 12
  const validHour = Math.max(1, Math.min(12, hour));
  // console.log("Chose", validHour, "clock icon");

  // Map the hour to the corresponding icon
  const icons: { [key: number]: JSX.Element } = {
    1: <Clock1 />,
    2: <Clock2 />,
    3: <Clock3 />,
    4: <Clock4 />,
    5: <Clock5 />,
    6: <Clock6 />,
    7: <Clock7 />,
    8: <Clock8 />,
    9: <Clock9 />,
    10: <Clock10 />,
    11: <Clock11 />,
    12: <Clock12 />,
  };

  return <div className="flex-centered h-4 w-4">{icons[validHour]}</div>;
}

export default ClockIcon;
