import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Header, Icon } from 'react-native-elements';
import firebase from 'firebase';
import db from '../config';

export default class ReceiverDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userID: firebase.auth().currentUser.email,
            username: "",
            receiverID: this.props.navigation.getParam("details")["username"],
            requestID: this.props.navigation.getParam("details")["requestID"],
            bookName: this.props.navigation.getParam("details")["book_name"],
            reasonForRequest: this.props.navigation.getParam("details")["reasonToRequest"],
            recieverName: "",
            recieverContact: "",
            recieverAddress: "",
            requestDocID: ""
        }
    }

    getUserDetails() {
        db.collection("user").where("email", "==", this.state.receiverID).get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    this.setState({
                        recieverName: doc.data().first_name,
                        recieverContact: doc.data().mobile_number,
                        recieverAddress: doc.data().address
                    })
                })
            })

        db.collection("book-requests").where("requestID", "==", this.state.requestID).get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    this.setState({
                        requestDocID: docID
                    })
                })
            })
    }

    updateBookStatus = () => {
        db.collection("all-donations").add({
            book_name: this.state.bookName,
            request_id: this.state.requestID,
            requestdBy: this.state.recieverName,
            donor_id: this.state.userID,
            request_status: "Donor Interested"
        })
    }

    addNotification = () => {
        var message = this.state.username + "has shown interest in donating the book";
        db.collection("all-notifications").add({
            "targetedUserID": this.state.receiverID,
            "donor_id": this.state.userID,
            "request_id": this.state.requestID,
            "book_name": this.state.bookName,
            "date": firebase.firestore.FieldValue.serverTimestamp(),
            "notification_status": "unread",
            "message": message
        })
    }

    componentDidMount() {
        this.getUserDetails();
    }

    render() {
        return (
            <View styles={styles.container}>
                <View style={{ flex: 01 }}>
                    <Card
                        title={"Book Information"}
                        titleStyle={{ fontSize: 20 }}
                    >
                        <Card>
                            <Text style={{ fontWeight: "bold" }}>Name: {this.state.bookName}</Text>
                        </Card>
                    </Card>
                </View>
                <View>
                    <Card
                        title={"Reciever Information"}
                        titleStyle={{ fontSize: 20 }}
                    >
                        <Card>
                            <Text style={{ fontWeight: 'bold' }}>Name: {this.state.recieverName}</Text>
                        </Card>
                        <Card>
                            <Text style={{ fontWeight: 'bold' }}>Contact: {this.state.recieverContact}</Text>
                        </Card>
                        <Card>
                            <Text style={{ fontWeight: 'bold' }}>Address: {this.state.recieverAddress}</Text>
                        </Card>
                    </Card>
                </View>

                <View style={styles.buttonContainer}>
                    {
                        this.state.receiverID !== this.state.userID
                            ? (
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => {
                                        this.updateBookStatus()
                                        this.addNotification()
                                        this.props.navigation.navigate('MyDonations')
                                    }}>
                                    <Text style={{ color: "#fff", alignSelf: "center", marginTop: 2.4 }}>I want to Donate</Text>
                                </TouchableOpacity>
                            )
                            : null
                    }
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    buttonContainer: {
        flex: 1
    },

    button: {
        backgroundColor: "orange",
        width: 100,
        height: 25,
        borderColor: "#fff",
        borderRadius: 10
    }
})