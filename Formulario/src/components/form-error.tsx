type Props = {
  message?: string;
};

export function FormError({ message }: Props) {
  if (!message) return null;
  return <p className="text-sm font-medium text-red-600">{message}</p>;
}
