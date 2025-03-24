/* eslint-disable react/no-unstable-nested-components */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import Modal from 'react-native-modal';
import responsive from '../../utils/responsive';
import {BatteryCard} from '../BatteryCard';
import {userGetServices} from '../../api';

const {width} = Dimensions.get('window');

const servicesData = [
  {
    category: 'Two-Wheelers Services',
    services: [
      {
        id: '1',
        name: 'Renew Insurance',
        image: require('../../assets/TwoWhServices/insurance.png'),
      },
      {
        id: '2',
        name: 'Sell Your Bike',
        image: require('../../assets/TwoWhServices/sellYourBike.png'),
      },
      {
        id: '3',
        name: 'Buy New Bike',
        image: require('../../assets/TwoWhServices/buyNewBike.png'),
      },
      {
        id: '4',
        name: 'Road-Side Assistance',
        image: require('../../assets/TwoWhServices/roadSideInsurance.png'),
      },
      {
        id: '5',
        name: 'Bike Loan',
        image: require('../../assets/TwoWhServices/bikeLoan.png'),
      },
    ],
  },
];

const battery = [
  {
    name: 'Amaron',
    warranty: '55-72',
    time: 'Takes 2hours',
    features: [
      'Free Pickup & Drop',
      'Free Installation',
      'Old Battery Price Include',
      'Available at Doorstep',
    ],
    image: require('../../assets/amaron.png'),
  },
  {
    name: 'Exide',
    warranty: '55-72',
    time: 'Takes 2hours',
    features: [
      'Free Pickup & Drop',
      'Free Installation',
      'Old Battery Price Include',
      'Available at Doorstep',
    ],
    image: require('../../assets/amaron.png'),
  },
  {
    name: 'Livguard',
    warranty: '55-72',
    time: 'Takes 2hours',
    features: [
      'Free Pickup & Drop',
      'Free Installation',
      'Old Battery Price Include',
      'Available at Doorstep',
    ],
    image: require('../../assets/amaron.png'),
  },
];

const ServicesList2 = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [services, setServices] = useState([]);

  useEffect(() => {
    getServices();
  });

  const getServices = async () => {
    try {
      const res = await userGetServices();
      console.log(res);
    } catch (error) {
      console.log('get Services', error);
    }
  };

  const renderServiceItem = ({item}) => (
    <TouchableOpacity
      style={styles.serviceCard}
      onPress={() => setModalVisible(true)}>
      <Image
        source={item.image}
        style={styles.serviceImage}
        resizeMode="contain"
      />
      <Text style={styles.serviceText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View>
      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        style={styles.modal}>
        <View style={styles.container}>
          <Text
            style={{
              color: '#B82929',
              fontSize: responsive.fontSize(20),
              fontFamily: 'Outfit-Bold',
            }}>
            Batteries
          </Text>
          <Text
            style={{
              fontFamily: 'Outfit-Regular',
              fontSize: responsive.fontSize(10),
              color: '#000000',
              paddingBottom: responsive.padding(8),
            }}>
            We provide professional car battery services, including testing,
            replacement, and maintenance.
          </Text>
          {/* Batteries Cards  */}
          <FlatList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingVertical: responsive.padding(5)}}
            data={battery}
            keyExtractor={item => item.name}
            renderItem={({item}) => <BatteryCard {...item} />}
          />
        </View>
      </Modal>
      <FlatList
        data={servicesData}
        keyExtractor={item => item.category}
        style={styles.categoriesContainer}
        renderItem={({item}) => (
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>{item.category}</Text>
            <FlatList
              data={item.services}
              keyExtractor={service => service.id}
              horizontal
              renderItem={renderServiceItem}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        )}
      />
    </View>
  );
};

export default ServicesList2;

const styles = StyleSheet.create({
  categoriesContainer: {height: '70%', marginTop: 20},
  categoryContainer: {
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 10,
  },
  categoryTitle: {
    fontSize: 21,
    // marginBottom: 10,
    fontFamily: 'Outfit-SemiBold',
    padding: 5,
    color: '#000000',
  },
  serviceCard: {
    alignItems: 'center',
    // width: (width - 30) / 4,
    marginRight: responsive.margin(2),
    // borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    // backgroundColor: 'red',
  },
  serviceText: {
    fontSize: responsive.fontSize(15),
    // fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    maxWidth: responsive.width(80),
    fontFamily: 'Outfit-Medium',
  },
  serviceImage: {width: 60, height: 60, borderRadius: 10},
  modal: {
    flex: 1,
    alignItems: 'center',
    // height: '80%',
    justifyContent: 'center',
    padding: 10,
  },
  container: {
    height: '80%',
    width: '110%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: responsive.padding(10),
    // alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#B22222',
  },
  details: {
    fontSize: 14,
    color: '#B22222',
    marginTop: 5,
  },
  features: {
    marginTop: 10,
    width: '100%',
  },
  featureItem: {
    fontSize: 14,
    color: '#333',
    marginVertical: 2,
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 15,
  },
  button: {
    backgroundColor: '#B22222',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
