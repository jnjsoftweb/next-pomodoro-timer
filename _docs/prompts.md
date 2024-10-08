```prompt
뽀모도로 타이머를 구현해보려고 해.
next.js를 이용해서 웹앱으로 구현할거야.
우선 클론 코딩으로 기능적 요소, 시각적 요소에 대한 개략적인 방향을 잡아보려고 해.

# 참조
- clone coding: https://pomodorotimer.online/
- UI: https://akaspanion.github.io/ui-neumorphism/

- next.js는 `C:\JnJ-soft\Projects\internal\jnj-pomodoro` 폴더 아래에 설치할 거야.
- next.js 설치.설정부터, page 구성까지 구체적 방법을 제시해주거나 파일을 만들어줘
```

```
포모도로 리스트(pomos) 구현이 완성되어 가고 있네요. 고마워요.

이제, pomodoro cycle을 자동화하는 기능을 구현하려고 해요.

포모도로 사이클은 설정에 따라 다를 수 있지만 아래와 같은 기본적인 과정을 거칩니다.

- 포모도로 사이클에 해당하는 tasks를 검색합니다.
  - 오늘 날짜에 실행해야 하는 task 중에서
  - completed 되지 않은 task
  - 현재 시간이 실행 시간 안에 있는 task

- 위에 해당하는 task들을 pomos에 등록합니다.
  - state는 standby로 등록
  - pomos에 해당 taskId가 있는 경우, 오늘 날짜에 해당하는 pomo가 있으면 등록하지 않습니다.

- pomos를 검색합니다.
  - 오늘 날짜에 실행해야 하는 pomos 중에서
  - state가 'standby', 'run', 'pause' 인 pomo들이 있는 경우, sn 키에 순번(1, 2, 3, ...)을 부여합니다. 이때 같은 taskId를 가진 pomo는 제거해야 합니다.

- 포모도로 사이클은 아래와 같은 규칙으로 돌아갑니다.
  - pomodoro settings에서 pomoTime, restTime, longRestTime, longRestInterval을 불러옵니다.
    - 현재는 없으므로 default값 적용
    - pomoTime: 1500(25분), restTime: 300(5분), longRestTime: 900(15분)
    - longRestInterval: 4(longRest가 pomodoro 몇 번에 1번씩 주어지는지, 0인 경우 없음)

  - 예로써 longRestInterval = 3 인 경우
     - pomodoro -> rest -> pomodoro -> rest -> pomodoro -> longRest -> pomodoro -> rest ...

  - pomodoro는 순번에 따라 바뀌면서 타이머가 작동합니다.
    - 예로써, pomo1, pomo2, pomo3이 있으면
    - pomo1 -> rest -> pomo2 -> rest -> pomo3 -> longRest -> pomo1 -> rest ...

- 중간에 pomo 중에 task 자체가 완료된 경우에는 task의 completed가 true가 되고 포모도로 사이클에서 제외됩니다.

```

```
현재까지의 composer 내에서의 질문, 답변 내용들을 코드를 제외하고 markdown 파일로 저장할 수 있나요?

db.json에서 pomos 도 정리해 주세요.

- 동일한 taskId를 가진 경우 completed를 제외하고는 1개만 남겨주세요.
- remainingTime은 30 으로 변경해주세요.
- 코모도로 사이클에 배정될 수 있는 como에 대해서는 sn을 부여해 주세요.
```

```
포모도로 사이클이 제대로 작동하지 않아요.

- 프로그레스링이 (pomoTime - remainingTime) / pomoTime 비율로 채워지도록 해주세요.

  - 현재는 pomoTime이 2500으로 적용된 것 같아요.

- 1개의 pomo가 타임아웃되었을 경우, 다음 단계(rest)로 넘어가지 않고 종료되어 버립니다.
  - 포모도로 사이클이 작동하도록 해주세요
```

