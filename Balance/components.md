# UI Components Library

This document contains a collection of UI components and interactions to be adapted for the React Native app.

## calendar picker components

```tsx
"use client"

import * as React from "react"
import { format } from "date-fns"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DatePickerDemo() {
  const [date, setDate] = React.useState<Date>()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!date}
          className="w-[212px] justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
        >
          {date ? format(date, "PPP") : <span>Pick a date</span>}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          defaultMonth={date}
        />
      </PopoverContent>
    </Popover>
  )
}

```

## Progress bar

```tsx
"use client"

import * as React from "react"

import { Progress } from "@/components/ui/progress"

export function ProgressDemo() {
  const [progress, setProgress] = React.useState(13)

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500)
    return () => clearTimeout(timer)
  }, [])

  return <Progress value={progress} className="w-[60%]" />
}


```

## Skeleton loading

```tsx
import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonDemo() {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  )
}

```

## Slider

```tsx
import { Slider } from "@/components/ui/slider"

export function SliderDemo() {
  return (
    <Slider
      defaultValue={[75]}
      max={100}
      step={1}
      className="mx-auto w-full max-w-xs"
    />
  )
}

```

## Sonner to alert (when user created a new task, due is near, urgent matter, etc.)

```tsx
"use client"

import { toast } from "sonner"

import { Button } from "@/components/ui/button"

export function SonnerDemo() {
  return (
    <Button
      variant="outline"
      onClick={() =>
        toast("Event has been created", {
          description: "Sunday, December 03, 2023 at 9:00 AM",
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
        })
      }
    >
      Show Toast
    </Button>
  )
}

```

## Text area(so that user can edit anything easily)

```tsx
import { Textarea } from "@/components/ui/textarea"

export function TextareaDemo() {
  return <Textarea placeholder="Type your message here." />
}

```

## Typography

https://ui.shadcn.com/docs/components/radix/typography

## buttons across the app

```tsx
import { RippleButton } from "@/registry/magicui/ripple-button"

export function RippleButtonDemo() {
  return <RippleButton rippleColor="#ADD8E6">Click me</RippleButton>
}


```

## Animated Circular Progress Bar

```tsx
"use client"

import { useEffect, useState } from "react"

import { AnimatedCircularProgressBar } from "@/registry/magicui/animated-circular-progress-bar"

export function AnimatedCircularProgressBarDemo() {
  const [value, setValue] = useState(0)

  useEffect(() => {
    const handleIncrement = (prev: number) => {
      if (prev === 100) {
        return 0
      }
      return prev + 10
    }
    setValue(handleIncrement)
    const interval = setInterval(() => setValue(handleIncrement), 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <AnimatedCircularProgressBar
      value={value}
      gaugePrimaryColor="rgb(79 70 229)"
      gaugeSecondaryColor="rgba(0, 0, 0, 0.1)"
    />
  )
}

```

## marquee for tasks preview in dashboard

```tsx
import { cn } from "@/lib/utils"
import { Marquee } from "@/registry/magicui/marquee"

const reviews = [
  {
    name: "Jack",
    username: "@jack",
    body: "I've never seen anything like this before. It's amazing. I love it.",
    img: "https://avatar.vercel.sh/jack",
  },
  {
    name: "Jill",
    username: "@jill",
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: "https://avatar.vercel.sh/jill",
  },
  {
    name: "John",
    username: "@john",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/john",
  },
  {
    name: "Jane",
    username: "@jane",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/jane",
  },
  {
    name: "Jenny",
    username: "@jenny",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/jenny",
  },
  {
    name: "James",
    username: "@james",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/james",
  },
]

const firstRow = reviews.slice(0, reviews.length / 2)
const secondRow = reviews.slice(reviews.length / 2)

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string
  name: string
  username: string
  body: string
}) => {
  return (
    <figure
      className={cn(
        "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  )
}

export function MarqueeDemo() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r"></div>
      <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l"></div>
    </div>
  )
}

```

## Animated theme toggler("swipe left" for dark mode, "swipe right" for light mode)

