import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const SettingsContext = createContext(null);

const defaultSettings = {
    restaurantName: "",
    currency: "INR",
    currencySymbol: "₹",
    gstEnabled: false,
    gstPercentage: 0,
    serviceChargeEnabled: false,
    serviceChargePercentage: 0,
    deliveryChargeEnabled: false,
    deliveryCharge: 0
};

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState(defaultSettings);
    const [loadingSettings, setLoadingSettings] = useState(true);

    const fetchSettings = async () => {
        try {
            const response = await api.get("/settings");

            setSettings((current) => ({
                ...current,
                ...response.data.data
            }));
        } catch (error) {
            console.error("Fetch public settings error:", error);
        } finally {
            setLoadingSettings(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    return (
        <SettingsContext.Provider
            value={{
                settings,
                currencySymbol: settings.currencySymbol || "₹",
                loadingSettings,
                refreshSettings: fetchSettings
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);

    if (!context) {
        throw new Error(
            "useSettings must be used within SettingsProvider"
        );
    }

    return context;
};