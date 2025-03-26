import React from 'react';
import {View, Text, Modal, TouchableOpacity} from 'react-native';

const PayNowModal = ({visible, onClose, onPayOnline, onPayWithWallet}) => {
  return (
    <Modal transparent visible={visible} animationType="slide">
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}>
        <View
          style={{
            backgroundColor: '#FFFFFF',
            width: '80%',
            borderRadius: 10,
            padding: 20,
            alignItems: 'center',
          }}>
          {/* Heading */}
          <Text
            style={{
              fontSize: 18,
              fontFamily: 'Outfit-SemiBold',
              color: '#B82929',
              marginBottom: 15,
            }}>
            Pay Now
          </Text>

          {/* Buttons */}
          <TouchableOpacity
            onPress={onPayOnline}
            style={{
              backgroundColor: '#B82929',
              width: '100%',
              paddingVertical: 12,
              borderRadius: 6,
              alignItems: 'center',
              marginBottom: 10,
            }}>
            <Text
              style={{
                color: '#FFFFFF',
                fontSize: 16,
                fontFamily: 'Outfit-Medium',
              }}>
              Online
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onPayWithWallet}
            style={{
              backgroundColor: '#FAFAFA',
              width: '100%',
              paddingVertical: 12,
              borderRadius: 6,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#B82929',
            }}>
            <Text
              style={{
                color: '#B82929',
                fontSize: 16,
                fontFamily: 'Outfit-Medium',
              }}>
              Wallet
            </Text>
          </TouchableOpacity>

          {/* Close Modal */}
          <TouchableOpacity onPress={onClose} style={{marginTop: 15}}>
            <Text style={{color: '#B82929', fontSize: 14}}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default PayNowModal;