```tsx
"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { flushSync } from "react-dom"

import { cn } from "@/components/lib/utils"

// 1. Define the possible animation types (UPDATED to include all demo types)
// NOTE: Type is renamed from 'AnimationType' to 'ThemeAnimationType' 
// to avoid conflicts if used with the demo file in the same scope, 
// though the original 'AnimationType' is kept for minimal change.
type AnimationType =
    | "none"
    | "circle-spread"
    | "round-morph"
    | "swipe-left"
    | "swipe-up"
    | "diag-down-right"
    | "fade-in-out"
    | "shrink-grow"
    | "flip-x-in"
    | "split-vertical"
    | "swipe-right"
    | "swipe-down"
    | "wave-ripple"

// 2. Interface is renamed
interface ToggleThemeProps
    extends React.ComponentPropsWithoutRef<"button"> {
    duration?: number
    animationType?: AnimationType
}

// 3. Component and export are renamed
export const ToggleTheme = ({
    className,
    duration = 400,
    animationType = "circle-spread",
    ...props
}: ToggleThemeProps) => {
    const [isDark, setIsDark] = useState(false)
    const buttonRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        const updateTheme = () => {
            setIsDark(document.documentElement.classList.contains("dark"))
        }

        updateTheme()

        const observer = new MutationObserver(updateTheme)
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        })

        return () => observer.disconnect()
    }, [])

    const toggleTheme = useCallback(async () => {
        if (!buttonRef.current) return

        // Wait for the DOM update to complete within the View Transition
        await document.startViewTransition(() => {
            flushSync(() => {
                const newTheme = !isDark
                setIsDark(newTheme)
                document.documentElement.classList.toggle("dark")
                localStorage.setItem("theme", newTheme ? "dark" : "light")
            })
        }).ready

        // Calculate coordinates and dimensions for spatial animations
        const { top, left, width, height } =
            buttonRef.current.getBoundingClientRect()
        const x = left + width / 2
        const y = top + height / 2
        const maxRadius = Math.hypot(
            Math.max(left, window.innerWidth - left),
            Math.max(top, window.innerHeight - top)
        )
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight


        // 4. Implement a switch to handle all animation types
        switch (animationType) {

            // --- Existing/Refined Types ---

            case "circle-spread":
                document.documentElement.animate(
                    {
                        clipPath: [
                            `circle(0px at ${x}px ${y}px)`,
                            `circle(${maxRadius}px at ${x}px ${y}px)`,
                        ],
                    },
                    {
                        duration,
                        easing: "ease-in-out",
                        pseudoElement: "::view-transition-new(root)",
                    }
                )
                break

            case "round-morph":
                document.documentElement.animate(
                    [
                        { opacity: 0, transform: "scale(0.8) rotate(5deg)" },
                        { opacity: 1, transform: "scale(1) rotate(0deg)" },
                    ],
                    {
                        duration: duration * 1.2,
                        easing: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
                        pseudoElement: "::view-transition-new(root)",
                    }
                )
                break

            case "swipe-left":
                document.documentElement.animate(
                    {
                        clipPath: [
                            `inset(0 0 0 ${viewportWidth}px)`,
                            `inset(0 0 0 0)`,
                        ],
                    },
                    {
                        duration,
                        easing: "cubic-bezier(0.2, 0, 0, 1)",
                        pseudoElement: "::view-transition-new(root)",
                    }
                )
                break

            case "swipe-up":
                document.documentElement.animate(
                    {
                        clipPath: [
                            `inset(${viewportHeight}px 0 0 0)`,
                            `inset(0 0 0 0)`,
                        ],
                    },
                    {
                        duration,
                        easing: "cubic-bezier(0.2, 0, 0, 1)",
                        pseudoElement: "::view-transition-new(root)",
                    }
                )
                break


            // --- New Advanced Types ---

            case "diag-down-right":
                document.documentElement.animate(
                    {
                        clipPath: [
                            `polygon(0 0, 0 0, 0 0, 0 0)`,
                            `polygon(0 0, 100% 0, 100% 100%, 0 100%)`,
                        ],
                    },
                    {
                        duration: duration * 1.5,
                        easing: "cubic-bezier(0.4, 0, 0.2, 1)",
                        pseudoElement: "::view-transition-new(root)",
                    }
                )
                break

            case "fade-in-out":
                document.documentElement.animate(
                    {
                        opacity: [0, 1],
                    },
                    {
                        duration: duration * 0.5,
                        easing: "ease-in-out",
                        pseudoElement: "::view-transition-new(root)",
                    }
                )
                break

            case "shrink-grow":
                document.documentElement.animate(
                    [
                        { transform: "scale(0.9)", opacity: 0 },
                        { transform: "scale(1)", opacity: 1 },
                    ],
                    {
                        duration: duration * 1.2,
                        easing: "cubic-bezier(0.19, 1, 0.22, 1)",
                        pseudoElement: "::view-transition-new(root)",
                    }
                )
                document.documentElement.animate(
                    [
                        { transform: "scale(1)", opacity: 1 },
                        { transform: "scale(1.05)", opacity: 0 },
                    ],
                    {
                        duration: duration * 1.2,
                        easing: "cubic-bezier(0.19, 1, 0.22, 1)",
                        pseudoElement: "::view-transition-old(root)",
                    }
                )
                break

            case "flip-x-in":
                const styleElement = document.createElement('style');
                styleElement.textContent = `
                    ::view-transition-group(root) { perspective: 1000px; }
                    ::view-transition-old(root) { transform-origin: center; animation: flip-out 400ms forwards; }
                    ::view-transition-new(root) { transform-origin: center; animation: flip-in 400ms forwards; }
                    
                    @keyframes flip-out { from { transform: rotateY(0deg); opacity: 1; } to { transform: rotateY(-90deg); opacity: 0; } }
                    @keyframes flip-in { from { transform: rotateY(90deg); opacity: 0; } to { transform: rotateY(0deg); opacity: 1; } }
                `;
                document.head.appendChild(styleElement);
                break

            case "split-vertical":
                document.documentElement.animate(
                    [{ opacity: 0 }, { opacity: 1 }],
                    {
                        duration: duration * 0.75,
                        easing: "ease-in",
                        pseudoElement: "::view-transition-new(root)",
                    }
                )
                document.documentElement.animate(
                    [
                        { clipPath: 'inset(0 0 0 0)', transform: 'none' },
                        { clipPath: 'inset(0 40% 0 40%)', transform: 'scale(1.2)' },
                        { clipPath: 'inset(0 50% 0 50%)', transform: 'scale(1)' },
                    ],
                    {
                        duration: duration * 1.5,
                        easing: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
                        pseudoElement: "::view-transition-old(root)",
                    }
                )
                break

            // --- IMPLEMENTATION FOR MISSING TYPES ---

            case "swipe-right":
                document.documentElement.animate(
                    {
                        clipPath: [
                            `inset(0 ${viewportWidth}px 0 0)`,
                            `inset(0 0 0 0)`,
                        ],
                    },
                    {
                        duration,
                        easing: "cubic-bezier(0.2, 0, 0, 1)",
                        pseudoElement: "::view-transition-new(root)",
                    }
                )
                break

            case "swipe-down":
                document.documentElement.animate(
                    {
                        clipPath: [
                            `inset(0 0 ${viewportHeight}px 0)`,
                            `inset(0 0 0 0)`,
                        ],
                    },
                    {
                        duration,
                        easing: "cubic-bezier(0.2, 0, 0, 1)",
                        pseudoElement: "::view-transition-new(root)",
                    }
                )
                break

            case "wave-ripple":
                document.documentElement.animate(
                    {
                        clipPath: [
                            `circle(0% at 50% 50%)`,
                            `circle(${maxRadius}px at 50% 50%)`,
                        ],
                    },
                    {
                        duration: duration * 1.5,
                        easing: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
                        pseudoElement: "::view-transition-new(root)",
                    }
                )
                break

            case "none":
            default:
                // No custom animation runs
                break
        }

    }, [isDark, duration, animationType])

    return (
        <>
            <button
                ref={buttonRef}
                onClick={toggleTheme}
                className={cn(
                    "p-2 rounded-full transition-colors duration-300",
                    isDark ? "hover:text-amber-400" : "hover:text-primarylw",
                    className
                )}
                {...props}
            >
                {isDark ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
            </button>

            {/* This inline <style> block is necessary to override the default 
                view transition animation for all JS-based effects.
            */}
            {animationType !== 'flip-x-in' && (
                <style
                    dangerouslySetInnerHTML={{
                        __html: `
                            ::view-transition-old(root),
                            ::view-transition-new(root) {
                                animation: none;
                                mix-blend-mode: normal;
                            }
                        `,
                    }}
                />
            )}
        </>
    )
}

```

## Draggable Reorder List(for tasks)

