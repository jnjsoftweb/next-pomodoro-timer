
```
pomodoro cycle을 자동화하는 기능을 구현하려고 해요.

우선 pomodoro cycle을 구현할 json collection을 만들어야 해요.

pomos collection은 포모도로 타이머의 상태를 저장하는 데 사용됩니다.

`backend/json-server/db.json` 파일에 아래와 같은 데이터를 추가해주세요. 코멘트는 제거해서 추가해주세요.

```json
  "pomos": [
    {
      "id": 1,  // 포모도로 타이머 id
      "taskId": 1,  // 포모도로 타이머에 해당하는 task id
      "startTime": "2024-10-08T10:39:03.079Z",  // 포모도로 타이머 시작 시간(start 버튼을 누르면 현재 시간이 저장됨)
      "endTime": "",  // 포모도로 타이머 종료 시간(현재 단위 타이머가 종료되면 현재 시간이 저장됨)
      "state": "pause",  // 포모도로 타이머 상태 (standby, run, pause, finished, completed)
      "remainingTime": 18,  // 포모도로 타이머 남은 시간
      "sn": 1  // 포모도로 타이머 순서
    },
    {
      "id": 2,
      "taskId": 2,
      "startTime": "",
      "endTime": "",
      "state": "standby",
      "remainingTime": 30,
      "sn": 1
    }
  ]
```

> state에 대해 부연 설명하면 포모도르 타이머 상태는 아래와 같이 5가지가 있어요.

- standby: 포모도르 타이머가 준비된 상태
- run: 포모도르 타이머가 실행된 상태
- pause: 포모도르 타이머가 일시정지된 상태
- finished: 단위 포모도르 타이머가 종료된 상태
- completed: 포모도르 타이머가 완료된 상태(task가 완료된 상태)
```

2. task key 추가

```
tasks 와 pomos 의 연동을 위해, tasks collection에 hasTimer 라는 key를 추가해주세요.

hasTimer는 해당 task가 포모도르 타이머를 사용하는지 여부를 나타냅니다.

true일 경우, 해당 task는 포모도르 타이머를 사용하고, false일 경우, 해당 task는 포모도르 타이머를 사용하지 않습니다.

```

3. pomos CRUD 기능 구현

```
pomos collection에 대한 CRUD 기능을 구현을 위해 하단의 '할일' 버튼 좌측으로 '포모' 버튼을 추가해주세요.
아이콘은 원형 타이머 모양으로 해주세요.

'포모' 버튼을 누르면 '할일' 버튼을 눌렀을 때와 같이 팝업이 뜨고, '할일 목록'과 유사한 UI에서 CRUD가 가능하도록 해주세요.
```