import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
  Modal,
  TextInput,
} from 'react-native';
import {NativeModules} from 'react-native';
import {CFPaymentGatewayService} from 'react-native-cashfree-pg-sdk';
import {
  CFDropCheckoutPayment,
  CFEnvironment,
  CFPaymentComponentBuilder,
  CFPaymentModes,
  CFSession,
  CFThemeBuilder,
} from 'cashfree-pg-api-contract';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../components/Header';
import {Button} from 'react-native-paper';
import responsive from '../utils/responsive';
import WalletOfferCard from '../components/WalletOfferCard';
import firestore from '@react-native-firebase/firestore';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createOrder, getUserDetails, paymentSuccess} from '../api';

const {height} = Dimensions.get('window');

const transactions = [
  {
    id: '1',
    title: 'Car service',
    amount: '₹4000.00',
    transactionId: '698094554317',
    date: '18 Feb 2024 4:30 PM',
    cashback: 60,
  },
  {
    id: '2',
    title: 'Batteries',
    amount: '₹2500.00',
    transactionId: '758203984562',
    date: '30 Jan 2024 3:00 PM',
    reward: 60,
  },
  {
    id: '3',
    title: 'Detailing services',
    amount: '₹1500.00',
    transactionId: '891237645320',
    date: '5 Dec 2023 9:15 AM',
    cashback: 60,
  },
  {
    id: '4',
    title: 'A/C service',
    amount: '₹3000.00',
    transactionId: '635489201476',
    date: '22 Nov 2023 2:45 PM',
    cashback: 60,
  },
  {
    id: '5',
    title: 'Detailing services',
    amount: '₹2000.00',
    transactionId: '492837465109',
    date: '15 Oct 2023 11:30 AM',
    reward: 60,
  },
  {
    id: '6',
    title: 'A/C service',
    amount: '₹1800.00',
    transactionId: '365098712534',
    date: '28 Sep 2023 10:00 AM',
    reward: 60,
  },
];

