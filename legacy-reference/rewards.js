import React,{useEffect,useState,useRef} from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet,Animated,Dimensions,TouchableWithoutFeedback,ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';  
import Sidebar from './sidebar';
import Header from './header';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import BottomNav from './bottomnavbar';
import Dropdown from './dropdown';


const Rewards = () => {
   const navigation = useNavigation()
   const [activeTab, setActiveTab] = useState(0); 
      const dimAnim = useRef(new Animated.Value(0)).current; 
      const [dimVisible, setDimVisible] = useState(false);
      const [sidebarVisible, setSidebarVisible] = useState(false);
   const [showDropdown,setShowDropdown] = useState(false)
      const [rewards,setRewards] = useState()
      const [filterVisible,setFilterVisible] = useState(false)
      const [instantVisible,setinstantVisible] = useState(false);
      const [ticketVisible,setTicketVisible] = useState(false);
      const sidebarAnim = useRef(new Animated.Value(Dimensions.get('window').width)).current;
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

         const slideAnimProfile = new Animated.Value(0);
           const dimAnimProfile = useRef(new Animated.Value(0)).current; // Dim background for profile
           
               const openTicket = () => {
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
                     setTicketVisible(! ticketVisible); // Toggle the state
                   };
            
                   const closeTicket = () => {
             
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
                    setTicketVisible(false);// Make sure dim is hidden
                  };

                  const openProfiles = () => {
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

                  const openInstant = () => {
                    if (instantVisible) {
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
                    setinstantVisible(! instantVisible); // Toggle the state
                  };
           
                  const closeInstant = () => {
            
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
                   setinstantVisible(false);// Make sure dim is hidden
                 };
   const openProfile = ()=>{
    navigation.navigate('Profile');
   }

   const openSidebar = ()=>{
    navigation.navigate('Menu')
  }

   const openLobby = ()=>{
    navigation.navigate('Home');
   }

   const openRefer = ()=>{
    navigation.navigate('Refer')
   }


   const openAddcash = ()=>{
    navigation.navigate('Addcash');
   }

   const openMission = ()=>{
    navigation.navigate('Mission');
   }
   const handleTabPress = (index) => {
    setActiveTab(index);
  };

    const toggleDropdown = () => setShowDropdown(prev => !prev);

   useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  }, []);

  const FetchRewards = async () => {
    const playerID = await SecureStore.getItemAsync('playerId');
    const token = await SecureStore.getItemAsync('token');
    try {

      if (!playerID) {
        console.error('Player ID is not available');
        return;
      }

      // Make the API request using axios
      const response = await axios.get(`https://rummy-apigateway-v1.onrender.com/api/mission/get-rewards/player/${playerID}`,{
        headers:{
          'Authorization':`Bearer ${token}`
        }
      });

      // Check if the response is successful
      if (response.status === 200) {
        const data = response.data;
        setRewards(data);
        console.log('Profile data:', data);
      } else {
        console.error('Failed to fetch profile', response.status);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    FetchRewards(); // Call the function when the component mounts
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <View style={{position:'relative'}}>

    {dimVisible && (
        <TouchableWithoutFeedback onPress={toggleSidebar}>
          <Animated.View
            style={[styles.dimBackground, { opacity: dimAnim }]} // Apply the animated opacity
          />
        </TouchableWithoutFeedback>
      )}
<Animated.View
  style={[
    styles.sidebarMenu,
    {
      transform: [{ translateX: sidebarAnim }], // Apply sliding animation
    },
  ]}
>
  <Sidebar />
</Animated.View>
    <View style={{height:'100%'}}> 
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <Header onMenuPress={toggleDropdown} />
      {showDropdown && (
<Dropdown />
      )}
    <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 0 && styles.activeTab]}
          onPress={() => handleTabPress(0)}
        >
        <Image source={require('./assets/bonus.png')} style={{width:26,height:26}} />
          <Text style={[styles.tabText, activeTab === 0 && styles.activeTabText]}>
           Bonus
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 1 && styles.activeTab]}
          onPress={() => handleTabPress(1)}
        >
           <Image source={require('./assets/cashh.png')} style={{width:26,height:26}} />
          <Text style={[styles.tabText, activeTab === 1 && styles.activeTabText]}>
            Instant Cash
          </Text>
        </TouchableOpacity>

      </View>
      {/* Content for active tab */}
      <View style={styles.contentContainer}>
        {activeTab === 0 && 
        <ScrollView style={{padding:10,flexDirection:'column',width:'100%',gap:8,flex:1}}>
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                <Text style={{fontWeight:800,fontSize:16}}>Bonus Offers</Text>
                <TouchableOpacity onPress={openProfiles} style={{padding:5,borderRadius:5,borderWidth:1,borderColor:'#E1E3E1'}}>
                <Text style={{color:'#621B98'}}>How to Earn Bonus?</Text>
                </TouchableOpacity>
            </View>   
            {rewards?.map((reward)=>(
              <View style={{flexDirection:'column',padding:10,borderWidth:1,borderColor:'#C0B6B6',borderRadius:5,backgroundColor:'#fff'}}>
                <View style={{flexDirection:'row',gap:4,paddingVertical:10}}>
                    <Text style={{fontWeight:'800',fontSize:16}}>Get up to 7500 +250 Instant Cash</Text>
                </View>
                <View style={{flexDirection:'row',gap:4,paddingVertical:10,justifyContent:'space-between',alignItems:'flex-end',borderBottomWidth:1,borderBottomColor:'#C0B6B6'}}>
                    <View style={styles.couponContainer}>
                      <Text>HSOIDF200</Text>
                    </View>
                    <View style={{flexDirection:'column',alignItems:'center',gap:2}}>
                        <Text style={{color:'#FF5154',fontWeight:800,fontSize:12}}>Expiring Soon</Text>
                    <View style={{backgroundColor:'#621B98',paddingHorizontal:20,paddingVertical:10,borderRadius:10}}> 
                    <Text style={{color:'#fff',fontWeight:800}}>Add Cash</Text>
                    </View>
                    </View>
                
                </View>
                <Text style={{fontSize:14,paddingVertical:10}}>Get up to 7500 +250 Instant Cash</Text>
                </View>
))}
        </ScrollView>}

        {activeTab === 1 && 
        <View style={{padding:10,flexDirection:'column',width:'100%',gap:8}}>
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                <Text style={{fontWeight:800,fontSize:16}}>Mission Offers</Text>
                <TouchableOpacity onPress={openInstant} style={{padding:5,borderRadius:5,borderWidth:1,borderColor:'#E1E3E1'}}>
                <Text style={{color:'#621B98'}}>What are Missions?</Text>
                </TouchableOpacity>
            </View>   
            <View style={{borderColor:'#D0CFCC',backgroundColor:'#E9F3F9',flexDirection:'column',padding:10,borderRadius:10}}>
                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:"center",paddingVertical:10}}>
                    <View>
                        <View>
                            <View style={{flexDirection:'row',alignItems:'center',gap:5}}>
                            <Text style={{fontWeight:800,fontSize:18}}>Win ₹10</Text>
                            <View style={{backgroundColor:'#621B98',padding:5, borderRadius:5}}>
                                <Text style={{fontSize:8,color:'#fff',fontWeight:800}}>Only for you</Text>
                            </View>
                                </View>
                                <Text>Instant Cash</Text>
                        </View>
                       </View>
                    <View style={{backgroundColor:'#FF703D',padding:10, borderRadius:5}}>
                                <Text style={{fontWeight:800,color:'#fff'}}>Refer Now</Text>
                            </View>
                </View>
                <View style={{borderWidth:1,borderColor:'#C1C8CE',borderRadius:5}}>

                 <View style={{flexDirection:'row',justifyContent:'space-between',padding:10}}>
                    <Text style={{fontWeight:800,fontSize:12}}>Refer 1 friend & win extra ₹10</Text>
                 </View>   
                 <View style={{flexDirection:'row',justifyContent:'space-between',padding:10}}>
                    <Text style={{fontSize:10}}>Pro Tip: Refer more friends to unlock new rewards!</Text>
                 </View> 

                 </View>
            </View>
        </View>}
        
        {activeTab === 2 && 
        <View style={{padding:10,flexDirection:'column',width:'100%',gap:8}}>
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                <Text style={{fontWeight:800,fontSize:16}}>Mission Offers</Text>
                <TouchableOpacity onPress={openTicket}  style={{padding:5,borderRadius:5,borderWidth:1,borderColor:'#E1E3E1'}}>
                <Text style={{color:'#621B98'}}>How to earn Tickets?</Text>
                </TouchableOpacity>
            </View>   
            <View style={{borderColor:'#D0CFCC',backgroundColor:'#E9F3F9',flexDirection:'column',padding:10,borderRadius:10}}>
                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:"center",paddingVertical:10}}>
                    <View style={{flexDirection:'row',justifyContent:'space-between',width:'100%'}}>
                        <View>
                            <View style={{flexDirection:'row',alignItems:'center',gap:5}}>
                            <Text style={{fontWeight:800,fontSize:18}}>₹400000 </Text>
                                </View>
                                <Text>Rummy Valentines day GTD Finale </Text>
                        </View>
                        <Image source={require('./assets/trophy.png')} style={{width:36,height:36}} />
                    </View>
              
                </View>
                <View style={{flexDirection:'row',borderWidth:1,borderColor:'#C1C8CE',borderRadius:5,padding:5,justifyContent:'space-between'}}>
                <View>

                 <View style={{flexDirection:'row',justifyContent:'space-between',padding:2}}>
                    <Text style={{fontWeight:800,fontSize:12}}>Ticket Expires on</Text>
                 </View>   
                 <View style={{flexDirection:'row',justifyContent:'space-between',padding:2}}>
                    <Text style={{fontSize:10}}>Febraury 15,2025</Text>
                 </View> 

                 </View>
                 <View>
                 <View style={{backgroundColor:'#EAD45B',padding:10, borderRadius:5}}>
                                <Text style={{fontWeight:800}}>Refer Now</Text>
                            </View>
                  </View>
                  </View>
            </View>
        </View>}
      </View>
      </ScrollView>
    </View>


      {filterVisible && (
                <TouchableWithoutFeedback onPress={closeProfile}>
                    <Animated.View
                        style={[styles.dimBackground, { opacity: dimAnimProfile }]}
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
                        <Text style={styles.modalTitle}>How to Earn Bonus?</Text>
     
                       <View style={{height:80}}>

                       </View>
                       <View>
                       <Text style={styles.modalSubTitle}>What is a Bonus?</Text>
                       <Text>A Bonus is the extra cash reward you get after adding cash in your wallet.
                       How can I earn Bonus?</Text>
   
                       </View>
                       <View>
                       <Text style={styles.modalSubTitle}>How can i earn Bonus?</Text>
                       <Text><Text style={{fontWeight:800}}>Step 1:</Text> Find a bonus offer you like and copy the code. </Text>
                       <Text><Text style={{fontWeight:800}}>Step 2:</Text> Use that code when you make a deposit.</Text>
                       <Text><Text style={{fontWeight:800}}>Step 3:</Text> Start playing cash games to unlock the bonus. </Text>
                       <Text><Text style={{fontWeight:800}}>Step 4:</Text> You'll get a 10% bonus on the total amount you spend on cash games that you didn't win. Easy peasy!</Text>
                       </View>
                        <TouchableOpacity onPress={closeProfile} style={styles.button}>
                            <Text style={{ color: '#fff' }}>Got it </Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            )}
            
                  {instantVisible && (
                <TouchableWithoutFeedback onPress={closeInstant}>
                    <Animated.View
                        style={[styles.dimBackground, { opacity: dimAnimProfile }]} // Apply animated opacity
                    />
                </TouchableWithoutFeedback>
            )}

            {instantVisible && (
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
                        <Text style={styles.modalTitle}>What are Missions?</Text>
     
                       <View style={{height:80}}>

                       </View>
                       <View>
                       <Text style={styles.modalSubTitle}>What is a Mission?</Text>
                       <View style={{flexDirection:'column',gap:2}}>
                       <Text  style={{fontSize:12}}>Missions are enjoyable tasks that you are given. Every mission assigns you a specific task to do, such as trying another type of rummy or playing a certain number of games.</Text>
                       <Text  style={{fontSize:12}}>Completing missions will earn you rewards instantly.</Text>
                       </View>
                       </View>
                       <View style={{flexDirection:'column',gap:10}}>
                       <Text style={styles.modalSubTitle}>How will i earn from Missions?</Text>
                       <View style={{flexDirection:'column',gap:10,paddingHorizontal:10}}>
                       <View style={{flexDirection:'row',alignItems:'flex-start',gap:4}}><Image source={require('./assets/activemission.png')} style={{width:20,height:20}} /><Text style={{fontSize:12}}><Text style={{fontWeight:800}}>Check Mission:</Text> View the missions you have been given.</Text></View>
                       <View style={{flexDirection:'row',alignItems:'flex-start',gap:4}}><Image source={require('./assets/complete.png')} style={{width:20,height:20}} /><Text style={{fontSize:12}}><Text style={{fontWeight:800}}>Complete Mission:</Text> Complete the task provided in each mission.</Text></View>
                       <View style={{flexDirection:'row',alignItems:'flex-start',gap:4}}><Image source={require('./assets/level.png')} style={{width:20,height:20}} /><Text style={{fontSize:12}}><Text style={{fontWeight:800}}>Claim Reward:</Text>  After completing your mission, you can claim rewards such as tournament tickets, instant cash, and a variety of other thrilling prizes.</Text></View>
                       </View>
                      
                       </View>
                        <TouchableOpacity onPress={closeInstant} style={styles.button}>
                            <Text style={{ color: '#fff' }}>Got it </Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            )}

