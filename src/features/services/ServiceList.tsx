import ServiceListItem from "./ServiceListItem";
import { useServices } from "./useServices";

type ServiceListProps = {
  id: number;
};

export default function ServiceList({ id }: ServiceListProps): JSX.Element {
  const { services } = useServices(id);
  return (
    <ul>
      {services?.map((service) => (
        <ServiceListItem key={service.id} service={service} />
      ))}
    </ul>
  );
}
