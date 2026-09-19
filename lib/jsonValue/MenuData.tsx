export const managementMenuData = [
  {
    id: 1,
    menuTitle: 'ব্যবহারকারী',
    icon: 'infocirlceo',
    route: 'AdminHomeRoute',
    routeStatus: true,
    adminOnly: true,
  },
  {
    id: 2,
    menuTitle: 'শিক্ষার্থী',
    icon: 'user',
    route: 'MyStudentsRoute',
    routeStatus: true,
    adminOnly: false,
  },
];

export const newStuDataManagement = [
  {
    id: 1,
    menuTitle: 'এড নিউ',
    icon: 'addusergroup',
    route: 'AddmissionNavigator',
    routeStatus: true,
    adminOnly: false,
  },
  {
    id: 2,
    menuTitle: 'সংগ্রহশালা',
    icon: 'infocirlceo',
    route: 'NewInfoNavigator',
    routeStatus: true,
    adminOnly: false,
  },
  {
    id: 3,
    menuTitle: 'পরিসংখ্যান',
    icon: 'barschart',
    route: 'StatisticsScreen',
    routeStatus: true,
    adminOnly: true,
  },
];
