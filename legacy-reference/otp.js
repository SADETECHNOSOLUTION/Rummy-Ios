import react,{useState,useEffect,useRef} from "react";
import { View, Text,Image, TextInput, TouchableOpacity, StyleSheet, Modal, ImageBackground,BackHandler } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useRoute } from '@react-navigation/native'; 
import { useNavigation } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import { Alert } from 'react-native';

const  Otp = ()=>{
    const navigation = useNavigation()
    const [otp, setOtp] = useState(Array(6).fill(''));
    const otpRefs = useRef([]);
    const [error,setError] = useState('');
    const [timeLeft, setTimeLeft] = useState(60); // Initial timer value in seconds
    const [timerActive, setTimerActive] = useState(true)

    const [sendotp,showSendOTP] = useState(false)
    const route = useRoute();
    const { phoneNumber } = route.params;
        const [currentPhoneNumber, setCurrentPhoneNumber] = useState(phoneNumber);;
    const [focusedIndex, setFocusedIndex] = useState(null);
    
    useEffect(() => {
      // If the phoneNumber changes in the route, update the state
      if (route.params?.phoneNumber) {
        setCurrentPhoneNumber(route.params.phoneNumber);
      }
    }, [route.params?.phoneNumber]);
  
    const handleEditNumber = () => {
      // Navigate back to login page to edit the phone number
      navigation.navigate('Login', { phoneNumber: currentPhoneNumber });
    };

    const handleResetPhoneNumber = () => {
      // Setting phoneNumber to null
      navigation.setParams({ phoneNumber: null });
    };
    useEffect(() => {
        let timer;
        
        if (timerActive && timeLeft > 0) {
          // Decrease the time by 1 second every second
          timer = setInterval(() => {
            setTimeLeft(prevTime => prevTime - 1);
          }, 1000);
        } else if (timeLeft === 0) {
          // Send OTP when the timer finishes
          showSendOTP(true);
        }
    
        // Clear the timer when the component is unmounted or timer stops
        return () => clearInterval(timer);
      }, [timerActive, timeLeft]);

      
      const handleOtpSubmit = async (e) => {
        const state = await NetInfo.fetch();

        if (!state.isConnected) {
          Alert.alert('No Internet', 'Please check your connection and try again.');
          return;
        }

        const payload = {
         phoneNumber:phoneNumber,
         otp:otp.join('')
        }
         try {
           const response = await fetch('https://rummy-apigateway-v1.onrender.com/api/user/verify-otp-register',{
             method: 'POST',
             headers:{
              'Content-Type': 'application/json',
             },
             body:JSON.stringify(payload),
           });
     
           console.log('Response status:', response.status);
           console.log('Response headers:', response.headers);
  
             if (response.ok) {
               const data = await response.json();
               const token = data.token;
               const playerId = data.playerId;
               await SecureStore.setItemAsync('token', token);
               await SecureStore.setItemAsync('playerId', playerId);
               console.log('Token stored securely');
               const gettoken = await SecureStore.getItemAsync('token');
               console.log('Token:', gettoken);
               setOtp('')
               handleResetPhoneNumber()
               navigation.navigate('Lobby');
               console.error('Error submitting form:', data.error);
             } else {
             setError('You have entered the wrong OTP. Please try again.');
             console.error('Error submitting form:', data.error);
             console.log(user.password);
             }
           }
          catch (error) {
           console.error('Error submitting form:', error);
           console.log(user.password);
           setloginError('Invalid credentials. Please try again.');
                      setError(data.error || 'error');
         }
       };
       
       const handleSubmit = async (e) => {
        const state = await NetInfo.fetch();

        if (!state.isConnected) {
          Alert.alert('No Internet', 'Please check your connection and try again.');
          return;
        }

        const payload = {
        phoneNumber:phoneNumber,
        otp:otp.join('')
       }
        try {
          // const token = process.env.REACT_APP_GITHUB_TOKEN;
          const response = await fetch('https://rummy-apigateway-v1.onrender.com/api/user/login/otp',{
            method: 'POST',
            headers:{
             'Content-Type': 'application/json',
            },
            body:JSON.stringify(payload),
          });             
          console.log('Response status:', response.status);
          console.log('Response headers:', response.headers);
          const data = await response.json();
            if (response.ok) {
              const token = data.token;
              const playerId = data.playerId;
              await SecureStore.setItemAsync('token', token);
              await SecureStore.setItemAsync('playerId', playerId);
              console.log('Token stored securely');
              
              const gettoken = await SecureStore.getItemAsync('token');
              console.log('Token:', gettoken);
              setOtp('')
              handleResetPhoneNumber()
              navigation.navigate('Home');
              console.log(data.token);
            } else {
            handleOtpSubmit()
            console.error('Error submitting f:', data.error);
            setError(data.error)
            }
          }
         catch (error) {
          console.error('Error submitting form:', error);
          setloginError(response.status)
          console.error('Error submitting form:', data.error);
        }
      };
    

      const handleOtpChange = (text, index) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);
        setError('')
        // Move to the next input automatically if the current input is not empty
        if (text && index < otp.length - 1) {
          otpRefs.current[index + 1]?.focus();  // Focus on next input
          setError('')

        }
    
        // Move to the previous input if the user deletes a character and current input is empty
        if (!text && index > 0) {
          otpRefs.current[index - 1]?.focus();  // Focus on previous input
          // Ensure the cursor is at the front of the previous field
          
          setTimeout(() => {
            otpRefs.current[index - 1]?.setNativeProps({ selection: { start: 0, end: 0 } });
            setError('')
          }, 0);
        }
      };
    
    const openLogin = ()=>{
      navigation.navigate('Login', {
        phone: phoneNumber 
      });
    }

    

    const loginOTP = async () => {
        try {
          const response = await fetch(`https://rummy-apigateway-v1.onrender.com/api/user/send-otp-mobile?phoneNumber=${phoneNumber}`, {
            method: 'POST',
          });
      
          if (response.ok) {
            showSendOTP(false)
            setTimeLeft(30)
          }
           else {
            RegisterOTP();
            console.log('Failed to fetch user profile:', response.status);
          }
        } catch (error) {
          console.log('Error fetching user profile:', error);
          return null;
        }
      };
    
      const handleKeyPress = (e, index) => {
        // If backspace is pressed and the current field is empty, move focus to previous field
        if (e.nativeEvent.key === 'Backspace' && otp[index] === '') {
          if (index > 0) {
            otpRefs.current[index - 1]?.focus();  // Focus on previous input
            // Move the cursor to the start of the previous input
            otpRefs.current[index - 1]?.setNativeProps({ selection: { start: 0, end: 0 } });
          }
        }
      };

      const RegisterOTP = async () => {
        try {
          const response = await fetch(`https://rummy-apigateway-v1.onrender.com/api/user/register-mobile?phoneNumber=${phoneNumber}`, {
            method: 'POST',
          });
      
          if (response.ok) {
            
            showSendOTP(false)
            setTimeLeft(30)
          }
           else {
            console.error('Failed to fetch user profile:', response.status);
            return null;
          }
        } catch (error) {
          setloginError(response.status);
          return null;
        }
      };
      const isOtpComplete = Array.isArray(otp) && otp.every((digit) => digit !== '');

    return(
        <View style={{ flex: 1,backgroundColor:"#621B98",position:'relative'}}>
        <ImageBackground style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 35}}>
        <View style={styles.modalContainer}>
          <View style={styles.forgotPasswordPopup}>
            <View style={{display:'flex',flexDirection:'row',width:'100%',backgroundColor:'#fff'}}>
            <Text style={{fontWeight:800,textAlign:'center'}}>ENTER OTP</Text>
            </View>
            <View style={{flexDirection:'row',gap:4}}>
            <Text style={{fontSize:12}}>OTP sent to <Text style={{fontSize:14}}>{phoneNumber}</Text></Text>
            <TouchableOpacity onPress={handleEditNumber} style={{flexDirection:'row'}}>
            <Image source={require('./assets/otpedit.png')} style={{width:16,height:16}} />
            </TouchableOpacity>

            </View>
