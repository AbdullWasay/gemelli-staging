"use client";

import { useGetSubscriptionPlansQuery } from "@/redux/features/user/subscriptionPlansApi";
import {
  useCreateSubscriptionMutation,
  useGetUserSubscriptionsQuery,
} from "@/redux/features/user/subscriptionsApi";
import { SubscriptionPlanFeatures } from "@/types/api";
import {
  BadgePercent,
  Check,
  CheckCircle,
  Dot,
  LoaderCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Swal from "sweetalert2";

export default function SubscriptionPlanList() {
  const { data, isLoading, isError, error } = useGetSubscriptionPlansQuery();
  const { data: userSubscriptions, isLoading: isLoadingUserSubs } =
    useGetUserSubscriptionsQuery();
  const [createSubscription, { isLoading: isSubscribing }] =
    useCreateSubscriptionMutation();
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);

  // Check if user already has a subscription to a plan
  const hasActivePlan = (planId: string): boolean => {
    if (!userSubscriptions?.data) return false;
    return userSubscriptions.data.some(
      (sub) => sub.subscriptionPlan.id === planId && sub.status === "ACTIVE"
    );
  };

  // Handle subscribe to plan
  const handleSubscribe = async (planId: string) => {
    // Get the plan details before subscribing
    const selectedPlan = data?.data.find((plan) => plan.id === planId);
    const hasActivePlanAlready = userSubscriptions?.data?.some(
      (sub) => sub.status === "ACTIVE"
    );
    const currentActivePlan = userSubscriptions?.data?.find(
      (sub) => sub.status === "ACTIVE"
    )?.subscriptionPlan;

    try {
      setProcessingPlanId(planId);

      // If the user is switching plans, show a confirmation
      if (hasActivePlanAlready && currentActivePlan) {
        // Use SweetAlert2 for a better confirmation dialog
        const result = await Swal.fire({
          title: "Change Subscription Plan?",
          html: `
            <div class="text-left">
              <p>You are about to switch from <b>${currentActivePlan.title}</b> to <b>${selectedPlan?.title}</b>.</p>
              <p class="mt-2">Your current subscription will be canceled immediately.</p>
              <p class="mt-4 text-sm text-gray-500">Any unused time on your current plan will not be refunded or credited.</p>
            </div>
          `,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, switch plan",
          cancelButtonText: "Cancel",
        });

        if (!result.isConfirmed) {
          setProcessingPlanId(null);
          return;
        }
      }

      const response = await createSubscription({
        subscriptionPlanId: planId,
        paymentMethod: "credit_card", // Default payment method
      }).unwrap();

      // Instead of just a toast, show a nicer confirmation with SweetAlert2
      const isSwitch = hasActivePlanAlready;
      const planTitle = selectedPlan?.title || "new plan";

      await Swal.fire({
        title: isSwitch ? "Subscription Updated!" : "Subscription Confirmed!",
        html: `
          <div class="text-center">
            <p>${
              isSwitch
                ? `You have successfully switched to the <b>${planTitle}</b> plan.`
                : `You have successfully subscribed to the <b>${planTitle}</b> plan.`
            }</p>
            <p class="mt-2 text-sm">Your subscription is now active.</p>
            ${
              isSwitch
                ? `<p class="mt-3 text-sm text-gray-500">Your previous plan has been canceled.</p>`
                : ""
            }
          </div>
        `,
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Great!",
      });

      // Still show a toast for secondary confirmation
      toast.success(
        response.message ||
          (isSwitch
            ? `Successfully switched to ${planTitle} plan!`
            : "Successfully subscribed to the plan!")
      );

      // Refresh subscription plans data to update UI
      // This is optional since invalidation tags should handle it
      // but adding as a safety measure
    } catch (err: unknown) {
      console.error("Subscription error:", err);

      let errorMessage = "Failed to subscribe to the plan. Please try again.";
      let errorDetail = "";

      if (err && typeof err === "object") {
        if ("data" in err && err.data && typeof err.data === "object") {
          const data = err.data as { message?: string; error?: string };
          errorMessage = data.message || data.error || errorMessage;
        } else if ("message" in err) {
          errorMessage = String(err.message);
        }

        // Check for specific error messages
        if (errorMessage.includes("Foreign key constraint")) {
          errorMessage = "Authentication error";
          errorDetail =
            "Your session may have expired. Please log out and log in again.";
        }
      }

      // Show an interactive error dialog
      await Swal.fire({
        title: "Subscription Failed",
        html: `
          <div class="text-center">
            <p>${errorMessage}</p>
            ${
              errorDetail
                ? `<p class="mt-2 text-sm text-gray-600">${errorDetail}</p>`
                : ""
            }
          </div>
        `,
        icon: "error",
        confirmButtonColor: "#d33",
        confirmButtonText: "OK",
      });

      // Also show a toast for immediate feedback
      toast.error(errorMessage);
    } finally {
      setProcessingPlanId(null);
    }
  };

  if (isLoading || isLoadingUserSubs) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoaderCircle className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 bg-red-50 text-red-500 rounded-lg">
        <p>Error loading subscription plans: {JSON.stringify(error)}</p>
      </div>
    );
  }

  const subscriptionPlans = data?.data || [];

  if (subscriptionPlans.length === 0) {
    return (
      <div className="p-4 bg-gray-50 text-gray-500 rounded-lg">
        <p>No subscription plans available.</p>
      </div>
    );
  }

  const renderFeaturesList = (
    features: SubscriptionPlanFeatures,
    category: string
  ) => {
    const categoryFeatures = features[category] || [];

    return (
      <div className="mt-4">
        <h5 className="text-base font-medium mb-2">{category}</h5>
        <ul className="space-y-1">
          {categoryFeatures.map((feature, index) => (
            <li
              key={index}
              className="flex items-center text-text-secondary text-sm"
            >
              {!feature.includes(":") && (
                <Dot className="mr-2 text-text-secondary" />
              )}
              <span
                className={
                  feature.includes(":") ? "font-medium text-black" : ""
                }
              >
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="font-poppins">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Subscription Plans</h2>
        <p className="mt-1 text-base text-text-secondary/70 font-medium">
          Scale your business with plans tailored to your needs. Upgrade anytime
          as your store grows.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {subscriptionPlans.map((plan) => {
          const features =
            typeof plan.features === "string"
              ? JSON.parse(plan.features as string)
              : plan.features;

          const isPlanActive = hasActivePlan(plan.id);
          const isProcessing =
            processingPlanId === plan.id ||
            (isSubscribing && processingPlanId === plan.id);

          return (
            <div
              key={plan.id}
              className={`bg-[#F9F9F9] rounded-xl hover:shadow-md transition-shadow ${
                isPlanActive ? "border-2 border-primary" : ""
              }`}
            >
              <div className="p-6">
                {isPlanActive && (
                  <div className="flex items-center justify-end mb-2 text-primary">
                    <CheckCircle size={16} className="mr-1" />
                    <span className="text-xs font-semibold">Current Plan</span>
                  </div>
                )}

                <div className="flex items-center mb-4">
                  <div
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center font-bold text-base ${
                      plan.title === "FREE PLAN"
                        ? "bg-primary text-white"
                        : "bg-text-secondary/20 text-[#3F3F3F]"
                    }`}
                  >
                    <BadgePercent />
                  </div>
                  <span className="font-semibold ml-3 text-lg">
                    {plan.title}
                  </span>
                </div>

                <p className="text-text-secondary font-medium text-base mb-5">
                  {plan.description}
                </p>

                <div className="mb-5">
                  <span className="text-2xl font-semibold">
                    {plan.price} USDT
                  </span>
                  <span className="text-sm font-semibold">
                    /{plan.interval.toUpperCase()}
                  </span>
                </div>

                <button
                  className={`w-full py-4 px-4 rounded-xl mb-7 flex items-center justify-center transition-colors ${
                    isPlanActive
                      ? "bg-green-100 text-green-800 border border-green-300 cursor-default"
                      : plan.title === "FREE PLAN"
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-100"
                  }`}
                  onClick={() =>
                    !isPlanActive && !isProcessing && handleSubscribe(plan.id)
                  }
                  disabled={isPlanActive || isProcessing}
                  title={
                    userSubscriptions?.data?.some(
                      (sub) => sub.status === "ACTIVE"
                    ) && !isPlanActive
                      ? "This will cancel your current subscription plan"
                      : ""
                  }
                >
                  {isProcessing ? (
                    <>
                      <LoaderCircle className="animate-spin mr-2" size={16} />
                      <span>PROCESSING...</span>
                    </>
                  ) : isPlanActive ? (
                    <>
                      <Check className="mr-2" size={16} />
                      <span>CURRENT PLAN</span>
                    </>
                  ) : userSubscriptions?.data?.some(
                      (sub) => sub.status === "ACTIVE"
                    ) ? (
                    `SWITCH TO ${plan.title}`
                  ) : plan.title === "FREE PLAN" ? (
                    "START FOR FREE"
                  ) : (
                    `UPGRADE TO ${plan.title}`
                  )}
                </button>

                {/* Render features by category */}
                {Object.keys(features).map((category) =>
                  renderFeaturesList(features, category)
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
