import { View, Text, TouchableOpacity, Image, StyleSheet,Animated,Dimensions,BackHandler,Modal } from 'react-native';
import { useRef} from 'react';
import { useNavigation,useRoute } from '@react-navigation/native';

const Dropdown = () =>{
    const navigation = useNavigation()
      const translateY = useRef(new Animated.Value(-20)).current;
           const route = useRoute();
          const isActiveRoute = (routeName) => {
    return route.name === routeName;
  };
  
   const openProfile = ()=>{
    navigation.navigate('Myaccount');
   }

  const Logout = ()=>{
              SecureStore.deleteItemAsync('token')
              navigation.navigate('Login')
       }

   const openTransaction = ()=>{
    navigation.navigate('Transaction')
   }

 return(
        <View>
              <Animated.View style={[styles.dropdown, { transform: [{ translateY }] }]}>
                        
                       <TouchableOpacity onPress={openProfile} style={styles.chips}>
                     {isActiveRoute('Profile') ? <Image source={require('./assets/profilemenu.png')} style={{ width: 36, height: 36 }} /> :   <Image source={require('./assets/profilemenu.png')} style={{ width: 36, height: 36 }} />}
                         <Text style={[styles.bottomMenu, isActiveRoute('Profile') && { color: '#ffc31e' }]}>My Account</Text>
                       </TouchableOpacity>
                        
                       <TouchableOpacity style={styles.chips}>
                       {isActiveRoute('Rewards') ? <Image source={require('./assets/activerewards.png')} style={{ width: 36, height: 36 }} /> :   <Image source={require('./assets/rewards.png')} style={{ width: 36, height: 36 }} />}
                         <Text style={[styles.bottomMenu, isActiveRoute('Rewards') && { color: '#ffc31e' }]}>Settings</Text> 
                       </TouchableOpacity>
                      
                       <TouchableOpacity onpress={openTransaction}  style={styles.chips}>
                       {isActiveRoute('Mission') ? <Image source={require('./assets/activetransactions.png')} style={{ width: 36, height: 36 }} /> :  <Image source={require('./assets/transactions.png')} style={{ width: 36, height: 36 }} />}
                         <Text style={[styles.bottomMenu, isActiveRoute('Mission') && { color: '#ffc31e' }]}>Transaction </Text>
                       </TouchableOpacity> 
                      
                       <TouchableOpacity onpress={openTransaction}  style={styles.chips}>
                       {isActiveRoute('Mission') ? <Image source={require('./assets/activetransactions.png')} style={{ width: 36, height: 36 }} /> :  <Image source={require('./assets/transactions.png')} style={{ width: 36, height: 36 }} />}
                         <Text style={[styles.bottomMenu, isActiveRoute('Mission') && { color: '#ffc31e' }]}>Transaction </Text>
                       </TouchableOpacity> 
                        
                       <TouchableOpacity onpress={open} style={styles.chips}>
                       {isActiveRoute('Refer') ? <Image source={require('./assets/activehelp.png')} style={{ width: 36, height: 36 }} /> :   <Image source={require('./assets/help.png')} style={{ width: 36, height: 36 }} />}
                         <Text style={[styles.bottomMenu, isActiveRoute('Refer') && { color: '#ffc31e' }]}>Help</Text>
                       </TouchableOpacity>
                      
                       <TouchableOpacity onPress={Logout} style={styles.chips}>
                         <Image source={require('./assets/logoutmenu.png')} style={{ width: 30, height: 30 }} />
                         <Text style={[styles.bottomMenu, isActiveRoute('Menu') && { color: '#ffc31e' }]}>Logout</Text>
                       </TouchableOpacity>
                        
              <TouchableOpacity>
                <Text> Button </Text>
              </TouchableOpacity>
                        
              </Animated.View>
        </View>
    )
}

export default Dropdown;

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
    top: 10,

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