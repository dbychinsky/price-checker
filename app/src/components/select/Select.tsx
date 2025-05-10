import './Select.scss';
import {useState, useEffect, useRef} from "react";
import {observer} from "mobx-react-lite";
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
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState<T>(value ?? options[0].value);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleOpen = () => setIsOpen(prev => !prev);

    const handleSelect = (e: React.MouseEvent, option: Option<T>) => {
        e.stopPropagation(); // <–– Остановить всплытие
        setSelected(option.value);
        onChange(option.value);
        setIsOpen(false);
    };

    return (
        <div className={clsx("select-wrapper", {open: isOpen}, className)} onClick={toggleOpen} ref={ref}>
            <div className="selected-value">{options.find(o => o.value === selected)?.label}</div>
            <div className="icon" />
            {isOpen && (
                <ul className="options-list">
                    {options.map(option => (
                        <li
                            key={option.value.toString()}
                            className={clsx("option", {
                                selected: option.value === selected
                            })}
                            onClick={(e) => handleSelect(e, option)}
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
});
