import React,{useState,useEffect} from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet,Animated,Dimensions,Modal,Switch } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from 'expo-secure-store';
import axios from "axios";
import { ScrollView } from "react-native-gesture-handler";

const Sidebar = ({setSidebarVisible})=>{
      const [walletsection,showWalletSection] = useState(false)
      const [rewardsection,showRewardSection] = useState(false)
      const [helpsection,showHelpSection] = useState(false)
      const [gamesection,showGameSection] = useState(false)
      const [profile,setProfile] = useState()
      const [termsandpolicies,setTermsandpolicies] = useState(false)
      const [promotions,setPromotions] = useState(false)
      const [settings,setSettings] = useState(false)
      const [preferences,setPreferences] = useState(false)
      const [rummyrules,setRummyrules] = useState(false)
      const navigation = useNavigation()
      const [MyAccount,setmyAccount] = useState(false)
     const [logoutModal,setLogoutModal] = useState(false)
     const [game,setGame] = useState()
     const [KYC,setKYC] =useState(false)
     const [rummyqueen,setRummyQueen] =useState(false)
     const [activeSection, setActiveSection] = useState(null); 

     const toggleSection = (section) => {
      if (activeSection === section) {
        // If the section is already open, close it
        setActiveSection(null);
      } else {
        // Otherwise, open the selected section and close others
        setActiveSection(section);
      }
    };


    const toggleWalletSection = ()=>{
        showWalletSection(!walletsection)
       }


       const handleLogoutModal = ()=>{
        setLogoutModal(true)    
       }


       const openProfile = ()=>{
        navigation.navigate('Profile');
       }

       const openKyc = ()=>{
        navigation.navigate('KYCVerification');
       }

       const openChat = ()=>{
        navigation.navigate('Chat');
       }

       const openRefer = ()=>{
        navigation.navigate('Refer');
       }

       const FetchGame = async () => {
        const playerID = await SecureStore.getItemAsync('playerId');
       const token = await SecureStore.getItemAsync('token');

        try {
          if (!playerID) {
            console.error('Player ID is not available');
            return;
          }
          
          const response = await axios.get(`https://rummy-apigateway-v1.onrender.com/api/room/get-room-details/player-last-ten-match?playerId=${playerID}`,{
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
    
      useEffect(() => {
        FetchGame();
      }, []);


       const FetchProfile = async () => {
        const playerID = await SecureStore.getItemAsync('playerId');
       const token = await SecureStore.getItemAsync('token');

        try {

          if (!playerID) {
            console.error('Player ID is not available');
            return;
          }
          
          // Make the API request using axios
          const response = await axios.get(`https://rummy-apigateway-v1.onrender.com/api/user/get-user/${playerID}`,{
            headers:{
              'Authorization':`Bearer ${token}`
            }
          });
    
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

      

      const openWithdrawal = ()=>{
        // setSidebarVisible(false)
        navigation.navigate('Home');
      }

      const openWallet = ()=>{
        navigation.navigate('Profile');
       }
       
       
       const Loyalty = ()=>{
        navigation.navigate('LoyaltyPoints');
       }
       
          
       
       
       const Contactus = ()=>{
        navigation.navigate('Contactus');
       }

       const openRewards = ()=>{
        navigation.navigate('Rewards');
       }

       const Logout = ()=>{
       SecureStore.deleteItemAsync('token')
       navigation.navigate('Login')
}

const pastGames = ()=>{
  navigation.navigate('PastGames');
 }

 const openGame = (GameId) => {
  navigation.navigate('PastGame', { GameId });
}

const openAadhar = ()=>{
  navigation.navigate('Kyc');
 }

 
const openCertification = ()=>{
  navigation.navigate('Certification');
 }

 
const openAbout = ()=>{
  navigation.navigate('About');
 }

 const openPancard = ()=>{
  navigation.navigate('Pancard');
 }

 const openTerms = ()=>{
  navigation.navigate('TermsandConditions')
 }


 const openTicket = ()=>{
  navigation.navigate('Ticket');
 }
       
       const openTickets = ()=>{
        navigation.navigate('Ticket');
       }
    return(
  <View>
<View style={{height:30}}>

</View>
<View style={{backgroundColor:'#621B98', height:80, width:'100%', paddingHorizontal:10,paddingVertical:25, flexDirection:'row', alignItems:'center'}}>
      <TouchableOpacity onPress={openProfile}>
      <Image source={require('./assets/profile.png')} style={{height:60, width:60}} />
      </TouchableOpacity>

      <View>
        <Text style={{color:'#fff', fontSize:16, fontWeight:800}}>{profile?.name}</Text>
        <View style={{flexDirection:'row', gap:16}}>
          <View style={{flexDirection:'row', alignItems:'center', gap:4}}>
            <Image style={{width:20, height:20}} source={require('./assets/trophy.png')}  />
            <View>
              <Text style={styles.headingtext}>Cash</Text>
              <Text style={{color:'#fff', fontWeight:800, fontSize:10}}>{profile?.inGameWallet}</Text>
            </View>
          </View>
          <View style={{flexDirection:'row', alignItems:'center', gap:4}}>
            <Image style={{width:20, height:20}} source={require('./assets/trophy.png')}  />
            <View>
              <Text style={styles.headingtext}>Chips</Text>
              <Text style={{color:'#fff', fontWeight:800, fontSize:10}}>{profile?.chips}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
<ScrollView style={{width:'100%',marginBottom:110}}>
      <View style={{width:'100%',position:'relative',flex:1}}>
      <TouchableOpacity onPress={openProfile} style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{fontWeight:800, fontSize:12}}>My Profile</Text>
              </View>
       
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>toggleSection('MyAccount')} style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{fontWeight:800, fontSize:12}}>My Account</Text>
              </View>
              <Image style={{width:20, height:20}} source={require('./assets/down.png')}  />
            </TouchableOpacity>
            {activeSection === 'MyAccount' &&     
          <View>

            <TouchableOpacity onPress={openRewards} style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{color:'#848282', fontSize:12}}>Rewards</Text>
              </View>
              <Image style={{width:12, height:12}} source={require('./assets/next.png')}  />
            </TouchableOpacity>
            <TouchableOpacity onPress={openTicket} style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{color:'#848282', fontSize:12}}>Tickets</Text>
              </View>
              <Image style={{width:12, height:12}} source={require('./assets/next.png')}  />
            </TouchableOpacity>
            <TouchableOpacity onPress={pastGames} style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{color:'#848282', fontSize:12}}>Past Games</Text>
              </View>
              <Image style={{width:12, height:12}} source={require('./assets/next.png')}  />
            </TouchableOpacity>

          </View>
        }
        <TouchableOpacity onPress={openWallet} style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
          <View>
            <Text style={{fontWeight:800, fontSize:12}}>My Wallet</Text>
          </View>

        </TouchableOpacity>
        <TouchableOpacity onPress={()=>toggleSection('Kyc')} style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
          <View>
            <Text style={{fontWeight:800, fontSize:12}}>Verify KYC</Text>
          </View>
          <Image style={{width:20, height:20}} source={require('./assets/down.png')}  />
        </TouchableOpacity>

        {activeSection ==='Kyc' &&     
          <View>
            {/* Wallet Section Details */}
            <TouchableOpacity onPress={openAadhar} style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{color:'#848282', fontSize:12}}>Aadhar</Text>
              </View>
              <Image style={{width:12, height:12}} source={require('./assets/next.png')}  />
            </TouchableOpacity>
            <TouchableOpacity onPress={openPancard} style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{color:'#848282', fontSize:12}}>Pan</Text>
              </View>
              <Image style={{width:12, height:12}} source={require('./assets/next.png')}  />
            </TouchableOpacity>
            <TouchableOpacity onPress={openWallet} style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{color:'#848282', fontSize:12}}>Bank</Text>
              </View>
              <Image style={{width:12, height:12}} source={require('./assets/next.png')}  />
            </TouchableOpacity>
            {/* Repeat wallet items as needed */}
          </View>
        }
        <TouchableOpacity onPress={openRefer} style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
          <View>
            <Text style={{fontWeight:800, fontSize:12}}>Invite & Earn</Text>
        
          </View>
  
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>{toggleSection('rummyrules')}} style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
          <View>
            <Text style={{fontWeight:800, fontSize:12}}>Rummy Rules</Text>

          </View>
          <Image style={{width:20, height:20}} source={require('./assets/down.png')}  />
        </TouchableOpacity>
        {activeSection === 'rummyrules' &&     
          <View>
            {/* Wallet Section Details */}
            <TouchableOpacity onPress={openWithdrawal} style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{color:'#848282', fontSize:12}}>Learn Rummy</Text>
              </View>
              <Image style={{width:12, height:12}} source={require('./assets/next.png')}  />
            </TouchableOpacity>
            <TouchableOpacity onPress={openKyc} style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{color:'#848282', fontSize:12}}>Basics</Text>
              </View>
              <Image style={{width:12, height:12}} source={require('./assets/next.png')}  />
            </TouchableOpacity>
            <TouchableOpacity onPress={openWallet} style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{color:'#848282', fontSize:12}}>Points</Text>
              </View>
              <Image style={{width:12, height:12}} source={require('./assets/next.png')}  />
            </TouchableOpacity>
            <TouchableOpacity onPress={openWallet} style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{color:'#848282', fontSize:12}}>Pool</Text>
              </View>
              <Image style={{width:12, height:12}} source={require('./assets/next.png')}  />
            </TouchableOpacity>
            <TouchableOpacity onPress={openWallet} style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{color:'#848282', fontSize:12}}>Deals</Text>
              </View>
              <Image style={{width:12, height:12}} source={require('./assets/next.png')}  />
            </TouchableOpacity>
            {/* Repeat wallet items as needed */}
          </View>
        }
                <TouchableOpacity onPress={toggleWalletSection} style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
          <View>
            <Text style={{fontWeight:800, fontSize:12}}>Responsible Gaming</Text>
   
          </View>
          {/* <Image style={{width:20, height:20}} source={require('./assets/down.png')}  /> */}
        </TouchableOpacity>
                <TouchableOpacity onPress={()=>{toggleSection('rummyqueen')}} style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
          <View>
            <Text style={{fontWeight:800, fontSize:12}}>Why Rummy Queen</Text>

          </View>
          <Image style={{width:20, height:20}} source={require('./assets/down.png')}  />
        </TouchableOpacity>
        {activeSection === 'rummyqueen' &&     
          <View>
            {/* Wallet Section Details */}
            <TouchableOpacity onPress={openAbout} style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{color:'#848282', fontSize:12}}>About Us</Text>
            
              </View>
              <Image style={{width:12, height:12}} source={require('./assets/next.png')}  />
            </TouchableOpacity>
            <TouchableOpacity onPress={openCertification} style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{color:'#848282', fontSize:12}}>Certifications</Text>
            
              </View>
              <Image style={{width:12, height:12}} source={require('./assets/next.png')}  />
            </TouchableOpacity>

            {/* Repeat wallet items as needed */}
          </View>
        }

        {/* Other buttons */}
        <TouchableOpacity onPress={()=>{navigation.navigate('Preferences')}}  style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
          <View>
            <Text style={{fontWeight:800, fontSize:12}}>Preferences</Text>
          
          </View>
          {/* <Image style={{width:20, height:20}} source={require('./assets/down.png')}  /> */}
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleWalletSection} style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
          <View>
            <Text style={{fontWeight:800, fontSize:12}}>Promotions</Text>
   
          </View>
          {/* <Image style={{width:20, height:20}} source={require('./assets/down.png')}  /> */}
        </TouchableOpacity>
        {activeSection === 'preferences' &&     
          <View>
            {/* Wallet Section Details */}
            <TouchableOpacity onPress={openWithdrawal} style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
              <View style={{flexDirection:'column'}}>
                <Text style={{color:'#848282', fontSize:12}}>Calendar</Text>
                <Text style={{color:'#848282', fontSize:10}}>Allow Access to Calendar </Text>
              </View>
              <Switch />
            </TouchableOpacity>
            <TouchableOpacity onPress={openKyc} style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
              <View style={{flexDirection:'column'}}>
                <Text style={{color:'#848282', fontSize:12}}>Location</Text>
                <Text style={{color:'#848282', fontSize:10}}>Allow Access to Location</Text>
              </View>
        <Switch />
            </TouchableOpacity>
          </View>
        }
        {/* <TouchableOpacity onPress={togglepromotions}  style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
          <View>
            <Text style={{fontWeight:800, fontSize:12}}>Promotions</Text>

          </View>
          <Image style={{width:20, height:20}} source={require('./assets/down.png')}  />
        </TouchableOpacity> */}
        {promotions &&     
          <View>
            <TouchableOpacity onPress={openRewards} style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{color:'#848282', fontSize:12}}>Reward Store</Text>
              </View>
              <Image style={{width:12, height:12}} source={require('./assets/next.png')}  />
            </TouchableOpacity>
            <TouchableOpacity onPress={openTickets} style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{color:'#848282', fontSize:12}}>Tickets</Text>
              </View>
              <Image style={{width:12, height:12}} source={require('./assets/next.png')}  />
            </TouchableOpacity>
            <TouchableOpacity onPress={Loyalty} style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{color:'#848282', fontSize:12}}>Loyalty Points </Text>
              </View>
              <Image style={{width:12, height:12}} source={require('./assets/next.png')}  />
            </TouchableOpacity>
          </View>
        }

        <TouchableOpacity onPress={()=>{toggleSection('helpsection')}}  style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
          <View>
            <Text style={{fontWeight:800, fontSize:12}}>Help</Text>
  
          </View>
          <Image style={{width:20, height:20}} source={require('./assets/down.png')}  />
        </TouchableOpacity>
        {activeSection === 'helpsection' &&     
          <View>
            {/* Wallet Section Details */}
            <TouchableOpacity onPress={openChat} style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{color:'#848282', fontSize:12}}>Withdraw</Text>
              </View>
              <Image style={{width:12, height:12}} source={require('./assets/next.png')}  />
            </TouchableOpacity>
            <TouchableOpacity onPress={Contactus} style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{color:'#848282', fontSize:12}}>Add Cash</Text>
              </View>
              <Image style={{width:12, height:12}} source={require('./assets/next.png')}  />
            </TouchableOpacity>
            <TouchableOpacity onPress={Contactus} style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{color:'#848282', fontSize:12}}>Kyc</Text>
              </View>
              <Image style={{width:12, height:12}} source={require('./assets/next.png')}  />
            </TouchableOpacity>
            <TouchableOpacity onPress={Contactus} style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{color:'#848282', fontSize:12}}>Game Related Issue</Text>
              </View>
              <Image style={{width:12, height:12}} source={require('./assets/next.png')}  />
            </TouchableOpacity>
            <TouchableOpacity onPress={Contactus} style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{color:'#848282', fontSize:12}}>Account Related Issue</Text>
              </View>
              <Image style={{width:12, height:12}} source={require('./assets/next.png')}  />
            </TouchableOpacity>
            <TouchableOpacity onPress={Contactus} style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{color:'#848282', fontSize:12}}>App Related Issue</Text>
              </View>
              <Image style={{width:12, height:12}} source={require('./assets/next.png')}  />
            </TouchableOpacity>
            <TouchableOpacity onPress={Contactus} style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{color:'#848282', fontSize:12}}>Other Topics Issue</Text>
              </View>
              <Image style={{width:12, height:12}} source={require('./assets/next.png')}  />
            </TouchableOpacity>

            {/* Repeat wallet items as needed */}
          </View>
        }
              <TouchableOpacity onPress={()=>{toggleSection('settings')}} style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{fontWeight:800, fontSize:12}}>Settings</Text>
              </View>
              <Image style={{width:12, height:12}} source={require('./assets/next.png')}  />
            </TouchableOpacity>
            
            {activeSection === 'settings' &&     
          <View>
            <TouchableOpacity onPress={openRewards} style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{color:'#848282', fontSize:12}}>My Profile</Text>
              </View>
              <Image style={{width:12, height:12}} source={require('./assets/next.png')}  />
            </TouchableOpacity>
            <TouchableOpacity onPress={openTickets} style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{color:'#848282', fontSize:12}}>Payment Setting</Text>
              </View>
              <Image style={{width:12, height:12}} source={require('./assets/next.png')}  />
            </TouchableOpacity>
            <TouchableOpacity onPress={Loyalty} style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{color:'#848282', fontSize:12}}>Manage Accounts </Text>
              </View>
              <Image style={{width:12, height:12}} source={require('./assets/next.png')}  />
            </TouchableOpacity>
            <TouchableOpacity onPress={Loyalty} style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{color:'#848282', fontSize:12}}>Manage Payments </Text>
              </View>
              <Image style={{width:12, height:12}} source={require('./assets/next.png')}  />
            </TouchableOpacity>
            {/* Repeat wallet items as needed */}
          </View>
        }
            <TouchableOpacity onPress={()=>{toggleSection('termsandpolicies')}}  style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
          <View>
            <Text style={{fontWeight:800, fontSize:12}}>Terms and Policies</Text>
          </View>
          <Image style={{width:20, height:20}} source={require('./assets/down.png')}  />
        </TouchableOpacity>
        

        {activeSection == 'termsandpolicies' &&     
          <View>
            <TouchableOpacity onPress={openRewards} style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{color:'#848282', fontSize:12}}>Terms and Conditions</Text>
              </View>
              <Image style={{width:12, height:12}} source={require('./assets/next.png')}  />
            </TouchableOpacity>
            <TouchableOpacity onPress={openTickets} style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{color:'#848282', fontSize:12}}>Policies</Text>
              </View>
              <Image style={{width:12, height:12}} source={require('./assets/next.png')}  />
            </TouchableOpacity>
            {/* Repeat wallet items as needed */}
          </View>
        }

