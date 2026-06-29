import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { getAvailablePartners } from '../api/api';
import SlotCard from '../components/SlotCard';
import { colors, font, spacing, radius } from '../utils/theme';

const HomeScreen = ({ navigation }) => {
  const { user, setBooking } = useApp();

  const [partners,    setPartners]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [refreshing,  setRefreshing]  = useState(false);
  const [error,       setError]       = useState(null);

  const fetchPartners = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else  setLoading(true);
      setError(null);
      const data = await getAvailablePartners(user.city);
      setPartners(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load partners');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user.city]);

  useEffect(() => {
    fetchPartners();
  }, [fetchPartners]);

  const handleSelectPartner = (partner) => {
    setBooking((prev) => ({ ...prev, partner }));
    navigation.navigate('Booking');
  };

  // ── Loading state ──────────────────────────────────────────
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={styles.loadingText}>Finding partners near you…</Text>
      </View>
    );
  }

  // ── Header component ───────────────────────────────────────
  const ListHeader = () => (
    <View style={styles.header}>
      <View style={styles.greetingRow}>
        <View>
          <Text style={styles.greeting}>Hello, {user.name} 👋</Text>
          <Text style={styles.subtitle}>Book a service in your city</Text>
        </View>
        <View style={styles.cityPill}>
          <Text style={styles.cityPillText}>📍 {user.city}</Text>
        </View>
      </View>

      {error ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
        </View>
      ) : (
        <Text style={styles.sectionTitle}>
          {partners.length > 0
            ? `${partners.length} partner${partners.length > 1 ? 's' : ''} available`
            : 'No partners available right now'}
        </Text>
      )}
    </View>
  );

  // ── Empty state ────────────────────────────────────────────
  const ListEmpty = () => (
    <View style={styles.emptyBox}>
      <Text style={styles.emptyIcon}>🔍</Text>
      <Text style={styles.emptyTitle}>No partners available</Text>
      <Text style={styles.emptyDesc}>
        There are no available partners in {user.city} right now.{'\n'}
        Pull down to refresh.
      </Text>
    </View>
  );

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surfaceAlt} />

      <FlatList
        data={partners}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <SlotCard slot={item} onSelect={handleSelectPartner} />
        )}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchPartners(true)}
            tintColor={colors.accent}
            colors={[colors.accent]}
          />
        }
        showsVerticalScrollIndicator={false}
      />
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
    paddingTop:30,
    alignItems:      'center',
    justifyContent:  'center',
    backgroundColor: colors.surfaceAlt,
  },
  loadingText: {
    ...font.medium,
    fontSize:  14,
    color:     colors.textSecondary,
    marginTop: spacing.sm,
  },
  list: {
    paddingHorizontal: spacing.md,
    paddingBottom:     spacing.xl,
  },

  // Header
  header: {
    paddingTop: 50,
    paddingBottom: 50,
  },
  greetingRow: {
    flexDirection:  'row',
    alignItems:     'flex-start',
    justifyContent: 'space-between',
    marginBottom:   spacing.md,
  },
  greeting: {
    ...font.heavy,
    fontSize:  24,
    color:     colors.textPrimary,
  },
  subtitle: {
    ...font.regular,
    fontSize:  14,
    color:     colors.textSecondary,
    marginTop: 2,
  },
  cityPill: {
    backgroundColor:   colors.primary,
    paddingHorizontal: 12,
    paddingVertical:   6,
    borderRadius:      20,
  },
  cityPillText: {
    ...font.semibold,
    fontSize: 12,
    color:    colors.textInverse,
  },
  sectionTitle: {
    ...font.semibold,
    fontSize:     15,
    color:        colors.textSecondary,
    marginBottom: spacing.sm,
  },

  // Error banner
  errorBanner: {
    backgroundColor: colors.errorBg,
    borderRadius:    radius.md,
    padding:         spacing.md,
    marginBottom:    spacing.sm,
  },
  errorText: {
    ...font.medium,
    fontSize: 14,
    color:    colors.error,
  },

  // Empty
  emptyBox: {
    alignItems:   'center',
    paddingTop:   spacing.xxl,
    paddingBottom: spacing.xxl,
  },
  emptyIcon: {
    fontSize:     48,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...font.bold,
    fontSize:     18,
    color:        colors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptyDesc: {
    ...font.regular,
    fontSize:   14,
    color:      colors.textSecondary,
    textAlign:  'center',
    lineHeight: 22,
  },
});

export default HomeScreen;