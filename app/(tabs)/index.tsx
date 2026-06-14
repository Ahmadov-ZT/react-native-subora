import images from "@/constants/images";
import "@/global.css";
import { styled } from "nativewind";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
// 1. IMPORT BOTH UPCOMING_SUBSCRIPTIONS AND HOME_SUBSCRIPTIONS
import ListHeading from "@/components/ListHeading";
import SubscriptionCard from "@/components/SubscriptionCard";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import {
    HOME_BALANCE,
    HOME_SUBSCRIPTIONS,
    UPCOMING_SUBSCRIPTIONS,
} from "@/constants/data";
import { icons } from "@/constants/icons";
import { formatCurrency } from "@/lib/utils";
import { useUser } from "@clerk/expo";
import dayjs from "dayjs";
import { usePostHog } from "posthog-react-native";
import { useState } from "react";

const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  const { user } = useUser();
  const posthog = usePostHog();
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
    string | null
  >(null);

  // This handles your "All Subscriptions" list
  const subscriptions = HOME_SUBSCRIPTIONS;

  // 2. ASSIGN THE DEDICATED UPCOMING DATA DIRECTLY
  // This perfectly matches the type expected by UpcomingSubscriptionCard (including daysLeft)
  const upcomingSubscriptions = UPCOMING_SUBSCRIPTIONS;

  const handleSubscriptionPress = (item: any) => {
    posthog.capture("subscription_card_pressed", {
      subscription_id: item.id,
      subscription_name: item.name,
    });
    setExpandedSubscriptionId((currentId) =>
      currentId === item.id ? null : item.id,
    );
  };

  const handleUpcomingSubscriptionPress = (item: any) => {
    posthog.capture("upcoming_subscription_pressed", {
      subscription_id: item.id,
      subscription_name: item.name,
    });
  };

  const handleListHeadingPress = (section: string) => {
    posthog.capture("list_heading_pressed", { section });
  };

  const handleAddIconPress = () => {
    posthog.capture("home_add_icon_pressed");
  };

  const displayName =
    user?.firstName ||
    user?.fullName ||
    user?.emailAddresses[0]?.emailAddress ||
    "User";

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <FlatList
        ListHeaderComponent={() => (
          <>
            <View className="home-header">
              <View className="home-user">
                <Image
                  source={
                    user?.imageUrl ? { uri: user.imageUrl } : images.avatar
                  }
                  className="home-avatar"
                />
                <Text className="home-user-name">{displayName}</Text>
              </View>

              <Pressable onPress={handleAddIconPress}>
                <Image source={icons.add} className="home-add-icon" />
              </Pressable>
            </View>

            <View className="home-balance-card">
              <Text className="home-balance-label">Balance</Text>

              <View className="home-balance-row">
                <Text className="home-balance-amount">
                  {formatCurrency(HOME_BALANCE.amount)}
                </Text>
                <Text className="home-balance-date">
                  {dayjs(HOME_BALANCE.nextRenewalDate).format("MM/DD")}
                </Text>
              </View>
            </View>

            <View className="mb-5">
              <ListHeading
                title="Upcoming"
                onPress={() => handleListHeadingPress("upcoming")}
              />

              <FlatList
                data={upcomingSubscriptions}
                renderItem={({ item }) => (
                  <UpcomingSubscriptionCard
                    {...item}
                    onPress={() => handleUpcomingSubscriptionPress(item)}
                  />
                )}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={
                  <Text className="home-empty-state">
                    No upcoming renewals yet.
                  </Text>
                }
              />
            </View>

            <ListHeading
              title="All Subscriptions"
              onPress={() => handleListHeadingPress("all_subscriptions")}
            />
          </>
        )}
        data={subscriptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedSubscriptionId === item.id}
            onPress={() => handleSubscriptionPress(item)}
          />
        )}
        extraData={expandedSubscriptionId}
        ItemSeparatorComponent={() => <View className="h-4" />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text className="home-empty-state">No subscriptions yet.</Text>
        }
        contentContainerClassName="pb-30"
      />
    </SafeAreaView>
  );
}
