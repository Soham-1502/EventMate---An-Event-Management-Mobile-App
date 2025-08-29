import { useState, useRef } from 'react';
import { Text, TextInput, TouchableOpacity, View, Image } from 'react-native';
import { useSignUp, useSSO } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { styles } from "../../assets/styles/auth.styles.js";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Ionicons } from '@expo/vector-icons';


export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { startSSOFlow } = useSSO();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState(null);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [focusedIndex, setFocusedIndex] = useState(null);
  const otpRefs = useRef([]);

  const onSignUpPress = async () => {
    if (!isLoaded) return;
    try {
      await signUp.create({ emailAddress, password });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err) {
      if (err.errors?.[0].code === "form_identifier_exists") {
        setError("This email is already registered. Please Log In");
      } else if (err.errors?.[0].code === "form_param_format_invalid") {
        setError("Email Address must be a valid email address.");
      } else {
        setError("An error occurred. Please try Again Later!");
      }
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;
    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({ code });
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace('/');
      }
    } catch (err) {
      if (err.errors?.[0]?.code === "verification_expired") {
        console.log("verification Expired");
        setError("Verification Expired");
      }
    }
  };

  // Google SignUp
  const onGoogleSignUp = async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: 'oauth_google',
      });
      await setActive({ session: createdSessionId });
      router.replace('/');
    } catch (err) {
      console.error("Google Sign Up Error:", err);
      setError("Google Sign Up failed. Please try again.");
    }
  };

  if (pendingVerification) {
  return (
    <View style={styles.verificationContainer}>
      <Text style={styles.verificationTitle}>Verify Your Email</Text>
      
      {error ? (
        <View style={styles.verifyErrorBox}>
          <View style={styles.errorLeft}>
            <Ionicons name="alert-circle" size={20} color="red" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
          <TouchableOpacity onPress={() => setError("")}>
            <Ionicons name="close-circle" size={20} color="red" />
          </TouchableOpacity>
        </View>
      ) : null}

      <View style={styles.verificationCodeContainer}>
        {otp.map((digit, idx) => (
  <TextInput
    key={idx}
    ref={(ref) => (otpRefs.current[idx] = ref)}
    style={[
      styles.verificationCodeBox,
      focusedIndex === idx && styles.verificationCodeBoxFocused
    ]}
    value={digit}
    keyboardType="number-pad"
    maxLength={1}
    onChangeText={(text) => {
      const newOtp = [...otp];
      newOtp[idx] = text;
      setOtp(newOtp);

      if (text && idx < otp.length - 1) {
        // Move to next box if input is not empty
        otpRefs.current[idx + 1]?.focus();
      }
    }}
    onKeyPress={({ nativeEvent }) => {
      if (nativeEvent.key === "Backspace") {
        if (!otp[idx] && idx > 0) {
          // If current is empty, move back
          otpRefs.current[idx - 1]?.focus();
        }
      }
    }}
    onFocus={() => setFocusedIndex(idx)}
    onBlur={() => setFocusedIndex(null)}
  />
))}

      </View>

      {/* Resend Code For verification  */}
      {/* <Text style={styles.verificationExpireText}>Verification Code expires in 10 seconds. Resend Code</Text> */}
      
      <TouchableOpacity
        style={styles.verificationButton}
        onPress={() => {
          const code = otp.join("");
          setCode(code);
          onVerifyPress();
        }}
      >
        <Text style={styles.verificationButtonText}>Verify</Text>
      </TouchableOpacity>
    </View>
  );
}

    console.log("sign up page");


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
      <Image
        source={require("../../assets/images/login/login-illustration.png")}
        style={styles.image}
      />

      <Text style={styles.title}>Create Account</Text>

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

      <TextInput
        style={[styles.input, focusedField === "email" && styles.inputFocused]}
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        onChangeText={setEmailAddress}
        onFocus={() => setFocusedField("email")}
        onBlur={() => setFocusedField(null)}
      />

      <TextInput
        style={[styles.input, focusedField === "password" && styles.inputFocused]}
        value={password}
        placeholder="Enter password"
        secureTextEntry
        onChangeText={setPassword}
        onFocus={() => setFocusedField("password")}
        onBlur={() => setFocusedField(null)}
      />

      <TouchableOpacity style={styles.button} onPress={onSignUpPress}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>

      {/* Google Button */}
      <TouchableOpacity style={styles.googleButton} onPress={onGoogleSignUp}>
        <Image
          source={require("../../assets/logo/google.png")}
          style={styles.googleIcon}
        />
        <Text style={styles.googleButtonText}>Continue with Google</Text>
      </TouchableOpacity>

      <View style={styles.linkContainer}>
        <Text style={{ fontSize: 14, color: "#555" }}>Already have an account? </Text>
        <Link href="/sign-in">
          <Text style={styles.linkText}>Sign in</Text>
        </Link>
      </View>
    </KeyboardAwareScrollView>
  );
}
