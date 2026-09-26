import React,{useEffect,useState, useRef} from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet,Animated,Dimensions,TouchableWithoutFeedback,BackHandler,Modal } from 'react-native';
import Section from './section';
import { useNavigation,useRoute } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';  
import Sidebar from './sidebar';
import Header from './header';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Dropdown from './dropdown';

const Home = () => {
   const navigation = useNavigation()
   const dimAnim = useRef(new Animated.Value(0)).current; 
   const [rooms,setRooms] = useState();
   const [dimVisible, setDimVisible] = useState(false);
   const [sidebarVisible, setSidebarVisible] = useState(false);
   const sidebarAnim = useRef(new Animated.Value(Dimensions.get('window').width)).current;
   const [isBackPressed,setIsBackPressed] = useState(false)
   const [showDropdown,setShowDropdown] = useState(false)
     const route = useRoute();
  //  useEffect(() => {
  //   const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
  //     // Change the state to true instead of exiting the app
  //     setIsBackPressed(true);
  //     // Return true to indicate that we have handled the back press event
  //     return true; // Prevent the default back button behavior
  //   });
  //   return () => {
  //     backHandler.remove(); // Cleanup on unmount
  //   };
  // }, []);
         const Logout = ()=>{
         SecureStore.deleteItemAsync('token')
         navigation.navigate('Login')
  } 

    const isActiveRoute = (routeName) => {
    return route.name === routeName; // Return true if the current route is the one you're checking
  };
  
   const FetchProfile = async () => {
    const playerID = await SecureStore.getItemAsync('playerId');
   const token = await SecureStore.getItemAsync('token');

    try {

      if (!playerID) {
        console.error('Player ID is not available');
        return;
      }
      
      // Make the API request using axios
      const response = await axios.get(`https://rummy-apigateway-v1.onrender.com/api/room/get-room/${playerID}/status/Started`,{
        headers:{
          'Authorization':`Bearer ${token}`
        }
      });

      if (response.status === 200) {
        const data = response.data;
        setRooms(data);
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

      const toggleSidebar = () => {
       if (sidebarVisible) {
         Animated.timing(sidebarAnim, {
           toValue: Dimensions.get('window').width, // Move sidebar off-screen
           duration: 300,
           useNativeDriver: true,
         }).start();
         Animated.timing(dimAnim, {
           toValue: 0,
           duration: 300,
           useNativeDriver: true,
         }).start();
         setDimVisible(false);
       } else {
         Animated.timing(sidebarAnim, {
           toValue: 0,
           duration: 300,
           useNativeDriver: true,
         }).start();

         Animated.timing(dimAnim, {
           toValue: 0.5,
           duration: 300,
           useNativeDriver: true,
         }).start();
         setDimVisible(true);
       }
       setSidebarVisible(!sidebarVisible);
     };
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

       const openMenu = () => {
    navigation.navigate('Menu');
  };
   useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  }, []);


  
  const toggleDropdown = () => setShowDropdown(prev => !prev);

  const translateY = useRef(new Animated.Value(-20)).current;

  // Smooth animation for dropdown
useEffect(() => {
  Animated.timing(translateY, {
    toValue: showDropdown ? 0 : -20,
    duration: 300,
    useNativeDriver: true,
  }).start();
}, [showDropdown]);


  return (
    <View style={{position:'relative',backgroundColor:'#fff'}}>
    <View style={styles.show}>

    </View>
 <Header />
    <View style={{height:'87%'}}> 
    <Section />
    </View>
            <Modal visible={isBackPressed} transparent={true} animationType="fade" onRequestClose={() => setIsBackPressed(false)}>
              <View style={styles.modalContainer}>
                <View style={styles.forgotPasswordPopup}>
                  <View style={{display:'flex',flexDirection:'row',width:'100%', justifyContent:'center'}}>
                  <Text style={{fontWeight:800,textAlign:'center'}}>Are you sure you want to Logout?</Text>
                  </View>
                  <Image style={{width:24, height:24}} source={require('./assets/logout.png')}  />
                  <View style={{flexDirection:'row',gap:20}}>
                 <TouchableOpacity onPress={Logout} style={{width:100,height:40,borderRadius:5,backgroundColor: '#621B98',flexDirection:'row',justifyContent:'center',alignItems:'center'}}><Text style={{color:'#fff'}}>Yes</Text></TouchableOpacity>
                 <TouchableOpacity onPress={()=>setIsBackPressed(false)}  style={{width:100,height:40,borderRadius:5,borderWidth:1,borderColor: '#621B98',flexDirection:'row',justifyContent:'center',alignItems:'center'}}><Text>Cancel</Text></TouchableOpacity>
      </View>
                </View>
              </View>
            </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  headingtext:{
    fontSize:12,
    color:'#EEEBEB'
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
  sidebarContent: {
    flex: 1,
    alignItems: 'flex-start',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },  
  dropdown: {
    position: 'absolute',
    top: 100,

    backgroundColor: '#621B98',
    padding: 10,
    borderRadius: 5,
    flexDirection:'column',
    gap:20,
    zIndex: 999, // Higher than other elements
    elevation: 5, // Required for Android
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },
  forgotPasswordPopup: {
    width:'85%',
    backgroundColor: '#fff',
    padding:20,
    display:'flex',
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'center',
    gap:20,
    borderRadius: 10,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#621B98', // blue-500
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
    borderTopWidth:1,
    borderTopColor:'#9D9895',
    paddingHorizontal: 16,
    paddingVertical:10
  },  dimBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay with 50% opacity
    zIndex: 998, // Ensure it's behind the sidebar but above other content
  },
  bottomMenu:{
   fontSize:14,
   fontWeight:800,
   color:'#fff'
  },
  chips:{
    flexDirection:'column',
    alignItems:'center',
  },
  show:{
    width: '100%',
    height: 36,
    backgroundColor:'#000'
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24, // rounded-full
  },
  button: {
    flexDirection:'row',
    gap:4,
    backgroundColor:'#fff',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: '#621B98', // blue-500
    fontWeight: 'bold',
  },
});

export default Home;
