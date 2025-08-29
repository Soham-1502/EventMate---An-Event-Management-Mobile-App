// assets/styles/auth.styles.js
import { StyleSheet } from "react-native";
import { defaultTheme as theme } from "../constants/theme.js"; // Your theme.js

export const styles = StyleSheet.create({
  /** ---------- GENERAL CONTAINER STYLES ---------- **/
  container: {
    flex: 1,
    backgroundColor: theme.background,
    paddingHorizontal: 30,
    alignItems:"center",
    justifyContent:"center"
  },
  containerContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },

  /** ---------- IMAGES & HEADINGS ---------- **/
  image: {
    width: 250,
    height: 250,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.primary,
    marginBottom: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: theme.textSecondary || "#555",
    textAlign: "center",
    marginBottom: 15,
  },

  /** ---------- INPUTS ---------- **/
  input: {
    width: "100%",
    padding: 14,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.secondary,
    marginBottom: 15,
    fontSize: 16,
  },

  inputFocused: {
  borderColor: theme.primary,
  borderWidth: 2,
},


  /** ---------- OTP INPUTS ---------- **/
otpContainer: {
  width: "100%",
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: 18,
  paddingHorizontal: 5,
},
otpInput: {
  width: 50,
  height: 60,
  borderRadius: 8,
  backgroundColor: "#fff",
  borderWidth: 1,
  borderColor: theme.secondary,
  textAlign: "center",
  fontSize: 20,
  fontWeight: "700",
},

  /** ---------- BUTTONS ---------- **/
  button: {
    width: "100%",
    padding: 15,
    borderRadius: 10,
    backgroundColor: theme.primary,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  /** ---------- LINKS ---------- **/
  linkContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  linkText: {
    fontSize: 14,
    color: theme.secondary,
    fontWeight: "500",
  },

  /** ---------- VERIFICATION SCREEN ---------- **/
  verificationContainer: {
  flex: 1,
  padding:20,
  backgroundColor: theme.background,
  alignItems: "center",
  justifyContent: "center",
},

verificationTitle: {
  fontSize: 24,
  fontWeight: "bold",
  color: theme.primary,
  textAlign: "center",
  marginBottom:20
},

verificationCodeContainer: {
  flexDirection: "row",
  justifyContent: "center",
  gap:5,
  width: "80%",
  marginBottom:10
},

verificationCodeBox: {
  width: 50,
  height: 50,
  backgroundColor: "#fff",
  borderWidth: 1,
  borderColor: theme.secondary,
  borderRadius: 8,
  textAlign: "center",
  fontSize: 18,
  fontWeight: "bold",
},

verificationCodeBoxFocused: {
  borderColor: theme.primary,
  borderWidth: 2,
},

verificationExpireText: {
  color: theme.primary,
  fontSize:16,
  marginBottom:10,
  textAlign:'center',
  lineHeight:25
},

verificationButton: {
  backgroundColor: theme.primary,
  paddingVertical: 12,
  paddingHorizontal: 25,
  borderRadius: 12,
  alignItems: "center",
},

verificationButtonText: {
  color: "#fff",
  fontSize: 20,
  fontWeight: "bold",
},

 /** ---------- ERROR MESSAGE BOX ---------- **/
errorBox: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between", // Left group and close icon stay apart
  width: "100%",
  paddingVertical: 10,
  paddingHorizontal: 12,
  backgroundColor: "#ffdddd",
  borderLeftWidth: 4,
  borderLeftColor: "#ff4d4d",
  borderRadius: 6,
  marginBottom: 15,
  flexShrink: 1,
},

verifyErrorBox: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between", // Left group and close icon stay apart
  maxWidth:"87%",
  width:"100%",
  paddingVertical: 10,
  paddingHorizontal: 12,
  backgroundColor: "#ffdddd",
  borderLeftWidth: 4,
  borderLeftColor: "#ff4d4d",
  borderRadius: 6,
  marginHorizontal: 10,
  flexShrink: 1,
},

errorLeft: {
  flexDirection: "row",
  alignItems: "center",
  gap: 8, // Space between alert icon and text
  flexShrink: 1, // Allow text to wrap
  paddingRight: 5
},

errorText: {
  color: "#b30000",
  fontSize: 14,
  flexShrink: 1, // Prevents overflow
},

/** ---------- CONTINUE WITH GOOGLE ---------- **/
googleButton: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#fff",
  borderWidth: 1,
  borderColor: "#ddd",
  borderRadius: 10,
  paddingVertical: 12,
  paddingHorizontal: 15,
  width: "100%",
  marginTop: 10,
  shadowColor: "#000",
  shadowOpacity: 0.05,
  shadowRadius: 4,
  elevation: 2, // Android shadow
},
googleIcon: {
  width: 20,
  height: 20,
  marginRight: 10,
},
googleButtonText: {
  fontSize: 16,
  color: "#444",
  fontWeight: "500",
},

// Profile Page
profileImageContainer: {
  width: 140,
  height: 140,
  borderRadius: 70,
  backgroundColor: '#f0f0f0',
  justifyContent: 'center',
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.15,
  shadowRadius: 6,
  elevation: 6, // for Android shadow
  position: 'relative',
  marginBottom: 20,
},

profileImage: {
  width: 140,
  height: 140,
  borderRadius: 70,
  resizeMode: 'cover',
},

cameraButton: {
  position: 'absolute',
  bottom: 0,
  right: 0,
  backgroundColor: '#4a90e2',
  width: 44,
  height: 44,
  borderRadius: 22,
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: 2,
  borderColor: '#fff',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 3,
  elevation: 8,
},
cameraIcon: {
  color: '#fff',
  fontSize: 24,
},


  /** ---------- REUSABLE BOX CONTAINERS ---------- **/
  sectionBox: {
    width: "100%",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.primary,
    marginBottom: 10,
  },
});
