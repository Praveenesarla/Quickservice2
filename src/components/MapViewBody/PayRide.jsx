import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import Message from '../../assets/ride/Message';
import Call from '../../assets/ride/Call';

const PayRideCard = ({
  driverName = 'Gun Park',
  driverRole = 'Driver',
  fare = '₹74',
  vehicleNumber = 'GJ 04 W 504',
  vehicleName = 'Activa',
  onPressPayNow,
}) => {
  return (
    <View style={{paddingHorizontal: 13}}>
      {/* Driver Info */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingVertical: 8,
        }}>
        <View style={{flexDirection: 'row', gap: 14}}>
          <Image source={require('../../assets/ride/deliveryBoy.png')} />
          <View>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Outfit-SemiBold',
                color: '#000000',
              }}>
              {driverName}
            </Text>
            <Text
              style={{
                fontSize: 10,
                color: '#000000',
                fontFamily: 'Outfit-Light',
              }}>
              {driverRole}
            </Text>
          </View>
        </View>
        {/* Message & Call Buttons */}
        <View style={{flexDirection: 'row', gap: 10}}>
          <Message />
          <Call />
        </View>
      </View>

      {/* Ride Details */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingVertical: 5,
        }}>
        <View>
          <Text
            style={{
              fontFamily: 'Outfit-SemiBold',
              fontSize: 16,
              color: '#000000',
            }}>
            {fare}
          </Text>
          <Text
            style={{
              fontSize: 10,
              fontFamily: 'Outfit-Light',
              color: '#000000',
            }}>
            Total Price
          </Text>
        </View>
        <View>
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Outfit-SemiBold',
              color: '#000000',
            }}>
            {vehicleNumber}
          </Text>
          <Text
            style={{
              fontSize: 10,
              fontFamily: 'Outfit-Light',
              color: '#000000',
            }}>
            Vehicle Number
          </Text>
        </View>
        <View>
          <Text
            style={{
              fontFamily: 'Outfit-SemiBold',
              fontSize: 16,
              color: '#000000',
            }}>
            {vehicleName}
          </Text>
          <Text
            style={{
              fontFamily: 'Outfit-Light',
              fontSize: 10,
              color: '#000000',
            }}>
            Vehicle Name
          </Text>
        </View>
      </View>

      {/* Pay Now Button */}
      <TouchableOpacity
        onPress={onPressPayNow}
        style={{
          backgroundColor: '#28A745',
          width: '100%',
          borderRadius: 4,
          height: 34,
          justifyContent: 'center',
          alignItems: 'center',
          marginVertical: 10,
        }}>
        <Text
          style={{
            color: 'white',
            fontSize: 14,
            fontFamily: 'Outfit-Medium',
          }}>
          Pay Now
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default PayRideCard;
