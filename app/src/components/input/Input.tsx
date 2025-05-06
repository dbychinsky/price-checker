import './Input.scss';
import { ChangeEvent } from 'react';
import { observer } from 'mobx-react-lite';
import clsx from 'clsx';

interface InputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export const Input = observer((props: InputProps) => {
    const {value, onChange, placeholder, className} = props;
    const wrapperClassInput = clsx(className, 'input');

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    }

    return (
        <input
            className={wrapperClassInput}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
        />
    );
});

