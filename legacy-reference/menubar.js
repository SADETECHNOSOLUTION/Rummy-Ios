import React,{useState,useEffect} from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet,Animated,Dimensions } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from 'expo-secure-store';
import axios from "axios";
import { ScrollView } from "react-native-gesture-handler";

const Menubar = ({ roomID })=>{

       const FetchProfile = async () => {
        const playerID = await SecureStore.getItemAsync('playerId');
        try {
          // Fetch the player ID from SecureStore
     // Ensure the player ID is being retrieved properly
    
          if (!playerID) {
            console.error('Player ID is not available');
            return;
          }
    
          // Make the API request using axios
          const response = await axios.get(`https://rummy-apigateway-v1.onrender.com/api/user/get-user/${playerID}`);
    
          // Check if the response is successful
          if (response.status === 200) {
            const data = response.data; // The response data should be in the `data` property
            setProfile(data);
            console.log('Profile data:', data); // You can log the profile data here
          } else {
            console.error('Failed to fetch profile', response.status);
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      };
    
      useEffect(() => {
        FetchProfile(); // Call the function when the component mounts
      }, []);
    
      const FetchRoom = async () => {
        const playerID = await SecureStore.getItemAsync('playerId');
        try {
          // Fetch the player ID from SecureStore
      // Ensure the player ID is being retrieved properly
      
          if (!playerID) {
            console.error('Player ID is not available');
            return;
          }
      
          // Make the API request using axios
          const response = await axios.get(` https://rummy-apigateway-v1.onrender.com/api/room/get-detail/${roomID}`);
      
          // Check if the response is successful
          if (response.status === 200) {
            const data = response.data; // The response data should be in the `data` property
            setRoom(data);
            console.log('Profile data:', data); // You can log the profile data here
          } else {
            console.error('Failed to fetch profile', response.status);
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      };
      
      useEffect(() => {
        FetchRoom(); // Call the function when the component mounts
      }, []);

      
    return(
<Animated.View style={{flex:1}}>
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>


  <View style={styles.sidebarContent}>

      <View style={{width:'100%'}}>
        <TouchableOpacity onPress={toggleWalletSection} style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
          <View>
            <Text style={{color:'#fff',fontWeight:800, fontSize:12}}>RNG Certified</Text>
            {/* <Text style={{color:'#fff', fontSize:12}}>Manage Transactions</Text> */}
          </View>
          <Image style={{width:20, height:20}} source={require('./assets/downn.png')}  />
        </TouchableOpacity>

        {walletsection &&     
          <View>
            {/* Wallet Section Details */}
            <TouchableOpacity style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{color:'#fff', fontSize:12}}>Manage Transactions</Text>
              </View>
              <Image style={{width:10, height:10}} source={require('./assets/next.png')}  />
            </TouchableOpacity>
            <TouchableOpacity style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{color:'#fff', fontSize:12}}>KYC</Text>
              </View>
              <Image style={{width:10, height:10}} source={require('./assets/next.png')}  />
            </TouchableOpacity>
            <TouchableOpacity style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{color:'#fff', fontSize:12}}>Wallets</Text>
              </View>
              <Image style={{width:10, height:10}} source={require('./assets/next.png')}  />
            </TouchableOpacity>
            {/* Repeat wallet items as needed */}
          </View>
        }

        {/* Other buttons */}
        <TouchableOpacity onPress={toggleRewardSection}  style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
          <View>
            <Text style={{color:'#fff',fontWeight:800, fontSize:12}}>No Bot Certified</Text>
            {/* <Text style={{color:'#fff', fontSize:12}}>Manage Transactions</Text> */}
          </View>
          <Image style={{width:20, height:20}} source={require('./assets/downn.png')}  />
        </TouchableOpacity>
        {rewardsection &&     
          <View>
            {/* Wallet Section Details */}
            <TouchableOpacity style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{color:'#fff', fontSize:12}}>Reward Store</Text>
              </View>
              <Image style={{width:10, height:10}} source={require('./assets/next.png')}  />
            </TouchableOpacity>
            <TouchableOpacity style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{color:'#fff', fontSize:12}}>Tickets</Text>
              </View>
              <Image style={{width:10, height:10}} source={require('./assets/next.png')}  />
            </TouchableOpacity>
            <TouchableOpacity style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{color:'#fff', fontSize:12}}>Loyalty Points </Text>
              </View>
              <Image style={{width:10, height:10}} source={require('./assets/next.png')}  />
            </TouchableOpacity>
            {/* Repeat wallet items as needed */}
          </View>
        }
        <TouchableOpacity onPress={toggleHelpSection}  style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
          <View>
            <Text style={{color:'#fff',fontWeight:800, fontSize:12}}>Game Settings</Text>
            {/* <Text style={{color:'#fff', fontSize:12}}>Manage Transactions</Text> */}
          </View>
          <Image style={{width:20, height:20}} source={require('./assets/downn.png')}  />
        </TouchableOpacity>
        {helpsection &&     
          <View>
            {/* Wallet Section Details */}
            <TouchableOpacity style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{color:'#fff', fontSize:12}}>Chat with Us</Text>
              </View>
              <Image style={{width:10, height:10}} source={require('./assets/next.png')}  />
            </TouchableOpacity>
            <TouchableOpacity style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{color:'#fff', fontSize:12}}>Contact Us</Text>
              </View>
              <Image style={{width:10, height:10}} source={require('./assets/next.png')}  />
            </TouchableOpacity>

            {/* Repeat wallet items as needed */}
          </View>
        }
                <TouchableOpacity  style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
          <View>
            <Text style={{color:'#fff',fontWeight:800, fontSize:12}}>Report a Problem</Text>
            {/* <Text style={{color:'#fff', fontSize:12}}>Manage Transactions</Text> */}
          </View>
          <Image style={{width:20, height:20}} source={require('./assets/down.png')}  />
        </TouchableOpacity>
        <TouchableOpacity  style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
          <View>
            <Text style={{color:'#fff',fontWeight:800, fontSize:12}}>Disconnection Settings</Text>
            {/* <Text style={{color:'#fff', fontSize:12}}>Manage Transactions</Text> */}
          </View>

        </TouchableOpacity>
{  room.roomType ==="Point"&&      <TouchableOpacity  style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
          <View>
            <Text style={{color:'#fff',fontWeight:800, fontSize:12}}>Last Game</Text>
            {/* <Text style={{color:'#fff', fontSize:12}}>Manage Transactions</Text> */}
          </View>

        </TouchableOpacity>}
      </View>

  </View>
  </ScrollView>
