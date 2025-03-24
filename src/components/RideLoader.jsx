import React from 'react';
import {
  Modal,
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  Image,
  Text,
} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import responsive from '../utils/responsive';

const FullScreenModal = ({isVisible, onClose}) => {
  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.container}>
          {/* Blurred Background */}
          <BlurView style={styles.absolute} blurType="xlight" blurAmount={10} />

          <Image
            source={require('../assets/ride/loader.gif')}
            style={styles.gif}
          />
          <Text
            style={{
              fontSize: responsive.fontSize(16),
              fontFamily: 'Outfit-SemiBold',
              color: '#000000',
            }}>
            Your <Text style={{color: '#B82929'}}>Quick Moto</Text> is
            loading...
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  absolute: {
    ...StyleSheet.absoluteFillObject, // Makes blur cover the entire screen
  },
  gif: {
    width: '90%',
    height: '20%',
    resizeMode: 'contain',
  },
});

export default FullScreenModal;
