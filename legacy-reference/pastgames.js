import React,{useState,useRef,useEffect} from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, TouchableWithoutFeedback, Modal, Animated,Dimensions } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from 'expo-secure-store';

const PastGames = () => {
    const navigation = useNavigation()
       const dimAnim = useRef(new Animated.Value(0)).current; 
       const sidebarAnim = useRef(new Animated.Value(Dimensions.get('window').width)).current;
       const [profile,setProfile] = useState();
       const [games,setGames] = useState()
       const [selectedOption, setSelectedOption] = useState('point');
       const [selectedTab, setSelectedTab] = useState('Point');

       const [selectedPlayers, setSelectedPlayers] = useState('2');
       const handlePress = (option) => {
         setSelectedOption(option);
       };


      const [filterVisible,setFilterVisible] = useState(false)
    const slideAnimProfile = new Animated.Value(0);
      const dimAnimProfile = useRef(new Animated.Value(0)).current;
        const openProfile = () => {
                if (filterVisible) {
                  // Close the sidebar
                  Animated.timing(slideAnimProfile, {
                    toValue: Dimensions.get('window').width, // Move sidebar off-screen
                    duration: 300,
                    useNativeDriver: true,
                  }).start();
                  // Fade out the dim background
                  Animated.timing(dimAnimProfile, {
                    toValue: 0, // Fade out the dim background
                    duration: 300,
                    useNativeDriver: true,
                  }).start();
       
                } else {
                  // Open the sidebar
                  Animated.timing(slideAnimProfile, {
                    toValue: 0, // Slide sidebar in
                    duration: 300,
                    useNativeDriver: true,
                  }).start();
                  // Fade in the dim background
                  Animated.timing(dimAnimProfile, {
                    toValue: 0.5, // Dim the background to 50% opacity
                    duration: 300,
                    useNativeDriver: true,
                  }).start();
       
                }
                setFilterVisible(! filterVisible); // Toggle the state
              };
      
              const closeProfile = () => {
        
               // Close the sidebar
               Animated.timing(sidebarAnim, {
                 toValue: Dimensions.get('window').width, // Move sidebar off-screen
                 duration: 300,
                 useNativeDriver: true,
               }).start();
             
               // Fade out the dim background
               Animated.timing(dimAnimProfile, {
                 toValue: 0, // Fade out the dim background
                 duration: 300,
                 useNativeDriver: true,
               }).start();
             
               // Reset the profile visibility state
               setFilterVisible(false);// Make sure dim is hidden
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
        'Authorization':`Bearer ${token}`
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


  const FetchGames = async () => {
    const playerID = await SecureStore.getItemAsync('playerId');
    const token = await SecureStore.getItemAsync('token');

    try {

      if (!playerID) {
        console.error('Player ID is not available');
        return;
      }

      const response = await fetch(`https://rummy-apigateway-v1.onrender.com/api/room/player-games?playerId=${playerID}&roomSize=${selectedPlayers}&roomType=${selectedTab}&issuedPoint=0`,{
        headers:{
        'Authorization':`Bearer ${token}`
        }

      });

      if (response.ok) {
        const data = await response.json();
        setGames(data);
        console.log(data)
      } else {
        console.error('Failed to fetch profile', response.status);
        console.log(token)
        console.log(selectedTab)
        console.log(selectedPlayers)
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      console.log(token)

    }
  };
 
  useEffect(() => {
    FetchGames()
  }, []);

  const openGame = (GameroomId)=>{
    navigation.navigate('GameDetails', { GameroomId });
  }

   return (
     <View style={{position:'relative'}}>
     <View style={styles.show}>
 
     </View>

     <View style={styles.container}>

       <TouchableOpacity style={{padding:5}} onPress={() => navigation.goBack()} >
    <Image source={require('./assets/back.png')} style={styles.profileImage} />
       </TouchableOpacity>

    <Text style={{color:'#fff',fontSize:16,fontWeight:800}}>Past Games</Text>
     </View>
     <View style={{height:'85%',flexDirection:'column',gap:10,marginTop:10}}>

    
 <View style={{flexDirection:'column',gap:5}}>
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:20,paddingVertical:10}}>
            <Text style={{textAlign:'center',fontSize:14,fontWeight:800}}></Text>
       <TouchableOpacity onPress={openProfile} style={{flexDirection:'row'}}>
            <Image style={{width:20,height:20}} source={require('./assets/filter.png')}  />
            <Text style={{textAlign:'center',fontSize:14}}>Filter</Text>
            </TouchableOpacity>
                </View>

            <View style={{flexDirection:'column',gap:4,paddingHorizontal:20}}>

            {games?.map((game)=>{

              const date = new Date(game.roomCreatedAt);

              // Use toLocaleDateString to format the date
              const formattedDate = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              });
              return(
  game && <TouchableOpacity onPress={()=>{openGame(game.roomId)}}>
  <View style={styles.Transactioncard}>
  <View style={styles.cardposition}>
  <View style={styles.cardHeading}>
  <Text>{game.roomType}</Text>
  <Text>|</Text>
  <Text>{game.roomSize} Players</Text>
  <Text>|</Text>
  <Text>Entry ₹{game.entryPrice}</Text>
  </View>
<View style={{flexDirection:"row",gap:10,justifyContent:"center"}}>
<Text style={{fontSize:10}}>#{game.roomId}</Text>
<Text style={{fontSize:10}}>-</Text>
<Text style={{fontSize:10}}>{formattedDate}</Text>
</View>
  </View>
  <View style={{height:64,backgroundColor:'#5CBE8F',position:"absolute",right:0,borderTopRightRadius:5,borderBottomRightRadius:5,width:80,flexDirection:'row',alignItems:'center',justifyContent:"center"}}>
    <Text style={{color:'#fff',fontSize:12,fontWeight:800}}>Won ₹20</Text>
  </View>
</View>
</TouchableOpacity>
            )})}
        
        </View>
            </View>
        

     </View>
            {filterVisible && (
                <TouchableWithoutFeedback onPress={closeProfile}>
                    <Animated.View
                        style={[styles.dimBackground, { opacity: dimAnimProfile }]} // Apply animated opacity
                    />
                </TouchableWithoutFeedback>
            )}

            {filterVisible && (
                <Animated.View
                    style={[
                        styles.sidebar,
                        {
                            transform: [{ translateY: slideAnimProfile }],
                            height: Dimensions.get('window').height * 0.2, // 20% height of the screen
                        }
                    ]}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Filters</Text>
                        {/* Modal content here */}
                        <View>
      {/* Points/Pools/Deals Section */}
      <View style={{ flexDirection: 'row', gap: 5 }}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'Point' && styles.selectedTab]}
          onPress={() => setSelectedTab('Point')}
        >
          <Image style={{ width: 25, height: 25 }} source={require('./assets/trophy.png')} />
          <Text style={[{ fontSize: 12 }, selectedTab === 'points' && styles.selectedplayerText]}>Points</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === '80pool' && styles.selectedTab]}
          onPress={() => setSelectedTab('80pool')}
        >
          <Image style={{ width: 25, height: 25 }} source={require('./assets/trophy.png')} />
          <Text style={[{ fontSize: 10 }, selectedTab === '80pool' && styles.selectedplayerText]}>80 Pool</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === '160pool' && styles.selectedTab]}
          onPress={() => setSelectedTab('160pool')}
        >
          <Image style={{ width: 25, height: 25 }} source={require('./assets/trophy.png')} />
          <Text style={[{ fontSize: 10 }, selectedTab === '160pool' && styles.selectedplayerText]}>160 Pool</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === '240pool' && styles.selectedTab]}
          onPress={() => setSelectedTab('240pool')}
        >
          <Image style={{ width: 25, height: 25 }} source={require('./assets/trophy.png')} />
          <Text style={[{ fontSize: 10 }, selectedTab === '240pool' && styles.selectedplayerText]}>240 Pool</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'deals' && styles.selectedTab]}
          onPress={() => setSelectedTab('deals')}
        >
          <Image style={{ width: 25, height: 25 }} source={require('./assets/trophy.png')} />
          <Text style={[{ fontSize: 12 }, selectedTab === 'deals' && styles.selectedplayerText]}>Deals</Text>
        </TouchableOpacity>
      </View>
      <Text style={{ fontWeight: 600 }}>Players</Text>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <TouchableOpacity
          style={[styles.playerButton, selectedPlayers === '2' && styles.selectedPlayerButton]}
          onPress={() => setSelectedPlayers('2')}
        >
          <Text style={[styles.playertext, selectedPlayers === '2' && styles.selectedplayerText]}>2 Players</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.playerButton, selectedPlayers === '6' && styles.selectedPlayerButton]}
          onPress={() => setSelectedPlayers('6')}
        >
          <Text style={[styles.playertext, selectedPlayers === '6' && styles.selectedplayerText]}>6 Players</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.playerButton, selectedPlayers === '10' && styles.selectedPlayerButton]}
          onPress={() => setSelectedPlayers('10')}
        >
          <Text style={[styles.playertext, selectedPlayers === '10' && styles.selectedplayerText]}>9 Players</Text>
        </TouchableOpacity>
      </View>
    </View>

                        <TouchableOpacity onPress={()=>{FetchGames(); closeProfile()}} style={styles.button}>
                            <Text style={{ color: '#fff' }}>Apply </Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            )}
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
  },  tab: {
    padding: 10,
    flexDirection: 'column',
    gap: 5,
    alignItems: 'center',
    backgroundColor: '#E9E9E9',
    borderRadius: 10,
    width: 60,
    height: 65,
  },
  selectedplayerText:{
   color:'#fff',
   fontWeight:500
  },
  selectedTab: {
    backgroundColor: '#5CBE8F', // Green background for selected tab
  },
  playerButton: {
    borderRadius: 50,
    backgroundColor: '#E9E9E9',
    width: 80,
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedPlayerButton: {
    backgroundColor: '#5CBE8F', // Green background for selected player button
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 70,
    paddingHorizontal: 20,
    backgroundColor: '#621B98',
},
profileImage: {
    width: 20,
    height: 20,
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
sidebar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0, // Position the sidebar at the bottom
    backgroundColor: '#fff',
    zIndex: 999, // Ensure the sidebar is above other components
},
modalContent: {
    flexDirection: 'column',
    gap: 12,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    width: '100%',
},
modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
},
  card:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:"center",
    padding:10,
    borderRadius:5,
    backgroundColor:'#fff',
    width:'100%'
  },  cardHeading:{
    flexDirection:'row',
    gap:10
  },
  cardposition:{
    flexDirection:'column',
    gap:10
  },
  Transactioncard:{
    position:'relative',
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:"center",
    padding:10,
    overflow:"hidden",
        borderRadius:5,
    backgroundColor:'#fff',
    width:'100%'
  },
  columncard:{
    display:'flex',
    flexDirection:'column',
    justifyContent:'space-between',
    alignItems:"center",
    borderRadius:5,
    backgroundColor:'#fff'
  },
   sidebar: {
     position: 'absolute',
   bottom:0,
     right: 0,

     width: Dimensions.get('window').width * 0.70, // Sidebar takes up 75% of the screen width
     height: '100%',
     width:'100%',
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
     width:'90%',
     justifyContent:'center',
     backgroundColor:'#fff'
   },
   // Basic style for each tab
  // Active tab style (changes background color)
  activeTab: {
    backgroundColor: '#621B98', // Green for active tab,

  },
   // Text style for each tab
   tabText: {
     fontWeight: 'bold',
     color: '#000',
     fontSize:14 // Default text color
   },
   // Active text style (changes color when active)
   activeTabText: {
     color: '#fff',
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
 
 export default PastGames;