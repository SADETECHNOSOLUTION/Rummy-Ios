import React,{useState,useEffect,useRef} from 'react';
import { View, Text, TouchableOpacity, Image,Platform, StyleSheet,Dimensions,Pressable,TouchableWithoutFeedback, ScrollView, Modal, TextInput, Animated } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';

const Profile = () => {
  const [date, setDate] = useState(new Date(2000, 0, 1));
  const [showPicker, setShowPicker] = useState(false);
  const [phone,setPhone] = useState('8072303608')
  const [gender,setGender] = useState('Male')
  const dimAnimPic = useRef(new Animated.Value(0)).current;
  const dimAnimMail = useRef(new Animated.Value(0)).current;
  const dimAnimPhone = useRef(new Animated.Value(0)).current;
  const dimAnimGender = useRef(new Animated.Value(0)).current;
  const [modalVisible, setModalVisible] = useState(false);
  const [profile,setProfile] = useState();
  const [avatars,setAvatars] = useState([]);
  const [changepasswordPopup,setChangePasswordPopup] = useState(false)
  const [profileName, setProfileName] = useState(profile?.name || '');
const [showAlert,setShowAlert] = useState(false)
const [location,setLocation] = useState('')
const [language,setLanguage] = useState('')
const [selectedAvatar,setSelectedAvatar] = useState(profile?.imagePath || '');
const [oldpassword,setoldPassword] = useState('')
  const [password,setPassword] = useState('')
  const [confirmPassword,setConfirmPassword] = useState('')
  const [error,setError] = useState('')
      const [filterVisible,setFilterVisible] = useState(false)
      const slideAnimProfile = new Animated.Value(0);
        const dimAnimProfile = useRef(new Animated.Value(0)).current;
            const openProfile = () => {
                  if (filterVisible) {
                    Animated.timing(slideAnimProfile, {
                      toValue: Dimensions.get('window').width,
                      duration: 300,
                      useNativeDriver: true,
                    }).start();
                    Animated.timing(dimAnimProfile, {
                      toValue: 0, // Fade out the dim background
                      duration: 300,
                      useNativeDriver: true,
                    }).start();
         
                  } else {
                    Animated.timing(slideAnimProfile, {
                      toValue: 0, // Slide sidebar in
                      duration: 300,
                      useNativeDriver: true,
                    }).start();
                    Animated.timing(dimAnimProfile, {
                      toValue: 0.5, 
                      duration: 300,
                      useNativeDriver: true,
                    }).start();
                  }
                  setFilterVisible(! filterVisible);
                };
         
                const closeProfile = () => {
          
                 // Close the sidebar
                 Animated.timing(sidebarAnim, {
                   toValue: Dimensions.get('window').width,
                   duration: 300,
                   useNativeDriver: true,
                 }).start();
               
                 // Fade out the dim background
                 Animated.timing(dimAnimProfile, {
                   toValue: 0, // Fade out the dim background
                   duration: 300,
                   useNativeDriver: true,
                 }).start();
               
                 // Reset the profile visibility state
                 setFilterVisible(false);// Make sure dim is hidden
               };

               const onChange = (event, selectedDate) => {
                setShowPicker(false); // hide after selection
                if (selectedDate) {
                  setDate(selectedDate);
                }
              };

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
      } else {
        console.error('Failed to fetch profile', response.status);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    FetchProfile();
  }, []);

    useEffect(() => {
      if (showAlert) {
        Animated.timing(slideAnim, {
          toValue: 50, // Target position (where it should be shown)
          duration: 500, // Duration of the slide-in
          useNativeDriver: true, // Ensure native driver for performance
        }).start();
        
        // Automatically hide the alert after 5 seconds
        setTimeout(() => {
          Animated.timing(slideAnim, {
            toValue: -100, // Move it off-screen again
            duration: 500, // Duration of the slide-out
            useNativeDriver: true,
          }).start();
          setShowAlert(false); // Hide the alert after sliding out
        }, 5000);
      }
    }, [showAlert]);

  useEffect(() => {
    setName(profile?.name);
  }, [profile?.name]);

  useEffect(() => {
    setMail(profile?.email);
  }, [profile?.email]);

  useEffect(() => {
    setPhone(profile?.phoneNumber);
  }, [profile?.phoneNumber]);
  const [name, setName] = useState(profile?.name);
  const [mail, setMail] = useState(profile?.email);
  const [isEditing, setIsEditing] = useState(false);

  const updateProfile = async () => {
    const playerId = await SecureStore.getItemAsync('playerId');
    const token = await SecureStore.getItemAsync('token');

    try {
      const response = await fetch(`https://rummy-apigateway-v1.onrender.com/api/user/${playerId}/update-profile?name=${profileName}&location=${location}&gender=${gender}&language=${language}`,{
        method: 'PUT',
        headers:{
        'Authorization':`Bearer ${token}`}
      });

      if(response.ok || response.status === 201 || response.status ===202){
        closeProfile();
        FetchProfile();
        setShowAlert(true); // Show alert if checkbox is unchecked
        // Automatically hide alert after 5 seconds
        setTimeout(() => setShowAlert(false), 3000);
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }z
  
      const data = await response.json();
      console.log(data);
      console.log('Registered successfully');
    } catch (error) {
      console.error("Error Updating the name:", error);
      console.log(error.message);
      console.log(name);
    }
  }

  const FetchAvatar = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return; // Prevent the API from running if the passwords don't match
    }
    const playerId = await SecureStore.getItemAsync('playerId');
    const token = await SecureStore.getItemAsync('token');
  const payload = {
    playerId:playerId
  }
    try {
      const response = await fetch(`https://rummy-apigateway-v1.onrender.com/api/user/get-all-avatar`,{
        method: 'GET',
        headers:{
        'Authorization':`Bearer ${token}`}
      });

      if(response.ok || response.status === 201 || response.status ===202){
        const data = await response.json();
        setAvatars(data);
        console.log('avatars',avatars)
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log(data);
      console.log('Registered successfully');

    } catch (error) {
      console.error("Error Updating the name:", error);
      console.log(password);
      console.log(confirmPassword);
    }
  }

  useEffect(() => {
    FetchAvatar();
  }, []);

  const updatePassword = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return; // Prevent the API from running if the passwords don't match
    }
    const playerId = await SecureStore.getItemAsync('playerId');
    const token = await SecureStore.getItemAsync('token');
  const payload = {
    playerId:playerId
  }
    try {
      const response = await fetch(`https://rummy-apigateway-v1.onrender.com/api/user/${playerId}/update-password?oldPassword=${oldpassword? oldpassword:null}&newPassword=${password}&confirmPassword=${confirmPassword}`,{
        method: 'PUT',
        headers:{
        'Authorization':`Bearer ${token}`}
      });
      
      if(response.ok || response.status === 201 || response.status ===202){
        closeProfile();
        setPassword('')
        setConfirmPassword('')
        setChangePasswordPopup(false)
        FetchProfile();
        setShowAlert(true); // Show alert if checkbox is unchecked
        // Automatically hide alert after 5 seconds
        setTimeout(() => setShowAlert(false), 3000);
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log(data);
      console.log('Registered successfully');

    } catch (error) {
      console.error("Error Updating the name:", error);
      console.log(password);
      console.log(confirmPassword);
    }
  }

  const updateAvatar = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return; // Prevent the API from running if the passwords don't match
    }
    const playerId = await SecureStore.getItemAsync('playerId');
    const token = await SecureStore.getItemAsync('token');
    try {
      const response = await fetch(`https://rummy-apigateway-v1.onrender.com/api/user/update-image/${playerId}?imagePath=${selectedAvatar}`,{
        method: 'PATCH',
        headers:{
        'Authorization':`Bearer ${token}`}
      });

      if(response.ok || response.status === 201 || response.status ===202){
        await SecureStore.setItemAsync('avatar', selectedAvatar);  // Save new avatar in SecureStore
      closePic()
      FetchProfile()
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log(data);
      console.log('Registered successfully');

    } catch (error) {
      console.error("Error Updating the name:", error);
      console.log(password);
      console.log(confirmPassword);
    }
  }

     const [profileVisible, setprofileVisible] = useState(false);
     const [mailVisible, setmailVisible] = useState(false);
     const [phoneVisible, setphoneVisible] = useState(false);
     const [genderVisible, setGenderVisible] = useState(false);  

    const handleGenderSelect = (selectedGender) => {
      setGender(selectedGender);
      closeGender()
    };

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

    const closePhone = () => {
      Animated.timing(sidebarAnim, {
        toValue: Dimensions.get('window').width, // Move sidebar off-screen
        duration: 300,
        useNativeDriver: true,
      }).start();
    
      Animated.timing(dimAnimPhone, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    
      setphoneVisible(false);
    };

    const closeMail = () => {
      // Close the sidebar
      Animated.timing(sidebarAnim, {
        toValue: Dimensions.get('window').width, // Move sidebar off-screen
        duration: 300,
        useNativeDriver: true,
      }).start();
    
      // Fade out the dim background
      Animated.timing(dimAnimMail, {
        toValue: 0, // Fade out the dim background
        duration: 300,
        useNativeDriver: true,
      }).start();
    
      // Reset the profile visibility state
      setmailVisible(false);// Make sure dim is hidden
    };
    const slideAnimMail = new Animated.Value(0);
    const slideAnimGender = new Animated.Value(0);
    const slideAnimPhone = new Animated.Value(0);
   const sidebarAnim = useRef(new Animated.Value(Dimensions.get('window').width)).current;
     
     const slideAnim = useRef(new Animated.Value(-100)).current;

       const closePic = () => {
 
        // Close the sidebar
        Animated.timing(sidebarAnim, {
          toValue: Dimensions.get('window').width, // Move sidebar off-screen
          duration: 300,
          useNativeDriver: true,
        }).start();
      
        // Fade out the dim background
        Animated.timing(dimAnimPic, {
          toValue: 0, // Fade out the dim background
          duration: 300,
          useNativeDriver: true,
        }).start();
      
        // Reset the profile visibility state
        setprofileVisible(false);// Make sure dim is hidden
        setName('')
      };

      useEffect(() => {
          setGender(profile?.gender)
          setProfileName(profile?.name); // Set initial value from backend
          setLanguage('English');
          setLocation(profile?.location)
      }, [profile]);
      
       const openPhone = () => {
        if (phoneVisible) {
          // Close the sidebar
          Animated.timing(slideAnimPhone, {
            toValue: Dimensions.get('window').width, // Move sidebar off-screen
            duration: 300,
            useNativeDriver: true,
          }).start();
          // Fade out the dim background
          Animated.timing(dimAnimPhone, {
            toValue: 0, // Fade out the dim background
            duration: 300,
            useNativeDriver: true,
          }).start();

        } else {
          // Open the sidebar
          Animated.timing(slideAnimPhone, {
            toValue: 0, // Slide sidebar in
            duration: 300,
            useNativeDriver: true,
          }).start();
          // Fade in the dim background
          Animated.timing(dimAnimPhone, {
            toValue: 0.5, // Dim the background to 50% opacity
            duration: 300,
            useNativeDriver: true,
          }).start();

        }
        setphoneVisible(!phoneVisible); // Toggle the state
      };
      
       const openMail = () => {
        if (mailVisible) {
          // Close the sidebar
          Animated.timing(slideAnimMail, {
            toValue: Dimensions.get('window').width, // Move sidebar off-screen
            duration: 300,
            useNativeDriver: true,
          }).start();
          // Fade out the dim background
          Animated.timing(dimAnimMail, {
            toValue: 0, // Fade out the dim background
            duration: 300,
            useNativeDriver: true,
          }).start();
        } else {
          // Open the sidebar
          Animated.timing(slideAnimMail, {
            toValue: 0, // Slide sidebar in
            duration: 300,
            useNativeDriver: true,
          }).start();
          // Fade in the dim background
          Animated.timing(dimAnimMail, {
            toValue: 0.5, // Dim the background to 50% opacity
            duration: 300,
            useNativeDriver: true,
          }).start();
        }
        setmailVisible(!mailVisible); // Toggle the state
      };
      
  const handleSave = () => {
    setModalVisible(false);
  };

  return (
    <View style={{flex:1}}>
    <View style={styles.show}>

    </View>
    <View style={{position:'relative',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
    <View style={styles.container}>
    </View>
    <View style={styles.basecontainer}>
    </View>

    <View style={{flexDirection:'Column',alignItems:'center',position:'absolute',}}>
      <View style={{position:'relative'}}>

{    profile?.imagePath ?
  <Image  source={{ uri: `https://rummy-apigateway-v1.onrender.com/api/user${profile?.imagePath}` }}style={styles.profileImage} /> :
<Image  source={{ uri: `https://rummy-apigateway-v1.onrender.com/api/user/uploads/1f970b43-bb9c-4868-9e50-a4456fb240d3_avatar4.png` }}style={styles.profileImage} />}
      <TouchableOpacity onPress={openProfile} style={{position:'absolute',right:8,bottom:0,backgroundColor:'#fff',padding:4,borderRadius:100}}>
      <Image style={{height:20,width:20}} source={require('./assets/editprofile.png')}/>
      </TouchableOpacity>



      </View>

      <Text style={{fontSize:16,fontWeight:800}}>{profile?.name}</Text>
      
      </View>
      
    </View>
    <Animated.View
    style={{
      flexDirection: 'row',
      justifyContent: 'center',
      width: '100%',
      position: 'absolute',
      top: 0,
      transform: [{ translateY: slideAnim }],
    }}
  >
    <View style={styles.alertContainer}>
      <Text style={styles.alertText}>Your profile has been updated</Text>
    </View>
  </Animated.View>
    <ScrollView style={{backgroundColor:'#E8E0DD',flex:1,position:'relative'}}>
      <View style={{paddingHorizontal:20,paddingVertical:10,flexDirection:'column',gap:20}}>
        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
          <Text style={{fontWeight:800,fontSize:16}}>Personal Information</Text>
        </View>
        {isEditing ? <TouchableOpacity style={styles.button} onPress={()=>{setIsEditing(false);updateProfile();setShowAlert(true)}}>
        <Text style={{color:'#fff',fontWeight:800}}>
        Save Profile
        </Text>

      </TouchableOpacity> : <TouchableOpacity style={styles.button} onPress={()=>setIsEditing(true)}>
        <Text style={{color:'#fff',fontWeight:800}}>
        Edit Profile
        </Text>
      </TouchableOpacity>}

        </View>

        <View style={{width:'100%',}}>
        <View style={styles.card}>  
          <View style={styles.cardposition}>
          <View style={styles.cardHeading}>
            <View style={{flexDirection:'row',alignItems:'center',gap:5}}>
          <Text style={{fontSize:14,paddingHorizontal:0}}>Your Name</Text>
            </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#BEBDBC', borderRadius: 10, paddingVertical: 5, position: 'relative', width: 320 }}>
                                    <Ionicons style={{marginLeft:10}} name="person-circle-sharp" size={24} color="#BEBDBC" />
          <TextInput
  style={styles.inputContainer}

  editable={isEditing}
  onChangeText={(text) => {
    setProfileName(text);
  }}
/>
    </View>


          </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardposition}>
          <View style={styles.cardHeading}>
                        <View style={{flexDirection:'row',alignItems:'center',gap:5}}>
           <Text style={{fontSize:14,paddingHorizontal:0}}>Phone number</Text>
            </View>
        
          <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#BEBDBC', borderRadius: 10, paddingVertical: 5, position: 'relative', width: 320,justifyContent:'space-between' }}>
                       <Ionicons style={{marginLeft:10}} name="phone-portrait-sharp" size={20} color="#BEBDBC" />

      <TextInput
        style={styles.inputContainer}
        value={profile?.phoneNumber || ''}
        editable={false} // Input is editable only when isEditing is true
        onChangeText={(text) => setProfileName(text)} // Optional: Update profile name if the user edits the input
      />

      <View style={{padding:8}}>
      <Image source={require('./assets/verify.png')} style={{width:25,height:25}} />
      </View>
    </View>
          </View>

          </View>

        </View>
        <View style={styles.card}>
          <View style={styles.cardposition}>
          <View style={{width:'100%'}}>
          <Text>Birthday</Text>
         
        <Pressable
        onPress={() => setShowPicker(true)}
        style={{
          width:'100%',
          padding: 12,
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 8,
          flexDirection:'row',
          marginBottom: 12,
        }}
      >
  <Entypo style={{marginRight:10}} name="calendar" size={20} color="#BEBDBC" />
        <Text>{date.toLocaleDateString('en-GB', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
})}</Text>
      </Pressable>
          </View>

          </View>

        </View>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          maximumDate={new Date()} // prevent future birthdays
          onChange={onChange}
        />
      )}
        <View style={styles.card}>
          <View style={styles.cardposition}>
          <View style={styles.cardHeading}>
          <Text style={{fontSize:14,paddingHorizontal:0}}>Password</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#BEBDBC', borderRadius: 10, paddingVertical: 5, position: 'relative', width: 320 }}>
