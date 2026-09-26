import React,{useState,useEffect} from "react";
import Header from "./header";
import Dropdown from "./dropdown";
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView,Dimensions } from 'react-native';
import { useNavigation } from "@react-navigation/native";

const Myaccount = ()=>{
   const [showDropdown,setShowDropdown] = useState(false)
   const navigation = useNavigation();

     const toggleDropdown = () => setShowDropdown(prev => !prev);

     const items = [
        {
            id:1,
            name:'Rewards',
            path:'Rewards',
            icon:require("./assets/reward.png"),
        },
        {
            id:2,
            name:'Tickets',
            path:'Tickets',
            icon:require("./assets/ticket.png"),
        },
        {
            id:3,
            name:'Past Games',
            path:'PastGames',
            icon:require("./assets/practice.png"),
        },
     ]

    return(
        <View>
      <View style={styles.show}>
      </View>
      <Header onMenuPress={toggleDropdown} />
      {showDropdown && (
<Dropdown />
      )}
      <View style={{padding:20,flexDirection:'column',gap:40}}>
{items.map((item)=>(
 <View style={{height:150,backgroundColor:'#621B98',borderRadius:20,padding:20}}>
    <TouchableOpacity style={{flexDirection:'column',alignItems:'center',gap:10,justifyContent:'center'}}  onPress={() => navigation.navigate(item.path)}>
        <View style={{backgroundColor:'#fff',height:55,width:55,borderRadius:50,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
  <Image source={item.icon} style={{ width: 30, height: 30 }} />
    </View>
    <Text style={{color:"#fff",fontWeight:800,fontSize:16}}>{item.name}</Text>
        </TouchableOpacity>
        </View>
))       }
      </View>
        </View>
    )
}

export default Myaccount;

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
    zIndex: 999, // Ensure it appears above other components
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
  tabContainer: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'center',
    backgroundColor:"#D5D3D7"
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius:20
  },
  // Active tab style (changes background color)
  activeTab: {
    backgroundColor: '#621B98',
    borderRadius:10
  },
  // Text style for each tab
  tabText: {
    fontWeight: 'bold',
    color: '#000',
    fontSize: 14
  },
  // Active text style (changes color when active)
  activeTabText: {
    color: '#fff',
    fontWeight: 800
  },

  banner: {
    height: 180,
    backgroundColor: '#621B98'
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
    backgroundColor: '#621B98',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff', // blue-500
    fontWeight: 'bold',
  },
});