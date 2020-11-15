import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { ListItem, Icon, Card } from 'react-native-elements';
import { MyHeader } from '../components/MyHeader';
import firebase from 'firebase';
import db from '../config';

export default class MyDonations extends React.Component {
    constructor() {
        super();
        this.state = {
            donorID: firebase.auth().currentUser.email,
            allDonations: [],
            donorName: ""
        }
        this.requestRef = null;
    }

    getAllDonations = () => {
        this.requestRef = db.collection("all-donations").where("donor_id", "==", this.state.donorID)
            .onSnapshot((snapshot) => {
                var allDonations = [];
                snapshot.docs.map((doc) => {
                    var donation = doc.data();
                    donation[doc_id] = doc.id;
                    allDonations.push(donation);
                });
                this.setState({ allDonations: allDonations });
            })
    }

    sendBook = (bookDetails) => {
        if (bookDetails.request_status === "Book Sent") {
            var requestStatus = "Donor Interested";
            db.collection("all_donations").doc(bookDetails.doc_id).update({
                "request_status": "Donor Interested"
            })
            this.sendNotification(bookDetails, requestStatus)
        }
        else {
            var requestStatus = "Book Sent";
            db.collection("all_donations").doc(bookDetails.doc_id).update({
                "request_status": "Book Sent"
            })
            this.sendNotification(bookDetails, requestStatus)
        }
    }

    sendNotification = (bookDetails, requestStatus) => {
        var requestID = bookDetails.request_id;
        var donorID = bookDetails.donor_id;
        db.collection("all-notifications").where("request_id", "==", requestID)
            .where("donor_id", "==", donorID)
            .get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    var message = "";
                    if (requestStatus === "BookSent") {
                        message = this.state.donorName + "sent you the book!"
                    }
                    else {
                        message = this.state.donorName + "has shown interest in donating the book"
                    }
                    db.collection("all-notifications").doc(doc.id).update({
                        "message": message,
                        "notification-status": "unread",
                        "date": firebase.firestore.FieldValue.serverTimestamp(),
                    })
                })
            })
    }

    keyExtractor = (item, index) => index.toString();

    renderItem = ({ item, i }) => (
        <ListItem
            key={i}
            title={item.book_name}
            subtitle={"Requested By:" + item.requestedBy + "\nStatus: " + item.request_status}
            leftElement={<Icon name="Book" type="font-awesome" color="#696969" />}
            titleStyle={{ color: "#000", fontWeight: "bold" }}
            rightElement={
                <TouchableOpacity style={[styles.button,
                { backgroundColor: item.request_status === "BookSent" ? "green" : "#ff5722" }]}
                    onPress={() => { this.sendBook(item) }}>
                    <Text style={{ color: "#fff" }}>{item.request_status === "BookSent" ? "Book Sent" : "Send Book"}</Text>
                </TouchableOpacity>
            }
            bottomDivider
        />
    )

    componentDidMount() {
        this.getAllDonations();
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <MyHeader title="My Donations" navigation={this.props.navigation} />
                <View style={{ flex: 1 }}>
                    {
                        this.state.allDonations.length === 0
                            ? (
                                <View style={styles.subtitle}>
                                    <Text style={{ fontSize: 20 }}>List of all Book Donations</Text>
                                </View>
                            )
                            : (
                                <FlatList
                                    keyExtractor={this.keyExtractor}
                                    renderItem={this.renderItem}
                                    data={this.state.allDonations}
                                />
                            )
                    }
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "orange",
        width: 100,
        height: 25,
        borderColor: "#fff",
        borderRadius: 10
    }
})