<Entypo style={{marginRight:10,marginLeft:14}} name="key" size={18} color="#bebdbc" />      <TextInput
        style={styles.inputContainer}
        value={'*'.repeat(8 || '')}
        editable={false} // Input is editable only when isEditing is true
        onChangeText={(text) => setProfileName(text)} // Optional: Update profile name if the user edits the input
      />
      <TouchableOpacity style={styles.buttonoutline}  onPress={()=>setChangePasswordPopup(true)}>
        <Text>{profile?.password === null ? 'Add' : 'Edit'}</Text> {/* Toggle between 'Edit' and 'Save' */}
      </TouchableOpacity>
    </View>
          </View>

          </View>
        </View>
        <View style={styles.card}>
          <View style={styles.cardposition}>
          <View style={styles.cardHeading}>
          <Text style={{fontSize:14,paddingHorizontal:0}}>State</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#BEBDBC', borderRadius: 10, paddingVertical: 5, position: 'relative', width: 320 }}>
     <Entypo style={{marginRight:10,marginLeft:10}} name="location-pin" size={24} color="#BEBDBC" />
      <TextInput
        style={styles.inputContainer}
        value={location}
        editable={isEditing} // Input is editable only when isEditing is true
        onChangeText={(text) => setLocation(text)} // Optional: Update profile name if the user edits the input
      />
      {/* <TouchableOpacity style={styles.buttonoutline}  onPress={() => setIsEditing(!isEditing)}>
        <Text>{isEditing ? '' : 'Edit'}</Text>
      </TouchableOpacity> */}
    </View>
          </View>
          </View>
        </View>
        </View>
      </View>
      <View style={{paddingHorizontal:20,paddingVertical:0,flexDirection:'column',gap:20}}>

        <View style={styles.preferencecard}>
          <View style={styles.cardposition}>
            <Image source={require('./assets/language.png')} style={{width:25,height:25}} />
          <View style={styles.cardHeading}>
          <Text>Choose your Language</Text>
          </View>
          </View>

        </View>

        {/* <View style={styles.preferencecard}>
          <View style={styles.cardposition}>
      <Image source={require('./assets/instruction.png')} style={{width:25,height:25}} />
          <View style={styles.cardHeading}>
          <Text>Responsible Gaming</Text>
          </View>
          </View>
          <Image style={{width:15,height:15}} source={require('./assets/next.png')}  />
        </View>

        <View style={styles.preferencecard}>
          <View style={styles.cardposition}>
      <Image source={require('./assets/instruction.png')} style={{width:25,height:25}} />
          <View style={styles.cardHeading}>
          <Text>TDS</Text>
          </View>
          </View>
          <Image style={{width:15,height:15}} source={require('./assets/next.png')}  />
        </View> */}
        
        {/* <View style={styles.preferencecard}>
          <View style={styles.cardposition}>
          <Image style={{width:20,height:20}} source={require('./assets/setting.png')}  />
          <View style={styles.cardHeading}>
          <Text>Settings</Text>
          </View>

          </View>
          <Image style={{width:15,height:15}} source={require('./assets/next.png')}  />
        </View> */}
      
      </View>

    </ScrollView>
    {filterVisible && (
  <TouchableWithoutFeedback onPress={closeProfile}>
    <Animated.View
      style={[styles.dimBackground, { opacity: dimAnimProfile }]} // Apply the animated opacity
    />
  </TouchableWithoutFeedback>
)}
                <Modal visible={filterVisible} transparent={true} animationType="fade" onRequestClose={()=>{setFilterVisible(false)}}
                    style={[
                        styles.sidebar,
                        {
                            transform: [{ translateY: slideAnimProfile }],
                            height: Dimensions.get('window').height * 0.2, // 20% height of the screen
                        }
                    ]}
                >
                 <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Display Name</Text>
                            <View style={styles.cardHeading}>
          <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#BEBDBC', borderRadius: 10, paddingVertical: 5, position: 'relative', width: '100%' }}>
          <TextInput
  style={styles.inputContainer}
