import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Menu, IconButton} from 'react-native-paper';

export type RowMenuItem = {
  id: string;
  title: string;
  icon?: string;
  disabled?: boolean;
  destructive?: boolean;
};

interface ThreeDotsProps {
  items: RowMenuItem[];
  onSelect: (item: RowMenuItem) => void;
  icon?: string;
  size?: number;
}

const ThreeDots: React.FC<ThreeDotsProps> = ({
  items,
  onSelect,
  icon = 'dots-vertical',
  size = 30,
}) => {
  const [visible, setVisible] = useState(false);

  const openMenu = () => {
    setVisible(true);
  };

  const closeMenu = () => {
    setVisible(false);
  };

  const handleSelect = (item: RowMenuItem) => {
    closeMenu();

    if (!item.disabled) {
      onSelect(item);
    }
  };

  return (
    <View style={styles.container}>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <IconButton
            icon={icon}
            size={size}
            onPress={openMenu}
            style={styles.iconButton}
          />
        }
        anchorPosition="bottom"
        contentStyle={styles.menuContent}>
        {items.map(item => (
          <Menu.Item
            key={item.id}
            title={item.title}
            leadingIcon={item.icon}
            disabled={item.disabled}
            titleStyle={item.destructive ? styles.destructiveText : undefined}
            onPress={() => handleSelect(item)}
          />
        ))}
      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconButton: {
    margin: 0,
  },

  menuContent: {
    paddingVertical: 6,
  },

  destructiveText: {
    color: '#d32f2f',
  },
});

export default ThreeDots;
