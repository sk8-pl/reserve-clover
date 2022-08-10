export async function sendJSON(obj) {
  console.log(obj);
  fetch('https://prj.int-sys.net/_prj/mbla3/upload/polet', {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(obj),
  })
    .then((result) => result.json())
    .then((result) => {
      console.log(result.res);
    })
    .catch((e) => console.log(e));
}

export async function sendJSONDate() {
  const timeInput = document.getElementById('launch-time').value;
  const timeDate = document.getElementById('launch-date').value;

  const obj = {
    miliseconds: Date.parse(new Date(`${timeDate}T${timeInput}-00:00`)),
    date: new Date(`${timeDate}T${timeInput}-00:00`),
  };

  const xhr = new XMLHttpRequest();
  const url = 'https://prj.int-sys.net/_prj/mbla3/upload/launchdate';

  xhr.open('POST', url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      console.log(this.responseText);
    }
  };

  const data = JSON.stringify(obj);

  console.log(data);
  xhr.send(data);
}
