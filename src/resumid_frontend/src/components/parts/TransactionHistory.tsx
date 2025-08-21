import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Package, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface Transaction {
  id: string;
  type: "analyze" | "buy" | "promo";
  description: string;
  date: string;
  tokenChange: number;
  icon?: React.ReactNode;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export default function TransactionHistory({ transactions }: TransactionHistoryProps) {
  const [open, setOpen] = useState(false);

  const getTransactionIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "analyze":
        return <FileText size={20} className="text-blue-600" />;
      case "buy":
        return <Package size={20} className="text-green-600" />;
      case "promo":
        return <Package size={20} className="text-purple-600" />;
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

  const renderTransactionCard = (transaction: Transaction) => (
    <Card key={transaction.id} className="border border-gray-200 shadow-sm">
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Icon */}
          <div className="flex-shrink-0">
            {transaction.icon || getTransactionIcon(transaction.type)}
          </div>

          {/* Transaction Details */}
          <div className="flex-1 min-w-0">
            <p className="font-inter text-sm font-medium text-gray-900 truncate">
              {transaction.description}
            </p>
            <p className="font-inter text-xs text-gray-500">
              {formatDate(transaction.date)}
            </p>
          </div>

          {/* Token Change */}
          <div className="flex-shrink-0">
            <span
              className={`font-inter text-xs sm:text-sm font-semibold ${
                transaction.tokenChange > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {transaction.tokenChange > 0 ? "+" : ""}
              {transaction.tokenChange} Token
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
