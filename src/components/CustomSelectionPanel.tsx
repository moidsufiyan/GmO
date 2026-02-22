import { useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';
import { InputNumber } from 'primereact/inputnumber';

interface Props {
  onSubmit: (n: number) => void;
}

export default function CustomSelectionPanel({ onSubmit }: Props) {
  const op = useRef<OverlayPanel>(null);
  const [val, setVal] = useState<number | null>(null);

  function handleSubmit() {
    if (val && val > 0) {
      onSubmit(val);
      setVal(null);
      op.current?.hide();
    }
  }

  return (
    <>
      <Button
        icon="pi pi-chevron-down"
        text
        size="small"
        onClick={(e) => op.current?.toggle(e)}
        aria-label="Select rows"
      />
      <OverlayPanel ref={op}>
        <div className="flex flex-column gap-2">
          <label htmlFor="select-count">Rows to select</label>
          <InputNumber
            id="select-count"
            value={val}
            onValueChange={(e) => setVal(e.value ?? null)}
            min={1}
            placeholder="Enter number"
          />
          <Button label="Submit" onClick={handleSubmit} size="small" />
        </div>
      </OverlayPanel>
    </>
  );
}