```
- 해당 pomo가 start되면 startTime을 그 시간으로 갱신해주세요.
- 해당 pomo가 종료되면 endTime을 기록해주세요. 또한 해당 pomo의 state는 "completed"로 갱신하고, 해당 taskId의 새로운 pomo를 생성하고, 초기화 해주세요. startTime = "", endTime = "", state = "standby", remainingTime= 30, sn = 종료된 pomo와 동일한 번호
```

```
1. 하나의 pomo가 종료된 이후에 rest 단계로 넘어가지 않습니다.

2. pomo가 종료된 이후에, db.json의 pomos에 생성되는 pomo는 동일한 taskId에 대해 1개만 생성되어야 합니다. taskId가 같고 startTime = "" 인 como가 여러개 있는 경우 1개만 남기고 다른 como는 삭제되어야 합니다. sn이 없는 como도 모두 삭제되어야 합니다.

3. 아래의 규칙대로 사이클이 작동하도록 해주세요

- pomos를 검색합니다.
  - 오늘 날짜에 실행해야 하는 pomos 중에서
  - state가 'standby', 'run', 'pause' 인 pomo들이 있는 경우, sn 키에 순번(1, 2, 3, ...)을 부여합니다. 이때 같은 taskId를 가진 pomo는 제거해야 합니다.

- 포모도로 사이클은 아래와 같은 규칙으로 돌아갑니다.
  - pomodoro settings에서 pomoTime, restTime, longRestTime, longRestInterval을 불러옵니다.
    - 현재는 없으므로 default값 적용
    - pomoTime: 1500(25분), restTime: 300(5분), longRestTime: 900(15분)
    - longRestInterval: 4(longRest가 pomodoro 몇 번에 1번씩 주어지는지, 0인 경우 없음)

  - 예로써 longRestInterval = 3 인 경우
     - pomodoro -> rest -> pomodoro -> rest -> pomodoro -> longRest -> pomodoro -> rest ...

  - pomodoro는 순번에 따라 바뀌면서 타이머가 작동합니다.
    - 예로써, pomo1, pomo2, pomo3이 있으면
    - pomo1 -> rest -> pomo2 -> rest -> pomo3 -> longRest -> pomo1 -> rest ...

- 중간에 pomo 중에 task 자체가 완료된 경우에는 task의 completed가 true가 되고 포모도로 사이클에서 제외됩니다.
```

```
타이머 종료시 rest로 넘어가지 않고, 다음 pomo 타이머가 바로 실행됩니다. 포모도로 사이클 대로 rest로 넘어가도록 해주세요. state가 run인 pomo가 없는 경우는 타이머를 바로 작동시키지 않아야 합니다.
페이지 로딩시 타이머는 state가 'run', 'pause'인 pomo가 있는 경우, 그 pomo를. 아니면 sn이 가장 작은 pomo를 선택하도로 해야 합니다.
```

- pomos가 아래와 같을 때

```json
    {
      "taskId": 3,
      "startTime": "2024-10-08T10:24:19.808Z",
      "endTime": "",
      "state": "standby",
      "remainingTime": 27,
      "id": 6,
      "sn": 2
    },
    {
      "taskId": 4,
      "startTime": "2024-10-08T10:34:35.323Z",
      "endTime": "",
      "state": "pause",
      "remainingTime": 27,
      "id": 7
    }
```

- 페이지 로딩을 하면, pause 상태의 pomo를 넘기고, stanby 상태의 pomo를 자동으로 play를 하여 state를 run으로 만들고, 타이머를 시작해버리네요.

```
    {
      "taskId": 3,
      "startTime": "2024-10-08T10:39:03.079Z",
      "endTime": "",
      "state": "run",
      "remainingTime": 23,
      "id": 6,
      "sn": 1
    },
    {
      "taskId": 4,
      "startTime": "2024-10-08T10:34:35.323Z",
      "endTime": "",
      "state": "pause",
      "remainingTime": 27,
      "id": 7,
      "sn": 2
    }
```
