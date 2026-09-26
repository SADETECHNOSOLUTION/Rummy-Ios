import React,{useState,useRef,useEffect} from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Modal, Animated,Dimensions,Switch } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { TextInput, Button } from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';
import axios from "axios";

const Preferences = () => {
    const navigation = useNavigation()

       const [profile,setProfile] = useState();


   const [preference,setPreference] = useState()
   const [calendarEnabled,setCalendarEnabled] = useState(false);
   const [locationEnabled,setLocationEnabled] = useState(false);

   const FetchPreference = async () => {
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
      const response = await axios.get(`https://rummy-apigateway-v1.onrender.com/api/settings/${playerID}`,{
        headers:{
          'Authorization':`Bearer ${token}`
        }
      });

      if (response.status === 200) {
        const data = response.data; // The response data should be in the `data` property
        setPreference(data);
        console.log(data); // You can log the profile data here
      } else {
        console.error('Failed to fetch profile', response.status);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    FetchPreference(); // Call the function when the component mounts
  }, []);

   const FetchProfile = async () => {
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
      const response = await axios.get(`https://rummy-apigateway-v1.onrender.com/api/user/get-user/${playerID}`,{
        headers:{
          'Authorization':`Bearer ${token}`
        }
      });

      // Check if the response is successful
      if (response.status === 200) {
        const data = response.data; // The response data should be in the `data` property
        setProfile(data);
        console.log(data); // You can log the profile data here
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

  const toggleCalendar = () => setCalendarEnabled(previousState => !previousState);
  const toggleLocation = () => setLocationEnabled(previousState => !previousState);
 
   return (
     <View style={{position:'relative'}}>
        <View style={{height:30}}>

        </View>
       <View style={styles.container}>
         <TouchableOpacity style={{padding:5}} onPress={() => navigation.goBack()}>
         <Image source={require('./assets/back.png')} style={styles.profileImage} />
         </TouchableOpacity>
      <Text style={{color:'#fff',fontSize:16,fontWeight:800}}>Preferences</Text>

       </View>
       <View>
              {/* Wallet Section Details */}
              <TouchableOpacity  style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
                <View style={{flexDirection:'column'}}>
                  <Text style={{fontSize:14,fontWeight:800}}>Calendar</Text>
                  <Text style={{color:'#848282', fontSize:12}}>For Tournament start reminders </Text>
                </View>
                <Switch />
              </TouchableOpacity>
              <TouchableOpacity style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
                <View style={{flexDirection:'column'}}>
                  <Text style={{fontSize:14,fontWeight:800}}>Location</Text>
                  <Text style={{color:'#848282', fontSize:12}}>Allow Access to Location</Text>
                  <Text>{preference?.location}</Text>
                </View>
                <Switch />
              </TouchableOpacity>
            </View>
     </View>
   );
 };
 
 const styles = StyleSheet.create({
   headingtext:{
     fontSize:12,
     color:'#EEEBEB'
   },  
   inputContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 10,
  },
  inputField:{
  width:'100%',
  borderColor:'#000'
  },
   sidebar: {
     position: 'absolute',
     top: 0,
     right: 0,
     backgroundColor:'#fff',
     width: Dimensions.get('window').width * 0.70,
     height: '100%',
     marginTop:30,
     flexDirection:'row',
     justifyContent: 'flex-end',
     zIndex: 999,
   },
   bank:{
   width:40,
   height:40
   },
   input: {
    width: 20,
    height: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    margin: 5,
    fontSize: 20,
    textAlign: 'center',
  },
   sidebarContent: {
     flex: 1,
     alignItems: 'flex-start',
   }, dimBackground: {
     position: 'absolute',
     top: 0,
     left: 0,
     right: 0,
     bottom: 0,
     backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay with 50% opacity
     zIndex: 998, // Ensure it's behind the sidebar but above other content
   },
     couponContainer: {
         borderWidth: 2,                // Border thickness
         borderColor: '#C0B6B6',           // Border color (white in this case)
         borderStyle: 'dashed',         // Dashed border
         padding: 5,                   // Padding inside the container
         margin: 10,                    // Margin around the container
         borderRadius: 5,               // Optional: rounded corners
         alignItems: 'center',          // Center the text horizontally
         justifyContent: 'center',      // Center the text vertically
       },
   container: {
     flexDirection: 'row',
     alignItems: 'center',
     height: 70,
     paddingHorizontal:20,
     backgroundColor: '#621B98', // blue-500
   },
   tabContainer: {
     flexDirection: 'row',
     padding:10,
   },

   tab: {
    height:72,
     flex:1,
     borderRadius: 8,
     alignItems: 'center',
     justifyContent: 'center',
     backgroundColor:'#fff'
   },

   activeTab: {
     backgroundColor: '#FFD4BA',
     borderBottomWidth:2,
     borderBottomColor:'#621B98' // Green for active tab
   },

   tabText: {
     fontWeight: 'bold',
     color: '#000',
     fontSize:14 // Default text color
   },

   activeTabText: {
     color: '#000',
     fontWeight:800 // White text for active tab
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
     width: 20,
     height: 20,
     borderRadius: 24, // rounded-full
   },
   button: {
     flexDirection:'row',
     justifyContent:'center',
     gap:4,
     backgroundColor:'#621B98',
     paddingVertical: 12,
     paddingHorizontal: 20,
     borderRadius: 5,
   },
   buttonText: {
     color: '#fff', // blue-500
     fontWeight: 'bold',
 
   },
 });
 
 export default Preferences;