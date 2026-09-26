import React,{useState, useEffect}from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet,Animated,Dimensions,TouchableWithoutFeedback,Image,Modal } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Slider from '@react-native-community/slider';
import axios from "axios";
import { useNavigation } from '@react-navigation/native';
import { Checkbox } from 'react-native-paper'; 

const CreatePrivateRoom = ()=>{
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState(1); // Default active tab is 0
  const [poolTab, setPoolTab] = useState(80);
  const [playerTab, setPlayerTab] = useState(6);
  const [points,setPoints] = useState()
  const [sidebarVisible, setSidebarVisible] = useState(false);
       const [friends,setFriends] = useState()
       const [selectedFriends, setSelectedFriends] = useState([]);
  const [isChecked,setIsChecked] = useState(true)


  const [FriendsModal,showFriendsModal] = useState(false)
  const handleSelectPlayers = (index) => {
    setPlayerTab(index);
  };

  
  const toggleFriendSelection = (playerId) => {
    setSelectedFriends((prevSelected) => {
      if (prevSelected.includes(playerId)) {
        return prevSelected.filter((id) => id !== playerId); // Remove if already selected
      } else {
        return [...prevSelected, playerId]; // Add if not selected
      }
    });
  };

  
  const fetchFriends = async () => {
    const token = await SecureStore.getItemAsync('token');
    const playerId = await SecureStore.getItemAsync('playerId');
    try {
      const response = await axios.get(`https://rummy-apigateway-v1.onrender.com/api/request/get-friend-list?playerId=${playerId}&status=ACCEPTED`,{
        headers:{
          'Authorization':`Bearer ${token}`
        }
      });

      if (response.status === 200) {
        const data = response.data; // The response data should be in the `data` property
        setFriends(data);
        console.log('Profile data:', data); // You can log the profile data here
      } else {
        console.error('Failed to fetch profile', response.status);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(()=>{
  fetchFriends()
  },[])

  const pointValue = async (id) => {
    const token =  await SecureStore.getItemAsync('token');
    const playerID = await SecureStore.getItemAsync('playerId');
    try {

      if (!playerID) {
        console.error('Player ID is not available');
        return;
      }

      const response = await axios.get(`https://rummy-apigateway-v1.onrender.com/api/cards/get-points?playerCount=${playerTab}&type=Pool&defaultValue=${id ? id : 80}`,{
        headers:{
          'Authorization':`Bearer ${token}`
        }
      });

      if (response.status === 200) {
        const data = response.data; // The response data should be in the `data` property
        setPoints(data);
        console.log(points.pointValue.map((pv)=>pv.money))
      } else {
        console.error('Failed to fetch profile', response.status);

      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      console.log(token)
      console.log(id)
      console.log(playerTab)
    }
  };

  useEffect((id) => {
    pointValue(id? id : 80); // Call the function when the component mounts
  }, []);

   const [sliderValue, setSliderValue] = useState(0);
    // Define custom step values
    const customSteps = points?.pointValue ? points.pointValue.map((pv) => pv.money) : [];

    const pointValues = points?.pointValue ? points.pointValue.map((pv) => pv.pointValue) : [];
    // Handle slider change
    const handleSliderChange = (value) => {
      setSliderValue(value);
    };
  
    // Map slider value to corresponding custom step
    const getCurrentStepValue = () => customSteps[sliderValue];
  
    const getCurrentPointValue = () => pointValues[sliderValue];

    const openGame = (roomId) => {
      navigation.navigate('Game', {
        roomId: roomId,
      });
    };
    
      const shuffleCards = async(roomId)=>{
        const token =  await SecureStore.getItemAsync('token');
    
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
        const token =  await SecureStore.getItemAsync('token');
        const activeTabValue = (activeTab === 2 || activeTab === 6) ? 6 : 9;
          try {
            const response = await fetch(`https://rummy-apigateway-v1.onrender.com/api/cards/initialize-${activeTabValue}/${roomId}`,{
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
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

      const participantStatusList = selectedFriends.map(id => ({
        participantId: id
      }));
    
      const sendInvite = async(roomId)=>{
        const playerId = await SecureStore.getItemAsync('playerId');

        const token = await SecureStore.getItemAsync('token');
          const gameInvite = {
            "roomId" : roomId,
            "roomOwnerId" : playerId,
            "participantStatusList":participantStatusList
          };
          try {
            const response = await fetch(`https://rummy-apigateway-v1.onrender.com/api/room/send-invite`,{
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body:JSON.stringify(gameInvite),
            });
      
            console.log('Response status:', queryParams);
            console.log('Response headers:', response.headers);
            if (response.ok) {
              console.log(gameInvite)
              openGame(roomId);
             } else {
              console.log('Invalid credentials. Please try again.');
              console.log(gameInvite)
              }
            }
           catch (error) {
            console.log('Error submitting form:', error);
              console.log(gameInvite)
          }
      }
  
        const createRoom = async()=>{
        const playerId = await SecureStore.getItemAsync('playerId');

        const token = await SecureStore.getItemAsync('token');
          const roomDetails = {
            roomSize: playerTab,
            roomType: 'Pool',
            gameMode: 'Cash',
            gameStatus: 'Waiting',
            pointValue: getCurrentPointValue(), 
            playerId: playerId,
            issuedPoint: poolTab, 
            totalRounds: 1, 
            entryType: 'Money', 
            entryPrice: getCurrentStepValue(),
            visibility: 'Private',
          };
      
          const queryParams = new URLSearchParams(roomDetails).toString();
          try {
            const response = await fetch(`https://rummy-apigateway-v1.onrender.com/api/room/join-or-create-room?${queryParams}`,{
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }
            });

            
      
            console.log('Response status:', queryParams);
            console.log('Response headers:', response.headers);
            if (response.ok) {
              const Data = await response.json();
              const roomId = Data.roomId
              const gameStatus =Data.gameStatus
              sendInvite(roomId)
              if(gameStatus==='Waiting'){
                InitializeCards(roomId)
                shuffleCards(roomId)
              }
              openGame(roomId,selectedFriends);
             } else {
              console.log('Invalid credentials. Please try again.');
              }
            }
           catch (error) {
            console.log('Error submitting form:', error);
          }
        }

        const openMission = ()=>{
          navigation.navigate('Mission');
         }
         const openRefer = ()=>{
          navigation.navigate('Refer')
         }
         const openLobby = ()=>{
          navigation.navigate('Home');
         }
      
         const openRewards = ()=>{
          navigation.navigate('Rewards');
         }

        const incrementValue = () => {
          if (sliderValue < customSteps.length - 1) {
            setSliderValue(sliderValue + 1);
          }
        };
      
        const decrementValue = () => {
          if (sliderValue > 0) {
            setSliderValue(sliderValue - 1);
          }
        };

        const changeTab = (id)=>{
          setPoolTab(id);
          pointValue(id);
          setSliderValue(0)
        }

        const openSidebar = ()=>{
          navigation.navigate('Menu')
        }
      

        const back = ()=>{
          navigation.goBack()
        }

    return(
        <View style={{flex:1}}>
            <View style={{height:30}}>

            </View>
            <View style={{backgroundColor:'#621B98',height:'60',flexDirection:'row',alignItems:'center',paddingHorizontal:10}}>
                      <TouchableOpacity onPress={back} style={{ padding: 5 }}>
                        <Image source={require('./assets/back.png')} style={{ width: 20, height: 20 }} />
                      </TouchableOpacity>
              
                <Text style={{color:'#fff',fontSize:16,fontWeight:700,paddingHorizontal:20}}>Create Room</Text>
            </View>

                  {/* <View style={styles.tabContainer}>
                    <View style={{flexDirection:'row',backgroundColor:'#fff',borderRadius:8,backgroundColor:'#621B98'}}>
                    <TouchableOpacity
                      style={[styles.tab, activeTab === 0 && styles.activeTab]}
                      onPress={() => handleTabPress(0)}
                    >
                      <Text style={[styles.tabText, activeTab === 0 && styles.activeTabText]}>
                        Free
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.tab, activeTab === 1 && styles.activeTab]}
                      onPress={() => handleTabPress(1)}
                    >
                      <Text style={[styles.tabText, activeTab === 1 && styles.activeTabText]}>
                        Cash
                      </Text>
                    </TouchableOpacity>
                    </View>
                    <View></View>
            
                  </View> */}
            <View style={{flexDirection:'column',gap:20,paddingVertical:20}}>
            <Text>{playerTab}</Text>
                      <View style={{flexDirection:'column',gap:10}}>
                  <Text style={{textAlign:'center'}}>Select Players</Text>
                        <View style={{flexDirection:'row',justifyContent:'center'}}>
                          {/* Tab 1 */}
        
                          <TouchableOpacity
                            style={[styles.tabs, playerTab === 6 && styles.activeTab]}
                            onPress={() => handleSelectPlayers(6)}
                          >
                            <Text style={[styles.tabText, playerTab === 6 && styles.activeTabText]}>
                              6
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.tabs, playerTab === 9 && styles.activeTab]}
                            onPress={() => handleSelectPlayers(9)}
                          >
                            <Text style={[styles.tabText, playerTab === 9 && styles.activeTabText]}>
                              9
                            </Text>
                          </TouchableOpacity>
                        </View>
                  </View>
                  <View style={{flexDirection:'column',gap:10}}>
                  <Text style={{textAlign:'center'}}>Select Game</Text>
                        <View style={{flexDirection:'row',justifyContent:'center'}}>
                          {/* Tab 1 */}
                          <TouchableOpacity
                            style={[styles.tabs, poolTab === 80 && styles.activeTab]}
                            onPress={() => {changeTab(80)}}
                          >
                            <Text style={[styles.tabText, poolTab === 80 && styles.activeTabText]}>
                             80
                            </Text>
                          </TouchableOpacity>
                  
                          {/* Tab 2 */}
                          <TouchableOpacity
                            style={[styles.tabs, poolTab === 160 && styles.activeTab]}
                            onPress={() => {changeTab(160)}}
                          >
                            <Text style={[styles.tabText, poolTab === 160 && styles.activeTabText]}>
                              160
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.tabs, poolTab === 240 && styles.activeTab]}
                            onPress={() => {changeTab(240)}}
                          >
                            <Text style={[styles.tabText, poolTab === 240 && styles.activeTabText]}>
                              240
                            </Text>
                          </TouchableOpacity>
                        </View>
                  </View>
                  <View style={{flexDirection:'column',alignItems:'center'}}>
                    <Text style={{textAlign:'center'}}>Select Amount</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 10 }}>
        <View style={{ flexDirection: 'row', width: 'auto', gap: 20 }}>
          {/* <Text>Point value <Text style={{ fontSize: 16, fontWeight: '700' }}>₹ {getCurrentPointValue()}</Text></Text> */}
          <Text>Entry Fee <Text style={{ fontSize: 16, fontWeight: '700' }}>₹ {getCurrentStepValue()}</Text></Text>
        </View>
      </View>

      {/* Slider */}


      {/* Slider */}
      <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center',paddingVertical:10 }}>

      <TouchableOpacity onPress={decrementValue} style={{
    flexDirection: 'row',
    gap: 4,
    backgroundColor: '#621B98',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
  }}>
        <Text style={styles.buttonText}><Image style={{height:20,width:20}} source={require('./assets/sub.png')}/></Text>
      </TouchableOpacity>

      {/* Slider */}
      <View style={{width:'70%',flexDirection:'column'}}>

      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={customSteps.length - 1} // 0 to 8 for 9 custom steps
        value={sliderValue}
        onValueChange={handleSliderChange}
        step={1} // Step is 1 to only allow whole numbers (no intermediate values)
        minimumTrackTintColor="#621B98" // Color of the active part of the slider
        maximumTrackTintColor="#D3D3D3"
        thumbTintColor="#621B98" // Color of the inactive part of the slider
      />
      </View>
      

      {/* Increase Button */}
      <TouchableOpacity onPress={incrementValue} style={{
    flexDirection: 'row',
    gap: 4,
    backgroundColor: '#621B98',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
  }}>
        <Text style={styles.buttonText}><Image style={{height:20,width:20}} source={require('./assets/add.png')}/></Text>
      </TouchableOpacity>
    </View>
      
                      </View>
                  <View style={{flexDirection:'column',justifyContent:'center',width:"100%",alignItems:'center',gap:20}} >
                  <TouchableOpacity onPress={createRoom} style={styles.button}><Text style={{color:'#fff'}}>Create Room</Text></TouchableOpacity>
                  <TouchableOpacity onPress={()=>{showFriendsModal(true)}} style={styles.button}><Text style={{color:'#fff'}}>Select Friends</Text></TouchableOpacity>
                  </View>
                  <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                  {selectedFriends.map((selectedPlayers)=>(
                  <Image source={require('./assets/profile.png')} style={{width:36,height:36,borderRadius:50}} />
                  ))}
                  </View>
     
                  </View>
                      <View style={styles.bottomNavbar}>
                      <TouchableOpacity onPress={openLobby} style={styles.chips}>
                          <Image source={require('./assets/activelobby.png')} style={{width:36,height:36}} />
                            <Text style={[styles.bottomMenu,{color:'#621B98'}]}>Lobby</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={openRewards} style={styles.chips}>
                          <Image source={require('./assets/reward.png')} style={{width:36,height:36}} />
                          <Text style={styles.bottomMenu}>Rewards</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={openMission} style={styles.chips}>
                          <Image source={require('./assets/mission.png')} style={{width:36,height:36}} />
                            <Text style={styles.bottomMenu}>Mission</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={openRefer} style={styles.chips}>
                          <Image source={require('./assets/refer.png')} style={{width:36,height:36}} />
                            <Text style={{fontSize:12,fontWeight:800}}>Refer & Earn</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={openSidebar} style={styles.chips}>
                          <Image source={require('./assets/iconmenu.png')} style={{width:36,height:36}} />
                            <Text style={styles.bottomMenu}>Menu</Text>
                          </TouchableOpacity>
                        </View>
                                    <Modal visible={FriendsModal} transparent={true} animationType="fade" onRequestClose={() => showFriendsModal(false)}>
                                      <View style={styles.modalContainer}>
                                        <View style={styles.forgotPasswordPopup}>
                                          <Text style={{textAlign:'center'}}>My Friends</Text>
                                          <TouchableOpacity onPress={() => showFriendsModal(false)} style={{borderRadius:50,width:30,height:30,backgroundColor:'#F57171',flexDirection:'row',justifyContent:'center',alignItems:'center',position:'absolute',right:16,top:16}}>
                        <Image source={require('./assets/cancel.png')} style={{width:16,height:17}} />
                        </TouchableOpacity>
                        <View style={{flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center'}}>
  {friends?.map((friend, index) => {
    const isChecked = selectedFriends.includes(friend?.requesterId);
    return (
      <View key={index} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingVertical: 5}}>
        <View style={{flexDirection: 'row', gap: 5, alignItems: 'center'}}>
          <Image source={require('./assets/profile.png')} style={{width: 45, height: 45, borderRadius: 50}} />
          <Text style={{fontSize: 12, width: 80}}>{friend?.requesterId}</Text>
        </View>

        {/* Checkbox (you can also use react-native-paper's Checkbox if imported) */}

<Checkbox          
              status={isChecked ? 'checked' : 'unchecked'}
              onPress={() => {setIsChecked(!isChecked);toggleFriendSelection(friend?.requesterId)}} // Toggle checkbox when clicked
              color='#5CBE8F'
              marginLeft={-9}
            />


        
      </View>
    );
  })}
</View>

                                        </View>
                                      </View>
                                    </Modal>
                        
        </View>
    )
}

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
    zIndex: 999, 
  }, 
  slider: {
    width: '100%',
    height: 40,
  },
  markersContainer: {
    position: 'absolute',
    top: -8, // Adjust the position of markers above the slider
    width: '100%',
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },  
  forgotPasswordPopup: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    flexDirection:'column',
    gap:20,
