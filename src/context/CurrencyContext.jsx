"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CurrencyContext = createContext();

export const CURRENCIES = {
    INR: { symbol: "₹", rate: 1, label: "INR" },
    USD: { symbol: "$", rate: 0.012, label: "USD" },
    EUR: { symbol: "€", rate: 0.011, label: "EUR" },
};

export function CurrencyProvider({ children }) {
    const [currency, setCurrency] = useState("INR");

    useEffect(() => {
        const saved = localStorage.getItem("noir_currency");
        if (saved && CURRENCIES[saved]) setCurrency(saved);
    }, []);

    const changeCurrency = (code) => {
        if (CURRENCIES[code]) {
            setCurrency(code);
            localStorage.setItem("noir_currency", code);
        }
    };

    const formatPrice = (amount) => {
        const { symbol, rate } = CURRENCIES[currency];
        const converted = amount * rate;
        
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: currency,
            minimumFractionDigits: currency === "INR" ? 0 : 2,
            maximumFractionDigits: currency === "INR" ? 0 : 2,
        }).format(converted).replace(currency, symbol);
    };

    return (
        <CurrencyContext.Provider value={{ currency, changeCurrency, formatPrice, currencies: CURRENCIES }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export const useCurrency = () => useContext(CurrencyContext);
