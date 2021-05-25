## 데이터 베이스

1. https://account.mongodb.com/account/login?signedOut=true
2. 계정 생성 후 아틀라스에서 Cluster 생성 ( shared cluster )
3. connect -> Connect using MongoDB Compass -> 사양에 맞게 Compass 설치 -> Compass 어플리케이션 실행
<img width="400" alt="스크린샷 2021-05-25 오후 1 39 44" src="https://user-images.githubusercontent.com/55736594/119443094-f08b3900-bd63-11eb-8475-20313cbb6f97.png">
<img width="400" alt="스크린샷 2021-05-25 오후 1 42 08" src="https://user-images.githubusercontent.com/55736594/119443112-f719b080-bd63-11eb-9fea-7902e0a5254e.png">

5. Connection string 복사
<img width="400" alt="스크린샷 2021-05-25 오후 2 19 47" src="https://user-images.githubusercontent.com/55736594/119443267-48c23b00-bd64-11eb-8679-12bdc28820b6.png">


## VS Code

1. github로부터 코드를 클론 한 뒤, yarn install로 필요한 모듈 설치
2. .env파일 -> DATABASE_URL에 복사한 string 저장하기
3. yarn mock 실행하여 목데이터 저장
4. yarn start 실행하여 기능 확인
