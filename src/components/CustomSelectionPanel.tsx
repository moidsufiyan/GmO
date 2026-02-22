import { useRef, useState } from 'react';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';

interface CustomSelectionPanelProps {
  onSubmit: (n: number) => void;
}

export default function CustomSelectionPanel({
  onSubmit,
}: CustomSelectionPanelProps) {
  const op = useRef<OverlayPanel>(null);
  const [value, setValue] = useState<number | null>(null);

  const handleSubmit = () => {
    if (value && value > 0) {
      onSubmit(value);
      setValue(null);
      op.current?.hide();
    }
  };

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
            value={value}
            onValueChange={(e) => setValue(e.value ?? null)}
            min={1}
            placeholder="Enter number"
          />
          <Button label="Submit" onClick={handleSubmit} size="small" />
        </div>
      </OverlayPanel>
    </>
  );
}