value={profile?.name}
  editable={isEditing} // Only editable when isEditing is true
  onChangeText={(text) => {
    // Update the profileName if the text is changed
    setProfileName(text);
  }}
/>

      {/* <TouchableOpacity style={styles.buttonoutline} onPress={() => setIsEditing(!isEditing)}>
        <Text>{isEditing ? 'Save' : 'Edit'}</Text> 
      </TouchableOpacity> */}
    </View>


          </View>
                     <Text style={styles.modalTitle}>Avatars</Text>
                     <View>
   {/* Points/Pools/Deals Section */}
   <View style={{ flexDirection: 'row',flexWrap:'wrap',gap:5}}>
   {avatars?.map((avatar) => (
        <TouchableOpacity onPress={()=>setSelectedAvatar(avatar.imagePath)} key={avatar.id}    style={{
          borderColor: selectedAvatar === avatar.imagePath ? '#65b014' : '#fff',
          borderWidth: 4, // Add a border width so the color is visible
          borderRadius: 100, // Optional: makes the border round
        }}>
          {/* <Text style={styles.avatarName}>{avatar.name}</Text> */}
          <Image
            source={{ uri: `https://rummy-apigateway-v1.onrender.com/api/user${avatar.imagePath}` }}
            style={{width:90,height:90}}
            onError={(error) => console.error('Image loading error:', error.nativeEvent.error)}
          />
        </TouchableOpacity>
      ))}
