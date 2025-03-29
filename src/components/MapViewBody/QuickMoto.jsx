import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import vehicleImages from '../../assets/vehicles/vehicleImages.js'; // Import image mapping
import Capacity from '../../assets/ride/Capacity';
import responsive from '../../utils/responsive';

const QuickMoto = ({
  vehicle = 'Quick Moto',
  time = '10:38',
  distance = '1 min away',
  price = 74,
  originalPrice = 80,
  isSelected = false,
  onPress,
  onBookRide,
}) => {
  const vehicleImage =
    vehicleImages[vehicle] || require('../../assets/vehicles/quickMoto.png'); // Default image if not found

  return (
    <TouchableOpacity
      onPress={() => onPress(vehicle, price)}
      style={{alignItems: 'center'}}>
      <View
        style={{
          gap: 5,
          borderRadius: responsive.borderRadius(8),
          width: '95%',
          alignItems: 'center',
          backgroundColor: isSelected ? '#ffff' : 'transparent',
          elevation: isSelected ? 7 : 0,
          padding: responsive.padding(10),
        }}>
        <View style={{flexDirection: 'row', gap: 15}}>
          {/* Vehicle Image */}
          <Image
            source={vehicleImage}
            style={{width: 50, height: 50, resizeMode: 'contain'}}
          />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              flex: 1,
            }}>
            <View style={{gap: 8}}>
              <View style={{flexDirection: 'row', gap: 10}}>
                <Text
                  style={{
                    fontFamily: 'Outfit-SemiBold',
                    fontSize: responsive.fontSize(18),
                    color: '#000000',
                  }}>
                  {vehicle}
                </Text>
                <View
                  style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
                  <Capacity />
                  <Text
                    style={{
                      fontFamily: 'Outfit-Regular',
                      color: '#000000',
                      fontSize: responsive.fontSize(12),
                    }}>
                    2
                  </Text>
                </View>
              </View>
              <View style={{flexDirection: 'row', gap: 13}}>
                <Text
                  style={{
                    fontFamily: 'Outfit-Regular',
                    fontSize: responsive.fontSize(12),
                    color: '#000000',
                  }}>
                  {time}
                </Text>
                <Text
                  style={{
                    fontFamily: 'Outfit-Regular',
                    fontSize: responsive.fontSize(12),
                    color: '#000000',
                  }}>
                  {distance}
                </Text>
              </View>
            </View>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text
                style={{
                  fontFamily: 'Outfit-Medium',
                  fontSize: responsive.fontSize(18),
                  color: '#000000',
                }}>
                ₹{price}
              </Text>
              <Text
                style={{
                  fontFamily: 'Outfit-Medium',
                  fontSize: responsive.fontSize(12),
                  color: '#000000',
                  textDecorationLine: 'line-through',
                }}>
                ₹{originalPrice}
              </Text>
            </View>
          </View>
        </View>
        {isSelected && (
          <TouchableOpacity
            onPress={() => onBookRide(vehicle, price)}
            style={{
              backgroundColor: '#B82929',
              width: '90%',
              height: responsive.height(34),
              borderRadius: responsive.borderRadius(4),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{color: '#FAFAFA', fontSize: responsive.fontSize(14)}}>
              Book Ride
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default QuickMoto;
