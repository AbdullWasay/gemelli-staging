import { Order } from "@/types/Orders";
import image1 from "@/assets/ProductImage/prod1.png";
import image2 from "@/assets/ProductImage/shoe2.png";


export const orders: Order[] = [
  {
    id: "3214562145",
    date: "January 8, 2024 at 8:48 pm",
    customer: {
      name: "Max Jordan",
      orders: "1",
      taxExempt: true,
    },
    contact: {
      email: "maxjordan@gmail.com",
      phone: null,
    },
    item: {
      name: "Nike Air Max 90 OG",
      brand: "NIKE",
      size: "8",
      quantity: "01",
      price: "40",
      image: image1,
    },
    summary: {
      subtotal: "80",
      shipping: "20",
      total: "100",
      paymentMethod: "Card",
    },
    total: "100",
    shippingAddress: {
      street: "180 street #7 a 5th st, new york, ny 10011, usa 30",
      city: "New York",
      state: "NY",
      zip: "10011",
      country: "USA",
    },
    billingAddress: {
      sameAsShipping: true,
    },
  },
  {
    id: "3214562146",
    date: "January 10, 2024 at 10:15 am",
    customer: {
      name: "Sarah Smith",
      orders: "3",
      taxExempt: false,
    },
    contact: {
      email: "sarah.smith@gmail.com",
      phone: "+1 (555) 123-4567",
    },
    item: {
      name: "Adidas Ultraboost",
      brand: "ADIDAS",
      size: "9",
      quantity: "01",
      price: "60",
      image: image2,
    },
    summary: {
      subtotal: "60",
      shipping: "15",
      total: "75",
      paymentMethod: "PayPal",
    },
    total: "75",
    shippingAddress: {
      street: "425 Park Avenue",
      city: "New York",
      state: "NY",
      zip: "10022",
      country: "USA",
    },
    billingAddress: {
      sameAsShipping: true,
    },
  },
  {
    id: "3214562147",
    date: "January 12, 2024 at 3:22 pm",
    customer: {
      name: "John Doe",
      orders: "5",
      taxExempt: false,
    },
    contact: {
      email: "john.doe@gmail.com",
      phone: "+1 (555) 987-6543",
    },
    item: {
      name: "Puma RS-X",
      brand: "PUMA",
      size: "10",
      quantity: "02",
      price: "45",
      image: image2,
    },
    summary: {
      subtotal: "90",
      shipping: "20",
      total: "110",
      paymentMethod: "Credit Card",
    },
    total: "110",
    shippingAddress: {
      street: "123 Main Street",
      city: "Boston",
      state: "MA",
      zip: "02108",
      country: "USA",
    },
    billingAddress: {
      sameAsShipping: false,
      street: "456 Business Ave",
      city: "Boston",
      state: "MA",
      zip: "02110",
      country: "USA",
    },
  },
  {
    id: "3214562148",
    date: "January 15, 2024 at 9:30 am",
    customer: {
      name: "Emily Johnson",
      orders: "2",
      taxExempt: true,
    },
    contact: {
      email: "emily.j@gmail.com",
      phone: null,
    },
    item: {
      name: "New Balance 574",
      brand: "NEW BALANCE",
      size: "8.5",
      quantity: "01",
      price: "55",
      image: image1,
    },
    summary: {
      subtotal: "55",
      shipping: "15",
      total: "70",
      paymentMethod: "Card",
    },
    total: "70",
    shippingAddress: {
      street: "789 Oak Street",
      city: "Chicago",
      state: "IL",
      zip: "60601",
      country: "USA",
    },
    billingAddress: {
      sameAsShipping: true,
    },
  },
]
