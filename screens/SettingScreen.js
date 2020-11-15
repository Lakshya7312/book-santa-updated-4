import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { MyHeader } from '../components/MyHeader';
import firebase from 'firebase';
import db from '../config';

export default class SettingScreen extends React.Component {
    constructor() {
        super();
        this.state = {
            first_name: "",
            last_name: "",
            contact: "",
            address: "",
            emailID: "",
            docID: ""
        }
    }

    getUserDetails = () => {
        var user = firebase.auth().currentUser;
        var email = user.email;
        db.collection('user').where('email', '==', email).get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    var data = doc.data()
                    this.setState({
                        emailID: data.email,
                        first_name: data.first_name,
                        last_name: data.last_name,
                        address: data.address,
                        contact: data.mobile_number,
                        docID: doc.id
                    })
                })
            })
    }

    updateUserDetails = () => {
        db.collection('user').doc(this.state.docID).update({
            "first_name": this.state.first_name,
            "last_name": this.state.last_name,
            "address": this.state.address,
            "mobile_number": this.state.contact
        })
    }

    componentDidMount() {
        this.getUserDetails();
    }

    render() {
        return (
            <View style={styles.container}>
                <MyHeader title="Settings" />
                <View>
                    <TextInput style={styles.input} placeholder="First Name" maxLength={8} onChangeText={(text) => { this.setState({ first_name: text }) }} value={this.state.first_name} />
                    <TextInput style={styles.input} placeholder="Last Name" maxLength={8} onChangeText={(text) => { this.setState({ last_name: text }) }} value={this.state.last_name} />
                    <TextInput style={styles.input} placeholder="Contact" keyboardType={"numeric"} maxLength={10} onChangeText={(text) => { this.setState({ contact: text }) }} value={this.state.contact} />
                    <TextInput style={styles.input} placeholder="Address" multiline={true} onChangeText={(text) => { this.setState({ address: text }) }} value={this.state.address} />
                    <TouchableOpacity style={styles.button} onPress={() => { this.updateUserDetails() }}>
                        <Text style={{color: "#fff", alignSelf: "center", marginTop: 2.4}}>Save</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    input: {
        borderColor: "#000",
        borderWidth: 1.3,
        width: 130,
        height: 30,
        paddingLeft: 15,
        color: "#000"
    },

    button: {
        backgroundColor: "orange",
        width: 100,
        height: 25,
        borderColor: "#fff",
        borderRadius: 10
    }
})