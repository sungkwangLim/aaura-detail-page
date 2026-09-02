# CSS 작성 규칙

이 프로젝트의 모든 CSS는 선택자 기준 한 줄 형식을 사용합니다.

```css
.classname { display : flex; width : 100%; padding : 20px; font-size : 18px; color : #111; background : #fff; transition : opacity .3s ease; }
```

속성은 다음 순서로 정렬합니다.

1. CSS 사용자 정의 속성
2. 위치와 레이아웃: `position`, 좌표, `z-index`, `display`, flex/grid, 정렬, overflow
3. 박스 모델: 크기, margin, padding, border, radius, shadow
4. 타이포그래피: font, line-height, letter-spacing, text, color
5. 시각 표현: background, opacity, filter, object-fit, mask
6. 동작: transform, transition, animation, pointer-events
7. 그 밖의 속성

`@media`, `@supports`, `@keyframes`의 바깥 중괄호는 줄을 나누고, 그 안의 각 선택자 규칙은 동일하게 한 줄로 작성합니다.

CSS 수정 후 아래 명령으로 형식을 통일합니다.

```powershell
node tools/format-css.mjs
```

## 레이아웃 유지보수 규칙

- 1200px PC 기준에서 제목, 본문, 목록, 카드, 섹션 그룹은 기본 문서 흐름을 유지하고 `block`, `flex`, `grid`로 배치합니다.
- 상하·좌우 간격은 `margin`, `padding`, `gap`으로 설정하여 글자나 항목이 늘어나도 자연스럽게 확장되도록 합니다.
- `position : absolute`는 장식선, 겹치는 이미지, 슬라이더 점, 별도로 허용된 안내문처럼 일반 흐름으로 구현하기 어려운 시각 요소에만 사용합니다.
- 내용이 늘어날 수 있는 섹션은 고정 `height`보다 `height : auto`와 디자인 기준 `min-height`를 우선합니다.
- 완료하는 모든 섹션에 `max-width:1200px`와 `max-width:760px` 반응형 규칙을 작성합니다.
- Figma Dev Mode의 1200px PC 디자인 값은 기본 CSS에 `px`로 작성합니다.
- 정확한 1200px 화면에서는 픽셀값을 유지하고, 데스크톱 디자인 폭보다 작아지는 구간부터 비율 단위를 사용하며 모바일에서는 유동 단위를 적용합니다.
