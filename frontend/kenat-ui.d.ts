declare module 'kenat-ui' {
    export function useDatePicker(): {
        state: {
            open: boolean;
            inputRef: React.RefObject<HTMLInputElement>;
            formatted: string;
            grid: {
                monthName: string;
                year: number;
            };
            days: Array<{
                ethiopian: {
                    day: number;
                    month: number;
                    year: number;
                };
                formatted: string;
            } | null>;
            selectedDate: {
                day: number;
                month: number;
                year: number;
            } | null;
        };
        actions: {
            toggleOpen: () => void;
            selectDate: (day: any) => void;
            nextMonth: () => void;
            prevMonth: () => void;
        };
    };
}
