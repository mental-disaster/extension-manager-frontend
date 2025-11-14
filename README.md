# Extension Policy Frontend

파일 확장자 차단 정책을 관리하는 React 기반 프론트엔드 서비스입니다.
고정 확장자 차단 여부 설정과 사용자 지정 확장자 추가/삭제 기능을 제공합니다.



## 기술 스택
- Runtime: Node.js 22
- Framework: React 19
- Bundler / Dev Server: Vite 7
- Styling: Tailwind CSS 3
- Language: TypeScript



## 주요기능

고정 확장자 관리
 - exe, sh, bat 등 사전 정의된 확장자 목록 제공
 - 각 확장자에 대해 차단 여부 활성/비활성 설정

커스텀 확장자 관리
 - 사용자 커스텀 확장자 관리
 - 확장자 정규화(소문자, 선행 점 제거, 허용 문자 제한, 길이 20 이하)
 - 중복 방지
 - 최대 200개



## 실행 환경

- Node.js: 22.x (LTS 권장)
- npm: 10.x 이상 권장
- [백엔드 서버 Github Repo](https://github.com/mental-disaster/extension-manager-backend)

> 다른 Node 버전에서도 동작할 수 있으나,  
> 해당 프로젝트는 Node 22 기준으로 초기화/검증되었습니다.  
>
> 프론트엔드 프로젝트로 전체 서비스 구동에는 백엔드 서버가 필요합니다.



## 설치 및 구동 방법

1. **노드 모듈 설치**
```bash
npm i
```

2. **개발서버 실행**
```bash
npm run dev
```
