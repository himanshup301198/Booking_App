import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { bookSlot } from '../api/api';
import Button from '../components/Button';
import Input from '../components/Input';
import { colors, font, spacing, radius, shadow } from '../utils/theme';
import { getWorkloadLabel } from '../utils/helpers';

// Quick-select time slots (today + tomorrow)
const generateQuickSlots = () => {
  const slots = [];
  const now   = new Date();
  // Start from next hour, generate 8 slots across 2 days
  for (let day = 0; day < 2; day++) {
    for (let hour = 9; hour <= 20; hour += 3) {
      const d = new Date(now);
      d.setDate(d.getDate() + day);
      d.setHours(hour, 0, 0, 0);
      if (d > now) {
        slots.push({
          label:    d.toLocaleString('en-IN', { weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: true }),
          value:    d.toISOString().slice(0, 19).replace('T', ' '),
          dayLabel: day === 0 ? 'Today' : 'Tomorrow',
        });
      }
    }
  }
  return slots.slice(0, 6);
};

const QUICK_SLOTS = generateQuickSlots();

const BookingScreen = ({ navigation }) => {
  const { user, booking, setBooking } = useApp();
  const partner = booking.partner;

  const [slotTime,      setSlotTime]      = useState('');
  const [selectedQuick, setSelectedQuick] = useState(null);
  const [loading,       setLoading]       = useState(false);
  const [slotError,     setSlotError]     = useState('');

  const workload = getWorkloadLabel(partner?.active_bookings ?? 0);

  const handleQuickSelect = (slot) => {
    setSelectedQuick(slot.value);
    setSlotTime(slot.value);
    setSlotError('');
  };

  const handleBooking = async () => {
    // Validate
    if (!slotTime.trim()) {
      setSlotError('Please select or enter a slot time');
      return;
    }
    const d = new Date(slotTime);
    if (isNaN(d.getTime())) {
      setSlotError('Invalid date format. Use YYYY-MM-DD HH:MM:SS');
      return;
    }
    if (d < new Date()) {
      setSlotError('Slot time must be in the future');
      return;
    }
    setSlotError('');

    try {
      setLoading(true);
      const res = await bookSlot(user.id, user.city, slotTime);
      setBooking((prev) => ({
        ...prev,
        bookingId: res.id,
        slotTime:  res.slot_time,
        amount:    500,
      }));
      navigation.navigate('Payment');
    } catch (err) {
      Alert.alert('Booking Failed', err.message, [{ text: 'OK' }]);
    } finally {
      setLoading(false);
    }
  };

  if (!partner) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errText}>No partner selected. Go back and try again.</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* ── Top bar ── */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Book a Slot</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Partner card ── */}
        <View style={styles.partnerCard}>
          <View style={styles.partnerAvatarWrap}>
            <Text style={styles.partnerAvatarText}>
              {partner.name?.charAt(0)?.toUpperCase()}
            </Text>
          </View>
          <View style={styles.partnerInfo}>
            <Text style={styles.partnerName}>{partner.name}</Text>
            <Text style={styles.partnerCity}>📍 {partner.city}</Text>
          </View>
          <View style={[styles.workloadBadge, { backgroundColor: workload.color + '22' }]}>
            <Text style={[styles.workloadText, { color: workload.color }]}>
              {workload.label}
            </Text>
          </View>
        </View>

        {/* ── Quick slots ── */}
        <Text style={styles.sectionLabel}>Quick Select</Text>
        <View style={styles.quickGrid}>
          {QUICK_SLOTS.map((slot) => (
            <TouchableOpacity
              key={slot.value}
              style={[
                styles.quickChip,
                selectedQuick === slot.value && styles.quickChipActive,
              ]}
              onPress={() => handleQuickSelect(slot)}
            >
              <Text style={[
                styles.quickChipDay,
                selectedQuick === slot.value && styles.quickChipDayActive,
              ]}>
                {slot.dayLabel}
              </Text>
              <Text style={[
                styles.quickChipTime,
                selectedQuick === slot.value && styles.quickChipTimeActive,
              ]}>
                {slot.label.split(',').pop()?.trim()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Manual input ── */}
        <Text style={styles.sectionLabel}>Or enter manually</Text>
        <Input
          label="Slot Date & Time"
          placeholder="YYYY-MM-DD HH:MM:SS"
          value={slotTime}
          onChangeText={(v) => { setSlotTime(v); setSelectedQuick(null); }}
          error={slotError}
          keyboardType="default"
        />

        {/* ── Selected info ── */}
        {slotTime ? (
          <View style={styles.selectedInfo}>
            <Text style={styles.selectedLabel}>Selected Slot</Text>
            <Text style={styles.selectedValue}>{slotTime}</Text>
          </View>
        ) : null}

        {/* ── CTA ── */}
        <Button
          title="Confirm Booking"
          onPress={handleBooking}
          loading={loading}
          size="lg"
          style={styles.ctaBtn}
        />

        <Text style={styles.disclaimer}>
          You can cancel before confirmation for a full refund.
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex:            1,
    
    backgroundColor: colors.surfaceAlt,
  },
  centered: {
    flex:            1,
    alignItems:      'center',
    justifyContent:  'center',
    padding:         spacing.lg,
    backgroundColor: colors.surfaceAlt,
  },
  errText: {
    ...font.medium,
    fontSize:  15,
    color:     colors.error,
    textAlign: 'center',
  },

  // Top bar
  topBar: {
    flexDirection:    'row',
    paddingTop:40,
    alignItems:       'center',
    justifyContent:   'space-between',
    backgroundColor:  colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical:  spacing.md,
  },
  backBtn: {
    width:           40,
    height:          40,
    alignItems:      'center',
    justifyContent:  'center',
    borderRadius:    20,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  backArrow: {
    ...font.bold,
    fontSize: 20,
    color:    colors.textInverse,
  },
  topBarTitle: {
    ...font.bold,
    fontSize: 18,
    color:    colors.textInverse,
  },

  scroll: {
    padding:       spacing.md,
    paddingBottom: spacing.xxl,
  },

  // Partner card
  partnerCard: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: colors.surface,
    borderRadius:    radius.lg,
    padding:         spacing.md,
    marginBottom:    spacing.lg,
    ...shadow.md,
  },
  partnerAvatarWrap: {
    width:           52,
    height:          52,
    borderRadius:    26,
    backgroundColor: colors.primary,
    alignItems:      'center',
    justifyContent:  'center',
    marginRight:     spacing.md,
  },
  partnerAvatarText: {
    ...font.heavy,
    fontSize: 22,
    color:    colors.textInverse,
  },
  partnerInfo: { flex: 1 },
  partnerName: {
    ...font.bold,
    fontSize: 17,
    color:    colors.textPrimary,
  },
  partnerCity: {
    ...font.regular,
    fontSize:  13,
    color:     colors.textSecondary,
    marginTop: 2,
  },
  workloadBadge: {
    paddingHorizontal: 10,
    paddingVertical:   5,
    borderRadius:      radius.full,
  },
  workloadText: {
    ...font.semibold,
    fontSize: 12,
  },

  // Section label
  sectionLabel: {
    ...font.semibold,
    fontSize:     13,
    color:        colors.textSecondary,
    marginBottom: spacing.sm,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  // Quick slots grid
  quickGrid: {
    flexDirection:  'row',
    flexWrap:       'wrap',
    gap:            spacing.sm,
    marginBottom:   spacing.lg,
  },
  quickChip: {
    width:            '30.5%',
    backgroundColor:  colors.surface,
    borderRadius:     radius.md,
    paddingVertical:  spacing.sm,
    paddingHorizontal: spacing.sm,
    alignItems:       'center',
    borderWidth:      1.5,
    borderColor:      colors.border,
    ...shadow.sm,
  },
  quickChipActive: {
    backgroundColor: colors.accent,
    borderColor:     colors.accent,
  },
  quickChipDay: {
    ...font.medium,
    fontSize: 11,
    color:    colors.textMuted,
  },
  quickChipDayActive: { color: 'rgba(255,255,255,0.8)' },
  quickChipTime: {
    ...font.semibold,
    fontSize:  13,
    color:     colors.textPrimary,
    marginTop: 2,
  },
  quickChipTimeActive: { color: colors.textInverse },

  // Selected info chip
  selectedInfo: {
    backgroundColor: colors.primary + '10',
    borderRadius:    radius.md,
    padding:         spacing.md,
    marginBottom:    spacing.lg,
    borderWidth:     1,
    borderColor:     colors.primary + '30',
  },
  selectedLabel: {
    ...font.medium,
    fontSize: 11,
    color:    colors.textSecondary,
    marginBottom: 2,
  },
  selectedValue: {
    ...font.semibold,
    fontSize: 14,
    color:    colors.primary,
  },

  ctaBtn: {
    marginTop:    spacing.sm,
    borderRadius: radius.lg,
  },
  disclaimer: {
    ...font.regular,
    fontSize:  12,
    color:     colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: 18,
  },
});

export default BookingScreen;