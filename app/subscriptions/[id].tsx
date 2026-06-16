import { Link, useLocalSearchParams } from "expo-router";
import { usePostHog } from "posthog-react-native";
import React from "react";
import { Pressable, Text, View } from "react-native";

const SubscriptionDetails = () => {
  const posthog = usePostHog();
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View>
      <Text>Subscription Details: {id}</Text>
      <Link href="/" asChild>
        <Pressable
          onPress={() => posthog.capture("subscription_details_go_back")}
        >
          <Text>Go Back</Text>
        </Pressable>
      </Link>
    </View>
  );
};
export default SubscriptionDetails;