</View>


 </View>


                     <TouchableOpacity onPress={()=>{updateAvatar();setFilterVisible(false)}} style={styles.button}>
                         <Text style={{ color: '#fff' }}>Apply </Text>
                     </TouchableOpacity>
                 </View>
             </Modal>

{mailVisible && (
  <TouchableWithoutFeedback onPress={openMail}>
    <Animated.View
      style={[styles.dimBackground, { opacity: dimAnimMail }]} // Apply the animated opacity
    />
  </TouchableWithoutFeedback>
)}

{mailVisible &&
  <Animated.View
  style={[
    styles.sidebar,
    {
      transform: [{ translateY: slideAnimProfile }],
      zIndex: 999,
    },
  ]}
>
  <View style={styles.modalContent}>
    <Text style={styles.modalTitle}>Edit Your Mail</Text>
    <TextInput
      value={mail}
      onChangeText={setName}
      style={styles.modalInput}
    />
    <View style={styles.modalButtons}>
      <TouchableOpacity style={styles.modalButton} onPress={handleSave}>
        <Text style={styles.modalButtonText}>Save</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.modalButton} onPress={closeMail}>
        <Text style={styles.modalButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </View>
</Animated.View>
}

{genderVisible && (
  <TouchableWithoutFeedback onPress={openGender}>
    <Animated.View
      style={[styles.dimBackground, { opacity: dimAnimGender }]} // Apply the animated opacity
    />
  </TouchableWithoutFeedback>
)}


