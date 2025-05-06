import './Select.scss';
import { ChangeEvent, useState } from "react";
import { observer } from "mobx-react-lite";
import clsx from 'clsx';

type Primitive = string | number | boolean;

interface Option<T extends Primitive> {
    value: T;
    label: string;
}

interface SelectProps<T extends Primitive> {
    options: Option<T>[];
    onChange: (value: T) => void;
    value?: T;
    className?: string;
}

export const Select = observer(<T extends Primitive>({options, onChange, value, className}: SelectProps<T>) => {
    const [selected, setSelected] = useState<T>(value ?? options[0].value);
    const wrapperClassList = clsx(
        'select',
        className,
    );
    const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const raw = event.target.value;

        const matched = options.find(opt => opt.value.toString() === raw);
        if (matched) {
            setSelected(matched.value);
            onChange(matched.value);
        }
    };

    return (
        <select value={selected.toString()} onChange={handleChange} className={wrapperClassList}>
            {options.map(option => (
                <option key={option.value.toString()} value={option.value.toString()}>
                    {option.label}
                </option>
            ))}
        </select>
    );
});
