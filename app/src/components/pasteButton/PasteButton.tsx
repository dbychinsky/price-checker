import './PasteButton.scss';
import { Button } from '../button/Button.tsx';

interface PasteButtonProps {
    onPaste: (value: string) => void;
}

export const PasteButton = ({onPaste}: PasteButtonProps) => {
    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            onPaste(text);
        } catch (err) {
            console.error('Ошибка чтения из буфера обмена:', err);
        }
    };

    return <Button text={'Вставить'}
                   variant={'icon'}
                   className={'paste-button'}
                   onClick={handlePaste}/>;
};
