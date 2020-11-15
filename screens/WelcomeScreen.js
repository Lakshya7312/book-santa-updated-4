import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, Image, Modal, ScrollView, KeyboardAvoidingView } from 'react-native';
import firebase from 'firebase';
import db from '../config';

export default class WelcomeScreen extends React.Component {
    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
            isModalVisible: false,
            firstName: "",
            lastName: "",
            address: "",
            contact: "",
            username: "",
            confirmPassword: "",
            isBookRequestActive: false
        }
    }

    login = async (email, password) => {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(() => {
                console.log("Logged in");
                this.props.navigation.navigate("DonateScreen");
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                return Alert.alert(errorMessage);
            })
    }

    signUp = async (email, password, confirmPassword) => {
        if (password !== confirmPassword) {
            Alert.alert("Passwords do not match\nCheck Your Password")
        } else {
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then((response) => {
                    db.collection("user").add({
                        first_name: this.state.firstName,
                        last_name: this.state.lastName,
                        username: this.state.username,
                        email: this.state.email,
                        address: this.state.address,
                        mobile_number: this.state.contact,
                        isBookRequestActive: false
                    })
                })
                .catch(function (error) {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    return Alert.alert(errorMessage);
                })
        }
    }

    showModal = () => {
        return (
            <Modal animationType="fade"
                transparent={false}
                visible={this.state.isModalVisible}
            >
                <View style={styles.modalContainer}>
                    <ScrollView style={{ width: '100%' }}>
                        <KeyboardAvoidingView style={styles.keyboardAvoidingView}>
                            <Text style={styles.reg}>Registration</Text>
                            <TextInput style={styles.regForm} placeholder="First Name" maxLength={8} onChangeText={(text) => { this.setState({ firstName: text }) }} />
                            <TextInput style={styles.regForm} placeholder="Last Name" maxLength={8} onChangeText={(text) => { this.setState({ lastName: text }) }} />
                            <TextInput style={styles.regForm} placeholder="Username" maxLength={12} onChangeText={(text) => { this.setState({ username: text }) }} />
                            <TextInput style={styles.regForm} placeholder="Address" multiline={true} onChangeText={(text) => { this.setState({ address: text }) }} />
                            <TextInput style={styles.regForm} placeholder="Email" keyboardType="email-address" onChangeText={(text) => { this.setState({ email: text }) }} />
                            <TextInput style={styles.regForm} placeholder="Mobile Number" keyboardType="number-pad" maxLength={10} onChangeText={(text) => { this.setState({ contact: text }) }} />
                            <TextInput style={styles.regForm} placeholder="Password" secureTextEntry={true} onChangeText={(text) => { this.setState({ password: text }) }} />
                            <TextInput style={styles.regForm} placeholder="Confirm Password" secureTextEntry={true} onChangeText={(text) => { this.setState({ confirmPassword: text }) }} />
                            <View style={styles.modalBackButton}>
                                <TouchableOpacity style={styles.registerButton} onPress={() => { this.signUp(this.state.email, this.state.password, this.state.confirmPassword) }}>
                                    <Text style={{ color: "#fff", alignSelf: "center", marginTop: 3 }}>Register</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.modalBackButton}>
                                <TouchableOpacity style={styles.registerButton} onPress={() => { this.setState({ isModalVisible: false }) }}>
                                    <Text style={{ color: "#fff", alignSelf: "center", marginTop: 3 }}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </KeyboardAvoidingView>
                    </ScrollView>
                </View>
            </Modal>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                    {this.showModal()}
                </View>
                <Text style={{ fontWeight: "bold", fontSize: 35, alignSelf: "center", marginTop: 30 }}>Book Santa</Text>
                <Image source={require("../assets/Sign-up.png")} style={{ marginTop: 10, height: 200, width: 200, alignSelf: "center" }} />
                <TextInput style={styles.input}
                    placeholder="Email" placeholderTextColor="#fff"
                    onChangeText={(text) => { this.setState({ email: text }) }}
                />
                <TextInput style={styles.input}
                    placeholder="Password" placeholderTextColor="#fff"
                    onChangeText={(text) => { this.setState({ password: text }) }}
                />
                <TouchableOpacity style={styles.button} onPress={() => { this.login(this.state.email, this.state.password) }}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => { this.setState({ "isModalVisible": true }) }}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },

    keyboardAvoidingView: {
        padding: 10,
    },

    reg: {
        fontWeight: "bold",
        fontSize: 20,
        alignSelf: "center",
    },

    regForm: {
        borderColor: "#000",
        borderWidth: 1.5,
        marginTop: 20,
        width: 150,
        height: 25,
        alignSelf: "center",
        paddingLeft: 8,
        borderRadius: 5,
    },

    modalBackButton: {
        flex: 1,
    },

    registerButton: {
        width: 100,
        height: 30,
        backgroundColor: "#000",
        alignSelf: "center",
        borderRadius: 2,
        borderColor: "#fff",
        marginTop: 15
    },

    input: {
        width: 150,
        height: 35,
        borderColor: "#fff",
        borderWidth: 1.3,
        paddingLeft: 9,
        color: '#fff', backgroundColor: "#000",
        marginTop: 50,
        alignSelf: "center",
        borderRadius: 5,
    },

    button: {
        backgroundColor: "black",
        borderRadius: 7,
        borderColor: "#fff",
        borderWidth: 1.3,
        marginTop: 30,
        alignSelf: "center",
        width: 100,
        height: 30
    },

    buttonText: {
        color: "#fff",
        marginTop: 0.6,
        alignSelf: "center"
    }
})