position:'relative',
    width: 300,
    height:330
  },
  marker: {
    width: 6,
    height: 6,
    backgroundColor: '#621B98', // Color of the marker
    borderRadius: 3,
    position: 'absolute',
    top: 15, // Positioning markers at a reasonable place above the slider
  },
  tabs: {
    paddingVertical:18,
    paddingHorizontal:24,
    borderRadius:8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#fff',

  },
  inputField:{
    width:'50%',
    borderBottomWidth:1,
    borderColor:'#000'
    },
  dimBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay with 50% opacity
    zIndex: 998,
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 10,
    width:'100%',
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
    width:'50%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius:8
  },
  activeTab: {
    backgroundColor: '#621B98',
     // Green for active tab
  },
  tabText: {
    fontWeight: 'bold',
    color: '#000',
    fontSize: 14 // Default text color
  },

  activeTabText: {
    color: '#fff',
    fontWeight: 800 // White text for active tab
  },
  banner: {
    height: 180,
    backgroundColor: '#621B98'
  },
  bottomNavbar: {
    position: 'absolute', 
    bottom: 0,             // Stick to the bottom
    left: 0,     
    right: 0,              // Align to the right
    backgroundColor: '#fff', // Background color for the navbar
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
    justifyContent:'center',
    width:120,
    backgroundColor: '#621B98',
    paddingVertical: 12,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff', // blue-500
    fontWeight: 'bold',
  },
});

export default CreatePrivateRoom;