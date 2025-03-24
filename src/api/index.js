import {APIClient} from './axios.config';

export const sendOtp = async phone => {
  try {
    const response = await APIClient.get('/sendOtp', {
      params: {phoneNumber: phone},
    });
    return response.data;
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
};

export const sendRegisterOtp = async phone => {
  try {
    const response = await APIClient.get('/sendRegisterOtp', {
      params: {phoneNumber: phone},
    });
    return response.data;
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
};

export const verifyOtp = async (phone, orderId, otp) => {
  try {
    const response = await APIClient.get('/verifyOtp', {
      params: {phoneNumber: phone, orderId, otp},
    });
    return response.data;
  } catch (error) {
    console.error('Error Verifying OTP:', error);
    throw error;
  }
};

export const getCustomToken = async phone => {
  try {
    const response = await APIClient.get('/getCustomToken', {
      params: {phoneNumber: phone},
    });
    return response.data;
  } catch (error) {
    console.error('Error get Custom Token:', error);
    throw error;
  }
};

export const getRegisterCustomToken = async data => {
  console.log(data);
  try {
    const response = await APIClient.post('/getRegisterCustomToken', data);
    return response.data;
  } catch (error) {
    console.error('Error getting Register Custom Token:', error);
    throw error;
  }
};

export const userGetServices = async () => {
  try {
    const response = await APIClient.get('/getAllServices');
    return response.data;
  } catch (error) {
    console.error('Error fething the services', error);
  }
};

export const deleteAccount = async (uid, type) => {
  console.log('tjhis ate r e values', uid, type);
  try {
    const response = await APIClient.delete('/deleteAccount', {
      data: {uid, type},
    });

    console.log('Account deleted successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error(
      'Delete Account Error:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const getUserDetails = async (uid, type) => {
  try {
    const response = await APIClient.get('/getUserDetails', {
      params: {uid, type},
    });
    return response.data;
  } catch (error) {
    console.log('Error fetching user details:', error);
    throw error;
  }
};

export const saveUserDetails = async data => {
  console.log('data', data);
  try {
    const response = await APIClient.post('/saveUserDetails', data);
    return response.data;
  } catch (error) {
    console.error('Error saving user details:', error);
    throw error;
  }
};

export const getAllOrders = async uid => {
  try {
    const response = await APIClient.get('/getAllOrders', {
      params: {uid},
    });
    return response.data;
  } catch (error) {
    console.log('Error fetching user details:', error);
    throw error;
  }
};

export const uploadCarImage = async data => {
  console.log('paseed', data);
  try {
    const response = await APIClient.post('/uploadCarImage', data);
    return response.data;
  } catch (error) {
    console.error('Error saving user details:', error);
    throw error;
  }
};

export const getQuote = async data => {
  try {
    const response = await APIClient.post('/getQuote', data);
    return response.data;
  } catch (error) {
    console.log('get Quote', error);
  }
};

export const addService = async data => {
  try {
    const response = await APIClient.post('/addService', data);
    return response;
  } catch (error) {
    console.log('Add Service', error);
  }
};

export const removeService = async data => {
  try {
    const response = await APIClient.post('/removeService', data);
    return response;
  } catch (error) {
    console.log('remove service Error', error);
  }
};

export const paymentSuccess = async data => {
  try {
    const response = await APIClient.get('/payment-success', {
      params: {data},
    });
    return response.data;
  } catch (error) {
    console.error('Error in payment success:', error);
    throw error;
  }
};

export const createOrder = async data => {
  console.log('recieve Data', data);
  try {
    const response = await APIClient.post('/createOrder', data);
    return response.data;
  } catch (error) {
    console.log('Error creating order:', error);
    throw error;
  }
};

export const getVehicleRides = async distance => {
  console.log('passed data', distance);
  try {
    const response = await APIClient.get('/getVehicleRates', {
      params: {distance},
    });
    return response.data;
  } catch (error) {
    console.log('Get Vehicles API Failed', error);
  }
};

export const bookRide = async data => {
  console.log('passedData', data);
  try {
    const response = await APIClient.post('/bookRide', data);
    return response.data;
  } catch (error) {
    console.log('error while booking ride', error);
  }
};

export const cancelRide = async data => {
  try {
    const response = await APIClient.post('/cancelRideByUser', data);
    return response.data;
  } catch (error) {
    console.log('Error while cancel Ride', error);
  }
};
