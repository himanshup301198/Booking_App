import React, { useState } from 'react';
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
import apiClient from '../api/api';
import Button from '../components/Button';
import { colors, font, spacing, radius, shadow } from '../utils/theme';
import { formatSlotDisplay, formatCurrency } from '../utils/helpers';

const PaymentScreen = ({ navigation }) => {
  const { user, booking, setBooking } = useApp();
  const [loading,    setLoading]    = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const amount = booking.amount || 500;

  // Simulate payment webhook (in real app this comes from payment gateway)
  const handlePayment = async () => {
    try {
      setLoading(true);

      const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      await apiClient.post('/webhook/payment', {
        transaction_id: transactionId,
        booking_id:     booking.bookingId,
        amount,
        status:         'SUCCESS',
      });

      setBooking((prev) => ({ ...prev, transactionId }));
      navigation.navigate('Success');
    } catch (err) {
      Alert.alert('Payment Failed', err.message, [{ text: 'OK' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    Alert.alert(
      'Cancel Booking?',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'No', style: 'cancel' },
        {
          text:  'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              setCancelling(true);
              await apiClient.post('/cancel', { bookingId: booking.bookingId });
              Alert.alert(
                'Booking Cancelled',
                'Your booking has been cancelled successfully.',
                [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
              );
            } catch (err) {
              Alert.alert('Error', err.message);
            } finally {
              setCancelling(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* ── Top bar ── */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Payment</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Summary card ── */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Booking Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryKey}>Partner</Text>
            <Text style={styles.summaryVal}>{booking.partner?.name}</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.summaryKey}>City</Text>
            <Text style={styles.summaryVal}>{user.city}</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.summaryKey}>Slot Time</Text>
            <Text style={styles.summaryVal}>{formatSlotDisplay(booking.slotTime)}</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.summaryKey}>Booking ID</Text>
            <Text style={styles.summaryVal}>#{booking.bookingId}</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.summaryKey}>Status</Text>
            <View style={styles.pendingBadge}>
              <Text style={styles.pendingText}>PENDING</Text>
            </View>
          </View>
        </View>

        {/* ── Amount card ── */}
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Total Amount</Text>
          <Text style={styles.amountValue}>{formatCurrency(amount)}</Text>
          <Text style={styles.amountNote}>Inclusive of all charges</Text>
        </View>

        {/* ── Refund policy note ── */}
        <View style={styles.policyBox}>
          <Text style={styles.policyTitle}>💡 Cancellation Policy</Text>
          <Text style={styles.policyText}>
            • Cancel before confirmation → <Text style={{ color: colors.success, ...font.semibold }}>Full refund</Text>
            {'\n'}
            • Cancel after confirmation → <Text style={{ color: colors.warning, ...font.semibold }}>50% refund</Text>
          </Text>
        </View>

        {/* ── CTAs ── */}
        <Button
          title="Pay Now"
          onPress={handlePayment}
          loading={loading}
          size="lg"
          style={styles.payBtn}
        />

        <Button
          title="Cancel Booking"
          onPress={handleCancel}
          loading={cancelling}
          variant="outline"
          size="md"
          style={styles.cancelBtn}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex:            1,
    backgroundColor: colors.surfaceAlt,
  },

  // Top bar
  topBar: {
    flexDirection:     'row',
    paddingTop:40,
    alignItems:        'center',
    justifyContent:    'space-between',
    backgroundColor:   colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical:   spacing.md,
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

  // Summary card
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius:    radius.lg,
    padding:         spacing.md,
    marginBottom:    spacing.md,
    ...shadow.md,
  },
  summaryTitle: {
    ...font.bold,
    fontSize:     16,
    color:        colors.textPrimary,
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    paddingVertical: spacing.xs + 2,
  },
  summaryKey: {
    ...font.regular,
    fontSize: 14,
    color:    colors.textSecondary,
  },
  summaryVal: {
    ...font.semibold,
    fontSize: 14,
    color:    colors.textPrimary,
  },
  divider: {
    height:          1,
    backgroundColor: colors.border,
    marginVertical:  2,
  },
  pendingBadge: {
    backgroundColor: colors.warningBg,
    paddingHorizontal: 10,
    paddingVertical:   3,
    borderRadius:      radius.full,
  },
  pendingText: {
    ...font.semibold,
    fontSize: 11,
    color:    colors.warning,
  },

  // Amount card
  amountCard: {
    backgroundColor:  colors.primary,
    borderRadius:     radius.lg,
    padding:          spacing.lg,
    alignItems:       'center',
    marginBottom:     spacing.md,
    ...shadow.lg,
  },
  amountLabel: {
    ...font.medium,
    fontSize: 13,
    color:    'rgba(255,255,255,0.7)',
  },
  amountValue: {
    ...font.heavy,
    fontSize:  36,
    color:     colors.textInverse,
    marginVertical: spacing.xs,
  },
  amountNote: {
    ...font.regular,
    fontSize: 12,
    color:    'rgba(255,255,255,0.55)',
  },

  // Policy
  policyBox: {
    backgroundColor: colors.warningBg,
    borderRadius:    radius.md,
    padding:         spacing.md,
    marginBottom:    spacing.lg,
    borderWidth:     1,
    borderColor:     colors.warning + '40',
  },
  policyTitle: {
    ...font.semibold,
    fontSize:     14,
    color:        colors.textPrimary,
    marginBottom: spacing.xs,
  },
  policyText: {
    ...font.regular,
    fontSize:  13,
    color:     colors.textSecondary,
    lineHeight: 22,
  },

  payBtn: {
    borderRadius: radius.lg,
    marginBottom: spacing.sm,
  },
  cancelBtn: {
    borderRadius: radius.lg,
  },
});

export default PaymentScreen;