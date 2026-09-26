import react,{useState,useEffect,useRef} from "react";
import { View, Text,Image, TextInput, TouchableOpacity, StyleSheet, Modal, ImageBackground,BackHandler } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useRoute } from '@react-navigation/native'; 
import { useNavigation } from '@react-navigation/native';

const ForgotOtp = ()=>{
    const navigation = useNavigation()
     const [otp, setOtp] = useState(Array(6).fill(''));
    const otpRefs = useRef([]);
    const [error,setError] = useState('');
    const [timeLeft, setTimeLeft] = useState(60); // Initial timer value in seconds
    const [timerActive, setTimerActive] = useState(true)
    const [sendotp,showSendOTP] = useState(false)
  const route = useRoute();
    // const { phoneNumber } = route.params;

    // useEffect(() => {
    //   // If the phoneNumber changes in the route, update the state
    //   if (route.params?.phoneNumber) {
    //     setCurrentPhoneNumber(route.params.phoneNumber);
    //   }
    // }, [route.params?.phoneNumber]);
  
    // const handleEditNumber = () => {
    //   // Navigate back to login page to edit the phone number
    //   navigation.navigate('Login', { phoneNumber: currentPhoneNumber });
    // };

    // const handleResetPhoneNumber = () => {
    //   // Setting phoneNumber to null
    //   navigation.setParams({ phoneNumber: null });
    // };

    const { type, value } = route.params;
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
        const payload = {

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
               navigation.navigate('ReferralOtp');
               console.error('Error submitting form:', data.error);
             } else {
             setError(data.error);
             navigation.navigate('ReferralOtp');
             console.error('Error submitting form:', data.error);
             console.log(user.password);
             }
           }
          catch (error) {
           console.error('Error submitting form:', error);
           console.log(user.password);
           setloginError('Invalid credentials. Please try again.');
           setError(data.error)
              navigation.navigate('ReferralOtp');
         }
       };
       
       const handleSubmit = async (e) => {
        const payload = {
          input: value,
          otp: otp.join('')
        };
      
        try {
          const response = await fetch('https://rummy-apigateway-v1.onrender.com/api/user/verify-otp', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });
      
          const responseText = await response.text();
          console.log('Raw response:', responseText); // 👈 log what you're getting back
      
          let data;
          try {
            data = JSON.parse(responseText);
          } catch (parseError) {
            console.error('JSON parse error:', parseError);
            data = {}; // fallback to empty object if parsing fails
          }
      
          if (response.ok) {
            setOtp('');
            navigation.navigate('ResetPassword', {value});
          } else {
            handleOtpSubmit();
            setError(data.error || 'You have entered the wrong OTP. Please try again.');
          }
        } catch (error) {
          console.error('Error submitting form:', error);
          setloginError('Something went wrong');
                navigation.navigate('ResetPassword', {value});
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
    

    const loginOTP = async () => {
        try {
          const response = await fetch(`https://rummy-apigateway-v1.onrender.com/api/user/send-otp-mobile?phoneNumber=${phoneNumber}`, {
            method: 'POST',
          });
      
          if (response.status===201) {
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
      const handleEdit = () => {
        navigation.navigate('ForgotPassword', {
          fromOtp: true,
          type,
          value // either 'email' or 'mobile'
        });
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
              return null;
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
            <View style={{flexDirection:'row',alignItems:'center'}}>
            <Text style={{fontSize:12}}>OTP sent to <Text style={{fontSize:14}}>{value}</Text></Text>
            <TouchableOpacity onPress={handleEdit} style={{flexDirection:'row'}}>
            <Image source={require('./assets/otpedit.png')} style={{width:16,height:16}} />
            </TouchableOpacity>
            </View>
<View style={{flexDirection:'column',gap:5}}>
<View style={styles.otpContainer}>
  {[...Array(6)].map((_, index) => (
    <TextInput
      key={index}
      style={styles.otpInput}
      keyboardType="numeric"
      maxLength={1}
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
{/* <View>
 <Text style={{color:'red',textAlign:"center"}}>{error}</Text>
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
</View> */}

<View style={{flexDirection:'column',gap:4,alignItems:'center'}}>
  <TouchableOpacity onPress={handleSubmit}  style={[styles.button, { opacity: isOtpComplete ? 1 : 0.5 }]}
        disabled={!isOtpComplete}>
          <Text style={{color: '#fff', }}>Verify</Text>
        </TouchableOpacity>
  <Text style={{color:'red'}}>{error}</Text>
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
        height:240,
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        gap:20,
        borderRadius: 10,
      },
      otpInput: {
        width: 35,
        height: 35, 
        borderWidth: 1, 
        borderRadius: 5,
        textAlign: 'center',
        fontSize: 12,
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
      width:100, 
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

export default ForgotOtp;