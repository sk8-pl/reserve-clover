import React from 'react';
import { Route, Routes } from 'react-router';

function RoutesTitle() {
  return (
    <Routes>
      <Route path="*" element={<h2>Главная страница</h2>} />
      <Route path="/_prj/mbla3" element={<h2>Главная страница</h2>} />
      <Route path="/1" element={<h2>Конструктор полетных заданий</h2>} />
      <Route path="/2" element={<h2>Шаблоны полетных заданий</h2>} />
      <Route path="/3" element={<h2>Открыть полетное задание</h2>} />
      <Route path="/4" element={<h2>Сохранить полетное задание</h2>} />
      <Route path="/5" element={<h2>Шаблоны маршрутов</h2>} />
      <Route path="/6" element={<h2>Открыть маршрут</h2>} />
      <Route path="/7" element={<h2>Сохранить маршрут (Пример №1 сабменю)</h2>} />
      <Route path="/8" element={<h2>Сохранить маршрут (Пример №2 сабменю)</h2>} />
      <Route path="/9" element={<h2>Справочник/ Контрагенты</h2>} />
      <Route path="/10" element={<h2>Справочник/ УРП</h2>} />
      <Route path="/11" element={<h2>Справочник/ МБЛА</h2>} />
      <Route path="/12" element={<h2>Справочник/ Типы оборудования</h2>} />
      <Route path="/13" element={<h2>Справочник/ Орагнизации</h2>} />
      <Route path="/14" element={<h2>Справочник/ Пользователи</h2>} />
      <Route path="/15" element={<h2>Справочник/ Регионы</h2>} />
      <Route path="/16" element={<h2>Журнал/ МБЛА</h2>} />
      <Route path="/17" element={<h2>Журнал/ УРП</h2>} />
      <Route path="/18" element={<h2>Журнал/ Полетные задания</h2>} />
      <Route path="/19" element={<h2>Журнал/ Fly radar</h2>} />
      <Route path="/20" element={<h2>Камера</h2>} />
    </Routes>
  );
}

export default RoutesTitle;
