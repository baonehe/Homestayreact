import React from 'react';
import { Text, View, StyleSheet, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';

import Icon from 'react-native-vector-icons/MaterialIcons';

import colors from '../assets/consts/colors';
import sizes from '../assets/consts/sizes';



const DetailsReward = ({ navigation, route }) => {
    const reward = route.params;
    console.log(reward);

    const ListItem = ({ children }) => (
        <View style={{flexDirection: 'row', marginBottom: 15}}>
          <Text style={{ fontSize: 16, justifyContent: 'space-between', marginTop: 10, color: colors.black, fontFamily:'Inter-Regular' }}>•</Text>
          <Text style={{ width: '85%', fontSize: 18, color:colors.black, marginTop: 10 }}>{children}</Text>
        </View>
      );

    return (
        <SafeAreaView style={styles.containers}>
            <ImageBackground style={styles.headerImage} source={reward.image}>
                    <Icon style={styles.header}
                        name="arrow-back-ios"
                        size={sizes.iconExtraSmall}
                        color={colors.white}
                        onPress={navigation.goBack}
                    />
            </ImageBackground>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.container}
                scrollEnabled={true}
                bounces={true}>
                    <Text style={styles.rw_title}>{reward.title}</Text>
                    <ListItem> Chúc mừng bạn đã nhận được
                        <Text style={styles.rw_saleoff}> Coupon {reward.sale_off}</Text>
                    </ListItem>
                    <ListItem> Thời gian áp dụng:
                        <Text style={styles.rw_saleoff}> {reward.date_start} - {reward.date_end}</Text>
                    </ListItem>
                    <ListItem> Áp dụng đặt phòng <Text style={styles.rw_saleoff}> Theo Giờ</Text></ListItem>
                    <ListItem> Thời gian đặt phòng: <Text style={styles.rw_saleoff}> Từ Thứ 2 đến Chủ Nhật</Text></ListItem>
                    <ListItem> Chỉ áp dụng cho người dùng nhận được thông báo</ListItem>
                    <ListItem> Coupon có thể hết hạn sớm khi hết ngân sách khuyến mãi</ListItem>
                    <ListItem> Coupon không được quy đổi thành tiền mặt, không được phép chuyển nhượng dưới bất kỳ hình thức nào</ListItem>
                    <ListItem> Stelio có quyền từ chối  trả phí khuyến mãi nếu phát hiện gian lận hoặc vi phạm các điều khoản của chương trình khuyến mãi này.</ListItem>
                    <ListItem> Coupon có thể hết hạn sớm khi hết ngân sách khuyến mãi</ListItem>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    containers: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
    },
    container: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    headerImage: {
        width: '100%',
        height: 'auto',
        overflow: 'hidden',
    },
    header: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        marginVertical: 150,
    },
    rw_title:{
        fontSize: 25,
        fontFamily: 'Inter-Medium',
        textAlign: 'center',
        color: colors.primary,
        marginTop: 10,
    },
    rw_saleoff:{
        fontSize: 18,
        fontFamily: 'Inter-SemiBold',
        textAlign: 'center',
        color: colors.dark,
    },
});

export default DetailsReward;