```tsx
/*Ensure you have installed the package
or read our installation document. (go to lightswind.com/components/Installation)
npm i lightswind@latest*/

"use client";

import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  Reorder,
  useDragControls,
} from "framer-motion";
import { GripVertical, X, Plus } from "lucide-react";
import { cn } from "@/components/lib/utils";

export interface ReorderItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

interface DraggableReorderListProps {
  /** Initial items */
  items: ReorderItem[];
  /** Callback with new order when reordered */
  onReorder?: (items: ReorderItem[]) => void;
  /** Allow removing items */
  removable?: boolean;
  /** Additional classes */
  className?: string;
}

function Item({
  item,
  onRemove,
  removable,
}: {
  item: ReorderItem;
  onRemove: (id: string) => void;
  removable: boolean;
}) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={item}
      id={item.id}
      dragListener={false}
      dragControls={dragControls}
      className="relative"
    >
      <motion.div
        layout
        initial={{ opacity: 0, y: -8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
        whileDrag={{
          scale: 1.03,
          boxShadow: "0 16px 40px rgba(0,0,0,0.15)",
          zIndex: 50,
        }}
        transition={{ type: "spring", stiffness: 350, damping: 30 }}
        onPointerDown={(e) => e.preventDefault()}
        className={cn(
          "flex items-center gap-3 rounded-xl border bg-background px-4 py-3",
          "shadow-sm hover:shadow-md transition-shadow cursor-default select-none"
        )}
      >
        {/* Drag Handle */}
        <motion.div
          onPointerDown={(e) => dragControls.start(e)}
          className="flex-shrink-0 cursor-grab active:cursor-grabbing touch-none text-muted-foreground/40 hover:text-muted-foreground transition-colors"
          whileHover={{ scale: 1.1 }}
        >
          <GripVertical className="h-4 w-4" />
        </motion.div>

        {/* Icon */}
        {item.icon && (
          <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            {item.icon}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0 pointer-events-none">
          <p className="text-sm font-medium truncate select-none text-foreground">{item.label}</p>
          {item.description && (
            <p className="text-xs text-muted-foreground truncate mt-0.5 select-none">
              {item.description}
            </p>
          )}
        </div>

        {/* Remove Button */}
        {removable && (
          <motion.button
            type="button"
            onClick={() => onRemove(item.id)}
            aria-label={`Remove ${item.label}`}
            className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-colors focus:outline-none"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="h-3.5 w-3.5" />
          </motion.button>
        )}
      </motion.div>
    </Reorder.Item>
  );
}

export function DraggableReorderList({
  items: initialItems,
  onReorder,
  removable = true,
  className,
}: DraggableReorderListProps) {
  const [items, setItems] = useState<ReorderItem[]>(initialItems);

  const handleReorder = (newOrder: ReorderItem[]) => {
    setItems(newOrder);
    onReorder?.(newOrder);
  };

  const handleRemove = (id: string) => {
    const next = items.filter((item) => item.id !== id);
    setItems(next);
    onReorder?.(next);
  };

  return (
    <div className={cn("w-full select-none", className)} style={{ userSelect: "none" }}>
      <Reorder.Group
        axis="y"
        values={items}
        onReorder={handleReorder}
        className="flex flex-col gap-2"
        as="div"
      >
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <Item
              key={item.id}
              item={item}
              onRemove={handleRemove}
              removable={removable}
            />
          ))}
        </AnimatePresence>
      </Reorder.Group>

      {items.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center rounded-xl border border-dashed py-10 text-muted-foreground gap-2"
        >
          <Plus className="h-5 w-5 opacity-40" />
          <p className="text-sm">All items removed</p>
        </motion.div>
      )}
    </div>
  );
}

```

## Expandable Speed Dial

```tsx
/*Ensure you have installed the package
or read our installation document. (go to lightswind.com/components/Installation)
npm i lightswind@latest*/

"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";
import { cn } from "@/components/lib/utils";

export interface SpeedDialAction {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

interface ExpandableSpeedDialProps {
  /** The actions to display when expanded */
  actions: SpeedDialAction[];
  /** The direction to expand the speed dial */
  direction?: "up" | "down" | "left" | "right";
  /** Optional classname for the container */
  className?: string;
  /** Size of the main button */
  size?: "sm" | "md" | "lg";
}

export function ExpandableSpeedDial({
  actions,
  direction = "up",
  className,
  size = "md",
}: ExpandableSpeedDialProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  const sizes = {
    sm: "h-10 w-10",
    md: "h-12 w-12",
    lg: "h-14 w-14",
  };

  const actionSizes = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  const getDirectionClasses = () => {
    switch (direction) {
      case "up":
        return "bottom-full mb-3 flex-col-reverse left-1/2 -translate-x-1/2";
      case "down":
        return "top-full mt-3 flex-col left-1/2 -translate-x-1/2";
      case "left":
        return "right-full mr-3 flex-row-reverse top-1/2 -translate-y-1/2";
      case "right":
        return "left-full ml-3 flex-row top-1/2 -translate-y-1/2";
      default:
        return "bottom-full mb-3 flex-col-reverse left-1/2 -translate-x-1/2";
    }
  };

  const getMotionVariants = (index: number) => {
    const delay = index * 0.05;
    const distance = 15;
    
    let x = 0;
    let y = 0;
    
    switch (direction) {
      case "up": y = distance; break;
      case "down": y = -distance; break;
      case "left": x = distance; break;
      case "right": x = -distance; break;
    }

    return {
      hidden: { opacity: 0, scale: 0.5, x, y },
      visible: { 
        opacity: 1, 
        scale: 1, 
        x: 0, 
        y: 0,
        transition: {
          type: "spring" as const,
          stiffness: 300,
          damping: 20,
          delay
        }
      },
      exit: { 
        opacity: 0, 
        scale: 0.5, 
        x, 
        y,
        transition: {
          duration: 0.2,
          delay: (actions.length - 1 - index) * 0.05
        }
      }
    };
  };

  return (
    <div className={cn("relative z-50", className)}>
      <AnimatePresence>
        {isOpen && (
          <div className={cn("absolute flex gap-3", getDirectionClasses())}>
            {actions.map((action, index) => (
              <motion.button
                key={action.label}
                variants={getMotionVariants(index)}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={() => {
                  action.onClick();
                  setIsOpen(false);
                }}
                className={cn(
                  "relative flex items-center justify-center rounded-full bg-background shadow-md border hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  actionSizes[size]
                )}
                title={action.label}
                aria-label={action.label}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {action.icon}
                
                {/* Tooltip for horizontal/vertical depending on direction */}
                {(direction === "up" || direction === "down") && (
                  <span className="absolute right-full mr-3 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs text-background opacity-0 transition-opacity group-hover:opacity-100 hidden sm:block">
                    {action.label}
                  </span>
                )}
                {(direction === "left" || direction === "right") && (
                  <span className="absolute bottom-full mb-3 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs text-background opacity-0 transition-opacity group-hover:opacity-100 hidden sm:block">
                    {action.label}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={toggleOpen}
        className={cn(
          "flex items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          sizes[size]
        )}
        aria-label="Toggle Speed Dial"
        whileTap={{ scale: 0.9 }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 135 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="flex items-center justify-center"
        >
          <Plus className={size === "sm" ? "h-5 w-5" : size === "lg" ? "h-8 w-8" : "h-6 w-6"} />
        </motion.div>
      </motion.button>
    </div>
  );
}

```

