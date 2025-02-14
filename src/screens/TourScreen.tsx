import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import * as Location from 'expo-location';
import * as NfcManager from 'expo-nfc';
import * as MailComposer from 'expo-mail-composer';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export default function TourScreen() {
  const [checkpoints, setCheckpoints] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    setupLocation();
    setupNFC();
    loadCheckpoints();
  }, []);

  const setupLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required');
        return;
      }

      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 10000,
          distanceInterval: 10,
        },
        (location) => {
          setCurrentLocation(location);
        }
      );
    } catch (error) {
      Alert.alert('Error', 'Could not get location');
    }
  };

  const setupNFC = async () => {
    try {
      await NfcManager.start();
    } catch (error) {
      Alert.alert('Error', 'NFC not available');
    }
  };

  const loadCheckpoints = async () => {
    try {
      const { data, error } = await supabase
        .from('checkpoints')
        .select('*')
        .order('sequence');
      
      if (error) throw error;
      setCheckpoints(data);
    } catch (error) {
      Alert.alert('Error', 'Could not load checkpoints');
    }
  };

  const handleNFCScan = async () => {
    try {
      const tag = await NfcManager.getTag();
      if (!tag) return;

      const checkpoint = checkpoints.find(cp => cp.nfc_id === tag.id);
      if (!checkpoint) {
        Alert.alert('Invalid Checkpoint', 'This NFC tag is not registered');
        return;
      }

      await recordCheckpoint(checkpoint);
    } catch (error) {
      Alert.alert('Error', 'Failed to scan NFC tag');
    }
  };

  const recordCheckpoint = async (checkpoint) => {
    try {
      const timestamp = new Date();
      const { error } = await supabase
        .from('checkpoint_scans')
        .insert({
          checkpoint_id: checkpoint.id,
          guard_id: user.id,
          timestamp,
          location: `${currentLocation.coords.latitude},${currentLocation.coords.longitude}`,
        });

      if (error) throw error;

      // Check for delays
      const expectedTime = new Date(checkpoint.expected_time);
      const delay = Math.abs(timestamp - expectedTime) / 1000 / 60; // in minutes

      if (delay > 15) {
        await sendDelayAlert(checkpoint, delay);
      }

      Alert.alert('Success', 'Checkpoint recorded');
    } catch (error) {
      Alert.alert('Error', 'Failed to record checkpoint');
    }
  };

  const sendDelayAlert = async (checkpoint, delay) => {
    try {
      await MailComposer.composeAsync({
        recipients: ['supervisor@company.com'],
        subject: 'Security Tour Delay Alert',
        body: `
          Guard: ${user.email}
          Checkpoint: ${checkpoint.name}
          Delay: ${Math.round(delay)} minutes
          Time: ${format(new Date(), 'PPpp')}
          Location: ${currentLocation.coords.latitude}, ${currentLocation.coords.longitude}
        `,
      });
    } catch (error) {
      console.error('Failed to send email alert:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Security Tour</Text>
      
      <ScrollView style={styles.checkpointList}>
        {checkpoints.map((checkpoint) => (
          <View key={checkpoint.id} style={styles.checkpointItem}>
            <Text style={styles.checkpointName}>{checkpoint.name}</Text>
            <Text style={styles.checkpointTime}>
              Expected: {format(new Date(checkpoint.expected_time), 'pp')}
            </Text>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.scanButton} onPress={handleNFCScan}>
        <Text style={styles.scanButtonText}>Scan NFC Checkpoint</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  checkpointList: {
    flex: 1,
  },
  checkpointItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  checkpointName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkpointTime: {
    color: '#666',
    marginTop: 5,
  },
  scanButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  scanButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});