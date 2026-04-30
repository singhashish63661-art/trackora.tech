import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { trackEvent } from "../lib/analytics";

export const DemoModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        company: "",
        fleetSize: "1 - 50",
        email: "",
    });

    // Bind event listener so any button can open the modal globally
    useEffect(() => {
        const handleOpen = () => {
            setIsOpen(true);
            trackEvent("demo_modal_open");
        };
        (window as any).__trackoraDemoReady = true;
        window.addEventListener("openDemoModal", handleOpen);
        return () => {
            (window as any).__trackoraDemoReady = false;
            window.removeEventListener("openDemoModal", handleOpen);
        };
    }, []);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isOpen]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        setFeedback("");
        trackEvent("demo_submit_start");

        try {
            const response = await fetch("/api/demo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Failed to save request");
            }

            setFeedback("Your demo request has been captured.");
            setFormData({
                name: "",
                company: "",
                fleetSize: "1 - 50",
                email: "",
            });
            trackEvent("demo_submit_success");
        } catch (error) {
            console.error(error);
            setFeedback("Unable to submit right now. Please try again.");
            trackEvent("demo_submit_failure");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden"
                    >
                        <div className="p-6 sm:p-8">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                            >
                                <Icon icon="mdi:close" className="w-4 h-4 text-gray-600" />
                            </button>

                            <div className="mb-8 text-center">
                                <h3 className="text-2xl font-semibold text-gray-900 tracking-tight mb-2">
                                    Schedule a personalized demo
                                </h3>
                                <p className="text-gray-500 text-sm">
                                    Discover how Trackora can optimize your network routing and slash unexpected vehicle downtime.
                                </p>
                            </div>

                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 uppercase tracking-widest mb-1.5">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(event) =>
                                            setFormData((prev) => ({ ...prev, name: event.target.value }))
                                        }
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm outline-none"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 uppercase tracking-widest mb-1.5">
                                            Company
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.company}
                                            onChange={(event) =>
                                                setFormData((prev) => ({ ...prev, company: event.target.value }))
                                            }
                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm outline-none"
                                            placeholder="Logistics Inc."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 uppercase tracking-widest mb-1.5">
                                            Fleet Size
                                        </label>
                                        <select
                                            value={formData.fleetSize}
                                            onChange={(event) =>
                                                setFormData((prev) => ({ ...prev, fleetSize: event.target.value }))
                                            }
                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm outline-none appearance-none"
                                        >
                                            <option>1 - 50</option>
                                            <option>51 - 250</option>
                                            <option>251 - 1000</option>
                                            <option>1000+</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 uppercase tracking-widest mb-1.5">
                                        Work Email
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(event) =>
                                            setFormData((prev) => ({ ...prev, email: event.target.value }))
                                        }
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm outline-none"
                                        placeholder="john@company.com"
                                    />
                                </div>

                                {feedback && (
                                    <p className="text-xs text-gray-600" role="status">
                                        {feedback}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full mt-6 bg-[#09090B] text-white py-4 rounded-lg text-sm font-semibold tracking-wide hover:bg-gray-800 transition-colors"
                                >
                                    {isSubmitting ? "Submitting..." : "Book Demo"}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
