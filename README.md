# 포트폴리오 웹사이트 (React + Vite)

JSON 데이터만 수정하면 새로운 프로젝트와 경력 정보를 빠르게 반영할 수 있는 데이터 기반 포트폴리오입니다. GitHub Pages 같은 정적 호스팅 환경에서 바로 배포할 수 있도록 구성했습니다.

## 시작하기

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5173`를 열면 로컬 개발 서버가 실행됩니다.

## 데이터 구조

- `src/data/profile.json`: 이름, 타이틀, 소개 요약, 연락처 정보를 관리합니다.
- `src/data/projects.json`: 프로젝트 카드 목록을 정의합니다. 항목을 추가하거나 삭제하면 UI가 자동으로 갱신됩니다.
- `src/data/resume.json`: 경력(`experience`), 학력(`education`), 기술 스택(`skills`), 자격증(`certifications`)을 정의합니다.

JSON 스키마는 직관적으로 구성되어 있으므로 텍스트 에디터에서 항목을 복사·붙여넣기만 해도 쉽게 업데이트할 수 있습니다.

## 섹션 구성

- **Hero**: 이름, 헤드라인, 요약 문장을 강조합니다.
- **Projects**: 프로젝트 카드형 목록과 기술 스택 태그를 보여줍니다.
- **Experience**: 타임라인 형태로 경력과 주요 성과를 나타냅니다.
- **Skills / Education / Certifications**: 카테고리별 기술, 학력, 자격 정보를 정리합니다.
- **Contact**: 연락처를 버튼 형태로 제공합니다.

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
