import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import logo from '../assets/logo.png';


const Header = ({ screen = '' }) => {
    const navigation = useNavigation();

    return (
        <View style={styles.header}>
            {!['Services', 'Quick Ride', 'Wallet', 'Profile'].includes(screen) && <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon name="arrow-back" size={28} color="#000" />
            </TouchableOpacity>}
            <Text style={styles.headerText}>{screen}</Text>
            <Image source={logo} style={styles.logo} resizeMode="contain" />
        </View>
    )
};

export default Header;

const styles = StyleSheet.create({
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15 },
    headerText: { fontSize: 22, fontWeight: 'bold' },
    logo: { height: 40, width: 120 },
});
