import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const RadioButton = ({ label, isSelected, onPress }) => (
  <TouchableOpacity style={styles.radioButtonContainer} onPress={onPress}>
    <View style={[styles.radioButton, isSelected && styles.selectedRadioButton]}>
      {isSelected && <View style={styles.innerCircle} />}
    </View>
    <Text style={styles.radioButtonLabel}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioButton: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  selectedRadioButton: {
    borderColor: '#007BFF',
  },
  innerCircle: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#007BFF',
  },
  radioButtonLabel: {
    fontSize: 16,
  },
});

export default RadioButton;
