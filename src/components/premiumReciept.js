import { Alert, Linking } from "react-native";

export const showPartialReceiptAlert = (trxNo) => {
  Alert.alert(
    "Receipt Available",
    "Partial payment completed. Would you like to download the receipt?",
    [
      { text: "No", style: "cancel" },
      {
        text: "Download",
        onPress: () => {
          const url = `http://103.155.184.108/api/policy/short-pr-receipt/${trxNo}`;
          Linking.openURL(url);
        },
      },
    ]
  );
};