{phoneVisible && (
  <TouchableWithoutFeedback onPress={openPhone}>
    <Animated.View
      style={[styles.dimBackground, { opacity: dimAnimPhone }]} // Apply the animated opacity
    />
  </TouchableWithoutFeedback>
)}

{phoneVisible &&
  <Animated.View
  style={[
    styles.sidebar,
    {
      transform: [{ translateY: slideAnimPhone }],
      zIndex: 999,
    },
  ]}
>
  <View style={styles.modalContent}>
    <Text style={styles.modalTitle}>Edit Your Number</Text>
    <TextInput
      value={phone}
      onChangeText={setName}
      style={styles.modalInput}
    />   
    <View style={styles.modalButtons}>
      <TouchableOpacity style={styles.modalButton}>
        <Text style={styles.modalButtonText}>Save</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.modalButton} onPress={closePhone}>
        <Text style={styles.modalButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </View>
</Animated.View>
}

  <Modal visible={changepasswordPopup} transparent={true} animationType="fade" onRequestClose={() => setChangePasswordPopup(false)}>
      <View style={styles.passwordmodalContainer}>
         <View style={styles.forgotPasswordPopup}>
            <View style={{display:'flex',flexDirection:'row',width:'100%', justifyContent:'center'}}>
              <Text style={{fontWeight:800,textAlign:'center'}}>Set Your Password</Text>
                </View>
           {profile?.password===null?''  :      <View style={{width:'100%'}}>
         <Text>Old Password</Text>
          <TextInput    secureTextEntry={true}
            style={styles.modalInput}
            onChangeText={(text) => setoldPassword(text)}
            value={oldpassword}
          />      
         </View>}
         <View style={{width:'100%'}}>
         <Text>Password</Text>
          <TextInput    secureTextEntry={true}
            style={styles.modalInput}
            onChangeText={(text) => setPassword(text)}
            value={password}
          />      
         </View>

         <View style={{width:'100%'}}>
         <Text>Confirm Password</Text>
          <TextInput    secureTextEntry={true}
              style={styles.modalInput}
            onChangeText={(text) => setConfirmPassword(text)}
            value={confirmPassword}
          />      
         </View>
