import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import responsive from '../utils/responsive';

const CustomInput = ({
  label,
  value,
  onChangeText,
  type = 'text',
  placeholder = '',
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.inputContainer,
          type === 'textarea' && styles.textAreaContainer,
        ]}>
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#2E141466"
          style={[styles.input, type === 'textarea' && styles.textArea]}
          multiline={type === 'textarea'}
          value={value}
          onChangeText={onChangeText}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '94%',
    marginBottom: responsive.margin(10),
  },
  label: {
    color: '#2E141466',
    fontSize: responsive.fontSize(14),
    marginBottom: responsive.margin(5),
  },
  inputContainer: {
    backgroundColor: '#B829291A',
    borderRadius: responsive.borderRadius(5),
    width: '100%',
    height: responsive.height(35),
  },
  textAreaContainer: {
    minHeight: responsive.height(70),
  },
  input: {
    width: '100%',
    padding: responsive.padding(10),
  },
  textArea: {
    textAlignVertical: 'top',
  },
});

export default CustomInput;
