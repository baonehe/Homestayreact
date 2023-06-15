import React from 'react';
import {Text, View, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import colors from '../../assets/consts/colors';
import vouchers from '../../assets/data/vouchers';
import hotels from '../../assets/data/hotels';

import Icon from 'react-native-vector-icons/Ionicons';

const Rewards = ({navigation}) => {
  const findDataById = async id => {
    for (let i = 0; i < hotels.length; i++) {
      if (hotels[i].id === id.toString()) {
        return hotels[i];
      }
    }
  };
  const VoucherCard = ({voucher}) => {
    const handlePress = async () => {
      if (voucher.hasOwnProperty('id_hotel')) {
        const homestay = await findDataById(voucher.id_hotel);
        navigation.navigate('DetailHomestay', homestay);
      } else {
        navigation.navigate('DetailsReward', voucher);
      }
    };
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('DetailsReward', voucher)}>
        <View style={styles.voucherCard}>
          <View style={styles.voucher_title}>
            <View style={styles.voucher_name}>
              <Text style={styles.txt_name}>{voucher.name}</Text>
            </View>
            <Text style={styles.voucher_quantity}>{voucher.quantity}x</Text>
          </View>
          <View style={styles.voucher_content}>
            <View style={styles.voucher_saleoff}>
              <Text style={styles.txt_saleoff}>{voucher.sale_off}</Text>
              <Text style={styles.txt_date}>
                {voucher.date_start} ~ {voucher.date_end}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.useTouch}
              onPress={() => handlePress()}>
              <Text style={styles.txt_use}>DÙNG</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.voucher_notice}>
            <Icon
              name="md-information-circle-sharp"
              size={20}
              color={colors.primary}
            />
            <Text style={styles.txt_notice}>{voucher.notice}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>REWARDS</Text>
      </View>
      <FlatList
        data={vouchers}
        vertical
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatList}
        renderItem={({item}) => <VoucherCard voucher={item} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: colors.white,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Inter-Bold',
    fontSize: 30,
    color: colors.dark,
  },
  flatList: {
    marginTop: 8,
    paddingLeft: 20,
    paddingHorizontal: 10,
    paddingBottom: 120,
  },
  voucherCard: {
    height: 200,
    width: '90%',
    backgroundColor: colors.white,
    elevation: 15,
    marginHorizontal: 10,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.gray,
  },
  voucher_title: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  voucher_name: {
    width: '83%',
    borderTopLeftRadius: 8,
    backgroundColor: colors.dark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txt_name: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
    color: colors.lightwhite,
  },
  voucher_quantity: {
    width: '17%',
    borderTopRightRadius: 8,
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    color: colors.lightwhite,
    backgroundColor: colors.primary,
    textAlign: 'center',
    justifyContent: 'center',
  },
  voucher_content: {
    flex: 5,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  voucher_saleoff: {
    width: '83%',
    borderRightWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.gray,
    fontFamily: 'Lato-Bold',
  },
  txt_saleoff: {
    fontSize: 26,
    fontFamily: 'Inter-SemiBold',
    color: colors.black,
    marginTop: 10,
    marginLeft: 20,
  },
  txt_date: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginTop: 30,
    marginLeft: 20,
  },
  useTouch: {
    width: '17%',
    fontSize: 20,
    fontFamily: 'Inter-Regular',
    justifyContent: 'center',
  },
  txt_use: {
    color: colors.primary,
    fontSize: 14,
    fontFamily: 'Inter-ExtraBold',
    textAlign: 'center',
  },
  voucher_notice: {
    height: 'auto',
    flexDirection: 'row',
    backgroundColor: '#cfe8ef',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  txt_notice: {
    fontFamily: 'Inter-Semibold',
    color: colors.primary,
    marginLeft: 3,
  },
});

export default Rewards;
