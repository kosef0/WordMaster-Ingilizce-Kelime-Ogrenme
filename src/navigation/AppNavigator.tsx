import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View, Text, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Import screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import CategoryDetailScreen from '../screens/CategoryDetailScreen';
import WordDetailScreen from '../screens/WordDetailScreen';
import SearchScreen from '../screens/SearchScreen';
import StatsScreen from '../screens/StatsScreen';
import StudyScreen from '../screens/StudyScreen';

// Import auth context
import { useAuth } from '../context/AuthContext';

// Duolingo renkler
const COLORS = {
  primary: '#58CC02',
  primaryDark: '#2B8700',
  blue: '#1CB0F6',
  blueDark: '#0076BA',
  orange: '#FF9600',
  orangeDark: '#E05D00',
  red: '#FF4B4B',
  redDark: '#C00000',
  purple: '#A560FF',
  purpleDark: '#7839D4',
  yellow: '#FFD900',
  background: '#f6f6f6',
  grey: '#AFAFAF',
};

// Custom tab bar
const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.tabBarContainer}>
      <LinearGradient
        colors={['#F6F6F6', '#FFFFFF']}
        style={styles.tabBarGradient}
      >
        <View style={styles.tabBar}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.name;

            const isFocused = state.index === index;
            
            // Tab için simge ve renk belirleme
            let iconName;
            let color;
            
            if (route.name === 'HomeStack') {
              iconName = isFocused ? 'home' : 'home-outline';
              color = isFocused ? COLORS.primary : COLORS.grey;
            } else if (route.name === 'CategoriesStack') {
              iconName = isFocused ? 'grid' : 'grid-outline';
              color = isFocused ? COLORS.blue : COLORS.grey;
            } else if (route.name === 'StatsStack') {
              iconName = isFocused ? 'bar-chart' : 'bar-chart-outline';
              color = isFocused ? COLORS.orange : COLORS.grey;
            } else if (route.name === 'ProfileStack') {
              iconName = isFocused ? 'person' : 'person-outline';
              color = isFocused ? COLORS.purple : COLORS.grey;
            }

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <TouchableOpacity
                key={index}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                style={styles.tabItem}
              >
                <Ionicons name={iconName} size={24} color={color} />
                <Text style={[styles.tabLabel, { color }]}>
                  {label}
                </Text>
                {isFocused && <View style={[styles.tabIndicator, { backgroundColor: color }]} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </LinearGradient>
    </View>
  );
};

// Auth Stack
const AuthStack = createStackNavigator();
const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
  </AuthStack.Navigator>
);

// Main Tab Navigator
const Tab = createBottomTabNavigator();
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.grey,
    }}
    tabBar={props => <CustomTabBar {...props} />}
  >
    <Tab.Screen 
      name="HomeStack" 
      component={HomeStackNavigator} 
      options={{ title: 'Ana Sayfa' }}
    />
    <Tab.Screen 
      name="CategoriesStack" 
      component={CategoriesStackNavigator} 
      options={{ title: 'Kategoriler' }}
    />
    <Tab.Screen 
      name="StatsStack" 
      component={StatsStackNavigator} 
      options={{ title: 'İstatistikler' }}
    />
    <Tab.Screen 
      name="ProfileStack" 
      component={ProfileStackNavigator} 
      options={{ title: 'Profil' }}
    />
  </Tab.Navigator>
);

// Stack Navigatör için genel stillendirme seçenekleri
const stackScreenOptions = {
  headerShown: false,
  cardStyle: { backgroundColor: COLORS.background },
  gestureEnabled: true,
  presentation: 'card',
};

// Home Stack
const HomeStack = createStackNavigator();
const HomeStackNavigator = () => (
  <HomeStack.Navigator screenOptions={stackScreenOptions}>
    <HomeStack.Screen name="Home" component={HomeScreen} />
    <HomeStack.Screen name="CategoryDetail" component={CategoryDetailScreen} />
    <HomeStack.Screen name="WordDetail" component={WordDetailScreen} />
    <HomeStack.Screen name="Study" component={StudyScreen} />
    <HomeStack.Screen 
      name="Search" 
      component={SearchScreen} 
      options={{
        presentation: 'modal',
        gestureEnabled: true,
      }}
    />
  </HomeStack.Navigator>
);

// Categories Stack
const CategoriesStack = createStackNavigator();
const CategoriesStackNavigator = () => (
  <CategoriesStack.Navigator screenOptions={stackScreenOptions}>
    <CategoriesStack.Screen name="Categories" component={CategoriesScreen} />
    <CategoriesStack.Screen name="CategoryDetail" component={CategoryDetailScreen} />
    <CategoriesStack.Screen name="WordDetail" component={WordDetailScreen} />
    <CategoriesStack.Screen name="Study" component={StudyScreen} />
    <CategoriesStack.Screen 
      name="Search" 
      component={SearchScreen} 
      options={{
        presentation: 'modal',
        gestureEnabled: true,
      }}
    />
  </CategoriesStack.Navigator>
);

// Profile Stack
const ProfileStack = createStackNavigator();
const ProfileStackNavigator = () => (
  <ProfileStack.Navigator screenOptions={stackScreenOptions}>
    <ProfileStack.Screen name="Profile" component={ProfileScreen} />
    <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} />
    <ProfileStack.Screen name="ChangePassword" component={ChangePasswordScreen} />
    <ProfileStack.Screen name="WordDetail" component={WordDetailScreen} />
    <ProfileStack.Screen name="Study" component={StudyScreen} />
  </ProfileStack.Navigator>
);

// Stats Stack
const StatsStack = createStackNavigator();
const StatsStackNavigator = () => (
  <StatsStack.Navigator screenOptions={stackScreenOptions}>
    <StatsStack.Screen name="Stats" component={StatsScreen} />
    <StatsStack.Screen name="WordDetail" component={WordDetailScreen} />
    <StatsStack.Screen name="Study" component={StudyScreen} />
  </StatsStack.Navigator>
);

// Root Stack
const RootStack = createStackNavigator();
const RootNavigator = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    // Yükleme ekranı
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#58CC02" />
        <Text style={{ marginTop: 20, fontSize: 16, color: '#666' }}>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <RootStack.Screen name="Main" component={MainTabs} />
      ) : (
        <RootStack.Screen name="Auth" component={AuthNavigator} />
      )}
    </RootStack.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  tabBarGradient: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  tabBar: {
    flexDirection: 'row',
    height: 65,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    paddingTop: 12,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: -6,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});

export default RootNavigator;