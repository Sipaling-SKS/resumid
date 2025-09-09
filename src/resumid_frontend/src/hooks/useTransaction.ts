import { HttpAgent } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import { Principal } from "@dfinity/principal";
import { createActor, canisterId as CANISTER_ID_BACKEND, canisterId } from "../../../declarations/resumid_backend";

import * as React from "react";
import { AccountIdentifier, LedgerCanister } from "@dfinity/ledger-icp";
import { Package } from "../../../declarations/resumid_backend/resumid_backend.did";
import { useAuth } from "@/contexts/AuthContext";
import { CheckoutPlan } from "@/components/parts/CheckoutDialog";

export function useTransaction() {
    const [ledger, setLedger] = React.useState<any | null>(null);
    const [transactionFee, setTransactionFee] = React.useState<number | null>(null);
    const { isAuthenticated, identity } = useAuth();

    const initLedger = async () => {
        // const authClient = await AuthClient.create();
        // const isAuthenticated = await authClient.isAuthenticated();

        if (!isAuthenticated) {
            throw new Error('User not authenticated');
        }

        console.log('--------------------')
        const agent = await HttpAgent.create({
            identity,
            shouldFetchRootKey: import.meta.env.VITE_DFX_NETWORK !== "ic",
            verifyQuerySignatures: false,
        });

        console.log('--------------------2')
        const ledger2 = LedgerCanister.create({
            agent: agent,
            canisterId: Principal.fromText('ryjl3-tyaaa-aaaaa-aaaba-cai'),
        });

        console.log('--------------------3')
        setLedger(ledger2);

        const transactionFee = await ledger2.transactionFee();
        setTransactionFee(Number(transactionFee) / 100_000_000);

        console.log('--------------------4')
        if (!transactionFee) {
            throw new Error('Failed to get transaction fee');
        }
    }

    const transfer = async (pkg: CheckoutPlan) => {
        const accountIdentifier = AccountIdentifier.fromPrincipal({
            principal: Principal.fromText(canisterId),
            subAccount: undefined,
        });

        const transactionFee = await ledger.transactionFee();

        if (!transactionFee) {
            throw new Error('Failed to get transaction fee');
        }

        console.log(ledger)
        // Perform the transfer
        const transferResult = await ledger.transfer({
            to: accountIdentifier,
            amount: BigInt(pkg.price),
            fee: transactionFee,
            memo: 0n, // Optional memo field
            fromSubAccount: undefined,
        });

        console.log(transferResult);
        return transferResult;
    }

    React.useEffect(() => {
        if (isAuthenticated) {
            initLedger();
        }
    }, [isAuthenticated])

    return {
        ledger,
        transactionFee, transfer
    }
}