import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { CalendarStaffMembers } from "@/services/types";

type BookingPersonelDropdownProps = {
  selectedStaff: number[];
  setSelectedStaff: React.Dispatch<React.SetStateAction<number[]>>;
  staffMembers: CalendarStaffMembers[] | undefined;
};

export default function BookingPersonelDropdown({
  selectedStaff,
  setSelectedStaff,
  staffMembers,
}: BookingPersonelDropdownProps): JSX.Element {
  // Filter bookings based on selected staff
  function handleCheckboxChange(id: number) {
    setSelectedStaff((prevSelectedStaff) =>
      prevSelectedStaff.includes(id)
        ? prevSelectedStaff.filter((staffId) => staffId !== id)
        : [...prevSelectedStaff, id]
    );
  }

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between hover:bg-transparent hover:border-zinc-200 hover:text-zinc-900 py-1 h-10"
          >
            <span className="font-normal">
              Välj person {`${"(" + selectedStaff.length + " valda)"}`}
            </span>
            <ChevronDown className="text-zinc-500" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="DropdownMenuContent">
          {staffMembers?.map((staffMember) => {
            return (
              <DropdownMenuCheckboxItem
                className="w-full rounded-none py-2.5 cursor-pointer"
                style={{
                  backgroundColor: staffMember.color?.at(0),
                  color: staffMember.color?.at(1),
                }}
                key={staffMember.id}
                checked={selectedStaff.includes(staffMember.id)}
                onCheckedChange={() => {
                  handleCheckboxChange(staffMember.id);
                }}
              >
                {staffMember.text}
              </DropdownMenuCheckboxItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
      {/* ))} */}
    </div>
  );
}
