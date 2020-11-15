import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import { MyHeader } from '../components/MyHeader';
import firebase from 'firebase';
import db from '../config';

export default class AllNotifications extends React.Component {
    constructor() {
        super();
        this.state = {
            userID: firebase.auth().currentUser.email,
            allNotifications: []
        }
        this.notificationRef = null;
    }

    getNotification = () => {
        this.notificationRef = db.collection("all-notifications").where("notification_status", "==", "unread")
            .where("targetedUserID", "==", this.state.userID)
            .onSnapshot((snapshot) => {
                var allNotifications = []
                snapshot.docs.map((docs) => {
                    var notification = doc.data();
                    notification["doc_id"] = doc.id;
                    allNotifications.push(notification);
                    this.setState({ allNotifications: allNotifications });
                })
            })
    }

    componentDidMount() {
        this.getNotification();
    }

    componentWillUnmount() {
        this.notificationRef()
    }

    keyExtractor = (item, index) => index.toString();

    renderItem = ({ item, index }) => {
        return (
            <ListItem
                key={index}
                leftElement={<Icon name="Book" type="font-awesome" color="#696969" />}
                title={item.bookName}
                titleStyle={{ fontWeight: "bold", color: "black" }}
                subtitle={item.message}
                bottomDivider
            />
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{ flex: 0.1 }}>
                    <MyHeader title="Notifications" navigation={this.props.navigation} />
                </View>
                <View style={{ flex: 0.9 }}>
                    {
                        this.state.allNotifications.length === 0
                            ? (
                                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                    <Text style={{ alignSelf: "center", fontSize: 25 }}>You have no notifications!</Text>
                                </View>
                            )
                            : (
                                <SwipeableFlatList allNotifications={this.state.allNotifications} />
                            )
                    }
                </View>
            </View>
        )
    }
}