import React, { useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  StyleSheet, 
  Animated, 
  Dimensions, 
  TouchableWithoutFeedback,
  Modal,
  Clipboard
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from "@react-navigation/native";

const JoinPrivateRoom = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState(1); 
  const [poolTab, setPoolTab] = useState(101);
  const [roomId, SetRoomId] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state

  const handleSelectPool = (index) => {
    setPoolTab(index);
  };

  const [amount, setAmount] = useState("0"); 
  
  const handleAmountChange = (text) => {
    let numericValue = text.replace(/[^0-9]/g, ''); 
    if (numericValue === "") {
      numericValue = "0";
    }
    if (numericValue.startsWith("0") && numericValue.length > 1) {
      numericValue = numericValue.substring(1); 
    }
    setAmount(numericValue); 
  };
  
  const handleTabPress = (index) => {
    setActiveTab(index);
  };

  const openGame = (roomId) => {
    navigation.navigate('Game', { roomId });
  };

  // Function to grab text directly from user's clipboard device
  const fetchCopiedText = async () => {
    const text = await Clipboard.getString();
    SetRoomId(text);
  };

  const handleSubmit = async (e) => {
    const playerId = await SecureStore.getItemAsync('playerId');
    const payload = {
      "roomSize" : 2,
      "roomType" : "Point",
      "gameMode" : "Practice",
      "gameStatus" : "Waiting",
      "issuedPoint" : 80,
      "totalRounds": 1,
      "entryType" : "Cash",
      "entryPrice" : amount,
      "playerId1": playerId,
      "visibility": "Private",
      "pointValue" : 0.0
    };
    try {
      const response = await fetch('https://rummy-apigateway-v1.onrender.com/api/user/login',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body:JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('room created');
        navigation.navigate('Home');
      } else {
        console.log('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const joinRoom = async () => {
    const playerId = await SecureStore.getItemAsync('playerId');
    const roomID = roomId;
    try {
      const response = await fetch(`https://rummy-apigateway-v1.onrender.com/api/room/update-9/${roomID}?playerId=${playerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      });
    
      if (response.ok) {
        const Data = await response.json();
        const roomId = Data.roomId;
        const gameStatus = Data.gameStatus;
        if (gameStatus === 'Waiting') {
          // Assuming these functions exist globally in your context
          // InitializeCards(roomId);
          // shuffleCards(roomId);
        }
        setIsModalVisible(false); // Close modal on success
        openGame(roomId);
      } else {
        console.log('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.log('Error submitting form:', error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <View style={{ height: 30 }} />
      
      <View style={{ backgroundColor: '#621B98', height: 60, flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700', paddingHorizontal: 20 }}>Join Room</Text>
      </View>

      {/* Main Screen Button Container */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={styles.mainCard}>
          <Text style={styles.cardTitle}>Private Matchmaking</Text>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => setIsModalVisible(true)}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Join Room</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Pop-up Dialog Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Enter Private Room ID</Text>
                
                {/* Input Container holding the icon and input field together */}
                <View style={styles.inputWrapper}>
                  <TouchableOpacity onPress={fetchCopiedText} style={styles.pasteIconContainer}>
                    <Text style={{ fontSize: 18 }}>📋</Text> 
                  </TouchableOpacity>
                  
                  <TextInput
                    keyboardType="numeric"
                    placeholder="Paste Room ID here..."
                    maxLength={24}
                    value={roomId}
                    onChangeText={SetRoomId}
                    style={styles.modalInputField}
                    placeholderTextColor="#F2F7FE"
                  />
                </View>

                {/* Modal Actions */}
                <View style={styles.modalButtonGroup}>
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.cancelButton]} 
                    onPress={() => setIsModalVisible(false)}
                  >
                    <Text style={{ color: '#621B98', fontWeight: 'bold' }}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.modalButton, styles.joinButton]} 
                    onPress={joinRoom}
                  >
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>Join</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  mainCard: {
    flexDirection: 'column',
    gap: 20,
    paddingVertical: 30,
    backgroundColor: '#fff',
    width: '85%',
    borderRadius: 10,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333'
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: 150,
    backgroundColor: '#621B98',
    paddingVertical: 14,
    borderRadius: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#621B98',
    borderRadius: 8,
    width: '100%',
    backgroundColor: '#181818',
    height: 50,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  pasteIconContainer: {
    paddingRight: 10,
    borderRightWidth: 1,
    borderRightColor: '#E2D9EC',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  modalInputField: {
    flex: 1,
    height: '100%',
    paddingLeft: 10,
    color: '#fefefe',
    fontSize: 15,
  },
  modalButtonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#621B98',
  },
  joinButton: {
    backgroundColor: '#621B98',
  },
});

export default JoinPrivateRoom;