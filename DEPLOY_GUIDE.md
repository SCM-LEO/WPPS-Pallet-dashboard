# 🚀 PalletOS GitHub Pages 배포 가이드

## 📁 프로젝트 구조
```
pallet-dashboard/
├── src/
│   ├── main.jsx          ← React 진입점
│   └── App.jsx           ← 대시보드 전체 코드
├── .github/
│   └── workflows/
│       └── deploy.yml    ← 자동 배포 설정 (건드리지 말 것)
├── index.html
├── package.json
├── vite.config.js
└── .gitignore
```

---

## ✅ STEP 1 — GitHub 저장소 만들기

1. https://github.com 로그인
2. 우측 상단 **"+"** → **"New repository"** 클릭
3. Repository name: `pallet-dashboard` ← 이름 정확히 입력
4. **Public** 선택 (GitHub Pages 무료는 Public 필요)
5. **"Create repository"** 클릭

---

## ✅ STEP 2 — 내 컴퓨터에 Git 설정 & 업로드

> 터미널(CMD 또는 PowerShell)에서 아래 명령어 순서대로 실행

```bash
# 1. 프로젝트 폴더로 이동 (다운로드한 폴더 경로로 변경)
cd C:\Users\내이름\Downloads\pallet-dashboard

# 2. Git 초기화
git init

# 3. 모든 파일 스테이징
git add .

# 4. 첫 커밋
git commit -m "🚀 PalletOS 최초 배포"

# 5. main 브랜치로 설정
git branch -M main

# 6. GitHub 저장소 연결 (YOUR_USERNAME 부분을 본인 깃허브 아이디로 변경)
git remote add origin https://github.com/YOUR_USERNAME/pallet-dashboard.git

# 7. 업로드 (push)
git push -u origin main
```

---

## ✅ STEP 3 — GitHub Pages 활성화

1. GitHub 저장소 페이지 → **Settings** 탭 클릭
2. 왼쪽 메뉴 → **Pages** 클릭
3. **Source** 항목에서 **"GitHub Actions"** 선택
4. 저장

---

## ✅ STEP 4 — 자동 배포 확인

1. 저장소 상단 **Actions** 탭 클릭
2. "Deploy to GitHub Pages" 워크플로우 실행 확인
3. ✅ 초록색 체크 뜨면 배포 완료!

---

## 🌐 배포 완료 후 URL

```
https://YOUR_USERNAME.github.io/pallet-dashboard/
```
예시: https://kim-manager.github.io/pallet-dashboard/

---

## 🔄 코드 수정 후 재배포 방법

```bash
git add .
git commit -m "✏️ 내용 수정"
git push
```
push하면 자동으로 2~3분 내 재배포됩니다.

---

## ❓ 자주 묻는 문제

| 문제 | 해결 |
|------|------|
| push 시 인증 오류 | GitHub → Settings → Developer settings → Personal access tokens 생성 |
| 배포 후 흰 화면 | vite.config.js의 base 값이 저장소 이름과 동일한지 확인 |
| Actions 탭에 워크플로우 없음 | .github/workflows/deploy.yml 파일이 있는지 확인 |
| 404 오류 | Pages 설정에서 Source를 "GitHub Actions"로 변경했는지 확인 |
