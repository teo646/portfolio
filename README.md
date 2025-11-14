# 포트폴리오 웹사이트 (React + Vite)

JSON 데이터만 수정하면 새로운 프로젝트와 경력 정보를 빠르게 반영할 수 있는 데이터 기반 포트폴리오입니다. 시뮬레이션·컴퓨테이셔널 아트 작업을 강조하는 다크톤 UI와 미디어 카드 레이아웃을 기본으로 제공합니다.

## 시작하기

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5173`를 열면 로컬 개발 서버가 실행됩니다.

## 데이터 구조

- `src/data/profile.json`: 이름, 헤드라인, 요약 문장, 위치 정보, 연락처 링크를 정의합니다.
- `src/data/projects.json`: 프로젝트 카드 목록을 정의합니다. `media` 배열을 통해 이미지(`type: "image"`), 비디오(`"video"`), 임베드(`"iframe"`)를 연결할 수 있습니다.
- `src/data/resume.json`: 경력(`experience`), 학력(`education`), 자격증(`certifications`)을 관리합니다.

프로젝트 미디어 파일은 `public/media/` 폴더에 저장하거나 외부 URL을 사용할 수 있습니다. 예시는 다음과 같습니다.

```jsonc
{
  "title": "Volumetric Smoke Studies",
  "media": [
    {
      "type": "video",
      "src": "https://example.com/video.mp4",
      "poster": "/media/volumetric-smoke.svg",
      "alt": "Volumetric smoke simulation timelapse",
      "caption": "GPU 기반 CFD 솔버를 활용한 연기 시뮬레이션"
    }
  ]
}
```

필요한 항목을 복사·붙여넣어 수정하면 UI가 즉시 반영됩니다.

## 섹션 구성

- **Hero**: 이름, 헤드라인, 요약을 네온 글로우 배경과 함께 노출합니다.
- **Projects**: 미디어(이미지/영상/임베드)와 하이라이트, 기술 스택을 카드 형태로 보여줍니다.
- **Experience**: 타임라인 레이아웃으로 연구 및 인턴 경험을 정리합니다.
- **Education / Certifications**: 학력과 자격 정보를 정리합니다.
- **Contact**: 이메일, GitHub, SNS 등 연락처를 버튼 카드로 강조합니다.

테마 컬러나 레이아웃을 변경하고 싶다면 `src/App.css`, `src/index.css`를 조정하면 됩니다.

## 빌드 & 배포

프로덕션 빌드는 다음 명령으로 생성합니다.

```bash
npm run build
```

`dist/` 폴더가 생성되며, GitHub Pages에 업로드하면 됩니다. 이 저장소는 `vite.config.js`에서 `base: './'` 설정을 사용하므로 프로젝트 페이지(`https://github.io/<사용자명>/<저장소명>/`)에서도 정상 동작합니다.

### GitHub Pages 배포 팁

1. GitHub 저장소를 생성하고 원격 저장소를 연결합니다.
2. 빌드된 `dist/`를 `gh-pages` 브랜치로 배포합니다. 예:

   ```bash
   npm run build
   git subtree push --prefix dist origin gh-pages
   ```

3. GitHub 저장소의 Pages 설정에서 배포 브랜치를 `gh-pages`로 지정합니다.

추후 자동화를 원한다면 GitHub Actions 워크플로를 추가해 `npm run build` 결과를 자동 배포하도록 확장할 수 있습니다.
