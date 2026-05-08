import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    // 테스트 파일 간 DB 충돌 방지를 위해 순차 실행
    fileParallelism: false,
    env: {
      // 실제 DB 대신 별도 테스트 파일 사용 (test.db는 .gitignore에 추가)
      DB_PATH: './test.db',
    },
  },
});
