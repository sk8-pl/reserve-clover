import React from 'react';
import { MenuProps } from 'antd';
import {
  RadarChartOutlined,
  ShareAltOutlined,
  ContainerOutlined,
  FileSearchOutlined,
  CameraOutlined,
} from '@ant-design/icons';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key?: React.Key | null,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('Полетные задания', 'sub1', <RadarChartOutlined />, [
    getItem('Создать ПЗ', '1'),
    getItem('Шаблоны ПЗ', '2'),
    getItem('Открыть ПЗ', '3'),
    getItem('Сохранить ПЗ', '4'),
  ]),

  getItem('Маршрут', 'sub2', <ShareAltOutlined />, [
    getItem('Шаблоны', '5'),
    getItem('Открыть', '6'),
    getItem('Сохранить', 'sub3', null, [
      getItem('Пример сабменю 1', '7'),
      getItem('Пример сабменю 2', '8'),
    ]),
  ]),

  getItem('Справочники', 'sub4', <FileSearchOutlined />, [
    getItem('Контрагенты', '9'),
    getItem('УРП', '10'),
    getItem('МБЛА', '11'),
    getItem('Типы оборудования', '12'),
    getItem('Орагнизации', '13'),
    getItem('Пользователи', '14'),
    getItem('Регионы', '15'),
  ]),

  getItem('Журналы', 'sub5', <ContainerOutlined />, [
    getItem('MBLA1', '16'),
    getItem('URP1', '17'),
    getItem('Полетные задания', '18'),
    getItem('Fly Radar', '19'),
  ]),
  getItem('Камера', 'sub6', <CameraOutlined />, [getItem('test1', '20')]),
];

export default items;
