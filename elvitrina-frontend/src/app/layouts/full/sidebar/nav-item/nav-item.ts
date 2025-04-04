export interface NavItem {
    navCap?: string;
    displayName?: string;
    iconName?: string;
    route?: string;
    disabled?: boolean;
    chip?: boolean;
    chipClass?: string;
    chipContent?: string;
    children?: NavItem[];
    external?: boolean;
}