import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import LocationDot from '../../assets/ride/LocationDot';
import responsive from '../../utils/responsive';

const AddressView = ({address = '2836 Waelchi Turnpike, East Leone 89676'}) => {
  return (
    <View style={styles.container}>
      <LocationDot />
      <Text style={styles.text}>{address}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: responsive.height(35),
    borderWidth: responsive.width(0.5),
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: responsive.padding(15),
    gap: 14,
  },
  text: {
    fontSize: responsive.fontSize(12),
    color: '#000000',
  },
});

export default AddressView;
