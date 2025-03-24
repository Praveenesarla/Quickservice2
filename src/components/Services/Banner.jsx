import React, { useRef, useState, useEffect } from 'react';
import { View, Image, FlatList, Dimensions, StyleSheet } from 'react-native';

const banners = [
    { id: 1, image: require('../../assets/offers/image1.png') },
    { id: 2, image: require('../../assets/offers/image2.png') },
    { id: 3, image: require('../../assets/offers/image3.png') },
];

const { width } = Dimensions.get('window');

const BannerSwiper = () => {
    const flatListRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            let nextIndex = (currentIndex + 1) % banners.length;
            setCurrentIndex(nextIndex);
            flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
        }, 3000); // Change every 3 seconds

        return () => clearInterval(interval);
    }, [currentIndex]);

    return (
        <FlatList
            ref={flatListRef}
            data={banners}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <View style={styles.slide}>
                    <Image source={item.image} style={styles.image} resizeMode="contain" />
                </View>
            )}
        />
    );
};

const styles = StyleSheet.create({
    slide: { width, height: 200, justifyContent: 'center', alignItems: 'center' },
    image: { width: '100%', height: '100%', borderRadius: 10 },
});

export default BannerSwiper;