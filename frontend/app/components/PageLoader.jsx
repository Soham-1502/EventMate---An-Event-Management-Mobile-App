import { View, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { styles } from "../../assets/styles/home.styles";

const PageLoader = () => {
 const [show, setShow] = useState(true);

 useEffect(() => {
   const timer = setTimeout(() => setShow(false), 2500);
   return () => clearTimeout(timer);
 }, []);

 if (!show) return null;

 return (
   <View style={styles.loadingContainer}>
     <ActivityIndicator size={'large'} style={styles.loadingIcon} />
   </View>
 );
};

export default PageLoader;