import React, { useEffect, useState,useRef } from 'react';
import { View, Image, Text } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const GameDetails = ()=>{
const route = useRoute()
const [game,setGame] = useState()
const {GameroomId} = route.params
      useEffect(() => {
        // Lock orientation to landscape
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    
        return () => {
          ScreenOrientation.unlockAsync();
        };
      }, []);

      const FetchGame = async () => {
        const playerID = await SecureStore.getItemAsync('playerId');
       const token = await SecureStore.getItemAsync('token');

        try {
          if (!playerID) {
            console.error('Player ID is not available');
            return;
          }
          
          const response = await axios.get(`https://rummy-apigateway-v1.onrender.com/api/room/get-detail/${GameroomId}`,{
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

      const date = new Date(game?.roomCreatedAt);

      const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

    return(
        <View style={{backgroundColor:'#5CBE8F',flex:1}}>
        <View style={{height:30}}>
         <Text></Text>
        </View>
        <View style={{flexDirection:'column',paddingHorizontal:30,gap:10}}>
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                <View>
                <Image style={{width:20,height:20}} source={require('./assets/back.png')}  />
                </View>
                <View style={{flexDirection:'row',alignItems:'center',gap:10}}>
              <View style={{paddingVertical:5,paddingHorizontal:10,borderRadius:50,borderWidth:1,borderColor:'#fff'}}>
              <Text style={{color:'#fff',fontWeight:700}}>{game?.roomType}</Text>
              </View>
              <Image style={{width:20,height:20}} source={require('./assets/shareactive.png')}  />
                </View>

            </View>
            <View>

            </View>
            <View style={{flexDirection:'row',gap:5,alignItems:'center'}}>
      {game?.issuedPoint!==0 &&       <Text style={{color:'#fff',fontSize:20,fontWeight:700}}>{game?.issuedPoint}</Text>}
            <Text style={{color:'#fff',fontSize:20,fontWeight:700}}>{game?.roomType}</Text>
            <Image style={{width:20,height:20}} source={require('./assets/separator.png')}  />
            <View style={{flexDirection:'row',gap:2,alignItems:'center'}}>
            <Image style={{width:20,height:20}} source={require('./assets/friendsactive.png')}  />
            <Text style={{color:'#fff',fontSize:20,fontWeight:700}}>{game?.roomSize} Players</Text>
            </View>
            </View>
            <View style={{flexDirection:'row',gap:5,alignItems:'center'}}>
            <Text style={{color:'#D7D3D3',fontSize:14,fontWeight:700}}>{formattedDate}</Text>
            <Image style={{width:20,height:20}} source={require('./assets/separator.png')}  />
            <View style={{flexDirection:'row',gap:2,alignItems:'center'}}>
            <Text style={{color:'#D7D3D3',fontSize:14,fontWeight:700}}>Game ID {game?.roomId}</Text>
            </View>
            </View>
            <View style={{flexDirection:'column'}}>
<View style={{flexDirection:'row',padding:10}}>
<Text style={{color:'#fff',width:'10%',backgroundColor:'#000'}}>Rank</Text>
</View>
            </View>
        </View>
        </View>
    )
}

export default GameDetails;