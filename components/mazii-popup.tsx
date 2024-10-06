"use client";
import * as React from "react";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "usehooks-ts";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export default function MaziiPopup({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>
          <div className={cn("w-full h-full")}>
            <iframe
              src={href} // Replace with the URL you want to display
              title="Embedded Website"
              width="100%"
              className="border-none h-[900px]"
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="h-5/6">
        <DrawerHeader className="text-left"></DrawerHeader>
        <div className={cn("w-full h-full")}>
          <iframe
            src={href} // Replace with the URL you want to display
            title="Embedded Website"
            width="100%"
            className="border-none h-[900px]"
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
