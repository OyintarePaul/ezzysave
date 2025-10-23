"use client"
import React, { useState } from "react";
import {
  User,
  Lock,
  Bell,
  Globe,
  CreditCard,
  Shield,
  Smartphone,
  Mail,
  Eye,
  EyeOff,
  LucideIcon,
} from "lucide-react";

// --- Type Definitions ---

// Define the shape of the application's main state (formData)
interface IFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  language: "en" | "es" | "fr" | "de";
  currency: "USD" | "EUR" | "GBP" | "NGN";
  timezone: "EST" | "PST" | "GMT" | "WAT";
  twoFactor: boolean;
  biometric: boolean;
}

// Define keys that are simple strings (for text/select inputs)
type StringKeys =
  | Exclude<keyof IFormData, boolean | "language" | "currency" | "timezone">
  | "language"
  | "currency"
  | "timezone";

// Define keys that are booleans (for toggle switches)
type BooleanKeys =
  | "emailNotifications"
  | "pushNotifications"
  | "smsNotifications"
  | "marketingEmails"
  | "twoFactor"
  | "biometric";

// Define the shape of a tab item
interface ITab {
  id: "profile" | "security" | "notifications" | "preferences" | "payment";
  label: string;
  icon: LucideIcon; // Using LucideIcon type for the component
}

// Define the type for the active tab state
type ActiveTab = ITab["id"];

const SettingsContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("profile");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Apply the IFormData interface to the state
  const [formData, setFormData] = useState<IFormData>({
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street, New York, NY 10001",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: true,
    marketingEmails: false,
    language: "en",
    currency: "USD",
    timezone: "EST",
    twoFactor: false,
    biometric: true,
  });

  // Apply the ITab array type
  const tabs: ITab[] = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "preferences", label: "Preferences", icon: Globe },
    { id: "payment", label: "Payment Methods", icon: CreditCard },
  ];

  // Handler for text and select inputs (only dealing with string values)
  const handleInputChange = (field: StringKeys, value: string) => {
    // Use the functional update form for safety, though not strictly required here
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handler for toggle switches (only dealing with boolean fields)
  const handleToggle = (field: BooleanKeys) => {
    setFormData((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // Reusable component for the toggle switch pattern
  interface ToggleRowProps {
    title: string;
    description: string;
    icon: LucideIcon;
    field: BooleanKeys;
  }

  const ToggleRow: React.FC<ToggleRowProps> = ({
    title,
    description,
    icon: Icon,
    field,
  }) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0">
      <div>
        <div className="flex items-center gap-2">
          <Icon size={20} className="text-gray-600" />
          <h3 className="font-semibold text-gray-900">{title}</h3>
        </div>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={formData[field] as boolean} // Asserting boolean as per BooleanKeys type
          onChange={() => handleToggle(field)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
    </div>
  );

  // Reusable component for text input fields
  interface InputFieldProps {
    label: string;
    type: string;
    field: StringKeys;
    isPassword?: boolean;
    showPassword?: boolean;
    onToggleShow?: () => void;
  }

  const InputField: React.FC<InputFieldProps> = ({
    label,
    type,
    field,
    isPassword = false,
    showPassword,
    onToggleShow,
  }) => {
    // We can confidently cast formData[field] to string here based on StringKeys definition
    const inputValue = formData[field] as string;

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        <div className="relative">
          <input
            type={isPassword && showPassword ? "text" : type}
            value={inputValue}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
          {isPassword && onToggleShow && (
            <button
              type="button"
              onClick={onToggleShow}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Account Settings
          </h1>
          <p className="text-gray-600">
            Manage your profile, security, and application preferences.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full lg:w-64 bg-white rounded-xl shadow-lg border border-gray-100 p-2 h-fit">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition duration-200 ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white font-semibold shadow-md"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-sm">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-10">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">
                  Personal Information
                </h2>
                <div className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                    <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center border-4 border-blue-200">
                      <User size={40} className="text-blue-600" />
                    </div>
                    <div className="flex flex-col items-center sm:items-start">
                      <button className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition font-medium text-sm shadow-md">
                        Change Photo
                      </button>
                      <p className="text-xs text-gray-500 mt-2">
                        JPG, PNG or GIF. Max size 2MB
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="Full Name"
                      type="text"
                      field="fullName"
                    />
                    <InputField
                      label="Email Address"
                      type="email"
                      field="email"
                    />
                    <InputField label="Phone Number" type="tel" field="phone" />
                    <InputField label="Address" type="text" field="address" />
                  </div>

                  <div className="flex gap-4 pt-6">
                    <button className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition font-bold shadow-lg shadow-blue-200">
                      Save Changes
                    </button>
                    <button className="bg-gray-200 text-gray-700 px-8 py-3 rounded-full hover:bg-gray-300 transition font-medium">
                      Cancel
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">
                  Account Security
                </h2>
                <div className="space-y-10">
                  {/* Change Password */}
                  <div className="border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
                      <Lock size={20} className="text-blue-600" /> Change
                      Password
                    </h3>
                    <div className="space-y-4 max-w-lg">
                      <InputField
                        label="Current Password"
                        type="password"
                        field="currentPassword"
                        isPassword
                        showPassword={showPassword}
                        onToggleShow={() => setShowPassword(!showPassword)}
                      />
                      <InputField
                        label="New Password"
                        type="password"
                        field="newPassword"
                      />
                      <InputField
                        label="Confirm New Password"
                        type="password"
                        field="confirmPassword"
                      />

                      <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition font-medium mt-4">
                        Update Password
                      </button>
                    </div>
                  </div>

                  {/* Other Security Options */}
                  <div className="border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
                      <Shield size={20} className="text-blue-600" /> Advanced
                      Security
                    </h3>
                    <div className="space-y-2">
                      <ToggleRow
                        title="Two-Factor Authentication (2FA)"
                        description="Require a code from your authentication app upon login."
                        icon={Shield}
                        field="twoFactor"
                      />
                      <ToggleRow
                        title="Biometric Login"
                        description="Use fingerprint or face ID to quickly access your account on supported devices."
                        icon={Smartphone}
                        field="biometric"
                      />
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">
                  Notification Preferences
                </h2>
                <div className="space-y-2">
                  <ToggleRow
                    title="Email Notifications"
                    description="Receive account status, security, and activity alerts via email."
                    icon={Mail}
                    field="emailNotifications"
                  />
                  <ToggleRow
                    title="Push Notifications"
                    description="Receive instant alerts on your mobile device or browser."
                    icon={Bell}
                    field="pushNotifications"
                  />
                  <ToggleRow
                    title="SMS Notifications"
                    description="Receive important time-sensitive alerts via text message."
                    icon={Smartphone}
                    field="smsNotifications"
                  />
                  <ToggleRow
                    title="Marketing & Promotions"
                    description="Receive promotional emails and offers about new features and products."
                    icon={Mail}
                    field="marketingEmails"
                  />
                </div>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition font-medium mt-6 shadow-md">
                  Update Notifications
                </button>
              </section>
            )}

            {/* Preferences Tab */}
            {activeTab === "preferences" && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">
                  General Preferences
                </h2>
                <div className="space-y-6 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Language
                    </label>
                    <select
                      value={formData.language}
                      onChange={(e) =>
                        handleInputChange("language", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Currency
                    </label>
                    <select
                      value={formData.currency}
                      onChange={(e) =>
                        handleInputChange("currency", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="NGN">NGN - Nigerian Naira</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timezone
                    </label>
                    <select
                      value={formData.timezone}
                      onChange={(e) =>
                        handleInputChange("timezone", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    >
                      <option value="EST">EST - Eastern Standard Time</option>
                      <option value="PST">PST - Pacific Standard Time</option>
                      <option value="GMT">GMT - Greenwich Mean Time</option>
                      <option value="WAT">WAT - West Africa Time</option>
                    </select>
                  </div>

                  <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition font-medium mt-4 shadow-md">
                    Save Preferences
                  </button>
                </div>
              </section>
            )}

            {/* Payment Methods Tab */}
            {activeTab === "payment" && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">
                  Payment Methods
                </h2>
                <p className="text-gray-600 mb-6">
                  Manage saved cards and payment accounts.
                </p>
                <div className="space-y-4 mb-6">
                  {/* Card 1 */}
                  <div className="border border-gray-300 rounded-xl p-4 flex items-center justify-between hover:border-blue-500 transition shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <CreditCard size={24} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          Visa ending in 4242
                        </p>
                        <p className="text-xs text-gray-500">
                          Expires 12/2025 | Primary
                        </p>
                      </div>
                    </div>
                    <button className="text-red-600 hover:text-red-700 font-medium text-sm transition">
                      Remove
                    </button>
                  </div>

                  {/* Card 2 */}
                  <div className="border border-gray-300 rounded-xl p-4 flex items-center justify-between hover:border-blue-500 transition shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <CreditCard size={24} className="text-purple-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          Mastercard ending in 8888
                        </p>
                        <p className="text-xs text-gray-500">Expires 06/2026</p>
                      </div>
                    </div>
                    <button className="text-red-600 hover:text-red-700 font-medium text-sm transition">
                      Remove
                    </button>
                  </div>
                </div>

                <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition font-medium shadow-md">
                  Add Payment Method
                </button>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsContent;
