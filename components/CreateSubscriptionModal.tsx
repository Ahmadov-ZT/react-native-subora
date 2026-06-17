import { icons } from "@/constants/icons";
import clsx from "clsx";
import dayjs from "dayjs";
import { useCallback, useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";

const CATEGORIES = [
  "Entertainment",
  "AI Tools",
  "Developer Tools",
  "Design",
  "Productivity",
  "Cloud",
  "Music",
  "Other",
] as const;

type Category = (typeof CATEGORIES)[number];

const CATEGORY_COLORS: Record<Category, string> = {
  Entertainment: "#FF6B6B",
  "AI Tools": "#4A90E2",
  "Developer Tools": "#7B68EE",
  Design: "#FFB84D",
  Productivity: "#50C878",
  Cloud: "#87CEEB",
  Music: "#FF69B4",
  Other: "#999999",
};

export interface CreateSubscriptionModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (subscription: Subscription) => void;
}

const CreateSubscriptionModal = ({
  isVisible,
  onClose,
  onSubmit,
}: CreateSubscriptionModalProps) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [frequency, setFrequency] = useState<"Monthly" | "Yearly">("Monthly");
  const [selectedCategory, setSelectedCategory] =
    useState<Category>("Entertainment");

  const [errors, setErrors] = useState<{
    name?: string;
    price?: string;
  }>({});

  const validateForm = useCallback(() => {
    const newErrors: { name?: string; price?: string } = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    const priceNum = parseFloat(price);
    if (!price || isNaN(priceNum) || priceNum <= 0) {
      newErrors.price = "Price must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [name, price]);

  const handleSubmit = useCallback(() => {
    if (!validateForm()) return;

    const now = dayjs();
    const renewalDate =
      frequency === "Monthly" ? now.add(1, "month") : now.add(1, "year");

    const subscription: Subscription = {
      id: `sub_${Date.now()}`,
      name: name.trim(),
      price: parseFloat(price),
      frequency: frequency.toLowerCase() as "monthly" | "yearly",
      category: selectedCategory,
      status: "active",
      startDate: now.toISOString(),
      renewalDate: renewalDate.toISOString(),
      icon: icons.wallet,
      billing: frequency,
      color: CATEGORY_COLORS[selectedCategory],
      currency: "USD",
      paymentMethod: "",
      plan: "",
    };

    onSubmit(subscription);

    // Reset form
    setName("");
    setPrice("");
    setFrequency("Monthly");
    setSelectedCategory("Entertainment");
    setErrors({});

    // Close modal
    onClose();
  }, [
    name,
    price,
    frequency,
    selectedCategory,
    onSubmit,
    onClose,
    validateForm,
  ]);

  const handleClose = useCallback(() => {
    // Reset form when closing
    setName("");
    setPrice("");
    setFrequency("Monthly");
    setSelectedCategory("Entertainment");
    setErrors({});
    onClose();
  }, [onClose]);

  return (
    <Modal
      visible={isVisible}
      presentationStyle="overFullScreen"
      animationType="slide"
      transparent
    >
      <View className="flex-1 bg-black/50">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <Pressable className="flex-1" onPress={handleClose} />

          <View className="modal-container">
            {/* Header */}
            <View className="modal-header">
              <Text className="modal-title">New Subscription</Text>
              <Pressable className="modal-close" onPress={handleClose}>
                <Text className="modal-close-text">X</Text>
              </Pressable>
            </View>

            {/* Body */}
            <ScrollView
              className="modal-body"
              showsVerticalScrollIndicator={false}
            >
              {/* Name Field */}
              <View className="auth-field">
                <Text className="auth-label">Name</Text>
                <TextInput
                  className={clsx(
                    "auth-input",
                    errors.name && "auth-input-error",
                  )}
                  placeholder="e.g., Spotify"
                  value={name}
                  onChangeText={setName}
                  placeholderTextColor="rgba(0, 0, 0, 0.4)"
                />
                {errors.name && (
                  <Text className="text-xs font-sans-medium text-destructive">
                    {errors.name}
                  </Text>
                )}
              </View>

              {/* Price Field */}
              <View className="auth-field">
                <Text className="auth-label">Price ($)</Text>
                <TextInput
                  className={clsx(
                    "auth-input",
                    errors.price && "auth-input-error",
                  )}
                  placeholder="9.99"
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="decimal-pad"
                  placeholderTextColor="rgba(0, 0, 0, 0.4)"
                />
                {errors.price && (
                  <Text className="text-xs font-sans-medium text-destructive">
                    {errors.price}
                  </Text>
                )}
              </View>

              {/* Frequency Toggle */}
              <View>
                <Text className="auth-label mb-2">Frequency</Text>
                <View className="picker-row">
                  <Pressable
                    className={clsx(
                      "picker-option",
                      frequency === "Monthly" && "picker-option-active",
                    )}
                    onPress={() => setFrequency("Monthly")}
                  >
                    <Text
                      className={clsx(
                        "picker-option-text",
                        frequency === "Monthly" && "picker-option-text-active",
                      )}
                    >
                      Monthly
                    </Text>
                  </Pressable>

                  <Pressable
                    className={clsx(
                      "picker-option",
                      frequency === "Yearly" && "picker-option-active",
                    )}
                    onPress={() => setFrequency("Yearly")}
                  >
                    <Text
                      className={clsx(
                        "picker-option-text",
                        frequency === "Yearly" && "picker-option-text-active",
                      )}
                    >
                      Yearly
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* Category Selection */}
              <View>
                <Text className="auth-label mb-2">Category</Text>
                <View className="category-scroll">
                  {CATEGORIES.map((category) => (
                    <Pressable
                      key={category}
                      className={clsx(
                        "category-chip",
                        selectedCategory === category && "category-chip-active",
                      )}
                      onPress={() => setSelectedCategory(category)}
                    >
                      <Text
                        className={clsx(
                          "category-chip-text",
                          selectedCategory === category &&
                            "category-chip-text-active",
                        )}
                      >
                        {category}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Submit Button */}
              <Pressable
                className={clsx(
                  "auth-button mt-6",
                  (!name.trim() || !price) && "auth-button-disabled",
                )}
                onPress={handleSubmit}
                disabled={!name.trim() || !price}
              >
                <Text className="font-sans-bold text-background">
                  Create Subscription
                </Text>
              </Pressable>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default CreateSubscriptionModal;
