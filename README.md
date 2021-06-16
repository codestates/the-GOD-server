## 데이터 베이스

1. https://account.mongodb.com/account/login?signedOut=true
2. 계정 생성 후 아틀라스에서 Cluster 생성 ( shared cluster )
3. connect -> Connect using MongoDB Compass -> 사양에 맞게 Compass 설치 -> Compass 어플리케이션 실행
<img width="328" alt="스크린샷 2021-06-13 오후 2 13 04" src="https://user-images.githubusercontent.com/55736594/122238241-f1defa00-cefa-11eb-8a25-6c773fd6029b.png"><img width="400" alt="스크린샷 2021-06-13 오후 2 13 14" src="https://user-images.githubusercontent.com/55736594/122238332-028f7000-cefb-11eb-8c46-c20a7abae4a8.png">

4. Connection string 복사
<img width="400" alt="스크린샷 2021-05-25 오후 2 19 47" src="https://user-images.githubusercontent.com/55736594/119443267-48c23b00-bd64-11eb-8679-12bdc28820b6.png">


## VS Code

1. github로부터 코드를 클론 한 뒤, `yarn install`로 필요한 모듈 설치
2. .env파일 -> DATABASE_URL에 복사한 string 저장하기
3. `yarn mock` 실행하여 목데이터 저장
4. `yarn start` 실행하여 기능 확인
