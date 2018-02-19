import React, { Component } from 'react';
import { StyleSheet, View, ImageBackground, Platform, Text, Dimensions } from 'react-native';
import { List, ListItem } from 'react-native-elements';
import { connect } from 'react-redux';


import { GetStyle } from './../styling/Themes';
import CurrTheme from './../styling/CurrentTheme';
import { fake } from './OverviewExampleData'
import { moderateScale, verticalScale, roundNumber } from './../helpers/General';
import CurrFont from './../styling/CurrentFont';

const defaultFont = CurrFont+'-regular';
const defaultFontBold = CurrFont+'-bold';
const theme = GetStyle(CurrTheme);

@connect(
    state => ({
        currentData: state.data.currentData,
        totals: state.data.currentTotals,
        windSpeed: state.data.windSpeed,
        windRatio: state.data.windRatio,
        loading: state.loading,
        turbine: state.turbine,
    }),
)

export default class Windmill extends Component {
    constructor(props) {
        super(props);
    }

    fetchData = () => {
        var rightTitles = new Array(4);
        rightTitles[0] = this.props.windRatio["percentage"] + "%";
        rightTitles[1] = this.props.windSpeed + " mps";
        rightTitles[2] = roundNumber(this.props.totals.turbine.generation) + " kWh";
        rightTitles[3] = roundNumber(this.props.totals.turbine.consumption) + " kWh";
        return rightTitles;
    }

    render() {
        const { width, height } = Dimensions.get('window');
        const { currentData, totals, windSpeed, windRatio, turbine } = this.props;
        var rightTitles = this.fetchData();
        var padding = '5%';

        if (height < 600) {
            padding = '4%';
        }

        return (
            <View style={[styles.main, { position: 'absolute', bottom: 0}]}>
                <ImageBackground source={require('./../assets/windmillFull.png')}
                    resizeMode="cover"
                    style={[{ width: width + 5, height: width*.8}, styles.image, styles.head]}>
                <Text style={[styles.units, theme.fontRegular]}>
                    Currently generating
                </Text>
                <Text style={[styles.number, theme.fontBold]}>
                    {roundNumber(totals.turbine.generation)}
                </Text>
                <Text style={[styles.units, theme.fontRegular]}>
                    kWh
                </Text>
                </ImageBackground>
                <List style={[styles.list]}>
                  {
                    fake.map((item, i) => (
                      <ListItem
                        containerStyle={[ styles.listItem, { paddingTop: padding, paddingBottom: padding }]}
                        key={i}
                        title={item.title}
                        rightTitle={rightTitles[item.index]}
                        rightTitleStyle={{ color: '#647C92' }}
                        rightTitleContainerStyle={{ flex: 0.75 }}
                        hideChevron={true}
                        fontFamily={defaultFontBold}
                        leftIcon={{name: item.icon, type: item.type, color: '#647C92'}}
                      />
                    ))
                  }
                </List>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    textContainer: {
        marginLeft: '2%',
        marginTop: '15%',
        width: moderateScale(320),
        justifyContent: 'center',
        alignItems: 'center'
    },
    number: {
        fontSize: moderateScale(70),
        backgroundColor: 'transparent',
        color: 'white',
    },
    units: {
        fontSize: moderateScale(20),
        backgroundColor: 'transparent',
        color: 'white',
    },
    image: {
        alignItems: 'center',
        justifyContent: 'center',
        left: '-1%',
        top: '-3%'
    },

    main: {
        backgroundColor: '#E1E8EE',
    },
    head: {
        ...Platform.select({
            android: {
                height: verticalScale(290),
                top: '-5%'
            }
        })
    },
    list: {
//        borderTopColor: "#FFFFFF",
//        borderTopWidth: 1,
        marginTop: '-3%',
        backgroundColor: '#E1E8EE',
        ...Platform.select({
            ios: {
                paddingTop: '0%',
            }
        })
    },

    listItem: {
        backgroundColor: '#E1E8EE',
        paddingTop: '4%',
        paddingBottom: '4%',
        paddingRight: '4%',
        borderBottomColor: '#FFFFFF',
        borderBottomWidth: 1,

    },

})