<TouchableOpacity onPress={handleLogoutModal} style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{fontWeight:800, fontSize:12}}>Logout</Text>
              </View>
            </TouchableOpacity >
            <View style={{flexDirection:'row',justifyContent:'space-between',padding:10,width:'100%',alignItems:"center"}}>
              <Text>15.0</Text>
              <TouchableOpacity>
              <Text>Check for updates</Text>
              </TouchableOpacity>
            </View>
      </View>
      </ScrollView>
      <Modal visible={logoutModal} transparent={true} animationType="fade" onRequestClose={() => setShowForgotPasswordPopup(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.forgotPasswordPopup}>
            <View style={{display:'flex',flexDirection:'row',width:'100%', justifyContent:'center'}}>
            <Text style={{fontWeight:800,textAlign:'center'}}>Are you sure you want to Logout?</Text>
            </View>
            <Image style={{width:24, height:24}} source={require('./assets/logout.png')}  />
            <View style={{flexDirection:'row',gap:20}}>
           <TouchableOpacity onPress={Logout} style={{width:100,height:40,borderRadius:5,backgroundColor: '#621B98',flexDirection:'row',justifyContent:'center',alignItems:'center'}}><Text style={{color:'#fff'}}>Yes</Text></TouchableOpacity>
           <TouchableOpacity onPress={()=>setLogoutModal(false)}  style={{width:100,height:40,borderRadius:5,borderWidth:1,borderColor: '#621B98',flexDirection:'row',justifyContent:'center',alignItems:'center'}}><Text>Cancel</Text></TouchableOpacity>
</View>
          </View>
        </View>
      </Modal>
  </View>
    )
}

