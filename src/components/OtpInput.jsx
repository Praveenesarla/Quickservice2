import React, { useRef, useEffect } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import responsive from '../utils/responsive';

const OTPInput = ({ otp, setOtp, length = 6, onComplete }) => {
  const inputsRef = useRef([]);

  useEffect(() => {
    if (otp.every(val => val === '')) {
      inputsRef.current[0]?.focus(); // Focus on first input when OTP resets
    }
  }, [otp]);

  const handleChangeText = (text, index) => {
    if (/^\d$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp([...newOtp]);

      if (index < length - 1) {
        inputsRef.current[index + 1]?.focus();
      }

      if (newOtp.join('').length === length && onComplete) {
        onComplete(newOtp.join(''));
      }
    }
  };

  const handleKeyPress = (event, index) => {
    if (event.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      {otp.map((value, index) => (
        <TextInput
          key={index}
          ref={(ref) => (inputsRef.current[index] = ref)}
          style={styles.input}
          keyboardType="numeric"
          maxLength={1}
          value={value}
          onChangeText={(text) => handleChangeText(text, index)}
          onKeyPress={(event) => handleKeyPress(event, index)}
          autoFocus={index === 0}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  input: {
    color: 'white',
    width: responsive.width(45),
    height: responsive.height(45),
    borderWidth: responsive.width(1),
    borderRadius: responsive.borderRadius(8),
    borderColor: '#ccc',
    textAlign: 'center',
    fontSize: responsive.fontSize(20),
    marginHorizontal: responsive.margin(5),
    backgroundColor: '#B8292980',
  },
});

export default OTPInput;
