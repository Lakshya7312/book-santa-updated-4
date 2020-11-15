import React, { Component } from 'react';
import { Text, View, Dimensions, StyleSheet, Animated } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import { SwipeListView } from 'react-native-swipe-list-view';
import firebase from 'firebase';
import db from '../config';

export default class SwipeableFlatList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allNotifications: this.props.allNotifications
        }
    }

    updateMarkAsRead = (notification) => {
        db.collection("all-notifications").doc(notification.doc_id).update({
            "notification_status": "read"
        })
    }

    onSwipeValueChange = (swipeData) => {
        var allNotification = this.state.allNotifications;
        const { key, value } = swipeData;
        if (value < -Dimensions.get('window').width) {
            const newData = [...allNotification];
            const prevIndex = allNotification.findIndex(item => item.key = key);
            this.updateMarkAsRead(allNotification[prevIndex]);
            newData.slice(prevIndex, 1);
            this.setState({ allNotification: newData });
        }
    }

    renderItem = data => {
        <ListItem
            leftElement={<Icon name="book" type="font-awesome" color="#000" />}
            title={data.item.book_name}
            titleStyle={{ color="black", fontWeight: "bold" }}
            subtitle={data.item.message}
            bottomDivider
        />
    }

    renderHiddenItem = () => {
        <View style={styles.rowBack}>
            <View style={styles.backRightButton}>
                <Text style={{ color="#000" }}></Text>
            </View>
        </View>
    }

    render() {
        return (
            <View style={styles.container}>
                <SwipeableFlatList
                    disableRightSwipe
                    data={this.state.allNotifications}
                    renderItem={this.renderItem}
                    renderHiddenItem={this.renderHiddenItem}
                    rightOpenValue={-Dimensions.get('window').width}
                    previewRowKey={"0"}
                    previewOpenValue={"-40"}
                    previewOpenDelay={"3000"}
                    onSwipeValueChange={this.onSwipeValueChange}
                />
            </View>
        )
    }
}