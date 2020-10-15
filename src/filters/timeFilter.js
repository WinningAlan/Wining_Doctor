import {GetFormatDateTime} from '../utils/public';
export default (time) => {
    if (!time) return '';
    let times=GetFormatDateTime("yyyy-MM-dd HH:mm",new Date(time))
    return times == 'Invalid Date' ? time : times;
}
