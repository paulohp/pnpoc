/**
 * Sample React Native App
 * @flow
 */
'use strict';

import {
 UrbanAirship,
 UACustomEvent,
} from 'urbanairship-react-native'

import React, {
  Component,
} from 'react';

import {
  StyleSheet,
  Text,
  View,
  AppRegistry,
  Image,
  Switch,
  Button,
  ListView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    flexDirection:'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  stackRight: {
    flex: 1,
    flexDirection:'column',
    alignItems: 'flex-start'
  },
  cellContainer: {
    flex: 0,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    marginRight: 10,
    marginLeft: 10,
    marginBottom: 10,
  },
  miniCellContainer: {
    flex: 0,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0A500',
    marginRight: 10,
    marginLeft: 10,
  },
  managerCell: {
    flex:0,
    flexDirection:'row',
    padding:10
  },
  channel: {
    fontSize: 16,
    color: '#0d6a83',
    textAlign: 'center',
    padding: 10,
  },
  rowLabel: {
    flexDirection:'row',
    color: '#0d6a83',
    fontSize: 16,
    marginRight: 10
  },
  instructions: {
    fontSize: 11,
    marginTop: 40,
    textAlign: 'center',
    color: '#0d6a83',
    marginBottom: 5,
  },
  textInput: {
    flex:1,
    color:'#0d6a83',
    alignSelf: 'flex-start',
    width: 100,
    flexDirection:'row',
    height: 35,
    borderColor:'white',
    borderWidth: 1,
  },
  inputButton: {
    width: 150,
    height: 35,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 20/2,
    backgroundColor: '#0d6a83'
  },
  dash: {
   backgroundColor: 'white',
   height: 2,
   width: 10,
   position: 'absolute',
   left: 5,
   top: 8.5,
 },
});

const notificationsEnabledKey = "com.urbanairship.notificationsEnabled"
const locationEnabledKey = "com.urbanairship.locationEnabled"

export default class AirshipSample extends Component {
  constructor(props) {
    super(props);

    this.state = {
      channelId: "",
      notificationsEnabled: false,
    }

    UrbanAirship.setUserNotificationsEnabled(true);

    this.handleNotificationsEnabled = this.handleNotificationsEnabled.bind(this);

    UrbanAirship.addListener("notificationResponse", (response) => {
      console.log('notificationResponse:', JSON.stringify(response));
      alert("notificationResponse: " + response.notification.alert);
    });

    UrbanAirship.addListener("pushReceived", (notification) => {
      console.log('pushReceived:', JSON.stringify(notification));
      alert("pushReceived: " + notification.alert);
    });

    UrbanAirship.addListener("deepLink", (event) => {
      console.log('deepLink:', JSON.stringify(event));
      alert("deepLink: " + event.deepLink);
    });

    UrbanAirship.addListener("register", (event) => {
      console.log('registration:', JSON.stringify(event));
      this.setState({channelId:event.channelId})
    });

    UrbanAirship.addListener("notificationOptInStatus", (event) => {
      console.log('notificationOptInStatus:', JSON.stringify(event));
    });

  }

  handleNotificationsEnabled(enabled) {
    UrbanAirship.setUserNotificationsEnabled(enabled)
    this.setState({notificationsEnabled:enabled});
  }

  componentWillMount() {
    UrbanAirship.getChannelId().then((channelId) => {
      this.setState({channelId:channelId})
    });

    UrbanAirship.isUserNotificationsEnabled().then ((enabled) => {
      this.setState({notificationsEnabled:enabled})
    })

    UrbanAirship.isLocationEnabled().then ((enabled) => {
      this.setState({locationEnabled:enabled})
    })
  }

  render() {

    let channelcell = null
    if (this.state.channelId) {
      channelcell = <ChannelCell channelId={this.state.channelId}/>;
    }

    return (
      <View style={styles.centeredContainer}>
        <Image
          style={{width: 300, height: 70, marginTop:50}}
          source={require('./img/jenius.png')}
        />
        <View style={{height:75}}>
        </View>
        <EnablePushCell
          notificationsEnabled={this.state.notificationsEnabled}
          handleNotificationsEnabled={this.handleNotificationsEnabled}
        />
        <View>
          {channelcell}
        </View>
      </View>
    );
  }
}

class ChannelCell extends Component {
  render() {
    return (
      <Text style={styles.channel}>
        Channel ID {'\n'}
        {this.props.channelId}
      </Text>
    );
  }
}

class EnablePushCell extends Component {
  render() {
    return (
      <View style={styles.cellContainer}>
        <Text style={styles.rowLabel}>
          Enable Push
        </Text>
        <Switch
          onTintColor='#0d6a83'
          onValueChange={(value) => this.props.handleNotificationsEnabled(value)}
          value={this.props.notificationsEnabled}
        />
      </View>
    );
  }
}


