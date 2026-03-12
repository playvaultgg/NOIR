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
    const [rates, setRates] = useState({
        INR: 1,
        USD: 0.012,
        EUR: 0.011,
    });

    useEffect(() => {
        const saved = localStorage.getItem("noir_currency");
        if (saved && CURRENCIES[saved]) setCurrency(saved);

        // Fetch Live Rates
        const fetchRates = async () => {
            try {
                const cachedRates = localStorage.getItem("noir_rates");
                const cacheTime = localStorage.getItem("noir_rates_time");
                
                // Use cache if less than 24 hours old
                if (cachedRates && cacheTime && Date.now() - parseInt(cacheTime) < 86400000) {
                    setRates(JSON.parse(cachedRates));
                    return;
                }

                // Public API with NOIR fallback key (or use your own)
                const res = await fetch(`https://open.er-api.com/v6/latest/INR`);
                const data = await res.json();
                
                if (data && data.rates) {
                    const newRates = {
                        INR: 1,
                        USD: data.rates.USD,
                        EUR: data.rates.EUR
                    };
                    setRates(newRates);
                    localStorage.setItem("noir_rates", JSON.stringify(newRates));
                    localStorage.setItem("noir_rates_time", Date.now().toString());
                }
            } catch (err) {
                console.warn("Live currency rates unavailable, using fallbacks.");
            }
        };

        fetchRates();
    }, []);

    const changeCurrency = (code) => {
        if (CURRENCIES[code]) {
            setCurrency(code);
            localStorage.setItem("noir_currency", code);
        }
    };

    const formatPrice = (amount) => {
        const { symbol } = CURRENCIES[currency];
        const rate = rates[currency] || 1;
        const converted = amount * rate;
        
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: currency,
            minimumFractionDigits: currency === "INR" ? 0 : 2,
            maximumFractionDigits: currency === "INR" ? 0 : 2,
        }).format(converted).replace(currency, symbol);
    };

    return (
        <CurrencyContext.Provider value={{ currency, changeCurrency, formatPrice, currencies: CURRENCIES, rates }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export const useCurrency = () => useContext(CurrencyContext);
