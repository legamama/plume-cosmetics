// Tabs component

import { createContext, useContext, useState, type ReactNode } from 'react';

interface TabsContextValue {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs() {
    const context = useContext(TabsContext);
    if (!context) {
        throw new Error('Tabs components must be used within a Tabs provider');
    }
    return context;
}

interface TabsProps {
    defaultValue: string;
    children: ReactNode;
    onChange?: (value: string) => void;
}

export function Tabs({ defaultValue, children, onChange }: TabsProps) {
    const [activeTab, setActiveTabState] = useState(defaultValue);

    const setActiveTab = (tab: string) => {
        setActiveTabState(tab);
        onChange?.(tab);
    };

    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab }}>
            {children}
        </TabsContext.Provider>
    );
}

interface TabListProps {
    children: ReactNode;
    className?: string;
}

export function TabList({ children, className = '' }: TabListProps) {
    return (
        <div
            className={`
        flex border-b border-border
        ${className}
      `}
            role="tablist"
        >
            {children}
        </div>
    );
}

interface TabProps {
    value: string;
    children: ReactNode;
    disabled?: boolean;
}

export function Tab({ value, children, disabled = false }: TabProps) {
    const { activeTab, setActiveTab } = useTabs();
    const isActive = activeTab === value;

    return (
        <button
            role="tab"
            aria-selected={isActive}
            disabled={disabled}
            onClick={() => !disabled && setActiveTab(value)}
            className={`
        px-4 py-3 text-sm font-medium
        border-b-2 -mb-px
        transition-colors duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-plume-coral focus-visible:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${isActive
                    ? 'border-plume-coral text-plume-coral-dark'
                    : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
                }
      `}
        >
            {children}
        </button>
    );
}

interface TabPanelProps {
    value: string;
    children: ReactNode;
    className?: string;
}

export function TabPanel({ value, children, className = '' }: TabPanelProps) {
    const { activeTab } = useTabs();

    if (activeTab !== value) return null;

    return (
        <div
            role="tabpanel"
            className={`py-4 ${className}`}
        >
            {children}
        </div>
    );
}
