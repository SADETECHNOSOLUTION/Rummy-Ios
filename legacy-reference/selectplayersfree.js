import React, { useState,useEffect} from 'react';
import { View, Text , TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

const SelectplayersFree = () => {
  // State to track active tab
  const [activeTab, setActiveTab] = useState(2);
  const [sliderValue, setSliderValue] = useState(1);
  const formattedMoney = `${sliderValue.toFixed(2)}`;
  const navigation = useNavigation()
  const [profile,setProfile] = useState()
  const playerId = SecureStore.getItem('playerId')
  // Function to handle tab click
  const handleTabPress = (index) => {
    setActiveTab(index);
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
      const response = await axios.get(` https://rummy-apigateway-v1.onrender.com/api/user/get-user/${playerID}`);

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

  const openGame = (roomId) => {
    navigation.navigate('Game', { roomId });
  }

  const shuffleCards = async(roomId)=>{
    const token = await SecureStore.getItemAsync('token');
    try {
      const response = await fetch(`https://rummy-apigateway-v1.onrender.com/api/room/shuffle-start/${roomId}`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization':`Bearer ${token}`
        }
      });

      console.log('Response status:', queryParams);
      console.log('Response headers:', response.headers);
      if (response.ok) {

       } else {
        console.log('Invalid credentials. Please try again.');
        }
      }
     catch (error) {
      console.log('Error submitting form:', error);
    }
}

  const InitializeCards = async(roomId)=>{
    const token = await SecureStore.getItemAsync('token');
      try {
        const activeTabValue = (activeTab === 2 || activeTab === 6) ? 6 : 9;
        const response = await fetch(`https://rummy-apigateway-v1.onrender.com/api/cards/initialize-${activeTabValue}/${roomId}`,{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization':`Bearer ${token}`
          }
        });
  
        console.log('Response status:', queryParams);
        console.log('Response headers:', response.headers);
        if (response.ok) {

         } else {
          console.log('Invalid credentials. Please try again.');
          }
        }
       catch (error) {
        console.log('Error submitting form:', error);
      }
  }



    const createRoom = async()=>{
      const playerId = await SecureStore.getItemAsync('playerId');
      const token = await SecureStore.getItemAsync('token');
      const roomDetails = {
        roomSize: activeTab,
        roomType: 'Point',
        gameMode: 'Practice',
        gameStatus: 'Waiting',
        pointValue: 0, 
        playerId: playerId,
        issuedPoint: 80, 
        totalRounds: 1, 
        entryType: 'Chips', 
        entryPrice: 800,
        visibility: 'Public',
      };
  
      const queryParams = new URLSearchParams(roomDetails).toString();
      try {
        const response = await fetch(`https://rummy-apigateway-v1.onrender.com/api/room/join-or-create-room?${queryParams}`,{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization':`Bearer ${token}`
          }
        });
  
        console.log('Response status:', queryParams);
        console.log('Response headers:', response.headers);
        if (response.ok) {
          const Data = await response.json();
          const roomId = Data.roomId
          const gameStatus =Data.gameStatus
          if(gameStatus==='Waiting'){
            InitializeCards(roomId)
            shuffleCards(roomId)
          }
          openGame(roomId);
         } else {
          console.log('Invalid credentials. Please try again.');
          }
        }
       catch (error) {
        console.log('Error submitting form:', error);
      }
    }

  return (
    <View style={{flexDirection:'column',height:'80%',gap:40}}>
      {/* Tabs Container */}
      <View>
      <Text style={{textAlign:'center',marginBottom:10}}>Select Players</Text>
        <View style={styles.tabContainer}>
          <View style={{flexDirection:'row',backgroundColor:'#DDDDDD',borderRadius:8}}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 2 && styles.activeTab]}
            onPress={() => handleTabPress(2)}
          >
            <Text style={[styles.tabText, activeTab === 2 && styles.activeTabText]}>
              2
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 6 && styles.activeTab]}
            onPress={() => handleTabPress(6)}
          >
            <Text style={[styles.tabText, activeTab === 6 && styles.activeTabText]}>
              6
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 9 && styles.activeTab]}
            onPress={() => handleTabPress(9)}
          >
            <Text style={[styles.tabText, activeTab === 9 && styles.activeTabText]}>
              9
            </Text>
          </TouchableOpacity>
          </View>

        </View>
      </View>
      {/* Content for active tab */}
<View style={{flexDirection:'row',justifyContent:'center',padding:10,width:'100%'}}>
  
{
profile?.chips < 800 ?
<TouchableOpacity  style={styles.button}>
<Text style={styles.buttonText}>ADD CHIPS</Text>

</TouchableOpacity>  :
<TouchableOpacity style={styles.button} onPress={createRoom}>
<Text style={styles.buttonText}>PLAY NOW</Text>

</TouchableOpacity>

}
</View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Container for tabs
  tabContainer: {
    flexDirection: 'row',
    justifyContent:'center',
    borderRadius:8,
  },
  // Basic style for each tab
  tab: {
    paddingVertical:18,
    paddingHorizontal:24,
    borderRadius:8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#F2F7FE',
  },
  // Active tab style (changes background color)
  activeTab: {
    backgroundColor: '#621B98', // Green for active tab
  },
  // Text style for each tab
  tabText: {
    fontWeight:'black',
    color: '#2d2d2d',
    fontSize:16 // Default text color
  },
  // Active text style (changes color when active)
  activeTabText: {
    color: '#fff',
    fontWeight:900, // White text for active tab
  },
  // Content area for active tab
  contentContainer: {
    padding: 16,
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

export default SelectplayersFree;
