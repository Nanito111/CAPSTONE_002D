import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function NumAddressInput() {
    const handleNumericInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const numAddress = event.target.value;
    const regexNumAddress = /^[0-9]+$/;
    if (!regexNumAddress.test(numAddress)) {
      event.target.value = numAddress.slice(0, -1);
    }}

  return (
    <div className="grid gap-2">
      <Label>Número</Label>
      <Input
        id="numAddress"
        type="text"
        placeholder="501"
        required
        onChange={handleNumericInputChange}
      />
    </div>
  )
}