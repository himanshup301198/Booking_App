import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, radius, spacing, font, shadow } from '../utils/theme';
import { getWorkloadLabel } from '../utils/helpers';

const SlotCard = ({ slot, onSelect }) => {
  const workload = getWorkloadLabel(slot.active_bookings);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onSelect(slot)}
      activeOpacity={0.85}
    >
      {/* Left accent bar */}
      <View style={[styles.accentBar, { backgroundColor: workload.color }]} />

      <View style={styles.content}>
        {/* Top row: name + workload badge */}
        <View style={styles.row}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {slot.name?.charAt(0)?.toUpperCase() || '?'}
            </Text>
          </View>

          <View style={styles.info}>
            <Text style={styles.name}>{slot.name}</Text>
            <Text style={styles.city}>📍 {slot.city}</Text>
          </View>

          <View style={[styles.badge, { backgroundColor: workload.color + '20' }]}>
            <View style={[styles.dot, { backgroundColor: workload.color }]} />
            <Text style={[styles.badgeText, { color: workload.color }]}>
              {workload.label}
            </Text>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Bottom row: active bookings + CTA */}
        <View style={styles.footer}>
          <Text style={styles.meta}>
            Active jobs:{' '}
            <Text style={styles.metaVal}>{slot.active_bookings}</Text>
          </Text>
          <View style={styles.selectBtn}>
            <Text style={styles.selectBtnText}>Select →</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection:   'row',
    backgroundColor: colors.surface,
    borderRadius:    radius.lg,
    marginBottom:    spacing.md,
    overflow:        'hidden',
    ...shadow.md,
  },
  accentBar: {
    width:        4,
    borderRadius: 0,
  },
  content: {
    flex:    1,
    padding: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems:    'center',
  },
  avatar: {
    width:           44,
    height:          44,
    borderRadius:    22,
    backgroundColor: colors.primary,
    alignItems:      'center',
    justifyContent:  'center',
    marginRight:     spacing.sm,
  },
  avatarText: {
    ...font.bold,
    fontSize: 18,
    color:    colors.textInverse,
  },
  info: {
    flex: 1,
  },
  name: {
    ...font.semibold,
    fontSize: 16,
    color:    colors.textPrimary,
  },
  city: {
    ...font.regular,
    fontSize:  13,
    color:     colors.textSecondary,
    marginTop: 2,
  },
  badge: {
    flexDirection:  'row',
    alignItems:     'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius:   radius.full,
  },
  dot: {
    width:        6,
    height:       6,
    borderRadius: 3,
    marginRight:  5,
  },
  badgeText: {
    ...font.semibold,
    fontSize: 12,
  },
  divider: {
    height:           1,
    backgroundColor:  colors.border,
    marginVertical:   spacing.sm,
  },
  footer: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
  },
  meta: {
    ...font.regular,
    fontSize: 13,
    color:    colors.textSecondary,
  },
  metaVal: {
    ...font.semibold,
    color: colors.textPrimary,
  },
  selectBtn: {
    backgroundColor:   colors.accent,
    paddingHorizontal: 14,
    paddingVertical:   6,
    borderRadius:      radius.full,
  },
  selectBtnText: {
    ...font.semibold,
    fontSize: 13,
    color:    colors.textInverse,
  },
});

export default SlotCard;