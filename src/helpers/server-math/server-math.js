// const obj = {
//   povorot: '30',
//   maxT1: '20',
//   shir1: '5',
//   speedP1: '10',
//   poly22: [
//     [56.58663215997809, 53.760603898204145],
//     [56.58109046208735, 53.786438935435605],
//     [56.57569007438673, 53.76875781360941],
//     [56.58663215997809, 53.760603898204145],
//   ],
// };

import { drawRouteFromData } from '../../general/map/geoServerInitial';

// export default async function sendJSON() {
//   const xhr = new XMLHttpRequest();
//   const url = 'https://prj.int-sys.net/_prj/mbla3/mathem/';
//   xhr.open('POST', url, true);
//   xhr.setRequestHeader('Content-Type', 'application/json');
//   xhr.onreadystatechange = () => {
//     if (xhr.readyState === 4 && xhr.status === 200) {
//       const answer = this.responseText;
//       console.log(answer);
//     }
//   };
//   const data = JSON.stringify(obj);
//   xhr.send(data);
// }

// async function postData(url, data) {
//   // Default options are marked with *
//   const response = await fetch(url, {
//     method: 'POST', // *GET, POST, PUT, DELETE, etc.
//     mode: 'no-cors', // no-cors, *cors, same-origin
//     cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
//     credentials: 'same-origin', // include, *same-origin, omit
//     headers: {
//       'Content-Type': 'application/json',
//       // 'Content-Type': 'application/x-www-form-urlencoded',
//     },
//     redirect: 'follow', // manual, *follow, error
//     referrerPolicy: 'no-referrer', // no-referrer, *client
//     body: JSON.stringify(data), // body data type must match "Content-Type" header
//   });
//   return response;
//   // return await response.json(); // parses JSON response into native JavaScript objects
// }

// postData('https://prj.int-sys.net/_prj/mbla3/mathem/', obj)
//   .then((data) => {
//     console.log(data); // JSON data parsed by `response.json()` call
//   });

// // async function request(url, data) {
// //   const response = await fetch(url, {
// //     method: 'POST',
// //     mode: 'no-cors',

// //     headers: {
// //       'Content-Type': 'application/x-www-form-urlencoded',
// //     },
// //     body: JSON.stringify(data),
// //   });
// //   const result = await response.JSON();
// //   return result;
// // }
// // async function checkUsername() {
// //   const url = 'https://prj.int-sys.net/_prj/mbla3/mathem/';
// //   const data = obj;
// //   const result = await request(url, data);
// //   console.log(result);
// // }

// // checkUsername();

// const zapr = {
//   povorot: document.getElementById('angleP1').value,
//   maxT1: document.getElementById('maxT1').value, // макс время полета
//   shir1: document.getElementById('shir1').value, // ширина прохода
//   speedP1: document.getElementById('speedP1').value, // скорость движения
//   poly22: myPolygon1.geometry.getCoordinates()[0],
// };
export default function qweq() {
  const zapr = {
    povorot: '30',
    maxT1: '20',
    shir1: '5',
    speedP1: '10',
    poly22: [
      [56.58663215997809, 53.760603898204145],
      [56.58109046208735, 53.786438935435605],
      [56.57569007438673, 53.76875781360941],
      [56.58663215997809, 53.760603898204145],
    ],
  };
  fetch('https://prj.int-sys.net/_prj/mbla3/mathem/', {
    method: 'POST',
    mode: 'no-cors',

    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(zapr),
    /*      body: JSON.stringify({
      name: "Yohan",
      fam: "Bah"
      }) */
  })
    .then((result) => result.json())
    .catch((e) => console.log(e));
  // .then((res) => {
  //   console.log('Request complete! response:', res.resolve);
  //   res.json();
  // })
  // .then((data) => { console.log(data); });
}
// V---------------------------- не рабоатет из за сертификата https://prj.int-sys.net/, вызов с этого домена - работает
// const data = {
//   povorot: '30',
//   maxT1: '20',
//   shir1: '5',
//   speedP1: '10',
//   poly22: [
//     [56.58663215997809, 53.760603898204145],
//     [56.58109046208735, 53.786438935435605],
//     [56.57569007438673, 53.76875781360941],
//     [56.58663215997809, 53.760603898204145],
//   ],
// };

export function getGulsPolygon(data) {
  console.log(data);
  fetch('https://prj.int-sys.net/_prj/mbla3/mathem/', {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((result) => result.json())
    .then((result) => {
      drawRouteFromData(result.res);
    })
    .catch((e) => console.log(e));
}
