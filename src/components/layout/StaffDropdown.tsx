import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStaff } from "@/hooks/useStaff";

type StaffMember = {
  selectedStaff: number;
  onSelect: (value: number) => void;
};

export default function StaffDropdown({
  selectedStaff,
  onSelect,
}: StaffMember): JSX.Element {
  const { staff } = useStaff();

  return (
    <div className="min-w-48">
      <Select
        value={selectedStaff?.toString()}
        onValueChange={(e) => {
          onSelect(+e);
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Välj en person" />
        </SelectTrigger>
        <SelectContent>
          {staff?.map((staffMember) => (
            <SelectItem key={staffMember.id} value={staffMember.id.toString()}>
              <span>{staffMember.name}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
