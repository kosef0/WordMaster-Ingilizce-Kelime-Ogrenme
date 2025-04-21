import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Alert } from 'react-native';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import CategoryDetailScreen from '../screens/CategoryDetailScreen';
import WordDetailScreen from '../screens/WordDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => {
  try {
    return (
      <Stack.Navigator 
        id={undefined}
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    );
  } catch (error) {
    console.error("HomeStack hatası:", error);
    Alert.alert("Hata", "Ana sayfa yüklenirken bir hata oluştu.");
    return null;
  }
};

const CategoriesStack = () => {
  try {
    return (
      <Stack.Navigator 
        id={undefined}
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Categories" component={CategoriesScreen} />
        <Stack.Screen name="CategoryDetail" component={CategoryDetailScreen} />
        <Stack.Screen name="WordDetail" component={WordDetailScreen} />
      </Stack.Navigator>
    );
  } catch (error) {
    console.error("CategoriesStack hatası:", error);
    Alert.alert("Hata", "Kategoriler yüklenirken bir hata oluştu.");
    return null;
  }
};

const ProfileStack = () => {
  try {
    return (
      <Stack.Navigator 
        id={undefined}
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    );
  } catch (error) {
    console.error("ProfileStack hatası:", error);
    Alert.alert("Hata", "Profil yüklenirken bir hata oluştu.");
    return null;
  }
};

const AppNavigator = () => {
  useEffect(() => {
    console.log("AppNavigator yüklendi");
  }, []);

  try {
    return (
      <Tab.Navigator
        id={undefined}
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'HomeTab') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'CategoriesTab') {
              iconName = focused ? 'grid' : 'grid-outline';
            } else if (route.name === 'ProfileTab') {
              iconName = focused ? 'person' : 'person-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#4CAF50',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            paddingBottom: 5,
            paddingTop: 5,
          },
        })}
      >
        <Tab.Screen 
          name="HomeTab" 
          component={HomeStack} 
          options={{ tabBarLabel: 'Ana Sayfa' }}
        />
        <Tab.Screen 
          name="CategoriesTab" 
          component={CategoriesStack} 
          options={{ tabBarLabel: 'Kategoriler' }}
        />
        <Tab.Screen 
          name="ProfileTab" 
          component={ProfileStack} 
          options={{ tabBarLabel: 'Profil' }}
        />
      </Tab.Navigator>
    );
  } catch (error) {
    console.error("AppNavigator hatası:", error);
    Alert.alert("Hata", "Uygulama navigasyonu yüklenirken bir hata oluştu.");
    return null;
  }
};

export default AppNavigator;