<View style={{flexDirection:'column',gap:5}}>
<View style={styles.otpContainer}>
  {[...Array(6)].map((_, index) => (
    <TextInput
      key={index}
   style={[
      styles.otpInput,
      focusedIndex === index && styles.focusedOtpInput, // Apply highlight style
    ]}
      keyboardType="numeric"
      maxLength={1}
      onFocus={()=>{setFocusedIndex(index)}}
      onBlur={()=>{setFocusedIndex(null)}}
      onKeyPress={(e) => handleKeyPress(e, index)} 
      onChangeText={(text) => {   setError('')
         const numericValue = text.replace(/[^0-9]/g, '') 
        handleOtpChange(numericValue, index)
       }}
      value={otp[index]}
      ref={(input) => (otpRefs.current[index] = input)}  // Handling focus change
    />
  ))}
</View>

</View>
<View>

<View style={{ flexDirection: 'row', alignItems: 'center', width: '100%',}}>

  <Text>Didn't receive OTP? </Text>
  <View>
  {sendotp ? (
    <TouchableOpacity onPress={loginOTP}>
      <Text style={{ fontSize: 10, color: '#621B98', textDecorationColor: '#621B98',textDecorationLine:'underline' }}>
        Resend OTP
      </Text>
    </TouchableOpacity>
  ) : (
    <Text style={{ fontSize: 12 }}>Resend in {timeLeft}s</Text>
  )}
    </View>
</View>
</View>

<View style={{flexDirection:'column',alignItems:'center'}}>
<TouchableOpacity onPress={handleOtpSubmit}  style={[styles.button, { opacity: isOtpComplete ? 1 : 0.5 }]}
        disabled={!isOtpComplete}>
          <Text style={{color: '#fff', }}>Verify</Text>
        </TouchableOpacity>
 <Text style={{color:'red',textAlign:"center"}}>{error}</Text>
</View>


          </View>
        </View>

          </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    inputFocused: {
      borderColor: '#1F41BB',
      borderWidth: 1,
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
      },  
      forgotPasswordPopup: {
        width:'85%',
        backgroundColor: '#fff',
        padding: 20,
        height:280,
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
        focusedOtpInput: {
    borderColor: '#4A90E2', // Blue border on focus
    backgroundColor: '#e6f0ff',
  },
    gradient: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: -1, // Ensures gradient is behind other content
    },
    otpbutton:{
      width:'100%',
      padding:10,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor:'#621B98',
      zIndex: 2, 
      color:'#fff' // Ensures button is on top of the gradient
    },
    button: { // To stack the gradient background and text
      padding:10,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor:'#621B98',
      zIndex: 2, 
      width:150,
      color:'#fff' // Ensures button is on top of the gradient
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
      height:250,
      justifyContent: 'center',
      gap:'15',
      borderRadius: 5, 
      width:'85%',
      backgroundColor: '#fff',
      paddingHorizontal:20
    },
    
  
  });

export default Otp;