// components/CategoryChips.jsx
import React from 'react';
import { View, TouchableOpacity, Text, ScrollView } from 'react-native';
import { styles } from '../../assets/styles/home.styles';

const CATEGORIES = ['All', 'Conferences', 'Hackathons', 'Meetups', 'Virtual'];

export default function CategoryChips({ active, onSelect }) {
  return (
    <View style={styles.categoriesWrapperView}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContentContainer}
        style={styles.categoriesWrapper}
      >
        {CATEGORIES.map((category) => {
          const isActive = category === active;
          return (
            <TouchableOpacity
              key={category}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => onSelect(category)}
            >
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {category}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
