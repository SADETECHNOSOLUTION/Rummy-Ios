import React, { useState,useCallback,useRef,useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text,Image, TextInput, TouchableOpacity, StyleSheet, Modal, ImageBackground,BackHandler,Animated,FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';
import * as SecureStore from 'expo-secure-store';
// import * as SecureStore from 'expo-secure-store';
// import { useDispatch } from 'react-redux';
import * as Device from 'expo-device';
import { Checkbox } from 'react-native-paper'; 
// import Auth0 from 'react-native-auth0';

// Replace with your Auth0 details

import { useRoute } from '@react-navigation/native'; 

// const auth0 = new Auth0({
//   domain: 'myapp.auth0.com',
//   clientId: '925660865360-ebc0917dqkst92gf304c8lrvufhhb5fb.apps.googleusercontent.com',
// });
const ForgotPassword = () => {

  const [ismobileFocused, setIsMobileFocused] = useState(false);
  const [ispassFocused, setIsPassFocused] = useState(false);
  const [showForgotPasswordPopup, setShowForgotPasswordPopup] = useState(false);
  const [signUpModal,setSignupModal] = useState(false)
  const navigation = useNavigation();
  const [isChecked,setIsChecked] = useState(true)
  const [showAlert, setShowAlert] = useState(false);  // Alert state
  const route = useRoute();
  const [user,setUser] = useState({ email: '', password:route.params?.phoneNumber || ''});
  const [error,setError] = useState('')
  const[loginerror,setloginError] = useState('')
  const [otp, setOtp] = useState(Array(6).fill(''));
const otpRefs = useRef([]);
const [currentState,setCurrentState] = useState('mobile')
const [emails, setEmails] = useState([]);
const[isFormValid,setIsFormValid] = useState();

const [userInfo, setUserInfo] = useState(null);


// const loginWithAuth0 = async () => {
//   try {
//     const credentials = await auth0.auth.loginWithRedirect({
//       scope: 'openid profile email',
//     });
//     // After login, you can use credentials to fetch user info or tokens
//     console.log(credentials);
//     setUserInfo(credentials);
//   } catch (error) {
//     console.error('Auth0 login error', error);
//   }
// };

const handleOtpChange = (text, index) => {
  const newOtp = [...otp];
  newOtp[index] = text;
  setOtp(newOtp);

  // Move to the next input automatically if the current input is not empty
  if (text && index < otp.length - 1) {
    otpRefs.current[index + 1].focus();
  }

  // Move to the previous input if the user deletes a character
  if (!text && index > 0) {
    otpRefs.current[index - 1].focus();
  }
};

useEffect(() => {
  const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
    // Check if we're on the login screen and exit the app
    BackHandler.exitApp(); // This will exit the app

    // Return true to indicate that we have handled the back press event
    return true; // Prevent the default back button behavior (i.e., going back to the splash screen)
  });

  return () => {
    backHandler.remove(); // Cleanup on unmount
  };
}, []);

  // const navigateToAmountReceivedScreen = (phoneNumber) => {
  //   navigation.navigate('AmountReceived', { phoneNumber });
  // };
  // const saveToken = async (key, value) => {
  //   await SecureStore.setItemAsync(key, value);
  // };
      const JoinTournament = async () => {
        const token = await AsyncStorage.getItem('token');
  
        const playerId = await AsyncStorage.getItem('playerId');
      
        try {
          const response = await fetch(`https://rummy-apigateway-v1.onrender.com/api/tournament/join/676bcadef4d0321567fc45f8?playerId=${playerId}`,{
            method: 'PATCH',
          });
      
          // Check if the response is successful (status 200-299)
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
      
          const data = await response.json(); // Parse response body as JSON
          console.log(data); // Log the data from the response
          console.log('Registered successfully');
        } catch (error) {
          console.error("Error joining the tournament:", error);
          console.log(error.message); // Log error message
          console.log('Registration failed');
        }
      }

   const fetchUserdata = async () => {
    if (user.password.length < 8) {
 
   setloginError('Enter a valid 10-digit phone number.')
   return;
    }
    if (!isChecked) {
      setShowAlert(true); // Show alert if checkbox is unchecked
      // Automatically hide alert after 5 seconds
      setTimeout(() => setShowAlert(false), 3000);
      return;  // Prevent API call if checkbox is unchecked
    }
    try {
      const response = await fetch(`https://rummy-apigateway-v1.onrender.com/api/user/send-otp-mobile?phoneNumber=${user.password}`, {
        method: 'POST',
      });
  
      if (response.ok) {
        navigation.navigate('Otp', {
          phoneNumber: user.password 
        });
        setUser((prevState) => ({
          ...prevState,
          password: '',  // Clear the password
        }));

      }
       else {
        RegisterUserdata();
        setUser((prevState) => ({
          ...prevState,
          password: '',  // Clear the password
        }));
        console.log('Failed to fetch user profile:', response.status);
      }
    } catch (error) {
      console.log('Error fetching user profile:', error);
      return null;
    }
  };

  const RegisterUserdata = async () => {
    if (!isChecked) {
      setShowAlert(true); // Show alert if checkbox is unchecked
      // Automatically hide alert after 5 seconds
      setTimeout(() => setShowAlert(false), 3000);
      return;  // Prevent API call if checkbox is unchecked
    }

    const payload = {
      phoneNumber:user.email
    }
    try {
      const response = await fetch(`https://rummy-apigateway-v1.onrender.com/api/user/register-mobile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Ensure the content type is set to JSON
        },
        body:JSON.stringify(payload)
      });
  
      if (response.ok) {
        openVerifyOtp()
        navigation.navigate('Otp', {
          phoneNumber: user.password 
        });
          return null;
      }
       else {
        console.error('Failed to fetch user profile:', response.status);
        console.log(payload)
        return null;
      }
    } catch (error) {
      setloginError(response.status);
      return null;
    }
  };

  const forgotPassword = async () => {
    if (!isChecked) {
      setShowAlert(true); // Show alert if checkbox is unchecked
      // Automatically hide alert after 5 seconds
      setTimeout(() => setShowAlert(false), 3000);
      return;  // Prevent API call if checkbox is unchecked
    }

    const payload = {
      
      input:user.email || user.password
    }
    try {
      const response = await fetch(`https://rummy-apigateway-v1.onrender.com/api/user/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Ensure the content type is set to JSON
        },
        body:JSON.stringify(payload)
      });
  
      if (response.ok) {
        openForgotOtp()
      }
       else {
        console.error('Failed to fetch user profile:', response.status);
        console.log(payload)
           openForgotOtp()
        return null;
           
      }
    } catch (error) {
      setloginError(response.status);
         openForgotOtp()
      return null;
         
    }
  };


  const goToSignup = () => {
    if (navigation) {
      navigation.navigate('Signup')// Correct usage of navigation
    }
  };
  
  const openVerifyOtp = ()=>{
    setSignupModal(true)
  }

  const handleChange = (field, value) => {

    const isPhoneNumber = /^[0-9]{10}$/.test(value); // Phone number validation (10 digits)
    const isEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value); // Email validation
    const isValidEmailOrPhone = isEmail || isPhoneNumber;
    setError('');
    setUser((prevState) => ({
      ...prevState,
      [field]: value,
    }));

    setIsFormValid(isValidEmailOrPhone);
  };


  
  const slideAnim = useRef(new Animated.Value(-100)).current; // Initial off-screen position

  // Slide in the alert
  useEffect(() => {
    if (showAlert) {
      Animated.timing(slideAnim, {
        toValue: 50, // Target position (where it should be shown)
        duration: 500, // Duration of the slide-in
        useNativeDriver: true, // Ensure native driver for performance
      }).start();
      
      // Automatically hide the alert after 5 seconds
      setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: -100, // Move it off-screen again
          duration: 500, // Duration of the slide-out
          useNativeDriver: true,
        }).start();
        setShowAlert(false); // Hide the alert after sliding out
      }, 5000);
    }
  }, [showAlert]);


   useEffect(() => {
    const checkToken = async () => {
      const deviceId = Device.osBuildId; // Unique device identifier
      const token = await SecureStore.getItemAsync(`token_${deviceId}`);
      
      console.log('Token:', token); // Log the token value to debug
    
      if (token && token !== "") {
        // If token exists, navigate to the Home screen
        console.log('Token found, navigating to Home');
        navigation.navigate('Home');
        console.log(token)
      } else {
        // If no token exists, stay on the login screen
        console.log('No token found, staying on Login screen');
      }
    };
    

    checkToken();
  }, [navigation]);