const WalletScreen = () => {
  const [uid, setUid] = useState('');
  const [userData, setUserData] = useState('');
  const [walletData, setWalletData] = useState({});
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [addAmount, setAddAmount] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [orderData, setOrderData] = useState({});
  const updateStatus = (status, isSuccess = false) => {
    setPaymentStatus(status);
    console.log(
      `Payment ${isSuccess ? 'Successful' : 'Failed'}:`,
      JSON.stringify(status),
    );
  };

  useEffect(() => {
    const onReceivedEvent = (eventName, map) => {
      console.log(
        'Event received on screen: ' +
          eventName +
          ' map: ' +
          JSON.stringify(map),
      );
    };

    const onVerify = orderId => {
      console.log('userData4', userData);
      console.log('Payment Successful for Order ID:', orderId);
      updateStatus(`Payment Successful for Order ID: ${orderId}`, true);
      paymentOrderStatus(addAmount, walletData, uid, userData);
    };

    const onError = (error, orderId) => {
      console.log(
        'Payment Failed:',
        JSON.stringify(error),
        '\nOrder ID:',
        orderId,
      );
      updateStatus(`Payment Failed: ${error.message || JSON.stringify(error)}`);
    };

    CFPaymentGatewayService.setEventSubscriber({onReceivedEvent});
    CFPaymentGatewayService.setCallback({onVerify, onError});

    return () => {
      console.log('UNMOUNTED');
      CFPaymentGatewayService.removeCallback();
      CFPaymentGatewayService.removeEventSubscriber();
    };
  }, []);

  const startCreateOrder = async () => {
    try {
      const orderData = {
        amount: parseInt(addAmount),
        uid,
        name: userData.name,
        email: userData.email || 'esarlapraveen@gmail.com',
        phone: '8186827673' || userData.phone,
      };

      console.log('createOrder', orderData);

      const response = await createOrder(orderData);

      console.log('response', response);
      setOrderData(response.data);
      _startCheckout();
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const _startCheckout = async () => {
    try {
      const session = getSession();
      const paymentModes = new CFPaymentComponentBuilder()
        .add(CFPaymentModes.CARD)
        .add(CFPaymentModes.UPI)
        .add(CFPaymentModes.NB)
        .add(CFPaymentModes.WALLET)
        .add(CFPaymentModes.PAY_LATER)
        .build();

      const theme = new CFThemeBuilder()
        .setNavigationBarBackgroundColor('#94ee95')
        .setNavigationBarTextColor('#FFFFFF')
        .setButtonBackgroundColor('#FFC107')
        .setButtonTextColor('#FFFFFF')
        .setPrimaryTextColor('#212121')
        .setSecondaryTextColor('#757575')
        .build();

      const dropPayment = new CFDropCheckoutPayment(
        session,
        paymentModes,
        theme,
      );
      console.log(JSON.stringify(dropPayment));
      CFPaymentGatewayService.doPayment(dropPayment);
    } catch (e) {
      console.log(e);
    }
  };

  const getSession = () => {
    const sessionId = orderData.payment_session_id;
    const orderId = orderData.order_id;

    console.log('Session ID:', sessionId);
    console.log('Order ID:', orderId);

    return new CFSession(sessionId, orderId, CFEnvironment.SANDBOX);
  };

  const paymentOrderStatus = async (addAmount, walletData, uid, userData) => {
    try {
      let amount = parseInt(addAmount);
      let reward = parseInt(amount / 20);
      let wallet = walletData.amount + amount + parseInt(amount * 0.03);
      let newReward = walletData.reward + reward;

      let encodeObject = {
        uid: uid,
        walletObject: {
          amount: wallet,
          reward: newReward,
        },
        transactionObject: {
          purpose: 'Adding Money Through Cashfree',
          amount: amount + parseInt(amount * 0.03),
          reward: reward,
          cashback: parseInt(amount * 0.03),
          status: 'Credit',
          name: userData.name,
          memberId: userData.memberId,
          user_id: uid,
          phone: userData.phone,
          email: userData.email,
        },
      };

      let data = encodeURIComponent(JSON.stringify(encodeObject));
      const response = await paymentSuccess(data);
      console.log('paymentOrder', response);
      return response.data;
    } catch (error) {
      console.error('Error in payment order status:', error);
      throw error;
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('auth');
        if (value !== null) {
          const parsedValue = JSON.parse(value);
          setUid(parsedValue.uid);
          const userDataDetails = await getUserDetails(parsedValue.uid, 'user');
          setUserData(userDataDetails.data);
        }
      } catch (error) {
        console.error('Error retrieving data:', error);
      }
    };

    getData();
  }, []);

  useEffect(() => {
    if (!uid) return;

    const walletDocRef = firestore()
      .collection(`users/${uid}/wallet`)
      .doc('wallet');

    const unsubscribe = walletDocRef.onSnapshot(doc => {
      if (doc.exists) {
        const walletData = doc.data();
        setWalletData(walletData);
      } else {
        console.log('Wallet document does not exist.');
      }
    });

    return () => unsubscribe();
  }, [uid]);

  const renderTransaction = ({item}) => (
    <View style={styles.transactionRow}>
      <Image source={require('../assets/wallet.png')} style={styles.avatar} />
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionTitle}>{item.title}</Text>
        <Text style={styles.transactionId}>Transaction ID</Text>
        <Text style={styles.transactionIdText}>{item.transactionId}</Text>
      </View>
      <View style={styles.transactionDetailsRight}>
        <Text style={styles.transactionAmount}>{item.amount}</Text>
        {item.cashback ? (
          <Text style={styles.rewardTag}>Cashback: {item.cashback}</Text>
        ) : (
          <Text style={styles.rewardTag}>Reward: {item.reward}</Text>
        )}
        <Text style={styles.transactionDate}>{item.date}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header screen="Wallet" />

      {/* Balance Section */}
      <View style={styles.balanceCard}>
        <View>
          <Text style={styles.balanceAmount}>₹{walletData?.amount}</Text>
          {walletData?.amount === 0 && (
            <Text style={styles.balanceText}>No balance</Text>
          )}
        </View>
        <Button
          onPress={() => setModalVisible(true)}
          mode="outlined"
          style={styles.addMoneyButton}
          labelStyle={styles.addMoneyLabel}>
          + Add Money
        </Button>
      </View>

      {/* Transactions Section */}
      <View style={styles.transactionContainer}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        <FlatList
          data={transactions}
          keyExtractor={item => item.id}
          renderItem={renderTransaction}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <View style={{flex: 1}}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            justifyContent: 'center',
            alignItems: 'flex-end',
            gap: 10,
            paddingBottom: responsive.padding(10),
          }}
          data={[
            {id: 1, text: 'Get 1 reward point for every ₹20 added in wallet.'},
            {id: 2, text: 'Get 1 reward point for every ₹20 added in wallet.'},
            {id: 3, text: 'Get 1 reward point for every ₹20 added in wallet.'},
          ]}
          renderItem={({item}) => <WalletOfferCard text={item.text} />}
          keyExtractor={item => item.id.toString()}
        />
      </View>
      {/* Offers List */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.modalBox}>
            <Text style={styles.heading}>Add Amount</Text>

            <TextInput
              style={styles.inputField}
              value={addAmount}
              onChangeText={setAddAmount}
              placeholder="Enter amount"
              placeholderTextColor="#aaa"
              keyboardType="numeric"
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelAction]}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonLabel}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.confirmAction]}
                onPress={startCreateOrder}>
                <Text style={styles.buttonLabel}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F8F8F8'},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerTitle: {fontSize: 24, fontWeight: 'bold'},
  logo: {width: 100, height: 30, resizeMode: 'contain'},

  balanceCard: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10,
    borderWidth: 1,
    borderColor: 'lightgrey',
  },
  balanceAmount: {
    fontSize: responsive.fontSize(20),
    fontFamily: 'Outfit-Regular',
    color: '#000000',
  },
  balanceText: {
    color: '#B82929',
    fontSize: responsive.fontSize(12),
    fontFamily: 'Outfit-Light',
  },
  addMoneyButton: {
    borderColor: '#B82929',
    borderWidth: 1.5,
    borderRadius: 12,
  },
  addMoneyLabel: {
    fontSize: responsive.fontSize(12),
    color: '#B82929',
    fontFamily: 'Outfit-Regular',
  },
  transactionContainer: {backgroundColor: '#FFF', height: height * 0.58},
  sectionTitle: {
    fontSize: responsive.fontSize(20),
    fontFamily: 'Outfit-Medium',
    padding: responsive.fontSize(10),
    paddingBottom: responsive.fontSize(15),
    borderColor: '#E0E8F2',
    borderWidth: responsive.width(1.5),
    marginBottom: responsive.margin(5),
    color: '#000000',
  },
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    margin: 10,
    borderWidth: 0.5,
    borderRadius: 10,
  },
  avatar: {backgroundColor: '#CBD5E1', marginRight: 10, borderRadius: 10},
  transactionDetails: {flex: 1},
  transactionDetailsRight: {flex: 1, alignItems: 'flex-end'},
  transactionTitle: {
    fontSize: responsive.fontSize(17),
    fontFamily: 'Outfit-Medium',
    color: '#26273A',
  },
  transactionId: {
    fontSize: responsive.fontSize(11),
    marginTop: responsive.margin(4),
    color: '#26273A99',
  },
  transactionIdText: {
    fontSize: responsive.fontSize(12),
    color: '#26273A',
    fontFamily: 'Outfit-Medium',
  },
  transactionAmount: {
    fontSize: responsive.fontSize(16),
    fontFamily: 'Outfit-Medium',
    marginBottom: responsive.margin(6),
    color: '#26273A',
  },

  rewardTag: {
    backgroundColor: '#FECACA',
    paddingHorizontal: responsive.padding(8),
    paddingVertical: responsive.padding(4),
    borderRadius: responsive.borderRadius(5),
    fontSize: responsive.fontSize(10),
    color: '#B82929',
  },
  transactionDate: {
    fontSize: responsive.fontSize(10),
    color: '#26273A99',
    marginTop: responsive.margin(4),
  },
  modalContent: {
    backgroundColor: 'white',
    padding: responsive.padding(20),
    borderRadius: responsive.borderRadius(10),
    width: '80%',
  },
  modalTitle: {
    fontSize: responsive.fontSize(18),
    fontWeight: 'bold',
    marginBottom: responsive.margin(10),
  },
  input: {
    borderWidth: responsive.width(1),
    borderColor: '#ccc',
    borderRadius: responsive.borderRadius(5),
    padding: responsive.padding(10),
    marginBottom: responsive.margin(20),
  },
  modalButtonContainer: {flexDirection: 'row', justifyContent: 'space-between'},
  cancelButton: {backgroundColor: 'gray', marginRight: responsive.margin(10)},
  saveButton: {backgroundColor: 'blue'},
  // Modal styles
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  heading: {
    fontSize: 18,
    fontFamily: 'Outfit-Medium',
    color: '#B82929',
    marginBottom: 15,
  },
  inputField: {
    width: '100%',
    height: 45,
    borderWidth: 1,
    borderColor: '#B82929',
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#000',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  actionButton: {
    flex: 1,
    height: 45,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelAction: {
    backgroundColor: '#ccc',
  },
  confirmAction: {
    backgroundColor: '#B82929',
  },
  buttonLabel: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Outfit-Medium',
  },
});

export default WalletScreen;
