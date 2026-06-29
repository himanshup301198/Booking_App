import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { colors, radius, font } from '../utils/theme';

const Button = ({
  title,
  onPress,
  loading    = false,
  disabled   = false,
  variant    = 'primary',  // primary | outline | ghost | danger
  size       = 'md',       // sm | md | lg
  icon       = null,
  style,
}) => {
  const isDisabled = disabled || loading;

  const containerStyle = [
    styles.base,
    styles[`variant_${variant}`],
    styles[`size_${size}`],
    isDisabled && styles.disabled,
    style,
  ];

  const textStyle = [
    styles.text,
    styles[`text_${variant}`],
    styles[`textSize_${size}`],
  ];

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' || variant === 'danger' ? colors.textInverse : colors.primary}
          size="small"
        />
      ) : (
        <View style={styles.content}>
          {icon && <View style={styles.iconWrap}>{icon}</View>}
          <Text style={textStyle}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius:   radius.md,
    alignItems:     'center',
    justifyContent: 'center',
    flexDirection:  'row',
  },
  content: {
    flexDirection:  'row',
    alignItems:     'center',
  },
  iconWrap: {
    marginRight: 8,
  },

  // Variants
  variant_primary: {
    backgroundColor: colors.accent,
  },
  variant_outline: {
    backgroundColor: 'transparent',
    borderWidth:     1.5,
    borderColor:     colors.accent,
  },
  variant_ghost: {
    backgroundColor: 'transparent',
  },
  variant_danger: {
    backgroundColor: colors.error,
  },

  // Sizes
  size_sm: { paddingHorizontal: 16, paddingVertical: 10, minHeight: 40 },
  size_md: { paddingHorizontal: 24, paddingVertical: 14, minHeight: 50 },
  size_lg: { paddingHorizontal: 32, paddingVertical: 18, minHeight: 58 },

  // Text styles
  text: {
    ...font.semibold,
    letterSpacing: 0.3,
  },
  text_primary: { color: colors.textInverse },
  text_outline:  { color: colors.accent },
  text_ghost:    { color: colors.accent },
  text_danger:   { color: colors.textInverse },

  textSize_sm: { fontSize: 13 },
  textSize_md: { fontSize: 15 },
  textSize_lg: { fontSize: 17 },

  disabled: { opacity: 0.5 },
});

export default Button;