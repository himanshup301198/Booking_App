export const formatTime = (date) => {
  if (!date) return '--';
  const d = new Date(date);
  return d.toLocaleString('en-IN', {
    hour:   '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};


export const formatDate = (date) => {
  if (!date) return '--';
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    day:   'numeric',
    month: 'short',
    year:  'numeric',
  });
};

/**
 * Format slot datetime to display string
 */
export const formatSlotDisplay = (slotTime) => {
  if (!slotTime) return '--';
  const d = new Date(slotTime);
  return `${formatDate(d)}, ${formatTime(d)}`;
};

/**
 * Format currency (Indian Rupees)
 */
export const formatCurrency = (amount) => {
  if (amount == null) return '₹0';
  return `₹${Number(amount).toLocaleString('en-IN')}`;
};

/**
 * Get workload label from active_bookings count
 */
export const getWorkloadLabel = (count) => {
  if (count === 0) return { label: 'Free',   color: '#10B981' };
  if (count <= 2)  return { label: 'Light',  color: '#3B82F6' };
  if (count <= 4)  return { label: 'Moderate', color: '#F59E0B' };
  return              { label: 'Busy',   color: '#EF4444' };
};