## Slide To Confirm(for send email after selecting lecturer)

```tsx
/*Ensure you have installed the package
or read our installation document. (go to lightswind.com/components/Installation)
npm i lightswind@latest*/

"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useAnimation, useMotionValue, useTransform } from "framer-motion";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { cn } from "@/components/lib/utils";

interface SlideToConfirmProps {
  /** Text to show before sliding */
  text?: string;
  /** Text to show after confirming */
  successText?: string;
  /** Async callback fired when slide completes */
  onConfirm: () => Promise<void> | void;
  /** Width of the component */
  width?: number;
  /** Height of the component */
  height?: number;
  /** Additional classes for the container */
  className?: string;
}

export function SlideToConfirm({
  text = "Slide to confirm",
  successText = "Confirmed",
  onConfirm,
  width = 320,
  height = 56,
  className,
}: SlideToConfirmProps) {
  const [state, setState] = useState<"idle" | "loading" | "success">("idle");
  const containerRef = useRef<HTMLDivElement>(null);
  const trackWidth = width - height; // Total drag distance
  const thumbSize = height - 8; // Margin inside

  const x = useMotionValue(0);
  const controls = useAnimation();

  // Opacity of the text fades out as you drag
  const textOpacity = useTransform(x, [0, trackWidth * 0.5], [1, 0]);
  // Background gradient progresses as you drag
  const bgWidth = useTransform(x, [0, trackWidth], [height, width]);

  const handleDragEnd = async () => {
    if (state !== "idle") return;

    if (x.get() >= trackWidth * 0.9) {
      // Completed drag
      controls.start({ x: trackWidth, transition: { type: "spring", stiffness: 400, damping: 30 } });
      setState("loading");

      try {
        await onConfirm();
        setState("success");
      } catch (error) {
        // If error, reset
        setState("idle");
        controls.start({ x: 0, transition: { type: "spring", stiffness: 400, damping: 30 } });
      }
    } else {
      // Reset if not fully dragged
      controls.start({ x: 0, transition: { type: "spring", stiffness: 400, damping: 30 } });
    }
  };

  const handleReset = () => {
    if (state === "success") {
      setState("idle");
      x.set(0);
      controls.start({ x: 0 });
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-full border bg-muted select-none",
        state === "success" ? "cursor-pointer border-green-500/50" : "",
        className
      )}
      style={{
        width,
        height,
      }}
      onClick={handleReset}
    >
      {/* Background fill transitioning to green on success */}
      <motion.div
        className="absolute left-0 top-0 h-full rounded-full"
        style={{
          width: state === "success" ? width : bgWidth,
          backgroundColor: state === "success" ? "#22c55e" : "var(--primary)",
          opacity: state === "success" ? 0.1 : 0.05,
        }}
        animate={{ width: state === "success" ? width : undefined }}
        transition={{ duration: 0.3 }}
      />

      {/* Main Text */}
      <motion.span
        className={cn(
          "absolute font-medium text-sm z-0",
          state === "success" ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
        )}
        style={{ opacity: state === "idle" ? textOpacity : 0 }}
      >
        {text}
      </motion.span>

      {/* Success Text */}
      <motion.span
        className="absolute font-medium text-sm z-0 text-green-600 dark:text-green-400"
        initial={{ opacity: 0, y: 10 }}
        animate={{
          opacity: state === "success" ? 1 : 0,
          y: state === "success" ? 0 : 10
        }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {successText}
      </motion.span>

      {/* Draggable Thumb */}
      <motion.div
        drag={state === "idle" ? "x" : false}
        dragConstraints={{ left: 0, right: trackWidth }}
        dragElastic={0.05}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        className={cn(
          "absolute left-1 z-10 flex cursor-grab items-center justify-center rounded-full bg-background shadow-md active:cursor-grabbing",
          state !== "idle" && "cursor-default"
        )}

        initial={false}
        whileTap={{ scale: state === "idle" ? 0.95 : 1 }}
        animate={state === "success" ? { x: trackWidth, backgroundColor: "#22c55e", color: "white" } : controls}
        style={{
          width: thumbSize,
          height: thumbSize,
          x,
        }}
      >
        <motion.div
          animate={{
            rotate: state === "loading" ? 360 : 0,
            scale: state === "idle" ? 1 : 0,
            opacity: state === "idle" ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
          className="absolute"
        >
          <ArrowRight className="h-5 w-5 opacity-70" />
        </motion.div>

        <motion.div
          animate={{
            scale: state === "loading" ? 1 : 0,
            opacity: state === "loading" ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
          className="absolute flex h-full w-full items-center justify-center"
        >
          {/* Refined macOS Style Spinner (12 Spokes) */}
          <div className="relative h-[20px] w-[20px]">
            {[...Array(12)].map((_, i) => (
              <motion.span
                key={i}
                className="absolute left-[9px] top-0 h-[5.5px] w-[1.8px] rounded-full bg-foreground"
                style={{
                  rotate: i * 30,
                  transformOrigin: "center 10px",
                }}
                animate={{
                  opacity: [0.15, 1, 0.15],
                }}
                transition={{
                  duration: 1.1,
                  repeat: Infinity,
                  delay: i * 0.091,
                  ease: "linear",
                }}
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          animate={{
            scale: state === "success" ? 1 : 0,
            opacity: state === "success" ? 1 : 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="absolute text-white"
        >
          <Check className="h-5 w-5" />
        </motion.div>
      </motion.div>
    </div>
  );
}

```

## Hanging ID card(For profile page)

