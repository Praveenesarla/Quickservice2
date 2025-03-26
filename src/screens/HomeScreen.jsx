import React from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import Header from '../components/Header';
import Banner from '../components/Services/Banner';
import ServiceList from '../components/Services/ServiceList';
import responsive from '../utils/responsive';
import {useNavigation} from '@react-navigation/native';
import ServicesList2 from '../components/Services/ServicesList2';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={require('../assets/home-background.png')}
      resizeMode="cover"
      style={styles.container}>
      <Header screen="Services" />
      <View style={styles.container}>
        <View style={{paddingBottom: responsive.padding(20)}}>
          <Banner />
        </View>

        <ServiceList />
      </View>
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('ServicesBookNow')}>
        <Image
          resizeMode="contain"
          source={require('../assets/cartButton.png')}
          style={{width: '100%', height: '100%'}}
        />
      </TouchableOpacity>
    </ImageBackground>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {flex: 1},
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: responsive.width(50),
    height: responsive.height(60),
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
});
