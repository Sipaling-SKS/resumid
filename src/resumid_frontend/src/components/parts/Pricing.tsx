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

type Plan = {
  title: string
  description: string
  price?: number
  list: string[]
  highlightFirstItem?: boolean
  highlightPlan?: boolean
  buttonLabel?: string
  onPress?: () => void
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
              <p className="font-inter text-5xl font-semibold text-paragraph">{price}</p>
            </div>
            <p className="font-inter text-paragraph">Monthly</p>
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
  const planList: Plan[] = [
    {
      title: "Starter",
      description: "For individuals",
      price: 0,
      list: [
        "Includes a summary of strengths and areas for improvement.",
        "Limited to only 3 resume analysis.",
      ],
    },
    {
      title: "Pro",
      description: "For individuals or teams",
      price: 5,
      list: [
        "Everything included in Starter Tier",
        "Unlimited analysis, detailed reports, and job-specific recommendations.",
      ],
      highlightFirstItem: true,
      highlightPlan: true,
    },
    {
      title: "Enterprise",
      description: "For organizations",
      list: [
        "Everything included in Pro Tier",
        "Bulk analysis, custom AI models, and dedicated support.",
      ],
      highlightFirstItem: true,
      buttonLabel: "Contact Sales"
    }
  ]

  return (
    <section className="responsive-container py-12 md:py-16 lg:pt-24 lg:pb-32">
      <h2 className="text-balance font-outfit text-heading leading-tight text-3xl md:text-4xl text-center font-semibold mb-10 md:mb-14 px-4">
        Flexible Plans for Every Need
      </h2>
      <div className="mx-auto max-w-lg lg:max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {planList.map((plan: Plan, index: number) => (
          <Plan
            className={cn(index === 1 && "order-first lg:order-none")}
            title={plan.title}
            description={plan.description}
            price={plan?.price}
            list={plan.list}
            highlightFirstItem={plan?.highlightFirstItem}
            highlightPlan={plan?.highlightPlan}
            buttonLabel={plan?.buttonLabel}
            onPress={plan?.onPress}
          />
        ))}
      </div>
    </section>
  )
}

export default Pricing;