```tsx
"use client";

import React, { useRef, useEffect, useCallback, useState } from "react";
import { cn } from "@/components/lib/utils";

// ─── Physics constants ────────────────────────────────────────────────────────
// ─── Physics constants ────────────────────────────────────────────────────────
const SPRING_K = 0;          // No spring! A real pendulum relies only on gravity
const DAMPING  = 0.9;        // Light air resistance so it swings naturally
const GRAVITY  = 3000;       // Gravity scalar for satisfying snappy momentum
const MASS     = 1;

interface CardPhysicsState {
  angle:  number;   // radians from vertical
  vel:    number;   // angular velocity  rad/s
}

export interface HangingIdCardProps {
  children?: React.ReactNode;
  ropeLength?: number;
  ropeColor?: string;
  className?: string;
  name?: string;
  role?: string;
  badgeId?: string;
  accentColor?: string;
}

// ─── SVG Thick Lanyard / Ribbon ──────────────────────────────────────────────────────
const Lanyard = ({ length, color }: { length: number; color: string }) => {
  return (
    <svg 
      width="30" 
      height={length} 
      viewBox={`0 0 30 ${length}`} 
      style={{ display: "block", margin: "0 auto", overflow: "visible" }}
    >
      {/* Anchor ring */}
      <circle cx="15" cy="0" r="5" fill={color} />
      
      {/* Left thick ribbon */}
      <path d={`M 13 0 L 10 ${length}`} stroke={color} strokeWidth="6" opacity="0.9" />
      
      {/* Right thick ribbon */}
      <path d={`M 17 0 L 20 ${length}`} stroke={color} strokeWidth="6" opacity="0.9" />
      
      {/* Metal clip part connecting to card */}
      <rect x="10" y={length - 6} width="10" height="8" rx="2" fill="#94a3b8" />
      <circle cx="15" cy={length + 2} r="3" fill="#e2e8f0" />
    </svg>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export const HangingIdCard = ({
  children,
  ropeLength  = 130, // Increased height for a more prominent drop
  ropeColor   = "#4a5568",
  className,
  name        = "John Lightswind",
  role        = "UI Developer",
  badgeId     = "LW-2025",
  accentColor = "#173eff",
}: HangingIdCardProps) => {
  const physRef      = useRef<CardPhysicsState>({ angle: 0, vel: 0 });
  const rafRef       = useRef<number | null>(null);
  const prevTimeRef  = useRef<number | null>(null);
  const prevAngleRef = useRef<number>(0);
  const isDraggingRef= useRef(false);

  const [angle, setAngle] = useState(0);
  const [isDragState, setIsDragState] = useState(false);
  const dragStartX   = useRef(0);
  const dragAngle0   = useRef(0);

  // ── Physics loop ────────────────────────────────────────────────────────────
  const tick = useCallback((now: number) => {
    if (prevTimeRef.current === null) { prevTimeRef.current = now; }
    const dt = Math.min((now - prevTimeRef.current) / 1000, 0.05); // cap at 50ms
    prevTimeRef.current = now;

    const s = physRef.current;
    if (!isDraggingRef.current) {
      // Realistic pendulum: L is approximate center of mass
      const L = ropeLength + 100; 
      const torque =
        -(GRAVITY / L)    * Math.sin(s.angle) -
        (DAMPING  / MASS) * s.vel             -
        (SPRING_K / MASS) * s.angle;

      s.vel   += torque * dt;
      s.angle += s.vel  * dt;

      setAngle(s.angle);

      if (Math.abs(s.angle) > 0.001 || Math.abs(s.vel) > 0.001) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        // settled perfectly at bottom
        s.angle = 0; s.vel = 0;
        setAngle(0);
      }
    } else {
      // Track velocity while dragging so we can "flick" it
      if (dt > 0) {
        s.vel = (s.angle - prevAngleRef.current) / dt;
      }
      prevAngleRef.current = s.angle;
      rafRef.current = requestAnimationFrame(tick);
    }
  }, [ropeLength]);

  const startPhysics = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    prevTimeRef.current = null;
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  // ── Pointer events ──────────────────────────────────────────────────────────
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    isDraggingRef.current = true;
    setIsDragState(true);
    dragStartX.current   = e.clientX;
    dragAngle0.current   = physRef.current.angle;
    prevAngleRef.current = physRef.current.angle;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    prevTimeRef.current = null;
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartX.current;
    const L = ropeLength + 100; 
    // angle = asin(dx / L) but clamped. Subtracted to match mouse drag direction for hanging pendulum.
    const newAngle = dragAngle0.current - dx / L;
    const clamped  = Math.max(-1.4, Math.min(1.4, newAngle));
    physRef.current.angle = clamped;
    setAngle(clamped);
  }, [ropeLength]);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    isDraggingRef.current = false;
    setIsDragState(false);
  }, []);

  // ── Click impulse (tap) ─────────────────────────────────────────────────────
  const onCardClick = useCallback(() => {
    if (Math.abs(physRef.current.vel) < 0.1 && Math.abs(physRef.current.angle) < 0.05) {
      physRef.current.vel = 4.0; // Give it a satisfying push
      startPhysics();
    }
  }, [startPhysics]);

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  const cardRotateDeg = angle * (180 / Math.PI);

  return (
    <div
      className={cn("flex flex-col items-center select-none", className)}
      style={{ touchAction: "none" }}
    >
      {/* Ceiling anchor */}
      <div
        className="w-3 h-3 rounded-full shadow-md z-10 relative"
        style={{ background: accentColor }}
      />

      {/* The Pendulum Assembly (Rope + Card) */}
      <div 
        className="flex flex-col items-center cursor-grab active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onClick={onCardClick}
        style={{
          transform: `rotate(${cardRotateDeg}deg)`,
          transformOrigin: "top center",
          willChange: "transform",
          marginTop: "-6px" // slight overlap with anchor
        }}
      >
        {/* Lanyard */}
        <div style={{ pointerEvents: "none" }}>
          <Lanyard length={ropeLength} color={ropeColor} />
        </div>

        {/* ID Card */}
        <div className="relative w-52 rounded-2xl overflow-hidden shadow-2xl border border-white/20 dark:border-white/10 bg-white dark:bg-zinc-900 pointer-events-none mt-[-2px]">
          {children ?? (
            <div className="flex flex-col h-full">
              {/* Card header banner */}
              <div
                className="px-4 py-3 flex flex-col items-center gap-1"
                style={{ background: `linear-gradient(135deg, ${accentColor} 0%, #3758f9 100%)` }}
              >
                <p className="text-[9px] font-bold tracking-[0.25em] text-white/70 uppercase">
                  Lightswind UI
                </p>
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm mt-1 shadow-inner">
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/codewithmuhilandb.appspot.com/o/uploads%2Flightwind-logo.png?alt=media&token=6ba956f1-994c-46ca-9eda-6e46b5662eb9"
                    alt="logo"
                    className="h-9 w-9 object-contain filter brightness-0 invert"
                  />
                </div>
              </div>

              {/* Card body */}
              <div className="bg-white dark:bg-zinc-900 px-4 py-4 flex flex-col items-center gap-2 flex-1">
                <p className="text-sm font-bold text-zinc-900 dark:text-white text-center leading-tight">
                  {name}
                </p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                  {role}
                </p>

                <div className="my-2 w-full border-t border-zinc-100 dark:border-zinc-800" />

                {/* Barcode mock */}
                <div className="flex gap-[2px] items-end h-7 px-1">
                  {Array.from({ length: 28 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-zinc-800 dark:bg-zinc-200 rounded-[1px]"
                      style={{
                        width: i % 3 === 0 ? "3px" : "1.5px",
                        height: `${50 + Math.sin(i * 1.3) * 35}%`,
                      }}
                    />
                  ))}
                </div>

                <p
                  className="text-[10px] font-mono font-bold mt-1 tracking-widest"
                  style={{ color: accentColor }}
                >
                  {badgeId}
                </p>

                {/* Status badge */}
                <div
                  className="mt-1 px-3 py-0.5 rounded-full text-[9px] font-bold text-white uppercase tracking-widest"
                  style={{ background: accentColor }}
                >
                  ACTIVE
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Drag hint */}
      <p className="mt-8 text-[11px] text-zinc-400 dark:text-zinc-600 font-medium select-none pointer-events-none">
        Drag or click the card
      </p>
    </div>
  );
};

