import React from 'react';
import { StyleSheet, ViewStyle, StyleProp, TouchableOpacity } from 'react-native';

interface ComponentProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
}

export default function Button({ children, style, onPress }: ComponentProps) {
  return <TouchableOpacity style={[styles.button, style]} 
  onPress={onPress}
  >
    {children}
  </TouchableOpacity>
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1.5,
    borderColor: '#1fecfc',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    margin: 8,
  }
});