import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import responsive from '../utils/responsive';
import {useUser} from '../context/UserContext';
import {OtpInput} from 'react-native-otp-entry';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import auth, {signInWithCustomToken} from '@react-native-firebase/auth';

import {getCustomToken, sendOtp, verifyOtp} from '../api';

const LoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const navigation = useNavigation();
  const [otpFlow, setOtpFlow] = useState('Send Otp');
  const {setUser} = useUser();
  const [otpData, setOtpData] = useState();

  const sendingOtp = async () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      console.log('Enter a valid 10-digit phone number.');
      return;
    }
    try {
      const response = await sendOtp(phoneNumber);
      console.log('OTP Sent Successfully:', response);
      Toast.show({
        type: 'success',
        text1: 'OTP Sent Successfully',
        position: 'top',
        visibilityTime: 4000,
        autoHide: true,
      });
      setOtpFlow('Verify Otp');
      setOtpData(response);
    } catch (error) {
      console.log(
        'Failed to send OTP:',
        error?.response?.data?.error || error.message,
      );
      Toast.show({
        type: 'error',
        text1: error?.response?.data?.error || error.message,
        text2: 'Please Register & Try Again!',
        position: 'top',
        visibilityTime: 4000,
        autoHide: true,
      });
    }
  };

  const verifyingOtp = async () => {
    try {
      console.log('Verifying OTP with orderId:', otpData?.data?.orderId);
      const response = await verifyOtp(
        phoneNumber,
        otpData?.data?.orderId,
        otp,
      );
      console.log('OTP Verified:', response);

      // Call getCustomToken after OTP verification
      gettingCustomToken();
    } catch (error) {
      console.log('Verify OTP error:', error?.response?.data || error.message);
    }
  };

  const gettingCustomToken = async () => {
    try {
      const response = await getCustomToken(phoneNumber);
      console.log('custom token', response);
      signInWithToken(response.data.token);
    } catch (error) {
      console.log(error);
    }
  };

  const getData = async key => {
    try {
      const value = await AsyncStorage.getItem('auth');
      console.log('Retrieved data for key auth ":', value);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  };

  async function signInWithToken(customToken) {
    try {
      const userCredential = await auth().signInWithCustomToken(customToken);
      console.log('User signed in:', userCredential.user);

      await AsyncStorage.setItem('auth', JSON.stringify(userCredential.user));
      console.log('User data stored in AsyncStorage');

      setUser(userCredential.user);

      navigation.reset({
        index: 0,
        routes: [{name: 'MainTabs'}],
      });
    } catch (error) {
      console.error('Authentication error:', error);
    }
  }

  return (
    <ImageBackground
      source={require('../assets/login.png')}
      resizeMode="cover"
      style={styles.container}>
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Login</Text>

      {/* Phone Number Input */}
      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Your Phone Number"
        placeholderTextColor="grey"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        maxLength={10}
      />

      {otpFlow === 'Verify Otp' && (
        <>
          <Text style={styles.label}>OTP</Text>
          <OtpInput
            numberOfDigits={6}
            onTextChange={text => setOtp(text)}
            theme={{pinCodeContainerStyle: styles.pinCodeContainerStyle}}
          />
        </>
      )}

      {/* Login Button */}

      <TouchableOpacity
        style={styles.loginButton}
        onPress={
          otpFlow === 'Send Otp'
            ? sendingOtp
            : otpFlow === 'Verify Otp'
            ? verifyingOtp
            : otpFlow === 'Login'
            ? gettingCustomToken
            : undefined
        }>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      {/* Signup Navigation */}
      <View style={styles.signupContainer}>
        <Text
          style={{
            fontFamily: 'Outfit-Light',
            fontSize: responsive.fontSize(12),
            color: '#000000',
          }}>
          Don’t have an account?
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.signupText}> Sign Up</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 0,
  },
  logo: {
    width: '50%',
    height: 140,
  },
  title: {
    fontSize: responsive.fontSize(34),
    width: '100%',
    fontFamily: 'Outfit-Bold',
    color: '#000',
    marginBottom: responsive.margin(20),
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: responsive.fontSize(16),
    fontFamily: 'Outfit-SemiBold',
    color: '#B82929',
    marginBottom: responsive.margin(6),
  },
  input: {
    width: '100%',
    height: responsive.height(40),
    borderRadius: responsive.borderRadius(10),
    borderColor: '#B82929',
    paddingLeft: responsive.padding(15),
    fontSize: responsive.fontSize(14),
    marginBottom: responsive.margin(15),
    color: '#000',
    backgroundColor: '#B8292929',
  },
  loginButton: {
    backgroundColor: '#B82929',
    width: '90%',
    padding: responsive.padding(8),
    borderRadius: responsive.borderRadius(10),
    marginTop: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    marginTop: 7,
  },
  signupText: {
    color: '#B82929',
    fontFamily: 'Outfit-Bold',
    fontSize: responsive.fontSize(12),
  },
  pinCodeContainerStyle: {
    backgroundColor: '#B8292929',
    width: responsive.width(45),
    height: responsive.height(45),
  },
});