export default HangingIdCard;


```

## Navbar

```tsx
"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
}

export function NavBar({ items, className }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0].name)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div
      className={cn(
        "fixed bottom-0 sm:top-0 left-1/2 -translate-x-1/2 z-50 mb-6 sm:pt-6",
        className,
      )}
    >
      <div className="flex items-center gap-3 bg-background/5 border border-border backdrop-blur-lg py-1 px-1 rounded-full shadow-lg">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.name

          return (
            <Link
              key={item.name}
              href={item.url}
              onClick={() => setActiveTab(item.name)}
              className={cn(
                "relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-full transition-colors",
                "text-foreground/80 hover:text-primary",
                isActive && "bg-muted text-primary",
              )}
            >
              <span className="hidden md:inline">{item.name}</span>
              <span className="md:hidden">
                <Icon size={18} strokeWidth={2.5} />
              </span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full bg-primary/5 rounded-full -z-10"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full">
                    <div className="absolute w-12 h-6 bg-primary/20 rounded-full blur-md -top-2 -left-2" />
                    <div className="absolute w-8 h-6 bg-primary/20 rounded-full blur-md -top-1" />
                    <div className="absolute w-4 h-4 bg-primary/20 rounded-full blur-sm top-0 left-2" />
                  </div>
                </motion.div>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}


```

## Confetti when user finish task

```tsx
import React, { useEffect, useState, useRef } from "react";
import { cn } from "@/components/lib/utils";
import { Loader2 } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

// Confetti type
type ConfettiOptions = {
  particleCount?: number;
  spread?: number;
  startVelocity?: number;
  decay?: number;
  gravity?: number;
  drift?: number;
  ticks?: number;
  origin?: {
    x?: number;
    y?: number;
  };
  colors?: string[];
  shapes?: string[];
  scalar?: number;
  zIndex?: number;
  disableForReducedMotion?: boolean;
};

// Global declaration
declare global {
  interface Window {
    confetti?: (options?: ConfettiOptions) => void;
  }
}

// Variants for button styling
const confettiButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
        outline: "border bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gradient: "bg-gradient-to-r from-primarylw to-purple-600 text-white hover:from-primarylw hover:to-purple-700",
      },
      size: {
        default: "h-10 px-4 py-2 rounded-md",
        sm: "h-8 px-3 py-1 rounded-md text-sm",
        lg: "h-12 px-6 py-3 rounded-md text-lg",
        xl: "h-14 px-8 py-4 rounded-md text-xl",
        icon: "h-10 w-10 rounded-full",
        pill: "h-10 px-6 py-2 rounded-full",
      },
      animation: {
        none: "",
        pulse: "animate-pulse",
        bounce: "hover:animate-bounce",
        scale: "active:scale-95",
        shake: "hover:animate-[wiggle_0.3s_ease-in-out]",
        glow: "hover:shadow-[0_0_15px_rgba(255,255,255,0.5)]",
        expand: "active:scale-110 transition-transform",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "scale",
    },
  }
);

export interface ConfettiButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof confettiButtonVariants> {
  asChild?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  loading?: boolean;
  confettiOptions?: ConfettiOptions;
  autoConfetti?: boolean;
  triggerOnHover?: boolean;
}

const ConfettiButton = React.forwardRef<HTMLButtonElement, ConfettiButtonProps>(
  (
    {
      className,
      variant,
      size,
      animation,
      asChild = false,
      children,
      icon,
      iconPosition = "left",
      loading = false,
      confettiOptions = {
        particleCount: 100,
        spread: 70,
      },
      autoConfetti = false,
      triggerOnHover = false,
      ...props
    },
    ref
  ) => {
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    // Load confetti script dynamically
    useEffect(() => {
      if (!window.confetti) {
        const script = document.createElement("script");
        script.src =
          "https://cdn.jsdelivr.net/npm/canvas-confetti@1.4.0/dist/confetti.browser.min.js";
        script.async = true;
        script.onload = () => setScriptLoaded(true);
        document.body.appendChild(script);

        return () => {
          if (script.parentNode) {
            script.parentNode.removeChild(script);
          }
        };
      } else {
        setScriptLoaded(true);
      }
    }, []);

    // Auto confetti on mount if needed
    useEffect(() => {
      if (scriptLoaded && autoConfetti && window.confetti && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;

        window.confetti({
          ...confettiOptions,
          origin: { x, y },
        });
      }
    }, [scriptLoaded, autoConfetti, confettiOptions]);

    const triggerConfetti = () => {
      if (scriptLoaded && window.confetti && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;

        window.confetti({
          ...confettiOptions,
          origin: { x, y },
        });
      }
    };

    return (
      <button
        ref={(node) => {
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
          buttonRef.current = node;
        }}
        className={cn(confettiButtonVariants({ variant, size, animation }), className)}
        onClick={(e) => {
          if (scriptLoaded) {
            triggerConfetti();
          }
          props.onClick?.(e);
        }}
        onMouseEnter={triggerOnHover ? () => triggerConfetti() : undefined}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        {!loading && icon && iconPosition === "left" && (
          <span className="mr-1">{icon}</span>
        )}
        {children}
        {!loading && icon && iconPosition === "right" && (
          <span className="ml-1">{icon}</span>
        )}
      </button>
    );
  }
);

ConfettiButton.displayName = "ConfettiButton";

export { ConfettiButton, confettiButtonVariants };

```

## Hamburger

```tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/components/lib/utils";
import { Menu, X } from "lucide-react";

export interface MenuItem {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}

