import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCalendar } from "@/context/CalendarContext";

export default function BookingStaffDropdown(): JSX.Element {
  const { selectedStaff, setSelectedStaff, staffMembers } = useCalendar();

  function handleCheckboxChange(id: number) {
    setSelectedStaff(id);
  }

  return (
    <div className="min-w-48">
      <Select
        value={selectedStaff?.toString()}
        onValueChange={(e) => {
          handleCheckboxChange(+e);
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Välj en person" />
        </SelectTrigger>
        <SelectContent>
          {staffMembers?.map((staffMember) => (
            <SelectItem key={staffMember.id} value={staffMember.id.toString()}>
              <span>{staffMember.text}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
