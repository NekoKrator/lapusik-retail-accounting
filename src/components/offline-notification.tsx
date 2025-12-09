"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useOnlineStatus } from "@/hooks/use-online-status";

const OFFLINE_TOAST_ID = "offline-status";

export function OnlineStatusToaster() {
  const isOnline = useOnlineStatus();

  const prevIsOnlineRef = useRef(isOnline);

  useEffect(() => {
    if (!isOnline && prevIsOnlineRef.current !== isOnline) {
      toast.error("З’єднання втрачено", {
        id: OFFLINE_TOAST_ID,
        duration: Number.POSITIVE_INFINITY,
        description:
          "Перевірте мережу. Функції, що вимагають інтернет, можуть бути недоступні.",
        position: "top-center",
      });
    } else if (isOnline && prevIsOnlineRef.current !== isOnline) {
      toast.dismiss(OFFLINE_TOAST_ID);

      toast.success("З’єднання відновлено", {
        duration: 3000,
        position: "top-center",
      });
    }

    prevIsOnlineRef.current = isOnline;
  }, [isOnline]);

  return null;
}
