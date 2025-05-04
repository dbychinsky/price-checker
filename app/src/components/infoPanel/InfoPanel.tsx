import './InfoPanel.scss';
import {clsx} from 'clsx';

export enum InfoPanelList {
    informationStatic = 'informationStatic',
    information = 'information',
    success = 'success',
    error = 'error',
}

interface InfoPanelProps {
    text: string;
    type: InfoPanelList;
}

export const InfoPanel = (props: InfoPanelProps) => {
    const {type, text} = props;
    const wrapperClass = clsx([type], 'infoPanel')

    return (
        <div className={wrapperClass}>
            {text}
        </div>
    );
};
