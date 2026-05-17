import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import NotificationComponents from "../components/NotificationComponents";

type NotificationContextType = {
  triggerNotification: (title: string, message: string) => void;
};

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notiData, setNotiData] = useState({ title: "", message: "" });

  const triggerNotification = useCallback((title: string, message: string) => {
    setNotiData({ 
        title: title,
        message: message,
    });
    setIsOpen(true);

    setTimeout(() => {
      setIsOpen(false);
    }, 5000);
  }, []);

  return (
    <NotificationContext.Provider value={{ triggerNotification }}>
      {children}

      {isOpen && (
        <NotificationComponents
          message={notiData.message}
          title={notiData.title}
          OnClose={() => setIsOpen(false)}
        />
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context)
    throw new Error(
      "useNotification must be used within a NotificationProvider",
    );
  return context;
};
