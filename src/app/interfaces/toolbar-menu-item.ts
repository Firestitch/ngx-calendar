export interface ToolbarMenuItem {
   label: string,
   click: () => void,
   show?: () => boolean,
}
