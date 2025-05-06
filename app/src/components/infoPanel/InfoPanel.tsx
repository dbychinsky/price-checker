import './InfoPanel.scss';
import { clsx } from 'clsx';
import { InfoPanelList } from './InfoPanelList.ts';

interface InfoPanelProps {
    text: string;
    type: InfoPanelList;
}

export const InfoPanel = (props: InfoPanelProps) => {
    const {type, text} = props;
    const wrapperClass = clsx([type], 'info-panel')

    return (
        <div className={wrapperClass}>
            {text}
        </div>
    );
};
