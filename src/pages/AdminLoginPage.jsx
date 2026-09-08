import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

const AdminLoginPage = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!email.trim() || !password) {
            setError("Email and password are required.");
            return;
        }

        try {
            setLoading(true);

            const response = await api.post("/auth/login", {
                email,
                password
            });

            const { token, admin } = response.data.data;

            localStorage.setItem("restro_token", token);
            localStorage.setItem(
                "restro_admin",
                JSON.stringify(admin)
            );

            navigate("/admin");

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Login failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">

            <div className="w-full max-w-md">

                {/* Header */}
                <div className="mb-8 text-center">

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-white">
                        <LockKeyhole size={28} />
                    </div>

                    <h1 className="mt-5 text-3xl font-bold">
                        Admin Login
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Sign in to manage your restaurant
                    </p>

                </div>

                {/* Card */}
                <div className="rounded-3xl border bg-white p-7 shadow-sm">

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        {/* Error */}
                        {error && (
                            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        {/* Email */}
                        <div>

                            <label className="mb-2 block text-sm font-medium">
                                Email
                            </label>

                            <div className="relative">

                                <Mail
                                    size={19}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    placeholder="admin@restro.com"
                                    autoComplete="email"
                                    className="w-full rounded-xl border bg-white py-3 pl-11 pr-4 outline-none transition focus:border-black"
                                />

                            </div>

                        </div>

                        {/* Password */}
                        <div>

                            <label className="mb-2 block text-sm font-medium">
                                Password
                            </label>

                            <div className="relative">

                                <LockKeyhole
                                    size={19}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    className="w-full rounded-xl border bg-white py-3 pl-11 pr-12 outline-none transition focus:border-black"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                                >
                                    {showPassword ? (
                                        <EyeOff size={19} />
                                    ) : (
                                        <Eye size={19} />
                                    )}
                                </button>

                            </div>

                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-black py-3.5 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading
                                ? "Signing in..."
                                : "Sign In"}
                        </button>

                    </form>

                </div>

                <p className="mt-5 text-center text-xs text-gray-400">
                    Restaurant Management System
                </p>

            </div>

        </div>
    );
};

export default AdminLoginPage;