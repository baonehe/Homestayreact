import { StyleSheet, Text, View,Switch } from 'react-native'
import React,{useState} from 'react'
import colors from '../assets/consts/colors';

export default function NotificationSetting() {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  return (
      <View>
      <Text style={{marginTop:10,fontSize:18,color:colors.black,marginLeft:10}}>Receive Notification</Text>
      <Switch 
      style={{ transform: [{ scaleX: 0.9 }, { scaleY: 1.0 }] }}
      trackColor={{false: '#767577', true:colors.primary}}
      thumbColor={isEnabled ? 'white' : 'white'}
      ios_backgroundColor="#3e3e3e"
      onValueChange={toggleSwitch}
      value={isEnabled}>
      </Switch>
      <Text style={{marginLeft:10,fontSize:14,marginTop:-10}}>Tap to turn on</Text>

      <Text style={{marginTop:10,fontSize:18,color:colors.black,marginLeft:10}}>Flash Sale</Text>
      <Switch 
      style={{ transform: [{ scaleX: 0.9 }, { scaleY: 1.0 }] }}
      trackColor={{false: '#767577', true:colors.primary}}
      thumbColor={isEnabled ? 'white' : 'white'}
      ios_backgroundColor="#3e3e3e"
      onValueChange={toggleSwitch}
      value={isEnabled}>
      </Switch>
      <Text style={{marginLeft:10,fontSize:14,marginTop:-10}}>Allow to receive Flash Sale notification</Text>

      <Text style={{marginTop:10,fontSize:18,color:colors.black,marginLeft:10}}>Reservation</Text>
      <Switch 
      style={{ transform: [{ scaleX: 0.9 }, { scaleY: 1.0 }] }}
      trackColor={{false: '#767577', true:colors.primary}}
      thumbColor={isEnabled ? 'white' : 'white'}
      ios_backgroundColor="#3e3e3e"
      onValueChange={toggleSwitch}
      value={isEnabled}>
      </Switch>
      <Text style={{marginLeft:10,fontSize:14,marginTop:-10}}>Allow to receive Booking notification</Text>
    </View>
  )
}

const styles = StyleSheet.create({})