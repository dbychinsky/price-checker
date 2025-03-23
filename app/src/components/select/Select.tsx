import { ChangeEvent, FC, useState } from "react";

interface Option {
    value: string;
    label: string;
}

interface SelectProps {
    options: Option[];
    onChange: (value: string) => void;
    defaultValue?: string;
}

export const Select: FC<SelectProps> = ({options, onChange, defaultValue}) => {
    const [selected, setSelected] = useState(defaultValue || options[0]?.value);

    const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setSelected(value);
        onChange(value);
    };

    return (
        <select value={selected} onChange={handleChange} className='select'>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
};

