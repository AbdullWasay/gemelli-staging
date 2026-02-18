"use client";

import Heading from "@/components/ui/Heading/Heading";
import { useGetSubscriptionPlansQuery } from "@/redux/features/user/subscriptionPlansApi";
import {
  useGetUserSubscriptionsQuery,
  useCreateSubscriptionMutation,
} from "@/redux/features/user/subscriptionsApi";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, CheckCircle, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import Swal from "sweetalert2";

export default function SubscriptionManagement() {
  const { data: plansData, isLoading: isLoadingPlans } =
    useGetSubscriptionPlansQuery();
  const { data: subscriptionsData, isLoading: isLoadingSubscriptions } =
    useGetUserSubscriptionsQuery();
  const [createSubscription, { isLoading: isSubscribing }] =
    useCreateSubscriptionMutation();
  const [isUpgrading, setIsUpgrading] = useState(false);

  // Get the active subscription and its details
  const activeSubscription = subscriptionsData?.data?.find(
    (sub) => sub.status === "ACTIVE"
  );
  const activePlan = activeSubscription?.subscriptionPlan;

  // Sort plans by price to determine upgrade path
  const sortedPlans = plansData?.data
    ? [...plansData.data].sort((a, b) => a.price - b.price)
    : [];

  // Find the next plan for upgrade
  const currentPlanIndex = sortedPlans.findIndex(
    (plan) => plan.id === activePlan?.id
  );
  const nextPlan =
    currentPlanIndex !== -1 && currentPlanIndex < sortedPlans.length - 1
      ? sortedPlans[currentPlanIndex + 1]
      : null;

  // Format date for display
  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Handle upgrade to next plan
  const handleUpgrade = async () => {
    if (!nextPlan) return;

    setIsUpgrading(true);

    try {
      // Confirm upgrade with user
      const result = await Swal.fire({
        title: "Upgrade Subscription?",
        html: `
          <div class="text-left">
            <p>You are about to upgrade from <b>${
              activePlan?.title || "Free Plan"
            }</b> to <b>${nextPlan.title}</b>.</p>
            <p class="mt-2">Your current subscription will be canceled immediately.</p>
            <p class="mt-4 text-sm text-gray-500">Your new plan will be activated immediately.</p>
          </div>
        `,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, upgrade plan",
        cancelButtonText: "Cancel",
      });

      if (!result.isConfirmed) {
        setIsUpgrading(false);
        return;
      }

      // Process the upgrade
      await createSubscription({
        subscriptionPlanId: nextPlan.id,
        paymentMethod: "credit_card", // Default payment method
      }).unwrap();

      // Show success message
      await Swal.fire({
        title: "Subscription Upgraded!",
        html: `
          <div class="text-center">
            <p>You have successfully upgraded to the <b>${nextPlan.title}</b> plan.</p>
            <p class="mt-2 text-sm">Your new subscription is now active.</p>
            <p class="mt-3 text-sm text-gray-500">Your previous plan has been canceled.</p>
          </div>
        `,
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Great!",
      });

      toast.success(`Successfully upgraded to ${nextPlan.title}!`);
    } catch (err: unknown) {
      console.error("Subscription upgrade error:", err);

      let errorMessage =
        "Failed to upgrade your subscription. Please try again.";
      let errorDetail = "";

      if (err && typeof err === "object") {
        if ("data" in err && err.data && typeof err.data === "object") {
          const data = err.data as { message?: string; error?: string };
          errorMessage = data.message || data.error || errorMessage;
        } else if ("message" in err) {
          errorMessage = String(err.message);
        }

        if (errorMessage.includes("Foreign key constraint")) {
          errorMessage = "Authentication error";
          errorDetail =
            "Your session may have expired. Please log out and log in again.";
        }
      }

      await Swal.fire({
        title: "Upgrade Failed",
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

      toast.error(errorMessage);
    } finally {
      setIsUpgrading(false);
    }
  };

  // Loading state
  if (isLoadingPlans || isLoadingSubscriptions) {
    return (
      <div className="bg-gray-50 p-6">
        <Heading className="!text-[16px] mb-6 !mt-0 sm:!text-[18px]">
          Subscriptions & Plans
        </Heading>
        <div className="w-full rounded-lg p-6 border flex justify-center items-center h-64">
          <LoaderCircle className="animate-spin text-primary" size={32} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-0 sm:p-6">
      <Heading className="!text-[16px] mb-6 !mt-0 sm:!text-[18px]">
        Subscriptions & Plans
      </Heading>
      <div className="w-full rounded-lg p-2 sm:p-6 border">
        {/* Active Plan Section */}
        <h2 className="text-[16px] font-poppins font-semibold text-black mb-4 sm:text-[18px]">
          Active Plan
        </h2>

        <div className="flex flex-col sm:flex-row justify-between items-start w-full bg-white rounded-lg p-4 sm:p-6 gap-4 sm:gap-0">
          <div className="w-full sm:w-auto">
            {activePlan ? (
              <>
                <div className="flex items-center">
                  <p className="font-semibold text-[#0F0F0F] text-[14px] sm:text-[15px] font-poppins">
                    {activePlan.title}
                  </p>
                  <CheckCircle className="ml-2 text-green-500" size={16} />
                </div>
                <p className="text-[14px] sm:text-[15px] font-medium font-poppins text-text-secondary mt-2">
                  Billed{" "}
                  {activePlan.interval === "month"
                    ? "Monthly"
                    : activePlan.interval === "year"
                    ? "Yearly"
                    : "Per " + activePlan.interval}
                </p>
                <p className="text-[14px] sm:text-[15px] font-medium font-poppins text-text-secondary mt-2 flex items-center">
                  <Calendar className="mr-2" size={14} />
                  Start Date: {formatDate(activeSubscription?.startDate)}
                </p>
                {activeSubscription?.endDate && (
                  <p className="text-[14px] sm:text-[15px] font-medium font-poppins text-text-secondary mt-2 flex items-center">
                    <Calendar className="mr-2" size={14} />
                    Renewal Date:{" "}
                    {formatDate(
                      activeSubscription.nextBillingDate ||
                        activeSubscription.endDate
                    )}
                  </p>
                )}
              </>
            ) : (
              <>
                <p className="font-semibold text-[#0F0F0F] text-[14px] sm:text-[15px] font-poppins">
                  No Active Subscription
                </p>
                <p className="text-[14px] sm:text-[15px] font-medium font-poppins text-text-secondary mt-2">
                  You are currently using the free version
                </p>
                <p className="text-[14px] sm:text-[15px] font-medium font-poppins text-text-secondary mt-2">
                  Upgrade to access premium features
                </p>
              </>
            )}
          </div>
          <div className="flex flex-col items-start sm:items-end w-full sm:w-auto mt-4 sm:mt-0">
            <p className="text-[14px] sm:text-[15px] font-medium font-poppins text-text-black mb-2">
              {activePlan
                ? `${activePlan.price.toFixed(2)} USDT / ${activePlan.interval}`
                : "0.00 USDT / Free"}
            </p>
            <div className="flex flex-col sm:items-end w-full">
              {nextPlan && (
                <button
                  className="text-[14px] sm:text-[15px] font-medium font-poppins mb-2 text-[#A240DE] hover:text-purple-800 text-left sm:text-right flex items-center"
                  onClick={handleUpgrade}
                  disabled={isUpgrading || isSubscribing}
                >
                  {isUpgrading || isSubscribing ? (
                    <>
                      <LoaderCircle className="animate-spin mr-2" size={14} />
                      Processing...
                    </>
                  ) : (
                    <>
                      Upgrade To {nextPlan.title}
                      <ArrowRight className="ml-1" size={14} />
                    </>
                  )}
                </button>
              )}
              {activeSubscription && (
                <>
                  <Link
                    href="/dashboard/subscription-plans"
                    className="text-[14px] sm:text-[15px] font-medium font-poppins mb-2 text-[#A240DE] hover:text-purple-800 text-left sm:text-right"
                  >
                    View All Plans
                  </Link>
                  <button className="text-[14px] sm:text-[15px] font-medium font-poppins mb-2 text-[#A240DE] hover:text-purple-800 text-left sm:text-right">
                    {activeSubscription.isAutoRenew
                      ? "Cancel Auto-Renewal"
                      : "Enable Auto-Renewal"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        {/* Billing Information Section */}
        <div className="mb-6 mt-6">
          <h2 className="font-semibold text-[#0F0F0F] text-[14px] sm:text-[15px] font-poppins">
            Billing Information
          </h2>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-6 bg-white rounded-xl mt-4 gap-4 sm:gap-0">
            <div className="flex items-center w-full sm:w-auto">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                <span className="text-gray-600">SS</span>
              </div>
              <div>
                <p className="text-text-secondary text-[14px] sm:text-[15px] font-semibold">
                  Steve Smith
                </p>
                <p className="text-[14px] sm:text-[15px] font-medium font-poppins text-text-secondary">
                  loremipsum@gmail.com
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 justify-end items-start sm:items-end w-full sm:w-auto">
              <Link
                href={"/dashboard/settings/subscriptions-and-plans/history"}
                className="text-[14px] sm:text-[15px] font-medium font-poppins text-[#A240DE] hover:text-purple-800"
              >
                Billing History
              </Link>
              <button className="text-[14px] sm:text-[15px] font-medium font-poppins text-[#A240DE] hover:text-purple-800">
                Change Billing Information
              </button>
            </div>
          </div>
        </div>

        {/* Payment Details Section */}
        <div>
          <h2 className="font-semibold text-[#0F0F0F] text-[14px] sm:text-[15px] font-poppins mb-4">
            Payment Details
          </h2>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white rounded-xl p-4 sm:p-6 gap-4 sm:gap-0">
            <div className="flex items-center w-full sm:w-auto">
              <div className="w-8 h-6 bg-gray-200 rounded mr-3 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <p className="text-gray-800 text-[14px] sm:text-[15px]">
                • • • • • • • 7345
              </p>
            </div>
            <button className="text-[14px] sm:text-[15px] font-medium font-poppins text-[#A240DE] hover:text-purple-800 w-full sm:w-auto text-left sm:text-right">
              Update Payment Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
