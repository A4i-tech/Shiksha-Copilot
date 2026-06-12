export const colors: Map<number,any> = new Map([
	[1, {primary: '#6a6a3a', secondary: '#ffffdb'}],
    [2, {primary: '#6f6fdc', secondary: '#dedef7'}],
    [3, {primary: '#6fcfdc', secondary: '#def4f7'}],
    [4, {primary: '#6a6a3a', secondary: '#eef7de'}],
    [5, {primary: '#a07ce9', secondary: '#e8e5f0'}],
    [6, {primary: '#dcb46f', secondary: '#f7eede'}],
    [7, {primary: '#3ed1ce', secondary: '#e5fbff'}],
    [8, {primary: '#1dd75b', secondary: '#eefdf3'}],
    [9, {primary: '#b978ec', secondary: '#ebfdff'}],
    [10, {primary: '#f19b5d', secondary: '#f1e9e5'}],
    [11, {primary: '#dc9e6f', secondary: '#f7e9de'}],
    [12, {primary: '#dc786f', secondary: '#f7e0de'}],
])


// Event background = `secondary`, text is white (see _dashboard_schedule.scss).
// Each colour is darkened within its own hue to meet WCAG AA (>=4.5:1 vs white).
// `primary` (event marker) matches the background colour.
export const dashboardColors: Map<number,any> = new Map([
	[1, {primary: '#b600e4', secondary: '#b600e4'}],
    [2, {primary: '#e4006b', secondary: '#e4006b'}],
    [3, {primary: '#00845D', secondary: '#00845D'}],
    [4, {primary: '#3772DD', secondary: '#3772DD'}],
    [5, {primary: '#008192', secondary: '#008192'}],
    [6, {primary: '#338626', secondary: '#338626'}],
    [7, {primary: '#1565C0', secondary: '#1565C0'}],
    [8, {primary: '#B65D34', secondary: '#B65D34'}],
    [9, {primary: '#9058DE', secondary: '#9058DE'}],
    [10, {primary: '#906F2D', secondary: '#906F2D'}]
])
