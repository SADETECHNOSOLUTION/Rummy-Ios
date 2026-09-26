import React, { useState,useEffect} from 'react';
import { View, Text,Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

const FreePool = () => {
  // State to track active tab
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState(2);
  const [poolTab, setPoolTab] = useState(101);
  const [sliderValue, setSliderValue] = useState(1);
  const formattedMoney = `${sliderValue.toFixed(2)}`;
  const [profile,setProfile] = useState();

  const handleTabPress = (index) => {
    setActiveTab(index);
  };

    const FetchProfile = async () => {
      const playerID = await SecureStore.getItemAsync('playerId');
      const token = await SecureStore.getItemAsync('token');  
      try {

        if (!playerID) {
          console.error('Player ID is not available');
          return;
        }
  
        const response = await axios.get(` https://rummy-apigateway-v1.onrender.com/api/user/get-user/${playerID}`,{
          headers:{
                              'Authorization': `Bearer ${token}`
          }
        });
  
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

  const handleSelectPool = (index) => {
    setPoolTab(index);
  };

      const openGame = (roomId) => {
        navigation.navigate('Game', { roomId });
      }
    
      const shuffleCards = async(roomId)=>{
    
        try {
          const response = await fetch(`https://rummy-apigateway-v1.onrender.com/api/room/shuffle-start/${roomId}`,{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
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
        try {
            const activeTabValue = (activeTab === 2 || activeTab === 6) ? 6 : 9;
            const response = await fetch(`https://rummy-apigateway-v1.onrender.com/api/cards/initialize-${activeTabValue}/${roomId}`,{
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
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
          const roomDetails = {
            roomSize: activeTab,
            roomType: 'Pool',
            gameMode: 'Practice',
            gameStatus: 'Waiting',
            pointValue: poolTab, 
            playerId: playerId,
            issuedPoint: 0, 
            // totalRounds: 1, 
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
    <View style={{flexDirection:'column',height:'80%',}}>
      {/* Tabs Container */}
      <Text style={{textAlign:'center',marginBottom:10}}>Select Players</Text>
      <View style={{display:'flex',flexDirection:'column',gap:20}}>
        <View style={{flexDirection:'row',justifyContent:'center'}}>
        <View style={styles.tabContainer}>
        {/* Tab 1 */}
        <TouchableOpacity
          style={[styles.tab, activeTab === 2 && styles.activeTab]}
          onPress={() => handleTabPress(2)}
        >
          <Text style={[styles.tabText, activeTab === 2 && styles.activeTabText]}>
           2
          </Text>
        </TouchableOpacity>

        {/* Tab 2 */}
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
  
      <View>
      <Text style={{textAlign:'center',marginBottom:10}}>Select Pool Game</Text>
      <View style={{flexDirection:'row',justifyContent:'center'}}>
      <View style={styles.tabContainer}>
        {/* Tab 1 */}
        <TouchableOpacity
          style={[styles.tab, poolTab === 101 && styles.activeTab]}
          onPress={() => handleSelectPool(101)}
        >
          <Text style={[styles.tabText, poolTab === 101 && styles.activeTabText]}>
           80
          </Text>
        </TouchableOpacity>

        {/* Tab 2 */}
        <TouchableOpacity
          style={[styles.tab, poolTab === 201 && styles.activeTab]}
          onPress={() => handleSelectPool(201)}
        >
          <Text style={[styles.tabText, poolTab === 201 && styles.activeTabText]}>
            160
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, poolTab === 301 && styles.activeTab]}
          onPress={() => handleSelectPool(301)}
        >
          <Text style={[styles.tabText, poolTab === 301 && styles.activeTabText]}>
            240
          </Text>
        </TouchableOpacity>
      </View>
      </View>

      </View>
      </View>
      {/* Content for active tab */}
<View style={{flexDirection:'row',justifyContent:'center',padding:30,width:'100%'}}>
{
profile?.chips ===0 ?
 <TouchableOpacity  style={styles.button}>
      <Text style={styles.buttonText}>ADD CHIPS</Text>

    </TouchableOpacity> :
    <TouchableOpacity style={styles.button} onPress={createRoom}>
      <Text style={styles.buttonText}>PLAY NOW</Text>

    </TouchableOpacity>}
</View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Container for tabs
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor:'#F2F7FE'
  },
  tab: {
        backgroundColor:'#F2F7FE',
height:55,
    paddingHorizontal: 24,
    borderRadius: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#621B98', // Green for active tab
  },
  tabText: {
    fontWeight: 'black',
    color: '#000',
    fontSize: 14, // Default text color
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 900, // White text for active tab
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
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff', // blue-500
    fontWeight: 'bold',

  },
});

export default FreePool;
