import React from 'react';
import {toast} from 'react-toastify';
import {observer} from "mobx-react-lite";
import './CopyButton.scss';
import {Button} from '../button/Button';

interface CopyButtonProps {
    textToCopy: string;
    className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = observer((
    {
        textToCopy,
        className
    }) => {
    const fallbackCopy = (text: string) => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        try {
            document.execCommand('copy');
            toast.success('Скопировано (fallback)');
        } catch (err) {
            console.log(err);
            toast.error('Ошибка копирования');
        }
        document.body.removeChild(textarea);
    };

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(textToCopy)
                .then(() => toast.success('Скопировано'))
                .catch(() => {
                    fallbackCopy(textToCopy);
                });
        } else {
            fallbackCopy(textToCopy);
        }
    };

    return (
        <Button onClick={handleCopy}
                text={textToCopy}
                className={`copy-button ${className}`}
                variant={'iconText'}/>
    );
});
