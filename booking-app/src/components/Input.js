import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { colors, radius, font, spacing } from '../utils/theme';

const Input = ({
  value,
  onChangeText,
  placeholder,
  label,
  error,
  secureTextEntry = false,
  keyboardType    = 'default',
  autoCapitalize  = 'none',
  multiline       = false,
  numberOfLines   = 1,
  editable        = true,
  rightElement    = null,
  style,
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputWrap,
          focused && styles.focused,
          error   && styles.errored,
          !editable && styles.disabled,
        ]}
      >
        <TextInput
          style={[styles.input, multiline && styles.multiline]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={editable}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {rightElement && <View style={styles.right}>{rightElement}</View>}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...font.medium,
    fontSize:     13,
    color:        colors.textSecondary,
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  inputWrap: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: colors.surfaceAlt,
    borderWidth:     1.5,
    borderColor:     colors.border,
    borderRadius:    radius.md,
    paddingHorizontal: spacing.md,
  },
  input: {
    flex:        1,
    ...font.regular,
    fontSize:    15,
    color:       colors.textPrimary,
    paddingVertical: 14,
  },
  multiline: {
    height:     100,
    textAlignVertical: 'top',
  },
  focused: {
    borderColor:     colors.accent,
    backgroundColor: colors.surface,
  },
  errored: {
    borderColor:     colors.error,
    backgroundColor: colors.errorBg,
  },
  disabled: {
    opacity: 0.6,
  },
  right: {
    marginLeft: spacing.sm,
  },
  errorText: {
    ...font.regular,
    fontSize:   12,
    color:      colors.error,
    marginTop:  4,
  },
});

export default Input;