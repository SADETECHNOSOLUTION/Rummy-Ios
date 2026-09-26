import React,{useState,useEffect}from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet,Animated,Dimensions,TouchableWithoutFeedback,Modal,Image,FlatList, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import Header from "./header";

const PrivateRoom = ()=>{
  const navigation = useNavigation();
     const [findFriendsModal,showfindFriendsModal] = useState(false)
     const [FriendsModal,showFriendsModal] = useState(false)
     const [open,setOpen] = useState(false)
     const [mail,setMail] = useState()
     const [phone,setPhone] = useState()
     const [playerID,setPlayerID] = useState()
     const [search,setSearch] = useState()
     const [requests,setRequests] = useState()
     const [friends,setFriends] = useState()
     const [profileInfo,setProfileInfo] = useState(false)
     const [ profile,setProfile] = useState()
     const [inviteModal,showInviteModal] = useState(false)
     const [invite,setInvite] = useState()
     const [game,setGame] = useState();
     const [isModalVisible, setIsModalVisible] = useState(false);
     const [inputRoomId,SetInputRoomId] = useState()

  const openCreateRoom = () => {
    navigation.navigate('CreatePrivateroom');
  };

  const openProfile = (id)=>{
    setProfileInfo(true)
    getProfile(id)
    FetchGame(id)
  }

const joinRoom = async () => {
    const playerId = await SecureStore.getItemAsync('playerId');
    const roomID = roomId;
    try {
      const response = await fetch(`https://rummy-apigateway-v1.onrender.com/api/room/update-9/${roomID}?playerId=${playerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      });
    
      if (response.ok) {
        const Data = await response.json();
        const roomId = Data.roomId;
        const gameStatus = Data.gameStatus;
        if (gameStatus === 'Waiting') {
          // Assuming these functions exist globally in your context
          // InitializeCards(roomId);
          // shuffleCards(roomId);
        }
        setIsModalVisible(false); // Close modal on success
        openGame(roomId);
      } else {
        console.log('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.log('Error submitting form:', error);
    }
  };


  const FetchProfile = async () => {
    const token = await SecureStore.getItemAsync('token');
    try {


      const response = await axios.get(`https://rummy-apigateway-v1.onrender.com/api/user/search-and-get-user?idOrEmailOrPhone=${mail && mail || phone && phone || playerID && playerID} `,{
        headers:{
          'Authorization':`Bearer ${token}`
        }
      });

      if (response.status === 200) {
        const data = response.data; // The response data should be in the `data` property
        setSearch(data);
        console.log('Profile data:', data); // You can log the profile data here
      } else {
        console.error('Failed to fetch profile', response.status);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const FetchGame = async (id) => {
    const playerID = await SecureStore.getItemAsync('playerId');
   const token = await SecureStore.getItemAsync('token');

    try {
      if (!playerID) {
        console.error('Player ID is not available');
        return;
      }
      
      const response = await axios.get(`https://rummy-apigateway-v1.onrender.com/api/room/get-room-details/player-last-ten-match?playerId=${id}`,{
        headers:{
          'Authorization':`Bearer ${token}`
        }
      });

      if (response.status === 200) {
        const data = response.data; // The response data should be in the `data` property
        setGame(data);
        console.log('Profile data:', data); // You can log the profile data here
      } else {
        console.error('Failed to fetch profile', response.status);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };
  
  const getProfile = async (playerId) => {
    const token = await SecureStore.getItemAsync('token');
    try {
      // Ensure the player ID is being retrieved properly
      if (!playerId) {
        console.error('Player ID is not available');
        return;
      }
  
      // Make the API request using fetch
      const response = await fetch(`https://rummy-apigateway-v1.onrender.com/api/user/get-user/${playerId}`,{
        headers:{
          'Authorization':`Bearer ${token}`,
        }
      });
  
      // Check if the response is successful
      if (response.ok) {
        const data = await response.json(); // Parse the JSON data
        setProfile(data);
        console.log(data); // You can log the profile data here
      } else {
        console.error('Failed to fetch profile', response.status);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const acceptFriends = async (id) => {
    const token = await SecureStore.getItemAsync('token');
    const playerId = await SecureStore.getItemAsync('playerId');
    try {
      // Using fetch for PUT request
      const response = await fetch(`https://rummy-apigateway-v1.onrender.com/api/request/update-status?id=${id}&status=ACCEPTED`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        const data = response.data; // The response data should be in the `data` property
        fetchRequests()
        fetchFriends()
        console.log('Profile data:', data); // You can log the profile data here
      } else {
        console.error('Failed to update status', response.status);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const denyInvite = async (roomId) => {
    const token = await SecureStore.getItemAsync('token');
    const playerId = await SecureStore.getItemAsync('playerId');
    try {
      // Using fetch for PUT request
      const response = await fetch(`https://rummy-apigateway-v1.onrender.com/api/room/update-invitation-status?roomId=${roomId}&playerId=${playerId}&inviteStatus=REJECTED`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        const data = response.data; // The response data should be in the `data` property
        fetchInvite()
      console.log('Profile data:', data); // You can log the profile data here
      } else {
        console.error('Failed to update status', response.status);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const acceptInvite = async (roomId) => {
    const token = await SecureStore.getItemAsync('token');
    const playerId = await SecureStore.getItemAsync('playerId');
    try {
      // Using fetch for PUT request
      const response = await fetch(`https://rummy-apigateway-v1.onrender.com/api/room/update-invitation-status?roomId=${roomId}&playerId=${playerId}&inviteStatus=ACCEPTED`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        const data = response.data; // The response data should be in the `data` property
        fetchInvite()
       navigation.navigate('Game',roomId)
      console.log('Profile data:', data); // You can log the profile data here
      } else {
        console.error('Failed to update status', response.status);
        console.log(roomId,playerId)
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
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

  const removeFriends = async (id) => {
    const token = await SecureStore.getItemAsync('token');
    const playerId = await SecureStore.getItemAsync('playerId');
    try {
      // Using fetch for PUT request
      const response = await fetch(`https://rummy-apigateway-v1.onrender.com/api/request/remove-friend?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        const data = response.data; // The response data should be in the `data` property
        fetchRequests()
        fetchFriends()
        console.log('Profile data:', data); // You can log the profile data here
      } else {
        console.error('Failed to update status', response.status);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };
  
  const cancelFriends = async (id) => {
    const token = await SecureStore.getItemAsync('token');
    const playerId = await SecureStore.getItemAsync('playerId');
    try {


      const response = await fetch(`https://rummy-apigateway-v1.onrender.com/api/request/update-status?id=${id}&status=REJECTED`,{
        method:'PUT',
        headers:{
          'Authorization':`Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = response.data; // The response data should be in the `data` property
        fetchRequests()
        fetchFriends(

        )
        console.log('Profile data:', data); // You can log the profile data here
      } else {
        console.error('Failed to fetch profile', response.status);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchRequests = async () => {
    const token = await SecureStore.getItemAsync('token');
    const playerId =await SecureStore.getItemAsync('playerId');
    try {
      const response = await axios.get(`https://rummy-apigateway-v1.onrender.com/api/request/request-list?acceptorId=${playerId} `,{
        headers:{
          'Authorization':`Bearer ${token}`
        }
      })
      if (response.status === 200) {
        const data = response.data; // The response data should be in the `data` property
        setRequests(data);
        console.log('Profile data:', data); // You can log the profile data here
      } else {
        console.error('Failed to fetch profile', response.status);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleChange = (field, value) => {
    if (field === 'Email') {
      setMail(value);
    } else if (field === 'PlayerID') {
      setPlayerID(value);
    } else if (field === 'Phonenumber') {
      setPhone(value);
    }
  };

  const handleFindFriends = ()=>{
    showfindFriendsModal(true)
  }

  const handleFriends = ()=>{
    showFriendsModal(true)
    fetchRequests()
    fetchFriends()
  }

  const fetchInvite = async () => {
    const token = await SecureStore.getItemAsync('token');
    const playerId =await SecureStore.getItemAsync('playerId');
    try {
      const response = await axios.get(`https://rummy-apigateway-v1.onrender.com/api/room/invitation?playerId=${playerId}&inviteStatus=INVITED`,{
        headers:{
          'Authorization':`Bearer ${token}`
        }
      })
      if (response.status === 200) {
        const data = response.data; // The response data should be in the `data` property
        setInvite(data);
        console.log('Profile data:', data); // You can log the profile data here
      } else {
        console.error('Failed to fetch Invite', response.status);
      }
    } catch (error) {
      console.error('Error fetching Invite:', error);
    }
  };

  const handleInvite = ()=>{
    showInviteModal(true)
    fetchInvite()
  }

        const sendRequest = async (id) => {
          const playerId = await SecureStore.getItemAsync('playerId')
          const token = await SecureStore.getItemAsync('token')
          const FriendRequest = {
            requesterId:playerId,
            acceptorId:id
          }
           try {
             const response = await fetch('https://rummy-apigateway-v1.onrender.com/api/request/send-request',{
               method: 'POST',
               headers:{
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${token}`
               },
               body:JSON.stringify(FriendRequest),
             });
       
             console.log('Response status:', response.status);
             console.log('Response headers:', response.headers);
             const data = await response.json();

               if (response.ok) {
                 const data = await response.json();
                  fetchFriends()
               } else {
               setError(data.error);
               console.error('Error submitting form:', error);
               }
             }
            catch (error) {
             console.error('Error submitting form:', error);
           }
         };

         const fetchCopiedText = async () => {
    const text = await Clipboard.getString();
    SetRoomId(text);
  };

  const openJoinRoom = () => {
    // Navigate and pass the tournament ID as a parameter
    navigation.navigate('JoinPrivateroom');
  };

  const [selectedItem, setSelectedItem] = useState('Select an option');

  const data = [
    { id: 1, label: 'Email' },
    { id: 2, label: 'Phonenumber' },
    { id: 3, label: 'PlayerID' },
  ];

     const openLobby = ()=>{
    navigation.navigate('Lobby');
   }
  
const handleSelectItem = (item) => {
  setSelectedItem(item.label);
  setOpen(false);
};
  
  useEffect(() => {
    fetchFriends();
  }, []);

    return(
      <View>



      <View style={styles.container}>
        <View style={{position:'absolute',top:5,flexDirection:'row',justifyContent:'center'}}>
        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',backgroundColor:'#fff',width:'100%',paddingHorizontal:40}}>

        <TouchableOpacity onPress={handleFindFriends} style={{flexDirection:'row',alignItems:'center',justifyContent:'center',height:40,}}>
        <Text style={{fontSize:12}}>Find Friends</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleFriends} style={{flexDirection:'row',alignItems:'center',justifyContent:'center',height:40,}}>
          <Text style={{fontSize:12}}>My Friends</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleInvite} style={{flexDirection:'row',alignItems:'center',justifyContent:'center',height:40,}}>
          <Text style={{fontSize:12}}>Game Invite</Text>
        </TouchableOpacity>
        </View>
        </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={openCreateRoom} style={styles.button}>
          <Text style={styles.buttonText}>Create a room</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsModalVisible(true)} style={styles.joinbutton}>
          <Text style={styles.joinbuttonText}>Join a room</Text>
        </TouchableOpacity>
      </View>
            <Modal visible={findFriendsModal} transparent={true} animationType="fade" onRequestClose={() => showfindFriendsModal(false)}>
              <View style={styles.modalContainer}>
              <View style={styles.forgotPasswordPopup}>
              <Text style={{textAlign:'center'}}>Find Friends</Text>
                  <TouchableOpacity onPress={() => showfindFriendsModal(false)} style={{borderRadius:50,width:30,height:30,backgroundColor:'#F57171',flexDirection:'row',justifyContent:'center',alignItems:'center',position:'absolute',right:16,top:16}}>
<Image source={require('./assets/cancel.png')} style={{width:16,height:17}} />
</TouchableOpacity>

      <View style={styles.selectButtonContainer}>
        <TouchableOpacity
          onPress={() => setOpen(!open)}  // Toggle open state on press
          style={styles.selectButton}
        >
          <Text style={styles.selectButtonText}>{selectedItem}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setOpen(!open)}  style={{flexDirection:'row',alignItems:'center',justifyContent:'center',width:40}}>
        <Image source={require('./assets/down.png')} style={{width:25,height:25,borderRadius:50}} />
        </TouchableOpacity>
      </View>

      {open && (
        <View style={styles.overlay}>
          <View style={styles.dropdownContainer}>
            {data.map((item) => (
              <View key={item.label} style={styles.dropdownItemContainer}>
                <TouchableOpacity
                  style={[
                    styles.dropdownItem,
                    selectedItem === item.label && styles.selectedItem,
                  ]}
                  onPress={() => handleSelectItem(item)}
                >
                  <Text>{item.label}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )}

      {selectedItem === 'Email' && (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput id="Email"
            style={styles.input}
            onChangeText={(value) => handleChange('Email', value)}
            placeholder="Enter your Email"
            value={mail}
            required
            // onFocus={() => setIsMobileFocused(true)}
            // onBlur={() => setIsMobileFocused(false)}
          />
        </View>
      )}

      {selectedItem === 'PlayerID' && (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>PlayerID</Text>
          <TextInput id="PlayerID"
            style={styles.input}
            onChangeText={(value) => handleChange('PlayerID', value)}
            placeholder="Enter your Player ID"
            required
            value={playerID}
            // onFocus={() => setIsMobileFocused(true)}
            // onBlur={() => setIsMobileFocused(false)}
          />
        </View>
      )}

      {selectedItem === 'Phonenumber' && (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>PhoneNumber</Text>
          <TextInput id="Phonenumber"
            style={styles.input}
            onChangeText={(value) => handleChange('Phonenumber', value)}
            placeholder="Enter your PhoneNumber"
            keyboardType="phone-pad"
            maxLength={10}
            required
            value={phone}
          />
        </View>
      )}

      <TouchableOpacity onPress={FetchProfile} style={styles.searchButton}>
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>

      {search &&<View style={{padding:10,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
        <View>
        <Text style={{fontWeight:600}}>{search?.name ? search.name : 'Unknown'}</Text>
        <Text style={{fontSize:12}}>{search?.playerId}</Text>
          </View>
          {!requests?.some(request => request.requesterId || request.acceptorId === search?.playerId) ? 
  <TouchableOpacity 
    onPress={() => { sendRequest(search?.playerId); }} 
    style={{ 
      backgroundColor: '#621B98', 
      width: 60, 
      height: 30, 
      borderRadius: 5, 
      justifyContent: 'center', 
      alignItems: 'center', 
      flexDirection: 'row' 
    }}
  >
    <Image source={require('./assets/add.png')} style={{ width: 15, height: 15 }} />  
    <Text style={{ color: '#fff' }}>Add</Text>
  </TouchableOpacity> : <TouchableOpacity 
    onPress={() => { sendRequest(search?.playerId); }} 
    style={{ 
      backgroundColor: '#fff', 
      width: 60, 
      height: 30, 
      borderRadius: 5, 
      borderWidth:1,
      justifyContent: 'center', 
      alignItems: 'center', 
      flexDirection: 'row' 
    }}
  >
    <Text style={{ color: '#000' }}>Sent</Text>
  </TouchableOpacity>
}

      </View>}
    </View>
               
              </View>
            </Modal>

            <Modal visible={FriendsModal} transparent={true} animationType="fade" onRequestClose={() => showFriendsModal(false)}>
              <View style={styles.modalContainer}>
                <View style={styles.forgotPasswordPopup}>
                  <Text style={{textAlign:'center'}}>My Friends</Text>
                  <TouchableOpacity onPress={() => showFriendsModal(false)} style={{borderRadius:50,width:30,height:30,backgroundColor:'#F57171',flexDirection:'row',justifyContent:'center',alignItems:'center',position:'absolute',right:16,top:16}}>
<Image source={require('./assets/cancel.png')} style={{width:16,height:17}} />
</TouchableOpacity>
              <View style={{flexDirection:'column',justifyContent:'space-between',alignItems:'center',}}>
  {requests?.filter(request=>request.status === 'PENDING').map((request)=>(<View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',width:'100%'}}> 
  <View style={{flexDirection:'row',gap:5,alignItems:'center'}}>
        <Image source={require('./assets/profile.png')} style={{width:45,height:45,borderRadius:50}} />
        <Text style={{fontSize:12,width:80}}>{request?.requesterId}</Text>
          </View>
          <View style={{flexDirection:'row',gap:10}}>
          <TouchableOpacity onPress={()=>{cancelFriends(request?.id)}} style={{borderRadius:50,width:30,height:30,backgroundColor:'#8e97a4',flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
<Image source={require('./assets/cancel.png')} style={{width:16,height:17}} />
</TouchableOpacity>
<TouchableOpacity onPress={()=>{acceptFriends(request?.id)}} style={{borderRadius:50,width:30,height:30,backgroundColor:'#621B98',flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
<Image source={require('./assets/confirm.png')} style={{width:20,height:20}} />
</TouchableOpacity>

</View>
    </View>))}

      </View>
      <View style={{flexDirection:'column',justifyContent:'space-between',alignItems:'center',}}>
  {friends?.map((friend)=>(<View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',width:'100%'}}> 
  <View style={{flexDirection:'row',gap:5,alignItems:'center'}}>
        <Image source={require('./assets/profile.png')} style={{width:45,height:45,borderRadius:50}} />
        <Text style={{fontSize:12,width:80}}>{friend?.requesterId}</Text>
          </View>

<View style={{flexDirection:'row',alignItems:'center',gap:10}}>
<TouchableOpacity onPress={()=>{openProfile(friend?.requesterId)}} style={{width:30,height:30,backgroundColor:'#3B82F6',flexDirection:'row',alignItems:'center',justifyContent:'center',borderRadius:50}}>
<Image source={require('./assets/eye.png')} style={{width:20,height:20,borderRadius:50}} />
</TouchableOpacity>
<TouchableOpacity onPress={()=>{removeFriends(friend?.id)}} style={{width:30,height:30,flexDirection:'row',alignItems:'center',justifyContent:'center', backgroundColor:'#F57171',borderRadius:50}}>
<Image source={require('./assets/delete.png')} style={{width:20,height:20,borderRadius:50}} />
</TouchableOpacity>
  </View>

    </View>))}

      </View>
                </View>
              </View>
            </Modal>

            <Modal visible={profileInfo} transparent={true} animationType="fade" onRequestClose={() => setProfileInfo(false)}>
              <View style={styles.modalContainer}>
                <View style={{flexDirection:"column",backgroundColor:'#fff',position:'relative',
    width: 300,
    height:330,gap:10,padding:20,borderRadius:10}}>
      <View style={{flexDirection:'row',gap:16,alignItems:"center"}}> 
      <View style={{flexDirection:'row',justifyContent:"center"}}>
                 {profile?.imagePath ?<Image  source={{ uri: `https://rummy-apigateway-v1.onrender.com/api/user${profile?.imagePath}` }}style={{width:75,height:75,}} /> : <Image  source={{ uri: `https://rummy-apigateway-v1.onrender.com/api/user/uploads/1f970b43-bb9c-4868-9e50-a4456fb240d3_avatar4.png` }}style={{width:75,height:75,}} />}
                  </View>
                  <View style={{borderWidth:2,height:60,borderRadius:10,padding:10,width:'65%',borderColor:'#EAE8E8'}}>
<Text style={{fontSize:16,fontWeight:800}}>{profile?.name}</Text>
<Text style={{fontSize:10}}>{profile?.playerId}</Text>
                  </View>
      </View>
<Text style={{fontWeight:800}}>Last 10 Games</Text>
                  <ScrollView style={{flexDirection:'column',gap:5,height:80,}}>
                    {game?.map((games)=>(
                        <View style={{height:60,borderRadius:10,borderWidth:1,padding:10,marginBottom:10,backgroundColor:'#621B98'}}>
                          <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                          <View style={{flexDirection:'row',gap:10}}> 
                          <Text style={{fontWeight:800,color:'#fff'}}>{games?.gameMode}</Text>
                            </View>
                            <View style={{flexDirection:'row',alignItems:'center',gap:5}}>
                              <Image style={{width:20,height:20}} source={require('./assets/friendsactive.png')}/>
                              <Text style={{color:'#fff'}}>{games?.roomSize}</Text>
                            </View>
                          </View>
                          <View style={{flexDirection:'row',gap:10}}> 
                          <Text style={{color:'#fff'}}>{games?.roomType}</Text>
                          <Text style={{color:'#fff'}}>₹ {games?.entryPrice}</Text>
                            </View>
          
                          </View>
                      ))
                    }
                  </ScrollView>
                </View>
              </View>
            </Modal>
            <Modal visible={inviteModal} transparent={true} animationType="fade" onRequestClose={() => showInviteModal(false)}>
              <View style={styles.modalContainer}>
                <View style={{flexDirection:"column",backgroundColor:'#fff',position:'relative',
    width: 300,
    height:330,gap:10,padding:20,borderRadius:10}}>
        <Text style={{textAlign:'center',fontWeight:800,paddingBottom:10}}>Game Invites</Text>
        <TouchableOpacity onPress={() => showInviteModal(false)} style={{borderRadius:50,width:30,height:30,backgroundColor:'#F57171',flexDirection:'row',justifyContent:'center',alignItems:'center',position:'absolute',right:16,top:16}}>
<Image source={require('./assets/cancel.png')} style={{width:16,height:17}} />
</TouchableOpacity>
                  <ScrollView style={{flexDirection:'column',gap:5,height:80,}}>
                
                    {invite?.map((invites)=>(
                        <View key={invites?.id} style={{height:100,borderRadius:10,borderWidth:1,padding:10,marginBottom:10,backgroundColor:'#621B98',flexDirection:'column',justifyContent:"space-between",}}>
                   
                              <View style={{flexDirection:'column',gap:5}}>
                              <Text style={{color:'#fff'}}>{invites?.roomOwnerName} invited you to play Deal</Text>
                                <View style={{flexDirection:'row',gap:10,alignItems:'center'}}>
                                <View>
                              <Text style={{color:'#fff',fontSize:12}}>₹ {invites?.entryPrice}</Text>
                            </View>
                     <Text style={{color:'#fff'}}>|</Text>
                                <View style={{flexDirection:'row',alignItems:'center',gap:5}}>
                                <Image source={require('./assets/friendsactive.png')} style={{width:15,height:15,borderRadius:50}} />
                                <Text style={{color:'#fff',fontSize:12}}>{invites?.roomSize} Players</Text>
                                </View>
                                <Text style={{color:'#fff'}}>|</Text>
                            <View>
                              <Text style={{color:'#fff',fontSize:12}}>{invites?.issuedPoint} Point</Text>
                            </View>
                            </View>
                              {/* <Text style={{color:'#fff',fontSize:10}}>#{invites?.roomId}</Text> */}
                              </View>
 
             <View style={{flexDirection:'row',justifyContent:"space-between"}}>
             <TouchableOpacity onPress={()=>{denyInvite(invites?.roomId)}} style={[{width:'40%'},styles.denybutton]}>
<Text style={{fontWeight:800}}>Deny</Text>
                </TouchableOpacity>
             <TouchableOpacity onPress={()=>{acceptInvite(invites?.roomId)}} style={[{width:'40%'},styles.playbutton]}>
<Text style={{fontWeight:800}}>Join</Text>
                </TouchableOpacity>

             </View>

     
                          </View>
                      ))
                    }
                  </ScrollView>
                </View>
              </View>
            </Modal>
            <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Enter Room ID</Text>
                
                {/* Input Container holding the icon and input field together */}
                <View style={styles.inputWrapper}>
                  <TouchableOpacity onPress={fetchCopiedText} style={styles.pasteIconContainer}>
                    <Text style={{ fontSize: 18 }}>📋</Text> 
                  </TouchableOpacity>
                  
                  <TextInput
                    keyboardType="numeric"
                    placeholder="Paste Room ID here..."
                    maxLength={24}
                    value={inputRoomId}
                    onChangeText={SetInputRoomId}
                    style={styles.modalInputField}
                    placeholderTextColor="#A1A1A1"
                  />
                </View>

                {/* Modal Actions */}
                <View style={styles.modalButtonGroup}>
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.cancelButton]} 
                    onPress={() => setIsModalVisible(false)}
                  >
                    <Text style={{ color: '#7a7a7a', fontWeight: 'bold' }}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.modalButton, styles.joinButton]} 
                    onPress={joinRoom}
                  >
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>Join</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
          </View>
    )
}

const styles = StyleSheet.create({
  container: {
    height:'80%',
    position:'relative',
    justifyContent: 'center', // Vertically centers the content
    alignItems: 'center',      // Horizontally centers the content
  },
  buttonContainer: {
    flexDirection:'column',
  alignItems: 'center',  // Ensures buttons are centered horizontally
    justifyContent: 'center',
    gap:40
  },
  joinbutton:{
    backgroundColor: '#621B98',
    height:45,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    width:150,
    borderRadius: 10,
  },
  input: {
    paddingHorizontal: 10, 
    paddingVertical: 10,   
    fontSize: 14,     
    borderWidth: 1,
    width:260,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  joinbuttonText: {
    color: '#fff',          // Text color
    fontSize: 16,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#621B98', // Button color
    height:45,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    width:150,
    borderRadius: 10,
  },
  playbutton: {
    backgroundColor: '#FDC939', // Button color
    paddingHorizontal:20,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    borderRadius: 5,
    height:30
  },
  denybutton: {
    backgroundColor: '#fff', // Button color
    paddingHorizontal:20,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    borderRadius: 5,
    height:30
  },
  buttonText: {
    color: '#fff',          // Text color
    fontSize: 16,
    textAlign: 'center',
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
  mainCard: {
    flexDirection: 'column',
    gap: 20,
    paddingVertical: 30,
    backgroundColor: '#fff',
    width: '85%',
    borderRadius: 10,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333'
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: 150,
    backgroundColor: '#621B98',
    paddingVertical: 14,
    borderRadius: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',

    borderRadius: 8,
    width: '100%',
    borderWidth:1,
    height: 50,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  pasteIconContainer: {
    paddingRight: 10,
    borderRightWidth: 1,
    borderRightColor: '#E2D9EC',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  modalInputField: {
    flex: 1,
    height: '100%',
    paddingLeft: 10,
    color: '#F2F7FE',
    fontSize: 15,
  },
  modalButtonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#8b8b8b',
  },
  joinButton: {
    backgroundColor: '#621B98',
  },
  selectButtonContainer: {
    borderWidth: 1,
    height: 40,
    width: 260,
    flexDirection:'row',
    borderRadius: 5,
  },
  selectButton: {
    padding: 10,
    width: 220,
  },
  selectButtonText: {
    color: '#000',
  },
  overlay: {
    position: 'absolute', // Makes the dropdown appear over the other content
    top: 100, // Adjust based on the button position
    left: 0,
    right: 0,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    zIndex: 999, // Ensure the dropdown is above other elements
  },
  dropdownContainer: {
    borderRadius: 5,
    marginTop: 5, // Adjust spacing from the select button
    width: '100%',
    alignItems:"center",
    justifyContent:'center',
    borderRadius:50,
  },
  dropdownItemContainer: {
    width: 260,
    // borderBottomWidth:1,
    borderBottomColor:'#C4C4C4',
    backgroundColor:'#fff'
  },
  dropdownItem: {
    flexDirection: 'row',
    width:"100%",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth:1,
    borderBottomColor:'#C3C3C3'
  },
  selectedItem: {
    backgroundColor: '#ddd', // Highlight the selected item
  },
  inputContainer: {
    flexDirection: 'column',
    gap: 5,
    width: '100%',
  },
  label: {
    fontWeight: '500',
  },
  searchButton: {
    width: '100%',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#621B98',
    borderRadius: 10,
  },
  searchButtonText: {
    color: '#fff',
  },
});

export default PrivateRoom;