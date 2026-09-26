import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import Cashtab from './cashtab';
import Freesection from './freesection';
import Filter from './filter';
import PrivateRoom from './privateroom';

const Section = () => {
  // State to track active tab
  const [activeTab, setActiveTab] = useState(0);

  // Function to handle tab click
  const handleTabPress = (index) => {
    setActiveTab(index);
  };

  return (
    <View>
      <View style={styles.tabContainer}>
        {/* Tab 1 */}
        <TouchableOpacity
          style={[styles.tab, activeTab === 0 && styles.activeTab]}
          onPress={() => handleTabPress(0)}
        >{activeTab === 0 ?
             <Image style={{width:30,height:30}} source={require('./assets/globalactive.png')}/> :  <Image style={{width:30,height:30}} source={require('./assets/global.png')}/>}
          <Text style={[styles.tabText, activeTab === 0 && styles.activeTabText]}>
           Global Arena
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 1 && styles.activeTab]}
          onPress={() => handleTabPress(1)}
        >
          {activeTab === 1 ?
             <Image style={{width:30,height:24}} source={require('./assets/friendsmodeactive.png')}/> :  <Image style={{width:30,height:24}} source={require('./assets/friendsmode.png')}/>}
          <Text style={[styles.tabText, activeTab === 1 && styles.activeTabText]}>
            Private Arena
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        {activeTab === 0 && <Freesection />}
        {activeTab === 1 && <PrivateRoom />}
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  // Container for tabs
  tabContainer: {
    flexDirection: 'row',
    padding:10,
    backgroundColor:'#fff',
    justifyContent:'space-between'
  },
  // Basic style for each tab
  tab: {
   height:72,
    flex:1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#fff',
  },

  activeTab: {
    backgroundColor: '#621B98',
  },
  tabText: {
    fontWeight: 'bold',
    color: '#000',
    fontSize:8 // Default text color
  },

  activeTabText: {
    color: '#fff',
    fontWeight:800 // White text for active tab
  },

});

export default Section;
