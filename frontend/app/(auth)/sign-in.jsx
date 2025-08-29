import { useSignIn, useSSO } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { Text, TextInput, TouchableOpacity, View, Image } from 'react-native';
import React, { useState } from 'react';
import { styles } from "../../assets/styles/auth.styles.js";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Ionicons } from '@expo/vector-icons';

export default function SignInScreen() {
  const { signIn, setActive } = useSignIn();
  const { startSSOFlow } = useSSO();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState(null);

  // Email/Password Sign In
  const onSignInPress = async () => {

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace('/');
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      console.log(err);
      if (err.errors?.[0]?.code === "form_identifier_not_found") {
        setError("No account found with this email.");
      } else if (err.errors?.[0]?.code === "form_password_incorrect") {
        setError("Incorrect password. Please try again.");
      } else if (err.errors?.[0]?.code === "form_param_nil") {
        setError("Password cannot be empty!");
      } else {
        setError("Unable to sign in. Please try again later.");
      }
    }
  };

  // Google Sign In
  const onGooglePress = async () => {
    try {
      const { createdSessionId, setActive: setActiveSession } = await startSSOFlow({
        strategy: 'oauth_google',
      });
      if (createdSessionId) {
        await setActiveSession({ session: createdSessionId });
        router.replace('/');
      }
    } catch (err) {
      console.error("Google SSO Error", err);
      setError("Unable to sign in with Google. Please try again.");
    }
  };

  return (
    
    <KeyboardAwareScrollView
      style={{
        flex: 1,
        backgroundColor: styles.container.backgroundColor,
        paddingHorizontal: styles.container.paddingHorizontal,
      }}
      contentContainerStyle={{
        flexGrow: 1,
        alignItems: styles.container.alignItems,
        justifyContent: styles.container.justifyContent,
      }}
      enableOnAndroid
      enableAutomaticScroll
      keyboardShouldPersistTaps="handled"
    >
      {/* Illustration */}
      <Image
        source={require("../../assets/images/sign-in/sign-in-illustration.png")}
        style={styles.image}
      />

      <Text style={styles.title}>Sign In</Text>

      {error ? (
        <View style={styles.errorBox}>
          <View style={styles.errorLeft}>
            <Ionicons name="alert-circle" size={20} color="red" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
          <TouchableOpacity onPress={() => setError("")}>
            <Ionicons name="close-circle" size={20} color="red" />
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Email Input */}
      <TextInput
        style={[
          styles.input,
          focusedField === "email" && styles.inputFocused
        ]}
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        onChangeText={setEmailAddress}
        onFocus={() => setFocusedField("email")}
        onBlur={() => setFocusedField(null)}
      />

      {/* Password Input */}
      <TextInput
        style={[
          styles.input,
          focusedField === "password" && styles.inputFocused
        ]}
        value={password}
        placeholder="Enter password"
        secureTextEntry
        onChangeText={setPassword}
        onFocus={() => setFocusedField("password")}
        onBlur={() => setFocusedField(null)}
      />

      {/* Email/Password Button */}
      <TouchableOpacity style={styles.button} onPress={onSignInPress}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>

      {/* OR Divider */}
      <Text style={{ marginVertical: 10, fontSize: 14, color: "#777" }}>OR</Text>

      {/* Google Sign In Button */}
      <TouchableOpacity style={styles.googleButton} onPress={onGooglePress}>
  <Image
    source={require("../../assets/logo/google.png")}
    style={styles.googleIcon}
  />
  <Text style={styles.googleButtonText}>Continue with Google</Text>
</TouchableOpacity>


      {/* Sign Up Link */}
      <View style={styles.linkContainer}>
        <Text style={{ fontSize: 14, color: "#555" }}>Don't have an account? </Text>
        <Link href="/sign-up">
          <Text style={styles.linkText}>Sign up</Text>
        </Link>
      </View>
    </KeyboardAwareScrollView>
  );
}
