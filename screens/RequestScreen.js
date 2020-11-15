import React, { Component } from 'react';
import { Text, View, TextInput, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView } from 'react-native';
import { MyHeader } from '../components/MyHeader';
import firebase from 'firebase';
import db from '../config';
import { ScrollView } from 'react-native-gesture-handler';

export default class RequestScreen extends React.Component {
    constructor() {
        super();
        this.state = {
            book_name: "",
            reasonToRequest: "",
            requestedBookName: "",
            username: firebase.auth().currentUser.email,
            bookStatus: "requested",
            date: firebase.firestore.FieldValue.serverTimestamp(),
            docID: "",
            requestID: "",
            userDocID: "",
            isBookRequestActive: ""
        }
    }

    createUniqueId = () => {
        return (
            Math.random().toString(36).substring(7)
        )
    }

    addRequest = async (bookName, reasonToRequest) => {
        var userID = this.state.username;
        var randomRequestID = this.createUniqueId();
        db.collection("book-requests").add({
            username: userID,
            book_name: book_name,
            reasonToRequest: reasonToRequest,
            requestID: randomRequestID,
            bookStatus: "requested",
        })
        await this.getBookRequests()
        db.collection("user").where("email", "==", userID).get()
            .then()
            .then((snapshot) => {
                snapshot.forEach((docs) => {
                    db.collection("user").doc(doc.id).update({
                        isBookRequestActive: true
                    })
                })
            })
        this.setState({ book_name: "", reasonToRequest: "", requestID: this.createUniqueId() });
        return Alert.alert("Book request successful");
    }

    getBookRequests = () => {
        var bookRequest = db.collection("book-requests").where("username", "==", this.state.userID).get()
            .then((snapshot) => {
                snapshot.forEach((docs) => {
                    if (doc.data().bookStatus !== "recieved") {
                        this.setState({
                            requestID: doc.data().request_id,
                            book_name: doc.data().book_name,
                            bookStatus: doc.data().bookStatus,
                            docID: doc.id
                        })
                    }
                })
            })
    }

    getIsBookRequestActive() {
        db.collection("user").where("email", "==", this.state.username)
            .onSnapshot(querySnapshot => {
                querySnapshot.forEach((doc) => {
                    this.setState({
                        isBookRequestActive: doc.data().isBookRequestActive,
                        userDocID: doc.id
                    })
                })
            })
    }

    render() {
        if (this.state.isBookRequestActive === true) {
            return (
                <View style={{ flex: 1, justifyContent: "center" }}>
                    <View style={{ borderColor: "#000", borderWidth: 2, justifyContent: "center", alignItems: "center" }}>
                        <Text>Book Name</Text>
                        <Text>{this.state.requestedBookName}</Text>
                    </View>
                    <View>
                        <Text>Book Status</Text>
                        <Text>{this.state.bookStatus}</Text>
                    </View>
                </View>
            )
        } else {
            return (
                <View style={styles.container}>
                    <MyHeader title="Book Request" />
                    <ScrollView>
                        <KeyboardAvoidingView>
                            <TextInput style={styles.input} placeholder="Enter Book Name" onChangeText={(text) => { this.setState({ book_name: text }) }} />
                            <TextInput style={styles.input} placeholder="Why do you need the book?" multiline={true} onChangeText={(text) => { this.setState({ reasonToRequest: text }) }} />
                            <TouchableOpacity style={styles.button} >
                                <Text>Request</Text>
                            </TouchableOpacity>
                        </KeyboardAvoidingView>
                    </ScrollView>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },

    input: {
        borderColor: "#000",
        borderWidth: 1.3,
        width: 130,
        height: 30,
        paddingLeft: 15,
        color: "#000"
    }
})