import React,{useCallback,useEffect, useState} from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet,ScrollView } from 'react-native';
import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import Header from "./header";


const TournamentDetails = ({route})=>{
    const [Prizeexpanded, setPrizeExpanded] = useState(false);
    const [ticketexpanded, setTicketExpanded] = useState(true);
    const [rejoinDisplay, setRejoinDisplay] = useState(true);
    const [latejoinDisplay, setLatejoinDisplay] = useState(true);
    const [structureDisplay, setStructurDisplay] = useState(true);
    const [Tournament,setTournament] = useState();
    const [displayJoined,setDisplayJoined] = useState(false);
    const playerId = SecureStore.getItemAsync('playerId');
    const [isJoinDisabled,setIsJoinDisabled] = useState(false)
    const { tournamentId } = route.params;
    const FetchTournamentDetails = async () => {
      const token = await SecureStore.getItemAsync('token');

      try {
        // Fetch the tournament details
        const response = await fetch(
          `https://rummy-apigateway-v1.onrender.com/api/tournament/get/${tournamentId}`,
          {
            method: 'GET',
            headers:{
              'Authorization':`Bearer ${token}`
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
        console.log(Tournament?.playerId)
        // Log the tournament's entry fee
        // console.log(data?.entryFee);
    
      } catch (error) {
        console.error("Error fetching tournament details:", error);
        console.log(error);
      }
    }
    
    // Fetch the tournament details when the component mounts or the function changes
    useEffect(() => {
      FetchTournamentDetails();
    }, []);
    useEffect(() => {
      const fetchPlayerIdAndCheck = async () => {
        const playerId = await SecureStore.getItemAsync('playerId');
        
        if (Tournament && playerId) {
          // Use the `some()` method to check if playerId is already in the list of players
          const isPlayerAlreadyInTournament = Tournament.playerId?.some(id => id === playerId);
      
          if (isPlayerAlreadyInTournament) {
            setIsJoinDisabled(true);
  // Disable the join button if playerId is already in the tournament
          } else {
            setIsJoinDisabled(false);
 // Enable join button if playerId is not in the tournament
          }
        }
      };
    
      fetchPlayerIdAndCheck();
    }, [Tournament]);  // Only re-run this effect if `Tournament` changes
    
    
    const JoinTournament = async () => {
      const token = await SecureStore.getItemAsync('token');

      const playerId = await SecureStore.getItemAsync('playerId');
      try {
        const response = await fetch(`https://rummy-apigateway-v1.onrender.com/api/tournament/join/${tournamentId}?playerId=${playerId}`,{
          method: 'PATCH',
          headers:{
            'Authorization':`Bearer ${token}`
          }
        });

        if(response.ok){
          FetchTournamentDetails();
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); // Parse response body as JSON
        console.log(data); // Log the data from the response
        console.log('Registered successfully');
      } catch (error) {
        console.error("Error joining the tournament:", error);
        console.log(error.message); // Log error message
        console.log('Registration failed');
      }
    }
    
    const dateStr = Tournament?.matchStartingDate; // "2025-05-10"
    const timeStr = Tournament?.matchStartingAt;   // "15:30:00"
    
    const combinedDateTime = `${dateStr}T${timeStr}`; // "2025-05-10T15:30:00"
    
    const date = new Date(combinedDateTime);
    
    const formattedDate = date.toLocaleString('en-US', {
      month: 'long',  // "May"
      day: 'numeric', // 10
      hour: 'numeric',
      minute: 'numeric',
      hour12: true    // 12-hour format like "3:30 PM"
    });
  
    const ranksData = [
        { rank: 1, prize: '5000' },
        { rank: 2, prize: '4000' },
        { rank: 3, prize: '3000' },
        { rank: 4, prize: '2500' },
        { rank: 5, prize: '2000' },
        { rank: 6, prize: '1500' },
        { rank: 7, prize: '1200' },
        { rank: 8, prize: '1000' },
        { rank: 9, prize: '800' },
        { rank: 10, prize: '600' },
      ];
      const toggleExpand = () => {
        setPrizeExpanded(!Prizeexpanded);
      };

      const toggleTicket = () => {
        setTicketExpanded(!ticketexpanded);
      };

      const toggleRejoin = () => {
        setRejoinDisplay(!rejoinDisplay);
      };

      const toggleLatejoin = () => {
        setLatejoinDisplay(!latejoinDisplay);
      };

      const toggleStructure = () => {
        setStructurDisplay(!structureDisplay);
      };

      const toggleJoined = () => {
        setDisplayJoined(!displayJoined);
      };
      
    
      // Get the ranks to display (either the first 3 or all if expanded)
      const displayedRanks = Prizeexpanded ? Tournament?.priceDistributions : Tournament?.priceDistributions.slice(0, 3);
      const displayedRejoin = rejoinDisplay && Tournament?.rejoins
      const displayedLatejoin = latejoinDisplay && Tournament?.lateJoins
      const displayedStructure = structureDisplay && Tournament?.pointStructures
      const displayedJoined = displayJoined ? Tournament?.playerId : Tournament?.playerId.slice(0, 3);

    return(
    <View style={{height:'100%'}}>
       <View  style={{backgroundColor:'#fff',height:40}}>

       </View>
       <Header />

{Tournament &&     <ScrollView style={{flex: 1,backgroundColor:'#000', }}>
        <View style={styles.Tournamentcard}>
          <View style={{width:'100%',paddingHorizontal:10,borderRadius:0}}>
            <View style={{backgroundColor:'#fff',padding:10,width:'100%'}}>
            <View style={styles.cardHeading}>
<Text style={styles.headingtext}>
    Jumbo Jackpot 1.5L Guaranteed
</Text>
 </View>

 <View style={styles.price}>
  <View style={{width:180,flexDirection:'row',gap:2}}>
  <Image style={{width:30,height:30}} source={require('./assets/trophy.png')}  />
  <View>
  <Text style={{fontSize:20,fontWeight:800}}>₹{Tournament?.grandTotal}</Text>
  <Text style={{fontSize:12,color:'#D71919'}}>{Tournament?.description}</Text>
  </View>
  </View>
  <View style={{flexDirection:"column",gap:10}}>
<Text>Entry: {Tournament?.entryFee===0 ? Tournament?.tournamentType : <Text>₹{Tournament?.entryFee}</Text>}</Text>
{isJoinDisabled?  <TouchableOpacity style={styles.inactivebutton}>
        <Text style={{color:'#fff',fontWeight:800}}>Joined</Text>
    </TouchableOpacity> : <TouchableOpacity onPress={JoinTournament} style={styles.button}>
        <Text style={{color:'#fff',fontWeight:800}}>Join</Text>
    </TouchableOpacity>}
  </View>
 </View>
 <View style={styles.details}>
    <View style={styles.center}>
    <Text style={styles.subheadingtext}>Winners</Text>
    <Text style={{fontSize:12}}>{Tournament?.winners}</Text>
    </View>
    <View style={styles.center}>
    <Text style={styles.subheadingtext}>Seats</Text>
    <Text style={{fontSize:12}}>{Tournament?.tournamentRoomSize}</Text>
    </View>
    <View style={styles.center}>
    <Text style={styles.subheadingtext}>Format</Text>
    <Text style={{fontSize:12}}>{Tournament?.tournamentMode} </Text>
    </View>
    <View style={styles.center}>
    <Text style={{fontSize:10}}>Tournament starts at</Text>
    <Text style={{fontSize:10}}>{formattedDate}</Text>
    </View>
 </View>
            </View>
{Tournament?.tournamentMode ==='Point' && 
     <View style={styles.infocardContainer}>
      { Tournament.estimatedDuration &&      <View style={styles.infocard}>
        <Image source={require('./assets/duration.png')} style={{height:25,width:25}} />
        <View>
            <Text style={styles.subheadingtext}>Estimated Duration</Text>
            <Text style={{fontWeight:800,fontSize:12}}>{ Tournament.estimatedDuration}</Text>
        </View>
        </View>}
        { Tournament.rebuy &&      <View style={styles.infocard}>
        <Image source={require('./assets/cashm.png')} style={{height:25,width:25}} />
        <View>
            <Text style={styles.subheadingtext}>Rebuy</Text>
            <Text style={{fontWeight:800,fontSize:12}}>{Tournament.rebuy === true? 'Available':''}</Text>
        </View>
        </View>}
        { Tournament.startingChipStack &&      <View style={styles.infocard}>
        <Image source={require('./assets/practice.png')} style={{height:25,width:25}} />
        <View>
            <Text style={styles.subheadingtext}>Starting Chip Stack</Text>
            <Text style={{fontWeight:800,fontSize:12}}>{Tournament.startingChipStack}</Text>
        </View>
        </View>}
        { Tournament.extraPrizePool &&      <View style={styles.infocard}>
        <Image source={require('./assets/cashm.png')} style={{height:25,width:25}} />
        <View>
            <Text style={styles.subheadingtext}>Extra Prize Pool</Text>
            <Text style={{fontWeight:800,fontSize:12}}>{Tournament.extraPrizePool}</Text>
        </View>
        </View>}
     </View>}

     {Tournament?.tournamentMode ==='Deal' && 
     <View style={styles.infocardContainer}>

{ Tournament.estimatedDuration &&      <View style={styles.infocard}>
        <Image source={require('./assets/duration.png')} style={{height:25,width:25}} />
        <View>
            <Text style={styles.subheadingtext}>Estimated Duration</Text>
            <Text style={{fontWeight:800,fontSize:12}}>{Tournament.estimatedDuration}</Text>
        </View>
        </View>}
<View style={styles.infocard}>
        <Image source={require('./assets/rounds.png')} style={{height:25,width:25}} />
        <View>
            <Text style={styles.subheadingtext}>Deals Per Round</Text>
            <Text style={{fontWeight:800,fontSize:12}}>{Tournament.dealPerRound}</Text>
        </View>
        </View>
        { Tournament.totalRounds &&      <View style={styles.infocard}>
        <Image source={require('./assets/totalrounds.png')} style={{height:25,width:25}} />
        <View>
            <Text style={styles.subheadingtext}>Total Rounds</Text>
            <Text style={{fontWeight:800,fontSize:12}}>{Tournament.totalRounds}</Text>
        </View>
        </View>}
     </View>}
     <View style={{padding:10,width:'100%',backgroundColor:'#fff'}}>
{isJoinDisabled?<TouchableOpacity style={{width:'100%',backgroundColor:'#B7AFAF',height:40,borderRadius:5,display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
     <Text style={{color:'#fff',fontWeight:800,fontSize:16}}> Joined</Text>
     </TouchableOpacity>:     <TouchableOpacity onPress={JoinTournament} style={{width:'100%',backgroundColor:'#621B98',height:40,borderRadius:5,display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
     <Text style={{color:'#fff',fontWeight:800,fontSize:16}}> Join Now</Text>
     </TouchableOpacity>}
     <View style={{padding:10,width:'100%',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
     <Text style={styles.subheadingtext}>Winnings will be transferred to deposit balance</Text>
     <Text style={styles.subheadingtext}>Registration End: transferred to</Text>
     </View>
     </View>
     </View>
     <View style={{paddingVertical:20,paddingHorizontal:10,width:'100%',gap:20}}>
     <View style={{width:'100%',backgroundColor:'#fffFFF',borderRadius:10,shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 50,
    // Shadow for Android
    elevation: 5,}}>
        <View style={styles.tableheading}>
            <View style={{flexDirection:'row',gap:5,alignItems:'center'}}>
            <Image style={{width:20,height:20}} source={require('./assets/trophy.png')}  />
                <Text style={{color:'#621B98 ',fontWeight:800}}>Prizes ({Tournament?.winners})</Text>
            </View>
            <TouchableOpacity onPress={toggleExpand}>
        {Prizeexpanded? <Image style={{width:30,height:30}} source={require('./assets/up.png')}  /> :   <Image style={{width:30,height:30}} source={require('./assets/down.png')}  />}
            
            </TouchableOpacity>
           
        </View>
        <View style={{flexDirection:'row',justifyContent:'space-between',paddingHorizontal:20,paddingVertical:5,backgroundColor:'#546F93'}}>
            <Text style={styles.textcolor}>Rank</Text>
            <Text style={styles.textcolor}>Prizes</Text>

        </View>
        <View style={{flexDirection:'column'}}>
        <View style={{ flexDirection: 'column' }}>
        {displayedRanks?.map((item, index) => (
          <View key={index} style={{ flexDirection: 'row', paddingHorizontal: 20,paddingVertical:'7', gap: 10,borderBottomWidth:1,borderBottomColor:'#D1CECC',justifyContent:'space-between'}}>
            <Text>{item.position}</Text>
            <Text>{item.prizeAmount}</Text>
          </View>
        ))}
      </View>
        </View>
     </View>
     <View style={{width:'100%',backgroundColor:'#fffFFF',borderRadius:10,shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 50,
    // Shadow for Android
    elevation: 5,}}>
        <View style={styles.tableheading}>
            <View style={{flexDirection:'row',gap:5,alignItems:'center'}}>
            <Image style={{width:20,height:20}} source={require('./assets/ticket.png')}  />
                <Text style={{color:'#621B98 ',fontWeight:800}}>Tournament Ticket</Text>
            </View>
            <TouchableOpacity onPress={toggleTicket}>
        {ticketexpanded? <Image style={{width:30,height:30}} source={require('./assets/up.png')}  /> :   <Image style={{width:30,height:30}} source={require('./assets/down.png')}  />}
            
            </TouchableOpacity>
           
        </View>
{ticketexpanded?      <View style={{flexDirection:'column',gap:5,paddingHorizontal:20,paddingVertical:10}}>
        <Text>Ticket Prizes:</Text>
        <View style={{flexDirection:'row',alignItems:'center',gap:5}}>
        <Text style={{fontWeight:800}}>Superstars NewYear Daily Finale GTD</Text>
        <Image style={{width:20,height:20}} source={require('./assets/ticket.png')}  />
          </View>

      </View>:''}
     </View>
     <View style={{width:'100%',backgroundColor:'#fffFFF',borderRadius:10, shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 50,
    // Shadow for Android
    elevation: 5,}}>
        <View style={styles.tableheading}>
            <View style={{flexDirection:'row',gap:5,alignItems:'center'}}>
            <Image style={{width:20,height:20}} source={require('./assets/tournamentstructure.png')}  />
                <Text style={{color:'#621B98 ',fontWeight:800}}>Tournament Structure</Text>
            </View>
            <TouchableOpacity onPress={toggleStructure}>
        {structureDisplay? <Image style={{width:30,height:30}} source={require('./assets/up.png')}  /> :   <Image style={{width:30,height:30}} source={require('./assets/down.png')}  />}
            </TouchableOpacity>
           
        </View>
        {structureDisplay &&  
        <View>
        <View style={{flexDirection:'row',justifyContent:'space-between',paddingHorizontal:10,paddingVertical:5,backgroundColor:'#546F93'}}>

  <View style={{ maxWidth: 45, minWidth: 'auto', flexShrink: 1 }}>
    <Text style={{ fontSize: 10,color:'#fff' }}>Round</Text>
  </View>
  <View style={{ maxWidth: 45, minWidth: 'auto', flexShrink: 1 }}>
    <Text style={{ fontSize: 10,color:'#fff' }}>Duration</Text>
  </View>
  <View style={{ maxWidth: 45, minWidth: 'auto', flexShrink: 1 }}>
    <Text style={{ fontSize: 10,color:'#fff' }}>Point Value</Text>
  </View>
  <View style={{ maxWidth: 45, minWidth: 'auto', flexShrink: 1 }}>
    <Text style={{ fontSize: 10,color:'#fff' }}>Maximum Chips</Text>
  </View>
  <View style={{ maxWidth: 45, minWidth: 'auto', flexShrink: 1 }}>
    <Text style={{ fontSize: 10,color:'#fff' }}>Rebuy Fee</Text>
  </View>
  <View style={{ maxWidth: 45, minWidth: 'auto', flexShrink: 1,}}>
    <Text style={{ fontSize: 10,color:'#fff' }}>Final Chips Count</Text>
  </View>

        </View>
      <View style={{flexDirection:'column'}}>
        <View style={{ flexDirection: 'column' }}>
        {displayedStructure?.map((item, index) => (
          <View key={index} style={{ flexDirection: 'row', paddingHorizontal: 10,paddingVertical:'7', gap: 10,borderBottomWidth:1,borderBottomColor:'#D1CECC',justifyContent:'space-between'}}>
            <Text style={{ fontSize: 10 }}>{item.round}</Text>
            <Text style={{ fontSize: 10 }}>{item.duration}</Text>
            <Text style={{ fontSize: 10 }}>{item.pointValue}</Text>
            <Text style={{ fontSize: 10 }}>{item.minimumChips}</Text>
            <Text style={{ fontSize: 10 }}>{item.rebuyFee}</Text>
            <Text style={{ fontSize: 10 }}>{item.finalChipsCount}</Text>
          </View>
        ))}
      </View>
        </View>
        </View>}
     </View>
     <View style={{width:'100%',backgroundColor:'#fffFFF',borderRadius:10, shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 50,
    // Shadow for Android
    elevation: 5,}}>
        <View style={styles.tableheading}>
            <View style={{flexDirection:'row',gap:5,alignItems:'center'}}>
            <Image style={{width:20,height:20}} source={require('./assets/rejoin.png')}  />
                <Text style={{color:'#621B98 ',fontWeight:800}}>Rejoin</Text>
            </View>
            <TouchableOpacity onPress={toggleRejoin}>
        {rejoinDisplay? <Image style={{width:30,height:30}} source={require('./assets/up.png')}  /> :   <Image style={{width:30,height:30}} source={require('./assets/down.png')}  />}
            
            </TouchableOpacity>
           
        </View>
        {rejoinDisplay &&  
        <View>
        <View style={{flexDirection:'row',justifyContent:'space-between',paddingHorizontal:20,paddingVertical:5,backgroundColor:'#546F93'}}>
            <Text style={styles.textcolor}>Round</Text>
            <Text style={styles.textcolor}>Rejoin Fee</Text>
            <Text style={styles.textcolor}>Rejoin Chips</Text>

        </View>
      <View style={{flexDirection:'column'}}>
        <View style={{ flexDirection: 'column' }}>
        {displayedRejoin?.map((item, index) => (
          <View key={index} style={{ flexDirection: 'row', paddingHorizontal: 20,paddingVertical:'7', gap: 10,borderBottomWidth:1,borderBottomColor:'#D1CECC',justifyContent:'space-between'}}>
            <Text>{item.round}</Text>
            <Text>{item.rejoinFee}</Text>
            <Text>{item.rejoinChips}</Text>
          </View>
        ))}
      </View>
        </View>
        </View>}
     </View>

     <View style={{width:'100%',backgroundColor:'#fffFFF',borderRadius:10, shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 50,
    // Shadow for Android
    elevation: 5,}}>
        <View style={styles.tableheading}>
            <View style={{flexDirection:'row',gap:5,alignItems:'center'}}>
            <Image style={{width:20,height:20}} source={require('./assets/latejoin.png')}  />
                <Text style={{color:'#621B98 ',fontWeight:800}}>latejoin</Text>
            </View>
            <TouchableOpacity onPress={toggleLatejoin}>
        {latejoinDisplay? <Image style={{width:30,height:30}} source={require('./assets/up.png')}  /> :   <Image style={{width:30,height:30}} source={require('./assets/down.png')}  />}
            
            </TouchableOpacity>
           
        </View>
        {latejoinDisplay &&  
        <View>
        <View style={{flexDirection:'row',justifyContent:'space-between',paddingHorizontal:20,paddingVertical:5,backgroundColor:'#546F93'}}>
            <Text style={styles.textcolor}>Round</Text>
            <Text style={styles.textcolor}>lateJoin Fee</Text>
            <Text style={styles.textcolor}>lateJoin Chips</Text>

        </View>
      <View style={{flexDirection:'column'}}>
        <View style={{ flexDirection: 'column' }}>
        {displayedLatejoin?.map((item, index) => (
          <View key={index} style={{ flexDirection: 'row', paddingHorizontal: 20,paddingVertical:'7', gap: 10,borderBottomWidth:1,borderBottomColor:'#D1CECC',justifyContent:'space-between'}}>
            <Text>{item.round}</Text>
            <Text>{item.lateJoinFee}</Text>
            <Text>{item.lateJoinChips}</Text>
          </View>
        ))}
      </View>
        </View>
        </View>}
     </View>
     <View style={{width:'100%',backgroundColor:'#fffFFF',borderRadius:10,shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 50,
    // Shadow for Android
    elevation: 5,}}>
        <View style={styles.tableheading}>
            <View style={{flexDirection:'row',gap:5,alignItems:'center'}}>
            <Image style={{width:18,height:18}} source={require('./assets/joiners.png')}  />
                <Text style={{color:'#621B98 ',fontWeight:800}}>Joined ({Tournament?.playerId.length})</Text>
            </View>
            <TouchableOpacity onPress={toggleJoined}>
        {displayJoined? <Image style={{width:30,height:30}} source={require('./assets/up.png')}  /> :   <Image style={{width:30,height:30}} source={require('./assets/down.png')}  />}
            </TouchableOpacity>
           
        </View>
        {/* <View style={{flexDirection:'row',justifyContent:'space-between',paddingHorizontal:20,paddingVertical:5,backgroundColor:'#546F93'}}>
            <Text>Rank</Text>
            <Text>Prizes</Text>

        </View> */}
        <View style={{flexDirection:'column'}}>
        <View style={{ flexDirection: 'column' }}>
        {displayedJoined?.map((item, index) => (
          <View key={index} style={{ flexDirection: 'row', paddingHorizontal: 20,paddingVertical:'7', gap: 10,borderBottomWidth:1,borderBottomColor:'#D1CECC',justifyContent:'space-between'}}>
            <Text>{item}</Text>

          </View>
        ))}
      </View>
        </View>
     </View>
     </View>
     <View style={{paddingVertical:10}}>
     <Text style={{fontSize:10}}>*Expected price may change according to the number of players joined</Text>
     </View>

     </View>
     </ScrollView>}


    </View>

    )
}

export default  TournamentDetails;

const styles = StyleSheet.create({
  tableheading:{
    flexDirection:'row',
    justifyContent:'space-between',
    padding:10,
    alignItems:'center',
    borderBottomColor:'#D0CFCC',
    borderBottomWidth:1
  },
    infocardContainer:{
      flexDirection:'row',
      flexWrap:'wrap',
      padding:5,
      gap:20,
      backgroundColor:'#fff'
    },
    infocard:{
      padding:5,
      flexDirection:'row',
      alignItems:'center',
      gap:5
    },
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal:20,
      height:96,
      backgroundColor: '#621B98',
    },
    headingtext:{
      fontSize:16,
      fontWeight:800,
      color:'#621B98 '
    },  
    subheadingtext:{
        fontSize:12,
        color:'#9D9895'
    },
    price:{
        paddingVertical:10,
      width:'100%',
      flexDirection:'row',
      alignItems:'flex-start',
      justifyContent:'space-between'
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
      flexDirection:'row',
      alignItems:'center',
      width:'100%',
      justifyContent:'space-between',
      backgroundColor:'#fff3DC',
      padding:10,
      borderRadius:10
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
      borderBottomWidth:1,
      borderColor:'#D1CECC',

      backgroundColor:'#EEEFF1',
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
      width: 45,
      height: 45,
      borderRadius: 24, // rounded-full
    },
    button: {
      flexDirection:'row',
      gap:4,
      backgroundColor:'#621B98',
      paddingVertical: 5,
      paddingHorizontal: 20,
      borderRadius: 5,
    },
    inactivebutton: {
      flexDirection:'row',
      gap:4,
      backgroundColor:'#B7AFAF',
      paddingVertical: 5,
      paddingHorizontal: 20,
      borderRadius: 5,
    },
    textcolor:{
      color:'#fff'
    },
    buttonText: {
      color: '#fff', // blue-500
      fontWeight: 'bold',
      fontSize:20
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