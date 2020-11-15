import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerItems } from 'react-navigation-drawer';
import WelcomeScreen from '../screens/WelcomeScreen';
import firebase from 'firebase';
import { auth } from 'firebase';

export default class SideDrawer extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.drawerItemContainer}>
                    <DrawerItems {...this.props} />
                </View>
                <View style={styles.logoutContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => {
                        this.props.navigation.navigate("WelcomeScreen")
                        firebase.auth().signOut()
                    }}>
                        <Text>Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        height: "100%"
    },

    drawerItemContainer: {
        flex: 1
    }
})