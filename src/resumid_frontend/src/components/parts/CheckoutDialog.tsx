import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import ICW from "@/assets/internet-computer-icp-logo.svg";
import { useToast } from "@/hooks/use-toast";
import { ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/AuthContext";
import { useWallet } from "@/hooks/useWallet";

export interface CheckoutPlan {
  id: string;
  name: string;
  tokens: number;
  price: number; // In ICP
  description?: string;
}

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: CheckoutPlan | null;
}

export default function CheckoutDialog({ open, onOpenChange, plan }: CheckoutDialogProps) {
  const { toast } = useToast();
  const { isAuthenticated, login } = useAuth();
  const { hasClaimedTrial, canClaimTrial, refetch, buyPackage } = useWallet();
  const [agree, setAgree] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const fee = 0.001; // Flat network fee example

  const isTrialPlan = useMemo(() => {
    if (!plan) return false;
    return plan.id === "trial" || plan.price === 0;
  }, [plan]);

  const grandTotal = useMemo(() => {
    if (!plan) return 0;
    // Semua plan, termasuk trial, selalu kena fee
    return Number((plan.price + fee).toFixed(3));
  }, [plan]);
 
 
  const handleCheckout = async () => {
    if (!plan) return;
    if (!agree) return;
    if (!isAuthenticated) {
      await login();
      return;
    }

    setIsLoading(true);
    try {
      // FE-only: update wallet locally
      await buyPackage(plan.id, plan.tokens);
      await refetch();

      // Backend integration placeholder
      // await fetch("/api/checkout", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ packageId: plan.id, tokens: plan.tokens, amount: plan.price })
      // });

      // Temporary success without backend
      await new Promise((resolve) => setTimeout(resolve, 600));
      toast({
        title: "Payment successful",
        description: `${plan.tokens} tokens added to your account (mock).`,
      });
      onOpenChange(false);
    } catch (err) {
      toast({ title: "Failed to checkout", description: "Please try again later", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md bg-white overflow-visible max-h-none rounded-2xl p-6">
        <DialogHeader className="p-0">
          <DialogTitle className="font-outfit font-semibold text-[20px] leading-tight text-heading flex items-center justify-between">
            <span>Billing Summary</span>
            <ChevronDown className="w-4 h-4 text-paragraph" />
          </DialogTitle>
        </DialogHeader>

        {plan && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-inter text-[16px] text-paragraph">Subtotal</span>
                <div className="inline-flex items-center gap-2">
                  <img src={ICW} alt="ICP" className="w-4 h-4" />
                  <span className="font-inter text-[18px]">{plan.price}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-inter text-[16px] text-paragraph">Platform Fee</span>
                <div className="inline-flex items-center gap-2">
                  <img src={ICW} alt="ICP" className="w-4 h-4" />
                  <span className="font-inter text-[16px] text-gray-500">{fee}</span>
                </div>
              </div>
              
              <hr className="h-px w-full bg-neutral-200 my-2" />
              <div className="flex items-center justify-between">
                <span className="font-inter font-semibold text-[18px]">Grand Total</span>
                <span className="font-inter font-semibold text-[18px]">{grandTotal}</span>
              </div>
            </div>

            <Card className="bg-neutral-100 border-0 rounded-2xl">
              <CardContent className="p-6 md:p-6">
                <div className="font-outfit font-semibold text-[20px] text-black mb-2">{plan.name}</div>
                <ul className="list-disc pl-6 text-[18px] leading-7 text-gray-600 space-y-1">
                  <li>{plan.tokens} Tokens</li>
                  <li>Enough for {plan.tokens} CV analyses</li>
                  <li>The best deal — maximize insights and get the most value!</li>
                </ul>
              </CardContent>
            </Card>

            <div className="flex items-start gap-3">
              <Checkbox id="agree" checked={agree} onCheckedChange={(v) => setAgree(Boolean(v))} />
              <label htmlFor="agree" className="text-sm text-paragraph select-none font-inter">
                Please check to acknowledge our {""}
                <a
                  className="text-blue-600 underline cursor-pointer"
                  href="#"
                  onClick={(e) => { e.preventDefault(); setPrivacyOpen(true); }}
                >
                  Privacy Policy
                </a>
                {" "}& 
                <a
                  className="text-blue-600 underline cursor-pointer"
                  href="#"
                  onClick={(e) => { e.preventDefault(); setTermsOpen(true); }}
                >
                   Terms Conditions
                </a>
              </label>
            </div>

            {isAuthenticated ? (
              <Button disabled={!agree || isLoading || (plan?.id === 'trial' && !canClaimTrial())} onClick={() => setConfirmOpen(true)} className="w-full shadow-md" size="lg" variant="gradient">
                Buy Package
              </Button>
            ) : (
              <Button onClick={login} className="w-full shadow-md" size="lg" variant="gradient">
                Sign in to Buy
              </Button>
            )}

            {plan?.id === 'trial' && hasClaimedTrial && (
              <p className="text-sm text-red-500 font-inter text-center">You have already claimed the Trial package.</p>
            )}
          </div>
        )}
        </DialogContent>
      </Dialog>

      {plan && (
        <Dialog open={confirmOpen} onOpenChange={(o) => { if (!isLoading) setConfirmOpen(o); }}>
          <DialogContent className="sm:max-w-lg bg-white rounded-2xl p-6 overflow-visible max-h-none">
            <DialogHeader className="p-0">
              <DialogTitle className="font-outfit font-semibold text-[20px] leading-tight text-heading">Confirm Purchase</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="font-inter text-paragraph text-[16px]">Confirm purchase of <span className="font-semibold">{plan.tokens} tokens</span> for <span className="font-semibold">{grandTotal} ICP</span>?</p>
              <div className="flex gap-3 justify-end pt-2">
                <Button variant="secondary" onClick={() => setConfirmOpen(false)} disabled={isLoading}>Cancel</Button>
                <Button variant="gradient" onClick={handleCheckout} disabled={isLoading}>{isLoading ? 'Processing...' : 'Confirm'}</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
        <DialogContent className="sm:max-w-lg bg-white rounded-2xl p-6 overflow-visible max-h-none">
          <DialogHeader className="p-0">
            <DialogTitle className="font-outfit font-semibold text-[20px] leading-tight text-heading">Privacy Policy</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm text-paragraph font-inter">
            <p>We respect your privacy. We only process the information you provide to deliver the service, improve product quality, and ensure account security.</p>
            <p>Your uploaded documents are used solely for analysis purposes and are not shared with third parties without your consent. You can request deletion of your data at any time.</p>
            <p>For questions about data handling, contact us via the support channel provided in the app.</p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={termsOpen} onOpenChange={setTermsOpen}>
        <DialogContent className="sm:max-w-lg bg-white rounded-2xl p-6 overflow-visible max-h-none">
          <DialogHeader className="p-0">
            <DialogTitle className="font-outfit font-semibold text-[20px] leading-tight text-heading"> Terms Conditions</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm text-paragraph font-inter">
            <p>By using this service, you agree to use tokens responsibly and comply with applicable laws.</p>
            <p>Subscriptions and token purchases are non-transferable. Refunds are evaluated on a case-by-case basis where applicable by law.</p>
            <p>We may update these terms from time to time. Continued use of the service constitutes acceptance of the updated terms.</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}


