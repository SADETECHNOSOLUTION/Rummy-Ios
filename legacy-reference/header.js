import { useState,useEffect} from 'react';
import { View, Text,Image, TouchableOpacity, StyleSheet,Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const Header  = ({ onMenuPress })=>{
       const navigation = useNavigation()
       const [profile,setProfile] = useState()
       const [image,setImage] = useState()
       const openProfile = ()=>{
        navigation.navigate('Wallet');
       }

       const openKyc = ()=>{
        navigation.navigate('KYCVerification');
        }

       const FetchProfile = async () => {
        const playerID = await SecureStore.getItemAsync('playerId');
        const token = await SecureStore.getItemAsync('token');
        try {
    
          if (!playerID) {
            console.error('Player ID is not available');
            return;
          }
    
          const response = await axios.get(`https://rummy-apigateway-v1.onrender.com/api/user/get-user/${playerID}`,{
            headers:{
              'Authorization':`Bearer ${token}`
            }
          });
    
          if (response.status === 200) {
            const data = response.data; // The response data should be in the `data` property
            setProfile(data);
            console.log('Profile data:', data); // You can log the profile data here
            console.log(data?.loyaltyPoint);
          } else {
            console.error('Failed to fetch profile', response.status);
          }
        } catch (error) {
          console.error('Error profile:', error);
        }
        };
    
      useEffect(() => {
        FetchProfile();
      }, []);
      

         
    return(
    <View style={styles.container}>
 
      <View style={{flexDirection:'row',justifyContent:"space-between",}}>
      <View style={{flexDirection:'row',alignItems:'center',gap:10}}>
      <TouchableOpacity onPress={openProfile}>
      <Image source={require('./assets/profile.png')} style={styles.profileImage} />
      </TouchableOpacity>
      <Text style={{color:'#fff',fontWeight:800}}>{profile?.name ? profile?.name : profile?.phoneNumber}</Text>
      </View>

      <View style={{flexDirection:'row',alignItems:'center',gap:20}}>
        <TouchableOpacity style={{position:'relative',alignItems:"center"}}>
          <Image source={require('./assets/chips.png')} style={{width:40, height:40}} />
        <Text style={{padding:1,paddingHorizontal:4,backgroundColor:'#fff',borderRadius:20,position:'absolute',bottom:0,fontSize:12,fontWeight:800}}>{profile?.chips}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{borderRadius:100,width:40,height:40,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
               <Image source={require('./assets/notify.png')} style={{width:30, height:34}} />
        </TouchableOpacity>
      </View>

      </View>

    </View>
    )
}

export default Header;
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
    width: Dimensions.get('window').width * 0.70,
    height: '100%',
    marginTop:30,
    flexDirection:'row',
    justifyContent: 'flex-end',
    zIndex: 999,
  },
  sidebarContent: {
    flex: 1,
    alignItems: 'flex-start',
  },
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 10,
    height:100,
    backgroundColor: '#621B98',
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 998,
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
    width: 55,
    height: 55,
    borderRadius: 24,
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
    color: '#621B98',
    fontWeight: 'bold',
  },
});
