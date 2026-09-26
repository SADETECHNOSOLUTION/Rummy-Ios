import React, { useState,useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet,ScrollView } from 'react-native';
import Section from './section';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { TextInput, Button } from 'react-native-paper';
import { Swipeable } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';

const Wallet = () => {
  const [profile,setProfile] = useState()
  const navigation = useNavigation();
  const [playerID,setPlayerID] = useState('');
  const [beneficiary,setBeneficiary] = useState('');
  const [send,setSend] = useState(false)
  const [activeTab,setActiveTab] = useState(0);
  const [WalletTab,setWalletTab] = useState(0);
  const [requests,setRequests] = useState();
    const playerId = SecureStore.getItemAsync('playerId');
         const [amount, setAmount] = useState("0"); // Default value is "0"
         const handleChange = (text) => {
          setPlayerID(text);
        };
      const handleWalletTab = (id)=>{
        setWalletTab(id)
      } 
         const handleAmountChange = (text) => {
          // Remove the "$" symbol, and only keep numbers
          let numericValue = text.replace(/[^0-9]/g, ''); 
          
          // If there's no numeric value, set it back to "0"
          if (numericValue === "") {
            numericValue = "0";
          }

          // If the value starts with "0", remove the leading zero
          if (numericValue.startsWith("0") && numericValue.length > 1) {
            numericValue = numericValue.substring(1); // Remove leading 0
          }
          
          setAmount(numericValue); // Update the state with the new value
        };

  const handleTabPress = (id)=>{
     setActiveTab(id)
     setBeneficiary('')
     setPlayerID('')
  }       
  const openKyc = ()=>{
    navigation.navigate('KYCVerification');
   }
   
   const openSettings = ()=>{
    navigation.navigate('Settings');
   }
  const openWithdrawal = ()=>{
    // setSidebarVisible(false)
    navigation.navigate('Home');
  }

  const openWallet = ()=>{
    navigation.navigate('Profile');
   }

   const openRewards = ()=>{
    navigation.navigate('Rewards');
   }
   
   const openTickets = ()=>{
    navigation.navigate('Ticket');
   }

   const openCashLimit = ()=>{
    navigation.navigate('AddcashLimit');
   }
   
  const openSend = ()=>{
    setSend(!send)
  }

  const EditProfile = ()=>{
    navigation.navigate('EditProfile')
  }

  const openTransaction = ()=>{
    navigation.navigate('Transaction')
  }

  const FetchProfile = async (playerId) => {
    const playerID = await SecureStore.getItemAsync('playerId');
    const token = await SecureStore.getItemAsync('token');

    try {

      if (!playerID) {
        console.error('Player ID is not available');
        return;
      }

      const response = await axios.get(`https://rummy-apigateway-v1.onrender.com/api/user/get-user/${playerID? playerID:playerId}`,{
     headers:{
      'Authorization':`Bearer ${token}`
     }

      });

      if (response.status === 200) {
        const data = response.data;
        setProfile(data);
        console.log('Profile data:', data);
      } else {
        console.error('Failed to fetch profile', response.status);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };


  const renderRightActions = (requestId) => (
    <View style={{flexDirection:'column',alignItems:'center',justifyContent:'center',padding:5,gap:5}}>
<TouchableOpacity onPress={()=>{sendMoneyonRequest(requestId)}} style={{flexDirection:'row',backgroundColor:'#621B98',paddingVertical:5,width:60,borderRadius:5,justifyContent:'center'}}><Text style={{color:'#fff',fontWeight:800}}>Send</Text></TouchableOpacity>
<TouchableOpacity onPress={()=>{cancelRequest(requestId)}} style={{flexDirection:'row',backgroundColor:'#E93939',paddingVertical:5,width:60,borderRadius:5,justifyContent:'center'}}><Text style={{color:'#fff',fontWeight:800}}>Delete</Text></TouchableOpacity>
    </View>
  );

  const FetchRequests = async () => {
    const token = await SecureStore.getItemAsync('token');

    const playerID = await SecureStore.getItemAsync('playerId');
    try {

      if (!playerID) {
        console.error('Player ID is not available');
        return;
      }

      const response = await axios.get(`https://rummy-apigateway-v1.onrender.com/api/user/get-request-details/${playerID}?requestSummaryStatus=Requested`,{
        headers:{
          'Authorization':` Bearer ${token}`
        }
      });

      if (response.status === 200) {
        const data = response.data; // The response data should be in the `data` property
        setRequests(data);
        console.log('Profile data:', data); // You can log the profile data here
      } else {
        console.error('Failed to fetch profile', response.status);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

    const SearchProfile = async (playerId) => {
    const playerID = await SecureStore.getItemAsync('playerId');
    const token = await SecureStore.getItemAsync('token');
    try {

      if (!playerID) {
        console.error('Player ID is not available');
        return;
      }

      const response = await axios.get(`https://rummy-apigateway-v1.onrender.com/api/user/get-user/${playerId}`,{
     headers:{
      'Authorization':`Bearer ${token}`
     }
      });

      // Check if the response is successful
      if (response.status === 200) {
        const data = response.data; // The response data should be in the `data` property
        setBeneficiary(data);
        console.log('Profile data:', data); // You can log the profile data here
        setPlayerID('')
      } else {
        console.error('Failed to fetch profile', response.status);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    FetchRequests(); // Call the function when the component mounts
  }, []);

  useEffect(() => {
    FetchProfile(); // Call the function when the component mounts
  }, []);

    const Logout = ()=>{
              SecureStore.deleteItemAsync('token')
              navigation.navigate('Login')
       }

  const sendMoneyonRequest = async (requestId) => {
    const playerId = await SecureStore.getItemAsync('playerId');
    const token = await SecureStore.getItemAsync('token');

    try {
      const response = await fetch(`https://rummy-apigateway-v1.onrender.com/api/user/${requestId}/send-money/on-request`,{
        method: 'POST',
        headers:{
          'Authorization':`Bearer ${token}`
        }
      });

      if(response.ok){
        FetchRequests()
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json(); // Parse response body as JSON
      console.log(data); // Log the data from the response
      console.log('Registered successfully');
    } catch (error) {
      console.error("Error sending money", error);
    }
  }

  const back = ()=>{
    navigation.goBack()
  }

  const sendMoneyRequest = async (tournamentId) => {
    const token = await SecureStore.getItemAsync('token');
    const playerId = await SecureStore.getItemAsync('playerId');
    try {
      const response = await fetch(`https://rummy-apigateway-v1.onrender.com/api/user/request-money?requestPlayerId=${playerId}&senderPlayerId=${playerID}&amount=${amount}`,{
        method: 'POST',
        headers:{
          'Authorization':`Bearer ${token}`
        }
      });

      if(response.ok){
       setAmount('');
       setPlayerID('');
       FetchRequests;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json(); // Parse response body as JSON
      console.log(data); // Log the data from the response
      console.log('Registered successfully');
    } catch (error) {
      console.error("Error sending money", error);
    }
  }

  const sendMoney = async (tournamentId) => {
    const token = await SecureStore.getItemAsync('token');
    const playerId = await SecureStore.getItemAsync('playerId');
    try {
      const response = await fetch(`https://rummy-apigateway-v1.onrender.com/api/user/send-money?playerId=${playerID}&senderPlayerId=${playerId}&amount=${amount}`,{
        method: 'POST',
        headers:{
          'Authorization':`Bearer ${token}`
        }
      });

      if(response.ok){
        FetchRequests();
       setAmount('');
       setPlayerID('')
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json(); // Parse response body as JSON
      console.log(data); // Log the data from the response
      console.log('Registered successfully');
    } catch (error) {
      console.error("Error sending money", error);
    }
  }

  
  const cancelRequest = async (id) => {
    const token = await SecureStore.getItemAsync('token');
    const playerId = await SecureStore.getItemAsync('playerId');
    try {
      const response = await fetch(`https://rummy-apigateway-v1.onrender.com/api/user/${id}/update-status/money-request?status=Failed`,{
        method: 'PATCH',
        headers:{
          'Authorization':`Bearer ${token}`
        }
      });

      if(response.ok){
        FetchRequests();
       setAmount('');
       setPlayerID('')
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json(); // Parse response body as JSON
      console.log(data); // Log the data from the response
      console.log('Registered successfully');
    } catch (error) {
      console.error("Error sending money", error);
    }
  }
 const total = parseInt(profile?.inGameWallet)+parseInt(profile?.winningWallet)
  return (
    <View style={{flex:1}}>
    <View style={styles.show}>

    </View>
    <View style={styles.container}>

      <View style={{flexDirection:'row',alignItems:'center',gap:10}}>
      <Image  source={{ uri: `https://rummy-apigateway-v1.onrender.com/api/user${profile?.imagePath}` }}style={styles.profileImage} />
      <View>
        <Text style={styles.buttonText}>{profile?.name? profile?.name : profile?.phoneNumber}</Text>
      <Text style={{fontSize:10,color:'#E8E0DD',width:70}}>{profile?.playerId}</Text>
      </View>
      </View>
      <TouchableOpacity onPress={EditProfile} style={{padding:10,flexDirection:'row',gap:1,backgroundColor:'#fff',borderRadius:5}}>
      <Image style={{width:20,height:20}} source={require('./assets/editprofile.png')}  />
        <Text style={{color:'#621B98',fontWeight:800}}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
    <ScrollView style={{backgroundColor:'#fff',flex:1}}>
      <View style={{paddingHorizontal:20,paddingVertical:10,flexDirection:'column',gap:20}}>



   
        <View style={{flexDirection:'column',gap:10}}>
          
          <View style={styles.card}>
          <View style={styles.cardposition}>
         <Entypo name="help" size={24} color="black" />
          <View style={styles.cardHeading}>
          <Text style={styles.heading}>Help</Text>
          </View>
          </View>
        </View>
                  <View style={styles.card}>
          <View style={styles.cardposition}>
          <Image style={{width:30,height:30}} source={require('./assets/practice.png')}  />
          <View style={styles.cardHeading}>
          <Text style={styles.heading}>Rewards</Text>
          </View>
          </View>
        </View>
                  <View style={styles.card}>
          <View style={styles.cardposition}>
<MaterialIcons name="policy" size={28} color="black" />
          <View style={styles.cardHeading}>
          <Text style={styles.heading}>Policies</Text>
          </View>
          </View>
        </View>
                  <TouchableOpacity onPress={openSettings} style={styles.card}>
          <View style={styles.cardposition}>
<Ionicons name="settings" size={24} color="black" />          <View style={styles.cardHeading}>
          <Text style={styles.heading}>Settings</Text>
          </View>
          </View>
        </TouchableOpacity>
                          <View style={{height:100}} >
          <View style={styles.cardposition}>
          <View style={styles.cardHeading}>
          <Text style={styles.heading}></Text>
          </View>
          </View>
        </View>
                          <View style={{height:100}} >
          <View style={styles.cardposition}>
          <View style={styles.cardHeading}>
          <Text style={styles.heading}></Text>
          </View>
          </View>
        </View>
                                  <View  style={{height:90}} >
          <View style={styles.cardposition}>
          <View style={styles.cardHeading}>
          <Text style={styles.heading}></Text>
          </View>
          </View>
        </View>
                     
          <TouchableOpacity onPress={Logout} style={styles.card}>
          <View style={styles.cardposition}>
<MaterialCommunityIcons name="logout" size={24} color="black" />          
<View style={styles.cardHeading}>
          <Text style={styles.heading}>Logout</Text>
          </View>
          </View>
        </TouchableOpacity>


          </View>


        </View>

    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal:20,
    height:96,
    backgroundColor: '#621B98', // blue-500
  },
  requestContainer: {
    backgroundColor: '#f4f4f4',
    padding: 8,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chips:{
    flexDirection:'column',
    alignItems:'center'
  },
  cardHeading:{
    flexDirection:'column'
  },
  cardposition:{
    flexDirection:'row',
    alignItems:'center',
    gap:10
  },
  show:{
    width: '100%',
    height: 32,
    backgroundColor:'#fff'
  },
  card:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:"center",
    padding:26,
    borderRadius:5,
    backgroundColor:'#fff',
    width:'100%',
    borderBottomColor:'#CCCCCC',
    borderBottomWidth:1
  },
  Transactioncard:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:"center",
    padding:10,
    borderBottomWidth:1,
    borderColor:'#D1CECC',
    borderRadius:5,
    backgroundColor:'#fff',
    width:'100%'
  },
  columncard:{
    display:'flex',
    flexDirection:'column',
    justifyContent:'space-between',
    alignItems:"center",
    borderRadius:5,
    backgroundColor:'#fff'
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 24, // rounded-full
  },
  button: {
    flexDirection:'row',
    gap:4,
    backgroundColor:'#621B98',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff', // blue-500
    fontWeight: 'bold',
    fontSize:16
  },
  buttonoutline:{
    flexDirection:'row',
    alignItems:'center',
    gap:4,
    padding:10,
    borderWidth:1,
    borderRadius:5,
    backgroundColor:'#fff',
    borderColor:'#BEBDBC'
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor:'#fff',
    borderRadius:10
  },
  // Basic style for each tab
  tab: {
   height:40,
    flex:1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#fff'
  },
  // Active tab style (changes background color)
  activeTab: {
    backgroundColor: '#621B98',
  },
  activityTab: {
    backgroundColor: '#621B98',
  },
  // Text style for each tab
  tabText: {
    fontWeight: 'bold',
    color: '#000',
    fontSize:14 // Default text color
  },
  // Active text style (changes color when active)
  activeTabText: {
    color: '#fff',
    fontWeight:800 // White text for active tab
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    fontSize: 20,
    backgroundColor:'#fff',
    borderRadius:5,
  },
  heading:{
    fontSize:18
  }
});

export default Wallet;