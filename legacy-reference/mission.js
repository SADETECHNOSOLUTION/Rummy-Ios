import React, { useState,useRef,useEffect } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet,Animated,Dimensions,TouchableWithoutFeedback,ScrollView } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import Sidebar from "./sidebar";
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import Header from "./header";
import Dropdown from "./dropdown";

const Mission = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState(1);
   const [showDropdown,setShowDropdown] = useState(false)
   const dimAnim = useRef(new Animated.Value(0)).current; 
   const [mission,setMission] = useState({})

  const handleTabPress = (index) => {
    setActiveTab(index);
  };

  const FetchMission = async () => {
    const playerID = await SecureStore.getItemAsync('playerId');
    const token = await SecureStore.getItemAsync('token');
    try {

      if (!playerID) {
        console.error('Player ID is not available');
        return;
      }

      // Make the API request using axios
      const response = await axios.get(`https://rummy-apigateway-v1.onrender.com/api/mission/get-mission/${playerID}`,{
        headers:{
          'Authorization':`Bearer ${token}`
        }
      });

      // Check if the response is successful
      if (response.status === 200) {
        const data = response.data;
        setMission(data);
        console.log('Profile data:', data);
      } else {
        console.error('Failed to fetch profile', response.status);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    FetchMission(); // Call the function when the component mounts
  }, []);
  
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
  const toggleDropdown = () => setShowDropdown(prev => !prev);
  const handleMission = ()=>{
    navigation.navigate('Home')
  }

   const [dimVisible, setDimVisible] = useState(false);
   const [sidebarVisible, setSidebarVisible] = useState(false);
   const sidebarAnim = useRef(new Animated.Value(Dimensions.get('window').width)).current;
  return (
    <View style={{position:'relative',}}>
      <View style={styles.show}>
      </View>
      <Header onMenuPress={toggleDropdown} />
      {showDropdown && (
<Dropdown />
      )}
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
      <View style={{ height: '72%' }}>
        <View style={styles.tabContainer}>
          <View style={{flexDirection:'row',backgroundColor:'#fff',borderRadius:10,backgroundColor:'#fff'}}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 0 && styles.activeTab]}
            onPress={() => handleTabPress(0)}
          >
            <Text style={[styles.tabText, activeTab === 0 && styles.activeTabText]}>
              Daily Challenges
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 1 && styles.activeTab]}
            onPress={() => handleTabPress(1)}
          >
            <Text style={[styles.tabText, activeTab === 1 && styles.activeTabText]}>
              Missions
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 2 && styles.activeTab]}
            onPress={() => handleTabPress(2)}
          >
            <Text style={[styles.tabText, activeTab === 2 && styles.activeTabText]}>
              Cash
            </Text>
          </TouchableOpacity>
          </View>
        </View>
<ScrollView>
<View style={{paddingBottom:80,backgroundColor:"#D5D3D7"}}>
        {Array.isArray(mission) && mission.map((missions) => (
  <View style={styles.contentContainer}>
    {activeTab === 1 && (
      <View style={{ padding: 10,paddingHorizontal:30 }}>
        <View
          style={{
            borderColor: "#D0CFCC",
            backgroundColor: "#fff",
            flexDirection: "column",
            gap:14,
            padding: 10,
            paddingHorizontal:10,
            borderRadius: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                  <Text style={{ fontWeight: 800, fontSize: 20 }}>Win ₹{missions.rewardAmount}</Text>

                </View>
                <Text>{missions.cashType}</Text>
              </View>
            </View>
<View>
<View style={{ backgroundColor: "#53AF67", padding: 5, borderRadius: 5 }}>
                    <Text style={{ fontSize: 10, color: "#fff", fontWeight: 800 }}>Only for you</Text>
                  </View>
  </View>
          </View>
          <View style={{ borderWidth: 1, borderColor: "#C1C8CE", borderRadius: 5 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 5 }}>
              <Text style={{ fontWeight: 800,fontSize:12 }}>{missions.task}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 5 }}>
              <Text style={{ fontSize: 10 }}>Pro Tip: {missions.remark}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleMission} style={{ backgroundColor: "#621B98", padding: 8, borderRadius: 50,flexDirection:'row' ,justifyContent:'center'}}>
              <Text style={{ fontWeight: 800, color: "#fff" }}>Entry ₹{missions.entryAmount}</Text>
            </TouchableOpacity>
        </View>
      </View>
    )}
  </View>
))}
  </View>
  </ScrollView>
      </View>

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
    justifyContent: 'center',
    backgroundColor:"#D5D3D7"
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
    borderRadius:20
  },
  // Active tab style (changes background color)
  activeTab: {
    backgroundColor: '#621B98',
    borderRadius:10
  },
  // Text style for each tab
  tabText: {
    fontWeight: 'bold',
    color: '#000',
    fontSize: 14
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

 
export default Mission;



