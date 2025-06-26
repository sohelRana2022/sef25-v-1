export type authStackInfo = {
    headerTintColor: string | undefined;
    id?:number,
    name: string,
    route?: string;
    label?: string;
    title?: string;
    component: React.ComponentType<any>;
    activeIcon?: string;
    inactiveIcon?: string;
    hasHeader: boolean;
    height:number;
    backgroundColor: string;
    fontFamily: string
  }