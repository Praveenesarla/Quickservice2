import React from 'react';
import {View, Text} from 'react-native';

import RiderRating from '../../assets/ride/RiderRating';
import responsive from '../../utils/responsive';

const RiderDetails = ({rating = 4.6}) => {
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
          fontWeight: '500',
          color: '#000000',
        }}>
        Rider Details
      </Text>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
        <Text
          style={{
            fontSize: responsive.fontSize(12),
            color: '#000000',
            fontFamily: 'Outfit-Medium',
          }}>
          {rating}
        </Text>
        <RiderRating />
      </View>
    </View>
  );
};

export default RiderDetails;
