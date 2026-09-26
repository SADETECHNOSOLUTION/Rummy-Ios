import React, { useState,useRef,useEffect } from "react"; // Add useState here
import { View, Text, TouchableOpacity, Image, StyleSheet,Animated,Dimensions,TouchableWithoutFeedback,Linking,Share } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import Sidebar from "./sidebar";
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import BottomNav from "./bottomnavbar";
import NetInfo from '@react-native-community/netinfo';
import { Alert } from 'react-native';


const Refer = () => {
  const navigation = useNavigation();

  // Add activeTab state using useState
  const [activeTab, setActiveTab] = useState(1); // Default active tab is 0
   const dimAnim = useRef(new Animated.Value(0)).current; 
   const [link,setLink] = useState({})
  // Function to handle tab clicks and update activeTab state
  const handleTabPress = (index) => {
    setActiveTab(index);
  };

    const openWhatsApp = () => {
      const message = JSON.stringify(link?.playStoreUrl);
      const referralLink = `tel:${link?.referralId}`;
      const url = `whatsapp://send?text=Hey, Come enjoy Rummy Queen with me right now for the chance to win unbelievable cash prizes.  

Gain a welcome bonus of up to Rs. 8000 on the first investment you make.

Don't hesitate! To sign up for and win big, click here: ${encodeURIComponent(message)}

ReferralID: *${referralLink}*; `
      
      Linking.openURL(url)
        .then(() => console.log("WhatsApp opened"))
        .catch((err) => console.error("Error opening WhatsApp", err));
    };
  
  const FetchLink = async () => {
    const playerID = await SecureStore.getItemAsync('playerId');
    const token = await SecureStore.getItemAsync('token');

    try {
      // Fetch the player ID from SecureStore
 // Ensure the player ID is being retrieved properly

      if (!playerID) {
        console.error('Player ID is not available');
        return;
      }

      // Make the API request using axios
      const response = await axios.get(`https://rummy-apigateway-v1.onrender.com/api/user/generate-whatsapp-link?playerId=${playerID}`,{
        headers:{
          'Authorization':`Bearer ${token}`
        }
      });

      // Check if the response is successful
      if (response.status === 200) {
        const data = response.data; // The response data should be in the `data` property
        setLink(data);
        console.log('Profile data:', data); // You can log the profile data here
      } else {
        console.error('Failed to fetch profile', response.status);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    FetchLink(); // Call the function when the component mounts
  }, []);

  const openRewards = () => {
    navigation.navigate('Rewards');
  };
   const toggleSidebar = () => {
    if (sidebarVisible) {
      // Close the sidebar
      Animated.timing(sidebarAnim, {
        toValue: Dimensions.get('window').width, // Move sidebar off-screen
        duration: 300,
        useNativeDriver: true,
      }).start();
      // Fade out the dim background
      Animated.timing(dimAnim, {
        toValue: 0, // Fade out the dim background
        duration: 300,
        useNativeDriver: true,
      }).start();
      setDimVisible(false);
    } else {
      // Open the sidebar
      Animated.timing(sidebarAnim, {
        toValue: 0, // Slide sidebar in
        duration: 300,
        useNativeDriver: true,
      }).start();
      // Fade in the dim background
      Animated.timing(dimAnim, {
        toValue: 0.5, // Dim the background to 50% opacity
        duration: 300,
        useNativeDriver: true,
      }).start();
      setDimVisible(true);
    }

    setSidebarVisible(!sidebarVisible); // Toggle the state
  };
   const [dimVisible, setDimVisible] = useState(false);
   const [sidebarVisible, setSidebarVisible] = useState(false);
   const sidebarAnim = useRef(new Animated.Value(Dimensions.get('window').width)).current;

   const openReferralBoard = async()=>{
    const state = await NetInfo.fetch();
    if (!state.isConnected) {
      Alert.alert('No Internet', 'Please check your connection and try again.');
      return;
    }else{
      navigation.navigate('TrackReferral')
    }
   }

   const openReferralTable = async () => {
    const state = await NetInfo.fetch();
  
    if (!state.isConnected || !state.isInternetReachable) {
      Alert.alert('No Internet', 'Please check your connection and try again.');
      return;
    }
  
    navigation.navigate('ReferralTable');
  };
  

   const openMenu = ()=>{
    navigation.navigate('Menu')
   }

   const openTerms = ()=>{
    navigation.navigate('TermsandConditions')
   }

   const openShare = () => {
    const message = `Hey, Come enjoy Rummy Queen with me right now for the chance to win unbelievable cash prizes.\n\nGain a welcome bonus of up to Rs. 8000 on the first investment you make.\n\nDon't hesitate! To sign up for and win big, click here: ${link?.playStoreUrl}\n\nReferralID: *${link?.referralId}*;`;

    Share.share({
      message: message,
      url: link?.playStoreUrl,
    })
      .then((result) => console.log("Shared successfully", result))
      .catch((error) => console.error("Error sharing", error));
  };

  return (
    <View style={{position:'relative',}}>
      <View style={styles.show}>
      </View>
      {dimVisible && (
        <TouchableWithoutFeedback onPress={toggleSidebar}>
          <Animated.View
            style={[styles.dimBackground, { opacity: dimAnim }]} // Apply the animated opacity
          />
        </TouchableWithoutFeedback>
      )}
<Animated.View
  style={[
    styles.sidebar,
    {
      transform: [{ translateX: sidebarAnim }], // Apply sliding animation
    },
  ]}
>
  <Sidebar />
</Animated.View>
      <View style={styles.banner}>
      </View>
      <View style={{ height: '72%',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:20,position:'relative' }}>

 <TouchableOpacity onPress={openWhatsApp} style={{height:40,backgroundColor:'#621B98',borderRadius:5,width:200,gap:10,flexDirection:'row',justifyContent:'center',alignItems:'center'}}><Text style={{color:'#fff'}}>Invite via Whatsapp</Text></TouchableOpacity>
 <View style={{flexDirection:'row',gap:3,alignItems:'center'}}>
 <Image source={require('./assets/share.png')} style={{ width: 14, height: 14 }} />
 <TouchableOpacity  onPress={openShare}>
 <Text style={{textDecorationLine:'underline',fontWeight:700}}>Share via</Text>
 </TouchableOpacity>
  </View>
 <View style={{flexDirection:'column',width:'100%'}}>
                  <TouchableOpacity onPress={openReferralBoard} style={{width:'100%',flexDirection:'row',padding:14,borderWidth:1,borderColor:'#848282',justifyContent:'space-between'}}>
                   <Text>Your Bonus</Text>
                   <Image source={require('./assets/next.png')} style={{ width: 20, height: 20 }} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={openReferralTable} style={{width:'100%',flexDirection:'row',padding:14,borderBottomWidth:1,borderColor:'#848282',justifyContent:'space-between'}}>
                  <Text>Referral Master</Text>
                  <Image source={require('./assets/next.png')} style={{ width: 20, height: 20 }} />
                  </TouchableOpacity>
                </View>
                <View style={{position:'absolute',bottom:100,flexDirection:'row',alignItems:'center'}}>
                 <Text style={{fontSize:12}}>Please refer to our <TouchableOpacity style={{marginTop:7}} onPress={openTerms} ><Text style={{textDecorationLine:'underline',textDecorationColor:"#621B98",color:'#621B98'}}>Terms and Conditions</Text></TouchableOpacity> for more details</Text> </View>
      </View>
<BottomNav />
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor:'#fff',
    width: Dimensions.get('window').width * 0.70, // Sidebar takes up 75% of the screen width
    height: '100%',
    marginTop:30, // Dark background for the sidebar
    flexDirection:'row',
    justifyContent: 'flex-end', // Align content from the top
    zIndex: 999, // Ensure it appears above other components
  }, 
  dimBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay with 50% opacity
    zIndex: 998, // Ensure it's behind the sidebar but above other content
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'center'
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#621B98', // blue-500
  },
  tab: {
    paddingHorizontal:20,
    paddingVertical:10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    // borderRadius:8
  },
  // Active tab style (changes background color)
  activeTab: {
    backgroundColor: '#621B98',
    borderRadius:20
     // Green for active tab
  },
  // Text style for each tab
  tabText: {
    fontWeight: 'bold',
    color: '#000',
    fontSize: 14 // Default text color
  },
  // Active text style (changes color when active)
  activeTabText: {
    color: '#fff',
    fontWeight: 800
  },

  banner: {
    height: 180,
    backgroundColor: '#621B98'
  },
  bottomNavbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#9D9895',
    paddingHorizontal: 16,
    paddingVertical: 10
  },
  bottomMenu: {
    fontSize: 14,
    fontWeight: 800
  },
  chips: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  show: {
    width: '100%',
    height: 32,
    backgroundColor: '#fff'
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24, // rounded-full
  },
  button: {
    flexDirection: 'row',
    gap: 4,
    backgroundColor: '#621B98',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff', // blue-500
    fontWeight: 'bold',
  },
});

export default Refer;
