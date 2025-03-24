import React from 'react';
import {View, Text} from 'react-native';
import responsive from '../../utils/responsive';

const OTPDisplay = ({otp = '1234'}) => {
  return (
    <View
      style={{
        width: '100%',
        height: responsive.height(28),
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: responsive.padding(10),
        borderBottomWidth: 0.2,
        paddingVertical: responsive.padding(5),
      }}>
      <Text
        style={{
          fontFamily: 'Outfit-SemiBold',
          fontSize: responsive.fontSize(14),
          color: '#000000',
        }}>
        Ride Arriving Soon
      </Text>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
        <Text
          style={{
            fontSize: responsive.fontSize(12),
            color: '#000000',
            fontFamily: 'Outfit-SemiBold',
          }}>
          OTP:
        </Text>
        <Text
          style={{
            fontSize: responsive.fontSize(12),
            color: '#000000',
            fontFamily: 'Outfit-SemiBold',
          }}>
          {otp}
        </Text>
      </View>
    </View>
  );
};

export default OTPDisplay;
