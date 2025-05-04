import { clsx } from "clsx";
import { MouseEventHandler } from "react";
import './Button.scss'

interface ButtonProps {
    text: string;
    onClick?: MouseEventHandler<HTMLElement>;
    isDisabled?: boolean;
    className?: string;
    variant?: ButtonsType;
    type?: 'button' | 'submit' | 'reset';
}

/**
 * Типы кнопки.
 */
const ButtonsTypeMapping = {
    primary: 'primary',
    secondary: 'secondary',
    icon: 'icon',
    iconText: 'iconText'
};

type ButtonsType = keyof typeof ButtonsTypeMapping;

export const Button = (props: ButtonProps) => {
    const {
        onClick,
        text,
        isDisabled,
        variant = 'primary',
        className
    } = props

    const wrapperClassList = clsx(
        'button',
        className,
        ButtonsTypeMapping[variant]
    );

    return (
        <button className={wrapperClassList}
                disabled={isDisabled}
                onClick={onClick}
                tabIndex={1}>{text}
        </button>
    );
};
