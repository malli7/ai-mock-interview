"use client";

import {
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { storeUserData } from "./StoreUserData";

type Props = { children: React.ReactNode };

const ClerkProviders = ({ children }: Props) => {
  return (
    <ClerkProvider>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <UserDataHandler />
        {children}
      </SignedIn>
    </ClerkProvider>
  );
};

export default ClerkProviders;

const UserDataHandler = () => {
  const { user, isSignedIn } = useUser();
  const [hasStoredData, setHasStoredData] = useState(false);
  useEffect(() => {
    if (isSignedIn && user && !hasStoredData) {
      const x = {
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.primaryEmailAddress?.emailAddress || "",
        createdAt: new Date(),
        id: user.id,
      };
      storeUserData(x);
      setHasStoredData(true);
    }
  }, [isSignedIn, user, hasStoredData]);
  return null;
};
