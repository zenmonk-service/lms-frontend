import CreateLeaveType from "@/components/leave-type/create-leave-type";
import ListLeaveTypes from "@/components/leave-type/list-leave-types";

export default function LeaveTypes() {
  return (
    <>
      <div className="p-6 flex items-center gap-4">
        <CreateLeaveType />
      </div>

      <div className="p-6">
        <ListLeaveTypes />
      </div>
    </>
  );
}
