import { notification } from "antd";
import { useEffect } from "react";

export function useBrowserNotification() {
  const isChrome = navigator.userAgent.indexOf("Chrome") >= 0;
  useEffect(() => {
    if (!isChrome) {
      notification.warn({
        message: "YurekAI builder is doing the magic! 🪄 Please be patient…",
        // Don't close automatically
        duration: 0,
      });
    }
  }, [isChrome]);
}
