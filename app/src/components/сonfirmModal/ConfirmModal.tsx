import React from "react";
import './ConfirmModal.scss';
import { Button } from '../button/Button.tsx';

/**
 * Пропсы для компонента ConfirmModal
 */
interface ConfirmModalProps {
    /** Флаг отображения модального окна */
    isOpen: boolean;
    /** Обработчик закрытия модального окна (например, при отмене действия) */
    onClose: () => void;
    /** Обработчик подтверждения действия (например, удаление) */
    onConfirm: () => void;
}

/**
 * Модальное окно подтверждения действия.
 * Показывается, когда пользователь пытается выполнить критическое действие, например — удалить элемент.
 *
 * @param {ConfirmModalProps} props - Свойства компонента
 * @returns {JSX.Element | null} Модальное окно или null, если оно скрыто
 */
export const ConfirmModal: React.FC<ConfirmModalProps> = ({isOpen, onClose, onConfirm}) => {
    if (!isOpen) return null;

    return (
        <div className="modal-backdrop" onClick={(e) => e.stopPropagation()}>
            <div className="modal">
                <p>Вы уверены, что хотите удалить?</p>
                <div className="modal-buttons">
                    <Button text={'Удалить'}
                            onClick={onConfirm}
                            variant={'secondary'}
                            className={'warning'}/>
                    <Button text={'Отмена'}
                            onClick={(e) => {
                                e.stopPropagation();
                                onClose();
                            }}
                            variant={'secondary'}/>
                </div>
            </div>
        </div>
    );
};
