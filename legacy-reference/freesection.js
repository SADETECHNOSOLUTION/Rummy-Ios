import React, { useState } from 'react';
import { View, Text,Image, TouchableOpacity, StyleSheet } from 'react-native';
import SelectplayersFree from './selectplayersfree';
import FreePool from './freepool';
import FreeDeals from './freedeals';
import Header from './header';
import { useNavigation } from '@react-navigation/native';

const Freesection = () => {
  // State to track active tab
  const [activeTab, setActiveTab] = useState(0);
  const handleTabPress = (index) => {
    setActiveTab(index);
  };
  const navigation = useNavigation()
       const openLobby = ()=>{
    navigation.navigate('Lobby');
   }

  return (
    <View>

     
      {/* Tabs Container */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 0 && styles.activeTab]}
          onPress={() => handleTabPress(0)}
        >
          <Text style={[styles.tabText, activeTab === 0 && styles.activeTabText]}>
           POINTS
          </Text>
        </TouchableOpacity>

        {/* Tab 2 */}
        <TouchableOpacity
          style={[styles.tab, activeTab === 1 && styles.activeTab]}
          onPress={() => handleTabPress(1)}
        >
          <Text style={[styles.tabText, activeTab === 1 && styles.activeTabText]}>
            POOL
          </Text>
        </TouchableOpacity>

        {/* Tab 3 */}
        <TouchableOpacity
          style={[styles.tab, activeTab === 2 && styles.activeTab]}
          onPress={() => handleTabPress(2)}
        >
          <Text style={[styles.tabText, activeTab === 2 && styles.activeTabText]}>
            DEALS
          </Text>
        </TouchableOpacity>
      </View>

    {/* Content for active tab */}  
      <View style={styles.contentContainer}>
        {activeTab === 0 && <SelectplayersFree />}
        {activeTab === 1 && <FreePool />}
        {activeTab === 2 && <FreeDeals />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Container for tabs
  tabContainer: {
    flexDirection: 'row',
    backgroundColor:'#F2F7FE',
    justifyContent:'space-between',
    paddingHorizontal:40
  },
  // Basic style for each tab
  tab: {
   height:40,
   width:60,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Active tab style (changes background color)
  activeTab: {
    borderBottomWidth:1,
    borderBottomColor: '#621B98', // Green for active tab
  },
  // Text style for each tab
  tabText: {
    fontWeight:'black',
    color: '#000',
    fontSize:10 // Default text color
  },
  // Active text style (changes color when active)
  activeTabText: {
    color: '#621B98',
    fontWeight:800, // White text for active tab
  },
  // Content area for active tab
  contentContainer: {
    padding: 16,
  },
});

export default Freesection;
