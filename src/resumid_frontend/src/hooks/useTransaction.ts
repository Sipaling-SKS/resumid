import { HttpAgent } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import { Principal } from "@dfinity/principal";
import { createActor, canisterId as CANISTER_ID_BACKEND } from "../../../declarations/resumid_backend";

import * as React from "react";
import { AccountIdentifier, LedgerCanister } from "@dfinity/ledger-icp";

export function useTransaction() {
    const [ledger, setLedger] = React.useState<any | null>(null);
    const [transactionFee, setTransactionFee] = React.useState<number | null>(null);

    const initLedger = async () => {
        const authClient = await AuthClient.create();
        const isAuthenticated = await authClient.isAuthenticated();

        if (!isAuthenticated) {
            throw new Error('User not authenticated');
        }

        const identity = authClient.getIdentity();

        console.log('--------------------')
        const agent = await HttpAgent.create({
            identity,
            shouldFetchRootKey: import.meta.env.VITE_DFX_NETWORK !== "ic",
            verifyQuerySignatures: false,
        });
        
        console.log('--------------------2')
        const ledger = LedgerCanister.create({
            agent: agent,
            canisterId: Principal.fromText('ryjl3-tyaaa-aaaaa-aaaba-cai'),
        });
        
        console.log('--------------------3')
        setLedger(ledger);
        
        const transactionFee = await ledger.transactionFee();
        setTransactionFee(Number(transactionFee) / 100_000_000 );
        
        console.log('--------------------4')
        if (!transactionFee) {
            throw new Error('Failed to get transaction fee');
        }
    }

    React.useEffect(() => {
        initLedger();
    }, [])

    return {
        ledger,
        transactionFee,
    }
}