export const managementMenuData = [
  {
    id: 1,
    menuTitle: 'ব্যবহারকারী',
    icon: 'team',
    route: 'AdminHomeRoute',
    screen: 'AdminHome',
    routeStatus: true,
    adminOnly: true,
  },

  {
    id: 3,
    menuTitle: 'ঠিকানা',
    icon: 'home',
    route: 'AdminHomeRoute',
    screen: 'AddAdress',
    routeStatus: true,
    adminOnly: true,
  },
];

export const newStuDataManagement = [
  {
    id: 1,
    menuTitle: 'এড নিউ',
    icon: 'addusergroup',
    route: 'AddmissionNavigator',
    screen: undefined,
    routeStatus: true,
    adminOnly: false,
  },

  {
    id: 2,
    menuTitle: 'সংগ্রহশালা',
    icon: 'solution1',
    route: 'NewInfoNavigator',
    screen: undefined,
    routeStatus: true,
    adminOnly: false,
  },

  {
    id: 3,
    menuTitle: 'পরিসংখ্যান',
    icon: 'barschart',
    route: 'StatisticsScreen',
    screen: undefined,
    routeStatus: true,
    adminOnly: true,
  },
];
