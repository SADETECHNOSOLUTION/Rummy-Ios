import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Animated, Dimensions, TouchableWithoutFeedback, Image, Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from "@react-navigation/native";
import { useFonts } from 'expo-font'; // Import the correct hook
import { Bar as ProgressBar } from 'react-native-progress';
const SplashScreen = () => {
  const loadingTime = 5000; // Set loading time here (5 seconds)
  const [progress, setProgress] = useState(0);
  const [loaded,setLoaded] = useState(false)
  const navigation = useNavigation();

  const opacityAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.5);

  useEffect(() => {
    // Trigger the animation when the component mounts
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, []);


  useEffect(() => {
    // Trigger the animation when the component mounts
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    // Check if token exists
    const checkTokenAndNavigate = async () => {
      try {
        const tokenDataString = await SecureStore.getItemAsync('token'); // Get the token data from SecureStore
    
        if (tokenDataString) {
          const tokenData = JSON.parse(tokenDataString); // Parse the stored data
          const currentTime = Date.now();
    
          console.log("Token retrieved: ", tokenData.token);
          console.log("Token expiry time: ", tokenData.expiryTime);
    
          // Check if the token has expired
          if (currentTime > tokenData.expiryTime) {
            console.log("Token expired, removing token from SecureStore.");
            await SecureStore.deleteItemAsync('token'); // Remove expired token
            navigation.navigate("Login"); // Navigate to Login if token has expired
          } else {
            console.log("Token is valid, navigating to Home.");
            navigation.navigate("Home"); // Navigate to Home if token is still valid
          }
        } else {
          console.log("No token found, navigating to Login.");
          navigation.navigate("Login"); // Navigate to Login if no token is found
        }
      } catch (error) {
        console.error("Error retrieving token: ", error); // Catch any errors
        navigation.navigate("Login"); // Navigate to Login on error
      }
    };
    

    // Navigate based on token after 5 seconds
    const timer = setTimeout(() => {
      checkTokenAndNavigate();
    }, loadingTime);

    // Clear timeout if component is unmounted before 5 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#91BC7D', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <View style={{ flexDirection: 'column', gap: 20, alignItems: 'center', width: '100%' }}>
        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
          <Animated.View style={{ flexDirection: 'row', height: 40, gap: 5, justifyContent: 'center',opacity: opacityAnim,transform: [{ scale: scaleAnim }], }}>
            <Image source={require('./assets/R.jpg')} style={{ width: 26, height: 40, borderRadius: 3 }} />
            <Image source={require('./assets/U.jpg')} style={{ width: 26, height: 40, borderRadius: 3 }} />
            <Image source={require('./assets/M.jpg')} style={{ width: 26, height: 40, borderRadius: 3 }} />
            <Image source={require('./assets/MM.jpg')} style={{ width: 26, height: 40, borderRadius: 3 }} />
            <Image source={require('./assets/Y.jpg')} style={{ width: 26, height: 40, borderRadius: 3 }} />
          </Animated.View>

          {/* Animated Text for QUEEN */}
          <Animated.Text
            style={{
              fontSize: 48,
              fontWeight: '800',
              color: '#fff',
              opacity: opacityAnim, // Bind opacity to animated value
              transform: [{ scale: scaleAnim }], // Bind scale to animated value
            }}
          >
            QUEEN
          </Animated.Text>
        </View>
<Animated.View style={{transform: [{ scale: scaleAnim }],}}>
<Image source={require('./assets/splash.png')} style={{ width: 220, height: 220 }} />
</Animated.View>

      </View>

      <Animated.View style={{ position: 'absolute', bottom: 20, height: 60, backgroundColor: '#fff', width: '80%', borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between',              opacity: opacityAnim, padding: 10 }}>
        <View style={{ flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <Image source={require('./assets/iso.png')} style={{ width: 20, height: 20 }} />
          <Text style={{ fontSize: 10 }}>ISO Certified</Text>
        </View>
        <View style={{ flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Image source={require('./assets/discount.png')} style={{ width: 22, height: 22 }} />
          <Text style={{ fontSize: 10 }}>Rewarding Offers</Text>
        </View>
        <View style={{ flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <Image source={require('./assets/fairplay.png')} style={{ width: 20, height: 20 }} />
          <Text style={{ fontSize: 10 }}>Fair Gameplay</Text>
        </View>
      </Animated.View>
    </View>
  );
};
const styles = StyleSheet.create({
    backgroundImage: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      resizeMode: 'cover',
    },
    playercon:{
    flexDirection:'row',
    justifyContent:'center'
    },
    buttonText:{
     fontSize:10
    },
    modalBackground: {
      flex: 1,
      position:'relative',
      backgroundColor: '#fff',  // Dark overlay background
    },
    modalContent: {
      backgroundColor: 'white',
      padding: 20,
      flexDirection:'column',
      gap:16,
      borderRadius: 10,
      width: '50%',
      alignItems: 'center',
    },
    InstructionContent: {
      backgroundColor: 'white',
      padding: 10,
      flexDirection:'column',
      gap:16,
      borderRadius: 10,
      width: '70%',
      height:'90%',
      alignItems: 'center',
    },
    loadingcontainer: {
        height:40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalText: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
    },
    modalButton: {
      backgroundColor: '#FF5733',  // Button color
      padding: 10,
      borderRadius: 5,
      width: '25%',
      alignItems: 'center',
    },
    modalButtonText: {
      color: 'white',
      fontSize: 14,
      fontWeight: 'bold',
    },
    bottomNavbar:{
      backgroundColor:'#A0C878',
      flexDirection:'row',
      position:'relative',
      justifyContent:'space-between',
      height:42
    },
      container: {
      flex: 1,
      width: '100%',
    },
    stackCards: {
      flexDirection: 'row',
      flexWrap: 'wrap', // This allows the cards to wrap into multiple rows if necessary
      justifyContent: 'center',
      gap: 10, // Space between cards
    },
    sidebar: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: Dimensions.get('window').width * 0.70, // Sidebar takes up 75% of the screen width
      height: '100%',
      marginTop:30, // Dark background for the sidebar
      flexDirection:'row',
      backgroundColor:'#000',
      justifyContent: 'flex-end', // Align content from the top
      zIndex: 999, // Ensure it appears above other components
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
    button:{
      backgroundColor:'#621B98',
      flexDirection:'row',
      justifyContent:'center',
      alignItems:'center',
      height:30,
      width:60,
      borderRadius:5
    },
    card: {
      width: 50,
      height: 80,
      backgroundColor: '#fff',
      marginHorizontal: 5,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 5,
      borderWidth:1,
      borderColor:'#000',
      elevation: 2, // Add shadow for a card effect
      position: 'absolute', // This makes sure the cards are placed on top of each other
    },
    finishcard: {
      width: 50,
      height: 80,
      backgroundColor: '#91BC7D',
      marginHorizontal: 5,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 5,
      borderWidth:1,
      borderColor:'#000',
      elevation: 2, // Add shadow for a card effect
      position: 'absolute', // This makes sure the cards are placed on top of each other
    },
    cardText: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    cardImage: {
      width: 26,
      height: 26,
    },
    header: {
      backgroundColor: '#000', // Semi-transparent background for contrast
      width: '60%',
      paddingHorizontal: 30,
      paddingVertical:5,
  flexDirection:'row',
  justifyContent:'space-between',
  borderBottomLeftRadius:50,
  borderBottomRightRadius:50,
      marginTop:20,
      alignItems: 'center',
      zIndex: 1, // Ensure it appears above the background
    },
    headerText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#000', // Ensure text contrasts with the background
    },
    body: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
  
export default SplashScreen;
