import React, { createContext, useContext, useState } from 'react';

export const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // Simulated logged-in user (replace with real auth later)
  const [user] = useState({
    id:   1,
    name: 'Himanshu',
    city: 'Delhi',
  });

  // Booking flow state shared across screens
  const [booking, setBooking] = useState({
    partner:   null,    // selected partner object
    bookingId: null,    // returned from /book API
    slotTime:  null,    // selected slot time
    amount:    null,    // payment amount
  });

  const resetBooking = () =>
    setBooking({ partner: null, bookingId: null, slotTime: null, amount: null });

  return (
    <AppContext.Provider value={{ user, booking, setBooking, resetBooking }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for clean access
export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};