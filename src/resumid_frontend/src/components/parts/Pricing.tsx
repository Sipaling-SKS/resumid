import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { CircleCheck, ArrowRightIcon, Stars } from "lucide-react";
import ICW from "@/assets/internet-computer-icp-logo.svg"
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import CheckoutDialog, { CheckoutPlan } from "@/components/parts/CheckoutDialog";
import { Package } from "../../../../declarations/resumid_backend/resumid_backend.did";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";

type Plan = {
  title: string
  description: string
  price?: bigint
  list: string[]
  highlightFirstItem?: boolean
  highlightPlan?: boolean
  buttonLabel?: string
  onPress?: () => void
  id?: string
  tokens?: number
}

interface PlanProps extends Plan {
  className?: string
}

function Plan({ title, description, price, list, highlightPlan, highlightFirstItem, buttonLabel, onPress, className }: PlanProps) {
  return (
    <Card className={cn("flex flex-col p-0 space-y-0 border-b border-neutral-200", highlightPlan && "p-[2px] bg-gradient-to-r from-primary-500 to-accent-500", !highlightPlan && "mt-0 lg:mt-[42px]", className)} key={title}>
      {highlightPlan && <div className="p-2 h-10 inline-flex text-sm md:text-md gap-1 items-center justify-center text-white font-semibold font-inter">
        Most Popular <Stars size={16} />
      </div>}
      <div className="w-full h-full flex flex-col space-y-6 p-6 md:p-8 bg-white rounded-[calc(0.75rem-2px)]">
        <CardHeader className="">
          <CardTitle className="font-outfit font-semibold text-heading">
            {title}
          </CardTitle>
          <CardDescription className="font-inter text-md text-paragraph">
            {description}
          </CardDescription>
          {price !== undefined && <section className="inline-flex items-end space-x-2 pt-2">
            <div className="inline-flex items-center space-x-2">
              <img src={ICW} alt="Internet Computer" className="w-8 object-center object-cover" />
              <p className="font-inter text-5xl font-semibold text-paragraph">{price.toString()}</p>
            </div>

          </section>}
        </CardHeader>
        <hr className="h-[1px] w-full bg-neutral-200" />
        <CardContent className="flex flex-col gap-8 md:gap-10 justify-between flex-grow">
          <ul className="space-y-4">
            {list.map((val: string, index: number) => (
              <li className="inline-flex items-center gap-3" key={index}>
                <CircleCheck className="text-accent-500 shrink-0" />
                <p className={cn(index === 0 && highlightFirstItem && "font-semibold", "font-inter text-paragraph")}>
                  {val}
                </p>
              </li>
            ))}
          </ul>
          <section className="flex justify-center">
            <Button onClick={onPress ? () => onPress() : () => { }} className="w-full" variant={highlightPlan ? "gradient" : "secondary"} size="lg">
              {buttonLabel ? buttonLabel : "Get Started"}
              <ArrowRightIcon />
            </Button>
          </section>
        </CardContent>
      </div>
    </Card>
  )
}

function Pricing() {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<CheckoutPlan | null>(null);
  const { resumidActor } = useAuth();

  const openCheckout = (plan: CheckoutPlan) => {
    setSelectedPlan(plan);
    setCheckoutOpen(true);
  };

  // const planList: Plan[] = [
  //   {
  //     title: "Basic",
  //     description: "For individuals",
  //     price: 5,
  //     id: "trial",
  //     tokens: 10,
  //     list: [
  //       "Get 10 Tokens",
  //       "Great for first-time users to try the service.",
  //     ],
  //   },
  //   {
  //     title: "Pro",
  //     description: "For individuals or teams",
  //     price: 10,
  //     id: "standard",
  //     tokens: 25,
  //     list: [
  //       "Get 25 Tokens",
  //       "Ideal for regular users who need consistent feedback",
  //     ],
  //     highlightFirstItem: true,
  //     highlightPlan: true,
  //   },
  //   {
  //     title: "Premium",
  //     description: "For teams",
  //     price: 20,
  //     id: "premium",
  //     tokens: 60,
  //     list: [
  //       "Get 60 Tokens",
  //       "Bulk analysis, custom AI models, and dedicated support.",
  //     ],
  //     highlightFirstItem: true,
  //   }
  // ]

  const fetchPackage = async () => {
    const result: Package[] = await resumidActor.getPackages();
    return result;
  }

  const { data: packages, isLoading: loadingPackages, error: errorPackages } = useQuery({
    initialData: [],
    queryKey: ['list-of-packages'],
    queryFn: () => fetchPackage()
  })

  return (
    <section id="pricing" className="responsive-container py-12 md:py-16 lg:pt-24 lg:pb-32 border-b border-neutral-200">
      <h2 className="text-balance font-outfit text-heading leading-tight text-3xl md:text-4xl text-center font-semibold mb-10 md:mb-14 px-4">
        Flexible Plans for Every Need
      </h2>
      <div className="mx-auto max-w-lg lg:max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {packages.map((plan: Package, index: number) => (
          <Plan
            key={index}
            className={cn(index === 1 && "order-first lg:order-none")}
            title={plan.title}
            description={plan.subtitle}
            price={plan?.price}
            list={plan.description}
            highlightFirstItem={plan?.highlightFirstItem}
            highlightPlan={plan?.highlightPlan}
            buttonLabel={''}
            onPress={() => plan?.id && plan?.token !== undefined && plan?.price !== undefined && openCheckout({ id: plan.id, name: plan.title, tokens: plan.token, price: plan.price })}
          />
        ))}
      </div>

      <CheckoutDialog open={checkoutOpen} onOpenChange={setCheckoutOpen} plan={selectedPlan} />
    </section>
  )
}

export default Pricing;