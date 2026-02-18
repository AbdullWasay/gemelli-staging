import { StaticImageData } from "next/image";
import type React from "react";
// Order Types
export interface Order {
  id: string;
  date: string;
  customer: Customer;
  contact: Contact;
  item: OrderItem;
  summary: OrderSummary;
  total: string;
  shippingAddress: Address;
  billingAddress: BillingAddress;
}
export interface Customer {
  name: string;
  orders: string;
  taxExempt: boolean;
}
export interface Contact {
  email: string;
  phone: string | null;
}
export interface OrderItem {
  id?: string;
  name: string;
  brand: string;
  size: string;
  quantity: string | number;
  price: string | number;
  image: string | StaticImageData;
  fulfillmentStatus?: string;
  product?: {
    id: string;
    name: string;
    productImages: Array<{
      id: string;
      url: string;
      isPrimary: boolean;
    }>;
  };
}
export interface OrderSummary {
  subtotal: string;
  shipping: string;
  total: string;
  paymentMethod: string;
}
export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}
export interface BillingAddress {
  sameAsShipping: boolean;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}
// Component Props Types
export interface CollapsibleProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  className?: string;
}
export interface OrderItemCollapsibleProps {
  item: OrderItem;
  className: string;
  canDelete?: boolean;
}
export interface OrderSummaryCollapsibleProps {
  summary: OrderSummary;
}
export interface CustomerInfoCollapsibleProps {
  customer: Customer;
}
export interface ContactInfoCollapsibleProps {
  contact: Contact;
}
export interface ShippingAddressCollapsibleProps {
  address: Address;
}
export interface BillingAddressCollapsibleProps {
  address: BillingAddress;
}
export interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: string;
}
