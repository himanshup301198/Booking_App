import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Animated,
} from 'react-native';
import { useApp } from '../context/AppContext';
import Button from '../components/Button';
import { colors, font, spacing, radius, shadow } from '../utils/theme';
import { formatSlotDisplay, formatCurrency } from '../utils/helpers';

const SuccessScreen = ({ navigation }) => {
  const { booking, resetBooking } = useApp();

  // Scale-in animation for the checkmark
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue:        1,
        tension:        60,
        friction:       5,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue:         1,
        duration:        400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, fadeAnim]);

  const handleGoHome = () => {
    resetBooking();
    navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <View style={styles.container}>
        {/* ── Animated check icon ── */}
        <Animated.View style={[styles.iconWrap, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.checkIcon}>✓</Text>
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
          <Text style={styles.headline}>Booking Confirmed!</Text>
          <Text style={styles.subline}>
            Your slot has been successfully booked.
          </Text>
        </Animated.View>

        {/* ── Booking detail card ── */}
        <Animated.View style={[styles.detailCard, { opacity: fadeAnim }]}>
          <Row label="Partner"    value={booking.partner?.name    || '--'} />
          <Row label="Slot Time"  value={formatSlotDisplay(booking.slotTime)} />
          <Row label="Amount"     value={formatCurrency(booking.amount)}  />
          <Row label="Booking ID" value={`#${booking.bookingId || '--'}`} isLast />
        </Animated.View>

        <Animated.View style={[styles.ctaWrap, { opacity: fadeAnim }]}>
          <Button
            title="Back to Home"
            onPress={handleGoHome}
            size="lg"
            style={styles.homeBtn}
          />
        </Animated.View>
      </View>
    </View>
  );
};

const Row = ({ label, value, isLast }) => (
  <>
    <View style={rowStyles.row}>
      <Text style={rowStyles.label}>{label}</Text>
      <Text style={rowStyles.value}>{value}</Text>
    </View>
    {!isLast && <View style={rowStyles.divider} />}
  </>
);

const rowStyles = StyleSheet.create({
  row: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    paddingVertical: spacing.xs + 2,
  },
  label: {
    ...font.regular,
    fontSize: 14,
    color:    colors.textSecondary,
  },
  value: {
    ...font.semibold,
    fontSize: 14,
    color:    colors.textPrimary,
  },
  divider: {
    height:          1,
    backgroundColor: colors.border,
    marginVertical:  2,
  },
});

const styles = StyleSheet.create({
  screen: {
    flex:            1,
    backgroundColor: colors.surfaceAlt,
  },
  container: {
    flex:            1,
    alignItems:      'center',
    justifyContent:  'center',
    paddingHorizontal: spacing.lg,
  },

  // Check icon
  iconWrap: {
    width:           90,
    height:          90,
    borderRadius:    45,
    backgroundColor: colors.success,
    alignItems:      'center',
    justifyContent:  'center',
    marginBottom:    spacing.lg,
    ...shadow.lg,
  },
  checkIcon: {
    fontSize: 44,
    color:    colors.textInverse,
    lineHeight: 50,
  },

  headline: {
    ...font.heavy,
    fontSize:     26,
    color:        colors.textPrimary,
    marginBottom: spacing.xs,
    textAlign:    'center',
  },
  subline: {
    ...font.regular,
    fontSize:     15,
    color:        colors.textSecondary,
    textAlign:    'center',
    marginBottom: spacing.lg,
  },

  // Detail card
  detailCard: {
    backgroundColor: colors.surface,
    borderRadius:    radius.lg,
    padding:         spacing.md,
    width:           '100%',
    marginBottom:    spacing.xl,
    ...shadow.md,
  },

  ctaWrap: {
    width: '100%',
  },
  homeBtn: {
    borderRadius: radius.lg,
  },
});

export default SuccessScreen;