<Text>{error}</Text>
 <TouchableOpacity onPress={updatePassword} style={styles.otpbutton}>
                <Text style={{color: '#fff', }}>Submit</Text>
              </TouchableOpacity>
                </View>
              </View>
            </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    height:'220',
    justifyContent: 'flex-end', // Position the modal at the bottom
    alignItems: 'center',
    backgroundColor:'#f48971'
 // Overlay background
  },
  passwordmodalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },  
  otpbutton:{
    width:'100%',
    padding:10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#621B98',
    zIndex: 2, 
    color:'#fff' // Ensures button is on top of the gradient
  },
  inputContainer: {
    display:'flex',
    flexDirection:'column',
    height:30,
    justifyContent: 'center',
    gap:'30',
    borderRadius: 5, 
    paddingHorizontal:10,
    width:200,
  },
  otpInput: {
    width: '100%',  // Width of each box
    height: 35,  // Height of each box
    borderWidth: 1,  // Border for each box
    borderRadius: 5,  // Optional: rounded corners for the boxes
    textAlign: 'center',  // Center the text inside each box
    fontSize: 12,  // Adjust font size as needed
  },
  forgotPasswordPopup: {
    width:'85%',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    height:400,
    display:'flex',
    flexDirection:'column',
    justifyContent:"center",
    alignItems:'center',
    gap:5,
    borderRadius: 10,
  },
  genderCard:{
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    width:'30%',
   borderWidth:1,
   borderColor:'#D4D4D4',
    height:90
  },
  selectedGender:{
    borderWidth:2,
    borderColor:'#621B98'
  },
  selectedGenderText:{
    color:'#621B98',
    fontWeight:700
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#fff',
    position:'absolute',
    flexDirection:'column',
    gap:12,
    bottom:0,
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
  container:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal:20,
    height:96,
    width:'100%',
    backgroundColor: '#621B98', // blue-500
  },
  basecontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal:20,
    height:64,
    width:'100%',
    backgroundColor: '#E8E0DD', // blue-500
  },
  preferencecard:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:"center",
    padding:24,
    borderRadius:5,

    backgroundColor:'#fff',
    width:'100%'
  },
  alertContainer: {
    width: '80%',
    padding: 5,
    backgroundColor: '#9899EE',  // A yellow color for the alert
    alignItems: 'center',
    justifyContent: 'center',

    zIndex: 1,
  },
  alertText: {
    color: '#fff',
    fontSize:12,
    fontWeight: 'bold',
  },
  chips:{
    flexDirection:'column',
    alignItems:'center'
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
  cardHeading:{
    flexDirection:'column',
    gap:5
  },
  cardposition:{
    flexDirection:'row',
    justifyContent:'flex-end',
    alignItems:'center',
    gap:10
  },
  show:{
    width: '100%',
    height: 32,
    backgroundColor:'#fff'
  },
  bottomNavbar: {
    position: 'absolute',  // Position at the bottom
    bottom: 0,             // Stick to the bottom
    left: 0,               // Align to the left
    right: 0,              // Align to the right
    height: 80,            // Set a height for the navbar
    backgroundColor: '#621B98', // Background color for the navbar
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  card:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:"center",
    paddingHorizontal:26,
    paddingVertical:15,
    borderBottomWidth:1,
    borderBottomColor:'#BBB8B7',
    borderRadius:5,
    backgroundColor:'#fff',
    width:'100%'
  },
  Transactioncard:{
    display:'flex',
    flexDirection:'row',
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
    width: 96,
    height: 96,
    borderRadius: 24, // rounded-full
  },
  button: {
    flexDirection:'row',
    gap:4,
    justifyContent:'center',
    backgroundColor:'#621B98',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  savebutton: {
    flexDirection:'row',
    gap:4,
    backgroundColor:'#fff',
    paddingVertical: 10,
    paddingHorizontal: 13,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff', // blue-500
    fontWeight: 'bold',
    fontSize:20
  },
  buttonoutline:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    gap:4,
    position:'absolute',
    right:10,
    width:60,
    height:30,
    borderWidth:1,
    borderRadius:5,
    backgroundColor:'#fff',
    borderColor:'#BEBDBC'
  }
});

export default Profile;