import * as React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { 
  createDrawerNavigator,
  DrawerItem,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import NavigatorView from './RootNavigation';

import AvailableInFullVersion from '../login/LoginViewContainer';
import auth from '@react-native-firebase/auth';

const iconHome = require('../../../assets/images/drawer/home.png');
const iconCalendar = require('../../../assets/images/drawer/calendar.png');
const iconGrids = require('../../../assets/images/drawer/grids.png');
const iconPages = require('../../../assets/images/drawer/pages.png');
const iconComponents = require('../../../assets/images/drawer/components.png');
const iconSettings = require('../../../assets/images/drawer/settings.png');
const iconBlog = require('../../../assets/images/drawer/blog.png')
const iconProfile = require('../../../assets/images/drawer/user_min.png'); // Use existing icons as safe placeholders. Replace these files later with your own images
const iconTickets = require('../../../assets/images/drawer/blog.png'); // placeholder

// Keep only the three entries you requested; use calendar for Events and grids for Artists
const drawerData = [
  { name: 'Explore', icon: iconHome, route: 'Home' },
  { name: 'Events', icon: iconCalendar, route: 'Events' },
  { name: 'Artists', icon: iconGrids, route: 'Artists' },
];

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const sub = auth().onAuthStateChanged(u => setUser(u));
    return () => sub && sub();
  }, []);

  const handleLogout = async () => {
    try {
      await auth().signOut();
      props.navigation.closeDrawer();
      // Reset the navigation state so the app cannot go back into authenticated screens
      props.navigation.reset({
        index: 0,
        routes: [
          { name: 'Homes', state: { routes: [{ name: 'Login' }] } },
        ],
      });
    } catch (e) {
      console.warn('Logout failed', e);
    }
  };

  const displayName = (user && (user.displayName || (user.providerData && user.providerData[0] && user.providerData[0].displayName))) || 'John Doe';
  const displayEmail = (user && (user.email || (user.providerData && user.providerData[0] && user.providerData[0].email))) || 'Johndoe@gmail.com';
  const avatarSource = (user && (user.photoURL || (user.providerData && user.providerData[0] && user.providerData[0].photoURL)))
    ? { uri: user.photoURL || user.providerData[0].photoURL }
    : require('../../../assets/images/drawer/user.png');

  return (
    <DrawerContentScrollView {...props} style={{padding: 0}}>
      <View style={styles.avatarContainer}>
        <Image style={styles.avatar} source={avatarSource} />
        <View style={{ paddingLeft: 15 }}>
          <Text style={styles.userName}>{displayName}</Text>
          <Text style={{ color: '#4BC1FD' }}>{displayEmail}</Text>
        </View>
      </View>
      <View style={styles.divider} />
      {drawerData.map((item, idx) => (
        <DrawerItem
          key={`drawer_item-${idx+1}`}
          label={() => (
            <View style={styles.menuLabelFlex}>
              <Image style={{ width: 20, height: 20}} source={item.icon} />
              <Text style={styles.menuTitle}>{item.name}</Text>
            </View>
          )}
          onPress={() => props.navigation.navigate(item.route || item.name)}
        />
      ))}

      <View style={styles.divider} />
      {/* Logout button uses a left-arrow glyph so we don't need a new image */}
      <DrawerItem
        label={() => (
          <View style={styles.menuLabelFlex}>
            <Text style={styles.arrowGlyph}>←</Text>
            <Text style={[styles.menuTitle, { color: '#ff6666' }]}>Logout</Text>
          </View>
        )}
        onPress={handleLogout}
      />
    </DrawerContentScrollView>
  );
}

export default function App() {

  return (
    <Drawer.Navigator
      drawerStyle={{
        backgroundColor: '#1a1a1a',
        borderTopRightRadius:20,
        borderBottomRightRadius:20,
      }}
      drawerContent={props => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Homes" component={NavigatorView} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  menuTitle: {
    marginLeft: 10,
    color: '#fff'
  },
  menuLabelFlex: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowGlyph: {
    color: '#fff',
    fontSize: 18,
    lineHeight: 20,
    marginRight: 8,
  },
  userName: {
    color: '#fff',
    fontSize: 18
  },
  divider: {
    borderBottomColor: 'grey',
    opacity: 0.2,
    borderBottomWidth: 1,
    margin: 15,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: 20,
    marginBottom: 10
  },
});
