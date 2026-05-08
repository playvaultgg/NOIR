"use client";

/**
 * MAISON NOIR — Application Container Compositor
 * Senior Standard: Single import that wraps the entire app in all containers.
 * 
 * Usage in layout.js:
 *   import AppContainers from "@/containers/AppContainers";
 *   <AppContainers>{children}</AppContainers>
 */

import { NotificationProvider } from "./NotificationContainer";
import { LoadingProvider } from "./LoadingContainer";
import { ErrorBoundaryContainer } from "./ErrorBoundaryContainer";

export default function AppContainers({ children }) {
    return (
        <ErrorBoundaryContainer>
            <NotificationProvider>
                <LoadingProvider>
                    {children}
                </LoadingProvider>
            </NotificationProvider>
        </ErrorBoundaryContainer>
    );
}
