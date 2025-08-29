import { Tabs } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabsLayout() {
    return (
        <Tabs>
            <Tabs.Screen
                name="Home"
                options={{
                    title: 'Home',
                    tabBarIcon:() => {<Ionicons size={28} name="home" color='black' /> },
                }}
            />
        </Tabs>
    )
}