export interface HamburgerMenuOverlayProps {
  /** Array of menu items */
  items: MenuItem[];
  /** Button position from top */
  buttonTop?: string;
  /** Button position from left */
  buttonLeft?: string;
  /** Button size */
  buttonSize?: "sm" | "md" | "lg";
  /** Button background color */
  buttonColor?: string;
  /** Overlay background color/gradient */
  overlayBackground?: string;
  /** Menu text color */
  textColor?: string;
  /** Menu font size */
  fontSize?: "sm" | "md" | "lg" | "xl" | "2xl";
  /** Font family */
  fontFamily?: string;
  /** Font weight */
  fontWeight?: "normal" | "medium" | "semibold" | "bold";
  /** Animation duration in seconds */
  animationDuration?: number;
  /** Stagger delay between menu items */
  staggerDelay?: number;
  /** Menu items alignment */
  menuAlignment?: "left" | "center" | "right";
  /** Custom class for container */
  className?: string;
  /** Custom class for button */
  buttonClassName?: string;
  /** Custom class for menu items */
  menuItemClassName?: string;
  /** Disable overlay close on item click */
  keepOpenOnItemClick?: boolean;
  /** Custom button content */
  customButton?: React.ReactNode;
  /** ARIA label for accessibility */
  ariaLabel?: string;
  /** Callback when menu opens */
  onOpen?: () => void;
  /** Callback when menu closes */
  onClose?: () => void;
  /** Menu items layout direction */
  menuDirection?: "vertical" | "horizontal";
  /** Enable blur backdrop */
  enableBlur?: boolean;
  /** Z-index for overlay */
  zIndex?: number;
}

