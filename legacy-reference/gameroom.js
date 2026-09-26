import React, { useEffect, useState,useRef } from 'react';
import { View, Image, ImageBackground,PanResponder,BackHandler,StatusBar ,ScrollView,Dimensions,TouchableWithoutFeedback ,Modal, StyleSheet, TouchableOpacity,Clipboard, Text,Linking,Animated } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import { Table, Row } from 'react-native-table-component';
import CheckBox from 'react-native-checkbox';  
import { Bar as ProgressBar } from 'react-native-progress';
import { useDerivedValue, useSharedValue, useAnimatedStyle, withSpring, log } from 'react-native-reanimated';
import { PanGestureHandler, GestureHandlerRootView, State } from 'react-native-gesture-handler';
import { TapGestureHandler } from 'react-native-gesture-handler';
import useGameUpdates from './usegameupdates';

const Gameroom = () => {
  const route = useRoute();
  const {roomId, selectedPlayers}  = route.params
  const loadingTime = 3000;
  const [progress, setProgress] = useState(0);
  const [rooms,setRooms] = useState();
  const [loaded,setLoaded] = useState(false)
  const [playerID, setPlayerID] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
   const [NextPlayerId,setNextPlayerId] = useState()
  const[separated,setSeparated] = useState()
  const [cardData,setCardData] = useState([])
  const [addGmes,setAddGames] = useState(false)

useGameUpdates(roomId, (updatedCard) => {.0
  console.log('✅ Received card update:', updatedCard);
  setCardData(updatedCard);
});

const openGames = ()=>{
  setAddGames(true)
}

useEffect(() => {
  console.log('🔄 cardData updated:', cardData);
}, [cardData]);

  useEffect(() => {
    if (timeLeft === 0) return;
  
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
  
    return () => clearInterval(timer);
  }, [timeLeft]);
  
  const resetTimer = () => {
    setTimeLeft(30);
  };

  useEffect(() => {
    const fetchPlayerID = async () => {
      try {
        const id = await SecureStore.getItemAsync('playerId');
        setPlayerID(id);
      } catch (error) {
        console.error('Error fetching player ID:', error);
      }
    };

    fetchPlayerID();
  }, []);

  const [showComponent, setShowComponent] = useState(false);

  useEffect(() => {
    let interval;
    if (progress < 1) {
      interval = setInterval(() => {
        setProgress((prevProgress) => Math.min(prevProgress + 0.01, 1)); // Increment progress
      }, loadingTime / 1000); // Calculate interval based on loading time
    } else {
      setShowComponent(true);  // Set the component to show
    }

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, [progress, loadingTime]);

  useEffect(() => {
    if (showComponent) {
      const timer = setTimeout(() => {
        setShowComponent(false);
              setLoaded(true)
                    FetchOrderedCards();
 
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showComponent]);

  const [cardOrder, setCardOrder] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]); // Track card order
  const [cardPositions, setCardPositions] = useState({});
  const [cardOffsets, setCardOffsets] = useState({});
  const [profile,setProfile] = useState()
  const [playerCards, setPlayerCards] = useState({}); 
  const [Deckcards, setDeckCards] = useState({}); 
  const [JokerCard, setJokerCard] = useState(); 
  
  const [selectedCards, setSelectedCards] = useState(new Set());
  const [isExitModalVisible, setExitModalVisible] = useState(false); 
  const [lastGame,setLastGame] = useState(false)
  const [lastGamePopup,setLastGamePopup] = useState(false)
  const [finishPopup,setFinishPopup] = useState(false)
  const [disconnectionPopup,setdisconnectionPopup] = useState(false)
  const [room,setRoom] = useState();
  const [stacks, setStacks] = useState({});
  const [cards,setCards] = useState();

  const [toss,setToss] = useState();

  const navigation = useNavigation()
      const dimAnim = useRef(new Animated.Value(0)).current; 
      const [dimVisible, setDimVisible] = useState(false);
      const [sidebarVisible, setSidebarVisible] = useState(false);
      const sidebarAnim = useRef(new Animated.Value(Dimensions.get('window').width)).current;

      const toggleSidebar = () => {
       if (sidebarVisible) {
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

     const openFinish = ()=>{
      setFinishPopup(true)
     }

        const Fetchrooms = async () => {
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
             const data = response.data; // The response data should be in the `data` property
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
         Fetchrooms(); // Call the function when the component mounts
       }, []);

      const shuffleCards = async(roomId)=>{
      const token =  await SecureStore.getItemAsync('token');
      const payload = separated
             try {
               const response = await fetch(`https://rummy-apigateway-v1.onrender.com/api/rummy/validate-card`,{
                 method: 'POST',
                 body:JSON.stringify(payload),
                 headers: {
                   'Content-Type': 'application/json',
                   'Authorization':`Bearer ${token}`
                 }
               });
         
               console.log('Response status:', queryParams);
               console.log('Response headers:', response.headers);
               if (response.ok) {
                const data = response.data; 
                console.log('setcards',data);
                } else {
                 console.log('for real again.',separated);
                 }
               }
              catch (error) {
               console.log('Error submitting form:', error);
             }
         }

     const [checked, setChecked] = useState([true, false, true]);  // Example state for checkboxes

     const tableHead = ['Game Variants', '13 Card Points', '13 Card Pool', '13 Card Deal'];
     
     const tableData = [
      ['Drop me on 1 turn(s)* miss', <CheckBox checked={checked[0]} onChange={() => toggleCheck(0)} /> , <CheckBox checked={checked[1]} onChange={() => toggleCheck(1)} /> , <CheckBox checked={checked[2]} onChange={() => toggleCheck(2)} />],
      ['Drop me on 2 turn(s)* miss', <CheckBox checked={checked[4]} onChange={() => toggleCheck(4)} /> , <CheckBox checked={checked[5]} onChange={() => toggleCheck(5)} /> , <CheckBox checked={checked[6]} onChange={() => toggleCheck(6)} />],
      ['Drop me on 3 turn(s)* miss', <CheckBox checked={checked[7]} onChange={() => toggleCheck(7)} /> , <CheckBox checked={checked[8]} onChange={() => toggleCheck(8)} /> , <CheckBox checked={checked[9]} onChange={() => toggleCheck(9)} />],
    ];
   
     // Function to toggle checkbox state
     const toggleCheck = (index) => {
       const newChecked = [...checked];
       newChecked[index] = !newChecked[index];
       setChecked(newChecked);
     };
   
  const handleExit = () => {
    setExitModalVisible(true);  // Show the exit confirmation modal
  };

  const handleLastGame = ()=>{
    setLastGamePopup(true)
  }
  
  const handleDisconnection = ()=>{
    setdisconnectionPopup(true)
    
  }
  const closeDisconnection = ()=>{
    setdisconnectionPopup(false)
    
  }



  const confirmExit = () => {

    setExitModalVisible(false); // Close the modal after confirming exit
    exit();
    // Add your exit action here, for example:
    // navigation.goBack(); or close the sidebar
  };

  const cancelExit = () => {
    setExitModalVisible(false); // Close the modal if the user cancels
  };

  const parseCard = (card) => {
    const [rank, suit] = card.split(" of ");
    return { rank, suit };
  };


  const exit = ()=>{
    navigation.navigate('Home');
  }

  


  const confirmLastGame = ()=>{
    setLastGame(true)
    CloseLastGamePopup()
  }

  const CloseLastGamePopup = ()=>{
    setLastGamePopup(false)
  }

  const updateTurn = async (playerId) => {
    const token = await SecureStore.getItemAsync('token');
  
    try {
      const response = await fetch(`https://rummy-apigateway-v1.onrender.com/api/room/update-current-turn/${roomId}?playerId=${playerId}`,{
        method: 'PUT',
        headers:{
          'Authorization':`Bearer ${token}`
        }
      });
  
      // Check if the response is successful (status 200-299)
      if (response.ok) {
       console.log(playerId,'current plsyer')
      }else{

      }
  
    } catch (error) {

      console.log(error.message); // Log error message

    }
  }

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

      const response = await axios.get(`https://rummy-apigateway-v1.onrender.com/api/cards/${roomId}/rank-players`,{
        headers:{
          'Authorization':`Bearer ${token}`
        }
      });

      if (response.status === 200) {
        const Data = response.data; 
        setToss(Data);
        // updateTurn(Data?.orderPlayersByRank[0])
        console.log('FSD',Data?.ranking);
        console.log('winn',Data?.orderPlayersByRank[0]);
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

  const FetchProfile = async () => {
    const playerID = await SecureStore.getItemAsync('playerId');
    const token = await SecureStore.getItemAsync('token');
    try {
      // Fetch the player ID from SecureStore
 // Ensure the player ID is being retrieved properly

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
        const data = response.data; 
        setProfile(data);
        console.log();
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

const FetchRoom = async () => {
  const playerID = await SecureStore.getItemAsync('playerId');
  const token = await SecureStore.getItemAsync('token');
  try {
    if (!playerID) {
      console.error('Player ID is not available');
      return;
    }

    // Make the API request using axios
    const response = await axios.get(`https://rummy-apigateway-v1.onrender.com/api/room/get-detail/${roomId}`,{
      headers:{
        'Authorization':`Bearer ${token}`
      }
    });

    // Check if the response is successful
    if (response.status === 200) {
      const data = response.data; // The response data should be in the `data` property
      const currentIndex = data.playerDetails.findIndex(
        (player) => player.playerId === data.currentTurn
      );
      
      const nextIndex = (currentIndex + 1) % data.playerDetails.length;
      const nextPlayerId = data.playerDetails[nextIndex].playerId;
      
      setNextPlayerId(nextPlayerId)
      setRoom(data);
      
      console.log('payload',nextPlayerId)
    } else {
      console.error('Failed to fetch profile', response.status);
    }
  } catch (error) {
    console.error('Error fetching profile:', error);
  }
};

useEffect(() => {
  FetchRoom();
},[])
;


const FetchCards = async () => {
  const token = await SecureStore.getItemAsync('token');
  try {
    // Make the API request using axios
    const response = await axios.get(`https://rummy-apigateway-v1.onrender.com/api/cards/${roomId}/distribute`,{
      headers:{
        'Authorization':`Bearer ${token}`
      }
    });
    // Check if the response is successful
    if (response.status === 200) {
      // Retrieve the playerId from SecureStore
      const playerId = await SecureStore.getItem('playerId');  // Await the Promise here
        // Extract the response data
      const data = response.data;
     console.log(token)
    } else {
      console.log("Failed to fetch cards, response status:", response.status);
    }
  } catch (error) {
    console.error('Error fetching cards:', error);
  }
};

const seperatecard = async () => {
  const token = await SecureStore.getItemAsync('token');
  const playerId = await SecureStore.getItemAsync('playerId');
  try {
    // Make the API request using axios
    const response = await axios.get(`https://rummy-apigateway-v1.onrender.com/api/cards/grouped?roomId=${roomId}&playerId=${playerId}`,{
      headers:{
        'Authorization':`Bearer ${token}`
      }
    });
    // Check if the response is successful
    if (response.status === 200) {
        // Extract the response data
      const data = response.data;

       setSeparated(data)
    } else {
      console.log("Failed to fetch cards, response status:", response.status);
    }
  } catch (error) {
    console.error('Error fetching cards:', error);
  }
};

const FetchDeck = async () => {
  const token = await SecureStore.getItemAsync('token');
  try {
    // Make the API request using axios
    const response = await axios.get(`https://rummy-apigateway-v1.onrender.com/api/cards/get-card/${roomId}`,{
      headers:{
        'Authorization':`Bearer ${token}`
      }
    });
    // Check if the response is successful
    if (response.status === 200) {
        // Extract the response data
      const data = response.data;
      setDeckCards(data)
      setJokerCard(data?.jokerCard)
      console.log('fetch deck',JokerCard)
    } else {
      console.log("Failed to fetch cards, response status:", response.status);
    }
  } catch (error) {
    console.error('Error fetching cards:', error);
  }
};

const FetchOrderedCards = async () => {
  const token = await SecureStore.getItemAsync('token');
  try {
    // Make the API request using axios
    const response = await axios.get(`https://rummy-apigateway-v1.onrender.com/api/cards/group-by-suit/${roomId}`,{
      headers:{
        'Authorization':`Bearer ${token}`
      }
    });

    // Check if the response is successful
    if (response.status === 200) {
      // Retrieve the playerId from SecureStore
      const playerId = await SecureStore.getItem('playerId');  // Await the Promise here

      const data = response.data;  // The response data should be in the `data` property
      setCards(data);  // Set the entire cards data in the state
      console.log('Response status:', response.status);  // Log the actual response status
      console.log('Response data:', response.data);  // Log the actual response data

      const playercards = data;  // Access playerCards from the response

      // Check if the playerId exists in the playerCards object
      if (playercards && playercards[playerId]) {
        console.log(`Found cards for player ID: ${playerId}`);  // Debug log
        console.log(`result :${cards?.playerCards}`)
        setPlayerCards(playercards[playerId]);  // Set the cards for the player in the state
        console.log(playercards[playerId]);  // Log the specific player's cards
        shuffleCards(playercards[playerId]);
        console.log('shuffleCar',playercards[playerId])
      } else {
        console.error("Player ID not found in the data:", playerId);
      console(playerCards) // Set an empty array if the playerId is not found
      }

    } else {
      console.log("Failed to fetch cards, response status:", response.status);
    }
  } catch (error) {
    console.error('Error fetching cards:', error);
  }
};

useEffect(() => {
  FetchCards();
}, []);

useEffect(() => {
  FetchDeck();
}, []);

  const moveToStack = () => {
    const newStackName = `stack${Object.keys(stacks).length + 1}`;
    const selectedArray = Array.from(selectedCards);
    setStacks(prevStacks => {
      const newStacks = { ...prevStacks };
      if (!newStacks[newStackName]) {
        newStacks[newStackName] = [];
      }
  
      // Add selected cards to the new stack (do not overwrite previous stacks)
      newStacks[newStackName] = [...newStacks[newStackName], ...selectedArray];
      return newStacks;
    });
  
    // Remove the selected cards from the current order
    setCardOrder(prevOrder => prevOrder.filter(id => !selectedCards.has(id)));
    setSelectedCards(new Set()); // Clear selected cards
  };
  
  useEffect(() => {
    // Lock orientation to landscape
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  useEffect(() => {
    const initialPositions = cardOrder.reduce((acc, cardId) => {
      acc[cardId] = new Animated.ValueXY({ x: 0, y: 0 });
      return acc;
    }, {});
    setCardPositions(initialPositions);
  }, [cardOrder]);

  const PlayerCard = ({ suit, index, cardObject, position, onMove, isSelected, onSelect }) => {
    const { card: cardText } = cardObject;
    const { rank, suit: cardSuit } = parseCard(cardText) || {};
  
    const translationX = useSharedValue(position.x);
    const translationY = useSharedValue(position.y);
  
    const animatedStyle = {
      marginTop: isSelected ? -20 : 0,
    };
    
  
    const onGestureEvent = (event) => {
      if (event.nativeEvent.state === State.ACTIVE) {
        translationX.value = event.nativeEvent.translationX + position.x;
        translationY.value = event.nativeEvent.translationY + position.y;
      } else if (event.nativeEvent.state === State.END) {
        onMove(suit, index, translationX.value, translationY.value);
      }
    };
  
    return (
      <GestureHandlerRootView>
        <TapGestureHandler onActivated={() => onSelect(cardObject?.uuid)}>
          <PanGestureHandler
            onGestureEvent={onGestureEvent}
            onHandlerStateChange={onGestureEvent}
          >
            <Animated.View style={[styles.card, animatedStyle]}>
              <View style={{ flexDirection: 'column',alignItems:'center',width:28 }}>
                <Text style={{ fontSize: rank == 10 ? 22 : 22, fontWeight: 800 }}>{rank === 'Joker' ? 'J' :rank}</Text>
                <Image
                  source={suitImages[cardSuit] || suitImages['Joker']}
                  style={{width: cardSuit ==='Diamond' ? 12 :16,height : cardSuit === 'Diamond' ? 14 :14}}
                />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',padding:5 }}>
              <Text style={{ fontSize: rank == 10 ? 20 : 22, fontWeight: 800 }}></Text>
                <Image
                  source={suitImages[cardSuit] || suitImages['Joker']}
                  style={{width:cardSuit ==='Diamond' ? 17 :26,height:23}}
                />
              </View>
            </Animated.View>
          </PanGestureHandler>
        </TapGestureHandler>
      </GestureHandlerRootView>
    );
  };
  
  const [playerCardPositions, setPlayerCardPositions] = useState({});

  useEffect(() => {
    if (playerCards && Object.keys(playerCards).length > 0) {
      const initialPositions = Object.keys(playerCards).reduce((acc, suit) => {
        acc[suit] = playerCards[suit]?.map((_, index) => ({
          x: index * 60,
          y: 0,
        }));
        return acc;
      }, {});
  
      // Only update state if positions have changed
      if (JSON.stringify(initialPositions) !== JSON.stringify(playerCardPositions)) {
        setPlayerCardPositions(initialPositions);
      }
    }
  }, [playerCards, playerCardPositions]); // Add playerCardPositions to avoid unnecessary updates
  
  const onPlayerCardMove = (suit, index, newX, newY) => {
    setPlayerCardPositions((prevPositions) => {
      const newPositions = { ...prevPositions };
      newPositions[suit][index] = { x: newX, y: newY };
      return newPositions;
    });
  };

  const copyToClipboard = () => {
    Clipboard.setString(roomId); // Copies the roomId to the clipboard
    console.log(roomId)
  };

  const [walletsection,showWalletSection] = useState(false)
  const [rewardsection,showRewardSection] = useState(false)
  const [helpsection,showHelpSection] = useState(false)

const toggleWalletSection = ()=>{
    showWalletSection(!walletsection)
   }
   const toggleRewardSection = ()=>{
    showRewardSection(!rewardsection)
   }
   const toggleHelpSection = ()=>{
    showHelpSection(!helpsection)
   }

  const suitImages = {
    Heart: require('./assets/heart.jpg'),
    Spade: require('./assets/spade.jpg'),
    Diamond: require('./assets/diamond.png'),
    Club: require('./assets/club.jpg'),
    Unknown: require('./assets/joker.jpg'),
    
  };

  const DraggableCard = ({ cardObject, index, suit, isSelected }) => {
    const { card: cardText, uuid } = cardObject;
    const cardOffset = cardOffsets[uuid] || { x: 0, y: 0 };

    const translationX = useSharedValue(cardOffset.x);
    const translationY = useSharedValue(cardOffset.y);

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [
          { translateX: withSpring(translationX.value, { damping: 20 }) },
          { translateY: withSpring(translationY.value, { damping: 20 }) },
          {
            translateX: index === playerCards[suit].length - 1
              ? 0
              : -25 * (playerCards[suit].length - index - 1),
          },
        ],
      };
    });
  }

  const discardCards = async (card) => {
    const token = await SecureStore.getItemAsync('token');
    const playerId = await SecureStore.getItemAsync('playerId');
    try{
      const response = await fetch(`https://rummy-apigateway-v1.onrender.com/api/cards/${roomId}/update?playerId=${playerId}&cardToDiscard=${card}`,{
        method: 'PUT',
        headers:{
          'Authorization':`Bearer ${token}`
        }
      });

      if(response.ok){
       FetchOrderedCards()
       FetchRoom()
       FetchDeck()
       setSelectedCards(new Set());
       resetTimer()
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json(); // Parse response body as JSON
      console.log(data); // Log the data from the response
      console.log('Registered successfully');
    } catch (error) {
      console.error(card, error);
      console.log(error.message); // Log error message
      console.log('failed',card);
    }
  }

  const fetchdiscardCard = async (card) => {
    const token = await SecureStore.getItemAsync('token');
    const playerId = await SecureStore.getItemAsync('playerId');
    try{
      const response = await fetch(`https://rummy-apigateway-v1.onrender.com/api/cards/${roomId}/update?playerId=${playerId}&pickFromDiscarded=true`,{
        method: 'PUT',
        headers:{
          'Authorization':`Bearer ${token}`
        }
      });

      if(response.ok){
        FetchOrderedCards()
        FetchDeck()
        FetchRoom()

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

  const fetchremainingCard = async (card) => {
    const token = await SecureStore.getItemAsync('token');
    const playerId = await SecureStore.getItemAsync('playerId');
    try{
      const response = await fetch(`https://rummy-apigateway-v1.onrender.com/api/cards/${roomId}/update?playerId=${playerId}&pickFromDiscarded=false`,{
        method: 'PUT',
        headers:{
          'Authorization':`Bearer ${token}`
        }
      }); 

      if(response.ok){
        FetchOrderedCards()
        FetchDeck()
        FetchRoom()
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

  const ExitRoom = async () => {
    const token = await SecureStore.getItemAsync('token');
    const playerId = await SecureStore.getItemAsync('playerId');
    try{
      const response = await fetch(`https://rummy-apigateway-v1.onrender.com/api/room/update-exit-status/${roomId}?playerId=${playerId}`,{
        method: 'PATCH',
        headers:{
          'Authorization':`Bearer ${token}`
        }
      });

      if(response.ok){
        setExitModalVisible(false); // Close the modal after confirming exit
        exit();
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json(); // Parse response body as JSON
      console.log(data);
      console.log('Registered successfully');
    } catch (error) {
      console.error("Error joining the tournament:", error);
      console.log(error.message); // Log error message
      console.log('Registration failed');
    }
  }


  
  const Playerdeck = ({ cardObject,handleGetDiscard }) => {
    const { card } = cardObject;
    const { rank, suit:cardSuit } = parseCard(card);
  
    return (
      <TouchableOpacity onPress={handleGetDiscard} style={{
        width: 40,
        height: 60,
        flexDirection:'column',
        backgroundColor: '#fff',
        borderWidth:1,
        padding:3,
        borderRadius: 5,
        borderColor:'#fff',
        position:'relative'
      }}>
        <View>
        <Text style={{ fontSize: 16 }}>{rank}</Text>
        <Image
                  source={suitImages[cardSuit] || suitImages['Joker']}
                  style={{width: cardSuit ==='Diamond' ? 8 :12,height : cardSuit === 'Diamond' ? 10 :10}}
                />
        </View>
        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
          <Text></Text>
        <Image
                  source={suitImages[cardSuit] || suitImages['Joker']}
                  style={{width: cardSuit ==='Diamond' ? 18 :20,height : cardSuit === 'Diamond' ? 18 :18}}
                />
        </View>

      </TouchableOpacity>
    );
  };

  const JokerCards = (jokerCar) => {
    const suit = JokerCard.split(' of ')[1]; // 'Diamond'
    const cardValue = JokerCard.split(' of ')[0]; // '10'
  
    const suitImage = suitImages[suit] || suitImages['Unknown'];
  
    return (
      <TouchableOpacity style={{
        width: 40,
        height: 40,
        flexDirection:'row',
        justifyContent:'space-between',
        backgroundColor: '#fff',
        borderWidth:1,
        padding:3,
        borderTopStartRadius:5,
        borderTopEndRadius:5,
        borderColor:'#fff',
        position:'relative',
        transform: [{ rotate: '270deg' }]

      }}>
        <View>
        <Text style={{ fontSize: 16 }}>{cardValue}</Text>
        <Image
                  source={suitImages[suit] || suitImages['Joker']}
                  style={{width: suit ==='Diamond' ? 8 :12,height : suit === 'Diamond' ? 10 :10}}
                />
        </View>
        <View style={{flexDirection:'row',justifyContent:'space-between'}}>

        <Image source={require('./assets/clown.webp')} style={{width:20,height:25}} />
        </View>

      </TouchableOpacity>
    );
  };

  const lastCard = Array.isArray(Deckcards?.allDiscardedCards) && Deckcards.allDiscardedCards.length > 0
  ? Deckcards.allDiscardedCards[Deckcards.allDiscardedCards.length - 1]
  : null;

  const remainingCard = Array.isArray(Deckcards?.remainingCards) && Deckcards.remainingCards.length > 0
  ? Deckcards.remainingCards[Deckcards.remainingCards.length - 1]
  : null;

  
  return (
    <ImageBackground source={require('./assets/table.jpg')} style={styles.backgroundImage}>
      <StatusBar hidden={true} />

      <View style={styles.container}>
        {/* Add a semi-transparent header for contrast */}
        <View style={{width:'100%',justifyContent:'center',flexDirection:'row'}}>

        <View style={{flexDirection:'row',width:'90%',alignItems:'center',paddingHorizontal:20,justifyContent:'space-between'}}>
          <TouchableOpacity style={{marginTop:0}} onPress={handleExit}>
          <Image source={require('./assets/exit.png')} style={{width:25,height:25}} />
          </TouchableOpacity>
      
        <View style={styles.header}>
          <View>
          <Text onPress={copyToClipboard} style={{fontSize:10,color:'#fff'}}>#{roomId}</Text>
          </View>
          <View style={{flexDirection:'row',gap:5}}>
          <Text style={{fontSize:10,color:'#fff'}}>{room?.roomType} Rummy</Text>
          {/* <Text style={{fontSize:10,color:'#fff'}}>800</Text> */}
        </View>
        <View>
          <Text style={{fontSize:10,color:'#fff'}}>1300 </Text>
          </View>
{
profile?.inGameWallet ===0 ?
 <TouchableOpacity  style={styles.button}>
      <Text style={styles.buttonText}>ADD CASH</Text>

    </TouchableOpacity> :
    <TouchableOpacity style={{flexDirection:'row',gap:1,alignItems:'center'}}>
             <Image source={require('./assets/wallet.png')} style={{width:15,height:15}} />
             <Text style={{color:'#fff'}}>
             {profile?.winningWallet}
             </Text>
    </TouchableOpacity>}
        </View>
        <TouchableOpacity style={{flexDirection:'row',justifyContent:'center',gap:20,marginTop:10}} onPress={toggleSidebar}>
        <Image source={require('./assets/info.png')} style={{width:30,height:30}} />
        <Image source={require('./assets/menu.png')} style={{width:35,height:35}} />
        </TouchableOpacity>

        </View>
          
        </View>


{dimVisible && (
        <TouchableWithoutFeedback onPress={toggleSidebar}>
          <Animated.View
            style={[styles.dimBackground, { opacity: dimAnim }]} // Apply the animated opacity
          />
        </TouchableWithoutFeedback>
      )}
{/* <Animated.View
  style={[
    styles.sidebar,
    {
      transform: [{ translateX: sidebarAnim }], // Apply sliding animation
    },
  ]}
>
<Animated.View style={{flex:1}}>
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>


  <View style={styles.sidebarContent}>

      <View style={{width:'100%'}}>
        <TouchableOpacity onPress={toggleWalletSection} style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
          <View>
            <Text style={{color:'#fff',fontWeight:800, fontSize:12}}>RNG Certified</Text>
       
          </View>
          <Image style={{width:20, height:20}} source={require('./assets/downn.png')}  />
        </TouchableOpacity>

        {walletsection &&     
          <View>

            <TouchableOpacity style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{color:'#fff', fontSize:12}}>Manage Transactions</Text>
              </View>
              <Image style={{width:10, height:10}} source={require('./assets/next.png')}  />
            </TouchableOpacity>
            <TouchableOpacity style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{color:'#fff', fontSize:12}}>KYC</Text>
              </View>
              <Image style={{width:10, height:10}} source={require('./assets/next.png')}  />
            </TouchableOpacity>
            <TouchableOpacity style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{color:'#fff', fontSize:12}}>Wallets</Text>
              </View>
              <Image style={{width:10, height:10}} source={require('./assets/next.png')}  />
            </TouchableOpacity>
      
          </View>
        }


        <TouchableOpacity onPress={toggleRewardSection}  style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
          <View>
            <Text style={{color:'#fff',fontWeight:800, fontSize:12}}>No Bot Certified</Text>

          </View>
          <Image style={{width:20, height:20}} source={require('./assets/downn.png')}  />
        </TouchableOpacity>
        {rewardsection &&     
          <View>

            <TouchableOpacity style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{color:'#fff', fontSize:12}}>Reward Store</Text>
              </View>
              <Image style={{width:10, height:10}} source={require('./assets/next.png')}  />
            </TouchableOpacity>
            <TouchableOpacity style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{color:'#fff', fontSize:12}}>Tickets</Text>
              </View>
              <Image style={{width:10, height:10}} source={require('./assets/next.png')}  />
            </TouchableOpacity>
            <TouchableOpacity style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{color:'#fff', fontSize:12}}>Honour Points </Text>
              </View>
              <Image style={{width:10, height:10}} source={require('./assets/next.png')}  />
            </TouchableOpacity>

          </View>
        }
        <TouchableOpacity onPress={toggleHelpSection}  style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
          <View>
            <Text style={{color:'#fff',fontWeight:800, fontSize:12}}>Game Settings</Text>
        
          </View>
          <Image style={{width:20, height:20}} source={require('./assets/downn.png')}  />
        </TouchableOpacity>
        {helpsection &&     
          <View>
      
            <TouchableOpacity style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{color:'#fff', fontSize:12}}>Chat with Us</Text>
              </View>
              <Image style={{width:10, height:10}} source={require('./assets/next.png')}  />
            </TouchableOpacity>
            <TouchableOpacity style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{color:'#fff', fontSize:12}}>Contact Us</Text>
              </View>
              <Image style={{width:10, height:10}} source={require('./assets/next.png')}  />
            </TouchableOpacity>

     
          </View>
        }
                <TouchableOpacity  onPress={openWhatsApp}  style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
          <View>
            <Text style={{color:'#fff',fontWeight:800, fontSize:12}}>Report a Problem</Text>

          </View>
          <Image style={{width:20, height:20}} source={require('./assets/down.png')}  />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDisconnection} style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomWidth:1}}>
         <View>
            <Text style={{color:'#fff',fontWeight:800, fontSize:12}}>Disconnection Settings</Text>
          </View>
        </TouchableOpacity> 
        <TouchableOpacity  onPress={openWhatsApp} style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomWidth:1}}>
         <View>
            <Text style={{color:'#fff',fontWeight:800, fontSize:12}}>Share Link</Text>
          </View>
        </TouchableOpacity> 
        {(room?.roomType === "Point" && room?.gameMode === "Cash") && (
  <TouchableOpacity onPress={handleLastGame}
    style={{
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      padding: 15, 
      alignItems: 'center', 
      borderBottomColor: '#E4DFDF', 
      borderBottomWidth: 1, 
    }}
  >

      <Text style={{color: '#fff', fontWeight: 800, fontSize: 12}}>Last Game</Text>
{lastGame ?   <Image style={{width:20, height:20}} source={require('./assets/checked.png')}  /> :   <Image style={{width:20, height:20}} source={require('./assets/check.png')} />
}    
  </TouchableOpacity>
)}

      </View>
  </View>
  </ScrollView>
</Animated.View>
</Animated.View> */}

        <View style={styles.body}>
        {<View style={{flexDirection:'column',gap:10,marginTop:70}}>
       {room?.playerDetails
    .filter(player => player.playerId !== playerID)?.map((player, index) =>
      
      (  // Map through the filtered players and render JSX
      <View style={{position:'relative',flexDirection:'column',justifyContent:'center',alignItems:'center'}} key={index}>  {/* Add a key to each View for performance */}
 <Image source={require('./assets/profile.png')} style={{width:60,height:60,resizeMode:'cover'}} />
 <View style={{position:'absolute',bottom:0,backgroundColor:'#fff',borderRadius:5,padding:2}}>
 <Text
  style={{ width: 50,fontSize:10 }}
  numberOfLines={1} // Restrict the text to a single line
  ellipsizeMode="tail" // Show ellipsis at the end if text overflows
>
  {player.playerId}
</Text>
  </View>


      </View>
    ))
}
<Text>{cardData}</Text>
{showComponent && room?.gameStatus !== 'Ongoing' &&   <View style={{flexDirection:room?.roomSize===2?'column' : 'row',gap:5}}>
       {toss?.ranking?.map((rank, index) => {
        const playerID = rank.split(":")[1].trim();
        const card = toss.playerCards[playerID]; // Get the card name
        const isTopRank = playerID === toss?.orderPlayersByRank[0];

        if (card) {
          const [cardValue, suit] = card.split(" of "); // Split card into value and suit

          return (
            <View key={index}   style={[
              styles.Tosscard,
              isTopRank && styles.topRankCard // Conditionally add golden border
            ]}>
              {/* <Text style={styles.rankText}>{rank}</Text> */}
              <Text style={styles.cardText}>{cardValue}</Text>
              <Image source={suitImages[suit]} style={styles.cardImage} />
            </View>
          );
        }

        return null;
      })}
       </View>}

{loaded &&<View style={{flexDirection:'row',alignItems:'center',gap:40,marginTop:-25}}>
<View style={{flexDirection:'row',position:"relative",alignItems:'center'}}>
{JokerCard &&      <JokerCards cardObject={JokerCard} handleGetDiscard={fetchdiscardCard} />}
{remainingCard &&      <TouchableOpacity onPress={fetchremainingCard} style={{
        width: 40,
        height: 60,
        flexDirection:'column',
        backgroundColor: '#621B98',
        borderWidth:1,
        padding:3,
        borderRadius: 5,
        borderColor:'#fff',
        position:'relative'
      }}></TouchableOpacity>}
</View>

{lastCard && <Playerdeck cardObject={lastCard} handleGetDiscard={fetchdiscardCard} />}
<TouchableOpacity style={styles.finishcard}>
            <Text style={{color:'#fff',textAlign:'center',fontSize:10}}>Finish</Text>
            <Text style={{color:'#fff',textAlign:'center',fontSize:10}}>Card</Text>
          </TouchableOpacity>
</View>}

       </View>}


       <View style={{flexDirection:'row',width:'100%',justifyContent:'center',alignItems:'center',height:60,gap:150}}>
<View style={{width:'100%',height:150,flexDirection:'row',alignItems:'flex-end',justifyContent:'flex-end'}}>


</View>

        
{/* <View style={{ flexDirection: 'row' }}>
{Object.keys(playerCards).map((suit) => (
        <View key={suit} style={{ position: 'relative' }}>
          {playerCards[suit] &&
            playerCards[suit].map((cardObject, index) => {
              const { card: cardText, suit: cardSuit } = cardObject;
              const isSelected = false; // Handle selected cards based on your logic
              const uuid = cardObject?.uuid;
              return (
                <DraggableCard
                  key={uuid}
                  cardObject={cardObject}
                  index={index}
                  suit={suit}
                  isSelected={isSelected}
                />
              );
            })}
        </View>
      ))}
</View> */}
        </View>
        </View>

{room?.gameStatus==="Matchmaking" &&      <View style={styles.loadingcontainer}>
      
            <Text style={styles.text}>
              {progress === 1 ? null :       <ProgressBar  loadingTime={5000}
              progress={progress}
              width={300} // Customize the width of the bar
              height={10}
              color="#FF5733"
            />}
            </Text>
          </View>}
          {playerCards && Object.keys(playerCards).length > 0 && playerCardPositions && (
  <View style={styles.body}>
<View
  style={{

    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor:'#000',
    gap: 20,
    height:100,
    position:'relative',
    width: '100%',

  }}
>
{Object.entries(playerCards)?.map(([suit, cards]) => (
  <View
    key={suit}
    style={{
      marginBottom: 24, // Large gap between each suit group
      paddingHorizontal: 20,
    }}
  >
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10, // Works in RN 0.73+ or Web
      }}
    >
      {cards?.map((cardObject, index) => {
        const { card: cardText } = cardObject;
        const { rank, suit: cardSuit } = parseCard(cardText) || {};
        const uuid = cardObject?.uuid;
        const isSelected = selectedCards.has(uuid);

        return (
          <View key={uuid} style={{ marginRight: 18, marginBottom: 0 }}>
            <PlayerCard
              suit={suit}
              index={index}
              cardObject={cardObject}
              position={playerCardPositions[suit]?.[index] || { x: 0, y: 0 }}
              onMove={onPlayerCardMove}
              isSelected={isSelected}
              onSelect={(uuid) => {
                setSelectedCards((prev) => {
                  const newSet = new Set(prev);
                  if (newSet.has(uuid)) {
                    newSet.delete(uuid);
                  } else {
                    newSet.add(uuid);
                  }
                  return newSet;
                });
              }}
            />
          </View>
        );
      })}
    </View>
  </View>
))}



</View>


  </View>
)}
        <View style={styles.bottomNavbar}>
     
<ScrollView
  horizontal={true}
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={{ gap: 6, alignItems: 'center', paddingHorizontal: 10 }}
  style={{ width: '100%', height: 40 }} // or adjust height if needed
>
  <TouchableOpacity
    onPress={openGames}
    style={{
      backgroundColor: '#650703',
      height: 40,
      width: 40,
      borderRadius: 50,
      flexDirection: 'row',
      gap: 2,
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: '#650703',
      borderWidth: 2,
    }}
  ><Text style={{fontSize:24,color:'#fff'}}>+</Text>
  </TouchableOpacity>

  <TouchableOpacity
    onPress={() => navigation.navigate('Game', { roomId: room.roomId })}
    style={{
      backgroundColor: '#51A17A',
      height: 40,
      width: 100,
      borderRadius: 50,
      flexDirection: 'row',
      gap: 2,
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: '#650703',
      borderWidth: 2,
    }}
  >
    <Text style={{ color: '#fff' }}>Join Room</Text>
  </TouchableOpacity>

  <TouchableOpacity
    onPress={() => navigation.navigate('Game', { roomId: room.roomId })}
    style={{
      backgroundColor: '#51A17A',
      height: 40,
      width: 100,
      borderRadius: 50,
      flexDirection: 'row',
      gap: 2,
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: '#650703',
      borderWidth: 2,
    }}
  >
    <Text style={{ color: '#fff' }}>Join Room</Text>
  </TouchableOpacity>

  {rooms?.map((room, index) => (
    <TouchableOpacity
      key={index}
      onPress={() => navigation.navigate('Game', { roomId: room.roomId })}
      style={{
        backgroundColor: '#51A17A',
        height: 40,
        width: 100,
        borderRadius: 50,
        flexDirection: 'row',
        gap: 2,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#650703',
        borderWidth: 2,
      }}
    >
      <Text style={{ color: '#fff', marginRight: 4 }}>{room.roomSize}</Text>
      <Text style={{ color: '#fff' }}>{room.roomType}</Text>
    </TouchableOpacity>
  ))}
</ScrollView>

<View style={{paddingHorizontal:20, width: '22%'}}>
  <View style={{ backgroundColor: '#FDC939',borderColor:'#fff',borderWidth:1,height: 40, flexDirection: 'row',borderBottomLeftRadius:1000,borderTopLeftRadius:300,borderTopRightRadius:200,borderBottomRightRadius:200,width:'100%' }}>
    <View style={{
      backgroundColor: '#fff',
      width: 60,
      height: 60,
      borderRadius: 100,
      position: 'absolute',
      bottom: 0,
      left:0
    }}> 
{room?.playerDetails?.map((player) => (
  <View
    key={player.playerId}
    style={{
      position: 'relative',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Image
      source={require('./assets/profile.png')}
      style={{ width: 60, height: 60, resizeMode: 'cover' }}
    />

    {/* ✅ Only show overlay on THIS player if it's YOUR turn */}
    {/* {room?.currentTurn === playerID && (
      <View
        style={{
          width: 50,
          height: 50,
          borderRadius: 50,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          position: 'absolute',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ fontSize: 20, color: '#fff' }}>{timeLeft}</Text>
      </View>
    )} */}
  </View>
))}

 </View>
    <View style={{position:'absolute',right:20}}>
    <Text style={{fontSize:10,fontWeight:700 }}>Total Score</Text>
    <View style={{flexDirection:'row',alignItems:'center',gap:5}}>
{room?.playerDetails?.map((playerdetail)=>playerdetail.playerId === playerID &&  
<View style={{flexDirection:"row",alignItems:'center',gap:5}}>
<Text style={{ color: '#621B98',fontSize:20,fontWeight:700}}>{playerdetail?.issuedPoint}</Text>
{playerdetail?.issuedPoint>80 ?  <Text style={{fontSize:12,textDecorationLine: 'line-through'}}>80</Text> :  ''}
   </View>)}

    </View>
    </View>

  </View>
</View>

  <View style={{width:'40%',flexDirection:"row",justifyContent:'center',gap:10}}>
{playerCards &&  <TouchableOpacity onPress={handleExit} style={styles.button}>
            <Text style={{fontWeight:700,fontSize:14}}>Drop</Text>
          </TouchableOpacity>}
  <View style={{position:'relative'}}>
      {selectedCards.size >= 2 && (
        <View>
          <TouchableOpacity onPress={moveToStack} style={styles.button}>
            <Text style={{fontWeight:700,fontSize:14}}>Group</Text>
          </TouchableOpacity>
        </View>
      )}
      </View>
      <View>
      {selectedCards.size === 1 && (
        <View>
          <TouchableOpacity   onPress={() => {
  const [id] = selectedCards;
  discardCards(id); // Pass string, not Set
}}
 style={styles.discardbutton}>
            <Text style={{fontWeight:700,fontSize:14}}>Discard</Text>
          </TouchableOpacity>
        </View>
      )}
      </View>
  </View>

</View>
<Modal
        animationType="slide"
        transparent={true}
        visible={isExitModalVisible}
        onRequestClose={cancelExit}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure you want to Leave?</Text>
            <View style={styles.modalButtons}>
{ (room?.roomType === "Point" && room?.gameMode === "Cash") ? <TouchableOpacity onPress={ExitRoom} style={styles.modalButton}>
 
                <Text style={styles.modalButtonText}>Drop & Leave</Text>
              </TouchableOpacity> :            <TouchableOpacity onPress={confirmExit} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>}
              <TouchableOpacity onPress={cancelExit} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={finishPopup}
        onRequestClose={CloseLastGamePopup}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure you want to Leave this Table after this round?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={confirmLastGame} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={CloseLastGamePopup} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={disconnectionPopup}
        onRequestClose={CloseLastGamePopup}
      >        <View style={styles.modalBackground}>
      <View style={styles.InstructionContent}>
        <View style={{flexDirection:'column',alignItems:'center',gap:4}}>
        <Text style={styles.modalText}>DISCONNECTION SETTINGS</Text>
        <Text style={{width:250,textAlign:'center',backgroundColor:'#fff'}}>What should we do in case you get disconnected for a along duration?</Text>
        </View>
        <TouchableOpacity style={{position:'absolute', top:4,right:4}} onPress={closeDisconnection}> 
        <Image source={require('./assets/close.png')} style={{width:25,height:25}} />
        </TouchableOpacity>
        <View style={{flexDirection:'column',paddingHorizontal:20,backgroundColor:'#',width:'100%'}}>
          <Table borderStyle={{ borderWidth: 1, borderColor: '#ddd',backgroundColor:'#fff' }}>
          <Row data={tableHead} style={styles.head} textStyle={styles.text} />
          {tableData?.map((rowData, index) => (
            <Row key={index} data={rowData} style={styles.row} textStyle={styles.text} />
          ))}
        </Table>
        </View>
      </View>
    </View>
        <View style={{backgroundColor:'#fff'}}>

        </View>

      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={finishPopup}
        onRequestClose={CloseLastGamePopup}
      >        <View style={styles.modalBackground}>
      <View style={{backgroundColor:'#621B98',width:'100%',height:75,paddingHorizontal:20,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>

        <View style={{flexDirection:'column',backgroundColor:'#'}}>

        </View>
        <View style={{flexDirection:'row',justifyContent:'space-between',gap:10,width:200}}>
        <TouchableOpacity onPress={CloseLastGamePopup} style={{    backgroundColor: '#FF5733',  // Button color
        height:35,
    borderRadius: 5,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    width: '55%',
    alignItems: 'center',}}>
                <Text style={styles.modalButtonText}>Back to Lobby</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={CloseLastGamePopup} style={{    backgroundColor: '#FF5733',  // Button color
    borderRadius: 5,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    height:35,
    width: '45%',
    alignItems: 'center',}}>
                <Text style={styles.modalButtonText}>Play again</Text>
              </TouchableOpacity>
</View>
      </View>
      {}
      <View style={{flexDirection:'row',paddingHorizontal:10,backgroundColor:'#A0C878',paddingVertical:10}}>
      <View style={{width:'8%',}}>
        <Text>Rank</Text>
      </View>
      <View style={{width:'18%',}}>
        <Text>UserName</Text>
      </View>
      <View style={{width:'46%',}}>
        <Text>Cards</Text>
      </View>
      <View style={{width:'13%',}}>
        <Text>DealScore</Text>
      </View>

      <View style={{width:'13%',}}>
        <Text>TotalScore</Text>
      </View>
      </View>

    </View>
        <View style={{backgroundColor:'#fff'}}>

        </View>

      </Modal>
      </View>
    </ImageBackground>
  );
  
};
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
  topRankCard: {
    borderColor: 'gold',
    borderWidth: 3,
    shadowColor: 'gold',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5
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
    width: 60,
    height: 95,
    flexDirection:'column',
    justifyContent:'space-between',
    backgroundColor: '#fff',
    marginHorizontal: 5,
    // justifyContent: 'center',
    // padding:3,
    borderRadius: 5,
    borderWidth:1,
    borderColor:'#C9C9C9',
    elevation: 2, // Add shadow for a card effect
    position: 'absolute', // This makes sure the cards are placed on top of each other
  },
  Tosscard: {
    width: 40,
    height: 60,
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


export default Gameroom;