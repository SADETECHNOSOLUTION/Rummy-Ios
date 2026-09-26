import React,{useState,useRef,useEffect} from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Animated,Dimensions } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { TextInput, Button } from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';
import axios from "axios";
import { Switch } from "react-native-gesture-handler";

const Setting = () => {
    const navigation = useNavigation()
    const [activeTab, setActiveTab] = useState(0); 
       const dimAnim = useRef(new Animated.Value(0)).current; 
       const [dimVisible, setDimVisible] = useState(false);
       const [sidebarVisible, setSidebarVisible] = useState(false);
       const sidebarAnim = useRef(new Animated.Value(Dimensions.get('window').width)).current;
       const [amount, setAmount] = useState("0"); // Default value is "0"
       const [profile,setProfile] = useState();
       // Update the value while keeping the "$" sign fixed
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
    const handleTabPress = (index) => {
     setActiveTab(index);
   };

   const [isToggled, setIsToggled] = useState(false);

   const toggleButton = () => {
     setIsToggled(!isToggled);
   };

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

 
   return (
     <View style={{position:'relative'}}>
        <View style={{height:30}}>

        </View>
       <View style={styles.container}>
         <TouchableOpacity style={{padding:5}} onPress={() => navigation.goBack()}>
         <Image source={require('./assets/back.png')} style={styles.profileImage} />
         </TouchableOpacity>
      <Text style={{color:'#fff',fontSize:16,fontWeight:800}}>Game Settings</Text>
  
       </View>
       <View style={{padding:20,flexDirection:'column',gap:20}}>
        <View style={styles.switchcontainer}>
            <Text>Sound</Text>
            <Switch />
        </View>
        <View style={styles.switchcontainer}>
            <Text>Vibration</Text>
            <Switch />
        </View>
        <View style={styles.switchcontainer}>
            <Text>Notifications</Text>
            <Switch />
        </View>
        <View style={styles.switchcontainer}>
            <Text>Auto Shuffle Cards</Text>
            <Switch />
        </View>
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
  switchcontainer:{
   flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderBottomWidth:1,borderBottomColor:'#E4DFDF'
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
     width: Dimensions.get('window').width * 0.70, // Sidebar takes up 75% of the screen width
     height: '100%',
     marginTop:30, // Dark background for the sidebar
     flexDirection:'row',
     justifyContent: 'flex-end', // Align content from the top
     zIndex: 999, // Ensure it appears above other components
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
     couponContainer: {   // Green background color
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
   // Basic style for each tab
   tab: {
    height:72,
     flex:1,
     borderRadius: 8,
     alignItems: 'center',
     justifyContent: 'center',
     backgroundColor:'#fff'
   },
   // Active tab style (changes background color)
   activeTab: {
     backgroundColor: '#FFD4BA',
     borderBottomWidth:2,
     borderBottomColor:'#621B98' // Green for active tab
   },
   // Text style for each tab
   tabText: {
     fontWeight: 'bold',
     color: '#000',
     fontSize:14 // Default text color
   },
   // Active text style (changes color when active)
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
 
 export default Setting;