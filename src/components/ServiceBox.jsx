import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import responsive from '../utils/responsive';

const ServiceBox = ({text}) => {
  return (
    <View style={styles.box}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    width: responsive.width(155),
    height: responsive.height(23),
    borderWidth: responsive.borderRadius(0.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#000000',
    fontSize: responsive.fontSize(12),
    fontFamily: 'Outfit-Medium',
  },
});

export default ServiceBox;