{ticketVisible && (
                <TouchableWithoutFeedback onPress={closeTicket}>
                    <Animated.View
                        style={[styles.dimBackground, { opacity: dimAnimProfile }]} // Apply animated opacity
                    />
                </TouchableWithoutFeedback>
            )}

            {ticketVisible && (
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
                        <Text style={styles.modalTitle}>Tournament Tickets</Text>
                       <View style={{height:80}}>


                       </View>
                       <View>
                       <Text style={styles.modalSubTitle}>What are Tournament Tickets</Text>
                       <View style={{flexDirection:'column',gap:2}}>
                       <Text  style={{fontSize:12}}>Tournament tickets offer the chance to win huge amounts of money.  Use them to compete for huge prizes like cars, bikes, phones, and more by entering tournaments for free. .</Text>
                       </View>
                       </View>
                       <View style={{flexDirection:'column',gap:10}}>
                       <Text style={styles.modalSubTitle}>How will i get Tournament Tickets?</Text>
                       <Text >There are two ways to earn Tournament tickets</Text>
                       <View style={{flexDirection:'column',gap:10,paddingHorizontal:10}}>
                       <View style={{flexDirection:'row',alignItems:'flex-start',gap:4}}><Text style={{fontSize:14}}><Text style={{fontWeight:800}}>Win tickets from other tournaments:</Text>  Special cash tournaments offer free tournament tickets as a prize.</Text></View>
                       <View style={{flexDirection:'row',alignItems:'flex-start',gap:4}}><Text style={{fontSize:14}}><Text style={{fontWeight:800}}>Win free tickets:</Text>Simply playing rummy can occasionally earn you free tournament tickets.</Text></View>
                       </View>
                       </View>
                        <TouchableOpacity onPress={closeProfile} style={styles.button}>
                            <Text style={{ color: '#fff' }}>Got it </Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            )}
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headingtext:{
    fontSize:12,
    color:'#EEEBEB'
  },  
  sidebar: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor:'#fff',
    width:'100%',
    height: '100%',
    marginTop:30, // Dark background for the sidebar
    flexDirection:'row',
    justifyContent: 'flex-end', // Align content from the top
    zIndex: 999, // Ensure it appears above other components
  },
  sidebarMenu:{
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
  sidebarContent: {
    flex: 1,
    alignItems: 'flex-start',
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
    couponContainer: {   // Green background color
        borderWidth: 2,                // Border thickness
        borderColor: '#C0B6B6',           // Border color (white in this case)
        borderStyle: 'dashed',         // Dashed border
        padding: 5,                  // Padding inside the container
        borderRadius: 5,               // Optional: rounded corners
        alignItems: 'center',          // Center the text horizontally
        justifyContent: 'center',      // Center the text vertically
      },
      couponmain: {   // Green background color
        borderWidth: 2,                // Border thickness
        borderColor: '#C0B6B6',           // Border color (white in this case)
        borderStyle: 'dashed',         // Dashed border
        padding: 5,                  // Padding inside the container
        width: 100,                    // Margin around the container
        borderRadius: 5,               // Optional: rounded corners
        alignItems: 'center',          // Center the text horizontally
        justifyContent: 'center',      // Center the text vertically
      },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#621B98',
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
    backgroundColor: '#d8ebf4ff',
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
  contentContainer: {
    flexGrow: 1,  // Ensure content grows if the content is small
    paddingBottom: 40,  // Optional padding at the bottom for a better scroll experience

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
  modalContent: {
    flexDirection: 'column',
    gap: 12,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    height:460,
    width: '100%',
},
modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
},
modalSubTitle: {
  fontSize: 16,
  fontWeight: 'bold',
},
  button: {
    flexDirection:'row',
    gap:4,
    justifyContent:'center',
    position:'absolute',
    right:20,
    bottom:4,
    width:'30%',
    backgroundColor:'#621B98',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff', // blue-500
    fontWeight: 'bold',
  },
});

export default Rewards;
