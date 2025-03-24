import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import responsive from '../utils/responsive';
import {addService, removeService} from '../api';

export const BatteryCard = ({name, warranty, time, ol, image, id}) => {
  console.log('item data', id, name, image);
  const [uid, setUid] = useState('');
  const [cart, setCart] = useState([]);

  const addItemCart = async () => {
    try {
      const response = await addService({uid, id, name});
      console.log('res of updating card add', response.data);
    } catch (error) {
      console.log('err in adding item', error);
    }
  };

  const removeItemCart = async () => {
    try {
      const response = await removeService({uid, id});
      console.log('removed the item', response.data);
      console;
    } catch (error) {
      console.log('Error in remove item', error);
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('auth');
        if (value) {
          const parsedValue = JSON.parse(value);
          setUid(parsedValue?.uid || '');
        }
      } catch (error) {
        console.error('Error retrieving user ID:', error);
      }
    };

    getData();
  }, []);
  useEffect(() => {
    if (!uid) return;

    const userDocRef = firestore().collection('users').doc(uid);
    const unsubscribe = userDocRef.onSnapshot(doc => {
      if (doc.exists) {
        const userData = doc.data();
        console.log('Services', userData.services);
        setCart(doc.data()?.services || []);
      } else {
        console.log('User document does not exist.');
      }
    });

    return () => unsubscribe();
  }, [uid]);

  const isInCart = cart.some(item => item.id === id);

  return (
    <View style={styles.cardContainer}>
      <Text style={styles.name}>{name}</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>{time}</Text>
        <Text style={styles.infoText}>{warranty} months warranty</Text>
      </View>

      <View style={styles.detailsContainer}>
        <FlatList
          data={ol}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <View style={styles.featureItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.featureText} numberOfLines={1}>
                {item}
              </Text>
            </View>
          )}
        />

        <View style={styles.imageContainer}>
          <Image source={{uri: image}} style={styles.batteryImage} />

          <TouchableOpacity
            onPress={isInCart ? removeItemCart : addItemCart}
            style={styles.addButton}>
            <Text style={styles.addText}>
              {isInCart ? 'Remove -' : 'Add +'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderWidth: responsive.width(0.3),
    padding: responsive.padding(10),
    margin: responsive.fontSize(10),
    borderRadius: responsive.borderRadius(5),
  },
  name: {
    fontFamily: 'Outfit-Medium',
    color: '#B82929',
    fontSize: responsive.fontSize(16),
  },
  infoContainer: {
    flexDirection: 'row',
    gap: 5,
  },
  infoText: {
    fontFamily: 'Regular',
    color: '#B82929',
    fontSize: responsive.fontSize(10),
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bullet: {
    fontSize: responsive.fontSize(30),
    lineHeight: responsive.height(30),
    color: '#000000',
  },
  featureText: {
    fontFamily: 'Outfit-Regular',
    fontSize: responsive.fontSize(6),
    marginLeft: responsive.margin(5),
    color: '#000000',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 7,
  },
  batteryImage: {
    width: responsive.width(80),
    height: responsive.height(80),
  },
  addButton: {
    width: responsive.width(80),
    height: responsive.height(17),
    backgroundColor: '#B82929',
    borderRadius: responsive.borderRadius(4),
    justifyContent: 'center',
    alignItems: 'center',
  },
  addText: {
    fontSize: responsive.fontSize(8),
    color: '#FCFCFC',
  },
});
