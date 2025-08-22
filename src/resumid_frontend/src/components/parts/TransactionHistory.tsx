import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Package, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { TokenEntry, TokenEntryType } from "../../../../declarations/resumid_backend/resumid_backend.did";

// export interface Transaction {
//   id: string;
//   type: "analyze" | "buy" | "promo";
//   description: string;
//   date: string;
//   tokenChange: number;
//   icon?: React.ReactNode;
// }

interface TransactionHistoryProps {
  transactions: TokenEntry[];
  onViewAll?: () => void;
}

export default function TransactionHistory({ transactions }: TransactionHistoryProps) {
  const [open, setOpen] = useState(false);

  const getTransactionIcon = (type: TokenEntryType) => {
    const key = Object.keys(type)[0];

    switch (key) {
      case "buy":
        return <Package size={20} className="text-green-600" />;
      case "sub":
        return <Package size={20} className="text-red-600" />;
      case "initial":
        return <FileText size={20} className="text-blue-600" />;
      case "analyze":
        return <FileText size={20} className="text-purple-600" />;
      default:
        return <FileText size={20} className="text-gray-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const renderTransactionCard = (transaction: TokenEntry) => (
    <Card key={transaction.entryNo} className="border border-gray-200 shadow-sm p-6">
      <CardContent>
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Icon */}
          <div className="flex-shrink-0">
            {getTransactionIcon(transaction.entryType)}
          </div>

          {/* Transaction Details */}
          <div className="flex-1 min-w-0 flex flex-col gap-1">
            <p className="font-inter text-sm font-medium text-gray-900 truncate">
              {transaction.description}
            </p>
            <p className="font-inter text-xs text-gray-500">
              {formatDate(transaction.timestamp)}
            </p>
          </div>

          {/* Token Change */}
          <div className="flex-shrink-0">
            <span
              className={`font-inter text-xs sm:text-sm font-semibold ${transaction.quantity > 0 ? "text-green-600" : "text-red-600"
                }`}
            >
              {transaction.quantity > 0 ? "+" : ""}
              {transaction.quantity} Token
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <h2 className="font-inter text-lg sm:text-xl font-semibold text-gray-900">
          History
        </h2>
        <Button
          variant="ghost"
          className="font-inter text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-sm sm:text-base"
          onClick={() => setOpen(true)}
        >
          See all my history
          <ArrowRight size={16} className="ml-2" />
        </Button>
      </div>

      {/* Last 5 Transactions */}
      <div className="space-y-2 sm:space-y-3">
        {transactions.slice(0, 5).map(renderTransactionCard)}
      </div>

      {/* Popup with Scroll */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white rounded-2xl shadow-lg p-0 sm:max-w-lg w-[min(92vw,40rem)] overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b">
            <h3 className="font-inter text-lg font-bold text-gray-900">All History</h3>
          </div>

          {/* Konten: scrollable */}
          <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
            <div className="space-y-3">
              {transactions.map(renderTransactionCard)}
            </div>
          </div>
        </DialogContent>
      </Dialog>


    </div>
  );
}
