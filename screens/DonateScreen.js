import React, { Component } from 'react';
import { Flatlist, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import MyHeader from '../components/MyHeader'; //it 
import firebase from 'firebase';
import db from '../config';

export default class DonateScreen extends React.Component {
    constructor() {
        super();
        this.state = {
            requestedBookList: [],
        }
        this.requestRef = null;
    }

    getRequestedBookList = () => {
        this.requestRef = db.collection("book-requests")
            .onSnapshot((snapshot) => {
                var requestedBookList = snapshot.docs.map(document => document.data());
                this.setState({ requestedBookList: requestedBookList })
            })
    }

    componentDidMount() {
        this.getRequestedBookList();
    }

    componentWillUnmount() {
        this.requestRef;
    }

    keyExtractor = (item, index) => index.toString();
    renderItem = ({ item, i }) => {
        return (
            <ListItem
                key={i}
                title={item.book_name}
                subTitle={item.reasonToRequest}
                titleStyle={{ color: "black", fontWeight: "bold" }}
                rightElement={
                    <TouchableOpacity style={styles.viewButton} onPress={() => { this.props.navigation.navigate("ReceiverDetails", { "details": item }) }}>
                        <Text style={styles.viewButtonText}>View</Text>
                    </TouchableOpacity>
                }
                bottomDivider
            />
        )
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <MyHeader title="Donate Book" />
                <View style={{ flex: 1 }}>
                    {this.state.requestedBookList.length === 0
                        ? (
                            <View style={styles.subContainer}>
                                <Text style={{ fontSize: 20 }}>List of all Requested Books</Text>
                            </View>
                        )
                        : (
                            <Flatlist
                                keyExtractor={this.keyExtractor}
                                data={this.state.requestedBookList}
                                renderItem={this.renderItem}
                            />
                        )
                    }
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    viewButton: {
        backgroundColor: "orange",
        width: 100,
        height: 25,
        borderColor: "#fff",
        borderRadius: 10
    },

    viewButtonText: {
        color: "#fff",
        fontSize: 13,
    },

    subContainer: {
        flex: 1
    }
})