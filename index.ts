import MLCaptcha from "./src/generateCode";

// Phase 1 > 영어/숫자 6글자 (소,대문자), 줄겹침 1번
// Phase 2 > 영어/숫자/특문 8글자 (소,대문자), 줄겹침 1번
// Phase 3 > 영어/숫자/특문 8글자 (소,대문자), 줄겹침 2번

// generate instance
const captcha = new MLCaptcha(1);
for (let i = 0; i < 200; i++) {
  captcha.generateTextLineImage();
}
