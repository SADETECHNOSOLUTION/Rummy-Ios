import React, { useEffect, useState,useRef } from 'react';
import { View, Image, ImageBackground,PanResponder,BackHandler,StatusBar ,ScrollView,Dimensions,TouchableWithoutFeedback ,Modal, StyleSheet, TouchableOpacity,Clipboard, Text,Linking,Animated } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import { Table, Row } from 'react-native-table-component';
import CheckBox from 'react-native-checkbox';  

const Toss = ()=>{

    const [toss,setToss] = useState()


    const suitImages = {
        Heart: require('./assets/heart.jpg'),
        Spade: require('./assets/spade.jpg'),
        Diamond: require('./assets/diamond.png'),
        Club: require('./assets/club.jpg'),
        Unknown: require('./assets/club.jpg'),
      };
      
    const FetchToss = async () => {
        const playerID = await SecureStore.getItemAsync('playerId');
        const token = await SecureStore.getItemAsync('token');
        try {
          // Fetch the player ID from SecureStore
     // Ensure the player ID is being retrieved properly
    
          if (!playerID) {
            console.error('Player ID is not available');
            return;
          }
    
          const response = await axios.get(`https://rummy-apigateway-v1.onrender.com/api/cards/680f1f81daf09f5808c9b68b/rank-players`,{
            headers:{
              'Authorization':`Bearer ${token}`
            }
          });
    
          if (response.status === 200) {
            const Data = response.data; 
            setToss(Data);
            console.log('FSD',toss?.Ranking);
          } else {
            console.error('Failed to fetch profile', response.status);
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      };
    
      useEffect(() => {
        FetchToss(); // Call the function when the component mounts
      }, []);
 return(
    <View style={{flexDirection:'row',gap:20}}>
       {toss?.Ranking.map((rank, index) => {
        const playerID = rank.split(":")[1].trim();
        const card = toss.PlayerCards[playerID]; // Get the card name

        if (card) {
          const [cardValue, suit] = card.split(" of "); // Split card into value and suit

          return (
            <View key={index} style={styles.Tosscard}>
              {/* <Text style={styles.rankText}>{rank}</Text> */}
              <Text style={styles.cardText}>{cardValue}</Text>
              <Image source={suitImages[suit]} style={styles.cardImage} />
            </View>
          );
        }

        return null;
      })}
       </View>
 )
}

export default Toss

const styles = StyleSheet.create({
    backgroundImage: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      resizeMode: 'cover',
    },
    playercon:{
    flexDirection:'row',
    justifyContent:'center'
    },
    buttonText:{
     fontSize:10
    },
    modalBackground: {
      flex: 1,
      position:'relative',
      flexDirection:"row",
      justifyContent:'center',
      alignItems:'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
  
    },
    modalContent: {
      backgroundColor: '#fff',
      padding: 20,
      flexDirection:'column',
      gap:16,
      borderRadius: 10,
      width: '50%',
      alignItems: 'center',
    },
    InstructionContent: {
      backgroundColor: 'white',
      padding: 10,
      flexDirection:'column',
      gap:16,
      borderRadius: 10,
      width: '70%',
      height:'90%',
      alignItems: 'center',
    },
    playerCard: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    rankText: {
      fontSize: 18,
      fontWeight: 'bold',
      marginRight: 10,
    },
    loadingcontainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalText: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
    },
    modalButton: {
      backgroundColor: '#621B98',  // Button color
      padding: 10,
      borderRadius: 5,
      width: '35%',
      alignItems: 'center',
    },
    modalButtonText: {
      color: 'white',
      fontSize: 14,
      fontWeight: 'bold',
    },
    bottomNavbar:{
      backgroundColor:'#621B98',
      flexDirection:'row',
      position:'relative',
      alignItems:"center",
      justifyContent:'space-between',
      height:42
    },
      container: {
      flex: 1,
      width: '100%',
  
    },
    stackCards: {
      flexDirection: 'row',
      flexWrap: 'wrap', // This allows the cards to wrap into multiple rows if necessary
      justifyContent: 'center',
      gap: 10, // Space between cards
    },
    sidebar: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: Dimensions.get('window').width * 0.70, // Sidebar takes up 75% of the screen width
      height: '100%',
      marginTop:30, // Dark background for the sidebar
      flexDirection:'row',
      backgroundColor:'#000',
      justifyContent: 'flex-end', // Align content from the top
      zIndex: 999, // Ensure it appears above other components
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
    button:{
      backgroundColor:'#FDC939',
      flexDirection:'row',
      justifyContent:'center',
      alignItems:'center',
      height:30,
      width:60,
      borderRadius:5
    },
    discardbutton:{
      backgroundColor:'#FDC939',
      flexDirection:'row',
      justifyContent:'center',
      alignItems:'center',
      height:30,
      width:60,
      borderRadius:5
    },
    card: {
      width: 70,
      height: 110,
      flexDirection:'column',
      justifyContent:'space-between',
      backgroundColor: '#fff',
      marginHorizontal: 5,
      // justifyContent: 'center',
      padding:3,
      borderRadius: 8,
      borderWidth:1,
      borderColor:'#CFCBCB',
      elevation: 2, // Add shadow for a card effect
      position: 'absolute', // This makes sure the cards are placed on top of each other
    },
    Tosscard: {
      width: 50,
      height: 80,
      backgroundColor: '#fff',
      marginHorizontal: 5,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 5,
      borderWidth:1,
      borderColor:'#000',
      elevation: 2, // Add shadow for a card effect
    },
    finishcard: {
      width: 40,
      height: 60,
      backgroundColor: 'transparent',
      marginHorizontal: 5,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 5,
      borderWidth:1,
      borderColor:'#000',
  
    },
    cardText: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    cardImage: {
      width: 16,    height: 14,
    },
    header: {
      backgroundColor: '#000', // Semi-transparent background for contrast
      width: '60%',
      paddingHorizontal: 30,
      paddingVertical:5,
  flexDirection:'row',
  justifyContent:'space-between',
  borderBottomLeftRadius:50,
  borderBottomRightRadius:50,
      alignItems: 'center',
      zIndex: 1, // Ensure it appears above the background
    },
    headerText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#000', // Ensure text contrasts with the background
    },
    body: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });