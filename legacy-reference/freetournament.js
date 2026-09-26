import React, { useEffect, useState,useRef } from "react";
import { View, Text,Image,ScrollView, TouchableOpacity, StyleSheet,Animated,TouchableWithoutFeedback,Dimensions,Alert  } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from 'expo-secure-store';

const AllTournament =()=>{
  const navigation = useNavigation()
  const [tournament,setTournament] = useState()
  const [tournamentList, setTournamentList] = useState([]);
       const [genderVisible, setGenderVisible] = useState(false);  
       const [showSuccess, setShowSuccess] = useState(false);
       
       const [showWithdraw, setshowWithdraw] = useState(false);
const playerId = SecureStore.getItemAsync('playerId')
  const dimAnimGender = useRef(new Animated.Value(0)).current;
      const slideAnimGender = new Animated.Value(0);
  const openTournamentDetails = (tournamentId) => {
    // Navigate and pass the tournament ID as a parameter
    navigation.navigate('TournamentDetailsById', { tournamentId });
  };
    const [isJoinDisabled,setIsJoinDisabled] = useState()
  const FetchTournamentDetails = async () => {
          const token = await SecureStore.getItemAsync('token');
    try {
      // Fetch the tournament details
      const response = await fetch(
      `https://rummy-apigateway-v1.onrender.com/api/tournament/get-all-tournament`,
        {
          method: 'GET',
          headers:{
           'Authorization': `Bearer ${token}`
          }
        }
      );
  
      // Check if the response is ok (status 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      // Parse the response body to JSON
      const data = await response.json();
  
      // Set the tournament data in state
      setTournament(data);

      console.log(data?.entryFee);
  
    } catch (error) {
      console.error("Error fetching tournament details:", error);
      console.log(error);
    }
  }
      const slideAnimProfile = new Animated.Value(0);
        const dimAnimProfile = useRef(new Animated.Value(0)).current;
  useEffect(()=>{
    FetchTournamentDetails()
  },[])

      const openGender = () => {
        if (genderVisible) {
          // Close the sidebar
          Animated.timing(slideAnimProfile, {
            toValue: Dimensions.get('window').width, // Move sidebar off-screen
            duration: 300,
            useNativeDriver: true,
          }).start();
          // Fade out the dim background
          Animated.timing(dimAnimGender, {
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
          Animated.timing(dimAnimGender, {
            toValue: 0.5, // Dim the background to 50% opacity
            duration: 300,
            useNativeDriver: true,
          }).start();
  
        }
        setGenderVisible(!genderVisible); // Toggle the state
      };
      const closeGender = () => {
        // Close the sidebar
        Animated.timing(sidebarAnim, {
          toValue: Dimensions.get('window').width, // Move sidebar off-screen
          duration: 300,
          useNativeDriver: true,
        }).start();
  
        Animated.timing(dimAnimGender, {
          toValue: 0, // Fade out the dim background
          duration: 300,
          useNativeDriver: true,
        }).start();
      
        setGenderVisible(false);// Make sure dim is hidden
      };

      const JoinTournament = async (tournamentId) => {
        const token = await SecureStore.getItemAsync('token');
        const playerId = await SecureStore.getItemAsync('playerId');
        try{
          const response = await fetch(`https://rummy-apigateway-v1.onrender.com/api/tournament/join/${tournamentId}?playerId=${playerId}`,{
            method: 'PATCH',
            headers:{
              'Authorization':`Bearer ${token}`
            }
          });
  
          if(response.ok){
            FetchTournamentDetails();
            setShowSuccess(true);
          }
  
       else{
            console.log(tournamentId,playerId)
          }
      
          const data = await response.json(); // Parse response body as JSON
          console.log(data); // Log the data from the response
          console.log('Registered successfully');
        } catch (error) {
          console.error("Error joining the tournament:", error);
          console.log(error.message); // Log error message
          console.log('Registration failed');
          console.log(tournamentId,playerId)
        }
      }

      useEffect(() => {
        const fetchPlayerIdAndCheck = async () => {
          const playerId = await SecureStore.getItemAsync('playerId');
          
          if (tournament && playerId) {
            const updatedTournaments = tournament.map((t) => ({
              ...t,
              isJoined: t.playerId?.includes(playerId), // Make sure t.playerId is an array
            }));
      
            setTournament(updatedTournaments); // 👈 Update tournament here
          }
        };
      
        fetchPlayerIdAndCheck();
      }, [tournament]);
      
    return(
      <View style={{width:'100%'}}>

    <ScrollView style={{height:600}}>
    <View style={{flexDirection:'column',gap:20,marginBottom:200}}>
      {tournament?.map((Tournaments)=>
      {
        const dateStr = Tournaments?.matchStartingDate; // "2025-05-10"
        const timeStr = Tournaments?.matchStartingAt;   // "15:30:00"
        
        const combinedDateTime = `${dateStr}T${timeStr}`; // "2025-05-10T15:30:00"
        
        const date = new Date(combinedDateTime);
        
        const formattedDate = date.toLocaleString('en-US', {
          month: 'long',  // "May"
          day: 'numeric', // 10
          hour: 'numeric',
          minute: 'numeric',
          hour12: true    // 12-hour format like "3:30 PM"
        });
        return( 
          <View>
          <View key={Tournaments.id} style={styles.Tournamentcard}>
     <View style={styles.cardHeading}>
    <Text style={styles.headingtext}>
    {Tournaments?.tournamentName}
    </Text>
    <TouchableOpacity onPress={()=>openTournamentDetails(Tournaments.id)} style={{flexDirection:'row',alignItems:'center'}}>
    <Text style={styles.headingtext}>Details</Text>
    <Image style={{width:12,height:12}} source={require('./assets/next.png')}  />
    </TouchableOpacity>
   
     </View>
     <TouchableOpacity onPress={()=>openTournamentDetails(Tournaments.id)} style={{flexDirection:'row',width:'100%',paddingVertical:10,alignItems:'center',justifyContent:'space-between'}}>
      <View style={{width:'50%'}}>
      <View style={{flexDirection:'row',gap:2,}}>
      <Image style={{width:30,height:30}} source={require('./assets/trophy.png')}  />
      <View>
      <Text style={{fontSize:20,fontWeight:800}}>{Tournaments?.grandTotal}</Text>

      </View>

      </View>
      <Text style={{fontSize:12,color:'#D71919',}}>{Tournaments?.description}</Text>
      </View>

      <View style={{flexDirection:"column",gap:10,alignItems:'center',}}>
      <Text>Entry: {Tournaments?.entryFee===0 ? Tournaments?.tournamentType : <Text>₹{Tournaments?.entryFee}</Text>}</Text>
      {Tournaments.isJoined ? (
  <TouchableOpacity onPress={()=>{setshowWithdraw(true)}} style={styles.button}>
    <Text style={{ color: '#fff', fontWeight: '800' }}>Withdraw</Text>
  </TouchableOpacity>
) : (
  <TouchableOpacity onPress={() => {
    JoinTournament(Tournaments.id);

  }} style={styles.button}>
    <Text style={{ color: '#fff', fontWeight: '800' }}>Join</Text>
  </TouchableOpacity>
)}





      </View>
     </TouchableOpacity>

    </View>
         <TouchableOpacity  onPress={()=>openTournamentDetails(Tournaments.id)} style={styles.details}>
         <View style={styles.center}>
         <Text style={{fontSize:10}}>Winners</Text>
         <Text style={{fontSize:12}}>{Tournaments?.winners}</Text>
         </View>
 <View style={styles.center}>
         <Text style={{fontSize:10}}>Seats</Text>
         <Text style={{fontSize:12}}>{Tournaments?.tournamentRoomSize}</Text>
         </View>
         <View style={styles.center}>
         <Text style={{fontSize:10}} >Format</Text>
         <Text style={{fontSize:12}}>{Tournaments?.tournamentMode} </Text>
         </View>
         <View style={styles.center}>
         <Text style={{fontSize:10}}>Tournament starts at</Text>
         <Text style={{fontSize:10}}>{formattedDate}</Text>
         </View>
      </TouchableOpacity>
      </View>
)})
}
</View>

    </ScrollView>
    {showSuccess && (
  <View style={styles.successPopup}>
    <View style={{width:'100%',flexDirection:'row',justifyContent:"space-between",alignItems:'center'}}>
    <Text style={{color:'#fff',fontWeight:800}}>Jumbo Jackpot 1.5L Guaranteed</Text>
    <TouchableOpacity onPress={()=>{setShowSuccess(false)}}>
    <Image source={require('./assets/cancel.png')} style={{width:16,height:17}} />
    </TouchableOpacity>

      </View>
      <View style={{flexDirection:'column',alignItems:'center',gap:8,width:'100%'}}>
        <View style={{backgroundColor:'#fff',borderRadius:100}}>
        <Image
      source={require('./assets/complete.png')} // 👈 Add your success image here
      style={{ width: 50, height: 50 }}
    />
          </View>

    <Text style={{ fontSize: 16, fontWeight: 'bold',color:'#fff' }}>
      Slot Confirmed!
    </Text>
    <Text style={{ fontSize: 12, color: '#fff', textAlign: 'center'}}>
      You have successfully joined the tournament.
    </Text>
    <TouchableOpacity
      onPress={() => setShowSuccess(false)}
      style={styles.successButton}
    >
      <Text style={{ color: '#000', fontWeight: 800 }}>Okay</Text>
    </TouchableOpacity>
        </View>

  </View>
)}

{showWithdraw && (
  <View style={styles.successPopup}>
    <View style={{width:'100%',flexDirection:'row',justifyContent:"space-between",alignItems:'center'}}>
    <Text style={{color:'#fff',fontWeight:800}}>Jumbo Jackpot 1.5L Guaranteed</Text>
    <TouchableOpacity onPress={()=>{setShowSuccess(false)}}>
    <Image source={require('./assets/cancel.png')} style={{width:16,height:17}} />
    </TouchableOpacity>

      </View>
      <View style={{flexDirection:'column',alignItems:'center',gap:8,width:'100%'}}>

    <Text style={{ fontSize: 14, fontWeight: 'bold',color:'#fff',textAlign:'center' }}>
      Do you want to keep your seat in this tournament?
    </Text>
    <View style={{borderRadius:10,flexDirection:'row',gap:10,alignItems:'center',padding:10,borderWidth:1,borderColor:"#BECDDE",width:'100%',justifyContent:'center'}}>
        <Image
      source={require('./assets/trophy.png')} // 👈 Add your success image here
      style={{ width: 35, height: 35 }}
    />
    <Text style={{color:'#FFF',width:'35%'}}>Expected Prize ₹ 1 LAKH</Text>
          </View>
<View style={{flexDirection:'row',justifyContent:'space-between',width:'100%',gap:20}}>
<TouchableOpacity
      onPress={() => setshowWithdraw(false)}
      style={{      marginTop: 10,
        flexDirection:"row",
        justifyContent:'center',
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        width:'40%'
      }}
    >
      <Text style={{ color: '#000', fontWeight: 800 }}>Withdraw</Text>
    </TouchableOpacity>
    <TouchableOpacity
      onPress={() => setshowWithdraw(false)}
      style={{      marginTop: 10,
        flexDirection:"row",
        justifyContent:'center',
        backgroundColor: '#FDC939',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        width:'40%'
      }}
    >
      <Text style={{ color: '#000', fontWeight: 800 }}>Yes</Text>
    </TouchableOpacity>
  </View>

        </View>

  </View>
)}
    </View>
    )
}

export default AllTournament;

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal:20,
      height:96,
      backgroundColor: '#621B98', // blue-500
    },
    headingtext:{
      fontSize:12
    },
    subheadingtext:{
        fontSize:12,
        color:'#9D9895'
    },
    successPopup: {
      position: 'absolute',
      // top: '30%',
      // left: '10%',
      // right: '10%',
      backgroundColor: '#621B98',
      borderRadius: 10,
      padding: 20,
      gap:16,
      // bottom:100,
      width:'100%',
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      zIndex: 1000,
    },
    successButton: {
      marginTop: 10,
      flexDirection:"row",
      justifyContent:'center',
      backgroundColor: '#FDC939',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 5,
      width:"100%"
    },
    
    price:{
        paddingVertical:10,
      width:'100%',
      flexDirection:'row',
      justifyContent:"space-between"
    },
    chips:{
      flexDirection:'column',
      alignItems:'center'
    },
    center:{
        flexDirection:'column',
        alignItems:'center',
        backgroundColor:"#"
    },
    
    cardHeading:{
      flexDirection:'row',
      width:'100%',
      paddingVertical:5,
      borderBottomWidth:1,
      justifyContent:'space-between',
      borderBottomColor:'#D1CECC'
    },
    cardposition:{
      flexDirection:'row',
      gap:10
    },
    details:{
      paddingHorizontal:15,
      paddingVertical:2,
      borderBottomLeftRadius:10,
      borderBottomRightRadius:10,
      backgroundColor:'#E4DFDF',
      flexDirection:'row',
      alignItems:'center',
      width:'100%',
      justifyContent:'space-between'
    },
    show:{
      width: '100%',
      height: 32,
      backgroundColor:'#fff'
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
    },
    Tournamentcard:{
      display:'flex',
      flexDirection:'column',
      justifyContent:'space-between',
      alignItems:"center",
      padding:10,
      borderBottomWidth:1,
      borderColor:'#D1CECC',
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
    profileImage: {
      width: 72,
      height: 72,
      borderRadius: 24, // rounded-full
    },
    button: {
      flexDirection:'row',
      gap:4,
      justifyContent:'center',
      backgroundColor:'#621B98',
      paddingVertical: 5,
      width:85,
      borderRadius: 5,
    },
    buttonText: {
      color: '#fff', // blue-500
      fontWeight: 'bold',
      fontSize:20
    },
    modalContent: {
      width: '100%',
      backgroundColor: '#fff',
      position:'absolute',
      flexDirection:'column',
      gap:12,
      bottom:100,
      padding: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    modalInput: {
      height: 40,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 5,
      marginBottom: 20,
      paddingLeft: 10,
    },
    modalButtons:{
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    modalButton: {
      backgroundColor: '#621B98',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
    },
    modalButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    buttonoutline:{
      flexDirection:'row',
      alignItems:'center',
      gap:4,
      padding:10,
      borderWidth:1,
      borderRadius:5,
      backgroundColor:'#fff',
      borderColor:'#BEBDBC'
    }
  });
  