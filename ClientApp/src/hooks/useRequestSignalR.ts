import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import * as signalR from "@microsoft/signalr";
import { useNotification } from "../context/NotificationContext";
import type { MessageDto } from "../types";
import { useAuth } from "./useAuth";

export const useRequestSignalR = () => {
  const queryClient = useQueryClient();
  const { triggerNotification } = useNotification();
  const {authToken, loading} = useAuth();

  
  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5143/requestHub", {
        withCredentials: true,
        accessTokenFactory: () => {
          const rowData = localStorage.getItem("authToken");
          if (!rowData) return "";

          try {
            const parsedData = JSON.parse(rowData);
            return parsedData?.accessToken || "";
          } catch (err) {
            console.error("Error parsing authToken from localStorage:", err);
            return "";
          }
        },
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000])
      .configureLogging(signalR.LogLevel.Information)
      .build();

    const startConnection = async () => {
      try {

        // New Request Add
        if(loading) return;
        if(authToken?.role === "Admin") {
           connection.on("ReceiveNewOrderNotification", () => {
          console.log("SignalR: New request received. Invalidating cache...");
          queryClient.invalidateQueries({ queryKey: ["requests"] });
          triggerNotification(
            "New Maintenance Request!",
            "A new request has been submitted live.",
          );
        });

        }
        // Assign Task For Employee
        connection.on("ReceiveAssignedTask", (data: MessageDto) => {
          queryClient.invalidateQueries({ queryKey: ["requests"] });
          triggerNotification(data.title, data.message);
        });

        // Update Request Status
        connection.on("ReceiveRequestStatusUpdate", (data: MessageDto) => {
          queryClient.invalidateQueries({ queryKey: ["requests"] });
          triggerNotification(data.title, data.message);
        });

        await connection.start();
        console.log("Global SignalR Connected!");
      } catch (err) {
        console.error("Error stopping connection: ", err);
      }
    };

    startConnection();

    // Unmount
    return () => {
      if (connection) {
        connection.off("ReceiveNewOrderNotification");
        connection
          .stop()
          .then(() => console.log("SignalR Connection stopped safely."))
          .catch((err) => console.error("Error stopping connection: ", err));
      }
    };
  }, [queryClient, triggerNotification]);
};