export const HamburgerMenuOverlay: React.FC<HamburgerMenuOverlayProps> = ({
  items = [],
  buttonTop = "60px",
  buttonLeft = "60px",
  buttonSize = "md",
  buttonColor = "#6c8cff",
  overlayBackground = "#6c8cff",
  textColor = "#ffffff",
  fontSize = "md",
  fontFamily = '"Krona One", monospace',
  fontWeight = "bold",
  animationDuration = 1.5,
  staggerDelay = 0.1,
  menuAlignment = "left",
  className,
  buttonClassName,
  menuItemClassName,
  keepOpenOnItemClick = false,
  customButton,
  ariaLabel = "Navigation menu",
  onOpen,
  onClose,
  menuDirection = "vertical",
  enableBlur = false,
  zIndex = 1000,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const buttonSizes = {
    sm: "w-10 h-10",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const fontSizes = {
    sm: "text-2xl md:text-3xl",
    md: "text-3xl md:text-4xl",
    lg: "text-4xl md:text-5xl",
    xl: "text-5xl md:text-6xl",
    "2xl": "text-6xl md:text-7xl",
  };

  const toggleMenu = () => {
    const newState = !isOpen;
    setIsOpen(newState);

    if (newState) {
      onOpen?.();
    } else {
      onClose?.();
    }
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.onClick) {
      item.onClick();
    }

    if (item.href && !item.onClick) {
      window.location.href = item.href;
    }

    if (!keepOpenOnItemClick) {
      setIsOpen(false);
      onClose?.();
    }
  };

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  return (
    <div ref={containerRef} className={cn("absolute w-full h-full", className)}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Krona+One:wght@400&display=swap');
          
          .hamburger-overlay-${zIndex} {
            position: relative;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            display: flex;
            justify-content: start;
            align-items: center;
            background: ${overlayBackground};
            z-index: ${zIndex};
            clip-path: circle(0px at ${buttonLeft} ${buttonTop});
            transition: clip-path ${animationDuration}s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            ${enableBlur ? "backdrop-filter: blur(10px);" : ""}
          }
          
          .hamburger-overlay-${zIndex}.open {
            clip-path: circle(150% at ${buttonLeft} ${buttonTop});
          }
          
          .hamburger-button-${zIndex} {
            position: absolute;
            left: ${buttonLeft};
            top: ${buttonTop};
            transform: translate(-50%, -50%);
            border-radius: 20px;
            z-index: ${zIndex + 1};
            background: ${buttonColor};
            border: none;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          
          .hamburger-button-${zIndex}:hover {
            transform: translate(-50%, -50%) scale(1.1);
          }
          
          .hamburger-button-${zIndex}:focus {
            outline: 2px solid ${textColor};
            outline-offset: 2px;
          }
          
          .menu-items-${zIndex} {
            ${menuDirection === "horizontal" ? "display: flex; flex-wrap: wrap; gap: 1rem;" : ""}
            ${menuAlignment === "center" ? "text-align: center;" : ""}
            ${menuAlignment === "right" ? "text-align: right;" : ""}
          }
          
          .menu-item-${zIndex} {
            position: relative;
            list-style: none;
            padding: 0.5rem 0;
            cursor: pointer;
            transform: translateX(-200px);
            opacity: 0;
            transition: all 0.3s ease;
            
            font-weight: ${fontWeight};
            color: ${textColor};
            ${menuDirection === "horizontal" ? "display: inline-block; margin: 0 1rem;" : ""}
          }
          
          .menu-item-${zIndex}.visible {
            transform: translateX(0);
            opacity: 1;
          }
          
          .menu-item-${zIndex}::before {
            content: "";
            position: absolute;
            left: -20%;
            top: 50%;
            transform: translate(-50%, -50%) translateX(-50%);
            width: 25%;
            height: 8px;
            border-radius: 10px;
            background: ${textColor};
            opacity: 0;
            transition: all 0.25s ease;
            pointer-events: none;
          }
          
          .menu-item-${zIndex}:hover::before {
            opacity: 1;
            transform: translate(-50%, -50%) translateX(0);
          }
          
          .menu-item-${zIndex} span {
            opacity: 0.7;
            transition: opacity 0.25s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          
          .menu-item-${zIndex}:hover span {
            opacity: 1;
          }
          
          .menu-item-${zIndex}:focus {
            outline: 2px solid ${textColor};
            outline-offset: 2px;
            border-radius: 4px;
          }
          
          /* Mobile responsiveness */
          @media (max-width: 768px) {
            .hamburger-button-${zIndex} {
              left: 30px;
              top: 30px;
            }
            
            .hamburger-overlay-${zIndex} {
              clip-path: circle(0px at 30px 30px);
            }
            
            .hamburger-overlay-${zIndex}.open {
              clip-path: circle(150% at 30px 30px);
            }
            
            .menu-items-${zIndex} {
              padding: 1rem;
              max-height: 80vh;
              overflow-y: auto;
            }
            
            .menu-item-${zIndex} {
              padding: 1rem 0;
            }
          }
          
          @media (max-width: 480px) {
            .menu-items-${zIndex} {
              ${menuDirection === "horizontal" ? "flex-direction: column; gap: 0;" : ""}
            }
            
            .menu-item-${zIndex} {
              ${menuDirection === "horizontal" ? "display: block; margin: 0;" : ""}
            }
          }
        `}
      </style>

      {/* Navigation Overlay */}
      <div
        ref={navRef}
        className={cn(`flex flex-col items-center justify-center h-full
           hamburger-overlay-${zIndex}`, isOpen && "open")}
        aria-hidden={!isOpen}
      >
        <ul
          className={cn(
            `mt-20 menu-items-${zIndex}`,
            menuDirection === "horizontal" && "flex flex-wrap "
          )}
        >
          {items.map((item, index) => (
            <li
              key={index}
              className={cn(
                `menu-item-${zIndex}`,
                fontSizes[fontSize],
                isOpen && "visible",
                menuItemClassName
              )}
              style={{
                transitionDelay: isOpen ? `${index * staggerDelay}s` : "0s",
              }}
              onClick={() => handleItemClick(item)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleItemClick(item);
                }
              }}
              tabIndex={isOpen ? 0 : -1}
              role="button"
              aria-label={`Navigate to ${item.label}`}
            >
              <span>
                {item.icon && <span className="menu-icon">{item.icon}</span>}
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Hamburger Button */}
      <button
        className={cn(
          `hamburger-button-${zIndex}`,
          buttonSizes[buttonSize],
          buttonClassName
        )}
        onClick={toggleMenu}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        aria-controls="navigation-menu"
      >
        {customButton || (
          <div className="relative w-full h-full flex items-center justify-center">
            <Menu
              className={cn(
                "absolute transition-all duration-300",
                isOpen
                  ? "opacity-0 rotate-45 scale-0"
                  : "opacity-100 rotate-0 scale-100"
              )}
              size={buttonSize === "sm" ? 16 : buttonSize === "md" ? 20 : 24}
              color={textColor}
            />
            <X
              className={cn(
                "absolute transition-all duration-300",
                isOpen
                  ? "opacity-100 rotate-0 scale-100"
                  : "opacity-0 -rotate-45 scale-0"
              )}
              size={buttonSize === "sm" ? 16 : buttonSize === "md" ? 20 : 24}
              color={textColor}
            />
          </div>
        )}
      </button>
    </div>
  );
};

export default HamburgerMenuOverlay;

```

## Daily task check list

```tsx
"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/components/lib/utils"; // Optional utility for className merging

export type CardContent = {
  id: string | number;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  bgClass?: string;
};

type SlidingCardsProps = {
  cards: CardContent[];
  className?: string;
  cardSize?: string;
  centerIcon?: React.ReactNode;
  visibleRange?: number;
  onCardClick?: (index: number) => void;
  autoPlay?: boolean;
  autoPlayInterval?: number;
};

const SlidingCards: React.FC<SlidingCardsProps> = ({
  cards,
  className = "",
  cardSize = "w-24 h-24",
  onCardClick,
  autoPlay = false,
  autoPlayInterval = 3000,
}) => {
  const cardStackRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const cardStack = cardStackRef.current;
    if (!cardStack) return;
    cardsRef.current = Array.from(cardStack.querySelectorAll(".card"));

    let isSwiping = false;
    let startX = 0;
    let currentX = 0;
    let animationFrameId: number | null = null;

    const getDuration = () => 300;

    const getActiveCard = () => cardsRef.current[0];

    const updatePositions = () => {
      cardsRef.current.forEach((card, i) => {
        const offset = i + 1;
        card.style.zIndex = `${100 - offset}`;
        card.style.transform = `perspective(700px) translateZ(${-12 * offset}px) translateY(${7 * offset}px) translateX(0px) rotateY(0deg)`;
        card.style.opacity = `1`;
      });
    };

    const applySwipeStyles = (deltaX: number) => {
      const card = getActiveCard();
      if (!card) return;
      const rotate = deltaX * 0.2;
      const opacity = 1 - Math.min(Math.abs(deltaX) / 100, 1) * 0.75;
      card.style.transform = `perspective(700px) translateZ(-12px) translateY(7px) translateX(${deltaX}px) rotateY(${rotate}deg)`;
      card.style.opacity = `${opacity}`;
    };

    const handleStart = (clientX: number) => {
      if (isSwiping) return;
      isSwiping = true;
      startX = currentX = clientX;
      const card = getActiveCard();
      card && (card.style.transition = "none");
    };

    const handleMove = (clientX: number) => {
      if (!isSwiping) return;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        currentX = clientX;
        const deltaX = currentX - startX;
        applySwipeStyles(deltaX);
        if (Math.abs(deltaX) > 50) handleEnd();
      });
    };

    const handleEnd = () => {
      if (!isSwiping) return;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);

      const deltaX = currentX - startX;
      const threshold = 50;
      const duration = getDuration();
      const card = getActiveCard();

      if (card) {
        card.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;

        if (Math.abs(deltaX) > threshold) {
          const direction = Math.sign(deltaX);
          card.style.transform = `perspective(700px) translateZ(-12px) translateY(7px) translateX(${direction * 300}px) rotateY(${direction * 20}deg)`;

          setTimeout(() => {
            card.style.transform = `perspective(700px) translateZ(-12px) translateY(7px) translateX(${direction * 300}px) rotateY(${-direction * 20}deg)`;
          }, duration / 2);

          setTimeout(() => {
            cardsRef.current = [...cardsRef.current.slice(1), card];
            updatePositions();
          }, duration);
        } else {
          applySwipeStyles(0);
        }
      }

      isSwiping = false;
      startX = currentX = 0;
    };

    const autoSlide = () => {
        const card = getActiveCard();
        if (!card) return;
        const duration = getDuration();
        card.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;
        card.style.transform = `perspective(700px) translateZ(-12px) translateY(7px) translateX(300px) rotateY(20deg)`;
        
        setTimeout(() => {
            cardsRef.current = [...cardsRef.current.slice(1), card];
            updatePositions();
        }, duration);
    };

    let intervalId: NodeJS.Timeout | null = null;
    if (autoPlay) {
        intervalId = setInterval(autoSlide, autoPlayInterval);
    }

    cardStack.addEventListener("pointerdown", (e) => handleStart(e.clientX));
    cardStack.addEventListener("pointermove", (e) => handleMove(e.clientX));
    cardStack.addEventListener("pointerup", handleEnd);

    updatePositions();

    return () => {
        if (intervalId) clearInterval(intervalId);
    };
  }, [autoPlay, autoPlayInterval]);

  return (
    <section
      ref={cardStackRef}
      className={cn(
        "relative w-64 h-[22rem] grid place-content-center touch-none select-none",
        className
      )}
    >
      {cards.map(({ id, icon, bgClass = "bg-gradient-to-br from-pink-300 to-orange-200" }, index) => (
        <article
          key={id}
          onClick={() => onCardClick?.(index)}
          className={cn(
            "card absolute inset-4 grid place-content-center rounded-xl border border-gray-400 shadow-md cursor-grab transition-transform ease-in-out",
            bgClass
          )}
        >
          <span className={cn("aspect-square grid place-content-center", cardSize)}>
            {icon || (
              <svg
                className="w-full h-full fill-white drop-shadow-md"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
              >
                <circle cx="8" cy="8" r="6" />
              </svg>
            )}
          </span>
        </article>
      ))}
    </section>
  );
};

export default SlidingCards;

```