export default Sidebar;

const styles = StyleSheet.create({
    headingtext:{
      fontSize:12,
      color:'#EEEBEB'
    },  
    sidebar: {
      position: 'absolute',
      top: 0,
      right: 0,
      backgroundColor:'#000',
      width: '100%',
      height: '100%',
      marginTop:30, // Dark background for the sidebar
      flexDirection:'row',
      justifyContent: 'flex-end', // Align content from the top
      zIndex: 999, // Ensure it appears above other components
    },
    sidebarContent: {
      flex: 1,
      alignItems: 'flex-start',
      backgroundColor:'#fff',
      width: '100%',
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
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 10,
      backgroundColor: '#621B98', // blue-500
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
      width: 48,
      height: 48,
      borderRadius: 24, // rounded-full
    },
    button: {
      flexDirection:'row',
      gap:4,
      backgroundColor:'#621B98',
      paddingVertical: 8,
      paddingHorizontal: 8,
      borderRadius: 5,
    },
    buttonText: {
      color: '#fff', // blue-500
      fontWeight: 'bold',
  
    },
    otpContainer: {
      flexDirection: 'row',  // Arrange the inputs in a row
      justifyContent: 'space-between',  // Even spacing between the inputs
      width: '100%',  // Adjust width as needed
      alignItems: 'center',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
  });
  