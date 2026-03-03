import { FormControl, InputLabel, MenuItem, Select, SelectProps } from "@mui/material";
import { HandleEvent, OptionListType } from "../uiPages/calendar/types";

export interface selectorProps {
    optionKey: string,
    codeList: OptionListType[],
    placeholder?: string,
}


export const MySelector: React.FC<selectorProps & SelectProps> = ({
    color,
    id,
    name,
    label,
    value,
    placeholder,
    optionKey,
    codeList,
    onChange, ...props }) => {
    return <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-helper-label">{label}</InputLabel>
        <Select
            id={id}
            name={name}
            value={value}
            label={label}
            onChange={onChange}
            className={"modelInput " + (props.className ?? "")}
        >
            {codeList.map(item => (
                <MenuItem value={(item as any)[optionKey]}>{item.name}</MenuItem>
            ))}
        </Select>
    </FormControl>
};