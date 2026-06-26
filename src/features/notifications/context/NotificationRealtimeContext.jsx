import { createContext, useContext } from "react";

const NotificationRealtimeContext = createContext({ socketConnected: false });

export const NotificationRealtimeProvider = ({ socketConnected, children }) => (
  <NotificationRealtimeContext.Provider value={{ socketConnected }}>
    {children}
  </NotificationRealtimeContext.Provider>
);

export const useNotificationRealtime = () => useContext(NotificationRealtimeContext);
