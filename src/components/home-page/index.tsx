import React from 'react';
import './style.css';

function HomePage() {
  return (
    <div className="container-home">
      <h2>НАШ ПРОДУКТ</h2>
      <div className="home-inner">
        <ul className="homelist">
          <li>
            Загрузка полётного задания в БВС
          </li>
          <li>
            Управление взлётом, выполнением полётного задания, посадкой БВС
          </li>
          <li>
            Управление и контроль полезной нагрузки и груза на БВС
          </li>
          <li>
            Установление связи со всеми БВС и пилотируемыми ВС, находящимися в зоне обслуживания УРП
          </li>
          <li>
            Корректировка при необходимости предотвращения столкновений всех БВС
            и предупреждение о возможных коллизиях всех пилотируемых ВС в зоне обслуживания УРП
          </li>
        </ul>
        <div className="home-iamge" />
      </div>

    </div>
  );
}

export default HomePage;
