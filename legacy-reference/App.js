import { StyleSheet, } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { enableScreens } from 'react-native-screens';
import Wallet from './wallet';
import Profile from './profile';
import Home from './home';
import TournamentDetails from './tournamentDetails';
import Gameroom from './gameroom';
import Mission from './mission';
import Rewards from './rewards';
import LoginScreen from './login';
import SignupScreen from './signup';
import Kyc from './kyc';
import Addcash from './addcash';
import PrivateRoom from './privateroom';
import Transaction from './alltransaction';
import CreatePrivateRoom from './createprivateroom';
import JoinPrivateRoom from './joinprivateroom';
import KYCVerification from './kyc verification';
import Pan from './panverification';
import Refer from './refer';
import Chat from './chat';
import Ticket from './ticket';
import AddcashLimit from './addcashlimit';

import TermsandConditions from './termsandconditions';
import Security from './security';
import Contactus from './contactus';
import FAQ from './Faq';
import Drag from './drag';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Setting from './settings';
import PastGames from './pastgames';
import SplashScreen from './splash';
import Sidebar from './sidebar';
import Otp from './otp';
import Certification from './certification';
import About from './about';
import TrackReferral from './trackreferral';
import Preferences from './preferences';
import PasswordLoginScreen from './passwordLogin';
import ReferralTable from './referralTable';
import ReferralOtp from './referralcode';
import GameDetails from './gamedetails';
import BottomNav from './bottomnavbar';
import ForgotPassword from './forgotpassword';
import ForgotOtp from './forgotOtp';
import ForgotReset from './passwordreset';
import MissionHome from './homeclone';
import Toss from './toss';
import Lobby from './lobby';
import Cashtab from './cashtab';
import Freesection from './freesection';
import Filter from './filter';
import Myaccount from './myaccount';

export default function App() {

  const Stack = createStackNavigator();
  enableScreens();
  return (
    <NavigationContainer>
     <GestureHandlerRootView style={{ flex: 1 }}>
     <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='Home'>
     <Stack.Screen name='Home' component={Home} />
     <Stack.Screen name='Lobby' component={Lobby} />
     <Stack.Screen name='Myaccount' component={Myaccount} />
     <Stack.Screen name='Wallet' component={Wallet} />
     <Stack.Screen name='Toss' component={Toss} />
     <Stack.Screen name='Practice' component={Freesection} />
     <Stack.Screen name='EditProfile' component={Profile} />
     <Stack.Screen name='BottomNavbar' component={BottomNav} />
     <Stack.Screen name='Menu' component={Sidebar} />
     <Stack.Screen name='Cash' component={Cashtab} />
     <Stack.Screen name='Friends' component={PrivateRoom} />
     <Stack.Screen name="Tournament" component={Filter} />
     <Stack.Screen name="TournamentDetailsById" component={TournamentDetails} />
     <Stack.Screen name="PasswordLogin" component={PasswordLoginScreen} />
     <Stack.Screen name='Game' component={Gameroom} />
     <Stack.Screen name='Otp' component={Otp} />
     <Stack.Screen name='PastGame' component={PastGames} />
     <Stack.Screen name='GameDetails' component={GameDetails} />
     <Stack.Screen name='Privateroom' component={PrivateRoom} />
     <Stack.Screen name='ForgotPassword' component={ForgotPassword} />
     <Stack.Screen name='CreatePrivateroom' component={CreatePrivateRoom} />
     <Stack.Screen name='JoinPrivateroom' component={JoinPrivateRoom} />
     <Stack.Screen name='TermsandConditions' component={TermsandConditions} />
     <Stack.Screen name='Certification' component={Certification} />
     <Stack.Screen name='About' component={About} />
     <Stack.Screen name='Security' component={Security} />
     <Stack.Screen name='Settings' component={Setting} />
     <Stack.Screen name='Contactus' component={Contactus} />
     <Stack.Screen name='MissionHome' component={MissionHome} />
     <Stack.Screen name='Mission' component={Mission} />
     <Stack.Screen name='Chat' component={Chat} />
     <Stack.Screen name='Preferences' component={Preferences} />
     <Stack.Screen name='FAQ' component={FAQ} />
     <Stack.Screen name='Splash' component={SplashScreen} />
     <Stack.Screen name='TrackReferral' component={TrackReferral} />
     <Stack.Screen name='ReferralTable' component={ReferralTable} />
     <Stack.Screen name='Rewards' component={Rewards} />
     <Stack.Screen name='ReferralOtp' component={ReferralOtp} />
     <Stack.Screen name='ForgotOtp' component={ForgotOtp} />
     <Stack.Screen name='PastGames' component={PastGames} />
     <Stack.Screen name='ResetPassword' component={ForgotReset} />
     <Stack.Screen name='AddcashLimit' component={AddcashLimit} />
     <Stack.Screen name='Ticket' component={Ticket} />
     <Stack.Screen name='Login' component={LoginScreen} />
     <Stack.Screen name='Signup' component={SignupScreen} />
     <Stack.Screen name='Kyc' component={Kyc} />
     <Stack.Screen name='drag' component={Drag} />
     <Stack.Screen name='Pancard' component={Pan} />
     <Stack.Screen name='KYCVerification' component={KYCVerification} /> 
     <Stack.Screen name='Refer' component={Refer} />
     <Stack.Screen name='Addcash' component={Addcash} />
     <Stack.Screen name='Transaction' component={Transaction} />
    </Stack.Navigator>
    </GestureHandlerRootView>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