const openTerms = ()=>{
  navigation.navigate('TermsandConditions')
}

const openPassword = ()=>{
  navigation.navigate('PasswordLogin')
}

const openForgotOtp = () => {
  const payload =
    currentState === 'Email'
      ? { type: 'email', value: user.email }
      : { type: 'mobile', value: user.password };

  navigation.navigate('ForgotOtp', payload);
};

useEffect(() => {
  if (route.params?.fromOtp) {
    const { type, value } = route.params;

    const newState = type === 'email' ? 'Email' : 'mobile';
    setCurrentState(newState);

    setUser((prevUser) => ({
      ...prevUser,
      email: type === 'email' ? value : prevUser.email,
      password: type === 'mobile' ? value : prevUser.password,
    }));
  }
}, [route.params]);

  return (
    <View style={{ flex: 1,backgroundColor:"#621B98",position:'relative'}}>
          {showAlert && (
  <Animated.View
    style={{
      flexDirection: 'row',
      justifyContent: 'center',
      width: '100%',
      position: 'absolute',
      top: 2,
      transform: [{ translateY: slideAnim }], // Apply the sliding animation here
    }}
  >
    <View style={styles.alertContainer}>
      <Text style={styles.alertText}>You must agree to the terms and condition</Text>
    </View>
  </Animated.View>
)}
      <View style={{backgroundColor:"#fff",height:36}}>

      </View>
    <ImageBackground style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 35}}>

      <View style={{    display:'flex',
    flexDirection:'column',
    height:280,
    // justifyContent: 'center',
    gap:8,
    borderRadius: 5, 
    width:'85%',
    backgroundColor: '#fff',
    padding:20}}>
        <View style={{gap:5}}>
      <View style={{ gap: 10 }}>
      <Text style={{fontWeight:500,textAlign:'center',fontSize:16}}>Forgot Password</Text>
      <View style={{flexDirection:'row',alignItems:'center',borderWidth:2,borderColor:'#EAE8E8',borderRadius:12}}>
        <TouchableOpacity onPress={()=>setCurrentState('mobile')} style={{width:'50%',height:40,borderRadius:10,backgroundColor:currentState ==='mobile' ?'#621B98' :'#fff',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
            <Text style={{color:currentState === 'mobile' ?'#fff' :'#000',fontWeight:800}}>Mobile</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>setCurrentState('Email')} style={{width:'50%',height:40,borderRadius:10,backgroundColor:currentState ==='Email' ?'#621B98' :'#fff',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
            <Text style={{color:currentState === 'Email' ?'#fff' :'#000',fontWeight:800}}>Email</Text>
        </TouchableOpacity>
      </View>
{ currentState ==='mobile' &&     <View style={{flexDirection:'column',gap:10}}>
      <Text style={{fontSize:14}}>Mobile Number</Text>
      <TextInput
  style={[styles.input, ismobileFocused && styles.focusedInput]}
  onChangeText={(value) => {
    // Allow only digits in the input field
    const numericValue = value.replace(/[^0-9]/g, ''); // Replace non-numeric characters
    handleChange('password', numericValue);
    setloginError('');
  }}
  value={user.password }
  keyboardType='phone-pad'
  maxLength={10}
  placeholder="Enter Mobile number"
  required
  onFocus={() => setIsPassFocused(true)}
  onBlur={() => setIsPassFocused(false)}
  />
      </View>}

      { currentState ==='Email' &&     <View style={{flexDirection:'column',gap:10}}>
      <Text style={{fontSize:14}}>Email</Text>
      <TextInput
  style={[styles.input, ismobileFocused && styles.focusedInput]}
  onChangeText={(value) => {
    handleChange('email', value);
    
    setloginError('');
  }}
  value={user.email }
  placeholder="Enter Email"
  required
  onFocus={() => setIsPassFocused(true)}
  onBlur={() => setIsPassFocused(false)}
  />
      </View>}
       </View>
       {<Text style={{color:'#FE4343',fontSize:10}}>{loginerror}</Text>}
       <View style={{flexDirection:'row',alignItems:'center',width:'100%'}}>
        
      </View>

        </View>
  
        <View style={{display:'flex',flexDirection:'column',gap:12}}>
            <TouchableOpacity onPress={forgotPassword}    style={[styles.button, { backgroundColor: isFormValid ? '#621B98' : '#cccccc' }]} 
        disabled={!isFormValid}>
          <Text style={{color: '#fff', }}>Submit</Text>
        </TouchableOpacity>
        </View>
      </View>

      </ImageBackground>

    </View>

  );
};

const styles = StyleSheet.create({
  inputFocused: {
    borderColor: '#1F41BB',
    borderWidth: 1,
  },
  alertContainer: {
    width: '80%',
    padding: 5,
    backgroundColor: '#9899EE',  // A yellow color for the alert
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius:10,
    borderTopLeftRadius:10,
    zIndex: 1,
  },
  alertText: {
    color: '#fff',
    fontSize:12,
    fontWeight: 'bold',
  },
  input: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 14,  
    borderWidth: 1,    
    borderColor: '#D1D5DB', 
    borderRadius: 4,   
    backgroundColor: '#fff',
  },
  image:{
    height:50,
    width:'60%'
  },
    otpContainer: {
      flexDirection: 'row',  // Arrange the inputs in a row
      justifyContent: 'space-between',  // Even spacing between the inputs
      width: '100%',  // Adjust width as needed
      alignItems: 'center',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },  
    forgotPasswordPopup: {
      width:'85%',
      backgroundColor: '#fff',
      padding: 20,
      display:'flex',
      flexDirection:'column',
      alignItems:'center',
      gap:20,
      borderRadius: 10,
    },
    otpInput: {
      width: 35,  // Width of each box
      height: 35,  // Height of each box
      borderWidth: 1,  // Border for each box
      borderRadius: 5,  // Optional: rounded corners for the boxes
      textAlign: 'center',  // Center the text inside each box
      fontSize: 12,  // Adjust font size as needed
    },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  otpbutton:{
    width:'100%',
    padding:10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#621B98',
    zIndex: 2, 
    color:'#fff'
  },
  button: {
    padding:10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#235a5d',
    zIndex: 2, 
    color:'#fff'
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height:10
  },
  forgotinput: {
    width:'80%',
    height: 40,
    border: 'none',
    backgroundColor: '#F3F6FF',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  forgotbutton:{
    backgroundColor: '#1F41BB',
    width: '60%',
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  inputContainer: {
    display:'flex',
    flexDirection:'column',
    height:380,
    // justifyContent: 'center',
    gap:8,
    borderRadius: 5, 
    width:'85%',
    backgroundColor: '#fff',
    padding:20
  },
  

});

export default ForgotPassword;
