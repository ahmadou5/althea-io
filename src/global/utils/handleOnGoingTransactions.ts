import { Notification } from "@usedapp/core";
import { useEffect } from "react";
import { toastHandler } from "./toastHandler";
import { createTransactionDetails } from "global/stores/transactionUtils";

export const useOngoingTransactions = (
  notifications: Notification[],
  notifs: Notification[],
  setNotifs: (notifs: Notification[]) => void
) => {
  useEffect(() => {
    let currentNotifs = notifs;
    for (const notification of notifications) {
      if (
        notification.type == "transactionStarted" &&
        !currentNotifs.find((it) => it.id == notification.id)
      ) {
        currentNotifs.push({ ...notification });
      } else if (
        notification.type == "transactionSucceed" ||
        notification.type == "transactionFailed"
      ) {
        currentNotifs = currentNotifs.filter((localItem) => {
          return !(
            localItem.type == "transactionStarted" &&
            localItem.transaction.hash == notification.transaction.hash
          );
        });
      }
      setNotifs(currentNotifs);
    }

    notifications.map((noti, index) => {
      if (
        //@ts-ignore
        (noti?.transactionName?.includes("type") &&
          noti.type == "transactionSucceed") ||
        noti.type == "transactionFailed"
      ) {
        const isSuccesful = noti.type != "transactionFailed";
        //@ts-ignore
        const msg: Details = JSON.parse(noti?.transactionName);
        const actionMsg = createTransactionDetails(index.toString(), msg.type)
          .messages.long;
        const msged = `${isSuccesful ? "" : "un"}successfully ${actionMsg}`;
        toastHandler(msged, isSuccesful, noti.id);
      }
    });
  }, [notifications]);
};
