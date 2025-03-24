/* eslint-disable quotes */
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
import auth from '@react-native-firebase/auth';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import responsive from '../utils/responsive';
import {OtpInput} from 'react-native-otp-entry';
import {getRegisterCustomToken, sendRegisterOtp, verifyOtp} from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser} from '../context/UserContext';

const SignupScreen = () => {
  const [name, setName] = useState('');
  const [otpData, setOtpData] = useState();
  const {setUser} = useUser();
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [address, setAddress] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [otpFlow, setOtpFlow] = useState('Send Otp');
  const [otp, setOtp] = useState('');
  const [validTime, setValidTime] = useState(60);
  const [tokenData, setTokenData] = useState('');
  const navigation = useNavigation();

  const sendingOtp = async () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      console.log('Enter a valid 10-digit phone number.');
      return;
    }
    try {
      const response = await sendRegisterOtp(phoneNumber);
      console.log('OTP Sent Successfully:', response);
      setOtpFlow('Verify Otp');
      setOtpData(response);
    } catch (error) {
      console.log(
        'Failed to send OTP:',
        error?.response?.data || error.message,
      );
    }
  };

  const verifyingOtp = async () => {
    try {
      console.log('otpp', otpData?.data?.orderId);
      const response = await verifyOtp(
        phoneNumber,
        otpData?.data?.orderId,
        otp,
      );
      console.log(response);
      setOtpFlow('Create Profile');
    } catch (error) {
      console.log('verify Otp erorr', error);
    }
  };

  const creatingProfile = async () => {
    console.log('pressed');
    try {
      console.log('phoneNumber:', phoneNumber);
      console.log('name:', name);

      if (!phoneNumber || !name) {
        console.error('phoneNumber and name are required');
        return;
      }

      const requestData = {
        phoneNumber,
        name,
        email,
        vehicleNumber,
        address,
        referralCode,
      };

      const filteredData = Object.fromEntries(
        Object.entries(requestData).filter(
          ([key, value]) =>
            key === 'phoneNumber' ||
            key === 'name' ||
            (value !== undefined && value !== null),
        ),
      );

      console.log('Filtered Data:', filteredData);

      console.log('Calling API...');
      const response = await getRegisterCustomToken(filteredData);

      console.log('API Response:', response);

      signInWithToken(response.data.token);
    } catch (error) {
      console.error('API Call Failed:', error.response?.data || error.message);
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
      <Text style={styles.title}>Sign up</Text>

      {/* Name Input */}
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Your Full Name"
        placeholderTextColor="grey"
        value={name}
        onChangeText={setName}
      />

      {/* Email Input */}
      <Text style={styles.label}>Email ID</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Your Email ID"
        placeholderTextColor="grey"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      {/* Phone Number Input */}
      <Text style={styles.label}>Phone Number</Text>
      <View style={styles.phoneContainer}>
        <Text style={styles.countryCode}>+91</Text>
        <TextInput
          style={styles.phoneInput}
          placeholder="Enter Your Phone Number"
          placeholderTextColor="grey"
          keyboardType="phone-pad"
          value={phoneNumber}
          maxLength={10}
          onChangeText={setPhoneNumber}
        />
      </View>

      {/* OTP Input - Only Show After Sending OTP */}
      {otpFlow === 'Verify Otp' && (
        <>
          <Text style={styles.label}>OTP</Text>
          <OtpInput
            numberOfDigits={6}
            onTextChange={text => setOtp(text)}
            theme={{
              pinCodeContainerStyle: styles.pinCodeContainerStyle,
              containerStyle: styles.pinContainer,
            }}
          />
          <View style={{flexDirection: 'row', marginRight: 'auto', gap: 4}}>
            <TouchableOpacity onPress={() => {}} disabled={validTime > 0}>
              <Text
                style={[
                  styles.resendText,
                  validTime === 0 ? styles.resendActive : styles.resendDisabled,
                ]}>
                Resend OTP
              </Text>
            </TouchableOpacity>
            <Text style={styles.validTime}> Valid: {validTime}s</Text>
          </View>
        </>
      )}
      {/* OTP Input - Only Show After Sending OTP */}

      {/* Vehicle Number Input */}
      <Text style={styles.label}>Vehicle Number (optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Your Vehicle Number"
        placeholderTextColor="grey"
        value={vehicleNumber}
        onChangeText={setVehicleNumber}
      />

      {/* Address Input */}
      <Text style={styles.label}>Address</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Your Address"
        placeholderTextColor="grey"
        value={address}
        onChangeText={setAddress}
      />

      {/* Referral Code Input */}
      <Text style={styles.label}>Referral Code</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Referral Code"
        placeholderTextColor="grey"
        value={referralCode}
        onChangeText={setReferralCode}
      />

      {/* Signup Button */}
      <TouchableOpacity
        onPress={
          otpFlow === 'Send Otp'
            ? sendingOtp
            : otpFlow === 'Verify Otp'
            ? verifyingOtp
            : otpFlow === 'Create Profile'
            ? creatingProfile
            : undefined
        }
        style={styles.signupButton}>
        <Text style={styles.buttonText}>{otpFlow}</Text>
      </TouchableOpacity>

      {/* Navigation to Login */}
      <View style={styles.loginContainer}>
        <Text>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}> Login</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: responsive.padding(20),
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 0,
  },
  logo: {
    width: '50%',
    height: 100,
  },
  title: {
    fontSize: 34,
    width: '100%',
    fontWeight: '800',
    color: '#000',
    marginBottom: 20,
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#B82929',
    marginBottom: 6,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#B82929',
    paddingLeft: 15,
    fontSize: 14,
    marginBottom: 15,
    color: '#000',
    backgroundColor: '#B8292929',
  },
  phoneContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#B82929',
    borderRadius: 10,
    marginBottom: 15,
  },
  countryCode: {
    backgroundColor: '#B82929',
    color: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    fontSize: 14,
  },
  phoneInput: {
    height: 40,
    width: '85%',
    paddingLeft: 12,
    fontSize: 14,
    color: '#000',
    backgroundColor: '#B8292929',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  signupButton: {
    backgroundColor: '#B82929',
    width: '90%',
    padding: 8,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    marginTop: 7,
  },
  loginText: {
    color: '#B82929',
    fontWeight: 'bold',
  },
  pinCodeContainerStyle: {
    backgroundColor: '#B8292929',
    width: responsive.width(40),
    height: responsive.height(40),
  },
  pinContainer: {
    width: '50%',
    marginRight: 'auto',
    gap: 5,
  },
  resendText: {
    fontFamily: 'Outfit-Regular',
    fontSize: responsive.fontSize(10),
    color: '#B82929',
  },
  validTime: {
    fontSize: responsive.fontSize(10),
    fontFamily: 'Outfit-Regular',
  },
});