</Animated.View>
    )
}

export default Menubar;

const styles = StyleSheet.create({
    headingtext:{
      fontSize:12,
      color:'#EEEBEB'
    },  
    sidebar: {
      position: 'absolute',
      top: 0,
      right: 0,
      backgroundColor:'#000',
      width: Dimensions.get('window').width * 0.95, // Sidebar takes up 75% of the screen width
      height: '100%',
      marginTop:30, // Dark background for the sidebar
      flexDirection:'row',
      justifyContent: 'flex-end', // Align content from the top
      zIndex: 999, // Ensure it appears above other components
    },
    sidebarContent: {
      flex: 1,
      alignItems: 'flex-start',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      
      width: Dimensions.get('window').width * 0.35,
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
      borderTopWidth:1,
      borderTopColor:'#9D9895',
      paddingHorizontal: 16,
      paddingVertical:10
    },
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 10,
      backgroundColor: '#621B98', // blue-500
    },
    bottomNavbar: {
      position: 'absolute',  // Position at the bottom
      bottom: 0,             // Stick to the bottom
      left: 0,               // Align to the left
      right: 0,              // Align to the right
      backgroundColor: '#fff', // Background color for the navbar
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTopWidth:1,
      borderTopColor:'#9D9895',
      paddingHorizontal: 16,
      paddingVertical:10
    },  dimBackground: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay with 50% opacity
      zIndex: 998, // Ensure it's behind the sidebar but above other content
    },
    bottomMenu:{
     fontSize:14,
     fontWeight:800
    },
    chips:{
      flexDirection:'column',
      alignItems:'center',
    },
    show:{
      width: '100%',
      height: 32,
      backgroundColor:'#fff'
    },
    profileImage: {
      width: 48,
      height: 48,
      borderRadius: 24, // rounded-full
    },
    button: {
      flexDirection:'row',
      gap:4,
      backgroundColor:'#621B98',
      paddingVertical: 8,
      paddingHorizontal: 8,
      borderRadius: 5,
    },
    buttonText: {
      color: '#fff', // blue-500
      fontWeight: 'bold',
  
    },
  });
  