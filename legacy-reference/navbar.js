import React,{useState,useRef} from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet,Animated,Dimensions } from 'react-native';
import { useNavigation } from "@react-navigation/native";

const Navbar = ()=>{
     const [sidebarVisible, setSidebarVisible] = useState(false);
        const sidebarAnim = useRef(new Animated.Value(Dimensions.get('window').width)).current;
           const dimAnim = useRef(new Animated.Value(0)).current; 
              const [dimVisible, setDimVisible] = useState(false);
    const navigation = useNavigation()
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
    const toggleWalletSection = ()=>{
      showWalletSection(!walletsection)
     }
     const toggleRewardSection = ()=>{
      showRewardSection(!rewardsection)
     }
     const toggleHelpSection = ()=>{
      showHelpSection(!helpsection)
     }
     const openRewards = ()=>{
      navigation.navigate('Rewards');
     }

const openSidebar =()=>{
  navigation.navigate('Sidebar')
}

const openProfile = ()=>{
     navigation.navigate('Profile');
    }
    const openMission = ()=>{
      navigation.navigate('Mission');
     }
    return(
    <View style={styles.bottomNavbar}>
        <TouchableOpacity onPress={openRewards} style={styles.chips}>
        <Image source={require('./assets/reward.png')} style={{width:36,height:36}} />
        <Text style={styles.bottomMenu}>Rewards</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={openMission} style={styles.chips}>
        <Image source={require('./assets/mission.png')} style={{width:36,height:36}} />
          <Text style={styles.bottomMenu}>Mission</Text>
        </TouchableOpacity>
        <View style={styles.chips}>
        <Image source={require('./assets/activelobby.png')} style={{width:36,height:36}} />
          <Text style={[styles.bottomMenu,{color:'#621B98'}]}>Lobby</Text>
        </View>
        <TouchableOpacity onPress={openSidebar} style={styles.chips}>
        <Image source={require('./assets/iconmenu.png')} style={{width:36,height:36}} />
          <Text style={styles.bottomMenu}>Menu</Text>
        </TouchableOpacity>
      </View>
    )
}

export default Navbar;

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      backgroundColor: '#621B98', // blue-500
    },
    bottomNavbar: {
      position: 'absolute',  // Position at the bottom
      bottom: 0,             // Stick to the bottom
      left: 0,               // Align to the left
      right: 0,              // Align to the right
      height: 80,            // Set a height for the navbar
      backgroundColor: '#fff', // Background color for the navbar
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTopWidth:1,
      borderTopColor:'#9D9895',
      paddingHorizontal: 16,
      paddingBottom: 16,
    },
    bottomMenu:{
     fontSize:14,
     fontWeight:800
    },
    chips:{
      flexDirection:'column',
      alignItems:'center'
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
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderRadius: 5,
    },
    buttonText: {
      color: '#fff', // blue-500
      fontWeight: 'bold',
  
    },
  });