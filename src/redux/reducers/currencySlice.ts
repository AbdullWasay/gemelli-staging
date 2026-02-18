import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export type Currency = "USD" | "EUR" | "RUB" | "MDL";

interface CurrencyState {
  currency: Currency;
  exchangeRates: Record<Currency, number>;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

const initialState: CurrencyState = {
  currency: "MDL",
  exchangeRates: {
    USD: 1,
    EUR: 0.93,
    RUB: 92.5,
    MDL: 17.5,
  },
  loading: false,
  error: null,
  lastUpdated: null,
};

export const fetchExchangeRates = createAsyncThunk(
  "currency/fetchExchangeRates",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://v6.exchangerate-api.com/v6/5932226a8e0e7e1048849ffd/latest/USD`
      );

      const rates = response?.data?.conversion_rates;

      console.log(rates, "This is rates");

      if (!rates || !rates?.EUR || !rates?.RUB || !rates?.MDL) {
        throw new Error("Invalid exchange rate data");
      }

      return {
        USD: rates.USD,
        EUR: rates.EUR,
        RUB: rates.RUB,
        MDL: rates.MDL,
      } as Record<Currency, number>;
    } catch (error) {
      console.error("Error fetching exchange rates:", error);
      return rejectWithValue(
        "Failed to fetch exchange rates. Using fallback rates."
      );
    }
  }
);

const currencySlice = createSlice({
  name: "currency",
  initialState,
  reducers: {
    setCurrency: (state, action: PayloadAction<Currency>) => {
      state.currency = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExchangeRates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchExchangeRates.fulfilled,
        (state, action: PayloadAction<Record<Currency, number>>) => {
          state.exchangeRates = action.payload;
          state.loading = false;
          state.lastUpdated = new Date().toISOString();
          console.log("Exchange rates updated:", state.exchangeRates);
        }
      )
      .addCase(fetchExchangeRates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.lastUpdated = new Date().toISOString();
        console.log("Using fallback exchange rates");
      });
  },
});

export const { setCurrency } = currencySlice.actions;
export default currencySlice.reducer;
