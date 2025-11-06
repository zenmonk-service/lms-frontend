"use client";

import LeaveTypeForm from "@/components/leave-type/leave-type-form";
import ListLeaveTypes from "@/components/leave-type/list-leave-types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function LeaveTypes() {
  const [isOpen, setIsOpen] = useState(false);

  const onOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className="pt-4 px-6">
        <Button
          className="bg-gradient-to-r from-orange-500 to-amber-500 text-white"
          onClick={() => onOpenChange(true)}
        >
          <Plus className="w-5 h-5" /> Create Leave Type
        </Button>
        <LeaveTypeForm
          label="create"
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          onClose={onClose}
        />
      </div>

      <div className="p-6">
        <ListLeaveTypes />
      </div>
    </>
  );
}
