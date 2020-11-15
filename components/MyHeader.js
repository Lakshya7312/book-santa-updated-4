import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Header, Icon, Badge } from 'react-native-elements';
import firebase from 'firebase';
import db from '../config';

export default class MyHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: []
        }
    }

    getNumberOfUnreadNotifications() {
        db.collection("all-notifications").where("notification_status", "==", "unread")
            .onSnapshot((snapshot) => {
                var unreadNotification = snapshot.docs.map((doc) => doc.data());
                this.setState({ value: unreadNotification.length })
            })
    }

    componentDidMount() {
        this.getNumberOfUnreadNotifications();
    }

    BellIconWithBadge = (props) => {
        return (
            <View>
                <Icon name="bell" type="font-awesome" color={"#000"} size={25} onPress={props.navigation.navigate("Notification")} />
                <Badge value={this.state.value} containerStyle={{ position: "absolute", top: -4, right: -4 }} />
            </View>
        )
    }

    MyHeader = props => {
        return (
            <Header leftComponent={<Icon name="bars" type="font-awesome" color="#000" onPress={() => { props.navigation.toggleDrawer }} />}
                centerComponent={{ text: props.title, style: { color: "#fff" } }}
                rightComponent={<BellIconWithBadge {...props} />}
            />
        );
    }
}